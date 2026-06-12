/** 模型库默认查询区：使用文本输入的字段（propertyName） */
export const MODULE_QUERY_TEXT_FIELD_NAMES = new Set([
  '模型件号',
  '模型编码',
  '模型名称',
  '模型坐标系',
  'CAD计算重量',
]);

export function isModuleQueryTextField(propertyName: string): boolean {
  return MODULE_QUERY_TEXT_FIELD_NAMES.has(propertyName);
}

export function getPropertyQueryKey(item: { propertyName?: string; dataProp?: string }): string {
  return item.propertyName == '贡献者' ? 'para7Name' : String(item.dataProp ?? '');
}

export function buildQueryColumnFromProperty(item: any, distinctValues: Record<string, any[]>) {
  const key = getPropertyQueryKey(item);
  const isTextField = isModuleQueryTextField(item.propertyName);
  const dataProp = String(item.dataProp ?? '');
  let options: string[] = [];
  const inputType: 'text' | 'select' = isTextField ? 'text' : 'select';
  if (!isTextField) {
    options = resolveDistinctOptionsForQueryColumn({ dataProp, key }, distinctValues);
  }
  return {
    id: item.id,
    title: item.propertyName,
    key,
    dataProp,
    parameterNum: String(item.parameterNum ?? item.paramNum ?? '').trim(),
    inputType,
    options,
  };
}

export function collectDistinctValuesFromRows(rows: any[], key: string): string[] {
  const set = new Set<string>();
  for (const row of rows || []) {
    const value = row?.[key];
    if (value === null || value === undefined) continue;
    const text = String(value).trim();
    if (text !== '') {
      set.add(text);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function mergeQueryColumnOptions(existing: string[] | undefined, incoming: string[]): string[] {
  const set = new Set([...(existing || []), ...incoming].filter(v => String(v).trim() !== ''));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function resolveDistinctOptionsForQueryColumn(
  column: { dataProp?: string; key: string },
  distinctValues: Record<string, any[]>,
): string[] {
  const valueKeyCandidates = [
    String(column.dataProp ?? ''),
    String(column.key ?? ''),
    String(column.key ?? '').endsWith('Name') ? String(column.key).slice(0, -4) : '',
  ].filter(Boolean);
  const rawOptions =
    valueKeyCandidates.map(k => distinctValues?.[k]).find(v => Array.isArray(v) && v.length > 0) || [];
  return (rawOptions || []).map((v: any) => String(v)).filter((v: string) => v.trim() !== '');
}

/** 后端 distinct 为空时，从当前列表数据补全下拉；仍无值则降级为文本输入 */
export function enrichQuerySelectOptionsFromDataSource(
  columns: any[],
  rows: any[],
  queryForm?: Record<string, any>,
) {
  if (!columns?.length) return;
  for (const column of columns) {
    if (column.inputType !== 'select') continue;
    const fromRows = collectDistinctValuesFromRows(rows, column.key);
    column.options = mergeQueryColumnOptions(column.options, fromRows);
    if (!column.options.length) {
      column.inputType = 'text';
      if (queryForm && !(column.key in queryForm)) {
        queryForm[column.key] = '';
      }
    }
  }
}
