import React, { useState } from 'react';
import { 
  Globe, 
  Lock, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  TrendingUp, 
  Activity, 
  Zap, 
  Server, 
  HelpCircle,
  X
} from 'lucide-react';

export const InstitutionalBar: React.FC = () => {
  const [showDomainModal, setShowDomainModal] = useState<boolean>(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const brokers = [
    { name: 'Zerodha Kite', url: 'https://kite.zerodha.com', color: 'from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/30' },
    { name: 'Dhan', url: 'https://web.dhan.co', color: 'from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/30' },
    { name: 'Angel One', url: 'https://trade.angelone.in', color: 'from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30' },
    { name: 'Upstox Pro', url: 'https://pro.upstox.com', color: 'from-purple-600/20 to-indigo-600/20 text-indigo-300 border-purple-500/30' },
    { name: 'Groww', url: 'https://groww.in/stocks', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Top Institutional Trust & Domain Strip */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:px-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Domain & SSL Verification */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-emerald-500/30 shadow-inner">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-white tracking-tight">https://tradewithsoni.com</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>NISM Certified & Price Action Desk</span>
          </div>

          <button
            onClick={() => setShowDomainModal(true)}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>Custom Domain Setup Guide</span>
          </button>
        </div>

        {/* Right: Institutional Market Breadth & Global Cues */}
        <div className="flex items-center space-x-4 font-mono text-[11px] overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1.5 whitespace-nowrap">
            <span className="text-slate-500">FII / DII:</span>
            <strong className="text-emerald-400">+₹1,420 Cr</strong>
          </div>
          <div className="flex items-center space-x-1.5 whitespace-nowrap">
            <span className="text-slate-500">GIFT NIFTY:</span>
            <strong className="text-emerald-400">24,960 (+0.4%)</strong>
          </div>
          <div className="flex items-center space-x-1.5 whitespace-nowrap">
            <span className="text-slate-500">BREADTH:</span>
            <span className="text-emerald-400 font-bold">34 Adv</span>
            <span className="text-slate-600">/</span>
            <span className="text-rose-400 font-bold">16 Dec</span>
          </div>
        </div>
      </div>

      {/* Broker Fast-Execution Dock */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-400 shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-300">1-Click Fast Execution:</span>
          <span className="text-[11px] text-slate-500 hidden md:inline">Execute Soni's signals with your preferred broker:</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {brokers.map((broker) => (
            <a
              key={broker.name}
              href={broker.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border bg-gradient-to-r ${broker.color} hover:brightness-125 transition-all text-[11px] font-bold whitespace-nowrap shadow-sm active:scale-95`}
            >
              <span>{broker.name}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          ))}
        </div>
      </div>

      {/* Domain Setup Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">How to connect https://tradewithsoni.com</h3>
                  <p className="text-xs text-slate-400">Link your custom domain to your Firebase / Google Cloud project</p>
                </div>
              </div>
              <button
                onClick={() => setShowDomainModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your application is already configured with Firebase project <strong className="text-amber-400 font-mono">trade-with-soni</strong>. To point your domain <strong className="text-emerald-400 font-mono">tradewithsoni.com</strong> to this website, follow these simple steps:
            </p>

            <div className="space-y-3 text-xs">
              {/* Step 1 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block font-mono text-[11px]">STEP 1: Open Firebase Console</span>
                <p className="text-slate-300 text-xs">
                  Go to <a href="https://console.firebase.google.com/project/trade-with-soni/hosting/sites" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">Firebase Console &gt; Hosting</a> under project <span className="font-mono text-white">trade-with-soni</span>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block font-mono text-[11px]">STEP 2: Add Custom Domain</span>
                <p className="text-slate-300 text-xs">
                  Click <strong>"Add Custom Domain"</strong> and enter <strong className="font-mono text-emerald-400">tradewithsoni.com</strong> (and www.tradewithsoni.com).
                </p>
              </div>

              {/* Step 3: DNS Records */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block font-mono text-[11px]">STEP 3: Add DNS Records at your Registrar (GoDaddy, Namecheap, Hostinger)</span>
                
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <div>
                      <span className="text-slate-500">Type:</span> <span className="text-white font-bold">A Record</span> | <span className="text-slate-500">Host:</span> <span className="text-amber-300 font-bold">@</span> | <span className="text-slate-500">Points to:</span> <span className="text-emerald-400 font-bold">199.36.158.100</span>
                    </div>
                    <button
                      onClick={() => handleCopy('199.36.158.100', 'a1')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedRecord === 'a1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <div>
                      <span className="text-slate-500">Type:</span> <span className="text-white font-bold">CNAME</span> | <span className="text-slate-500">Host:</span> <span className="text-amber-300 font-bold">www</span> | <span className="text-slate-500">Points to:</span> <span className="text-emerald-400 font-bold">trade-with-soni.web.app</span>
                    </div>
                    <button
                      onClick={() => handleCopy('trade-with-soni.web.app', 'cname')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedRecord === 'cname' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Free automatic SSL Certificate (HTTPS) is provisioned automatically by Google within 1-2 hours of DNS propagation!
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDomainModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
