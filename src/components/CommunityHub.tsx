import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { CommunityMessage } from '../types/trading';
import { 
  Flame, 
  Send, 
  ShieldCheck, 
  User as UserIcon, 
  Sparkles, 
  MessageSquare,
  Clock
} from 'lucide-react';

const SEED_MESSAGES: CommunityMessage[] = [
  {
    id: 'seed-1',
    userId: 'mentor-soni',
    userName: 'Soni (Head Mentor)',
    message: 'Good morning champions! Market is respecting the 24800 Put writing base. Watch 9:20 AM range breakout before entering. No FOMO.',
    isMentor: true,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'seed-2',
    userId: 'trader-vikram',
    userName: 'Vikram S.',
    message: 'Sir, booked +₹12,400 on Nifty 24900 CE Target 1! Thank you for the precise level.',
    isMentor: false,
    createdAt: new Date(Date.now() - 2400000).toISOString()
  },
  {
    id: 'seed-3',
    userId: 'mentor-soni',
    userName: 'Soni (Head Mentor)',
    message: 'Excellent discipline Vikram! Never forget to trail your stop loss to cost on the remaining lots.',
    isMentor: true,
    createdAt: new Date(Date.now() - 1200000).toISOString()
  }
];

export const CommunityHub: React.FC = () => {
  const { user, isGuest, isAdmin, isMentor } = useAuth();
  const [messages, setMessages] = useState<CommunityMessage[]>(SEED_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      setMessages(SEED_MESSAGES);
      return;
    }

    try {
      const path = 'community_messages';
      const q = query(collection(db, path), limit(50));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: CommunityMessage[] = snapshot.docs.map(d => ({
              id: d.id,
              ...(d.data() as Omit<CommunityMessage, 'id'>)
            }));
            fetched.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setMessages(fetched);
          } else {
            setMessages(SEED_MESSAGES);
          }
        },
        (err) => {
          console.warn('Community snapshot message:', err.message);
          setMessages(SEED_MESSAGES);
        }
      );
      return () => unsubscribe();
    } catch (_) {
      setMessages(SEED_MESSAGES);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSending(true);
    const newMsg = {
      userId: user ? user.uid : 'guest-trader',
      userName: user ? (user.displayName || user.email?.split('@')[0] || 'Trader') : 'Guest Trader',
      userAvatar: user?.photoURL || '',
      message: inputText.trim().slice(0, 500),
      isMentor: Boolean(isAdmin || isMentor),
      createdAt: new Date().toISOString()
    };

    if (user) {
      try {
        await addDoc(collection(db, 'community_messages'), newMsg);
      } catch (err) {
        console.error('Error posting message:', err);
        setMessages(prev => [...prev, { id: `msg-${Date.now()}`, ...newMsg }]);
      }
    } else {
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, ...newMsg }]);
    }

    setInputText('');
    setIsSending(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5 text-amber-400" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">VIP Community Trading Room</h2>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Q&A
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ask mentor Soni questions, share your journal reflections, and discuss live price action with fellow certified traders.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isMe = user ? msg.userId === user.uid : msg.userId === 'guest-trader';
            return (
              <div 
                key={msg.id}
                className={`flex items-start space-x-3 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                {msg.userAvatar ? (
                  <img 
                    src={msg.userAvatar} 
                    alt={msg.userName} 
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0" 
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.isMentor 
                      ? 'bg-amber-500 text-slate-950 font-black' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {msg.userName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-md ${
                  msg.isMentor
                    ? 'bg-amber-500/10 border border-amber-500/30 text-slate-100'
                    : isMe
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-slate-100'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-white text-[11px]">{msg.userName}</span>
                    {msg.isMentor && (
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        MENTOR
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Send Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question or trade analysis (max 500 chars)..."
            maxLength={500}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
