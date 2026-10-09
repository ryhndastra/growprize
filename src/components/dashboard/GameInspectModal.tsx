import { motion, AnimatePresence } from 'motion/react';
import { GACHA_ITEMS } from '../../data/gachaItems';
import { RarityTier, GachaItem } from '../../types/dashboard';
import { ItemSprite } from './GachaSprites';
import { CloseGlyph } from './glyphs';
import { MagnifyingGlass } from '@phosphor-icons/react';

interface GameInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIER_GROUPS: Array<{
  tier: RarityTier;
  label: string;
  rateLabel: string;
  colorClass: string;
  bgClass: string;
  badgeBg: string;
}> = [
  {
    tier: 'mythic',
    label: 'MYTHIC',
    rateLabel: '< 1.5% Chance',
    colorClass: 'text-amber-900',
    bgClass: 'bg-amber-50 border-amber-300',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
  },
  {
    tier: 'legendary',
    label: 'LEGENDARY',
    rateLabel: '~ 6.0% Chance',
    colorClass: 'text-red-900',
    bgClass: 'bg-red-50 border-red-300',
    badgeBg: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
  },
  {
    tier: 'epic',
    label: 'EPIC',
    rateLabel: '~ 15.0% Chance',
    colorClass: 'text-purple-900',
    bgClass: 'bg-purple-50 border-purple-300',
    badgeBg: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
  },
  {
    tier: 'rare',
    label: 'RARE',
    rateLabel: '~ 30.0% Chance',
    colorClass: 'text-sky-900',
    bgClass: 'bg-sky-50 border-sky-300',
    badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
  },
  {
    tier: 'common',
    label: 'COMMON',
    rateLabel: '~ 45.0% Chance',
    colorClass: 'text-emerald-900',
    bgClass: 'bg-emerald-50 border-emerald-300',
    badgeBg: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
  },
];

// modal inspeksi detail hadiah dan peluang drop rate setiap rarity item.
export function GameInspectModal({ isOpen, onClose }: GameInspectModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspect-modal-title"
          className="gt-white-card relative z-10 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden p-5 sm:p-7 text-black shadow-[-10px_12px_0px_#03afef]"
        >
          {/* header modal */}
          <div className="flex items-start justify-between border-b border-sky-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded bg-[#d9f8ff] px-2.5 py-1 text-xs font-bold text-sky-900 uppercase tracking-wider mb-1.5">
                <MagnifyingGlass size={14} weight="bold" className="text-sky-700" />
                <span>DROP CHANCE & PRIZE INSPECTOR</span>
              </div>
              <h2 id="inspect-modal-title" className="gt-lucky-title text-2xl sm:text-4xl tracking-wide">
                DAFTAR HADIAH & CHANCE RATE
              </h2>
              <p className="text-xs sm:text-sm font-bold text-black/70 mt-1">
                Peluang drop rate resmi dan daftar item yang bisa kamu peroleh di Gacha Roulette Eclipse PS.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela inspeksi"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 active:scale-95 transition-all shadow-[2px_2px_0_#03afef] cursor-pointer"
            >
              <CloseGlyph className="w-5 h-5" />
            </button>
          </div>

          {/* ringkasan peluang kategori */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-4">
            {TIER_GROUPS.map((grp) => (
              <div
                key={grp.tier}
                className={`rounded-[8px] border-2 p-2.5 text-center flex flex-col justify-between ${grp.bgClass}`}
              >
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${grp.badgeBg} shadow-[1px_1px_0_#000]`}>
                  {grp.label}
                </span>
                <span className={`text-xs sm:text-sm font-lucky mt-1.5 ${grp.colorClass}`}>
                  {grp.rateLabel}
                </span>
              </div>
            ))}
          </div>

          {/* daftar detail item per kategori */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-5">
            {TIER_GROUPS.map((grp) => {
              const items = GACHA_ITEMS.filter((it) => it.rarity === grp.tier);
              if (items.length === 0) return null;

              return (
                <div key={grp.tier} className="rounded-[10px] bg-[#f0fbff] border border-sky-200 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3 border-b border-sky-200 pb-2">
                    <span className={`rounded px-2.5 py-0.5 text-xs font-bold ${grp.badgeBg} shadow-[1px_1.5px_0_#000]`}>
                      {grp.label} ({grp.rateLabel})
                    </span>
                    <span className="text-xs font-bold text-black/60">
                      {items.length} item tersedia
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {items.map((item: GachaItem) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-[8px] bg-white p-2.5 shadow-[2px_3px_0_#03afef] border border-sky-100"
                      >
                        <div className="gt-inset flex h-14 w-14 shrink-0 items-center justify-center rounded-[6px]">
                          <ItemSprite sprite={item.icon} className="h-10 w-10" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-xs sm:text-sm font-bold text-black">
                            {item.name}
                          </p>
                          <p className="truncate text-[10px] font-bold text-black/60">
                            {item.description}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#0284c7]">
                            <img src="/xsolla/items/world_lock.png" alt="" className="h-3.5 w-3.5 object-contain" />
                            <span>
                              {item.valueInDls >= 1 ? `${item.valueInDls} DL` : `${Math.round(item.valueInDls * 100)} WL`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* footer modal */}
          <div className="mt-4 pt-3 border-t border-sky-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="gt-btn-3d px-6 py-2 text-sm font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

