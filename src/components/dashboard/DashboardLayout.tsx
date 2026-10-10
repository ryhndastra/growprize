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
import { InventoryGrid } from './inventory/InventoryGrid';
import { LiveDropsList } from './live/LiveDropsList';
import { TopUpTutorial } from './TopUpTutorial';
import { FooterGround } from '../common/FooterGround';

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
  return <FooterGround className="relative mt-24 sm:mt-32 w-full text-white min-h-[260px] sm:min-h-[300px]" maxWidthClass="max-w-[1400px]" />;
}
