import {
  createDefaultSegmentRow,
  getSegmentRows,
  setSegmentRows,
  type Zt1_4102ParameterItem,
  type Zt1SegmentRow,
} from './parameterDefaults';

export function syncSegmentRowCount(list: Zt1_4102ParameterItem[], cabinNo: number, targetCount: number) {
  const count = Number(targetCount);
  if (!Number.isFinite(count) || count <= 0) return;

  const rows = [...getSegmentRows(list, cabinNo)];
  while (rows.length < count) {
    rows.push(createDefaultSegmentRow());
  }
  if (rows.length > count) {
    rows.splice(count);
  }
  setSegmentRows(list, cabinNo, rows);
}

export function extractZt1_4102SaveParamValues(list: Zt1_4102ParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't' && item.tableMap?.rowData) return;
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

export function updateSegmentCell(
  list: Zt1_4102ParameterItem[],
  cabinNo: number,
  rowIndex: number,
  field: keyof Zt1SegmentRow,
  value: string,
) {
  const rows = getSegmentRows(list, cabinNo);
  if (!rows[rowIndex]) return;
  rows[rowIndex][field] = value;
  setSegmentRows(list, cabinNo, [...rows]);
}
