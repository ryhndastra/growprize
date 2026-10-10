import type { GameDefinition } from '../types/dashboard';

// katalog tunggal semua game yang bisa dimainkan. baris ini adalah satu-satunya
// sumber tab game; sidebar, header, dan beranda membacanya agar label, ikon, dan
// biaya tidak pernah bercabang. setiap id wajib punya arena nyata di
// dashboard/games dan dashboard/gacha.
export const GAME_CATALOG: GameDefinition[] = [
  {
    id: 'gacha',
    tab: 'gacha',
    glyphKey: 'gacha',
    title: "It's Rainin' Prizes",
    hint: 'Peti roulette gacha item langka',
    cost: { usd: 0.15 },
  },
  {
    id: 'mystery_box',
    tab: 'mystery_box',
    glyphKey: 'mystery',
    title: 'Super Mystery Box',
    hint: 'Buka peti rahasia bertingkat wooden, golden, dan obsidian',
    cost: { usd: 0.15 },
  },
  {
    id: 'diamond_dice',
    tab: 'diamond_dice',
    glyphKey: 'gamepad',
    title: 'Diamond Dice',
    hint: 'Pasang taruhan dadu 1-100 dengan target over, under, atau seven',
    cost: { usd: 0.1 },
  },
  {
    id: 'gem_rain',
    tab: 'gem_rain',
    glyphKey: 'flame',
    title: 'Gem Rain Arena',
    hint: 'Tangkap hujan permata real-time dalam hitungan detik',
    cost: { usd: 0.2 },
  },
  {
    id: 'lucky_wheel',
    tab: 'lucky_wheel',
    glyphKey: 'wheel',
    title: 'Lucky Wheel',
    hint: 'Putar roda hadiah berlapis untuk jackpot lock dan gems',
    cost: { usd: 0.3 },
  },
  {
    id: 'treasure_hunt',
    tab: 'treasure_hunt',
    glyphKey: 'scratch',
    title: 'Treasure Hunt',
    hint: 'Gali lima petak dan temukan harta karun tersembunyi',
    cost: { usd: 0.4 },
  },
];

export interface NavUtilityItem {
  tab: 'leaderboard' | 'tutorial';
  label: string;
  glyphKey: string;
  /** hanya informasi nyata; jumlah inventori diisi runtime oleh sidebar. */
  countKey?: 'inventory';
}

// utilitas non-game yang tetap hidup di sidebar (exchange dan inventory dihapus dari sidebar sesuai permintaan Sho).
export const NAV_UTILITY_ITEMS: NavUtilityItem[] = [
  { tab: 'leaderboard', label: 'Live Jackpot', glyphKey: 'flame' },
  { tab: 'tutorial', label: 'Cara Isi Saldo', glyphKey: 'home' },
];
