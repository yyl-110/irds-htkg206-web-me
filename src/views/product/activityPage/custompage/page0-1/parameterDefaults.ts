export interface Page0_1ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  pageId?: string;
  inputName?: string;
  propertyType?: string;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  componentId?: string | number;
  id?: string | number;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    colData?: Array<{ colName?: string; isShowCol?: string }>;
    tableheader?: Array<{ colName?: string; isShowCol?: string }>;
    rowNums?: string | number;
    rowData?: Array<Record<string, string>>;
    colStr?: string[];
  };
}

/** 基本参数表 componentId（customizedProcess-page0-1 专用） */
export const PAGE0_1_BASE_TABLE_COMPONENT_ID = 5;
/** 工作参数表 componentId（customizedProcess-page0-1 专用） */
export const PAGE0_1_WORK_TABLE_COMPONENT_ID = 6;
/** 通讯形式表 componentId（customizedProcess-page0-1 专用） */
export const PAGE0_1_COMM_TABLE_COMPONENT_ID = 7;
/** 幅相参数表 componentId（customizedProcess-page0-1 专用） */
export const PAGE0_1_FUXIANG_TABLE_COMPONENT_ID = 8;

export function createDefaultPage0_1ParameterList(pageId = ''): Page0_1ParameterItem[] {
  return [
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ0_ENTITYID',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '任务ID',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '12',
        colData: [
          { colName: '输出形式', isShowCol: '1' },
          { colName: '最大输出力矩(Nm)', isShowCol: '1' },
          { colName: '额定输出力矩(Nm)', isShowCol: '1' },
          { colName: '额定负载速度(°/s)', isShowCol: '1' },
          { colName: '最大空载速度(°/s)', isShowCol: '1' },
          { colName: '最大输出力矩(N)', isShowCol: '1' },
          { colName: '额定输出力矩(N)', isShowCol: '1' },
          { colName: '额定负载速度(mm/s)', isShowCol: '1' },
          { colName: '最大空载速度(mm/s)', isShowCol: '1' },
          { colName: '机械行程(单边)(°)', isShowCol: '1' },
          { colName: '机械行程(单边)(mm)', isShowCol: '1' },
        ],
        tableheader: [
          { colName: '输出形式', isShowCol: '1' },
          { colName: '最大输出力矩(Nm)', isShowCol: '1' },
          { colName: '额定输出力矩(Nm)', isShowCol: '1' },
          { colName: '额定负载速度(°/s)', isShowCol: '1' },
          { colName: '最大空载速度(°/s)', isShowCol: '1' },
          { colName: '最大输出力矩(N)', isShowCol: '1' },
          { colName: '额定输出力矩(N)', isShowCol: '1' },
          { colName: '额定负载速度(mm/s)', isShowCol: '1' },
          { colName: '最大空载速度(mm/s)', isShowCol: '1' },
          { colName: '机械行程(单边)(°)', isShowCol: '1' },
          { colName: '机械行程(单边)(mm)', isShowCol: '1' },
        ],
        rowNums: '2',
        rowData: [],
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'],
      },
      tableName: '基本参数',
      inputName: '',
      tableType: '2',
      tableNum: 'DJ0_1_BASEPARAMS',
      componentId: PAGE0_1_BASE_TABLE_COMPONENT_ID,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '8',
        colData: [
          { colName: '', isShowCol: '1' },
          { colName: '额定工作电压(V)', isShowCol: '1' },
          { colName: '供电电压下限(V)', isShowCol: '1' },
          { colName: '供电电压上限(V)', isShowCol: '1' },
          { colName: '峰值电流(A)', isShowCol: '1' },
          { colName: '平均电流(A)', isShowCol: '1' },
          { colName: '最大消耗电流(A)', isShowCol: '1' },
          { colName: '最大输出维持电流(A)', isShowCol: '1' },
        ],
        tableheader: [
          { colName: '', isShowCol: '1' },
          { colName: '额定工作电压(V)', isShowCol: '1' },
          { colName: '供电电压下限(V)', isShowCol: '1' },
          { colName: '供电电压上限(V)', isShowCol: '1' },
          { colName: '峰值电流(A)', isShowCol: '1' },
          { colName: '平均电流(A)', isShowCol: '1' },
          { colName: '最大消耗电流(A)', isShowCol: '1' },
          { colName: '最大输出维持电流(A)', isShowCol: '1' },
        ],
        rowNums: '2',
        rowData: [
          { p0: '控制器', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
          { p0: '执行机构', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
        ],
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
      },
      tableName: '工作参数',
      inputName: '',
      tableType: '2',
      tableNum: 'DJ0_1_WORKPARAMS',
      componentId: PAGE0_1_WORK_TABLE_COMPONENT_ID,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '2',
        colData: [
          { colName: '数字通讯形式', isShowCol: '1' },
          { colName: '模拟通讯形式', isShowCol: '1' },
        ],
        tableheader: [
          { colName: '数字通讯形式', isShowCol: '1' },
          { colName: '模拟通讯形式', isShowCol: '1' },
        ],
        rowNums: '1',
        rowData: [],
        colStr: ['p0', 'p1'],
      },
      tableName: '通讯形式',
      inputName: '',
      tableType: '2',
      tableNum: 'DJ0_1_COMMSTYLE',
      componentId: PAGE0_1_COMM_TABLE_COMPONENT_ID,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '4',
        colData: [
          { colName: '', isShowCol: '1' },
          { colName: '幅频宽', isShowCol: '1' },
          { colName: '相频宽', isShowCol: '1' },
          { colName: '谐振峰值', isShowCol: '1' },
        ],
        tableheader: [
          { colName: '', isShowCol: '1' },
          { colName: '幅频宽', isShowCol: '1' },
          { colName: '相频宽', isShowCol: '1' },
          { colName: '谐振峰值', isShowCol: '1' },
        ],
        rowNums: '1',
        rowData: [
          { p0: '空载', p1: '', p2: '', p3: '' },
          { p0: '负载', p1: '', p2: '', p3: '' },
        ],
        colStr: ['p0', 'p1', 'p2', 'p3'],
      },
      tableName: '幅相参数',
      inputName: '',
      tableType: '2',
      tableNum: 'DJ0_1_XIANGPINPARAM',
      componentId: PAGE0_1_FUXIANG_TABLE_COMPONENT_ID,
    },
  ];
}

export function createFallbackBaseRowData() {
  return [{ p0: '旋转' }, { p0: '直线' }];
}

export function createFallbackCommRowData() {
  return [{ p0: '', p1: '' }];
}
