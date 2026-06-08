export type SupplyTableRow = Record<string, string | number | undefined>;

export interface TableMap {
  tableType?: string;
  colNums?: string | number;
  rowNums?: string | number;
  rowData: SupplyTableRow[];
  colStr: string[];
  colData?: Array<{ colName: string; isShowCol: string }>;
}

export interface Page6_1ParameterItem {
  inputType?: string;
  inputOrOutput?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterNum?: string;
  parameterId?: string | number;
  defaultValue?: string;
  propertyType?: string;
  inputName?: string;
  tableMap?: TableMap;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  colData?: Array<{ colName: string; isShowCol: string }>;
}

export interface ProcessListItem {
  id: number;
  name: 'rxLabel';
  labelName: string;
  typeKey: string;
  key: string;
  modeTypeVal0: string;
  modeTypeVal1: string;
  modeTypeVal2: string;
  modeTypeVal3: string;
  modeTypeVal4: string;
  modeTypeVal5: string;
  modeTypeVal6: string;
  modeTypeVal7: string;
  modeTypeVal8: string;
  modeTypeVal9: string;
  newModeTypeVal0?: string;
  newModeTypeVal1?: string;
  newModeTypeVal2?: string;
  newModeTypeVal3?: string;
  newModeTypeVal4?: string;
  newModeTypeVal5?: string;
  newModeTypeVal6?: string;
  newModeTypeVal7?: string;
  newModeTypeVal8?: string;
  newModeTypeVal9?: string;
}

export interface DeletableProcessColumn {
  id: string | number;
  title: string;
  key: string;
}

export interface Page6_1VariantConfig {
  efficiencyColumnTitle: string;
  mergeColumns: string[];
}

export const PAGE6_1_VARIANT: Page6_1VariantConfig = {
  efficiencyColumnTitle: '高压DC/DC组合效率',
  mergeColumns: ['p0', 'p8'],
};
