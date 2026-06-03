export interface Page0_5AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  children?: Page0_5AntColumn[];
}

function nestedAntColumn(
  title: string,
  dataIndex: string,
  symbolTitle: string,
  unitTitle: string,
  options?: { width?: number; minWidth?: number; editable?: boolean },
): Page0_5AntColumn {
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
          },
        ],
      },
    ],
  };
}

/** 计算输入参数表 */
export const INPUT_PARAM_ANT_COLUMNS: Page0_5AntColumn[] = [
  { title: '参数定义', dataIndex: 'p0', key: 'p0', width: 200, align: 'center' },
  { title: '符号', dataIndex: 'p1', key: 'p1', minWidth: 95, align: 'center' },
  { title: '值', dataIndex: 'p2', key: 'p2', minWidth: 95, align: 'center', editable: true },
  { title: '单位', dataIndex: 'p3', key: 'p3', width: 95, align: 'center' },
];

/** 零位（初始位置）表 */
export const ZERO_POSITION_ANT_COLUMNS: Page0_5AntColumn[] = [
  nestedAntColumn('转动角度', 'p0', 'Deg_angle', '°', { width: 95, editable: true }),
  nestedAntColumn('弧度', 'p1', 'Deg_angle', 'rad', { width: 95 }),
  nestedAntColumn('摇臂-连杆绞合点X', 'p2', 'X', 'mm', { width: 95 }),
  nestedAntColumn('摇臂-连杆绞合点Y', 'p3', 'Y', 'mm', { width: 95 }),
  nestedAntColumn('连杆-支耳绞合点Y', 'p4', 'H', 'mm', { width: 95 }),
  nestedAntColumn('行程', 'p5', 'h', 'mm', { width: 95 }),
  nestedAntColumn('过程角度1', 'p6', 'ALPHA1', 'rad', { width: 95 }),
  nestedAntColumn('过程角度2', 'p7', 'ALPHA2', 'mm', { width: 95 }),
  nestedAntColumn('等效力臂', 'p8', 'L1', 'mm', { width: 95 }),
  {
    title: '减速比修正系数',
    align: 'center',
    minWidth: 95,
    children: [
      {
        title: 'KI',
        dataIndex: 'p9',
        key: 'p9',
        align: 'center',
      },
    ],
  },
];

/** 行程计算表 */
export const RESULT_TABLE_ANT_COLUMNS: Page0_5AntColumn[] = [
  nestedAntColumn('转动角度', 'p0', 'Deg_angle', '°', { width: 95, editable: true }),
  nestedAntColumn('弧度', 'p1', 'Deg_angle', 'rad', { width: 95 }),
  nestedAntColumn('摇臂-连杆绞合点X', 'p2', 'X', 'mm', { minWidth: 95 }),
  nestedAntColumn('摇臂-连杆绞合点Y', 'p3', 'Y', 'mm', { minWidth: 95 }),
  nestedAntColumn('连杆-支耳绞合点Y', 'p4', 'H', 'mm', { minWidth: 95 }),
  nestedAntColumn('行程', 'p5', 'h', 'mm', { width: 95 }),
  nestedAntColumn('过程角度1', 'p6', 'ALPHA1', 'rad', { width: 95 }),
  nestedAntColumn('过程角度2', 'p7', 'ALPHA2', 'mm', { width: 95 }),
  nestedAntColumn('等效力臂', 'p8', 'L1', 'mm', { width: 95 }),
  {
    title: '减速比修正系数',
    align: 'center',
    minWidth: 95,
    children: [
      {
        title: 'KI',
        dataIndex: 'p9',
        key: 'p9',
        align: 'center',
      },
    ],
  },
];

export function isInputParamEditableColumn(column: { editable?: boolean; dataIndex?: string | number }) {
  return column.editable === true && column.dataIndex === 'p2';
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
