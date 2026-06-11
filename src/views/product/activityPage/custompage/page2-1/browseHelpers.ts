import type { Page2_1ParameterItem } from './parameterDefaults';
import { getFlowParameterList } from '../shared/flowContext';

/** 计算模型库浏览时的查询预填参数（原 browserRowData 逻辑） */
export function buildReducerBrowseQueryPrefill(list: Page2_1ParameterItem[]): Record<string, string> {
  const jsqStyle = list[2]?.defaultValue ?? '';
  let jsqZh = list[3]?.defaultValue ?? '';
  let jsqJxxc = list[0]?.defaultValue ?? '';

  if (jsqStyle === '直线') {
    jsqZh = list[4]?.defaultValue ?? '';
  }

  let djGzfs = list[6]?.defaultValue ?? '';
  let dxlb = list[7]?.defaultValue ?? '';

  getFlowParameterList().forEach(item => {
    if (item.paramnum === 'DJ1_1_GZFS' && item.paramvalue) {
      djGzfs = item.paramvalue;
    }
    if (item.paramnum === 'DJ1_5_DXLB' && !dxlb && item.paramvalue) {
      dxlb = item.paramvalue;
    }
  });

  if (djGzfs.substring(0, 2) === '直线') {
    jsqJxxc = String(Number(list[1]?.defaultValue ?? 0) * 2 + 1);
  } else if (jsqStyle === '直线') {
    jsqJxxc = String(2 * Math.tan((Number(jsqJxxc) + 1) * (Math.PI / 180)) * Number(dxlb || 0));
  } else {
    jsqJxxc = String(Number(list[1]?.defaultValue ?? 0) * 2 + 1);
  }

  const prefill: Record<string, string> = {};
  if (jsqStyle) prefill.DJ1_5_MDJSQXS = jsqStyle;
  if (jsqZh) {
    prefill.DJ1_5_JSQZH_X = jsqZh;
    prefill.DJ1_5_JSQZH_Z = jsqZh;
  }
  if (jsqJxxc) {
    prefill.DJ1_1_JXXC_X = jsqJxxc;
    prefill.DJ1_1_JXXC_Z = jsqJxxc;
  }
  return prefill;
}
