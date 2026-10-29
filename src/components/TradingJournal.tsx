import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { JournalTrade } from '../types/trading';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Calendar, 
  Tag, 
  BarChart2, 
  FileSpreadsheet,
  Award,
  AlertCircle
} from 'lucide-react';

interface TradingJournalProps {
  initialTradeDraft?: Partial<JournalTrade> | null;
  onClearDraft?: () => void;
}

const LOCAL_STORAGE_KEY = 'tws_guest_journal_trades';

export const TradingJournal: React.FC<TradingJournalProps> = ({ initialTradeDraft, onClearDraft }) => {
  const { user, isGuest } = useAuth();
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');

  // Trade form fields
  const [symbol, setSymbol] = useState('NIFTY 24900 CE');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [segment, setSegment] = useState<'options' | 'equity' | 'futures' | 'crypto'>('options');
  const [entryPrice, setEntryPrice] = useState<number>(145);
  const [exitPrice, setExitPrice] = useState<number>(182);
  const [quantity, setQuantity] = useState<number>(75);
  const [status, setStatus] = useState<'OPEN' | 'CLOSED'>('CLOSED');
  const [strategy, setStrategy] = useState("Soni's 9:20 AM Setup");
  const [notes, setNotes] = useState('Followed 1% risk rule. Booked 80% at Target 1 and trailed stop to cost.');
  const [tradeDate, setTradeDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  // If a draft came from "Add to Journal" from signals or quick trade
  useEffect(() => {
    if (initialTradeDraft) {
      if (initialTradeDraft.symbol) setSymbol(initialTradeDraft.symbol);
      if (initialTradeDraft.tradeType) setTradeType(initialTradeDraft.tradeType);
      if (initialTradeDraft.entryPrice) setEntryPrice(initialTradeDraft.entryPrice);
      if (initialTradeDraft.quantity) setQuantity(initialTradeDraft.quantity);
      if (initialTradeDraft.strategy) setStrategy(initialTradeDraft.strategy);
      setShowAddModal(true);
      if (onClearDraft) onClearDraft();
    }
  }, [initialTradeDraft, onClearDraft]);

  // Load / Sync Trades
  useEffect(() => {
    if (user) {
      // Subcollection: /users/{userId}/trades
      const path = `users/${user.uid}/trades`;
      const unsubscribe = onSnapshot(
        collection(db, path),
        (snapshot) => {
          const loaded: JournalTrade[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<JournalTrade, 'id'>)
          }));
          setTrades(loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        },
        (err) => {
          console.warn('Journal snapshot error:', err);
          // Fall back to local storage
          loadLocal();
        }
      );
      return () => unsubscribe();
    } else {
      loadLocal();
    }
  }, [user]);

  const loadLocal = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setTrades(JSON.parse(stored));
      } else {
        // Initial sample trades
        const initialSample: JournalTrade[] = [
          {
            id: 'sample-1',
            symbol: 'NIFTY 24900 CE',
            tradeType: 'BUY',
            segment: 'options',
            entryPrice: 145,
            exitPrice: 180,
            quantity: 75,
            pnl: 2625,
            status: 'CLOSED',
            strategy: "Soni's 9:20 AM Setup",
            notes: 'Followed 15m breakout rule with strict stop loss.',
            tradeDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            userId: 'guest',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'sample-2',
            symbol: 'BANKNIFTY 52000 PE',
            tradeType: 'BUY',
            segment: 'options',
            entryPrice: 280,
            exitPrice: 345,
            quantity: 30,
            pnl: 1950,
            status: 'CLOSED',
            strategy: 'VWAP Trapping Setup',
            notes: 'High volume rejection at round number 52350.',
            tradeDate: new Date().toISOString().split('T')[0],
            userId: 'guest',
            createdAt: new Date().toISOString()
          }
        ];
        setTrades(initialSample);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSample));
      }
    } catch (_) {}
  };

  const calculatedPnl = useMemo(() => {
    if (status === 'OPEN') return 0;
    const diff = tradeType === 'BUY' ? (exitPrice - entryPrice) : (entryPrice - exitPrice);
    return Number((diff * quantity).toFixed(2));
  }, [entryPrice, exitPrice, quantity, tradeType, status]);

  const handleSaveTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const newTradeData = {
      symbol,
      tradeType,
      segment,
      entryPrice: Number(entryPrice),
      exitPrice: status === 'CLOSED' ? Number(exitPrice) : undefined,
      quantity: Number(quantity),
      pnl: calculatedPnl,
      status,
      strategy,
      notes,
      tradeDate,
      userId: user ? user.uid : 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (user) {
      try {
        const path = `users/${user.uid}/trades`;
        await addDoc(collection(db, path), newTradeData);
      } catch (err) {
        console.error('Error adding trade to firestore:', err);
        // Save locally
        const newLocal = [{ id: `trade-${Date.now()}`, ...newTradeData }, ...trades];
        setTrades(newLocal);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLocal));
      }
    } else {
      const newLocal = [{ id: `trade-${Date.now()}`, ...newTradeData }, ...trades];
      setTrades(newLocal);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLocal));
    }

    setIsSaving(false);
    setShowAddModal(false);
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (!window.confirm('Delete this trade entry?')) return;

    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/trades`, tradeId));
      } catch (err) {
        console.error('Error deleting trade:', err);
      }
    }
    const updated = trades.filter(t => t.id !== tradeId);
    setTrades(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Performance Analytics Metrics
  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);
  
  const totalNetPnl = closedTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const winRate = closedTrades.length > 0 ? ((winningTrades.length / closedTrades.length) * 100).toFixed(1) : '0';
  
  const grossProfit = winningTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + (t.pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? '∞' : '0.00');

  const filteredTrades = trades.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'open') return t.status === 'OPEN';
    if (filter === 'closed') return t.status === 'CLOSED';
    if (filter === 'winners') return (t.pnl || 0) > 0;
    if (filter === 'losers') return (t.pnl || 0) < 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total P&L Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Realized P&L</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${
            totalNetPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {totalNetPnl >= 0 ? '+' : ''}₹{totalNetPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">From {closedTrades.length} closed trades</span>
        </div>

        {/* Win Rate Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Accuracy / Win Rate</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-white">
            {winRate}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{winningTrades.length} Wins / {losingTrades.length} Losses</span>
        </div>

        {/* Profit Factor */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Profit Factor</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-cyan-400">
            {profitFactor}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Gross Gain / Loss</span>
        </div>

        {/* Total Logged Trades */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Logged Trades</span>
            <BarChart2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono mt-1 text-amber-400">
            {trades.length}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Cloud Synced</span>
        </div>
      </div>

      {/* Action Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'All Trades' },
            { id: 'winners', label: '🟢 Winners' },
            { id: 'losers', label: '🔴 Losses' },
            { id: 'open', label: '⏳ Open Positions' },
            { id: 'closed', label: '🏁 Settled' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Trade</span>
        </button>
      </div>

      {/* Trades List Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Date & Symbol</th>
                <th className="py-3 px-4">Side</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Entry</th>
                <th className="py-3 px-4">Exit</th>
                <th className="py-3 px-4">Strategy</th>
                <th className="py-3 px-4 text-right">Net P&L</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No trades found in this view. Click "Record Trade" to start logging!
                  </td>
                </tr>
              ) : (
                filteredTrades.map(trade => {
                  const isPositive = (trade.pnl || 0) >= 0;
                  return (
                    <tr key={trade.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs">{trade.symbol}</div>
                        <div className="text-[10px] text-slate-500">{trade.tradeDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          trade.tradeType === 'BUY' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {trade.tradeType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{trade.quantity}</td>
                      <td className="py-3 px-4 text-slate-300">₹{trade.entryPrice}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {trade.exitPrice ? `₹${trade.exitPrice}` : <span className="text-amber-400 font-sans text-[11px]">Open</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-sans text-xs max-w-[150px] truncate">
                        {trade.strategy || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {trade.status === 'CLOSED' ? (
                          <span className={`font-bold text-xs ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : ''}₹{trade.pnl?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-amber-400 text-[11px]">Running</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteTrade(trade.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete trade"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Trade Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Record Trading Journal Entry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Reflect on your executions, manage risk, and keep an unshakeable trade discipline.
            </p>

            <form onSubmit={handleSaveTrade} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Symbol / Strike</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    placeholder="e.g. NIFTY 24900 CE"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Segment</label>
                  <select
                    value={segment}
                    onChange={e => setSegment(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="options">Options</option>
                    <option value="equity">Equity</option>
                    <option value="futures">Futures</option>
                    <option value="crypto">Crypto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Side</label>
                  <select
                    value={tradeType}
                    onChange={e => setTradeType(e.target.value as 'BUY' | 'SELL')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Quantity / Lot</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'OPEN' | 'CLOSED')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="CLOSED">CLOSED</option>
                    <option value="OPEN">OPEN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Entry Price (₹)</label>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={e => setEntryPrice(Number(e.target.value))}
                    required
                    step="any"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Exit Price (₹)</label>
                  <input
                    type="number"
                    value={exitPrice}
                    onChange={e => setExitPrice(Number(e.target.value))}
                    step="any"
                    disabled={status === 'OPEN'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Real-time P&L Preview */}
              {status === 'CLOSED' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                  <span className="text-slate-400 text-xs">Calculated Realized P&L:</span>
                  <span className={`font-bold text-sm ${calculatedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculatedPnl >= 0 ? '+' : ''}₹{calculatedPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Strategy Setup</label>
                  <select
                    value={strategy}
                    onChange={e => setStrategy(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-sans"
                  >
                    <option value="Soni's 9:20 AM Setup">Soni's 9:20 AM Setup</option>
                    <option value="VWAP Trapping Setup">VWAP Trapping Setup</option>
                    <option value="Soni VIP Signal Follow">Soni VIP Signal</option>
                    <option value="Support & Resistance Retest">Support / Resistance Retest</option>
                    <option value="Expiry Hero-Zero">Expiry Hero-Zero</option>
                    <option value="Other Discretionary">Other Discretionary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Trade Date</label>
                  <input
                    type="date"
                    value={tradeDate}
                    onChange={e => setTradeDate(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Psychology & Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  placeholder="Did you follow your stop loss? Were you disciplined?"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wide"
                >
                  {isSaving ? 'Saving...' : 'Save Trade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
