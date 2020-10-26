import React from "react";
import "./DeviceInspectionDialogContent.scss"
import {IDevice} from "../../../types/model";
import SimpleGridDialogContent from "../../../components/dialogs/SimpleGridDialogContent";

/**
 * Dialog to edit a single device
 *
 * @param device device that should be edited
 * @param onPropChange function that gets executed, if a prop has changed
 * @returns {JSX.Element}
 */
export default ({device, onPropChange}: { device: IDevice, onPropChange: (propName: string, propVal: string) => void }) =>
{
  return (
    <SimpleGridDialogContent>
      <span>ID</span>
      <span>{device.id}</span>
      <span>Address</span>
      <input onChange={(e) => onPropChange("address", e.target.value)} defaultValue={device.address}/>
      <span>Metrics</span>
      <pre className={"device-inspection-dialog-content__metrics"}>{JSON.stringify(device.metrics, null, " ")}</pre>
    </SimpleGridDialogContent>
  );
}
