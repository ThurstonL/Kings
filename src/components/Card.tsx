import { useState } from 'react';
import type { Card as CardType } from '../engine/types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../engine/types';

interface CardProps {
  card?: CardType;
  revealed: boolean;
  onTap?: () => void;
  size?: 'normal' | 'large';
}

export default function Card({ card, revealed, onTap, size = 'large' }: CardProps) {
  const [animating, setAnimating] = useState(false);

  const handleTap = () => {
    if (!onTap) return;
    if (!revealed) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }
    onTap();
  };

  const sizeClass = size === 'large' ? 'card--large' : 'card--normal';

  return (
    <div
      className={`card ${sizeClass} ${revealed ? 'card--revealed' : ''} ${animating ? 'card--flipping' : ''}`}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleTap()}
    >
      <div className="card__inner">
        {/* Card Back */}
        <div className="card__back">
          <div className="card__back-pattern">
            <span className="card__back-icon">♔</span>
          </div>
        </div>

        {/* Card Front */}
        <div className={`card__front ${card ? `card__front--${SUIT_COLORS[card.suit]}` : ''}`}>
          {card && (
            <>
              <div className="card__corner card__corner--top">
                <span className="card__rank">{card.rank}</span>
                <span className="card__suit">{SUIT_SYMBOLS[card.suit]}</span>
              </div>
              <div className="card__center">
                <span className="card__center-suit">{SUIT_SYMBOLS[card.suit]}</span>
              </div>
              <div className="card__corner card__corner--bottom">
                <span className="card__rank">{card.rank}</span>
                <span className="card__suit">{SUIT_SYMBOLS[card.suit]}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
