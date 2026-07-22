import { createContext } from "react";
import type { LoginData, RegisterData, User } from "../services/auth";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
