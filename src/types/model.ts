export interface IHost
{
  id: string,
  displayName?: string,
}

export interface ILocation
{
  x: number,
  y: number,
}

export interface IDevice
{
  id: string,
  hostID?: string,
  icon?: string,
  address?: string,
  location?: ILocation,
  metricRecords?: IMetricRecord[],
  edges?: IEdge[],
}

export interface IEdge
{
  id: string,
  sourceID: string,
  targetID: string,
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
