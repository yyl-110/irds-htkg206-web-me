<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form layout="vertical" label-align="left" :colon="false" class="design-form">
        <a-form-item label="舟它工作方式：" class="form-item--indent work-mode-item">
          <a-input v-model:value="parameterTempList[0].defaultValue" class="field-input" disabled />
        </a-form-item>
        <div class="section-header__title">确定末端减速器形式：</div>
        <section class="main-section">
          <div class="section-tip">此处的直线和旋转是针对减速器的，不是舟它的</div>
          <a-form-item label="舟它末端减速器形式：">
            <a-input v-model:value="parameterTempList[1].defaultValue" class="field-input" disabled />
          </a-form-item>

          <a-form-item label="等效力臂(mm)：">
            <a-input-number
              v-model:value="parameterTempList[2].defaultValue"
              type="number"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              :disabled="flag"
              @input="setSaveBtnEnable()"
              @blur="onInputParm" />
            <span class="field-hint">(填写后自动计算减速器直线载荷，减速器旋转载荷值)</span>
          </a-form-item>

          <a-form-item label="减速器直线载荷(N)：" class="form-item--wide">
            <a-input
              v-model:value="parameterTempList[3].defaultValue"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              disabled
              @input="setSaveBtnEnable()" />
            <span class="field-hint">(=舟它最大力矩*1000/等效力臂)</span>
          </a-form-item>

          <a-form-item label="减速器旋转载荷(Nm)：">
            <a-input
              v-model:value="parameterTempList[4].defaultValue"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              disabled
              @input="setSaveBtnEnable()" />
            <span class="field-hint">(=舟它最大力矩)</span>
          </a-form-item>
        </section>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { applyPage1_2InitData, extractPage1_2SaveParamValues, extractPage1_2TableSavePayload } from './page1-2/initData';
import { loadPage1_2PageParameters } from './page1-2/loadPageParameters';
import { createDefaultPage1_2ParameterList, type Page1_2ParameterItem } from './page1-2/parameterDefaults';

defineOptions({ name: 'rx-customizedProcess-page1-2' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page1_2ParameterItem[];
    savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null;
    savedTables?: Array<Record<string, unknown>> | null;
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

function createInitialParameterList(): Page1_2ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1_2ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page1_2ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage1_2PageParameters,
  });

const flag = ref(false);
const djzdlj = ref('');

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

function runInitData() {
  const state = applyPage1_2InitData(parameterTempList.value, props.savedTables);
  flag.value = state.flag;
  djzdlj.value = state.djzdlj;
}

function onInputParm(event: FocusEvent) {
  const target = event.target as HTMLInputElement;
  if (parameterTempList.value[2]) {
    parameterTempList.value[2].defaultValue = target.value;
  }
  const parm = parameterTempList.value[2]?.defaultValue ?? '';
  const maxTorque = Number(djzdlj.value);
  if (parameterTempList.value[3] && parm) {
    parameterTempList.value[3].defaultValue = ((maxTorque * 1000) / Number(parm)).toFixed(2);
  }
  if (parameterTempList.value[4]) {
    parameterTempList.value[4].defaultValue = String(djzdlj.value);
  }
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
    runInitData();
  });
}

setupParameterWatch(updateEl);

function syncParameterListBeforeSave() {
  const workMode = parameterTempList.value[0]?.defaultValue ?? '';
  const endpointStyle = parameterTempList.value[1]?.defaultValue ?? '';
  const equalArm = parameterTempList.value[2]?.defaultValue ?? '';
  const maxTorque = Number(djzdlj.value);

  if (endpointStyle === '旋转') {
    if (parameterTempList.value[4]) {
      parameterTempList.value[4].defaultValue = String(djzdlj.value);
    }
    return;
  }

  if (equalArm && maxTorque && parameterTempList.value[3]) {
    parameterTempList.value[3].defaultValue = ((maxTorque * 1000) / Number(equalArm)).toFixed(2);
  }
  if (workMode === '直线喷管' || workMode === '直线非喷管') {
    if (parameterTempList.value[4]) {
      parameterTempList.value[4].defaultValue = String(djzdlj.value);
    }
  }
}

function getCurrentSaveParamValues() {
  syncParameterListBeforeSave();
  return extractPage1_2SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  syncParameterListBeforeSave();
  return extractPage1_2TableSavePayload(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
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
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

.section-tip {
  display: block;
  font-size: 14px;
  color: red;
  margin: 0 0 12px;
}

.work-mode-item {
  margin-bottom: 0;
  font-weight: 400;
}

.form-item--indent {
  margin-left: 20px;
}

.design-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.design-form :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.design-form :deep(.ant-form-item-label > label) {
  white-space: normal;
  line-height: 1.4;
  height: auto;
}

.main-section {
  width: 100%;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding-top: 5px;
  margin-left: 15px;
}

.form-item--wide :deep(.ant-form-item-control-input-content) {
  max-width: 700px;
}

.field-input {
  width: 234px;
}

.field-hint {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
