import type { Card, Rank, RuleDefinition } from './types';

// ── Classic King's Cup default ruleset ────────────────────────────

export const DEFAULT_RULES: RuleDefinition[] = [
  { rank: 'A',  label: 'Waterfall',         prompt: 'Everyone drinks in order. You can\'t stop until the person before you stops.' },
  { rank: '2',  label: 'You',               prompt: 'Pick someone to drink.' },
  { rank: '3',  label: 'Me',                prompt: 'You drink.' },
  { rank: '4',  label: 'Floor',             prompt: 'Last person to touch the floor drinks.' },
  { rank: '5',  label: 'Guys',              prompt: 'All guys drink.' },
  { rank: '6',  label: 'Chicks',            prompt: 'All girls drink.' },
  { rank: '7',  label: 'Heaven',            prompt: 'Last person to raise their hand drinks.' },
  { rank: '8',  label: 'Mate',              prompt: 'Pick a mate — they drink when you drink for the rest of the game.' },
  { rank: '9',  label: 'Rhyme',             prompt: 'Say a word. Go around rhyming it. First person who can\'t, drinks.' },
  { rank: '10', label: 'Categories',        prompt: 'Pick a category. Go around naming things in it. First person who can\'t, drinks.' },
  { rank: 'J',  label: 'Never Have I Ever', prompt: 'Hold up 3 fingers. Take turns saying "Never have I ever…" — put a finger down if you have. First to zero drinks.' },
  { rank: 'Q',  label: 'Questions',         prompt: 'Ask someone a question. They must respond with a question. First person who doesn\'t, drinks.' },
  { rank: 'K',  label: 'Make a Rule',       prompt: 'Make a rule everyone must follow. Break it = drink. On the 4th King, finish the King\'s Cup!' },
];

/**
 * Resolve which rule applies to a drawn card.
 */
export function resolveRule(card: Card, rules: RuleDefinition[]): RuleDefinition {
  const rule = rules.find((r) => r.rank === card.rank);
  if (!rule) {
    // Fallback — should never happen with a valid ruleset
    return { rank: card.rank, label: 'Unknown', prompt: 'No rule defined for this card.' };
  }
  return rule;
}

/**
 * Validate that a ruleset covers all 13 ranks.
 */
export function validateRules(rules: RuleDefinition[]): { valid: boolean; missing: Rank[] } {
  const allRanks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const covered = new Set(rules.map((r) => r.rank));
  const missing = allRanks.filter((r) => !covered.has(r));
  return { valid: missing.length === 0, missing };
}
