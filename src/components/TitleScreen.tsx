import React from 'react';
import { sound } from '../services/sound';
import { Play, HelpCircle, Volume2, VolumeX, Sparkles, Leaf } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenHowToPlay,
  audioMuted,
  onToggleAudio
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background ambient decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl animate-bounce duration-1000">🌱</div>
        <div className="absolute bottom-20 right-16 text-6xl animate-pulse">🌳</div>
        <div className="absolute top-1/3 right-1/4 text-5xl">🦋</div>
        <div className="absolute bottom-1/3 left-1/5 text-4xl">🥤</div>
      </div>

      <div className="relative max-w-xl w-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center">
        {/* Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
          <Leaf className="w-3.5 h-3.5" />
          <span>Interactive Environmental Awareness</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight font-sans mb-3">
          CLEAN IT
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-emerald-300 font-medium mb-8 max-w-md italic">
          "Don't just clean the mess. Stop it from coming back."
        </p>

        {/* Feature summary */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-md bg-slate-950/60 border border-slate-800 rounded-2xl p-3 mb-8 text-center text-xs text-slate-300">
          <div>
            <div className="text-xl mb-1">🗑️</div>
            <div className="font-semibold text-white">Clean & Sort</div>
            <div className="text-[10px] text-slate-400">14 scattered items</div>
          </div>
          <div className="border-x border-slate-800">
            <div className="text-xl mb-1">🔍</div>
            <div className="font-semibold text-white">Investigate</div>
            <div className="text-[10px] text-slate-400">4 root causes</div>
          </div>
          <div>
            <div className="text-xl mb-1">🌱</div>
            <div className="font-semibold text-white">Prevent</div>
            <div className="text-[10px] text-slate-400">Shape the future</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={() => {
              sound.playAchievement();
              sound.startAmbientAmbience();
              onStartGame();
            }}
            className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>PLAY GAME</span>
          </button>

          <button
            onClick={() => {
              sound.playDialogAdvance();
              onOpenHowToPlay();
            }}
            className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>HOW TO PLAY</span>
          </button>
        </div>

        {/* Bottom Audio toggle & Controls hint */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-slate-400">
          <span>Controls: WASD / Arrows / Touch</span>
          <button
            onClick={onToggleAudio}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{audioMuted ? 'Muted' : 'Sound On'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
