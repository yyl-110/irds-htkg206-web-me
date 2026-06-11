import { message } from 'ant-design-vue';
import { assembleModule } from '@/libs/webSocket';
import type { ModuleOkPayload } from '@/views/product/activityPage/components/module-data-select.vue';
import { getFlowParameterList } from '../shared/flowContext';
import {
  getSelectedRowIndex,
  markShaftRowsPublished,
  runCriticalSpeedCalculation,
} from './calculation';
import type { TransmissionShaftPage1ParameterItem, TransmissionTableRow } from './parameterDefaults';

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

export function buildShaftBrowseFilters(
  list: TransmissionShaftPage1ParameterItem[],
  selected: TransmissionTableRow,
): { categoryId: string; filters: SelectFilterItem[] } | null {
  const selectedIndex = getSelectedRowIndex(list[2]?.tableMap?.rowData ?? [], selected);
  if (selectedIndex < 0) return null;

  const selectedRow = list[2]?.tableMap?.rowData?.[selectedIndex];
  if (!selectedRow) return null;

  let maxTorque = '';
  let flangeType = '';
  getFlowParameterList().forEach(item => {
    if (!maxTorque && item.paramnum === 'A31_ZDSCNJ') {
      maxTorque = String(item.paramvalue ?? '');
    } else if (!flangeType && item.paramnum === 'A31_FLXS_QDQSR') {
      flangeType = String(item.paramvalue ?? '');
    }
  });

  const filters: SelectFilterItem[] = [
    { id: '589', val: resolveTorqueRange(maxTorque) },
    { id: '606', val: flangeType },
    {
      id: '725',
      val: selectedRow.p2 ? `;${selectedRow.p2}` : '',
    },
    {
      id: '726',
      val: selectedRow.p2 ? `${selectedRow.p2};` : '',
    },
  ];

  const shaftType = selectedRow.p1;
  if (shaftType === 1 || shaftType === '1') {
    return { categoryId: '0', filters };
  }
  if (shaftType === 0 || shaftType === '0') {
    return { categoryId: '0', filters };
  }

  message.warning('请先选择名称');
  return null;
}

export function buildSupportBrowseFilters(
  list: TransmissionShaftPage1ParameterItem[],
  selected: TransmissionTableRow,
): SelectFilterItem[] {
  const selectedIndex = getSelectedRowIndex(list[3]?.tableMap?.rowData ?? [], selected);
  const supportRow = list[3]?.tableMap?.rowData?.[selectedIndex];
  const shaftRow = list[2]?.tableMap?.rowData?.[selectedIndex];

  return [
    { id: '721', val: `${supportRow?.p1 ?? ''};` },
    { id: '722', val: shaftRow?.p5 ? String(shaftRow.p5) : '' },
  ];
}

export function applyShaftBrowseResult(
  list: TransmissionShaftPage1ParameterItem[],
  selected: TransmissionTableRow,
  payload: ModuleOkPayload,
  modelTypes: string[],
) {
  const selectedIndex = getSelectedRowIndex(list[2]?.tableMap?.rowData ?? [], selected);
  if (selectedIndex < 0) return;

  const shaftRows = list[2]?.tableMap?.rowData ?? [];
  const speedRows = list[4]?.tableMap?.rowData ?? [];
  shaftRows[selectedIndex].p3 = payload.para1 ?? '';
  modelTypes[selectedIndex] = payload.para4 ?? '';

  markShaftRowsPublished(list);

  payload.arr?.forEach(item => {
    if (item.name === 'A31_ZGNJ') {
      speedRows[selectedIndex].p2 = item.val ?? '';
    } else if (item.name === 'A31_ZGWJ') {
      speedRows[selectedIndex].p3 = item.val ?? '';
    } else if (item.name === 'A31_ZXJ_ZJZCAZK') {
      shaftRows[selectedIndex].p5 = item.val ?? '';
    }
  });

  runCriticalSpeedCalculation(list);
}

export function applySupportBrowseResult(
  list: TransmissionShaftPage1ParameterItem[],
  selected: TransmissionTableRow,
  payload: ModuleOkPayload,
  modelTypes: string[],
) {
  const selectedIndex = getSelectedRowIndex(list[3]?.tableMap?.rowData ?? [], selected);
  if (selectedIndex < 0) return;

  list[3].tableMap!.rowData![selectedIndex].p2 = payload.para1 ?? '';
  modelTypes[selectedIndex] = payload.para4 ?? '';
}

export async function assembleSupportModule(
  list: TransmissionShaftPage1ParameterItem[],
  selected: TransmissionTableRow,
  modelTypes: string[],
) {
  const selectedIndex = getSelectedRowIndex(list[3]?.tableMap?.rowData ?? [], selected);
  const modelNum = list[3]?.tableMap?.rowData?.[selectedIndex]?.p2;
  if (!modelNum) {
    message.warning('请先输入模型号');
    return false;
  }

  const modelType = modelTypes[selectedIndex] ?? '';
  const response = await assembleModule(null, String(modelNum), modelType, '', '', '', '');
  if (response === undefined) {
    message.info('通讯异常');
    return false;
  }
  return true;
}

export async function assembleShaftModule(
  list: TransmissionShaftPage1ParameterItem[],
  selected: TransmissionTableRow,
  modelTypes: string[],
) {
  const selectedIndex = getSelectedRowIndex(list[2]?.tableMap?.rowData ?? [], selected);
  const modelNum = list[2]?.tableMap?.rowData?.[selectedIndex]?.p3;
  if (!modelNum) {
    message.warning('请先输入模型号');
    return false;
  }

  const modelType = modelTypes[selectedIndex] ?? '';
  const response = await assembleModule(null, String(modelNum), modelType, '', '', '', '');
  if (response === undefined) {
    message.info('通讯异常');
    return false;
  }
  return true;
}
