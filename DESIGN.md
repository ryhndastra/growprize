# growprize eclipse ps design direction

dokumen ini adalah kompas estetika proyek. semua keputusan visual baru wajib merujuk ke sini agar bahasa growtopia pixel tetap utuh di seluruh layar. bahasa ditulis polos dan langsung supaya bisa dibaca manusia, bukan robot.

## dial energi dan ritme

- energy 2: tenang namun hidup. tidak ada neon menyala, tidak ada gradien ungu-biru murahan. getaran khas growtopia datang dari bevel, bukan dari cahaya buatan.
- rhythm 2: jarak antar blok konsisten dan memberi ruang bernapas. panel boleh rapat, tapi antar section wajib lebih lega daripada antar elemen di dalam satu panel.
- motion 2: gerak hemat dan bermakna. hanya properti transform dan opacity yang dianimasikan. tidak ada animasi yang mengganggu baca atau menguras baterai.

## palet

base teal adalah tanah, gold adalah matahari yang jatuh di atasnya. inilah keseimbangan dua lobster yang saling menatap, bukan bertabrakan.

- teal gelap sebagai fondasi: world bg 0e2733, panel 12303c, panel lite 112d38, border khas 0a1820.
- langit bersih untuk welcome screen: 388cb8, 29749c, 1a5170.
- aksen emas untuk penekanan dan momen gacha: fde047, facc15, f59e0b. pakai hemat, satu titik fokus per blok.
- garis bevel tetap dua arah: highlight dari atas kiri dengan rgba 82 166 196, shadow dari bawah kanan dengan rgba 6 18 25. inilah nyawa tampilan growtopia.
- warna rarity dan ikon svg yang sudah ada dipertahankan apa adanya. tidak ada penambahan warna interaksi di luar palet ini.

## tipografi

- font display outfit untuk judul dan angka besar dengan bobot tebal.
- font pixel pixelify sans untuk label bergaya game.
- font silkscreen untuk teks kecil yang ingin terasa seperti papan skor.
- font mono num jetbrains mono untuk angka tabular seperti gem, harga, dan countdown.
- body plus jakarta sans untuk paragraf dan keterangan.
- ukuran teks judul tegas: hero jauh lebih besar daripada subjudul, subjudul jauh lebih besar daripada body. hindari tiga ukuran yang berdekatan karena terlihat ragu.
- ukuran baca nyaman untuk paragraf: lebar baris dijaga di kisaran 60 sampai 75 karakter agar mata tidak lelah menyeberang.

## komposisi

- utamakan grid asimetris dan bento, bukan tumpukan rata tengah yang membosankan.
- hindari penyakit kartu di dalam kartu di dalam kartu. satu panel satu inti pesan.
- bevel dalam memberi kedalaman tanpa bayangan berat. jangan tambah bayangan luar berlapis kecuali untuk memisahkan dari latar.
- whitespace adalah kemewahan. beri ruang lega di sekitar fokus, baik horizontal maupun vertikal.
- garis horizon langit kecil boleh dipakai sebagai pemisah lembut antara zona langit dan zona konten.
- setiap fokus visual harus jelas arah pandangnya. mata masuk dari satu titik, mengalir, lalu berhenti di aksi utama.

## ruang dan ritme

- gunakan langkah spasi konsisten mengikuti kelipatan 4 piksel. jangan campur langkah acak.
- jarak antar section lebih besar daripada jarak antar elemen dalam section agar hierarki terasa.
- sudut radius mengikuti panel yang ada: 0.9rem untuk panel utama, 0.75rem untuk panel lite. jangan bikin sudut baru yang bertentangan.

## status dan kontras

- setiap elemen interaktif wajib punya keadaan hover, focus-visible, active, disabled, loading, empty, dan error sebelum diserahkan ke divisi frontend.
- teks wajib lolos rasio kontras wcag aa untuk ukuran normal dan aaa untuk teks besar bila memungkinkan. teks putih di atas teal gelap aman, teks emas hanya di atas latar gelap.
- jangan mengandalkan warna saja untuk menyampaikan status. sertakan bentuk, ikon svg, atau teks.

## gerak

- hanya transform dan opacity yang dianimasikan untuk mencegah layout thrashing dan frame drop.
- animasi dekoratif dibuat hemat: float naik turun dan shimmer kilau garis, tidak lebih.
- selalu sediakan fallback prefers-reduced-motion. saat aktif, gerak berhenti tanpa merusak tata letak.

## larangan keras

- dilarang gradien ungu-biru neon khas ai generik.
- dilarang emoji. semua ikon wajib svg pixel di growtopiaassets.
- dilarang badge sampah yang tidak memberi informasi.
- dilarang padding sempit yang membuat panel terasa sesak.
- dilarang mengubah atau menghapus class lama seperti gt-panel, gt-panel-lite, gt-dot-grid, gt-world-bg, gt-sky-pattern, text-shadow-gt, text-shadow-gt-gold, dan custom-scrollbar. hanya boleh menambah.
