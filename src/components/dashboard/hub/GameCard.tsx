import { motion } from 'motion/react';
import { MagnifyingGlass, Lock } from '@phosphor-icons/react';
import { DashboardTab } from '../../../types/dashboard';

export interface GameCardData {
  id: DashboardTab;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: 'red' | 'amber' | 'sky' | 'emerald' | 'purple';
  costLabel: string;
  imageSrc: string;
  tagline: string;
  inspectable?: boolean;
}

interface GameCardProps {
  game: GameCardData;
  isGuest: boolean;
  onPlay: (tab: DashboardTab) => void;
  onInspect?: () => void;
}

// komponen kartu minigame standar yang seragam untuk seluruh 6 minigame Growprize di beranda.
export function GameCard({ game, isGuest, onPlay, onInspect }: GameCardProps) {
  const getBadgeClass = (color: GameCardData['badgeColor'] = 'sky') => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'amber':
        return 'bg-amber-500 text-black';
      case 'emerald':
        return 'bg-emerald-600 text-white';
      case 'purple':
        return 'bg-purple-600 text-white';
      case 'sky':
      default:
        return 'bg-sky-600 text-white';
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="gt-card group relative flex flex-col justify-between p-5 sm:p-6 shadow-[-6px_8px_0px_#03afef] rounded-xl border-2 border-sky-300 h-full"
    >
      <div>
        {/* baris status badge dan biaya masuk */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold shadow-[1px_1px_0_#000] uppercase tracking-wider ${getBadgeClass(
              game.badgeColor
            )}`}
          >
            {game.badge}
          </span>
          <span className="rounded bg-white/90 border border-sky-300 px-2 py-0.5 text-[11px] font-bold text-sky-950 font-mono-num shadow-xs">
            {game.costLabel}
          </span>
        </div>

        {/* judul & deskripsi game */}
        <div className="min-h-[64px] mb-2">
          <h3 className="gt-lucky-title text-xl sm:text-2xl text-black truncate">
            {game.title}
          </h3>
          <p className="text-xs font-bold text-black/70 mt-1 line-clamp-2 leading-relaxed">
            {game.subtitle}
          </p>
        </div>

        {/* panggung visual game */}
        <div className="gt-inset relative flex h-32 sm:h-36 w-full flex-col items-center justify-center p-3 rounded-lg my-2 border border-sky-300 overflow-hidden">
          <img
            src={game.imageSrc}
            alt={game.title}
            className="h-20 w-20 sm:h-24 sm:w-24 object-contain drop-shadow-[0_4px_8px_rgba(3,175,239,0.3)] transition-transform group-hover:scale-105"
            draggable={false}
          />
          <span className="font-display text-[11px] font-bold text-sky-950 mt-1 bg-white/80 px-2.5 py-0.5 rounded-full border border-sky-200">
            {game.tagline}
          </span>
        </div>
      </div>

      {/* tombol aksi */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPlay(game.id)}
          className="gt-btn-3d flex-1 py-2.5 text-xs sm:text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5"
        >
          {isGuest && <Lock size={14} weight="bold" />}
          <span>{isGuest ? 'MASUK UNTUK MAIN' : 'MAIN SEKARANG'}</span>
        </button>

        {game.inspectable && onInspect && (
          <button
            type="button"
            onClick={onInspect}
            title="Inspeksi daftar peluang hadiah"
            className="flex items-center justify-center h-11 w-11 shrink-0 rounded-lg bg-[#d9f8ff] hover:bg-[#b5eefa] active:scale-95 text-sky-900 border border-sky-400 shadow-[1px_2px_0_#03afef] transition-all cursor-pointer"
          >
            <MagnifyingGlass size={16} weight="bold" />
          </button>
        )}
      </div>
    </motion.article>
  );
}
