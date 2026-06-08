export interface LowVoltageDCRow {
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  a5?: string;
  a6?: string;
}

export interface BranchCountParam {
  modelInfoProp: string;
  modelInfoPropValue: string | number;
}

export interface LowVoltageDCTableContext {
  data1: LowVoltageDCRow[];
  data2: LowVoltageDCRow[];
}

export interface BranchCountField {
  id: number;
  labelName: string;
  typeKey: string;
}
