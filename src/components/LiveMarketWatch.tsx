import React, { useState, useEffect, useMemo } from 'react';
import { MarketTicker, CandleData } from '../types/trading';
import { INITIAL_TICKERS, generateCandles } from '../data/marketData';
import { 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Pause, 
  RefreshCw, 
  Sliders, 
  Activity, 
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Instagram,
  Briefcase,
  X,
  DollarSign
} from 'lucide-react';
import { useDemoTrading } from '../context/DemoTradingContext';

interface LiveMarketWatchProps {
  onQuickTrade?: (ticker: MarketTicker, type: 'BUY' | 'SELL') => void;
}

export const LiveMarketWatch: React.FC<LiveMarketWatchProps> = ({ onQuickTrade }) => {
  const [tickers, setTickers] = useState<MarketTicker[]>(INITIAL_TICKERS);
  const [selectedTicker, setSelectedTicker] = useState<MarketTicker>(INITIAL_TICKERS[0]);
  const [timeframe, setTimeframe] = useState<string>('5m');
  const [candles, setCandles] = useState<CandleData[]>(() => generateCandles(INITIAL_TICKERS[0].price, 35));
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showVWAP, setShowVWAP] = useState<boolean>(true);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const { openPosition, updatePositionPrices } = useDemoTrading();
  const [quickOrderModal, setQuickOrderModal] = useState<{ 
    isOpen: boolean; 
    type: 'BUY' | 'SELL'; 
    lots: number; 
    targetPts: number; 
    stopLossPts: number; 
  } | null>(null);

  // When selected ticker changes, generate fresh history
  useEffect(() => {
    setCandles(generateCandles(selectedTicker.price, 35));
  }, [selectedTicker.symbol]);

  // Live simulation tick engine
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const delta = (Math.random() - 0.49) * (t.price * 0.001);
        const newPrice = Number((t.price + delta).toFixed(2));
        const newChange = Number((t.change + delta).toFixed(2));
        const newChangePercent = Number(((newChange / (t.price - t.change)) * 100).toFixed(2));
        
        // Feed live ticks to demo paper trading engine
        updatePositionPrices(t.symbol, newPrice);

        return {
          ...t,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          high24h: Math.max(t.high24h, newPrice),
          low24h: Math.min(t.low24h, newPrice)
        };
      }));

      // Update current selected candle close
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        const tickDelta = (Math.random() - 0.49) * (last.close * 0.0008);
        const nextClose = Number((last.close + tickDelta).toFixed(2));
        last.close = nextClose;
        last.high = Math.max(last.high, nextClose);
        last.low = Math.min(last.low, nextClose);
        last.volume += Math.floor(Math.random() * 25 + 5);
        return [...prev.slice(0, -1), last];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Keep selectedTicker in sync with updated prices
  const currentTicker = useMemo(() => {
    return tickers.find(t => t.symbol === selectedTicker.symbol) || selectedTicker;
  }, [tickers, selectedTicker.symbol]);

  // SVG Chart Dimensions & Math
  const chartWidth = 720;
  const chartHeight = 340;
  const padding = { top: 20, right: 65, bottom: 40, left: 10 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const minPrice = useMemo(() => Math.min(...candles.map(c => c.low)) * 0.999, [candles]);
  const maxPrice = useMemo(() => Math.max(...candles.map(c => c.high)) * 1.001, [candles]);
  const maxVolume = useMemo(() => Math.max(...candles.map(c => c.volume)), [candles]);

  const getY = (val: number) => {
    return padding.top + plotHeight - ((val - minPrice) / (maxPrice - minPrice || 1)) * plotHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / (candles.length - 1 || 1)) * plotWidth;
  };

  // EMA Calculations
  const ema9 = useMemo(() => {
    const k = 2 / (9 + 1);
    let prev = candles[0]?.close || 0;
    return candles.map(c => {
      prev = c.close * k + prev * (1 - k);
      return prev;
    });
  }, [candles]);

  const vwapLine = useMemo(() => {
    let cumVol = 0;
    let cumVolPrice = 0;
    return candles.map(c => {
      const typical = (c.high + c.low + c.close) / 3;
      cumVolPrice += typical * c.volume;
      cumVol += c.volume;
      return cumVol === 0 ? c.close : cumVolPrice / cumVol;
    });
  }, [candles]);

  const activeDisplayCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div className="space-y-4">
      {/* Top Bar for Selected Instrument */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-amber-400 text-lg">
              {currentTicker.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-xl font-black text-white tracking-tight">{currentTicker.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase font-mono">
                  {currentTicker.segment}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">{currentTicker.name}</span>
                <a
                  href="https://instagram.com/tradewithsoni_777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-pink-400 hover:text-pink-300 font-semibold bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full hover:border-pink-500/50 transition-colors"
                >
                  <Instagram className="w-3 h-3 text-pink-400" />
                  <span>@tradewithsoni_777</span>
                </a>
              </div>
              <div className="flex items-center space-x-4 mt-1 font-mono text-xs">
                <span className="text-slate-400">Lot: <strong className="text-slate-200">{currentTicker.lotSize}</strong></span>
                <span className="text-slate-400">24h High: <strong className="text-emerald-400">₹{currentTicker.high24h.toLocaleString('en-IN')}</strong></span>
                <span className="text-slate-400">24h Low: <strong className="text-rose-400">₹{currentTicker.low24h.toLocaleString('en-IN')}</strong></span>
                <span className="text-slate-400">Vol: <strong className="text-slate-200">{currentTicker.volume}</strong></span>
              </div>
            </div>
          </div>

          {/* Current Live Price & Actions */}
          <div className="flex items-center justify-between lg:justify-end space-x-4">
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-white tracking-tight">
                ₹{currentTicker.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-xs font-bold font-mono flex items-center justify-end space-x-1 ${
                currentTicker.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {currentTicker.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{currentTicker.change >= 0 ? '+' : ''}{currentTicker.change.toFixed(2)}</span>
                <span>({currentTicker.changePercent >= 0 ? '+' : ''}{currentTicker.changePercent}%)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuickOrderModal({ 
                  isOpen: true, 
                  type: 'BUY', 
                  lots: 1, 
                  targetPts: currentTicker.segment === 'options' ? 30 : 25, 
                  stopLossPts: currentTicker.segment === 'options' ? 15 : 12 
                })}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center space-x-1"
              >
                <span>BUY / CALL</span>
              </button>
              <button
                onClick={() => setQuickOrderModal({ 
                  isOpen: true, 
                  type: 'SELL', 
                  lots: 1, 
                  targetPts: currentTicker.segment === 'options' ? 30 : 25, 
                  stopLossPts: currentTicker.segment === 'options' ? 15 : 12 
                })}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center space-x-1"
              >
                <span>SELL / PUT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chart Column (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2 text-xs">
              {/* Timeframe Selectors */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['1m', '5m', '15m', '1h', '1D'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      timeframe === tf
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Indicator Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEMA(!showEMA)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-mono font-medium transition-colors ${
                    showEMA 
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  EMA 9 (Cyan)
                </button>
                <button
                  onClick={() => setShowVWAP(!showVWAP)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-mono font-medium transition-colors ${
                    showVWAP 
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  VWAP (Gold)
                </button>
                <button
                  onClick={() => setIsLiveSimulating(!isLiveSimulating)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                    isLiveSimulating 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {isLiveSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isLiveSimulating ? 'Live Feed' : 'Paused'}</span>
                </button>
              </div>
            </div>

            {/* Candle OHLC Hover Bar */}
            {activeDisplayCandle && (
              <div className="flex flex-wrap items-center space-x-4 py-2 font-mono text-xs text-slate-400 border-b border-slate-800/60">
                <span>Time: <strong className="text-slate-200">{activeDisplayCandle.time}</strong></span>
                <span>O: <strong className="text-slate-200">₹{activeDisplayCandle.open}</strong></span>
                <span>H: <strong className="text-emerald-400">₹{activeDisplayCandle.high}</strong></span>
                <span>L: <strong className="text-rose-400">₹{activeDisplayCandle.low}</strong></span>
                <span>C: <strong className={activeDisplayCandle.close >= activeDisplayCandle.open ? 'text-emerald-400' : 'text-rose-400'}>₹{activeDisplayCandle.close}</strong></span>
                <span>Vol: <strong className="text-amber-300">{activeDisplayCandle.volume.toLocaleString()}</strong></span>
              </div>
            )}

            {/* SVG Candlestick Chart */}
            <div className="relative w-full overflow-hidden mt-2">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-auto bg-slate-950/60 rounded-xl select-none"
                onMouseLeave={() => setHoveredCandle(null)}
              >
                {/* Horizontal Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                  const y = padding.top + plotHeight * pct;
                  const priceLabel = (maxPrice - pct * (maxPrice - minPrice)).toFixed(2);
                  return (
                    <g key={idx}>
                      <line 
                        x1={padding.left} 
                        y1={y} 
                        x2={chartWidth - padding.right} 
                        y2={y} 
                        stroke="#334155" 
                        strokeDasharray="3 3" 
                        strokeWidth="0.75" 
                      />
                      <text 
                        x={chartWidth - padding.right + 6} 
                        y={y + 3} 
                        fill="#64748b" 
                        fontSize="9" 
                        fontFamily="monospace"
                      >
                        ₹{priceLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Bars */}
                {candles.map((c, i) => {
                  const x = getX(i);
                  const isUp = c.close >= c.open;
                  const volHeight = (c.volume / (maxVolume || 1)) * 50;
                  const barWidth = Math.max(3, plotWidth / candles.length * 0.7);
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - barWidth / 2}
                      y={chartHeight - padding.bottom - volHeight}
                      width={barWidth}
                      height={volHeight}
                      fill={isUp ? '#10b981' : '#f43f5e'}
                      opacity="0.25"
                    />
                  );
                })}

                {/* EMA 9 Line */}
                {showEMA && (
                  <path
                    d={ema9.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                )}

                {/* VWAP Line */}
                {showVWAP && (
                  <path
                    d={vwapLine.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    opacity="0.9"
                  />
                )}

                {/* Candlesticks */}
                {candles.map((c, i) => {
                  const x = getX(i);
                  const isUp = c.close >= c.open;
                  const openY = getY(c.open);
                  const closeY = getY(c.close);
                  const highY = getY(c.high);
                  const lowY = getY(c.low);
                  const topY = Math.min(openY, closeY);
                  const bodyHeight = Math.max(2, Math.abs(openY - closeY));
                  const barWidth = Math.max(4, plotWidth / candles.length * 0.7);

                  return (
                    <g 
                      key={`candle-${i}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredCandle(c)}
                    >
                      {/* High-Low Wick */}
                      <line
                        x1={x}
                        y1={highY}
                        x2={x}
                        y2={lowY}
                        stroke={isUp ? '#10b981' : '#f43f5e'}
                        strokeWidth="1.25"
                      />
                      {/* Real Body */}
                      <rect
                        x={x - barWidth / 2}
                        y={topY}
                        width={barWidth}
                        height={bodyHeight}
                        fill={isUp ? '#10b981' : '#f43f5e'}
                        rx="1"
                      />
                    </g>
                  );
                })}

                {/* Current Price Marker line */}
                <line
                  x1={padding.left}
                  y1={getY(currentTicker.price)}
                  x2={chartWidth - padding.right}
                  y2={getY(currentTicker.price)}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <rect
                  x={chartWidth - padding.right}
                  y={getY(currentTicker.price) - 8}
                  width="60"
                  height="16"
                  fill="#10b981"
                  rx="3"
                />
                <text
                  x={chartWidth - padding.right + 4}
                  y={getY(currentTicker.price) + 3}
                  fill="#020617"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  ₹{currentTicker.price.toFixed(1)}
                </text>
              </svg>
            </div>

            {/* Soni's Technical Verdict */}
            <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-bold text-white">Soni's Live Trend Meter:</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  STRONG BULLISH MOMENTUM
                </span>
              </div>
              <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
                Above VWAP + 9 EMA Crossover Confirmed
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Column (1 col) */}
        <div className="space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>HOT WATCHLIST</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">8 ASSETS</span>
            </div>

            <div className="divide-y divide-slate-800/60 mt-2">
              {tickers.map((ticker) => {
                const isSelected = ticker.symbol === selectedTicker.symbol;
                const isPositive = ticker.change >= 0;
                return (
                  <div
                    key={ticker.symbol}
                    onClick={() => setSelectedTicker(ticker)}
                    className={`py-2.5 px-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-slate-800/90 border border-amber-500/30' 
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-white">{ticker.symbol}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{ticker.segment}</span>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-slate-100">
                        ₹{ticker.price.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                      </div>
                      <div className={`text-[10px] font-semibold flex items-center justify-end ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isPositive ? '+' : ''}{ticker.changePercent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Mentor Soni's Rule</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Never enter without a predefined Stop Loss. Risk only 1-2% per trade. If market is chop-range, preserve capital for trend days!"
            </p>
          </div>
        </div>
      </div>

      {/* Quick Order Practice / Journal Modal */}
      {quickOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${
                  quickOrderModal.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {quickOrderModal.type}
                </span>
                <h3 className="font-extrabold text-sm text-white">{currentTicker.symbol}</h3>
              </div>
              <button
                onClick={() => setQuickOrderModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                <span className="text-slate-400">Current Market Price:</span>
                <strong className="text-white">₹{currentTicker.price.toFixed(2)}</strong>
              </div>

              {/* Lots selector */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Lots: <strong>{quickOrderModal.lots}</strong> ({quickOrderModal.lots * currentTicker.lotSize} qty)</span>
                  <span className="font-mono text-slate-500 text-[10px]">Lot Size: {currentTicker.lotSize}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono">
                  {[1, 2, 5, 10].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuickOrderModal({ ...quickOrderModal, lots: n })}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        quickOrderModal.lots === n 
                          ? 'bg-amber-500 text-slate-950 border-amber-500' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {n} Lot{n > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target & SL Points */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-emerald-400 font-medium mb-1 font-sans">Target (+pts)</label>
                  <input
                    type="number"
                    value={quickOrderModal.targetPts}
                    onChange={e => setQuickOrderModal({ ...quickOrderModal, targetPts: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-rose-400 font-medium mb-1 font-sans">Stop Loss (-pts)</label>
                  <input
                    type="number"
                    value={quickOrderModal.stopLossPts}
                    onChange={e => setQuickOrderModal({ ...quickOrderModal, stopLossPts: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-400 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between font-mono">
                <span className="text-slate-400">Virtual Margin Required:</span>
                <strong className="text-amber-400">
                  ₹{(quickOrderModal.lots * currentTicker.lotSize * currentTicker.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </strong>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    openPosition({
                      symbol: currentTicker.symbol,
                      segment: currentTicker.segment,
                      type: quickOrderModal.type,
                      price: currentTicker.price,
                      quantity: quickOrderModal.lots * currentTicker.lotSize,
                      lotSize: currentTicker.lotSize,
                      targetPrice: quickOrderModal.targetPts > 0 
                        ? (quickOrderModal.type === 'BUY' ? currentTicker.price + quickOrderModal.targetPts : currentTicker.price - quickOrderModal.targetPts)
                        : undefined,
                      stopLossPrice: quickOrderModal.stopLossPts > 0 
                        ? (quickOrderModal.type === 'BUY' ? currentTicker.price - quickOrderModal.stopLossPts : currentTicker.price + quickOrderModal.stopLossPts)
                        : undefined,
                    });
                    setQuickOrderModal(null);
                  }}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-xl transition-all active:scale-95 ${
                    quickOrderModal.type === 'BUY' 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20' 
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Execute Paper Trade (Demo ₹10L)</span>
                </button>

                <button
                  onClick={() => {
                    if (onQuickTrade) {
                      onQuickTrade(currentTicker, quickOrderModal.type);
                    }
                    setQuickOrderModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Log to Personal Trade Journal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
