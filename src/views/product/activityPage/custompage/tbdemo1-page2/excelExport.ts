// @ts-expect-error legacy js module without types
import excel from '@/utils/excel.js';
import type { Tbdemo1Page2Row } from './parameterDefaults';

const EXPORT_HEADERS = [
  '分接号',
  '线电压',
  '相电压',
  '初算匝数',
  '取整后匝数',
  '理论级差匝数',
  '实际端子匝数',
  '实际每级匝数',
  '电压比偏差百分比%',
];

const EXPORT_KEYS = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];

export function exportLayerVoltageRowsToExcel(rows: Tbdemo1Page2Row[], filename = 'export') {
  excel.export_array_to_excel({
    key: EXPORT_KEYS,
    data: rows.map(row => ({ ...row })),
    title: EXPORT_HEADERS,
    filename,
    autoWidth: true,
  });
}
