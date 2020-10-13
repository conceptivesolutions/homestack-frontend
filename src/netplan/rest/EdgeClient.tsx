import {IEdge} from "../types/model";

/**
 * Retrieves all edges for a given deviceID
 *
 * @param pDeviceID ID of the device to search for
 */
export async function getEdges(pDeviceID: string): Promise<IEdge[]>
{
  return fetch('/api/devices/' + pDeviceID + '/edges')
    .then(res => res.json());
}

/**
 * Adds an edge between two devices
 *
 * @param pSourceID ID of the source device
 * @param pTargetID ID of the target device
 */
export async function addEdgeBetween(pSourceID: string, pTargetID: string): Promise<Response>
{
  return fetch('/api/devices/' + pSourceID + '/edges', {
    method: 'POST',
    body: pTargetID,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}

/**
 * Removes an edge between two devices
 *
 * @param pSourceID ID of the source device
 * @param pTargetID ID of the target device
 */
export async function removeEdgeBetween(pSourceID: string, pTargetID: string): Promise<Response>
{
  return fetch('/api/devices/' + pSourceID + '/edges/' + pTargetID, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}
