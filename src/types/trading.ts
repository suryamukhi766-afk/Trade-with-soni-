export type MarketSegment = 'options' | 'equity' | 'futures' | 'crypto' | 'commodity';

export type SignalStatus = 'ACTIVE' | 'TARGET_1_HIT' | 'TARGET_2_HIT' | 'TARGET_3_HIT' | 'SL_HIT' | 'CLOSED';

export interface TradingSignal {
  id: string;
  title: string;
  symbol: string;
  segment: MarketSegment;
  type: 'BUY' | 'SELL';
  entryMin: number;
  entryMax?: number;
  target1: number;
  target2?: number;
  target3?: number;
  stopLoss: number;
  currentPrice?: number;
  status: SignalStatus;
  notes?: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface JournalTrade {
  id: string;
  symbol: string;
  tradeType: 'BUY' | 'SELL';
  segment: 'options' | 'equity' | 'futures' | 'crypto';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  status: 'OPEN' | 'CLOSED';
  strategy?: string;
  notes?: string;
  tradeDate: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  isMentor?: boolean;
  createdAt: string;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  segment: MarketSegment;
  lotSize: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyTakeaways: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CourseModule {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  lessons: CourseLesson[];
}

export interface DemoPosition {
  id: string;
  symbol: string;
  segment: MarketSegment;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  lotSize: number;
  targetPrice?: number;
  stopLossPrice?: number;
  timestamp: string;
}

export interface DemoOrderHistory {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  entryTime: string;
  exitTime: string;
  exitReason: 'MANUAL' | 'TARGET_HIT' | 'SL_HIT';
}
