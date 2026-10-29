import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoPosition, DemoOrderHistory, MarketSegment } from '../types/trading';

interface DemoTradingContextType {
  balance: number;
  initialBalance: number;
  positions: DemoPosition[];
  orderHistory: DemoOrderHistory[];
  realizedPnl: number;
  unrealizedPnl: number;
  usedMargin: number;
  openPosition: (order: {
    symbol: string;
    segment: MarketSegment;
    type: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    lotSize: number;
    targetPrice?: number;
    stopLossPrice?: number;
  }) => boolean;
  closePosition: (positionId: string, currentExitPrice?: number, reason?: 'MANUAL' | 'TARGET_HIT' | 'SL_HIT') => void;
  resetDemoAccount: () => void;
  updatePositionPrices: (symbol: string, currentPrice: number) => void;
  notification: string | null;
  clearNotification: () => void;
}

const DEMO_STORAGE_KEY = 'tws_demo_trading_state_v1';
const INITIAL_VIRTUAL_CAPITAL = 1000000; // ₹10,00,000 (10 Lakhs)

const DemoTradingContext = createContext<DemoTradingContextType | undefined>(undefined);

export const DemoTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.balance ?? INITIAL_VIRTUAL_CAPITAL;
      }
    } catch (_) {}
    return INITIAL_VIRTUAL_CAPITAL;
  });

  const [positions, setPositions] = useState<DemoPosition[]>(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.positions ?? [];
      }
    } catch (_) {}
    return [];
  });

  const [orderHistory, setOrderHistory] = useState<DemoOrderHistory[]>(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.orderHistory ?? [];
      }
    } catch (_) {}
    return [];
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        DEMO_STORAGE_KEY,
        JSON.stringify({ balance, positions, orderHistory })
      );
    } catch (_) {}
  }, [balance, positions, orderHistory]);

  const clearNotification = () => setNotification(null);

  // Calculate Used Margin
  const usedMargin = positions.reduce((acc, pos) => acc + pos.entryPrice * pos.quantity, 0);

  // Calculate Realized PnL
  const realizedPnl = orderHistory.reduce((acc, ord) => acc + ord.pnl, 0);

  // Calculate Unrealized PnL
  const unrealizedPnl = positions.reduce((acc, pos) => {
    const diff = pos.type === 'BUY' 
      ? pos.currentPrice - pos.entryPrice 
      : pos.entryPrice - pos.currentPrice;
    return acc + diff * pos.quantity;
  }, 0);

  const openPosition = (order: {
    symbol: string;
    segment: MarketSegment;
    type: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    lotSize: number;
    targetPrice?: number;
    stopLossPrice?: number;
  }): boolean => {
    const requiredMargin = order.price * order.quantity;

    if (requiredMargin > balance) {
      setNotification(`Insufficient Demo Funds! Required: ₹${requiredMargin.toLocaleString('en-IN')}, Available: ₹${balance.toLocaleString('en-IN')}`);
      return false;
    }

    const newPosition: DemoPosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      symbol: order.symbol,
      segment: order.segment,
      type: order.type,
      entryPrice: order.price,
      currentPrice: order.price,
      quantity: order.quantity,
      lotSize: order.lotSize,
      targetPrice: order.targetPrice,
      stopLossPrice: order.stopLossPrice,
      timestamp: new Date().toISOString(),
    };

    setBalance(prev => prev - requiredMargin);
    setPositions(prev => [newPosition, ...prev]);
    setNotification(`✅ Paper Order Executed: ${order.type} ${order.quantity} qty ${order.symbol} @ ₹${order.price}`);

    // Audio chime if enabled
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (_) {}

    return true;
  };

  const closePosition = (
    positionId: string, 
    currentExitPrice?: number, 
    reason: 'MANUAL' | 'TARGET_HIT' | 'SL_HIT' = 'MANUAL'
  ) => {
    const target = positions.find(p => p.id === positionId);
    if (!target) return;

    const exitPrice = currentExitPrice ?? target.currentPrice;
    const diff = target.type === 'BUY' 
      ? exitPrice - target.entryPrice 
      : target.entryPrice - exitPrice;
    const pnl = Number((diff * target.quantity).toFixed(2));
    const pnlPercent = Number(((diff / target.entryPrice) * 100).toFixed(2));
    const returnedCapital = (target.entryPrice * target.quantity) + pnl;

    const completedOrder: DemoOrderHistory = {
      id: `ord-${Date.now()}`,
      symbol: target.symbol,
      type: target.type,
      entryPrice: target.entryPrice,
      exitPrice: exitPrice,
      quantity: target.quantity,
      pnl: pnl,
      pnlPercent: pnlPercent,
      entryTime: target.timestamp,
      exitTime: new Date().toISOString(),
      exitReason: reason,
    };

    setPositions(prev => prev.filter(p => p.id !== positionId));
    setBalance(prev => Math.max(0, prev + returnedCapital));
    setOrderHistory(prev => [completedOrder, ...prev]);

    const reasonLabel = reason === 'TARGET_HIT' ? '🎯 Target Hit' : reason === 'SL_HIT' ? '🛑 Stop Loss Hit' : 'Squared Off';
    setNotification(`${reasonLabel}: ${target.symbol} ${pnl >= 0 ? '+' : ''}₹${pnl.toLocaleString('en-IN')} (${pnlPercent}%)`);
  };

  // Called during live market simulation ticks
  const updatePositionPrices = (symbol: string, currentPrice: number) => {
    setPositions(prev => {
      let hasChanges = false;
      const updated = prev.map(pos => {
        if (pos.symbol === symbol && pos.currentPrice !== currentPrice) {
          hasChanges = true;

          // Check if Target Hit
          if (pos.targetPrice) {
            const isTargetReached = pos.type === 'BUY' 
              ? currentPrice >= pos.targetPrice 
              : currentPrice <= pos.targetPrice;
            if (isTargetReached) {
              setTimeout(() => closePosition(pos.id, pos.targetPrice, 'TARGET_HIT'), 100);
            }
          }

          // Check if Stop Loss Hit
          if (pos.stopLossPrice) {
            const isSlReached = pos.type === 'BUY' 
              ? currentPrice <= pos.stopLossPrice 
              : currentPrice >= pos.stopLossPrice;
            if (isSlReached) {
              setTimeout(() => closePosition(pos.id, pos.stopLossPrice, 'SL_HIT'), 100);
            }
          }

          return { ...pos, currentPrice };
        }
        return pos;
      });
      return hasChanges ? updated : prev;
    });
  };

  const resetDemoAccount = () => {
    if (window.confirm('Are you sure you want to reset your Demo Account to ₹10,00,000? All virtual positions and history will be cleared.')) {
      setBalance(INITIAL_VIRTUAL_CAPITAL);
      setPositions([]);
      setOrderHistory([]);
      setNotification('🔄 Demo Account Reset to ₹10,00,000 Virtual Capital.');
    }
  };

  return (
    <DemoTradingContext.Provider
      value={{
        balance,
        initialBalance: INITIAL_VIRTUAL_CAPITAL,
        positions,
        orderHistory,
        realizedPnl,
        unrealizedPnl,
        usedMargin,
        openPosition,
        closePosition,
        resetDemoAccount,
        updatePositionPrices,
        notification,
        clearNotification,
      }}
    >
      {children}
    </DemoTradingContext.Provider>
  );
};

export const useDemoTrading = () => {
  const context = useContext(DemoTradingContext);
  if (!context) {
    throw new Error('useDemoTrading must be used within a DemoTradingProvider');
  }
  return context;
};
