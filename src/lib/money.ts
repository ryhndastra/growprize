// semua saldo dan harga di frontend memakai satuan usd murni, sesuai yang
// disimpan backend. helper ini satu-satunya jalur format dan pembulatan agar
// tidak ada tampilan saldo yang bercabang atau melenceng karena float.

// bulatkan ke sen utuh supaya penjumlahan berulang tidak menumpuk galat float.
export function roundUsd(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

// format usd dua desimal dengan prefix dolar, dipakai semua label saldo dan harga.
// nilai tidak valid jadi nol dan nilai negatif dijepit agar ui tidak pernah
// menampilkan saldo minus. mendukung input number maupun string.
export function formatUsd(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '$0.00';
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value));
  const safe = Number.isFinite(num) && num > 0 ? num : 0;
  return `$${safe.toFixed(2)}`;
}

// normalisasi saldo: nilai tidak valid jadi nol, nilai negatif dijepit ke nol.
// mendukung input number maupun string dari database (pg numeric).
export function normalizeUsd(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return roundUsd(parsed);
}

// worth item dari backend sudah dalam usd murni (mis. 0.05, 15). satu jalur ini
// dipakai semua pemetaan item agar nilai tidak pernah dibagi 100 di satu tempat
// dan dibiarkan mentah di tempat lain.
export function normalizeWorthUsd(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return roundUsd(parsed);
}
