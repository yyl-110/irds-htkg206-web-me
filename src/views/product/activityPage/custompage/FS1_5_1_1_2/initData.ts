import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import {
  createRowFromSourceRow,
  setDesignTableRows,
  SOURCE_TABLE_NUM,
  type Fs151_1_2ParameterItem,
} from './parameterDefaults';

const FLOW_PARAM_MAP: Record<string, number> = {
  FS1_5_1G_BWCCL: 0,
  FS1_5_1G_BWCH: 1,
  FS1_5_1G_JRMWZ: 2,
  FS1_5_1G_JRMCC: 3,
  FS1_5_1G_JRMH: 4,
};

export function applyFs151_1_2InitData(list: Fs151_1_2ParameterItem[]): boolean {
  const tableList = getFlowTableList();
  const sourceTable = tableList.find(item => String(item.tablenum ?? '') === SOURCE_TABLE_NUM);
  const sourceRows = sourceTable?.rowdata ?? [];

  if (sourceRows.length > 0) {
    const rows = sourceRows.map(row => createRowFromSourceRow(row));
    setDesignTableRows(list, rows);
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
