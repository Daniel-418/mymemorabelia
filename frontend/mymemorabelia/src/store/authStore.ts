import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  email: string;
  timezone: string;
}

const TOKEN_KEY = 'auth_token';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Rehydrate token from localStorage
const storedToken = localStorage.getItem(TOKEN_KEY);

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: null, // Can be fetched from an API endpoint later if needed
  isAuthenticated: !!storedToken,

  login: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
