import { getFlowTableList } from '../shared/flowContext';
import {
  createRowFromSourceRow,
  setOpeningRows,
  SOURCE_TABLE_NUM,
  type Fs151JParameterItem,
} from './parameterDefaults';

export function applyFs151JInitData(list: Fs151JParameterItem[]): boolean {
  const tableList = getFlowTableList();
  const sourceTable = tableList.find(item => String(item.tablenum ?? '') === SOURCE_TABLE_NUM);
  const sourceRows = sourceTable?.rowdata ?? [];
  if (!sourceRows.length) return false;

  const rows = sourceRows.map(row => createRowFromSourceRow(row));
  setOpeningRows(list, rows);
  return true;
}
