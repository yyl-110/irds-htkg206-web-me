import { createDefaultTableRow, getStatsTableRows, setStatsTableRows, type Zt1ParameterItem, type Zt1TableRow } from './parameterDefaults';

export function addStatsRow(list: Zt1ParameterItem[]) {
  const rows = [...getStatsTableRows(list)];
  const delIndex = rows.length + 1;
  rows.push(createDefaultTableRow(delIndex));
  setStatsTableRows(list, rows);
}

export function deleteStatsRows(list: Zt1ParameterItem[], selectedRows: Zt1TableRow[]) {
  let rows = [...getStatsTableRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  setStatsTableRows(list, rows);
}

export function extractZt1SaveParamValues(list: Zt1ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}
