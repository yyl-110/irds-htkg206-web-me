// @ts-expect-error legacy js module
import excel from '@/utils/excel.js';
import type { Page10DegreeRow, Page10SchemeRow } from './parameterDefaults';

export interface ImportedDegreeRow {
  degree: string | number;
  recheckAllJSB: string | number;
}

export function parseDegreeExcelRows(results: Array<Record<string, unknown>>): ImportedDegreeRow[] {
  if (!results.length) return [];
  const first = results[0];
  const keys = Object.keys(first);
  const key0 = keys[0];
  const key1 = keys[1];
  return results.map(row => ({
    degree: row[key0] as string | number,
    recheckAllJSB: row[key1] as string | number,
  }));
}

export async function readDegreeExcelFile(file: File): Promise<ImportedDegreeRow[]> {
  const buffer = await file.arrayBuffer();
  const { results } = excel.read(buffer, 'array');
  return parseDegreeExcelRows(results as Array<Record<string, unknown>>);
}

export function buildDegreeRowsFromImport(
  imported: ImportedDegreeRow[],
  templateRow: Page10DegreeRow,
  schemeRow: Page10SchemeRow,
): Page10DegreeRow[] {
  const totalRatio = Number(schemeRow.p10 ?? 0);
  return imported.map(item => {
    const newJsb = Number(item.recheckAllJSB) * totalRatio;
    return {
      ...templateRow,
      p0: String(item.degree ?? ''),
      p1: Number.isFinite(newJsb) ? newJsb.toFixed(2) : '',
      p13: '',
      p14: '',
      p15: '',
    };
  });
}
