import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ApiError,
  fetchMe,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  isApiConfigured,
  type ApiUser,
} from './api';

import { normalizeUsd } from './money';

type AuthStatus = 'loading' | 'guest' | 'authed';

const CACHE_KEY = 'growprize_user_cache';

function loadCachedUser(): ApiUser | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.grow_id) {
      return {
        ...parsed,
        balance: normalizeUsd(parsed.balance),
      };
    }
  } catch {
    // abaikan galat json
  }
  return null;
}

function saveCachedUser(u: ApiUser): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(u));
  } catch {
    // storage mungkin penuh/private mode
  }
}

function clearCachedUser(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // abaikan
  }
}

interface AuthContextValue {
  status: AuthStatus;
  user: ApiUser | null;
  isGuest: boolean;
  apiConfigured: boolean;
  login: (growId: string, email: string, password: string) => Promise<void>;
  register: (growId: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateBalance: (newBalance: number | string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cachedInitial] = useState<ApiUser | null>(() => loadCachedUser());
  const [status, setStatus] = useState<AuthStatus>(cachedInitial ? 'authed' : 'loading');
  const [user, setUser] = useState<ApiUser | null>(cachedInitial);

  // Restore an existing session on first mount (the 7-day cookie may still
  // be valid). If /me fails with 401, visitor returns to Guest.
  useEffect(() => {
    let cancelled = false;

    if (!isApiConfigured) {
      setStatus('guest');
      return;
    }

    fetchMe()
      .then((me) => {
        if (cancelled) return;
        const parsed = { ...me, balance: normalizeUsd(me.balance) };
        saveCachedUser(parsed);
        setUser(parsed);
        setStatus('authed');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          clearCachedUser();
          setUser(null);
          setStatus('guest');
        } else if (!cachedInitial) {
          setUser(null);
          setStatus('guest');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cachedInitial]);

  const updateBalance = useCallback((newBalance: number | string) => {
    const safeUsd = normalizeUsd(newBalance);
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, balance: safeUsd };
      saveCachedUser(updated);
      return updated;
    });
  }, []);

  const login = useCallback(async (growId: string, email: string, password: string) => {
    const me = await apiLogin(growId, email, password);
    const parsed = { ...me, balance: normalizeUsd(me.balance) };
    saveCachedUser(parsed);
    setUser(parsed);
    setStatus('authed');
  }, []);

  const register = useCallback(async (growId: string, email: string, password: string) => {
    const me = await apiRegister(growId, email, password);
    const parsed = { ...me, balance: normalizeUsd(me.balance) };
    saveCachedUser(parsed);
    setUser(parsed);
    setStatus('authed');
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Even if the network call fails, drop local auth state.
      if (!(err instanceof ApiError)) throw err;
    }
    clearCachedUser();
    setUser(null);
    setStatus('guest');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await fetchMe();
      const parsed = { ...me, balance: normalizeUsd(me.balance) };
      saveCachedUser(parsed);
      setUser(parsed);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isGuest: status !== 'authed',
      apiConfigured: isApiConfigured,
      login,
      register,
      logout,
      refreshUser,
      updateBalance,
    }),
    [status, user, login, register, logout, refreshUser, updateBalance]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
