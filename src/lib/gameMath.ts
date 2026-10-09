export const WL_PER_DL = 100;

// pilih satu entri acak dengan bobot relatif ternormalisasi.
// bobot nan, infinity, atau negatif diperlakukan sebagai nol.
// fallback seragam dipakai bila total bobot tidak bisa dihitung.
export function pickWeighted<T extends { weight: number }>(entries: T[]): T | null {
  if (entries.length === 0) return null;
  if (entries.length === 1) return entries[0];

  let total = 0;
  for (const entry of entries) {
    if (Number.isFinite(entry.weight) && entry.weight > 0) total += entry.weight;
  }

  if (!Number.isFinite(total) || total <= 0) {
    const idx = Math.floor(Math.random() * entries.length);
    return entries[Math.min(idx, entries.length - 1)];
  }

  const rand = Math.random() * total;
  let cumulative = 0;
  for (const entry of entries) {
    const weight = Number.isFinite(entry.weight) && entry.weight > 0 ? entry.weight : 0;
    cumulative += weight;
    if (rand <= cumulative) return entry;
  }

  return entries[entries.length - 1];
}

// konversi nilai dalam dl ke satuan wl, selalu perkalian agar tidak pernah nan.
export function dlsToWls(valueInDls: number): number {
  if (!Number.isFinite(valueInDls) || valueInDls <= 0) return 0;
  return Math.round(valueInDls * WL_PER_DL);
}

// pecah nilai dl menjadi bagian dl bulat dan sisa wl, tanpa pembagian.
export function splitDlsAndWls(valueInDls: number): { dls: number; wls: number } {
  if (!Number.isFinite(valueInDls) || valueInDls <= 0) return { dls: 0, wls: 0 };
  const dls = Math.floor(valueInDls);
  const wls = Math.round((valueInDls - dls) * WL_PER_DL);
  return { dls, wls };
}
