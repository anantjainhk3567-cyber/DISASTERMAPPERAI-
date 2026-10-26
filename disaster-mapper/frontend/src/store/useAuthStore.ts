import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  loginAsDemoRole: (role: UserRole) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('disastermapper_user') || 'null'),
  token: localStorage.getItem('disastermapper_token'),
  isAuthenticated: !!localStorage.getItem('disastermapper_token'),
  isLoading: false,

  setAuth: (user, token) => {
    localStorage.setItem('disastermapper_token', token);
    localStorage.setItem('disastermapper_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('disastermapper_token');
    localStorage.removeItem('disastermapper_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  quickDemoLogin: async (role: UserRole) => {
    set({ isLoading: true });
    const email = `${role.toLowerCase()}@demo.local`;
    const password = 'Demo@123';

    try {
      const res = await api.auth.login({ email, password });
      const data = res.data.data;
      const user: User = {
        id: data.user?.id || 'demo-user-id',
        name: data.user?.name || `${role} User`,
        email,
        role,
        organizationId: data.user?.organizationId || 'demo-org-id',
      };
      localStorage.setItem('disastermapper_token', data.accessToken);
      localStorage.setItem('disastermapper_user', JSON.stringify(user));
      set({ user, token: data.accessToken, isAuthenticated: true, isLoading: false });
    } catch {
      // Offline fallback: Seed client-side session immediately
      const fallbackUser: User = {
        id: `demo-${role.toLowerCase()}`,
        name: `${role.charAt(0) + role.slice(1).toLowerCase()} Commander`,
        email,
        role,
        organizationId: 'demo-org',
      };
      const dummyToken = `demo-token-${Date.now()}`;
      localStorage.setItem('disastermapper_token', dummyToken);
      localStorage.setItem('disastermapper_user', JSON.stringify(fallbackUser));
      set({ user: fallbackUser, token: dummyToken, isAuthenticated: true, isLoading: false });
    }
  },

  loginAsDemoRole: async (role: UserRole) => {
    // Delegates to quickDemoLogin
    const store = useAuthStore.getState();
    await store.quickDemoLogin(role);
  },

  checkAuth: async () => {
    const token = localStorage.getItem('disastermapper_token');
    if (!token) return;
    try {
      const res = await api.auth.me();
      set({ user: res.data.data, isAuthenticated: true });
    } catch {
      // If token is invalid and not a demo token, logout
      if (!token.startsWith('demo-token-')) {
        localStorage.removeItem('disastermapper_token');
        localStorage.removeItem('disastermapper_user');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));
