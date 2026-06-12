<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form layout="vertical" label-align="left" :colon="false" class="design-form">
        <div class="section-title">确定通讯形式：</div>

        <section class="main-section form-grid">
          <a-form-item label="通讯形式：">
            <a-select v-model:value="parameterTempList[0].defaultValue" class="field-input" @change="outputChange">
              <a-select-option v-for="item in commTypeOptions" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="数字通讯形式：">
            <a-select
              v-model:value="parameterTempList[1].defaultValue"
              class="field-input"
              :disabled="!isDigitalCommType"
              @change="communicationChange">
              <a-select-option v-for="item in digitalCommOptions" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="是否隔离：">
            <a-select
              v-model:value="parameterTempList[2].defaultValue"
              class="field-input"
              :disabled="isDigitalCommType"
              @change="communicationChange">
              <a-select-option v-for="item in quarantineOptions" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="有无遥测信号：">
            <a-select
              v-model:value="parameterTempList[3].defaultValue"
              class="field-input"
              :disabled="isDigitalCommType"
              @change="communicationChange">
              <a-select-option v-for="item in telemeteringOptions" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="信号电压(V)(下限)：">
            <a-input-number
              v-model:value="parameterTempList[4].defaultValue"
              type="number"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              :disabled="isDigitalCommType"
              @input="setSaveBtnEnable()" />
          </a-form-item>

          <a-form-item label="信号电压(V)(上限)：">
            <a-input-number
              v-model:value="parameterTempList[5].defaultValue"
              type="number"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              :disabled="isDigitalCommType"
              @input="setSaveBtnEnable()" />
          </a-form-item>

          <a-form-item label="反馈电压(V)(下限)：">
            <a-input-number
              v-model:value="parameterTempList[6].defaultValue"
              type="number"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              :disabled="isDigitalCommType"
              @input="setSaveBtnEnable()" />
          </a-form-item>

          <a-form-item label="反馈电压(V)(上限)：">
            <a-input-number
              v-model:value="parameterTempList[7].defaultValue"
              type="number"
              placeholder="请输入..."
              class="field-input"
              allow-clear
              :disabled="isDigitalCommType"
              @input="setSaveBtnEnable()" />
          </a-form-item>
        </section>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { loadPage1_3PageParameters } from './page1-3/loadPageParameters';
import {
  createDefaultPage1_3ParameterList,
  type Page1_3ParameterItem,
  type SelectOption,
} from './page1-3/parameterDefaults';

defineOptions({ name: 'rx-customizedProcess-page1-3' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page1_3ParameterItem[];
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

function createInitialParameterList(): Page1_3ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1_3ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page1_3ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage1_3PageParameters,
  });

const isDigitalCommType = computed(() => parameterTempList.value[0]?.defaultValue === '数字');

function getSelectOptions(index: number): SelectOption[] {
  const item = parameterTempList.value[index];
  return item?.selectStrVal?.length ? item.selectStrVal : (item?.selectStr ?? []);
}

const commTypeOptions = computed(() => getSelectOptions(0));
const digitalCommOptions = computed(() => getSelectOptions(1));
const quarantineOptions = computed(() => getSelectOptions(2));
const telemeteringOptions = computed(() => getSelectOptions(3));

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

function outputChange(type: string) {
  if (type === '数字') {
    for (let i = 2; i < 8; i++) {
      if (parameterTempList.value[i]) {
        parameterTempList.value[i].defaultValue = '';
      }
    }
  } else {
    if (parameterTempList.value[1]) {
      parameterTempList.value[1].defaultValue = '';
    }
  }
  setSaveBtnEnable();
}

function communicationChange() {
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {
    outputChange(parameterTempList.value[0]?.defaultValue ?? '');
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

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
  padding: 0 10px;
  min-height: 680px;
  background-color: #ffffff;
}

.layout-content {
  background: #ffffff;
}

.section-title {
  width: 100%;
  font-weight: 600;
  padding: 10px 0 0px 10px;
  margin-bottom: 0px;
  font-size: 15px;
}

.design-form :deep(.ant-form-item) {
  margin-bottom: 20px;
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
  max-width: 960px;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding-top: 20px;
  margin-left: 15px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  column-gap: 48px;
  align-content: start;
}

.field-input {
  width: 100%;
  max-width: 280px;
}
</style>
