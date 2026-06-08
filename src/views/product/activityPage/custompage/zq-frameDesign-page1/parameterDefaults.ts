export interface FrameModelRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string;
  p2?: string;
}

export interface ZqFrameDesignPage1ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: number;
    rowData?: FrameModelRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
  tableName?: string;
  tableType?: string;
  tableNum?: string;
}

export const CONNECTION_TYPE_OPTIONS = [{ value: '铆接' }];

export const PRODUCT_CATEGORY_ID = '891';
export const PRODUCT_ROOT_NODE_ID = '17';
export const MODULE_CATEGORY_ID = '489';

const DEFAULT_TABLE_ROWS: FrameModelRow[] = [
  {
    p0: '车架总成',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '模型名称',
    p1: 'A1001',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: '模型编号',
    p2: 'A1001-1',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '1',
    cellInputName2: '新模型编号',
  },
  {
    p0: '左纵梁',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '模型名称',
    p1: 'A2001',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: '模型编号',
    p2: 'A2001-1',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '1',
    cellInputName2: '新模型编号',
  },
  {
    p0: '右纵梁',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '模型名称',
    p1: 'A3001',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: '模型编号',
    p2: 'A3001-1',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '1',
    cellInputName2: '新模型编号',
  },
];

export function createDefaultZqFrameDesignPage1ParameterList(pageId = ''): ZqFrameDesignPage1ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '车架形式',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '车架外宽-前(mm)',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '车架外宽-后(mm)',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '连接形式',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '车架平台编号',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '参考车架总成编号',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '车架总成模板编号',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '3',
        rowData: DEFAULT_TABLE_ROWS.map(row => ({ ...row })),
        colStr: ['p0', 'p1', 'p2'],
        colData: [
          { colName: '模型名称', isShowCol: '1' },
          { colName: '模型编号', isShowCol: '1' },
          { colName: '新模型编号', isShowCol: '1' },
        ],
      },
      tableName: '车架设计',
      inputName: '车架设计',
      tableType: '1',
      tableNum: '',
    },
  ];
}

export function cloneParameterList(source: ZqFrameDesignPage1ParameterItem[]): ZqFrameDesignPage1ParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: item.tableMap.rowData?.map(row => ({ ...row })),
        }
      : item.tableMap,
  }));
}

export function getFrameModelRows(list: ZqFrameDesignPage1ParameterItem[]): FrameModelRow[] {
  return list[7]?.tableMap?.rowData ?? [];
}

export function setFrameModelRows(list: ZqFrameDesignPage1ParameterItem[], rows: FrameModelRow[]) {
  if (!list[7]?.tableMap) return;
  list[7].tableMap.rowData = rows;
  list[7].tableMap.rowNums = rows.length;
  list[7].tableMap.colStr = ['p0', 'p1', 'p2'];
}
