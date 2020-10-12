interface ILocation {
  x: number,
  y: number,
}

interface IDevice {
  id: string,
  address: string,
  location: ILocation,
}

interface IEdge {
  sourceID: string,
  targetID: string,
}

interface IMetric {
  deviceID: string,
  recordTime: string,
  type: string,
  state: EMetricState,
  stateDescription: string,
  executeCommand: string,
  commandResult: string,
}

enum EMetricState {
  FAILURE,
  WARNING,
  SUCCESS,
  UNKNOWN,
}
