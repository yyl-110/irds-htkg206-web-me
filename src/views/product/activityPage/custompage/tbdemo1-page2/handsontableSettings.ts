import type Handsontable from 'handsontable';
import type { GridSettings } from 'handsontable/settings';
import type { Tbdemo1Page2Row } from './parameterDefaults';

export const HOT_LICENSE_KEY = '74a2a-fc683-0276b-e0213-3e4d4';

export function applyLayerVoltageCellColors(hot: Handsontable) {
  const rows = hot.countRows();
  const cols = hot.countCols();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = hot.getCell(row, col);
      if (!cell) continue;
      if (row % 2 === 0) {
        cell.style.background = '#fffeee';
      }
      if (hot.getDataAtCell(row, 0) === 0) {
        cell.style.background = '#edf3fd';
      }
      if (col === 6 || col === 8) {
        cell.style.background = '#edf3fd';
      }
      if (col === 7) {
        cell.style.background = '#e5eeff';
      }
    }
  }
}

export interface LayerHotSettingsOptions {
  rowData: Tbdemo1Page2Row[];
  onCalculate: () => void;
  onDirty: () => void;
  onAfterRender: (hot: Handsontable) => void;
}

export function createLayerVoltageHotSettings(options: LayerHotSettingsOptions): GridSettings {
  return {
    data: options.rowData,
    minRows: 0,
    rowHeaders: false,
    colHeaders: true,
    dropdownMenu: false,
    filters: false,
    height: 480,
    width: 880,
    bindRowsWithHeaders: true,
    columnHeaderHeight: 26,
    stretchH: 'none',
    rowHeights: 26,
    autoWrapRow: true,
    manualColumnResize: false,
    manualRowResize: false,
    minSpareCols: 1,
    language: 'zh-CN',
    className: 'htCenter htMiddle',
    autoColumnSize: false,
    manualColumnFreeze: true,
    manualRowMove: false,
    columnSorting: false,
    mergeCells: [],
    contextMenu: true,
    fillHandle: true,
    nestedHeaders: [
      [
        '分接号',
        '线电压',
        '相电压',
        '初算匝数',
        '取整后匝数',
        '理论级差匝数',
        '实际端子匝数',
        '实际每级匝数',
        '电压比偏差百分比%',
      ],
    ],
    columns: [
      { name: '分接号', type: 'numeric', data: 'p0', readOnly: true },
      { name: '线电压', type: 'numeric', data: 'p1', readOnly: true, width: 100 },
      { name: '相电压', type: 'numeric', data: 'p2', readOnly: true, width: 100 },
      { name: '初算匝数', type: 'numeric', data: 'p3', readOnly: true, width: 100 },
      { name: '取整后匝数', type: 'numeric', data: 'p4', readOnly: true, width: 100 },
      { name: '理论级差匝数', type: 'numeric', data: 'p5', readOnly: true },
      { name: '实际端子匝数', type: 'numeric', data: 'p6', readOnly: true },
      { name: '实际每级匝数', type: 'numeric', data: 'p7', readOnly: false },
      { name: '电压比偏差百分比%', type: 'numeric', data: 'p8', readOnly: true },
    ],
    colWidths: [],
    afterCellMetaReset: () => options.onCalculate(),
    afterChange: changes => {
      if (changes) {
        options.onCalculate();
        options.onDirty();
      }
    },
    afterRender: function afterRender(this: Handsontable) {
      options.onAfterRender(this);
    },
  };
}
