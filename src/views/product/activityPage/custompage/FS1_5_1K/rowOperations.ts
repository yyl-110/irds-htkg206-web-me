import {
  createDualTableRows,
  getCheckTableRows,
  getSelectTableRows,
  setCheckTableRows,
  setSelectTableRows,
  type ConnectionTableRow,
  type Fs15_1KParameterItem,
} from './parameterDefaults';

export function addDualTableRows(list: Fs15_1KParameterItem[]) {
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

export function deleteDualTableRows(list: Fs15_1KParameterItem[], selectedRows: ConnectionTableRow[]) {
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

export function syncSelectDescription(list: Fs15_1KParameterItem[], rowIndex: number, value: string) {
  const checkRows = getCheckTableRows(list);
  if (checkRows[rowIndex]) checkRows[rowIndex].p21 = value;
  setCheckTableRows(list, [...checkRows]);
}

export function applyModuleBrowseToRow(
  list: Fs15_1KParameterItem[],
  rowIndex: number,
  payload: {
    para1?: string;
    para3?: string;
    arr?: Array<{ name?: string; val?: string }>;
  },
) {
  const selectRows = [...getSelectTableRows(list)];
  const checkRows = [...getCheckTableRows(list)];
  if (!selectRows[rowIndex] || !checkRows[rowIndex]) return;

  selectRows[rowIndex].p1 = payload.para3 ?? '';
  checkRows[rowIndex].p1 = payload.para3 ?? '';
  selectRows[rowIndex].p2 = payload.para1 ?? '';

  (payload.arr ?? []).forEach(item => {
    const name = String(item.name ?? '');
    const val = item.val ?? '';
    if (name === 'FS_C018_QFQD') {
      selectRows[rowIndex].p4 = val;
      checkRows[rowIndex].p4 = val;
    }
    if (name === 'FS_C018_LSQD') {
      selectRows[rowIndex].p5 = val;
      checkRows[rowIndex].p5 = val;
    }
    if (name === 'FS_C018_MD') {
      selectRows[rowIndex].p6 = val;
      checkRows[rowIndex].p6 = val;
    }
    if (name === 'FS_C018_MD1') {
      selectRows[rowIndex].p7 = val;
      checkRows[rowIndex].p7 = val;
    }
    if (name === 'FS_C018_GGDZJ') {
      selectRows[rowIndex].p8 = val;
      checkRows[rowIndex].p8 = val;
    }
  });

  setSelectTableRows(list, selectRows);
  setCheckTableRows(list, checkRows);
}

export function extractFs15_1KSaveParamValues(list: Fs15_1KParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't') return;
    const key = String(item.tableNum ?? item.parameterNum ?? '').trim();
    if (!key) return;
    result.push({ paramKey: key, paramName: String(item.inputName ?? key), paramValue: '' });
  });
  return result;
}
