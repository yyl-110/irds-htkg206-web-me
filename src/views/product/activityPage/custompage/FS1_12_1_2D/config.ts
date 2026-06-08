import type { AdapterPageConfig } from '../FS1_12_1_2/_common/types';

export const ADAPTER_PAGE_CONFIG: AdapterPageConfig = {
  variant: 'D',
  title: '下适配器设计',
  adapterLabel: '下适配器',
  paramPrefix: 'FS6_201_003',
  qdjh1ParamNum: 'FS6_201_003QDJH1',
  lParamNums: {
    l3: 'FS4_201_001_XL3',
    l1: 'FS4_201_001_XL1',
    l2: 'FS4_201_001_XL2',
    l4: 'FS4_201_001_XL4',
  },
  tableDegParams: {
    p2: 'FS6_201_003_HDJR1',
    p3: 'FS6_201_003_DEG1',
    p4: 'FS6_201_003_DEG2',
  },
  templates: {
    withCable: 'TEMP_FS6_201_003B.asm',
    withoutCable: 'TEMP_FS6_201_003A.asm',
  },
  tableNum: 'FS1-12-1-2D_T_XSPQMODEL',
  tableName: '下适配器模型表',
  hasInitData: true,
};
