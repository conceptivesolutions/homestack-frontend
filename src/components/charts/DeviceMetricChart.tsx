import {mdiChartLine} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import {AuthContext} from "context/AuthContext";
import {DataPoint, LTD} from "downsample";
import {GET} from "helpers/fetchHelper";
import _ from "lodash";
import React, {useContext, useEffect, useState} from 'react';
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {EMetricTypes, IDevice, IMetricRecord} from "types/model";
import styles from "./DeviceMetricChart.module.scss";

interface IDeviceMetricChart
{
  className?: string,
  device: IDevice,
  metricType: EMetricTypes,
  valueFn: (record: IMetricRecord) => number,
  rangeMs?: number,
  rangeType?: "days" | "hours",
}

const DeviceMetricChart = (props: IDeviceMetricChart) =>
{
  const {state: {getAccessToken}} = useContext(AuthContext);
  const [chartData, setChartData] = useState<DataPoint[]>();
  const {device, metricType, valueFn} = props;

  useEffect(() =>
  {
    const update = () =>
    {
      const currentDevice = device.id;
      _getData(getAccessToken, device, metricType, valueFn, Date.now() - (props.rangeMs || 60 * 60 * 1000), Date.now())
        .then(pRecords => currentDevice === device.id && setChartData(pRecords))
        .catch(() => currentDevice === device.id && setChartData([]))
    }
    update(); // initial
    const interval = setInterval(update, 2000)
    return () => clearInterval(interval)
  }, [getAccessToken, device.id, metricType, valueFn]);

  return <div className={styles.outterContainer}>
    <ResponsiveContainer minWidth={0} minHeight={0} width={"100%"} height={200} className={classNames(props.className, styles.container)}>
      {!_.isEmpty(chartData) ?
        <AreaChart className={styles.graph} data={chartData} margin={{left: -25, right: 5, top: 5, bottom: 5}}>
          <XAxis dataKey={"x"} tickFormatter={_formatTick(props.rangeType)}/>
          <YAxis dataKey={"y"}/>
          <CartesianGrid stroke={"#eee"}/>
          <Area type={"monotone"} dataKey={"y"} isAnimationActive={false} dot={false}/>
        </AreaChart> :
        <Icon className={styles.noData} path={mdiChartLine}/>}
    </ResponsiveContainer>
  </div>
};

/**
 * Creates the formatter for the x-axis-ticks
 *
 * @param rangeType type of range
 */
function _formatTick(rangeType?: "days" | "hours"): (value: any, index: number) => string
{
  return (unixTime) =>
  {
    if (rangeType === "days")
      return new Date(unixTime).toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
      })
    return new Date(unixTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

/**
 * Returns a promise with the current displayable data
 *
 * @param getAccessToken function to retrieve the current access token
 * @param device device to query
 * @param metricType type of metric to query
 * @param valueFn function to extract the y value for the chart
 * @param from timestamp in ms
 * @param to timestamp in ms
 */
function _getData(getAccessToken: () => Promise<string>, device: IDevice, metricType: EMetricTypes, valueFn: (record: IMetricRecord) => number,
                  from: number, to: number): Promise<DataPoint[]>
{
  return getAccessToken()
    .then(pToken => GET("/api/metrics/" + device.id + "/records/" + metricType + "?from=" + from + "&to=" + to, pToken))
    .then(pRecords => pRecords.json() as Promise<IMetricRecord[]>)
    .then(pRecords => pRecords
      .map(pRecord => ({
        x: new Date(pRecord.recordTime.substring(0, pRecord.recordTime.length - 5)),
        y: valueFn(pRecord) || 0,
      })))
    .then(pRecords => _.sortBy(pRecords, "x"))
    .then(pRecords => LTD(pRecords, 100))
}

export default DeviceMetricChart;
