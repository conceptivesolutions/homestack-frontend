import { GraphQLClient } from 'graphql-request'
import { loader } from "graphql.macro";
import _ from "lodash";
import { IStack } from "models/definitions/backend/common";
import { IDevice, IMetric } from "models/definitions/backend/device";
import { ISatellite, ISatelliteLease } from "models/definitions/backend/satellite";

type HomeStackBackend = {
  getStacks: () => Promise<IStack[] | null>,
  getDevices: (stackID: string) => Promise<IDevice[] | null>,
  getDevice: (stackID: string, deviceID: string) => Promise<IDevice | null>,
  createDevice: (stackID: string, deviceID: string) => Promise<IDevice | null>,
  updateDevice: (stackID: string, device: IDevice) => Promise<IDevice | null>,
  deleteDevice: (stackID: string, deviceID: string) => Promise<void>,
  getSatellites: (stackID: string) => Promise<ISatellite[] | null>,
  getSatellite: (stackID: string, satelliteID: string) => Promise<ISatellite | null>,
  createSatellite: (stackID: string, satelliteID: string) => Promise<ISatellite | null>,
  deleteSatellite: (stackID: string, satelliteID: string) => Promise<void>,
  generateLease: (stackID: string, satelliteID: string) => Promise<ISatelliteLease | null>,
  revokeLease: (stackID: string, satelliteID: string, leaseID: string) => Promise<void>,
  updateMetric: (stackID: string, deviceID: string, metric: IMetric) => Promise<void>,
}

/**
 * Returns the backend for a single user with the given token
 *
 * @param sessionToken token for the user that is currently logged in
 */
export function getHomeStackBackend(sessionToken: string): HomeStackBackend
{
  const client = new GraphQLClient("/api/graphql", {
    headers: {
      authorization: 'Bearer ' + sessionToken,
    },
  })

  return {
    getStacks: () => client.request(loader("./gql/getStacks.gql"))
      .then(data => data.stacks),

    getDevices: (stackID) => client.request(loader("./gql/getDevicesByStackID.gql"), { stackID })
      .then(data => data.stack.devices)
      .then((pDevices: IDevice[]) => _.forEach(pDevices, pDev => pDev.stackID = stackID))
      .then(pDevices => _.sortBy(pDevices, ["address", "id"])),

    getDevice: (stackID, deviceID) => client.request(loader("./gql/getDeviceByID.gql"), { stackID, deviceID })
      .then(data => data.device)
      .then(pDev => {
        pDev.stackID = stackID;
        return pDev;
      }),

    createDevice: (stackID, deviceID) => client.request(loader("./gql/upsertDevice.gql"), {
        stackID,
        device: {
          id: deviceID,
        },
      })
      .then(data => data.upsertDevice)
      .then(pDev => {
        pDev.stackID = stackID;
        return pDev;
      }),

    updateDevice: (stackID, device) => client.request(loader("./gql/upsertDevice.gql"), {
        stackID,
        device: {
          id: device.id,
          address: device.address,
          icon: device.icon,
          location: device.location,
          slots: device.slots
        },
      })
      .then(data => data.upsertDevice)
      .then(pDev => {
        pDev.stackID = stackID;
        return pDev;
      }),

    deleteDevice: (stackID, deviceID) => client.request(loader("./gql/deleteDevice.gql"), { stackID, deviceID }),

    getSatellites: (stackID) => client.request(loader("./gql/getSatellitesByStackID.gql"), { stackID })
      .then(data => _.flatMap(data.stacks, pStack => pStack.satellites))
      .then(pSatellites => _.sortBy(pSatellites, ["id"])),

    getSatellite: (stackID, satelliteID) => client.request(loader("./gql/getSatelliteByID.gql"), { stackID, satelliteID })
      .then(data => data.satellite),

    createSatellite: (stackID, satelliteID) => client.request(loader("./gql/upsertSatellite.gql"), {
        stackID,
        satellite: {
          id: satelliteID
        }
      })
      .then(data => data.createSatellite),

    deleteSatellite: (stackID, satelliteID) => client.request(loader("./gql/deleteSatellite.gql"), { stackID, satelliteID }),

    generateLease: (stackID, satelliteID) => client.request(loader("./gql/createLease.gql"), { satelliteID })
      .then(data => data.createLease),

    revokeLease: (stackID, satelliteID, leaseID) => client.request(loader("./gql/revokeLease.gql"), { satelliteID, leaseID })
      .then(data => data.createLease),

    updateMetric: (stackID, deviceID, metric) => client.request(loader("./gql/upsertMetric.gql"), {
      deviceID,
      metric: {
        id: metric.id,
        enabled: metric.enabled,
        settings: metric.settings,
        type: metric.type
      }
    }),
  };
}
