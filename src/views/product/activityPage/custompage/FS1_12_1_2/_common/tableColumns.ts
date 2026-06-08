import type { AdapterPageConfig } from './types';

export type AdapterCellMode = 'text' | 'editable' | 'number' | 'select';

export interface AdapterAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: AdapterCellMode;
}

export interface AdapterFormField {
  label: string;
  index: number;
  disabled?: boolean;
  type?: 'number' | 'text';
}

export function createAdapterTableColumns(): AdapterAntColumn[] {
  return [
    { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'center', cellMode: 'text' },
    { title: '类型', dataIndex: 'p1', key: 'p1', width: 100, align: 'center', cellMode: 'select' },
    { title: '中面与1象限夹角(°)', dataIndex: 'p2', key: 'p2', width: 150, align: 'center', cellMode: 'number' },
    { title: '销轴与1象限夹角(°)', dataIndex: 'p3', key: 'p3', width: 150, align: 'center', cellMode: 'number' },
    { title: '电缆槽与1象限夹角(°)', dataIndex: 'p4', key: 'p4', width: 150, align: 'center', cellMode: 'number' },
    { title: '新模型文件名', dataIndex: 'p5', key: 'p5', width: 110, align: 'center', cellMode: 'editable' },
    { title: '模板文件名', dataIndex: 'p6', key: 'p6', width: 190, align: 'center', cellMode: 'text' },
  ];
}

export function createAdapterColumnMap(columns: AdapterAntColumn[]) {
  return new Map(columns.map(col => [String(col.dataIndex), col]));
}

export function createFormLeftFields(config: AdapterPageConfig): AdapterFormField[] {
  return [
    { label: '外径(mm):', index: 0, disabled: true },
    { label: '支撑面与筒零位距离(mm):', index: 18, disabled: true },
    { label: `${config.adapterLabel}-前缘(mm):`, index: 12, disabled: true },
    { label: '本体厚度(mm):', index: 1, type: 'number' },
    { label: '橡塑复合板厚度(mm):', index: 2, type: 'number' },
    { label: '海绵胶板厚度(mm):', index: 3, type: 'number' },
    { label: '前缘倒角宽(mm):', index: 4, type: 'number' },
    { label: '前缘倒角高(mm):', index: 5, type: 'number' },
    { label: '前缘倒圆角半径(mm):', index: 6, type: 'number' },
    { label: '前缘内倒角宽(mm):', index: 7, type: 'number' },
    { label: '前缘外倒角高(mm):', index: 8, type: 'number' },
  ];
}

export function createFormRightFields(config: AdapterPageConfig): AdapterFormField[] {
  return [
    { label: `${config.adapterLabel}销轴与0位距离(L3)(mm):`, index: 9, disabled: true },
    { label: `${config.adapterLabel}前支撑面距离(L1)(mm):`, index: 10, disabled: true },
    { label: `${config.adapterLabel}支撑宽度(L2)(mm):`, index: 11, disabled: true },
    { label: '后缘倒角宽(mm):', index: 13, type: 'number' },
    { label: '后缘倒角高(mm):', index: 14, type: 'number' },
    { label: '后缘倒圆角半径(mm):', index: 15, type: 'number' },
    { label: '电缆槽宽(mm):', index: 16, type: 'number' },
    { label: '电缆槽深(mm):', index: 17, type: 'number' },
  ];
}
