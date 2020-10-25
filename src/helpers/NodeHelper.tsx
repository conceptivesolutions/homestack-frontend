import {EMetricState, IMetric} from "../types/model";


/**
 * Returns the color for a given device state
 *
 * @param pMetrics metrics to read
 * @returns {string} color als hex string
 */
export function getStateColor(pMetrics?: IMetric[])
{
  if (pMetrics === undefined)
    return "#737373";

  let failed = [];
  let success = [];

  pMetrics.forEach(pMetric =>
  {
    if (pMetric.state === EMetricState.SUCCESS)
      success.push(pMetric);
    else
      failed.push(pMetric);
  })

  if (failed.length > 0 && success.length === 0)
    return "#dd0404";
  else if (failed.length > 0 && success.length > 0)
    return "#fffb03";
  else
    return "#4bbf04"
}
