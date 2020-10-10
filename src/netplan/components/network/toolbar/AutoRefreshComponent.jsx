import React from "react";
import {useTimer} from "use-timer";

/**
 * Toolbar-Component that will trigger the onTrigger-Function, if the button is active / pressed
 *
 * @param interval Interval to trigger "onTrigger"
 * @param onTrigger Function that gets triggered
 * @returns {JSX.Element}
 */
export default ({interval, onTrigger}) =>
{
  const {start, pause, isRunning} = useTimer({
    initialTime: 0,
    onTimeUpdate: onTrigger,
    interval: interval,
  })

  return (
    <button className={"fa fa-sync-alt " + (isRunning && "pressed")} onClick={() => isRunning ? pause() : start()}/>
  )
}
