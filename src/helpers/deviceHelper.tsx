import { EMetricRecordState, EMetricTypes, IDevice, IMetricRecord } from "models/definitions/backend/device";

/**
 * Returns the record with the given type
 *
 * @param pDevice Device for model data
 * @param pType type of record
 */
export function getMetricRecordByType(pDevice: IDevice, pType: EMetricTypes | string): IMetricRecord | undefined
{
  //todo
  return undefined;
  // if (!pDevice.metricRecords)
  //   return undefined;
  // return _.head(pDevice.metricRecords.filter(pRecord => pRecord.type === pType));
}

/**
 * Returns the color for a given device state
 *
 * @param pRecords records to read
 * @returns {string} color als hex string
 */
export function getStateColor(pRecords?: IMetricRecord[])
{
  if (pRecords === undefined || pRecords.length === 0)
    return "#737373";

  let failed = [];
  let success = [];

  pRecords.forEach(pRecord =>
  {
    if (pRecord.state === EMetricRecordState.SUCCESS)
      success.push(pRecord);
    else
      failed.push(pRecord);
  });

  if (failed.length > 0 && success.length === 0)
    return "#dd0404";
  else if (failed.length > 0 && success.length > 0)
    return "#fffb03";
  else
    return "#4bbf04";
}
