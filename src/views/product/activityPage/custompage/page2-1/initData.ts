import type { Page2_1ParameterItem } from './parameterDefaults';
import { getFlowParameterList } from '../shared/flowContext';

function collectParamMap(
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Map<string, string> {
  const map = new Map<string, string>();
  getFlowParameterList().forEach(item => {
    const code = String(item.paramnum ?? '').trim();
    if (code) map.set(code, String(item.paramvalue ?? '').trim());
  });
  (savedParamValues ?? []).forEach(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    if (!code) return;
    map.set(code, String(row?.paramValue ?? '').trim());
  });
  return map;
}

function findParamItem(list: Page2_1ParameterItem[], parameterNum: string): Page2_1ParameterItem | undefined {
  return list.find(item => String(item.parameterNum ?? '').trim() === parameterNum);
}

/** 从 page1-4 / 设计输入等前置页同步减速器选型顶部参数字段 */
export function applyPage2_1InitData(
  list: Page2_1ParameterItem[],
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): void {
  const params = collectParamMap(savedParamValues);

  list.forEach(item => {
    if (item.ifSingleLine === 't') return;
    const num = String(item.parameterNum ?? '').trim();
    if (!num) return;
    const val = params.get(num);
    if (val) item.defaultValue = val;
  });

  const gzfs = params.get('DJ1_1_GZFS') ?? findParamItem(list, 'DJ1_1_GZFS')?.defaultValue ?? '';
  const modePrefix = gzfs.substring(0, 2);
  const maxPowerX = params.get('DJ1_1_SCLJ_MAX_X') ?? '';
  const maxPowerZ = params.get('DJ1_1_SCL_MAX_Z') ?? '';

  const jsqZhXItem = findParamItem(list, 'DJ1_5_JSQZH_X');
  const jsqZhZItem = findParamItem(list, 'DJ1_5_JSQZH_Z');
  const dxlbItem = findParamItem(list, 'DJ1_5_DXLB');

  if (jsqZhXItem && !String(jsqZhXItem.defaultValue ?? '').trim()) {
    if (modePrefix === '直线' && maxPowerZ) {
      jsqZhXItem.defaultValue = maxPowerZ;
    } else if (modePrefix === '旋转' && maxPowerX) {
      jsqZhXItem.defaultValue = maxPowerX;
    } else if (maxPowerZ) {
      jsqZhXItem.defaultValue = maxPowerZ;
    } else if (maxPowerX) {
      jsqZhXItem.defaultValue = maxPowerX;
    }
  }

  const equalArm = String(dxlbItem?.defaultValue ?? '').trim();
  if (jsqZhZItem && !String(jsqZhZItem.defaultValue ?? '').trim() && equalArm) {
    const torque = modePrefix === '直线' ? maxPowerZ : maxPowerX;
    if (torque) {
      const val = (Number(torque) * 1000) / Number(equalArm);
      if (Number.isFinite(val)) {
        jsqZhZItem.defaultValue = val.toFixed(2);
      }
    }
  }

  const endpointStyle = findParamItem(list, 'DJ1_5_MDJSQXS');
  if (endpointStyle && !String(endpointStyle.defaultValue ?? '').trim()) {
    if (gzfs === '旋转非拨叉类') {
      endpointStyle.defaultValue = '旋转';
    } else if (gzfs) {
      endpointStyle.defaultValue = '直线';
    }
  }
}
