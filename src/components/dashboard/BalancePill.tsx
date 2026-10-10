import { motion } from 'motion/react';
import { WalletBalance } from '../../types/dashboard';
import { PlusGlyph } from './glyphs';
import { useAnimatedNumber } from './useAnimatedNumber';
import { normalizeUsd } from '../../lib/money';
import { formatLocks } from '../../lib/lockCurrency';

interface BalancePillProps {
  balance: WalletBalance | null | undefined;
  onOpenTutorial: () => void;
}

// Penanda saldo resmi di navbar dengan mata uang Growtopia (WL, DL, BGL).
// 100 WL = 1 DL, 100 DL = 1 BGL.
// Ikon dinamis dari https://grow-item-icon.vercel.app/api/icon?id=...&size=1920
// - BGL: 7188
// - DL: 1796
// - WL: 242
export function BalancePill({ balance, onOpenTutorial }: BalancePillProps) {
  const rawTotal = balance?.totalWls ?? balance?.usd ?? (
    (balance?.wls || 0) + (balance?.dls || 0) * 100 + (balance?.bgls || 0) * 10000
  );
  const total = normalizeUsd(rawTotal);
  const formatted = formatLocks(total);
  const valueRef = useAnimatedNumber(total, (next) => formatLocks(next).value);

  return (
    <div
      className="flex min-h-11 items-center gap-1.5 rounded-[8px] bg-white/95 px-2.5 sm:px-3 text-black shadow-[2px_3px_0_#000000] border-2 border-[#03afef]"
      title={`${total} WL total (${formatted.text})`}
    >
      <img
        src={formatted.iconUrl}
        alt={formatted.unit}
        className="h-6 w-6 sm:h-7 sm:w-7 object-contain shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
        draggable={false}
      />
      <span className="font-mono-num text-xs sm:text-sm font-bold text-black tabular-nums inline-flex items-baseline gap-1">
        <span ref={valueRef}>{formatted.value}</span>
        <span className="text-[11px] font-extrabold text-[#0284c7] tracking-tight">{formatted.unit}</span>
      </span>
      <motion.button
        type="button"
        onClick={onOpenTutorial}
        aria-label="Buka halaman isi saldo"
        title="Isi saldo"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 24, mass: 0.6 }}
        className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-[#238a13] text-white shadow-[1px_1.5px_0_#000000] transition-colors hover:bg-[#43b427] cursor-pointer relative after:absolute after:-inset-2 after:content-[''] sm:ml-1"
      >
        <PlusGlyph className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
}
