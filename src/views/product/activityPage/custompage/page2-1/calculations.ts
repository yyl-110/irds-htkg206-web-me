import type { Page2_1ParameterItem } from './parameterDefaults';

export type Page2_1TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage2_1TableColNums(tableMap?: Page2_1ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage2_1RowToCValueFormat(
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

/** values：单行参数（机械行程、载荷等），不含减速器选型表 */
export function extractPage2_1SaveParamValues(list: Page2_1ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的减速器选型表（page2-1 专用 componentId=16） */
export function extractPage2_1TableSavePayload(list: Page2_1ParameterItem[]): Page2_1TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap && item.componentId != null && item.componentId !== '')
    .map(item => {
      const colNums = getPage2_1TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage2_1RowToCValueFormat(row, colNums));
      const rawId = String(item.componentId ?? '').trim();
      const numericId = Number(rawId);
      const componentId =
        rawId && !Number.isNaN(numericId) && String(numericId) === rawId ? numericId : item.componentId!;
      return {
        componentId,
        tableName: String(item.tableName ?? item.inputName ?? ''),
        values,
      };
    });
}
