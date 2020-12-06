import {DELETE, GET, PATCH, PUT} from "helpers/fetchHelper";
import _ from "lodash";
import React, {createContext, Dispatch, useContext, useEffect} from "react";
import useThunkReducer, {Thunk} from "react-hook-thunk-reducer";
import {Action} from "types/context";
import {IStack} from "types/model";
import {v4 as uuidv4} from "uuid";
import {AuthContext} from "./AuthContext";

export interface IGlobalState
{
  stacks?: IStack[],
}

interface IInternalGlobalState extends IGlobalState
{
  getAccessToken: () => Promise<string>
}

export enum EGlobalStateActions
{
  SET_STACKS,
}

export type GlobalDispatch = Dispatch<Action | Thunk<IInternalGlobalState, Action>>

/**
 * Call to reload all stacks
 */
export const ACTION_RELOAD_STACKS = (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
{
  getState().getAccessToken()
    .then(pToken => GET('/api/hosts', pToken))
    .then(pResponse => pResponse.json())
    .then(pStacks => dispatch({
      type: EGlobalStateActions.SET_STACKS,
      payload: pStacks
    }))
}

/**
 * Creates a new stack
 */
export const ACTION_CREATE_STACK = (id?: string, stack?: IStack) => (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
{
  getState().getAccessToken()
    .then(pToken =>
    {
      const stackTmp = stack || {
        id: uuidv4(),
      };
      return PUT('/api/hosts/' + stackTmp.id, pToken, JSON.stringify(stackTmp));
    })
    .then(() => dispatch(ACTION_RELOAD_STACKS))
}

/**
 * Updates the given stack, identified by ID
 */
export const ACTION_UPDATE_STACK = (stack: IStack) => (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
{
  getState().getAccessToken()
    .then(pToken => PATCH('/api/hosts/' + stack.id, pToken, JSON.stringify(stack)))
    .then(() => dispatch(ACTION_RELOAD_STACKS))
}

/**
 * Removes the stack with the given ID
 *
 * @param id
 * @constructor
 */
export const ACTION_REMOVE_STACK = (id: string) => (dispatch: GlobalDispatch, getState: () => IInternalGlobalState) =>
{
  getState().getAccessToken()
    .then(pToken => DELETE('/api/hosts/' + id, pToken))
    .then(() =>
    {
      const stacks = getState().stacks || [];
      _.remove(stacks, pStack => pStack.id === id);
      dispatch({
        type: EGlobalStateActions.SET_STACKS,
        payload: stacks
      })
    })
}

// @ts-ignore just pass null to initial context, because we use a provider every time
export const GlobalContext = createContext<{ state: IGlobalState, dispatch: GlobalDispatch }>();

const reducer = (state: IInternalGlobalState, action: Action) =>
{
  switch (action.type)
  {
    case EGlobalStateActions.SET_STACKS:
      return {
        ...state,
        stacks: action.payload
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
    // reload stacks
    getAccessToken().then(() => dispatch(ACTION_RELOAD_STACKS))
  }, [getAccessToken])

  return <GlobalContext.Provider value={{state, dispatch}}>
    {children}
  </GlobalContext.Provider>
}
