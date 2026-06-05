import { getFlowParameterList } from '../shared/flowContext';
import { getParameterIndex, type Zt1_44ParameterItem } from './parameterDefaults';

export function applyZt1_44InitData(list: Zt1_44ParameterItem[]): boolean {
  const paramList = getFlowParameterList();
  if (!paramList.length) return false;

  let updated = false;
  paramList.forEach(item => {
    const num = String(item.paramnum ?? '').trim();
    const index = getParameterIndex(num);
    if (index == null || !list[index]) return;
    list[index].defaultValue = String(item.paramvalue ?? '');
    updated = true;
  });

  return updated;
}
