<template>
  <div>
    <div class="layout-wrapper" style="padding: 0 10px; background-color: #ffffff">
      <div style="width: auto; font-size: 15px; font-weight: 600; padding-left: 10px">装配组合：</div>

      <div class="selectBox">
        <a-button type="primary" class="btnSty" style="margin-left: 5px; margin-top: 10px" @click="initData">
          更新数据
        </a-button>

        <a-button
          type="primary"
          class="btnSty"
          style="margin-left: 20px; margin-top: 10px"
          @click="assembleModuleByTemplate">
          创建并装配
        </a-button>

        <a-button type="primary" class="btnSty" style="margin-left: 20px; margin-top: 10px" @click="setPartParamInAssembly">
          再生模型
        </a-button>

        <a-button
          type="primary"
          class="btnSty"
          style="margin-left: 20px; margin-top: 10px"
          @click="assembleModuleByTemplateA">
          装配
        </a-button>

        <div class="page53-table-wrap">
          <a-table
            :columns="ASSEMBLY_TABLE_COLUMNS"
            :data-source="tableData"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: ASSEMBLY_TABLE_MIN_WIDTH }"
            :row-key="tableRowKey"
            :row-selection="rowSelection"
            class="page53-table">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'p1'">
                {{ formatCategoryLabel(record.p1) }}
              </template>

              <template v-else-if="isInputEditableField(column.dataIndex)">
                <a-input
                  v-model:value="record[String(column.dataIndex)]"
                  class="table-cell-input"
                  :disabled="isBrowseType(record.p1)"
                  @input="setSaveBtnEnable()" />
              </template>
            </template>
          </a-table>
        </div>
      </div>

      <div>
        <a-form label-align="left" :colon="false">
          <div style="float: left">
            <a-form-item label="机箱机柜集成文件导出：" :label-col="{ style: { width: '150px' } }">
              <a-input
                v-model:value="parameterTempList[1].defaultValue"
                style="width: 300px"
                allow-clear
                @input="
                  setSaveBtnEnable(
                    parameterTempList[1].inputOrOutput,
                    parameterTempList[1].parameterId,
                    $event.target?.value,
                  )
                " />

              <a-button type="primary" style="margin-left: 10px; margin-right: 10px" @click="exportDataToFile"
                >导出</a-button
              >

              <a v-show="downloadUrl !== ''" :href="downloadUrl" style="color: blue">下载</a>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';

import { message } from 'ant-design-vue';

import type { Key } from 'ant-design-vue/es/table/interface';

import { writeToFile } from '@/api/flowData/flowData';

import { assembleModule, DownloadFile, parameterInFirstCsys } from '@/libs/webSocket';

import { accessUrl, baseUrl } from '@/views/product/activityPage/custompage/_shared/utils/legacyEnv';

import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';

import {
  buildExportReportContent,
  buildModelParametersStr,
  isBrowseType,
  syncAssemblyDataFromFlow,
} from './Process7-page5-3/assemblyOperations';

import {
  cloneParameterList,
  initCustomizedProcessPage7Data5_3D,
  VARIANT_CONFIG,
  type AssemblyTableRow,
  type Page5_3ParameterItem,
} from './Process7-page5-3D/parameterDefaults';

import { ASSEMBLY_TABLE_COLUMNS, ASSEMBLY_TABLE_MIN_WIDTH, formatCategoryLabel, isInputEditableField } from './Process7-page5-3/tableColumns';

defineOptions({ name: 'customizedProcess7-page5-3D' });

const props = withDefaults(
  defineProps<{
    width?: number;

    modalFlag?: boolean;

    pageid?: string;

    parameterTempList?: Page5_3ParameterItem[];
  }>(),

  {
    width: 1000,

    modalFlag: false,

    pageid: '',

    parameterTempList: () => [],
  },
);

const variantConfig = VARIANT_CONFIG;

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();
const route = useRoute();
function createInitialParameterList(): Page5_3ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_3D(props.pageid);
  }

  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page5_3ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });




const tableData = computed(() => parameterTempList.value[0]?.tableMap?.rowData ?? []);

const selectList = ref<AssemblyTableRow[]>([]);

const selectedRowKeys = ref<Key[]>([]);

const downloadUrl = ref('');

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,

  onChange: (_keys: Key[], rows: AssemblyTableRow[]) => {
    selectList.value = rows;

    selectedRowKeys.value = rows.map((row, idx) => tableRowKey(row, idx));
  },
}));

function tableRowKey(record: AssemblyTableRow, index: number) {
  return String(record.p0 ?? index);
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);

  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function initData() {
  syncAssemblyDataFromFlow(parameterTempList.value, variantConfig);

  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {

    void 0;
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

async function exportDataToFile() {
  downloadUrl.value = '';

  const filename = String(parameterTempList.value[1]?.defaultValue ?? '');

  if (!filename) {
    message.info('请指定文件名');

    return;
  }

  const rows = parameterTempList.value[0]?.tableMap?.rowData ?? [];

  const str = buildExportReportContent(rows, variantConfig.exportParamKeys);

  const response = await writeToFile({ fileName: filename, data: str });

  if (!response || response.code !== '0') {
    message.error('保存失败');

    return;
  }

  message.info('导出成功');

  const savedFilename = response.data?.fileName ?? filename;

  parameterTempList.value[1].defaultValue = savedFilename;

  setSaveBtnEnable();

  downloadUrl.value = `${baseUrl}/fileManagerController/downloadByFilename.json?filename=${savedFilename}`;

  const newUrl = accessUrl + savedFilename;

  const downloadResponse = await DownloadFile(newUrl, 'D:\\\\ptc\\\\mrds_work\\\\', savedFilename);

  if (downloadResponse) {
    const jsons = JSON.parse(String(downloadResponse)) as { ReturnStatus?: number };

    if (jsons.ReturnStatus === 0) {
      message.info(`导出成功：D:\\ptc\\mrds_work\\${savedFilename}`);
    } else {
      message.warning('文件自动下载失败');
    }
  } else {
    message.warning('文件自动下载失败!');
  }
}

async function assembleModuleByTemplate() {
  const instance = getCurrentInstance()?.proxy;

  if (!instance) return;

  if (!selectList.value.length) {
    message.info('请选择模型');

    return;
  }

  if (selectList.value.length > 1) {
    message.info('请只选择一个模型');

    return;
  }

  const row = selectList.value[0];

  const newModuleNum = String(row.p7 ?? '');

  if (!newModuleNum) {
    message.warning('请先输入模型号');

    return;
  }

  const parametersStr = buildModelParametersStr(row, variantConfig.modelParamPrefix);

  const tempNumS = variantConfig.templateModel.split('.');

  if (tempNumS.length === 2) {
    const response = await assembleModule(instance, tempNumS[0], tempNumS[1], '', newModuleNum, '', parametersStr);

    if (!response) {
      message.info('通讯异常');

      return;
    }

    if (response.ReturnStatus !== 0) {
      message.error(`装配失败:${response.ReturnStatus}`);
    }
  }
}

async function assembleModuleByTemplateA() {
  const instance = getCurrentInstance()?.proxy;

  if (!instance) return;

  if (!selectList.value.length) {
    message.info('请选择模型');

    return;
  }

  if (selectList.value.length > 1) {
    message.info('请只选择一个模型');

    return;
  }

  const row = selectList.value[0];

  const newModuleNum = String(row.p2 ?? '');

  const moduleType = String(row.p15 ?? '');

  if (!newModuleNum) {
    message.warning('请先输入模型号');

    return;
  }

  const parametersStr = buildModelParametersStr(row, variantConfig.modelParamPrefix);

  const response = await assembleModule(instance, newModuleNum, moduleType, '', '', '', parametersStr);

  if (!response) {
    message.info('通讯异常');

    return;
  }

  if (response.ReturnStatus !== 0) {
    message.error(`装配失败:${response.ReturnStatus}`);
  }
}

async function setPartParamInAssembly() {
  if (!selectList.value.length) {
    message.info('请选择模型');

    return;
  }

  if (selectList.value.length > 1) {
    message.info('请只选择一个模型');

    return;
  }

  const row = selectList.value[0];

  const newModuleNum = String(row.p7 ?? '');

  if (!newModuleNum) {
    message.warning('请先输入模型号');

    return;
  }

  const parametersStr = buildModelParametersStr(row, variantConfig.modelParamPrefix);

  const response = await parameterInFirstCsys(newModuleNum, 'prt', parametersStr);

  if (!response) {
    message.info('通讯异常');

    return;
  }

  if (response.ReturnStatus !== 0) {
    message.error(`重生失败:${response.ReturnStatus}`);
  }
}

defineExpose({
  updateEl,

  setSaveBtnEnable,
});
</script>

<style scoped>
.selectBox {
  width: 100%;

  height: auto;

  float: left;

  margin-bottom: 20px;
}

.page53-table-wrap {
  width: 100%;
  margin-top: 10px;
  overflow-x: auto;
}

.page53-table {
  width: 100%;
  min-width: 100%;
  border: 1px solid #eee;
}

.page53-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.table-cell-input {
  text-align: center;
}
</style>
