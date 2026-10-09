import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  DiamondLockIcon,
  BlueGemLockIcon,
  ArrowRightIcon,
} from '../../GrowtopiaAssets';
import { useDashboard } from '../DashboardContext';

interface StatusMsg {
  text: string;
  isError?: boolean;
}

// halaman pertukaran lock bergaya kartu putih & biru es xsolla.growtopiagame.com.
export function LockExchange() {
  const { balance, isGuest, convertLocks, requireLogin } = useDashboard();
  const reduceMotion = useReducedMotion();

  const [wlToDlAmount, setWlToDlAmount] = useState<number>(100);
  const [dlToWlAmount, setDlToWlAmount] = useState<number>(1);
  const [dlToBglAmount, setDlToBglAmount] = useState<number>(100);
  const [statusMsg, setStatusMsg] = useState<StatusMsg | null>(null);

  const packWls = () => {
    if (isGuest) {
      requireLogin('Log in GrowID untuk menukar lock.');
      return;
    }
    if (balance.wls < wlToDlAmount || wlToDlAmount < 100) {
      setStatusMsg({ text: 'WLs tidak cukup, minimal 100 WL.', isError: true });
      return;
    }
    const dlsToAdd = Math.floor(wlToDlAmount / 100);
    const wlsToSub = dlsToAdd * 100;
    convertLocks({ ...balance, wls: balance.wls - wlsToSub, dls: balance.dls + dlsToAdd });
    setStatusMsg({ text: `Menukar ${wlsToSub} WL jadi ${dlsToAdd} DL.` });
  };

  const breakDls = () => {
    if (isGuest) {
      requireLogin('Log in GrowID untuk menukar lock.');
      return;
    }
    if (balance.dls < dlToWlAmount || dlToWlAmount < 1) {
      setStatusMsg({ text: 'DLs tidak cukup untuk dipecah.', isError: true });
      return;
    }
    const wlsToAdd = dlToWlAmount * 100;
    convertLocks({ ...balance, dls: balance.dls - dlToWlAmount, wls: balance.wls + wlsToAdd });
    setStatusMsg({ text: `Memecah ${dlToWlAmount} DL jadi ${wlsToAdd} WL.` });
  };

  const packDls = () => {
    if (isGuest) {
      requireLogin('Log in GrowID untuk menukar lock.');
      return;
    }
    if (balance.dls < dlToBglAmount || dlToBglAmount < 100) {
      setStatusMsg({ text: 'DLs tidak cukup, minimal 100 DL untuk 1 BGL.', isError: true });
      return;
    }
    const bglsToAdd = Math.floor(dlToBglAmount / 100);
    const dlsToSub = bglsToAdd * 100;
    convertLocks({ ...balance, dls: balance.dls - dlsToSub, bgls: balance.bgls + bglsToAdd });
    setStatusMsg({ text: `Mencetak ${bglsToAdd} Blue Gem Lock.` });
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* kartu putih atas 2 kolom bergaya featured card xsolla */}
      <div className="gt-white-card w-full p-5 sm:p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7">
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
              Lock Exchange
            </h2>
            <p className="text-sm sm:text-base text-black/80 mt-2.5 leading-relaxed">
              Konversi instan antara World Lock, Diamond Lock, dan Blue Gem Lock menggunakan rate resmi in-game 100% tanpa biaya potongan.
            </p>

            {isGuest && (
              <div className="mt-4 rounded-[6px] bg-[#d9f8ff] px-4 py-2.5 text-xs font-bold text-black flex items-center gap-2">
                <img src="/xsolla/items/world_lock.png" alt="" className="w-4 h-4 object-contain shrink-0" />
                <span>
                  Kamu melihat sebagai Guest.{' '}
                  <button
                    type="button"
                    onClick={() => requireLogin('Log in GrowID untuk menukar lock.')}
                    className="underline decoration-2 underline-offset-2 text-[#0284c7] hover:text-black cursor-pointer font-bold"
                  >
                    Login GrowID
                  </button>{' '}
                  untuk menukar lock.
                </span>
              </div>
            )}

            <AnimatePresence>
              {statusMsg && (
                <motion.div
                  role="status"
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 px-4 py-2.5 rounded-[6px] text-xs font-bold border-2 ${
                    statusMsg.isError
                      ? 'bg-red-50 border-red-500 text-red-800'
                      : 'bg-emerald-50 border-[#43b427] text-emerald-900'
                  }`}
                >
                  {statusMsg.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-5 flex flex-col overflow-hidden rounded-[8px]">
            <div className="gt-inset flex h-40 w-full items-center justify-center rounded-t-[8px] rounded-b-none p-4">
              <img
                src="/xsolla/items/gem_abundance.png"
                alt="Gem Abundance"
                className="h-32 w-auto object-contain drop-shadow"
                draggable={false}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 rounded-b-[8px] bg-[#d9f8ff] p-3.5 text-xs sm:text-sm font-bold text-black">
              <span className="flex items-center gap-1.5">
                <img src="/xsolla/items/world_lock.png" alt="" className="w-5 h-5 object-contain" />
                100 WL = 1 DL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <DiamondLockIcon className="w-5 h-5" />
                100 DL = 1 BGL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 kartu konversi biru es bergaya store cards xsolla */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <ExchangeCard
          title="PADATKAN KE DL"
          rate="100 WL = 1 DL"
          topperSrc="/xsolla/tv_store.png"
          fromIcon={<img src="/xsolla/items/world_lock.png" alt="WL" className="w-10 h-10 object-contain" />}
          toIcon={<DiamondLockIcon className="w-10 h-10" />}
        >
          <AmountInput
            id="wl-input"
            label="WL"
            step={100}
            min={100}
            max={balance.wls}
            value={wlToDlAmount}
            onChange={setWlToDlAmount}
          />
          <button
            type="button"
            onClick={packWls}
            disabled={isGuest}
            className="gt-btn-3d cursor-pointer w-full h-12 text-base font-bold uppercase mt-3"
          >
            CETAK {Math.max(0, Math.floor(wlToDlAmount / 100))} DL
          </button>
        </ExchangeCard>

        <ExchangeCard
          title="PECAH KE WL"
          rate="1 DL = 100 WL"
          topperSrc="/xsolla/box_topper.png"
          fromIcon={<DiamondLockIcon className="w-10 h-10" />}
          toIcon={<img src="/xsolla/items/world_lock.png" alt="WL" className="w-10 h-10 object-contain" />}
        >
          <AmountInput
            id="dl-break-input"
            label="DL"
            step={1}
            min={1}
            max={balance.dls}
            value={dlToWlAmount}
            onChange={setDlToWlAmount}
          />
          <button
            type="button"
            onClick={breakDls}
            disabled={isGuest}
            className="gt-btn-3d cursor-pointer w-full h-12 text-base font-bold uppercase mt-3"
          >
            DAPAT {Math.max(0, dlToWlAmount * 100)} WL
          </button>
        </ExchangeCard>

        <ExchangeCard
          title="CETAK BGL"
          rate="100 DL = 1 BGL"
          featured
          fromIcon={<DiamondLockIcon className="w-10 h-10" />}
          toIcon={<BlueGemLockIcon className="w-10 h-10" />}
        >
          <AmountInput
            id="bgl-input"
            label="DL"
            step={100}
            min={100}
            max={balance.dls}
            value={dlToBglAmount}
            onChange={setDlToBglAmount}
          />
          <button
            type="button"
            onClick={packDls}
            disabled={isGuest}
            className="gt-btn-3d cursor-pointer w-full h-12 text-base font-bold uppercase mt-3"
          >
            CETAK {Math.max(0, Math.floor(dlToBglAmount / 100))} BGL
          </button>
        </ExchangeCard>
      </div>
    </div>
  );
}

function ExchangeCard({
  title,
  rate,
  fromIcon,
  toIcon,
  featured,
  topperSrc,
  children,
}: {
  title: string;
  rate: string;
  fromIcon: ReactNode;
  toIcon: ReactNode;
  featured?: boolean;
  topperSrc?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative gt-card p-5 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 ${
        featured ? 'ring-3 ring-[#43b427]' : ''
      }`}
    >
      {topperSrc && (
        <img
          src={topperSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -top-16 right-6 w-20 h-auto object-contain"
          draggable={false}
        />
      )}

      <div>
        <div className="flex items-center justify-between pb-3">
          <span className="font-display font-bold text-lg text-black">{title}</span>
          <span className="rounded-[4px] bg-[#43b427] px-2.5 py-0.5 text-xs font-bold text-white shadow-[1.5px_2px_0_#000] tabular-nums">
            {rate}
          </span>
        </div>

        <div className="gt-inset my-2 py-7 flex items-center justify-center gap-5">
          {fromIcon}
          <ArrowRightIcon className="w-6 h-6" />
          {toIcon}
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function AmountInput({
  id,
  label,
  step,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  step: number;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const clamp = (raw: number) => {
    if (!Number.isFinite(raw)) return min;
    return Math.max(min, Math.floor(raw));
  };

  const handleChange = (raw: string) => {
    const parsed = raw.trim() === '' ? min : Number(raw);
    onChange(clamp(parsed));
  };

  const setMax = () => {
    const safeMax = Number.isFinite(max) ? max : 0;
    if (min >= 100) onChange(Math.max(min, Math.floor(safeMax / 100) * 100));
    else onChange(Math.max(min, safeMax));
  };

  return (
    <div className="flex items-center gap-2 rounded-[5px] bg-white px-3 py-2.5 shadow-[inset_0_2px_4px_rgba(1,45,55,0.2)] focus-within:ring-2 focus-within:ring-[#03afef]">
      <label htmlFor={id} className="text-xs font-bold text-black/70 shrink-0">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        inputMode="numeric"
        className="w-full min-w-0 bg-transparent text-sm sm:text-base font-bold text-black outline-none tabular-nums"
      />
      <span className="text-xs text-black/50 font-bold tabular-nums shrink-0">/{max}</span>
      <button
        type="button"
        onClick={setMax}
        className="text-xs font-bold px-2.5 py-1 rounded-[4px] cursor-pointer shrink-0 bg-[#43b427] hover:bg-[#50d031] text-white shadow-[1.5px_2px_0_#000]"
      >
        MAX
      </button>
    </div>
  );
}
