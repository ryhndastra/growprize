import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useDashboard } from './DashboardContext';

// kartu banner putih atas yang mereplikasi persis blok "complete quest for free gems!" di xsolla.growtopiagame.com.
export function BroadcastTicker() {
  const { broadcasts, activeTab, setActiveTab } = useDashboard();
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (broadcasts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % broadcasts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [broadcasts.length]);

  const activeMsg = broadcasts[index] ?? broadcasts[0];

  return (
    <section
      aria-label="Pengumuman dan misi utama"
      className="w-full select-none"
    >
      <div className="gt-white-card relative flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-6 sm:px-9 sm:py-7 overflow-hidden">
        <div className="flex flex-col items-start max-w-xl z-10 w-full">
          <div className="mb-2 inline-flex items-center gap-2 rounded-[6px] bg-[#d9f8ff] px-3 py-1 text-xs font-bold text-black">
            <img src="/xsolla/items/megaphone.png" alt="" className="w-4 h-4 object-contain" />
            <span className="uppercase tracking-wider text-sky-900">SUPER BROADCAST</span>
            <span className="text-black/40">|</span>
            <span className="tabular-nums text-black/70">
              {broadcasts.length > 0 ? `${index + 1}/${broadcasts.length}` : 'LIVE'}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold text-black leading-tight tracking-tight">
            Putar Gacha & Menangkan Hadiah Langka!
          </h2>

          {activeMsg && (
            <div className="mt-2.5 min-h-[28px] w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeMsg.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs sm:text-sm font-bold text-black/80 truncate"
                >
                  <span className="text-[#0284c7] font-bold mr-1.5">[{activeMsg.author}]:</span>
                  <span>{activeMsg.message}</span>
                </motion.p>
              </AnimatePresence>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'gacha' ? 'leaderboard' : 'gacha')}
              className="gt-btn-3d cursor-pointer h-11 sm:h-12 px-6 sm:px-8 text-base sm:text-xl font-bold uppercase"
            >
              {activeTab === 'gacha' ? 'LIHAT JACKPOT' : 'BUKA GACHA'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('exchange')}
              className="cursor-pointer h-11 sm:h-12 px-5 rounded-[4px] bg-[#d9f8ff] hover:bg-[#b5eefa] text-black font-bold text-xs sm:text-sm uppercase shadow-[2.5px_3px_0px_0px_#03afef] transition-colors"
            >
              TUKAR LOCK
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center shrink-0">
          <img
            src="/xsolla/quest_gems_pile.png"
            alt="Tumpukan Permata Growtopia"
            className="w-56 sm:w-72 h-auto object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
