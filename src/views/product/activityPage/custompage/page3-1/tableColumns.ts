export type Page3_1CellMode = 'text' | 'readonly-input' | 'computed';

export interface Page3_1AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: Page3_1CellMode;
  inputType?: 'number' | 'text';
  children?: Page3_1AntColumn[];
}

function unitColumn(title: string, dataIndex: string, unit: string, cellMode: Page3_1CellMode): Page3_1AntColumn {
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

function flatColumn(title: string, dataIndex: string, options: { cellMode: Page3_1CellMode; unit?: string }): Page3_1AntColumn {
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
  };
}

export const PAGE3_1_ANT_COLUMNS: Page3_1AntColumn[] = [
  flatColumn('电机编号', 'p0', { cellMode: 'text' }),
  unitColumn('电机空载转速', 'p1', 'r/min', 'readonly-input'),
  unitColumn('电机额定转速', 'p2', 'r/min', 'readonly-input'),
  unitColumn('电机额定转矩', 'p3', 'Nm', 'readonly-input'),
  unitColumn('电机最大输出转矩', 'p4', 'Nm', 'readonly-input'),
  flatColumn('传动效率', 'p5', { cellMode: 'readonly-input', unit: '/' }),
  flatColumn('总减速比', 'p6', { cellMode: 'readonly-input', unit: '/' }),
  unitColumn('舟它额定负载', 'p7', 'Nm', 'readonly-input'),
  unitColumn('标准单位空载转速', 'p8', 'rad/s', 'computed'),
  unitColumn('标准单位额定转速', 'p9', 'rad/s', 'computed'),
  unitColumn('负载刚度', 'p10', '(rad/s)Nm', 'computed'),
  unitColumn('舟它额定负载时电机转矩', 'p11', 'Nm', 'computed'),
  unitColumn('舟它额定负载时电机转速', 'p12', 'rad/s', 'computed'),
  unitColumn('最大输出力矩', 'p13', 'Nm', 'computed'),
  unitColumn('最大空载转速', 'p14', '°/S', 'computed'),
  unitColumn('额定转速', 'p15', '°/S', 'computed'),
];

export function flattenPage3_1LeafColumns(columns: Page3_1AntColumn[]): Page3_1AntColumn[] {
  const result: Page3_1AntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenPage3_1LeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const PAGE3_1_LEAF_COLUMNS = flattenPage3_1LeafColumns(PAGE3_1_ANT_COLUMNS);
