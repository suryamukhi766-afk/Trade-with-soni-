import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Coins, 
  Percent, 
  ArrowRight,
  TrendingUp,
  Sliders
} from 'lucide-react';

interface InstrumentPreset {
  name: string;
  lotSize: number;
  defaultPrice: number;
}

const PRESETS: Record<string, InstrumentPreset> = {
  nifty: { name: 'NIFTY 50 Options', lotSize: 75, defaultPrice: 150 },
  banknifty: { name: 'BANK NIFTY Options', lotSize: 30, defaultPrice: 280 },
  finnifty: { name: 'FIN NIFTY Options', lotSize: 65, defaultPrice: 120 },
  midcpnifty: { name: 'MIDCP NIFTY Options', lotSize: 120, defaultPrice: 85 },
  equity: { name: 'Cash / Equity Stock', lotSize: 1, defaultPrice: 1500 },
  crypto: { name: 'Crypto / Forex', lotSize: 1, defaultPrice: 65000 },
};

export const PositionCalculator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('nifty');
  const [capital, setCapital] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(150);
  const [stopLossPrice, setStopLossPrice] = useState<number>(125);
  const [targetPrice, setTargetPrice] = useState<number>(200);

  const preset = PRESETS[selectedPreset] || PRESETS.nifty;

  const calculations = useMemo(() => {
    const maxRiskAmount = (capital * riskPercent) / 100;
    const pointsAtRisk = Math.abs(entryPrice - stopLossPrice);
    const pointsReward = Math.abs(targetPrice - entryPrice);

    let recommendedQty = 0;
    let recommendedLots = 0;
    let actualRiskAmount = 0;
    let expectedProfit = 0;
    let capitalRequired = 0;
    let rrRatio = '0:0';

    if (pointsAtRisk > 0) {
      const rawQty = maxRiskAmount / pointsAtRisk;
      if (preset.lotSize > 1) {
        recommendedLots = Math.max(1, Math.floor(rawQty / preset.lotSize));
        recommendedQty = recommendedLots * preset.lotSize;
      } else {
        recommendedQty = Math.max(1, Math.floor(rawQty));
        recommendedLots = recommendedQty;
      }

      actualRiskAmount = recommendedQty * pointsAtRisk;
      expectedProfit = recommendedQty * pointsReward;
      capitalRequired = recommendedQty * entryPrice;
      rrRatio = (pointsReward / pointsAtRisk).toFixed(2);
    }

    const isCapitalExceeded = capitalRequired > capital;
    const isRiskHealthy = pointsAtRisk > 0 && actualRiskAmount <= maxRiskAmount * 1.25;

    return {
      maxRiskAmount,
      pointsAtRisk,
      pointsReward,
      recommendedQty,
      recommendedLots,
      actualRiskAmount,
      expectedProfit,
      capitalRequired,
      rrRatio,
      isCapitalExceeded,
      isRiskHealthy
    };
  }, [capital, riskPercent, entryPrice, stopLossPrice, targetPrice, preset.lotSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Position Size & Risk Sizer</h2>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Zero Blowup Protection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Never risk more than your predefined tolerance. Calculate exact contract lots, capital requirement, and risk-to-reward ratio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Trade Parameters</span>
          </h3>

          {/* Instrument Preset Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Instrument</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PRESETS).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(key);
                    setEntryPrice(val.defaultPrice);
                    setStopLossPrice(val.defaultPrice * 0.85);
                    setTargetPrice(val.defaultPrice * 1.35);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPreset === key
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{val.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Lot: {val.lotSize}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Capital & Risk % */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Account Capital (₹)
              </label>
              <input
                type="number"
                value={capital}
                onChange={e => setCapital(Number(e.target.value))}
                step={5000}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Risk Per Trade (%)
              </label>
              <div className="flex items-center space-x-1">
                {[1, 1.5, 2, 3].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setRiskPercent(pct)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition-colors ${
                      riskPercent === pct
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Levels: Entry, SL, Target */}
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 font-sans">
                Entry Price (₹)
              </label>
              <input
                type="number"
                value={entryPrice}
                onChange={e => setEntryPrice(Number(e.target.value))}
                step="any"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-rose-400 mb-1 font-sans">
                Stop Loss (₹)
              </label>
              <input
                type="number"
                value={stopLossPrice}
                onChange={e => setStopLossPrice(Number(e.target.value))}
                step="any"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-rose-400 font-bold text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-emerald-400 mb-1 font-sans">
                Target 1 (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={e => setTargetPrice(Number(e.target.value))}
                step="any"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Price Distance Preview */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">Risk Distance: <strong className="text-rose-400">₹{calculations.pointsAtRisk.toFixed(2)} pts</strong></span>
            <span className="text-slate-400">Reward Distance: <strong className="text-emerald-400">₹{calculations.pointsReward.toFixed(2)} pts</strong></span>
          </div>
        </div>

        {/* Output Verdict Card (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Calculated Order Sizing</span>
              </h3>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                1:{calculations.rrRatio} R:R Ratio
              </span>
            </div>

            {/* Main Result Hero */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Recommended Size</span>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                  {calculations.recommendedLots} <span className="text-xs text-slate-400 font-sans font-normal">Lots</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  = {calculations.recommendedQty} Total Quantity
                </span>
              </div>

              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Max Cash at Risk</span>
                <div className="text-3xl font-black font-mono text-rose-400 mt-1">
                  ₹{calculations.actualRiskAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Target Max: ₹{calculations.maxRiskAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Financial Details Table */}
            <div className="mt-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-sans">Capital Required for Order:</span>
                <strong className={`text-slate-200 ${calculations.isCapitalExceeded ? 'text-rose-400' : ''}`}>
                  ₹{calculations.capitalRequired.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-sans">Expected Net Profit at Target:</span>
                <strong className="text-emerald-400">
                  +₹{calculations.expectedProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </strong>
              </div>
            </div>

            {/* Overleverage Warning */}
            {calculations.isCapitalExceeded && (
              <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-start space-x-2 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Warning:</strong> Required margin (₹{calculations.capitalRequired.toLocaleString('en-IN')}) exceeds total account capital! Reduce lots or select a closer stop loss.
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300/90 flex items-center space-x-2">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Soni's Golden Rule:</strong> Never average down a losing position. If the stop loss triggers, exit cleanly. Tomorrow brings new setups!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
