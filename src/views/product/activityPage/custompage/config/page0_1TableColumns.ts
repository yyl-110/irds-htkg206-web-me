export interface Page0_1TableColumnDef {
  title: string;
  dataIndex: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
}

export const BASE_PARAMS_COLUMNS: Page0_1TableColumnDef[] = [
  { title: '输出形式', dataIndex: 'p0', width: 100, align: 'center', editable: false },
  { title: '最大输出力矩(Nm)', dataIndex: 'p1', width: 100, align: 'center', editable: true },
  { title: '额定输出力矩(Nm)', dataIndex: 'p2', width: 100, align: 'center', editable: true },
  { title: '额定负载速度(°/s)', dataIndex: 'p3', width: 100, align: 'center', editable: true },
  { title: '最大空载速度(°/s)', dataIndex: 'p4', width: 100, align: 'center', editable: true },
  { title: '最大输出力矩(N)', dataIndex: 'p5', width: 100, align: 'center', editable: true },
  { title: '额定输出力矩(N)', dataIndex: 'p6', width: 100, align: 'center', editable: true },
  { title: '额定负载速度(mm/s)', dataIndex: 'p7', width: 100, align: 'center', editable: true },
  { title: '最大空载速度(mm/s)', dataIndex: 'p8', width: 100, align: 'center', editable: true },
  { title: '机械行程(单边)(°)', dataIndex: 'p9', width: 120, align: 'center', editable: true },
  { title: '机械行程(单边)(mm)', dataIndex: 'p10', width: 120, align: 'center', editable: true },
];

export const WORK_PARAMS_COLUMNS: Page0_1TableColumnDef[] = [
  { title: '', dataIndex: 'p0', width: 100, align: 'center', editable: false },
  { title: '额定工作电压(V)', dataIndex: 'p1', width: 120, align: 'center', editable: true },
  { title: '供电电压下限(V)', dataIndex: 'p2', width: 120, align: 'center', editable: true },
  { title: '供电电压上限(V)', dataIndex: 'p3', width: 120, align: 'center', editable: true },
  { title: '峰值电流(A)', dataIndex: 'p4', width: 100, align: 'center', editable: true },
  { title: '平均电流(A)', dataIndex: 'p5', width: 100, align: 'center', editable: true },
  { title: '最大消耗电流(A)', dataIndex: 'p6', width: 120, align: 'center', editable: true },
  { title: '最大输出维持电流(A)', dataIndex: 'p7', align: 'center', editable: true },
];

export const COMM_PARAMS_COLUMNS: Page0_1TableColumnDef[] = [
  { title: '数字通讯形式', dataIndex: 'p0', align: 'center', editable: true },
  { title: '模拟通讯形式', dataIndex: 'p1', align: 'center', editable: true },
];

export const FUXIANG_PARAMS_COLUMNS: Page0_1TableColumnDef[] = [
  { title: '', dataIndex: 'p0', align: 'center', editable: false },
  { title: '幅频宽', dataIndex: 'p1', align: 'center', editable: true },
  { title: '相频宽', dataIndex: 'p2', align: 'center', editable: true },
  { title: '谐振峰值', dataIndex: 'p3', align: 'center', editable: true },
];

export function toAntTableColumns(cols: Page0_1TableColumnDef[]) {
  return cols.map(col => ({
    title: col.title,
    dataIndex: col.dataIndex,
    key: col.dataIndex,
    width: col.width,
    align: col.align ?? 'center',
    editable: col.editable,
  }));
}

export function isEditableColumn(column: { editable?: boolean; dataIndex?: string | number }) {
  return column.editable === true && column.dataIndex != null;
}
