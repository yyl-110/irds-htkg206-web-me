<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="section-header">
          <span class="section-header__title">设计输入：</span>
          <a-form-item label="舟它工作方式：" class="work-mode-item">
            <a-select v-model:value="parameterTempList[0].defaultValue" class="field-input" @change="outputChange">
              <a-select-option v-for="item in workModeOptions" :key="item.label" :value="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <section class="main-section">
          <div class="form-column-left">
            <a-form-item label="舟它最大输出力矩(Nm)：">
              <a-input-number
                v-model:value="parameterTempList[1].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="额定输出力矩(Nm)：">
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

            <a-form-item label="舟它负载转速(旋转)(°/S)：">
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

            <a-form-item label="机械行程(单边转角)(°)：">
              <a-input-number
                v-model:value="parameterTempList[4].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="最大空载转速(旋转)(°/S)：">
              <a-input-number
                v-model:value="parameterTempList[5].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="舟它额定功率(W)：">
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
            <a-form-item label="舟它最大输出力矩(等效, Nm)：" :label-col="formLabelColWide">
              <a-input-number
                v-model:value="parameterTempList[8].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input field-input--offset"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="额定输出力矩(等效, Nm)：">
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

            <a-form-item label="舟它负载速度(等效, °/S)：">
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

            <a-form-item label="机械行程(单边直线)(°)：">
              <a-input-number
                v-model:value="parameterTempList[11].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="最大空载速度(等效, °/S)：">
              <a-input-number
                v-model:value="parameterTempList[12].defaultValue"
                type="number"
                placeholder="请输入..."
                class="field-input"
                allow-clear
                :disabled="!flag"
                @input="setSaveBtnEnable()" />
            </a-form-item>

            <a-form-item label="舟它额定功率(W)：">
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
import { createDefaultPage0_3ParameterList, type Page0_3ParameterItem } from './page0-3/parameterDefaults';
import { loadPage0_3PageParameters } from './page0-3/loadPageParameters';

defineOptions({ name: 'rx-customizedProcess-page0-3' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page0_3ParameterItem[];
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
const formLabelColWide = { style: { width: '205px' } };

function createInitialParameterList(): Page0_3ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage0_3ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page0_3ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage0_3PageParameters,
  });

const flag = ref(true);

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

  if (modePrefix === '旋转') {
    flag.value = false;
    for (let i = 8; i < 14; i++) {
      if (parameterTempList.value[i]) {
        parameterTempList.value[i].defaultValue = '';
      }
    }
  } else {
    flag.value = true;
    for (let i = 1; i < 8; i++) {
      if (parameterTempList.value[i]) {
        parameterTempList.value[i].defaultValue = '';
      }
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
  min-height: 500px;
  background-color: #ffffff;
}

.layout-content {
  background: #ffffff;
}

.section-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid silver;
  width: 100%;
  font-weight: 600;
  padding: 10px 0 8px 10px;
  margin-bottom: 8px;
}

.section-header__title {
  font-weight: 600;
}

.work-mode-item {
  margin-bottom: 0;
  font-weight: 600;
  font-size: 15px;
}

.main-section {
  width: 900px;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding-top: 20px;
  margin-left: 15px;
  overflow: hidden;
}

.form-column-left {
  width: 420px;
  float: left;
}

.form-column-right {
  width: 440px;
  float: left;
  padding-left: 60px;
}

.field-input {
  width: 200px;
}

.field-input--offset {
  margin-left: -5px;
}
</style>
