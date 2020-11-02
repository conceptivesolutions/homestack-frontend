import {EMetricTypes, IDevice, IMetricRecord} from "../types/model";
import _ from "lodash";

/**
 * Returns the record with the given type
 *
 * @param pDevice Device for model data
 * @param pType type of record
 */
export function getMetricRecordByType(pDevice: IDevice, pType: EMetricTypes | string): IMetricRecord | undefined
{
  if (!pDevice.metricRecords)
    return undefined;
  return _.head(pDevice.metricRecords.filter(pRecord => pRecord.type === pType))
}
