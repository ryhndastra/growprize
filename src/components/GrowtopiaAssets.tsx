import React from 'react';

// generic sized svg props
interface SizedIconProps {
  className?: string;
}

// arrow / conversion chevron
export function ArrowRightIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12 H18 M12.5 6.5 L19 12 L12.5 17.5"
        stroke="#0a1820"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12 H18 M12.5 6.5 L19 12 L12.5 17.5"
        stroke="#fde047"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// pixelitemaxis icon (chest / rarity)
export function ChestIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 10.5 A9 5 0 0 1 21 10.5 V12 H3 Z" fill="#B45309" stroke="#3b1802" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.8 10.6 A8 4.2 0 0 1 20.2 10.6 H3.8 Z" fill="#F59E0B" />
      <rect x="3" y="12" width="18" height="9" rx="1.6" fill="#F59E0B" stroke="#3b1802" strokeWidth="1.6" />
      <rect x="4.4" y="13.4" width="15.2" height="2.6" rx="0.6" fill="#FCD34D" opacity="0.85" />
      <rect x="10" y="10" width="4" height="8" rx="1" fill="#451a03" stroke="#3b1802" strokeWidth="1" />
      <circle cx="12" cy="14.5" r="1.1" fill="#FDE047" />
      <circle cx="6.4" cy="16.5" r="1" fill="#F87171" stroke="#7f1d1d" strokeWidth="0.6" />
      <circle cx="17.6" cy="16.5" r="1" fill="#F87171" stroke="#7f1d1d" strokeWidth="0.6" />
    </svg>
  );
}

// trophy / jackpot icon
export function TrophyIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 4 H17 V8.5 C17 11.5 14.9 13.5 12 13.5 C9.1 13.5 7 11.5 7 8.5 Z"
        fill="#F59E0B"
        stroke="#3b1802"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7 5.2 H4.2 C4.2 8 5.4 9.6 7.4 9.9" stroke="#FCD34D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M17 5.2 H19.8 C19.8 8 18.6 9.6 16.6 9.9" stroke="#FCD34D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <rect x="10.6" y="13.4" width="2.8" height="4" fill="#B45309" />
      <path d="M7.5 20.5 L12 17.5 L16.5 20.5 Z" fill="#78350F" stroke="#3b1802" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 7 L12 11 L15 7" stroke="#FEF3C7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
    </svg>
  );
}

// slot / gacha machine icon
export function SlotMachineIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="3" width="16" height="5" rx="1.5" fill="#52b3d1" stroke="#0a1820" strokeWidth="1.5" />
      <rect x="3" y="8" width="18" height="13" rx="2" fill="#2563eb" stroke="#0a1820" strokeWidth="1.6" />
      <rect x="5.2" y="10" width="13.6" height="6" rx="1.2" fill="#0c2447" />
      <rect x="6.5" y="11.2" width="3.4" height="3.6" rx="0.8" fill="#FDE047" />
      <rect x="10.3" y="11.2" width="3.4" height="3.6" rx="0.8" fill="#F87171" />
      <rect x="14.1" y="11.2" width="3.4" height="3.6" rx="0.8" fill="#4ade80" />
      <path d="M12 2 V0.5" stroke="#0a1820" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="0.6" r="1" fill="#ef4444" stroke="#0a1820" strokeWidth="0.6" />
      <rect x="7" y="17.6" width="10" height="1.8" rx="0.9" fill="#0a1820" opacity="0.6" />
    </svg>
  );
}

// backpack icon
export function BackpackIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 6 V5 C8 2.8 9.8 1 12 1 C14.2 1 16 2.8 16 5 V6"
        stroke="#0a1820"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="4.5" y="6" width="15" height="16" rx="3.5" fill="#2563eb" stroke="#0a1820" strokeWidth="1.8" />
      <rect x="6" y="9" width="12" height="4" rx="1.6" fill="#3b82f6" />
      <rect x="7.5" y="15.2" width="9" height="4.6" rx="1.4" fill="#0c2447" stroke="#0a1820" strokeWidth="1.2" />
      <rect x="10.6" y="16.4" width="2.8" height="1.6" rx="0.6" fill="#FDE047" />
    </svg>
  );
}

// lightning bolt
export function BoltIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 1.5 L5 13 H11 L10 22.5 L19 10.5 H12.6 Z"
        fill="#FDE047"
        stroke="#3b1802"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12.6 4.5 L7.5 12 H11.5 L10.8 18" stroke="#FEF9C3" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// announcement / megaphone
export function MegaphoneIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 10 H6 L14 4 V18 L6 12.5 H3 Z" fill="#FDE047" stroke="#78350F" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 12.5 L8.5 20 H11 L9 14" fill="#F59E0B" stroke="#78350F" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M16.5 7.5 C18.3 9.2 18.3 12.3 16.5 14" stroke="#FEF9C3" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M19 5.5 C21.8 8.2 21.8 14.3 19 17" stroke="#FDE047" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

// rocket / boost icon
export function RocketIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1.5 C15.5 4 17 8 17 12 L14.6 16 H9.4 L7 12 C7 8 8.5 4 12 1.5 Z"
        fill="#e2e8f0"
        stroke="#0a1820"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 12 L4 15.5 L8.5 15.5" fill="#52b3d1" stroke="#0a1820" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M17 12 L20 15.5 L15.5 15.5" fill="#52b3d1" stroke="#0a1820" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="8" r="2.3" fill="#38bdf8" stroke="#0a1820" strokeWidth="1.2" />
      <path d="M10 16 C10.5 19 11 20.5 12 22 C13 20.5 13.5 19 14 16 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// star / sparkle icon
export function StarIcon({ className = 'w-5 h-5' }: SizedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1.5 L14.7 8.6 L22.5 9.1 L16.5 14 L18.4 21.5 L12 17.2 L5.6 21.5 L7.5 14 L1.5 9.1 L9.3 8.6 Z"
        fill="#FDE047"
        stroke="#78350F"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// growtopia red gem icon
// Pixel-accurate iconic faceted red ruby currency from Growtopia
export function RedGemIcon({ className = 'w-5 h-5', count }: { className?: string; count?: string | number }) {
  return (
    <span className="inline-flex items-center gap-1.5 align-middle select-none">
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark outer outline */}
        <polygon
          points="6,2 18,2 23,9 12,23 1,9"
          fill="#3B0508"
          stroke="#1F0204"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Base dark red body */}
        <polygon points="6,3 18,3 22,9 12,22 2,9" fill="#991B1B" />
        {/* Upper facets */}
        <polygon points="6,3 18,3 15,8 9,8" fill="#EF4444" />
        <polygon points="6,3 9,8 2,9" fill="#DC2626" />
        <polygon points="18,3 22,9 15,8" fill="#B91C1C" />
        {/* Lower facets */}
        <polygon points="9,8 15,8 12,22" fill="#DC2626" />
        <polygon points="2,9 9,8 12,22" fill="#7F1D1D" />
        <polygon points="15,8 22,9 12,22" fill="#B91C1C" />
        {/* Specular White Highlights */}
        <polygon points="7,4 10,4 9,6 6.5,6" fill="#FFFFFF" opacity="0.9" />
        <polygon points="11,4 14,4 13,6 10.5,6" fill="#FCA5A5" opacity="0.8" />
        <circle cx="12" cy="11" r="1.2" fill="#FFFFFF" opacity="0.75" />
      </svg>
      {count !== undefined && (
        <span className="font-bold text-white tracking-wide text-shadow-gt tabular-nums">
          {typeof count === 'number' ? count.toLocaleString() : count}
        </span>
      )}
    </span>
  );
}

// world lock icon
export function WorldLockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shackle */}
      <path
        d="M 7 11 V 6 C 7 3.2 9.2 1 12 1 C 14.8 1 17 3.2 17 6 V 11"
        stroke="#271804"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M 7 11 V 6 C 7 3.2 9.2 1 12 1 C 14.8 1 17 3.2 17 6 V 11"
        stroke="#E2B128"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Body */}
      <rect x="4" y="9" width="16" height="13" rx="2.5" fill="#382103" />
      <rect x="5" y="10" width="14" height="11" rx="2" fill="#F59E0B" />
      <rect x="6" y="11" width="12" height="4" fill="#FCD34D" opacity="0.8" />
      {/* Green Emerald Gem in Center */}
      <polygon points="12,13 14.5,15.5 12,18 9.5,15.5" fill="#15803D" stroke="#052E16" strokeWidth="1" />
      <polygon points="12,13 13.5,15.5 12,17 10.5,15.5" fill="#22C55E" />
      <circle cx="12" cy="15.5" r="0.8" fill="#DCFCE7" />
    </svg>
  );
}

// diamond lock icon
export function DiamondLockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shackle */}
      <path
        d="M 7 11 V 6 C 7 3.2 9.2 1 12 1 C 14.8 1 17 3.2 17 6 V 11"
        stroke="#06222D"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M 7 11 V 6 C 7 3.2 9.2 1 12 1 C 14.8 1 17 3.2 17 6 V 11"
        stroke="#67E8F9"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Diamond Body */}
      <polygon points="12,8 20,15 12,23 4,15" fill="#082F49" />
      <polygon points="12,9 19,15 12,22 5,15" fill="#06B6D4" />
      <polygon points="12,9 15.5,15 12,21 8.5,15" fill="#22D3EE" />
      <polygon points="12,9 14,13 12,15 10,13" fill="#A5F3FC" />
      <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// blue gem lock icon (bgl)
export function BlueGemLockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shackle */}
      <path
        d="M 7 11 V 6 C 7 3.2 9.2 1 12 1 C 14.8 1 17 3.2 17 6 V 11"
        stroke="#05142b"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M 7 11 V 6 C 7 3.2 9.2 1 12 1 C 14.8 1 17 3.2 17 6 V 11"
        stroke="#38bdf8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Outer Body Outline */}
      <rect x="4" y="9" width="16" height="13" rx="2.5" fill="#081b38" stroke="#040e1e" strokeWidth="1" />
      {/* Sapphire Body */}
      <rect x="5" y="10" width="14" height="11" rx="2" fill="#1d4ed8" />
      <rect x="6" y="11" width="12" height="4" fill="#60a5fa" opacity="0.8" />
      {/* Glowing Diamond Core */}
      <polygon points="12,12 16,16 12,20 8,16" fill="#0284c7" stroke="#0c4a6e" strokeWidth="0.8" />
      <polygon points="12,12.5 15,16 12,19.5 9,16" fill="#38bdf8" />
      <circle cx="12" cy="16" r="1.2" fill="#e0f2fe" />
    </svg>
  );
}

// wrench icon
export function WrenchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 19 3 C 17 1 14 1 12 3 L 8 7 L 3 12 C 2 13 2 15 3 16 L 8 21 C 9 22 11 22 12 21 L 17 16 L 21 12 C 23 10 23 7 21 5 L 18 8 L 16 6 L 19 3 Z"
        fill="#1E293B"
      />
      <path
        d="M 18.5 3.5 C 16.8 1.8 14.2 1.8 12.5 3.5 L 8.5 7.5 L 3.5 12.5 C 2.8 13.2 2.8 14.8 3.5 15.5 L 8.5 20.5 C 9.2 21.2 10.8 21.2 11.5 20.5 L 16.5 15.5 L 20.5 11.5 C 22.2 9.8 22.2 7.2 20.5 5.5 L 17.5 8.5 L 15.5 6.5 L 18.5 3.5 Z"
        fill="#94A3B8"
      />
      <circle cx="7" cy="17" r="1.8" fill="#475569" />
    </svg>
  );
}

// official growtopia-style "growprize" logo
// Custom vector recreated in the exact visual style of the iconic Growtopia tree logo
export function GrowtopiaLogo({ className = 'w-full max-w-[460px]' }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 540 220"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Yellow Bubbly Letter Gradient */}
          <linearGradient id="gtYellowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9A6" />
            <stop offset="25%" stopColor="#FFE600" />
            <stop offset="70%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Green Tree Leaves Gradient */}
          <linearGradient id="gtTreeLeaves" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8AE92B" />
            <stop offset="30%" stopColor="#58C322" />
            <stop offset="75%" stopColor="#358B12" />
            <stop offset="100%" stopColor="#225E0B" />
          </linearGradient>

          {/* Tree Trunk Brown Gradient */}
          <linearGradient id="gtTrunkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9C5B23" />
            <stop offset="50%" stopColor="#783E12" />
            <stop offset="100%" stopColor="#4A2206" />
          </linearGradient>

          {/* Shiny Specular Edge Filter */}
          <filter id="gtDropShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="3" floodColor="#261404" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* ── THE GROWTOPIA TREE (Placed directly in the center) ── */}
        <g id="gtTree" filter="url(#gtDropShadow)">
          {/* Tree Trunk & Roots */}
          <path
            d="M 235 90 C 242 115 240 145 225 190 C 220 202 208 214 195 218 C 215 216 230 205 240 195 C 245 210 255 218 268 218 C 278 218 288 208 295 195 C 305 205 320 216 340 218 C 328 212 318 200 312 188 C 298 145 296 115 305 90 Z"
            fill="url(#gtTrunkGrad)"
            stroke="#2E1404"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Trunk Bark Lines */}
          <path
            d="M 252 135 C 250 160 258 185 264 200 M 282 135 C 284 160 278 185 272 200"
            stroke="#4A2206"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Lush Green Cloud Foliage */}
          {/* Outer Dark Outline / Shadow Layer */}
          <g stroke="#163D07" strokeWidth="6" strokeLinejoin="round">
            <circle cx="215" cy="58" r="42" fill="url(#gtTreeLeaves)" />
            <circle cx="270" cy="42" r="48" fill="url(#gtTreeLeaves)" />
            <circle cx="325" cy="58" r="42" fill="url(#gtTreeLeaves)" />
            <circle cx="270" cy="74" r="40" fill="url(#gtTreeLeaves)" />
          </g>

          {/* Inner Highlight Leaves (Fluffy Cloud Lobes) */}
          <circle cx="210" cy="48" r="22" fill="#A3F748" opacity="0.45" />
          <circle cx="265" cy="30" r="26" fill="#A3F748" opacity="0.5" />
          <circle cx="320" cy="48" r="22" fill="#A3F748" opacity="0.4" />
        </g>

        {/* ── BUBBLY LETTERS: "GROW" (Left Side) ── */}
        <g id="lettersGrow">
          {/* Deep 3D Shadow Extrusion (Dark Amber/Brown) */}
          <text
            x="24"
            y="172"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="#3B1E04"
            stroke="#3B1E04"
            strokeWidth="18"
            strokeLinejoin="round"
          >
            GROW
          </text>
          {/* Mid Shadow Line */}
          <text
            x="24"
            y="166"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="#78350F"
            stroke="#78350F"
            strokeWidth="12"
            strokeLinejoin="round"
          >
            GROW
          </text>
          {/* Main Vibrant Yellow Letter Faces */}
          <text
            x="24"
            y="162"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="url(#gtYellowGrad)"
            stroke="#5A2E05"
            strokeWidth="5"
            strokeLinejoin="round"
          >
            GROW
          </text>
          {/* Top Specular Shine */}
          <text
            x="24"
            y="159"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="20 40"
            strokeLinecap="round"
            opacity="0.85"
          >
            GROW
          </text>
        </g>

        {/* ── BUBBLY LETTERS: "PRIZE" (Right Side) ── */}
        <g id="lettersPrize">
          {/* Deep 3D Shadow Extrusion */}
          <text
            x="272"
            y="172"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="#3B1E04"
            stroke="#3B1E04"
            strokeWidth="18"
            strokeLinejoin="round"
          >
            PRIZE
          </text>
          {/* Mid Shadow Line */}
          <text
            x="272"
            y="166"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="#78350F"
            stroke="#78350F"
            strokeWidth="12"
            strokeLinejoin="round"
          >
            PRIZE
          </text>
          {/* Main Yellow Face */}
          <text
            x="272"
            y="162"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="url(#gtYellowGrad)"
            stroke="#5A2E05"
            strokeWidth="5"
            strokeLinejoin="round"
          >
            PRIZE
          </text>
          {/* Top Specular Shine */}
          <text
            x="272"
            y="159"
            fontFamily="'Outfit', 'Arial Rounded MT Bold', sans-serif"
            fontWeight="900"
            fontSize="106"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="20 40"
            strokeLinecap="round"
            opacity="0.85"
          >
            PRIZE
          </text>
        </g>

        {/* ── Little Leaf On The 'P' (Iconic GT Detail) ── */}
        <path
          d="M 288 78 C 304 68 318 72 322 84 C 314 92 298 90 288 78 Z"
          fill="#58C322"
          stroke="#1E520A"
          strokeWidth="3"
        />
        <path d="M 292 80 C 302 78 312 82 318 84" stroke="#8AE92B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// kontainer modal putih bersih bergaya xsolla growtopia store dengan bayangan offset biru tegas
export function GrowtopiaDialog({
  children,
  className = '',
  title,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClose?: () => void;
}) {
  return (
    <div
      className={`relative rounded-[10px] bg-white p-5 text-black shadow-[-8px_10px_0px_0px_#03afef] select-none ${className}`}
      style={{
        backgroundImage: 'url("/xsolla/card_glare.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center top',
      }}
    >
      {title && (
        <div className="relative mb-4 flex items-center justify-between border-b border-sky-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src="/xsolla/items/world_lock.png" alt="" className="w-6 h-6 object-contain" />
            <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-black">
              {title}
            </h2>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 active:scale-95 transition-transform"
              aria-label="Tutup"
            >
              <DialogCloseGlyph className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

// tombol aksi 3d bergaya xsolla growtopia store dengan bayangan offset hitam pekat
export function GrowtopiaButton({
  children,
  variant = 'green',
  onClick,
  className = '',
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: 'cyan' | 'grey' | 'green' | 'gold';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const variants = {
    green: 'bg-[#43b427] hover:bg-[#50d031] text-white',
    gold: 'bg-[#43b427] hover:bg-[#50d031] text-white',
    cyan: 'bg-[#03afef] hover:bg-[#1cc0ff] text-white',
    grey: 'bg-white hover:bg-[#f0f9ff] text-[#43b427] border border-black/15',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 font-bold text-sm sm:text-base tracking-wide rounded-[4px] shadow-[3px_4px_0px_0px_#000000] transition-all cursor-pointer select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_2px_0px_0px_#000000] disabled:opacity-50 disabled:cursor-not-allowed uppercase ${variants[variant]} ${className}`}
    >
      <span
        className={`flex items-center justify-center gap-2 ${
          variant === 'grey' ? 'font-bold' : 'text-shadow-gt font-bold'
        }`}
      >
        {children}
      </span>
    </button>
  );
}

// glyph silang untuk tombol tutup dialog
export function DialogCloseGlyph({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// kartu item bergaya xsolla growtopia store
export function GrowtopiaItemCard({
  title,
  gemPrice,
  children,
  badge,
  className = '',
  selected = false,
}: {
  title: string;
  gemPrice?: number | string;
  children: React.ReactNode;
  badge?: string;
  className?: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-[10px] bg-[#d9f8ff] p-3 text-black shadow-[-8px_10px_0px_0px_#03afef] select-none ${
        selected ? 'ring-3 ring-[#43b427]' : ''
      } ${className}`}
      style={{
        backgroundImage: 'url("/xsolla/card_glare.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center top',
      }}
    >
      <div className="flex items-center justify-between gap-1 pb-2">
        <span className="font-bold text-sm text-black truncate">{title}</span>
        {badge && (
          <span className="rounded bg-[#43b427] px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-[1.5px_2px_0_#000]">
            {badge}
          </span>
        )}
      </div>

      <div className="my-2 flex flex-1 items-center justify-center rounded-[8px] bg-[#b5eefa] p-3">
        {children}
      </div>

      {gemPrice !== undefined && (
        <div className="flex items-center justify-end pt-1">
          <RedGemIcon className="w-4 h-4" count={gemPrice} />
        </div>
      )}
    </div>
  );
}
