export interface ModuleOkItem {
  id?: string;
  val?: string;
  name?: string;
}

export interface ModuleOkPayload {
  para1?: string;
  para3?: string;
  para4?: string;
  para5?: string;
  arr?: ModuleOkItem[];
}

export type SelectPageStrItem = { id?: string; val?: string };

export interface ModulePropertyItem {
  id?: string | number;
  propertyName?: string;
  modelInfoProp?: string;
  dataProp?: string;
  paraDictionary?: string | number;
  paraDictionaryName?: string;
  parameterNum?: string;
  paramNum?: string;
  searchFlag?: number;
  showFlag?: number;
  colWidth?: number;
  propertyType?: number;
}

export interface QueryColumnItem {
  id?: string | number;
  title?: string;
  key: string;
  parameterNum?: string;
  paraDictionary?: string;
  inputType: 'select' | 'input';
  options: string[];
}

export interface ModuleTableRow extends Record<string, unknown> {
  id?: string | number;
  para1?: string;
  para3?: string;
  para4?: string | number;
  para5?: string;
  status?: string | number;
}

export interface ConfirmColumnItem {
  dataIndex: string;
  parameterNum: string;
  paraDictionaryName: string;
}
