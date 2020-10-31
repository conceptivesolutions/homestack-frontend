import React, {createContext, Dispatch, useEffect} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import _ from "lodash";
import LoginWidget from "../widgets/login/LoginWidget";
import {useRouter} from "next/router";
import {userinfo} from "../rest/AuthClient";

export interface IAuthState
{
  user?: IUser,
  accessToken?: string,
  authenticated: boolean,
  logout: () => void,
}

export interface IUser
{
  username?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  picture?: string,
  verified?: boolean,
}

export type AuthDispatch = Dispatch<Action | Thunk<IAuthState, Action>>

export enum EAuthStateActions
{
  SET_ACCESSTOKEN,
  SET_USER,
}

// @ts-ignore just pass null to initial context, because we use a provider every time
export const AuthContext = createContext<{ state: IAuthState, dispatch: AuthDispatch }>();

/**
 * Action to set the access token
 *
 * @param token or undefined, if no token is currently available
 */
export const ACTION_SET_ACCESSTOKEN = (token?: string) => (dispatch: AuthDispatch, getState: () => IAuthState) =>
{
  if (!!token)
    localStorage.setItem("token", token);
  else
    localStorage.removeItem("token");

  // set in state
  dispatch({type: EAuthStateActions.SET_ACCESSTOKEN, payload: token})

  // upate userinfo
  if (!!token)
    userinfo(token)
      .then(pInfo => ({
        username: pInfo.username,
        email: pInfo.email,
        firstName: pInfo.firstName,
        lastName: pInfo.lastName,
        picture: pInfo.picture,
        verified: pInfo.verified,
      } as IUser))
      .then(pUser => dispatch({type: EAuthStateActions.SET_USER, payload: pUser}));
  else
    dispatch({type: EAuthStateActions.SET_USER, payload: undefined})
}

const reducer = (state: IAuthState, action: Action) =>
{
  switch (action.type)
  {
    case EAuthStateActions.SET_ACCESSTOKEN:
      return {
        ...state,
        authenticated: !_.isEmpty(action.payload),
        accessToken: action.payload,
      }

    case EAuthStateActions.SET_USER:
      return {
        ...state,
        user: action.payload,
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
      dispatch(ACTION_SET_ACCESSTOKEN());
      router.push("/");
    },
  });

  // todo validate token validity

  // Get token from localStorage
  useEffect(() =>
  {
    const token = localStorage.getItem("token");
    if (!!token)
      dispatch(ACTION_SET_ACCESSTOKEN(token));
  }, [dispatch])

  // Force authenticated state
  if (!state.authenticated || _.isEmpty(state.accessToken))
    children = <LoginWidget onTokenReceived={(token) => dispatch(ACTION_SET_ACCESSTOKEN(token))}/>

  return <AuthContext.Provider value={{state, dispatch}}>
    {children}
  </AuthContext.Provider>;
}
