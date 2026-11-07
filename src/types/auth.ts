export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  brandName?: string;
  bio?: string;
  role: 'user' | 'admin' | 'creator';
  isGuest: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
