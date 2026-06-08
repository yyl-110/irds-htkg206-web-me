import { isValid as isValidValue } from '@/api/flowData/flowData';
import { getFlowParameterList } from '../flowContext';

export interface FormulaCheckItem {
  defaultValue?: string;
  pageFormula?: string;
}

/** 检查 pageFormula 是否为需隐藏同步图标的表达式（原 customizedProcess7 Dyjg 页 checkFormula） */
export function shouldHideGlobalSyncIcon(pageFormula?: string): boolean {
  if (pageFormula === undefined || pageFormula === '' || pageFormula === 'null') {
    return true;
  }
  if (pageFormula.substring(0, 1) !== 'T' && pageFormula.substring(0, 2) !== '{{') {
    return false;
  }
  const optArr = ['+', '-', '*', '/', '^', '(', ')', '[', ']'];
  for (let i = 0; i < optArr.length; i += 1) {
    if (pageFormula.indexOf(optArr[i]) >= 0) {
      return false;
    }
  }
  if (pageFormula === '{{}}') {
    return true;
  }
  const tmpArr = pageFormula.split('_');
  if (tmpArr.length !== 3) {
    return false;
  }
  return !(tmpArr[1].substring(0, 1) === 'C' && tmpArr[2].substring(0, 1) === 'R');
}

/** 解析 {{paramNum}} 公式并回写 defaultValue */
export function resolveFormulaDefaultValue(
  pageFormula: string | undefined,
  item: FormulaCheckItem,
  onResolved?: () => void,
): boolean {
  if (!pageFormula || pageFormula.length <= 4) return false;
  if (pageFormula.substring(0, 2) !== '{{' || pageFormula.substring(pageFormula.length - 2) !== '}}') {
    return false;
  }

  const paramKey = pageFormula.substring(2, pageFormula.length - 2).trim();
  if (!paramKey || !isValidValue(item)) return false;

  const paramList = getFlowParameterList();
  if (!isValidValue(paramList)) return false;

  for (let i = 0; i < paramList.length; i += 1) {
    if (paramList[i].paramnum === paramKey) {
      item.defaultValue = paramList[i].paramvalue;
      onResolved?.();
      return true;
    }
  }
  return false;
}

export function shouldShowGlobalSyncIcon(item: {
  globalValue?: string;
  defaultValue?: string;
  pageFormula?: string;
  inputOrOutput?: string;
}) {
  if (item.inputOrOutput !== '1') return false;
  if (!isValidValue(item.globalValue)) return false;
  if (item.defaultValue === item.globalValue) return false;
  if (!shouldHideGlobalSyncIcon(item.pageFormula)) return false;
  return true;
}

export { isValidValue as isValidParamValue };
