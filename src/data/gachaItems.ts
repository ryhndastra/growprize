import { GachaItem, LiveDropRecord, BroadcastMessage } from '../types/dashboard';

export const GACHA_ITEMS: GachaItem[] = [
  // ── MYTHIC TIER (< 1.5%) ──
  {
    id: 'rayman-fist',
    name: "Rayman's Fist",
    category: 'hand',
    rarity: 'mythic',
    dropRatePercent: 0.6,
    valueInDls: 185,
    icon: 'rayman',
    description: 'Iconic telekinetic fist with 3-tile punch reach and gold aura.',
    glowColor: '#F59E0B',
  },
  {
    id: 'magplant-5000',
    name: 'Magplant 5000',
    category: 'device',
    rarity: 'mythic',
    dropRatePercent: 0.9,
    valueInDls: 140,
    icon: 'magplant',
    description: 'High-tech magnetic item harvester. Holds up to 5000 floating blocks.',
    glowColor: '#38BDF8',
  },
  {
    id: 'golden-ankh',
    name: 'Golden Ankh',
    category: 'artifact',
    rarity: 'mythic',
    dropRatePercent: 1.2,
    valueInDls: 95,
    icon: 'ankh',
    description: 'Sacred relic of ancient pharaohs. Grants radiant golden levitation.',
    glowColor: '#FACC15',
  },

  // ── LEGENDARY TIER (~ 6%) ──
  {
    id: 'phoenix-wings',
    name: 'Phoenix Wings',
    category: 'wings',
    rarity: 'legendary',
    dropRatePercent: 2.2,
    valueInDls: 58,
    icon: 'phoenix',
    description: 'Ethereal flaming plumage that leaves blazing ember footprints.',
    glowColor: '#EF4444',
  },
  {
    id: 'diamond-dragon',
    name: 'Diamond Dragon',
    category: 'artifact',
    rarity: 'legendary',
    dropRatePercent: 2.5,
    valueInDls: 65,
    icon: 'dragon',
    description: 'Crystalline dragon hatchling radiating brilliant diamond rays.',
    glowColor: '#06B6D4',
  },
  {
    id: 'davinci-wings',
    name: 'DaVinci Wings',
    category: 'wings',
    rarity: 'legendary',
    dropRatePercent: 3.5,
    valueInDls: 42,
    icon: 'davinci',
    description: 'Masterwork wooden glider wings engineered with Renaissance gears.',
    glowColor: '#EA580C',
  },

  // ── EPIC TIER (~ 15%) ──
  {
    id: 'd-gown',
    name: 'Diamond Gown',
    category: 'hat',
    rarity: 'epic',
    dropRatePercent: 5.0,
    valueInDls: 22,
    icon: 'gown',
    description: 'Sparkling diamond-stitched royal dress with shimmering trail.',
    glowColor: '#A855F7',
  },
  {
    id: 'focused-eyes',
    name: 'Focused Eyes',
    category: 'hat',
    rarity: 'epic',
    dropRatePercent: 6.5,
    valueInDls: 18,
    icon: 'eyes',
    description: 'Intense glowing eyes that reveal block health and secret doors.',
    glowColor: '#8B5CF6',
  },
  {
    id: 'golden-apple',
    name: 'Golden Apple',
    category: 'consumable',
    rarity: 'epic',
    dropRatePercent: 7.5,
    valueInDls: 14,
    icon: 'apple',
    description: 'Legendary edible artifact granting 24h double XP and gem drop boost.',
    glowColor: '#EAB308',
  },

  // ── RARE TIER (~ 30%) ──
  {
    id: 'saber-laser',
    name: 'Neon Saber',
    category: 'hand',
    rarity: 'rare',
    dropRatePercent: 12.0,
    valueInDls: 6,
    icon: 'saber',
    description: 'Plasma beam energy blade with authentic buzzing sound effect.',
    glowColor: '#3B82F6',
  },
  {
    id: 'devil-wings',
    name: 'Crimson Devil Wings',
    category: 'wings',
    rarity: 'rare',
    dropRatePercent: 14.0,
    valueInDls: 4,
    icon: 'devilWings',
    description: 'Sharp bat-winged silhouette with red particle glow.',
    glowColor: '#B91C1C',
  },

  // ── COMMON TIER (~ 45%) ──
  {
    id: 'wls-bundle-50',
    name: '50x World Lock Bundle',
    category: 'consumable',
    rarity: 'common',
    dropRatePercent: 18.0,
    valueInDls: 0.5,
    icon: 'wlsBundle',
    description: 'Instant pack of 50 pure World Locks deposited to your sack.',
    glowColor: '#10B981',
  },
  {
    id: 'gem-sack-50k',
    name: '50,000 Red Gems',
    category: 'consumable',
    rarity: 'common',
    dropRatePercent: 25.1,
    valueInDls: 0.25,
    icon: 'gemSack',
    description: 'Heavy sack brimming with 50,000 polished red gems.',
    glowColor: '#059669',
  },
];

export const MOCK_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'bc-1',
    author: 'SYSTEM',
    message: 'ECLIPSE PS MEGA JACKPOT POOL REACHED 420 BGLs! SPIN TO WIN!',
    isJackpot: true,
  },
  {
    id: 'bc-2',
    author: 'Player_Zack',
    message: 'Bro just pulled Rayman Fist from 5x Spin!! Holy crap thank you GROWPRIZE!!',
  },
  {
    id: 'bc-3',
    author: 'MOD_Kaiser',
    message: 'Top up saldo kini langsung masuk ke akunmu. Selamat bermain di Eclipse PS!',
  },
];

export const INITIAL_LIVE_DROPS: LiveDropRecord[] = [
  {
    id: 'drop-1',
    player: 'KaiserGT',
    item: GACHA_ITEMS[0], // Rayman Fist
    timestamp: 'Just now',
    chestType: 'gold',
  },
  {
    id: 'drop-2',
    player: 'NekoGrow',
    item: GACHA_ITEMS[3], // Phoenix Wings
    timestamp: '1m ago',
    chestType: 'gold',
  },
  {
    id: 'drop-3',
    player: 'EclipseGod',
    item: GACHA_ITEMS[1], // Magplant
    timestamp: '3m ago',
    chestType: 'super',
  },
  {
    id: 'drop-4',
    player: 'StarBoy99',
    item: GACHA_ITEMS[6], // Diamond Gown
    timestamp: '5m ago',
    chestType: 'silver',
  },
  {
    id: 'drop-5',
    player: 'ZackW',
    item: GACHA_ITEMS[9], // Neon Saber
    timestamp: '8m ago',
    chestType: 'bronze',
  },
];
