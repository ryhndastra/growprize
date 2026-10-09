import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SquaresFour,
  Sparkle,
  Package,
  DiceSix,
  Coins,
  Swap,
  Backpack,
  Trophy,
  X,
  GameController,
  Crosshair,
  Compass,
} from '@phosphor-icons/react';
import { DashboardTab } from '../../types/dashboard';
import { GAME_ITEMS, UTILITY_ITEMS, NavItem } from './navigation';
import type { GlyphKey } from './glyphRegistry';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  inventoryCount: number;
  isOpen: boolean;
  onClose: () => void;
}

// sidebar standar modern: tanpa emoji, menggunakan icon vektor Phosphor,
// navigasi docking bersih khas aplikasi web game terkini.
export function DashboardSidebar({
  activeTab,
  onTabChange,
  inventoryCount,
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSelect = (tab: DashboardTab) => {
    onTabChange(tab);
    onClose();
  };

  const getNavIcon = (glyphKey: GlyphKey, isActive: boolean) => {
    const className = isActive ? 'text-[#fde047]' : 'text-sky-700 group-hover:text-sky-900';
    switch (glyphKey) {
      case 'home':
        return <SquaresFour size={20} weight="bold" className={className} />;
      case 'gacha':
        return <Sparkle size={20} weight="fill" className={className} />;
      case 'mystery':
        return <Package size={20} weight="fill" className={className} />;
      case 'gamepad':
        return <DiceSix size={20} weight="fill" className={className} />;
      case 'flame':
        return <Coins size={20} weight="fill" className={className} />;
      case 'swap':
        return <Swap size={20} weight="bold" className={className} />;
      case 'wheel':
        return <Crosshair size={20} weight="bold" className={className} />;
      case 'scratch':
        return <Compass size={20} weight="fill" className={className} />;
      case 'bag':
        return <Backpack size={20} weight="fill" className={className} />;
      case 'status':
        return <Trophy size={20} weight="fill" className={className} />;
      default:
        return <GameController size={20} weight="fill" className={className} />;
    }
  };

  const renderBadge = (item: NavItem) => {
    if (item.id === 'inventory' && inventoryCount > 0) {
      return (
        <span className="shrink-0 rounded-full bg-[#fde047] px-2 py-0.5 text-[10px] font-bold text-black tabular-nums shadow-xs">
          {inventoryCount > 99 ? '99+' : inventoryCount}
        </span>
      );
    }

    if (!item.badge) return null;

    if (item.badgeType === 'live') {
      return (
        <span className="shrink-0 inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span>LIVE</span>
        </span>
      );
    }

    if (item.badgeType === 'hot') {
      return (
        <span className="shrink-0 rounded bg-red-100 text-red-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'new') {
      return (
        <span className="shrink-0 rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'fair') {
      return (
        <span className="shrink-0 rounded bg-sky-100 text-sky-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
          {item.badge}
        </span>
      );
    }

    return (
      <span className="shrink-0 rounded bg-neutral-100 text-neutral-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
        {item.badge}
      </span>
    );
  };

  const renderItemButton = (item: NavItem) => {
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleSelect(item.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`group flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer border ${
          isActive
            ? 'bg-[#0e2733] text-white border-sky-400/40 shadow-sm'
            : 'border-transparent text-[#12303c] hover:bg-[#e6f7fe] hover:text-black'
        }`}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center">
          {getNavIcon(item.glyphKey, isActive)}
        </span>

        <span className="min-w-0 flex-1">
          <span className={`block truncate font-display text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-[#0e2733]'}`}>
            {item.label}
          </span>
          <span className={`block truncate text-[10px] font-semibold ${isActive ? 'text-white/70' : 'text-black/50'}`}>
            {item.hint}
          </span>
        </span>

        {renderBadge(item)}
      </button>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col select-none bg-white">
      {/* header sidebar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-sky-100 px-4">
        <div className="flex items-center gap-2">
          <GameController size={20} weight="duotone" className="text-sky-600" />
          <span className="font-display text-sm font-bold text-[#0e2733] tracking-wide">
            MENU ARENA
          </span>
        </div>
        <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-200">
          {GAME_ITEMS.length} GAME
        </span>
      </div>

      {/* daftar item navigasi */}
      <nav aria-label="Navigasi Growprize" className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3 custom-scrollbar">
        <p className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-black/45">
          Minigame
        </p>
        {GAME_ITEMS.map(renderItemButton)}

        <div className="my-2 h-px bg-sky-100" />

        <p className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-black/45">
          Fitur & Akun
        </p>
        {UTILITY_ITEMS.map(renderItemButton)}
      </nav>

      {/* footer status server bersih tanpa emoji */}
      <div className="border-t border-sky-100 p-3 bg-sky-50/70 text-xs">
        <div className="flex items-center justify-between font-bold text-[#0e2733]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold">WORLD: GROWPRIZE</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
            ONLINE
          </span>
        </div>
        <p className="text-[10px] text-black/50 mt-1 font-medium">
          Eclipse PS Server • Latency 24ms
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. SIDEBAR DESKTOP DOCKED BIASA */}
      <aside
        aria-label="Menu game desktop"
        className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col rounded-xl border border-sky-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden sticky top-[84px] bg-white"
      >
        {sidebarContent}
      </aside>

      {/* 2. SIDEBAR MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              ref={panelRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex h-[100dvh] w-[280px] flex-col bg-white shadow-xl border-r border-sky-300"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-sky-100 px-4 bg-white">
                <div className="flex items-center gap-2">
                  <GameController size={20} weight="duotone" className="text-sky-600" />
                  <span className="font-display text-sm font-bold text-[#0e2733]">
                    NAVIGASI GAME
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup navigasi"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-[#0e2733] hover:bg-sky-100 active:scale-95 transition-all cursor-pointer"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {sidebarContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
