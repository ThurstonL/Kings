// ── Core game types ──────────────────────────────────────────────

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7'
  | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const RANKS: Rank[] = [
  'A', '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'J', 'Q', 'K',
];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const SUIT_COLORS: Record<Suit, 'red' | 'black'> = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black',
};

export interface Card {
  rank: Rank;
  suit: Suit;
}

export interface RuleDefinition {
  rank: Rank;
  label: string;
  prompt: string;
}

export interface GameConfig {
  players: string[];
  rules: RuleDefinition[];
}

export type GameStatus = 'playing' | 'kingsCup' | 'finished';

export interface GameState {
  config: GameConfig;
  deck: Card[];
  discard: Card[];
  currentPlayerIndex: number;
  status: GameStatus;
  kingsDrawn: number;
  loserPlayer: string | null;
}

export interface DrawResult {
  card: Card;
  rule: RuleDefinition;
  player: string;
  remainingCards: number;
}

export interface SavedPreset {
  name: string;
  rules: RuleDefinition[];
  updatedAt: number;
}
