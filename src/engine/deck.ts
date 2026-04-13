import type { Card, DrawResult, GameState } from './types';
import { RANKS, SUITS } from './types';
import { resolveRule } from './rules';

/**
 * Create a fresh 52-card deck.
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

/**
 * Fisher-Yates shuffle — mutates and returns the array.
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const d = [...deck]; // work on a copy
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

/**
 * Initialize a new game state from a config.
 */
export function initGameState(
  players: string[],
  rules: import('./types').RuleDefinition[],
): GameState {
  return {
    config: { players, rules },
    deck: shuffleDeck(createDeck()),
    discard: [],
    kingsDrawn: 0,
    currentPlayerIndex: 0,
    status: 'playing',
    kingPlayers: [],
  };
}

/**
 * Draw the top card from the deck. Returns the draw result and next game state.
 * Pure function — does not mutate.
 */
export function drawCard(state: GameState): { result: DrawResult; nextState: GameState } {
  if (state.deck.length === 0 || state.status !== 'playing') {
    throw new Error('Cannot draw: deck is empty or game is over.');
  }

  const [card, ...remainingDeck] = state.deck;
  const currentPlayer = state.config.players[state.currentPlayerIndex];
  const rule = resolveRule(card, state.config.rules);

  let kingsDrawn = state.kingsDrawn;
  const kingPlayers = [...state.kingPlayers];

  if (card.rank === 'K') {
    kingsDrawn += 1;
    kingPlayers.push(currentPlayer);
  }

  const isGameOver = kingsDrawn >= 4;
  const nextPlayerIndex = isGameOver
    ? state.currentPlayerIndex
    : (state.currentPlayerIndex + 1) % state.config.players.length;

  const nextState: GameState = {
    ...state,
    deck: remainingDeck,
    discard: [...state.discard, card],
    kingsDrawn,
    kingPlayers,
    currentPlayerIndex: nextPlayerIndex,
    status: isGameOver ? 'king4' : (remainingDeck.length === 0 ? 'finished' : 'playing'),
  };

  const result: DrawResult = {
    card,
    rule,
    player: currentPlayer,
    remainingCards: remainingDeck.length,
    isGameOver,
    kingsDrawn,
  };

  return { result, nextState };
}
