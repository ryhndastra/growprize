import { lockIconUrl, type LockIconKind } from './growIcons';

export interface FormattedLock {
  value: string;
  unit: 'WL' | 'DL' | 'BGL';
  kind: LockIconKind;
  iconId: 242 | 1796 | 7188;
  iconUrl: string;
  totalWls: number;
  text: string;
}

/**
 * Format total WL ke satuan WL, DL, atau BGL:
 * - 100 WL = 1 DL
 * - 100 DL = 1 BGL (10,000 WL)
 * - Icon: 7188 (BGL), 1796 (DL), 242 (WL) dari https://grow-item-icon.vercel.app/api/icon?id=...&size=1920
 */
export function formatLocks(rawAmount: number | string | null | undefined): FormattedLock {
  const num = typeof rawAmount === 'number' ? rawAmount : Number.parseFloat(String(rawAmount ?? 0));
  const safe = Number.isFinite(num) && num > 0 ? num : 0;

  if (safe >= 10000) {
    const val = safe / 10000;
    const str = val % 1 === 0 ? val.toLocaleString('en-US') : val.toFixed(2);
    return {
      value: str,
      unit: 'BGL',
      kind: 'bgl',
      iconId: 7188,
      iconUrl: lockIconUrl('bgl', 1920),
      totalWls: safe,
      text: `${str} BGL`,
    };
  }

  if (safe >= 100) {
    const val = safe / 100;
    const str = val % 1 === 0 ? val.toLocaleString('en-US') : val.toFixed(2);
    return {
      value: str,
      unit: 'DL',
      kind: 'dl',
      iconId: 1796,
      iconUrl: lockIconUrl('dl', 1920),
      totalWls: safe,
      text: `${str} DL`,
    };
  }

  const str = safe % 1 === 0 ? safe.toLocaleString('en-US') : safe.toFixed(2);
  return {
    value: str,
    unit: 'WL',
    kind: 'wl',
    iconId: 242,
    iconUrl: lockIconUrl('wl', 1920),
    totalWls: safe,
    text: `${str} WL`,
  };
}

/**
 * Helper untuk format cepat nilai string misal "5.95 DL" atau "10 WL"
 */
export function formatLockText(rawAmount: number | string | null | undefined): string {
  return formatLocks(rawAmount).text;
}
