import type {
  CustomPageSavedParamRow,
  CustomPageSavedTableRow,
} from '../_shared/utils/taskParamMapMerge';

const PAGE0_5_ZERO_TABLE_NUM = 'DJ1-1_T_ZEROINITPOSITION';
const PAGE0_5_RESULT_TABLE_NUM = 'DJ1-1_T_RESULTDATA';
const PAGE0_5_ZERO_COMPONENT_ID = '1';
const PAGE0_5_RESULT_COMPONENT_ID = '2';
const PAGE0_5_TRIP_PARAM_CODE = 'DJ1_4_ZXC';

function resolveSavedTableNum(table: CustomPageSavedTableRow): string {
  const direct = String(table.tableNum ?? table.tablenum ?? '').trim();
  if (direct) return direct;
  const componentId = String(table.componentId ?? '').trim();
  if (componentId === PAGE0_5_ZERO_COMPONENT_ID) return PAGE0_5_ZERO_TABLE_NUM;
  if (componentId === PAGE0_5_RESULT_COMPONENT_ID) return PAGE0_5_RESULT_TABLE_NUM;
  return '';
}

function savedTableHasRowData(table: CustomPageSavedTableRow): boolean {
  const rows = table.rowData ?? table.rowdata ?? table.values;
  if (!Array.isArray(rows) || rows.length === 0) return false;
  return rows.some(row =>
    Object.entries(row ?? {}).some(([key, value]) => {
      if (/^c\d+$/i.test(String(key).trim())) {
        return String(value ?? '').trim() !== '';
      }
      if (/^p\d+$/i.test(String(key).trim())) {
        return String(value ?? '').trim() !== '';
      }
      return false;
    }),
  );
}

/** 判断 page0-5 / page1-1 是否已有本页保存快照（零位表、行程表或总行程） */
export function hasPage0_5SavedData(
  savedTables?: CustomPageSavedTableRow[] | null,
  savedParamValues?: CustomPageSavedParamRow[] | null,
): boolean {
  const tables = Array.isArray(savedTables) ? savedTables : [];
  for (const table of tables) {
    const tableNum = resolveSavedTableNum(table);
    if (tableNum !== PAGE0_5_ZERO_TABLE_NUM && tableNum !== PAGE0_5_RESULT_TABLE_NUM) continue;
    if (savedTableHasRowData(table)) return true;
  }

  const params = Array.isArray(savedParamValues) ? savedParamValues : [];
  return params.some(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    return code === PAGE0_5_TRIP_PARAM_CODE && String(row?.paramValue ?? '').trim() !== '';
  });
}
