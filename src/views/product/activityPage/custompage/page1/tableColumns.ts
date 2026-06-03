export interface Page1AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  editableField?: 'p1' | 'p2' | 'p0';
  children?: Page1AntColumn[];
}

function nestedAntColumn(
  title: string,
  dataIndex: string,
  symbolTitle: string,
  unitTitle: string,
  options?: { width?: number; minWidth?: number; editable?: boolean },
): Page1AntColumn {
  const leafWidth = options?.width ?? options?.minWidth ?? 95;
  return {
    title,
    align: 'center',
    children: [
      {
        title: symbolTitle,
        align: 'center',
        width: leafWidth,
        children: [
          {
            title: unitTitle,
            dataIndex,
            key: dataIndex,
            align: 'center',
            width: leafWidth,
            editable: options?.editable,
            editableField: 'p0',
          },
        ],
      },
    ],
  };
}

function simpleNestedColumn(
  title: string,
  dataIndex: string,
  symbolTitle: string,
  options?: { width?: number; minWidth?: number },
): Page1AntColumn {
  const leafWidth = options?.width ?? options?.minWidth ?? 95;
  return {
    title,
    align: 'center',
    children: [
      {
        title: symbolTitle,
        dataIndex,
        key: dataIndex,
        align: 'center',
        width: leafWidth,
      },
    ],
  };
}

/** 计算输入参数表 */
export const INPUT_PARAM_ANT_COLUMNS: Page1AntColumn[] = [
  { title: '参数定义', dataIndex: 'p0', key: 'p0', width: 300, align: 'center' },
  {
    title: 'X(弹轴方向)',
    dataIndex: 'p1',
    key: 'p1',
    minWidth: 95,
    align: 'center',
    editable: true,
    editableField: 'p1',
  },
  {
    title: 'Y',
    dataIndex: 'p2',
    key: 'p2',
    minWidth: 95,
    align: 'center',
    editable: true,
    editableField: 'p2',
  },
];

/** 零位（初始位置）表 */
export const ZERO_POSITION_ANT_COLUMNS: Page1AntColumn[] = [
  nestedAntColumn('转动角度', 'p0', 'Deg_angle', '°', { width: 95, editable: true }),
  nestedAntColumn('弧度', 'p1', 'Deg_angle', 'rad', { width: 95 }),
  simpleNestedColumn('X', 'p2', 'mm', { width: 95 }),
  simpleNestedColumn('Y', 'p3', 'mm', { width: 95 }),
  nestedAntColumn('长度', 'p4', 'H', 'mm', { width: 95 }),
  nestedAntColumn('行程', 'p5', 'h', 'mm', { width: 95 }),
  nestedAntColumn('等效力臂', 'p6', 'L', 'mm', { width: 95 }),
  {
    title: '减速比修正系数',
    align: 'center',
    minWidth: 95,
    children: [
      {
        title: 'KI',
        dataIndex: 'p7',
        key: 'p7',
        align: 'center',
      },
    ],
  },
];

/** 结果数据表 */
export const RESULT_TABLE_ANT_COLUMNS: Page1AntColumn[] = [
  nestedAntColumn('转到角度', 'p0', 'Deg_angle', '°', { width: 95, editable: true }),
  nestedAntColumn('弧度', 'p1', 'Deg_angle', 'rad', { width: 95 }),
  simpleNestedColumn('X', 'p2', 'mm', { width: 90 }),
  simpleNestedColumn('Y', 'p3', 'mm', { width: 90 }),
  nestedAntColumn('长度', 'p4', 'H', 'mm', { width: 90 }),
  nestedAntColumn('行程', 'p5', 'h', 'mm', { width: 90 }),
  nestedAntColumn('等效力臂', 'p6', 'L', 'mm', { width: 95 }),
  {
    title: '减速比修正系数',
    align: 'center',
    minWidth: 95,
    children: [
      {
        title: 'KI',
        dataIndex: 'p7',
        key: 'p7',
        align: 'center',
      },
    ],
  },
];

export function isInputParamEditableColumn(column: { editable?: boolean; editableField?: string; dataIndex?: string | number }) {
  return column.editable === true && (column.editableField === 'p1' || column.editableField === 'p2');
}

export function getInputParamEditableField(column: { editableField?: string }): 'p1' | 'p2' | null {
  if (column.editableField === 'p1' || column.editableField === 'p2') {
    return column.editableField;
  }
  return null;
}

export function isZeroPositionEditableColumn(column: { editable?: boolean; dataIndex?: string | number }) {
  return column.editable === true && column.dataIndex === 'p0';
}

export function isResultTableEditableColumn(column: { editable?: boolean; dataIndex?: string | number }) {
  return column.editable === true && column.dataIndex === 'p0';
}

export const INPUT_PARAM_NUMBER_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const ZERO_ANGLE_NUMBER_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const RESULT_ANGLE_NUMBER_REG = /^-{1}\d*.?\d*|^-{0}\d+.?\d*/;
