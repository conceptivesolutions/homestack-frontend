import React, {createContext, Dispatch, useContext} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {AuthContext} from "./AuthContext";

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
  const {state: {accessToken}} = useContext(AuthContext);
  const [state, dispatch] = useThunkReducer(reducer, {
    getAccessToken: () => Promise.resolve(accessToken || ""),
  });

  return <SettingsContext.Provider value={{state, dispatch}}>
    {children}
  </SettingsContext.Provider>
}
