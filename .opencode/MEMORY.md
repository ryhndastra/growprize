# memory growprize

## arsitektur shell
- DashboardLayout membungkus DashboardProvider dan hanya menerima onReplayIntro + onRequireLogin dari App.tsx
- konteks dashboard menyediakan balance, inventory, isGuest, growId, world, requireLogin, activeTab, setActiveTab, broadcasts
- saldo backend read-only, bisa nol, jadi angka wajib lewat guard Number.isFinite

## token desain di index.css
- gt-panel, gt-panel-lite, gt-inset, gt-inset-lite, gt-card untuk bevel
- gt-sky-strip horizon, gt-sky-glow langit, gt-gold-rule garis emas
- text-shadow-gt-soft dan text-shadow-gt-strong untuk hierarki teks
- palet: teal gelap fondasi, emas aksen hemat satu titik fokus per blok

## aturan shell
- JANGAN ubah signature komponen, nama prop, atau kontrak context
- file auth, gacha, exchange, inventory, live di luar scope shell
- bahasa ui indonesia, tanpa emoji, komentar lowercase polos

## sumber acuan tema
- src/components/GrowtopiaWalkIntro.tsx adalah sumber acuan tema dan tidak boleh diubah (timestamp 6 okt 23:53, sha256 378486cb...). semua layar meniru atmosfer sky teal, panel bevel, rumput piksel, dan aksen emas dari file ini.
- DESIGN.md memuat arah desain: dial energy 2 / rhythm 2 / motion 2.

## login modular
- login dipecah ke src/components/auth/: useLoginForm (logic), LoginBackdrop, LoginBrand, LoginField, LoginNotice, LoginCloseButton, CloseGlyph, LoginPanel.
- kontrak api/auth (login, fetchMe, logout, ApiError) dan guard ApiError 401 tidak boleh berubah.
- LoginPage.tsx tetap entry tipis, path impor di App.tsx valid.

## konvensi motion
- hanya transform dan opacity dianimasikan. gunakan useReducedMotion untuk ui penting.
- loop selamanya hanya untuk ornamen dekoratif (awan) dan mengandalkan blok reduced-motion global.
- easing: spring atau cubic-bezier [0.22, 1, 0.36, 1]. hindari ease-in-out default.

## konvensi angka
- semua nilai saldo dan kalkulasi harga/item wajib lewat guard anti-NaN (Number.isFinite / safeAmount). jangan biarkan NaN merambat ke saldo.

## status shell terbaru (hermes, 9 okt 2026)
- proyek bukan repo git. verifikasi berkas memakai ls -la dan mtime.
- shell dashboard kini: dirt band full bleed sticky, latar foto langit 4d7584048f350473e2c3f2904c9172b3.jpg, logo di dalam dirt, saldo tunggal BalancePill plus tombol plus ke tab tutorial, ProfileMenu plus NotificationBell di kanan, sidebar game DashboardSidebar menggantikan baris tab kartu, konten full width.
- sepuluh berkas baru: BalancePill, DashboardSidebar, ProfileMenu, NotificationBell, TopUpTutorial, glyphs, navigation, motionPresets, useAnimatedNumber, RevealOnce.
- NavigationTabs.tsx dan WalletBalanceBar.tsx sudah dihapus.

## gelombang 6 game modular (hermes, 9 okt 2026)
- navbar tanpa game: DashboardHeader hanya menampilkan beranda, exchange, inventory, jackpot. seluruh minigame hidup di sidebar dan beranda.
- katalog 6 game di src/data/games.ts: gacha, mystery_box, diamond_dice, gem_rain, lucky_wheel, treasure_hunt. 3x2 grid seragam.
- kartu game dipecah ke src/components/dashboard/hub/GameCard.tsx dengan tipe GameCardData; GameHub menyuplai ALL_GAMES berisi judul, badge, biaya, imageSrc, tagline.
- arena baru: LuckyWheelArena + useLuckyWheel + AnimatedWheelVisual; TreasureHuntArena + useTreasureHunt + AnimatedTreasureGrid.
- arena lama juga dipecah: DiamondDiceArena + useDiceGame + AnimatedDiceVisual (dadu pip 1-6 dua buah, total 1-100); MysteryBoxArena + useMysteryBox + AnimatedChestVisual; GemRainArena + useGemRain.
- chrome bersama: games/components/ArenaChrome.tsx menyediakan ArenaHeader, ArenaStatBar, ArenaHistory.
- ekonomi atomik: semua biaya masuk arena memakai spendWls dari DashboardContext (potong lintas denominasi dalam satu transaksi), bukan deductLocks tunggal.

## catatan tugas sho (untuk makoto, jangan lupa lagi)
- [ ] verifikasi klik-through manual 6 arena di browser oleh sho (intro, login, gacha, mystery box, dice, gem rain, lucky wheel, treasure hunt, exchange, inventory, tutorial).
- [ ] keputusan wording label beranda dan sidebar bila sho ingin mengganti teks.
- [ ] keputusan apakah arena baru (lucky wheel, treasure hunt) perlu leaderboard tersendiri.

## verifikasi nyata (hermes, 9 okt 2026)
- node dari nix store nodejs 24.19.0 karena node tidak ada di PATH.
- tsc --noEmit exit 0. vite build exit 0: 5009 modul, js 471.42 kB (471415 byte, gzip 143.76 kB), css 64.00 kB (63999 byte, gzip 11.18 kB), index.html 0.94 kB.
- vite preview port 4173: index 200, js & css 200 dengan ukuran identik dist, aset logo 200, server dimatikan bersih.
- GrowtopiaWalkIntro.tsx utuh, sha256 378486cb9a8db3814516198381f63bae5166de41d3ef5277c1c3b2136f747629, mtime tetap 2026-10-06, tidak disentuh.
- grep anti-slop bersih: emoji 0, em dash 0, gradient ungu-biru 0. ungu di GachaSprites/gachaItems sah sebagai glowColor per item.
- semua angka sudah diverifikasi ke disk, zero hallucination.
