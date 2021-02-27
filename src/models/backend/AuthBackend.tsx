import { POST } from "helpers/fetchHelper";

type AnonymousAuthBackend = {
  login: (user: string, password: string) => Promise<{ token: string, idToken: string, refreshToken?: string } | null>
  refresh: (token: string) => Promise<{ token: string, idToken: string, refreshToken?: string } | null>
}

/**
 * Returns the anonymouse backend to use without a token
 */
export function getAnonymousAuthBackend(): AnonymousAuthBackend
{
  return {
    login: (user, password) => POST("/auth/oauth/token", null, JSON.stringify({ "username": user, "password": password }))
      .then(pResult =>
      {
        if (pResult.ok)
          return pResult.json()
        else
          throw new Error("You have entered an invalid username or password"); //todo i18n
      })
      .then(pResult => ({
        token: pResult.access_token,
        idToken: pResult.id_token,
        refreshToken: pResult.refresh_token,
      })),

    refresh: (refreshToken) => POST("/auth/oauth/token", null, JSON.stringify({ "refresh_token": refreshToken }))
      .then(pResult =>
      {
        if (pResult.ok)
          return pResult.json()
        else
          throw new Error("You have entered an invalid username or password"); //todo i18n
      })
      .then(pResult => ({
        token: pResult.access_token,
        idToken: pResult.id_token,
        refreshToken,
      })),
  };
}
