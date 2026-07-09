import { createContext, useContext, useState, useEffect, ReactNode } from react;

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
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(token));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem(token, token);
      fetch(http://127.0.0.1:8000/api/users/me, {
        headers: { Authorization: Bearer ${token} }
      })
        .then(res => {
          if (!res.ok) throw new Error(Invalid token);
          return res.json();
        })
        .then(data => { setUser(data); setLoading(false); })
        .catch(() => { logout(); setLoading(false); });
    } else {
      localStorage.removeItem(token);
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = (newToken: string) => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error(useAuth must be used within an AuthProvider);
  return context;
};
