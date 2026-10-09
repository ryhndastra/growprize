// latar langit dan pijakan rumput resmi dari xsolla growtopia store beserta matahari, tv, ayam, dan mobil.
export function LoginBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {/* latar langit biru cerah berulang dengan awan piksel dan bintang dari xsolla */}
      <div className="gt-world-bg absolute inset-0" />

      {/* matahari kuning khas growtopia di sudut kanan atas */}
      <img
        src="/xsolla/sun.png"
        alt=""
        className="absolute right-4 top-0 w-20 sm:right-12 sm:w-28 h-auto object-contain"
        draggable={false}
      />

      {/* pijakan tanah berumput resmi xsolla di bagian bawah beserta tv, ayam, dan mobil */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-28 sm:h-36 gt-footer-ground">
        <div className="relative mx-auto h-full max-w-5xl">
          <img
            src="/xsolla/tv_footer.png"
            alt=""
            className="hidden sm:block absolute -top-20 left-4 w-24 h-auto object-contain"
            draggable={false}
          />
          <img
            src="/xsolla/chicken.png"
            alt=""
            className="hidden sm:block absolute -top-16 left-1/2 -translate-x-1/2 w-20 h-auto object-contain"
            draggable={false}
          />
          <img
            src="/xsolla/car.png"
            alt=""
            className="hidden sm:block absolute -top-16 right-0 w-56 h-auto object-contain"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
