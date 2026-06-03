import { deepCopy, isValid } from '@/api/flowData/flowData';
import {
  createFallbackBaseRowData,
  createFallbackCommRowData,
  type Page0_1ParameterItem,
} from '../config/page0_1ParameterDefaults';

interface FlowTableItem {
  tablenum?: string;
  rowdata?: Array<Record<string, string>>;
}

function getFlowTableList(): FlowTableItem[] {
  return [];
}

export function applyFreshData(parameterTempList: Page0_1ParameterItem[]) {
  const flowTables = getFlowTableList();
  const baseTable = parameterTempList[1]?.tableMap;
  const workTable = parameterTempList[2]?.tableMap;
  const commTable = parameterTempList[3]?.tableMap;
  const fuxiangTable = parameterTempList[4]?.tableMap;
  if (!baseTable || !workTable || !commTable || !fuxiangTable) return;

  let obj = flowTables.find(x => x.tablenum === 'DJ0_BASEPARAMS');
  if (obj?.rowdata) {
    baseTable.rowData = deepCopy(obj.rowdata);
  }
  if (
    !isValid(obj) ||
    !isValid(parameterTempList[0]) ||
    !isValid(obj?.rowdata) ||
    !isValid(baseTable.rowData)
  ) {
    baseTable.rowData = createFallbackBaseRowData();
    commTable.rowData = createFallbackCommRowData();
    return;
  }

  obj = flowTables.find(x => x.tablenum === 'DJ0_WORKPARAMS');
  if (obj?.rowdata) {
    workTable.rowData = deepCopy(obj.rowdata);
  }
  obj = flowTables.find(x => x.tablenum === 'DJ0_COMMPARAMS');
  if (obj?.rowdata) {
    commTable.rowData = deepCopy(obj.rowdata);
  }
  obj = flowTables.find(x => x.tablenum === 'DJ0_XIANGPINPARAMS');
  if (obj?.rowdata) {
    fuxiangTable.rowData = deepCopy(obj.rowdata);
  }
}
