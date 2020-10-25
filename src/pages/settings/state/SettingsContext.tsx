import React, {createContext, Dispatch, useEffect} from "react";
import {Action} from "../../../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {useAuth0} from "@auth0/auth0-react";
import {IHost} from "../../../types/model";
import {createHost, deleteHost, getHosts, updateHost} from "../../../rest/HostClient";
import _ from "lodash";

export interface ISettingsState
{
  hosts?: IHost[],
}

interface IInternalSettingsState extends ISettingsState
{
  getAccessToken: () => Promise<string>
}

export enum ESettingsStateActions
{
  SET_HOSTS,
}

export type SettingsDispatch = Dispatch<Action | Thunk<IInternalSettingsState, Action>>

/**
 * Call to reload all hosts
 *
 * @param dispatch
 * @param getState
 * @constructor
 */
export const ACTION_RELOAD_HOSTS = (dispatch: SettingsDispatch, getState: () => IInternalSettingsState) =>
{
  getState().getAccessToken()
    .then(getHosts)
    .then(pHosts => dispatch({
      type: ESettingsStateActions.SET_HOSTS,
      payload: pHosts
    }))
}

/**
 * Creates a new host
 *
 * @param id
 * @param host
 * @constructor
 */
export const ACTION_CREATE_HOST = (id?: string, host?: IHost) => (dispatch: SettingsDispatch, getState: () => IInternalSettingsState) =>
{
  getState().getAccessToken()
    .then(pToken => createHost(pToken, host))
    .then(() => dispatch(ACTION_RELOAD_HOSTS))
}

/**
 * Updates the given host, identified by ID
 *
 * @param host
 * @constructor
 */
export const ACTION_UPDATE_HOST = (host: IHost) => (dispatch: SettingsDispatch, getState: () => IInternalSettingsState) =>
{
  getState().getAccessToken()
    .then(pToken => updateHost(pToken, host))
    .then(() => dispatch(ACTION_RELOAD_HOSTS))
}

/**
 * Removes the host with the given ID
 *
 * @param id
 * @constructor
 */
export const ACTION_REMOVE_HOST = (id: string) => (dispatch: SettingsDispatch, getState: () => IInternalSettingsState) =>
{
  getState().getAccessToken()
    .then(pToken => deleteHost(pToken, id))
    .then(() =>
    {
      const hosts = getState().hosts || [];
      _.remove(hosts, pHost => pHost.id === id);
      dispatch({
        type: ESettingsStateActions.SET_HOSTS,
        payload: hosts
      })
    })
}

// @ts-ignore just pass null to initial context, because we use a provider every time
export const SettingsContext = createContext<{ state: ISettingsState, dispatch }>();

const reducer = (state: IInternalSettingsState, action: Action) =>
{
  switch (action.type)
  {
    case ESettingsStateActions.SET_HOSTS:
      return {
        ...state,
        hosts: action.payload
      };

    default:
      return state;
  }
}

export function SettingsProvider({children}: { children?: React.ReactNode })
{
  const {getAccessTokenSilently: getAccessToken} = useAuth0();
  const [state, dispatch] = useThunkReducer(reducer, {
    getAccessToken,
  });

  // initial
  useEffect(() => dispatch(ACTION_RELOAD_HOSTS), [])

  return <SettingsContext.Provider value={{state, dispatch}}>
    {children}
  </SettingsContext.Provider>
}
