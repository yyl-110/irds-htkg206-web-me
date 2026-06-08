import type { OutputTableRow } from '../Process7-page5-5/types';

export interface DyjgParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: OutputTableRow[];
    colStr?: string[];
  };
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  colData?: Array<{ colName: string; isShowCol: string }>;
  inputOrOutput?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  globalValue?: string;
  pageFormula?: string;
}

export interface DyjgVariantConfig {
  suffix: string;
  tableNum: string;
  label: string;
}

export const TABLE_INDEX = 15;
export const ELECT_FILE_INDEX = 11;
export const ENV_FILE_INDEX = 13;
export const OUTPUT_ROUTE_INDEX = 14;

export const DYJG_LEFT_FIELDS = [
  { index: 0, label: '柜体最大高：' },
  { index: 2, label: '柜体最大宽：' },
  { index: 4, label: '柜体最大深：' },
  { index: 6, label: '最大质量：' },
  { index: 8, label: '高压直流母线电压范围(V)：' },
];

export const DYJG_RIGHT_FIELDS = [
  { index: 1, label: '额定输入电压：' },
  { index: 3, label: '输入电压范围：' },
  { index: 5, label: '额定输入频率(Hz)：' },
  { index: 7, label: '额定输入频率范围(Hz)：' },
  { index: 9, label: '低压直流母线电压范围(V)：' },
];
