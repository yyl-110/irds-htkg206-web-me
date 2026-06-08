import { getTabledataByTablenumTaskid } from '@/api/flowData/flowData';
import { globaluserId } from '@/views/product/activityPage/custompage/_shared/utils/legacyUser';
import type { CabinetAssemblyTableRow, Page5_6ParameterItem } from './types';

const CABINET_LOAD_CONFIG: Record<
  string,
  { tableIndex: number; sumIndex: number; tableNum: string }
> = {
  '1': { tableIndex: 0, sumIndex: 5, tableNum: 'DY1-6-2_3_T_ZPZH_1' },
  '2': { tableIndex: 2, sumIndex: 6, tableNum: 'DY1-6-2_3_T_ZPZH_2' },
  '3': { tableIndex: 3, sumIndex: 7, tableNum: 'DY1-6-2_3_T_ZPZH_3' },
  '4': { tableIndex: 4, sumIndex: 8, tableNum: 'DY1-6-2_3_T_ZPZH_4' },
};

function sumOutputCurrent(rows: CabinetAssemblyTableRow[]) {
  return rows.reduce((total, row) => total + Number(row.p13 ?? 0), 0);
}

export async function loadCabinetAssemblyData(
  type: string,
  parameterTempList: Page5_6ParameterItem[],
  pageid: string,
  taskid: string,
): Promise<{ ok: boolean; message?: string }> {
  const config = CABINET_LOAD_CONFIG[type];
  if (!config) return { ok: false, message: '未知机柜类型' };

  const response = await getTabledataByTablenumTaskid({
    taskid,
    pageid,
    tablenum: config.tableNum,
    userid: globaluserId(),
  });

  if (!response || response.code !== '0' || response.data?.result !== true) {
    return { ok: false, message: '未找到数据' };
  }

  const records = response.data?.data ?? [];
  if (records.length <= 0) {
    return { ok: false, message: '未找到数据' };
  }

  const lastRecord = records[records.length - 1];
  const rowdata = lastRecord?.rowdata;
  if (!rowdata) {
    return { ok: false, message: '未找到数据' };
  }

  const parsedRows = JSON.parse(String(rowdata)) as CabinetAssemblyTableRow[];
  const tableItem = parameterTempList[config.tableIndex];
  if (tableItem?.tableMap) {
    tableItem.tableMap.rowData = parsedRows;
  }
  parameterTempList[config.sumIndex].defaultValue = String(sumOutputCurrent(parsedRows));

  return { ok: true };
}
