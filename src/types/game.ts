export type GamePhase =
  | 'TITLE'
  | 'HOW_TO_PLAY'
  | 'PLAYING_CLEANING'
  | 'SORTING_STATION'
  | 'SURPRISE_CUTSCENE'
  | 'PLAYING_INVESTIGATION'
  | 'PREVENTION_COUNCIL'
  | 'TIME_JUMP'
  | 'PLAYING_WEEK_LATER'
  | 'HACKATHON_FINALE'
  | 'PAUSED';

export type WasteCategory = 'ORGANIC' | 'RECYCLABLE' | 'HAZARDOUS' | 'E_WASTE';

export interface PollutionChainStep {
  label: string;
  icon: string;
  detail: string;
}

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  collected: boolean;
  sorted: boolean;
  description: string;
  ecoFact: string;
  wrongBinExplanation: string;
  pollutionChain: PollutionChainStep[];
}

export interface ClueSource {
  id: string;
  title: string;
  locationName: string;
  npcName: string;
  npcRole: string;
  x: number;
  y: number;
  dialogueInitial: string[];
  dialogueInvestigating: string[];
  dialogueWeekLaterThriving: string;
  dialogueWeekLaterBandAid: string;
  dialogueWeekLaterRelapsed: string;
  evidenceSummary: string;
  investigated: boolean;
  problemStatement: string;
  choices: {
    id: string;
    text: string;
    type: 'BAND_AID' | 'SYSTEMIC' | 'NEGLECT';
    explanation: string;
    weekLaterEffect: string;
  }[];
  selectedChoiceId?: string;
}

export type EnvironmentalOutcome = 'THRIVING' | 'BAND_AID' | 'RELAPSED';

export interface GameState {
  phase: GamePhase;
  previousPhase?: GamePhase;
  environmentHealth: number; // 0 to 100
  communityScore: number;    // 0 to 100
  wasteItems: WasteItem[];
  sources: ClueSource[];
  activeSourceId: string | null;
  activeWasteId: string | null;
  activeChainWaste: WasteItem | null;
  sortingAccuracyMistakes: number;
  drainCleaned: boolean;
  player: {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    speed: number;
    direction: 'left' | 'right' | 'up' | 'down';
    isMoving: boolean;
  };
  audioMuted: boolean;
  outcome?: EnvironmentalOutcome;
}
