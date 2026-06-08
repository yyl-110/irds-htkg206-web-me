import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import {
  createFrameRowFromSource,
  setFrameTableRows,
  SOURCE_TABLE_NUM,
  type Fs151_1_9ParameterItem,
} from './parameterDefaults';

const FLOW_PARAM_MAP: Record<string, number> = {
  FS6_100_001_YD1: 0,
  FS1_5_1_1A_WMPNJ: 1,
  FS1_5_1_1C_NMPWJ: 2,
  FS6_100_001_ND1: 3,
};

export function applyFs151_1_9InitData(list: Fs151_1_9ParameterItem[]): boolean {
  const tableList = getFlowTableList();
  const sourceTable = tableList.find(item => String(item.tablenum ?? '') === SOURCE_TABLE_NUM);
  const sourceRows = sourceTable?.rowdata ?? [];

  if (sourceRows.length > 0) {
    const rows = sourceRows.map(row => createFrameRowFromSource(row));
    setFrameTableRows(list, rows);
  }

  const paramList = getFlowParameterList();
  if (paramList.length > 0) {
    paramList.forEach(item => {
      const idx = FLOW_PARAM_MAP[String(item.paramnum ?? '')];
      if (idx == null) return;
      if (list[idx]) {
        list[idx].defaultValue = String(item.paramvalue ?? '');
      }
    });
  }

  return sourceRows.length > 0 || paramList.length > 0;
}
