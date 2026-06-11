import {
  PAGE11_INPUT_TABLE_COMPONENT_ID,
  PAGE11_INPUT_TABLE_NUM,
  type Page11ParameterItem,
} from './parameterDefaults';

export type Page11TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage11TableColNums(tableMap?: Page11ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage11RowToCValueFormat(
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

function resolvePage11TableComponentId(item: Page11ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === PAGE11_INPUT_TABLE_NUM) return PAGE11_INPUT_TABLE_COMPONENT_ID;
  return undefined;
}

/** values：选择的行索引等单行参数，不含组合方案表 */
export function extractPage11SaveParamValues(list: Page11ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的组合方案表（page11 专用 componentId=33） */
export function extractPage11TableSavePayload(list: Page11ParameterItem[]): Page11TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolvePage11TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = getPage11TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage11RowToCValueFormat(row, colNums));
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
    .filter((row): row is Page11TableSaveRow => row != null);
}
