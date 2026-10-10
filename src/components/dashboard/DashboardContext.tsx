import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  GachaItem,
  LiveDropRecord,
  BroadcastMessage,
  WalletBalance,
  DashboardTab,
} from '../../types/dashboard';
import {
  MOCK_BROADCASTS,
  INITIAL_LIVE_DROPS,
} from '../../data/gachaItems';
import { useAuth } from '../../lib/auth';
import { fetchBackpack, type ApiBackpackItem } from '../../lib/api';
import { normalizeUsd, roundUsd, normalizeWorthUsd } from '../../lib/money';
import { normalizeRarity } from './gacha/normalizeRarity';

interface DashboardState {
  balance: WalletBalance;
  inventory: GachaItem[];
  backpack: ApiBackpackItem[];
  backpackTotals: { totalCount: number; totalWorth: number };
  isLoadingBackpack: boolean;
  liveDrops: LiveDropRecord[];
  broadcasts: BroadcastMessage[];
  isGuest: boolean;
  growId: string;
  world: string;
  activeTab: DashboardTab;
}

interface DashboardActions {
  addItemToInventory: (item: GachaItem) => void;
  requireLogin: (notice?: string) => void;
  setActiveTab: (tab: DashboardTab) => void;
  refreshBackpack: () => Promise<void>;
  /**
   * ledger lokal untuk minigame demo yang belum punya endpoint backend
   * (dadu, gem rain, lucky wheel, treasure, mystery). nilainya mengambang di atas
   * saldo server dan sengaja direset saat refresh. gacha tidak memakai jalur ini.
   */
  spendUsd: (amountUsd: number) => boolean;
  addUsd: (deltaUsd: number) => void;
  updateBalance: (amount: number | string) => void;
}

const DashboardContext = createContext<(DashboardState & DashboardActions) | null>(null);

// backend menyimpan satu angka saldo dalam usd. fe menerimanya apa adanya tanpa
// konversi denominasi; nilai tidak valid jadi nol dan saldo tidak pernah negatif.
function balanceFromBackend(raw: number | string | null | undefined): WalletBalance {
  return { usd: normalizeUsd(raw) };
}

// item backpack dari server dipetakan ke bentuk katalog fe tanpa mengarang data.
function toGachaItem(row: ApiBackpackItem): GachaItem {
  const numericId = Number(row.item_id);
  return {
    id: String(row.item_id ?? row.id),
    itemId: Number.isFinite(numericId) && numericId > 0 ? numericId : undefined,
    name: row.item_name || 'Unknown Item',
    category: 'consumable',
    rarity: normalizeRarity(row.rarity),
    dropRatePercent: 0,
    valueInUsd: normalizeWorthUsd(row.worth),
    icon: 'gemSack',
    description: `Tersimpan di backpack kamu sebanyak ${Number(row.count) || 0}.`,
    glowColor: typeof row.color === 'string' && row.color ? row.color : '#4b69ff',
  };
}

export function DashboardProvider({
  children,
  onRequireLogin,
}: {
  children: ReactNode;
  onRequireLogin: (notice?: string) => void;
}) {
  const { user, isGuest, updateBalance } = useAuth();

  const [backpack, setBackpack] = useState<ApiBackpackItem[]>([]);
  const [backpackTotals, setBackpackTotals] = useState({ totalCount: 0, totalWorth: 0 });
  const [isLoadingBackpack, setIsLoadingBackpack] = useState(false);
  const [liveDrops, setLiveDrops] = useState<LiveDropRecord[]>(INITIAL_LIVE_DROPS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(MOCK_BROADCASTS);
  const [activeTab, setActiveTab] = useState<DashboardTab>('hub');

  const growId = user?.grow_id ?? 'Guest';
  const world = 'GROWPRIZE';

  // saldo hanya berasal dari server. tidak ada cache lokal yang bisa menutupi
  // angka server dan membuat saldo terlihat macet atau berbeda dari akun nyata.
  const serverBalance = useMemo(() => balanceFromBackend(user?.balance), [user?.balance]);

  // overlay ledger lokal khusus minigame demo (bukan gacha). ref jadi sumber
  // kebenaran untuk pembacaan sinkron, state hanya cermin untuk render. pola ini
  // menghindari lost update (dua panggilan dalam satu batch) sekaligus false-reject
  // (membaca hasil yang baru di-set di dalam updater).
  const ledgerRef = useRef<WalletBalance | null>(null);
  const [ledgerOverride, setLedgerOverride] = useState<WalletBalance | null>(null);

  useEffect(() => {
    ledgerRef.current = null;
    setLedgerOverride(null);
  }, [user?.uid, user?.balance]);

  const balance = ledgerOverride ?? serverBalance;

  // belanja usd dengan guard anti-nan: potong hanya bila jumlahnya valid dan cukup.
  // keputusan diambil dari ref sehingga nilai kembalian selalu akurat, tanpa
  // bergantung pada kapan react menjalankan updater.
  const spendUsd = useCallback(
    (amountUsd: number) => {
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) return false;
      const base = ledgerRef.current ?? serverBalance;
      if (base.usd < amountUsd) return false;
      const next = { usd: roundUsd(base.usd - amountUsd) };
      ledgerRef.current = next;
      setLedgerOverride(next);
      return true;
    },
    [serverBalance]
  );

  const addUsd = useCallback(
    (deltaUsd: number) => {
      if (!Number.isFinite(deltaUsd) || deltaUsd <= 0) return;
      const base = ledgerRef.current ?? serverBalance;
      const next = { usd: normalizeUsd(base.usd + deltaUsd) };
      ledgerRef.current = next;
      setLedgerOverride(next);
    },
    [serverBalance]
  );

  const inventory = useMemo(() => backpack.map(toGachaItem), [backpack]);

  const refreshBackpack = useCallback(async () => {
    if (isGuest) {
      setBackpack([]);
      setBackpackTotals({ totalCount: 0, totalWorth: 0 });
      return;
    }
    setIsLoadingBackpack(true);
    try {
      const res = await fetchBackpack();
      setBackpack(Array.isArray(res.items) ? res.items : []);
      setBackpackTotals({
        totalCount: Number(res.totalCount) || 0,
        totalWorth: Number(res.totalWorth) || 0,
      });
    } catch {
      // sesi mungkin sudah tidak valid; biarkan data lama agar ui tidak berkedip kosong.
    } finally {
      setIsLoadingBackpack(false);
    }
  }, [isGuest]);

  useEffect(() => {
    void refreshBackpack();
  }, [refreshBackpack, user?.uid]);

  // mencatat item menang ke feed live drop dan broadcast sistem saja.
  // kepemilikan item yang sebenarnya selalu berasal dari server lewat refreshBackpack.
  const addItemToInventory = useCallback(
    (item: GachaItem) => {
      const newDrop: LiveDropRecord = {
        id: `drop-${Date.now()}`,
        player: growId,
        item,
        timestamp: 'Just now',
        chestType:
          item.rarity === 'mythic' ? 'super' : item.rarity === 'legendary' ? 'gold' : 'silver',
      };
      setLiveDrops((prev) => [newDrop, ...prev.slice(0, 19)]);

      if (item.rarity === 'mythic') {
        setBroadcasts((prev) => [
          {
            id: `bc-${Date.now()}`,
            author: 'SYSTEM',
            message: `JACKPOT ALERT: ${growId} has obtained [${item.name}] from Golden Gacha Chest!`,
            isJackpot: true,
          },
          ...prev,
        ]);
      }
    },
    [growId]
  );

  const value = useMemo(
    () => ({
      balance,
      inventory,
      backpack,
      backpackTotals,
      isLoadingBackpack,
      liveDrops,
      broadcasts,
      isGuest,
      growId,
      world,
      activeTab,
      addItemToInventory,
      requireLogin: onRequireLogin,
      setActiveTab,
      refreshBackpack,
      spendUsd,
      addUsd,
      updateBalance,
    }),
    [
      balance,
      inventory,
      backpack,
      backpackTotals,
      isLoadingBackpack,
      liveDrops,
      broadcasts,
      isGuest,
      growId,
      world,
      activeTab,
      addItemToInventory,
      onRequireLogin,
      refreshBackpack,
      spendUsd,
      addUsd,
      updateBalance,
    ]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard harus dipakai di dalam DashboardProvider');
  }
  return ctx;
}
