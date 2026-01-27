import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "../api/auth.api";
import api from "../api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("@sdm:token");
    const userData = localStorage.getItem("@sdm:user");

    if (token && userData) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { user, token } = await loginRequest({ email, password });

    localStorage.setItem("@sdm:token", token);
    localStorage.setItem("@sdm:user", JSON.stringify(user));

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("@sdm:token");
    localStorage.removeItem("@sdm:user");
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
