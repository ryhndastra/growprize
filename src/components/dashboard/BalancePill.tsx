import { motion } from 'motion/react';
import { WalletBalance } from '../../types/dashboard';
import { WorldLockIcon } from '../GrowtopiaAssets';
import { PlusGlyph } from './glyphs';
import { useAnimatedNumber } from './useAnimatedNumber';

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

// tampilkan saldo dalam DL bila mencapai minimal 100 WL, jika tidak dalam WL.
export function formatBalance(totalWls: number): { value: string; unit: string } {
  if (!Number.isFinite(totalWls) || totalWls <= 0) return { value: '0', unit: 'WL' };
  if (totalWls >= 100) return { value: (totalWls / 100).toFixed(2), unit: 'DL' };
  return { value: totalWls.toFixed(2), unit: 'WL' };
}

// satu-satunya penanda saldo di navbar, dengan tombol plus menuju tutorial isi saldo.
export function BalancePill({ balance, onOpenTutorial }: BalancePillProps) {
  const total = totalInWls(balance);
  const { unit } = formatBalance(total);
  // angka saldo dianimasikan lewat ref, unit tetap jadi node statis terpisah.
  const valueRef = useAnimatedNumber(total, (next) => formatBalance(next).value);

  return (
    <div className="flex h-10 sm:h-11 items-center gap-2 rounded-[8px] bg-white/95 px-2.5 sm:px-3 text-black shadow-[2px_3px_0_#000000] border-2 border-[#03afef]">
      <img
        src="/xsolla/items/world_lock.png"
        alt="World Lock"
        className="w-5 h-5 object-contain shrink-0"
        draggable={false}
      />
      <div className="flex flex-col justify-center leading-tight">
        <span className="text-[9px] font-bold uppercase tracking-wider text-black/55">Balance</span>
        <span className="font-mono-num text-xs sm:text-sm font-bold text-black tabular-nums">
          <span ref={valueRef}>{formatBalance(total).value}</span>{' '}
          <span className="text-[10px] font-bold text-sky-900">{unit}</span>
        </span>
      </div>
      <motion.button
        type="button"
        onClick={onOpenTutorial}
        aria-label="Buka tutorial cara isi saldo"
        title="Cara isi saldo"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 24, mass: 0.6 }}
        className="ml-1 flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#43b427] text-white shadow-[1px_1.5px_0_#000000] transition-colors hover:bg-[#50d031] cursor-pointer"
      >
        <PlusGlyph className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
}
