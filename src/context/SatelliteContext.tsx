import {DELETE, GET, PUT} from "helpers/fetchHelper";
import React, {createContext, Dispatch, useContext, useEffect} from "react";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {Action} from "types/context";
import {ISatelliteLease} from "types/model";
import {AuthContext} from "./AuthContext";

export interface ISatelliteState
{
  id: string,
  leases?: ISatelliteLease[],
}

interface IInternalSatelliteState extends ISatelliteState
{
  getAccessToken: () => Promise<string>
}

export enum ESatelliteStateActions
{
  SET_LEASES,
}

/**
 * Reloads the currently known leases
 */
export const ACTION_RELOAD_LEASES = (dispatch: SatelliteDispatch, getState: () => IInternalSatelliteState) =>
{
  getState().getAccessToken()
    .then(pToken => GET("/api/satellites/" + getState().id + "/leases", pToken))
    .then(pResponse => pResponse.json())
    .then(pLeases => dispatch({type: ESatelliteStateActions.SET_LEASES, payload: pLeases}))
}

/**
 * Creates a new lease for the current satellite and calls onCreate(), if sucessfull
 */
export const ACTION_GENERATE_LEASE = (onCreate: (pLease: ISatelliteLease) => void) => (dispatch: SatelliteDispatch, getState: () => IInternalSatelliteState) =>
{
  getState().getAccessToken()
    .then(pToken => PUT("/api/satellites/" + getState().id + "/leases", pToken))
    .then(pResult => pResult.json())
    .then(pLease => onCreate(pLease))
    .then(() => dispatch(ACTION_RELOAD_LEASES))
}

/**
 * Revokes the lease with the given id, so it is not valid anymore and can not be used by a satellite
 */
export const ACTION_REVOKE_LEASE = (pLeaseID: string) => (dispatch: SatelliteDispatch, getState: () => IInternalSatelliteState) =>
{
  getState().getAccessToken()
    .then(pToken => DELETE("/api/satellites/" + getState().id + "/leases/" + pLeaseID, pToken))
    .then(() => dispatch(ACTION_RELOAD_LEASES))
}

export type SatelliteDispatch = Dispatch<Action | Thunk<IInternalSatelliteState, Action>>

// @ts-ignore just pass null to initial context, because we use a provider every time
export const SatelliteContext = createContext<{ state: ISatelliteState, dispatch }>();

const reducer = (state: IInternalSatelliteState, action: Action) =>
{
  switch (action.type)
  {
    case ESatelliteStateActions.SET_LEASES:
      return {
        ...state,
        leases: action.payload,
      }

    default:
      return state;
  }
}

export function SatelliteProvider({satelliteID, children}: { satelliteID: string, children?: React.ReactNode })
{
  const {state: {getAccessToken}} = useContext(AuthContext);
  const [state, dispatch] = useThunkReducer(reducer, {
    id: satelliteID,
    getAccessToken,
  });

  // initial load leases
  useEffect(() => dispatch(ACTION_RELOAD_LEASES), []);

  return <SatelliteContext.Provider value={{state, dispatch}}>
    {children}
  </SatelliteContext.Provider>
}
