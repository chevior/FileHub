import { useEffect, useState, type ReactNode } from "react";
import { login as loginRequest, me, register as registerRequest, type LoginData, type RegisterData, type User } from "../services/auth";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem("token")) { setLoading(false); return; }
      try {
        const response = await me();
        setUser(response.data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    void restoreSession();
  }, []);

  const login = async (data: LoginData) => {
    const response = await loginRequest(data);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };
  const register = async (data: RegisterData) => {
    const response = await registerRequest(data);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };
  const logout = () => { localStorage.removeItem("token"); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
