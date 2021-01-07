import {DELETE, GET, POST, PUT} from "helpers/fetchHelper";
import _ from "lodash";
import React, {createContext, Dispatch, useContext, useEffect} from "react";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {Action} from "types/context";
import {IDevice, IEdge, IMetricRecord, ISatellite} from "types/model";
import {v4 as uuidv4} from 'uuid';
import {AuthContext} from "./AuthContext";

export interface IStackState
{
  id: string,
  devices?: IDevice[],
  satellites?: ISatellite[],
  autoRefresh: boolean,
  selection?: {
    devices?: string[],
    edges?: string[],
    satellites?: string[],
  },
}

export type StackDispatch = Dispatch<Action | Thunk<IInternalStackState, Action>>

interface IInternalStackState extends IStackState
{
  getAccessToken: () => Promise<string>
}

export enum EStackStateActions
{
  SET_DEVICES,
  SET_SATELLITES,
  SET_AUTOREFRESH,
  SET_SELECTION,
  SET_ID,
}

/**
 * Action: Create a new device within the given stack
 *
 * @param id ID of the device to be created - null creates a new uuid
 * @param onCreation function that gets executed, if the device was created
 * @constructor
 */
export const ACTION_CREATE_DEVICE = (id?: string, onCreation?: (id: string) => void) => (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  const newID = id || uuidv4();
  getState().getAccessToken()
    .then(pToken => PUT('/api/devices/' + newID, pToken, JSON.stringify({
      id: newID,
      stackID: getState().id,
    })))
    .then(res => res.json())
    .then(pDevice => dispatch({
      type: EStackStateActions.SET_DEVICES,
      payload: [
        ...getState().devices || [],
        pDevice,
      ]
    }))
    .then(() => onCreation && onCreation(newID))
}

/**
 * Action: Create a new satellite within the given stack
 *
 * @param id ID of the satellite to be created - null creates a new uuid
 * @param onCreation function that gets executed, if the satellite was created
 * @constructor
 */
export const ACTION_CREATE_SATELLITE = (id?: string, onCreation?: (id: string) => void) => (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  const newID = id || uuidv4();
  getState().getAccessToken()
    .then(pToken => PUT('/api/satellites/' + newID, pToken, JSON.stringify({
      id: newID,
      stackID: getState().id,
    })))
    .then(res => res.json())
    .then(pSatellite => dispatch({
      type: EStackStateActions.SET_SATELLITES,
      payload: [
        ...getState().satellites || [],
        pSatellite,
      ]
    }))
    .then(() => onCreation && onCreation(newID))
}

/**
 * Action: Updates a single device with the given id
 *
 * @param id ID of the device to update
 * @param pDevice Device that contains the data to change
 * @param onUpdate function that gets executed, if the update was executed
 * @constructor
 */
export const ACTION_PATCH_DEVICE = (id: string, pDevice: IDevice, onUpdate?: (id: string) => void) => (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  getState().getAccessToken()
    .then(pToken =>
    {
      const oldDev = _.head(getState().devices?.filter(pDev => pDev.id === id));
      return PUT('/api/devices/' + id, pToken, JSON.stringify({
        ...oldDev,
        ...pDevice,
        id,
      }))
    })
    .then(response => response.json())
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
        type: EStackStateActions.SET_DEVICES,
        payload: devices
      })
    })
    .then(() => onUpdate && onUpdate(id));
}

/**
 * Removes a single device with the given id
 *
 * @param id ID of the device to remove
 * @param onDeletion function that gets executed, if the device was removed
 * @constructor
 */
export const ACTION_REMOVE_DEVICE = (id: string, onDeletion?: (id: string) => void) => (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  getState().getAccessToken()
    .then(pToken => DELETE('/api/devices/' + id, pToken))
    .then(() => dispatch({
      type: EStackStateActions.SET_DEVICES,
      payload: getState().devices?.filter(pTest => pTest.id !== id)
    }))
    .then(() => dispatch(ACTION_VALIDATE_SELECTION))
    .then(() => onDeletion && onDeletion(id));
}

/**
 * Action: Adds a new edge between two IDs
 *
 * @param from ID of the FROM-part of the edge
 * @param to ID of the TO-part of the edge
 * @constructor
 */
export const ACTION_ADD_EDGE_BETWEEN = (from: string, to: string) => (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  getState().getAccessToken()
    .then(pToken => POST('/api/devices/' + from + '/edges', pToken, to))
    .then(() => dispatch(ACTION_RELOAD))
}

/**
 * Action: Removes an edge between two IDs
 *
 * @param from ID of the FROM-part of the edge
 * @param to ID of the TO-part of the edge
 * @constructor
 */
export const ACTION_REMOVE_EDGE_BETWEEN = (from: string, to: string) => (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  getState().getAccessToken()
    .then(pToken => DELETE('/api/devices/' + from + '/edges/' + to, pToken))
    .then(() => dispatch(ACTION_RELOAD))
    .then(() => dispatch(ACTION_VALIDATE_SELECTION))
}

/**
 * Reloads the current available devices and satellites
 */
export const ACTION_RELOAD = (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  const triggeredForID = getState().id;
  getState().getAccessToken()

    // get all devices
    .then(pToken => GET('/api/stacks/' + triggeredForID + '/devices', pToken)
      .then(res => res.json() as Promise<IDevice[]>)

      // enrich devices with records and edges
      .then(pDevices => Promise.all(pDevices.map(pDevice => GET('/api/metrics/' + pDevice.id + "/records", pToken)
        .then(pResult => pResult.json() as Promise<IMetricRecord[]>)
        .then(pRecords => pDevice.metricRecords = pRecords)
        .then(() => GET('/api/devices/' + pDevice.id + '/edges', pToken))
        .then(res => res.json() as Promise<IEdge[]>)
        .then(pEdges => pDevice.edges = pEdges)
        .then(() => pDevice))))

      // set devices
      .then((pDevices) =>
      {
        // Are we still using this stack?
        if (getState().id !== triggeredForID)
          return;

        dispatch({type: EStackStateActions.SET_DEVICES, payload: pDevices});

        // update selection
        dispatch(ACTION_VALIDATE_SELECTION);
      })

      // update satellites
      .then(() => GET("/api/stacks/" + triggeredForID + "/satellites", pToken))
      .then(pResponse => pResponse.json())

      // set satellites
      .then(pSatellites =>
      {
        // Are we still using this stack?
        if (getState().id !== triggeredForID)
          return;

        dispatch({type: EStackStateActions.SET_SATELLITES, payload: pSatellites});
      }));
}

/**
 * Validates the selection, so it only contains valid IDs
 */
export const ACTION_VALIDATE_SELECTION = (dispatch: StackDispatch, getState: () => IInternalStackState) =>
{
  const selection = getState().selection;
  if (!selection)
    return;

  dispatch({
    type: EStackStateActions.SET_SELECTION,
    payload: {
      devices: selection.devices?.filter(pDeviceID => _.findIndex(getState().devices, pValidDevice => pValidDevice.id === pDeviceID) > -1),
      edges: selection.edges?.filter(pEdgeID => _.findIndex(getState().devices?.flatMap(pDevice => pDevice.edges || []),
        pValidEdge => pValidEdge.id === pEdgeID) > -1),
      satellites: selection.satellites?.filter(pSatelliteID => _.findIndex(getState().satellites, pValidSatellite => pValidSatellite.id === pSatelliteID) > -1),
    }
  })
}

const reducer = (state: IInternalStackState, action: Action) =>
{
  switch (action.type)
  {
    case EStackStateActions.SET_DEVICES:
      return {
        ...state,
        devices: action.payload,
      }

    case EStackStateActions.SET_SATELLITES:
      return {
        ...state,
        satellites: action.payload,
      }

    case EStackStateActions.SET_AUTOREFRESH:
      return {
        ...state,
        autoRefresh: action.payload,
      }

    case EStackStateActions.SET_SELECTION:
      return {
        ...state,
        selection: {
          devices: action.payload?.devices || [],
          edges: action.payload?.edges || [],
          satellites: action.payload?.satellites || [],
        },
      }

    case EStackStateActions.SET_ID:
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
export const StackContext = createContext<{ state: IInternalStackState, dispatch: StackDispatch }>()

export function StackProvider({id, children}: { id: string, children?: React.ReactNode })
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
    dispatch({type: EStackStateActions.SET_ID, payload: id})
    dispatch(ACTION_RELOAD);
  }, [dispatch, id])

  /**
   * Auto-Refresh Timer
   */
  useEffect(() =>
  {
    if (!state.autoRefresh)
      return;
    const interval = setInterval(() => dispatch(ACTION_RELOAD), 1000)
    return () => clearInterval(interval);
  }, [state.id, state.autoRefresh, dispatch])

  return <StackContext.Provider value={{state, dispatch}}>
    {children}
  </StackContext.Provider>
}
