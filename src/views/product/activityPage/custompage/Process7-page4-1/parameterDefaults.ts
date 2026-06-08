import type { Process7ParameterItem } from '../shared/process7/setSaveBtnEnable';
import type { CombinationRow } from './combinationLists';

export type Page4_1ParameterItem = Process7ParameterItem & {
  inputOrOutput?: string;
  inputType?: string;
  parameterNum?: string;
  inputName?: string;
  propertyType?: string;
  pageId?: string;
  tableName?: string;
  tableNum?: string;
  tableType?: string;
  tableMap?: Process7ParameterItem['tableMap'] & {
    tableType?: string;
    colNums?: string;
    rowNums?: string | number;
    colStr?: string[];
  };
};

function createDefaultTableRows(): CombinationRow[] {
  return [
    { p0: 1, p1: '交流配电组合', p2: '', delIndex: 0, cellParameterId0: '', cellParentNum0: '', cellInputOrOutput0: '1', cellInputName0: '', cellParameterId1: '', cellParentNum1: '', cellInputOrOutput1: '1', cellInputName1: '', cellParameterId2: '', cellParentNum2: '', cellInputOrOutput2: '1', cellInputName2: '' },
    { p0: 2, p1: '电源机柜', p2: '', cellParameterId0: '', cellParentNum0: '', cellInputOrOutput0: '1', cellInputName0: '', cellParameterId1: '', cellParentNum1: '', cellInputOrOutput1: '1', cellInputName1: '', cellParameterId2: '', cellParentNum2: '', cellInputOrOutput2: '1', cellInputName2: '' },
    { p0: 3, p1: '低压配电', p2: '', cellParameterId0: '', cellParentNum0: '', cellInputOrOutput0: '1', cellInputName0: '', cellParameterId1: '', cellParentNum1: '', cellInputOrOutput1: '1', cellInputName1: '', cellParameterId2: '', cellParentNum2: '', cellInputOrOutput2: '1', cellInputName2: '' },
    { p0: 4, p1: '柴油发电机组', p2: '', cellParameterId0: '', cellParentNum0: '', cellInputOrOutput0: '1', cellInputName0: '', cellParameterId1: '', cellParentNum1: '', cellInputOrOutput1: '1', cellInputName1: '', cellParameterId2: '', cellParentNum2: '', cellInputOrOutput2: '1', cellInputName2: '' },
    { p0: 5, p1: '取力装置', p2: '', cellParameterId0: '', cellParentNum0: '', cellInputOrOutput0: '1', cellInputName0: '', cellParameterId1: '', cellParentNum1: '', cellInputOrOutput1: '1', cellInputName1: '', cellParameterId2: '', cellParentNum2: '', cellInputOrOutput2: '1', cellInputName2: '' },
    { p0: 6, p1: '低压电池', p2: '', cellParameterId0: '', cellParentNum0: '', cellInputOrOutput0: '1', cellInputName0: '', cellParameterId1: '', cellParentNum1: '', cellInputOrOutput1: '1', cellInputName1: '', cellParameterId2: '', cellParentNum2: '', cellInputOrOutput2: '1', cellInputName2: '' },
  ];
}

export function initCustomizedProcessPage7Data4_1(pageid: string): Page4_1ParameterItem[] {
  const data = createDefaultTableRows();
  const yes = '是';
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_GPDTZ',
      parameterId: '',
      defaultValue: 0,
      propertyType: '1',
      pageId: pageid,
      inputName: '供配电体制确定',
    },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_5_CYFDJZ_Y', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '柴油发电机组' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_7_DYDC_Y', parameterId: '', defaultValue: '否', propertyType: '1', pageId: pageid, inputName: '低压电池' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_6_QLFDJZ_Y', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '取力发电机组' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_5_CYFDJZ_Y', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '柴油发电机组' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_6_QLFDJZ_Y', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '取力发电机组' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_7_GYDC_Y', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '高压电池' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_5_CYFDJZ_Y', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '柴油发电机组' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_7_SDJLSRV', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '外接市电' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_7_ZLDY_Y', parameterId: '', defaultValue: yes, propertyType: '1', pageId: pageid, inputName: '整流电源' },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '2',
        colNums: '3',
        rowData: data,
        colStr: ['p0', 'p1', 'p2'],
      },
      tableName: '产品组成',
      inputName: '产品组成',
      tableType: '2',
      tableNum: 'DY1-1-8_T_CPZC',
    },
  ];
}

export function cloneParameterList(source: Page4_1ParameterItem[]): Page4_1ParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: item.tableMap.rowData?.map(row => ({ ...row })),
        }
      : item.tableMap,
  }));
}
