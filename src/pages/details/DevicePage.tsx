import { ToggleButton } from "components/base/button/ToggleButton";
import { CardLayout, CardLayoutFooter, CardLayoutHeader } from "components/base/layouts/CardLayout";
import { Loading } from "components/base/Loading";
import { getIcons } from "helpers/iconHelper";
import _ from "lodash";
import { EMetricTypes, IDevice, IMetric, IMetricRecord } from "models/definitions/backend/device";
import { useBackend } from "models/states/DataState";
import { ErrorPage } from "pages/ErrorPage";
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import Select from "react-select";
import { v4 as uuid } from "uuid";
import styles from "./DevicePage.module.scss";

export const DevicePage: React.VFC = () => {
  const { id: stackID, deviceID } = useParams<{ id: string, deviceID: string }>();
  const { getDevice, deleteDevice, updateDevice, updateMetric, getLatestRecords } = useBackend();
  const [device, setDevice] = useState<IDevice | null>();
  const [records, setRecords] = useState<IMetricRecord[] | null>();
  const { push } = useHistory();

  useEffect(() =>
  {
    // Load Device
    getDevice(stackID, deviceID)
      .then(setDevice)
      .catch(() => setDevice(null));

    // Load Record
    getLatestRecords(stackID)
      .then(pRecords => pRecords?.filter(pRecord => pRecord.deviceID === deviceID))
      .then(setRecords)
      .catch(() => setRecords(null));
  }, [getDevice, getLatestRecords, deviceID, stackID]);

  // undefined = loading
  if (device === undefined)
    return <Loading size={10}/>;

  // null = not found
  if (device === null)
    return <ErrorPage/>;

  // found
  return <DevicePageWithData device={device} records={records || []}
                             onDelete={() => deleteDevice(stackID, deviceID)
                               .then(() => push("/stacks/" + stackID))}
                             onSave={((changedMetrics, changedDevice) => updateDevice(stackID, changedDevice)
                               .then(() => Promise.all(_.entries(changedMetrics).map(pMetric => updateMetric(stackID, deviceID, pMetric[1]))))
                               .then(() => push("/stacks/" + stackID)))}/>;
};

type PageWithData = {
  device: IDevice,
  records: IMetricRecord[],
  onDelete: () => void,
  onSave: (changedMetrics: { [t: string]: IMetric }, changedDevice: IDevice) => void
}

const DevicePageWithData: React.VFC<PageWithData> = ({ device, records, onDelete, onSave }) =>
{
  const deviceDNSName = device && (_.head(records.filter(pRecord => pRecord.type === EMetricTypes.REVERSE_DNS))?.result?.name);
  const changedMetrics: { [t: string]: IMetric } = {};
  const changedDevice: IDevice = {
    ...device,
  };

  const header = (
    <CardLayoutHeader>
      <h1>{deviceDNSName || device.address}</h1>
      <span>{device.id}</span>
    </CardLayoutHeader>
  );

  const footer = (
    <CardLayoutFooter>
      <button className={styles.primary} onClick={() => onSave(changedMetrics, changedDevice)}>Save</button>
      <div className={styles.spacer}/>
      <button className={styles.destructive} onClick={onDelete}>Delete Device</button>
    </CardLayoutFooter>
  );

  return <CardLayout header={header} footer={footer} className={styles.container}>
    <table className={styles.contentTable}>
      <tbody>
      <tr>
        <td>Address</td>
        <td>
          <input defaultValue={device?.address} onChange={e => changedDevice.address = e.target.value}/>
        </td>
      </tr>
      <tr>
        <td>Icon</td>
        <td>
          <Select options={getIcons().map(pIcon => ({value: pIcon, label: pIcon}))}
                  defaultValue={{value: device?.icon, label: device?.icon}}
                  onChange={(e) => changedDevice.icon = e?.value}/>
        </td>
      </tr>
      </tbody>
    </table>
    <table className={styles.contentTable}>
      <tbody>
      {_createMetricRow("Ping", EMetricTypes.PING, changedMetrics, device.id, device.metrics || [])}
      {_createMetricRow("DNS", EMetricTypes.REVERSE_DNS, changedMetrics, device.id, device.metrics || [])}
      </tbody>
    </table>
  </CardLayout>;
};

function _createMetricRow(name: string, type: EMetricTypes, changedMetrics: { [t: string]: IMetric }, deviceID: string, allMetrics: IMetric[])
{
  const myMetric: IMetric = _.head(allMetrics.filter(pMetric => pMetric.type.toLowerCase() === type.toLowerCase())) || {
    id: uuid(),
    type,
    deviceID,
    enabled: false,
  } as IMetric;

  return <tr>
    <td>{name}</td>
    <td>
      <ToggleButton value={myMetric.enabled} onValueChange={(isOn) =>
      {
        myMetric.enabled = isOn;
        changedMetrics[type] = myMetric;
      }}/>
    </td>
  </tr>;
}
