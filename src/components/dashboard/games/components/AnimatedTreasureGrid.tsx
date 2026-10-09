import { motion } from 'motion/react';
import { Shovel, Trophy } from '@phosphor-icons/react';
import { TreasureTile } from '../hooks/useTreasureHunt';

interface AnimatedTreasureGridProps {
  tiles: TreasureTile[];
  isPlaying: boolean;
  onDig: (tileId: number) => void;
}

export function AnimatedTreasureGrid({ tiles, isPlaying, onDig }: AnimatedTreasureGridProps) {
  if (tiles.length === 0) {
    return (
      <div className="flex h-64 sm:h-72 w-full max-w-md items-center justify-center rounded-xl bg-sky-950/20 border-2 border-dashed border-sky-300 p-6 text-center">
        <div className="flex flex-col items-center">
          <Shovel size={40} weight="fill" className="text-amber-600 mb-2" />
          <p className="font-display font-bold text-sm text-black/75">
            Tekan &quot;MULAI PENGGALIAN&quot; untuk menyiapkan 9 petak tanah misterius!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md my-4">
      {tiles.map((tile) => (
        <motion.button
          key={tile.id}
          type="button"
          disabled={!isPlaying || tile.revealed}
          onClick={() => onDig(tile.id)}
          whileHover={isPlaying && !tile.revealed ? { scale: 1.05 } : undefined}
          whileTap={isPlaying && !tile.revealed ? { scale: 0.95 } : undefined}
          className={`relative flex h-24 sm:h-28 flex-col items-center justify-center rounded-xl p-2 transition-all border-2 select-none cursor-pointer ${
            tile.revealed
              ? tile.wls > 0
                ? 'bg-amber-100 border-amber-400 shadow-inner'
                : 'bg-neutral-200 border-neutral-400 shadow-inner'
              : 'gt-dirt-band border-[#7a481c] shadow-[2px_4px_0_#000000] hover:brightness-110'
          }`}
        >
          {tile.revealed ? (
            <motion.div
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="flex flex-col items-center text-center"
            >
              {tile.wls >= 100 ? (
                <div className="flex flex-col items-center">
                  <Trophy size={28} weight="fill" className="text-amber-500 animate-bounce" />
                  <span className="font-lucky text-xs text-sky-950 mt-1">1 DL</span>
                </div>
              ) : tile.wls > 0 ? (
                <div className="flex flex-col items-center">
                  <img
                    src="/xsolla/items/world_lock.png"
                    alt=""
                    className="h-10 w-10 object-contain drop-shadow"
                    draggable={false}
                  />
                  <span className="font-lucky text-xs text-amber-900 mt-0.5">+{tile.wls} WL</span>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-60">
                  <span className="font-silkscreen text-xs text-neutral-600 font-bold">BATU KOSONG</span>
                  <span className="text-[10px] font-bold text-neutral-600 mt-0.5">ZONK</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-white drop-shadow">
              <Shovel size={24} weight="fill" className="text-amber-200" />
              <span className="font-lucky text-xs mt-1 tracking-wider text-amber-100">
                GALI #{tile.id + 1}
              </span>
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
