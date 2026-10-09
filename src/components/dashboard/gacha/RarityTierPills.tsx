import { RarityTier } from '../../../types/dashboard';

export interface RarityStyle {
  label: string;
  pill: string;
  chip: string;
  card: string;
  glow: string;
  rate: string;
}

// konfigurasi warna badge rarity untuk permukaan kartu putih dan biru es xsolla.
export const RARITY_CONFIG: Record<RarityTier, RarityStyle & { bg: string; border: string; text: string }> = {
  mythic: {
    label: 'MYTHIC',
    pill: 'bg-[#f59e0b] text-white',
    chip: 'bg-[#f59e0b] text-white',
    card: 'bg-[#d9f8ff]',
    glow: 'shadow-[2px_3px_0px_0px_#000000]',
    rate: '< 1.5%',
    bg: 'bg-[#f59e0b]',
    border: 'border-black',
    text: 'text-white',
  },
  legendary: {
    label: 'LEGEND',
    pill: 'bg-[#e11d48] text-white',
    chip: 'bg-[#e11d48] text-white',
    card: 'bg-[#d9f8ff]',
    glow: 'shadow-[2px_3px_0px_0px_#000000]',
    rate: '~6%',
    bg: 'bg-[#e11d48]',
    border: 'border-black',
    text: 'text-white',
  },
  epic: {
    label: 'EPIC',
    pill: 'bg-[#9333ea] text-white',
    chip: 'bg-[#9333ea] text-white',
    card: 'bg-[#d9f8ff]',
    glow: 'shadow-[2px_3px_0px_0px_#000000]',
    rate: '~15%',
    bg: 'bg-[#9333ea]',
    border: 'border-black',
    text: 'text-white',
  },
  rare: {
    label: 'RARE',
    pill: 'bg-[#03afef] text-white',
    chip: 'bg-[#03afef] text-white',
    card: 'bg-[#d9f8ff]',
    glow: 'shadow-[2px_3px_0px_0px_#000000]',
    rate: '~30%',
    bg: 'bg-[#03afef]',
    border: 'border-black',
    text: 'text-white',
  },
  common: {
    label: 'COMMON',
    pill: 'bg-[#43b427] text-white',
    chip: 'bg-[#43b427] text-white',
    card: 'bg-[#d9f8ff]',
    glow: 'shadow-[2px_3px_0px_0px_#000000]',
    rate: '~45%',
    bg: 'bg-[#43b427]',
    border: 'border-black',
    text: 'text-white',
  },
};

interface RarityChipProps {
  rarity: RarityTier;
  withRate?: boolean;
  className?: string;
}

// badge rarity bergaya label xsolla dengan bayangan hitam tegas.
export function RarityChip({ rarity, withRate = false, className = '' }: RarityChipProps) {
  const conf = RARITY_CONFIG[rarity];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide shadow-[1.5px_2px_0px_0px_#000000] text-shadow-gt-soft ${conf.pill} ${className}`}
    >
      {conf.label}
      {withRate && <span className="opacity-90 text-[9px]">({conf.rate})</span>}
    </span>
  );
}

interface RarityTierPillsProps {
  compact?: boolean;
}

export function RarityTierPills({ compact = false }: RarityTierPillsProps) {
  const tiers: RarityTier[] = ['mythic', 'legendary', 'epic', 'rare', 'common'];

  return (
    <div
      className={`flex flex-wrap items-center gap-2 select-none ${compact ? 'py-0.5' : 'py-2'}`}
      aria-label="Legenda rarity dan drop rate"
    >
      {tiers.map((tier) => (
        <RarityChip key={tier} rarity={tier} withRate={!compact} />
      ))}
    </div>
  );
}
