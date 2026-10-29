import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  Flame, 
  BookOpen, 
  Calculator, 
  BarChart3, 
  Radio, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Bell, 
  Clock, 
  User as UserIcon,
  Sparkles,
  Layers,
  Instagram,
  Briefcase
} from 'lucide-react';
import { INITIAL_TICKERS } from '../data/marketData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  activeSignalsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  activeSignalsCount
}) => {
  const { user, isGuest, signInWithGoogle, logout, loginAsGuest, isAdmin } = useAuth();
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to IST
      const istString = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setIstTime(istString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'terminal', label: 'Terminal', icon: BarChart3 },
    { id: 'paper', label: 'Demo Practice', icon: Briefcase, badge: '₹10L' },
    { id: 'signals', label: 'VIP Signals', icon: Radio, badge: activeSignalsCount > 0 ? activeSignalsCount : undefined },
    { id: 'journal', label: 'Trade Journal', icon: TrendingUp },
    { id: 'radar', label: 'OI & Option Radar', icon: Layers },
    { id: 'academy', label: 'Soni Academy', icon: BookOpen },
    { id: 'calculator', label: 'Risk Sizer', icon: Calculator },
    { id: 'community', label: 'Community', icon: Flame },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
      {/* Realtime Market Marquee Ticker */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 py-1.5 px-4 overflow-x-auto no-scrollbar flex items-center justify-between text-xs">
        <div className="flex items-center space-x-6 min-w-max">
          <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">LIVE NSE/BSE</span>
            <span className="text-slate-500 text-[10px]">IST: {istTime}</span>
          </div>

          <div className="flex items-center space-x-5">
            {INITIAL_TICKERS.map((ticker) => {
              const isPositive = ticker.change >= 0;
              return (
                <div key={ticker.symbol} className="flex items-center space-x-1.5 font-mono">
                  <span className="font-semibold text-slate-300 text-[11px]">{ticker.symbol}</span>
                  <span className="text-slate-100 text-[11px]">₹{ticker.price.toLocaleString('en-IN')}</span>
                  <span className={`text-[10px] font-semibold flex items-center ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '+' : ''}{ticker.changePercent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3 pl-4 text-[11px] text-amber-400 font-medium shrink-0">
          <a
            href="https://instagram.com/tradewithsoni_777"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-500/40 text-pink-300 hover:text-white hover:border-pink-500/80 transition-all font-semibold"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>@tradewithsoni_777</span>
          </a>
          <div className="flex items-center space-x-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Soni's Accuracy: <strong className="text-amber-400">91.4%</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('terminal')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative group-hover:scale-105 transition-transform">
              <img 
                src="/src/assets/images/trade_with_soni_icon_1793208658167.jpg" 
                alt="Trade with Soni Logo" 
                className="w-10 h-10 rounded-xl shadow-lg shadow-amber-500/20 border border-amber-500/40 object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 font-sans">
                  TRADE WITH SONI
                  <span className="inline-block bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded tracking-tight">
                    tradewithsoni.com
                  </span>
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 tracking-wider">
                <span className="hidden sm:inline">PRECISION SIGNALS & ACADEMY</span>
                <span className="hidden sm:inline">•</span>
                <a
                  href="https://instagram.com/tradewithsoni_777"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-pink-400 hover:text-pink-300 font-semibold inline-flex items-center gap-0.5 hover:underline"
                >
                  <Instagram className="w-2.5 h-2.5" />
                  <span>@tradewithsoni_777</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm shadow-emerald-500/10' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Controls & Audio */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Alert Sounds' : 'Enable Alert Sounds'}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                soundEnabled 
                  ? 'bg-slate-800 border-slate-700 text-amber-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
                    {user.displayName || user.email?.split('@')[0]}
                    {isAdmin && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 py-0.2 rounded font-mono font-semibold">
                        MENTOR
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>

                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full border border-amber-500/50 object-cover" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-amber-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-rose-950 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isGuest ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium">Guest Mode</span>
                </div>
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sync Google</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={loginAsGuest}
                  className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Browse Demo
                </button>
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
