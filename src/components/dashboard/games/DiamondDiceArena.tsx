import { motion } from 'motion/react';
import { DiceSix, Trophy, ShieldCheck, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useDiceGame, BET_AMOUNTS } from './hooks/useDiceGame';
import { AnimatedDiceVisual } from './components/AnimatedDiceVisual';

export function DiamondDiceArena() {
  const {
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
  } = useDiceGame();

  return (
    <div className="w-full select-none">
      {/* header arena */}
      <div className="text-center mb-6 px-2">
        <div className="inline-flex items-center gap-1.5 rounded bg-[#d9f8ff] px-3 py-1 text-xs font-bold text-sky-900 border border-sky-300 shadow-xs mb-2 max-w-full">
          <DiceSix size={16} weight="fill" className="text-sky-600" />
          <span className="truncate">GROWTOPIA FAIR PROVABLY RNG</span>
        </div>
        <h2 className="gt-lucky-title text-2xl sm:text-4xl lg:text-5xl tracking-wide break-words">
          HIGH ROLLER DIAMOND DICE
        </h2>
        <p className="text-xs sm:text-sm font-bold text-black/70 mt-1 max-w-xl mx-auto">
          Tentukan target angka, pasang taruhan World Lock, dan lempar dadu untuk melipatgandakan kemenanganmu hingga 15x!
        </p>
      </div>

      {/* arena utama dadu */}
      <div className="gt-card p-6 sm:p-8 rounded-xl shadow-[-8px_10px_0_#03afef] border border-sky-300 flex flex-col items-center">
        {/* visual dadu 3d animasi */}
        <AnimatedDiceVisual
          diceValues={diceValues}
          isRolling={isRolling}
          totalScore={totalScore}
        />

        {/* status hasil menang/kalah */}
        {lastOutcome && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mt-2 px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm ${
              lastOutcome.won
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-neutral-800 text-white'
            }`}
          >
            {lastOutcome.won ? (
              <>
                <Trophy size={16} weight="fill" className="text-amber-300" />
                <span>
                  MENANG JACKPOT! +{lastOutcome.payoutWls} World Lock ({multiplier}x Payout)
                </span>
              </>
            ) : (
              <span>Hasil Angka: {lastOutcome.roll} • Coba lempar kembali!</span>
            )}
          </motion.div>
        )}

        {/* pilihan target roll */}
        <div className="w-full max-w-lg mt-6">
          <label className="block text-xs font-bold text-black/70 mb-2 text-center uppercase tracking-wider">
            Pilih Target Angka:
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={isRolling}
              onClick={() => setTarget('over')}
              className={`py-2.5 px-2 rounded-lg font-display text-xs sm:text-sm font-bold transition-all border-2 cursor-pointer ${
                target === 'over'
                  ? 'bg-[#03afef] text-white border-sky-700 shadow-[2px_3px_0_#000]'
                  : 'bg-white hover:bg-sky-50 text-black border-sky-200'
              }`}
            >
              <div>OVER 50</div>
              <div className="text-[10px] opacity-80">51-100 (1.95x)</div>
            </button>

            <button
              type="button"
              disabled={isRolling}
              onClick={() => setTarget('under')}
              className={`py-2.5 px-2 rounded-lg font-display text-xs sm:text-sm font-bold transition-all border-2 cursor-pointer ${
                target === 'under'
                  ? 'bg-[#03afef] text-white border-sky-700 shadow-[2px_3px_0_#000]'
                  : 'bg-white hover:bg-sky-50 text-black border-sky-200'
              }`}
            >
              <div>UNDER 50</div>
              <div className="text-[10px] opacity-80">1-49 (1.95x)</div>
            </button>

            <button
              type="button"
              disabled={isRolling}
              onClick={() => setTarget('seven')}
              className={`py-2.5 px-2 rounded-lg font-display text-xs sm:text-sm font-bold transition-all border-2 cursor-pointer ${
                target === 'seven'
                  ? 'bg-[#fde047] text-black border-amber-600 shadow-[2px_3px_0_#000]'
                  : 'bg-white hover:bg-amber-50 text-black border-sky-200'
              }`}
            >
              <div>LUCKY 77</div>
              <div className="text-[10px] font-bold text-amber-700">Tepat 77 (15x!)</div>
            </button>
          </div>
        </div>

        {/* pilihan jumlah taruhan */}
        <div className="w-full max-w-lg mt-5">
          <label className="block text-xs font-bold text-black/70 mb-2 text-center uppercase tracking-wider">
            Jumlah Taruhan (World Lock):
          </label>
          <div className="grid grid-cols-6 gap-2">
            {BET_AMOUNTS.map((amt) => {
              const isSelected = selectedBet === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  disabled={isRolling}
                  onClick={() => setSelectedBet(amt)}
                  className={`py-2 rounded-lg font-bold text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-black shadow-[1px_2px_0_#03afef]'
                      : 'bg-white hover:bg-sky-50 text-black border-sky-200'
                  }`}
                >
                  {amt === 100 ? '1 DL' : `${amt} WL`}
                </button>
              );
            })}
          </div>
        </div>

        {/* tombol lempar dadu */}
        <div className="w-full max-w-sm mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={isRolling || !canAfford}
            onClick={rollDice}
            className={`gt-btn-3d py-3 text-base sm:text-lg font-bold cursor-pointer transition-all ${
              !canAfford ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRolling
              ? 'MEMUTAR DADU...'
              : !canAfford
              ? `SALDO KURANG (${selectedBet} WL)`
              : `LEMPAR DADU (${selectedBet} WL • MENANG ${Math.floor(selectedBet * multiplier)} WL)`}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-black/60">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Fair 1-100 RNG • Payout Otomatis Masuk Saldo</span>
          </div>
        </div>
      </div>

      {/* riwayat lemparan sesi ini */}
      {history.length > 0 && (
        <div className="mt-6 bg-white/90 p-4 rounded-xl border border-sky-200 shadow-sm">
          <h4 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ArrowCounterClockwise size={14} />
            <span>Riwayat Lemparan Sesi Ini</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                  h.won
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}
              >
                <span>Angka: {h.roll}</span>
                <span>•</span>
                <span>{h.won ? `+${h.payoutWls} WL` : `-${h.betWls} WL`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
