# growprize

web store bergaya growtopia untuk eclipse ps. berisi intro sinematik, login growid, katalog enam minigame, gacha roulette, lock exchange, dan tas item. seluruh aset visual diambil dari tampilan resmi xsolla growtopia store agar terasa akrab bagi pemain.

## menjalankan

butuh node 24 atau lebih baru.

```
npm install
npm run dev
```

dev server jalan di vite dengan proxy `/api` menuju backend supaya cookie sesi tetap same-origin.

## skrip

- `npm run dev` jalankan dev server.
- `npm run build` type-check lalu bundel produksi ke `dist`.
- `npm run preview` pratinjau hasil build.

## konfigurasi

salin `.env.example` menjadi `.env.local` lalu sesuaikan bila perlu.

- `VITE_API_BASE_URL` origin backend pada produksi. kosong berarti memakai proxy dev.
- `VITE_PROXY_TARGET` target proxy dev, default ke backend eclipse ps.

## struktur

```
src/
  components/
    auth/          form login growid dan komponen pendukungnya
    dashboard/     shell dashboard, header, sidebar, dan konteks saldo
      gacha/       arena gacha roulette
      games/       enam arena minigame beserta hook dan visualnya
      hub/         kartu katalog game
      exchange/    konversi world lock, diamond lock, blue gem lock
      inventory/   tas item koleksi pemain
      live/        daftar drop terbaru
  data/            katalog game dan item gacha
  lib/             klien api, auth, dan matematika game
  types/           tipe bersama
```

## catatan arsitektur

- satu katalog game di `src/data/games.ts` menjadi sumber tunggal untuk sidebar, header, dan beranda.
- setiap arena memisahkan logika ke custom hook dan visual ke komponen tersendiri supaya tidak menumpuk jadi satu berkas besar.
- semua transaksi saldo memotong lintas denominasi secara atomik dan menolak bila dana tidak cukup.
- hanya properti transform dan opacity yang dianimasikan, dengan fallback prefers-reduced-motion.
