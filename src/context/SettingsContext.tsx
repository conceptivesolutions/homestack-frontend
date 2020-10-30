import React, {createContext, Dispatch} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {useAuth0} from "@auth0/auth0-react";

export interface ISettingsState
{
}

interface IInternalSettingsState extends ISettingsState
{
  getAccessToken: () => Promise<string>
}

export enum ESettingsStateActions
{
}

export type SettingsDispatch = Dispatch<Action | Thunk<IInternalSettingsState, Action>>

// @ts-ignore just pass null to initial context, because we use a provider every time
export const SettingsContext = createContext<{ state: ISettingsState, dispatch }>();

const reducer = (state: IInternalSettingsState, action: Action) =>
{
  return state;
}

export function SettingsProvider({children}: { children?: React.ReactNode })
{
  const {getAccessTokenSilently: getAccessToken} = useAuth0();
  const [state, dispatch] = useThunkReducer(reducer, {
    getAccessToken,
  });

  return <SettingsContext.Provider value={{state, dispatch}}>
    {children}
  </SettingsContext.Provider>
}
