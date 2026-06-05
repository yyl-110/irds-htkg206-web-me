import {
  createDefaultPowerBranchRow,
  getPowerBranchRows,
  renumberPowerBranchRows,
  setPowerBranchRows,
  type PowerBranchRow,
  type Zt1_532BParameterItem,
} from './parameterDefaults';

export function addPowerBranchRow(list: Zt1_532BParameterItem[]) {
  const rows = [...getPowerBranchRows(list)];
  const rownum = rows.length + 1;
  rows.push(createDefaultPowerBranchRow(rownum));
  setPowerBranchRows(list, rows);
}

export function deletePowerBranchRows(list: Zt1_532BParameterItem[], selectedRows: PowerBranchRow[]) {
  let rows = [...getPowerBranchRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && selected.id !== '') {
        return row.id !== selected.id;
      }
      return row.delIndex !== selected.delIndex;
    });
  });
  setPowerBranchRows(list, renumberPowerBranchRows(rows));
}

export function extractZt1_532BSaveParamValues(list: Zt1_532BParameterItem[]) {
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
