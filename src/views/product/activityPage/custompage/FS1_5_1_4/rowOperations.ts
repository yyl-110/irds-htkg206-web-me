import {
  createDefaultInnerFrameRow,
  createDefaultOuterFrameRow,
  getInnerFrameRows,
  getOuterFrameRows,
  renumberFrameRows,
  setInnerFrameRows,
  setOuterFrameRows,
  type FrameRow,
  type Fs151_4ParameterItem,
} from './parameterDefaults';

export function addOuterFrameRow(list: Fs151_4ParameterItem[]) {
  const rows = [...getOuterFrameRows(list)];
  const index = rows.length + 1;
  rows.push(createDefaultOuterFrameRow(index));
  setOuterFrameRows(list, rows);
}

export function addInnerFrameRow(list: Fs151_4ParameterItem[]) {
  const rows = [...getInnerFrameRows(list)];
  const index = rows.length + 1;
  rows.push(createDefaultInnerFrameRow(index));
  setInnerFrameRows(list, rows);
}

export function deleteOuterFrameRows(list: Fs151_4ParameterItem[], selectedRows: FrameRow[]) {
  let rows = [...getOuterFrameRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  setOuterFrameRows(list, renumberFrameRows(rows));
}

export function deleteInnerFrameRows(list: Fs151_4ParameterItem[], selectedRows: FrameRow[]) {
  let rows = [...getInnerFrameRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  setInnerFrameRows(list, renumberFrameRows(rows));
}

export function extractFs151_4SaveParamValues(list: Fs151_4ParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't' && item.tableMap?.rowData) return;
    const key = String(item.tableNum ?? item.parameterNum ?? '').trim();
    if (!key) return;
    result.push({
      paramKey: key,
      paramName: String(item.inputName ?? key),
      paramValue: String(item.defaultValue ?? ''),
    });
  });
  return result;
}
