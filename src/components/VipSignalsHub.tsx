import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { TradingSignal, MarketSegment, SignalStatus } from '../types/trading';
import { SEED_SIGNALS } from '../data/marketData';
import { 
  Radio, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Filter, 
  Share2, 
  BookmarkPlus, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Volume2
} from 'lucide-react';

interface VipSignalsHubProps {
  onImportToJournal?: (signal: TradingSignal) => void;
  soundEnabled: boolean;
}

export const VipSignalsHub: React.FC<VipSignalsHubProps> = ({ onImportToJournal, soundEnabled }) => {
  const { user, isAdmin } = useAuth();
  const [signals, setSignals] = useState<TradingSignal[]>(SEED_SIGNALS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state for creating new signal
  const [newSymbol, setNewSymbol] = useState('NIFTY 24950 CE');
  const [newTitle, setNewTitle] = useState('NIFTY 24950 CE Breakout Call');
  const [newSegment, setNewSegment] = useState<MarketSegment>('options');
  const [newType, setNewType] = useState<'BUY' | 'SELL'>('BUY');
  const [newEntryMin, setNewEntryMin] = useState<number>(140);
  const [newEntryMax, setNewEntryMax] = useState<number>(145);
  const [newTarget1, setNewTarget1] = useState<number>(175);
  const [newTarget2, setNewTarget2] = useState<number>(210);
  const [newTarget3, setNewTarget3] = useState<number>(250);
  const [newStopLoss, setNewStopLoss] = useState<number>(115);
  const [newNotes, setNewNotes] = useState('OI unwinding + 5-min candle closing above VWAP.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Firestore real-time listener for signals
  useEffect(() => {
    // Only query Firestore if authenticated or initialized
    if (!user) {
      setSignals(SEED_SIGNALS);
      return;
    }

    const path = 'signals';
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedSignals: TradingSignal[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<TradingSignal, 'id'>)
          }));
          setSignals(fetchedSignals);
        } else {
          // If no records in firestore yet, keep seed signals
          setSignals(SEED_SIGNALS);
        }
      },
      (error) => {
        console.warn('Firestore signals listener notice:', error.message);
        // Fallback to seed signals if permissions not yet open
        setSignals(SEED_SIGNALS);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleCreateSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to post signals.');
      return;
    }

    setIsSubmitting(true);
    const signalData = {
      title: newTitle,
      symbol: newSymbol,
      segment: newSegment,
      type: newType,
      entryMin: Number(newEntryMin),
      entryMax: Number(newEntryMax),
      target1: Number(newTarget1),
      target2: Number(newTarget2),
      target3: Number(newTarget3),
      stopLoss: Number(newStopLoss),
      currentPrice: Number(newEntryMin),
      status: 'ACTIVE' as SignalStatus,
      notes: newNotes,
      authorId: user.uid,
      authorName: user.displayName || 'Soni (Mentor)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'signals'), signalData);
      setShowPostModal(false);
      // Play audio notification if enabled
      if (soundEnabled && typeof Audio !== 'undefined') {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (_) {}
      }
    } catch (err) {
      console.error('Failed to post signal:', err);
      // Also update local list for immediate preview if in demo/rules review
      setSignals(prev => [{ id: `sig-${Date.now()}`, ...signalData }, ...prev]);
      setShowPostModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (signalId: string, newStatus: SignalStatus) => {
    try {
      await updateDoc(doc(db, 'signals', signalId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      // Local fallback
      setSignals(prev => prev.map(s => s.id === signalId ? { ...s, status: newStatus } : s));
    }
  };

  const handleShare = (signal: TradingSignal) => {
    const text = `🚨 Trade with Soni VIP Signal 🚨\nSymbol: ${signal.symbol} (${signal.type})\nEntry: ₹${signal.entryMin} - ₹${signal.entryMax || signal.entryMin}\nTargets: T1 ₹${signal.target1} | T2 ₹${signal.target2 || '-'} | T3 ₹${signal.target3 || '-'}\nStop Loss: ₹${signal.stopLoss}\nStatus: ${signal.status}\nTrade disciplined!`;
    navigator.clipboard?.writeText(text);
    setCopiedId(signal.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredSignals = signals.filter(sig => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return sig.status === 'ACTIVE';
    if (activeFilter === 'targets') return sig.status.includes('TARGET');
    return sig.segment === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Soni's VIP Trading Signals</h2>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Realtime high-conviction Index Options, Intraday Breakouts, and Swing setups curated with multi-timeframe price action confluence.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post VIP Call</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'all', label: 'All Signals' },
          { id: 'active', label: '🔥 Active Now' },
          { id: 'targets', label: '🎯 Targets Hit' },
          { id: 'options', label: 'Options Buying' },
          { id: 'equity', label: 'Equity Intraday' },
          { id: 'futures', label: 'Futures' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeFilter === filter.id 
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSignals.map((signal) => {
          const isBuy = signal.type === 'BUY';
          const isTargetHit = signal.status.includes('TARGET');
          const isSlHit = signal.status === 'SL_HIT';
          const isClosed = signal.status === 'CLOSED';

          // Risk to Reward ratio
          const risk = Math.abs(signal.entryMin - signal.stopLoss);
          const reward1 = Math.abs(signal.target1 - signal.entryMin);
          const rrRatio = risk > 0 ? (reward1 / risk).toFixed(1) : '1:2';

          return (
            <div
              key={signal.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between ${
                isTargetHit 
                  ? 'border-emerald-500/40 hover:border-emerald-500/70' 
                  : isSlHit 
                  ? 'border-rose-500/40 hover:border-rose-500/70' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Status Header Bar */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center space-x-1 ${
                      isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isBuy ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{signal.type}</span>
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase">
                      {signal.segment}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {signal.status === 'ACTIVE' && (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span>LIVE / ACTIVE</span>
                      </span>
                    )}
                    {isTargetHit && (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{signal.status.replace(/_/g, ' ')}</span>
                      </span>
                    )}
                    {isSlHit && (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/40 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>STOP LOSS HIT</span>
                      </span>
                    )}
                    {isClosed && (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        TRADE CLOSED
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Symbol */}
                <div className="mt-3">
                  <h3 className="font-extrabold text-base text-white tracking-tight">{signal.symbol}</h3>
                  {signal.title && signal.title !== signal.symbol && (
                    <p className="text-xs text-slate-400 mt-0.5">{signal.title}</p>
                  )}
                </div>

                {/* Key Price Levels Matrix */}
                <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Entry Zone</span>
                    <strong className="text-xs text-slate-200">
                      ₹{signal.entryMin}{signal.entryMax ? ` - ${signal.entryMax}` : ''}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block uppercase">Target 1</span>
                    <strong className="text-xs text-emerald-400">₹{signal.target1}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-400 block uppercase">Stop Loss</span>
                    <strong className="text-xs text-rose-400">₹{signal.stopLoss}</strong>
                  </div>
                </div>

                {/* Extended Targets & RR */}
                {(signal.target2 || signal.target3) && (
                  <div className="flex items-center justify-between text-[11px] font-mono mt-2 px-1 text-slate-400">
                    <div className="flex items-center space-x-3">
                      {signal.target2 && <span>T2: <strong className="text-emerald-400">₹{signal.target2}</strong></span>}
                      {signal.target3 && <span>T3: <strong className="text-emerald-300">₹{signal.target3}</strong></span>}
                    </div>
                    <span className="text-amber-400 font-semibold">1:{rrRatio} R:R</span>
                  </div>
                )}

                {/* Soni's Commentary */}
                {signal.notes && (
                  <p className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800/80 mt-3 italic leading-relaxed">
                    "{signal.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Actions & Mentor Admin Controls */}
              <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500">
                  By <strong className="text-slate-300">{signal.authorName || 'Soni'}</strong>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleShare(signal)}
                    title="Copy Signal Details"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {copiedId === signal.id && (
                    <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                  )}

                  {onImportToJournal && (
                    <button
                      onClick={() => onImportToJournal(signal)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold border border-slate-700 transition-colors"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Add to Journal</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Quick Status Override Bar */}
              {isAdmin && (
                <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-amber-400 font-mono">Mentor Controls:</span>
                  <button
                    onClick={() => handleUpdateStatus(signal.id, 'TARGET_1_HIT')}
                    className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold hover:bg-emerald-900"
                  >
                    T1 Hit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(signal.id, 'TARGET_2_HIT')}
                    className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold hover:bg-emerald-900"
                  >
                    T2 Hit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(signal.id, 'SL_HIT')}
                    className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold hover:bg-rose-900"
                  >
                    SL Hit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(signal.id, 'CLOSED')}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Post Signal Modal for Admin / Soni */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Broadcast New VIP Call</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              This signal will instantly broadcast to all subscribed community traders via Firestore.
            </p>

            <form onSubmit={handleCreateSignal} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Symbol / Strike</label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    placeholder="e.g. BANKNIFTY 52000 PE"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Segment</label>
                  <select
                    value={newSegment}
                    onChange={(e) => setNewSegment(e.target.value as MarketSegment)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="options">Options</option>
                    <option value="equity">Equity Intraday</option>
                    <option value="futures">Futures</option>
                    <option value="crypto">Crypto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Call Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'BUY' | 'SELL')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="BUY">BUY / CALL</option>
                    <option value="SELL">SELL / PUT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Title / Tagline</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g. Expiry Momentum Breakout"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Entry Min (₹)</label>
                  <input
                    type="number"
                    value={newEntryMin}
                    onChange={(e) => setNewEntryMin(Number(e.target.value))}
                    required
                    step="any"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Entry Max (₹)</label>
                  <input
                    type="number"
                    value={newEntryMax}
                    onChange={(e) => setNewEntryMax(Number(e.target.value))}
                    step="any"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-emerald-400 font-medium mb-1">Target 1 (₹)</label>
                  <input
                    type="number"
                    value={newTarget1}
                    onChange={(e) => setNewTarget1(Number(e.target.value))}
                    required
                    step="any"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-medium mb-1">Target 2 (₹)</label>
                  <input
                    type="number"
                    value={newTarget2}
                    onChange={(e) => setNewTarget2(Number(e.target.value))}
                    step="any"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-rose-400 font-medium mb-1">Stop Loss (₹)</label>
                  <input
                    type="number"
                    value={newStopLoss}
                    onChange={(e) => setNewStopLoss(Number(e.target.value))}
                    required
                    step="any"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-rose-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Soni's Logic / Technical Rationale</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g. 15-min trendline breakout with surge in Call unwinding."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-wide"
                >
                  {isSubmitting ? 'Broadcasting...' : 'Publish Call Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
