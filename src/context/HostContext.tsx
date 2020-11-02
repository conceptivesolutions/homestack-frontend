import React, {createContext, Dispatch, useContext, useEffect} from "react";
import {Action} from "../types/context";
import {IDevice} from "../types/model";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {createDevice, deleteDevice, getAllDevices, updateDevice} from "../rest/DeviceClient";
import {getMetricRecords} from "../rest/MetricsClient";
import {addEdgeBetween, getEdges, removeEdgeBetween} from "../rest/EdgeClient";
import {v4 as uuidv4} from 'uuid';
import _ from "lodash";
import {AuthContext} from "./AuthContext";

export interface IHostState
{
  id: string,
  devices?: IDevice[],
  autoRefresh: boolean,
  selection?: {
    devices?: string[],
    edges?: string[]
  },
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
  SET_SELECTION,
  SET_ID,
}

/**
 * Action: Create a new device within the given host
 *
 * @param id ID of the device to be created - null creates a new uuid
 * @constructor
 */
export const ACTION_CREATE_DEVICE = (id?: string) => (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  getState().getAccessToken()
    .then(pToken => createDevice(pToken, id || uuidv4(), getState().id))
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
        devices[replaceIdx] = {
          ...pDevice,
          metricRecords: devices[replaceIdx].metricRecords,
        };
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
    .then(() => dispatch({
      type: EHostStateActions.SET_DEVICES,
      payload: getState().devices?.filter(pTest => pTest.id !== id)
    }))
    .then(() => dispatch(ACTION_VALIDATE_SELECTION))
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
    .then(() => dispatch(ACTION_RELOAD_DEVICES))
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
    .then(() => dispatch(ACTION_RELOAD_DEVICES))
    .then(() => dispatch(ACTION_VALIDATE_SELECTION))
}

/**
 * Reloads the current available devices
 */
export const ACTION_RELOAD_DEVICES = (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  const triggeredForID = getState().id;
  dispatch({type: EHostStateActions.RELOAD_DEVICES_STARTED})
  getState().getAccessToken()

    // get all devices
    .then(pToken => getAllDevices(pToken, triggeredForID)

      // enrich devices with records and edges
      .then(pDevices => Promise.all(pDevices.map(pDevice => getMetricRecords(pToken, pDevice.id)
        .then(pRecords => pDevice.metricRecords = pRecords)
        .then(() => getEdges(pToken, pDevice.id))
        .then(pEdges => pDevice.edges = pEdges)
        .then(() => pDevice)))))

    // set devices
    .then((pDevices) =>
    {
      // Are we still using this devices?
      if (getState().id !== triggeredForID)
        return;

      dispatch({type: EHostStateActions.SET_DEVICES, payload: pDevices});

      // update selection
      dispatch(ACTION_VALIDATE_SELECTION);
    })

    .finally(() => dispatch({type: EHostStateActions.RELOAD_DEVICES_FINISHED}))
}

/**
 * Validates the selection, so it only contains valid IDs
 */
export const ACTION_VALIDATE_SELECTION = (dispatch: HostDispatch, getState: () => IInternalHostState) =>
{
  const selection = getState().selection;
  if (!selection)
    return;

  dispatch({
    type: EHostStateActions.SET_SELECTION,
    payload: {
      devices: selection.devices?.filter(pDeviceID => _.findIndex(getState().devices, pValidDevice => pValidDevice.id === pDeviceID) > -1),
      edges: selection.edges?.filter(pEdgeID => _.findIndex(getState().devices?.flatMap(pDevice => pDevice.edges || []),
        pValidEdge => pValidEdge.id === pEdgeID) > -1)
    }
  })
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

    case EHostStateActions.SET_SELECTION:
      return {
        ...state,
        selection: {
          ...state,
          devices: action.payload?.devices || state.selection?.devices,
          edges: action.payload?.edges || state.selection?.edges,
        },
      }

    case EHostStateActions.SET_ID:
      return {
        ...state,
        id: action.payload,
        devices: undefined,
        selection: undefined
      }

    default:
      return state;
  }
}

// @ts-ignore just pass null to initial context, because we use a provider every time
export const HostContext = createContext<{ state: IInternalHostState, dispatch: HostDispatch }>()

export function HostProvider({id, children}: { id: string, children?: React.ReactNode })
{
  const {state: {getAccessToken}} = useContext(AuthContext)
  const [state, dispatch] = useThunkReducer(reducer, {
    id,
    getAccessToken,
    autoRefresh: false
  });

  // initial and on ID change
  useEffect(() =>
  {
    dispatch({type: EHostStateActions.SET_ID, payload: id})
    dispatch(ACTION_RELOAD_DEVICES);
  }, [dispatch, id])

  /**
   * Auto-Refresh Timer
   */
  useEffect(() =>
  {
    if (!state.autoRefresh)
      return;
    const interval = setInterval(() => dispatch(ACTION_RELOAD_DEVICES), 1000)
    return () => clearInterval(interval);
  }, [state.id, state.autoRefresh, dispatch])

  return <HostContext.Provider value={{state, dispatch}}>
    {children}
  </HostContext.Provider>
}
