import type { Page5_1ParameterItem } from '../Process7-page5-1/parameterDefaults';
import {
  cloneParameterList as cloneBaseParameterList,
  createChassisRow,
  type ChassisTableRow,
} from '../Process7-page5-1/parameterDefaults';

export type { ChassisTableRow, Page5_1ParameterItem };

export const TABLE_NUM = 'DY1-6-2_1_T_XZZHCX_4';

export { createChassisRow };

export function initCustomizedProcessPage7Data5_1D(pageid: string): Page5_1ParameterItem[] {
  const data: ChassisTableRow[] = [
    createChassisRow({
      p0: '1',
      p1: 1,
      delIndex: 1,
    }),
  ];

  return [
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_H_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大高度尺寸' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_W_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大宽' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SCGL_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输出功率' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SCLS_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输出路数' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_S_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大深' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SRDY_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '额定输入电压(V)' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_DQJK_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '电气接口' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SRDYFW_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输入电压范围(V)' },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '2',
        colNums: '9',
        rowData: data,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'],
      },
      tableName: '选择组合插箱',
      inputName: '选择组合插箱',
      tableType: '2',
      tableNum: TABLE_NUM,
    },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXGDHU_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱高度（U）和' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXGDH_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱高度和' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXZDSH_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱最大深度' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXZDSW_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱最大宽' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_SCDLH_4', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输出电流A(求和)' },
  ];
}

export function cloneParameterList(source: Page5_1ParameterItem[]): Page5_1ParameterItem[] {
  return cloneBaseParameterList(source);
}
