import {IMetricRecord} from "../types/model";

/**
 * Retrieves all metric records for the given device
 *
 * @param pToken AccessToken for the backend
 * @param pDeviceID ID of the device
 */
export async function getMetricRecords(pToken: string, pDeviceID: string): Promise<IMetricRecord[]>
{
  return fetch('/api/metrics/' + pDeviceID + "/records", {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json());
}
