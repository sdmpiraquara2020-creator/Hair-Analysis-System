import { createContext, useContext, useState } from "react";

type AuthData = {
  token: string;
  salonId: string;
};

type AuthContextType = {
  auth: AuthData | null;
  setAuth: (data: AuthData) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = useState<AuthData | null>(null);

  function setAuth(data: AuthData) {
    setAuthState(data);
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * ✅ ESTE EXPORT É O QUE ESTÁ FALTANDO NO SEU PROJETO
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
