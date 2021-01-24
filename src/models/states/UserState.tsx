import { GET } from "helpers/fetchHelper";
import md5 from "md5";
import { _sessionToken } from "models/states/AuthState";
import { selector, useRecoilValue } from "recoil";

/**
 * contains the currently logged in user with all its information
 */
const _userInfo = selector<User | null>({
  key: "userInfo",
  get: ({get}) =>
  {
    const token = get(_sessionToken);
    if (!token)
      return null;
    return GET("/api/auth/user", token)
      .then(pResult => pResult.json())
      .then(pResult => pResult.user)
      .then(pInfo => ({
        username: pInfo.username,
        email: pInfo.email,
        firstName: pInfo.firstName,
        lastName: pInfo.lastName,
        picture: pInfo.picture || (pInfo.verified ? "https://www.gravatar.com/avatar/" + md5(pInfo.email) : undefined),
        verified: pInfo.verified,
      }))
  }
})

/**
 * provides the current user information
 */
export function useUserInfo()
{
  const userInfo = useRecoilValue(_userInfo)
  return {
    getUserInfo: () => userInfo,
  }
}
