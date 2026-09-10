import { authApi, type AuthUser } from "./api";

const TOKEN_KEY = "gameatlas_token";
const USER_KEY = "gameatlas_user";

export type { AuthUser as User };

export const auth = {
  async loginWithApi(email: string, password: string): Promise<AuthUser> {
    const { user, token } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async loginWithGoogle(data: { email: string; name?: string; googleId?: string; avatarUrl?: string }): Promise<AuthUser> {
    const { user, token } = await authApi.google(data);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async registerWithApi(params: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }): Promise<AuthUser> {
    const { user, token } = await authApi.register(params);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async refreshUser(): Promise<AuthUser | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const { user } = await authApi.me();
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      auth.logout();
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
