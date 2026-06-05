import type { LoadAnalysisRow } from './parameterDefaults';
import { getRemarkField } from './parameterDefaults';

export function buildLoadTableSummary(
  rows: LoadAnalysisRow[],
  conditionFields: string[],
  remarkField: string,
): Record<string, string | number> {
  const summary: Record<string, string | number> = {
    p0: '',
    p1: '',
    p2: '',
    [remarkField]: '',
  };

  conditionFields.forEach(field => {
    const total = rows.reduce((sum, row) => {
      const value = Number(row[field]);
      return Number.isNaN(value) ? sum : sum + value;
    }, 0);
    summary[field] = total;
  });

  return summary;
}

export function isSummableField(field: string, remarkField: string): boolean {
  return field.startsWith('p') && field !== 'p0' && field !== 'p1' && field !== 'p2' && field !== remarkField;
}
