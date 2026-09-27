import React from 'react';
import { sound } from '../services/sound';
import { X, Play, ArrowRight } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
  onStartGame?: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  onClose,
  onStartGame
}) => {
  const steps = [
    {
      num: 'STEP 1',
      icon: '🔎',
      title: 'Find the waste',
      desc: 'Explore the 2D neighborhood street and locate 14 naturally scattered pieces of garbage.'
    },
    {
      num: 'STEP 2',
      icon: '🗑️',
      title: 'Collect it',
      desc: 'Approach garbage and press [E] or click/tap to put it in your eco waste bag.'
    },
    {
      num: 'STEP 3',
      icon: '♻️',
      title: 'Sort it',
      desc: 'Place waste into Organic, Recyclable, Hazardous, or E-Waste streams. Learn from mistakes!'
    },
    {
      num: 'STEP 4',
      icon: '🔍',
      title: 'Investigate',
      desc: 'Talk to neighborhood residents to uncover the 4 root sources of pollution.'
    },
    {
      num: 'STEP 5',
      icon: '🌱',
      title: 'Prevent',
      desc: 'Enact systemic solutions that prevent future waste, and return 1 week later to see the impact!'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>📖</span>
              <span>How To Play: CLEAN IT</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Clean the mess, understand the chain, and prevent it from returning.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playDialogAdvance();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                {st.icon}
              </div>
              <div>
                <div className="text-[10px] font-black text-emerald-400 tracking-wider">
                  {st.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">{st.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls recap */}
        <div className="bg-slate-800/50 rounded-xl p-3 mb-6 text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <span><strong>Desktop:</strong> [WASD / Arrows] Move · [E] Interact · [I] Sort · [ESC] Pause</span>
          <span><strong>Mobile:</strong> Virtual Thumbstick + Touch Action Button</span>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-auto">
          {onStartGame ? (
            <button
              onClick={() => {
                sound.playAchievement();
                sound.startAmbientAmbience();
                onStartGame();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Game</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playDialogAdvance();
                onClose();
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
