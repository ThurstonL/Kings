import { useCallback, useEffect, useRef, useState } from 'react';
import type { DrawResult, GameState, RuleDefinition } from '../engine/types';
import { drawCard, initGameState, advanceTurn } from '../engine/deck';
import { clearSession, saveSession, loadActiveDraw, saveActiveDraw } from './usePersistence';

export interface UseGameReturn {
  gameState: GameState | null;
  lastDraw: DrawResult | null;
  cardRevealed: boolean;
  startGame: (players: string[], rules: RuleDefinition[]) => void;
  draw: () => DrawResult | null;
  revealCard: () => void;

  nextTurn: () => void;
  resetGame: () => void;
  restoreGame: (state: GameState) => void;
}

export function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [lastDraw, setLastDraw] = useState<DrawResult | null>(null);
  const [cardRevealed, setCardRevealed] = useState(false);
  const gameStateRef = useRef<GameState | null>(null);

  // Sync active draw state to localStorage automatically on any change
  useEffect(() => {
    if (gameState !== null) {
      saveActiveDraw(lastDraw, cardRevealed);
    }
  }, [lastDraw, cardRevealed, gameState]);

  const startGame = useCallback((players: string[], rules: RuleDefinition[]) => {
    const state = initGameState(players, rules);
    gameStateRef.current = state;
    setGameState(state);
    setLastDraw(null);
    setCardRevealed(false);
    saveSession(state);
  }, []);

  const restoreGame = useCallback((state: GameState) => {
    gameStateRef.current = state;
    setGameState(state);
    const active = loadActiveDraw();
    setLastDraw(active.draw);
    setCardRevealed(active.revealed);
  }, []);

  const draw = useCallback((): DrawResult | null => {
    const current = gameStateRef.current;
    if (!current || current.status !== 'playing') return null;

    try {
      const { result, nextState } = drawCard(current);
      gameStateRef.current = nextState;
      setGameState(nextState);
      setLastDraw(result);
      setCardRevealed(false);
      saveSession(nextState);
      return result;
    } catch {
      return null;
    }
  }, []);

  const revealCard = useCallback(() => {
    setCardRevealed(true);
  }, []);


  const nextTurn = useCallback(() => {
    const current = gameStateRef.current;
    if (current && current.status === 'playing') {
      const nextState = advanceTurn(current);
      gameStateRef.current = nextState;
      setGameState(nextState);
      saveSession(nextState);
    }
    
    setLastDraw(null);
    setCardRevealed(false);
  }, []);

  const resetGame = useCallback(() => {
    gameStateRef.current = null;
    setGameState(null);
    setLastDraw(null);
    setCardRevealed(false);
    clearSession();
  }, []);

  return {
    gameState,
    lastDraw,
    cardRevealed,
    startGame,
    draw,
    revealCard,

    nextTurn,
    resetGame,
    restoreGame,
  };
}
