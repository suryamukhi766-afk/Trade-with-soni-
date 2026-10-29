import React, { useState } from 'react';
import { ACADEMY_MODULES } from '../data/marketData';
import { CourseModule, CourseLesson } from '../types/trading';
import { 
  BookOpen, 
  CheckCircle, 
  PlayCircle, 
  Clock, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ChevronRight,
  Flame,
  AlertOctagon,
  Check
} from 'lucide-react';

export const SoniAcademy: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<CourseModule>(ACADEMY_MODULES[0]);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson>(ACADEMY_MODULES[0].lessons[0]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Pre-trade checklist state
  const [checklist, setChecklist] = useState({
    higherTimeframe: false,
    vwapConfluence: false,
    sectorAlignment: false,
    riskUnderTwoPercent: false,
    stopLossPredefined: false,
    noRevengeState: false
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const isTradeApproved = completedChecks >= 5;

  return (
    <div className="space-y-6">
      {/* Academy Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Soni Trading Academy</h2>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              Pro Certification
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            From zero to disciplined institutional price action trader. Master the 9:20 AM Setup, Open Interest reading, and risk algorithms.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">TOTAL LESSONS</span>
            <span className="text-white font-bold">8 Master Modules</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">AVG COMPLETION</span>
            <span className="text-emerald-400 font-bold">4.2 Hours</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Curriculum + Lesson Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Modules Sidebar (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Curriculum Roadmap</h3>
          {ACADEMY_MODULES.map((mod, modIdx) => {
            const isSelectedMod = selectedModule.id === mod.id;
            return (
              <div 
                key={mod.id}
                className={`bg-slate-900/90 border rounded-2xl p-4 transition-all shadow-xl ${
                  isSelectedMod ? 'border-amber-500/40 bg-slate-900' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div 
                  onClick={() => setSelectedModule(mod)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-amber-400 uppercase tracking-wider">
                      {mod.badge}
                    </span>
                    <span className="text-[10px] text-slate-500">{mod.lessons.length} Lessons</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white mt-1">{mod.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{mod.subtitle}</p>
                </div>

                {/* Sub-lessons */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                  {mod.lessons.map(les => {
                    const isSelectedLes = selectedLesson.id === les.id;
                    return (
                      <div
                        key={les.id}
                        onClick={() => {
                          setSelectedModule(mod);
                          setSelectedLesson(les);
                          setIsPlayingVideo(false);
                        }}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isSelectedLes 
                            ? 'bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20' 
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${isSelectedLes ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{les.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Lesson Player & Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {/* Video Player Simulated Screen */}
            <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-center p-6 shadow-inner group">
              {isPlayingVideo ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                    <Flame className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-extrabold text-base">Streaming Masterclass Lecture...</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Explaining live order-flow, institutional footprint traps, and execution triggers on {selectedLesson.title}.
                  </p>
                  <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full animate-pulse w-2/3"></div>
                  </div>
                  <button
                    onClick={() => setIsPlayingVideo(false)}
                    className="text-xs text-slate-400 hover:text-white underline pt-2"
                  >
                    Pause Video
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-amber-500/20 mx-auto"
                  >
                    <PlayCircle className="w-8 h-8 text-slate-950" />
                  </button>
                  <h4 className="text-white font-extrabold text-sm sm:text-base">
                    {selectedLesson.title}
                  </h4>
                  <div className="flex items-center justify-center space-x-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {selectedLesson.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 font-bold">
                      {selectedLesson.difficulty}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Summary & Notes */}
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-extrabold text-base text-white tracking-tight">{selectedLesson.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {selectedLesson.summary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Soni's Golden Rules for this Setup</span>
                </h5>
                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedLesson.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Pre-Flight Checklist */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">Soni's Pre-Trade Safety Checklist</h4>
              </div>
              <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full ${
                isTradeApproved 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {isTradeApproved ? 'APPROVED TO TRADE ✅' : `${completedChecks}/6 Checks Passed`}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 mb-4">
              Test your trade confluence before placing the order with your broker. Zero emotions. 100% rule adherence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'higherTimeframe', label: 'Higher Timeframe (15m/1h) Trend Aligned' },
                { key: 'vwapConfluence', label: 'Price is above VWAP (Long) or below VWAP (Short)' },
                { key: 'sectorAlignment', label: 'Major heavyweights (Reliance/HDFC) in same direction' },
                { key: 'riskUnderTwoPercent', label: 'Total trade risk is <= 1.5% of account capital' },
                { key: 'stopLossPredefined', label: 'System Stop-Loss order calculated & set' },
                { key: 'noRevengeState', label: 'Calm psychology (not in revenge/FOMO mindset)' },
              ].map(item => {
                const checked = checklist[item.key as keyof typeof checklist];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleCheck(item.key as keyof typeof checklist)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-2.5 ${
                      checked 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      checked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
