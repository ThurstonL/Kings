import { BrowserRouter, Routes, Route } from 'react-router';
import { useGame } from './hooks/useGame';
import Landing from './screens/Landing';
import Setup from './screens/Setup';
import GameScreen from './screens/Game';
import Summary from './screens/Summary';

export default function App() {
  const {
    gameState,
    lastDraw,
    cardRevealed,
    startGame,
    draw,
    revealCard,

    nextTurn,
    resetGame,
    restoreGame,
  } = useGame();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/setup"
          element={<Setup onStartGame={startGame} />}
        />
        <Route
          path="/game"
          element={
            <GameScreen
              gameState={gameState}
              lastDraw={lastDraw}
              cardRevealed={cardRevealed}
              onDraw={draw}
              onReveal={revealCard}

              onNextTurn={nextTurn}
              onReset={resetGame}
              onRestore={restoreGame}
            />
          }
        />
        <Route
          path="/summary"
          element={
            <Summary
              gameState={gameState}
              onReset={resetGame}
              onPlayAgain={startGame}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
