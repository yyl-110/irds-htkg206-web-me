import type { ConditionColumnDef } from './parameterDefaults';

export type LoadCellMode = 'text' | 'editable' | 'select' | 'number';

export interface LoadAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: LoadCellMode;
  children?: LoadAntColumn[];
}

export function buildLoadTableColumns(
  conditionColumns: ConditionColumnDef[],
  remarkField: string,
): LoadAntColumn[] {
  return [
    { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'center', cellMode: 'text' },
    { title: '用电设备', dataIndex: 'p1', key: 'p1', width: 120, align: 'center', cellMode: 'editable' },
    { title: '用电类型', dataIndex: 'p2', key: 'p2', width: 120, align: 'center', cellMode: 'select' },
    {
      title: '用电工况(单位:kW)',
      children: conditionColumns.map(col => ({
        title: col.title,
        dataIndex: col.field,
        key: col.field,
        width: 90,
        align: 'center' as const,
        cellMode: 'number' as const,
      })),
    },
    { title: '备注', dataIndex: remarkField, key: remarkField, align: 'center', cellMode: 'editable' },
  ];
}

export function flattenLoadLeafColumns(columns: LoadAntColumn[]): LoadAntColumn[] {
  const result: LoadAntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenLoadLeafColumns(col.children));
    } else {
      result.push(col);
    }
  });
  return result;
}

export const GRADE_TABLE_COLUMNS: LoadAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'center', cellMode: 'text' },
  { title: '分系统', dataIndex: 'p1', key: 'p1', width: 200, align: 'center', cellMode: 'text' },
  { title: '电缆', dataIndex: 'p2', key: 'p2', align: 'center', cellMode: 'editable' },
];

export const GRADE_LEAF_COLUMN_MAP = new Map(GRADE_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]));
