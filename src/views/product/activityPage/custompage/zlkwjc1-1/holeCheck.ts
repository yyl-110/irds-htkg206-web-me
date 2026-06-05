import type { ZlkwjcCheckRow } from './parameterDefaults';

export interface HoleCheckDetailItem {
  id1?: unknown;
  id2?: unknown;
  model?: string;
  path?: string;
  info?: string;
}

export interface HoleCheckResultItem {
  name?: string;
  result?: string;
  items?: HoleCheckDetailItem[];
}

export interface HoleCheckResponse {
  data?: HoleCheckResultItem[];
}

export function applyHoleCheckResults(rows: ZlkwjcCheckRow[], returnJson: HoleCheckResponse): ZlkwjcCheckRow[] {
  const data = returnJson?.data ?? [];
  const nextRows = rows.map(row => ({ ...row }));

  data.forEach((dataVal, i) => {
    const row = nextRows[i];
    if (!row) return;

    row.p2 = dataVal.result ?? row.p2;
    if (row.p1 === dataVal.name) {
      row.p2 = dataVal.result ?? row.p2;
    }
  });

  return nextRows;
}

export function getFailedRowExpandItems(
  returnJson: HoleCheckResponse | null,
  rowIndex: number,
): HoleCheckDetailItem[] {
  const dataItem = returnJson?.data?.[rowIndex];
  return dataItem?.result === '不通过' ? (dataItem.items ?? []) : [];
}
