export interface OutputTableRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string | number;
}

export interface Page5_5ParameterItem {
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
  selectStr?: Array<{ label: string }>;
  selectStrVal?: Array<{ label: string }>;
}

export interface CabinetSectionConfig {
  id: number;
  label: string;
  visibleParamIndex: number;
  paramStart: number;
  outputRouteIndex: number;
  tableIndex: number;
  electFileParamIndex: number;
  envFileParamIndex: number;
  confirmType: string;
  changeNumberType: number;
}
