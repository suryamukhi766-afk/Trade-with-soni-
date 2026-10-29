/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LiveMarketWatch } from './components/LiveMarketWatch';
import { VipSignalsHub } from './components/VipSignalsHub';
import { TradingJournal } from './components/TradingJournal';
import { OptionChainRadar } from './components/OptionChainRadar';
import { SoniAcademy } from './components/SoniAcademy';
import { PositionCalculator } from './components/PositionCalculator';
import { CommunityHub } from './components/CommunityHub';
import { InstitutionalBar } from './components/InstitutionalBar';
import { PaperTradingTerminal } from './components/PaperTradingTerminal';
import { DemoTradingProvider } from './context/DemoTradingContext';
import { MarketTicker, TradingSignal, JournalTrade } from './types/trading';
import { SEED_SIGNALS } from './data/marketData';
import { 
  TrendingUp, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  ChevronRight,
  ExternalLink,
  Award,
  Instagram
} from 'lucide-react';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<string>('terminal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [draftTrade, setDraftTrade] = useState<Partial<JournalTrade> | null>(null);

  // Active signals count for badge
  const activeSignalsCount = SEED_SIGNALS.filter(s => s.status === 'ACTIVE').length;

  const handleQuickTrade = (ticker: MarketTicker, type: 'BUY' | 'SELL') => {
    setDraftTrade({
      symbol: ticker.symbol,
      tradeType: type,
      segment: ticker.segment === 'options' ? 'options' : 'equity',
      entryPrice: ticker.price,
      quantity: ticker.lotSize,
      strategy: "Soni's Precision Execution",
      status: 'OPEN'
    });
    setActiveTab('journal');
  };

  const handleImportSignalToJournal = (signal: TradingSignal) => {
    setDraftTrade({
      symbol: signal.symbol,
      tradeType: signal.type,
      segment: signal.segment === 'options' ? 'options' : 'equity',
      entryPrice: signal.entryMin,
      quantity: signal.segment === 'options' ? 75 : 100,
      strategy: 'Soni VIP Signal Follow',
      status: 'OPEN'
    });
    setActiveTab('journal');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeSignalsCount={activeSignalsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Institutional Trust & Execution Bar */}
        <InstitutionalBar />

        {activeTab === 'terminal' && (
          <LiveMarketWatch onQuickTrade={handleQuickTrade} />
        )}

        {activeTab === 'paper' && (
          <PaperTradingTerminal />
        )}

        {activeTab === 'signals' && (
          <VipSignalsHub 
            onImportToJournal={handleImportSignalToJournal}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'journal' && (
          <TradingJournal 
            initialTradeDraft={draftTrade}
            onClearDraft={() => setDraftTrade(null)}
          />
        )}

        {activeTab === 'radar' && (
          <OptionChainRadar />
        )}

        {activeTab === 'academy' && (
          <SoniAcademy />
        )}

        {activeTab === 'calculator' && (
          <PositionCalculator />
        )}

        {activeTab === 'community' && (
          <CommunityHub />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/src/assets/images/trade_with_soni_icon_1793208658167.jpg" 
              alt="Trade with Soni Logo" 
              className="w-10 h-10 rounded-xl shadow-lg border border-amber-500/40 object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-sm">TRADE WITH SONI</span>
                <a
                  href="https://instagram.com/tradewithsoni_777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/30 text-pink-400 hover:text-pink-300 text-[10px] font-bold transition-all hover:scale-105"
                >
                  <Instagram className="w-3 h-3 text-pink-400" />
                  <span>@tradewithsoni_777</span>
                </a>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
                <span>Official Web & Mobile Platform • Tradewithsoni.com</span>
                <span>•</span>
                <a
                  href="https://instagram.com/tradewithsoni_777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 font-medium hover:underline inline-flex items-center gap-1"
                >
                  <span>Instagram: @tradewithsoni_777</span>
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="https://instagram.com/tradewithsoni_777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @tradewithsoni_777</span>
            </a>

            <div className="text-center md:text-right max-w-md text-[11px] text-slate-400">
              <p>
                ⚠️ <strong>Educational Disclaimer:</strong> Securities trading and derivatives involve substantial risk of loss. Analysis and calls shared by Soni are purely for educational mentorship.
              </p>
              <p className="mt-1 text-slate-500 font-mono text-[10px]">
                Firebase Project: trade-with-soni • Real-Time Engine Active
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DemoTradingProvider>
        <MainAppContent />
      </DemoTradingProvider>
    </AuthProvider>
  );
}
