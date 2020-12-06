import {mdiArrowLeft} from "@mdi/js";
import {ACTION_REMOVE_DEVICE, ACTION_UPDATE_DEVICE, StackContext} from "context/StackContext";
import StackLayout from "layouts/StackLayout";
import _ from "lodash";
import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import Select from "react-select";
import SwitchButton from "../../../../../components/button/SwitchButton";
import {INavBarItem} from "../../../../../components/navbar/NavBarItem";
import {AuthContext} from "../../../../../context/AuthContext";
import {getMetricRecordByType} from "../../../../../helpers/deviceHelper";
import {GET, PUT} from "../../../../../helpers/fetchHelper";
import {getIcons} from "../../../../../helpers/iconHelper";
import CardLayout, {CardLayoutFooter, CardLayoutHeader} from "../../../../../layouts/CardLayout";
import {EMetricTypes, IDevice, IMetric} from "../../../../../types/model";
import styles from "./index.module.scss";

const DevicePage = () =>
{
  const {push, query: {hostID, deviceID}} = useRouter()
  const {state: {devices}, dispatch} = useContext(StackContext);
  const {state: {getAccessToken}} = useContext(AuthContext)
  const [metrics, setMetrics] = useState<any>();
  const device = _.head(devices?.filter(pDevice => pDevice.id === deviceID));
  const fnBack = () => push("/hosts/" + hostID);
  const changedDeviceProps: IDevice = {
    id: deviceID as string,
  };
  const changedMetrics: { [type: string]: IMetric } = {};

  // Load all Metrics
  useEffect(() =>
  {
    getAccessToken()
      .then(pToken => GET("/api/metrics/" + deviceID, pToken))
      .then(pResult => pResult.json())
      .then(pMetrics => setMetrics(pMetrics))
  }, [getAccessToken, deviceID]);

  // Back to Host - Action
  DevicePage.Items[0].onClick = fnBack;

  const deviceDNSName = device && (getMetricRecordByType(device, EMetricTypes.REVERSE_DNS)?.result?.name);
  const header = (
    <CardLayoutHeader>
      <h1>{deviceDNSName || device?.address || deviceID}</h1>
      <span>{device?.id}</span>
    </CardLayoutHeader>
  )

  const footer = (
    <CardLayoutFooter>
      <button className={styles.primary} onClick={() => getAccessToken()
        .then(pToken => _.entries(changedMetrics)
          .forEach(pMetric => PUT("/api/metrics/" + deviceID + "/" + pMetric[1].type, pToken, JSON.stringify(pMetric[1]))))
        .then(() => dispatch(ACTION_UPDATE_DEVICE(changedDeviceProps.id, changedDeviceProps, fnBack)))}>Save
      </button>
      <div className={styles.spacer}/>
      <button className={styles.destructive} onClick={() => dispatch(ACTION_REMOVE_DEVICE(deviceID as string, fnBack))}>Delete Device</button>
    </CardLayoutFooter>
  )

  return <CardLayout header={header} footer={footer}>
    <table className={styles.contentTable}>
      <tbody>
      <tr>
        <td>Address</td>
        <td>
          <input defaultValue={device?.address} onChange={e => changedDeviceProps.address = e.target.value}/>
        </td>
      </tr>
      <tr>
        <td>Icon</td>
        <td>
          <Select options={getIcons().map(pIcon => ({value: pIcon, label: pIcon}))}
                  defaultValue={{value: device?.icon, label: device?.icon}}
                  onChange={(e) =>
                  {
                    // @ts-ignore
                    changedDeviceProps.icon = e?.value
                  }}/>
        </td>
      </tr>
      </tbody>
    </table>
    <table className={styles.contentTable}>
      <tbody>
      {_createMetricRow("Ping", EMetricTypes.PING, changedMetrics, deviceID as string, metrics)}
      {_createMetricRow("DNS", EMetricTypes.REVERSE_DNS, changedMetrics, deviceID as string, metrics)}
      </tbody>
    </table>
  </CardLayout>
}

function _createMetricRow(name: string, type: EMetricTypes, changedMetrics: { [type: string]: IMetric }, deviceID?: string, allMetrics?: IMetric[])
{
  const myMetric: IMetric = _.head(allMetrics?.filter(pMetric => pMetric.type === type)) || {
    type,
    deviceID,
    enabled: false,
  } as IMetric;

  return <tr>
    <td>{name}</td>
    <td>
      <SwitchButton value={myMetric.enabled} onValueChange={(isOn) =>
      {
        myMetric.enabled = isOn;
        changedMetrics[type] = myMetric;
      }}/>
    </td>
  </tr>
}

DevicePage.Layout = StackLayout;
DevicePage.Items = [{
  alignment: "left",
  children: "Back to Host",
  icon: mdiArrowLeft,
}] as INavBarItem[];
export default DevicePage;
