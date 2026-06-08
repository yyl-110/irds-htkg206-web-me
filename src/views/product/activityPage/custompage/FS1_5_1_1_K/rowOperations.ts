import {
  createAddRows,
  getLaminateTableRows,
  setLaminateTableRows,
  type Fs151_1_1KParameterItem,
  type LaminateRow,
} from './parameterDefaults';

export function addLaminateSegment(list: Fs151_1_1KParameterItem[], codeNum: number) {
  const rows = getLaminateTableRows(list);
  const newRows = createAddRows(codeNum, rows.length);
  setLaminateTableRows(list, [...rows, ...newRows]);
}

export function deleteLaminateRows(list: Fs151_1_1KParameterItem[], selected: LaminateRow[]) {
  let rows = getLaminateTableRows(list);
  const removeKeys = new Set(selected.map(row => String(row.p0 ?? '')));
  for (let pass = 0; pass < 2; pass += 1) {
    rows = rows.filter(row => !removeKeys.has(String(row.p0 ?? '')));
  }
  setLaminateTableRows(list, rows);
}
