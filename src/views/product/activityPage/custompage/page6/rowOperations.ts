import type { Page6ParameterItem, Page6TableRow } from './parameterDefaults';

export function getPage6TableRows(list: Page6ParameterItem[]): Page6TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage6TableRows(list: Page6ParameterItem[], rows: Page6TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function extractPage6SaveParamValues(list: Page6ParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't') {
      return;
    }
    const key = String(item.parameterNum ?? '').trim();
    if (!key) return;
    result.push({
      paramKey: key,
      paramName: String(item.inputName ?? key),
      paramValue: String(item.defaultValue ?? ''),
    });
  });
  return result;
}
