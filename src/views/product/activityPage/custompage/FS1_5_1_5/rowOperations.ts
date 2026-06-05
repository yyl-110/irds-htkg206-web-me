import {
  createDefaultInnerSkinRow,
  createDefaultOuterSkinRow,
  getInnerSkinRows,
  getOuterSkinRows,
  renumberSkinRows,
  setInnerSkinRows,
  setOuterSkinRows,
  type Fs151_5ParameterItem,
  type SkinSegmentRow,
} from './parameterDefaults';

export function addOuterSkinRow(list: Fs151_5ParameterItem[]) {
  const rows = [...getOuterSkinRows(list)];
  const index = rows.length + 1;
  rows.push(createDefaultOuterSkinRow(index));
  setOuterSkinRows(list, rows);
}

export function addInnerSkinRow(list: Fs151_5ParameterItem[]) {
  const rows = [...getInnerSkinRows(list)];
  const index = rows.length + 1;
  rows.push(createDefaultInnerSkinRow(index));
  setInnerSkinRows(list, rows);
}

export function deleteOuterSkinRows(list: Fs151_5ParameterItem[], selectedRows: SkinSegmentRow[]) {
  let rows = [...getOuterSkinRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  setOuterSkinRows(list, renumberSkinRows(rows));
}

export function deleteInnerSkinRows(list: Fs151_5ParameterItem[], selectedRows: SkinSegmentRow[]) {
  let rows = [...getInnerSkinRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  setInnerSkinRows(list, renumberSkinRows(rows));
}

export function extractFs151_5SaveParamValues(list: Fs151_5ParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't' && item.tableMap?.rowData) return;
    const key = String(item.tableNum ?? item.parameterId ?? '').trim();
    if (!key) return;
    result.push({
      paramKey: key,
      paramName: String(item.inputName ?? key),
      paramValue: String(item.defaultValue ?? ''),
    });
  });
  return result;
}
