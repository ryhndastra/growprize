import type { ComponentType } from 'react';
import {
  ArrowLeftGlyph,
  BagGlyph,
  BoltGlyph,
  CheckGlyph,
  FlameGlyph,
  GachaGlyph,
  GamepadGlyph,
  HomeGlyph,
  LockGlyph,
  MysteryBoxGlyph,
  ScratchCardGlyph,
  SearchGlyph,
  StatusDotGlyph,
  SwapGlyph,
  WheelGlyph,
} from './glyphs';

export type GlyphKey =
  | 'home'
  | 'gamepad'
  | 'wheel'
  | 'scratch'
  | 'mystery'
  | 'gacha'
  | 'swap'
  | 'back'
  | 'search'
  | 'flame'
  | 'bag'
  | 'bolt'
  | 'check'
  | 'lock'
  | 'status';

interface GlyphComponentProps {
  className?: string;
}

// peta key stabil ke komponen svg supaya data katalog tidak menyimpan jsx.
export const GLYPH_REGISTRY: Record<GlyphKey, ComponentType<GlyphComponentProps>> = {
  home: HomeGlyph,
  gamepad: GamepadGlyph,
  wheel: WheelGlyph,
  scratch: ScratchCardGlyph,
  mystery: MysteryBoxGlyph,
  gacha: GachaGlyph,
  swap: SwapGlyph,
  back: ArrowLeftGlyph,
  search: SearchGlyph,
  flame: FlameGlyph,
  bag: BagGlyph,
  bolt: BoltGlyph,
  check: CheckGlyph,
  lock: LockGlyph,
  status: StatusDotGlyph,
};

export function resolveGlyph(key: string): ComponentType<GlyphComponentProps> {
  return GLYPH_REGISTRY[key as GlyphKey] ?? GLYPH_REGISTRY.home;
}
