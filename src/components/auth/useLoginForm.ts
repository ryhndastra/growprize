import { useCallback, useState, type FormEvent } from 'react';
import { useAuth } from '../../lib/auth';
import { ApiError } from '../../lib/api';

// validasi klien disamakan persis dengan regex dan batas backend agar pesan tidak pernah berbeda dari servernya.
const GROW_ID_PATTERN = /^[a-zA-Z0-9]{3,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 6;
const EMAIL_MAX = 254;

export type AuthMode = 'login' | 'register';

// memisahkan state dan pengiriman form dari presentasi supaya komponen ui tetap ringan.
// pesan 401 disamarkan agar tidak membocorkan bagian mana yang salah.
export function useLoginForm(onAuthed: () => void) {
  const { login, register, apiConfigured } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [growId, setGrowId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchMode = useCallback((next: AuthMode) => {
    setMode(next);
    setError(null);
  }, []);

  const validate = useCallback((): string | null => {
    const trimmedGrowId = growId.trim();
    const trimmedEmail = email.trim();

    if (!trimmedGrowId || !trimmedEmail || !password) {
      return 'Isi GrowID, email, dan password.';
    }
    if (!GROW_ID_PATTERN.test(trimmedGrowId)) {
      return 'GrowID harus 3 sampai 20 karakter huruf atau angka.';
    }
    if (!EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > EMAIL_MAX) {
      return 'Alamat email tidak valid.';
    }
    if (password.length < PASSWORD_MIN) {
      return `Password minimal ${PASSWORD_MIN} karakter.`;
    }
    return null;
  }, [growId, email, password]);

  const submit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (submitting) return;

      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSubmitting(true);
      const trimmedGrowId = growId.trim();
      const trimmedEmail = email.trim();
      try {
        if (mode === 'register') {
          await register(trimmedGrowId, trimmedEmail, password);
        } else {
          await login(trimmedGrowId, trimmedEmail, password);
        }
        onAuthed();
      } catch (err) {
        let message = 'Terjadi kesalahan. Coba lagi.';
        if (err instanceof ApiError) {
          if (err.status === 401) {
            message = 'GrowID, email, atau password salah.';
          } else if (err.status === 409) {
            message = 'GrowID atau email sudah terdaftar.';
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
    [email, growId, login, mode, onAuthed, password, register, submitting, validate]
  );

  return {
    mode,
    switchMode,
    growId,
    setGrowId,
    email,
    setEmail,
    password,
    setPassword,
    error,
    submitting,
    apiConfigured,
    submit,
  };
}
