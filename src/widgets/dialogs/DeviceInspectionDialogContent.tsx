import React from "react";
import styles from "./DeviceInspectionDialogContent.module.scss"
import {IDevice} from "../../types/model";
import SimpleGridDialogContent from "../../components/dialogs/SimpleGridDialogContent";

/**
 * Dialog to edit a single device
 *
 * @param device device that should be edited
 * @param onPropChange function that gets executed, if a prop has changed
 * @returns {JSX.Element}
 */
const DeviceInspectionDialogContent = ({device, onPropChange}: { device: IDevice, onPropChange: (propName: string, propVal: string) => void }) =>
{
  return (
    <SimpleGridDialogContent>
      <span>ID</span>
      <span>{device.id}</span>
      <span>Address</span>
      <input onChange={(e) => onPropChange("address", e.target.value)} defaultValue={device.address}/>
      <span>Records</span>
      <pre className={styles.metricRecords}>{JSON.stringify(device.metricRecords, null, " ")}</pre>
    </SimpleGridDialogContent>
  );
};

export default DeviceInspectionDialogContent;
