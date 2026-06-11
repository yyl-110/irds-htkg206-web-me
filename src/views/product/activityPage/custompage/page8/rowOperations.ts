import {
  createSelectionParamItem,
  PAGE8_SEL_INDEX_PARAM,
  type Page8ParameterItem,
  type Page8TableRow,
} from './parameterDefaults';

export function getPage8TableRows(list: Page8ParameterItem[]): Page8TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage8TableRows(list: Page8ParameterItem[], rows: Page8TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

/** 同步勾选行索引到 parameterTempList（原 selectModelListCheck） */
export function syncPage8SelectionIndexes(list: Page8ParameterItem[], selectedRows: Page8TableRow[]) {
  const rows = getPage8TableRows(list);
  let selIndexs = '';

  selectedRows.forEach(selected => {
    rows.forEach((row, index) => {
      if (selected.p0 === row.p0) {
        selIndexs += `${index},`;
      }
    });
  });

  if (list.length < 2) {
    const pageId = String(list[0]?.pageId ?? '');
    const userid = String(list[0]?.userid ?? '');
    list.push(createSelectionParamItem(pageId, userid));
  }

  const selItem = list.find(item => item.parameterNum === PAGE8_SEL_INDEX_PARAM) ?? list[1];
  if (selItem) {
    selItem.defaultValue = selIndexs;
    if (!selItem.parameterNum) {
      selItem.parameterNum = PAGE8_SEL_INDEX_PARAM;
    }
  }
}

