import { motion } from 'motion/react';
import { WalletBalance } from '../../types/dashboard';
import { PlusGlyph } from './glyphs';
import { useAnimatedNumber } from './useAnimatedNumber';
import { lockIconUrl, type LockIconKind } from '../../lib/growIcons';

interface BalancePillProps {
  balance: WalletBalance;
  onOpenTutorial: () => void;
}

// konversi ke satuan WL sebagai dasar perhitungan total saldo.
export function totalInWls(balance: WalletBalance | null | undefined): number {
  if (!balance) return 0;
  const wls = Number.isFinite(balance.wls) ? balance.wls : 0;
  const dls = Number.isFinite(balance.dls) ? balance.dls : 0;
  const bgls = Number.isFinite(balance.bgls) ? balance.bgls : 0;
  return wls + dls * 100 + bgls * 10000;
}

// saldo ditampilkan dalam unit terbesar yang masih masuk akal:
// bgl bila >= 10000 wl, dl bila >= 100 wl, selain itu wl.
export function formatBalance(totalWls: number): { value: string; unit: string; kind: LockIconKind } {
  if (!Number.isFinite(totalWls) || totalWls <= 0) {
    return { value: '0', unit: 'WL', kind: 'wl' };
  }
  if (totalWls >= 10000) {
    return { value: (totalWls / 10000).toFixed(2), unit: 'BGL', kind: 'bgl' };
  }
  if (totalWls >= 100) {
    return { value: (totalWls / 100).toFixed(2), unit: 'DL', kind: 'dl' };
  }
  return { value: totalWls.toFixed(2), unit: 'WL', kind: 'wl' };
}

// satu-satunya penanda saldo di navbar. ikon lock diambil dinamis dari endpoint
// grow-item-icon sesuai unit saldo yang sedang ditampilkan, plus tombol isi saldo.
export function BalancePill({ balance, onOpenTutorial }: BalancePillProps) {
  const total = totalInWls(balance);
  const { unit, kind } = formatBalance(total);
  const valueRef = useAnimatedNumber(total, (next) => formatBalance(next).value);
  const iconSrc = lockIconUrl(kind, 128);

  return (
    <div className="flex min-h-11 items-center gap-1.5 rounded-[8px] bg-white/95 px-2 sm:px-3 text-black shadow-[2px_3px_0_#000000] border-2 border-[#03afef]">
      <img
        src={iconSrc}
        alt=""
        className="h-6 w-6 object-contain shrink-0"
        draggable={false}
      />
      <span className="font-mono-num text-xs sm:text-sm font-bold text-black tabular-nums inline-flex items-baseline gap-1">
        <span ref={valueRef}>{formatBalance(total).value}</span>
        <span className="text-[10px] font-bold text-sky-900">{unit}</span>
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
