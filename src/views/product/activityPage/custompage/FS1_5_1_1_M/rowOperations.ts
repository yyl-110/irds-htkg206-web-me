import {
  createDefaultFrameForceRow,
  getFrameForceRows,
  reindexFrameForceRows,
  setFrameForceRows,
  type FrameForceRow,
  type Fs151_1_1MParameterItem,
} from './parameterDefaults';

export function addFrameForceRow(list: Fs151_1_1MParameterItem[]) {
  const rows = getFrameForceRows(list);
  const newRow = {
    ...createDefaultFrameForceRow(rows.length + 1),
    delIndex: rows.length,
  };
  setFrameForceRows(list, [...rows, newRow]);
}

export function deleteFrameForceRows(list: Fs151_1_1MParameterItem[], selected: FrameForceRow[]) {
  let rows = getFrameForceRows(list);
  selected.forEach(sel => {
    rows = rows.filter(row => {
      if (sel.id != null && row.id != null) return row.id !== sel.id;
      return row.delIndex !== sel.delIndex;
    });
  });
  reindexFrameForceRows(rows);
  setFrameForceRows(list, rows);
}
