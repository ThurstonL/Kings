import type { GameState, RuleDefinition } from '../engine/types';

const KEYS = {
  session: 'kings-cup-session',
  players: 'kings-cup-players',
  rules: 'kings-cup-custom-rules',
} as const;

// ── Session persistence ──────────────────────────────────────────

export function saveSession(state: GameState): void {
  try {
    localStorage.setItem(KEYS.session, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silent fail
  }
}

export function loadSession(): GameState | null {
  try {
    const raw = localStorage.getItem(KEYS.session);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // Basic validation
    if (!parsed.deck || !parsed.config || !Array.isArray(parsed.config.players)) {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEYS.session);
  } catch {
    // Silent fail
  }
}

// ── Player list persistence ──────────────────────────────────────

export function savePlayerList(names: string[]): void {
  try {
    localStorage.setItem(KEYS.players, JSON.stringify(names));
  } catch {
    // Silent fail
  }
}

export function loadPlayerList(): string[] | null {
  try {
    const raw = localStorage.getItem(KEYS.players);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((n: unknown) => typeof n === 'string' && n.trim().length > 0);
  } catch {
    return null;
  }
}

// ── Custom rules persistence ─────────────────────────────────────

export function saveCustomRules(rules: RuleDefinition[]): void {
  try {
    localStorage.setItem(KEYS.rules, JSON.stringify(rules));
  } catch {
    // Silent fail
  }
}

export function loadCustomRules(): RuleDefinition[] | null {
  try {
    const raw = localStorage.getItem(KEYS.rules);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 13) return null;
    return parsed as RuleDefinition[];
  } catch {
    return null;
  }
}

export function clearCustomRules(): void {
  try {
    localStorage.removeItem(KEYS.rules);
  } catch {
    // Silent fail
  }
}
