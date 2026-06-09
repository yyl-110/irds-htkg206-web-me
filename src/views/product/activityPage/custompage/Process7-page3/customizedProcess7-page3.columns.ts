import type { TableColumnType } from 'ant-design-vue';
import type { Process7ParameterItem } from '../shared/process7/setSaveBtnEnable';

export type Page3ParameterItem = Process7ParameterItem & {
  inputOrOutput?: string;
  inputType?: string;
  parameterNum?: string;
  inputName?: string;
  propertyType?: string;
  pageId?: string;
  tableName?: string;
  tableNum?: string;
  tableType?: string;
  colData?: Array<{ colName: string; isShowCol: string }>;
  tableMap?: Process7ParameterItem['tableMap'] & {
    tableType?: string;
    colNums?: string;
    rowNums?: string | number;
    colStr?: string[];
  };
};

export const TABLE1_COLUMNS: TableColumnType[] = [
  { title: '供电种类', dataIndex: 'p0', key: 'p0', align: 'center', width: 120 },
  { title: '供电支路', dataIndex: 'p1', key: 'p1', align: 'center', width: 120 },
  { title: '功率（W）', dataIndex: 'p2', key: 'p2', align: 'center', width: 120 },
  { title: '高压DC/DC模块效率', dataIndex: 'p3', key: 'p3', align: 'center', width: 230 },
  { title: '额定输出电压（V）', dataIndex: 'p4', key: 'p4', align: 'center', width: 160 },
  { title: '用电设备', dataIndex: 'p5', key: 'p5', align: 'center', width: 200 },
  { title: '电压范围（V）', dataIndex: 'p6', key: 'p6', align: 'center', width: 200 },
];

export const TABLE2_COLUMNS: TableColumnType[] = [
  { title: '供电种类', dataIndex: 'p0', key: 'p0', align: 'center', width: 380 },
  { title: '供电支路', dataIndex: 'p1', key: 'p1', align: 'center', width: 120 },
  { title: '功率', dataIndex: 'p2', key: 'p2', align: 'center', width: 120 },
  { title: '额定输出电压（V）', dataIndex: 'p3', key: 'p3', align: 'center', width: 160 },
];

export const TABLE2_P3_DASH_P0 = new Set([
  '高压直流用电设备总功率',
  '电源机柜总输入功率（高压DC/DC模块总输入功率）',
  '总交流输入功率',
]);

export const TABLE1_MIN_WIDTH = TABLE1_COLUMNS.reduce(
  (sum, col) => sum + (typeof col.width === 'number' ? col.width : 100),
  0,
);

export const TABLE2_MIN_WIDTH = TABLE2_COLUMNS.reduce(
  (sum, col) => sum + (typeof col.width === 'number' ? col.width : 100),
  0,
);
