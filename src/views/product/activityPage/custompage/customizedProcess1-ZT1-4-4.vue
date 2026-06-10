<template>
  <div class="axle-page">
    <section class="axle-section">
      <div class="axle-section__title">计算输入：</div>
      <a-form layout="horizontal" :label-col="{ style: { width: '170px' } }" class="axle-form">
        <div class="axle-form__columns">
          <div class="axle-form__column">
            <a-form-item label="轴数：">
              <a-select
                v-model:value="parameterTempList[0].defaultValue"
                class="axle-form__input"
                :options="axleCountOptions"
                allow-clear
                @change="setSaveBtnEnable()"
                style="width: 200px" />
            </a-form-item>
            <a-form-item v-for="field in inputFieldsLeft" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="axle-form__input"
                allow-clear
                @input="setSaveBtnEnable()"
                style="width: 200px" />
            </a-form-item>
          </div>
          <div class="axle-form__column">
            <a-form-item v-for="field in inputFieldsRight" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="axle-form__input"
                allow-clear
                @input="setSaveBtnEnable()"
                style="width: 200px" />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </section>

    <section class="axle-section">
      <div class="axle-section__title axle-section__title--with-action">
        <span>计算中间值：</span>
        <a-button type="primary" :loading="calculating" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
        </a-button>
      </div>
      <a-form layout="horizontal" :label-col="{ style: { width: '170px' } }" class="axle-form">
        <div class="axle-form__columns">
          <div class="axle-form__column">
            <a-form-item v-for="field in middleFieldsLeft" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="axle-form__input"
                allow-clear
                @input="setSaveBtnEnable()"
                style="width: 200px" />
            </a-form-item>
          </div>
          <div class="axle-form__column">
            <a-form-item v-for="field in middleFieldsRight" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="axle-form__input"
                allow-clear
                @input="setSaveBtnEnable()"
                style="width: 200px" />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </section>

    <section class="axle-section">
      <div class="axle-section__title">计算结果：</div>
      <a-form layout="horizontal" :label-col="{ style: { width: '170px' } }" class="axle-form">
        <div class="axle-form__columns">
          <div class="axle-form__column">
            <a-form-item v-for="field in resultFieldsLeft" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="axle-form__input"
                disabled
                style="width: 200px" />
            </a-form-item>
          </div>
          <div class="axle-form__column">
            <a-form-item v-for="field in resultFieldsRight" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="axle-form__input"
                disabled
                style="width: 200px" />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/modules/user';
import {
  applyZt1_44CalcResult,
  buildZt1_44CalcPayload,
  calculateCheckDesign,
  validateZt1_44CalcInputs,
  type Zt1_44CalcResultRow,
} from './ZT1_4_4/calculation';
import { applyZt1_44InitData } from './ZT1_4_4/initData';
import { loadZt1_44PageParameters } from './ZT1_4_4/loadPageParameters';
import {
  AXLE_COUNT_OPTIONS,
  createDefaultZt1_44ParameterList,
  INPUT_FIELDS,
  MIDDLE_FIELDS,
  RESULT_FIELDS,
  type Zt1_44ParameterItem,
} from './ZT1_4_4/parameterDefaults';
import { extractZt1_44SaveParamValues } from './ZT1_4_4/rowOperations';

defineOptions({ name: 'rx-customizedProcess1-ZT1-4-4' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Zt1_44ParameterItem[];
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

const userStore = useUserStore();
const calculating = ref(false);

const axleCountOptions = AXLE_COUNT_OPTIONS;
const inputFieldsLeft = INPUT_FIELDS.slice(0, 5);
const inputFieldsRight = INPUT_FIELDS.slice(5);
const middleFieldsLeft = MIDDLE_FIELDS.slice(0, 4);
const middleFieldsRight = MIDDLE_FIELDS.slice(4);
const resultFieldsLeft = RESULT_FIELDS.slice(0, 2);
const resultFieldsRight = RESULT_FIELDS.slice(2);

function cloneParameterList(source: Zt1_44ParameterItem[]): Zt1_44ParameterItem[] {
  return source.map(item => ({ ...item }));
}

function createInitialParameterList(): Zt1_44ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZt1_44ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Zt1_44ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadZt1_44PageParameters,
  });


function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') return;
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) return;
  if (parameterValue === undefined || parameterValue === null) return;

  parameterTempList.value.forEach(item => {
    if (item.ifSingleLine !== 't' && item.parameterId === parameterId) {
      item.defaultValue = parameterValue;
    }
  });
}

async function handleCalculation() {
  if (!validateZt1_44CalcInputs(parameterTempList.value)) {
    message.error('计算参数不能为空');
    return;
  }

  calculating.value = true;
  try {
    const userId = userStore.getUser.id ?? '';
    const payload = buildZt1_44CalcPayload(parameterTempList.value, userId);
    const response = await calculateCheckDesign(payload);
    if (String(response?.data?.code ?? '') !== '0') {
      message.error(String(response?.data?.msg ?? '计算失败'));
      return;
    }

    const rows = (response?.data?.data?.result ?? []) as Zt1_44CalcResultRow[];
    applyZt1_44CalcResult(parameterTempList.value, rows);
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  } catch {
    message.error('计算请求失败');
  } finally {
    calculating.value = false;
  }
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractZt1_44SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.axle-page {
  padding: 20px 10px 24px;
  min-height: 650px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.axle-section {
  margin-bottom: 20px;
}

.axle-section__title {
  margin-bottom: 12px;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
}

.axle-section__title--with-action {
  display: flex;
  align-items: center;
  gap: 20px;
}

.axle-form {
  padding-left: 15px;
}

.axle-form__columns {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 60px;
}

.axle-form__column {
  min-width: 320px;
}

.axle-form__input {
  width: 100px;
}

.axle-form :deep(.ant-form-item) {
  margin-bottom: 10px;
}

.axle-form :deep(.ant-form-item-label > label) {
  justify-content: flex-start;
  text-align: left;
}

.axle-form :deep(.ant-input[disabled]) {
  color: rgba(0, 0, 0, 0.88);
  cursor: default;
}
</style>
