import { DashboardTab, PlayerProfile, WalletBalance, BroadcastMessage } from '../../types/dashboard';
import { BalancePill } from './BalancePill';
import { NotificationBell, type AppNotification } from './NotificationBell';
import { ProfileMenu } from './ProfileMenu';
import { MenuGlyph } from './glyphs';

interface DashboardHeaderProps {
  player: PlayerProfile;
  balance: WalletBalance;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  inventoryCount?: number;
  onOpenTutorial: () => void;
  onLogin?: () => void;
  onToggleSidebar?: () => void;
  broadcasts?: BroadcastMessage[];
}

// navbar hanya memuat navigasi global dan utilitas, game dipilih melalui beranda atau sidebar
const NAV_ITEMS: Array<{ id: DashboardTab; label: string }> = [
  { id: 'hub', label: 'SEMUA GAME' },
  { id: 'exchange', label: 'EXCHANGE' },
  { id: 'inventory', label: 'INVENTORY' },
  { id: 'leaderboard', label: 'JACKPOT' },
  { id: 'tutorial', label: 'CARA TOP UP' },
];

// navbar permanen: bagian atas menampilkan ornamen pemandangan pohon & karakter resmi xsolla,
// dan bilah tanah menempel lekat secara permanen di viewport paling atas (sticky top-0) tanpa pernah menghilang saat di-scroll.
export function DashboardHeader({
  player,
  balance,
  activeTab = 'hub',
  onTabChange,
  inventoryCount = 0,
  onOpenTutorial,
  onLogin,
  onToggleSidebar,
  broadcasts = [],
}: DashboardHeaderProps) {
  const isGuest = player.isGuest === true;

  const bellNotifications: AppNotification[] = broadcasts.map((b) => ({
    id: b.id,
    title: b.isJackpot ? 'Jackpot Alert' : 'Pengumuman',
    message: b.message,
    time: 'Baru saja',
    read: false,
    type: b.isJackpot ? 'drop' : 'event',
  }));

  return (
    <>
      {/* 1. Ornamen pemandangan atas: matahari, logo besar di atas rumput, dan karakter xsolla (mengalir alami dengan dokumen) */}
      <div className="relative w-full overflow-hidden select-none">
        {/* matahari kuning resmi di pojok kanan atas */}
        <img
          src="/xsolla/sun.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-4 sm:right-12 top-1 w-20 sm:w-28 h-auto object-contain z-0"
          draggable={false}
        />

        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 flex items-end justify-between pt-3 sm:pt-5">
          {/* logo besar bertengger di atas rumput */}
          <button
            type="button"
            onClick={() => onTabChange?.('hub')}
            className="cursor-pointer -mb-1.5 focus:outline-none"
            title="Kembali ke beranda minigame"
          >
            <img
              src="/intro/growprize_logo.png"
              alt="Growprize"
              className="h-16 sm:h-24 w-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 active:scale-95"
              draggable={false}
            />
          </button>

          {/* pohon palem, sofa, dan karakter penyihir resmi xsolla di atas rumput */}
          <img
            src="/xsolla/header_characters.png"
            alt=""
            aria-hidden="true"
            className="hidden md:block h-14 lg:h-[72px] w-auto object-contain mr-16 lg:mr-28 -mb-1"
            draggable={false}
          />
        </div>
      </div>

      {/* 2. Bilah tanah STICKY PERMANEN di viewport: direct child di layout sehingga 100% menempel di top-0 dan tidak pernah hilang */}
      <header className="sticky top-0 z-50 w-full gt-dirt-band shadow-[0_4px_14px_rgba(0,0,0,0.5)] select-none">
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 flex min-h-[64px] sm:min-h-[72px] items-center justify-between gap-2 sm:gap-3">
          {/* sisi kiri: tombol mobile drawer + logo growprize compact + navlinks */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                aria-label="Buka menu game"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-white/95 text-[#12303c] shadow-[2px_3px_0_#000000] border-2 border-[#03afef] transition-colors hover:bg-[#d9f8ff] cursor-pointer lg:hidden"
              >
                <MenuGlyph className="w-5 h-5" />
              </button>
            )}

            {/* logo compact yang selalu ada di dalam bilah tanah; disembunyikan di layar sangat sempit agar navigasi tetap utuh */}
            <button
              type="button"
              onClick={() => onTabChange?.('hub')}
              className="hidden cursor-pointer shrink-0 focus:outline-none min-[360px]:block"
              title="Kembali ke beranda minigame"
            >
              <img
                src="/intro/growprize_logo.png"
                alt="Growprize"
                className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95 sm:h-11"
                draggable={false}
              />
            </button>

            {/* navlinks utama di dalam tanah, hanya tampil di desktop karena mobile memakai drawer sidebar */}
            <nav aria-label="Menu navigasi utama" className="hidden lg:flex items-center gap-3.5 py-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                const showBadge = item.id === 'inventory' && inventoryCount > 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange?.(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`cursor-pointer relative whitespace-nowrap font-display text-xs sm:text-sm lg:text-base font-bold tracking-wider uppercase transition-transform hover:-translate-y-0.5 text-shadow-gt ${
                      isActive
                        ? 'text-[#fde047] underline decoration-2 underline-offset-4'
                        : 'text-white hover:text-[#fde047]'
                    }`}
                  >
                    {item.label}
                    {showBadge && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-[#43b427] px-1.5 py-0.2 text-[10px] font-bold text-white shadow-[1px_1.5px_0_#000]">
                        {inventoryCount > 99 ? '99+' : inventoryCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* sisi kanan: balance pill, notification bell, dan profile menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <BalancePill balance={balance} onOpenTutorial={onOpenTutorial} />
            <NotificationBell notifications={bellNotifications} />
            <ProfileMenu
              growId={player.growId}
              isGuest={isGuest}
              onLogin={() => onLogin?.()}
            />
          </div>
        </div>
      </header>
    </>
  );
}
