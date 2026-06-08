import { getFlowTableList } from '../shared/flowContext';
import {
  createFrameCheckRowFromSource,
  setFrameCheckRows,
  SOURCE_TABLE_NUM,
  type Fs151_1_1NParameterItem,
} from './parameterDefaults';

export function applyFs151_1_1NInitData(list: Fs151_1_1NParameterItem[]): boolean {
  const tableList = getFlowTableList();
  const sourceTable = tableList.find(item => String(item.tablenum ?? '') === SOURCE_TABLE_NUM);
  const sourceRows = sourceTable?.rowdata ?? [];

  if (sourceRows.length > 0) {
    setFrameCheckRows(list, sourceRows.map(row => createFrameCheckRowFromSource(row)));
  }

  return sourceRows.length > 0;
}
