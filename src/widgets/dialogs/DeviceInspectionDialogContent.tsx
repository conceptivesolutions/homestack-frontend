import React from "react";
import styles from "./DeviceInspectionDialogContent.module.scss"
import {IDevice} from "../../types/model";
import SimpleGridDialogContent from "../../components/dialogs/SimpleGridDialogContent";
import chars from 'font-awesome-icon-chars'
import {iconNameToUnicode} from "../../helpers/iconHelper";

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
      <span>Icon</span>
      <select onChange={(e) => onPropChange("icon", e.target.value)} defaultValue={device.icon && iconNameToUnicode(device.icon)}>
        <option value={""}/>
        {chars.regular.map(pIcon => <option key={pIcon.name} value={pIcon.name}>{pIcon.name}</option>)}
      </select>
      <span>Records</span>
      <pre className={styles.metricRecords}>{JSON.stringify(device.metricRecords, null, " ")}</pre>
    </SimpleGridDialogContent>
  );
};

export default DeviceInspectionDialogContent;
