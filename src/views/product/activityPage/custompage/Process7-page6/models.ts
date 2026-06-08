export type {
  DeletableProcessColumn,
  Page6_1ParameterItem as Page6ParameterItem,
  ProcessListItem,
  SupplyTableRow,
  TableMap,
} from '../Process7-page6-1/models';

export interface Page6VariantConfig {
  efficiencyColumnTitle: string;
  acDcColumnTitle: string;
  mergeColumns: string[];
  baseColCount: number;
  processDeviceStartIndex: number;
  resetColNums: number;
}

export const PAGE6_VARIANT: Page6VariantConfig = {
  efficiencyColumnTitle: '低压DC/DC组合效率',
  acDcColumnTitle: 'AC/DC组合效率',
  mergeColumns: ['p0', 'p7'],
  baseColCount: 10,
  processDeviceStartIndex: 10,
  resetColNums: 10,
};

export const PAGE6_BASE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];
