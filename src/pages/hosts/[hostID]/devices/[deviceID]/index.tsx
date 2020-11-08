import React, {useContext, useEffect, useState} from "react";
import {ACTION_REMOVE_DEVICE, ACTION_UPDATE_DEVICE, HostContext} from "../../../../../context/HostContext";
import {useRouter} from "next/router";
import HostLayout from "../../../../../layouts/HostLayout";
import {INavBarItem} from "../../../../../components/navbar/NavBarItem";
import {mdiArrowLeft} from "@mdi/js";
import CardLayout from "../../../../../layouts/CardLayout";
import styles from "./index.module.scss";
import _ from "lodash";
import {EMetricTypes, IDevice, IMetric} from "../../../../../types/model";
import SwitchButton from "../../../../../components/button/SwitchButton";
import {AuthContext} from "../../../../../context/AuthContext";
import {getMetrics, updateMetric} from "../../../../../rest/MetricsClient";
import {getIcons} from "../../../../../helpers/iconHelper";

const DevicePage = () =>
{
  const {push, query: {hostID, deviceID}} = useRouter()
  const {state: {devices}, dispatch} = useContext(HostContext);
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
      .then(pToken => getMetrics(pToken, deviceID as string)
        .then(pMetrics => setMetrics(pMetrics)))
  }, [getAccessToken, deviceID]);

  // Back to Host - Action
  DevicePage.Items[0].onClick = fnBack;

  const header = (
    <div className={styles.headerContainer}>
      <h1 className={styles.heading}>{device?.address || deviceID}</h1>
      <span className={styles.heading}>{device?.id}</span>
    </div>
  )

  const footer = (
    <div className={styles.footerContainer}>
      <button className={styles.primary} onClick={() =>
      {
        getAccessToken().then(pToken => _.entries(changedMetrics).forEach(pMetric => updateMetric(pToken, deviceID as string, pMetric[1])))
        dispatch(ACTION_UPDATE_DEVICE(changedDeviceProps.id, changedDeviceProps));
        fnBack();
      }}>Save
      </button>
      <div className={styles.spacer}/>
      <button className={styles.destructive} onClick={() =>
      {
        dispatch(ACTION_REMOVE_DEVICE(deviceID as string));
        fnBack();
      }}>Delete Device
      </button>
    </div>
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
          <select defaultValue={device?.icon} onChange={(e) => changedDeviceProps.icon = e.target.value}>
            <option value={""}/>
            {getIcons().map(pIcon => <option key={pIcon}>{pIcon}</option>)}
          </select>
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

DevicePage.Layout = HostLayout;
DevicePage.Items = [{
  alignment: "left",
  children: "Back to Host",
  icon: mdiArrowLeft,
}] as INavBarItem[];
export default DevicePage;
