import type { Page3ParameterItem, Page3TableRow } from './parameterDefaults';

export function getPage3TableRows(list: Page3ParameterItem[]): Page3TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage3TableRows(list: Page3ParameterItem[], rows: Page3TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function extractPage3SaveParamValues(list: Page3ParameterItem[]) {
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
