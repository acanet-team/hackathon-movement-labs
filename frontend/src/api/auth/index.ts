import httpClient from "../index";
import type { IMe } from "../onboard/model";
import type { ISession } from "./auth.model";

export const getMe = () => {
  return httpClient.get<IMe>("/v1/auth/me");
};

export const guestLogin = (
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.post(`/v1/auth/guest/login`, { headers });
};

export const logOut = (headers: Headers = undefined as unknown as Headers) => {
  return httpClient.post("/v1/auth/logout", { headers });
};

export const refreshToken = (refreshToken: string) => {
  console.log("refreshToken", refreshToken);
  return httpClient.post<
    { refreshToken: string },
    {
      token: string;
      refreshTokenExpires: number;
      tokenExpires: number;
      refreshToken: string;
    }
  >("/v1/auth/refresh", { refreshToken });
};
