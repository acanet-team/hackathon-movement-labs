import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IAccessToken {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
  refreshTokenExpires: number;
}

export const useAccessTokenStore = create<IAccessToken>(
  // persist<IAccessToken>(
  (set) => ({
    accessToken: "",
    refreshToken: "",
    tokenExpires: 0,
    refreshTokenExpires: 0,
    setToken: (data: IAccessToken) => set({ ...data }),
  }),
  // {
  //   name: "auth-storage",
  //   storage: createJSONStorage(() => localStorage),
  // },
);
// );
