import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Compass, 
  Activity, 
  HelpCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface StrikeData {
  strike: number;
  callOI: number;
  putOI: number;
  callChg: number;
  putChg: number;
  isATM?: boolean;
}

const MOCK_STRIKES: StrikeData[] = [
  { strike: 24700, callOI: 2.1, putOI: 6.8, callChg: -0.8, putChg: +2.1 },
  { strike: 24750, callOI: 3.4, putOI: 5.9, callChg: -0.4, putChg: +1.8 },
  { strike: 24800, callOI: 4.8, putOI: 8.4, callChg: -1.2, putChg: +3.2 },
  { strike: 24850, callOI: 5.2, putOI: 6.1, callChg: +0.2, putChg: +1.5, isATM: true },
  { strike: 24900, callOI: 9.6, putOI: 4.2, callChg: +2.4, putChg: -0.5 },
  { strike: 24950, callOI: 8.2, putOI: 2.8, callChg: +1.9, putChg: -0.2 },
  { strike: 25000, callOI: 14.2, putOI: 1.9, callChg: +4.8, putChg: -0.6 }
];

export const OptionChainRadar: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<'NIFTY' | 'BANKNIFTY'>('NIFTY');
  const [pcrValue, setPcrValue] = useState<number>(1.24);
  const [indiaVix, setIndiaVix] = useState<number>(13.65);
  const maxOI = Math.max(...MOCK_STRIKES.map(s => Math.max(s.callOI, s.putOI)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Open Interest (OI) & Sentiment Radar</h2>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Institutional Footprint
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Uncover where big institutions and option writers have built defensive walls. Track Put-Call Ratio (PCR) and Max Pain strikes.
          </p>
        </div>

        {/* Index Selector Switch */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => { setSelectedIndex('NIFTY'); setPcrValue(1.24); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedIndex === 'NIFTY' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            NIFTY 50
          </button>
          <button
            onClick={() => { setSelectedIndex('BANKNIFTY'); setPcrValue(1.12); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedIndex === 'BANKNIFTY' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            BANK NIFTY
          </button>
        </div>
      </div>

      {/* Top Gauges: PCR Meter, India VIX, Max Pain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PCR Meter Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Put-Call Ratio (PCR)</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-3 mt-2">
            <span className="text-3xl font-black font-mono text-emerald-400">{pcrValue}</span>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              BULLISH BIAS
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full"
              style={{ width: `${Math.min(100, (pcrValue / 1.8) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0.60 (Oversold)</span>
            <span>1.0 (Neutral)</span>
            <span>1.4+ (Overbought)</span>
          </div>
        </div>

        {/* India VIX Volatility Gauge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>India VIX (Fear Index)</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-3 mt-2">
            <span className="text-3xl font-black font-mono text-cyan-400">{indiaVix}</span>
            <span className="text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              OPTIMAL (CALM)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            VIX below 15 implies low option premiums and high probability for trending intraday expansions.
          </p>
        </div>

        {/* Max Pain Strike */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Institutional Max Pain</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-3 mt-2">
            <span className="text-3xl font-black font-mono text-amber-400">24,850</span>
            <span className="text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
              EXPIRY GRAVITY
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Option sellers face the least payout at 24850. Market tends to gravitate here by Thursday expiry 3:00 PM.
          </p>
        </div>
      </div>

      {/* Visual Strike-by-Strike Open Interest Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-white">Call OI vs Put OI Distribution</h3>
            <p className="text-xs text-slate-400">Green = Put Writing (Support), Red = Call Writing (Resistance)</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-sm bg-emerald-500"></span> Put OI (Support)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded-sm bg-rose-500"></span> Call OI (Resistance)
            </span>
          </div>
        </div>

        {/* Strike Bars */}
        <div className="space-y-3 font-mono text-xs">
          {MOCK_STRIKES.map(item => {
            const putWidthPct = (item.putOI / maxOI) * 45;
            const callWidthPct = (item.callOI / maxOI) * 45;

            return (
              <div 
                key={item.strike} 
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  item.isATM 
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                {/* Put Side (Support) */}
                <div className="flex-1 flex items-center justify-end space-x-2">
                  <span className="text-[11px] text-emerald-400 font-bold">{item.putOI}M</span>
                  <div className="w-40 bg-slate-900 h-3 rounded-full flex justify-end overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${putWidthPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Strike in Center */}
                <div className="w-24 text-center px-2 py-0.5 font-bold text-white tracking-wider">
                  <span className={item.isATM ? 'text-amber-400' : 'text-slate-200'}>
                    {item.strike}
                  </span>
                  {item.isATM && <span className="block text-[9px] text-amber-400 font-sans font-semibold">ATM</span>}
                </div>

                {/* Call Side (Resistance) */}
                <div className="flex-1 flex items-center justify-start space-x-2">
                  <div className="w-40 bg-slate-900 h-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${callWidthPct}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-rose-400 font-bold">{item.callOI}M</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Soni's Level Insights */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
          <strong className="text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Soni's Daily Technical Invariant:</span>
          </strong>
          <p className="leading-relaxed">
            Heavy Call writing at <strong>25000 (14.2M contracts)</strong> forms the primary ceiling for the session. Meanwhile, aggressive Put writing has shifted upwards to <strong>24800 (8.4M)</strong>, meaning any morning dip towards 24800 is a high-probability buy-the-dip zone!
          </p>
        </div>
      </div>
    </div>
  );
};
