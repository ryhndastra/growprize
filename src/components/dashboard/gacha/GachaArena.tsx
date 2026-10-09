import { useState } from 'react';
import { GachaItem } from '../../../types/dashboard';
import { GACHA_ITEMS } from '../../../data/gachaItems';
import { RarityTierPills, RarityChip } from './RarityTierPills';
import { ChestRoulette } from './ChestRoulette';
import { RollControls } from './RollControls';
import { WinRewardModal } from './WinRewardModal';
import { ItemSprite } from '../GachaSprites';
import { useDashboard } from '../DashboardContext';
import { GameInspectModal } from '../GameInspectModal';
import { ArrowLeftGlyph, SearchGlyph } from '../glyphs';

const SPIN_COST: Record<1 | 5 | 10, { wls: number; dls: number }> = {
  1: { wls: 10, dls: 0 },
  5: { wls: 50, dls: 0 },
  10: { wls: 0, dls: 1 },
};

function pickRandomItem(): GachaItem {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const item of GACHA_ITEMS) {
    cumulative += item.dropRatePercent;
    if (rand <= cumulative) {
      return item;
    }
  }
  return GACHA_ITEMS[GACHA_ITEMS.length - 1];
}

function generateReel(winner: GachaItem, loops = 6): { items: GachaItem[]; stopIdx: number } {
  const items: GachaItem[] = [];
  for (let i = 0; i < loops; i++) {
    for (const base of GACHA_ITEMS) {
      items.push(base);
    }
  }

  const midLow = Math.floor(items.length * 0.4);
  const midHigh = Math.floor(items.length * 0.6);
  const stopIdx = midLow + Math.floor(Math.random() * (midHigh - midLow));

  items[stopIdx] = winner;

  return { items, stopIdx };
}

// tampilan khusus game gacha roulette: judul di atas, arena game roulette di tengah, dan tombol spin di bawah.
export function GachaArena() {
  const { isGuest, deductLocks, addItemToInventory, convertLocks, balance, costLabel, requireLogin, setActiveTab } =
    useDashboard();

  const [isRolling, setIsRolling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [turboEnabled, setTurboEnabled] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);

  const [reelItems, setReelItems] = useState<GachaItem[]>(
    () => generateReel(GACHA_ITEMS[0], 6).items
  );
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.floor(GACHA_ITEMS.length * 6 * 0.5)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [wonItems, setWonItems] = useState<GachaItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSpin = (count: 1 | 5 | 10) => {
    if (isRolling) return;

    if (isGuest) {
      requireLogin('Log in GrowID untuk mulai spin.');
      return;
    }

    setErrorMessage(null);

    const cost = SPIN_COST[count];
    const success = deductLocks({ wls: cost.wls, dls: cost.dls });
    if (!success) {
      setErrorMessage(`Lock tidak cukup. Butuh ${costLabel(count)} untuk spin.`);
      return;
    }

    const winners: GachaItem[] = [];
    for (let i = 0; i < count; i++) {
      winners.push(pickRandomItem());
    }

    const mainWinner = winners[0];
    const { items: newReel, stopIdx } = generateReel(mainWinner, turboEnabled ? 3 : 6);

    setReelItems(newReel);
    setSelectedIndex(stopIdx);
    setIsRolling(true);

    const spinDuration = turboEnabled ? 750 : 3300;

    setTimeout(() => {
      setIsRolling(false);
      setWonItems(winners);
      setModalOpen(true);
      for (const item of winners) {
        addItemToInventory(item);
      }
    }, spinDuration);
  };

  const handleClaimAll = () => {
    setModalOpen(false);
  };

  const handleConvertWonItem = (item: GachaItem) => {
    const dlsToAdd = Math.floor(item.valueInDls);
    const wlsToAdd = Math.round((item.valueInDls - dlsToAdd) * 100);
    convertLocks({
      ...balance,
      dls: balance.dls + dlsToAdd,
      wls: balance.wls + wlsToAdd,
    });
    setWonItems((prev) => prev.filter((i) => i.id !== item.id));
    if (wonItems.length <= 1) {
      setModalOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* breadcrumb kembali ke semua game */}
      <div className="w-full flex justify-start mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('hub')}
          className="inline-flex items-center gap-2 rounded-[8px] bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold text-black shadow-[2px_3px_0_#000] border-2 border-[#03afef] hover:bg-[#d9f8ff] active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeftGlyph className="h-4 w-4" />
          <span>Kembali ke Semua Game</span>
        </button>
      </div>

      {/* KARTU UTAMA GACHA: JUDUL DI ATAS, GAME DI TENGAH, BUTTON PLAY DI BAWAH */}
      <div className="gt-white-card w-full p-5 sm:p-8 flex flex-col items-center shadow-[-8px_10px_0px_#03afef]">
        {/* 1. BAGIAN ATAS: JUDUL GAME, DESKRIPSI & CHANCE BADGES DENGAN INSPECT */}
        <div className="w-full text-center max-w-3xl">
          <h2 className="gt-lucky-title text-3xl sm:text-5xl tracking-wide">
            IT&apos;S RAININ&apos; PRIZES
          </h2>
          <p className="text-xs sm:text-base font-bold text-black/80 mt-2 leading-relaxed">
            It&apos;s Rainin&apos; Prizes adalah mesin gacha paling populer kami. Semua item langka Growtopia seperti Rayman&apos;s Fist, Magplant 5000, dan ratusan Diamond Lock siap kamu bawa pulang!
          </p>

          {/* chance badges & tombol kaca pembesar (inspect) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <RarityTierPills />
            <button
              type="button"
              onClick={() => setInspectOpen(true)}
              title="Inspeksi daftar hadiah dan peluang drop rate"
              className="flex items-center gap-1.5 rounded-full bg-[#d9f8ff] hover:bg-[#b5eefa] active:scale-95 px-3 py-1 text-xs font-bold text-sky-900 border border-sky-400 shadow-[1px_2px_0_#03afef] transition-all cursor-pointer"
            >
              <SearchGlyph className="h-4 w-4" />
              <span>Inspect Hadiah & Chance</span>
            </button>
          </div>

          {isGuest && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-[6px] bg-[#d9f8ff] px-4 py-2 text-xs font-bold text-black border border-sky-300">
              <img src="/xsolla/items/world_lock.png" alt="" className="w-4 h-4 object-contain shrink-0" />
              <span>
                Kamu melihat sebagai Guest.{' '}
                <button
                  type="button"
                  onClick={() => requireLogin('Log in GrowID untuk mulai spin.')}
                  className="underline decoration-2 underline-offset-2 text-[#0284c7] hover:text-black cursor-pointer font-bold"
                >
                  Login GrowID
                </button>{' '}
                untuk mulai spin.
              </span>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mt-3 px-4 py-2 rounded-[6px] border-2 border-red-500 bg-red-50 text-xs font-bold text-red-800"
            >
              {errorMessage}
            </div>
          )}
        </div>

        {/* 2. BAGIAN TENGAH: GAMENYA (ROULETTE WHEEL & PETI) */}
        <div className="w-full my-6 flex justify-center">
          <div className="w-full max-w-4xl">
            <ChestRoulette
              isRolling={isRolling}
              reelItems={reelItems}
              selectedIndex={selectedIndex}
              turboEnabled={turboEnabled}
              soundEnabled={soundEnabled}
            />
          </div>
        </div>

        {/* 3. BAGIAN BAWAH: BUTTON-BUTTON BUAT PLAY */}
        <div className="w-full max-w-2xl flex justify-center mt-2">
          <RollControls
            isRolling={isRolling}
            onSpin={handleSpin}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            turboEnabled={turboEnabled}
            onToggleTurbo={() => setTurboEnabled((prev) => !prev)}
          />
        </div>
      </div>

      {/* KATALOG HADIAH DARI GAME INI */}
      <div className="w-full mt-14 sm:mt-20">
        <h3 className="gt-lucky-title text-center text-3xl sm:text-5xl tracking-wide mb-10 sm:mb-14">
          PRIZE POOL CATALOG
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 pt-4">
          {GACHA_ITEMS.slice(0, 12).map((item, idx) => (
            <div
              key={item.id}
              className="gt-card relative flex flex-col justify-between p-4 sm:p-5 transition-transform hover:-translate-y-1 shadow-[-6px_8px_0px_#03afef]"
            >
              {idx === 0 && (
                <img
                  src="/xsolla/tv_store.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none hidden sm:block absolute -top-20 left-8 w-24 h-auto object-contain"
                  draggable={false}
                />
              )}
              {idx === 1 && (
                <img
                  src="/xsolla/box_topper.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none hidden sm:block absolute -top-16 right-8 w-20 h-auto object-contain"
                  draggable={false}
                />
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <RarityChip rarity={item.rarity} withRate />
                  <div className="flex items-center gap-1 font-bold text-sm text-black">
                    <img src="/xsolla/items/world_lock.png" alt="" className="w-4 h-4 object-contain" />
                    <span>{item.valueInDls >= 1 ? `${item.valueInDls} DL` : `${Math.round(item.valueInDls * 100)} WL`}</span>
                  </div>
                </div>

                <div className="gt-inset flex h-36 w-full items-center justify-center p-4 mb-3 rounded-[8px]">
                  <ItemSprite sprite={item.icon} className="w-20 h-20" />
                </div>

                <h4 className="font-display font-bold text-base sm:text-lg text-black truncate text-center">
                  {item.name}
                </h4>
                <p className="text-xs font-bold text-black/70 text-center mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-200">
                <button
                  type="button"
                  onClick={() => handleSpin(1)}
                  disabled={isRolling}
                  className="gt-btn-3d w-full py-2 text-xs font-bold"
                >
                  SPIN SEKARANG
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* modal inspect peluang hadiah */}
      <GameInspectModal
        isOpen={inspectOpen}
        onClose={() => setInspectOpen(false)}
      />

      {/* modal kemenangan reward */}
      <WinRewardModal
        isOpen={modalOpen}
        wonItems={wonItems}
        onClose={handleClaimAll}
        onInstantSell={(items) => items.forEach(handleConvertWonItem)}
      />
    </div>
  );
}
