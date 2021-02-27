import jwt_decode from "jwt-decode";
import _ from "lodash";
import md5 from "md5";
import { getAnonymousAuthBackend } from "models/backend/AuthBackend";
import { useCallback } from "react";
import { atom, AtomEffect, DefaultValue, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { localStorageEffect } from "../../helpers/recoilHelper";

type TokenData = {
  token: string,
  idToken: string,
  refreshToken?: string,
}

/**
 * Effect to validate the JWT
 */
export const validateJWTEffect: () => AtomEffect<TokenData | null> = () => ({ resetSelf, onSet, setSelf }) =>
{
  onSet(async (newValue) =>
  {
    if (!(newValue instanceof DefaultValue) && !_.isEmpty(newValue?.token))
    {
      // @ts-ignore
      const expiredAt = jwt_decode(newValue!.token)?.exp
      const jitterOffset = 5 * 60 * 1000;
      if (!expiredAt || expiredAt * 1000 < new Date().getUTCMilliseconds() - jitterOffset)
      {
        if(!_.isEmpty(newValue?.refreshToken))
          await getAnonymousAuthBackend().refresh(newValue!.refreshToken!)
            .then(pToken => setSelf(pToken))
        else
          resetSelf();
      }
    }
  });
}

/**
 * contains the currently issued token.
 */
const _issuedTokenData = atom<TokenData | null>({
  key: "issuedTokenData",
  default: null,
  effects_UNSTABLE: [
    validateJWTEffect(),
    localStorageEffect("issuedTokenData")
  ]
});

/**
 * Contains the current session token for the current user.
 * Will be refreshed automatically, if necessary and possible
 */
export const _sessionToken = selector<string | null>({
  key: "sessionToken",
  get: ({get}) =>
  {
    return get(_issuedTokenData)?.token || null;
  },
});

/**
 * Provides the functionality to login / logout the current user
 */
export function useLogin()
{
  const setTokenData = useSetRecoilState(_issuedTokenData);
  const { login } = getAnonymousAuthBackend();

  return {
    login: useCallback((user: string, password: string): Promise<void> =>
      login(user, password)
        .catch(pErr =>
        {
          setTokenData(null);
          throw pErr;
        })
        .then(pToken => setTokenData(pToken)), [login, setTokenData]),
    logout: useCallback(() => setTokenData(null), [setTokenData]),
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

/**
 * provides the current user information
 */
export function useUserInfo()
{
  const token = useRecoilValue(_issuedTokenData)

  // @ts-ignore
  const user: any = _.isEmpty(token?.idToken) ? {} : jwt_decode(token?.idToken);

  return {
    getUserInfo: () => ({
      username: user?.nickname,
      email: user?.email,
      firstName: user?.given_name,
      lastName: user?.family_name,
      picture: user?.picture || (user?.email_verified ? "https://www.gravatar.com/avatar/" + md5(user?.email) : undefined),
      verified: user?.email_verified,
    }),
  }
}