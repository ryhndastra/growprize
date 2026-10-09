import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  spendWls: (amountWls: number) => boolean;
  addLocks: (delta: Partial<WalletBalance>) => void;
}

const DashboardContext = createContext<(DashboardState & DashboardActions) | null>(null);

// backend menyimpan satu angka saldo. fe memperlakukannya sebagai nilai world lock
// utama, lalu menurunkan dl dan bgl hanya untuk tata letak tampilan saldo lama.
function balanceFromBackend(raw: number | null | undefined): WalletBalance {
  const safe = typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : 0;
  return { wls: safe, dls: 0, bgls: 0, gems: 0 };
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
    valueInDls: Number.isFinite(Number(row.worth)) ? Number(row.worth) / 100 : 0,
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
  const { user, isGuest } = useAuth();

  const [backpack, setBackpack] = useState<ApiBackpackItem[]>([]);
  const [backpackTotals, setBackpackTotals] = useState({ totalCount: 0, totalWorth: 0 });
  const [isLoadingBackpack, setIsLoadingBackpack] = useState(false);
  const [liveDrops, setLiveDrops] = useState<LiveDropRecord[]>(INITIAL_LIVE_DROPS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(MOCK_BROADCASTS);
  const [activeTab, setActiveTab] = useState<DashboardTab>('hub');

  const growId = user?.grow_id ?? 'Guest';
  const world = 'GROWPRIZE';

  // saldo hanya berasal dari server. tidak ada lagi state lokal yang bisa membuat
  // angka palsu muncul saat refresh.
  const serverBalance = useMemo(() => balanceFromBackend(user?.balance), [user?.balance]);

  // overlay ledger lokal khusus minigame demo (bukan gacha). direset saat identitas
  // berubah atau data server diperbarui, supaya tidak menutupi angka server selamanya.
  const [ledgerOverride, setLedgerOverride] = useState<WalletBalance | null>(null);

  useEffect(() => {
    setLedgerOverride(null);
  }, [user?.uid, user?.balance]);

  const balance = ledgerOverride ?? serverBalance;

  // belanja nilai dalam satuan wl dengan memotong lintas denominasi secara atomik.
  const spendWls = useCallback(
    (amountWls: number) => {
      if (!Number.isFinite(amountWls) || amountWls <= 0) return false;
      const base = ledgerOverride ?? serverBalance;
      const totalWls = base.wls + base.dls * 100 + base.bgls * 10000;
      if (totalWls < amountWls) return false;

      const affordableWls = totalWls - amountWls;
      const bgls = Math.floor(affordableWls / 10000);
      const afterBgls = affordableWls - bgls * 10000;
      const dls = Math.floor(afterBgls / 100);
      const wls = afterBgls - dls * 100;

      setLedgerOverride({ wls, dls, bgls, gems: base.gems });
      return true;
    },
    [ledgerOverride, serverBalance]
  );

  const addLocks = useCallback(
    (delta: Partial<WalletBalance>) => {
      const base = ledgerOverride ?? serverBalance;
      setLedgerOverride({
        wls: base.wls + (delta.wls ?? 0),
        dls: base.dls + (delta.dls ?? 0),
        bgls: base.bgls + (delta.bgls ?? 0),
        gems: base.gems + (delta.gems ?? 0),
      });
    },
    [ledgerOverride, serverBalance]
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
      spendWls,
      addLocks,
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
      spendWls,
      addLocks,
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
