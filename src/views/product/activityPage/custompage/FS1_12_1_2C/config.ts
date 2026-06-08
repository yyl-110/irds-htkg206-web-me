import type { AdapterPageConfig } from '../FS1_12_1_2/_common/types';

export const ADAPTER_PAGE_CONFIG: AdapterPageConfig = {
  variant: 'C',
  title: '中适配器设计',
  adapterLabel: '中适配器',
  paramPrefix: 'FS6_201_002',
  lParamNums: {
    l3: 'FS4_201_001_ML3',
    l1: 'FS4_201_001_ML1',
    l2: 'FS4_201_001_ML2',
    l4: 'FS4_201_001_ML4',
  },
  tableDegParams: {
    p2: 'FS6_201_002_HDJR1',
    p3: 'FS6_201_002_DEG1',
    p4: 'FS6_201_002_DEG2',
  },
  templates: {
    withCable: 'TEMP_FS6_201_002B.asm',
    withoutCable: 'TEMP_FS6_201_002A.asm',
  },
  tableNum: 'FS1-12-1-2C_T_ZSPQMODEL',
  tableName: '中适配器模型表',
  hasInitData: true,
};
