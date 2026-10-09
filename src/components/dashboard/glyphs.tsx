interface GlyphProps {
  className?: string;
}

// glyph plus untuk aksi isi saldo.
export function PlusGlyph({ className = 'w-4 h-4' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 5 V19 M5 12 H19" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

// glyph lonceng untuk panel notifikasi.
export function BellGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 9.5 A6 6 0 0 1 18 9.5 C18 14 19.5 16 19.5 16 H4.5 C4.5 16 6 14 6 9.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.5 C10.4 20 11.1 21 12 21 C12.9 21 13.6 20 14 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M12 4 V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// glyph panah tutup panel menu.
export function ChevronGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M7 10 L12 15 L17 10"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// glyph daftar untuk tombol buka menu di mobile.
export function MenuGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 7 H20 M4 12 H20 M4 17 H20"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// glyph silang untuk menutup panel atau drawer.
export function CloseGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 6 L18 18 M18 6 L6 18"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// glyph atap rumah untuk navigasi beranda katalog game.
export function HomeGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 11 L12 4 L20 11 M6 11 V20 H18 V11 M10 20 V15 H14 V20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// glyph stik game untuk label menu game.
export function GamepadGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M7 8 H17 A4 4 0 0 1 21 12 A4 4 0 0 1 17 17 C15 17 14 16 12 16 C10 16 9 17 7 17 A4 4 0 0 1 3 12 A4 4 0 0 1 7 8 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 11 V15 M7 13 H11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15.5 12 h.01 M17.5 14 h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

// glyph roda putar dengan delapan jari dan poros tengah.
export function WheelGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M12 3 V21 M3 12 H21 M5.6 5.6 L18.4 18.4 M18.4 5.6 L5.6 18.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// glyph kartu gosok dengan sudut terkelupas.
export function ScratchCardGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <path d="M6 10 L12 10 M6 13 L10 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17 6 L17 9 M14 6 L14 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// glyph peti misteri dengan tutup melengkung dan kunci tengah.
export function MysteryBoxGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 10 A8 5 0 0 1 20 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 10 H20 V19 H4 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M11 13 H13 V16 H11 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 10 V19 M16 10 V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// glyph mesin kapsul gacha dengan jendela dan corong bawah.
export function GachaGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 4 H18 V18 H6 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M10 18 L9 21 H15 L14 18" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="7.5" cy="15" r="1.2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// glyph panah kiri untuk kembali ke beranda.
export function ArrowLeftGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M19 12 H5 M11 6 L5 12 L11 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// glyph kaca pembesar untuk tombol inspeksi hadiah.
export function SearchGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M16 16 L21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// glyph api untuk penanda aktivitas populer dan papan pemenang.
export function FlameGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3 C13.5 6 16 7.5 16 11 A4 4 0 0 1 8 11 C8 9.5 9 8.5 9.5 7.5 C10.5 9 11.5 9 11.5 7.5 C11.5 6 11.7 4.5 12 3 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21 A5 5 0 0 0 17 16 C17 14 16 12.5 15 11.5 A3.5 3.5 0 0 1 7 16 A5 5 0 0 0 12 21 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// glyph petir untuk penanda layanan instan.
export function BoltGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M13.5 3 L6 13 H11 L10.5 21 L18 11 H13 L13.5 3 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// glyph centang untuk daftar keunggulan.
export function CheckGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 12.5 L10 17.5 L19 6.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// glyph gembok untuk status terkunci untuk tamu.
export function LockGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 10 V7 A4 4 0 0 1 16 7 V10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 14 V16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// glyph titik status untuk penanda online, selalu dipasangkan teks.
export function StatusDotGlyph({ className = 'w-5 h-5' }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5.5" fill="currentColor" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

// glyph langkah tutorial: nomor bulat terkunci tanpa emoji.
export function StepNumberGlyph({ step, className = 'w-9 h-9' }: GlyphProps & { step: number }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <circle cx="18" cy="18" r="16" fill="#43b427" stroke="#000000" strokeWidth="2" />
      <text
        x="18"
        y="24"
        textAnchor="middle"
        fontFamily="'Luckiest Guy', 'Outfit', sans-serif"
        fontSize="17"
        fill="#ffffff"
      >
        {step}
      </text>
    </svg>
  );
}
