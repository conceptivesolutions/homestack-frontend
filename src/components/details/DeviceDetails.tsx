import { CardLayout, CardLayoutHeader } from "components/base/layouts/CardLayout";
import { FormLayout } from "components/base/layouts/FormLayout";
import { EMetricTypes, IDevice } from "models/definitions/backend/device";
import React from 'react';
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useActiveStackRecords } from "../../models/states/DataState";
import styles from "./DeviceDetails.module.scss";

type DeviceDetailsProps = {
  device: IDevice,
};

export const DeviceDetails: React.VFC<DeviceDetailsProps> = ({ device }) =>
{
  const { id: stackID } = useParams<{ id: string }>();
  const { latestRecordOfDevice } = useActiveStackRecords();

  // const [latencyRange, setLatencyRange] = useState<number>(60 * 60 * 1000);
  const deviceDNSName = device && (latestRecordOfDevice(device.id, EMetricTypes.REVERSE_DNS)?.result?.name);
  const header = (
    <CardLayoutHeader>
      <h2 className={styles.header}><Link to={"/stacks/" + stackID + "/devices/" + device.id}>{deviceDNSName || device.address || device.id}</Link></h2>
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
      <span>{latestRecordOfDevice(device.id, EMetricTypes.PING)?.result?.responseTime || -1} ms</span>
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
