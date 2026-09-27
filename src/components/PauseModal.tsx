import React from 'react';
import { sound } from '../services/sound';
import { Play, RotateCcw, Volume2, VolumeX, HelpCircle, X } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenHowToPlay,
  audioMuted,
  onToggleAudio
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-center flex flex-col items-center">
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Game Paused
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Take a breather or review instructions.
        </p>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => {
              sound.playDialogAdvance();
              onResume();
            }}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Game</span>
          </button>

          <button
            onClick={() => {
              sound.playDialogAdvance();
              onOpenHowToPlay();
            }}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How to Play</span>
          </button>

          <button
            onClick={onToggleAudio}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{audioMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Restart game from the beginning?')) {
                sound.playDialogAdvance();
                onRestart();
              }
            }}
            className="w-full py-3 px-4 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs rounded-xl border border-rose-800/40 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Level 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
