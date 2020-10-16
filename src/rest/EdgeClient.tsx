import {IEdge} from "../types/model";

/**
 * Retrieves all edges for a given deviceID
 *
 * @param pToken AccessToken for the backend
 * @param pDeviceID ID of the device to search for
 */
export async function getEdges(pToken: string, pDeviceID: string): Promise<IEdge[]>
{
  return fetch('/api/devices/' + pDeviceID + '/edges', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json());
}

/**
 * Adds an edge between two devices
 *
 * @param pToken AccessToken for the backend
 * @param pSourceID ID of the source device
 * @param pTargetID ID of the target device
 */
export async function addEdgeBetween(pToken: string, pSourceID: string, pTargetID: string): Promise<Response>
{
  return fetch('/api/devices/' + pSourceID + '/edges', {
    method: 'POST',
    body: pTargetID,
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}

/**
 * Removes an edge between two devices
 *
 * @param pToken AccessToken for the backend
 * @param pSourceID ID of the source device
 * @param pTargetID ID of the target device
 */
export async function removeEdgeBetween(pToken: string, pSourceID: string, pTargetID: string): Promise<Response>
{
  return fetch('/api/devices/' + pSourceID + '/edges/' + pTargetID, {
    method: 'DELETE',
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}
