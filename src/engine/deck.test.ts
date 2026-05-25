import { describe, it, expect } from 'vitest';
import { createDeck, shuffleDeck, drawCard, advanceTurn, initGameState } from './deck';
import { DEFAULT_RULES } from './rules';

describe('createDeck', () => {
  it('produces exactly 52 cards', () => {
    expect(createDeck()).toHaveLength(52);
  });

  it('has no duplicate cards', () => {
    const deck = createDeck();
    const keys = deck.map((c) => `${c.rank}-${c.suit}`);
    expect(new Set(keys).size).toBe(52);
  });

  it('contains all 4 suits and all 13 ranks', () => {
    const deck = createDeck();
    const suits = new Set(deck.map((c) => c.suit));
    const ranks = new Set(deck.map((c) => c.rank));
    expect(suits.size).toBe(4);
    expect(ranks.size).toBe(13);
  });
});

describe('shuffleDeck', () => {
  it('returns the same number of cards', () => {
    const deck = createDeck();
    expect(shuffleDeck(deck)).toHaveLength(52);
  });

  it('does not mutate the original deck', () => {
    const deck = createDeck();
    const firstCard = deck[0];
    shuffleDeck(deck);
    expect(deck[0]).toBe(firstCard);
  });

  it('contains the same cards as the input', () => {
    const deck = createDeck();
    const shuffled = shuffleDeck(deck);
    const toKey = (c: { rank: string; suit: string }) => `${c.rank}-${c.suit}`;
    expect(shuffled.map(toKey).sort()).toEqual(deck.map(toKey).sort());
  });
});

describe('drawCard', () => {
  it('moves a card from deck to discard', () => {
    const state = initGameState(['Alice', 'Bob'], DEFAULT_RULES);
    const { nextState } = drawCard(state);
    expect(nextState.deck).toHaveLength(51);
    expect(nextState.discard).toHaveLength(1);
  });

  it('does not mutate the original state', () => {
    const state = initGameState(['Alice'], DEFAULT_RULES);
    drawCard(state);
    expect(state.deck).toHaveLength(52);
    expect(state.discard).toHaveLength(0);
  });

  it('returns the correct current player in the result', () => {
    const state = initGameState(['Alice', 'Bob'], DEFAULT_RULES);
    const { result } = drawCard(state);
    expect(result.player).toBe('Alice');
  });

  it('reports remaining cards correctly', () => {
    const state = initGameState(['Alice'], DEFAULT_RULES);
    const { result } = drawCard(state);
    expect(result.remainingCards).toBe(51);
  });

  it('throws when the deck is empty', () => {
    const state = initGameState(['Alice'], DEFAULT_RULES);
    const emptyState = { ...state, deck: [] };
    expect(() => drawCard(emptyState)).toThrow();
  });

  it('throws when the game is not in playing status', () => {
    const state = initGameState(['Alice'], DEFAULT_RULES);
    const finishedState = { ...state, status: 'finished' as const };
    expect(() => drawCard(finishedState)).toThrow();
  });

  it('increments kingsDrawn when a King is drawn', () => {
    const state = initGameState(['Alice'], DEFAULT_RULES);
    const kingCard = { rank: 'K' as const, suit: 'hearts' as const };
    const stateWithKingOnTop = { ...state, deck: [kingCard, ...state.deck.slice(1)] };
    const { nextState } = drawCard(stateWithKingOnTop);
    expect(nextState.kingsDrawn).toBe(1);
  });

  it('sets status to kingsCup and loserPlayer on the 4th King', () => {
    const state = initGameState(['Alice'], DEFAULT_RULES);
    const kingCard = { rank: 'K' as const, suit: 'hearts' as const };
    const stateWith3Kings = { ...state, deck: [kingCard, ...state.deck.slice(1)], kingsDrawn: 3 };
    const { nextState } = drawCard(stateWith3Kings);
    expect(nextState.status).toBe('kingsCup');
    expect(nextState.loserPlayer).toBe('Alice');
  });

  it('sets status to finished when the last card is drawn', () => {
    const state = initGameState(['Alice'], DEFAULT_RULES);
    const [lastCard] = state.deck;
    const oneCardState = { ...state, deck: [lastCard] };
    const { nextState } = drawCard(oneCardState);
    expect(nextState.status).toBe('finished');
    expect(nextState.deck).toHaveLength(0);
  });
});

describe('advanceTurn', () => {
  it('moves to the next player', () => {
    const state = initGameState(['Alice', 'Bob', 'Carol'], DEFAULT_RULES);
    expect(advanceTurn(state).currentPlayerIndex).toBe(1);
  });

  it('wraps back to the first player after the last player', () => {
    const state = initGameState(['Alice', 'Bob', 'Carol'], DEFAULT_RULES);
    const atEnd = { ...state, currentPlayerIndex: 2 };
    expect(advanceTurn(atEnd).currentPlayerIndex).toBe(0);
  });

  it('does nothing when the game is not in playing status', () => {
    const state = initGameState(['Alice', 'Bob'], DEFAULT_RULES);
    const finishedState = { ...state, status: 'finished' as const };
    expect(advanceTurn(finishedState).currentPlayerIndex).toBe(0);
  });
});
