<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <a-form-item label="舵机工作方式：" class="form-item--indent">
          <a-input v-model:value="parameterTempList[0].defaultValue" class="field-input" disabled />
        </a-form-item>

        <div class="section-title">确定末端减速器形式：</div>
        <div class="section-tip">此处的直线和旋转是针对减速器的，不是舵机的</div>

        <section class="main-section">
          <a-form-item label="舵机末端减速器形式：">
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
            <span class="field-hint">(=舵机最大力矩*1000/等效力臂)</span>
          </a-form-item>

          <a-form-item label="减速器旋转载荷(Nm)：">
            <a-input
              v-model:value="parameterTempList[4].defaultValue"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              disabled
              @input="setSaveBtnEnable()" />
            <span class="field-hint">(=舵机最大力矩)</span>
          </a-form-item>
        </section>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { applyPage1_2InitData, extractPage1_2SaveParamValues } from './page1-2/initData';
import { loadPage1_2PageParameters } from './page1-2/loadPageParameters';
import { createDefaultPage1_2ParameterList, type Page1_2ParameterItem } from './page1-2/parameterDefaults';

defineOptions({ name: 'rx-customizedProcess-page1-2' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page1_2ParameterItem[];
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
const formLabelCol = { style: { width: '145px' } };

function createInitialParameterList(): Page1_2ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1_2ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page1_2ParameterItem[]>(createInitialParameterList());
const flag = ref(false);
const djzdlj = ref('');

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

function runInitData() {
  const state = applyPage1_2InitData(parameterTempList.value);
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

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadPage1_2PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {
    runInitData();
  });
}

function getCurrentSaveParamValues() {
  return extractPage1_2SaveParamValues(parameterTempList.value);
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

.form-item--indent {
  margin-left: 20px;
}

.section-title {
  border-bottom: 1px solid silver;
  width: 100%;
  font-weight: 600;
  padding: 0 0 8px 10px;
  margin-bottom: 8px;
}

.section-tip {
  font-size: 16px;
  font-weight: bold;
  color: red;
  margin: 0 0 12px 20px;
}

.main-section {
  width: 100%;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding-top: 20px;
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
