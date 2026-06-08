import {
  CHECK_TABLE_INDEX,
  createDualTableRows,
  getCheckTableRows,
  getSelectTableRows,
  setCheckTableRows,
  setSelectTableRows,
  type ConnectionTableRow,
  type Fs15GParameterItem,
} from './parameterDefaults';

export function addDualTableRows(list: Fs15GParameterItem[]) {
  const selectRows = [...getSelectTableRows(list)];
  const checkRows = [...getCheckTableRows(list)];
  const num = selectRows.length + 1;
  const delIndex = selectRows.length;
  const { selectRow, checkRow } = createDualTableRows(num, delIndex);
  selectRows.push(selectRow);
  checkRows.push(checkRow);
  setSelectTableRows(list, selectRows);
  setCheckTableRows(list, checkRows);
}

export function deleteDualTableRows(list: Fs15GParameterItem[], selectedRows: ConnectionTableRow[]) {
  let selectRows = [...getSelectTableRows(list)];
  let checkRows = [...getCheckTableRows(list)];

  selectedRows.forEach(selected => {
    selectRows = selectRows.filter(row => {
      if (selected.id != null && selected.id !== '') return row.id !== selected.id;
      return row.delIndex !== selected.delIndex;
    });
    checkRows = checkRows.filter(row => {
      if (selected.id != null && selected.id !== '') return row.id !== selected.id;
      return row.delIndex !== selected.delIndex;
    });
  });

  selectRows.forEach((row, index) => {
    row.p0 = String(index + 1);
  });
  checkRows.forEach((row, index) => {
    row.p0 = String(index + 1);
  });

  setSelectTableRows(list, selectRows);
  setCheckTableRows(list, checkRows);
}

export function syncSelectFieldToCheck(list: Fs15GParameterItem[], rowIndex: number, field: string, value: string) {
  const checkRows = getCheckTableRows(list);
  if (!checkRows[rowIndex]) return;
  if (field === 'p1') checkRows[rowIndex].p1 = value;
  if (field === 'p3') checkRows[rowIndex].p6 = value;
  if (field === 'p4') checkRows[rowIndex].p8 = value;
  setCheckTableRows(list, [...checkRows]);
}

export function applyMaterialBrowseToAllRows(
  list: Fs15GParameterItem[],
  props: Array<{ name?: string; val?: string }>,
) {
  const selectRows = getSelectTableRows(list).map(row => {
    const next = { ...row };
    props.forEach(item => {
      if (item.name === '模型名称') next.p1 = item.val ?? '';
      if (item.name === '模型编号') next.p2 = item.val ?? '';
      if (item.name === '螺纹公称直径d') next.p3 = item.val ?? '';
      if (item.name === '螺栓光杆或销直径D(取整)') next.p5 = item.val ?? '';
    });
    return next;
  });
  setSelectTableRows(list, selectRows);
}

export function extractFs15GSaveParamValues(list: Fs15GParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't') return;
    const key = String(item.tableNum ?? item.parameterNum ?? '').trim();
    if (!key) return;
    result.push({
      paramKey: key,
      paramName: String(item.inputName ?? key),
      paramValue: '',
    });
  });
  return result;
}
