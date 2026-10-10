import { useState } from 'react';
import type { RarityTier } from '../../../types/dashboard';
import { RarityChip } from '../gacha/RarityTierPills';
import { GrowItemIcon } from '../GrowItemIcon';
import { useDashboard } from '../DashboardContext';
import { useAuth } from '../../../lib/auth';
import { ApiError, sellBackpack, redeemBackpack } from '../../../lib/api';
import type { ApiBackpackItem } from '../../../lib/api';
import { normalizeRarity } from '../gacha/normalizeRarity';
import { formatUsd, normalizeWorthUsd } from '../../../lib/money';

type SellStatus = { tone: 'ok' | 'error'; text: string } | null;

// halaman koleksi tas item. seluruh data berasal dari backpack server, dan aksi
// jual serta klaim dikirim ke backend lalu daftar di-refresh dari server.
export function InventoryGrid() {
  const { backpack, backpackTotals, isLoadingBackpack, isGuest, requireLogin, refreshBackpack } =
    useDashboard();
  const { refreshUser, updateBalance } = useAuth();

  const [filterRarity, setFilterRarity] = useState<'all' | RarityTier>('all');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<SellStatus>(null);

  const filteredItems =
    filterRarity === 'all'
      ? backpack
      : backpack.filter((item) => normalizeRarity(item.rarity) === filterRarity);

  const countByRarity = (rarity: RarityTier) =>
    backpack.filter((item) => normalizeRarity(item.rarity) === rarity).length;

  const handleSell = async (item: ApiBackpackItem) => {
    if (busy) return;
    if (isGuest) {
      requireLogin('Log in GrowID untuk menjual item.');
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await sellBackpack([{ itemId: Number(item.item_id), quantity: 1 }]);
      if (res.balance !== undefined && res.balance !== null) {
        updateBalance(res.balance);
      }
      setStatus({ tone: 'ok', text: res.message });
      await refreshUser();
      await refreshBackpack();
    } catch (err) {
      setStatus({ tone: 'error', text: describeError(err) });
    } finally {
      setBusy(false);
    }
  };

  const handleClaim = async (item: ApiBackpackItem) => {
    if (busy) return;
    if (isGuest) {
      requireLogin('Log in GrowID untuk mengirim item ke game.');
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await redeemBackpack([{ itemId: Number(item.item_id), quantity: 1 }]);
      setStatus({ tone: 'ok', text: res.message });
      await refreshBackpack();
    } catch (err) {
      setStatus({ tone: 'error', text: describeError(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full flex flex-col select-none">
      <InventorySummary
        totalItems={backpackTotals.totalCount || backpack.length}
        totalWorth={backpackTotals.totalWorth}
      />

      {status && (
        <div
          role="status"
          className={`mb-5 rounded-[6px] border-2 px-4 py-2.5 text-xs font-bold ${
            status.tone === 'ok'
              ? 'border-[#43b427] bg-[#eafbe5] text-[#1a5e0f]'
              : 'border-red-500 bg-red-50 text-red-800'
          }`}
        >
          {status.text}
        </div>
      )}

      {backpack.length > 0 && (
        <FilterRow
          active={filterRarity}
          onSelect={setFilterRarity}
          total={backpack.length}
          countByRarity={countByRarity}
        />
      )}

      {isLoadingBackpack && backpack.length === 0 ? (
        <div className="gt-white-card py-12 px-6 flex items-center justify-center text-center">
          <p className="text-sm font-bold text-black/70">Memuat tas item dari server...</p>
        </div>
      ) : backpack.length === 0 ? (
        <EmptyVault
          isGuest={isGuest}
          onRequestLogin={() => requireLogin('Log in GrowID untuk membuka backpack item kamu.')}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyFilter />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              busy={busy}
              onSell={() => void handleSell(item)}
              onClaim={() => void handleClaim(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function describeError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Sesi kamu berakhir. Silakan login lagi.';
    if (err.status === 403) return 'Akses ditolak. Coba lagi nanti.';
    if (err.status >= 500 || err.status === 0) return 'Server sedang sibuk. Coba lagi sebentar lagi.';
    return err.message;
  }
  return 'Terjadi kesalahan. Coba lagi.';
}

function InventorySummary({
  totalItems,
  totalWorth,
}: {
  totalItems: number;
  totalWorth: number;
}) {
  const safeTotal = Number.isFinite(totalWorth) ? totalWorth : 0;
  return (
    <div className="gt-white-card p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-[8px] bg-[#b5eefa] flex items-center justify-center shrink-0 p-2">
          <img src="/xsolla/items/chest_o_gems.png" alt="" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-black tracking-tight">
            Tas Koleksi Item
          </h2>
          <p className="text-xs sm:text-sm font-bold text-black/70">
            {totalItems} item tersimpan di backpack kamu
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-[8px] bg-[#d9f8ff] px-4 py-3 text-black">
        <span className="text-xs sm:text-sm font-bold text-black/75">Nilai Total:</span>
        <span className="font-bold text-base sm:text-lg text-[#15803d] tabular-nums">
          ${safeTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function FilterRow({
  active,
  onSelect,
  total,
  countByRarity,
}: {
  active: 'all' | RarityTier;
  onSelect: (r: 'all' | RarityTier) => void;
  total: number;
  countByRarity: (rarity: RarityTier) => number;
}) {
  const filters: Array<'all' | RarityTier> = ['all', 'mythic', 'legendary', 'epic', 'rare', 'common'];
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
      {filters.map((r) => {
        const isActive = active === r;
        const count = r === 'all' ? total : countByRarity(r);
        return (
          <button
            key={r}
            type="button"
            onClick={() => onSelect(r)}
            aria-pressed={isActive}
            className={`cursor-pointer shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all shadow-[2.5px_3px_0px_0px_#000000] ${
              isActive
                ? 'bg-[#43b427] text-white text-shadow-gt-soft'
                : 'bg-white text-black hover:bg-[#d9f8ff]'
            }`}
          >
            {r}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${
                isActive ? 'bg-white text-[#43b427]' : 'bg-[#d9f8ff] text-black'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function InventoryCard({
  item,
  busy,
  onSell,
  onClaim,
}: {
  item: ApiBackpackItem;
  busy: boolean;
  onSell: () => void;
  onClaim: () => void;
}) {
  const rarity = normalizeRarity(item.rarity);
  const worth = normalizeWorthUsd(item.worth);
  const count = Number(item.count) || 0;

  return (
    <div className="group gt-card p-3.5 flex flex-col items-center justify-between transition-transform hover:-translate-y-1">
      <div className="w-full flex items-center justify-between gap-1 mb-2">
        <RarityChip rarity={rarity} />
        <div className="flex items-center gap-1 text-xs font-bold text-black tabular-nums">
          <span>{formatUsd(worth)}</span>
        </div>
      </div>

      <div className="gt-inset w-full aspect-square flex items-center justify-center mb-2.5 p-3 relative">
        <GrowItemIcon
          item={{
            id: String(item.item_id),
            itemId: Number(item.item_id) || undefined,
            name: item.item_name,
            category: 'consumable',
            rarity,
            dropRatePercent: 0,
            valueInUsd: worth,
            icon: 'gemSack',
            description: '',
            glowColor: item.color || '#4b69ff',
          }}
          className="h-16 w-16"
          requestSize={256}
        />
        <span className="absolute bottom-1 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
          x{count}
        </span>
      </div>

      <span className="font-display font-bold text-sm sm:text-base text-black text-center leading-tight truncate w-full">
        {item.item_name}
      </span>

      <div className="mt-3 w-full grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onSell}
          disabled={busy}
          title="Jual instan untuk menambah saldo"
          className="cursor-pointer py-2 rounded-[4px] text-xs font-bold uppercase bg-[#03afef] hover:bg-[#1cc0ff] text-white shadow-[2px_3px_0px_0px_#000000] text-shadow-gt-soft active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
        >
          JUAL
        </button>

        <button
          type="button"
          onClick={onClaim}
          disabled={busy}
          title="Kirim ke world kamu"
          className="gt-btn-3d cursor-pointer py-2 text-xs font-bold uppercase !px-2 disabled:opacity-50"
        >
          KLAIM
        </button>
      </div>
    </div>
  );
}

function EmptyVault({
  isGuest,
  onRequestLogin,
}: {
  isGuest: boolean;
  onRequestLogin: () => void;
}) {
  return (
    <div className="gt-white-card py-14 px-6 flex flex-col items-center justify-center text-center">
      <img
        src="/xsolla/items/chest_o_gems.png"
        alt=""
        className="w-24 h-24 object-contain mb-4 drop-shadow"
      />
      <h3 className="font-display font-bold text-2xl text-black">
        {isGuest ? 'Tas Koleksi Terkunci' : 'Tas Masih Kosong'}
      </h3>
      <p className="text-sm text-black/75 max-w-md mt-2 leading-relaxed">
        {isGuest
          ? 'Login dengan GrowID kamu untuk membuka backpack dan menyimpan hadiah gacha.'
          : 'Kamu belum memiliki item di dalam backpack. Buka Gacha Roulette untuk memenangkan hadiah langka Growtopia!'}
      </p>
      {isGuest && (
        <button
          type="button"
          onClick={onRequestLogin}
          className="gt-btn-3d cursor-pointer mt-5 px-8 h-12 text-base font-bold uppercase"
        >
          LOGIN SEKARANG
        </button>
      )}
    </div>
  );
}

function EmptyFilter() {
  return (
    <div className="gt-white-card py-12 px-6 flex flex-col items-center justify-center text-center">
      <h3 className="font-display font-bold text-xl text-black">Tidak ada item di tier ini</h3>
      <p className="text-sm text-black/70 max-w-sm mt-1.5 leading-relaxed">
        Pilih kategori rarity lain untuk melihat sisa koleksi hadiahmu.
      </p>
    </div>
  );
}
