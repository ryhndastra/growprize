import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GachaItem } from '../../../types/dashboard';
import { RarityChip } from './RarityTierPills';
import { GrowItemIcon } from '../GrowItemIcon';
import { CARD_W, GAP, PITCH } from './reelGeometry';
import { formatUsd } from '../../../lib/money';

interface ChestRouletteProps {
  isRolling: boolean;
  reelItems: GachaItem[];
  selectedIndex: number;
  subJitter?: number;
  turboEnabled: boolean;
  soundEnabled: boolean;
  /** Berubah tiap spin supaya animasi memulai ulang dari awal. */
  spinNonce: number;
}

function playTickSound(ctx: AudioContext | null, pitchMultiplier = 1) {
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = 480 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // audio context blocked by browser policy
  }
}

// Roda putar case-opening ala CS2 di dalam kontainer biru muda Xsolla
export function ChestRoulette({
  isRolling,
  reelItems,
  selectedIndex,
  subJitter = 0,
  turboEnabled,
  soundEnabled,
  spinNonce,
}: ChestRouletteProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const [needleTick, setNeedleTick] = useState(false);
  const reduceMotion = useReducedMotion();
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Inisialisasi AudioContext sekali
  useEffect(() => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtxRef.current = new AudioCtx();
    }
    return () => {
      void audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, []);

  // Jadwal audio tick deselerasi realistis ala CS2 case opening
  useEffect(() => {
    if (!isRolling || !soundEnabled) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const duration = turboEnabled ? 1100 : 5000;

    // Menghasilkan tick deselerasi: cepat di awal, bertahap melambat, lalu klik akhir
    const tickTimes: number[] = [];
    if (turboEnabled) {
      let t = 50;
      let gap = 40;
      while (t < duration - 80) {
        tickTimes.push(t);
        t += gap;
        gap = Math.min(220, gap * 1.25);
      }
    } else {
      let t = 40;
      let gap = 35;
      while (t < duration - 120) {
        tickTimes.push(t);
        t += gap;
        if (t < 1800) {
          gap = Math.min(65, gap * 1.05);
        } else if (t < 3400) {
          gap = Math.min(180, gap * 1.12);
        } else if (t < 4400) {
          gap = Math.min(360, gap * 1.22);
        } else {
          gap = Math.min(600, gap * 1.35);
        }
      }
    }

    tickTimes.forEach((ms, idx) => {
      const isNearEnd = idx >= tickTimes.length - 3;
      const tid = setTimeout(() => {
        playTickSound(audioCtxRef.current, isNearEnd ? 1.2 : 1.0);
        setNeedleTick(true);
        const resetId = setTimeout(() => setNeedleTick(false), 45);
        timeouts.push(resetId);
      }, ms);
      timeouts.push(tid);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isRolling, soundEnabled, turboEnabled, spinNonce]);

  // Posisi needle tepat di tengah viewport kontainer
  const centerOffset = viewportW > 0 ? viewportW / 2 - CARD_W / 2 : 0;
  const targetX = centerOffset - (selectedIndex * PITCH + subJitter);
  // Titik awal putaran: mulai dari dekat kartu ke-2 agar terlihat meluncur jauh melintasi puluhan item
  const startX = centerOffset - 2 * PITCH;

  return (
    <div className="relative w-full flex flex-col overflow-hidden rounded-[8px] select-none">
      {/* Kotak atas: inset biru muda tempat peti dan reel berputar */}
      <div className="gt-inset relative flex flex-col items-center justify-center rounded-t-[8px] rounded-b-none px-3 py-4">
        <div className="mb-3 flex items-center gap-3">
          <motion.img
            src="/xsolla/items/it_s_rainin_gems.png"
            alt="It's Rainin' Gems Chest"
            animate={
              reduceMotion
                ? undefined
                : isRolling
                  ? { scale: [1, 1.08, 1], rotate: [-3, 3, -3, 0] }
                  : { y: [0, -3, 0] }
            }
            transition={
              isRolling
                ? { repeat: Infinity, duration: 0.3 }
                : { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }
            }
            className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
            draggable={false}
          />
        </div>

        {/* Jendela reel kartu CS2 case-opening */}
        <div className="relative w-full h-38 rounded-[8px] bg-slate-900/90 border border-slate-700/60 shadow-[inset_0_3px_10px_rgba(0,0,0,0.6)] overflow-hidden flex items-center">
          {/* Vignette gradien bayangan kiri dan kanan */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

          {/* Indikator Jarum Penunjuk Tengah (atas & bawah) */}
          <Needle isTicking={needleTick} />

          {/* Viewport strip kartu motion */}
          <div ref={viewportRef} className="w-full h-full flex items-center overflow-hidden relative">
            <motion.div
              key={spinNonce}
              initial={
                reduceMotion || spinNonce === 0
                  ? { x: targetX }
                  : { x: startX }
              }
              animate={{ x: targetX }}
              transition={
                reduceMotion || spinNonce === 0
                  ? { duration: 0 }
                  : {
                      duration: turboEnabled ? 1.1 : 5.0,
                      // Kurva deselerasi khas CS2: cepat meluncur lalu bertahap melambat mulus
                      ease: [0.08, 0.77, 0.2, 1.0],
                    }
              }
              className="flex items-center shrink-0 absolute left-0"
              style={{ gap: GAP }}
            >
              {reelItems.map((item, idx) => {
                const isWinner = idx === selectedIndex;
                return (
                  <ReelCard
                    key={`${item.id}-${idx}`}
                    item={item}
                    highlighted={isWinner && !isRolling}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bagian bawah: pita biru es #d9f8ff dengan rincian hadiah bonus */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-b-[8px] bg-[#d9f8ff] px-4 py-3 text-black border-t-2 border-[#03afef]">
        <div className="flex items-center gap-1.5">
          <img src="/xsolla/items/megaphone.png" alt="" className="w-6 h-6 object-contain" />
          <span className="font-bold text-sm sm:text-base">x1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/xsolla/items/growtoken.png" alt="" className="w-6 h-6 object-contain" />
          <span className="font-bold text-sm sm:text-base">x2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/xsolla/items/world_lock.png" alt="" className="w-6 h-6 object-contain" />
          <span className="font-bold text-sm sm:text-base">x630</span>
        </div>
        <div className="flex w-full items-center justify-center gap-2 pt-0.5">
          <img src="/xsolla/items/gems.png" alt="" className="w-6 h-6 object-contain" />
          <span className="font-bold text-sm sm:text-base tabular-nums">x2.500.000</span>
        </div>
      </div>
    </div>
  );
}

function Needle({ isTicking }: { isTicking: boolean }) {
  return (
    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 z-30 pointer-events-none flex flex-col justify-between items-center">
      {/* Jarum Segitiga Atas */}
      <motion.div
        animate={isTicking ? { y: [-2, 0], scale: [1.2, 1] } : { y: 0, scale: 1 }}
        transition={{ duration: 0.05 }}
        className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[14px] border-t-[#43b427] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      />
      {/* Garis laser hijau penanda tengah */}
      <div className="w-[2px] h-full bg-[#43b427]/80 shadow-[0_0_6px_#43b427]" />
      {/* Jarum Segitiga Bawah */}
      <motion.div
        animate={isTicking ? { y: [2, 0], scale: [1.2, 1] } : { y: 0, scale: 1 }}
        transition={{ duration: 0.05 }}
        className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[14px] border-b-[#43b427] drop-shadow-[0_-2px_4px_rgba(0,0,0,0.8)]"
      />
    </div>
  );
}

// Warna aksen border & strip bawah ala CS2 rarity grading
const RARITY_ACCENT: Record<string, { border: string; glow: string; bar: string }> = {
  mythic: {
    border: 'border-yellow-400',
    glow: 'shadow-[0_0_16px_rgba(250,204,21,0.6)]',
    bar: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500',
  },
  legendary: {
    border: 'border-red-500',
    glow: 'shadow-[0_0_14px_rgba(239,68,68,0.5)]',
    bar: 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600',
  },
  epic: {
    border: 'border-purple-500',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.45)]',
    bar: 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600',
  },
  rare: {
    border: 'border-blue-500',
    glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]',
    bar: 'bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600',
  },
  common: {
    border: 'border-sky-400',
    glow: 'shadow-[0_0_8px_rgba(56,189,248,0.3)]',
    bar: 'bg-gradient-to-r from-sky-500 to-teal-400',
  },
};

function ReelCard({
  item,
  highlighted,
}: {
  item: GachaItem;
  highlighted: boolean;
}) {
  const valueLabel = formatUsd(item.valueInUsd);
  const accent = RARITY_ACCENT[item.rarity] || RARITY_ACCENT.common;

  return (
    <div
      style={{ width: CARD_W }}
      className={`h-32 rounded-[7px] flex flex-col items-center justify-between p-2 shrink-0 relative overflow-hidden transition-all duration-200 select-none ${
        highlighted
          ? `bg-slate-800 text-white ring-3 ring-[#43b427] ${accent.glow} scale-105 z-10`
          : 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/80 border border-slate-700/80'
      }`}
    >
      {/* Strip warna rarity di bagian atas kartu ala CS2 */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${accent.bar}`} />

      <div className="w-full flex justify-between items-center pt-1 px-0.5">
        <RarityChip rarity={item.rarity} />
      </div>

      <div className="my-0.5 flex items-center justify-center">
        <GrowItemIcon
          item={item}
          className={`w-10 h-10 transition-transform ${highlighted ? 'scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]' : ''}`}
          requestSize={128}
        />
      </div>

      <span className="text-[11px] font-bold text-center leading-tight truncate w-full text-slate-100 px-1">
        {item.name}
      </span>

      <span className="text-[10px] font-bold text-emerald-400 tabular-nums">
        {valueLabel}
      </span>

      {/* Bar warna glow di bagian bawah kartu */}
      <div className={`w-full h-1 rounded-full mt-0.5 ${accent.bar}`} />
    </div>
  );
}
