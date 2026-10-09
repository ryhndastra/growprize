export type DashboardTab =
  | 'hub'
  | 'gacha'
  | 'mystery_box'
  | 'diamond_dice'
  | 'gem_rain'
  | 'lucky_wheel'
  | 'treasure_hunt'
  | 'inventory'
  | 'leaderboard'
  | 'tutorial';

export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface WalletBalance {
  wls: number;
  dls: number;
  bgls: number;
  gems: number;
}

export interface PlayerProfile {
  growId: string;
  level: number;
  world: string;
  serverPingMs: number;
  avatarPose: string;
  /** True while the player has not linked a real GrowID account. */
  isGuest?: boolean;
}

export interface GachaItem {
  id: string;
  name: string;
  category: 'wings' | 'hand' | 'hat' | 'device' | 'consumable' | 'artifact';
  rarity: RarityTier;
  dropRatePercent: number;
  valueInDls: number;
  /** Key referencing a vector sprite in GachaSprites.tsx (no emoji). */
  icon: GachaSpriteKey;
  /** Growtopia numeric item id for the remote icon endpoint. */
  itemId?: number;
  description: string;
  glowColor: string;
}

export type GachaSpriteKey =
  | 'rayman'
  | 'magplant'
  | 'ankh'
  | 'phoenix'
  | 'dragon'
  | 'davinci'
  | 'gown'
  | 'eyes'
  | 'apple'
  | 'saber'
  | 'devilWings'
  | 'wlsBundle'
  | 'gemSack';

export interface LiveDropRecord {
  id: string;
  player: string;
  item: GachaItem;
  timestamp: string;
  chestType: 'bronze' | 'silver' | 'gold' | 'super';
}

export interface BroadcastMessage {
  id: string;
  author: string;
  message: string;
  isJackpot?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export type GameId =
  | 'gacha'
  | 'mystery_box'
  | 'diamond_dice'
  | 'gem_rain'
  | 'lucky_wheel'
  | 'treasure_hunt';

export interface GameCost {
  wls: number;
  dls: number;
}

export interface GameDefinition {
  id: GameId;
  tab: DashboardTab;
  /** Key referencing a glyph icon in dashboard/glyphs.tsx. */
  glyphKey: string;
  title: string;
  hint: string;
  cost: GameCost;
  /** true kalau aksi ini pernah dibuka; dipakai nanti untuk konten terkunci. */
  locked?: boolean;
}
