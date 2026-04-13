import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { DrawResult, GameState } from '../engine/types';
import { loadSession } from '../hooks/usePersistence';
import Card from '../components/Card';
import ConfirmModal from '../components/ConfirmModal';

interface GameScreenProps {
  gameState: GameState | null;
  lastDraw: DrawResult | null;
  cardRevealed: boolean;
  onDraw: () => DrawResult | null;
  onReveal: () => void;
  onNextTurn: () => void;
  onReset: () => void;
  onRestore: (state: GameState) => void;
}

export default function GameScreen({
  gameState,
  lastDraw,
  cardRevealed,
  onDraw,
  onReveal,
  onNextTurn,
  onReset,
  onRestore,
}: GameScreenProps) {
  const navigate = useNavigate();
  const [showQuit, setShowQuit] = useState(false);
  const [showKing4, setShowKing4] = useState(false);

  // Restore session on mount if no active game
  useEffect(() => {
    if (!gameState) {
      const saved = loadSession();
      if (saved && saved.status === 'playing') {
        onRestore(saved);
      } else {
        navigate('/setup');
      }
    }
  }, [gameState, navigate, onRestore]);

  // Handle game over
  useEffect(() => {
    if (gameState?.status === 'king4') {
      setShowKing4(true);
    }
  }, [gameState?.status]);

  if (!gameState) return null;

  const { config, deck, discard, kingsDrawn, currentPlayerIndex, status } = gameState;
  const currentPlayer = config.players[currentPlayerIndex];
  const totalCards = deck.length + discard.length;
  const cardsRemaining = deck.length;

  const handleDrawTap = () => {
    if (lastDraw && !cardRevealed) {
      onReveal();
    } else if (!lastDraw && status === 'playing') {
      const result = onDraw();
      if (result) {
        // small delay then reveal automatically
        setTimeout(() => onReveal(), 100);
      }
    }
  };

  const handleNextTurn = () => {
    onNextTurn();
  };

  const handleQuit = () => {
    onReset();
    navigate('/');
  };

  const handleEndGame = () => {
    setShowKing4(false);
    navigate('/summary');
  };

  return (
    <div className="screen screen--game">
      {/* Top Bar */}
      <header className="game__header">
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => setShowQuit(true)}
          id="quit-game-btn"
        >
          ✕
        </button>
        <div className="game__deck-count">
          <span className="game__deck-number">{cardsRemaining}</span>
          <span className="game__deck-label">/{totalCards}</span>
        </div>
        <div className="game__kings">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`game__king-icon ${i < kingsDrawn ? 'game__king-icon--filled' : ''}`}
            >
              ♔
            </span>
          ))}
        </div>
      </header>

      {/* Current Player */}
      <div className="game__player-turn">
        {!lastDraw ? (
          <p className="game__player-name">{currentPlayer}'s turn</p>
        ) : (
          <p className="game__player-name game__player-name--drew">
            {lastDraw.player} drew
          </p>
        )}
      </div>

      {/* Card Area */}
      <div className="game__card-area">
        {lastDraw ? (
          <Card card={lastDraw.card} revealed={cardRevealed} onTap={!cardRevealed ? handleDrawTap : undefined} />
        ) : (
          <Card revealed={false} onTap={handleDrawTap} />
        )}

        {!lastDraw && status === 'playing' && (
          <p className="game__tap-hint">Tap to draw</p>
        )}
      </div>

      {/* Rule Display */}
      {lastDraw && cardRevealed && (
        <div className="game__rule-display">
          <h2 className="game__rule-label">{lastDraw.rule.label}</h2>
          <p className="game__rule-prompt">{lastDraw.rule.prompt}</p>
        </div>
      )}

      {/* Action Button */}
      {lastDraw && cardRevealed && status !== 'king4' && (
        <div className="game__action">
          <button
            className="btn btn--primary btn--xl"
            onClick={handleNextTurn}
            id="next-turn-btn"
          >
            Next Player →
          </button>
        </div>
      )}

      {status === 'finished' && (
        <div className="game__action">
          <button
            className="btn btn--primary btn--xl"
            onClick={() => navigate('/summary')}
          >
            View Summary
          </button>
        </div>
      )}

      {/* 4th King Overlay */}
      {showKing4 && (
        <div className="game__king4-overlay">
          <div className="game__king4-content">
            <span className="game__king4-crown">👑</span>
            <h2 className="game__king4-title">4th King!</h2>
            <p className="game__king4-text">
              {lastDraw?.player} drew the final King!<br />
              Time to drink the King's Cup!
            </p>
            <button
              className="btn btn--primary btn--xl"
              onClick={handleEndGame}
              id="end-game-btn"
            >
              End Game
            </button>
          </div>
        </div>
      )}

      {/* Quit Confirmation */}
      <ConfirmModal
        open={showQuit}
        title="Quit Game?"
        message="Your progress will be lost. Are you sure?"
        confirmLabel="Quit"
        onConfirm={handleQuit}
        onCancel={() => setShowQuit(false)}
        danger
      />
    </div>
  );
}
