import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import {
  createInnerRowFromSource,
  createOuterRowFromSource,
  INNER_SOURCE_TABLE_NUM,
  OUTER_SOURCE_TABLE_NUM,
  setInnerFrameRows,
  setOuterFrameRows,
  type Fs151_1_6ParameterItem,
} from './parameterDefaults';

const FLOW_PARAM_MAP: Record<string, number> = {
  FS6_100_001_YD1: 0,
  FS1_5_1_1A_WMPNJ: 1,
  FS1_5_1_1C_NMPWJ: 2,
  FS6_100_001_ND1: 3,
};

export function applyFs151_1_6InitData(list: Fs151_1_6ParameterItem[]): boolean {
  const tableList = getFlowTableList();
  const outerSource = tableList.find(item => String(item.tablenum ?? '') === OUTER_SOURCE_TABLE_NUM);
  const innerSource = tableList.find(item => String(item.tablenum ?? '') === INNER_SOURCE_TABLE_NUM);
  const outerRows = outerSource?.rowdata ?? [];
  const innerRows = innerSource?.rowdata ?? [];

  if (outerRows.length > 0) {
    setOuterFrameRows(
      list,
      outerRows.map((row, index) => ({ ...createOuterRowFromSource(row), delIndex: index })),
    );
  }
  if (innerRows.length > 0) {
    setInnerFrameRows(
      list,
      innerRows.map((row, index) => ({ ...createInnerRowFromSource(row), delIndex: index })),
    );
  }

  const paramList = getFlowParameterList();
  if (paramList.length > 0) {
    paramList.forEach(item => {
      const idx = FLOW_PARAM_MAP[String(item.paramnum ?? '')];
      if (idx == null) return;
      if (list[idx]) {
        list[idx].defaultValue = String(item.paramvalue ?? '');
      }
    });
  }

  return outerRows.length > 0 || innerRows.length > 0 || paramList.length > 0;
}
