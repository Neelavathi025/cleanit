import React, { useState } from 'react';
import { WasteItem, WasteCategory } from '../types/game';
import { SORTING_CATEGORIES } from '../game/constants';
import { sound } from '../services/sound';
import { X, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface WasteSortingModalProps {
  wasteItems: WasteItem[];
  onSortSuccess: (wasteId: string, category: WasteCategory) => void;
  onSortMistake: (wasteId: string, attemptedCategory: WasteCategory) => void;
  onClose: () => void;
}

export const WasteSortingModal: React.FC<WasteSortingModalProps> = ({
  wasteItems,
  onSortSuccess,
  onSortMistake,
  onClose
}) => {
  const unsortedItems = wasteItems.filter(w => w.collected && !w.sorted);
  const sortedItems = wasteItems.filter(w => w.sorted);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(
    unsortedItems.length > 0 ? unsortedItems[0] : null
  );

  const [feedback, setFeedback] = useState<{
    type: 'SUCCESS' | 'MISTAKE' | null;
    message: string;
    details?: string;
  }>({ type: null, message: '' });

  const handleBinSelect = (category: WasteCategory) => {
    if (!selectedItem) return;

    if (selectedItem.category === category) {
      // Correct!
      sound.playSortSuccess();
      setFeedback({
        type: 'SUCCESS',
        message: `Correct! ${selectedItem.name} sorted into ${category}.`,
        details: selectedItem.ecoFact
      });

      onSortSuccess(selectedItem.id, category);

      // Pick next unsorted item if available
      const remaining = unsortedItems.filter(w => w.id !== selectedItem.id);
      setTimeout(() => {
        if (remaining.length > 0) {
          setSelectedItem(remaining[0]);
          setFeedback({ type: null, message: '' });
        } else {
          setSelectedItem(null);
        }
      }, 1400);
    } else {
      // Mistake!
      sound.playSortFail();
      setFeedback({
        type: 'MISTAKE',
        message: `❌ Wrong bin for ${selectedItem.name}`,
        details: selectedItem.wrongBinExplanation
      });
      onSortMistake(selectedItem.id, category);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>♻️</span>
              <span>Greenwood Waste Sorting Station</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Place each collected item into its proper environmental stream.
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

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Sorted: <strong className="text-emerald-400">{sortedItems.length}</strong> / 14 items
            </span>
            <span>
              Remaining in bag:{' '}
              <strong className="text-amber-400">{unsortedItems.length}</strong>
            </span>
          </div>

          {/* ACTIVE ITEM SELECTION */}
          {unsortedItems.length > 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-700/80 border border-slate-600 flex items-center justify-center text-3xl shadow-inner">
                  {selectedItem?.icon || '📦'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Item To Sort
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedItem?.name}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mt-0.5">
                    {selectedItem?.description}
                  </p>
                </div>
              </div>

              {/* Quick tray of other collected items in bag */}
              {unsortedItems.length > 1 && (
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-slate-400 mb-1">Other items in bag:</span>
                  <div className="flex gap-1.5 flex-wrap max-w-xs justify-end">
                    {unsortedItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setFeedback({ type: null, message: '' });
                          sound.playDialogAdvance();
                        }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border transition-all ${
                          selectedItem?.id === item.id
                            ? 'bg-emerald-600/30 border-emerald-400 scale-105'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                        }`}
                        title={item.name}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-6 text-center">
              <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">All Collected Waste is Sorted!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                {wasteItems.filter(w => !w.collected).length > 0
                  ? 'Great job sorting! Return to the street to find remaining scattered waste.'
                  : 'You sorted all 14 waste items! You are ready to investigate root causes.'}
              </p>
            </div>
          )}

          {/* EDUCATIONAL FEEDBACK CALLOUT (If attempted) */}
          {feedback.type && (
            <div
              className={`rounded-xl p-4 border transition-all ${
                feedback.type === 'SUCCESS'
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedback.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm text-white">{feedback.message}</div>
                  {feedback.details && (
                    <p className="text-xs mt-1 leading-relaxed opacity-90">
                      {feedback.details}
                    </p>
                  )}
                  {feedback.type === 'MISTAKE' && (
                    <p className="text-[11px] text-amber-300 font-semibold mt-2">
                      💡 Try again! Click the correct bin below.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4 DISPOSAL CATEGORY BINS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SORTING_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                disabled={!selectedItem}
                onClick={() => handleBinSelect(cat.id as WasteCategory)}
                className={`relative group flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  !selectedItem
                    ? 'opacity-60 cursor-not-allowed border-slate-800 bg-slate-900/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-slate-500 hover:-translate-y-1 hover:shadow-xl active:translate-y-0'
                }`}
                style={{
                  borderTopColor: cat.color,
                  borderTopWidth: '6px'
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-md"
                  style={{ backgroundColor: `${cat.color}25` }}
                >
                  {cat.icon}
                </div>
                <h4 className="text-base font-bold text-white mb-1">{cat.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {cat.examples}
                </p>

                <div
                  className="mt-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                  style={{ backgroundColor: cat.color }}
                >
                  Deposit Here
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Tip: Hazardous materials like batteries require specialized recycling to prevent toxins entering soil.
          </span>
          <button
            onClick={() => {
              sound.playDialogAdvance();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Back to Street
          </button>
        </div>
      </div>
    </div>
  );
};
