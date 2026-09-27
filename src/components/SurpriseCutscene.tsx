import React, { useEffect, useState } from 'react';
import { sound } from '../services/sound';
import { Sparkles, AlertCircle, ArrowRight, Search } from 'lucide-react';

interface SurpriseCutsceneProps {
  onStartInvestigation: () => void;
}

export const SurpriseCutscene: React.FC<SurpriseCutsceneProps> = ({
  onStartInvestigation
}) => {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    sound.playAchievement();
    const t1 = setTimeout(() => {
      setStage(1);
      sound.playTimeWhoosh();
    }, 2800);

    const t2 = setTimeout(() => {
      setStage(2);
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Stage 0: Initial Relief */}
        {stage === 0 && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-4xl mb-4">
              ✨
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              The Street Is Sparkling Clean!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              You picked up all 14 discarded items and sorted them into proper waste streams. The pavement looks spotless...
            </p>
          </div>
        )}

        {/* Stage 1: The Surprise Twist */}
        {stage === 1 && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl mb-4 animate-bounce">
              💨
            </div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              Wait a second...
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">
              A sudden gust of wind blows.
            </h2>
            <p className="text-sm text-amber-200/90 leading-relaxed max-w-md bg-amber-950/40 border border-amber-500/30 rounded-xl p-4">
              A passerby exits the market and drops another plastic cup. Runoff water continues to seep toward the drain. Construction debris still sits at the corner.
            </p>
          </div>
        )}

        {/* Stage 2: The Core Realization */}
        {stage >= 2 && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-4xl mb-4">
              🔍
            </div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
              Key Realization
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              Simply cleaning garbage does not solve the problem.
            </h2>
            <p className="text-base font-semibold text-emerald-300 italic mb-4">
              «"The street is clean. But where did all this waste come from?"»
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mb-6">
              If we only sweep without stopping the sources, tomorrow the street will be just as polluted as today. It's time to investigate root causes!
            </p>

            <button
              onClick={() => {
                sound.playDialogAdvance();
                onStartInvestigation();
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 group"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Begin Investigation (4 Sources)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
