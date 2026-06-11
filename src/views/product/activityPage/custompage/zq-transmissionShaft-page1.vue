<template>
  <div class="transmission-page">
    <div class="layout-wrapper">
      <div class="section-title">1、确定传动轴数量:</div>

      <section class="count-section">
        <a-form label-align="left" :colon="false">
          <a-form-item label="传动轴数量:" :label-col="formLabelCol">
            <a-input v-model:value="param1" style="display: none" />
            <a-select
              v-model:value="parameterTempList[0].defaultValue"
              style="width: 150px"
              @change="handleShaftCountChange">
              <a-select-option v-for="item in SHAFT_COUNT_OPTIONS" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="传动轴转速(r/min):" :label-col="formLabelCol">
            <a-input v-model:value="param2" style="display: none" />
            <a-input v-model:value="parameterTempList[1].defaultValue" style="width: 150px" allow-clear disabled />
          </a-form-item>
        </a-form>
      </section>

      <div class="section-title section-title--toolbar">
        <span class="section-title-text">2、选择传动轴:</span>
        <a-button type="primary" class="toolbar-btn" :disabled="shaftBrowseDisabled" @click="handleShowModuleData">
          浏览
        </a-button>
        <a-button type="primary" class="toolbar-btn" :disabled="shaftAssembleDisabled" @click="handleAssembleShaft">
          装配
        </a-button>
        <a-button type="primary" class="toolbar-btn" :disabled="shaftBrowseDisabled" @click="handleShowSdtPage"
          >新设计</a-button
        >
      </div>

      <a-table
        :columns="SHAFT_TABLE_COLUMNS"
        :data-source="shaftRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ x: 632 }"
        :row-key="shaftRowKey"
        :row-selection="shaftRowSelection"
        class="page-table">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'p1'">
            <a-select v-model:value="record.p1" style="width: 100%" @change="() => handleShaftNameChange(record, index)">
              <a-select-option v-for="item in SHAFT_NAME_OPTIONS" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else-if="column.dataIndex === 'p2'">
            <a-input
              v-model:value="record.p2"
              class="table-cell-input"
              @input="setSaveBtnEnable()"
              @blur="event => handleNumericBlur(event)" />
          </template>
        </template>
      </a-table>

      <div class="section-title section-title--toolbar qdcdz">
        <span class="section-title-text">3、选择支承角板:</span>
        <a-button type="primary" class="toolbar-btn" :disabled="supportBrowseDisabled" @click="handleShowProductList">
          浏览
        </a-button>
        <a-button type="primary" class="toolbar-btn" :disabled="supportAssembleDisabled" @click="handleAssembleSupport">
          装配
        </a-button>
      </div>

      <a-table
        :columns="SUPPORT_TABLE_COLUMNS"
        :data-source="supportRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ x: 632 }"
        :row-key="supportRowKey"
        :row-selection="supportRowSelection"
        class="page-table qdcdz">
        <template #bodyCell="{ column, record }">
          <a-input
            v-if="column.dataIndex === 'p1'"
            v-model:value="record.p1"
            class="table-cell-input"
            @input="setSaveBtnEnable()"
            @blur="event => handleNumericBlur(event)" />
        </template>
      </a-table>

      <div class="section-title qdcdz1">4、确定转速:</div>
      <a-table
        :columns="SPEED_TABLE_COLUMNS"
        :data-source="speedRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ x: 632 }"
        :row-key="speedRowKey"
        class="page-table qdcdz1">
        <template #bodyCell="{ column, record, index }">
          <template v-if="['p1', 'p2', 'p3'].includes(String(column.dataIndex))">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-input"
              @input="() => handleSpeedInput(index)"
              @blur="event => handleSpeedBlur(event, index)" />
          </template>
          <template v-else-if="column.dataIndex === 'p5'">
            <span :class="{ 'status-fail': isFailStatus(record.p5) }">{{ record.p5 }}</span>
          </template>
        </template>
      </a-table>

      <div class="section-title">5、万向节夹角及当量夹角校核:</div>
      <a-table
        :columns="JOINT_TABLE_COLUMNS"
        :data-source="jointRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ x: 632 }"
        :row-key="jointRowKey"
        class="page-table joint-table">
        <template #bodyCell="{ column, record, index }">
          <template v-if="['p1', 'p2'].includes(String(column.dataIndex))">
            <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
          </template>
          <template v-else-if="column.dataIndex === 'p3'">
            <a-input
              v-model:value="record.p3"
              class="table-cell-input"
              @input="() => handleJointInput(index)"
              @blur="event => handleJointBlur(event, index)" />
          </template>
          <template v-else-if="['p4', 'p6'].includes(String(column.dataIndex))">
            <span :class="{ 'status-fail': isFailStatus(record[String(column.dataIndex)]) }">
              {{ record[String(column.dataIndex)] }}
            </span>
          </template>
          <template v-else-if="['p5'].includes(String(column.dataIndex))">
            <span>{{ record.p5 }}</span>
          </template>
        </template>
      </a-table>
    </div>

    <ModuleDataSelect
      ref="shaftModuleSelectRef"
      :module-data-select="shaftModuleFlag"
      :mcategoryid="MODULE_LIBRARY_CATEGORY_ID"
      @moduleOk="handleShaftModuleOk"
      @moduleCancel="shaftModuleFlag = false" />

    <ModuleDataSelect
      ref="supportModuleSelectRef"
      :module-data-select="supportModuleFlag"
      :mcategoryid="MODULE_LIBRARY_CATEGORY_ID"
      @moduleOk="handleSupportModuleOk"
      @moduleCancel="supportModuleFlag = false" />

    <a-modal v-model:visible="sdtModalOpen" :mask-closable="false" width="1000px" :footer="null">
      <div class="design-modal-body">
        <ZqTransm ref="zqTransmRef" @initData="handleDesignComplete" />
        <a-button type="text" class="design-modal-cancel" @click="sdtModalOpen = false">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import ModuleDataSelect from '@/views/product/activityPage/components/module-data-select.vue';
import type { ModuleOkPayload } from '@/views/product/activityPage/components/module-data-select.vue';
import ZqTransm from './zq-transmissionShaft-page2.vue';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  applyShaftBrowseResult,
  applySupportBrowseResult,
  assembleShaftModule,
  assembleSupportModule,
  buildShaftBrowseFilters,
  buildSupportBrowseFilters,
} from './zq-transmissionShaft-page1/assemblyOperations';
import {
  applyDesignResultToRow,
  getSelectedRowIndex,
  resetSpeedRowForShaft,
  runCriticalSpeedCalculation,
  runUniversalJointCalculation,
  validateNumericInput,
} from './zq-transmissionShaft-page1/calculation';
import {
  cloneParameterList,
  createDefaultTransmissionShaftPage1ParameterList,
  SHAFT_COUNT_OPTIONS,
  SHAFT_NAME_OPTIONS,
  type TransmissionShaftPage1ParameterItem,
  type TransmissionTableRow,
} from './zq-transmissionShaft-page1/parameterDefaults';
import { syncTablesByShaftCount } from './zq-transmissionShaft-page1/tableOperations';
import {
  isFailStatus,
  JOINT_TABLE_COLUMNS,
  SHAFT_TABLE_COLUMNS,
  SPEED_TABLE_COLUMNS,
  SUPPORT_TABLE_COLUMNS,
} from './zq-transmissionShaft-page1/tableColumns';

defineOptions({ name: 'zq-transmissionShaft-page1' });

interface ModuleSelectExpose {
  initData: (categoryId: string, pageStr: unknown) => void;
}

interface ZqTransmExpose {
  initData: () => void;
}

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: TransmissionShaftPage1ParameterItem[];
  }>(),
  {
    width: 1000,
    modalFlag: false,
    pageid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();
const route = useRoute();
const formLabelCol = { style: { width: '230px' } };

function createInitialParameterList() {
  if (!props.parameterTempList?.length) {
    return createDefaultTransmissionShaftPage1ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<TransmissionShaftPage1ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const param1 = ref(String(parameterTempList.value[0]?.defaultValue ?? ''));
const param2 = ref(String(parameterTempList.value[1]?.defaultValue ?? ''));

const shaftRows = computed(() => parameterTempList.value[2]?.tableMap?.rowData ?? []);
const supportRows = computed(() => parameterTempList.value[3]?.tableMap?.rowData ?? []);
const speedRows = computed(() => parameterTempList.value[4]?.tableMap?.rowData ?? []);
const jointRows = computed(() => parameterTempList.value[5]?.tableMap?.rowData ?? []);

const shaftSelection = ref<TransmissionTableRow[]>([]);
const supportSelection = ref<TransmissionTableRow[]>([]);
const shaftSelectedKeys = ref<Key[]>([]);
const supportSelectedKeys = ref<Key[]>([]);

const shaftModuleFlag = ref(false);
const supportModuleFlag = ref(false);
const MODULE_LIBRARY_CATEGORY_ID = '0';
const sdtModalOpen = ref(false);

const shaftModelTypes = ref<string[]>(['', '', '', '']);
const supportModelTypes = ref<string[]>(['', '', '', '']);

const shaftModuleSelectRef = ref<ModuleSelectExpose | null>(null);
const supportModuleSelectRef = ref<ModuleSelectExpose | null>(null);
const zqTransmRef = ref<ZqTransmExpose | null>(null);

const shaftBrowseDisabled = computed(() => shaftSelection.value.length !== 1);
const shaftAssembleDisabled = computed(() => shaftSelection.value.length !== 1);
const supportBrowseDisabled = computed(() => supportSelection.value.length !== 1);
const supportAssembleDisabled = computed(() => supportSelection.value.length !== 1);

const shaftRowSelection = computed(() => ({
  selectedRowKeys: shaftSelectedKeys.value,
  onChange: (_keys: Key[], rows: TransmissionTableRow[]) => {
    shaftSelection.value = rows;
    shaftSelectedKeys.value = rows.map((row, index) => shaftRowKey(row, index));
  },
}));

const supportRowSelection = computed(() => ({
  selectedRowKeys: supportSelectedKeys.value,
  onChange: (_keys: Key[], rows: TransmissionTableRow[]) => {
    supportSelection.value = rows;
    supportSelectedKeys.value = rows.map((row, index) => supportRowKey(row, index));
  },
}));

function shaftRowKey(record: TransmissionTableRow, index: number) {
  return String(record.p0 ?? index);
}

function supportRowKey(record: TransmissionTableRow, index: number) {
  return String(record.p0 ?? index);
}

function speedRowKey(record: TransmissionTableRow, index: number) {
  return String(record.p0 ?? index);
}

function jointRowKey(record: TransmissionTableRow, index: number) {
  return String(record.p0 ?? index);
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function setLocalData() {
  param1.value = String(parameterTempList.value[0]?.defaultValue ?? '');
  param2.value = String(parameterTempList.value[1]?.defaultValue ?? '');
}

function resetParameterTempList() {
  parameterTempList.value[0].defaultValue = param1.value;
  parameterTempList.value[1].defaultValue = param2.value;
}

function handleNumericBlur(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (value && !validateNumericInput(value)) {
    message.error('请输入数字');
  }
}

function handleShaftCountChange() {
  syncTablesByShaftCount(parameterTempList.value);
  setLocalData();
  setSaveBtnEnable();
}

function handleShaftNameChange(record: TransmissionTableRow, index: number) {
  record.p3 = '';
  record.p4 = '设计中';
  resetSpeedRowForShaft(parameterTempList.value, index);
  parameterTempList.value[2].tableMap!.rowData![index] = { ...record };
  setSaveBtnEnable();
}

function handleSpeedInput(index: number) {
  runCriticalSpeedCalculation(parameterTempList.value);
  parameterTempList.value[4].tableMap!.rowData![index] = {
    ...parameterTempList.value[4].tableMap!.rowData![index],
  };
  setSaveBtnEnable();
}

function handleSpeedBlur(event: Event, index: number) {
  const value = (event.target as HTMLInputElement).value;
  if (value && !validateNumericInput(value)) {
    message.error('请输入数字');
    return;
  }
  handleSpeedInput(index);
}

function handleJointInput(index: number) {
  runUniversalJointCalculation(parameterTempList.value);
  parameterTempList.value[5].tableMap!.rowData![index] = {
    ...parameterTempList.value[5].tableMap!.rowData![index],
  };
  setSaveBtnEnable();
}

function handleJointBlur(event: Event, index: number) {
  const value = (event.target as HTMLInputElement).value;
  if (value && !validateNumericInput(value)) {
    message.error('请输入数字');
    return;
  }
  handleJointInput(index);
}

function handleShowModuleData() {
  const selected = shaftSelection.value[0];
  if (!selected) return;

  const browse = buildShaftBrowseFilters(parameterTempList.value, selected);
  if (!browse) return;

  shaftModuleSelectRef.value?.initData(MODULE_LIBRARY_CATEGORY_ID, browse.filters);
  shaftModuleFlag.value = true;
}

function handleShowProductList() {
  const selected = supportSelection.value[0];
  if (!selected) return;

  const filters = buildSupportBrowseFilters(parameterTempList.value, selected);
  supportModuleSelectRef.value?.initData(MODULE_LIBRARY_CATEGORY_ID, filters);
  supportModuleFlag.value = true;
}

function handleShaftModuleOk(payload: ModuleOkPayload) {
  const selected = shaftSelection.value[0];
  if (!selected) return;

  shaftModuleFlag.value = false;
  applyShaftBrowseResult(parameterTempList.value, selected, payload, shaftModelTypes.value);
  setSaveBtnEnable();
}

function handleSupportModuleOk(payload: ModuleOkPayload) {
  const selected = supportSelection.value[0];
  if (!selected) return;

  supportModuleFlag.value = false;
  applySupportBrowseResult(parameterTempList.value, selected, payload, supportModelTypes.value);
  setSaveBtnEnable();
}

async function handleAssembleShaft() {
  resetParameterTempList();
  const ok = await assembleShaftModule(parameterTempList.value, shaftSelection.value[0], shaftModelTypes.value);
  if (ok) {
    shaftSelectedKeys.value = [];
    shaftSelection.value = [];
  }
}

async function handleAssembleSupport() {
  resetParameterTempList();
  const ok = await assembleSupportModule(parameterTempList.value, supportSelection.value[0], supportModelTypes.value);
  if (ok) {
    supportSelectedKeys.value = [];
    supportSelection.value = [];
  }
}

function handleShowSdtPage() {
  sdtModalOpen.value = true;
  nextTick(() => {
    zqTransmRef.value?.initData();
  });
}

function handleDesignComplete(_par1: string, partNo: string, innerDiameter: string, outerDiameter: string) {
  const selected = shaftSelection.value[0];
  if (!selected) return;

  const selectedIndex = getSelectedRowIndex(shaftRows.value, selected);
  applyDesignResultToRow(parameterTempList.value, selectedIndex, partNo, innerDiameter, outerDiameter);
  runCriticalSpeedCalculation(parameterTempList.value);
  sdtModalOpen.value = false;
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {

    void 0;
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

mountWithTaskParamMap(updateEl);

defineExpose({
  updateEl,
  setSaveBtnEnable,
  setLocalData,
  resetParameterTempList,
});
</script>

<style scoped>
.transmission-page {
  background-color: #ffffff;
}

.layout-wrapper {
  background-color: #ffffff;
  height: 100%;
  overflow: auto;
}

.section-title {
  font-weight: 600;
  margin: 10px 20px;
}

.section-title--toolbar {
  font-weight: bold;
  height: 40px;
  margin-top: 20px;
}
.section-title-text {
  display: inline-block;
  width: 120px;
}

.toolbar-btn {
  margin-left: 20px;
}

.count-section {
  margin-left: 15px;
}

.count-section :deep(.ant-form-item-label) {
  flex: 0 0 230px;
  max-width: 230px;
}

.page-table {
  margin-left: 20px;
}

.page-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}

.status-fail {
  color: red;
}

.qdcdz {
  margin-top: 15px;
}

.qdcdz1 {
  margin-top: 15px;
}

.design-modal-body {
  width: 100%;
  height: 100%;
  position: relative;
}

.design-modal-cancel {
  position: absolute;
  right: 0;
  top: 492px;
}
</style>
