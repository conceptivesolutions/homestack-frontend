import React, {useEffect, useState} from "react";
import "./DeviceInspectionDialogContent.scss"
import {getMetrics} from "../../../rest/MetricsClient";
import {IDevice, IMetric} from "../../../types/model";
import {useAuth0} from "@auth0/auth0-react";
import SimpleGridDialogContainer from "../../dialogs/SimpleGridDialogContent";

/**
 * Dialog to edit a single device
 *
 * @param device device that should be edited
 * @param onPropChange function that gets executed, if a prop has changed
 * @returns {JSX.Element}
 */
export default ({device, onPropChange}: { device: IDevice, onPropChange: (propName: string, propVal: string) => void }) =>
{
  const [metrics, setMetrics] = useState<IMetric[]>([])
  const {getAccessTokenSilently} = useAuth0();

  useEffect(() =>
  {
    getAccessTokenSilently()
      .then(pToken => getMetrics(pToken, device.id))
      .then(setMetrics)
  }, [device.id, getAccessTokenSilently])

  return (
    <SimpleGridDialogContainer>
      <span>ID</span>
      <span>{device.id}</span>
      <span>Address</span>
      <input onChange={(e) => onPropChange("address", e.target.value)} defaultValue={device.address}/>
      <span>Metrics</span>
      <pre className={"device-inspection-dialog-content__metrics"}>{JSON.stringify(metrics, null, " ")}</pre>
    </SimpleGridDialogContainer>
  );
}
