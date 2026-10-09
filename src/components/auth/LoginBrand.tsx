// header bar bilah kayu berumput dan karakter growtopia resmi dari xsolla store untuk halaman login.
export function LoginBrand({ onBack }: { onBack?: () => void }) {
  return (
    <div className="relative mb-6 w-full">
      {/* baris atas: logo growprize di kiri dan deretan karakter + pohon palem + penyihir di kanan */}
      <div className="relative flex items-end justify-between px-2 pt-2">
        <img
          src="/intro/growprize_logo.png"
          alt="Growprize"
          className="h-14 sm:h-20 w-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] -mb-2 z-10"
          draggable={false}
        />
        <img
          src="/xsolla/header_characters.png"
          alt=""
          aria-hidden="true"
          className="hidden sm:block h-14 md:h-16 w-auto object-contain mr-6 -mb-1 z-10"
          draggable={false}
        />
      </div>

      {/* bilah kayu berumput resmi xsolla */}
      <div className="gt-wood-bar relative z-20 flex h-14 sm:h-16 w-full items-center justify-between px-5 sm:px-9 pt-2">
        <div className="flex items-center gap-4 sm:gap-6 text-white font-bold text-xs sm:text-base tracking-wider uppercase text-shadow-gt">
          <span>HOME</span>
          <span className="hidden sm:inline opacity-90">GACHA</span>
          <span className="hidden sm:inline opacity-90">EXCHANGE</span>
          <span className="hidden md:inline opacity-90">ECLIPSE PS</span>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="gt-btn-3d cursor-pointer px-4 py-1.5 text-xs sm:text-sm"
          >
            Mode Guest
          </button>
        )}
      </div>
    </div>
  );
}
