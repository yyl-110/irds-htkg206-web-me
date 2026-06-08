import type { TransmissionShaftPage1ParameterItem, TransmissionTableRow } from './parameterDefaults';

const JOINT_DESCRIPTIONS: Record<number, string[]> = {
  2: ['变速箱-传动轴', '传动轴-驱动桥'],
  3: ['变速箱-中间传动轴', '中间传动轴-传动轴', '传动轴-驱动桥'],
  4: ['变速箱-中间传动轴', '中间传动轴-中间传动轴', '中间传动轴-传动轴', '传动轴-驱动桥'],
  5: ['变速箱-中间传动轴', '中间传动轴-中间传动轴', '中间传动轴-中间传动轴', '中间传动轴-传动轴', '传动轴-驱动桥'],
};

function resizeRows<T extends TransmissionTableRow>(
  rows: T[],
  targetCount: number,
  createRow: (index: number) => T,
) {
  if (targetCount > rows.length) {
    for (let i = rows.length; i < targetCount; i += 1) {
      rows.push(createRow(i + 1));
    }
  } else {
    rows.splice(targetCount);
  }
}

function createShaftRow(index: number): TransmissionTableRow {
  return { p0: index, p1: '', p2: '', p3: '', p4: '设计中', p5: '' };
}

function createSupportRow(index: number): TransmissionTableRow {
  return { p0: index, p1: '', p2: '' };
}

function createSpeedRow(index: number): TransmissionTableRow {
  return { p0: index, p1: '', p2: '', p3: '', p4: '', p5: '' };
}

function createJointRow(index: number): TransmissionTableRow {
  return { p0: index, p1: `万向节${index}`, p2: '', p3: '', p4: '', p5: '', p6: '' };
}

function applyJointDescriptions(rows: TransmissionTableRow[]) {
  const descriptions = JOINT_DESCRIPTIONS[rows.length];
  if (!descriptions) return;

  rows.forEach((row, index) => {
    row.p2 = descriptions[index] ?? row.p2;
  });

  if (rows.length >= 3) {
    rows[2].p1 = '万向节3';
  }
  if (rows.length >= 4) {
    rows[3].p1 = '万向节4';
  }
  if (rows.length >= 5) {
    rows[4].p1 = '万向节5';
  }
}

export function syncTablesByShaftCount(list: TransmissionShaftPage1ParameterItem[]) {
  const count = Number(list[0]?.defaultValue ?? 0);
  if (!count || count < 1 || count > 4) return;
  if (count === (list[2]?.tableMap?.rowData?.length ?? 0)) return;

  const shaftRows = list[2]?.tableMap?.rowData ?? [];
  const supportRows = list[3]?.tableMap?.rowData ?? [];
  const speedRows = list[4]?.tableMap?.rowData ?? [];
  const jointRows = list[5]?.tableMap?.rowData ?? [];

  resizeRows(shaftRows, count, createShaftRow);
  resizeRows(speedRows, count, createSpeedRow);
  resizeRows(supportRows, Math.max(count - 1, 0), createSupportRow);
  resizeRows(jointRows, count + 1, createJointRow);

  shaftRows.forEach(row => {
    row.p4 = row.p3 ? '已发布' : '设计中';
  });

  applyJointDescriptions(jointRows);

  list[2].tableMap!.rowNums = count;
  list[3].tableMap!.rowNums = Math.max(count - 1, 0);
  list[4].tableMap!.rowNums = count;
  list[5].tableMap!.rowNums = count + 1;
}

export function universalJointMergedCell(rowIndex?: number, dataIndex?: string | number) {
  const field = String(dataIndex ?? '');
  if (field !== 'p5' && field !== 'p6') return {};
  if (rowIndex == null) return {};
  if (rowIndex % 6 === 0) return { rowSpan: 5 };
  return { rowSpan: 0 };
}
