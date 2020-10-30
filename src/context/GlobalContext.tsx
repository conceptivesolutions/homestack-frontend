import React, {createContext, Dispatch, useContext, useEffect} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {IHost} from "../types/model";
import {createHost, deleteHost, getHosts, updateHost} from "../rest/HostClient";
import _ from "lodash";
import {AuthContext} from "./AuthContext";

export interface IGlobalState
{
  hosts?: IHost[],
}

interface IInternalGlobalState extends IGlobalState
{
  getAccessToken: () => Promise<string>
}

export enum EGlobalStateActions
{
  SET_HOSTS,
}

export type GlobalDispatch = Dispatch<Action | Thunk<IInternalGlobalState, Action>>

/**
 * Call to reload all hosts
 *
 * @param dispatch
 * @param getState
 * @constructor
 */
export const ACTION_RELOAD_HOSTS = (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
{
  getState().getAccessToken()
    .then(getHosts)
    .then(pHosts => dispatch({
      type: EGlobalStateActions.SET_HOSTS,
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
export const ACTION_CREATE_HOST = (id?: string, host?: IHost) => (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
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
export const ACTION_UPDATE_HOST = (host: IHost) => (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
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
export const ACTION_REMOVE_HOST = (id: string) => (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
{
  getState().getAccessToken()
    .then(pToken => deleteHost(pToken, id))
    .then(() =>
    {
      const hosts = getState().hosts || [];
      _.remove(hosts, pHost => pHost.id === id);
      dispatch({
        type: EGlobalStateActions.SET_HOSTS,
        payload: hosts
      })
    })
}

// @ts-ignore just pass null to initial context, because we use a provider every time
export const GlobalContext = createContext<{ state: IGlobalState, dispatch: GlobalDispatch }>();

const reducer = (state: IInternalGlobalState, action: Action) =>
{
  switch (action.type)
  {
    case EGlobalStateActions.SET_HOSTS:
      return {
        ...state,
        hosts: action.payload
      };

    default:
      return state;
  }
}

export function GlobalProvider({children}: { children?: React.ReactNode })
{
  const {state: {accessToken}} = useContext(AuthContext);
  const [state, dispatch] = useThunkReducer(reducer, {
    getAccessToken: () => Promise.resolve(accessToken || ""),
  });

  // initial
  useEffect(() =>
  {
    if (!!accessToken)
      // reload hosts
      dispatch(ACTION_RELOAD_HOSTS)
  }, [accessToken])

  return <GlobalContext.Provider value={{state, dispatch}}>
    {children}
  </GlobalContext.Provider>
}
