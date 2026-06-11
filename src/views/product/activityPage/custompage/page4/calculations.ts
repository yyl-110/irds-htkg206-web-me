import type { Page4ParameterItem } from './parameterDefaults';

export type Page4TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage4TableColNums(tableMap?: Page4ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage4RowToCValueFormat(
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
export function extractPage4SaveParamValues(list: Page4ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的组合方案表（page4 专用 componentId=19） */
export function extractPage4TableSavePayload(list: Page4ParameterItem[]): Page4TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap && item.componentId != null && item.componentId !== '')
    .map(item => {
      const colNums = getPage4TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage4RowToCValueFormat(row, colNums));
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
