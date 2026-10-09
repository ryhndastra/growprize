import { StepNumberGlyph } from './glyphs';
import { TopUpForm } from './TopUpForm';
import { useDashboard } from './DashboardContext';
import { useAuth } from '../../lib/auth';

interface TopUpTutorialProps {
  onBack: () => void;
}

interface TutorialStep {
  title: string;
  body: string;
}

// langkah jujur: backend Growprize belum membuka gerbang pembayaran otomatis,
// jadi top up diarahkan ke admin Eclipse PS. tidak ada data palsu di sini.
const STEPS: TutorialStep[] = [
  {
    title: 'Catat GrowID kamu',
    body: 'Buka menu profil di kanan atas dan salin GrowID yang tertulis di sana. GrowID ini yang dipakai admin untuk menambahkan saldo ke akunmu, jadi pastikan tidak salah ketik.',
  },
  {
    title: 'Hubungi admin Eclipse PS',
    body: 'Kirim pesan ke admin server Eclipse PS melalui kanal resmi mereka dan sebutkan GrowID kamu beserta jumlah lock yang ingin diisi. Admin akan memberi tahu metode pembayaran yang berlaku saat itu.',
  },
  {
    title: 'Tunggu saldo masuk',
    body: 'Setelah pembayaran dikonfirmasi admin, saldo World Lock, Diamond Lock, dan Blue Gem Lock akan masuk ke akunmu. Nilai Balance di navbar akan ikut berubah setelah server memperbarui data.',
  },
  {
    title: 'Pakai saldo untuk main',
    body: 'Saldo yang sudah masuk bisa langsung dipakai untuk memutar Gacha Roulette, mengonversi lock di Lock Exchange, atau menyimpan hadiah di Tas Item.',
  },
];

// halaman isi saldo: form topup langsung ke backend, plus panduan bila perlu.
export function TopUpTutorial({ onBack }: TopUpTutorialProps) {
  const { balance, convertLocks } = useDashboard();
  const { refreshUser } = useAuth();

  return (
    <div className="w-full select-none">
      <TopUpForm
        onToppedUp={(newBalance) => {
          convertLocks({ ...balance, wls: newBalance });
          void refreshUser();
        }}
      />

      <div className="gt-white-card mt-6 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-100 pb-5">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Cara Isi Saldo
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/75 sm:text-base">
              Panduan langkah demi langkah menambah lock ke akunmu. Saldo ditambahkan langsung oleh admin Eclipse PS ke GrowID yang kamu daftarkan.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-[5px] bg-[#d9f8ff] px-4 text-sm font-bold text-black shadow-[2px_3px_0_#03afef] transition-colors hover:bg-[#b5eefa]"
          >
            Kembali ke Gacha
          </button>
        </div>

        <ol className="mt-6 flex flex-col gap-4">
          {STEPS.map((step, idx) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-[8px] bg-[#d9f8ff] p-4 sm:p-5"
            >
              <StepNumberGlyph step={idx + 1} className="mt-0.5 h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold text-black sm:text-xl">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-black/80">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="gt-white-card mt-6 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-black sm:text-xl">Yang perlu kamu tahu</h3>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-black/80">
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#43b427]" aria-hidden="true" />
            <span>Growprize belum punya gerbang pembayaran otomatis. Penambahan saldo selalu lewat admin server.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#43b427]" aria-hidden="true" />
            <span>Tidak ada biaya konversi antar lock. Rate resmi tetap 100 WL sama dengan 1 DL dan 100 DL sama dengan 1 BGL.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#43b427]" aria-hidden="true" />
            <span>Admin tidak pernah meminta kata sandi akunmu. Berikan hanya GrowID saat proses top up.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
