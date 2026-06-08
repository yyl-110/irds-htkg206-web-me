import {
  getInnerFrameRows,
  getOuterFrameRows,
  renumberFrameRows,
  setInnerFrameRows,
  setOuterFrameRows,
  type Fs151_1_6ParameterItem,
  type ReinforcedFrameRow,
} from './parameterDefaults';

export function deleteOuterFrameRows(list: Fs151_1_6ParameterItem[], selectedRows: ReinforcedFrameRow[]) {
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

export function deleteInnerFrameRows(list: Fs151_1_6ParameterItem[], selectedRows: ReinforcedFrameRow[]) {
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

export function extractFs151_1_6SaveParamValues(list: Fs151_1_6ParameterItem[]) {
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
