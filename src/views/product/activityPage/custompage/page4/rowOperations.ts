import type { Page4ParameterItem, Page4TableRow } from './parameterDefaults';

export function getPage4TableRows(list: Page4ParameterItem[]): Page4TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage4TableRows(list: Page4ParameterItem[], rows: Page4TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function extractPage4SaveParamValues(list: Page4ParameterItem[]) {
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
