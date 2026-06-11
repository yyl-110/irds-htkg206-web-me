import {
  createDefaultPage0_5ParameterList,
  type Page0_5ParameterItem,
} from '../page0-5/parameterDefaults';

export type Page0_4ParameterItem = Page0_5ParameterItem;

/** 零位表 componentId（customizedProcess-page0-4 专用） */
export const PAGE0_4_ZERO_TABLE_COMPONENT_ID = 9;
/** 行程计算表 componentId（customizedProcess-page0-4 专用） */
export const PAGE0_4_RESULT_TABLE_COMPONENT_ID = 10;

const ZERO_TABLE_NUM = 'DJ1-1_T_ZEROINITPOSITION';
const RESULT_TABLE_NUM = 'DJ1-1_T_RESULTDATA';

export function applyPage0_4TableComponentIds(list: Page0_4ParameterItem[]): Page0_4ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (tableNum === ZERO_TABLE_NUM) {
      return { ...item, componentId: PAGE0_4_ZERO_TABLE_COMPONENT_ID };
    }
    if (tableNum === RESULT_TABLE_NUM) {
      return { ...item, componentId: PAGE0_4_RESULT_TABLE_COMPONENT_ID };
    }
    return item;
  });
}

export function createDefaultPage0_4ParameterList(pageId = ''): Page0_4ParameterItem[] {
  return applyPage0_4TableComponentIds(createDefaultPage0_5ParameterList(pageId));
}
