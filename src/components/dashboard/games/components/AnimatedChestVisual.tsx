import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from '@phosphor-icons/react';
import { ItemSprite } from '../../GachaSprites';
import { BoxTier, OpenedReward } from '../hooks/useMysteryBox';
import { formatUsd } from '../../../../lib/money';

interface AnimatedChestVisualProps {
  selectedTier: BoxTier;
  isOpening: boolean;
  lastReward: OpenedReward | null;
}

export function AnimatedChestVisual({
  selectedTier,
  isOpening,
  lastReward,
}: AnimatedChestVisualProps) {
  return (
    <div className="relative my-4 flex items-center justify-center min-h-[180px]">
      <AnimatePresence mode="wait">
        {isOpening ? (
          <motion.div
            key="opening-chest"
            animate={{
              rotate: [-4, 4, -5, 5, -2, 2, 0],
              scale: [1, 1.12, 0.95, 1.15, 1],
              y: [0, -8, 3, -10, 0],
            }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex flex-col items-center"
          >
            {/* sinar rotasi berputar di belakang peti */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-400/30 via-yellow-300/40 to-amber-500/30 blur-md pointer-events-none"
            />

            <img
              src={selectedTier.previewImage}
              alt=""
              className="relative h-32 w-32 object-contain drop-shadow-[0_12px_24px_rgba(3,175,239,0.6)]"
              draggable={false}
            />
            <span className="font-lucky text-base text-sky-950 mt-3 animate-pulse bg-white/80 px-4 py-1 rounded-full shadow-xs border border-sky-300">
              MEMBUKA PETI RAHASIA...
            </span>
          </motion.div>
        ) : lastReward ? (
          <motion.div
            key="reward-chest"
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="flex flex-col items-center bg-[#d9f8ff]/80 p-5 rounded-2xl border-2 border-sky-400 shadow-lg"
          >
            <div className="inline-flex items-center gap-1 rounded bg-amber-400 text-black px-3 py-0.5 text-xs font-bold mb-2 shadow-xs uppercase tracking-wider">
              <Trophy size={14} weight="fill" />
              <span>HADIAH: {lastReward.tier}</span>
            </div>

            {lastReward.item ? (
              <motion.div
                initial={{ y: 10, scale: 0.8 }}
                animate={{ y: 0, scale: 1 }}
                className="gt-inset flex h-20 w-20 items-center justify-center p-2 rounded-xl my-1 border border-sky-300"
              >
                <ItemSprite sprite={lastReward.item.icon} className="h-14 w-14" />
              </motion.div>
            ) : (
              <motion.img
                initial={{ y: 10, scale: 0.8 }}
                animate={{ y: 0, scale: 1 }}
                src="/xsolla/items/growtoken.png"
                alt=""
                className="h-16 w-16 object-contain drop-shadow my-1"
                draggable={false}
              />
            )}

            <h4 className="font-lucky text-2xl text-black mt-1">
              {lastReward.name}
            </h4>
            <p className="text-xs font-bold text-black/70 max-w-sm mt-0.5 text-center">
              {lastReward.description}
            </p>
            <span className="text-xs font-bold text-emerald-800 mt-2 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
              Estimasi Nilai: ~{formatUsd(lastReward.usdValue)}
            </span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={selectedTier.previewImage}
              alt=""
              className="h-28 w-28 sm:h-32 sm:w-32 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-transform"
              draggable={false}
            />
            <p className="font-display font-bold text-xs sm:text-sm text-black/70 mt-3 text-center">
              {selectedTier.poolDescription}
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

