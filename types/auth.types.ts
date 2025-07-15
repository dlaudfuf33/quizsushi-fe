export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  planTier: string;
  joinedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isInitialized: boolean;
  logout: () => void;
}
