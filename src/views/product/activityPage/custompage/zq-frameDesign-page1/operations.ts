import { assembleModule, parameterInFirstCsys } from '@/libs/webSocket';
import { getFlowParameterList } from '../shared/flowContext';
import type { FrameModelRow, ZqFrameDesignPage1ParameterItem } from './parameterDefaults';

const TEMPLATE_MODEL = 'TEMP_FS8_075_002.prt';

export function applyFlowParameters(list: ZqFrameDesignPage1ParameterItem[]) {
  const paramList = getFlowParameterList();
  if (!paramList.length) return;

  paramList.forEach(item => {
    const paramNum = String(item.paramnum ?? '').trim();
    if (!paramNum) return;

    list.forEach((target, index) => {
      if (target.ifSingleLine === 't') return;
      if (target.parameterNum === paramNum) {
        list[index].defaultValue = String(item.paramvalue ?? '');
      }
    });
  });
}

export function clearSelectedPartNumbers(rows: FrameModelRow[], selected: FrameModelRow[]) {
  rows.forEach(item => {
    selected.forEach(sel => {
      if (item.p0 === sel.p0) {
        item.p2 = '';
      }
    });
  });
}

function buildAssemblyParametersStr(row: FrameModelRow) {
  const fields: Array<{ name: string; key: keyof FrameModelRow }> = [
    { name: 'FS1_5_1_1D_ZXMD', key: 'p3' },
    { name: 'FS1_5_1_1D_HXMD', key: 'p5' },
    { name: 'FS1_5_1_1D_ZXT', key: 'p6' },
    { name: 'FS1_5_1_1D_HXT', key: 'p7' },
    { name: 'FS8_075_002_L1', key: 'p8' },
    { name: 'FS8_075_002_T', key: 'p9' },
    { name: 'FS8_075_002_L2', key: 'p10' },
    { name: 'FS8_075_002_D1', key: 'p11' },
    { name: 'FS1_5_1_1D_DXMD', key: 'p12' },
  ];

  return fields
    .map(field => `{"Name":"${field.name}","Type":"double","Value":"${row[field.key] ?? ''}","Description":""}`)
    .join(',');
}

export async function assembleFrameModuleByTemplate(selected: FrameModelRow[]) {
  if (!selected.length) {
    return { ok: false, level: 'info' as const, message: '请选择模型' };
  }
  if (selected.length > 1) {
    return { ok: false, level: 'info' as const, message: '请只选择一个模型' };
  }

  const row = selected[0];
  const newModuleNum = row.p13;
  if (newModuleNum == null || newModuleNum === '') {
    return { ok: false, level: 'warning' as const, message: '请先输入模型号' };
  }

  const parametersStr = buildAssemblyParametersStr(row);
  const tempNumParts = TEMPLATE_MODEL.split('.');
  if (tempNumParts.length !== 2) {
    return { ok: false, level: 'error' as const, message: '模板编号格式异常' };
  }

  const response = await assembleModule(null, tempNumParts[0], tempNumParts[1], '', String(newModuleNum), '', parametersStr);
  if (response === undefined) {
    return { ok: false, level: 'info' as const, message: '通讯异常' };
  }
  if (response.ReturnStatus !== 0) {
    return { ok: false, level: 'error' as const, message: `装配失败:${response.ReturnStatus}` };
  }

  return { ok: true };
}

export async function regenerateFramePartParams(selected: FrameModelRow[]) {
  if (!selected.length) {
    return { ok: false, level: 'info' as const, message: '请选择模型' };
  }
  if (selected.length > 1) {
    return { ok: false, level: 'info' as const, message: '请只选择一个模型' };
  }

  const row = selected[0];
  const newModuleNum = row.p13;
  if (newModuleNum == null || newModuleNum === '') {
    return { ok: false, level: 'warning' as const, message: '请先输入模型号' };
  }

  const parametersStr = buildAssemblyParametersStr(row);
  const response = await parameterInFirstCsys(String(newModuleNum), 'prt', parametersStr);
  if (response === undefined) {
    return { ok: false, level: 'info' as const, message: '通讯异常' };
  }
  if (response.ReturnStatus !== 0) {
    return { ok: false, level: 'error' as const, message: `重生失败:${response.ReturnStatus}` };
  }

  return { ok: true };
}

export interface ModuleOkItem {
  name?: string;
  val?: string;
}

export function applyProductBrowseResult(list: ZqFrameDesignPage1ParameterItem[], items: ModuleOkItem[]) {
  items.forEach(item => {
    if (item.name === '车架形式') {
      list[0].defaultValue = String(item.val ?? '');
    }
  });
}

export function applyModuleBrowseResult(list: ZqFrameDesignPage1ParameterItem[], items: ModuleOkItem[]) {
  items.forEach(item => {
    if (item.name === '车架平台编号') {
      list[4].defaultValue = String(item.val ?? '');
    }
    if (item.name === '参考车架总成编号') {
      list[5].defaultValue = String(item.val ?? '');
    }
    if (item.name === '车架总成模板编号') {
      list[6].defaultValue = String(item.val ?? '');
    }
  });
}
