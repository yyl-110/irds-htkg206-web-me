import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import {
  applyOuterSkinToCheckRow,
  createCheckRowFromInner,
  createDisplayRowFromSource,
  setCheckTableRows,
  setDisplayTableRows,
  SOURCE_TABLE_NUM,
  type Fs151_1_1LParameterItem,
} from './parameterDefaults';

const FLOW_PARAM_MAP: Record<string, number> = {
  FS1_3_FSTNZDYL: 1,
  FS1_3_25SPTZZDTL: 2,
  FS1_5_1_1HJQML: 3,
  FS1_5_1_1HTXML: 4,
};

export function applyFs151_1_1LInitData(list: Fs151_1_1LParameterItem[]): boolean {
  const tableList = getFlowTableList();
  const sourceTable = tableList.find(item => String(item.tablenum ?? '') === SOURCE_TABLE_NUM);
  const sourceRows = sourceTable?.rowdata ?? [];

  if (sourceRows.length > 0) {
    setDisplayTableRows(list, sourceRows.map(row => createDisplayRowFromSource(row)));

    const checkRows = sourceRows
      .filter(row => row.p1 === '内蒙皮')
      .map(row => createCheckRowFromInner(row));

    sourceRows.forEach(row => {
      if (row.p1 !== '外蒙皮') return;
      checkRows.forEach(checkRow => {
        if (checkRow.p0 === row.p0) {
          applyOuterSkinToCheckRow(checkRow, row);
        }
      });
    });

    setCheckTableRows(list, checkRows);
  }

  const paramList = getFlowParameterList();
  if (paramList.length > 0) {
    paramList.forEach(item => {
      const idx = FLOW_PARAM_MAP[String(item.paramnum ?? '')];
      if (idx == null || !list[idx]) return;
      list[idx].defaultValue = String(item.paramvalue ?? '');
    });
  }

  return sourceRows.length > 0 || paramList.length > 0;
}
