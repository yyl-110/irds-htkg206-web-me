export interface Tbdemo1Page2Row extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string | number;
  p2?: string | number;
  p3?: string | number;
  p4?: string | number;
  p5?: string | number;
  p6?: string | number;
  p7?: string | number;
  p8?: string | number;
}

export interface Tbdemo1Page2ParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  colData?: Array<{ colName?: string; isShowCol?: string }>;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: Tbdemo1Page2Row[];
    colStr?: string[];
    rowNums?: number | string;
  };
}

export const TB_DEMO1_LAYER_VOLTAGE_TABLE = 'TB_DEMO1_T_LAYERVOLTAGE';

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];

export function createDefaultTbdemo1Page2ParameterList(pageId = ''): Tbdemo1Page2ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '9',
        rowNums: 0,
        rowData: [],
        colStr: TABLE_COL_STR,
      },
      tableName: '层级电压计算表',
      inputName: '层级电压计算表',
      tableType: '1',
      tableNum: TB_DEMO1_LAYER_VOLTAGE_TABLE,
      colData: [
        { colName: '分接号', isShowCol: '1' },
        { colName: '线电压', isShowCol: '1' },
        { colName: '相电压', isShowCol: '1' },
        { colName: '计算匝数', isShowCol: '1' },
        { colName: '取整后匝数', isShowCol: '1' },
        { colName: '理论级差匝数', isShowCol: '1' },
        { colName: '实际端子匝数', isShowCol: '1' },
        { colName: '实际每级匝数', isShowCol: '1' },
        { colName: '电压比偏差百分比%', isShowCol: '1' },
      ],
    },
  ];
}

export function getLayerVoltageRows(list: Tbdemo1Page2ParameterItem[]): Tbdemo1Page2Row[] {
  return (list[0]?.tableMap?.rowData ?? []) as Tbdemo1Page2Row[];
}

export function setLayerVoltageRows(list: Tbdemo1Page2ParameterItem[], rows: Tbdemo1Page2Row[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}
