import React, {createContext, Dispatch, useContext, useEffect} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {IHost} from "../types/model";
import _ from "lodash";
import {AuthContext} from "./AuthContext";
import {DELETE, GET, PATCH, PUT} from "../helpers/fetchHelper";
import {v4 as uuidv4} from "uuid";

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
    .then(pToken => GET('/api/hosts', pToken))
    .then(pResponse => pResponse.json())
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
    .then(pToken =>
    {
      const hostTmp = host || {
        id: uuidv4(),
      };
      return PUT('/api/hosts/' + hostTmp.id, pToken, JSON.stringify(hostTmp));
    })
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
    .then(pToken => PATCH('/api/hosts/' + host.id, pToken, JSON.stringify(host)))
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
    .then(pToken => DELETE('/api/hosts/' + id, pToken))
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
  const {state: {getAccessToken}} = useContext(AuthContext);
  const [state, dispatch] = useThunkReducer(reducer, {
    getAccessToken,
  });

  // initial
  useEffect(() =>
  {
    // reload hosts
    getAccessToken().then(() => dispatch(ACTION_RELOAD_HOSTS))
  }, [getAccessToken])

  return <GlobalContext.Provider value={{state, dispatch}}>
    {children}
  </GlobalContext.Provider>
}
