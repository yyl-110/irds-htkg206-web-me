<template>
  <div class="page">
    <div class="layout-wrapper" style="background-color: #ffffff; padding: 0 10px; height: 100%">
      <div style="padding-left: 10px">供电时序表</div>
      <div style="width: 100%; font-weight: 600; padding-left: 0">
        <a-button type="primary" class="btnSty" style="margin-left: 5px; margin-top: 10px" @click="initData">
          更新数据
        </a-button>
      </div>
      <div class="layout-header">
        <div style="width: 100%; height: 65px; line-height: 65px">
          <a-button type="primary" style="margin-left: 10px" @click="addProcessColumn">添加流程</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="resetTable">重置</a-button>
          <a-button type="primary" style="margin-left: 20px" @click="runCalculation">计算</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="openDeleteModal">删除流程</a-button>
        </div>
      </div>
      <div class="layout-content2">
        <div style="width: 100%; padding: 0 10px; min-height: 530px">
          <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: 'max-content', y: tabHeight }"
            :row-key="tableRowKey"
            class="page61-table">
            <template #bodyCell="{ column, record }">
              <template v-if="isProcessDeviceField(column.dataIndex, processCount)">
                <a-select
                  v-model:value="record[String(column.dataIndex)]"
                  :options="IF_SHOW_OPTIONS"
                  style="width: 100%"
                  @change="setSaveBtnEnable()" />
              </template>
              <template v-else-if="isProcessTimeField(column.dataIndex, processCount)">
                <a-input
                  v-model:value="record[String(column.dataIndex)]"
                  class="table-cell-input"
                  @input="setSaveBtnEnable()" />
              </template>
              <template v-else>
                <span>{{ record[String(column.dataIndex)] }}</span>
              </template>
            </template>
          </a-table>
        </div>

        <div class="result-title">计算结果：</div>
        <div class="result-summary">
          <div class="summary-row">
            <div class="summary-field">
              <span class="summary-label">总用电量(KWH)：</span>
              <a-input v-model:value="parameterTempList[1].defaultValue" class="summary-input" disabled />
            </div>
            <div class="summary-field">
              <span class="summary-label">总高压直流用电量(KWH)：</span>
              <a-input v-model:value="parameterTempList[2].defaultValue" class="summary-input" disabled />
            </div>
          </div>
          <div class="summary-row">
            <div class="summary-field">
              <span class="summary-label">总低压直流用电量(KWH)：</span>
              <a-input v-model:value="parameterTempList[3].defaultValue" class="summary-input" disabled />
            </div>
            <div class="summary-field">
              <span class="summary-label">总交流输入用电量(KWH)：</span>
              <a-input v-model:value="parameterTempList[4].defaultValue" class="summary-input" disabled />
            </div>
          </div>
          <div class="summary-row">
            <div class="summary-field">
              <span class="summary-label">总高压直流母线用电量(KWH)：</span>
              <a-input v-model:value="parameterTempList[5].defaultValue" class="summary-input" disabled />
            </div>
          </div>
          <div class="process-result-columns">
            <div v-for="item in processList" :key="item.id" class="process-result-column">
              <RxLabel
                :label="item.labelName"
                :type-key="item.typeKey"
                :mode-type-val0="item.modeTypeVal0"
                :mode-type-val1="item.modeTypeVal1"
                :mode-type-val2="item.modeTypeVal2"
                :mode-type-val3="item.modeTypeVal3"
                :mode-type-val4="item.modeTypeVal4"
                :mode-type-val5="item.modeTypeVal5"
                :mode-type-val6="item.modeTypeVal6"
                :mode-type-val7="item.modeTypeVal7"
                :mode-type-val8="item.modeTypeVal8"
                :mode-type-val9="item.modeTypeVal9"
                :red-flag="true"
                component-type="1"
                prop="id" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal v-model:open="deleteModalOpen" title="流程列表" :width="500" @ok="confirmDelete" @cancel="cancelDelete">
      <a-checkbox-group v-model:value="checkedDeleteIds" style="margin-left: 40px">
        <div v-for="item in deletableList" :key="String(item.id)">
          <a-checkbox :value="item.id" style="width: 180px; height: 30px">{{ item.title }}</a-checkbox>
        </div>
      </a-checkbox-group>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import RxLabel from './Process7-page6-1/label6.vue';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import { runProcessCalculation } from './Process7-page6-1/calculation';
import {
  appendProcessColumns,
  loadZldyxlParam,
  removeProcessColumns,
  resetProcessTable,
  restoreProcessColumnsFromTable,
  syncSupplyTableFromFlow,
} from './Process7-page6-1/dataOperations';
import {
  cloneParameterList,
  initCustomizedProcessPage7Data6_1,
  type Page6_1ParameterItem,
} from './Process7-page6-1/parameterDefaults';
import {
  IF_SHOW_OPTIONS,
  buildTableColumns,
  isProcessDeviceField,
  isProcessTimeField,
  tableRowKey,
} from './Process7-page6-1/tableColumns';
import type { DeletableProcessColumn, ProcessListItem } from './Process7-page6-1/models';
import { PAGE6_1_VARIANT } from './Process7-page6-1/models';

defineOptions({ name: 'customizedProcess7-page6-1' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    pageid?: string;
    parameterTempList?: Page6_1ParameterItem[];
  }>(),
  {
    checkId: '',
    categoryId: '',
    pageid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();
const route = useRoute();
function createInitialParameterList(): Page6_1ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data6_1(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page6_1ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const processList = ref<ProcessListItem[]>([]);
const deletableList = ref<DeletableProcessColumn[]>([]);
const transitNum = ref(1);
const columnsNum = ref(9);
const zldyxlPrm = ref('0.9');
const tabHeight = ref(500);
const deleteModalOpen = ref(false);
const checkedDeleteIds = ref<Array<string | number>>([]);

const tableData = computed(() => parameterTempList.value[0]?.tableMap?.rowData ?? []);
const processCount = computed(() => processList.value.length);
const tableColumns = computed(() => buildTableColumns(processCount.value, PAGE6_1_VARIANT, tableData.value));

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function initData() {
  zldyxlPrm.value = loadZldyxlParam();
  syncSupplyTableFromFlow(parameterTempList.value);
  processList.value = [];
  setSaveBtnEnable();
}

function addProcessColumn() {
  if (transitNum.value > 20) {
    message.info('已经达到最大流程数');
    return;
  }
  const result = appendProcessColumns(
    parameterTempList.value,
    processList.value,
    deletableList.value,
    transitNum.value,
    columnsNum.value,
  );
  transitNum.value = result.transitNum;
  columnsNum.value = result.columnsNum;
  setSaveBtnEnable();
}

function resetTable() {
  resetProcessTable(parameterTempList.value);
  deletableList.value = [];
  processList.value = [];
  transitNum.value = 1;
  columnsNum.value = 9;
}

function runCalculation() {
  runProcessCalculation(parameterTempList.value, processList.value, zldyxlPrm.value);
  setSaveBtnEnable();
}

function openDeleteModal() {
  checkedDeleteIds.value = [];
  deleteModalOpen.value = true;
}

function confirmDelete() {
  if (!checkedDeleteIds.value.length) {
    message.error('请选择流程进行删除');
    return;
  }
  removeProcessColumns(parameterTempList.value, processList.value, deletableList.value, checkedDeleteIds.value);
  deleteModalOpen.value = false;
  checkedDeleteIds.value = [];
  setSaveBtnEnable();
}

function cancelDelete() {
  checkedDeleteIds.value = [];
  deleteModalOpen.value = false;
}

function updateEl() {
  nextTick(() => {

    if (parameterTempList.value.length > 0) {
      const restored = restoreProcessColumnsFromTable(parameterTempList.value, processList.value, deletableList.value);
      transitNum.value = restored.transitNum;
      columnsNum.value = restored.columnsNum;
    }
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

onMounted(() => {
  if (props.parameterTempList?.length) {
    zldyxlPrm.value = loadZldyxlParam();
    initData();
  }
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.layout-content2 {
  background: #ffffff;
}
.result-title {
  width: 100%;
  font-weight: 600;
  margin-bottom: 10px;
  padding: 0 10px 10px;
  font-size: 15px;
}
.result-summary {
  width: 100%;
  padding: 0 10px;
}
.summary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 60px;
  margin-bottom: 8px;
  padding-left: 10px;
}
.summary-field {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 420px;
}
.summary-label {
  flex: 0 0 200px;
  line-height: 32px;
  white-space: nowrap;
}
.summary-input {
  width: 200px;
}
.process-result-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 22px;
  padding: 8px 0 0 10px;
}
.process-result-column {
  flex: 0 0 220px;
  width: 220px;
}
.page61-table {
  width: 100%;
  z-index: 0;
}
.page61-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
.table-cell-input {
  text-align: center;
}
</style>
