import type { Page2ParameterItem } from './parameterDefaults';

export type Page2TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage2TableColNums(tableMap?: Page2ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage2RowToCValueFormat(row: Record<string, string | number | undefined>, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：单行参数（额定功率），不含电机选型表 */
export function extractPage2SaveParamValues(list: Page2ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的电机选型表（page2 专用 componentId=15） */
export function extractPage2TableSavePayload(list: Page2ParameterItem[]): Page2TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap && item.componentId != null && item.componentId !== '')
    .map(item => {
      const colNums = getPage2TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage2RowToCValueFormat(row, colNums));
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
