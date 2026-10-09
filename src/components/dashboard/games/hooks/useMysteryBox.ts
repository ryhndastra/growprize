import { useState, useCallback, useRef, useEffect } from 'react';
import { useDashboard } from '../../DashboardContext';
import { GACHA_ITEMS } from '../../../../data/gachaItems';
import { GachaItem } from '../../../../types/dashboard';

export interface BoxTier {
  id: 'wooden' | 'golden' | 'obsidian';
  name: string;
  costLabel: string;
  costWls: number;
  costDls: number;
  previewImage: string;
  description: string;
  poolDescription: string;
  badge: string;
  highlightPrize: string;
}

export const BOX_TIERS: BoxTier[] = [
  {
    id: 'wooden',
    name: 'Wooden Mystery Box',
    costLabel: '5 WL',
    costWls: 5,
    costDls: 0,
    previewImage: '/xsolla/box_topper.png',
    description: 'Peti kayu pemula dengan peluang item kosmetik langka dan bonus World Lock.',
    poolDescription: 'Peluang: 2-15 WL, Devil Wings, Golden Apple, Diamond Lock',
    badge: 'PEMULA',
    highlightPrize: 'Devil Wings / 1 DL',
  },
  {
    id: 'golden',
    name: 'Golden Royal Chest',
    costLabel: '25 WL',
    costWls: 25,
    costDls: 0,
    previewImage: '/xsolla/items/chest_o_gems.png',
    description: 'Peti emas kerajaan dengan peluang item epic dan jaminan hadiah menarik.',
    poolDescription: 'Peluang: 20-60 WL, Golden Ankh, Dragon Wings, Magplant 5000',
    badge: 'POPULER',
    highlightPrize: 'Golden Ankh / Dragon Wings',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Ancient Relic',
    costLabel: '1 DL (100 WL)',
    costWls: 100,
    costDls: 0,
    previewImage: '/xsolla/items/gem_abundance.png',
    description: 'Peti peninggalan legendaris yang menyimpan item mythic termahal di Growtopia.',
    poolDescription: 'Peluang: 1-5 DL, Rayman\'s Fist, Magplant 5000, Phoenix Wings',
    badge: 'MYTHIC',
    highlightPrize: 'Rayman\'s Fist / Magplant',
  },
];

export interface OpenedReward {
  name: string;
  description: string;
  wlsValue: number;
  item?: GachaItem;
  tier: string;
}

export function useMysteryBox() {
  const { balance, spendWls, addLocks, addItemToInventory } = useDashboard();
  const [selectedBoxId, setSelectedBoxId] = useState<'wooden' | 'golden' | 'obsidian'>('golden');
  const [isOpening, setIsOpening] = useState(false);
  const [lastReward, setLastReward] = useState<OpenedReward | null>(null);
  const [history, setHistory] = useState<OpenedReward[]>([]);

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // bersihkan timer pembukaan peti saat unmount agar tidak menulis state ke komponen mati
  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const selectedTier = BOX_TIERS.find((b) => b.id === selectedBoxId)!;
  const totalPlayerWls = balance.wls + balance.dls * 100 + balance.bgls * 10000;
  const canAfford = totalPlayerWls >= selectedTier.costWls;

  const openBox = useCallback(() => {
    if (isOpening || !canAfford) return;

    // potong biaya peti lintas denominasi dalam satu transaksi atomik;
    // bila saldo tidak cukup, tidak ada saldo yang berubah sama sekali.
    const deducted = spendWls(selectedTier.costWls);
    if (!deducted) return;

    setIsOpening(true);
    setLastReward(null);

    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      let reward: OpenedReward;

      if (selectedTier.id === 'obsidian') {
        const roll = Math.random();
        if (roll < 0.15) {
          const item = GACHA_ITEMS.find((i) => i.id === 'rayman') || GACHA_ITEMS[0];
          reward = { name: item.name, description: item.description, wlsValue: 40000, item, tier: 'MYTHIC' };
          addItemToInventory(item);
        } else if (roll < 0.35) {
          const item = GACHA_ITEMS.find((i) => i.id === 'magplant') || GACHA_ITEMS[1];
          reward = { name: item.name, description: item.description, wlsValue: 25000, item, tier: 'MYTHIC' };
          addItemToInventory(item);
        } else {
          const wonDls = Math.floor(Math.random() * 3) + 1;
          reward = { name: `${wonDls} Diamond Lock`, description: 'Jackpot Lock langsung masuk ke tasmu!', wlsValue: wonDls * 100, tier: 'EPIC' };
          addLocks({ dls: wonDls });
        }
      } else if (selectedTier.id === 'golden') {
        const roll = Math.random();
        if (roll < 0.18) {
          const item = GACHA_ITEMS.find((i) => i.id === 'ankh') || GACHA_ITEMS[2];
          reward = { name: item.name, description: item.description, wlsValue: 12000, item, tier: 'LEGEND' };
          addItemToInventory(item);
        } else if (roll < 0.45) {
          const item = GACHA_ITEMS.find((i) => i.id === 'dragon') || GACHA_ITEMS[3];
          reward = { name: item.name, description: item.description, wlsValue: 1800, item, tier: 'EPIC' };
          addItemToInventory(item);
        } else {
          const wonWls = Math.floor(Math.random() * 35) + 15;
          reward = { name: `${wonWls} World Lock`, description: 'Tumpukan World Lock berkilau!', wlsValue: wonWls, tier: 'RARE' };
          addLocks({ wls: wonWls });
        }
      } else {
        const roll = Math.random();
        if (roll < 0.25) {
          const item = GACHA_ITEMS.find((i) => i.id === 'devilWings') || GACHA_ITEMS[10];
          reward = { name: item.name, description: item.description, wlsValue: 80, item, tier: 'RARE' };
          addItemToInventory(item);
        } else {
          const wonWls = Math.floor(Math.random() * 12) + 2;
          reward = { name: `${wonWls} World Lock`, description: 'Kembalian World Lock dari peti kayu!', wlsValue: wonWls, tier: 'COMMON' };
          addLocks({ wls: wonWls });
        }
      }

      setLastReward(reward);
      setHistory((prev) => [reward, ...prev.slice(0, 7)]);
      setIsOpening(false);
    }, 1400);
  }, [isOpening, canAfford, selectedTier, spendWls, addLocks, addItemToInventory]);

  return {
    selectedBoxId,
    setSelectedBoxId,
    selectedTier,
    isOpening,
    lastReward,
    history,
    canAfford,
    openBox,
  };
}
