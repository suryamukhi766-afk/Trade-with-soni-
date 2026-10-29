import React, { useState } from 'react';
import { useDemoTrading } from '../context/DemoTradingContext';
import { INITIAL_TICKERS } from '../data/marketData';
import { MarketTicker, MarketSegment } from '../types/trading';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Layers, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  Plus, 
  Award,
  Sparkles
} from 'lucide-react';

export const PaperTradingTerminal: React.FC = () => {
  const { 
    balance, 
    initialBalance, 
    positions, 
    orderHistory, 
    realizedPnl, 
    unrealizedPnl, 
    usedMargin, 
    openPosition, 
    closePosition, 
    resetDemoAccount,
    notification,
    clearNotification
  } = useDemoTrading();

  // Order Ticket State
  const [selectedSymbol, setSelectedSymbol] = useState<string>(INITIAL_TICKERS[0].symbol);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [lots, setLots] = useState<number>(1);
  const [targetPts, setTargetPts] = useState<number>(40);
  const [stopLossPts, setStopLossPts] = useState<number>(20);

  const selectedTicker = INITIAL_TICKERS.find(t => t.symbol === selectedSymbol) || INITIAL_TICKERS[0];
  const lotSize = selectedTicker.lotSize || 1;
  const quantity = lots * lotSize;
  const executionPrice = selectedTicker.price;
  const marginRequired = executionPrice * quantity;

  const targetPrice = orderType === 'BUY' ? executionPrice + targetPts : executionPrice - targetPts;
  const stopLossPrice = orderType === 'BUY' ? executionPrice - stopLossPts : executionPrice + stopLossPts;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    openPosition({
      symbol: selectedTicker.symbol,
      segment: selectedTicker.segment,
      type: orderType,
      price: executionPrice,
      quantity,
      lotSize,
      targetPrice: targetPts > 0 ? Number(targetPrice.toFixed(2)) : undefined,
      stopLossPrice: stopLossPts > 0 ? Number(stopLossPrice.toFixed(2)) : undefined,
    });
  };

  const totalPortfolioValue = balance + usedMargin + unrealizedPnl;
  const totalReturn = totalPortfolioValue - initialBalance;
  const totalReturnPercent = ((totalReturn / initialBalance) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 bg-slate-900 border border-amber-500/40 rounded-xl flex items-center justify-between shadow-2xl text-xs text-amber-300 font-medium">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={clearNotification} className="text-slate-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Briefcase className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Virtual Paper Trading Simulator</h2>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              ₹10,00,000 Free Capital
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Test and practice Soni's price action setups with live tick movements and zero financial risk before risking real money in the market.
          </p>
        </div>

        <button
          onClick={resetDemoAccount}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all shrink-0 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo (₹10L)</span>
        </button>
      </div>

      {/* Capital & P&L Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Margin */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Available Cash</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">
            ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Used: ₹{usedMargin.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>

        {/* Live Running Unrealized MTM */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Live Running MTM</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${
            unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {unrealizedPnl >= 0 ? '+' : ''}₹{unrealizedPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{positions.length} Open Positions</span>
        </div>

        {/* Total Realized P&L */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Realized P&L</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${
            realizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {realizedPnl >= 0 ? '+' : ''}₹{realizedPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{orderHistory.length} Settled Orders</span>
        </div>

        {/* Total Account Net Worth */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Portfolio Value</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
            ₹{totalPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <span className={`text-[10px] font-mono font-bold ${Number(totalReturnPercent) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {Number(totalReturnPercent) >= 0 ? '+' : ''}{totalReturnPercent}% Overall
          </span>
        </div>
      </div>

      {/* Main Execution Terminal & Positions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Ticket Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Paper Order Ticket</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              SIMULATED NSE
            </span>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
            {/* Instrument Select */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Select Instrument</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-xs font-bold"
              >
                {INITIAL_TICKERS.map(t => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol} - ₹{t.price.toLocaleString('en-IN')} (Lot: {t.lotSize})
                  </option>
                ))}
              </select>
            </div>

            {/* Order Side: BUY or SELL */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('BUY')}
                className={`py-2.5 rounded-xl font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>BUY / LONG</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('SELL')}
                className={`py-2.5 rounded-xl font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
                  orderType === 'SELL'
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-[1.02]'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>SELL / SHORT</span>
              </button>
            </div>

            {/* Lots & Quick Quantity Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-400 font-medium">Lots: {lots} ({quantity} qty)</label>
                <span className="font-mono text-slate-500 text-[10px]">Lot Size: {lotSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {[1, 2, 5, 10].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setLots(n)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      lots === n 
                        ? 'bg-amber-500 text-slate-950 border-amber-500' 
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {n} Lot{n > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Target and Stop Loss points */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="block text-emerald-400 font-medium mb-1 font-sans">
                  Target (+pts)
                </label>
                <input
                  type="number"
                  value={targetPts}
                  onChange={e => setTargetPts(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="Points"
                />
                <span className="text-[10px] text-slate-500">Trigger: ₹{targetPrice.toFixed(1)}</span>
              </div>

              <div>
                <label className="block text-rose-400 font-medium mb-1 font-sans">
                  Stop Loss (-pts)
                </label>
                <input
                  type="number"
                  value={stopLossPts}
                  onChange={e => setStopLossPts(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-rose-400 font-bold focus:border-rose-500 focus:outline-none"
                  placeholder="Points"
                />
                <span className="text-[10px] text-slate-500">Trigger: ₹{stopLossPrice.toFixed(1)}</span>
              </div>
            </div>

            {/* Margin Calculation Box */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Execution Price:</span>
                <strong className="text-white">₹{executionPrice.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Margin Needed:</span>
                <strong className={marginRequired > balance ? 'text-rose-400' : 'text-slate-200'}>
                  ₹{marginRequired.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={marginRequired > balance}
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 ${
                orderType === 'BUY'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              } disabled:opacity-50`}
            >
              <span>Execute {orderType} Order</span>
            </button>
          </form>
        </div>

        {/* Active Positions Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Live Open Positions ({positions.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Real-time MTM</span>
            </div>

            {positions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">No open positions. Use the order ticket on the left to execute your first practice trade!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/70 overflow-x-auto mt-2">
                {positions.map((pos) => {
                  const diff = pos.type === 'BUY' ? pos.currentPrice - pos.entryPrice : pos.entryPrice - pos.currentPrice;
                  const pnl = Number((diff * pos.quantity).toFixed(2));
                  const pnlPct = ((diff / pos.entryPrice) * 100).toFixed(2);
                  const isProfit = pnl >= 0;

                  return (
                    <div key={pos.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            pos.type === 'BUY' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {pos.type}
                          </span>
                          <span className="font-bold text-white text-xs">{pos.symbol}</span>
                          <span className="text-[10px] font-mono text-slate-400">{pos.quantity} Qty</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 mt-1">
                          <span>Avg: <strong className="text-slate-200">₹{pos.entryPrice.toFixed(1)}</strong></span>
                          <span>LTP: <strong className="text-white">₹{pos.currentPrice.toFixed(1)}</strong></span>
                          {pos.targetPrice && <span className="text-emerald-400">T: ₹{pos.targetPrice}</span>}
                          {pos.stopLossPrice && <span className="text-rose-400">SL: ₹{pos.stopLossPrice}</span>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right font-mono">
                          <div className={`font-bold text-xs ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                          </div>
                          <div className={`text-[10px] ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ({isProfit ? '+' : ''}{pnlPct}%)
                          </div>
                        </div>

                        <button
                          onClick={() => closePosition(pos.id, pos.currentPrice, 'MANUAL')}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-[11px] font-bold active:scale-95 transition-all shrink-0"
                        >
                          Exit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Soni's Practice Rule */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            💡 <strong>Practice Goal:</strong> Achieve a minimum 65% win rate over 20 consecutive paper trades before trading with real capital.
          </div>
        </div>
      </div>

      {/* Completed Demo Order History */}
      {orderHistory.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Paper Trading Order History ({orderHistory.length})</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Settled simulated trades</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Side</th>
                  <th className="py-2.5 px-3">Qty</th>
                  <th className="py-2.5 px-3">Entry</th>
                  <th className="py-2.5 px-3">Exit</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orderHistory.map(ord => {
                  const isPositive = ord.pnl >= 0;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white">{ord.symbol}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          ord.type === 'BUY' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {ord.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{ord.quantity}</td>
                      <td className="py-2.5 px-3 text-slate-300">₹{ord.entryPrice.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-slate-300">₹{ord.exitPrice.toFixed(1)}</td>
                      <td className="py-2.5 px-3 font-sans text-[11px]">
                        {ord.exitReason === 'TARGET_HIT' ? (
                          <span className="text-emerald-400 font-bold">🎯 Target Hit</span>
                        ) : ord.exitReason === 'SL_HIT' ? (
                          <span className="text-rose-400 font-bold">🛑 Stop Loss</span>
                        ) : (
                          <span className="text-slate-400">Manual Exit</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}₹{ord.pnl.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                          <span className="text-[10px] ml-1">({isPositive ? '+' : ''}{ord.pnlPercent}%)</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
