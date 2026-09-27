import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { sound } from '../services/sound';
import { Sparkles, ArrowRight, RotateCcw, Award, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface HackathonFinaleModalProps {
  gameState: GameState;
  onRestart: () => void;
}

export const HackathonFinaleModal: React.FC<HackathonFinaleModalProps> = ({
  gameState,
  onRestart
}) => {
  // Slides:
  // 0: "You cleaned 14 pieces of garbage."
  // 1: "But the real question is..."
  // 2: «"Why did the garbage appear in the first place?"»
  // 3: Prevention choices & consequences
  // 4: "WHAT IF YOU HAD DONE NOTHING?"
  // 5: Impact Summary & Final Hackathon Climax
  const [slide, setSlide] = useState<number>(0);

  useEffect(() => {
    sound.playAchievement();
  }, []);

  const sortedCount = gameState.wasteItems.filter(w => w.sorted).length;
  const mistakes = gameState.sortingAccuracyMistakes;
  const outcome = gameState.outcome || 'THRIVING';

  const handleNext = () => {
    sound.playDialogAdvance();
    setSlide(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-10 text-center overflow-hidden flex flex-col justify-between min-h-[500px]">
        {/* SLIDE 0: You cleaned 14 pieces of garbage */}
        {slide === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-5xl mb-6">
              🗑️
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
              You cleaned 14 pieces of garbage.
            </h1>
            <p className="text-base text-slate-400 max-w-md">
              Every plastic bottle, leaking battery, and food container was removed from the street.
            </p>
          </div>
        )}

        {/* SLIDE 1: But the real question is... */}
        {slide === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-5xl mb-6">
              🤔
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-amber-300 tracking-tight mb-4">
              But the real question is...
            </h1>
            <p className="text-base text-slate-400 max-w-sm">
              Cleaning what's in front of you is only half the story.
            </p>
          </div>
        )}

        {/* SLIDE 2: «Why did the garbage appear in the first place?» */}
        {slide === 2 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-5xl mb-6 shadow-lg shadow-emerald-500/10">
              💡
            </div>
            <div className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3">
              The Root Question
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mb-6 font-sans">
              «Why did the garbage appear in the first place?»
            </h1>
            <p className="text-base text-slate-300 max-w-lg leading-relaxed">
              When we understand the source, we can replace endless cleanup with permanent solutions.
            </p>
          </div>
        )}

        {/* SLIDE 3: Prevention Decisions & Environmental Consequences */}
        {slide === 3 && (
          <div className="flex-1 flex flex-col items-center text-left animate-in fade-in duration-300 overflow-y-auto max-h-[380px] pr-1">
            <div className="text-center w-full mb-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
                Your Community Prevention Policies
              </div>
              <h2 className="text-2xl font-bold text-white">
                How Your Decisions Transformed Greenwood
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {gameState.sources.map(src => {
                const choice = src.choices.find(c => c.id === src.selectedChoiceId) || src.choices[1];
                const isSystemic = choice.type === 'SYSTEMIC';
                return (
                  <div
                    key={src.id}
                    className={`p-4 rounded-2xl border ${
                      isSystemic
                        ? 'bg-emerald-950/40 border-emerald-500/40'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {src.npcName} · {src.locationName}
                    </div>
                    <div className="text-xs font-semibold text-white mb-2">
                      {choice.text}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <strong className="text-emerald-300">Consequence: </strong>
                      {choice.weekLaterEffect}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SLIDE 4: "WHAT IF YOU HAD DONE NOTHING?" Comparison */}
        {slide === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-400">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              Systemic Impact Analysis
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
              "WHAT IF YOU HAD DONE NOTHING?"
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl text-left">
              {/* With your actions */}
              <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <span>With Your Prevention Choices</span>
                </div>
                <div className="text-3xl font-black text-white tabular-nums mb-1">
                  -85%
                </div>
                <div className="text-xs text-slate-200 mb-3">
                  Street waste drastically reduced at the source
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Reusable cup adoption cut shop single-use waste</li>
                  <li>• Storm drain clear; aquatic river life protected</li>
                  <li>• Apartment compost feeds community gardens</li>
                </ul>
              </div>

              {/* If nothing changed */}
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>If Nothing Had Changed</span>
                </div>
                <div className="text-3xl font-black text-rose-300 tabular-nums mb-1">
                  +45%
                </div>
                <div className="text-xs text-slate-200 mb-3">
                  Garbage surge & environmental decay
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Clogged drain causes flash sidewalk flooding</li>
                  <li>• Leaking battery acids poison local aquifer</li>
                  <li>• Overflowing dumpster breeds disease vectors</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: Climax Hackathon Moment */}
        {slide === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-400">
            {/* Impact Metric Bar */}
            <div className="flex items-center gap-3 sm:gap-6 text-xs text-slate-300 mb-6 bg-slate-950/60 border border-slate-800 rounded-2xl px-5 py-3 shadow-inner">
              <div>
                🗑️ <strong className="text-white">14/14</strong> Waste Collected
              </div>
              <span className="text-slate-700">|</span>
              <div>
                ♻️ <strong className="text-emerald-400">{sortedCount}/14</strong> Properly Sorted
              </div>
              <span className="text-slate-700">|</span>
              <div>
                🚰 <strong className="text-sky-400">1 Drain</strong> Saved from Clog
              </div>
              <span className="text-slate-700">|</span>
              <div>
                🌱 Health: <strong className="text-emerald-400">{gameState.environmentHealth}%</strong>
              </div>
            </div>

            {/* Climax Typography Requirements */}
            <div className="space-y-4 max-w-2xl mb-6">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider font-sans">
                  CLEANING IS A SOLUTION.
                </h2>
                <h2 className="text-2xl sm:text-3xl font-black text-sky-400 tracking-wider font-sans">
                  PREVENTION IS A CHANGE.
                </h2>
              </div>

              <div className="pt-3 space-y-2 border-t border-slate-800 text-sm sm:text-base text-slate-200 italic font-medium">
                <p>«"One person cleaning a street can make a difference."»</p>
                <p className="text-emerald-300 font-bold">
                  «"But a community preventing waste can change an entire city."»
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md mb-2">
              Your choices don't just clean the environment. They shape it.
            </p>
          </div>
        )}

        {/* Step Indicator & Controls */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          {/* Step dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s === slide ? 'bg-emerald-400 w-6' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {slide < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onRestart}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
