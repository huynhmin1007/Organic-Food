const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_EXPIRES_AT_KEY = "access_token_expires_at";

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  getAccessTokenExpiresAt: (): number | null => {
    const raw = localStorage.getItem(ACCESS_EXPIRES_AT_KEY);
    return raw ? Number(raw) : null;
  },

  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(
      ACCESS_EXPIRES_AT_KEY,
      String(Date.now() + expiresIn * 1000),
    );
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_EXPIRES_AT_KEY);
  },
};
