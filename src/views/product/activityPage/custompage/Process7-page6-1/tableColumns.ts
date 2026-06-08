import type { ColumnsType } from 'ant-design-vue/es/table';
import type { Page6_1VariantConfig, SupplyTableRow } from './models';

export const IF_SHOW_OPTIONS = [
  { label: '有', value: 1 },
  { label: '无', value: 0 },
];

export function createBaseTableColumns(
  variant: Page6_1VariantConfig,
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
    { title: '电压范围（V）', dataIndex: 'p7', align: 'center', width: 100 },
    {
      title: variant.efficiencyColumnTitle,
      dataIndex: 'p8',
      align: 'center',
      width: 120,
      customCell: mergeCell('p8'),
    },
  ];
}

export function createProcessTableColumns(processIndex: number): ColumnsType<SupplyTableRow> {
  const deviceKey = `p${9 + (processIndex - 1) * 2}`;
  const timeKey = `p${10 + (processIndex - 1) * 2}`;
  return [
    {
      title: `流程${processIndex}用电设备`,
      dataIndex: deviceKey,
      align: 'center',
      width: 120,
      customCell: () => ({ class: 'process-device-cell' }),
    },
    {
      title: `流程${processIndex}时间(小时)`,
      dataIndex: timeKey,
      align: 'center',
      width: 120,
    },
  ];
}

export function buildTableColumns(
  processCount: number,
  variant: Page6_1VariantConfig,
  data: SupplyTableRow[] = [],
): ColumnsType<SupplyTableRow> {
  const rowSpanMap: Partial<Record<string, number[]>> = {};
  variant.mergeColumns.forEach(field => {
    rowSpanMap[field] = computeRowSpanMap(data, field);
  });
  const columns = createBaseTableColumns(variant, rowSpanMap);
  for (let i = 1; i <= processCount; i++) {
    columns.push(...createProcessTableColumns(i));
  }
  return columns;
}

export function isProcessDeviceField(dataIndex: unknown, processCount: number): boolean {
  if (typeof dataIndex !== 'string' || !dataIndex.startsWith('p')) return false;
  const index = Number(dataIndex.slice(1));
  if (index < 9 || index % 2 === 0) return false;
  const processIndex = (index - 9) / 2 + 1;
  return processIndex >= 1 && processIndex <= processCount;
}

export function isProcessTimeField(dataIndex: unknown, processCount: number): boolean {
  if (typeof dataIndex !== 'string' || !dataIndex.startsWith('p')) return false;
  const index = Number(dataIndex.slice(1));
  if (index < 10 || index % 2 === 1) return false;
  const processIndex = (index - 10) / 2 + 1;
  return processIndex >= 1 && processIndex <= processCount;
}

export function tableRowKey(record: SupplyTableRow, index: number) {
  return String(record.p3 ?? record.p2 ?? index);
}

export function computeRowSpanMap(data: SupplyTableRow[], field: string): number[] {
  const spans = new Array<number>(data.length).fill(1);
  let i = 0;
  while (i < data.length) {
    let j = i + 1;
    while (j < data.length && String(data[j][field] ?? '') === String(data[i][field] ?? '')) {
      j++;
    }
    const span = j - i;
    spans[i] = span;
    for (let k = i + 1; k < j; k++) spans[k] = 0;
    i = j;
  }
  return spans;
}
