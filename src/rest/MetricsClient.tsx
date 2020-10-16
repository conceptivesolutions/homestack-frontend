import {IMetric} from "../types/model";

/**
 * Retrieves all metrics for the given device
 *
 * @param pToken AccessToken for the backend
 * @param pDeviceID ID of the device
 */
export async function getMetrics(pToken: string, pDeviceID: string): Promise<IMetric[]>
{
  return fetch('/api/metrics/' + pDeviceID, {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json());
}
