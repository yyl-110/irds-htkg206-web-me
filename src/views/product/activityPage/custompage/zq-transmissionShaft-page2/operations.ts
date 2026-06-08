import { message } from 'ant-design-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { AdminApiwebSocketAuth } from '@/api/tags/管理webSocket';
import { apiExtOpenModel, apiRenameModel, assembleModule } from '@/libs/webSocket';
import { globaluserId } from '../_shared/utils/legacyUser';
import { getFlowParameterList } from '../shared/flowContext';
import type { ModuleOkPayload } from '@/views/product/activityPage/components/module-data-select.vue';
import type { TransmissionShaftPage2ParameterItem } from './parameterDefaults';
import { PIPE_MODULE_CATEGORY_ID, SHAFT_MODULE_CATEGORY_ID } from './parameterDefaults';

type SelectFilterItem = { id: string; val: string };

function resolveTorqueRange(value: string) {
  if (!value) return ';7000';
  const torque = parseInt(value, 10);
  if (Number.isNaN(torque)) return ';7000';
  if (torque <= 7000) return ';7000';
  if (torque <= 10000) return '7000;10000';
  if (torque <= 13000) return '10000;13000';
  if (torque <= 15000) return '13000;15000';
  if (torque <= 17000) return '15000;17000';
  if (torque <= 23000) return '17000;23000';
  if (torque <= 28000) return '23000;28000';
  return '28000;';
}

export function calculateNewPipeLength(list: TransmissionShaftPage2ParameterItem[]) {
  const shaftLength = list[4]?.defaultValue ?? '';
  const attachmentLength = list[3]?.defaultValue ?? '';
  if (shaftLength === '' || attachmentLength === '') {
    list[5].defaultValue = '';
    return;
  }
  list[5].defaultValue = String(Number(shaftLength) - Number(attachmentLength));
}

export function buildShaftBrowseFilters(): SelectFilterItem[] {
  let maxTorque = '';
  let flangeType = '';
  getFlowParameterList().forEach(item => {
    if (!maxTorque && item.paramnum === 'A31_ZDSCNJ') {
      maxTorque = String(item.paramvalue ?? '');
    } else if (!flangeType && item.paramnum === 'A31_FLXS_QDQSR') {
      flangeType = String(item.paramvalue ?? '');
    }
  });

  return [
    { id: '589', val: resolveTorqueRange(maxTorque) },
    { id: '606', val: flangeType },
    { id: '619', val: '' },
  ];
}

export function buildPipeBrowseFilters(list: TransmissionShaftPage2ParameterItem[]) {
  return [{ id: '724', val: String(list[5]?.defaultValue ?? '') }];
}

export function applyShaftBrowseResult(list: TransmissionShaftPage2ParameterItem[], payload: ModuleOkPayload) {
  payload.arr?.forEach(item => {
    if (item.name === 'A31_ZGNJ') {
      list[1].defaultValue = String(item.val ?? '');
    } else if (item.name === 'A31_ZGWJ') {
      list[2].defaultValue = String(item.val ?? '');
    } else if (item.name === 'A31_FJCD') {
      list[3].defaultValue = String(item.val ?? '');
    }
  });
  list[8].defaultValue = payload.para4 ?? '';
  list[0].defaultValue = payload.para1 ?? '';
  calculateNewPipeLength(list);
}

export function applyPipeBrowseResult(list: TransmissionShaftPage2ParameterItem[], payload: ModuleOkPayload) {
  list[6].defaultValue = payload.para1 ?? '';
  list[9].defaultValue = payload.para4 ?? '';
}

export async function openReferenceModel(list: TransmissionShaftPage2ParameterItem[]) {
  const modelNum = list[0]?.defaultValue ?? '';
  const modelType = list[8]?.defaultValue ?? '';
  if (!modelNum || !modelType) {
    message.warning('请先选择参考传动轴');
    return;
  }
  await apiExtOpenModel(`${modelNum}.${modelType}`);
}

export async function requestShaftPartNumber(list: TransmissionShaftPage2ParameterItem[]) {
  const res = await AdminApiwebSocketAuth.getModuleNumber({
    categoryId: SHAFT_MODULE_CATEGORY_ID,
    userId: globaluserId(),
  });
  if (res.data?.code === 200) {
    list[7].defaultValue = String(res.data.data?.moduleNewNum ?? '');
    return true;
  }
  message.warning(String(res.data?.msg ?? '申请件号失败'));
  return false;
}

export async function renameShaftModule(list: TransmissionShaftPage2ParameterItem[]) {
  const modelType = list[8]?.defaultValue ?? '';
  const sourceName = list[0]?.defaultValue ?? '';
  const newModuleNum = list[7]?.defaultValue ?? '';
  if (!sourceName || !modelType || !newModuleNum) return;

  const [modelNum, ext] = `${sourceName}.${modelType}`.split('.');
  if (!modelNum || !ext) return;
  await apiRenameModel(null, modelNum, ext, newModuleNum);
}

export async function assemblePipeModule(list: TransmissionShaftPage2ParameterItem[]) {
  const modelNum = list[6]?.defaultValue ?? '';
  const modelType = list[9]?.defaultValue ?? '';
  if (!modelNum) {
    message.warning('请先输入模型号');
    return false;
  }
  if (!modelType) {
    message.warning('请先选择轴管模型类型');
    return false;
  }

  const response = await assembleModule(null, modelNum, modelType, '', '', '', '');
  if (response === undefined) {
    message.info('通讯异常');
    return false;
  }
  return true;
}

async function saveModuleByCategory(
  categoryId: string,
  moduleObj: Record<string, string>,
) {
  const propertyRes = await AdminApiSystemModule.findCurrentModuleInfoByCategoryId({
    categoryId,
    menuId: categoryId,
  });
  if (propertyRes.data?.code !== 200) {
    throw new Error(String(propertyRes.data?.msg ?? '获取模块属性失败'));
  }

  const customizeData: Record<string, string> = {};
  const paramList = getFlowParameterList();
  (propertyRes.data.data ?? []).forEach((item: { paraDictionaryName?: string; modelInfoProp?: string }) => {
    if (!item?.paraDictionaryName || !item.modelInfoProp) return;
    const matched = paramList.find(flowItem => flowItem.paramnum === item.paraDictionaryName);
    if (matched) {
      customizeData[item.modelInfoProp] = String(matched.paramvalue ?? '');
    }
  });

  Object.assign(customizeData, moduleObj);

  const res = await AdminApiSystemModule.moduleInfoKeep({
    libraryDataBaseDTO: {
      id: '',
      categoryId,
      menuId: categoryId,
      creator: globaluserId(),
      para1: moduleObj.para1 ?? '',
      para2: moduleObj.para2 ?? '',
      para3: moduleObj.para3 ?? '',
      para4: moduleObj.para4 ?? '',
    },
    libraryCustomizeDataBaseDTO: customizeData,
    libraryFileUpdateRequestDTO: [],
  });

  if (res.data?.code === -1) {
    throw new Error(String(res.data?.msg ?? '保存失败'));
  }
}

export async function confirmDesignAndSave(list: TransmissionShaftPage2ParameterItem[]) {
  await saveModuleByCategory(PIPE_MODULE_CATEGORY_ID, {
    para1: String(list[6]?.defaultValue ?? ''),
    para2: String(list[6]?.defaultValue ?? ''),
    para3: '传动轴轴管',
    para4: 'prt',
  });

  await saveModuleByCategory(SHAFT_MODULE_CATEGORY_ID, {
    para1: String(list[7]?.defaultValue ?? ''),
    para2: String(list[7]?.defaultValue ?? ''),
    para3: '传动轴',
    para4: 'asm',
  });

  message.info('保存成功');

  return {
    pipePartNo: String(list[6]?.defaultValue ?? ''),
    shaftPartNo: String(list[7]?.defaultValue ?? ''),
    innerDiameter: String(list[1]?.defaultValue ?? ''),
    outerDiameter: String(list[2]?.defaultValue ?? ''),
  };
}

export function clearDesignForm(list: TransmissionShaftPage2ParameterItem[]) {
  for (let i = 0; i < 8; i += 1) {
    list[i].defaultValue = '';
  }
}