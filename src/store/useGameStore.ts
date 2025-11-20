import { create } from 'zustand';

export type UserRole = 'player' | 'dm';

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface GameState {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User) => void;
  logout: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: true }),
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
