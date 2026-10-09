import type { DashboardTab } from '../../types/dashboard';
import { GAME_CATALOG, NAV_UTILITY_ITEMS, type NavUtilityItem } from '../../data/games';
import type { GlyphKey } from './glyphRegistry';

// item navigasi yang dibaca sidebar dan header. seluruh entri game diturunkan
// dari GAME_CATALOG supaya tab, label, dan ikon tidak pernah bercabang dari
// katalog tunggal; hanya utilitas akun yang didefinisikan sekali di sini.
export interface NavItem {
  id: DashboardTab;
  label: string;
  hint: string;
  glyphKey: GlyphKey;
  badge?: string;
  badgeType?: 'hot' | 'new' | 'fair' | 'live' | 'instant';
}

const GAME_BADGES: Partial<Record<DashboardTab, { badge: string; badgeType: NavItem['badgeType'] }>> = {
  gacha: { badge: 'HOT', badgeType: 'hot' },
  mystery_box: { badge: 'BARU', badgeType: 'new' },
  diamond_dice: { badge: 'FAIR', badgeType: 'fair' },
  gem_rain: { badge: 'LIVE', badgeType: 'live' },
  lucky_wheel: { badge: 'BARU', badgeType: 'new' },
  treasure_hunt: { badge: 'BARU', badgeType: 'new' },
};

const UTILITY_BADGES: Partial<Record<NavUtilityItem['tab'], { badge: string; badgeType: NavItem['badgeType'] }>> = {
  exchange: { badge: 'INSTANT', badgeType: 'instant' },
};

function toNavItem(game: (typeof GAME_CATALOG)[number]): NavItem {
  const badge = GAME_BADGES[game.tab];
  return {
    id: game.tab,
    label: game.title,
    hint: game.hint,
    glyphKey: game.glyphKey as GlyphKey,
    ...badge,
  };
}

function toUtilityItem(item: NavUtilityItem): NavItem {
  const badge = UTILITY_BADGES[item.tab];
  return {
    id: item.tab,
    label: item.label,
    hint: UTILITY_HINTS[item.tab],
    glyphKey: item.glyphKey as GlyphKey,
    ...badge,
  };
}

const UTILITY_HINTS: Record<NavUtilityItem['tab'], string> = {
  exchange: 'Tukar WL, DL, dan BGL',
  inventory: 'Koleksi hadiahmu',
  leaderboard: 'Pemenang terbaru',
  tutorial: 'Cara mengisi saldo',
};

// daftar minigame, diturunkan langsung dari katalog tunggal.
export const GAME_ITEMS: NavItem[] = GAME_CATALOG.map(toNavItem);

// daftar utilitas akun, satu definisi untuk sidebar dan header.
export const UTILITY_ITEMS: NavItem[] = NAV_UTILITY_ITEMS.map(toUtilityItem);
