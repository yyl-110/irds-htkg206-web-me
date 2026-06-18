import { isValid } from '@/api/flowData/flowData';
import { isLinearWorkMode } from './workModeHelpers';
import type { Page2ParameterItem } from './parameterDefaults';

function getParamDefaultValue(list: Page2ParameterItem[], parameterNum: string, fallbackIndex?: number): string {
  const hit = list.find(item => String(item.parameterNum ?? '').trim() === parameterNum);
  const raw = hit?.defaultValue ?? (fallbackIndex !== undefined ? list[fallbackIndex]?.defaultValue : undefined);
  return raw !== undefined && raw !== null ? String(raw) : '';
}

/** 电机模型库浏览时的查询预填参数（按参数代号匹配默认查询条件并自动过滤） */
export function buildMotorBrowseQueryPrefill(
  list: Page2ParameterItem[],
  workMode = '',
): Record<string, string> {
  const prefill: Record<string, string> = {};
  const linear = isLinearWorkMode(workMode);

  const primaryCode = linear ? 'DJ1_1_EDGL_Z' : 'DJ1_1_EDGL_X';
  const fallbackCode = linear ? 'DJ1_1_EDGL_X' : 'DJ1_1_EDGL_Z';
  const primaryIndex = linear ? 1 : 0;
  const fallbackIndex = linear ? 0 : 1;

  let edgl = getParamDefaultValue(list, primaryCode, primaryIndex);
  if (!isValid(edgl)) {
    edgl = getParamDefaultValue(list, fallbackCode, fallbackIndex);
  }
  if (!isValid(edgl)) {
    return prefill;
  }

  const val = String(edgl);
  // 模型库默认查询区按 parameterNum 匹配；额定功率需兼容任务参数代号与模块库读取代号
  prefill.DJ1_1_EDGL_X = val;
  prefill.DJ1_1_EDGL_Z = val;
  prefill.DJ_C003_EDGL = val;
  return prefill;
}
