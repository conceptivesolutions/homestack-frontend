import _ from "lodash";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";

/**
 * contains the currently issued token.
 */
const _issuedToken = atom<string | null>({
  key: "issuedToken",
  default: null,
})

/**
 * Contains the current session token for the current user.
 * Will be refreshed automatically, if necessary and possible
 */
export const _sessionToken = selector<string | null>({
  key: "sessionToken",
  get: ({get}) =>
  {
    return get(_issuedToken); //todo validate and re-issue
  }
})

/**
 * Provides the functionality to login / logout the current user
 */
export function useLogin()
{
  const setToken = useSetRecoilState(_issuedToken);

  return {
    login: (user: string, password: string): Promise<void> =>
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "loginId": user,
          "password": password,
        })
      })
        .then(pResult => pResult.json())
        .then(pResult => pResult.token)
        .catch(pErr =>
        {
          setToken(null);
          throw pErr;
        })
        .then(pToken => setToken(pToken)),
    logout: () => setToken(null),
  }
}

/**
 * Provides functionality to retrieve authentication information
 */
export function useAuth()
{
  const token = useRecoilValue(_sessionToken)
  return {
    isAuthenticated: () => !_.isEmpty(token),
  }
}
