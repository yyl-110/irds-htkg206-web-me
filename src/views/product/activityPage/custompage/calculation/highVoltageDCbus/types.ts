export interface HighVoltageDCbusRow {
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  a5?: string;
  a6?: string;
}

export interface HighVoltageDCbusTableContext {
  data1: HighVoltageDCbusRow[];
  data2: HighVoltageDCbusRow[];
  rectifierEfficiency: number | null;
}
