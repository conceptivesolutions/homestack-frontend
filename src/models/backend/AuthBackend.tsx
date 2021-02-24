import { GET, POST } from "helpers/fetchHelper";
import md5 from "md5";

type AnonymousAuthBackend = {
  login: (user: string, password: string) => Promise<string | null>
}

type AuthBackend = {
  getUserInfo: () => Promise<User | null>
}

/**
 * Returns the anonymouse backend to use without a token
 */
export function getAnonymousAuthBackend(): AnonymousAuthBackend
{
  return {
    login: (user, password) => POST("/api/auth/oauth/token", null, JSON.stringify({"username": user, "password": password}))
      .then(pResult => pResult.json())
      .then(pResult => pResult.access_token),
  };
}

/**
 * Returns the backend for a single user with the given token
 *
 * @param sessionToken token for the user that is currently logged in
 */
export function getAuthBackend(sessionToken: string): AuthBackend
{
  return {
    getUserInfo: () => GET("/api/auth/userinfo", sessionToken)
      .then(pResult => pResult.json())
      .then(pInfo => ({
        username: pInfo.nickname,
        email: pInfo.email,
        firstName: pInfo.given_name,
        lastName: pInfo.family_name,
        picture: pInfo.picture || (pInfo.email_verified ? "https://www.gravatar.com/avatar/" + md5(pInfo.email) : undefined),
        verified: pInfo.email_verified,
      })),
  };
}
