import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  salonId: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("@HAS:user");
    const token = localStorage.getItem("@HAS:token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      api.defaults.params = {
        ...api.defaults.params,
        salonId: parsedUser.salonId,
      };
    }

    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("@HAS:user", JSON.stringify(user));
    localStorage.setItem("@HAS:token", token);

    api.defaults.headers.Authorization = `Bearer ${token}`;
    api.defaults.params = {
      ...api.defaults.params,
      salonId: user.salonId,
    };

    setUser(user);
  }

  function signOut() {
    localStorage.removeItem("@HAS:user");
    localStorage.removeItem("@HAS:token");

    delete api.defaults.headers.Authorization;
    delete api.defaults.params?.salonId;

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
