import React from 'react';
import type { GachaSpriteKey } from '../../types/dashboard';

// growprize pixel item sprites
// Hand-built vector sprites inspired by classic Growtopia item silhouettes.
// Rendered with crisp 1px-safe shapes and thick dark outlines for that
// authentic pixel-game look. No emoji, fully self-contained.

const OUTLINE = '#0a1820';

interface SpriteProps {
  className?: string;
}

function SpriteFrame({
  children,
  className,
  glow,
}: {
  children: React.ReactNode;
  className: string;
  glow?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: glow ? `drop-shadow(0 0 5px ${glow})` : undefined }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Mythic: telekinetic fist
export function RaymanFistSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#F59E0B">
      <path d="M6 14 C4 12 5 8 9 9 C10 6 15 6 17 9 C22 8 26 12 23 17 L18 24 C15 27 9 26 7 22 Z" fill="#FB923C" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 13 H20 M10 16 H20 M11 19 H18" stroke="#FED7AA" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="3" y="13" width="6" height="5" rx="2" fill="#F97316" stroke={OUTLINE} strokeWidth="1.6" />
      <path d="M24 8 L26 4 L28 9" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SpriteFrame>
  );
}

// Mythic: magnetic harvester
export function MagplantSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#38BDF8">
      <rect x="9" y="4" width="14" height="24" rx="3" fill="#94A3B8" stroke={OUTLINE} strokeWidth="2" />
      <rect x="11" y="7" width="10" height="7" rx="1.5" fill="#0f172a" />
      <circle cx="16" cy="10.5" r="2.2" fill="#38BDF8" stroke={OUTLINE} strokeWidth="1" />
      <rect x="11" y="17" width="10" height="3" rx="1" fill="#334155" />
      <rect x="11" y="22" width="10" height="3" rx="1" fill="#334155" />
      <path d="M6 8 H9 M6 16 H9 M6 24 H9" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 8 H26 M23 16 H26 M23 24 H26" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// Mythic: sacred ankh relic
export function GoldenAnkhSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#FACC15">
      <path d="M16 4 L16 27" stroke={OUTLINE} strokeWidth="6" strokeLinecap="round" />
      <path d="M16 4 L16 27" stroke="#FACC15" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M16 15 L9 15 L9 27" stroke={OUTLINE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 15 L9 15 L9 27" stroke="#FACC15" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx="16" cy="9" rx="6" ry="5" fill="none" stroke={OUTLINE} strokeWidth="6" />
      <ellipse cx="16" cy="9" rx="6" ry="5" fill="none" stroke="#FDE047" strokeWidth="3.2" />
    </SpriteFrame>
  );
}

// Legendary: flaming feathered wings
export function PhoenixWingsSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#EF4444">
      <path d="M16 16 C10 8 4 10 3 16 C6 15 8 17 8 19 C11 17 13 18 16 20 C19 18 21 17 24 19 C24 17 26 15 29 16 C28 10 22 8 16 16 Z" fill="#EF4444" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 16 C13 21 11 24 12 28 C14 24 15 21 16 19 C17 21 18 24 20 28 C21 24 19 21 16 16 Z" fill="#F97316" stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 14 C10 14 13 16 16 19 M26 14 C22 14 19 16 16 19" stroke="#FDE047" strokeWidth="1.4" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// Legendary: crystalline dragon
export function DiamondDragonSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#06B6D4">
      <path d="M16 3 L27 12 L23 27 H9 L5 12 Z" fill="#22D3EE" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 3 L20 12 L16 27 L12 12 Z" fill="#A5F3FC" opacity="0.85" />
      <path d="M5 12 H27" stroke="#0e7490" strokeWidth="1.4" />
      <circle cx="12.5" cy="9" r="1.4" fill={OUTLINE} />
      <circle cx="19.5" cy="9" r="1.4" fill={OUTLINE} />
      <path d="M12 15 L16 18 L20 15" stroke="#0e7490" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </SpriteFrame>
  );
}

// Legendary: renaissance glider wings
export function DaVinciWingsSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#EA580C">
      <path d="M16 12 C11 6 5 8 4 13 C3 18 7 22 12 20 M16 12 C21 6 27 8 28 13 C29 18 25 22 20 20" fill="#FDE68A" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 12 L16 24" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <path d="M6 12 L12 13 M5 16 L12 16 M8 20 L13 18 M26 12 L20 13 M27 16 L20 16 M24 20 L19 18" stroke="#B45309" strokeWidth="1.4" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// Epic: shimmering gown
export function DiamondGownSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#A855F7">
      <path d="M12 4 L20 4 L22 10 L24 27 H8 L10 10 Z" fill="#A855F7" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 4 C13 7 19 7 20 4" stroke="#F5D0FE" strokeWidth="1.6" fill="none" />
      <path d="M12 12 L20 12 M11 17 L21 17 M10.5 22 L21.5 22" stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M16 6 L18 10 L16 14 L14 10 Z" fill="#F0ABFC" stroke={OUTLINE} strokeWidth="0.8" />
    </SpriteFrame>
  );
}

// Epic: focused eyes
export function FocusedEyesSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#8B5CF6">
      <ellipse cx="10" cy="16" rx="6" ry="7" fill="#FFFFFF" stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="22" cy="16" rx="6" ry="7" fill="#FFFFFF" stroke={OUTLINE} strokeWidth="2" />
      <circle cx="11" cy="16" r="3" fill="#7C3AED" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="23" cy="16" r="3" fill="#7C3AED" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="12" cy="14.5" r="1" fill="#FFFFFF" />
      <circle cx="24" cy="14.5" r="1" fill="#FFFFFF" />
      <path d="M4 9 L9 11 M28 9 L23 11" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// Epic: golden apple
export function GoldenAppleSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#EAB308">
      <path d="M16 8 C11 3 4 6 4 15 C4 23 10 29 16 27 C22 29 28 23 28 15 C28 6 21 3 16 8 Z" fill="#FACC15" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 8 C15 5 16 3 19 2" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M18 4 C20 2 24 3 23 6 C22 8 19 8 18 4 Z" fill="#4ade80" stroke={OUTLINE} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 12 C8 15 8 19 11 21" stroke="#FEF9C3" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </SpriteFrame>
  );
}

// Rare: neon plasma saber
export function NeonSaberSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#3B82F6">
      <path d="M6 26 L22 6 L28 10 L11 29 Z" fill="#60A5FA" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 24 L22 9" stroke="#DBEAFE" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M4 25 L9 30" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      <path d="M3 22 L10 29" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// Rare: crimson bat wings
export function DevilWingsSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#B91C1C">
      <path d="M16 13 C10 5 3 8 3 14 L7 13 L6 17 L10 15 L9 19 L13 16 C14 14 15 14 16 13 C17 14 18 14 19 16 L23 19 L22 15 L26 17 L25 13 L29 14 C29 8 22 5 16 13 Z" fill="#B91C1C" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 13 L16 27" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// Common: bundle of world locks
export function WorldLockBundleSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#10B981">
      <rect x="7" y="13" width="10" height="10" rx="2" fill="#F59E0B" stroke={OUTLINE} strokeWidth="1.8" />
      <path d="M9 13 V10 C9 7.8 10.3 6.5 12 6.5 C13.7 6.5 15 7.8 15 10 V13" stroke={OUTLINE} strokeWidth="2.4" fill="none" />
      <path d="M12 15 L14 17 L12 19 L10 17 Z" fill="#22C55E" stroke="#052e16" strokeWidth="0.8" />
      <rect x="15" y="9" width="11" height="11" rx="2" fill="#FCD34D" stroke={OUTLINE} strokeWidth="1.8" />
      <path d="M17.5 9 V6.5 C17.5 4.6 18.7 3.5 20.5 3.5 C22.3 3.5 23.5 4.6 23.5 6.5 V9" stroke={OUTLINE} strokeWidth="2.4" fill="none" />
      <path d="M20.5 11.5 L22.5 13.5 L20.5 15.5 L18.5 13.5 Z" fill="#22C55E" stroke="#052e16" strokeWidth="0.8" />
    </SpriteFrame>
  );
}

// Common: heavy sack of red gems
export function GemSackSprite({ className = 'w-8 h-8' }: SpriteProps) {
  return (
    <SpriteFrame className={className} glow="#059669">
      <path d="M10 12 C6 15 5 21 8 26 H24 C27 21 26 15 22 12 Z" fill="#B45309" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 12 C12 8 20 8 20 12" stroke={OUTLINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M11 12 H21" stroke="#78350F" strokeWidth="2" />
      <polygon points="12,17 14.5,19 12,21 9.5,19" fill="#EF4444" stroke="#7f1d1d" strokeWidth="0.8" />
      <polygon points="18,16 20.5,18 18,20 15.5,18" fill="#DC2626" stroke="#7f1d1d" strokeWidth="0.8" />
      <polygon points="16,21 18,22.5 16,24 14,22.5" fill="#F87171" stroke="#7f1d1d" strokeWidth="0.8" />
    </SpriteFrame>
  );
}

// sprite registry
const SPRITE_MAP: Record<GachaSpriteKey, (props: SpriteProps) => React.ReactElement> = {
  rayman: RaymanFistSprite,
  magplant: MagplantSprite,
  ankh: GoldenAnkhSprite,
  phoenix: PhoenixWingsSprite,
  dragon: DiamondDragonSprite,
  davinci: DaVinciWingsSprite,
  gown: DiamondGownSprite,
  eyes: FocusedEyesSprite,
  apple: GoldenAppleSprite,
  saber: NeonSaberSprite,
  devilWings: DevilWingsSprite,
  wlsBundle: WorldLockBundleSprite,
  gemSack: GemSackSprite,
};

/** Renders the vector sprite matching a GachaItem.icon key. */
export function ItemSprite({
  sprite,
  className = 'w-8 h-8',
}: {
  sprite: GachaSpriteKey;
  className?: string;
}) {
  const Sprite = SPRITE_MAP[sprite] ?? GemSackSprite;
  return <Sprite className={className} />;
}
