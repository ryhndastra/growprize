import { useState, useCallback } from 'react';
import { useDashboard } from '../../DashboardContext';
import { roundUsd } from '../../../../lib/money';

// biaya ronde treasure hunt dalam usd, disamakan dengan katalog game.
const TREASURE_COST_USD = 0.4;

export interface TreasureTile {
  id: number;
  revealed: boolean;
  type: 'huge' | 'medium' | 'small' | 'zonk';
  name: string;
  usd: number;
  gems?: number;
}

export function useTreasureHunt() {
  const { balance, spendUsd, addUsd } = useDashboard();
  const [isPlaying, setIsPlaying] = useState(false);
  const [picksLeft, setPicksLeft] = useState(3);
  const [tiles, setTiles] = useState<TreasureTile[]>([]);
  const [totalWonUsd, setTotalWonUsd] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  const costUsd = TREASURE_COST_USD;
  const canAfford = balance.usd >= costUsd;

  const generateTiles = (): TreasureTile[] => {
    const pool: Array<Omit<TreasureTile, 'id' | 'revealed'>> = [
      { type: 'huge', name: 'Peti Saldo Besar!', usd: 1, gems: 0 },
      { type: 'medium', name: 'Pundi Gem Berkilau', usd: 0.2, gems: 25000 },
      { type: 'medium', name: 'Tumpukan Koin Saldo', usd: 0.15, gems: 0 },
      { type: 'small', name: 'Kantung Koin Saldo', usd: 0.08, gems: 0 },
      { type: 'small', name: 'Kantung Koin Saldo', usd: 0.06, gems: 0 },
      { type: 'small', name: 'Kantung Koin Saldo', usd: 0.05, gems: 0 },
      { type: 'zonk', name: 'Batu Kosong', usd: 0, gems: 0 },
      { type: 'zonk', name: 'Batu Bekas Galian', usd: 0, gems: 0 },
      { type: 'zonk', name: 'Fosil Kuno', usd: 0, gems: 0 },
    ];

    // acak urutan ubin
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    return shuffled.map((item, idx) => ({
      ...item,
      id: idx,
      revealed: false,
    }));
  };

  const startHunt = useCallback(() => {
    if (isPlaying || !canAfford) return;

    const ok = spendUsd(costUsd);
    if (!ok) return;

    setIsPlaying(true);
    setPicksLeft(3);
    setTotalWonUsd(0);
    setRoundCompleted(false);
    setTiles(generateTiles());
  }, [isPlaying, canAfford, costUsd, spendUsd]);

  const digTile = useCallback(
    (tileId: number) => {
      if (!isPlaying || picksLeft <= 0 || roundCompleted) return;

      const target = tiles.find((t) => t.id === tileId);
      if (!target || target.revealed) return;

      // efek samping saldo dijalankan di luar updater setTiles agar updater tetap
      // murni dan dua tile cepat tidak saling menimpa penambahan saldo.
      if (target.usd > 0) {
        addUsd(target.usd);
        setTotalWonUsd((u) => roundUsd(u + target.usd));
      }

      const remainingPicks = picksLeft - 1;
      setTiles((prev) => prev.map((t) => (t.id === tileId ? { ...t, revealed: true } : t)));
      setPicksLeft(remainingPicks);

      if (remainingPicks <= 0) {
        setRoundCompleted(true);
        setIsPlaying(false);
      }
    },
    [isPlaying, picksLeft, roundCompleted, tiles, addUsd]
  );

  return {
    isPlaying,
    picksLeft,
    tiles,
    totalWonUsd,
    roundCompleted,
    costUsd,
    canAfford,
    startHunt,
    digTile,
  };
}
