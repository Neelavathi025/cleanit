import React, { useRef, useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { Volume2, VolumeX, Pause, HelpCircle, Layers } from 'lucide-react';
import { sound } from '../services/sound';

interface HUDProps {
  gameState: GameState;
  onOpenSorting: () => void;
  onTogglePause: () => void;
  onOpenHowToPlay: () => void;
  onToggleAudio: () => void;
  onActionBtn: () => void;
  onJoystickMove: (delta: { x: number; y: number } | null) => void;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  onOpenSorting,
  onTogglePause,
  onOpenHowToPlay,
  onToggleAudio,
  onActionBtn,
  onJoystickMove
}) => {
  const collectedCount = gameState.wasteItems.filter(w => w.collected).length;
  const sortedCount = gameState.wasteItems.filter(w => w.sorted).length;
  const unsortedCount = gameState.wasteItems.filter(w => w.collected && !w.sorted).length;

  // Virtual joystick state for mobile
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setJoystickActive(true);
    updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickActive) return;
    updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    onJoystickMove(null);
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const maxRadius = 45;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }
    setJoystickPos({ x: dx, y: dy });
    onJoystickMove({ x: dx / maxRadius, y: dy / maxRadius });
  };

  // Phase badge display text
  let phaseTitle = 'PHASE 1 · STREET CLEANUP';
  if (gameState.phase === 'PLAYING_INVESTIGATION') {
    phaseTitle = 'PHASE 2 · INVESTIGATE SOURCES';
  } else if (gameState.phase === 'PREVENTION_COUNCIL') {
    phaseTitle = 'PHASE 3 · PREVENTION COUNCIL';
  } else if (gameState.phase === 'PLAYING_WEEK_LATER') {
    phaseTitle = 'ONE WEEK LATER · EXPLORE OUTCOME';
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-10">
      {/* TOP BAR */}
      <header className="pointer-events-auto flex items-center justify-between w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2.5 shadow-lg">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-emerald-400 font-sans">
            CLEAN IT
          </span>
          <span className="hidden md:inline text-xs text-slate-400">· Greenwood District</span>
        </div>

        {/* Zone 2: Status Indicators (Unboxed typography) */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
          {/* Environment Health */}
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">🌱</span>
            <span className="text-slate-300">Environment:</span>
            <span className="font-bold text-white tabular-nums">{gameState.environmentHealth}%</span>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          {/* Waste Collected */}
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">🗑️</span>
            <span className="text-slate-300">Waste:</span>
            <span className="font-bold text-white tabular-nums">
              {collectedCount}/14
            </span>
            {unsortedCount > 0 && (
              <span className="text-xs text-amber-300 font-normal">
                ({unsortedCount} to sort)
              </span>
            )}
          </div>

          <span className="hidden lg:inline text-slate-600">|</span>

          {/* Phase name */}
          <div className="hidden lg:block text-xs font-semibold text-slate-400 tracking-wider">
            {phaseTitle}
          </div>
        </div>

        {/* Zone 3: Primary Action buttons */}
        <div className="flex items-center gap-2">
          {/* Sort Waste Station button */}
          <button
            onClick={() => {
              sound.playDialogAdvance();
              onOpenSorting();
            }}
            className="relative px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
            title="Open Waste Sorting Station"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort Waste</span>
            {unsortedCount > 0 && (
              <span className="w-4 h-4 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black flex items-center justify-center">
                {unsortedCount}
              </span>
            )}
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleAudio}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={gameState.audioMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {gameState.audioMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* How to play help */}
          <button
            onClick={onOpenHowToPlay}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Pause */}
          <button
            onClick={onTogglePause}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* PHASE BANNER / SUB-OBJECTIVE (Discreet) */}
      <div className="pointer-events-none self-center bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-1 text-xs text-slate-300 shadow">
        {gameState.phase === 'PLAYING_CLEANING' && (
          <span>
            {collectedCount < 14
              ? `Walk to garbage items and press [E] or click to pick them up (${14 - collectedCount} remaining)`
              : 'All 14 items collected! Open the Sorting Station to categorize them.'}
          </span>
        )}
        {gameState.phase === 'PLAYING_INVESTIGATION' && (
          <span>
            Investigate 4 root pollution sources: talk to Mr. Ray, Maya, Dan, and Mrs. Gable!
          </span>
        )}
        {gameState.phase === 'PLAYING_WEEK_LATER' && (
          <span>
            Explore Greenwood Street 1 week after your decisions! Talk to residents to see the outcome.
          </span>
        )}
      </div>

      {/* BOTTOM AREA: DESKTOP HINTS & MOBILE CONTROLS */}
      <div className="flex items-end justify-between w-full">
        {/* Desktop Controls Hint (Left) */}
        <div className="hidden sm:block pointer-events-auto bg-slate-900/80 backdrop-blur-sm border border-slate-700/40 rounded-lg px-3 py-1.5 text-[11px] text-slate-400">
          <span className="text-slate-200 font-semibold">[WASD / Arrows]</span> Move ·{' '}
          <span className="text-slate-200 font-semibold">[Click/Tap]</span> Move/Select ·{' '}
          <span className="text-slate-200 font-semibold">[E / Space]</span> Interact ·{' '}
          <span className="text-slate-200 font-semibold">[I]</span> Sort Station ·{' '}
          <span className="text-slate-200 font-semibold">[ESC]</span> Pause
        </div>

        {/* Mobile Virtual Thumbstick (Touch only) */}
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="pointer-events-auto sm:hidden relative w-28 h-28 rounded-full bg-slate-800/60 border-2 border-slate-600/40 backdrop-blur-sm flex items-center justify-center touch-none ml-2 mb-2"
        >
          <div
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
            }}
            className="w-12 h-12 rounded-full bg-emerald-500/80 border border-emerald-300 shadow-md transition-transform duration-75"
          />
        </div>

        {/* Mobile Action Button (Right) */}
        <div className="pointer-events-auto sm:hidden mr-2 mb-2 flex flex-col gap-2">
          <button
            onClick={onActionBtn}
            className="w-16 h-16 rounded-full bg-emerald-600 border-2 border-emerald-400 text-white font-black text-xs shadow-lg active:scale-95 flex flex-col items-center justify-center"
          >
            <span>ACTION</span>
            <span className="text-[9px] text-emerald-200">[E]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
