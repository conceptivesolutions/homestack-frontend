import { CardLayout, CardLayoutHeader } from "components/base/layouts/CardLayout";
import { FormLayout } from "components/base/layouts/FormLayout";
import { getMetricRecordByType } from "helpers/deviceHelper";
import { EMetricTypes, IDevice } from "models/definitions/backend/device";
import React from 'react';
import { useParams } from "react-router";
import styles from "./DeviceDetails.module.scss";

type DeviceDetailsProps = {
  device: IDevice,
};

export const DeviceDetails: React.VFC<DeviceDetailsProps> = ({device}) =>
{
  const {id: stackID} = useParams<{ id: string }>();
  // const [latencyRange, setLatencyRange] = useState<number>(60 * 60 * 1000);
  const deviceDNSName = device && (getMetricRecordByType(device, EMetricTypes.REVERSE_DNS)?.result?.name);
  const header = (
    <CardLayoutHeader>
      <h2 className={styles.header}><a href={"/stacks/" + stackID + "/devices/" + device.id}>{deviceDNSName || device.address || device.id}</a></h2>
      {deviceDNSName && <span>{device.address}</span>}
    </CardLayoutHeader>
  );

  return <CardLayout header={header} className={styles.container} disableBorder>
    <FormLayout small>
      <span>Adress</span>
      <span>{device.address || ""}</span>
      <span>DNS</span>
      <span>{deviceDNSName || ""}</span>
      <span>Ping</span>
      <span>{getMetricRecordByType(device, EMetricTypes.PING)?.result?.responseTime || -1} ms</span>
    </FormLayout>
    {/*<div className={styles.latencyHeader}>*/}
    {/*  <h3 className={styles.detailHeader}>Latency</h3>*/}
    {/*  <Select className={styles.latencyRangeSelect} isSearchable={false}*/}
    {/*          defaultValue={{label: "1 Hour", value: 60 * 60 * 1000}}*/}
    {/*          onChange={v => setLatencyRange(v!.value)}*/}
    {/*          options={[*/}
    {/*            {label: "10 Minutes", value: 10 * 60 * 1000},*/}
    {/*            {label: "1 Hour", value: 60 * 60 * 1000},*/}
    {/*            {label: "12 Hours", value: 12 * 60 * 60 * 1000},*/}
    {/*            {label: "24 Hours", value: 24 * 60 * 60 * 1000},*/}
    {/*          ]}/>*/}
    {/*</div>*/}
    {/*<DeviceMetricChart className={styles.latencyChart} device={device} metricType={EMetricTypes.PING} rangeMs={latencyRange}*/}
    {/*                   valueFn={pRecord => parseFloat(pRecord?.result?.responseTime)}/>*/}
  </CardLayout>;
};
