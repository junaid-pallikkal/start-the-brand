import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/auth';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsGuest: () => void;
  loginAsDemoAdmin: () => void;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const DEMO_USER: UserProfile = {
  id: 'usr_demo_streetwear_01',
  email: 'creator@startthebrand.com',
  username: 'kurt_studio',
  fullName: 'Kurt Vance',
  brandName: 'ATELIER ZERO',
  bio: 'Independent Streetwear Designer & Cut-and-Sew Developer based in Tokyo / NYC.',
  role: 'creator',
  isGuest: false,
  createdAt: '2026-01-15T00:00:00.000Z',
};

const DEMO_ADMIN: UserProfile = {
  id: 'usr_demo_admin_root',
  email: 'admin@startthebrand.com',
  username: 'root_curator',
  fullName: 'Platform Overseer',
  brandName: 'StartTheBrand Systems',
  bio: 'Platform Administrator & Garment Spec Curator.',
  role: 'admin',
  isGuest: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEMO_USER, // Default to authenticated creator so user can use everything immediately
      isAuthenticated: true,
      isLoading: false,

      loginAsGuest: () => {
        set({
          user: {
            id: `usr_guest_${Date.now().toString(36)}`,
            email: 'guest@startthebrand.local',
            username: 'guest_creator',
            fullName: 'Guest Designer',
            brandName: 'My Streetwear Brand',
            role: 'user',
            isGuest: true,
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        });
      },

      loginAsDemoAdmin: () => {
        set({
          user: DEMO_ADMIN,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'stb-auth-session',
    }
  )
);
