import React, { useState } from 'react';
import { ClueSource } from '../types/game';
import { sound } from '../services/sound';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PreventionCouncilModalProps {
  sources: ClueSource[];
  onCompleteDecisions: (selections: { [sourceId: string]: string }) => void;
}

export const PreventionCouncilModal: React.FC<PreventionCouncilModalProps> = ({
  sources,
  onCompleteDecisions
}) => {
  const [selectedChoices, setSelectedChoices] = useState<{ [sourceId: string]: string }>({});
  const [activeTab, setActiveTab] = useState<number>(0);

  const currentSource = sources[activeTab];

  const handleSelect = (sourceId: string, choiceId: string) => {
    sound.playDialogAdvance();
    setSelectedChoices(prev => ({ ...prev, [sourceId]: choiceId }));
  };

  const allDecided = sources.every(s => selectedChoices[s.id]);

  const handleProceed = () => {
    if (!allDecided) return;
    sound.playAchievement();
    onCompleteDecisions(selectedChoices);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Greenwood Environmental Council
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Community Prevention Strategies
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Decisions:{' '}
            <strong className="text-emerald-400">
              {Object.keys(selectedChoices).length}
            </strong>{' '}
            / {sources.length}
          </div>
        </div>

        {/* Source Navigation Tabs (Clean unboxed interactive segmented control) */}
        <div className="px-6 pt-4 pb-2 bg-slate-950/40 border-b border-slate-800/80 flex gap-2 overflow-x-auto">
          {sources.map((src, idx) => {
            const isChosen = !!selectedChoices[src.id];
            const isActive = activeTab === idx;
            return (
              <button
                key={src.id}
                onClick={() => {
                  sound.playDialogAdvance();
                  setActiveTab(idx);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : isChosen
                      ? 'bg-slate-800/90 text-emerald-300 border-slate-700'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{src.npcName}</span>
                {isChosen && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
              </button>
            );
          })}
        </div>

        {/* Active Problem & Choices */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {/* Problem Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <span>ROOT CAUSE · {currentSource.locationName}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {currentSource.problemStatement}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentSource.evidenceSummary}
            </p>
          </div>

          {/* 3 Choices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentSource.choices.map(choice => {
              const isSelected = selectedChoices[currentSource.id] === choice.id;
              let badgeColor = 'text-amber-400';
              let badgeLabel = 'BAND-AID REACTION';
              if (choice.type === 'SYSTEMIC') {
                badgeColor = 'text-emerald-400';
                badgeLabel = 'SYSTEMIC PREVENTION';
              } else if (choice.type === 'NEGLECT') {
                badgeColor = 'text-rose-400';
                badgeLabel = 'PASSIVE / NEGLECT';
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(currentSource.id, choice.id)}
                  className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-400 shadow-xl ring-2 ring-emerald-500/20'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`text-[10px] font-black tracking-widest uppercase mb-2 ${badgeColor}`}>
                    {badgeLabel}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                    {choice.text}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {choice.explanation}
                  </p>
                  <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-slate-400 block mb-0.5">Projected Outcome:</strong>
                    {choice.weekLaterEffect}
                  </div>

                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Action Selected</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {allDecided ? (
              <span className="text-emerald-400 font-semibold">
                All 4 community prevention policies enacted!
              </span>
            ) : (
              <span>
                Please select an action for all 4 sources before advancing the timeline.
              </span>
            )}
          </div>
          <button
            disabled={!allDecided}
            onClick={handleProceed}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
              allDecided
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Advance Timeline: ONE WEEK LATER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
