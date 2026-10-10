import { motion } from 'motion/react';
import { WalletBalance } from '../../types/dashboard';
import { PlusGlyph } from './glyphs';
import { useAnimatedNumber } from './useAnimatedNumber';
import { formatUsd, normalizeUsd } from '../../lib/money';

interface BalancePillProps {
  balance: WalletBalance | null | undefined;
  onOpenTutorial: () => void;
}

// satu-satunya penanda saldo di navbar. saldo sudah dalam usd, jadi ornamennya
// koin growtoken (bukan lock wl/dl/bgl) plus tombol isi saldo.
export function BalancePill({ balance, onOpenTutorial }: BalancePillProps) {
  const total = normalizeUsd(balance?.usd);
  const valueRef = useAnimatedNumber(total, formatUsd);

  return (
    <div className="flex min-h-11 items-center gap-1.5 rounded-[8px] bg-white/95 px-2 sm:px-3 text-black shadow-[2px_3px_0_#000000] border-2 border-[#03afef]">
      <img
        src="/xsolla/items/growtoken.png"
        alt=""
        className="h-6 w-6 object-contain shrink-0"
        draggable={false}
      />
      <span className="font-mono-num text-xs sm:text-sm font-bold text-black tabular-nums inline-flex items-baseline gap-1">
        <span ref={valueRef}>{formatUsd(total)}</span>
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
