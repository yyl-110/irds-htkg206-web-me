export type WallCheckCellMode = 'text' | 'number';

export interface WallCheckAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: WallCheckCellMode;
  children?: WallCheckAntColumn[];
}

function leaf(title: string, dataIndex: string, width: number, cellMode: WallCheckCellMode = 'text'): WallCheckAntColumn {
  return { title, dataIndex, key: dataIndex, width, align: 'center', cellMode };
}

export const DISPLAY_TABLE_COLUMNS: WallCheckAntColumn[] = [
  leaf('筒段序号', 'p0', 70),
  leaf('筒段描述', 'p1', 100),
  leaf('层合板总厚度', 'p2', 120),
  leaf('层合板纵向弹性模量E1', 'p3', 140),
  leaf('层合板横向弹性模量E2', 'p4', 120),
  leaf('层合板纵向泊松比V1', 'p5', 120),
  leaf('层合板纵向泊松比V2', 'p6', 120),
  leaf('层合板纵横切模量G12', 'p7', 120),
];

export const CHECK_TABLE_COLUMNS: WallCheckAntColumn[] = [
  leaf('筒段序号', 'p0', 70),
  {
    title: '计算输入',
    align: 'center',
    children: [
      leaf('内蒙皮内径φ', 'p1', 100, 'number'),
      leaf('内蒙皮厚度', 'p2', 90),
      leaf('层合板纵向弹性模量E1', 'p3', 120),
      leaf('层合板横向弹性模量E2', 'p4', 120),
      leaf('外蒙皮外径φ', 'p5', 100, 'number'),
      leaf('外蒙皮厚度', 'p6', 90),
      leaf('层合板纵向弹性模量E1', 'p7', 120),
      leaf('层合板横向弹性模量E2', 'p8', 120),
      leaf('简体所受最大弯矩M', 'p9', 120, 'number'),
      leaf('简体所受最大剪力Q', 'p10', 120, 'number'),
    ],
  },
  {
    title: '计算结果',
    align: 'center',
    children: [
      leaf('抗弯刚度(N-m2)', 'p11', 120),
      leaf('设计载荷下整体弯曲稳定性剩余强度系数', 'p12', 150),
      leaf('设计载荷下剪切稳定性剩余强度系数', 'p13', 150),
      leaf('设计载荷下外蒙皮局部稳定性剩余强度系数', 'p14', 170),
      leaf('设计载荷下内蒙皮局部稳定性剩余强度系数', 'p15', 170),
      leaf('内压下沿半径方向变形', 'p16', 120),
      leaf('内压下内表面环向应变', 'p17', 120),
      leaf('装退弹正应力(Pa)', 'p18', 120),
    ],
  },
];

export function flattenWallCheckLeafColumns(columns: WallCheckAntColumn[]): WallCheckAntColumn[] {
  const result: WallCheckAntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenWallCheckLeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const CHECK_LEAF_COLUMNS = flattenWallCheckLeafColumns(CHECK_TABLE_COLUMNS);
export const CHECK_COLUMN_MAP = new Map(CHECK_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));
