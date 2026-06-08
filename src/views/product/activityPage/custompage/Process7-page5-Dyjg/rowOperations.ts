import { getTabledataByTablenumTaskid } from '@/api/flowData/flowData';
import { globaluserId } from '@/views/product/activityPage/custompage/_shared/utils/legacyUser';
import { baseUrl, ifGateway } from '@/views/product/activityPage/custompage/_shared/utils/legacyEnv';
import { VOLTAGE_CONTROL_OPTIONS } from '../Process7-page5-5/tableColumns';
import { parseFileParam } from '../Process7-page5-5/rowOperations';
import type { DyjgParameterItem } from './types';
import { TABLE_INDEX } from './types';

export function applyDyjgSaveBtnEnable(
  list: DyjgParameterItem[],
  inputOrOutput?: string,
  parameterId?: string | number,
  parameterValue?: string,
) {
  if (inputOrOutput === undefined) return;
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) return;
  if (parameterValue === undefined || parameterValue === null) return;

  list.forEach(item => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === String(parameterId)) {
        item.defaultValue = parameterValue;
      }
      return;
    }

    const colNums = Number(item.tableMap?.colNums ?? 0);
    if (colNums <= 0) return;

    item.tableMap?.rowData?.forEach(row => {
      for (let i = 0; i < colNums; i += 1) {
        if (row[`cellParameterId${i}`] === String(parameterId)) {
          row[`p${i}`] = parameterValue;
        }
      }
    });
  });
}

export async function loadDyjgTableData(
  parameterTempList: DyjgParameterItem[],
  options: { taskid?: string; pageid?: string; tableNum: string },
) {
  const response = await getTabledataByTablenumTaskid({
    taskid: options.taskid,
    pageid: options.pageid,
    tablenum: options.tableNum,
    userid: globaluserId(),
  });

  if (!response || response.code !== '0' || response.data?.result !== true) {
    return { ok: false as const, message: '未找到数据' };
  }

  if (response.data.data?.length > 0) {
    const rowdata = response.data.data[0].rowdata;
    parameterTempList[TABLE_INDEX].tableMap!.rowData = JSON.parse(String(rowdata));
  }

  return { ok: true as const };
}

export function getDownloadUrl(fileId: string) {
  const prefix = ifGateway ? `${baseUrl}/base-server` : baseUrl;
  return `${prefix}/fileManagerController/download.json?fileId=${fileId}`;
}

export function formatVoltageControlLabel(value: unknown) {
  const option = VOLTAGE_CONTROL_OPTIONS.find(item => item.value === value || String(item.value) === String(value));
  return option?.label ?? value;
}

export { parseFileParam };
