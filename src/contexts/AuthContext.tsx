import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { getItem, removeItem, setItem } from '../services/storage';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    getItem<User | null>(AUTH_KEY, null)
  );

  const login = useCallback(async (email: string, _password: string) => {
    if (!email.trim()) return false;
    const newUser: User = {
      email: email.trim(),
      name: email.split('@')[0].replace(/[._]/g, ' '),
    };
    setUser(newUser);
    setItem(AUTH_KEY, newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeItem(AUTH_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
