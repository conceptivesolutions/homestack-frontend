import { GET } from "helpers/fetchHelper";
import _ from "lodash";
import { IStack } from "models/definitions/backend/common";
import { _sessionToken } from "models/states/AuthState";
import { selector, useRecoilValue } from "recoil";

/**
 * Contains all information about all stacks the current user has
 */
const _stacks = selector<IStack[] | null>({
  key: "stacks",
  get: ({get}) =>
  {
    const token = get(_sessionToken)
    if (_.isEmpty(token))
      return null;
    return GET("/api/stacks", token)
      .then(pResponse => pResponse.json())
      .catch(console.log)
  }
})

/**
 * Provides all stacks a user has access to
 */
export function useStacks()
{
  const stacks = useRecoilValue(_stacks)
  return {
    stacks,
  }
}
