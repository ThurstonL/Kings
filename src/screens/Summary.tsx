import { useNavigate } from 'react-router';
import type { GameState } from '../engine/types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../engine/types';
import { resolveRule } from '../engine/rules';
import { clearSession } from '../hooks/usePersistence';

interface SummaryProps {
  gameState: GameState | null;
  onReset: () => void;
  onPlayAgain: (players: string[], rules: import('../engine/types').RuleDefinition[]) => void;
}

export default function Summary({ gameState, onReset, onPlayAgain }: SummaryProps) {
  const navigate = useNavigate();

  if (!gameState) {
    navigate('/');
    return null;
  }

  const { config, discard, kingsDrawn, kingPlayers } = gameState;

  const handlePlayAgain = () => {
    onPlayAgain(config.players, config.rules);
    navigate('/game');
  };

  const handleNewGame = () => {
    onReset();
    clearSession();
    navigate('/setup');
  };

  return (
    <div className="screen screen--summary">
      <header className="summary__header">
        <span className="summary__crown">♔</span>
        <h1 className="summary__title">Game Over</h1>
        {kingsDrawn >= 4 && (
          <p className="summary__subtitle">The King's Cup has been claimed!</p>
        )}
      </header>

      {/* Stats */}
      <section className="summary__stats">
        <div className="summary__stat">
          <span className="summary__stat-value">{discard.length}</span>
          <span className="summary__stat-label">Cards Drawn</span>
        </div>
        <div className="summary__stat">
          <span className="summary__stat-value">{config.players.length}</span>
          <span className="summary__stat-label">Players</span>
        </div>
        <div className="summary__stat">
          <span className="summary__stat-value">{kingsDrawn}</span>
          <span className="summary__stat-label">Kings</span>
        </div>
      </section>

      {/* King History */}
      {kingPlayers.length > 0 && (
        <section className="summary__section">
          <h2 className="summary__section-title">Kings Drawn By</h2>
          <div className="summary__king-list">
            {kingPlayers.map((player, i) => (
              <div key={i} className="summary__king-item">
                <span className="summary__king-number">♔ King #{i + 1}</span>
                <span className="summary__king-player">{player}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Draw History */}
      <section className="summary__section">
        <h2 className="summary__section-title">Card History</h2>
        <div className="summary__history">
          {[...discard].reverse().map((card, i) => {
            const rule = resolveRule(card, config.rules);
            const playerIndex = (discard.length - 1 - i) % config.players.length;
            const player = config.players[playerIndex];
            const color = SUIT_COLORS[card.suit];
            return (
              <div key={i} className="summary__history-item">
                <span className={`summary__history-card summary__history-card--${color}`}>
                  {card.rank}{SUIT_SYMBOLS[card.suit]}
                </span>
                <span className="summary__history-rule">{rule.label}</span>
                <span className="summary__history-player">{player}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Actions */}
      <div className="summary__actions">
        <button
          className="btn btn--primary btn--xl"
          onClick={handlePlayAgain}
          id="play-again-btn"
        >
          Play Again
        </button>
        <button
          className="btn btn--ghost btn--lg"
          onClick={handleNewGame}
          id="new-game-btn"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
