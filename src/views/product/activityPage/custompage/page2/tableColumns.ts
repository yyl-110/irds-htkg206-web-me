export interface Page2AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  inputType?: 'number' | 'text';
  children?: Page2AntColumn[];
}

export const MOTOR_TYPE_OPTIONS = [
  { value: '1', label: '浏览' },
  { value: '2', label: '输入' },
];

function unitColumn(title: string, dataIndex: string, unit: string): Page2AntColumn {
  return {
    title,
    align: 'center',
    children: [
      {
        title: unit,
        dataIndex,
        key: dataIndex,
        align: 'center',
        width: 95,
        editable: true,
        inputType: 'number',
      },
    ],
  };
}

function flatColumn(
  title: string,
  dataIndex: string,
  options?: { editable?: boolean; inputType?: 'number' | 'text'; width?: number },
): Page2AntColumn {
  return {
    title,
    dataIndex,
    key: dataIndex,
    align: 'center',
    width: options?.width ?? 95,
    editable: options?.editable ?? true,
    inputType: options?.inputType ?? 'number',
  };
}

export const MOTOR_SELECT_ANT_COLUMNS: Page2AntColumn[] = [
  {
    title: '类别',
    dataIndex: 'p0',
    key: 'p0',
    width: 95,
    align: 'center',
    editable: true,
    inputType: 'text',
  },
  flatColumn('电机序号', 'p1', { editable: false }),
  flatColumn('产品代号', 'p2', { editable: true, inputType: 'text' }),
  unitColumn('空载速度', 'p3', 'r/min'),
  unitColumn('额定转速', 'p4', 'r/min'),
  unitColumn('额定转矩', 'p5', 'Nm'),
  unitColumn('额定电压', 'p6', 'V'),
  unitColumn('额定电流', 'p7', 'A'),
  unitColumn('额定功率', 'p8', 'W'),
  unitColumn('转速系数', 'p9', 'V/(r/min)'),
  unitColumn('转矩系数', 'p10', 'Nm/A'),
  unitColumn('最大输出转矩', 'p11', 'Nm'),
  unitColumn('等效阻抗', 'p12', '欧姆'),
  unitColumn('等效感抗', 'p13', 'H'),
  unitColumn('转子转动惯量', 'p14', 'Kgm2'),
  unitColumn('机电时间常数', 'p15', 'ms'),
  unitColumn('齿轮模数', 'p16', 'mm'),
  flatColumn('齿轮宽度', 'p17'),
  flatColumn('齿轮齿数', 'p18'),
  flatColumn('配置图片', 'p19', { editable: true, inputType: 'text' }),
  flatColumn('其它说明', 'p20', { editable: true, inputType: 'text' }),
];

/** 统一类别字段：下拉值为 1/2，兼容历史数据中的中文或数字 */
export function normalizeMotorCategoryValue(value: string | number | undefined): string {
  const raw = String(value ?? '').trim();
  if (raw === '1' || raw === '浏览') return '1';
  if (raw === '2' || raw === '输入') return '2';
  return raw;
}

export function isBrowseModeRow(record: Record<string, string | number | undefined>): boolean {
  return normalizeMotorCategoryValue(record.p0) === '1';
}

export function isInputModeRow(record: Record<string, string | number | undefined>): boolean {
  return normalizeMotorCategoryValue(record.p0) === '2';
}

export function flattenEditableColumns(columns: Page2AntColumn[]): Page2AntColumn[] {
  const result: Page2AntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenEditableColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const MOTOR_EDITABLE_COLUMNS = flattenEditableColumns(MOTOR_SELECT_ANT_COLUMNS);
