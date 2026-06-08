export type LaminateCellMode = 'text' | 'number';

export interface LaminateAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: LaminateCellMode;
  validateNumeric?: boolean;
  children?: LaminateAntColumn[];
}

function leaf(
  title: string,
  dataIndex: string,
  width: number,
  cellMode: LaminateCellMode = 'text',
  validateNumeric = false,
): LaminateAntColumn {
  return { title, dataIndex, key: dataIndex, width, align: 'center', cellMode, validateNumeric };
}

function layerGroup(title: string, pairs: Array<[string, string]>): LaminateAntColumn {
  return {
    title,
    align: 'center',
    children: pairs.map(([t, d]) => leaf(t, d, 80, 'number', ['p5', 'p7', 'p9', 'p11', 'p15', 'p17', 'p19', 'p21'].includes(d))),
  };
}

export const LAMINATE_TABLE_COLUMNS: LaminateAntColumn[] = [
  leaf('筒段序号', 'p0', 70, 'text'),
  leaf('筒段描述', 'p1', 100, 'text'),
  layerGroup('材料1', [
    ['铺层角度θ1', 'p2'],
    ['铺层厚度1', 'p3'],
    ['铺层角度θ2', 'p4'],
    ['铺层厚度2', 'p5'],
    ['铺层角度θ3', 'p6'],
    ['铺层厚度3', 'p7'],
    ['铺层角度θ4', 'p8'],
    ['铺层厚度4', 'p9'],
    ['铺层角度θ5', 'p10'],
    ['铺层厚度5', 'p11'],
  ]),
  layerGroup('材料2', [
    ['铺层角度θ1', 'p12'],
    ['铺层厚度1', 'p13'],
    ['铺层角度θ2', 'p14'],
    ['铺层厚度2', 'p15'],
    ['铺层角度θ3', 'p16'],
    ['铺层厚度3', 'p17'],
    ['铺层角度θ4', 'p18'],
    ['铺层厚度4', 'p19'],
    ['铺层角度θ5', 'p20'],
    ['铺层厚度5', 'p21'],
  ]),
  leaf('层合板总厚度', 'p22', 90, 'text'),
  leaf('层合板纵向弹性模量E1', 'p23', 90, 'text'),
  leaf('层合板横向弹性模量E2', 'p24', 90, 'text'),
  leaf('层合板纵向泊松比V1', 'p25', 100, 'text'),
  leaf('层合板横向泊松比V2', 'p26', 100, 'text'),
  leaf('层合板纵横切模量G12', 'p27', 100, 'text'),
];

export function flattenLaminateLeafColumns(columns: LaminateAntColumn[]): LaminateAntColumn[] {
  const result: LaminateAntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenLaminateLeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const LAMINATE_LEAF_COLUMNS = flattenLaminateLeafColumns(LAMINATE_TABLE_COLUMNS);
export const LAMINATE_COLUMN_MAP = new Map(LAMINATE_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));

export const MATERIAL1_FIELDS = [
  { label: '沿纤维方向的弹性模量EL1(GPa)：', index: 0 },
  { label: '垂直于纤维方向的弹性模量ET1(GPa)：', index: 1 },
  { label: '单向板纵向柏松比vLT：', index: 2 },
  { label: '单向板纵横剪切弹性模量GLT(GPa)：', index: 3 },
];

export const MATERIAL2_FIELDS = [
  { label: '沿纤维方向的弹性模量EL1(GPa)：', index: 4 },
  { label: '垂直于纤维方向的弹性模量ET1(GPa)：', index: 5 },
  { label: '单向板纵向柏松比vLT：', index: 6 },
  { label: '单向板纵横剪切弹性模量GLT(GPa)：', index: 7 },
];
