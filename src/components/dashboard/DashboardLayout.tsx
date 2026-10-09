import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PlayerProfile } from '../../types/dashboard';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { BroadcastTicker } from './BroadcastTicker';
import { DashboardProvider, useDashboard } from './DashboardContext';
import { GameHub } from './GameHub';
import { GachaArena } from './gacha/GachaArena';
import { MysteryBoxArena } from './games/MysteryBoxArena';
import { DiamondDiceArena } from './games/DiamondDiceArena';
import { GemRainArena } from './games/GemRainArena';
import { LuckyWheelArena } from './games/LuckyWheelArena';
import { TreasureHuntArena } from './games/TreasureHuntArena';
import { LockExchange } from './exchange/LockExchange';
import { InventoryGrid } from './inventory/InventoryGrid';
import { LiveDropsList } from './live/LiveDropsList';
import { TopUpTutorial } from './TopUpTutorial';

interface DashboardLayoutProps {
  onReplayIntro: () => void;
  onRequireLogin: (notice?: string) => void;
}

export function DashboardLayout({ onRequireLogin }: DashboardLayoutProps) {
  return (
    <DashboardProvider onRequireLogin={onRequireLogin}>
      <DashboardShell />
    </DashboardProvider>
  );
}

// kanvas langit berawan penuh dengan navbar dua state, sidebar game terpadu, dan konten game yang proporsional di tengah.
function DashboardShell() {
  const reduceMotion = useReducedMotion();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    balance,
    inventory,
    isGuest,
    growId,
    world,
    broadcasts,
    requireLogin,
    activeTab,
    setActiveTab,
  } = useDashboard();

  const player: PlayerProfile = {
    growId,
    level: 1,
    world,
    serverPingMs: 24,
    avatarPose: 'pose_triumph',
    isGuest,
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col gt-sky-photo font-sans text-black selection:bg-[#03afef] selection:text-white">
      {/* 1. NAVBAR DUA STATE: ATAS PENUH DENGAN KARAKTER, STICKY BILAH TANAH SAAT SCROLL */}
      <DashboardHeader
        player={player}
        balance={balance}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inventoryCount={inventory.length}
        onOpenTutorial={() => setActiveTab('tutorial')}
        onLogin={() => requireLogin('Log in untuk mengakses saldo Eclipse PS Anda.')}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        broadcasts={broadcasts}
      />

      {/* 2. AREA UTAMA: SIDEBAR GAME DI KIRI & KONTEN GAME DI TENGAH SECARA SIMETRIS */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto px-3 sm:px-6 py-6 flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* SIDEBAR DAFTAR GAME */}
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          inventoryCount={inventory.length}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* KONTEN TENGAH PROPORSIONAL */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
          <BroadcastTicker />

          <main className="relative z-10 w-full flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <TabPanel />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* 3. KAKI HALAMAN TANAH RUMPUT YANG TELAH DIPERBAIKI POSISI PROPS-NYA */}
      <FooterBar />
    </div>
  );
}

function TabPanel() {
  const { activeTab, setActiveTab, inventory, isGuest, requireLogin } = useDashboard();

  if (activeTab === 'hub') {
    return (
      <GameHub
        onSelectTab={setActiveTab}
        inventoryCount={inventory.length}
        isGuest={isGuest}
        onRequireLogin={() => requireLogin('Log in GrowID untuk mulai bermain.')}
      />
    );
  }

  if (activeTab === 'gacha') {
    return <GachaArena />;
  }

  if (activeTab === 'mystery_box') {
    return <MysteryBoxArena />;
  }

  if (activeTab === 'diamond_dice') {
    return <DiamondDiceArena />;
  }

  if (activeTab === 'gem_rain') {
    return <GemRainArena />;
  }

  if (activeTab === 'lucky_wheel') {
    return <LuckyWheelArena />;
  }

  if (activeTab === 'treasure_hunt') {
    return <TreasureHuntArena />;
  }

  if (activeTab === 'exchange') {
    return <LockExchange />;
  }

  if (activeTab === 'inventory') {
    return <InventoryGrid />;
  }

  if (activeTab === 'tutorial') {
    return <TopUpTutorial onBack={() => setActiveTab('hub')} />;
  }

  return <LiveDropsList />;
}

// kaki halaman tanah rumput resmi dengan ornamen yang menapak pas di atas rumput
function FooterBar() {
  return (
    <footer className="relative mt-24 sm:mt-32 w-full gt-footer-ground text-white select-none">
      {/* ornamen televisi, ayam, dan mobil yang menapak pas persis di atas garis rumput */}
      <div className="pointer-events-none relative mx-auto w-full max-w-[1400px] h-0" aria-hidden="true">
        <img
          src="/xsolla/tv_footer.png"
          alt=""
          className="hidden sm:block absolute bottom-0 left-6 w-24 sm:w-28 h-auto object-contain -mb-1"
          draggable={false}
        />
        <img
          src="/xsolla/chicken.png"
          alt=""
          className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-auto object-contain -mb-1"
          draggable={false}
        />
        <img
          src="/xsolla/car.png"
          alt=""
          className="hidden sm:block absolute bottom-0 right-8 w-48 sm:w-64 h-auto object-contain -mb-1"
          draggable={false}
        />
      </div>

      {/* konten teks footer di dalam tanah */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:py-10">
        <div className="flex items-center gap-3">
          <img
            src="/intro/growprize_logo.png"
            alt="Growprize"
            className="h-9 w-auto object-contain drop-shadow"
            draggable={false}
          />
          <div className="text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-white text-shadow-gt">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#43b427] ring-2 ring-white" />
              <span>Eclipse PS Server Online | World: GROWPRIZE</span>
            </div>
            <p className="text-xs font-semibold text-white/85">
              Official Growtopia Web Store Aesthetic | Powered by Eclipse PS
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-bold text-white/90 text-shadow-gt-soft sm:text-right max-w-md">
          Growtopia and its assets are registered trademarks of Ubisoft. Fan platform for Eclipse PS.
        </p>
      </div>
    </footer>
  );
}
