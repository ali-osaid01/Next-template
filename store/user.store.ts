import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../interfaces/interface';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user: User) => {
        set({
          currentUser: user,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          set({
            currentUser: { ...currentUser, ...updates },
          });
        }
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ 
          error,
          isLoading: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }), 
    }
  )
);

export const useCurrentUser = () => useUserStore((state) => state.currentUser);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);

export const useUserActions = () => {
  const { setUser, updateUser, logout, setLoading, setError, clearError } = useUserStore();
  return { setUser, updateUser, logout, setLoading, setError, clearError };
};
