import {IMetric, IMetricRecord} from "../types/model";

/**
 * Retrieves all metrics for the given device
 *
 * @param pToken AccessToken for the backend
 * @param pDeviceID ID of the device
 */
export async function getMetrics(pToken: string, pDeviceID: string): Promise<IMetric[]>
{
  return fetch("/api/metrics/" + pDeviceID, {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json())
}

/**
 * Inserts / Overrides the metric with the given type
 *
 * @param pToken AccessToken for the backend
 * @param pDeviceID ID of the device
 * @param pMetric Metric with updated states
 */
export async function updateMetric(pToken: string, pDeviceID: string, pMetric: IMetric): Promise<void>
{
  return fetch("/api/metrics/" + pDeviceID + "/" + pMetric.type, {
    method: 'PUT',
    body: JSON.stringify(pMetric),
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
}

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
