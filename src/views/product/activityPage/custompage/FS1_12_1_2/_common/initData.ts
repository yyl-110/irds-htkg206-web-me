import { getFlowParameterList } from '../../shared/flowContext';
import type { AdapterParameterItem } from './parameterDefaults';

const INIT_PARAM_MAP: Record<string, number> = {
  FS6_201_001_T1: 1,
  FS6_201_001_T2: 2,
  FS6_201_001_T3: 3,
  FS6_201_001_QDJW1: 4,
  FS6_201_001_QDJH1: 5,
  FS6_201_001_QDJR1: 6,
  FS6_201_001_QDJW2: 7,
  FS6_201_001_QDJH2: 8,
  FS6_201_001_HDJW1: 13,
  FS6_201_001_HDJH1: 14,
  FS6_201_001_HDJR1: 15,
  FS6_201_001_DLCW1: 16,
  FS6_201_001_DLCH1: 17,
};

export function applyAdapterInitData(list: AdapterParameterItem[]): boolean {
  const paramList = getFlowParameterList();
  if (paramList.length <= 0) return false;

  let updated = false;
  paramList.forEach(item => {
    const idx = INIT_PARAM_MAP[String(item.paramnum ?? '')];
    if (idx == null || !list[idx]) return;
    list[idx].defaultValue = String(item.paramvalue ?? '');
    updated = true;
  });
  return updated;
}
