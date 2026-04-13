import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { RuleDefinition } from '../engine/types';
import { DEFAULT_RULES } from '../engine/rules';
import {
  loadCustomRules,
  loadPlayerList,
  saveCustomRules,
  savePlayerList,
} from '../hooks/usePersistence';
import PlayerBadge from '../components/PlayerBadge';
import RuleEditorRow from '../components/RuleEditor';

interface SetupProps {
  onStartGame: (players: string[], rules: RuleDefinition[]) => void;
}

export default function Setup({ onStartGame }: SetupProps) {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [rules, setRules] = useState<RuleDefinition[]>(DEFAULT_RULES);
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState('');

  // Load persisted data on mount
  useEffect(() => {
    const savedPlayers = loadPlayerList();
    if (savedPlayers && savedPlayers.length > 0) {
      setPlayers(savedPlayers);
    }
    const savedRules = loadCustomRules();
    if (savedRules) {
      setRules(savedRules);
    }
  }, []);

  const addPlayer = () => {
    const name = newName.trim();
    if (!name) {
      setError('Enter a name');
      return;
    }
    if (players.length >= 12) {
      setError('Maximum 12 players');
      return;
    }
    if (players.some((p) => p.toLowerCase() === name.toLowerCase())) {
      setError('Name already added');
      return;
    }
    setPlayers([...players, name]);
    setNewName('');
    setError('');
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, updated: RuleDefinition) => {
    const next = [...rules];
    next[index] = updated;
    setRules(next);
  };

  const resetRules = () => {
    setRules([...DEFAULT_RULES]);
  };

  const handleStart = () => {
    if (players.length < 2) {
      setError('Need at least 2 players');
      return;
    }
    savePlayerList(players);
    saveCustomRules(rules);
    onStartGame(players, rules);
    navigate('/game');
  };

  const isRuleModified = (index: number) => {
    const def = DEFAULT_RULES[index];
    const cur = rules[index];
    return def.label !== cur.label || def.prompt !== cur.prompt;
  };

  return (
    <div className="screen screen--setup">
      <header className="setup__header">
        <button className="btn btn--ghost btn--sm" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className="setup__title">Game Setup</h1>
      </header>

      {/* Player Input */}
      <section className="setup__section">
        <h2 className="setup__section-title">
          Players
          <span className="setup__count">{players.length}/12</span>
        </h2>

        <div className="setup__input-row">
          <input
            className="input"
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Enter player name"
            maxLength={20}
            id="player-name-input"
          />
          <button
            className="btn btn--primary"
            onClick={addPlayer}
            id="add-player-btn"
          >
            Add
          </button>
        </div>

        {error && <p className="setup__error">{error}</p>}

        <div className="setup__players">
          {players.map((name, i) => (
            <PlayerBadge key={i} name={name} onRemove={() => removePlayer(i)} />
          ))}
          {players.length === 0 && (
            <p className="setup__empty">Add at least 2 players to start</p>
          )}
        </div>
      </section>

      {/* Rules Section */}
      <section className="setup__section">
        <div className="setup__section-header">
          <h2
            className="setup__section-title setup__section-title--clickable"
            onClick={() => setShowRules(!showRules)}
          >
            {showRules ? '▾' : '▸'} Card Rules
            {rules.some((_, i) => isRuleModified(i)) && (
              <span className="setup__modified-badge">Modified</span>
            )}
          </h2>
          {showRules && (
            <button className="btn btn--ghost btn--sm" onClick={resetRules}>
              Reset to Default
            </button>
          )}
        </div>

        {showRules && (
          <div className="setup__rules">
            {rules.map((rule, i) => (
              <RuleEditorRow
                key={rule.rank}
                rule={rule}
                onChange={(updated) => handleRuleChange(i, updated)}
                isModified={isRuleModified(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Start Button */}
      <div className="setup__footer">
        <button
          className="btn btn--primary btn--xl"
          onClick={handleStart}
          disabled={players.length < 2}
          id="start-game-btn"
        >
          {players.length < 2
            ? `Need ${2 - players.length} more player${players.length === 0 ? 's' : ''}`
            : `Start with ${players.length} players`}
        </button>
      </div>
    </div>
  );
}
