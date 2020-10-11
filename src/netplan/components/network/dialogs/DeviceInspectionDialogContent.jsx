import React from "react";
import "./DeviceInspectionDialogContent.scss"

/**
 * Dialog to edit a single device
 *
 * @param device device that should be edited
 * @param onPropChange function that gets executed, if a prop has changed
 * @returns {JSX.Element}
 */
export default ({device, onPropChange}) =>
{
  return (
    <div className={"device-inspection-dialog-content__container"}>
      <span>ID</span>
      <span>{device.id}</span>
      <span>Address</span>
      <input onChange={(e) => onPropChange("address", e.target.value)} defaultValue={device.address}/>
      <span>Metrics</span>
      <pre className={"device-inspection-dialog-content__metrics"}>{JSON.stringify(device.metrics, null, " ")}</pre>
    </div>
  );
}
