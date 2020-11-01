import React, {createContext, Dispatch, useEffect} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import _ from "lodash";
import LoginWidget from "../widgets/login/LoginWidget";
import {useRouter} from "next/router";
import {userinfo} from "../rest/AuthClient";
import {isJWTTokenValid} from "../helpers/jwtHelper";
import LoadingIndicator from "../components/loader/LoadingIndicator";

export interface IAuthState
{
  user?: IUser,
  authenticated: boolean,
  loading: boolean,
  getAccessToken: () => Promise<string>,
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
  SET_AUTHENTICATED,
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
  // if not valid, handle it like no token was received
  if (token && !isJWTTokenValid(token))
    token = undefined;

  // store in localStorage semi permanently
  if (!!token)
    localStorage.setItem("token", token);
  else
    localStorage.removeItem("token");

  // set authentication state
  dispatch({type: EAuthStateActions.SET_AUTHENTICATED, payload: !_.isEmpty(token)});

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
    case EAuthStateActions.SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: action.payload,
        loading: false,
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

  // noinspection JSUnusedGlobalSymbols
  const [state, dispatch] = useThunkReducer(reducer, {
    authenticated: false,
    loading: true,
    getAccessToken: () => new Promise((resolve) =>
    {
      const token = localStorage.getItem("token");
      if (!_.isEmpty(token) && token && isJWTTokenValid(token))
        resolve(token);
      else
        state.logout();
    }),
    logout: () =>
    {
      // Clear Token and redirect to home page
      dispatch(ACTION_SET_ACCESSTOKEN());
      router.push("/");
    },
  });

  // read token from localStorage initially
  useEffect(() => dispatch(ACTION_SET_ACCESSTOKEN(localStorage.getItem("token") || undefined)), [dispatch])

  // Loading
  if (state.loading)
    children = <LoadingIndicator/>

  // Not authenticated
  else if (!state.authenticated)
    children = <LoginWidget onTokenReceived={(token) => dispatch(ACTION_SET_ACCESSTOKEN(token))}/>

  return <AuthContext.Provider value={{state, dispatch}}>
    {children}
  </AuthContext.Provider>;
}
