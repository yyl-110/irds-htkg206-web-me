export interface AcbusPowerRow {
  powerType: string;
  brankId: string;
  power: string;
  dcdc?: string;
  acdc?: string;
  outputvoltage: string;
  a1?: string;
  _index?: number;
}

export interface AcbusPowerTableContext {
  data1: AcbusPowerRow[];
  data2: AcbusPowerRow[];
  data3: AcbusPowerRow[];
}
