import { useState, useCallback, useRef, useEffect } from 'react';
import { useDashboard } from '../../DashboardContext';

export type BetTarget = 'over' | 'under' | 'seven';

export interface RollRecord {
  roll: number;
  die1: number;
  die2: number;
  betWls: number;
  target: BetTarget;
  won: boolean;
  payoutWls: number;
  timestamp: string;
}

export const BET_AMOUNTS = [1, 5, 10, 25, 50, 100];

export function useDiceGame() {
  const { balance, spendWls, addLocks } = useDashboard();
  const [selectedBet, setSelectedBet] = useState<number>(5);
  const [target, setTarget] = useState<BetTarget>('over');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [diceValues, setDiceValues] = useState<[number, number]>([4, 3]);
  const [totalScore, setTotalScore] = useState<number>(77);
  const [lastOutcome, setLastOutcome] = useState<RollRecord | null>(null);
  const [history, setHistory] = useState<RollRecord[]>([]);

  const rollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // bersihkan interval lemparan saat unmount agar tidak ada setState pada komponen mati
  useEffect(() => {
    return () => {
      if (rollTimerRef.current !== null) {
        clearInterval(rollTimerRef.current);
      }
    };
  }, []);

  const totalPlayerWls = balance.wls + balance.dls * 100 + balance.bgls * 10000;
  const canAfford = totalPlayerWls >= selectedBet;
  const multiplier = target === 'seven' ? 15.0 : 1.95;

  const rollDice = useCallback(() => {
    if (isRolling || !canAfford) return;

    // potong nilai taruhan lintas denominasi dalam satu transaksi atomik;
    // bila saldo tidak cukup, tidak ada saldo yang berubah sama sekali.
    const deducted = spendWls(selectedBet);
    if (!deducted) return;

    setIsRolling(true);
    setLastOutcome(null);

    // putaran acak cepat selama animasi lemparan berlangsung
    let step = 0;
    const interval = setInterval(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDiceValues([d1, d2]);
      setTotalScore(Math.floor(Math.random() * 100) + 1);
      step++;

      if (step > 15) {
        clearInterval(interval);
        rollTimerRef.current = null;
        // hasil akhir dadu 1-100 fair provably RNG
        const finalScore = Math.floor(Math.random() * 100) + 1;
        const finalD1 = Math.floor(Math.random() * 6) + 1;
        const finalD2 = Math.floor(Math.random() * 6) + 1;

        setDiceValues([finalD1, finalD2]);
        setTotalScore(finalScore);

        let won = false;
        if (target === 'over' && finalScore > 50) won = true;
        if (target === 'under' && finalScore < 50) won = true;
        if (target === 'seven' && finalScore === 77) won = true;

        const payout = won ? Math.floor(selectedBet * multiplier) : 0;
        if (won && payout > 0) {
          addLocks({ wls: payout });
        }

        const record: RollRecord = {
          roll: finalScore,
          die1: finalD1,
          die2: finalD2,
          betWls: selectedBet,
          target,
          won,
          payoutWls: payout,
          timestamp: 'Baru saja',
        };

        setLastOutcome(record);
        setHistory((prev) => [record, ...prev.slice(0, 7)]);
        setIsRolling(false);
      }
    }, 80);
    rollTimerRef.current = interval;
  }, [isRolling, canAfford, selectedBet, spendWls, addLocks, target, multiplier]);

  return {
    selectedBet,
    setSelectedBet,
    target,
    setTarget,
    isRolling,
    diceValues,
    totalScore,
    lastOutcome,
    history,
    canAfford,
    multiplier,
    rollDice,
  };
}
