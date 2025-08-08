import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserType {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
}

interface AuthStore {
  user: UserType | null;
  accessToken: string | null;
  storeInfo: (item: UserType | null, token: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      storeInfo: (item, token) => set({ user: item, accessToken: token }),
      reset: () => set({ user: null, accessToken: null }),
      
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
