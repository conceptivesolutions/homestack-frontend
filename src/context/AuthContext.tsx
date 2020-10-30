import React, {createContext, Dispatch, useEffect} from "react";
import {Action} from "../types/context";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {useAuth0} from "@auth0/auth0-react";
import LoadingIndicator from "../components/loader/LoadingIndicator";

export interface IAuthState
{
  user?: IUser,
  accessToken?: string,
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
      return {
        ...state,
        accessToken: action.payload,
      }

    default:
      return state;
  }
}

export function AuthProvider({children}: { children?: React.ReactNode })
{
  const {getAccessTokenSilently: getAccessToken, user, isAuthenticated, logout} = useAuth0();
  const [state, dispatch] = useThunkReducer(reducer, {
    user,
    logout
  });

  // initial
  useEffect(() =>
  {
    if (isAuthenticated)
      // set accessToken
      getAccessToken().then(pToken => dispatch({type: EAuthStateActions.SET_ACCESSTOKEN, payload: pToken}))
  }, [user, dispatch, isAuthenticated])

  if (isAuthenticated)
    return <AuthContext.Provider value={{state, dispatch}}>
      {children}
    </AuthContext.Provider>
  else
    return <LoadingIndicator/>;
}
