import { isValid } from '@/api/flowData/flowData';
import { isLinearWorkMode } from './workModeHelpers';
import type { Page2ParameterItem } from './parameterDefaults';

/** 电机模型库浏览时的查询预填参数（按参数代号匹配默认查询条件并自动过滤） */
export function buildMotorBrowseQueryPrefill(
  list: Page2ParameterItem[],
  workMode = '',
): Record<string, string> {
  const prefill: Record<string, string> = {};
  const linear = isLinearWorkMode(workMode);

  if (linear) {
    const edglZ = list[1]?.defaultValue;
    if (isValid(edglZ)) {
      prefill.DJ1_1_EDGL_Z = String(edglZ);
    }
  } else {
    const edglX = list[0]?.defaultValue;
    if (isValid(edglX)) {
      prefill.DJ1_1_EDGL_X = String(edglX);
    }
  }
  return prefill;
}
