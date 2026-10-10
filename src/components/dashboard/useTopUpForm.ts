import { useCallback, useState, type FormEvent } from 'react';
import { ApiError, topup } from '../../lib/api';

// batas yang sama dengan backend /topup agar pesan tidak pernah berbeda dari server.
const MIN_AMOUNT = 0.1;
const MAX_AMOUNT = 10000;

const PRESET_AMOUNTS = [10, 50, 100, 500, 1000, 10000];

export function useTopUpForm(onSuccess: (newBalance: number, message: string) => void) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickPreset = useCallback((value: number) => {
    setAmount(String(value));
    setError(null);
    setSuccess(null);
  }, []);

  const submit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (submitting) return;

      const parsed = Number.parseFloat(amount);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setError('Masukkan nominal top-up yang valid.');
        return;
      }
      if (parsed < MIN_AMOUNT) {
        setError(`Minimal top-up adalah $${MIN_AMOUNT.toFixed(2)}.`);
        return;
      }
      if (parsed > MAX_AMOUNT) {
        setError(`Maksimal top-up adalah $${MAX_AMOUNT.toLocaleString('en-US')}.`);
        return;
      }

      setError(null);
      setSuccess(null);
      setSubmitting(true);
      try {
        const res = await topup(parsed);
        setSuccess(res.message);
        setAmount('');
        onSuccess(res.balance, res.message);
      } catch (err) {
        let message = 'Gagal memproses top-up. Coba lagi.';
        if (err instanceof ApiError) {
          if (err.status === 401) {
            message = 'Sesi kamu berakhir. Silakan login lagi.';
          } else if (err.status === 403) {
            message = 'Akses ditolak. Coba lagi nanti.';
          } else if (err.status >= 500 || err.status === 0) {
            message = 'Server sedang sibuk. Coba lagi sebentar lagi.';
          } else {
            message = err.message;
          }
        }
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
    [amount, onSuccess, submitting]
  );

  return {
    amount,
    setAmount,
    error,
    success,
    submitting,
    presets: PRESET_AMOUNTS,
    pickPreset,
    submit,
  };
}
