import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GachaItem } from '../../../types/dashboard';
import { RarityChip } from './RarityTierPills';
import { ItemSprite } from '../GachaSprites';

interface ChestRouletteProps {
  isRolling: boolean;
  reelItems: GachaItem[];
  selectedIndex: number;
  turboEnabled: boolean;
  soundEnabled: boolean;
}

function playTickSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // abaikan jika audio diblokir browser
  }
}

const CARD_W = 124;
const GAP = 14;
const PITCH = CARD_W + GAP;

// roda putar peti di dalam kotak biru muda #b5eefa khas kartu it's rainin' gems xsolla.
export function ChestRoulette({
  isRolling,
  reelItems,
  selectedIndex,
  turboEnabled,
  soundEnabled,
}: ChestRouletteProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!isRolling || !soundEnabled || turboEnabled) return;
    const interval = setInterval(() => {
      playTickSound();
    }, 90);
    return () => clearInterval(interval);
  }, [isRolling, soundEnabled, turboEnabled]);

  const centerOffset = viewportW > 0 ? viewportW / 2 - CARD_W / 2 : 0;
  const targetX = centerOffset - selectedIndex * PITCH;

  return (
    <div className="relative w-full flex flex-col overflow-hidden rounded-[8px] select-none">
      {/* bagian atas: kotak biru muda #b5eefa tempat peti dan reel berputar */}
      <div className="gt-inset relative flex flex-col items-center justify-center rounded-t-[8px] rounded-b-none px-3 py-4">
        <div className="mb-3 flex items-center gap-3">
          <motion.img
            src="/xsolla/items/it_s_rainin_gems.png"
            alt="It's Rainin' Gems Chest"
            animate={
              reduceMotion
                ? undefined
                : isRolling
                  ? { scale: [1, 1.07, 1], rotate: [-2, 2, -2, 0] }
                  : { y: [0, -3, 0] }
            }
            transition={
              isRolling
                ? { repeat: Infinity, duration: 0.35 }
                : { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }
            }
            className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
            draggable={false}
          />
        </div>

        {/* jendela strip kartu roulette */}
        <div className="relative w-full h-36 rounded-[8px] bg-white/85 shadow-[inset_0_2px_6px_rgba(1,45,55,0.2)] overflow-hidden flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/90 to-transparent z-20 pointer-events-none" />

          <Needle />

          <div ref={viewportRef} className="w-full h-full flex items-center overflow-hidden relative">
            <motion.div
              animate={{
                x: reduceMotion
                  ? targetX
                  : isRolling
                    ? [targetX + 900, targetX]
                    : targetX,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : isRolling
                    ? {
                        duration: turboEnabled ? 0.75 : 3.2,
                        ease: [0.12, 0.75, 0.2, 1],
                      }
                    : { duration: 0.45, ease: 'easeOut' }
              }
              className="flex items-center shrink-0"
              style={{ gap: GAP }}
            >
              {reelItems.map((item, idx) => (
                <ReelCard
                  key={`${item.id}-${idx}`}
                  item={item}
                  highlighted={idx === selectedIndex && !isRolling}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* bagian bawah: pita biru es #d9f8ff dengan ikon megaphone, growtoken, world lock, dan gems seperti di xsolla */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-b-[8px] bg-[#d9f8ff] px-4 py-3 text-black">
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

function Needle() {
  return (
    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 z-30 pointer-events-none flex flex-col justify-between items-center">
      <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[13px] border-t-[#43b427] drop-shadow" />
      <div className="w-0.5 h-full bg-[#43b427]" />
      <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[13px] border-b-[#43b427] drop-shadow" />
    </div>
  );
}

function ReelCard({ item, highlighted }: { item: GachaItem; highlighted: boolean }) {
  const valueLabel = valueInDls(item.valueInDls);
  return (
    <div
      style={{ width: CARD_W }}
      className={`h-28 rounded-[8px] flex flex-col items-center justify-between p-2 shrink-0 transition-transform duration-200 ${
        highlighted
          ? 'bg-white ring-3 ring-[#43b427] shadow-[-4px_5px_0px_0px_#03afef] scale-105 z-10'
          : 'bg-[#d9f8ff] shadow-[-3px_4px_0px_0px_#03afef]'
      }`}
    >
      <RarityChip rarity={item.rarity} />

      <div className="my-0.5 select-none">
        <ItemSprite sprite={item.icon} className="w-9 h-9" />
      </div>

      <span className="text-[11px] font-bold text-black text-center leading-tight truncate w-full">
        {item.name}
      </span>

      <span className="text-[10px] font-bold text-[#15803d] tabular-nums">{valueLabel}</span>
    </div>
  );
}

function valueInDls(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0 WL';
  if (value >= 1) return `${value} DL`;
  return `${Math.round(value * 100)} WL`;
}
