export interface Page2_1AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  inputType?: 'number' | 'text';
  children?: Page2_1AntColumn[];
}

export const REDUCER_TYPE_OPTIONS = [
  { value: '1', label: '浏览' },
  { value: '2', label: '输入' },
];

function unitColumn(title: string, dataIndex: string, unit: string): Page2_1AntColumn {
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
        editable: true,
        inputType: 'number',
      },
    ],
  };
}

function flatColumn(
  title: string,
  dataIndex: string,
  options?: { editable?: boolean; inputType?: 'number' | 'text'; width?: number },
): Page2_1AntColumn {
  return {
    title,
    dataIndex,
    key: dataIndex,
    align: 'center',
    width: options?.width ?? 95,
    editable: options?.editable ?? true,
    inputType: options?.inputType ?? 'number',
  };
}

export const REDUCER_SELECT_ANT_COLUMNS: Page2_1AntColumn[] = [
  {
    title: '类别',
    dataIndex: 'p0',
    key: 'p0',
    width: 95,
    align: 'center',
    editable: true,
    inputType: 'text',
  },
  flatColumn('减速器序号', 'p1', { editable: false, inputType: 'text' }),
  flatColumn('产品代号', 'p2', { inputType: 'text' }),
  flatColumn('产品名称', 'p3', { inputType: 'text' }),
  flatColumn('输出形式', 'p4', { inputType: 'text' }),
  unitColumn('传动比(直线或旋转)', 'p5', 'N/Nm或r/r'),
  unitColumn('最大输出能力(直线或旋转)', 'p6', 'N或Nm'),
  flatColumn('导程(直线)', 'p7'),
  flatColumn('中径(直线)', 'p8'),
  unitColumn('全机械行程(直线或旋转)', 'p9', 'mm或°'),
  flatColumn('重量', 'p10'),
  flatColumn('接口示意图', 'p11', { inputType: 'text' }),
  flatColumn('生产厂家', 'p12', { inputType: 'text' }),
  flatColumn('其它说明', 'p13', { inputType: 'text' }),
];

/** 统一类别字段：下拉值为 1/2，兼容历史数据中的中文或数字 */
export function normalizeReducerCategoryValue(value: string | number | undefined): string {
  const raw = String(value ?? '').trim();
  if (raw === '1' || raw === '浏览') return '1';
  if (raw === '2' || raw === '输入') return '2';
  return raw;
}

export function isBrowseModeRow(record: Record<string, string | number | undefined>): boolean {
  return normalizeReducerCategoryValue(record.p0) === '1';
}
