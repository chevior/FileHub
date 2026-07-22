import api from "./api";

export interface User { id: number; name: string; email: string; created_at?: string }
export interface AuthResponse { token: string; user: User }
export interface LoginData { email: string; password: string }
export interface RegisterData extends LoginData { name: string }

export const login = (data: LoginData) => api.post<AuthResponse>("/auth/login", data);
export const register = (data: RegisterData) => api.post<AuthResponse>("/auth/register", data);
export const me = () => api.get<User>("/auth/me");
