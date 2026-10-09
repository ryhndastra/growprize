import { useTopUpForm } from './useTopUpForm';
import { useDashboard } from './DashboardContext';

interface TopUpFormProps {
  onToppedUp: (newBalance: number, message: string) => void;
}

// form isi saldo yang memanggil POST /topup ke backend.
// nominal dalam dolar, mengikuti kontrak backend (min 0.10, maks 10000).
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
            Isi Saldo
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/75 sm:text-base">
            Masukkan nominal dalam dolar ($). Saldo akan ditambahkan ke akun GrowID kamu secara langsung via backend.
          </p>
          {isGuest && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-[6px] bg-[#d9f8ff] px-3.5 py-1.5 text-xs font-bold text-black border border-sky-300">
              <img src="/xsolla/items/world_lock.png" alt="" className="w-4 h-4 object-contain shrink-0" />
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
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => pickPreset(preset)}
              disabled={submitting}
              className={`min-h-11 cursor-pointer rounded-[6px] px-4 text-sm font-bold shadow-[2px_3px_0_#03afef] transition-colors ${
                Number.parseFloat(amount) === preset
                  ? 'bg-[#03afef] text-white'
                  : 'bg-[#d9f8ff] text-black hover:bg-[#b5eefa]'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor="topup-amount"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/80"
          >
            Nominal (USD)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-black/50">
              $
            </span>
            <input
              id="topup-amount"
              name="topup-amount"
              type="number"
              inputMode="decimal"
              min={0.1}
              max={10000}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={error ? 'topup-error' : undefined}
              spellCheck={false}
              className={`w-full rounded-[5px] bg-[#d9f8ff] px-4 py-3.5 pl-9 text-sm font-bold text-black tabular-nums placeholder:text-black/45 shadow-[inset_0_2px_4px_rgba(1,45,55,0.25)] outline-none transition-colors hover:bg-[#c6e3e9] focus:ring-2 focus:ring-[#03afef] sm:text-base ${
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
