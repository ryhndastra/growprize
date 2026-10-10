import { useState, useCallback, useRef, useEffect } from 'react';
import { useDashboard } from '../../DashboardContext';
import { GACHA_ITEMS } from '../../../../data/gachaItems';
import { GachaItem } from '../../../../types/dashboard';
import { formatUsd, roundUsd } from '../../../../lib/money';

export interface BoxTier {
  id: 'wooden' | 'golden' | 'obsidian';
  name: string;
  costLabel: string;
  costUsd: number;
  previewImage: string;
  description: string;
  poolDescription: string;
  badge: string;
  highlightPrize: string;
}

// biaya peti dalam usd, diselaraskan dengan harga case backend (0.15 s/d 1.5 usd).
export const BOX_TIERS: BoxTier[] = [
  {
    id: 'wooden',
    name: 'Wooden Mystery Box',
    costLabel: '$0.15',
    costUsd: 0.15,
    previewImage: '/xsolla/box_topper.png',
    description: 'Peti kayu pemula dengan peluang item kosmetik langka dan bonus saldo.',
    poolDescription: 'Peluang: $0.02-$0.15, Devil Wings, Golden Apple',
    badge: 'PEMULA',
    highlightPrize: 'Devil Wings / $0.15',
  },
  {
    id: 'golden',
    name: 'Golden Royal Chest',
    costLabel: '$0.50',
    costUsd: 0.5,
    previewImage: '/xsolla/items/chest_o_gems.png',
    description: 'Peti emas kerajaan dengan peluang item epic dan jaminan hadiah menarik.',
    poolDescription: 'Peluang: $0.20-$0.60, Golden Ankh, Dragon Wings',
    badge: 'POPULER',
    highlightPrize: 'Golden Ankh / Dragon Wings',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Ancient Relic',
    costLabel: '$1.50',
    costUsd: 1.5,
    previewImage: '/xsolla/items/gem_abundance.png',
    description: 'Peti peninggalan legendaris yang menyimpan item mythic termahal di Growtopia.',
    poolDescription: 'Peluang: $1-$5, Rayman\'s Fist, Magplant 5000, Phoenix Wings',
    badge: 'MYTHIC',
    highlightPrize: 'Rayman\'s Fist / Magplant',
  },
];

export interface OpenedReward {
  name: string;
  description: string;
  usdValue: number;
  item?: GachaItem;
  tier: string;
}

export function useMysteryBox() {
  const { balance, spendUsd, addUsd, addItemToInventory } = useDashboard();
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
  const canAfford = balance.usd >= selectedTier.costUsd;

  const openBox = useCallback(() => {
    if (isOpening || !canAfford) return;

    // potong biaya peti dalam satu transaksi; bila saldo tidak cukup, tidak ada
    // saldo yang berubah sama sekali.
    const deducted = spendUsd(selectedTier.costUsd);
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
          reward = { name: item.name, description: item.description, usdValue: 35, item, tier: 'MYTHIC' };
          addItemToInventory(item);
        } else if (roll < 0.35) {
          const item = GACHA_ITEMS.find((i) => i.id === 'magplant') || GACHA_ITEMS[1];
          reward = { name: item.name, description: item.description, usdValue: 20, item, tier: 'MYTHIC' };
          addItemToInventory(item);
        } else {
          const wonUsd = roundUsd(0.5 + Math.random() * 1.5);
          reward = { name: `${formatUsd(wonUsd)} Saldo`, description: 'Jackpot saldo langsung masuk ke akunmu!', usdValue: wonUsd, tier: 'EPIC' };
          addUsd(wonUsd);
        }
      } else if (selectedTier.id === 'golden') {
        const roll = Math.random();
        if (roll < 0.18) {
          const item = GACHA_ITEMS.find((i) => i.id === 'ankh') || GACHA_ITEMS[2];
          reward = { name: item.name, description: item.description, usdValue: 8, item, tier: 'LEGEND' };
          addItemToInventory(item);
        } else if (roll < 0.45) {
          const item = GACHA_ITEMS.find((i) => i.id === 'dragon') || GACHA_ITEMS[3];
          reward = { name: item.name, description: item.description, usdValue: 2, item, tier: 'EPIC' };
          addItemToInventory(item);
        } else {
          const wonUsd = roundUsd(0.2 + Math.random() * 0.4);
          reward = { name: `${formatUsd(wonUsd)} Saldo`, description: 'Kembalian saldo dari peti emas!', usdValue: wonUsd, tier: 'RARE' };
          addUsd(wonUsd);
        }
      } else {
        const roll = Math.random();
        if (roll < 0.25) {
          const item = GACHA_ITEMS.find((i) => i.id === 'devilWings') || GACHA_ITEMS[10];
          reward = { name: item.name, description: item.description, usdValue: 0.8, item, tier: 'RARE' };
          addItemToInventory(item);
        } else {
          const wonUsd = roundUsd(0.02 + Math.random() * 0.13);
          reward = { name: `${formatUsd(wonUsd)} Saldo`, description: 'Kembalian saldo dari peti kayu!', usdValue: wonUsd, tier: 'COMMON' };
          addUsd(wonUsd);
        }
      }

      setLastReward(reward);
      setHistory((prev) => [reward, ...prev.slice(0, 7)]);
      setIsOpening(false);
    }, 1400);
  }, [isOpening, canAfford, selectedTier, spendUsd, addUsd, addItemToInventory]);

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
