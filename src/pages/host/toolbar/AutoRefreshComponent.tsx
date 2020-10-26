import React, {useContext} from "react";
import {useTimer} from "use-timer";
import {ACTION_RELOAD_DEVICES, EHostStateActions, HostContext} from "../state/HostContext";

/**
 * Toolbar-Component that will trigger the refresh, if the button is active / pressed
 */
export default () =>
{
  const {state, dispatch} = useContext(HostContext)
  const {start, pause, isRunning} = useTimer({
    initialTime: 0,
    onTimeUpdate: () => dispatch(ACTION_RELOAD_DEVICES()),
    interval: 1000,
  })

  if (state.autoRefresh && !isRunning)
    start();
  else if (!state.autoRefresh && isRunning)
    pause();

  return (
    <button className={"fa fa-sync-alt " + (isRunning && "pressed")} onClick={() => dispatch({type: EHostStateActions.SET_AUTOREFRESH, payload: !isRunning})}/>
  )
}
