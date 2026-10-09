import { useState, useEffect, useRef, useCallback } from 'react';
import { useDashboard } from '../../DashboardContext';

export interface FallingGem {
  id: number;
  x: number;
  y: number;
  type: 'green' | 'blue' | 'purple' | 'red' | 'wl';
  value: number;
  isWl: boolean;
  speed: number;
}

export function useGemRain() {
  const { balance, spendWls, addLocks } = useDashboard();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [collectedGems, setCollectedGems] = useState(0);
  const [collectedWls, setCollectedWls] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gems, setGems] = useState<FallingGem[]>([]);
  const [gameResult, setGameResult] = useState<{ gems: number; wls: number } | null>(null);

  const nextId = useRef(1);

  const totalPlayerWls = balance.wls + balance.dls * 100 + balance.bgls * 10000;
  const canAfford = totalPlayerWls >= 2;

  const startGame = useCallback(() => {
    if (isPlaying || !canAfford) return;

    const ok = spendWls(2);
    if (!ok) return;

    setIsPlaying(true);
    setTimeLeft(20);
    setCollectedGems(0);
    setCollectedWls(0);
    setCombo(0);
    setGems([]);
    setGameResult(null);
  }, [isPlaying, canAfford, spendWls]);

  // timer hitung mundur permainan
  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      setIsPlaying(false);
      setGems([]);
      setGameResult({ gems: collectedGems, wls: collectedWls });
      addLocks({ gems: collectedGems, wls: collectedWls });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, collectedGems, collectedWls, addLocks]);

  // loop pembuatan gem jatuh
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      const types: Array<'green' | 'blue' | 'purple' | 'red' | 'wl'> = [
        'green', 'green', 'green', 'blue', 'blue', 'purple', 'red', 'wl',
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];

      let value = 10;
      let isWl = false;
      if (selectedType === 'blue') value = 50;
      if (selectedType === 'purple') value = 100;
      if (selectedType === 'red') value = 250;
      if (selectedType === 'wl') {
        value = 1;
        isWl = true;
      }

      const newGem: FallingGem = {
        id: nextId.current++,
        x: Math.floor(Math.random() * 85) + 5,
        y: -10,
        type: selectedType,
        value,
        isWl,
        speed: Math.random() * 2.5 + 3.5,
      };

      setGems((prev) => [...prev.slice(-22), newGem]);
    }, 400);

    const fallInterval = setInterval(() => {
      setGems((prev) =>
        prev
          .map((g) => ({ ...g, y: g.y + g.speed }))
          .filter((g) => g.y < 105)
      );
    }, 45);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
    };
  }, [isPlaying]);

  const catchGem = useCallback((gem: FallingGem) => {
    if (!isPlaying) return;

    if (gem.isWl) {
      setCollectedWls((w) => w + 1);
    } else {
      setCollectedGems((g) => g + gem.value * (1 + Math.floor(combo / 5) * 0.2));
    }
    setCombo((c) => c + 1);
    setGems((prev) => prev.filter((g) => g.id !== gem.id));
  }, [isPlaying, combo]);

  return {
    isPlaying,
    timeLeft,
    collectedGems,
    collectedWls,
    combo,
    gems,
    gameResult,
    canAfford,
    startGame,
    catchGem,
  };
}
