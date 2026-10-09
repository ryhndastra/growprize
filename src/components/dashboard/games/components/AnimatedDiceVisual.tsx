import { motion } from 'motion/react';

interface AnimatedDiceVisualProps {
  diceValues: [number, number];
  isRolling: boolean;
  totalScore: number;
}

// render titik mata dadu (pips 1 sampai 6) secara proporsional
function DieFace({ value }: { value: number }) {
  const renderPips = () => {
    switch (value) {
      case 1:
        return (
          <div className="flex h-full w-full items-center justify-center">
            <span className="h-4 w-4 rounded-full bg-red-600 shadow-inner ring-1 ring-red-400" />
          </div>
        );
      case 2:
        return (
          <div className="flex h-full w-full justify-between p-1.5">
            <span className="h-3 w-3 rounded-full bg-neutral-900 self-start shadow-xs" />
            <span className="h-3 w-3 rounded-full bg-neutral-900 self-end shadow-xs" />
          </div>
        );
      case 3:
        return (
          <div className="flex h-full w-full justify-between p-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900 self-start" />
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 self-center" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900 self-end" />
          </div>
        );
      case 4:
        return (
          <div className="grid h-full w-full grid-cols-2 p-1.5 place-items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
          </div>
        );
      case 5:
        return (
          <div className="relative h-full w-full p-1.5">
            <div className="grid h-full w-full grid-cols-2 place-items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            </div>
            <span className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-red-600" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="grid h-full w-full grid-cols-2 grid-rows-3 p-1.5 place-items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
          </div>
        );
    }
  };

  return (
    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-gradient-to-br from-white via-neutral-50 to-neutral-200 p-1 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_12px_rgba(0,0,0,0.35),0_0_0_2px_#cbd5e1] border-2 border-white select-none">
      {renderPips()}
    </div>
  );
}

// komponen visual 3D lemparan dadu dengan animasi tumbling fisika realistis
export function AnimatedDiceVisual({ diceValues, isRolling, totalScore }: AnimatedDiceVisualProps) {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      {/* panggung lemparan dua dadu */}
      <div className="relative flex items-center justify-center gap-6 sm:gap-8 py-4 px-8 min-h-[140px]">
        {/* dadu 1 */}
        <motion.div
          animate={
            isRolling
              ? {
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.15, 0.9, 1.1, 1],
                  y: [-12, 10, -18, 5, 0],
                  x: [-8, 6, -10, 4, 0],
                }
              : { rotate: 0, scale: 1, y: 0, x: 0 }
          }
          transition={
            isRolling
              ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 350, damping: 20 }
          }
          className="relative filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.3)]"
        >
          <DieFace value={diceValues[0]} />
        </motion.div>

        {/* dadu 2 */}
        <motion.div
          animate={
            isRolling
              ? {
                  rotate: [360, 270, 180, 90, 0],
                  scale: [1, 0.9, 1.2, 0.95, 1],
                  y: [10, -15, 8, -12, 0],
                  x: [6, -8, 5, -6, 0],
                }
              : { rotate: 0, scale: 1, y: 0, x: 0 }
          }
          transition={
            isRolling
              ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 350, damping: 20 }
          }
          className="relative filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.3)]"
        >
          <DieFace value={diceValues[1]} />
        </motion.div>
      </div>

      {/* panel skor hasil lemparan 1-100 */}
      <div className="gt-inset relative flex h-24 sm:h-28 w-56 sm:w-64 flex-col items-center justify-center rounded-xl border-2 border-sky-300 shadow-inner mt-2">
        <motion.span
          key={totalScore}
          animate={isRolling ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          className="font-lucky text-5xl sm:text-6xl text-sky-950 tabular-nums drop-shadow-xs"
        >
          {totalScore}
        </motion.span>
        <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest mt-0.5">
          ANGKA KEBERUNTUNGAN 1 - 100
        </span>
      </div>
    </div>
  );
}

