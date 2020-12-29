import CardLayout, {CardLayoutHeader} from "components/layouts/CardLayout";
import CardTableLayout from "components/layouts/CardTableLayout";
import {StackContext} from "context/StackContext";
import {getMetricRecordByType} from "helpers/deviceHelper";
import React, {useContext} from 'react';
import {EMetricTypes, IDevice} from "types/model";
import styles from "./DeviceDetails.module.scss";

interface IDeviceDetails
{
  device: IDevice,
}

const DeviceDetails = (props: IDeviceDetails) =>
{
  const {state: {id}} = useContext(StackContext);

  const device = props.device;
  const deviceDNSName = device && (getMetricRecordByType(device, EMetricTypes.REVERSE_DNS)?.result?.name);
  const header = (
    <CardLayoutHeader>
      <h2 className={styles.header}><a href={"/stacks/" + id + "/devices/" + device.id}>{deviceDNSName || device.address || device.id}</a></h2>
      {deviceDNSName && <span>{device.address}</span>}
    </CardLayoutHeader>
  )

  return <CardLayout header={header} className={styles.container}>
    <CardTableLayout small>
      <span>Ping</span>
      <span>{getMetricRecordByType(device, EMetricTypes.PING)?.result?.responseTime || -1} ms</span>
    </CardTableLayout>
  </CardLayout>
};

export default DeviceDetails;
