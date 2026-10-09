# session growprize gelombang 6 game modular

## ringkasan misi gelombang ini

permintaan sho lewat discord palace: hapus daftar game dari navbar (sisakan exchange dan utilitas), samakan semua kartu game jadi seragam, refactor agar tidak jadi god component (pisah custom hooks dan komponen kecil, tanpa prop drilling), tambah game baru sampai enam supaya grid 3x2, beri animasi nyata pada permainan seperti dadu dengan gambar dan geraknya, sertakan laporan daftar file yang diubah dan tugas makoto.

## done gelombang ini

setiap item di bawah sudah diverifikasi ke kode nyata di disk.

- [x] navbar tanpa game: DashboardHeader.tsx hanya memuat beranda, exchange, inventory, jackpot. seluruh minigame hidup di sidebar dan beranda.
- [x] katalog enam game: src/data/games.ts berisi gacha, mystery_box, diamond_dice, gem_rain, lucky_wheel, treasure_hunt. GAME_ITEMS di navigation.ts diturunkan langsung dari katalog, jadi sidebar dan header tidak pernah bercabang.
- [x] kartu seragam: src/components/dashboard/hub/GameCard.tsx satu badan kartu untuk semua game, tanpa varian unggulan, grid 1/2/3 kolom (3x2 di desktop) seragam.
- [x] arena baru lucky wheel: LuckyWheelArena.tsx + hooks/useLuckyWheel.ts + components/AnimatedWheelVisual.tsx. roda delapan segmen svg berputar dengan hadiah nyata.
- [x] arena baru treasure hunt: TreasureHuntArena.tsx + hooks/useTreasureHunt.ts + components/AnimatedTreasureGrid.tsx. sembilan petak, tiga kesempatan gali.
- [x] dadu beranimasi nyata: DiamondDiceArena.tsx + hooks/useDiceGame.ts + components/AnimatedDiceVisual.tsx. dua dadu dengan pip 1-6 berputar fisika, total 1-100.
- [x] mystery box modular: MysteryBoxArena.tsx + hooks/useMysteryBox.ts + components/AnimatedChestVisual.tsx.
- [x] gem rain modular: GemRainArena.tsx + hooks/useGemRain.ts.
- [x] chrome bersama: games/components/ArenaChrome.tsx menyediakan ArenaHeader, ArenaStatBar, ArenaHistory. tidak ada header arena yang ditulis ulang.
- [x] ekonomi atomik: useDiceGame, useMysteryBox, useLuckyWheel, useTreasureHunt, useGemRain memakai spendWls dari DashboardContext. potong lintas denominasi dalam satu transaksi, gagal bersih bila kurang.
- [x] routing lengkap: TabPanel di DashboardLayout.tsx merutekan keenam tab game ke arena nyata.

## laporan file gelombang ini

dibuat:
- src/components/dashboard/hub/GameCard.tsx
- src/components/dashboard/games/hooks/useDiceGame.ts
- src/components/dashboard/games/hooks/useMysteryBox.ts
- src/components/dashboard/games/hooks/useGemRain.ts
- src/components/dashboard/games/hooks/useLuckyWheel.ts
- src/components/dashboard/games/hooks/useTreasureHunt.ts
- src/components/dashboard/games/components/AnimatedDiceVisual.tsx
- src/components/dashboard/games/components/AnimatedChestVisual.tsx
- src/components/dashboard/games/components/AnimatedWheelVisual.tsx
- src/components/dashboard/games/components/AnimatedTreasureGrid.tsx
- src/components/dashboard/games/components/ArenaChrome.tsx
- src/components/dashboard/games/LuckyWheelArena.tsx
- src/components/dashboard/games/TreasureHuntArena.tsx

diubah:
- src/types/dashboard.ts (union DashboardTab + GameId ditambah lucky_wheel dan treasure_hunt)
- src/data/games.ts (katalog enam game)
- src/components/dashboard/navigation.ts (badge game baru)
- src/components/dashboard/DashboardHeader.tsx (navbar tanpa game)
- src/components/dashboard/DashboardLayout.tsx (rute arena baru)
- src/components/dashboard/DashboardSidebar.tsx (ikon wheel dan scratch)
- src/components/dashboard/glyphs.tsx (bersih dari glyph tak terpakai)
- src/components/dashboard/glyphRegistry.ts (bersih dari key compass tak terpakai)
- src/components/dashboard/GameHub.tsx (grid seragam enam kartu)
- src/components/dashboard/games/DiamondDiceArena.tsx (pakai hook dan visual baru)
- src/components/dashboard/games/MysteryBoxArena.tsx (pakai hook dan visual baru)
- src/components/dashboard/games/GemRainArena.tsx (pakai hook)
- src/components/dashboard/gacha/GachaArena.tsx

dihapus:
- src/components/dashboard/NavigationTabs.tsx dan WalletBalanceBar.tsx (warisan gelombang sebelumnya, sudah dikonfirmasi)
- folder src/components/dashboard/game (percobaan awal yang kalah oleh hub/GameCard.tsx)

## verifikasi nyata

semua angka di bawah dari eksekusi ulang di mesin ini, node 24.19.0 dari nix store karena node tidak ada di PATH. bukan tebakan.

- status repo: proyek ini bukan repo git. verifikasi berkas memakai ls -la dan mtime, bukan git diff.
- tsc -b: exit 0 tanpa error.
- vite build: exit 0, 5026 modul, built in 5.70s. dist/index.html 0.94 kB, dist css 88.62 kB (gzip 13.98 kB), dist js 599.36 kB (gzip 174.91 kB).
- audit emoji di seluruh src kecuali GrowtopiaWalkIntro.tsx: nol baris.
- enam arena terverifikasi ada di TabPanel: gacha, mystery_box, diamond_dice, gem_rain, lucky_wheel, treasure_hunt.

## pending

- [ ] verifikasi klik-through manual 6 arena di browser oleh sho.
- [ ] keputusan wording label dan kebutuhan leaderboard per arena baru bila sho ingin.

## next exact step

- sho jalankan dev server lalu cek keenam arena dan animasi dadu/roda/peti/grid.
- bila ada wording label yang ingin diubah, sunting teks di GameHub.tsx ALL_GAMES dan navigation.ts, tanpa menyentuh kode lain.
