export interface ILocation
{
  x: number,
  y: number,
}

export interface IDevice
{
  id: string,
  address?: string,
  location?: ILocation,
}

export interface IEdge
{
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
