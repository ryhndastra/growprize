import { useState, useCallback } from 'react';
import { useDashboard } from '../../DashboardContext';
import { GACHA_ITEMS } from '../../../../data/gachaItems';
import { GachaItem } from '../../../../types/dashboard';

export interface WheelSegmentConfig {
  id: string;
  label: string;
  color: string;
  textColor: string;
  wls?: number;
  dls?: number;
  gems?: number;
  item?: GachaItem;
}

export const WHEEL_SEGMENTS: WheelSegmentConfig[] = [
  { id: 'seg-1', label: '5 WL', color: '#0284c7', textColor: '#ffffff', wls: 5 },
  { id: 'seg-2', label: '10,000 GEMS', color: '#10b981', textColor: '#ffffff', gems: 10000 },
  { id: 'seg-3', label: '10 WL', color: '#f59e0b', textColor: '#000000', wls: 10 },
  { id: 'seg-4', label: 'DEVIL WINGS', color: '#ef4444', textColor: '#ffffff', item: GACHA_ITEMS.find((i) => i.id === 'devilWings') || GACHA_ITEMS[0] },
  { id: 'seg-5', label: '25 WL', color: '#8b5cf6', textColor: '#ffffff', wls: 25 },
  { id: 'seg-6', label: '50,000 GEMS', color: '#059669', textColor: '#ffffff', gems: 50000 },
  { id: 'seg-7', label: '1 DL (100 WL)', color: '#0ea5e9', textColor: '#ffffff', dls: 1 },
  { id: 'seg-8', label: 'JACKPOT 2 DL', color: '#eab308', textColor: '#000000', dls: 2 },
];

export interface WheelSpinRecord {
  segment: WheelSegmentConfig;
  timestamp: string;
}

export function useLuckyWheel() {
  const { balance, spendWls, addLocks, addItemToInventory } = useDashboard();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<WheelSegmentConfig | null>(null);
  const [history, setHistory] = useState<WheelSpinRecord[]>([]);

  const totalPlayerWls = balance.wls + balance.dls * 100 + balance.bgls * 10000;
  const costWls = 3;
  const canAfford = totalPlayerWls >= costWls;

  const spinWheel = useCallback(() => {
    if (isSpinning || !canAfford) return;

    const ok = spendWls(costWls);
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
      // beri hadiah ke pemain
      if (winningSegment.wls) addLocks({ wls: winningSegment.wls });
      if (winningSegment.dls) addLocks({ dls: winningSegment.dls });
      if (winningSegment.gems) addLocks({ gems: winningSegment.gems });
      if (winningSegment.item) addItemToInventory(winningSegment.item);

      setLastWin(winningSegment);
      setHistory((prev) => [{ segment: winningSegment, timestamp: 'Baru saja' }, ...prev.slice(0, 7)]);
      setIsSpinning(false);
    }, 4500);
  }, [isSpinning, canAfford, costWls, rotation, spendWls, addLocks, addItemToInventory]);

  return {
    isSpinning,
    rotation,
    lastWin,
    history,
    canAfford,
    costWls,
    spinWheel,
  };
}
