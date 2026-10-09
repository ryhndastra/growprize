import { useCallback, useState, type FormEvent } from 'react';
import { useAuth } from '../../lib/auth';
import { ApiError } from '../../lib/api';

// memisahkan state dan pengiriman form dari presentasi supaya komponen ui tetap ringan.
// pesan error 401 disamarkan agar tidak membocorkan bagian mana yang salah.
export function useLoginForm(onLoggedIn: () => void) {
  const { login, apiConfigured } = useAuth();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (submitting) return;

      if (!identity.trim() || !password) {
        setError('Isi GrowID atau email dan password.');
        return;
      }

      setError(null);
      setSubmitting(true);
      try {
        await login(identity.trim(), password);
        onLoggedIn();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.status === 401
              ? 'GrowID, email, atau password salah.'
              : err.message
            : 'Terjadi kesalahan. Coba lagi.';
        setError(message);
      } finally {
        setSubmitting(false);
      }
    },
    [identity, login, onLoggedIn, password, submitting]
  );

  return {
    identity,
    setIdentity,
    password,
    setPassword,
    error,
    submitting,
    apiConfigured,
    submit,
  };
}
