import { createContext, useContext, useState, useMemo } from "react";

export interface AuthData {
  token: string;
  salonId: string;
  nome: string;
}

interface AuthContextType {
  auth: AuthData | null;
  isAuthenticated: boolean;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  });

  function login(data: AuthData) {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem("auth");
  }

  /**
   * ✅ Estado DERIVADO e ESTÁVEL
   * Nunca valide rota diretamente com `auth`
   */
  const isAuthenticated = useMemo(() => {
    return Boolean(auth?.token);
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
