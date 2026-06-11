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

function leaf(title: string, dataIndex: string, width = 140, opts?: { fixed?: 'left' | 'right'; cellMode?: Page10CellMode }): Page10AntColumn {
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

export { PAGE9_SCHEME_COLUMNS as PAGE10_SCHEME_COLUMNS, PAGE9_SCHEME_TABLE_MIN_WIDTH as PAGE10_SCHEME_TABLE_MIN_WIDTH } from '../page9/tableColumns';

export const PAGE10_DEGREE_COLUMNS: Page10AntColumn[] = [
  leaf('角度位置', 'p0', 130, { cellMode: 'editable' }),
  leaf('修正后总减速比', 'p1', 150, { cellMode: 'editable' }),
  leaf('电机空载速度', 'p2', 140),
  leaf('电机额定转速', 'p3', 140),
  leaf('电机额定转矩', 'p4', 140),
  leaf('电机最大输出转矩', 'p5', 150),
  leaf('传动效率', 'p6', 130),
  leaf('舟它额定负载', 'p7', 140),
  leaf('标准单位空载转速', 'p8', 150),
  leaf('标准单位额定转速', 'p9', 150),
  leaf('负载刚度', 'p10', 130),
  leaf('舟它额定负载时电机转矩', 'p11', 175),
  leaf('舟它额定负载时电机转速', 'p12', 175),
  leaf('最大输出力矩', 'p13', 140),
  leaf('最大空载转速', 'p14', 140),
  leaf('额定转速', 'p15', 130),
];

export const PAGE10_DEGREE_TABLE_MIN_WIDTH = PAGE10_DEGREE_COLUMNS.reduce((sum, col) => sum + (col.width ?? 140), 0);

export const NUMERIC_INPUT_REG = /^(\-|\+)?\d+(\.\d+)?$/;

export function isNumericInput(val: string) {
  return !val || NUMERIC_INPUT_REG.test(val);
}
