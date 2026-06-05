import {
  createDefaultOpeningParamRow,
  getOpeningParamRows,
  renumberOpeningRows,
  setOpeningParamRows,
  type Fs151_6ParameterItem,
  type OpeningParamRow,
} from './parameterDefaults';

export function addOpeningParamRow(list: Fs151_6ParameterItem[]) {
  const rows = [...getOpeningParamRows(list)];
  const index = rows.length + 1;
  rows.push(createDefaultOpeningParamRow(index));
  setOpeningParamRows(list, rows);
}

export function deleteOpeningParamRows(list: Fs151_6ParameterItem[], selectedRows: OpeningParamRow[]) {
  let rows = [...getOpeningParamRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  setOpeningParamRows(list, renumberOpeningRows(rows));
}

export function extractFs151_6SaveParamValues(list: Fs151_6ParameterItem[]) {
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
