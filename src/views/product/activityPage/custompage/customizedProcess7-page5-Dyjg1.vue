<template>
  <div>
    <div class="layout-wrapper" style="padding: 0 10px; min-height: 680px; background-color: #ffffff; margin-top: 20px">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div style="width: 99%; float: left">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <div style="width: 20%; height: 100%">{{ DYJG1_CONFIG.label }}：</div>
              <div style="height: 100%; float: left; padding-top: 25px">
                <a-form-item
                  v-for="field in DYJG_LEFT_FIELDS"
                  :key="field.index"
                  :label="field.label"
                  :label-col="{ style: { width: '160px' } }"
                  :style="field.index === 8 ? 'float: left; margin-bottom: 10px' : undefined">
                  <a-input
                    v-model:value="parameterTempList[field.index].defaultValue"
                    style="width: 100px"
                    allow-clear
                    disabled
                    @input="setSaveBtnEnable()" />
                  <GlobalValueSyncIcon
                    :item="parameterTempList[field.index]"
                    @apply-global="setSaveBtnEnable"
                    @resolved="setSaveBtnEnable()" />
                </a-form-item>
              </div>
              <div style="width: 50%; height: 100%; float: left; padding-top: 25px; padding-left: 110px">
                <a-form-item
                  v-for="field in DYJG_RIGHT_FIELDS"
                  :key="field.index"
                  :label="field.label"
                  :label-col="{ style: { width: '160px' } }">
                  <a-input
                    v-model:value="parameterTempList[field.index].defaultValue"
                    style="width: 100px"
                    allow-clear
                    disabled
                    @input="setSaveBtnEnable()" />
                  <GlobalValueSyncIcon
                    :item="parameterTempList[field.index]"
                    @apply-global="setSaveBtnEnable"
                    @resolved="setSaveBtnEnable()" />
                </a-form-item>
              </div>

              <div style="width: 44%; height: 100%; float: left; padding-top: 25px">
                <a-form-item label="电气接口：" :label-col="{ style: { width: '160px' } }">
                  <a-textarea
                    v-model:value="parameterTempList[10].defaultValue"
                    style="width: 300px"
                    disabled
                    @input="setSaveBtnEnable()" />
                  <GlobalValueSyncIcon
                    :item="parameterTempList[10]"
                    @apply-global="setSaveBtnEnable"
                    @resolved="setSaveBtnEnable()" />
                </a-form-item>

                <a-form-item :label-col="{ style: { width: '160px' } }">
                  <a-input v-model:value="electFile.fileName" style="width: 150px" allow-clear disabled />
                  <GlobalValueSyncIcon
                    :item="parameterTempList[ELECT_FILE_INDEX]"
                    @apply-global="setSaveBtnEnable"
                    @resolved="syncFiles" />
                  <a-button type="primary" style="margin-left: 10px" :disabled="!electFile.fileId" @click="downFile('1')"
                    >下载</a-button
                  >
                </a-form-item>

                <a-form-item label="环境适应性要求：" :label-col="{ style: { width: '160px' } }">
                  <a-textarea
                    v-model:value="parameterTempList[12].defaultValue"
                    style="width: 300px"
                    disabled
                    @input="setSaveBtnEnable()" />
                  <GlobalValueSyncIcon
                    :item="parameterTempList[12]"
                    @apply-global="setSaveBtnEnable"
                    @resolved="setSaveBtnEnable()" />
                </a-form-item>

                <a-form-item :label-col="{ style: { width: '160px' } }">
                  <a-input v-model:value="envFile.fileName" style="width: 150px" allow-clear disabled />
                  <GlobalValueSyncIcon
                    :item="parameterTempList[ENV_FILE_INDEX]"
                    @apply-global="setSaveBtnEnable"
                    @resolved="syncFiles" />
                  <a-button type="primary" style="margin-left: 10px" :disabled="!envFile.fileId" @click="downFile('2')"
                    >下载</a-button
                  >
                </a-form-item>

                <a-form-item label="输出路数：" :label-col="{ style: { width: '160px' } }">
                  <a-input
                    v-model:value="parameterTempList[OUTPUT_ROUTE_INDEX].defaultValue"
                    style="width: 100px"
                    allow-clear
                    disabled />
                  <GlobalValueSyncIcon
                    :item="parameterTempList[OUTPUT_ROUTE_INDEX]"
                    @apply-global="setSaveBtnEnable"
                    @resolved="setSaveBtnEnable()" />
                  <a-button type="primary" class="btnSty" style="margin-left: 20px" @click="initData">更新数据</a-button>
                </a-form-item>
              </div>

              <div style="width: 100%; float: left">
                <a-table
                  :columns="OUTPUT_TABLE_COLUMNS"
                  :data-source="tableData"
                  :pagination="false"
                  bordered
                  size="small"
                  :scroll="{ x: 1022 }"
                  :row-key="tableRowKey"
                  class="dyjg-table">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'p9'">
                      {{ formatVoltageControlLabel(record.p9) }}
                    </template>
                  </template>
                </a-table>
              </div>
            </section>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import GlobalValueSyncIcon from './shared/process7/GlobalValueSyncIcon.vue';
import {
  DYJG_LEFT_FIELDS,
  DYJG_RIGHT_FIELDS,
  ELECT_FILE_INDEX,
  ENV_FILE_INDEX,
  OUTPUT_ROUTE_INDEX,
  TABLE_INDEX,
} from './Process7-page5-Dyjg/types';
import {
  applyDyjgSaveBtnEnable,
  formatVoltageControlLabel,
  getDownloadUrl,
  loadDyjgTableData,
  parseFileParam,
} from './Process7-page5-Dyjg/rowOperations';
import {
  DYJG1_CONFIG,
  cloneDyjg1ParameterList,
  initCustomizedProcessPage7Data5_Dyjg1,
  type DyjgParameterItem,
} from './Process7-page5-Dyjg1/parameterDefaults';
import { OUTPUT_TABLE_COLUMNS } from './Process7-page5-5/tableColumns';
import type { OutputTableRow } from './Process7-page5-5/types';

defineOptions({ name: 'customizedProcess7-page5-Dyjg1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    taskid?: string;
    parameterTempList?: DyjgParameterItem[];
  }>(),
  {
    width: 1000,
    modalFlag: false,
    pageid: '',
    taskid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();

function createInitialParameterList(): DyjgParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_Dyjg1(props.pageid);
  }
  return cloneDyjg1ParameterList(props.parameterTempList);
}

const parameterTempList = ref<DyjgParameterItem[]>(createInitialParameterList());
const tableData = computed(() => parameterTempList.value[TABLE_INDEX]?.tableMap?.rowData ?? []);

const electFile = reactive({ fileName: '', fileId: '' });
const envFile = reactive({ fileName: '', fileId: '' });

function syncFiles() {
  Object.assign(electFile, parseFileParam(String(parameterTempList.value[ELECT_FILE_INDEX]?.defaultValue ?? '')));
  Object.assign(envFile, parseFileParam(String(parameterTempList.value[ENV_FILE_INDEX]?.defaultValue ?? '')));
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyDyjgSaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

async function initData() {
  const result = await loadDyjgTableData(parameterTempList.value, {
    taskid: props.taskid,
    pageid: props.pageid,
    tableNum: DYJG1_CONFIG.tableNum,
  });
  if (!result.ok) {
    message.info(result.message);
    return;
  }
  setSaveBtnEnable();
}

function downFile(type: '1' | '2') {
  const fileId = type === '1' ? electFile.fileId : envFile.fileId;
  if (!fileId) return;
  window.location.href = getDownloadUrl(fileId);
}

function tableRowKey(record: OutputTableRow, index: number) {
  return String(record.p0 ?? index);
}

function updateEl() {
  nextTick(() => {
    syncFiles();
  });
}

onMounted(() => {
  if (props.parameterTempList?.length) {
    updateEl();
  }
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.layout-content {
  background: #ffffff;
}
.dyjg-table {
  width: 100%;
  z-index: 0;
}
.dyjg-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
</style>
