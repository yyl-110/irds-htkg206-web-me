import type { GridSettings } from 'handsontable/settings';
import type { Tbdemo1TerminalRow } from './parameterDefaults';

export const HOT_LICENSE_KEY = '74a2a-fc683-0276b-e0213-3e4d4';

export function createTbdemo1HotSettings(
  rowData: Tbdemo1TerminalRow[],
  onDirty: () => void,
): GridSettings {
  return {
    data: rowData,
    minRows: 3,
    rowHeaders: false,
    dropdownMenu: false,
    filters: true,
    width: 'auto',
    height: 'auto',
    columnHeaderHeight: 26,
    stretchH: 'all',
    rowHeights: 26,
    autoWrapRow: true,
    manualColumnResize: false,
    manualRowResize: false,
    language: 'zh-CN',
    colHeaders: [],
    className: 'htCenter htMiddle',
    autoColumnSize: true,
    manualColumnFreeze: true,
    manualRowMove: true,
    columnSorting: false,
    mergeCells: [],
    contextMenu: [
      'row_above',
      'row_below',
      'col_left',
      'col_right',
      '---------',
      'remove_row',
      'remove_col',
      '---------',
      'alignment',
      'make_read_only',
      'borders',
      'copy',
      'cut',
    ],
    fillHandle: true,
    nestedHeaders: [['端子名称', '端子容量kVA', '端子额定电压kV', '端子连接组别']],
    columns: [
      {
        name: '端子名称',
        type: 'dropdown',
        source: ['高压', '中压', '低压'],
        strict: true,
        disabled: false,
        readOnly: false,
        data: 'p0',
      },
      {
        name: '端子容量kVA',
        type: 'numeric',
        disabled: false,
        readOnly: false,
        data: 'p1',
      },
      {
        name: '端子额定电压kV',
        type: 'numeric',
        readOnly: false,
        data: 'p2',
      },
      {
        name: '端子连接组别',
        type: 'dropdown',
        source: ['I', 'I/N', 'Y', 'D', 'YN', 'Y/A'],
        strict: true,
        width: 100,
        readOnly: false,
        data: 'p3',
      },
    ],
    colWidths: [100, 100, 100, 100],
    afterCreateRow: () => onDirty(),
    afterRemoveRow: () => onDirty(),
    afterChange: changes => {
      if (changes) onDirty();
    },
  };
}
