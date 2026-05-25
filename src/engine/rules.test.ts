import { describe, it, expect } from 'vitest';
import { DEFAULT_RULES, resolveRule, validateRules } from './rules';
import type { Card, Rank } from './types';
import { RANKS } from './types';

describe('DEFAULT_RULES', () => {
  it('covers all 13 ranks', () => {
    const covered = new Set(DEFAULT_RULES.map((r) => r.rank));
    expect(RANKS.every((r) => covered.has(r))).toBe(true);
  });

  it('has non-empty labels and prompts for every rule', () => {
    for (const rule of DEFAULT_RULES) {
      expect(rule.label.length).toBeGreaterThan(0);
      expect(rule.prompt.length).toBeGreaterThan(0);
    }
  });
});

describe('resolveRule', () => {
  it('returns the matching rule for a known rank', () => {
    const card: Card = { rank: 'K', suit: 'spades' };
    const rule = resolveRule(card, DEFAULT_RULES);
    expect(rule.rank).toBe('K');
    expect(rule.label).toBe("Make a Rule / King's Cup");
  });

  it('resolves correctly for all 13 ranks', () => {
    for (const rank of RANKS) {
      const card: Card = { rank, suit: 'hearts' };
      const rule = resolveRule(card, DEFAULT_RULES);
      expect(rule.rank).toBe(rank);
    }
  });

  it('returns a fallback rule when the rank is missing from the ruleset', () => {
    const card: Card = { rank: 'A', suit: 'hearts' };
    const rule = resolveRule(card, []); // empty ruleset
    expect(rule.label).toBe('Unknown');
    expect(rule.rank).toBe('A');
  });
});

describe('validateRules', () => {
  it('returns valid for a complete ruleset', () => {
    const { valid, missing } = validateRules(DEFAULT_RULES);
    expect(valid).toBe(true);
    expect(missing).toHaveLength(0);
  });

  it('returns invalid and lists missing ranks when incomplete', () => {
    const partial = DEFAULT_RULES.filter((r) => r.rank !== 'K' && r.rank !== 'A');
    const { valid, missing } = validateRules(partial);
    expect(valid).toBe(false);
    expect(missing).toContain('K' as Rank);
    expect(missing).toContain('A' as Rank);
    expect(missing).toHaveLength(2);
  });

  it('returns all 13 ranks as missing for an empty ruleset', () => {
    const { valid, missing } = validateRules([]);
    expect(valid).toBe(false);
    expect(missing).toHaveLength(13);
  });
});
