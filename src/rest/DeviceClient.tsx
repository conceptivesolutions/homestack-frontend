import {IDevice} from "../types/model";

/**
 * Returns all devices from remote server
 *
 * @param pToken AccessToken for the backend
 * @param pHostID ID of the host to retrieve all devices for
 */
export async function getAllDevices(pToken: string, pHostID: string): Promise<IDevice[]>
{
  return fetch('/api/devices?host=' + pHostID, {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json());
}

/**
 * Creates a new device with the given ID
 *
 * @param pToken AccessToken for the backend
 * @param pID ID of the device to create
 * @param pHostID ID of the host where the given device should be created
 */
export async function createDevice(pToken: string, pID: string, pHostID: string): Promise<IDevice>
{
  const dev: IDevice = {
    id: pID,
    hostID: pHostID,
  }
  return fetch('/api/devices/' + pID, {
    method: 'PUT',
    body: JSON.stringify(dev),
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json());
}

/**
 * Searches a single device with the given ID
 *
 * @param pToken AccessToken for the backend
 * @param pID ID to search for
 */
export async function getDeviceByID(pToken: string, pID: string): Promise<IDevice>
{
  return fetch('/api/devices/' + pID, {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json());
}

/**
 * Updates the given device on remote
 *
 * @param pToken AccessToken for the backend
 * @param pID ID of the device that should be updated
 * @param pDevice Device that should be updated
 */
export async function updateDevice(pToken: string, pID: string, pDevice: IDevice): Promise<IDevice>
{
  return fetch('/api/devices/' + pID, {
    method: 'PATCH',
    body: JSON.stringify(pDevice),
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json());
}

/**
 * Deletes the given device
 *
 * @param pToken AccessToken for the backend
 * @param pID ID of the device to delete
 */
export async function deleteDevice(pToken: string, pID: string): Promise<Response>
{
  return fetch('/api/devices/' + pID, {
    method: 'DELETE',
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}
