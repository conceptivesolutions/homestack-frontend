import _ from "lodash";
import { getHomeStackBackend } from "models/backend/HomeStackBackend";
import { IStack } from "models/definitions/backend/common";
import { IDevice } from "models/definitions/backend/device";
import { ISatellite } from "models/definitions/backend/satellite";
import { _sessionToken } from "models/states/AuthState";
import { useCallback, useMemo } from "react";
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
    return getHomeStackBackend(token!).getStacks();
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
    return getHomeStackBackend(token!).getDevices(stackID!);
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
    return getHomeStackBackend(token!).getSatellites(stackID!);
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
  const backend = getHomeStackBackend(token!);

  return {
    createDevice: useCallback(() =>
    {
      const id = uuidv4();
      return backend.createDevice(stackID!, id)
        .then(() => reloadDevices(v => v + 1))
        .then(() => id);
    }, [backend, reloadDevices, stackID]),
    deleteDevice: useCallback((id: string) => backend.deleteDevice(id)
      .then(() => reloadDevices(v => v + 1))
      .then(() => id), [backend, reloadDevices]),
    createSatellite: useCallback(() =>
    {
      const id = uuidv4();
      return backend.createSatellite(stackID!, id)
        .then(() => reloadSatellites(v => v + 1))
        .then(() => id);
    }, [backend, reloadSatellites, stackID]),
    deleteSatellite: useCallback((id: string) => backend.deleteSatellite(id)
      .then(() => reloadSatellites(v => v + 1))
      .then(() => id), [backend, reloadSatellites]),
  };
}

/**
 * Provides the functionality to set the active stack
 */
export function useSetActiveStackID()
{
  const setStackID = useSetRecoilState(_activeStackID);
  return useMemo(() => ({
    setStackID,
  }), [setStackID]);
}

/**
 * Provides all stacks a user has access to
 */
export function useStacks()
{
  const stacks = useRecoilValue(_stacks);
  return useMemo(() => ({
    stacks,
  }), [stacks]);
}

/**
 * Provides all devices of the currently selected stack
 */
export function useActiveStackDevices()
{
  const activeDevices = useRecoilValue(_activeStackDevices);
  return useMemo(() => ({
    devices: activeDevices,
  }), [activeDevices]);
}

/**
 * Provides all satellites of the currently selected stack
 */
export function useActiveStackSatellites()
{
  const activeSatellites = useRecoilValue(_activeStackSatellites);
  return useMemo(() => ({
    satellites: activeSatellites,
  }), [activeSatellites]);
}

/**
 * Provides all facade methods to the backend directly
 */
export function useBackend()
{
  const token = useRecoilValue(_sessionToken);
  return useMemo(() => getHomeStackBackend(token!), [token]);
}
