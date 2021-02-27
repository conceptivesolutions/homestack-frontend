import { POST } from "helpers/fetchHelper";

type AnonymousAuthBackend = {
  login: (user: string, password: string) => Promise<{token: string, idToken: string, refreshToken?: string} | null>
  refresh: (token: string) => Promise<{token: string, idToken: string, refreshToken?: string} | null>
}

/**
 * Returns the anonymouse backend to use without a token
 */
export function getAnonymousAuthBackend(): AnonymousAuthBackend
{
  return {
    login: (user, password) => POST("/auth/oauth/token", null, JSON.stringify({"username": user, "password": password}))
      .then(pResult => pResult.json())
      .then(pResult => ({
        token: pResult.access_token,
        idToken: pResult.id_token,
        refreshToken: pResult.refresh_token,
      })),

    refresh: (refreshToken) => POST("/auth/oauth/token", null, JSON.stringify({"refresh_token": refreshToken}))
      .then(pResult => pResult.json())
      .then(pResult => ({
        token: pResult.access_token,
        idToken: pResult.id_token,
        refreshToken,
      })),
  };
}
