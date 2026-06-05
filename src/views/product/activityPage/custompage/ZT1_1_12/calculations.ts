import type { Zt1TableRow } from './parameterDefaults';

function formatPercent(numerator: number, denominator: number): string {
  if (!denominator) return '';
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

function sumField(rows: Zt1TableRow[], key: keyof Zt1TableRow): number {
  return rows.reduce((sum, row) => {
    const value = Number(row[key]);
    return Number.isNaN(value) ? sum : sum + value;
  }, 0);
}

export function calcRowPercents(row: Zt1TableRow): Zt1TableRow {
  const p1 = Number(row.p1);
  const p2 = Number(row.p2);
  const p3 = Number(row.p3);
  const p5 = Number(row.p5);
  const p7 = Number(row.p7);
  const p9 = Number(row.p9);

  return {
    ...row,
    p4: formatPercent(p3, p1),
    p6: formatPercent(p5, p2),
    p8: formatPercent(p7, p1),
    p10: formatPercent(p9, p2),
  };
}

export function buildTableSummary(rows: Zt1TableRow[]): Record<string, string | number> {
  const p1 = sumField(rows, 'p1');
  const p2 = sumField(rows, 'p2');
  const p3 = sumField(rows, 'p3');
  const p5 = sumField(rows, 'p5');
  const p7 = sumField(rows, 'p7');
  const p9 = sumField(rows, 'p9');

  return {
    p0: '总计',
    p1,
    p2,
    p3,
    p4: formatPercent(p3, p1),
    p5,
    p6: formatPercent(p5, p2),
    p7,
    p8: formatPercent(p7, p1),
    p9,
    p10: formatPercent(p9, p2),
  };
}
