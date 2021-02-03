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
    login: (user, password) => POST("/api/auth/login", null, JSON.stringify({"loginId": user, "password": password}))
      .then(pResult => pResult.json())
      .then(pResult => pResult.token),
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
    getUserInfo: () => GET("/api/auth/user", sessionToken)
      .then(pResult => pResult.json())
      .then(pResult => pResult.user)
      .then(pInfo => ({
        username: pInfo.username,
        email: pInfo.email,
        firstName: pInfo.firstName,
        lastName: pInfo.lastName,
        picture: pInfo.picture || (pInfo.verified ? "https://www.gravatar.com/avatar/" + md5(pInfo.email) : undefined),
        verified: pInfo.verified,
      })),
  };
}
