import React, { useState, useEffect, useCallback } from 'react';
import { GameState, WasteItem, ClueSource, WasteCategory, EnvironmentalOutcome } from './types/game';
import { INITIAL_WASTE_ITEMS, INVESTIGATION_SOURCES } from './game/constants';
import { GameCanvas } from './game/GameCanvas';
import { HUD } from './components/HUD';
import { TitleScreen } from './components/TitleScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { WasteSortingModal } from './components/WasteSortingModal';
import { PollutionChainModal } from './components/PollutionChainModal';
import { SurpriseCutscene } from './components/SurpriseCutscene';
import { InvestigationDialog } from './components/InvestigationDialog';
import { PreventionCouncilModal } from './components/PreventionCouncilModal';
import { TimeJumpCutscene } from './components/TimeJumpCutscene';
import { HackathonFinaleModal } from './components/HackathonFinaleModal';
import { PauseModal } from './components/PauseModal';
import { sound } from './services/sound';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'TITLE',
    environmentHealth: 35,
    communityScore: 25,
    wasteItems: JSON.parse(JSON.stringify(INITIAL_WASTE_ITEMS)),
    sources: JSON.parse(JSON.stringify(INVESTIGATION_SOURCES)),
    activeSourceId: null,
    activeWasteId: null,
    activeChainWaste: null,
    sortingAccuracyMistakes: 0,
    drainCleaned: false,
    player: {
      x: 520,
      y: 460,
      targetX: 520,
      targetY: 460,
      vx: 0,
      vy: 0,
      speed: 3.6,
      direction: 'down',
      isMoving: false
    },
    audioMuted: false
  });

  const [showSortingModal, setShowSortingModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [joystickDelta, setJoystickDelta] = useState<{ x: number; y: number } | null>(null);

  // Global ESC key for pausing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState.phase === 'PAUSED') {
          handleResume();
        } else if (
          gameState.phase === 'PLAYING_CLEANING' ||
          gameState.phase === 'PLAYING_INVESTIGATION' ||
          gameState.phase === 'PLAYING_WEEK_LATER'
        ) {
          handlePause();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase]);

  // Audio mute sync
  const handleToggleAudio = () => {
    const nextMuted = !gameState.audioMuted;
    sound.setMuted(nextMuted);
    setGameState(prev => ({ ...prev, audioMuted: nextMuted }));
  };

  const handleStartGame = () => {
    setShowHowToPlay(false);
    setGameState(prev => ({
      ...prev,
      phase: 'PLAYING_CLEANING'
    }));
  };

  const handlePause = () => {
    sound.playDialogAdvance();
    setGameState(prev => ({
      ...prev,
      previousPhase: prev.phase,
      phase: 'PAUSED'
    }));
  };

  const handleResume = () => {
    sound.playDialogAdvance();
    setGameState(prev => ({
      ...prev,
      phase: prev.previousPhase || 'PLAYING_CLEANING'
    }));
  };

  const handleRestart = () => {
    setShowSortingModal(false);
    setShowHowToPlay(false);
    setGameState({
      phase: 'PLAYING_CLEANING',
      environmentHealth: 35,
      communityScore: 25,
      wasteItems: JSON.parse(JSON.stringify(INITIAL_WASTE_ITEMS)),
      sources: JSON.parse(JSON.stringify(INVESTIGATION_SOURCES)),
      activeSourceId: null,
      activeWasteId: null,
      activeChainWaste: null,
      sortingAccuracyMistakes: 0,
      drainCleaned: false,
      player: {
        x: 520,
        y: 460,
        targetX: 520,
        targetY: 460,
        vx: 0,
        vy: 0,
        speed: 3.6,
        direction: 'down',
        isMoving: false
      },
      audioMuted: gameState.audioMuted,
      outcome: undefined
    });
  };

  // 1. COLLECT WASTE ITEM
  const handleCollectWaste = useCallback((waste: WasteItem) => {
    sound.playCollect();
    setGameState(prev => {
      const updatedWaste = prev.wasteItems.map(w =>
        w.id === waste.id ? { ...w, collected: true } : w
      );
      const newHealth = Math.min(65, prev.environmentHealth + 2);
      return {
        ...prev,
        wasteItems: updatedWaste,
        environmentHealth: newHealth,
        activeChainWaste: waste // Trigger brief pollution chain popup
      };
    });
  }, []);

  // 2. SORT WASTE MINIGAME
  const handleSortSuccess = (wasteId: string, category: WasteCategory) => {
    setGameState(prev => {
      const updated = prev.wasteItems.map(w =>
        w.id === wasteId ? { ...w, sorted: true } : w
      );
      const allSorted = updated.every(w => w.sorted);
      const newHealth = Math.min(75, prev.environmentHealth + 1);

      return {
        ...prev,
        wasteItems: updated,
        environmentHealth: newHealth
      };
    });
  };

  const handleSortMistake = (wasteId: string, attemptedCategory: WasteCategory) => {
    setGameState(prev => ({
      ...prev,
      sortingAccuracyMistakes: prev.sortingAccuracyMistakes + 1
    }));
  };

  // Close sorting modal; if all 14 items collected & sorted, trigger surprise moment!
  const handleCloseSorting = () => {
    setShowSortingModal(false);
    const allCollected = gameState.wasteItems.every(w => w.collected);
    const allSorted = gameState.wasteItems.every(w => w.sorted);

    if (allCollected && allSorted && gameState.phase === 'PLAYING_CLEANING') {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, phase: 'SURPRISE_CUTSCENE' }));
      }, 350);
    }
  };

  // 3. SURPRISE CUTSCENE -> INVESTIGATION PHASE
  const handleStartInvestigation = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'PLAYING_INVESTIGATION'
    }));
  };

  // 4. INTERACT WITH CLUE SOURCE / NPC
  const handleInteractSource = useCallback((source: ClueSource) => {
    sound.playDialogAdvance();
    setGameState(prev => ({
      ...prev,
      activeSourceId: source.id
    }));
  }, []);

  const handleClueDiscovered = (sourceId: string) => {
    setGameState(prev => {
      const updatedSources = prev.sources.map(s =>
        s.id === sourceId ? { ...s, investigated: true } : s
      );
      const allInvestigated = updatedSources.every(s => s.investigated);
      return {
        ...prev,
        sources: updatedSources,
        communityScore: prev.communityScore + 10,
        activeSourceId: null
      };
    });
  };

  // Check if all 4 sources investigated
  const allSourcesInvestigated = gameState.sources.every(s => s.investigated);

  // 5. PREVENTION COUNCIL DECISIONS
  const handleCompleteCouncilDecisions = (selections: { [sourceId: string]: string }) => {
    let systemicCount = 0;
    const updatedSources = gameState.sources.map(s => {
      const chosenId = selections[s.id];
      const choiceObj = s.choices.find(c => c.id === chosenId);
      if (choiceObj && choiceObj.type === 'SYSTEMIC') {
        systemicCount++;
      }
      return {
        ...s,
        selectedChoiceId: chosenId
      };
    });

    let computedOutcome: EnvironmentalOutcome = 'THRIVING';
    let finalHealth = 92;
    let finalComm = 95;

    if (systemicCount >= 3) {
      computedOutcome = 'THRIVING';
      finalHealth = 94;
      finalComm = 92;
    } else if (systemicCount === 2) {
      computedOutcome = 'BAND_AID';
      finalHealth = 65;
      finalComm = 60;
    } else {
      computedOutcome = 'RELAPSED';
      finalHealth = 30;
      finalComm = 35;
    }

    setGameState(prev => ({
      ...prev,
      sources: updatedSources,
      outcome: computedOutcome,
      environmentHealth: finalHealth,
      communityScore: finalComm,
      phase: 'TIME_JUMP'
    }));
  };

  // 6. TIME JUMP -> PLAYING_WEEK_LATER
  const handleFinishTimeJump = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'PLAYING_WEEK_LATER'
    }));
  };

  // 7. FINALE
  const handleOpenFinale = () => {
    sound.playAchievement();
    setGameState(prev => ({
      ...prev,
      phase: 'HACKATHON_FINALE'
    }));
  };

  // Mobile Action Button handler (contextual)
  const handleMobileActionBtn = () => {
    const uncollectedNearby = gameState.wasteItems.find(
      w => !w.collected && Math.hypot(w.x - gameState.player.x, w.y - gameState.player.y) < 70
    );
    if (uncollectedNearby) {
      handleCollectWaste(uncollectedNearby);
      return;
    }

    const sourceNearby = gameState.sources.find(
      s => Math.hypot(s.x - gameState.player.x, s.y - gameState.player.y) < 80
    );
    if (sourceNearby) {
      handleInteractSource(sourceNearby);
      return;
    }

    // Otherwise open sorting station
    setShowSortingModal(true);
  };

  const activeSource = gameState.sources.find(s => s.id === gameState.activeSourceId);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none text-slate-100">
      {/* 2D EXPLORABLE GAME WORLD */}
      <GameCanvas
        gameState={gameState}
        onCollectWaste={handleCollectWaste}
        onInteractSource={handleInteractSource}
        onOpenSorting={() => setShowSortingModal(true)}
        joystickDelta={joystickDelta}
      />

      {/* TOP & BOTTOM HUD (Visible during gameplay) */}
      {(gameState.phase === 'PLAYING_CLEANING' ||
        gameState.phase === 'PLAYING_INVESTIGATION' ||
        gameState.phase === 'PLAYING_WEEK_LATER') && (
        <HUD
          gameState={gameState}
          onOpenSorting={() => setShowSortingModal(true)}
          onTogglePause={handlePause}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onToggleAudio={handleToggleAudio}
          onActionBtn={handleMobileActionBtn}
          onJoystickMove={setJoystickDelta}
        />
      )}

      {/* CALLOUT BANNER: IF ALL 4 SOURCES INVESTIGATED, PROMPT COUNCIL */}
      {gameState.phase === 'PLAYING_INVESTIGATION' && allSourcesInvestigated && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            onClick={() => {
              sound.playAchievement();
              setGameState(prev => ({ ...prev, phase: 'PREVENTION_COUNCIL' }));
            }}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-2 animate-bounce cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>All 4 Sources Found! Convene Prevention Council</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* CALLOUT BANNER: WEEK LATER FINALE TRIGGER */}
      {gameState.phase === 'PLAYING_WEEK_LATER' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            onClick={handleOpenFinale}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-2 animate-pulse cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>View Hackathon Environmental Presentation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* MODALS & SCREENS */}

      {/* Title Screen */}
      {gameState.phase === 'TITLE' && (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          audioMuted={gameState.audioMuted}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* How To Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => setShowHowToPlay(false)}
          onStartGame={gameState.phase === 'TITLE' ? handleStartGame : undefined}
        />
      )}

      {/* Waste Sorting Minigame */}
      {showSortingModal && (
        <WasteSortingModal
          wasteItems={gameState.wasteItems}
          onSortSuccess={handleSortSuccess}
          onSortMistake={handleSortMistake}
          onClose={handleCloseSorting}
        />
      )}

      {/* Pollution Chain Modal (Consequence of leaving waste behind) */}
      {gameState.activeChainWaste && (
        <PollutionChainModal
          wasteItem={gameState.activeChainWaste}
          onClose={() => setGameState(prev => ({ ...prev, activeChainWaste: null }))}
        />
      )}

      {/* Surprise Cutscene (Realization that cleaning alone isn't enough) */}
      {gameState.phase === 'SURPRISE_CUTSCENE' && (
        <SurpriseCutscene onStartInvestigation={handleStartInvestigation} />
      )}

      {/* Investigation Dialog (Talking to NPCs) */}
      {activeSource && (
        <InvestigationDialog
          source={activeSource}
          gameState={gameState}
          onClueDiscovered={handleClueDiscovered}
          onClose={() => setGameState(prev => ({ ...prev, activeSourceId: null }))}
        />
      )}

      {/* Prevention Council Modal */}
      {gameState.phase === 'PREVENTION_COUNCIL' && (
        <PreventionCouncilModal
          sources={gameState.sources}
          onCompleteDecisions={handleCompleteCouncilDecisions}
        />
      )}

      {/* Time Jump 1 Week Later Cutscene */}
      {gameState.phase === 'TIME_JUMP' && (
        <TimeJumpCutscene onFinishTimeJump={handleFinishTimeJump} />
      )}

      {/* Hackathon Finale Climax Presentation */}
      {gameState.phase === 'HACKATHON_FINALE' && (
        <HackathonFinaleModal
          gameState={gameState}
          onRestart={handleRestart}
        />
      )}

      {/* Pause Modal */}
      {gameState.phase === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          audioMuted={gameState.audioMuted}
          onToggleAudio={handleToggleAudio}
        />
      )}
    </main>
  );
}
