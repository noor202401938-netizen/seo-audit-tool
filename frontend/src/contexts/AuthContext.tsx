import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscription: {
    plan: string;
    auditsRemaining: number;
    monthlyLimit: number;
  };
}

interface AuthContextType {
  user: User;
  token: string;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const LOCAL_USER: User = {
  id: 'local-user',
  email: 'local@seointelligence',
  name: 'Local User',
  subscription: {
    plan: 'self-hosted',
    auditsRemaining: 999999,
    monthlyLimit: 999999,
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(LOCAL_USER);
  const token = 'local-community-token';

  const login = () => {};
  const logout = () => {};
  const refreshUser = async () => {};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: LOCAL_USER,
      token: 'local-community-token',
      login: () => {},
      logout: () => {},
      refreshUser: async () => {},
      loading: false,
    };
  }
  return context;
};
