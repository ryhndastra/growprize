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

const GACHA_COSTS: Record<1 | 5 | 10, { wls: number; dls: number; label: string }> = {
  1: { wls: 10, dls: 0, label: '10 WL' },
  5: { wls: 50, dls: 0, label: '50 WL' },
  10: { wls: 0, dls: 1, label: '1 DL' },
};

interface DashboardState {
  balance: WalletBalance;
  inventory: GachaItem[];
  liveDrops: LiveDropRecord[];
  broadcasts: BroadcastMessage[];
  isGuest: boolean;
  growId: string;
  world: string;
  activeTab: DashboardTab;
}

interface DashboardActions {
  addItemToInventory: (item: GachaItem) => void;
  sellInventoryItem: (item: GachaItem) => void;
  convertLocks: (next: WalletBalance) => void;
  deductLocks: (delta: Partial<WalletBalance>) => boolean;
  addLocks: (delta: Partial<WalletBalance>) => void;
  spendWls: (amountWls: number) => boolean;
  canAfford: (count: 1 | 5 | 10) => boolean;
  costLabel: (count: 1 | 5 | 10) => string;
  requireLogin: (notice?: string) => void;
  setActiveTab: (tab: DashboardTab) => void;
}

const DashboardContext = createContext<(DashboardState & DashboardActions) | null>(null);

const EMPTY_BALANCE: WalletBalance = { wls: 0, dls: 0, bgls: 0, gems: 0 };

export function DashboardProvider({
  children,
  onRequireLogin,
}: {
  children: ReactNode;
  onRequireLogin: (notice?: string) => void;
}) {
  const { user, isGuest } = useAuth();

  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [liveDrops, setLiveDrops] = useState<LiveDropRecord[]>(INITIAL_LIVE_DROPS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(MOCK_BROADCASTS);
  const [activeTab, setActiveTab] = useState<DashboardTab>('hub');

  // Saldo backend masih read-only, jadi perubahan lokal (konversi lock, biaya
  // gacha) disimpan sebagai override di sini. override direset tiap identitas
  // pemain berganti supaya saldo guest tidak bocor ke akun asli.
  const [ledgerOverride, setLedgerOverride] = useState<WalletBalance | null>(null);
  const ledgerOverrideRef = useRef<WalletBalance | null>(null);

  const growId = user?.grow_id ?? 'Guest';
  const world = 'GROWPRIZE';

  const backendBalance: WalletBalance = user
    ? { wls: user.balance ?? 0, dls: 0, bgls: 0, gems: 0 }
    : EMPTY_BALANCE;

  const identity = user?.uid ?? 'guest';

  useEffect(() => {
    ledgerOverrideRef.current = null;
    setLedgerOverride(null);
  }, [identity]);

  const balance = ledgerOverride ?? backendBalance;

  const convertLocks = useCallback((next: WalletBalance) => {
    ledgerOverrideRef.current = next;
    setLedgerOverride(next);
  }, []);

  const deductLocks = useCallback(
    (delta: Partial<WalletBalance>) => {
      const base = ledgerOverrideRef.current ?? backendBalance;
      const wls = base.wls - (delta.wls ?? 0);
      const dls = base.dls - (delta.dls ?? 0);
      const bgls = base.bgls - (delta.bgls ?? 0);
      const gems = base.gems - (delta.gems ?? 0);
      if (wls < 0 || dls < 0 || bgls < 0 || gems < 0) return false;
      const next = { wls, dls, bgls, gems };
      ledgerOverrideRef.current = next;
      setLedgerOverride(next);
      return true;
    },
    [backendBalance]
  );

  // belanja sejumlah nilai dalam satuan wl dengan memotong lintas denominasi
  // secara atomik. seluruh saldo lock dinormalkan ke wl dulu, dikurangi, lalu
  // disusun ulang ke bgl, dl, dan wl supaya tidak pernah menghasilkan angka
  // negatif atau desimal. gagal bersih bila total tidak cukup.
  const spendWls = useCallback(
    (amountWls: number) => {
      if (!Number.isFinite(amountWls) || amountWls <= 0) return false;
      const base = ledgerOverrideRef.current ?? backendBalance;
      const totalWls = base.wls + base.dls * 100 + base.bgls * 10000;
      if (totalWls < amountWls) return false;

      const affordableWls = totalWls - amountWls;
      const bgls = Math.floor(affordableWls / 10000);
      const afterBgls = affordableWls - bgls * 10000;
      const dls = Math.floor(afterBgls / 100);
      const wls = afterBgls - dls * 100;

      const next = { wls, dls, bgls, gems: base.gems };
      ledgerOverrideRef.current = next;
      setLedgerOverride(next);
      return true;
    },
    [backendBalance]
  );

  const addLocks = useCallback(
    (delta: Partial<WalletBalance>) => {
      const base = ledgerOverrideRef.current ?? backendBalance;
      const next = {
        wls: base.wls + (delta.wls ?? 0),
        dls: base.dls + (delta.dls ?? 0),
        bgls: base.bgls + (delta.bgls ?? 0),
        gems: base.gems + (delta.gems ?? 0),
      };
      ledgerOverrideRef.current = next;
      setLedgerOverride(next);
    },
    [backendBalance]
  );

  const addItemToInventory = useCallback(
    (item: GachaItem) => {
      setInventory((prev) => [item, ...prev]);

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

  const sellInventoryItem = useCallback((item: GachaItem) => {
    setInventory((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  }, []);

  const canAfford = useCallback(
    (count: 1 | 5 | 10) => {
      if (isGuest) return false;
      const cost = GACHA_COSTS[count];
      const available = balance.wls + balance.dls * 100;
      return available >= cost.wls + cost.dls * 100;
    },
    [isGuest, balance]
  );

  const costLabel = useCallback((count: 1 | 5 | 10) => GACHA_COSTS[count].label, []);

  const value = useMemo(
    () => ({
      balance,
      inventory,
      liveDrops,
      broadcasts,
      isGuest,
      growId,
      world,
      activeTab,
      addItemToInventory,
      sellInventoryItem,
      convertLocks,
      deductLocks,
      addLocks,
      spendWls,
      canAfford,
      costLabel,
      requireLogin: onRequireLogin,
      setActiveTab,
    }),
    [
      balance,
      inventory,
      liveDrops,
      broadcasts,
      isGuest,
      growId,
      world,
      activeTab,
      addItemToInventory,
      sellInventoryItem,
      convertLocks,
      deductLocks,
      addLocks,
      spendWls,
      canAfford,
      costLabel,
      onRequireLogin,
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
