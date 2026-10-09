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

type AuthStatus = 'loading' | 'guest' | 'authed';

interface AuthContextValue {
  status: AuthStatus;
  user: ApiUser | null;
  isGuest: boolean;
  apiConfigured: boolean;
  login: (growId: string, email: string, password: string) => Promise<void>;
  register: (growId: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<ApiUser | null>(null);

  // Restore an existing session on first mount (the 7-day cookie may still
  // be valid). If /me fails, the visitor stays a Guest.
  useEffect(() => {
    let cancelled = false;

    if (!isApiConfigured) {
      setStatus('guest');
      return;
    }

    fetchMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus('authed');
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setStatus('guest');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (growId: string, email: string, password: string) => {
    const me = await apiLogin(growId, email, password);
    setUser(me);
    setStatus('authed');
  }, []);

  const register = useCallback(async (growId: string, email: string, password: string) => {
    const me = await apiRegister(growId, email, password);
    setUser(me);
    setStatus('authed');
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Even if the network call fails, drop local auth state.
      if (!(err instanceof ApiError)) throw err;
    }
    setUser(null);
    setStatus('guest');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
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
    }),
    [status, user, login, register, logout, refreshUser]
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
