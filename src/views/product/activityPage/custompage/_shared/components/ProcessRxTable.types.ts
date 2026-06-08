import type { legacyH } from '../utils/legacyH';

export interface LegacyRenderParams {
  row: Record<string, unknown>;
  index: number;
  column: LegacyColumn;
}

export interface LegacyColumn {
  title?: string;
  key?: string;
  align?: string;
  width?: number | string;
  minWidth?: number | string;
  children?: LegacyColumn[];
  render?: (h: typeof legacyH, params: LegacyRenderParams) => unknown;
  [key: string]: unknown;
}
