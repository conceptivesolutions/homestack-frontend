import DeviceMetricChart from "components/charts/DeviceMetricChart";
import CardLayout, {CardLayoutHeader} from "components/layouts/CardLayout";
import CardTableLayout from "components/layouts/CardTableLayout";
import {StackContext} from "context/StackContext";
import {getMetricRecordByType} from "helpers/deviceHelper";
import React, {useContext, useState} from 'react';
import Select from "react-select";
import {EMetricTypes, IDevice} from "types/model";
import styles from "./DeviceDetails.module.scss";

interface IDeviceDetails
{
  device: IDevice,
}

const DeviceDetails = (props: IDeviceDetails) =>
{
  const {state: {id}} = useContext(StackContext);
  const [latencyRange, setLatencyRange] = useState<number>(60 * 60 * 1000);
  const device = props.device;
  const deviceDNSName = device && (getMetricRecordByType(device, EMetricTypes.REVERSE_DNS)?.result?.name);
  const header = (
    <CardLayoutHeader>
      <h2 className={styles.header}><a href={"/stacks/" + id + "/devices/" + device.id}>{deviceDNSName || device.address || device.id}</a></h2>
      {deviceDNSName && <span>{device.address}</span>}
    </CardLayoutHeader>
  )

  return <CardLayout header={header} className={styles.container} disableBorder>
    <CardTableLayout small>
      <span>Adress</span>
      <span>{device.address || ""}</span>
      <span>DNS</span>
      <span>{getMetricRecordByType(device, EMetricTypes.REVERSE_DNS)?.result || ""}</span>
      <span>Ping</span>
      <span>{getMetricRecordByType(device, EMetricTypes.PING)?.result?.responseTime || -1} ms</span>
    </CardTableLayout>
    <div className={styles.latencyHeader}>
      <h3 className={styles.detailHeader}>Latency</h3>
      <Select className={styles.latencyRangeSelect} isSearchable={false}
              defaultValue={{label: "1 Hour", value: 60 * 60 * 1000}}
              onChange={v => setLatencyRange(v!.value)}
              options={[
                {label: "10 Minutes", value: 10 * 60 * 1000},
                {label: "1 Hour", value: 60 * 60 * 1000},
                {label: "12 Hours", value: 12 * 60 * 60 * 1000},
                {label: "24 Hours", value: 24 * 60 * 60 * 1000},
              ]}/>
    </div>
    <DeviceMetricChart className={styles.latencyChart} device={device} metricType={EMetricTypes.PING} rangeMs={latencyRange}
                       valueFn={pRecord => parseFloat(pRecord?.result?.responseTime)}/>
  </CardLayout>
};

export default DeviceDetails;
