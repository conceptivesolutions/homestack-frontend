import React, {createContext, Dispatch, useEffect} from "react";
import {Action} from "../../../types/context";
import {IDevice} from "../../../types/model";
import {useAuth0} from "@auth0/auth0-react";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {createDevice, deleteDevice, getAllDevices, updateDevice} from "../../../rest/DeviceClient";
import {getMetrics} from "../../../rest/MetricsClient";
import {addEdgeBetween, getEdges, removeEdgeBetween} from "../../../rest/EdgeClient";
import {v4 as uuidv4} from 'uuid';
import _ from "lodash";

export interface IHostState
{
  id: string,
  devices?: IDevice[],
  autoRefresh: boolean,
}

export type HostDispatch = Dispatch<Action | Thunk<IInternalHostState, Action>>

interface IInternalHostState extends IHostState
{
  getAccessToken: () => Promise<string>
}

export enum EHostStateActions
{
  RELOAD_DEVICES_STARTED,
  RELOAD_DEVICES_FINISHED,
  SET_DEVICES,
  SET_AUTOREFRESH,
}

/**
 * Action: Create a new device within the given host
 *
 * @param hostID ID of the host to create a new device in
 * @param id ID of the device to be created - null creates a new uuid
 * @constructor
 */
export const ACTION_CREATE_DEVICE = (hostID: string, id?: string) => (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  getState().getAccessToken()
    .then(pToken => createDevice(pToken, id || uuidv4(), hostID))
    .then(pDevice => dispatch({
      type: EHostStateActions.SET_DEVICES,
      payload: [
        ...getState().devices || [],
        pDevice,
      ]
    }))
}

/**
 * Action: Updates a single device with the given id
 *
 * @param id ID of the device to update
 * @param pDevice Device that contains the data to change
 * @constructor
 */
export const ACTION_UPDATE_DEVICE = (id: string, pDevice: IDevice) => (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  getState().getAccessToken()
    .then(pToken => updateDevice(pToken, id, pDevice))
    .then(pDevice =>
    {
      const devices = [...(getState().devices || [])];
      const replaceIdx = devices.findIndex(pValue => pValue.id === id)
      if (replaceIdx > -1)
        devices[replaceIdx] = pDevice;
      else
        devices.push(pDevice);
      dispatch({
        type: EHostStateActions.SET_DEVICES,
        payload: devices
      })
    })
}

/**
 * Removes a single device with the given id
 *
 * @param id ID of the device to remove
 * @constructor
 */
export const ACTION_REMOVE_DEVICE = (id: string) => (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  getState().getAccessToken()
    .then(pToken => deleteDevice(pToken, id))
    .then(() =>
    {
      const devices = [...(getState().devices || [])];
      _.remove(devices, pTest => pTest.id === id)
      dispatch({
        type: EHostStateActions.SET_DEVICES,
        payload: devices
      })
    })
}

/**
 * Action: Adds a new edge between two IDs
 *
 * @param from ID of the FROM-part of the edge
 * @param to ID of the TO-part of the edge
 * @constructor
 */
export const ACTION_ADD_EDGE_BETWEEN = (from: string, to: string) => (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  getState().getAccessToken()
    .then(pToken => addEdgeBetween(pToken, from, to))
    .then(() => dispatch(ACTION_RELOAD_DEVICES()))
}

/**
 * Action: Removes an edge between two IDs
 *
 * @param from ID of the FROM-part of the edge
 * @param to ID of the TO-part of the edge
 * @constructor
 */
export const ACTION_REMOVE_EDGE_BETWEEN = (from: string, to: string) => (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  getState().getAccessToken()
    .then(pToken => removeEdgeBetween(pToken, from, to))
    .then(() => dispatch(ACTION_RELOAD_DEVICES()))
}

/**
 * Reloads the current available devices
 */
export const ACTION_RELOAD_DEVICES = (hostID?: string) => (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  dispatch({type: EHostStateActions.RELOAD_DEVICES_STARTED})
  getState().getAccessToken()

    // get all devices
    .then(pToken => getAllDevices(pToken, hostID || getState().id)

      // enrich devices with metrics and edges
      .then(pDevices => Promise.all(pDevices.map(pDevice => getMetrics(pToken, pDevice.id)
        .then(pMetrics => pDevice.metrics = pMetrics)
        .then(() => getEdges(pToken, pDevice.id))
        .then(pEdges => pDevice.edges = pEdges)
        .then(() => pDevice)))))

    // set devices
    .then((pDevices) => dispatch({type: EHostStateActions.SET_DEVICES, payload: pDevices}))
    .finally(() => dispatch({type: EHostStateActions.RELOAD_DEVICES_FINISHED}))
}

const reducer = (state: IInternalHostState, action: Action) =>
{
  switch (action.type)
  {
    case EHostStateActions.SET_DEVICES:
      return {
        ...state,
        devices: action.payload,
      }

    case EHostStateActions.SET_AUTOREFRESH:
      return {
        ...state,
        autoRefresh: action.payload,
      }

    default:
      return state;
  }
}

// @ts-ignore just pass null to initial context, because we use a provider every time
export const HostContext = createContext<{ state: IInternalHostState, dispatch: HostDispatch }>()

export function HostProvider({id, children}: { id: string, children?: React.ReactNode })
{
  const {getAccessTokenSilently: getAccessToken} = useAuth0()
  const [state, dispatch] = useThunkReducer(reducer, {
    id,
    getAccessToken,
    autoRefresh: false
  });

  // initial
  useEffect(() => dispatch(ACTION_RELOAD_DEVICES(id)), [dispatch, id])

  return <HostContext.Provider value={{state, dispatch}}>
    {children}
  </HostContext.Provider>
}
