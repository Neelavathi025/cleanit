import React, { useState, useEffect } from 'react';
import { WasteItem } from '../types/game';
import { sound } from '../services/sound';
import { ArrowRight, ShieldCheck, X } from 'lucide-react';

interface PollutionChainModalProps {
  wasteItem: WasteItem;
  onClose: () => void;
}

export const PollutionChainModal: React.FC<PollutionChainModalProps> = ({
  wasteItem,
  onClose
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Automatically advance through steps with gentle timing
    const timer = setInterval(() => {
      setActiveStep(prev => {
        if (prev < wasteItem.pollutionChain.length - 1) {
          sound.playFootstep();
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [wasteItem]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
            {wasteItem.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Pollution Chain Consequence
            </div>
            <h3 className="text-lg font-bold text-white">
              What happens if this {wasteItem.name} was left behind?
            </h3>
          </div>
        </div>

        {/* Chain Visual Flow */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
            {wasteItem.pollutionChain.map((step, idx) => {
              const isRevealed = idx <= activeStep;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-300 ${
                    isRevealed
                      ? 'bg-slate-800/90 border-amber-500/60 scale-100 opacity-100 shadow-md'
                      : 'bg-slate-900/40 border-slate-800 scale-95 opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <div className="text-xs font-bold text-slate-200 mb-1">
                    {step.label}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prevention Takeaway */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-200">
              <strong className="text-white font-semibold">Chain Broken:</strong> Picking this up prevented toxic environmental harm!
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded">
            +HEALTH
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              sound.playDialogAdvance();
              onClose();
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>Continue Cleaning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
