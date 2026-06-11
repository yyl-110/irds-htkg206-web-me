export interface Zt1CabinetRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string | number;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string;
  p10?: string;
  p11?: string;
  p12?: string;
  p13?: string;
}

export interface Zt1_4101ParameterItem {
  inputOrOutput?: string;
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  parameterNum?: string;
  defaultValue?: string;
  propertyType?: string;
  inputName?: string;
  /** 保存到 tables 接口时使用的组件 id */
  componentId?: string | number;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: Zt1CabinetRow[];
    colStr?: string[];
  };
  colData?: Array<{ colName?: string; isShowCol?: string; colParameterNum?: string }>;
}

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'];

export const ZT1_4101_CABINET_TABLE_NUM = 'ZT1_4_10_1_T_SBCMODEL';

export const ZT1_4101_CABINET_TABLE_INDEX = 1;

/** 设备舱模型表 componentId（customizedProcess1-ZT1_4_10_1 专用） */
export const ZT1_4101_CABINET_TABLE_COMPONENT_ID = 39;

export function ensureZt1_4101TableComponentIds(list: Zt1_4101ParameterItem[]): Zt1_4101ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === ZT1_4101_CABINET_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: ZT1_4101_CABINET_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

export const CABINET_COUNT_OPTIONS = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const POSITION_OPTIONS = [
  { label: '左侧', value: 1 },
  { label: '右侧', value: 2 },
];

export function resolveTemplateByPosition(position: string | number | undefined): string {
  return Number(position) === 2 ? 'TEMP_ZT_SBC01_R' : 'TEMP_ZT_SBC01_L';
}

export function createDefaultCabinetRow(index: number): Zt1CabinetRow {
  return {
    p0: String(index),
    p1: '',
    p2: 1,
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: '',
    p11: '',
    p12: '',
    p13: 'TEMP_ZT_SBC01_L',
  };
}

export function createDefaultCabinetRows(count = 2): Zt1CabinetRow[] {
  return Array.from({ length: count }, (_, index) => createDefaultCabinetRow(index + 1));
}

export function createDefaultZt1_4101ParameterList(pageId = ''): Zt1_4101ParameterItem[] {
  return [
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'ZT1_4_10_1_SBCSL',
      parameterId: '',
      defaultValue: '2',
      propertyType: '1',
      pageId,
      inputName: '设备舱数量',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '14',
        rowNums: '2',
        rowData: createDefaultCabinetRows(2),
        colStr: TABLE_COL_STR,
      },
      tableName: '设备舱模型表',
      inputName: '设备舱模型表',
      tableType: '1',
      tableNum: ZT1_4101_CABINET_TABLE_NUM,
      componentId: ZT1_4101_CABINET_TABLE_COMPONENT_ID,
      colData: [
        { colName: '选择', isShowCol: '1', colParameterNum: '' },
        { colName: '序号', isShowCol: '1', colParameterNum: '' },
        { colName: '设备舱名称', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_SBCNAME' },
        { colName: '设备舱位置', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_SBCWEIZHI' },
        { colName: '设备舱安装基准面X', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_BASEFACEX' },
        { colName: '设备舱安装基准面Y', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_BASEFACEY' },
        { colName: '设备舱安装基准面Z', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_BASEFACEZ' },
        { colName: '舱体高', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_BODYHEIGHT' },
        { colName: '舱体底部宽', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_BOTTOMWIDTH' },
        { colName: '外侧面与底部夹角', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_DEGREE1' },
        { colName: '内侧面下部高度', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_INNERFACEBOTTOMHEIGHT' },
        { colName: '内侧面上部与下部夹角', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_DEGREE2' },
        { colName: '舱体长', isShowCol: '1', colParameterNum: 'ZT1_4_10_1_BODYLENGTH' },
        { colName: '新模型文件名', isShowCol: '1' },
        { colName: '模板文件名', isShowCol: '1' },
      ],
    },
  ];
}

export function getCabinetTableRows(list: Zt1_4101ParameterItem[]): Zt1CabinetRow[] {
  return (list[1]?.tableMap?.rowData ?? []) as Zt1CabinetRow[];
}

export function setCabinetTableRows(list: Zt1_4101ParameterItem[], rows: Zt1CabinetRow[]) {
  if (!list[1]?.tableMap) return;
  list[1].tableMap.rowData = rows;
  list[1].tableMap.rowNums = rows.length;
  list[1].tableMap.colStr = TABLE_COL_STR;
}

export function syncCabinetRowCount(list: Zt1_4101ParameterItem[], rawCount: string | number | undefined) {
  const count = Number(rawCount);
  if (!rawCount && rawCount !== 0) return;
  if (count < 2 || count > 10) return;

  const rows = getCabinetTableRows(list);
  if (count === rows.length) return;

  if (count > rows.length) {
    const nextRows = [...rows];
    for (let i = rows.length; i < count; i++) {
      nextRows.push(createDefaultCabinetRow(i + 1));
    }
    setCabinetTableRows(list, nextRows);
  } else {
    setCabinetTableRows(list, rows.slice(0, count));
  }

  if (list[0]) {
    list[0].defaultValue = String(count);
  }
}
