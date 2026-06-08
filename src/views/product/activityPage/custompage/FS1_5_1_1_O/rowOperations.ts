import {
  createAddORow,
  getLaminateTableRows,
  setLaminateTableRows,
  type Fs151_1_1OParameterItem,
  type LaminateRow,
} from './parameterDefaults';

export function addLaminateOSegment(list: Fs151_1_1OParameterItem[], codeNum: number) {
  const rows = getLaminateTableRows(list);
  setLaminateTableRows(list, [...rows, createAddORow(codeNum, rows.length)]);
}

export function deleteLaminateORows(list: Fs151_1_1OParameterItem[], selected: LaminateRow[]) {
  let rows = getLaminateTableRows(list);
  const removeKeys = new Set(selected.map(row => String(row.p0 ?? '')));
  for (let pass = 0; pass < 2; pass += 1) {
    rows = rows.filter(row => !removeKeys.has(String(row.p0 ?? '')));
  }
  setLaminateTableRows(list, rows);
}
