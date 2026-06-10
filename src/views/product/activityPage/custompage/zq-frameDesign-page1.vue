<template>
  <div>
    <div class="layout-wrapper">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div class="section-title">车架参数：</div>
          <section class="form-section">
            <a-form-item label="车架形式：" :label-col="formLabelCol">
              <a-input v-model:value="param0" style="display: none" />
              <a-input
                v-model:value="parameterTempList[0].defaultValue"
                style="width: 150px"
                allow-clear
                :disabled="flag" />
              <a-button type="primary" class="btnSty browse-btn" @click="showProductList">浏览</a-button>
            </a-form-item>

            <a-form-item label="车架外宽-前(mm)：" :label-col="formLabelCol">
              <a-input v-model:value="param1" style="display: none" />
              <a-input
                v-model:value="parameterTempList[1].defaultValue"
                style="width: 150px"
                allow-clear
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="车架外宽-后(mm)：" :label-col="formLabelCol">
              <a-input v-model:value="param2" style="display: none" />
              <a-input
                v-model:value="parameterTempList[2].defaultValue"
                style="width: 150px"
                allow-clear
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="连接形式：" :label-col="formLabelCol">
              <a-input v-model:value="param3" style="display: none" />
              <a-select
                v-model:value="parameterTempList[3].defaultValue"
                style="width: 150px"
                allow-clear
                @change="setSaveBtnEnable()">
                <a-select-option
                  v-for="item in CONNECTION_TYPE_OPTIONS"
                  :key="item.value"
                  :value="item.value">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </section>
        </a-form>
      </div>

      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div class="section-title">车架选型：</div>
          <section class="form-section">
            <a-form-item label="车架平台编号：" :label-col="formLabelCol">
              <a-input v-model:value="param4" style="display: none" />
              <a-input
                v-model:value="parameterTempList[4].defaultValue"
                style="width: 150px"
                allow-clear
                :disabled="flag" />
              <a-button type="primary" class="btnSty browse-btn" @click="showModuleData(1)">浏览</a-button>
            </a-form-item>

            <a-form-item label="参考车架总成编号：" :label-col="formLabelCol">
              <a-input v-model:value="param5" style="display: none" />
              <a-input
                v-model:value="parameterTempList[5].defaultValue"
                style="width: 150px"
                allow-clear
                :disabled="flag" />
              <a-button type="primary" class="btnSty browse-btn" @click="showModuleData(2)">浏览</a-button>
            </a-form-item>

            <a-form-item label="车架总成模板编号：" :label-col="formLabelCol">
              <a-input v-model:value="param6" style="display: none" />
              <a-input
                v-model:value="parameterTempList[6].defaultValue"
                style="width: 150px"
                allow-clear
                :disabled="flag" />
              <a-button type="primary" class="btnSty browse-btn" @click="showModuleData(3)">浏览</a-button>
            </a-form-item>
          </section>
        </a-form>
      </div>

      <div class="selectBox">
        <div class="table-toolbar">
          生成车架模型：
          <a-button type="primary" class="btnSty toolbar-btn">同步模型</a-button>
          <a-button
            type="primary"
            class="btnSty toolbar-btn"
            :disabled="assemblingFlag"
            @click="handleAssembleModuleByTemplate">
            申请件号
          </a-button>
          <a-button type="primary" class="btnSty toolbar-btn" :disabled="clearFlag" @click="handleClearPartNo">
            清除件号
          </a-button>
        </div>

        <a-table
          :columns="FRAME_MODEL_TABLE_COLUMNS"
          :data-source="tableRows"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ x: 520 }"
          :row-key="tableRowKey"
          :row-selection="rowSelection"
          class="frame-model-table">
          <template #bodyCell="{ column, record }">
            <a-input
              v-if="column.dataIndex"
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-input"
              @input="setSaveBtnEnable()" />
          </template>
        </a-table>
      </div>
    </div>

    <ModuleDataSelect
      ref="productDataSelectRef"
      :module-data-select="productFlag"
      :mcategoryid="PRODUCT_CATEGORY_ID"
      @moduleOk="handleProductOk"
      @moduleCancel="handleProductCancel" />

    <ModuleDataSelect
      ref="moduleDataSelectRef"
      :module-data-select="moduleDataFlag"
      :mcategoryid="MODULE_CATEGORY_ID"
      @moduleOk="handleModuleOk"
      @moduleCancel="handleModuleCancel" />
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import ModuleDataSelect from '@/views/product/activityPage/components/module-data-select.vue';
import type { ModuleOkPayload } from '@/views/product/activityPage/components/module-data-select.vue';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  applyFlowParameters,
  applyModuleBrowseResult,
  applyProductBrowseResult,
  assembleFrameModuleByTemplate,
  clearSelectedPartNumbers,
} from './zq-frameDesign-page1/operations';
import {
  cloneParameterList,
  CONNECTION_TYPE_OPTIONS,
  createDefaultZqFrameDesignPage1ParameterList,
  getFrameModelRows,
  MODULE_CATEGORY_ID,
  PRODUCT_CATEGORY_ID,
  PRODUCT_ROOT_NODE_ID,
  setFrameModelRows,
  type FrameModelRow,
  type ZqFrameDesignPage1ParameterItem,
} from './zq-frameDesign-page1/parameterDefaults';
import { FRAME_MODEL_TABLE_COLUMNS } from './zq-frameDesign-page1/tableColumns';

defineOptions({ name: 'zq-frameDesign-page1' });

interface ModuleDataSelectExpose {
  initData: (categoryId: string, pageStr: string) => void;
}

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: ZqFrameDesignPage1ParameterItem[];
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
const formLabelCol = { style: { width: '150px' } };

function createInitialParameterList(): ZqFrameDesignPage1ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return createDefaultZqFrameDesignPage1ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<ZqFrameDesignPage1ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const tableRows = computed(() => getFrameModelRows(parameterTempList.value));

const param0 = ref('');
const param1 = ref('');
const param2 = ref('');
const param3 = ref('');
const param4 = ref('');
const param5 = ref('');
const param6 = ref('');

const flag = ref(true);
const assemblingFlag = ref(true);
const clearFlag = ref(true);
const productFlag = ref(false);
const moduleDataFlag = ref(false);

const selectList = ref<FrameModelRow[]>([]);
const selectedRowKeys = ref<Key[]>([]);

const productDataSelectRef = ref<ModuleDataSelectExpose | null>(null);
const moduleDataSelectRef = ref<ModuleDataSelectExpose | null>(null);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (_keys: Key[], rows: FrameModelRow[]) => {
    selectList.value = rows;
    selectedRowKeys.value = rows.map((row, idx) => tableRowKey(row, idx));
    assemblingFlag.value = rows.length !== 1;
    clearFlag.value = rows.length <= 0;
  },
}));

function tableRowKey(record: FrameModelRow, index: number) {
  return String(record.p0 ?? index);
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function setLocalData() {
  param0.value = String(parameterTempList.value[0]?.defaultValue ?? '');
  param1.value = String(parameterTempList.value[1]?.defaultValue ?? '');
  param2.value = String(parameterTempList.value[2]?.defaultValue ?? '');
  param3.value = String(parameterTempList.value[3]?.defaultValue ?? '');
  param4.value = String(parameterTempList.value[4]?.defaultValue ?? '');
  param5.value = String(parameterTempList.value[5]?.defaultValue ?? '');
  param6.value = String(parameterTempList.value[6]?.defaultValue ?? '');
}

function resetParameterTempList() {
  parameterTempList.value[0].defaultValue = param0.value;
  parameterTempList.value[1].defaultValue = param1.value;
  parameterTempList.value[2].defaultValue = param2.value;
  parameterTempList.value[3].defaultValue = param3.value;
  parameterTempList.value[4].defaultValue = param4.value;
  parameterTempList.value[5].defaultValue = param5.value;
  parameterTempList.value[6].defaultValue = param6.value;
  setFrameModelRows(parameterTempList.value, [...tableRows.value]);
}

function initData() {
  applyFlowParameters(parameterTempList.value);
  setLocalData();
}

function updateEl() {
  nextTick(() => {

    void 0;
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function showProductList() {
  productDataSelectRef.value?.initData(PRODUCT_CATEGORY_ID, PRODUCT_ROOT_NODE_ID);
  productFlag.value = true;
}

function showModuleData(_type: number) {
  moduleDataSelectRef.value?.initData(MODULE_CATEGORY_ID, '');
  moduleDataFlag.value = true;
}

function handleProductOk(payload: ModuleOkPayload) {
  productFlag.value = false;
  applyProductBrowseResult(parameterTempList.value, payload.arr ?? []);
  setLocalData();
  setSaveBtnEnable();
}

function handleProductCancel() {
  productFlag.value = false;
}

function handleModuleOk(payload: ModuleOkPayload) {
  moduleDataFlag.value = false;
  applyModuleBrowseResult(parameterTempList.value, payload.arr ?? []);
  setLocalData();
  setSaveBtnEnable();
}

function handleModuleCancel() {
  moduleDataFlag.value = false;
}

function handleClearPartNo() {
  const rows = getFrameModelRows(parameterTempList.value);
  clearSelectedPartNumbers(rows, selectList.value);
  setFrameModelRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

async function handleAssembleModuleByTemplate() {
  resetParameterTempList();
  const result = await assembleFrameModuleByTemplate(selectList.value);
  if (!result.ok) {
    message[result.level](result.message);
  }
}

onMounted(async () => {
  await loadPageParametersIfNeeded();
  if (props.parameterTempList?.length) {
    setLocalData();
  }
  updateEl();
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
  initData,
  resetParameterTempList,
});
</script>

<style scoped>
.layout-wrapper {
  padding: 0 10px;
  height: 650px;
  background-color: #ffffff;
  margin-top: 20px;
}

.layout-content {
  background: #ffffff;
}

.section-title {
  width: auto;
  font-weight: 600;
  padding-left: 10px;
}

.form-section {
  width: 100%;
  background-color: #ffffff;
  padding: 10px 0 0 15px;
}

.browse-btn {
  margin-left: 20px;
}

.selectBox {
  width: 100%;
  float: left;
  padding-top: 10px;
}

.table-toolbar {
  width: auto;
  font-size: 15px;
  font-weight: 600;
  padding-left: 10px;
  margin-bottom: 10px;
}

.toolbar-btn {
  margin-left: 20px;
}

.frame-model-table {
  width: 100%;
}

.frame-model-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}
</style>
