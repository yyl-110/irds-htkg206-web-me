import type { TableColumnType } from 'ant-design-vue';
import type { Process7ParameterItem } from '../shared/process7/setSaveBtnEnable';

export type Page1ParameterItem = Process7ParameterItem & {
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
  { title: '供电种类', dataIndex: 'p0', key: 'p0', align: 'center', width: 100 },
  { title: '供电支路', dataIndex: 'p1', key: 'p1', align: 'center', width: 100 },
  { title: '功率（W）', dataIndex: 'p2', key: 'p2', align: 'center', width: 100 },
  { title: '低压DC/DC组合效率', dataIndex: 'p3', key: 'p3', align: 'center', width: 180 },
  { title: 'AC/DC组合效率', dataIndex: 'p4', key: 'p4', align: 'center', width: 160 },
  { title: '额定输出电压（V）', dataIndex: 'p5', key: 'p5', align: 'center', width: 150 },
  { title: '用电设备', dataIndex: 'p6', key: 'p6', align: 'center', width: 160 },
  { title: '电压范围（V）', dataIndex: 'p7', key: 'p7', align: 'center', width: 230 },
];

export const TABLE2_COLUMNS: TableColumnType[] = [
  { title: '供电种类', dataIndex: 'p0', key: 'p0', align: 'center', width: 300 },
  { title: '供电支路', dataIndex: 'p1', key: 'p1', align: 'center', width: 120 },
  { title: '功率（W）', dataIndex: 'p2', key: 'p2', align: 'center', width: 180 },
  { title: '输出电压（V）', dataIndex: 'p3', key: 'p3', align: 'center', width: 260 },
];

export const TABLE3_COLUMNS: TableColumnType[] = [
  { title: '供电种类', dataIndex: 'p0', key: 'p0', align: 'center', width: 300 },
  { title: '供电支路', dataIndex: 'p1', key: 'p1', align: 'center', width: 120 },
  { title: '功率（W）', dataIndex: 'p2', key: 'p2', align: 'center', width: 180 },
  { title: '额定输出电压（V）', dataIndex: 'p3', key: 'p3', align: 'center', width: 120 },
];

export const TABLE1_MIN_WIDTH = TABLE1_COLUMNS.reduce(
  (sum, col) => sum + (typeof col.width === 'number' ? col.width : 100),
  0,
);

export const TABLE2_MIN_WIDTH = TABLE2_COLUMNS.reduce(
  (sum, col) => sum + (typeof col.width === 'number' ? col.width : 100),
  0,
);

export const TABLE3_MIN_WIDTH = TABLE3_COLUMNS.reduce(
  (sum, col) => sum + (typeof col.width === 'number' ? col.width : 100),
  0,
);
