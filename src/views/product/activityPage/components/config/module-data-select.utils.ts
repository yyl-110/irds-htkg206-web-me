import type { ConfirmColumnItem, ModulePropertyItem, ModuleTableRow, SelectPageStrItem } from './module-data-select.types';

/** 与 ModuleInfoList 一致：接口常返回字符串 "0" */
export function isZeroFlag(value: unknown) {
  return value == 0;
}

export function isApiSuccess(code: unknown) {
  const n = Number(code);
  return n === 200 || n === 0;
}

/** 模块库 menuId=9 用 type=1，其它基础资源库（材料库等）用 type=2 */
export function resolveLibraryDataQueryType(menuId: string | number | null | undefined) {
  return String(menuId ?? '').trim() === '9' ? '1' : '2';
}

export function parseSelectPageStr(selectPageStr: string | SelectPageStrItem[] | undefined): Record<string, string> {
  if (!selectPageStr || typeof selectPageStr === 'string') return {};
  const prefill: Record<string, string> = {};
  selectPageStr.forEach(item => {
    const key = String(item?.id ?? '').trim();
    if (!key) return;
    prefill[key] = String(item?.val ?? '');
  });
  return prefill;
}

export function resolveInitArgs(
  categoryId: string,
  selectPageStr: string | SelectPageStrItem[] = '',
): { menuId: string; queryPrefill: Record<string, string> } {
  if (Array.isArray(selectPageStr)) {
    return { menuId: categoryId, queryPrefill: parseSelectPageStr(selectPageStr) };
  }
  const menuId = String(selectPageStr ?? '').trim();
  return { menuId: menuId || categoryId, queryPrefill: {} };
}

export function buildModuleQueryFilters(queryForm: Record<string, unknown>) {
  return Object.entries(queryForm)
    .map(([key, value]) => ({
      modelInfoProp: key,
      modelInfoPropValue: String(value ?? '').trim(),
    }))
    .filter(item => item.modelInfoProp && item.modelInfoPropValue);
}

export function buildTableColumns(moduleParaList: ModulePropertyItem[]) {
  let fixedCount = 0;
  return moduleParaList
    .filter(item => isZeroFlag(item.showFlag))
    .map(item => {
      const dataIndex = item.propertyName === '贡献者' ? 'para7Name' : String(item.dataProp ?? item.modelInfoProp ?? '');
      const col: Record<string, unknown> = {
        title: item.propertyName ?? dataIndex,
        dataIndex,
        key: dataIndex,
        align: 'left',
        width: item.colWidth ?? 120,
        ellipsis: dataIndex !== 'para2' && dataIndex !== 'status',
      };
      if (fixedCount < 2) {
        col.fixed = 'left';
        fixedCount += 1;
      }
      return col;
    })
    .filter(col => col.dataIndex);
}

export function buildConfirmColumns(moduleParaList: ModulePropertyItem[]): ConfirmColumnItem[] {
  return moduleParaList
    .filter(item => isZeroFlag(item.showFlag))
    .map(item => {
      const dataIndex = item.propertyName === '贡献者' ? 'para7Name' : String(item.dataProp ?? item.modelInfoProp ?? '');
      return {
        dataIndex,
        parameterNum: String(item.parameterNum ?? item.paramNum ?? ''),
        paraDictionaryName: String(item.paraDictionaryName ?? ''),
      };
    })
    .filter(col => col.dataIndex);
}

export function getRowDisplayText(columnDataIndex: string, record: ModuleTableRow, text: unknown) {
  if (columnDataIndex === 'status') {
    const status = record.status;
    if (status === 0 || status === '0') return '已发布';
    if (status === 1 || status === '1') return '设计中';
    if (status === 2 || status === '2') return '停用';
  }
  return text ?? record[columnDataIndex];
}

export function applyQueryPrefill(
  queryColumns: Array<{ key: string; parameterNum?: string; paraDictionary?: string; id?: string | number }>,
  queryForm: Record<string, unknown>,
  prefill?: Record<string, string> | null,
) {
  if (!prefill || !Object.keys(prefill).length) return false;
  const byCode = new Map<string, string>();
  Object.entries(prefill).forEach(([code, rawVal]) => {
    const key = String(code ?? '').trim();
    const val = String(rawVal ?? '').trim();
    if (key && val) {
      byCode.set(key.toUpperCase(), val);
      byCode.set(key, val);
    }
  });
  if (!byCode.size) return false;

  let matched = false;
  queryColumns.forEach(col => {
    const paramNum = String(col.parameterNum ?? '')
      .trim()
      .toUpperCase();
    const colId = String(col.id ?? '').trim();
    const paraDictionary = String(col.paraDictionary ?? '').trim();
    const prefillValue =
      (paramNum ? byCode.get(paramNum) : undefined) ??
      (paraDictionary ? byCode.get(paraDictionary.toUpperCase()) : undefined) ??
      (paraDictionary ? byCode.get(paraDictionary) : undefined) ??
      (colId ? byCode.get(colId.toUpperCase()) : undefined) ??
      (colId ? byCode.get(colId) : undefined);
    if (prefillValue === undefined) return;
    queryForm[col.key] = prefillValue;
    matched = true;
  });
  return matched;
}
