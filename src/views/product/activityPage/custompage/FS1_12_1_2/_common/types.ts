export interface AdapterDesignRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  delIndex?: number;
  id?: string | number;
}

export interface AdapterParameterItem {
  inputOrOutput?: string;
  inputType?: string;
  ifSingleLine?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: AdapterDesignRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string; colParameterNum?: string }>;
  };
}

export interface AdapterPageConfig {
  variant: 'B' | 'C' | 'D';
  title: string;
  adapterLabel: string;
  paramPrefix: string;
  qdjh1ParamNum?: string;
  lParamNums: { l3: string; l1: string; l2: string; l4: string };
  tableDegParams: { p2: string; p3: string; p4: string };
  templates: { withCable: string; withoutCable: string };
  tableNum: string;
  tableName: string;
  hasInitData: boolean;
}
