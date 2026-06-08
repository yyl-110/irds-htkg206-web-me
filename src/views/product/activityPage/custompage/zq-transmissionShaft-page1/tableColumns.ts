import type { TableColumnType } from 'ant-design-vue';
import { universalJointMergedCell } from './tableOperations';

export const SHAFT_TABLE_COLUMNS: TableColumnType[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', align: 'center', width: 65 },
  { title: '名称', dataIndex: 'p1', key: 'p1', align: 'center', width: 120 },
  { title: '传动轴长度(mm)', dataIndex: 'p2', key: 'p2', align: 'center', width: 115 },
  { title: '模型件号', dataIndex: 'p3', key: 'p3', align: 'center', width: 150 },
  { title: '状态', dataIndex: 'p4', key: 'p4', align: 'center', width: 120 },
];

export const SUPPORT_TABLE_COLUMNS: TableColumnType[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', align: 'center', width: 65 },
  { title: '支承角板理论高度(mm)', dataIndex: 'p1', key: 'p1', align: 'center', width: 250 },
  { title: '支承角板编号', dataIndex: 'p2', key: 'p2', align: 'center', width: 255 },
];

export const SPEED_TABLE_COLUMNS: TableColumnType[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', align: 'center', width: 65 },
  { title: 'L', dataIndex: 'p1', key: 'p1', align: 'center', width: 100 },
  { title: '内径', dataIndex: 'p2', key: 'p2', align: 'center', width: 105 },
  { title: '外径', dataIndex: 'p3', key: 'p3', align: 'center', width: 105 },
  { title: '临界转速(r/min)', dataIndex: 'p4', key: 'p4', align: 'center', width: 135 },
  { title: '是否合格', dataIndex: 'p5', key: 'p5', align: 'center', width: 120 },
];

export const JOINT_TABLE_COLUMNS: TableColumnType[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', align: 'center', width: 65 },
  { title: '名称', dataIndex: 'p1', key: 'p1', align: 'center', width: 91 },
  { title: '说明', dataIndex: 'p2', key: 'p2', align: 'center', width: 150 },
  { title: '万向节夹角(°)', dataIndex: 'p3', key: 'p3', align: 'center', width: 100 },
  { title: '是否合格', dataIndex: 'p4', key: 'p4', align: 'center', width: 71 },
  {
    title: '当量夹角(°)',
    dataIndex: 'p5',
    key: 'p5',
    align: 'center',
    width: 82,
    customCell: (_record, rowIndex) => universalJointMergedCell(rowIndex, 'p5'),
  },
  {
    title: '是否合格',
    dataIndex: 'p6',
    key: 'p6',
    align: 'center',
    width: 71,
    customCell: (_record, rowIndex) => universalJointMergedCell(rowIndex, 'p6'),
  },
];

export function isFailStatus(value: unknown) {
  return value === '不合格';
}
