import React, { useState } from 'react';
import { ClueSource, GameState } from '../types/game';
import { sound } from '../services/sound';
import { MessageSquare, CheckCircle, ArrowRight, X } from 'lucide-react';

interface InvestigationDialogProps {
  source: ClueSource;
  gameState: GameState;
  onClueDiscovered: (sourceId: string) => void;
  onClose: () => void;
}

export const InvestigationDialog: React.FC<InvestigationDialogProps> = ({
  source,
  gameState,
  onClueDiscovered,
  onClose
}) => {
  const isWeekLater = gameState.phase === 'PLAYING_WEEK_LATER';
  const outcome = gameState.outcome || 'THRIVING';

  // Determine which dialogue to show
  let dialogueLines: string[] = [];
  if (isWeekLater) {
    if (outcome === 'THRIVING') {
      dialogueLines = [source.dialogueWeekLaterThriving];
    } else if (outcome === 'BAND_AID') {
      dialogueLines = [source.dialogueWeekLaterBandAid];
    } else {
      dialogueLines = [source.dialogueWeekLaterRelapsed];
    }
  } else if (gameState.phase === 'PLAYING_INVESTIGATION') {
    dialogueLines = source.dialogueInvestigating;
  } else {
    dialogueLines = source.dialogueInitial;
  }

  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleNext = () => {
    sound.playDialogAdvance();
    if (currentLineIndex < dialogueLines.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    } else {
      if (gameState.phase === 'PLAYING_INVESTIGATION' && !source.investigated) {
        sound.playAchievement();
        onClueDiscovered(source.id);
      }
      onClose();
    }
  };

  const getNpcAvatar = () => {
    switch (source.id) {
      case 'source-shop':
        return '👨‍🍳';
      case 'source-drain':
        return '👩‍🔬';
      case 'source-construction':
        return '👷';
      case 'source-residential':
        return '👵';
      default:
        return '👤';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NPC Profile Header */}
        <div className="flex items-center gap-4 mb-5 border-b border-slate-800 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center text-3xl shadow-inner">
            {getNpcAvatar()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {source.npcName}
              </h3>
              <span className="text-xs text-emerald-400 font-medium">
                · {source.npcRole}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {source.locationName}
            </p>
          </div>
        </div>

        {/* Dialogue Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 mb-5 min-h-[110px] flex items-center">
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans">
            {dialogueLines[currentLineIndex]}
          </p>
        </div>

        {/* Clue Summary Box (If investigating) */}
        {gameState.phase === 'PLAYING_INVESTIGATION' && currentLineIndex === dialogueLines.length - 1 && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 mb-5 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Evidence Unlocked
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                {source.evidenceSummary}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xs text-slate-500">
            {dialogueLines.length > 1 && (
              <span>
                {currentLineIndex + 1} of {dialogueLines.length}
              </span>
            )}
          </div>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>
              {currentLineIndex < dialogueLines.length - 1
                ? 'Continue'
                : gameState.phase === 'PLAYING_INVESTIGATION'
                  ? 'Record Clue & Finish'
                  : 'Close'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
