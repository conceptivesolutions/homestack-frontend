import {IDevice} from "../types/model";

/**
 * Returns all devices from remote server
 */
export async function getAllDevices(): Promise<IDevice[]>
{
  return fetch('/api/devices')
    .then(res => res.json());
}

/**
 * Creates a new device with the given ID
 *
 * @param pID ID of the device to create
 */
export async function createDevice(pID: string): Promise<IDevice>
{
  const dev: IDevice = {
    id: pID,
  }
  return fetch('/api/devices/' + pID, {
    method: 'PUT',
    body: JSON.stringify(dev),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json());
}

/**
 * Searches a single device with the given ID
 *
 * @param pID ID to search for
 */
export async function getDeviceByID(pID: string): Promise<IDevice>
{
  return fetch('/api/devices/' + pID)
    .then(res => res.json());
}

/**
 * Updates the given device on remote
 *
 * @param pID ID of the device that should be updated
 * @param pDevice Device that should be updated
 */
export async function updateDevice(pID: string, pDevice: IDevice): Promise<IDevice>
{
  return fetch('/api/devices/' + pID, {
    method: 'PATCH',
    body: JSON.stringify(pDevice),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json());
}

/**
 * Deletes the given device
 *
 * @param pID ID of the device to delete
 */
export async function deleteDevice(pID: string): Promise<Response>
{
  return fetch('/api/devices/' + pID, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}
