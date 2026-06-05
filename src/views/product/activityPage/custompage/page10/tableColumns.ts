export type Page10CellMode = 'text' | 'editable';

export interface Page10AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  cellMode?: Page10CellMode;
  children?: Page10AntColumn[];
}

function leaf(
  title: string,
  dataIndex: string,
  width = 95,
  opts?: { fixed?: 'left' | 'right'; cellMode?: Page10CellMode },
): Page10AntColumn {
  return {
    title,
    dataIndex,
    key: dataIndex,
    align: 'center',
    width,
    fixed: opts?.fixed,
    cellMode: opts?.cellMode,
  };
}

function metricGroup(title: string, dataIndex: string, unit: string): Page10AntColumn {
  return {
    title,
    align: 'center',
    width: 95,
    children: [leaf(unit, dataIndex, 95)],
  };
}

function unitGroup(title: string, dataIndex: string, unit: string): Page10AntColumn {
  return {
    title,
    align: 'center',
    children: [leaf(unit, dataIndex, 95)],
  };
}

export { PAGE9_SCHEME_COLUMNS as PAGE10_SCHEME_COLUMNS } from '../page9/tableColumns';

export const PAGE10_DEGREE_COLUMNS: Page10AntColumn[] = [
  leaf('角度位置', 'p0', 95, { cellMode: 'editable' }),
  leaf('修正后总减速比', 'p1', 110, { cellMode: 'editable' }),
  leaf('电机空载速度', 'p2', 95),
  leaf('电机额定转速', 'p3', 95),
  leaf('电机额定转矩', 'p4', 95),
  leaf('电机最大输出转矩', 'p5', 95),
  leaf('传动效率', 'p6', 95),
  leaf('舵机额定负载', 'p7', 95),
  leaf('标准单位空载转速', 'p8', 95),
  leaf('标准单位额定转速', 'p9', 95),
  leaf('负载刚度', 'p10', 95),
  leaf('舵机额定负载时电机转矩', 'p11', 95),
  leaf('舵机额定负载时电机转速', 'p12', 95),
  leaf('最大输出力矩', 'p13', 95),
  leaf('最大空载转速', 'p14', 95),
  leaf('额定转速', 'p15', 95),
];

export const NUMERIC_INPUT_REG = /^(\-|\+)?\d+(\.\d+)?$/;

export function isNumericInput(val: string) {
  return !val || NUMERIC_INPUT_REG.test(val);
}
