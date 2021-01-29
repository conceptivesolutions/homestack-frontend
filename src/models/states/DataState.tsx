import { GET } from "helpers/fetchHelper";
import _ from "lodash";
import { IStack } from "models/definitions/backend/common";
import { IDevice } from "models/definitions/backend/device";
import { _sessionToken } from "models/states/AuthState";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";

/**
 * Contains all information about all stacks the current user has
 */
const _stacks = selector<IStack[] | null>({
  key: "stacks",
  get: ({get}) =>
  {
    const token = get(_sessionToken);
    if (_.isEmpty(token))
      return null;
    return GET("/api/stacks", token)
      .then(pResponse => pResponse.json())
      .catch(console.log);
  },
});

/**
 * Contains the current active and loaded stack id
 */
const _activeStackID = atom<string | null>({
  key: "activeStackID",
  default: null,
});

/**
 * Contains the devices of the currently active stack
 */
const _activeStackDevices = selector<IDevice[] | null>({
  key: "activeStackDevices",
  get: ({get}) =>
  {
    const token = get(_sessionToken);
    const stackID = get(_activeStackID);
    if (_.isEmpty(token) || _.isEmpty(stackID))
      return null;
    return GET('/api/stacks/' + stackID + '/devices', token)
      .then(res => res.json())
      .then((pDevices: IDevice[]) => Promise.all(pDevices.map(pDevice => GET('/api/metrics/' + pDevice.id + "/records", token)
        .then(pResult => pResult.json())
        .then(pRecords => pDevice.metricRecords = pRecords)
        .then(() => pDevice))))
      .then(pDevices => _.sortBy(pDevices, ["address", "id"]));
  },
});

/**
 * Provides the functionality to set the active stack
 */
export function useSetActiveStackID()
{
  const setStackID = useSetRecoilState(_activeStackID);
  return {
    setStackID,
  };
}

/**
 * Provides all stacks a user has access to
 */
export function useStacks()
{
  const stacks = useRecoilValue(_stacks);
  return {
    stacks,
  };
}

/**
 * Provides all devices of the currently selected stack
 */
export function useActiveStackDevices()
{
  const activeDevices = useRecoilValue(_activeStackDevices);
  return {
    devices: activeDevices,
  };
}
