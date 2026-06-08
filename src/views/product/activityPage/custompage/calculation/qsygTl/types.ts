export interface QsygTlCylinderRow {
  ygjs: string;
  sscd: string;
  zkcd: string;
  zdtl: string;
  zdll: string;
  szdXz: string;
  szdZz: string;
  xzdXz: string;
  xzdZz: string;
}

export interface QsygTlFormParams {
  loadWeight: string;
  rotationAngle: string;
  guideLength: string;
  pivotCoord: string;
  centroidCoord: string;
  centroidStep: string;
  upperPivotCoord: string;
  upperPivotStep: string;
  lowerPivotCoord: string;
  lowerPivotStep: string;
}

export interface StepOption {
  value: string;
  label: string;
}

export const DEFAULT_CYLINDER_ROWS: QsygTlCylinderRow[] = [
  {
    ygjs: '1',
    sscd: '2066.5',
    zkcd: '7616.5',
    zdtl: '1649',
    zdll: '-110',
    szdXz: '6000',
    szdZz: '300',
    xzdXz: '4000',
    xzdZz: '-220',
  },
  {
    ygjs: '2',
    sscd: '2066.5',
    zkcd: '7616.5',
    zdtl: '1649',
    zdll: '-110',
    szdXz: '6000',
    szdZz: '300',
    xzdXz: '4000',
    xzdZz: '-220',
  },
  {
    ygjs: '3',
    sscd: '2066.5',
    zkcd: '7616.5',
    zdtl: '1649',
    zdll: '-110',
    szdXz: '6000',
    szdZz: '300',
    xzdXz: '4000',
    xzdZz: '-220',
  },
];

export const STEP_OPTIONS: StepOption[] = [
  { value: '0', label: '50' },
  { value: '1', label: '100' },
  { value: '2', label: '150' },
];

export function createDefaultFormParams(): QsygTlFormParams {
  return {
    loadWeight: '',
    rotationAngle: '',
    guideLength: '',
    pivotCoord: '',
    centroidCoord: '',
    centroidStep: '',
    upperPivotCoord: '',
    upperPivotStep: '',
    lowerPivotCoord: '',
    lowerPivotStep: '',
  };
}
