import { useState, useCallback } from 'react';
import { useDashboard } from '../../DashboardContext';
import { GACHA_ITEMS } from '../../../../data/gachaItems';
import { GachaItem } from '../../../../types/dashboard';

// biaya satu putaran roda dalam usd, disamakan dengan katalog game.
const WHEEL_COST_USD = 0.3;

export interface WheelSegmentConfig {
  id: string;
  label: string;
  color: string;
  textColor: string;
  usd?: number;
  gems?: number;
  item?: GachaItem;
}

// hadiah roda dalam usd, diskalakan setara taruhan kecil agar ekonomis terhadap
// harga case backend. label sudah memakai prefix dolar.
export const WHEEL_SEGMENTS: WheelSegmentConfig[] = [
  { id: 'seg-1', label: '$0.5', color: '#0284c7', textColor: '#ffffff', usd: 0.5 },
  { id: 'seg-2', label: '10,000 GEMS', color: '#10b981', textColor: '#ffffff', gems: 10000 },
  { id: 'seg-3', label: '$1.00', color: '#f59e0b', textColor: '#000000', usd: 1 },
  { id: 'seg-4', label: 'DEVIL WINGS', color: '#ef4444', textColor: '#ffffff', item: GACHA_ITEMS.find((i) => i.id === 'devilWings') || GACHA_ITEMS[0] },
  { id: 'seg-5', label: '$2.50', color: '#8b5cf6', textColor: '#ffffff', usd: 2.5 },
  { id: 'seg-6', label: '50,000 GEMS', color: '#059669', textColor: '#ffffff', gems: 50000 },
  { id: 'seg-7', label: '$5.00', color: '#0ea5e9', textColor: '#ffffff', usd: 5 },
  { id: 'seg-8', label: 'JACKPOT $10', color: '#eab308', textColor: '#000000', usd: 10 },
];

export interface WheelSpinRecord {
  segment: WheelSegmentConfig;
  timestamp: string;
}

export function useLuckyWheel() {
  const { balance, spendUsd, addUsd, addItemToInventory } = useDashboard();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<WheelSegmentConfig | null>(null);
  const [history, setHistory] = useState<WheelSpinRecord[]>([]);

  const costUsd = WHEEL_COST_USD;
  const canAfford = balance.usd >= costUsd;

  const spinWheel = useCallback(() => {
    if (isSpinning || !canAfford) return;

    const ok = spendUsd(costUsd);
    if (!ok) return;

    setIsSpinning(true);
    setLastWin(null);

    // pilih segmen pemenang secara acak
    const winningIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const winningSegment = WHEEL_SEGMENTS[winningIndex];

    // hitung putaran sudut: 8 putaran penuh + sudut offset segmen
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    // tanda panah ada di atas (0 derajat / 12 o'clock)
    const targetOffset = 360 - (winningIndex * segmentAngle + segmentAngle / 2);
    const totalExtraRotations = 360 * 7;
    const nextRotation = rotation + totalExtraRotations + targetOffset - (rotation % 360);

    setRotation(nextRotation);

    setTimeout(() => {
      // beri hadiah ke pemain; hanya nilai usd yang masuk ke saldo.
      if (winningSegment.usd) addUsd(winningSegment.usd);
      if (winningSegment.item) addItemToInventory(winningSegment.item);

      setLastWin(winningSegment);
      setHistory((prev) => [{ segment: winningSegment, timestamp: 'Baru saja' }, ...prev.slice(0, 7)]);
      setIsSpinning(false);
    }, 4500);
  }, [isSpinning, canAfford, costUsd, rotation, spendUsd, addUsd, addItemToInventory]);

  return {
    isSpinning,
    rotation,
    lastWin,
    history,
    canAfford,
    costUsd,
    spinWheel,
  };
}
