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

export interface IMetricRecord
{
  deviceID: string,
  recordTime: string,
  type: string,
  state: EMetricRecordState,
  result?: object,
}

export enum EMetricRecordState
{
  FAILURE = "FAILURE",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  UNKNOWN = "UNKNOWN",
}
