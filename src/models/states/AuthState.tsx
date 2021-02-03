import _ from "lodash";
import { getAnonymousAuthBackend } from "models/backend/AuthBackend";
import { useCallback } from "react";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";

/**
 * contains the currently issued token.
 */
const _issuedToken = atom<string | null>({
  key: "issuedToken",
  default: null,
});

/**
 * Contains the current session token for the current user.
 * Will be refreshed automatically, if necessary and possible
 */
export const _sessionToken = selector<string | null>({
  key: "sessionToken",
  get: ({get}) =>
  {
    return get(_issuedToken); //todo validate and re-issue
  },
});

/**
 * Provides the functionality to login / logout the current user
 */
export function useLogin()
{
  const setToken = useSetRecoilState(_issuedToken);
  const {login} = getAnonymousAuthBackend();

  return {
    login: useCallback((user: string, password: string): Promise<void> =>
      login(user, password)
        .catch(pErr =>
        {
          setToken(null);
          throw pErr;
        })
        .then(pToken => setToken(pToken)), [login, setToken]),
    logout: useCallback(() => setToken(null), [setToken]),
  };
}

/**
 * Provides functionality to retrieve authentication information
 */
export function useAuth()
{
  const token = useRecoilValue(_sessionToken);
  return {
    isAuthenticated: useCallback(() => !_.isEmpty(token), [token]),
  };
}
