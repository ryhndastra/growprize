import { motion } from 'motion/react';
import { Sparkle, Trophy, ShieldCheck, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useLuckyWheel } from './hooks/useLuckyWheel';
import { AnimatedWheelVisual } from './components/AnimatedWheelVisual';

export function LuckyWheelArena() {
  const {
    isSpinning,
    rotation,
    lastWin,
    history,
    canAfford,
    costWls,
    spinWheel,
  } = useLuckyWheel();

  return (
    <div className="w-full select-none">
      {/* header arena */}
      <div className="text-center mb-6 px-2">
        <div className="inline-flex items-center gap-1.5 rounded bg-[#d9f8ff] px-3 py-1 text-xs font-bold text-sky-900 border border-sky-300 shadow-xs mb-2">
          <Sparkle size={16} weight="fill" className="text-amber-500" />
          <span>LUCKY ROULETTE WHEEL</span>
        </div>
        <h2 className="gt-lucky-title text-2xl sm:text-4xl lg:text-5xl tracking-wide break-words">
          LUCKY WHEEL OF LOCKS
        </h2>
        <p className="text-xs sm:text-sm font-bold text-black/70 mt-1 max-w-xl mx-auto">
          Putar roda keberuntungan berlapis untuk memenangkan ribuan Gems, World Lock, Diamond Lock, atau Sayap Iblis legendaris!
        </p>
      </div>

      {/* panggung roda putar */}
      <div className="gt-card p-6 sm:p-8 rounded-xl shadow-[-8px_10px_0_#03afef] border border-sky-300 flex flex-col items-center">
        <AnimatedWheelVisual rotation={rotation} isSpinning={isSpinning} />

        {/* hasil putaran */}
        {lastWin && !isSpinning && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 px-6 py-2.5 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-md border-2 border-emerald-300"
          >
            <Trophy size={18} weight="fill" className="text-amber-300" />
            <span>SELAMAT! Kamu Memenangkan: {lastWin.label}</span>
          </motion.div>
        )}

        {/* tombol aksi */}
        <div className="w-full max-w-sm mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={isSpinning || !canAfford}
            onClick={spinWheel}
            className={`gt-btn-3d py-3 text-base sm:text-lg font-bold cursor-pointer transition-all ${
              !canAfford ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSpinning
              ? 'RODA SEDANG BERPUTAR...'
              : !canAfford
              ? `SALDO KURANG (${costWls} WL)`
              : `PUTAR RODA SEKARANG (${costWls} WL)`}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-black/60">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>8 Segmen Fair RNG • Hadiah Langsung Masuk Saldo</span>
          </div>
        </div>
      </div>

      {/* riwayat putaran */}
      {history.length > 0 && (
        <div className="mt-6 bg-white/90 p-4 rounded-xl border border-sky-200 shadow-sm">
          <h4 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ArrowCounterClockwise size={14} />
            <span>Riwayat Putaran Sesi Ini</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 text-xs font-bold text-sky-950"
              >
                <Sparkle size={12} weight="fill" className="text-amber-500" />
                <span>{h.segment.label}</span>
                <span className="text-[10px] text-sky-600">({h.timestamp})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
