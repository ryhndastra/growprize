import { useState } from 'react';
import { RarityTier } from '../../../types/dashboard';
import { ItemSprite } from '../GachaSprites';
import { RarityChip } from '../gacha/RarityTierPills';
import { useDashboard } from '../DashboardContext';
import { formatUsd } from '../../../lib/money';

const FILTERS: Array<'all' | RarityTier> = ['all', 'mythic', 'legendary', 'epic'];

// papan pemenang jackpot langsung bergaya kartu putih & biru es xsolla.growtopiagame.com.
export function LiveDropsList() {
  const { liveDrops: drops, setActiveTab } = useDashboard();
  const [filterRarity, setFilterRarity] = useState<'all' | RarityTier>('all');

  const filteredDrops = drops.filter((drop) => {
    if (filterRarity === 'all') return true;
    return drop.item.rarity === filterRarity;
  });

  return (
    <div className="w-full space-y-6 select-none">
      {/* 3 kartu statistik atas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          imgSrc="/xsolla/items/it_s_rainin_gems.png"
          label="Jackpot Teratas"
          value="Rayman's Fist ($35.00)"
        />
        <StatCard
          imgSrc="/xsolla/items/growtoken.png"
          label="Total Putaran Hari Ini"
          value="1.482 Jackpot"
        />
        <StatCard
          imgSrc="/xsolla/items/gems.png"
          label="Hadiah Server"
          value="$8,400 Dibagikan"
        />
      </div>

      {/* kartu putih utama daftar pemenang */}
      <div className="gt-white-card p-5 sm:p-8">
        <div className="pb-5 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/xsolla/items/megaphone.png" alt="" className="w-7 h-7 object-contain" />
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-black tracking-tight">
                Live Jackpot Winners
              </h2>
              <p className="text-xs sm:text-sm font-bold text-black/65">
                Pemenang terbaru dari mesin Gacha Eclipse PS secara real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-[6px] bg-[#d9f8ff] p-1.5 text-xs font-bold">
            {FILTERS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFilterRarity(r)}
                aria-pressed={filterRarity === r}
                className={`cursor-pointer px-3 py-1.5 rounded-[4px] uppercase transition-all ${
                  filterRarity === r
                    ? 'bg-[#43b427] text-white shadow-[1.5px_2px_0_#000] text-shadow-gt-soft'
                    : 'text-black/75 hover:text-black'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="my-5 space-y-2.5 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
          {filteredDrops.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-black/60">
              <img src="/xsolla/items/chest_o_gems.png" alt="" className="w-16 h-16 object-contain opacity-75" />
              <span className="text-sm font-bold">Belum ada drop untuk filter ini.</span>
            </div>
          ) : (
            filteredDrops.map((drop) => {
              const isHighTier = drop.item.rarity === 'mythic' || drop.item.rarity === 'legendary';
              const value = formatUsd(drop.item.valueInUsd);
              return (
                <div
                  key={drop.id}
                  className={`p-3 sm:p-4 rounded-[8px] flex items-center justify-between gap-3 transition-colors ${
                    isHighTier ? 'bg-[#b5eefa] ring-2 ring-[#03afef]' : 'bg-[#d9f8ff] hover:bg-[#b5eefa]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-[8px] bg-white flex items-center justify-center shrink-0 shadow-xs">
                      <ItemSprite sprite={drop.item.icon} className="w-8 h-8" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-black truncate">
                          {drop.player}
                        </span>
                        <RarityChip rarity={drop.item.rarity} />
                      </div>
                      <p className="text-xs sm:text-sm text-black/80 font-bold truncate mt-0.5">
                        memenangkan <span className="text-[#0284c7]">{drop.item.name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <div className="flex items-center justify-end gap-1.5 text-xs sm:text-sm font-bold text-[#15803d] tabular-nums">
                        <img src="/xsolla/items/growtoken.png" alt="" className="w-4 h-4 object-contain" />
                        <span>{value}</span>
                      </div>
                      <span className="text-[11px] text-black/55 font-bold block">{drop.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-bold text-black/80 text-center sm:text-left">
            Siap mengadu keberuntunganmu? Buka peti sekarang dan bawa pulang jackpot!
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('gacha')}
            className="gt-btn-3d cursor-pointer w-full sm:w-auto px-8 h-12 text-base font-bold uppercase shrink-0"
          >
            MULAI GACHA
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  imgSrc,
  label,
  value,
}: {
  imgSrc: string;
  label: string;
  value: string;
}) {
  return (
    <div className="gt-white-card p-4 flex items-center gap-3.5 transition-transform hover:-translate-y-0.5">
      <div className="w-13 h-13 rounded-[8px] bg-[#b5eefa] flex items-center justify-center shrink-0 p-2">
        <img src={imgSrc} alt="" className="w-9 h-9 object-contain" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-black/60">{label}</p>
        <p className="font-display text-base sm:text-lg font-bold text-black truncate tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}
