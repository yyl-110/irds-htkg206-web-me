import type { Page5_2ParameterItem } from '../Process7-page5-2/parameterDefaults';
import {
  cloneParameterList as cloneBaseParameterList,
  createStandardCabinetRow,
  EXIT_WIRE_OPTIONS,
  type CabinetTableRow,
} from '../Process7-page5-2/parameterDefaults';

export type { CabinetTableRow, Page5_2ParameterItem };

export const SELECT_TABLE_NUM = 'DY1-6-2_2_T_CXBZGT_2';
export const COMPOSITE_TABLE_NUM = 'DY1-6-2_2_T_FHGTCC_2';

export { createStandardCabinetRow };

function createCompositeSizeRows(): CabinetTableRow[] {
  return [
    {
      p0: '标准',
      p1: '',
      p2: '',
      p3: '',
      p4: '',
      p5: '',
      p6: '',
      cellParameterId0: '',
      cellParentNum0: '',
      cellInputOrOutput0: '1',
      cellInputName0: '机柜类型',
      cellParameterId1: '',
      cellParentNum1: '',
      cellInputOrOutput1: '1',
      cellInputName1: '柜体高h',
      cellParameterId2: '',
      cellParentNum2: '',
      cellInputOrOutput2: '1',
      cellInputName2: '柜体高度(U)',
      cellParameterId3: '',
      cellParentNum3: '',
      cellInputOrOutput3: '1',
      cellInputName3: '下框高h1',
      cellParameterId4: '',
      cellParentNum4: '',
      cellInputOrOutput4: '1',
      cellInputName4: '上框高h2',
      cellParameterId5: '',
      cellParentNum5: '',
      cellInputOrOutput5: '1',
      cellInputName5: '柜体深',
      cellParameterId6: '',
      cellParentNum6: '',
      cellInputOrOutput6: '1',
      cellInputName6: '柜体宽',
    },
    {
      p0: '要求',
      p1: '3200',
      p2: '12',
      p3: '--',
      p4: '--',
      p5: '660',
      p6: '700',
      cellParameterId0: '',
      cellParentNum0: '',
      cellInputOrOutput0: '1',
      cellInputName0: '',
      cellParameterId1: '',
      cellParentNum1: 'DY1_1_10_H',
      cellInputOrOutput1: '1',
      cellInputName1: '',
      cellParameterId2: '',
      cellParentNum2: 'DY1_6_2_CXGDHU',
      cellInputOrOutput2: '1',
      cellInputName2: '',
      cellParameterId3: '',
      cellParentNum3: '',
      cellInputOrOutput3: '1',
      cellInputName3: '',
      cellParameterId4: '',
      cellParentNum4: '',
      cellInputOrOutput4: '1',
      cellInputName4: '',
      cellParameterId5: '',
      cellParentNum5: 'DY1_1_10_S',
      cellInputOrOutput5: '1',
      cellInputName5: '',
      cellParameterId6: '',
      cellParentNum6: 'DY1_1_10_W',
      cellInputOrOutput6: '1',
      cellInputName6: '',
    },
  ];
}

export function initCustomizedProcessPage7Data5_2B(pageid: string): Page5_2ParameterItem[] {
  const cabinetU = '12';
  const h2Calculated = (Number(cabinetU) - 1) * 44.45 + 41.25 + 2.75;

  return [
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '1', parameterNum: 'DY1_1_10_H_2', parameterId: '', defaultValue: '3200', propertyType: '1', pageId: pageid, inputName: '柜体最大高尺寸' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_S_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大深' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_W_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大宽' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXGDHU_2', parameterId: '', defaultValue: cabinetU, propertyType: '1', pageId: pageid, inputName: '插箱高度(U)和' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_ZXKJ_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '走线空间' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_GTSD_J_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体深(计算值)' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXZDSW_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱最大宽' },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '2',
        colNums: '6',
        rowData: [createStandardCabinetRow()],
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
      },
      tableName: '查询标准柜体',
      inputName: '查询标准柜体',
      tableType: '2',
      tableNum: SELECT_TABLE_NUM,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '2',
        colNums: '7',
        rowData: createCompositeSizeRows(),
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      },
      tableName: '复合柜体尺寸',
      inputName: '复合柜体尺寸',
      tableType: '2',
      tableNum: COMPOSITE_TABLE_NUM,
    },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_U', parameterId: '', defaultValue: cabinetU, propertyType: '1', pageId: pageid, inputName: '柜体高度(U)' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_GTNQH2_J_2', parameterId: '', defaultValue: String(h2Calculated), propertyType: '1', pageId: pageid, inputName: '柜体内腔高H2(计算)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_H2', parameterId: '', defaultValue: '62.5', propertyType: '1', pageId: pageid, inputName: '下框(mm)' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_JXYL_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '余量间隙(计算)(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_H1', parameterId: '', defaultValue: '62.5', propertyType: '1', pageId: pageid, inputName: '上框(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_GTNQH2_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体内腔高H2(设计)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_L', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体深' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_H', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体高H1(设计)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_W', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体宽' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001_TEMPLATEFILENAME', parameterId: '', defaultValue: 'TEMP_DY2_930_001B.ASM', propertyType: '1', pageId: pageid, inputName: '模板文件名:' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_2_NAME_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '新模型文件名:' },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DY1_6_2_4_LOC_2',
      parameterId: '',
      defaultValue: '顶面',
      selectStr: EXIT_WIRE_OPTIONS,
      selectStrVal: EXIT_WIRE_OPTIONS,
      propertyType: '1',
      pageId: pageid,
      inputName: '机柜出线方式',
    },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_2_JGBZ_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '机柜备注' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '1', parameterNum: 'DY1_1_10_SRDY_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '额定输入电压(V)' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '1', parameterNum: 'DY1_1_10_SCLS_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输出路数' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '1', parameterNum: 'DY1_1_10_SRDYFW_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输入电压范围(V)' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '1', parameterNum: 'DY1_6_2_CXZDSH_2', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱最大深' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_J', parameterId: '', defaultValue: '360', propertyType: '1', pageId: pageid, inputName: '背部减震器间距' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_J2', parameterId: '', defaultValue: '380', propertyType: '1', pageId: pageid, inputName: '底部减震器间距(纵向)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: 'DY4_100_001B_J1', parameterId: '', defaultValue: '380', propertyType: '1', pageId: pageid, inputName: '底部减震器间距(横向)' },
  ];
}

export function cloneParameterList(source: Page5_2ParameterItem[]): Page5_2ParameterItem[] {
  return cloneBaseParameterList(source);
}
