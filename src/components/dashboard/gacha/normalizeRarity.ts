import type { RarityTier } from '../../../types/dashboard';

const KNOWN_RARITIES: RarityTier[] = ['mythic', 'legendary', 'epic', 'rare', 'common'];

/** petakan string rarity dari backend ke tier fe; default ke common bila tidak dikenal. */
export function normalizeRarity(raw: string | null | undefined): RarityTier {
  const value = typeof raw === 'string' ? raw.toLowerCase() : '';
  return (KNOWN_RARITIES.find((tier) => tier === value) ?? 'common') as RarityTier;
}
