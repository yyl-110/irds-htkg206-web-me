import { handleCutZero } from '@/utils/tools';
import {
  PAGE5_TABLE_COMPONENT_ID,
  PAGE5_TABLE_NUM,
  type Page5ParameterItem,
  type Page5TableRow,
} from './parameterDefaults';

export type Page5TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage5TableColNums(tableMap?: Page5ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage5RowToCValueFormat(
  row: Record<string, string | number | undefined>,
  colNums: number,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：本页无单行参数，返回空数组 */
export function extractPage5SaveParamValues(list: Page5ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

function resolvePage5TableComponentId(item: Page5ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === PAGE5_TABLE_NUM) return PAGE5_TABLE_COMPONENT_ID;
  return undefined;
}

/** tables：带 componentId 的齿轮减速比分配表（page5 专用 componentId=20） */
export function extractPage5TableSavePayload(list: Page5ParameterItem[]): Page5TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolvePage5TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = getPage5TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage5RowToCValueFormat(row, colNums));
      const rawId = String(resolvedId).trim();
      const numericId = Number(rawId);
      const componentId =
        rawId && !Number.isNaN(numericId) && String(numericId) === rawId ? numericId : resolvedId;
      return {
        componentId,
        tableName: String(item.tableName ?? item.inputName ?? ''),
        values,
      };
    })
    .filter((row): row is Page5TableSaveRow => row != null);
}

/** 齿轮减速比分配计算（原 calculation） */
export function calculateAllPage5Rows(rows: Page5TableRow[], equivalent: number) {
  rows.forEach(row => {
    let parm8 = row.p8;
    let parm9 = row.p9;
    let parm11 = row.p11;

    if (parm9 === '' || parm9 === undefined) {
      parm9 = '0';
    }
    if (parm11 === '' || parm11 === undefined) {
      parm11 = '0';
    }

    let endRatio = '';
    if (parm8 === '直线') {
      endRatio = String((Number(parm9) * equivalent) / 1000);
    } else {
      endRatio = String(parm9);
    }
    row.p12 = handleCutZero(Number(endRatio).toFixed(2));

    let gearRatio = Number(parm11) / Number(endRatio);
    if (Number.isNaN(gearRatio)) {
      gearRatio = 0;
    }
    row.p13 = handleCutZero(gearRatio.toFixed(2));

    let gearLevel = '';
    if (gearRatio <= 3) {
      gearLevel = '1';
    } else if (gearRatio <= 9) {
      gearLevel = '2';
    } else if (gearRatio > 9) {
      gearLevel = '3';
    }
    row.p14 = gearLevel;
  });
  return rows;
}
