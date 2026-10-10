import { useTopUpForm } from './useTopUpForm';
import { useDashboard } from './DashboardContext';
import { formatLocks } from '../../lib/lockCurrency';

interface TopUpFormProps {
  onToppedUp: (newBalance: number, message: string) => void;
}

// form isi saldo yang memanggil POST /topup ke backend.
// nominal dalam satuan lock (100 WL = 1 DL, 100 DL = 1 BGL).
export function TopUpForm({ onToppedUp }: TopUpFormProps) {
  const { isGuest, requireLogin } = useDashboard();
  const { amount, setAmount, error, success, submitting, presets, pickPreset, submit } =
    useTopUpForm(onToppedUp);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isGuest) {
      requireLogin('Log in GrowID untuk mengisi saldo akunmu.');
      return;
    }
    submit(e);
  };

  return (
    <div className="gt-white-card p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-100 pb-5">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Isi Saldo Lock
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/75 sm:text-base">
            Masukkan jumlah lock yang ingin diisi (100 WL = 1 DL, 100 DL = 1 BGL). Saldo akan langsung bertambah ke akun GrowID kamu.
          </p>
          {isGuest && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-[6px] bg-[#d9f8ff] px-3.5 py-1.5 text-xs font-bold text-black border border-sky-300">
              <img src="https://grow-item-icon.vercel.app/api/icon?id=242&size=128" alt="" className="w-4 h-4 object-contain shrink-0" />
              <span>
                Kamu melihat sebagai Guest.{' '}
                <button
                  type="button"
                  onClick={() => requireLogin('Log in GrowID untuk mengisi saldo akunmu.')}
                  className="underline decoration-2 underline-offset-2 text-[#0284c7] hover:text-black cursor-pointer font-bold"
                >
                  Login GrowID
                </button>{' '}
                untuk mulai isi saldo.
              </span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const lock = formatLocks(preset);
            const isSelected = Number.parseFloat(amount) === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => pickPreset(preset)}
                disabled={submitting}
                className={`min-h-11 cursor-pointer rounded-[6px] px-3.5 py-2 text-xs sm:text-sm font-bold shadow-[2px_3px_0_#03afef] transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#03afef] text-white'
                    : 'bg-[#d9f8ff] text-black hover:bg-[#b5eefa]'
                }`}
              >
                <img src={lock.iconUrl} alt={lock.unit} className="w-4 h-4 object-contain" />
                <span>{lock.text}</span>
              </button>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="topup-amount"
              className="block text-xs font-bold uppercase tracking-wider text-black/80"
            >
              Jumlah Lock (WL)
            </label>
            {Number.parseFloat(amount) > 0 && (
              <span className="text-xs font-bold text-[#15803d] flex items-center gap-1">
                Estimasi: <img src={formatLocks(amount).iconUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                <span>{formatLocks(amount).text}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">
              <img
                src={formatLocks(amount || 1).iconUrl}
                alt=""
                className="w-5 h-5 object-contain"
              />
            </div>
            <input
              id="topup-amount"
              name="topup-amount"
              type="number"
              inputMode="decimal"
              min={0.1}
              max={10000}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 100 untuk 1 DL"
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={error ? 'topup-error' : undefined}
              spellCheck={false}
              className={`w-full rounded-[5px] bg-[#d9f8ff] px-4 py-3.5 pl-11 text-sm font-bold text-black tabular-nums placeholder:text-black/45 shadow-[inset_0_2px_4px_rgba(1,45,55,0.25)] outline-none transition-colors hover:bg-[#c6e3e9] focus:ring-2 focus:ring-[#03afef] sm:text-base ${
                error ? 'ring-2 ring-red-500' : ''
              }`}
            />
          </div>
        </div>

        {error ? (
          <div
            id="topup-error"
            role="alert"
            aria-live="assertive"
            className="rounded-[5px] border-2 border-red-500 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-800"
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            role="status"
            className="rounded-[5px] border-2 border-[#43b427] bg-[#eafbe5] px-3.5 py-2.5 text-xs font-bold text-[#1a5e0f]"
          >
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="gt-btn-3d mt-1 h-13 w-full cursor-pointer text-lg font-bold uppercase sm:text-xl"
        >
          {submitting ? 'MEMPROSES...' : 'TAMBAH SALDO'}
        </button>
      </form>
    </div>
  );
}
