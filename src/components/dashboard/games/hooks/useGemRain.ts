import { useState, useEffect, useRef, useCallback } from 'react';
import { useDashboard } from '../../DashboardContext';
import { roundUsd } from '../../../../lib/money';

// biaya ronde gem rain dalam usd, disamakan dengan katalog game.
const GEM_RAIN_COST_USD = 0.2;

export interface FallingGem {
  id: number;
  x: number;
  y: number;
  type: 'green' | 'blue' | 'purple' | 'red' | 'coin';
  value: number;
  isCoin: boolean;
  speed: number;
}

export function useGemRain() {
  const { balance, spendUsd, addUsd } = useDashboard();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [collectedGems, setCollectedGems] = useState(0);
  const [collectedUsd, setCollectedUsd] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gems, setGems] = useState<FallingGem[]>([]);
  const [gameResult, setGameResult] = useState<{ gems: number; usd: number } | null>(null);

  const nextId = useRef(1);

  // biaya satu ronde diambil dari katalog usd, bukan lagi world lock.
  const costUsd = GEM_RAIN_COST_USD;
  const canAfford = balance.usd >= costUsd;

  const startGame = useCallback(() => {
    if (isPlaying || !canAfford) return;

    const ok = spendUsd(costUsd);
    if (!ok) return;

    setIsPlaying(true);
    setTimeLeft(20);
    setCollectedGems(0);
    setCollectedUsd(0);
    setCombo(0);
    setGems([]);
    setGameResult(null);
  }, [isPlaying, canAfford, costUsd, spendUsd]);

  // timer hitung mundur permainan
  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      setIsPlaying(false);
      setGems([]);
      setGameResult({ gems: collectedGems, usd: collectedUsd });
      // hadiah usd dibulatkan ke sen utuh sebelum masuk saldo.
      addUsd(roundUsd(collectedUsd));
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, collectedGems, collectedUsd, addUsd]);

  // loop pembuatan gem jatuh
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      const types: Array<'green' | 'blue' | 'purple' | 'red' | 'coin'> = [
        'green', 'green', 'green', 'blue', 'blue', 'purple', 'red', 'coin',
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];

      // nilai gem murni skor (bukan saldo), dibuat konsisten dalam puluhan gems.
      let value = 10;
      let isCoin = false;
      if (selectedType === 'blue') value = 25;
      if (selectedType === 'purple') value = 50;
      if (selectedType === 'red') value = 100;
      if (selectedType === 'coin') {
        // koin memberi nilai usd kecil, sebanding dengan taruhan ronde.
        value = 0.02;
        isCoin = true;
      }

      const newGem: FallingGem = {
        id: nextId.current++,
        x: Math.floor(Math.random() * 85) + 5,
        y: -10,
        type: selectedType,
        value,
        isCoin,
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

    if (gem.isCoin) {
      // combo menambah nilai koin usd, dibatasi ke sen utuh saat masuk saldo.
      setCollectedUsd((u) => roundUsd(u + gem.value * (1 + Math.floor(combo / 5) * 0.2)));
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
    collectedUsd,
    combo,
    gems,
    gameResult,
    canAfford,
    costUsd,
    startGame,
    catchGem,
  };
}
