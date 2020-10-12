import {IMetric} from "../types/model";

/**
 * Retrieves all metrics for the given device
 *
 * @param pDeviceID ID of the device
 */
export async function getMetrics(pDeviceID: string): Promise<IMetric[]>
{
  return fetch('/api/metrics/' + pDeviceID)
    .then(res => res.json());
}
