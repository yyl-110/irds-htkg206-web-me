export type Page3CellMode = 'text' | 'readonly-input' | 'computed' | 'editable';

export interface Page3AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: Page3CellMode;
  inputType?: 'number' | 'text';
  children?: Page3AntColumn[];
}

function unitColumn(title: string, dataIndex: string, unit: string, cellMode: Page3CellMode): Page3AntColumn {
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
        cellMode,
        inputType: 'number',
      },
    ],
  };
}

function flatColumn(title: string, dataIndex: string, options: { cellMode: Page3CellMode; unit?: string; inputType?: 'number' | 'text' }): Page3AntColumn {
  if (options.unit) {
    return unitColumn(title, dataIndex, options.unit, options.cellMode);
  }
  return {
    title,
    dataIndex,
    key: dataIndex,
    align: 'center',
    width: 95,
    cellMode: options.cellMode,
    inputType: options.inputType ?? 'text',
  };
}

export const PAGE3_ANT_COLUMNS: Page3AntColumn[] = [
  flatColumn('电机编号', 'p0', { cellMode: 'text' }),
  unitColumn('电机空载转速', 'p1', 'r/min', 'readonly-input'),
  unitColumn('电机额定转速', 'p2', 'r/min', 'readonly-input'),
  unitColumn('电机额定转矩', 'p3', 'Nm', 'readonly-input'),
  unitColumn('电机最大输出转矩', 'p4', 'Nm', 'readonly-input'),
  flatColumn('传动效率', 'p5', { cellMode: 'readonly-input', unit: '/' }),
  flatColumn('舟它最大空载转速', 'p6', { cellMode: 'readonly-input', unit: '°/S' }),
  unitColumn('舟它最大输出力矩', 'p7', 'Nm', 'readonly-input'),
  unitColumn('舟它额定输出力矩', 'p8', 'Nm', 'readonly-input'),
  unitColumn('标准单位空载转速', 'p9', 'rad/s', 'computed'),
  unitColumn('标准单位额定转速', 'p10', 'rad/s', 'computed'),
  unitColumn('负载刚度', 'p11', '(rad/s)Nm', 'computed'),
  unitColumn('电机最大功率时转矩', 'p12', 'Nm', 'computed'),
  unitColumn('电机最大功率时转速', 'p13', 'rad/s', 'computed'),
  unitColumn('电机理论最大功率', 'p14', 'W', 'computed'),
  flatColumn('最大力矩要求最小减速比', 'p15', { cellMode: 'computed', unit: '/' }),
  flatColumn('额定工况减速比', 'p16', { cellMode: 'computed', unit: '/' }),
  flatColumn('最大速度要求最大减速比', 'p17', { cellMode: 'computed', unit: '/' }),
  flatColumn('总减速比', 'p18', { cellMode: 'editable', unit: '/', inputType: 'number' }),
];

export function flattenPage3LeafColumns(columns: Page3AntColumn[]): Page3AntColumn[] {
  const result: Page3AntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenPage3LeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const PAGE3_LEAF_COLUMNS = flattenPage3LeafColumns(PAGE3_ANT_COLUMNS);
