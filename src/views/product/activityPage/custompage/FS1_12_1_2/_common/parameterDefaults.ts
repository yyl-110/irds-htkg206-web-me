import type { AdapterDesignRow, AdapterPageConfig, AdapterParameterItem } from './types';

export type { AdapterDesignRow, AdapterParameterItem, AdapterPageConfig };

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const TABLE_INDEX = 19;
export const SCALAR_PARAM_COUNT = 19;
export const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
export const TYPE_OPTIONS = [{ label: '有电缆槽' }, { label: '无电缆槽' }] as const;

function paramNum(config: AdapterPageConfig, suffix: string) {
  if (suffix === 'QDJH1' && config.qdjh1ParamNum) return config.qdjh1ParamNum;
  return `${config.paramPrefix}_${suffix}`;
}

function createDefaultTableRows(config: AdapterPageConfig): AdapterDesignRow[] {
  return [
    {
      p0: '1',
      p1: '有电缆槽',
      p2: '0',
      p3: '15',
      p4: '0',
      p5: '1111',
      p6: config.templates.withCable,
    },
    {
      p0: '2',
      p1: '无电缆槽',
      p2: '0',
      p3: '15',
      p4: '0',
      p5: '2222',
      p6: config.templates.withoutCable,
    },
  ];
}

export function createDefaultAdapterParameterList(
  config: AdapterPageConfig,
  pageId = '',
): AdapterParameterItem[] {
  const prefix = config.paramPrefix;
  const tableRows = createDefaultTableRows(config);

  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS4_201_001_D1',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '适配器外径',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'T1'),
      parameterId: '',
      defaultValue: '40',
      propertyType: '1',
      pageId,
      inputName: '本体厚度',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'T2'),
      parameterId: '',
      defaultValue: '2',
      propertyType: '1',
      pageId,
      inputName: '橡塑复合板厚度',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'T3'),
      parameterId: '',
      defaultValue: '7',
      propertyType: '1',
      pageId,
      inputName: '海绵胶板厚度',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'QDJW1'),
      parameterId: '',
      defaultValue: '18',
      propertyType: '1',
      pageId,
      inputName: '前缘倒角宽',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'QDJH1'),
      parameterId: '',
      defaultValue: '6',
      propertyType: '1',
      pageId,
      inputName: '前缘倒角高',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'QDJR1'),
      parameterId: '',
      defaultValue: '20',
      propertyType: '1',
      pageId,
      inputName: '前缘倒圆角R',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'QDJW2'),
      parameterId: '',
      defaultValue: '52',
      propertyType: '1',
      pageId,
      inputName: '前缘内倒角宽',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'QDJH2'),
      parameterId: '',
      defaultValue: '26',
      propertyType: '1',
      pageId,
      inputName: '前缘外倒角高',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: config.lParamNums.l3,
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: `${config.adapterLabel}销轴与0位距离`,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: config.lParamNums.l1,
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: `${config.adapterLabel}前支撑面距离`,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: config.lParamNums.l2,
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: `${config.adapterLabel}支撑宽度`,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: config.lParamNums.l4,
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: `${config.adapterLabel}-前缘`,
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'HDJW1'),
      parameterId: '',
      defaultValue: '18',
      propertyType: '1',
      pageId,
      inputName: '后缘倒角宽',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'HDJH1'),
      parameterId: '',
      defaultValue: '6',
      propertyType: '1',
      pageId,
      inputName: '后缘倒角高',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'HDJR1'),
      parameterId: '',
      defaultValue: '20',
      propertyType: '1',
      pageId,
      inputName: '后缘倒圆角',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'DLCW1'),
      parameterId: '',
      defaultValue: '155',
      propertyType: '1',
      pageId,
      inputName: '电缆槽宽',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: paramNum(config, 'DLCH1'),
      parameterId: '',
      defaultValue: '30',
      propertyType: '1',
      pageId,
      inputName: '电缆槽高',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS4_201_001_L1',
      parameterId: '',
      defaultValue: '30',
      propertyType: '1',
      pageId,
      inputName: '支撑面与筒零位距离',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '10',
        rowNums: '',
        rowData: tableRows,
        colStr: TABLE_COL_STR,
        colData: [
          { colName: '选择', isShowCol: '1', colParameterNum: '' },
          { colName: '序号', isShowCol: '1', colParameterNum: '' },
          { colName: '类型', isShowCol: '1', colParameterNum: '' },
          { colName: '中面与1象限夹角', isShowCol: '1', colParameterNum: config.tableDegParams.p2 },
          { colName: '销轴1象限夹角', isShowCol: '1', colParameterNum: config.tableDegParams.p3 },
          { colName: '电缆槽与1象限夹角', isShowCol: '1', colParameterNum: config.tableDegParams.p4 },
          { colName: '新模型文件名', isShowCol: '1' },
          { colName: '模板文件名', isShowCol: '1' },
        ],
      },
      tableName: config.tableName,
      inputName: config.tableName,
      tableType: '1',
      tableNum: config.tableNum,
    },
  ];
}

export function getAdapterTableRows(list: AdapterParameterItem[]): AdapterDesignRow[] {
  return (list[TABLE_INDEX]?.tableMap?.rowData ?? []) as AdapterDesignRow[];
}

export function setAdapterTableRows(list: AdapterParameterItem[], rows: AdapterDesignRow[]) {
  if (!list[TABLE_INDEX]?.tableMap) return;
  list[TABLE_INDEX].tableMap!.rowData = rows;
  list[TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}

export function resolveTemplateByType(config: AdapterPageConfig, typeValue: string) {
  return typeValue === '有电缆槽' ? config.templates.withCable : config.templates.withoutCable;
}

export function isValidParamValue(val: unknown) {
  if (val === undefined || val === 'undefined' || val === null || val === 'null' || val === '') {
    return false;
  }
  return true;
}
