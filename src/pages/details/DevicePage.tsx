import { CardLayout, CardLayoutFooter, CardLayoutHeader } from "components/base/layouts/CardLayout";
import _ from "lodash";
import { EMetricTypes, IDevice, IMetric, IMetricRecord } from "models/definitions/backend/device";
import { useActiveStack, useBackend } from "models/states/DataState";
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Button, Checkbox, Form, Loader } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { getIcons } from "../../helpers/iconHelper";
import { ApproveDestructiveModal } from "../../modals/CommonModals";
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

const DevicePageWithData: React.VFC<PageWithData> = ({ device: initialData, records, onDelete, onSave }) =>
{
  const [device, setDevice] = useState<IDevice>({ ...initialData });
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const deviceDNSName = device && (_.head(records.filter(pRecord => pRecord.type === EMetricTypes.REVERSE_DNS))?.result?.name);
  const changedMetrics: { [t: string]: IMetric } = {};

  const header = (
    <CardLayoutHeader>
      <h1>{deviceDNSName || device.address || device.id}</h1>
      {(deviceDNSName || device.address) && <span>{device.id}</span>}
    </CardLayoutHeader>
  );

  const footer = (
    <CardLayoutFooter>
      <Button positive>Save</Button>
      <div className={styles.spacer}/>
      <ApproveDestructiveModal trigger={<Button negative type="button">Delete Device</Button>} title={"Delete Device?"} onProceed={onDelete}>
        Do you really want to permanently delete this device?<br/>
        This action can not be undone and results in loosing all device related data!<br/>
        <pre>
          id: {device.id}<br/>
          dns: {deviceDNSName}<br/>
          address: {device.address}<br/>
        </pre>
      </ApproveDestructiveModal>
    </CardLayoutFooter>
  );

  // validate if object changes
  useEffect(() => setErrors(_validate(device)), [device]);

  return <Form onSubmit={() => _validate(device) && onSave(changedMetrics, device)} className={styles.container}>
    <CardLayout header={header} footer={footer}>
      <div className={styles.innerContainer}>
        {/* Common */}
        <Form.Group>
          <Form.Dropdown label={"Icon"} width={4} name={"icon"} error={errors.get("icon")}
                         options={getIcons().map(pIcon => ({ key: pIcon, text: pIcon, value: pIcon }))}
                         defaultValue={device?.icon}
                         selection onChange={(e, data) => setDevice({ ...device, icon: (data?.value as string) })}/>
          <Form.Input label={"Address"} width={12} name={"address"} error={errors.get("address")} defaultValue={device.address}
                      onChange={(e, data) => setDevice({ ...device, address: (data?.value as string) })}/>
        </Form.Group>
      </div>

      <div className={styles.innerContainer}>
        {/* Metrics */}
        <Form.Group>
          {_createMetricRow("DNS", EMetricTypes.REVERSE_DNS, changedMetrics, device.id, device.metrics || [])}
          {_createMetricRow("Ping", EMetricTypes.PING, changedMetrics, device.id, device.metrics || [])}
        </Form.Group>
      </div>
    </CardLayout>
  </Form>;
};

function _validate(verifyObj: IDevice): Map<string, string>
{
  const currentErrors = new Map<string, string>();

  // validate address
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!verifyObj.address || !ipRegex.test(verifyObj.address))
    currentErrors.set("address", "Not a valid IP address");

  return currentErrors;
}

function _createMetricRow(name: string, type: EMetricTypes, changedMetrics: { [t: string]: IMetric }, deviceID: string, allMetrics: IMetric[])
{
  const myMetric: IMetric = _.head(allMetrics.filter(pMetric => pMetric.type.toLowerCase() === type.toLowerCase())) || {
    id: uuid(),
    type,
    deviceID,
    enabled: false,
  } as IMetric;

  return <Form.Field width={"2"}>
    <label>{name}</label>
    <Checkbox toggle defaultChecked={myMetric.enabled} onClick={(e, { checked }) =>
    {
      myMetric.enabled = checked || false;
      changedMetrics[type] = myMetric;
    }}/>
  </Form.Field>;
}