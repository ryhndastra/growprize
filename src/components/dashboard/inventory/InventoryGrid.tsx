import { useState } from 'react';
import { GachaItem, RarityTier } from '../../../types/dashboard';
import { RarityChip } from '../gacha/RarityTierPills';
import { DiamondLockIcon } from '../../GrowtopiaAssets';
import { ItemSprite } from '../GachaSprites';
import { useDashboard } from '../DashboardContext';

const FILTERS: Array<'all' | RarityTier> = ['all', 'mythic', 'legendary', 'epic', 'rare', 'common'];

function formatItemValue(value: number): { asDl: boolean; text: string } {
  if (!Number.isFinite(value) || value <= 0) return { asDl: false, text: '0 WL' };
  if (value >= 1) return { asDl: true, text: `${value} DL` };
  return { asDl: false, text: `${Math.round(value * 100)} WL` };
}

// halaman koleksi tas item bergaya katalog kartu xsolla.growtopiagame.com.
export function InventoryGrid() {
  const { inventory, isGuest, sellInventoryItem, world, requireLogin } = useDashboard();

  const [filterRarity, setFilterRarity] = useState<'all' | RarityTier>('all');

  const totalDlValue = inventory.reduce(
    (acc, it) => acc + (Number.isFinite(it.valueInDls) ? it.valueInDls : 0),
    0
  );

  const filteredItems =
    filterRarity === 'all' ? inventory : inventory.filter((item) => item.rarity === filterRarity);

  const countByRarity = (rarity: RarityTier) =>
    inventory.filter((it) => it.rarity === rarity).length;

  return (
    <div className="w-full flex flex-col select-none">
      <InventorySummary totalItems={inventory.length} totalDlValue={totalDlValue} />

      {inventory.length > 0 && (
        <FilterRow
          active={filterRarity}
          onSelect={setFilterRarity}
          total={inventory.length}
          countByRarity={countByRarity}
        />
      )}

      {inventory.length === 0 ? (
        <EmptyVault
          isGuest={isGuest}
          onRequestLogin={() => requireLogin('Log in GrowID untuk membuka vault item kamu.')}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyFilter />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map((item, idx) => (
            <InventoryCard
              key={`${item.id}-${idx}`}
              item={item}
              onSell={() => sellInventoryItem(item)}
              onClaim={() =>
                alert(`Item ${item.name} akan dikirim ke world ${world} oleh bot!`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InventorySummary({
  totalItems,
  totalDlValue,
}: {
  totalItems: number;
  totalDlValue: number;
}) {
  const safeTotal = Number.isFinite(totalDlValue) ? totalDlValue : 0;
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
            {totalItems} item tersimpan di vault Eclipse PS
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-[8px] bg-[#d9f8ff] px-4 py-3 text-black">
        <span className="text-xs sm:text-sm font-bold text-black/75">Nilai Total:</span>
        <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg text-[#15803d] tabular-nums">
          <DiamondLockIcon className="w-5 h-5" />
          <span>{safeTotal.toFixed(1)} DL</span>
        </div>
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
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
      {FILTERS.map((r) => {
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
  onSell,
  onClaim,
}: {
  item: GachaItem;
  onSell: () => void;
  onClaim: () => void;
}) {
  const label = formatItemValue(item.valueInDls);
  return (
    <div className="group gt-card p-3.5 flex flex-col items-center justify-between transition-transform hover:-translate-y-1">
      <div className="w-full flex items-center justify-between gap-1 mb-2">
        <RarityChip rarity={item.rarity} />
        <div className="flex items-center gap-1 text-xs font-bold text-black tabular-nums">
          {label.asDl ? (
            <DiamondLockIcon className="w-3.5 h-3.5" />
          ) : (
            <img src="/xsolla/items/world_lock.png" alt="" className="w-3.5 h-3.5 object-contain" />
          )}
          <span>{label.text}</span>
        </div>
      </div>

      <div className="gt-inset w-full aspect-square flex items-center justify-center mb-2.5 p-3">
        <ItemSprite sprite={item.icon} className="w-16 h-16" />
      </div>

      <span className="font-display font-bold text-sm sm:text-base text-black text-center leading-tight truncate w-full">
        {item.name}
      </span>

      <div className="mt-3 w-full grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onSell}
          title="Jual instan untuk DL"
          className="cursor-pointer py-2 rounded-[4px] text-xs font-bold uppercase bg-[#03afef] hover:bg-[#1cc0ff] text-white shadow-[2px_3px_0px_0px_#000000] text-shadow-gt-soft active:translate-x-[1px] active:translate-y-[1px]"
        >
          JUAL
        </button>

        <button
          type="button"
          onClick={onClaim}
          title="Kirim ke world kamu"
          className="gt-btn-3d cursor-pointer py-2 text-xs font-bold uppercase !px-2"
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
          ? 'Login dengan GrowID kamu untuk membuka vault cloud dan menyimpan hadiah gacha.'
          : 'Kamu belum memiliki item di dalam tas. Buka Gacha Roulette untuk memenangkan hadiah langka Growtopia!'}
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
