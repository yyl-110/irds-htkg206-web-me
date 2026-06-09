<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol" :wrapper-col="formWrapperCol">
        <div class="section-header">
          <div class="section-header__title">确认设计输入：</div>
          <a-form-item label="舵机工作方式：" class="work-mode-item">
            <a-input v-model:value="parameterTempList[0].defaultValue" class="field-input" disabled />
          </a-form-item>
        </div>

        <section class="main-section">
          <div v-for="(row, rowIndex) in formRows" :key="rowIndex" class="form-row">
            <div class="form-col">
              <a-form-item :label="row.left.label">
                <a-input
                  v-model:value="parameterTempList[row.left.index].defaultValue"
                  class="field-input"
                  :disabled="row.left.disabled"
                  :allow-clear="!row.left.disabled"
                  @input="setSaveBtnEnable()" />
              </a-form-item>
            </div>
            <div class="form-col">
              <a-form-item v-if="row.right" :label="row.right.label">
                <a-input
                  v-model:value="parameterTempList[row.right.index].defaultValue"
                  class="field-input"
                  disabled
                  @input="setSaveBtnEnable()" />
              </a-form-item>
            </div>
          </div>
        </section>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { loadPage1_4PageParameters } from './page1-4/loadPageParameters';
import { createDefaultPage1_4ParameterList, type Page1_4ParameterItem } from './page1-4/parameterDefaults';

defineOptions({ name: 'rx-customizedProcess-page1-4' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page1_4ParameterItem[];
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
const formLabelCol = { style: { width: `${labelWidth}px`, flex: `0 0 ${labelWidth}px` } };
const formWrapperCol = { style: { flex: '0 0 auto' } };

function createInitialParameterList(): Page1_4ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1_4ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page1_4ParameterItem[]>(createInitialParameterList());

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
    left: { index: 1, label: '舵机最大输出力矩（Nm）：', disabled: true },
    right: { index: 12, label: '舵机最大输出力（等效, Nm）：', disabled: true },
  },
  {
    left: { index: 2, label: '额定输出力矩（Nm）：', disabled: true },
    right: { index: 13, label: '额定输出力矩（等效, Nm）：', disabled: true },
  },
  {
    left: { index: 3, label: '舵机负载转速（旋转）（°/S）：', disabled: true },
    right: { index: 14, label: '舵机负载速度（等效, °/S）：', disabled: true },
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
    left: { index: 6, label: '舵机额定功率（W）：', disabled: true },
    right: { index: 17, label: '舵机额定功率（W）：', disabled: true },
  },
  { left: { index: 7, label: '传动效率：', disabled: false } },
  { left: { index: 8, label: '等效力臂（mm）：', disabled: true } },
  { left: { index: 9, label: '舵机末端减速器形式：', disabled: true } },
  { left: { index: 10, label: '减速器直线载荷(N)：', disabled: true } },
  { left: { index: 11, label: '减速器旋转载荷(Nm)：', disabled: true } },
];

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = val.map(item => ({ ...item }));
    }
  },
  { deep: true },
);

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

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadPage1_4PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {});
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
  border-bottom: 1px solid silver;
  width: 100%;
  font-weight: 600;
  padding: 10px 0 8px 10px;
  margin-bottom: 8px;
}

.section-header__title {
  font-weight: 600;
  margin-bottom: 12px;
}

.work-mode-item {
  margin-bottom: 0;
  font-weight: 400;
}

.main-section {
  width: 960px;
  max-width: 100%;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding-top: 10px;
  margin-left: 15px;
}

.form-row {
  display: flex;
  align-items: flex-start;
  gap: 40px;
}

.form-col {
  flex: 1 1 0;
  min-width: 0;
}

.main-section :deep(.ant-form-item) {
  margin-bottom: 24px;
}

.main-section :deep(.ant-form-item-label > label) {
  white-space: nowrap;
}

.field-input {
  width: 234px;
}
</style>
