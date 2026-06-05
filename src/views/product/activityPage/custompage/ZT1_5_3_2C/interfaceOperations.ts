import {
  createInterfaceGroupItems,
  getGroupBaseIndex,
  getInterfaceGroupCount,
  getSummaryRows,
  setSummaryRows,
  type SummaryRow,
  type Zt1_532CParameterItem,
} from './parameterDefaults';

export function addInterfaceGroup(list: Zt1_532CParameterItem[], pageId: string) {
  const groupIndex = getInterfaceGroupCount(list);
  const summaryRows = [...getSummaryRows(list)];
  summaryRows.push({
    p0: String(groupIndex + 1),
    p1: '',
    p2: '',
    p3: '',
  });
  setSummaryRows(list, summaryRows);
  list.push(...createInterfaceGroupItems(pageId, groupIndex));
}

export function collectDeletedInputTempIds(list: Zt1_532CParameterItem[], deleteGroupIndexes: number[]) {
  const ids: string[] = [];
  deleteGroupIndexes.forEach(groupIndex => {
    const base = getGroupBaseIndex(groupIndex);
    for (let offset = 0; offset < 4; offset += 1) {
      const id = list[base + offset]?.id;
      if (id != null && id !== '') {
        ids.push(String(id));
      }
    }
  });
  return ids.join(',');
}

export function rebuildAfterDeleteGroups(list: Zt1_532CParameterItem[], deleteGroupIndexes: number[]) {
  const deleteSet = new Set(deleteGroupIndexes);
  const groupCount = getInterfaceGroupCount(list);
  const nextList: Zt1_532CParameterItem[] = [list[0]];
  const summaryRows: SummaryRow[] = [];

  let nextGroupIndex = 0;
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
    if (deleteSet.has(groupIndex)) continue;

    const base = getGroupBaseIndex(groupIndex);
    const summaryRow = getSummaryRows(list)[groupIndex];
    if (summaryRow) summaryRows.push({ ...summaryRow });

    const nameItem = { ...list[base], parameterNum: `ZT1_5_3_JKMC${nextGroupIndex}` };
    const tableIndex = nextList.length + 1;
    const tableItem = {
      ...list[base + 1],
      tableNum: `ZT1_5_3_DHDY${nextGroupIndex}`,
      tableMap: list[base + 1].tableMap
        ? {
            ...list[base + 1].tableMap,
            rowData: (list[base + 1].tableMap?.rowData ?? []).map(row => ({
              ...row,
              p4: tableIndex,
            })),
          }
        : list[base + 1].tableMap,
    };
    const socketItem = { ...list[base + 2], parameterNum: `ZT1_5_3_CZ${nextGroupIndex}` };
    const plugItem = { ...list[base + 3], parameterNum: `ZT1_5_3_CT${nextGroupIndex}` };

    nextList.push(nameItem, tableItem, socketItem, plugItem);
    nextGroupIndex += 1;
  }

  summaryRows.forEach((row, index) => {
    row.p0 = String(index + 1);
  });
  setSummaryRows(nextList, summaryRows);
  return nextList;
}

export function syncSummaryName(list: Zt1_532CParameterItem[], groupNo: number) {
  const summaryRows = [...getSummaryRows(list)];
  const nameIndex = getGroupBaseIndex(groupNo - 1);
  const row = summaryRows[groupNo - 1];
  if (!row || !list[nameIndex]) return;
  row.p1 = String(list[nameIndex].defaultValue ?? '');
  setSummaryRows(list, summaryRows);
}

export function syncSummarySocketContent(list: Zt1_532CParameterItem[], groupNo: number) {
  const summaryRows = [...getSummaryRows(list)];
  const socketIndex = getGroupBaseIndex(groupNo - 1) + 2;
  const row = summaryRows[groupNo - 1];
  if (!row || !list[socketIndex]) return;
  row.p2 = String(list[socketIndex].defaultValue ?? '');
  setSummaryRows(list, summaryRows);
}
