import { getAuthBackend } from "models/backend/AuthBackend";
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
    return getAuthBackend(token).getUserInfo();
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
