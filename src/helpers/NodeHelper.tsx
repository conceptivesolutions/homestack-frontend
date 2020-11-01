import {EMetricRecordState, IMetricRecord} from "../types/model";


/**
 * Returns the color for a given device state
 *
 * @param pRecords records to read
 * @returns {string} color als hex string
 */
export function getStateColor(pRecords?: IMetricRecord[])
{
  if (pRecords === undefined)
    return "#737373";

  let failed = [];
  let success = [];

  pRecords.forEach(pRecord =>
  {
    if (pRecord.state === EMetricRecordState.SUCCESS)
      success.push(pRecord);
    else
      failed.push(pRecord);
  })

  if (failed.length > 0 && success.length === 0)
    return "#dd0404";
  else if (failed.length > 0 && success.length > 0)
    return "#fffb03";
  else
    return "#4bbf04"
}
