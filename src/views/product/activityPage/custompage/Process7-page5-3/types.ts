export interface AssemblyTableRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string | number;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string;
  p10?: string;
  p11?: string;
  p12?: string;
  p13?: string;
  p14?: string;
  p15?: string;
}

export interface Page5_3ParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string;
    rowData?: AssemblyTableRow[];
    colStr?: string[];
  };
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  inputOrOutput?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
}

export interface Page5_3ExportParamKeys {
  modelFileName: string;
  cabinetU: string;
  cabinetW: string;
  cabinetL: string;
  exitWire: string;
  cabinetH: string;
  remark: string;
}

export interface Page5_3VariantConfig {
  assemblyTableNum: string;
  chassisSourceTableNum: string;
  modelParamPrefix: string;
  templateModel: string;
  exportParamKeys: Page5_3ExportParamKeys;
}
