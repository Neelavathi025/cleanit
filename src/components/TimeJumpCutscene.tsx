import React, { useEffect, useState } from 'react';
import { sound } from '../services/sound';
import { Calendar, Clock, Sun, Moon } from 'lucide-react';

interface TimeJumpCutsceneProps {
  onFinishTimeJump: () => void;
}

export const TimeJumpCutscene: React.FC<TimeJumpCutsceneProps> = ({
  onFinishTimeJump
}) => {
  const [dayIndex, setDayIndex] = useState(1);

  useEffect(() => {
    sound.playTimeWhoosh();
    const interval = setInterval(() => {
      setDayIndex(prev => {
        if (prev < 7) {
          sound.playFootstep();
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    const endTimer = setTimeout(() => {
      sound.playBirdChirp();
      onFinishTimeJump();
    }, 3600);

    return () => {
      clearInterval(interval);
      clearTimeout(endTimer);
    };
  }, [onFinishTimeJump]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex flex-col items-center text-center max-w-lg">
        {/* Animated Sun & Moon Cycle */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-spin" />
          <Sun className="w-12 h-12 text-amber-400 animate-pulse" />
        </div>

        <div className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-2">
          Advancing Community Timeline
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          ONE WEEK LATER...
        </h1>
        <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
          Day {dayIndex} of 7: New habits take root, policies are implemented, and the street responds to your choices...
        </p>

        {/* Progress bar of 7 days */}
        <div className="flex gap-2 w-full max-w-xs justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map(d => (
            <div
              key={d}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                d <= dayIndex ? 'bg-emerald-400 shadow-sm' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
