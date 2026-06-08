import type { ColumnsType } from 'ant-design-vue/es/table';
import type { Page6VariantConfig, SupplyTableRow } from './models';
import { computeRowSpanMap } from '../Process7-page6-1/tableColumns';

export { IF_SHOW_OPTIONS } from '../Process7-page6-1/tableColumns';

export function createBaseTableColumns(
  variant: Page6VariantConfig,
  rowSpanMap?: Partial<Record<string, number[]>>,
): ColumnsType<SupplyTableRow> {
  const mergeCell = (field: string) => {
    if (!rowSpanMap?.[field]) return undefined;
    const spans = rowSpanMap[field]!;
    return (_record: SupplyTableRow, index?: number) => ({
      rowSpan: spans[index ?? 0] ?? 1,
    });
  };

  return [
    { title: '供电种类', dataIndex: 'p0', align: 'center', width: 100, customCell: mergeCell('p0') },
    { title: '供电支路', dataIndex: 'p1', align: 'center', width: 100 },
    { title: '供电分支', dataIndex: 'p2', align: 'center', width: 100 },
    { title: '供电分支代号', dataIndex: 'p3', align: 'center', width: 100 },
    { title: '功率（W）', dataIndex: 'p4', align: 'center', width: 100 },
    { title: '额定输出电压（V）', dataIndex: 'p5', align: 'center', width: 150 },
    { title: '用电设备', dataIndex: 'p6', align: 'center', width: 100 },
    { title: '电压范围（V）', dataIndex: 'p7', align: 'center', width: 100, customCell: mergeCell('p7') },
    { title: variant.efficiencyColumnTitle, dataIndex: 'p8', align: 'center', width: 120 },
    { title: variant.acDcColumnTitle, dataIndex: 'p9', align: 'center', width: 120 },
  ];
}

export function createProcessTableColumns(processIndex: number, variant: Page6VariantConfig): ColumnsType<SupplyTableRow> {
  const deviceKey = `p${variant.processDeviceStartIndex + (processIndex - 1) * 2}`;
  const timeKey = `p${variant.processDeviceStartIndex + (processIndex - 1) * 2 + 1}`;
  return [
    { title: `流程${processIndex}用电设备`, dataIndex: deviceKey, align: 'center', width: 120 },
    { title: `流程${processIndex}时间(小时)`, dataIndex: timeKey, align: 'center', width: 120 },
  ];
}

export function buildTableColumns(
  processCount: number,
  variant: Page6VariantConfig,
  data: SupplyTableRow[] = [],
): ColumnsType<SupplyTableRow> {
  const rowSpanMap: Partial<Record<string, number[]>> = {};
  variant.mergeColumns.forEach(field => {
    rowSpanMap[field] = computeRowSpanMap(data, field);
  });
  const columns = createBaseTableColumns(variant, rowSpanMap);
  for (let i = 1; i <= processCount; i++) {
    columns.push(...createProcessTableColumns(i, variant));
  }
  return columns;
}

export function isProcessDeviceField(dataIndex: unknown, processCount: number, variant: Page6VariantConfig): boolean {
  if (typeof dataIndex !== 'string' || !dataIndex.startsWith('p')) return false;
  const index = Number(dataIndex.slice(1));
  const start = variant.processDeviceStartIndex;
  if (index < start || (index - start) % 2 !== 0) return false;
  const processIndex = (index - start) / 2 + 1;
  return processIndex >= 1 && processIndex <= processCount;
}

export function isProcessTimeField(dataIndex: unknown, processCount: number, variant: Page6VariantConfig): boolean {
  if (typeof dataIndex !== 'string' || !dataIndex.startsWith('p')) return false;
  const index = Number(dataIndex.slice(1));
  const start = variant.processDeviceStartIndex + 1;
  if (index < start || (index - start) % 2 !== 0) return false;
  const processIndex = (index - start) / 2 + 1;
  return processIndex >= 1 && processIndex <= processCount;
}

export { tableRowKey } from '../Process7-page6-1/tableColumns';
