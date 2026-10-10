import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { GachaItem } from '../../../types/dashboard';
import { RarityTierPills, RarityChip } from './RarityTierPills';
import { ChestRoulette } from './ChestRoulette';
import { RollControls } from './RollControls';
import { WinRewardModal } from './WinRewardModal';
import { GrowItemIcon } from '../GrowItemIcon';
import { useDashboard } from '../DashboardContext';
import { useAuth } from '../../../lib/auth';
import { GameInspectModal } from '../GameInspectModal';
import { ArrowLeftGlyph, SearchGlyph } from '../glyphs';
import { REEL_TOTAL_CARDS, WINNER_INDEX } from './reelGeometry';
import { useGachaCases } from './useGachaCases';
import { ApiError, rollGacha, sellBackpack, type ApiCaseItem } from '../../../lib/api';
import { normalizeWorthUsd } from '../../../lib/money';
import { formatUsd } from '../../../lib/money';

// backend membatasi satu roll per 1.5 detik per akun. untuk spin multi kita beri
// jeda aman agar tidak di-429, dan retry sekali bila tetap kena.
const ROLL_MIN_GAP_MS = 1600;

// jeda yang bisa dibatalkan: bila komponen unmount di tengah spin multi, loop
// roll berhenti tanpa menyentuh state atau memanggil api lagi.
function delay(ms: number, isCancelled?: () => boolean): Promise<boolean> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(!(isCancelled?.() ?? false)), ms);
  });
}

async function rollWithRateLimit(caseId: string, itemId: string) {
  try {
    return await rollGacha(caseId, itemId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) {
      await delay(ROLL_MIN_GAP_MS);
      return rollGacha(caseId, itemId);
    }
    throw err;
  }
}

function pickRandom<T>(list: T[]): T | null {
  if (list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// item server dipetakan ke bentuk katalog fe supaya reel dan modal bisa menampilkannya.
function toReelItem(item: ApiCaseItem, fallback: GachaItem): GachaItem {
  return {
    id: item.id,
    itemId: Number(item.itemId) || undefined,
    name: item.name || fallback.name,
    category: fallback.category,
    rarity: fallback.rarity,
    dropRatePercent: 0,
    valueInUsd: normalizeWorthUsd(item.worth),
    icon: fallback.icon,
    description: fallback.description,
    glowColor: item.color || fallback.glowColor,
  };
}

// reel panjang ala cs2 case-opening dengan pemenang di kartu index tertentu.
function generateReel(winner: GachaItem, pool: GachaItem[]): { items: GachaItem[]; stopIdx: number } {
  const items: GachaItem[] = [];
  const total = REEL_TOTAL_CARDS;
  const stopIdx = WINNER_INDEX;
  const safePool = pool.length > 0 ? pool : [winner];

  for (let i = 0; i < total; i++) {
    if (i === stopIdx) {
      items.push(winner);
    } else {
      items.push(pickRandom(safePool) ?? winner);
    }
  }

  return { items, stopIdx };
}

// tampilan khusus game gacha roulette. hasil sah selalu berasal dari backend /roll,
// animasi hanya menggambarkan item yang dikembalikan server.
export function GachaArena() {
  const { isGuest, addItemToInventory, requireLogin, setActiveTab, refreshBackpack } =
    useDashboard();
  const { refreshUser, updateBalance } = useAuth();
  const { activeCase, catalogItems, isLoading, loadError } = useGachaCases();

  const [isRolling, setIsRolling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [turboEnabled, setTurboEnabled] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);

  const [reelItems, setReelItems] = useState<GachaItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(WINNER_INDEX);
  const [subJitter, setSubJitter] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [wonItems, setWonItems] = useState<GachaItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [spinNonce, setSpinNonce] = useState(0);

  // penanda mounted: dipakai agar timer/delay yang menggantung saat komponen
  // unmount tidak menembak setState atau memutasi inventori setelahnya.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reduceMotion = useReducedMotion();

  // biaya tampilan diambil dari harga case asli di server; bila belum termuat,
  // tampilkan tanda hubung jujur, bukan angka karangan.
  const spinCostLabel =
    activeCase && Number.isFinite(Number(activeCase.price))
      ? `$${Number(activeCase.price).toFixed(2)}`
      : '—';

  // saat katalog case baru termuat dari server, isi reel awal dengan item nyata
  // supaya pita tidak kosong sebelum spin pertama.
  useEffect(() => {
    if (catalogItems.length === 0) {
      setReelItems([]);
      return;
    }
    const seed = pickRandom(catalogItems);
    if (seed) {
      setReelItems(generateReel(seed, catalogItems).items);
      setSelectedIndex(WINNER_INDEX);
    }
  }, [catalogItems]);

  const startReelFor = (winner: GachaItem): number => {
    const { items: newReel, stopIdx } = generateReel(winner, catalogItems);
    const jitter = Math.round((Math.random() - 0.5) * 44);
    setReelItems(newReel);
    setSelectedIndex(stopIdx);
    setSubJitter(jitter);
    setSpinNonce((n) => n + 1);
    setIsRolling(true);
    return stopIdx;
  };

  const handleSpin = async (count: 1 | 5 | 10) => {
    if (isRolling) return;

    if (isGuest) {
      requireLogin('Log in GrowID untuk mulai spin.');
      return;
    }
    if (!activeCase) {
      setErrorMessage('Daftar case belum tersedia dari server. Coba muat ulang halaman.');
      return;
    }
    if (catalogItems.length === 0) {
      setErrorMessage('Case ini belum memiliki item hadiah.');
      return;
    }

    setErrorMessage(null);

    // pilih kandidat untuk animasi; server tetap penentu hasil akhir.
    const localCandidates: GachaItem[] = [];
    for (let i = 0; i < count; i++) {
      const guess = pickRandom(catalogItems);
      if (guess) localCandidates.push(guess);
    }
    if (localCandidates.length === 0) {
      setErrorMessage('Tidak ada item yang bisa dimainkan di case ini.');
      return;
    }

    const stopIdx = startReelFor(localCandidates[0]);

    const spinDuration = reduceMotion ? 0 : turboEnabled ? 1100 : 5000;

    try {
      const results: GachaItem[] = [];
      for (let i = 0; i < count; i++) {
        const candidate = localCandidates[i] ?? localCandidates[0];
        if (i > 0) {
          // hormati batas rate backend antar roll dalam satu sesi spin.
          const alive = await delay(ROLL_MIN_GAP_MS, () => !mountedRef.current);
          if (!alive) return;
        }
        const res = await rollWithRateLimit(activeCase.id, candidate.id);
        results.push(toReelItem(res.item, candidate));
        if (res.balance !== undefined && res.balance !== null) {
          updateBalance(res.balance);
        }
      }

      if (!mountedRef.current) return;

      // saldo dan daftar item disinkronkan sekali dari server setelah semua roll selesai.
      await refreshUser();
      await refreshBackpack();

      if (!mountedRef.current) return;

      const mainWinner = results[0];
      // pastikan animasi berhenti tepat di item yang benar-benar dikembalikan server.
      if (mainWinner) {
        setReelItems((prev) => {
          if (prev.length <= stopIdx) return prev;
          const copy = [...prev];
          copy[stopIdx] = mainWinner;
          return copy;
        });
      }

      // timer berlapis ini dijaga mountedRef supaya tidak menembak setState atau
      // memutasi inventori setelah komponen unmount.
      window.setTimeout(() => {
        if (!mountedRef.current) return;
        setIsRolling(false);
        window.setTimeout(() => {
          if (!mountedRef.current) return;
          setWonItems(results);
          setModalOpen(true);
          for (const item of results) {
            addItemToInventory(item);
          }
        }, 450);
      }, spinDuration);
    } catch (err) {
      if (!mountedRef.current) return;
      setIsRolling(false);
      let message = 'Gagal memproses spin. Coba lagi.';
      if (err instanceof ApiError) {
        if (err.status === 401) {
          message = 'Sesi kamu berakhir. Silakan login lagi.';
        } else if (err.status === 429) {
          message = 'Terlalu cepat! Tunggu sebentar sebelum spin lagi.';
        } else if (err.status >= 500 || err.status === 0) {
          message = 'Server sedang sibuk. Coba lagi sebentar lagi.';
        } else {
          message = err.message;
        }
      }
      setErrorMessage(message);
    }
  };

  const handleClaimAll = () => {
    setModalOpen(false);
  };

  const handleInstantSell = async (items: GachaItem[]) => {
    try {
      const sellPayload = items
        .filter((it) => it.itemId !== undefined)
        .map((it) => ({ itemId: it.itemId!, quantity: 1 }));
      if (sellPayload.length > 0) {
        const res = await sellBackpack(sellPayload);
        if (res.balance !== undefined && res.balance !== null) {
          updateBalance(res.balance);
        }
        await refreshUser();
        await refreshBackpack();
      }
    } catch (err) {
      console.error('Instant sell error:', err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
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

      <div className="gt-white-card w-full p-5 sm:p-8 flex flex-col items-center shadow-[-8px_10px_0px_#03afef]">
        <div className="w-full text-center max-w-3xl px-2">
          <h2 className="gt-lucky-title text-2xl sm:text-4xl lg:text-5xl tracking-wide break-words">
            IT&apos;S RAININ&apos; PRIZES
          </h2>
          <p className="text-xs sm:text-base font-bold text-black/80 mt-2 leading-relaxed">
            It&apos;s Rainin&apos; Prizes adalah mesin gacha paling populer kami. Semua item langka Growtopia seperti Rayman&apos;s Fist, Magplant 5000, dan hadiah saldo dolar siap kamu bawa pulang!
          </p>

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
              <img src="/xsolla/items/growtoken.png" alt="" className="w-4 h-4 object-contain shrink-0" />
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

          {loadError && (
            <div className="mt-3 px-4 py-2 rounded-[6px] border border-sky-300 bg-[#d9f8ff] text-xs font-bold text-sky-900">
              {loadError}
            </div>
          )}
        </div>

        <div className="w-full my-6 flex justify-center">
          <div className="w-full max-w-4xl">
            <ChestRoulette
              isRolling={isRolling}
              reelItems={reelItems}
              selectedIndex={selectedIndex}
              subJitter={subJitter}
              turboEnabled={turboEnabled}
              soundEnabled={soundEnabled}
              spinNonce={spinNonce}
            />
          </div>
        </div>

        <div className="w-full max-w-2xl flex justify-center mt-2">
          <RollControls
            isRolling={isRolling}
            onSpin={handleSpin}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            turboEnabled={turboEnabled}
            onToggleTurbo={() => setTurboEnabled((prev) => !prev)}
            costLabel={spinCostLabel}
          />
        </div>
      </div>

      <div className="w-full mt-14 sm:mt-20">
        <h3 className="gt-lucky-title text-center text-2xl sm:text-4xl lg:text-5xl tracking-wide mb-10 sm:mb-14 break-words px-2">
          PRIZE POOL CATALOG
        </h3>

        {isLoading ? (
          <p className="text-center text-sm font-bold text-black/70">Memuat hadiah dari server...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 pt-4">
            {catalogItems.map((item) => (
              <div
                key={item.id}
                className="gt-card relative flex flex-col justify-between p-4 sm:p-5 transition-transform hover:-translate-y-1 shadow-[-6px_8px_0px_#03afef]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <RarityChip rarity={item.rarity} withRate />
                    <div className="flex items-center gap-1 font-bold text-sm text-black">
                      <span>{formatUsd(item.valueInUsd)}</span>
                    </div>
                  </div>

                  <div className="gt-inset flex h-36 w-full items-center justify-center p-4 mb-3 rounded-[8px]">
                    <GrowItemIcon item={item} className="h-20 w-20" requestSize={256} />
                  </div>

                  <h4 className="font-display font-bold text-base sm:text-lg text-black truncate text-center">
                    {item.name}
                  </h4>
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
        )}
      </div>

      <GameInspectModal
        isOpen={inspectOpen}
        onClose={() => setInspectOpen(false)}
        items={catalogItems}
      />

      <WinRewardModal
        isOpen={modalOpen}
        wonItems={wonItems}
        onClose={handleClaimAll}
        onInstantSell={handleInstantSell}
      />
    </div>
  );
}
