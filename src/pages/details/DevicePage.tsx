import { CardLayout, CardLayoutFooter, CardLayoutHeader } from "components/base/layouts/CardLayout";
import { getIcons } from "helpers/iconHelper";
import _ from "lodash";
import { EMetricTypes, IDevice, IMetric, IMetricRecord } from "models/definitions/backend/device";
import { useActiveStack, useBackend } from "models/states/DataState";
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Button, Checkbox, Dropdown, Input, Loader } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { ErrorPage } from "../ErrorPage";
import styles from "./DevicePage.module.scss";

export const DevicePage: React.VFC = () =>
{
  const { id: stackID, deviceID } = useParams<{ id: string, deviceID: string }>();
  const { getDevice, deleteDevice, updateDevice, updateMetric, getLatestRecords } = useBackend();
  const { reload } = useActiveStack();
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
    return <Loader active/>;

  // null = not found
  if (device === null)
    return <ErrorPage/>;

  // found
  return <DevicePageWithData device={device} records={records || []}
                             onDelete={() => deleteDevice(stackID, deviceID)
                               .then(reload)
                               .then(() => push("/stacks/" + stackID))}
                             onSave={((changedMetrics, changedDevice) => updateDevice(stackID, changedDevice)
                               .then(() => Promise.all(_.entries(changedMetrics).map(pMetric => updateMetric(stackID, deviceID, pMetric[1]))))
                               .then(reload)
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
      <h1>{deviceDNSName || device.address || device.id}</h1>
      {(deviceDNSName || device.address) && <span>{device.id}</span>}
    </CardLayoutHeader>
  );

  const footer = (
    <CardLayoutFooter>
      <Button positive onClick={() => onSave(changedMetrics, changedDevice)}>Save</Button>
      <div className={styles.spacer}/>
      <Button negative onClick={onDelete}>Delete Device</Button>
    </CardLayoutFooter>
  );

  return <CardLayout header={header} footer={footer} className={styles.container}>
    <table className={styles.contentTable}>
      <tbody>
      <tr>
        <td>Address</td>
        <td>
          <Input defaultValue={device?.address} onChange={e => changedDevice.address = e.target.value}/>
        </td>
      </tr>
      <tr>
        <td>Icon</td>
        <td>
          <Dropdown options={getIcons().map(pIcon => ({ key: pIcon, text: pIcon, value: pIcon }))}
                    defaultValue={device?.icon}
                    fluid selection onChange={(e, data) => changedDevice.icon = data?.text}/>
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
      <Checkbox toggle defaultChecked={myMetric.enabled} onClick={(e, { checked }) =>
      {
        myMetric.enabled = checked || false;
        changedMetrics[type] = myMetric;
      }}/>
    </td>
  </tr>;
}
