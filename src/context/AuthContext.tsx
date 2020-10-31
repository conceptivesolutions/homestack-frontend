import React, {createContext, Dispatch, useEffect} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import _ from "lodash";
import LoginWidget from "../widgets/login/LoginWidget";
import {useRouter} from "next/router";

export interface IAuthState
{
  user?: IUser,
  accessToken?: string,
  authenticated: boolean,
  logout: () => void,
}

export interface IUser
{
  picture?: string,
}

export type AuthDispatch = Dispatch<Action | Thunk<IAuthState, Action>>

export enum EAuthStateActions
{
  SET_ACCESSTOKEN,
}

// @ts-ignore just pass null to initial context, because we use a provider every time
export const AuthContext = createContext<{ state: IAuthState, dispatch: AuthDispatch }>();

const reducer = (state: IAuthState, action: Action) =>
{
  switch (action.type)
  {
    case EAuthStateActions.SET_ACCESSTOKEN:
      if (!!action.payload)
        localStorage.setItem("token", action.payload as string);
      else
        localStorage.removeItem("token");

      return {
        ...state,
        authenticated: !_.isEmpty(action.payload),
        accessToken: action.payload,
      }

    default:
      return state;
  }
}

export function AuthProvider({children}: { children?: React.ReactNode })
{
  const router = useRouter();
  const [state, dispatch] = useThunkReducer(reducer, {
    authenticated: false,
    logout: () =>
    {
      // Clear Token and redirect to home page
      dispatch({type: EAuthStateActions.SET_ACCESSTOKEN, payload: undefined});
      router.push("/");
    },
  });

  // todo validate token validity

  // Get token from localStorage
  useEffect(() =>
  {
    const token = localStorage.getItem("token");
    if (!!token)
      dispatch({type: EAuthStateActions.SET_ACCESSTOKEN, payload: token});
  }, [dispatch])

  // Force authenticated state
  if (!state.authenticated || _.isEmpty(state.accessToken))
    children = <LoginWidget onTokenReceived={(token) => dispatch({type: EAuthStateActions.SET_ACCESSTOKEN, payload: token})}/>

  return <AuthContext.Provider value={{state, dispatch}}>
    {children}
  </AuthContext.Provider>;
}
