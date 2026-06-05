import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import type { SbcModelSummaryRow } from './parameterDefaults';

export const CABIN_COUNT_PARAM_NUM = 'ZT1_4_10_1_SBCSL';
export const CABIN_MODEL_TABLE_NUM = 'ZT1_4_10_1_T_SBCMODEL';

export function readCabinetCountFromFlow(defaultCount = 2): number {
  const paramList = getFlowParameterList();
  const hit = paramList.find(item => item.paramnum === CABIN_COUNT_PARAM_NUM);
  const count = Number(hit?.paramvalue ?? defaultCount);
  if (!Number.isFinite(count) || count < 2) return defaultCount;
  return count;
}

export function readCabinetModelDataFromFlow(): SbcModelSummaryRow[] {
  const tableList = getFlowTableList();
  const hit = tableList.find(item => item.tablenum === CABIN_MODEL_TABLE_NUM);
  return (hit?.rowdata ?? []) as SbcModelSummaryRow[];
}
