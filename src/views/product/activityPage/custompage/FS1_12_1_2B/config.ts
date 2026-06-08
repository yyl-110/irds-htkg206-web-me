import type { AdapterPageConfig } from '../FS1_12_1_2/_common/types';

export const ADAPTER_PAGE_CONFIG: AdapterPageConfig = {
  variant: 'B',
  title: '上适配器设计',
  adapterLabel: '上适配器',
  paramPrefix: 'FS6_201_001',
  lParamNums: {
    l3: 'FS4_201_001_SL3',
    l1: 'FS4_201_001_SL1',
    l2: 'FS4_201_001_SL2',
    l4: 'FS4_201_001_SL4',
  },
  tableDegParams: {
    p2: 'FS6_201_001_HDJR1',
    p3: 'FS6_201_001_DEG1',
    p4: 'FS6_201_001_DEG2',
  },
  templates: {
    withCable: 'TEMP_FS6_201_001B.asm',
    withoutCable: 'TEMP_FS6_201_001A.asm',
  },
  tableNum: 'FS1-12-1-2B_T_SSPQMODEL',
  tableName: '上适配器模型表',
  hasInitData: false,
};
