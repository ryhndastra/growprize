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
