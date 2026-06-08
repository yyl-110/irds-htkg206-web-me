export interface QsygXcResultRow {
  jdbh: string;
  a1: string;
  ygxc: string;
  ygtl: string;
}

export interface QsygXcFormParams {
  loadWeight: string;
  angleA: string;
  lengthA: string;
  angleA0: string;
  lengthB: string;
  angleBeta: string;
  lengthC: string;
  angleTheta: string;
  maxAngleA: string;
  angleIncrementCount: string;
}

export const DEFAULT_RESULT_ROWS: QsygXcResultRow[] = [
  { jdbh: '1', a1: '2066.5', ygxc: '7616.5', ygtl: '1649' },
  { jdbh: '2', a1: '2066.5', ygxc: '7616.5', ygtl: '1649' },
  { jdbh: '3', a1: '2066.5', ygxc: '7616.5', ygtl: '1649' },
];

export function createDefaultFormParams(): QsygXcFormParams {
  return {
    loadWeight: '',
    angleA: '',
    lengthA: '',
    angleA0: '',
    lengthB: '',
    angleBeta: '',
    lengthC: '',
    angleTheta: '',
    maxAngleA: '',
    angleIncrementCount: '',
  };
}
