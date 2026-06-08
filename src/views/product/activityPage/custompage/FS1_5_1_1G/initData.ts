import { getFlowTableList } from '../shared/flowContext';
import {
  createMaterialRowFromSource,
  setMaterialTableRows,
  SOURCE_TABLE_NUMS,
  type Fs151_1GParameterItem,
} from './parameterDefaults';

export function applyFs151_1GInitData(list: Fs151_1GParameterItem[]): boolean {
  const tableList = getFlowTableList();
  const sourceRows: Array<Record<string, string | number | undefined>> = [];

  tableList.forEach(item => {
    const tableNum = String(item.tablenum ?? '');
    if (SOURCE_TABLE_NUMS.includes(tableNum)) {
      sourceRows.push(...(item.rowdata ?? []));
    }
  });

  if (sourceRows.length <= 0) return false;

  const rows = sourceRows.map((row, index) => createMaterialRowFromSource(row, index + 1));
  setMaterialTableRows(list, rows);
  return true;
}
