import { MarketTicker, TradingSignal, CourseModule, CandleData } from '../types/trading';

export const INITIAL_TICKERS: MarketTicker[] = [
  {
    symbol: 'NIFTY 50',
    name: 'NIFTY 50 Index',
    price: 24865.40,
    change: +142.80,
    changePercent: +0.58,
    high24h: 24920.10,
    low24h: 24710.25,
    volume: '185.4M',
    segment: 'options',
    lotSize: 75
  },
  {
    symbol: 'BANKNIFTY',
    name: 'Nifty Bank Index',
    price: 52140.85,
    change: +385.20,
    changePercent: +0.74,
    high24h: 52350.00,
    low24h: 51820.40,
    volume: '94.2M',
    segment: 'options',
    lotSize: 30
  },
  {
    symbol: 'FINNIFTY',
    name: 'Nifty Financial Services',
    price: 23680.15,
    change: +98.40,
    changePercent: +0.42,
    high24h: 23740.00,
    low24h: 23550.00,
    volume: '42.1M',
    segment: 'options',
    lotSize: 65
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    price: 2985.50,
    change: +34.20,
    changePercent: +1.16,
    high24h: 2998.00,
    low24h: 2942.00,
    volume: '8.4M',
    segment: 'equity',
    lotSize: 250
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    price: 1682.30,
    change: +14.60,
    changePercent: +0.88,
    high24h: 1694.00,
    low24h: 1665.50,
    volume: '15.1M',
    segment: 'equity',
    lotSize: 550
  },
  {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd',
    price: 154.20,
    change: -1.35,
    changePercent: -0.87,
    high24h: 156.80,
    low24h: 153.10,
    volume: '34.8M',
    segment: 'equity',
    lotSize: 5500
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin Crypto',
    price: 68420.00,
    change: +1240.00,
    changePercent: +1.85,
    high24h: 69150.00,
    low24h: 66800.00,
    volume: '$28.4B',
    segment: 'crypto',
    lotSize: 1
  },
  {
    symbol: 'GOLD (MCX)',
    name: 'Gold Futures 10g',
    price: 78450.00,
    change: +260.00,
    changePercent: +0.33,
    high24h: 78620.00,
    low24h: 78100.00,
    volume: '14.2K',
    segment: 'commodity',
    lotSize: 1
  }
];

export const SEED_SIGNALS: TradingSignal[] = [
  {
    id: 'sig-001',
    title: 'NIFTY 24900 CE Expiry Momentum Breakout',
    symbol: 'NIFTY 24900 CE',
    segment: 'options',
    type: 'BUY',
    entryMin: 145,
    entryMax: 152,
    target1: 180,
    target2: 215,
    target3: 260,
    stopLoss: 120,
    currentPrice: 184,
    status: 'TARGET_1_HIT',
    notes: 'Massive Call unwinding at 24900 and VWAP bounce above day open. Trailing SL to Cost (145).',
    authorId: 'mentor-soni',
    authorName: 'Soni (Head Mentor)',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'sig-002',
    title: 'BANKNIFTY 52000 PE Reversal Setup',
    symbol: 'BANKNIFTY 52000 PE',
    segment: 'options',
    type: 'BUY',
    entryMin: 280,
    entryMax: 295,
    target1: 350,
    target2: 420,
    target3: 510,
    stopLoss: 235,
    currentPrice: 310,
    status: 'ACTIVE',
    notes: 'Resistance rejection at 52350 round level. Target 1 within reach. Strictly follow SL 235.',
    authorId: 'mentor-soni',
    authorName: 'Soni (Head Mentor)',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString()
  },
  {
    id: 'sig-003',
    title: 'RELIANCE Intraday Long - Triangle Breakout',
    symbol: 'RELIANCE',
    segment: 'equity',
    type: 'BUY',
    entryMin: 2975,
    entryMax: 2985,
    target1: 3015,
    target2: 3045,
    target3: 3080,
    stopLoss: 2950,
    currentPrice: 3020,
    status: 'TARGET_2_HIT',
    notes: 'High volume accumulation near 2975. Both Target 1 and 2 Achieved! Book partial profit and trail SL to 3000.',
    authorId: 'mentor-soni',
    authorName: 'Soni (Head Mentor)',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'sig-004',
    title: 'TATASTEEL Swing Setup - Pullback to 20 EMA',
    symbol: 'TATASTEEL',
    segment: 'equity',
    type: 'BUY',
    entryMin: 153.50,
    entryMax: 154.50,
    target1: 160,
    target2: 165,
    target3: 172,
    stopLoss: 149,
    currentPrice: 154.20,
    status: 'ACTIVE',
    notes: 'Daily timeframe cup & handle retest. Good risk-reward ratio 1:3 for 2-week swing hold.',
    authorId: 'mentor-soni',
    authorName: 'Soni (Head Mentor)',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const ACADEMY_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    title: 'Module 1: Pure Price Action & Candlestick Secrets',
    subtitle: 'Decode institutional footprints and supply-demand imbalances',
    iconName: 'CandlestickChart',
    badge: 'Core Foundation',
    lessons: [
      {
        id: 'les-1',
        title: 'Anatomy of Rejection Candles & Institutional Traps',
        duration: '22 mins',
        summary: 'Learn why classic retail chart patterns fail and how smart money hunts stop losses below key support.',
        keyTakeaways: [
          'Recognizing false breakouts (liquidity sweeps)',
          'Volume spread analysis on pin bars and engulfing candles',
          'Setting invalidation levels where institutional bias flips'
        ],
        difficulty: 'Beginner'
      },
      {
        id: 'les-2',
        title: 'Central Pivot Range (CPR) & Multi-Timeframe Confluence',
        duration: '28 mins',
        summary: 'Using CPR width to predict trending vs range-bound market days at 9:15 AM sharp.',
        keyTakeaways: [
          'Narrow CPR = High probability breakout day',
          'Wide CPR = Sideways expiry and option selling day',
          'Virgin CPR acting as an infallible magnetic support'
        ],
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Module 2: Soni\'s Signature 9:20 AM Setup',
    subtitle: 'High win-rate rule-based intraday strategy for Nifty & BankNifty',
    iconName: 'Zap',
    badge: 'Signature Strategy',
    lessons: [
      {
        id: 'les-3',
        title: 'The 9:20 AM Range Breakout Rules',
        duration: '35 mins',
        summary: 'Step-by-step exact checklist to catch the first explosive 100-300 points directional move.',
        keyTakeaways: [
          'Wait for the first 5-minute candle to close completely',
          'Check Sectoral breadth: Reliance + HDFCBANK alignment',
          'Strict 1:2.5 risk-to-reward ratio entry rule'
        ],
        difficulty: 'Intermediate'
      },
      {
        id: 'les-4',
        title: 'VWAP Trapping Setup on 3-Minute Timeframe',
        duration: '30 mins',
        summary: 'How to enter sniper trades when price retests VWAP with decreasing selling volume.',
        keyTakeaways: [
          'Identifying the volume dry-up during retest',
          'Using Delta momentum for quick option scalping',
          'Execution speed and trailing stop-loss strategies'
        ],
        difficulty: 'Advanced'
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Module 3: Options Buying Matrix & OI Decoder',
    subtitle: 'Stop losing to Theta decay. Master Delta momentum and Gamma blasts.',
    iconName: 'Activity',
    badge: 'Pro Trader',
    lessons: [
      {
        id: 'les-5',
        title: 'Open Interest (OI) & Put-Call Ratio (PCR) Decoded',
        duration: '40 mins',
        summary: 'Read live Option Chain data like institutional desk traders.',
        keyTakeaways: [
          'Differentiating Call writing vs Call unwinding',
          'PCR threshold signals: Below 0.70 (Oversold), Above 1.35 (Overbought)',
          'Identifying Max Pain strike before 1:30 PM expiry session'
        ],
        difficulty: 'Intermediate'
      },
      {
        id: 'les-6',
        title: 'Expiry Day 1:30 PM Hero-or-Zero Strategy',
        duration: '45 mins',
        summary: 'Calculating risk-free or low-risk Gamma explosion moves on Thursday & Wednesday expiries.',
        keyTakeaways: [
          'Selecting Out-of-the-money (OTM) strikes with high Delta sensitivity',
          'Allocation rule: Never risk more than 2% of capital on hero-zero',
          'Immediate trailing after 100% ROI milestone'
        ],
        difficulty: 'Advanced'
      }
    ]
  },
  {
    id: 'mod-4',
    title: 'Module 4: Risk Management & The Winner\'s Psychology',
    subtitle: 'The mathematical edge that separates 1% profitable traders from the 99%',
    iconName: 'ShieldCheck',
    badge: 'Crucial Mindset',
    lessons: [
      {
        id: 'les-7',
        title: 'The Invariant 1% Risk Rule & Anti-Blowing Capital System',
        duration: '25 mins',
        summary: 'Why position sizing is 10x more important than entry accuracy.',
        keyTakeaways: [
          'Calculating exact contract quantity from Stop Loss points',
          'Daily maximum loss limit (Circuit breaker): Stop trading after 2 losses',
          'Pyramiding winning trades without increasing initial risk'
        ],
        difficulty: 'Beginner'
      },
      {
        id: 'les-8',
        title: 'Eradicating Revenge Trading and FOMO',
        duration: '32 mins',
        summary: 'Mindset shifts and pre-market rituals to trade with monk-like discipline.',
        keyTakeaways: [
          'Pre-market routine: Key levels drawing before 9:00 AM',
          'The trade journal habit: Reviewing emotional state at entry and exit',
          'Accepting losses as standard operational business costs'
        ],
        difficulty: 'Intermediate'
      }
    ]
  }
];

export function generateCandles(basePrice: number, count: number = 40): CandleData[] {
  const candles: CandleData[] = [];
  let currentPrice = basePrice * 0.985;
  const now = Date.now();
  const intervalMs = 5 * 60 * 1000;

  for (let i = count; i >= 0; i--) {
    const time = new Date(now - i * intervalMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const volatility = basePrice * 0.0035;
    const delta = (Math.random() - 0.47) * volatility;
    const open = Number(currentPrice.toFixed(2));
    const close = Number((open + delta).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * volatility * 0.7).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * volatility * 0.7).toFixed(2));
    const volume = Math.floor(Math.random() * 80000 + 15000);

    candles.push({ time, open, high, low, close, volume });
    currentPrice = close;
  }
  return candles;
}
