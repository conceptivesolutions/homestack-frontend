import { EMetricRecordState, IMetricRecord } from "models/definitions/backend/device";

/**
 * Returns the color for a given device state
 *
 * @param pRecords records to read
 * @returns {string} color als hex string
 */
export function getStateColor(pRecords?: IMetricRecord[])
{
  let failed = [];
  let warn = [];
  let success = [];

  pRecords?.forEach(pRecord =>
  {
    if (pRecord.state === EMetricRecordState.SUCCESS)
      success.push(pRecord);
    else if (pRecord.state === EMetricRecordState.WARNING)
      warn.push(pRecord);
    else if (pRecord.state === EMetricRecordState.FAILURE)
      failed.push(pRecord);
  });

  if (failed.length === 0 && warn.length === 0 && success.length === 0)
    return "#737373";
  else if (failed.length > 0)
    return "#dd0404";
  else if (warn.length > 0)
    return "#fffb03";
  else
    return "#4bbf04";
}
