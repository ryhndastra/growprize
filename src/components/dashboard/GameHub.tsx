import { useState } from 'react';
import { DashboardTab } from '../../types/dashboard';
import { GACHA_ITEMS } from '../../data/gachaItems';
import { RarityChip } from './gacha/RarityTierPills';
import { ItemSprite } from './GachaSprites';
import { GameInspectModal } from './GameInspectModal';
import { GameCard, GameCardData } from './hub/GameCard';

interface GameHubProps {
  onSelectTab: (tab: DashboardTab) => void;
  inventoryCount?: number;
  isGuest?: boolean;
  onRequireLogin?: () => void;
}

// konfigurasi 6 minigame resmi Growprize dalam format data kartu yang seragam
const ALL_GAMES: GameCardData[] = [
  {
    id: 'gacha',
    title: "IT'S RAININ' PRIZES",
    subtitle: "Peti gacha roulette legendaris berhadiah Rayman's Fist, Magplant 5000, dan Golden Ankh.",
    badge: 'PALING POPULER',
    badgeColor: 'red',
    costLabel: '10 WL / Spin',
    imageSrc: '/xsolla/items/it_s_rainin_gems.png',
    tagline: 'Roulette Wheel • Spin 1x/5x/10x',
    inspectable: true,
  },
  {
    id: 'mystery_box',
    title: 'SUPER MYSTERY BOX',
    subtitle: 'Buka peti kayu, emas, atau obsidian kuno untuk menemukan drop langka & Diamond Lock.',
    badge: '3 TIER PETI',
    badgeColor: 'amber',
    costLabel: '5 WL - 1 DL',
    imageSrc: '/xsolla/items/chest_o_gems.png',
    tagline: 'Wooden, Golden & Obsidian',
  },
  {
    id: 'diamond_dice',
    title: 'DIAMOND DICE',
    subtitle: 'Lempar dadu keberuntungan 1-100. Pasang taruhan pada Over 50, Under 50, atau Lucky 77.',
    badge: 'FAIR PROVABLY RNG',
    badgeColor: 'sky',
    costLabel: '1 WL - 1 DL',
    imageSrc: '/xsolla/items/world_lock.png',
    tagline: 'Provably Fair • Payout s/d 15x',
  },
  {
    id: 'gem_rain',
    title: 'GEM RAIN ARENA',
    subtitle: 'Tangkap hujan ribuan Gems dan World Lock yang jatuh dari langit sebelum hilang ke tanah.',
    badge: 'ARCADE LIVE',
    badgeColor: 'emerald',
    costLabel: '2 WL / Ronde',
    imageSrc: '/xsolla/items/gem_abundance.png',
    tagline: '20s Catcher • Combo Multiplier',
  },
  {
    id: 'lucky_wheel',
    title: 'LUCKY WHEEL',
    subtitle: 'Putar roda keberuntungan 8 segmen untuk memenangkan Gems, World Lock, DL, atau Devil Wings.',
    badge: 'ROULETTE 8X',
    badgeColor: 'purple',
    costLabel: '3 WL / Putar',
    imageSrc: '/xsolla/items/growtoken.png',
    tagline: '8 Segmen • Payout Berjenjang',
  },
  {
    id: 'treasure_hunt',
    title: 'TREASURE HUNT',
    subtitle: 'Gali 3 petak tanah misterius dari 9 blok untuk menemukan harta karun Diamond Lock.',
    badge: 'MINING ARCADE',
    badgeColor: 'amber',
    costLabel: '4 WL / Ronde',
    imageSrc: '/xsolla/items/gem_bounty.png',
    tagline: '9 Petak • 3 Kesempatan Gali',
  },
];

// halaman beranda katalog minigame Growprize berisi 6 minigame dalam grid 3x2 yang seragam dan modular.
export function GameHub({
  onSelectTab,
  isGuest = false,
  onRequireLogin,
}: GameHubProps) {
  const [inspectOpen, setInspectOpen] = useState(false);

  const handlePlay = (tab: DashboardTab) => {
    if (isGuest && onRequireLogin) {
      onRequireLogin();
      return;
    }
    onSelectTab(tab);
  };

  return (
    <div className="w-full select-none">
      {/* judul utama beranda */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="gt-lucky-title text-3xl sm:text-5xl tracking-wide">
          SEMUA GAME GROWPRIZE
        </h2>
        <p className="text-xs sm:text-base font-bold text-black/75 mt-2 max-w-2xl mx-auto">
          Enam minigame resmi Growprize siap kamu mainkan: putar gacha, buka peti rahasia, lempar dadu, tangkap hujan permata, putar roda hadiah, atau gali tanah harta karun!
        </p>
      </div>

      {/* grid 6 game (3x2 pada desktop, 2 kolom pada tablet, 1 kolom pada mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
        {ALL_GAMES.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isGuest={isGuest}
            onPlay={handlePlay}
            onInspect={() => setInspectOpen(true)}
          />
        ))}
      </div>

      {/* PRIZE POOL DARI SELURUH MINIGAME */}
      <div className="w-full mt-14 sm:mt-20">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="gt-lucky-title text-3xl sm:text-5xl tracking-wide">
            PRIZE POOL MINIGAME
          </h3>
          <p className="text-xs sm:text-base font-bold text-black/75 mt-2">
            Koleksi item langka dan legendaris Growtopia yang siap kamu menangkan di minigame kami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
          {GACHA_ITEMS.slice(0, 12).map((item) => (
            <div
              key={item.id}
              className="gt-card relative flex flex-col justify-between p-4 transition-transform hover:-translate-y-1.5 shadow-[-6px_8px_0px_#03afef]"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <RarityChip rarity={item.rarity} />
                  <div className="flex items-center gap-1 font-bold text-xs text-black">
                    <img src="/xsolla/items/world_lock.png" alt="" className="w-3.5 h-3.5 object-contain" />
                    <span>
                      {item.valueInDls >= 1 ? `${item.valueInDls} DL` : `${Math.round(item.valueInDls * 100)} WL`}
                    </span>
                  </div>
                </div>

                <div className="gt-inset flex h-32 w-full items-center justify-center p-3 mb-2 rounded-[6px]">
                  <ItemSprite sprite={item.icon} className="w-16 h-16" />
                </div>

                <h4 className="font-display font-bold text-sm text-black truncate text-center">
                  {item.name}
                </h4>
                <p className="text-[11px] font-bold text-black/65 text-center mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handlePlay('gacha')}
                  className="gt-btn-3d w-full py-1.5 text-xs font-bold cursor-pointer"
                >
                  MAIN SEKARANG
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* modal inspeksi peluang hadiah */}
      <GameInspectModal
        isOpen={inspectOpen}
        onClose={() => setInspectOpen(false)}
      />
    </div>
  );
}
