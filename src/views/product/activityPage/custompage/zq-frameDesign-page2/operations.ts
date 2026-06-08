import { getFlowParameterList } from '../shared/flowContext';
import type { ZqFrameDesignPage2ParameterItem } from './parameterDefaults';

export function applyFlowParameters(list: ZqFrameDesignPage2ParameterItem[]) {
  const paramList = getFlowParameterList();
  if (!paramList.length) return;

  paramList.forEach(item => {
    const paramNum = String(item.paramnum ?? '').trim();
    if (!paramNum) return;

    list.forEach((target, index) => {
      if (target.parameterNum === paramNum) {
        list[index].defaultValue = String(item.paramvalue ?? '');
      }
    });
  });
}
