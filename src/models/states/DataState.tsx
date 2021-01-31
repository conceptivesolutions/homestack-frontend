import { DELETE, GET, PUT } from "helpers/fetchHelper";
import _ from "lodash";
import { IStack } from "models/definitions/backend/common";
import { IDevice } from "models/definitions/backend/device";
import { ISatellite } from "models/definitions/backend/satellite";
import { _sessionToken } from "models/states/AuthState";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { v4 as uuidv4 } from 'uuid';

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
 * Contains a unique id to identify the current device query.
 * Change to reload devices
 */
const _activeStackDevicesQueryID = atom<number>({
  key: "_activeStackDevicesQueryID",
  default: 0,
});

/**
 * Contains a unique id to identify the current satellite query.
 * Change to reload satellites
 */
const _activeStackSatellitesQueryID = atom<number>({
  key: "_activeStackSatellitesQueryID",
  default: 0,
});

/**
 * Contains the devices of the currently active stack
 */
const _activeStackDevices = selector<IDevice[] | null>({
  key: "activeStackDevices",
  get: ({get}) =>
  {
    get(_activeStackDevicesQueryID); // bind
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
 * Contains the satellites of the currently active stack
 */
const _activeStackSatellites = selector<ISatellite[] | null>({
  key: "activeStackSatellites",
  get: ({get}) =>
  {
    get(_activeStackSatellitesQueryID); // bind
    const token = get(_sessionToken);
    const stackID = get(_activeStackID);
    if (_.isEmpty(token) || _.isEmpty(stackID))
      return null;
    return GET('/api/stacks/' + stackID + '/satellites', token)
      .then(pResult => pResult.json());
  },
});

/**
 * Provides all functionality to alter data in the current stack
 */
export function useActiveStackCRUD()
{
  const token = useRecoilValue(_sessionToken);
  const stackID = useRecoilValue(_activeStackID);
  const reloadDevices = useSetRecoilState(_activeStackDevicesQueryID);
  const reloadSatellites = useSetRecoilState(_activeStackSatellitesQueryID);

  return {
    createDevice: () =>
    {
      const id = uuidv4();
      return PUT('/api/devices/' + id, token, JSON.stringify({id, stackID}))
        .then(() => reloadDevices(v => v + 1))
        .then(() => id);
    },
    deleteDevice: (id: string) => DELETE('/api/devices/' + id, token)
      .then(() => reloadDevices(v => v + 1))
      .then(() => id),
    createSatellite: () =>
    {
      const id = uuidv4();
      return PUT('/api/satellites/' + id, token, JSON.stringify({id, stackID}))
        .then(() => reloadSatellites(v => v + 1))
        .then(() => id);
    },
    deleteSatellite: (id: string) => DELETE('/api/satellites/' + id, token)
      .then(() => reloadSatellites(v => v + 1))
      .then(() => id),
  };
}

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

/**
 * Provides all satellites of the currently selected stack
 */
export function useActiveStackSatellites()
{
  const activeSatellites = useRecoilValue(_activeStackSatellites);
  return {
    satellites: activeSatellites,
  };
}
