import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { GachaItem } from '../../../types/dashboard';
import { GrowtopiaDialog, GrowtopiaButton } from '../../GrowtopiaAssets';
import { GrowLockIcon } from '../GrowLockIcon';
import { GrowItemIcon } from '../GrowItemIcon';
import { RarityChip } from './RarityTierPills';

interface WinRewardModalProps {
  wonItems: GachaItem[];
  isOpen: boolean;
  onClose: () => void;
  onInstantSell?: (items: GachaItem[]) => void;
}

function formatDlValue(value: number): { asDl: boolean; text: string } {
  if (!Number.isFinite(value) || value <= 0) return { asDl: false, text: '0 WL' };
  if (value >= 1) return { asDl: true, text: `${value.toFixed(1)} DL` };
  return { asDl: false, text: `${Math.round(value * 100)} WL` };
}

// modal hadiah kemenangan bergaya kartu putih xsolla dengan ceruk item #b5eefa dan tombol hijau #43b427.
export function WinRewardModal({
  wonItems,
  isOpen,
  onClose,
  onInstantSell,
}: WinRewardModalProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || wonItems.length === 0) return null;

  const totalDlValue = wonItems.reduce(
    (acc, it) => acc + (Number.isFinite(it.valueInDls) ? it.valueInDls : 0),
    0
  );
  const totalLabel = formatDlValue(totalDlValue);
  const isMultiItem = wonItems.length > 1;

  const handleInstantSellClick = () => {
    if (onInstantSell) {
      onInstantSell(wonItems);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="w-full max-w-xl max-h-[92vh] flex flex-col"
        >
          <GrowtopiaDialog
            title={isMultiItem ? `Berhasil Membuka ${wonItems.length} Peti!` : 'Selamat! Kamu Dapat Hadiah!'}
            onClose={onClose}
            className="w-full max-h-[92vh] flex flex-col overflow-hidden"
          >
            {isMultiItem && (
              <div className="mb-3 rounded-[6px] bg-[#d9f8ff] py-2.5 px-4 flex items-center justify-between text-xs sm:text-sm font-bold text-black shrink-0">
                <span>
                  Total Hadiah: <span className="font-bold">{wonItems.length} Item</span>
                </span>
                <div className="flex items-center gap-1.5 text-[#15803d]">
                  <span>Estimasi Nilai:</span>
                  <span className="flex items-center gap-1 font-bold tabular-nums">
                    {totalLabel.asDl ? (
                      <GrowLockIcon kind="dl" className="w-4 h-4" />
                    ) : (
                      <GrowLockIcon kind="wl" className="w-4 h-4" />
                    )}
                    {totalLabel.text}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 my-1">
              {!isMultiItem ? (
                (() => {
                  const item = wonItems[0];
                  const label = formatDlValue(item.valueInDls);
                  return (
                    <div className="w-full flex flex-col overflow-hidden rounded-[8px]">
                      <div className="gt-inset w-full p-6 flex flex-col items-center text-center rounded-t-[8px] rounded-b-none">
                        <RarityChip rarity={item.rarity} className="mb-3 px-2.5 py-1 text-xs" />

                        <div className="my-2 gt-float">
                          <GrowItemIcon item={item} className="w-24 h-24" requestSize={256} />
                        </div>

                        <h3 className="font-display font-bold text-2xl text-black tracking-tight mt-2">
                          {item.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-black/80 max-w-sm mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2 rounded-b-[8px] bg-[#d9f8ff] p-3.5 text-black">
                        <span className="text-xs sm:text-sm font-bold text-black/75">
                          Estimasi Nilai:
                        </span>
                        <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-black tabular-nums">
                          {label.asDl ? (
                            <GrowLockIcon kind="dl" className="w-5 h-5" />
                          ) : (
                            <GrowLockIcon kind="wl" className="w-5 h-5" />
                          )}
                          <span>{label.text}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {wonItems.map((item, idx) => {
                    const label = formatDlValue(item.valueInDls);
                    return (
                      <div
                        key={`${item.id}-${idx}`}
                        className="rounded-[8px] bg-[#d9f8ff] p-3 flex flex-col items-center justify-between text-center shadow-[-4px_5px_0px_0px_#03afef]"
                      >
                        <RarityChip rarity={item.rarity} className="mb-1.5" />

                        <div className="my-2 flex h-16 w-full items-center justify-center rounded-[6px] bg-[#b5eefa]">
                          <GrowItemIcon item={item} className="w-12 h-12" requestSize={128} />
                        </div>

                        <h4 className="text-xs font-bold text-black truncate w-full">
                          {item.name}
                        </h4>

                        <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-[#15803d] tabular-nums">
                          {label.asDl ? (
                            <GrowLockIcon kind="dl" className="w-3.5 h-3.5" />
                          ) : (
                            <GrowLockIcon kind="wl" className="w-3.5 h-3.5" />
                          )}
                          <span>{label.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-sky-100 flex flex-col sm:flex-row w-full items-center justify-center gap-3 shrink-0">
              <GrowtopiaButton
                variant="green"
                onClick={onClose}
                className="w-full sm:flex-1 h-12 text-sm sm:text-base"
              >
                SIMPAN DI TAS
              </GrowtopiaButton>

              {onInstantSell && totalDlValue > 0 && (
                <GrowtopiaButton
                  variant="cyan"
                  onClick={handleInstantSellClick}
                  className="w-full sm:flex-1 h-12 text-sm sm:text-base"
                >
                  JUAL INSTAN ({totalLabel.text})
                </GrowtopiaButton>
              )}
            </div>
          </GrowtopiaDialog>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
