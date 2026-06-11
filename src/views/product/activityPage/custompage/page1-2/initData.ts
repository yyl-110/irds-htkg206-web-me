import type { Page1_2ParameterItem } from './parameterDefaults';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';

export interface Page1_2InitState {
  flag: boolean;
  djzdlj: string;
}

/** 从流程上下文初始化页面数据（原 initData + updateEl） */
export function applyPage1_2InitData(parameterTempList: Page1_2ParameterItem[]): Page1_2InitState {
  const state: Page1_2InitState = { flag: false, djzdlj: '' };
  const paramsList = getFlowParameterList();

  const preservedWorkMode = parameterTempList[0]?.defaultValue ?? '';
  paramsList.forEach(item => {
    if (item.paramnum === 'DJ1_1_GZFS' && item.paramvalue !== '') {
      if (parameterTempList[0]) {
        parameterTempList[0].defaultValue = item.paramvalue ?? '';
      }
    }
  });
  if (parameterTempList[0] && !parameterTempList[0].defaultValue && preservedWorkMode) {
    parameterTempList[0].defaultValue = preservedWorkMode;
  }

  const djOutputStyle = parameterTempList[0]?.defaultValue ?? '';
  let endpointJSQStyle = '直线';
  if (djOutputStyle === '旋转非拨叉类') {
    endpointJSQStyle = '旋转';
  }
  if (parameterTempList[1]) {
    parameterTempList[1].defaultValue = endpointJSQStyle;
  }

  let maxPowerX = '';
  let maxPowerZ = '';
  let equalePowerX = parameterTempList[2]?.defaultValue ?? '';

  if (endpointJSQStyle !== '直线' && endpointJSQStyle !== '旋转') {
    return state;
  }

  const paramList = getFlowParameterList();
  if (!paramList.length) {
    return state;
  }

  paramList.forEach(item => {
    if (item.paramnum === 'DJ1_1_SCLJ_MAX_X' && maxPowerX === '') {
      maxPowerX = item.paramvalue ?? '';
      state.djzdlj = maxPowerX;
    }
    if (item.paramnum === 'DJ1_1_SCL_MAX_Z' && maxPowerZ === '') {
      maxPowerZ = item.paramvalue ?? '';
    }
    if (item.paramnum === 'DJ1_1_DXLB_X' && equalePowerX === '') {
      equalePowerX = item.paramvalue ?? '';
    }
  });

  if (!djOutputStyle) {
    return state;
  }

  const tableList = getFlowTableList();

  if (djOutputStyle === '直线喷管') {
    state.flag = true;
    if (tableList.length) {
      tableList.forEach(item => {
        if (item.tablenum === 'DJ1_T_ZEROINITPOSITION' && parameterTempList[2]) {
          parameterTempList[2].defaultValue = item.rowdata?.[0]?.p6 ?? '';
        }
      });
    }
    if (parameterTempList[2]?.defaultValue === undefined) {
      parameterTempList[2].defaultValue = '';
    }
    if (parameterTempList[2]?.defaultValue !== '') {
      const val = (Number(maxPowerZ) * 1000) / Number(parameterTempList[2].defaultValue);
      if (parameterTempList[3]) {
        parameterTempList[3].defaultValue = val.toFixed(2);
      }
    }
    if (parameterTempList[4]) {
      parameterTempList[4].defaultValue = '';
    }
  } else if (djOutputStyle === '直线非喷管') {
    state.flag = true;
    if (tableList.length) {
      tableList.forEach(item => {
        if (item.tablenum === 'DJ1-1_T_ZEROINITPOSITION' && parameterTempList[2]) {
          parameterTempList[2].defaultValue = item.rowdata?.[0]?.p8 ?? '';
        }
      });
    }
    if (parameterTempList[2]?.defaultValue === undefined) {
      parameterTempList[2].defaultValue = '';
    }
    if (parameterTempList[2]?.defaultValue !== '') {
      const val = (Number(maxPowerZ) * 1000) / Number(parameterTempList[2].defaultValue);
      if (parameterTempList[3]) {
        parameterTempList[3].defaultValue = val.toFixed(2);
      }
    }
    if (parameterTempList[4]) {
      parameterTempList[4].defaultValue = '';
    }
  } else if (djOutputStyle === '旋转拨叉类') {
    state.flag = false;
  } else if (djOutputStyle === '旋转非拨叉类') {
    state.flag = true;
    if (parameterTempList[2]) parameterTempList[2].defaultValue = '';
    if (parameterTempList[3]) parameterTempList[3].defaultValue = '';
    if (parameterTempList[4]) parameterTempList[4].defaultValue = maxPowerX;
  }

  return state;
}

export type Page1_2TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

/** values：单行参数字段（本页无表格，全部写入 values） */
export function extractPage1_2SaveParamValues(list: Page1_2ParameterItem[]) {
  return list
    .filter(item => String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：本页无数据表格，固定返回空数组 */
export function extractPage1_2TableSavePayload(_list: Page1_2ParameterItem[]): Page1_2TableSaveRow[] {
  return [];
}
