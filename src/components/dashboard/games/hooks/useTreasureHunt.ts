import { useState, useCallback } from 'react';
import { useDashboard } from '../../DashboardContext';

export interface TreasureTile {
  id: number;
  revealed: boolean;
  type: 'huge' | 'medium' | 'small' | 'zonk';
  name: string;
  wls: number;
  gems?: number;
}

export function useTreasureHunt() {
  const { balance, spendWls, addLocks } = useDashboard();
  const [isPlaying, setIsPlaying] = useState(false);
  const [picksLeft, setPicksLeft] = useState(3);
  const [tiles, setTiles] = useState<TreasureTile[]>([]);
  const [totalWonWls, setTotalWonWls] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  const costWls = 4;
  const totalPlayerWls = balance.wls + balance.dls * 100 + balance.bgls * 10000;
  const canAfford = totalPlayerWls >= costWls;

  const generateTiles = (): TreasureTile[] => {
    const pool: Array<Omit<TreasureTile, 'id' | 'revealed'>> = [
      { type: 'huge', name: 'Diamond Lock Pot!', wls: 100, gems: 0 },
      { type: 'medium', name: 'Pundi Gem Berkilau', wls: 20, gems: 25000 },
      { type: 'medium', name: 'Tumpukan 15 WL', wls: 15, gems: 0 },
      { type: 'small', name: 'Kantung 8 WL', wls: 8, gems: 0 },
      { type: 'small', name: 'Kantung 6 WL', wls: 6, gems: 0 },
      { type: 'small', name: 'Kantung 5 WL', wls: 5, gems: 0 },
      { type: 'zonk', name: 'Batu Kosong', wls: 0, gems: 0 },
      { type: 'zonk', name: 'Batu Bekas Galian', wls: 0, gems: 0 },
      { type: 'zonk', name: 'Fosil Kuno', wls: 0, gems: 0 },
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

    const ok = spendWls(costWls);
    if (!ok) return;

    setIsPlaying(true);
    setPicksLeft(3);
    setTotalWonWls(0);
    setRoundCompleted(false);
    setTiles(generateTiles());
  }, [isPlaying, canAfford, costWls, spendWls]);

  const digTile = useCallback(
    (tileId: number) => {
      if (!isPlaying || picksLeft <= 0 || roundCompleted) return;

      setTiles((prev) => {
        const next = [...prev];
        const target = next.find((t) => t.id === tileId);
        if (!target || target.revealed) return prev;

        target.revealed = true;

        if (target.wls > 0) {
          addLocks({ wls: target.wls });
          setTotalWonWls((w) => w + target.wls);
        }
        if (target.gems && target.gems > 0) {
          addLocks({ gems: target.gems });
        }

        const remainingPicks = picksLeft - 1;
        setPicksLeft(remainingPicks);

        if (remainingPicks <= 0) {
          setRoundCompleted(true);
          setIsPlaying(false);
        }

        return next;
      });
    },
    [isPlaying, picksLeft, roundCompleted, addLocks]
  );

  return {
    isPlaying,
    picksLeft,
    tiles,
    totalWonWls,
    roundCompleted,
    costWls,
    canAfford,
    startHunt,
    digTile,
  };
}
