<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form layout="vertical" label-align="left" :colon="false" class="design-form">
        <div class="section-header">
          <a-form-item label="舟它工作方式：" class="form-field-item">
            <a-select v-model:value="parameterTempList[0].defaultValue" class="field-input" @change="outputChange">
              <a-select-option v-for="item in workModeOptions" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <section class="main-section">
          <div v-show="!isLinearMode" class="form-column-left">
            <a-form-item label="舟它最大输出力矩（Nm）：" class="form-field-item">
              <a-input-number v-model:value="parameterTempList[1].defaultValue" type="number" placeholder="请输入..." class="field-input" allow-clear @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="额定输出力矩（Nm）：" class="form-field-item">
              <a-input-number
                v-model:value="parameterTempList[2].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLX()" />
            </a-form-item>

            <a-form-item label="舟它负载转速（旋转）（°/S）：" class="form-field-item">
              <a-input-number
                v-model:value="parameterTempList[3].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLX()" />
            </a-form-item>

            <a-form-item label="机械行程（单边转角）（°）：" class="form-field-item">
              <a-input-number v-model:value="parameterTempList[4].defaultValue" type="number" placeholder="请输入..." class="field-input" allow-clear @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="最大空载转速（旋转）（°/S）：" class="form-field-item">
              <a-input-number v-model:value="parameterTempList[5].defaultValue" type="number" placeholder="请输入..." class="field-input" allow-clear @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="舟它额定功率（W）：" class="form-field-item">
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

          <div v-show="isLinearMode" class="form-column-right">
            <a-form-item label="舟它最大输出力矩（等效, Nm）：" class="form-field-item">
              <a-input-number v-model:value="parameterTempList[8].defaultValue" type="number" placeholder="请输入..." class="field-input" allow-clear @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="额定输出力矩（等效, Nm）：" class="form-field-item">
              <a-input-number
                v-model:value="parameterTempList[9].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLZ()" />
            </a-form-item>

            <a-form-item label="舟它负载速度（等效, °/S）：" class="form-field-item">
              <a-input-number
                v-model:value="parameterTempList[10].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                @input="setSaveBtnEnable()"
                @blur="calculateEDGLZ()" />
            </a-form-item>

            <a-form-item label="机械行程（单边直线）（°）：" class="form-field-item">
              <a-input-number
                v-model:value="parameterTempList[11].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="最大空载速度（等效, °/S）：" class="form-field-item">
              <a-input-number
                v-model:value="parameterTempList[12].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="舟它额定功率（W）：" class="form-field-item">
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
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { handleCutZero } from '@/utils/tools';
import { getFlowTableList } from './shared/flowContext';
import { createDefaultPage1_1_1_1ParameterList, type Page1_1_1_1ParameterItem } from './page0-2/parameterDefaults';
import { loadPage1_1_1_1PageParameters } from './page0-2/loadPageParameters';

defineOptions({ name: 'rx-customizedProcess-page1-1-1-1' });

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

function createInitialParameterList(): Page1_1_1_1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1_1_1_1ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page1_1_1_1ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadPage1_1_1_1PageParameters,
});

const isLinearMode = ref(true);

const workModeOptions = computed(() => {
  const item = parameterTempList.value[0];
  return item?.selectStrVal?.length ? item.selectStrVal : (item?.selectStr ?? []);
});

function updateEl() {
  nextTick(() => {
    outputChange(parameterTempList.value[0]?.defaultValue ?? '');
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function outputChange(type: string) {
  if (parameterTempList.value[0]) {
    parameterTempList.value[0].defaultValue = type;
  }
  const modePrefix = type.substring(0, 2);
  const flowTables = getFlowTableList();
  const obj = flowTables.find(x => x.tablenum === 'DJ0_1_BASEPARAMS');

  if (modePrefix === '旋转') {
    isLinearMode.value = false;
    for (let i = 8; i < 14; i++) {
      if (parameterTempList.value[i]) {
        parameterTempList.value[i].defaultValue = '';
      }
    }
    if (obj?.rowdata?.[0]) {
      const row = obj.rowdata[0];
      parameterTempList.value[1].defaultValue = String(row.p1 ?? '');
      parameterTempList.value[2].defaultValue = String(row.p2 ?? '');
      parameterTempList.value[3].defaultValue = String(row.p3 ?? '');
      parameterTempList.value[4].defaultValue = String(row.p4 ?? '');
      parameterTempList.value[5].defaultValue = String(row.p9 ?? '');
      calculateEDGLX();
    }
  } else {
    isLinearMode.value = true;
    for (let i = 1; i < 8; i++) {
      if (parameterTempList.value[i]) {
        parameterTempList.value[i].defaultValue = '';
      }
    }
    if (obj?.rowdata?.[1]) {
      const row = obj.rowdata[1];
      parameterTempList.value[8].defaultValue = String(row.p5 ?? '');
      parameterTempList.value[9].defaultValue = String(row.p6 ?? '');
      parameterTempList.value[10].defaultValue = String(row.p7 ?? '');
      parameterTempList.value[12].defaultValue = String(row.p8 ?? '');
      parameterTempList.value[11].defaultValue = String(row.p10 ?? '');
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

mountWithTaskParamMap(updateEl);
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
  border-bottom: 1px solid silver;
  width: 100%;
  font-weight: 600;
  padding: 0 10px 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.section-header__title {
  font-weight: 600;
  margin-bottom: 12px;
}

.design-form :deep(.form-field-item) {
  margin-bottom: 16px;
}

.design-form :deep(.form-field-item .ant-form-item-label) {
  padding-bottom: 4px;
}

.design-form :deep(.form-field-item .ant-form-item-label > label) {
  white-space: normal;
  line-height: 1.4;
  height: auto;
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
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 100%;
}

.field-input {
  width: 300px;
}
</style>
