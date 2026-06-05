import {
  createDefaultPointRow,
  getPointRows,
  setPointRows,
  type PointRow,
  type Zt1_532CParameterItem,
} from './parameterDefaults';

export function addPointRow(list: Zt1_532CParameterItem[], tableIndex: number) {
  const rows = [...getPointRows(list, tableIndex)];
  const rownum = rows.length + 1;
  rows.push(createDefaultPointRow(tableIndex, rownum));
  setPointRows(list, tableIndex, rows);
}

export function deletePointRows(list: Zt1_532CParameterItem[], tableIndex: number, selectedRows: PointRow[]) {
  const deleteIndexes = new Set(
    selectedRows.filter(row => Number(row.p4) === tableIndex).map(row => row.delIndex),
  );
  if (deleteIndexes.size <= 0) return false;

  const rows = getPointRows(list, tableIndex)
    .filter(row => !deleteIndexes.has(row.delIndex))
    .map((row, index) => ({
      ...row,
      p0: String(index + 1),
      delIndex: index + 1,
    }));

  setPointRows(list, tableIndex, rows);
  return true;
}

export function extractZt1_532CSaveParamValues(list: Zt1_532CParameterItem[]) {
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
