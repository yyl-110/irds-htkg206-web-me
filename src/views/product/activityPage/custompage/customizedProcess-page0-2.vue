<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="section-header">
          <span class="section-header__title">设计输入：</span>
          <a-form-item label="舵机工作方式：" class="work-mode-item">
            <a-select v-model:value="parameterTempList[0].defaultValue" class="field-input" @change="outputChange">
              <a-select-option v-for="item in workModeOptions" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <section class="main-section">
          <div class="form-column-left">
            <a-form-item label="舵机最大输出力矩（Nm）：">
              <a-input-number
                v-model:value="parameterTempList[1].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="额定输出力矩（Nm）：">
              <a-input-number
                v-model:value="parameterTempList[2].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLX()" />
            </a-form-item>

            <a-form-item label="舵机负载转速（旋转）（°/S）：">
              <a-input-number
                v-model:value="parameterTempList[3].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLX()" />
            </a-form-item>

            <a-form-item label="机械行程（单边转角）（°）：">
              <a-input-number
                v-model:value="parameterTempList[4].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="最大空载转速（旋转）（°/S）：">
              <a-input-number
                v-model:value="parameterTempList[5].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="舵机额定功率（W）：">
              <a-input-number
                v-model:value="parameterTempList[6].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                disabled
                @input="setSaveBtnEnable()" />
            </a-form-item>
          </div>

          <div class="form-column-right">
            <a-form-item label="舵机最大输出力矩（等效, Nm）：">
              <a-input-number
                v-model:value="parameterTempList[8].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="额定输出力矩（等效, Nm）：">
              <a-input-number
                v-model:value="parameterTempList[9].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLZ()" />
            </a-form-item>

            <a-form-item label="舵机负载速度（等效, °/S）：">
              <a-input-number
                v-model:value="parameterTempList[10].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLZ()" />
            </a-form-item>

            <a-form-item label="机械行程（单边直线）（°）：">
              <a-input-number
                v-model:value="parameterTempList[11].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="最大空载速度（等效, °/S）：">
              <a-input-number
                v-model:value="parameterTempList[12].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="舵机额定功率（W）：">
              <a-input-number
                v-model:value="parameterTempList[13].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                disabled
                @input="setSaveBtnEnable()" />
            </a-form-item>
          </div>
        </section>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { handleCutZero } from '@/utils/tools';
import { createDefaultPage1_1_1_1ParameterList, type Page1_1_1_1ParameterItem } from './page0-2/parameterDefaults';
import { loadPage1_1_1_1PageParameters } from './page0-2/loadPageParameters';

defineOptions({ name: 'rx-customizedProcess-page1-1-1-1' });

interface FlowTableItem {
  tablenum?: string;
  rowdata?: Array<Record<string, string>>;
}

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page1_1_1_1ParameterItem[];
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
const labelWidth = 200;
const formLabelCol = { style: { width: `${labelWidth}px` } };

function createInitialParameterList(): Page1_1_1_1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1_1_1_1ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page1_1_1_1ParameterItem[]>(createInitialParameterList());
const flag = ref(true);

const workModeOptions = computed(() => {
  const item = parameterTempList.value[0];
  return item?.selectStrVal?.length ? item.selectStrVal : (item?.selectStr ?? []);
});

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = val.map(item => ({ ...item }));
      nextTick(() => updateEl());
    }
  },
  { deep: true },
);

function getFlowTableList(): FlowTableItem[] {
  return [];
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadPage1_1_1_1PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {
    outputChange(parameterTempList.value[0]?.defaultValue ?? '');
  });
}

function outputChange(type: string) {
  if (parameterTempList.value[0]) {
    parameterTempList.value[0].defaultValue = type;
  }
  const modePrefix = type.substring(0, 2);
  const flowTables = getFlowTableList();
  const obj = flowTables.find(x => x.tablenum === 'DJ0_1_BASEPARAMS');

  if (modePrefix === '旋转') {
    flag.value = false;
    for (let i = 8; i < 14; i++) {
      if (parameterTempList.value[i]) {
        parameterTempList.value[i].defaultValue = '';
      }
    }
    if (obj?.rowdata?.[0]) {
      const row = obj.rowdata[0];
      parameterTempList.value[1].defaultValue = row.p1 ?? '';
      parameterTempList.value[2].defaultValue = row.p2 ?? '';
      parameterTempList.value[3].defaultValue = row.p3 ?? '';
      parameterTempList.value[4].defaultValue = row.p4 ?? '';
      parameterTempList.value[5].defaultValue = row.p9 ?? '';
      calculateEDGLX();
    }
  } else {
    flag.value = true;
    for (let i = 1; i < 8; i++) {
      if (parameterTempList.value[i]) {
        parameterTempList.value[i].defaultValue = '';
      }
    }
    if (obj?.rowdata?.[1]) {
      const row = obj.rowdata[1];
      parameterTempList.value[8].defaultValue = row.p5 ?? '';
      parameterTempList.value[9].defaultValue = row.p6 ?? '';
      parameterTempList.value[10].defaultValue = row.p7 ?? '';
      parameterTempList.value[12].defaultValue = row.p8 ?? '';
      parameterTempList.value[11].defaultValue = row.p10 ?? '';
      calculateEDGLZ();
    }
  }
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') {
    return;
  }
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) {
    return;
  }
  if (parameterValue === undefined || parameterValue === null) {
    return;
  }
  parameterTempList.value.forEach(item => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === parameterId) {
        item.defaultValue = parameterValue;
      }
    } else if (item.tableMap && Number(item.tableMap.colNums) > 0) {
      const colNums = Number(item.tableMap.colNums);
      item.tableMap.rowData?.forEach(row => {
        for (let i = 0; i < colNums; i++) {
          if (row[`cellParameterId${i}`] === parameterId) {
            row[`p${i}`] = parameterValue;
          }
        }
      });
    }
  });
}

function calculateEDGLX() {
  let param1 = parameterTempList.value[2]?.defaultValue;
  let param2 = parameterTempList.value[3]?.defaultValue;
  if (param1 === '' || param1 === undefined) {
    param1 = '0';
  }
  if (param2 === '' || param2 === undefined) {
    param2 = '0';
  }
  const val = (Number(param1) * Number(param2) * 6.283) / 360;
  if (parameterTempList.value[6]) {
    parameterTempList.value[6].defaultValue = handleCutZero(val.toFixed(3));
  }
  setSaveBtnEnable();
}

function calculateEDGLZ() {
  let param1 = parameterTempList.value[9]?.defaultValue;
  let param2 = parameterTempList.value[10]?.defaultValue;
  if (param1 === '' || param1 === undefined) {
    param1 = '0';
  }
  if (param2 === '' || param2 === undefined) {
    param2 = '0';
  }
  const val = (Number(param1) * Number(param2) * 6.283) / 360;
  if (parameterTempList.value[13]) {
    parameterTempList.value[13].defaultValue = handleCutZero(val.toFixed(3));
  }
  setSaveBtnEnable();
}

function getCurrentSaveParamValues() {
  return parameterTempList.value
    .filter(item => String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  updateEl();
});
</script>

<style scoped>
.layout-wrapper {
  padding: 10px 10px;
  min-height: 680px;
  background-color: #ffffff;
}

.layout-content {
  background: #ffffff;
}

.section-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  border-bottom: 1px solid silver;
  width: 100%;
  font-weight: 600;
  padding: 0 10px 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.section-header__title {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-weight: 600;
}

.work-mode-item {
  flex: 0 1 auto;
  width: auto;
  max-width: 100%;
  margin-bottom: 0;
  font-weight: 400;
}

.work-mode-item :deep(.ant-form-item-row) {
  flex-wrap: nowrap;
  align-items: center;
  width: auto;
}

.work-mode-item :deep(.ant-form-item-label) {
  flex: 0 0 auto !important;
  width: auto !important;
  max-width: none;
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  padding: 0 8px 0 0 !important;
  white-space: nowrap;
}

.work-mode-item :deep(.ant-form-item-label > label) {
  height: 32px;
  line-height: 32px;
  white-space: nowrap;
}

.work-mode-item :deep(.ant-form-item-control) {
  flex: 0 0 auto;
  width: auto;
  display: flex;
  align-items: center;
  min-height: 32px;
}

.work-mode-item :deep(.ant-form-item-control-input) {
  min-height: 32px;
}

.main-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  width: 100%;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding: 20px 10px 0;
  box-sizing: border-box;
}

.form-column-left,
.form-column-right {
  flex: 1 1 320px;
  min-width: 0;
  max-width: 100%;
}

.main-section :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.main-section :deep(.ant-form-item-row) {
  flex-wrap: wrap;
  row-gap: 4px;
}

.main-section :deep(.ant-form-item-label) {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  height: auto;
}

.main-section :deep(.ant-form-item-label > label) {
  white-space: normal;
  height: auto;
}

.main-section :deep(.ant-form-item-control) {
  flex: 1 1 200px;
  min-width: 0;
}

.field-input {
  width: 200px;
}

@media (max-width: 900px) {
  .main-section :deep(.ant-form-item-row) {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-section :deep(.ant-form-item-label),
  .main-section :deep(.ant-form-item-control) {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .field-input {
    max-width: 100%;
  }
}
</style>
