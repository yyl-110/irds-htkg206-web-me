<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form layout="vertical" label-align="left" :colon="false" class="design-form">
        <div class="section-header">
          <div class="section-header__title">确认设计输入：</div>
          <a-form-item label="舟它工作方式：" class="work-mode-item">
            <a-input v-model:value="parameterTempList[0].defaultValue" class="field-input" disabled />
          </a-form-item>
        </div>

        <section class="main-section">
          <div class="form-column-left">
            <a-form-item v-for="field in leftFields" :key="field.index" :label="field.label">
              <a-input
                v-model:value="parameterTempList[field.index].defaultValue"
                class="field-input"
                :disabled="field.disabled"
                :allow-clear="!field.disabled"
                @input="setSaveBtnEnable()" />
            </a-form-item>
          </div>
          <div class="form-column-right">
            <a-form-item v-for="field in rightFields" :key="field.index" :label="field.label">
              <a-input
                v-model:value="parameterTempList[field.index].defaultValue"
                class="field-input"
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
import { loadPage1_4PageParameters } from './page1-4/loadPageParameters';
import { applyPage1_4InitData } from './page1-4/initData';
import { createDefaultPage1_4ParameterList, type Page1_4ParameterItem } from './page1-4/parameterDefaults';

defineOptions({ name: 'rx-customizedProcess-page1-4' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page1_4ParameterItem[];
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

const route = useRoute();

function createInitialParameterList(): Page1_4ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1_4ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page1_4ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage1_4PageParameters,
  });

interface FormFieldConfig {
  index: number;
  label: string;
  disabled?: boolean;
}

interface FormRowConfig {
  left: FormFieldConfig;
  right?: FormFieldConfig;
}

const formRows: FormRowConfig[] = [
  {
    left: { index: 1, label: '舟它最大输出力矩（Nm）：', disabled: true },
    right: { index: 12, label: '舟它最大输出力（等效, Nm）：', disabled: true },
  },
  {
    left: { index: 2, label: '额定输出力矩（Nm）：', disabled: true },
    right: { index: 13, label: '额定输出力矩（等效, Nm）：', disabled: true },
  },
  {
    left: { index: 3, label: '舟它负载转速（旋转）（°/S）：', disabled: true },
    right: { index: 14, label: '舟它负载速度（等效, °/S）：', disabled: true },
  },
  {
    left: { index: 4, label: '机械行程（单边转角）（°）：', disabled: true },
    right: { index: 15, label: '机械行程（单边直线）（°）：', disabled: true },
  },
  {
    left: { index: 5, label: '最大空载转速（旋转）（°/S）：', disabled: true },
    right: { index: 16, label: '最大空载速度（等效, °/S）：', disabled: true },
  },
  {
    left: { index: 6, label: '舟它额定功率（W）：', disabled: true },
    right: { index: 17, label: '舟它额定功率（W）：', disabled: true },
  },
  { left: { index: 7, label: '传动效率：', disabled: false } },
  { left: { index: 8, label: '等效力臂（mm）：', disabled: true } },
  { left: { index: 9, label: '舟它末端减速器形式：', disabled: true } },
  { left: { index: 10, label: '减速器直线载荷(N)：', disabled: true } },
  { left: { index: 11, label: '减速器旋转载荷(Nm)：', disabled: true } },
];

const leftFields = computed(() => formRows.map(row => row.left));

const rightFields = computed(() => formRows.filter(row => row.right).map(row => row.right!));

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

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
    applyPage1_4InitData(parameterTempList.value, props.savedParamValues);
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  applyPage1_4InitData(parameterTempList.value, props.savedParamValues);
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
  width: 100%;
  font-weight: 600;
  padding: 10px 0 8px 15px;
  margin-bottom: 2px;
}

.section-header__title {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 12px;
}

.work-mode-item {
  margin-bottom: 0;
  font-weight: 400;
}

.main-section {
  width: 100%;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding-top: 0px;
  margin-left: 15px;
  overflow: hidden;
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

.form-column-left {
  width: 460px;
  float: left;
}

.form-column-right {
  width: 460px;
  float: left;
  padding-left: 40px;
}

.field-input {
  width: 100%;
  max-width: 280px;
}
</style>
