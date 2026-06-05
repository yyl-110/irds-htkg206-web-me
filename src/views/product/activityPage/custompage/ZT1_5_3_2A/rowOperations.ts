import {
  createDefaultLoadRow,
  getLoadRows,
  getRemarkField,
  setLoadRows,
  syncTableHeaderMetadata,
  type ConditionColumnDef,
  type LoadAnalysisRow,
  type Zt1_532AParameterItem,
} from './parameterDefaults';

export function addLoadRow(list: Zt1_532AParameterItem[], conditionColumns: ConditionColumnDef[]) {
  const rows = [...getLoadRows(list)];
  const rownum = rows.length + 1;
  rows.push(createDefaultLoadRow(rownum, conditionColumns.length));
  setLoadRows(list, rows);
}

export function deleteLoadRows(list: Zt1_532AParameterItem[], selectedRows: LoadAnalysisRow[]) {
  let rows = [...getLoadRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  rows.forEach((row, index) => {
    row.p0 = String(index + 1);
  });
  setLoadRows(list, rows);
}

export function addConditionColumn(
  list: Zt1_532AParameterItem[],
  conditionColumns: ConditionColumnDef[],
  title: string,
): ConditionColumnDef[] {
  const nextColumns = [...conditionColumns];
  const oldRemarkField = getRemarkField(nextColumns.length);
  const newRemarkField = getRemarkField(nextColumns.length + 1);
  const remarks = getLoadRows(list).map(row => String(row[oldRemarkField] ?? ''));

  nextColumns.push({
    title,
    field: `p${nextColumns.length + 3}`,
  });

  const rows = getLoadRows(list).map((row, index) => {
    const nextRow: LoadAnalysisRow = { ...row };
    nextRow[newRemarkField] = remarks[index] ?? '';
    delete nextRow[oldRemarkField];
    return nextRow;
  });

  setLoadRows(list, rows);
  syncTableHeaderMetadata(list, nextColumns);
  return nextColumns;
}

export interface DeleteColumnCandidate extends ConditionColumnDef {
  check?: boolean;
  newField?: string;
}

export function deleteConditionColumns(
  list: Zt1_532AParameterItem[],
  conditionColumns: ConditionColumnDef[],
  selectedTitles: string[],
): ConditionColumnDef[] {
  if (selectedTitles.length <= 0) return conditionColumns;

  const reserve = conditionColumns.filter(col => !selectedTitles.includes(col.title));
  const oldRemarkField = getRemarkField(conditionColumns.length);
  const newRemarkField = getRemarkField(reserve.length);
  const remarks = getLoadRows(list).map(row => String(row[oldRemarkField] ?? ''));

  const rows = getLoadRows(list).map((row, rowIndex) => {
    const nextRow: LoadAnalysisRow = {
      p0: row.p0,
      p1: row.p1,
      p2: row.p2,
      delIndex: row.delIndex,
      id: row.id,
    };

    reserve.forEach((col, index) => {
      const oldField = conditionColumns.find(item => item.title === col.title)?.field ?? col.field;
      nextRow[`p${index + 3}`] = row[oldField] ?? '';
    });
    nextRow[newRemarkField] = remarks[rowIndex] ?? '';

    conditionColumns.forEach(col => {
      delete nextRow[col.field];
    });
    delete nextRow[oldRemarkField];

    return nextRow;
  });

  const nextColumns = reserve.map((col, index) => ({
    title: col.title,
    field: `p${index + 3}`,
  }));

  setLoadRows(list, rows);
  syncTableHeaderMetadata(list, nextColumns);
  return nextColumns;
}

export function extractZt1_532ASaveParamValues(list: Zt1_532AParameterItem[]) {
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
