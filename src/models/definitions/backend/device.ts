import { ILocation } from "models/definitions/backend/common";

export interface IDevice
{
  id: string,
  stackID?: string,
  icon?: string,
  address?: string,
  location?: ILocation,
  metricRecords?: IMetricRecord[],
  slots?: INetworkSlot[][],
}

export interface INetworkSlot
{
  id: string,
  targetSlotID?: string,
  state?: ESlotState,
}

export enum ESlotState
{
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  DISABLED = "DISABLED"
}

export interface IMetric
{
  deviceID: string,
  type: EMetricTypes | string,
  enabled: boolean,
  settings?: any,
}

export interface IMetricRecord
{
  deviceID: string,
  recordTime: string,
  type: EMetricTypes | string,
  state: EMetricRecordState,
  result?: any,
}

export enum EMetricTypes
{
  PING = "ping",
  REVERSE_DNS = "reverse-dns"
}

export enum EMetricRecordState
{
  FAILURE = "FAILURE",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  UNKNOWN = "UNKNOWN",
}
