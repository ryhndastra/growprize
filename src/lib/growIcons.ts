// sumber ikon item resmi growtopia lewat endpoint publik grow-item-icon.
// satu fungsi perakit url dipakai semua komponen agar format tidak bercabang.

const ICON_BASE = 'https://grow-item-icon.vercel.app/api/icon';

/**
 * rakit url ikon item growtopia berdasarkan id numerik item aslinya.
 * ukuran default 1920 agar tetap tajam di layar retina.
 */
export function growItemIconUrl(itemId: number | string, size = 1920): string {
  const id = Number(itemId);
  if (!Number.isFinite(id) || id <= 0) {
    return '';
  }
  return `${ICON_BASE}?id=${id}&size=${size}`;
}

/** id ikon growtopia untuk mata uang lock: bgl: 7188, dl: 1796, wl: 242. */
export const LOCK_ICON_IDS = {
  wl: 242,
  dl: 1796,
  bgl: 7188,
} as const;

export type LockIconKind = keyof typeof LOCK_ICON_IDS;

/** url ikon untuk salah satu mata uang lock (wl, dl, bgl) ukuran 1920. */
export function lockIconUrl(kind: LockIconKind, size = 1920): string {
  return growItemIconUrl(LOCK_ICON_IDS[kind], size);
}
