import type { Page7ParameterItem, Page7TableRow } from './parameterDefaults';

export function getPage7TableRows(list: Page7ParameterItem[]): Page7TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage7TableRows(list: Page7ParameterItem[], rows: Page7TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function extractPage7SaveParamValues(list: Page7ParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't') return;
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
