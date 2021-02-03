import { DELETE, GET, PUT } from "helpers/fetchHelper";
import _ from "lodash";
import { IStack } from "models/definitions/backend/common";
import { IDevice, IMetric } from "models/definitions/backend/device";
import { ISatellite } from "models/definitions/backend/satellite";

type HomeStackBackend = {
  getDevices: (stackID: string) => Promise<IDevice[] | null>,
  getDevice: (deviceID: string) => Promise<IDevice | null>,
  createDevice: (stackID: string, deviceID: string) => Promise<IDevice | null>,
  updateDevice: (device: IDevice) => Promise<IDevice | null>,
  deleteDevice: (deviceID: string) => Promise<void>,
  getStacks: () => Promise<IStack[] | null>,
  getSatellites: (stackID: string) => Promise<ISatellite[] | null>,
  createSatellite: (stackID: string, satelliteID: string) => Promise<ISatellite | null>,
  deleteSatellite: (satelliteID: string) => Promise<void>,
  getMetrics: (deviceID: string) => Promise<IMetric[] | null>,
  updateMetric: (deviceID: string, metric: IMetric) => Promise<IMetric | null>,
  updateSlotTarget: (slotID: string, targetSlotID: string) => Promise<void>,
  deleteSlotConnection: (slotID: string) => Promise<void>,
}

/**
 * Returns the backend for a single user with the given token
 *
 * @param sessionToken token for the user that is currently logged in
 */
export function getHomeStackBackend(sessionToken: string): HomeStackBackend
{
  return {
    getDevices: (stackID) => GET('/api/stacks/' + stackID + '/devices', sessionToken)
      .then(res => res.json())
      .then((pDevices: IDevice[]) => Promise.all(pDevices.map(pDevice => GET('/api/metrics/' + pDevice.id + "/records", sessionToken)
        .then(pResult => pResult.json())
        .then(pRecords => pDevice.metricRecords = pRecords)
        .then(() => pDevice))))
      .then(pDevices => _.sortBy(pDevices, ["address", "id"])),
    getDevice: (deviceID) => GET('/api/devices/' + deviceID, sessionToken)
      .then(res => res.json())
      .then((pDevice: IDevice) => GET('/api/metrics/' + pDevice.id + "/records", sessionToken)
        .then(pResult => pResult.json())
        .then(pRecords => pDevice.metricRecords = pRecords)
        .then(() => pDevice)),
    createDevice: (stackID, deviceID) => PUT('/api/devices/' + deviceID, sessionToken, JSON.stringify({deviceID, stackID}))
      .then(res => res.json()),
    updateDevice: (device) => PUT('/api/devices/' + device.id, sessionToken, JSON.stringify(device))
      .then(res => res.json()),
    deleteDevice: (deviceID) => DELETE('/api/devices/' + deviceID, sessionToken)
      .then(() => {}),
    getStacks: () => GET("/api/stacks", sessionToken)
      .then(pResponse => pResponse.json()),
    getSatellites: (stackID) => GET('/api/stacks/' + stackID + '/satellites', sessionToken)
      .then(pResult => pResult.json()),
    createSatellite: (stackID, satelliteID) => PUT('/api/satellites/' + satelliteID, sessionToken, JSON.stringify({satelliteID, stackID}))
      .then(res => res.json()),
    deleteSatellite: (satelliteID) => DELETE('/api/satellites/' + satelliteID, sessionToken)
      .then(() => {}),
    getMetrics: (deviceID) => GET("/api/metrics/" + deviceID, sessionToken)
      .then(pResult => pResult.json()),
    updateMetric: (deviceID, metric) => PUT("/api/metrics/" + deviceID + "/" + metric.type, sessionToken, JSON.stringify(metric))
      .then(pResult => pResult.json()),
    updateSlotTarget: (slotID, targetSlotID) => PUT("/api/slots/" + slotID + "/target", sessionToken, targetSlotID)
      .then(() => {}),
    deleteSlotConnection: (slotID) => DELETE("/api/slots/" + slotID + "/target", sessionToken)
      .then(() => {}),
  };
}
