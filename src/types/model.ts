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
  metrics?: IMetric[],
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
  recordTime: string,
  type: string,
  state: EMetricState,
  stateDescription: string,
  executeCommand: string,
  commandResult: string,
}

export enum EMetricState
{
  FAILURE = "FAILURE",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  UNKNOWN = "UNKNOWN",
}