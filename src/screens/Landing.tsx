import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadSession } from '../hooks/usePersistence';

export default function Landing() {
  const navigate = useNavigate();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setHasSession(session !== null && session.status === 'playing');
  }, []);

  return (
    <div className="screen screen--landing">
      <div className="landing__bg">
        {/* Decorative floating card suits */}
        <span className="landing__float landing__float--1">♠</span>
        <span className="landing__float landing__float--2">♥</span>
        <span className="landing__float landing__float--3">♦</span>
        <span className="landing__float landing__float--4">♣</span>
      </div>

      <div className="landing__content">
        <div className="landing__crown">♔</div>
        <h1 className="landing__title">King's Cup</h1>
        <p className="landing__subtitle">The classic drinking game, reimagined</p>

        <div className="landing__actions">
          <button
            className="btn btn--primary btn--xl"
            onClick={() => navigate('/setup')}
            id="start-game-btn"
          >
            Start Game
          </button>

          {hasSession && (
            <button
              className="btn btn--ghost btn--lg"
              onClick={() => navigate('/game')}
              id="resume-game-btn"
            >
              Resume Game
            </button>
          )}
        </div>

        <div className="landing__footer">
          <p>Pass the phone. Draw a card. Follow the rule.</p>
        </div>
      </div>
    </div>
  );
}
