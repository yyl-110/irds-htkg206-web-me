import { TB_DEMO1_PARAM } from '../tbdemo1-page1/parameterDefaults';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import type { Tbdemo1Page2Row } from './parameterDefaults';

export interface Tbdemo1CalcContext {
  tywz: string;
  tyfs: string;
  maxLevel: number;
  minLevel: number;
  levelPercent: number;
  et: number;
  rowData: Tbdemo1Page2Row[];
}

export function createDefaultCalcContext(): Tbdemo1CalcContext {
  return {
    tywz: '高压尾端',
    tyfs: 'PM',
    maxLevel: 8,
    minLevel: -8,
    levelPercent: 1.25,
    et: 131.25,
    rowData: [],
  };
}

/** 从 page1 流程上下文构建计算入参（原 thearyDataLoad 前半段） */
export function buildCalcContextFromFlow(): Tbdemo1CalcContext {
  const obj = createDefaultCalcContext();
  const paramList = getFlowParameterList();
  const tableList = getFlowTableList();

  paramList.forEach(item => {
    const num = String(item.paramnum ?? '');
    const val = item.paramvalue;
    if (num === TB_DEMO1_PARAM.TYWZ) obj.tywz = String(val ?? obj.tywz);
    if (num === TB_DEMO1_PARAM.TYFS) obj.tyfs = String(val ?? obj.tyfs);
    if (num === TB_DEMO1_PARAM.MAX_LEVEL) obj.maxLevel = Number(val ?? obj.maxLevel);
    if (num === TB_DEMO1_PARAM.MIN_LEVEL) obj.minLevel = Number(val ?? obj.minLevel);
    if (num === TB_DEMO1_PARAM.TY_PERCENT) obj.levelPercent = Number(val ?? obj.levelPercent);
    if (num === TB_DEMO1_PARAM.SJZDS) obj.et = Number(val ?? obj.et);
  });

  tableList.forEach(item => {
    if (item.tablenum === TB_DEMO1_PARAM.TABLE) {
      obj.rowData = (item.rowdata ?? []) as Tbdemo1Page2Row[];
    }
  });

  return obj;
}
