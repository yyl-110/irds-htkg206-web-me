<template>
  <div class="transmissionShaft_page2">
    <div class="Shaft_page2_top">新传动轴设计:</div>

    <a-form label-align="left" :colon="false" :label-col="formLabelCol">
      <div class="formData_left">
        <a-form-item label="传动轴编号:" class="formItem_label formIte_num">
          <a-input v-model:value="paramRefs[0]" style="display: none" />
          <a-input v-model:value="parameterTempList[0].defaultValue" style="width: 150px" allow-clear disabled />
          <a-button type="primary" class="btnSty browse-btn" @click="handleShowShaftModule">浏览</a-button>
          <a-button type="primary" class="btnSty" @click="handleOpenModel">打开模型</a-button>
        </a-form-item>

        <a-form-item label="轴管内径:" class="formItem_label">
          <a-input v-model:value="paramRefs[1]" style="display: none" />
          <a-input v-model:value="parameterTempList[1].defaultValue" style="width: 150px" allow-clear disabled />
        </a-form-item>

        <a-form-item label="轴管外径:" class="formItem_label">
          <a-input v-model:value="paramRefs[2]" style="display: none" />
          <a-input v-model:value="parameterTempList[2].defaultValue" style="width: 150px" allow-clear disabled />
        </a-form-item>

        <a-form-item label="附件长度(mm):" class="formItem_label">
          <a-input v-model:value="paramRefs[3]" style="display: none" />
          <a-input
            v-model:value="parameterTempList[3].defaultValue"
            style="width: 150px"
            allow-clear
            disabled
            @input="handleCalculation" />
        </a-form-item>

        <a-form-item label="新传动轴编号:" class="formItem_label">
          <a-input v-model:value="paramRefs[7]" style="display: none" />
          <a-input
            v-model:value="parameterTempList[7].defaultValue"
            style="width: 150px"
            allow-clear
            @input="setSaveBtnEnable()" />
          <a-button type="primary" class="btnSty" style="margin-left: 10px" @click="handleApplicationNewNum"
            >申请件号</a-button
          >
          <a-button type="primary" class="btnSty" @click="handleRenameModule">重命名</a-button>
        </a-form-item>

        <div class="section-subtitle">轴管选型:</div>

        <a-form-item label="传动轴长度(mm):" class="formItem_label formItem_label1">
          <a-input v-model:value="paramRefs[4]" style="display: none" />
          <a-input
            v-model:value="parameterTempList[4].defaultValue"
            style="width: 150px"
            allow-clear
            @input="handleCalculation" />
        </a-form-item>

        <a-form-item label="新轴管长度:" class="formItem_label">
          <a-input v-model:value="paramRefs[5]" style="display: none" />
          <a-input v-model:value="parameterTempList[5].defaultValue" style="width: 150px" allow-clear disabled />
        </a-form-item>

        <a-form-item label="轴管编号:" class="formItem_label">
          <a-input v-model:value="paramRefs[6]" style="display: none" />
          <a-input
            v-model:value="parameterTempList[6].defaultValue"
            style="width: 150px"
            allow-clear
            disabled
            @input="setSaveBtnEnable()" />
          <a-button type="primary" class="btnSty browse-btn" @click="handleShowPipeModule">浏览</a-button>
          <a-button type="primary" class="btnSty" @click="handleAssemblePipe">装配</a-button>
        </a-form-item>
      </div>
    </a-form>

    <div class="confirm-row">
      <a-button type="primary" class="btnSty" @click="handleConfirm">确认</a-button>
    </div>

    <ModuleDataSelect
      ref="shaftModuleSelectRef"
      :module-data-select="shaftModuleFlag"
      :mcategoryid="SHAFT_MODULE_CATEGORY_ID"
      @moduleOk="handleShaftModuleOk"
      @moduleCancel="shaftModuleFlag = false" />

    <ModuleDataSelect
      ref="pipeModuleSelectRef"
      :module-data-select="pipeModuleFlag"
      :mcategoryid="PIPE_MODULE_CATEGORY_ID"
      @moduleOk="handlePipeModuleOk"
      @moduleCancel="pipeModuleFlag = false" />
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import ModuleDataSelect from '@/views/product/activityPage/components/module-data-select.vue';
import type { ModuleOkPayload } from '@/views/product/activityPage/components/module-data-select.vue';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  applyPipeBrowseResult,
  applyShaftBrowseResult,
  assemblePipeModule,
  buildPipeBrowseFilters,
  buildShaftBrowseFilters,
  calculateNewPipeLength,
  clearDesignForm,
  confirmDesignAndSave,
  openReferenceModel,
  renameShaftModule,
  requestShaftPartNumber,
} from './zq-transmissionShaft-page2/operations';
import {
  cloneParameterList,
  createDefaultTransmissionShaftPage2ParameterList,
  FORM_PARAM_COUNT,
  PIPE_MODULE_CATEGORY_ID,
  SHAFT_MODULE_CATEGORY_ID,
  type TransmissionShaftPage2ParameterItem,
} from './zq-transmissionShaft-page2/parameterDefaults';

defineOptions({ name: 'zq-transmissionShaft-page2' });

interface ModuleSelectExpose {
  initData: (categoryId: string, pageStr: unknown) => void;
}

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: TransmissionShaftPage2ParameterItem[];
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
  initData: [pipePartNo: string, shaftPartNo: string, innerDiameter: string, outerDiameter: string];
}>();
const route = useRoute();
const formLabelCol = { style: { width: '140px' } };

function createInitialParameterList() {
  if (!props.parameterTempList?.length) {
    return createDefaultTransmissionShaftPage2ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<TransmissionShaftPage2ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const paramRefs = Array.from({ length: FORM_PARAM_COUNT }, () => ref(''));

const shaftModuleFlag = ref(false);
const pipeModuleFlag = ref(false);

const shaftModuleSelectRef = ref<ModuleSelectExpose | null>(null);
const pipeModuleSelectRef = ref<ModuleSelectExpose | null>(null);

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function setLocalData() {
  for (let i = 0; i < FORM_PARAM_COUNT; i += 1) {
    paramRefs[i].value = String(parameterTempList.value[i]?.defaultValue ?? '');
  }
}

function resetParameterTempList() {
  for (let i = 0; i < FORM_PARAM_COUNT; i += 1) {
    parameterTempList.value[i].defaultValue = paramRefs[i].value;
  }
}

function handleCalculation() {
  calculateNewPipeLength(parameterTempList.value);
  setLocalData();
  setSaveBtnEnable();
}

function handleShowShaftModule() {
  shaftModuleSelectRef.value?.initData(SHAFT_MODULE_CATEGORY_ID, buildShaftBrowseFilters());
  if (shaftModuleFlag.value) {
    shaftModuleFlag.value = false;
    nextTick(() => {
      shaftModuleFlag.value = true;
    });
    return;
  }
  shaftModuleFlag.value = true;
}

function handleShowPipeModule() {
  pipeModuleSelectRef.value?.initData(PIPE_MODULE_CATEGORY_ID, buildPipeBrowseFilters(parameterTempList.value));
  if (pipeModuleFlag.value) {
    pipeModuleFlag.value = false;
    nextTick(() => {
      pipeModuleFlag.value = true;
    });
    return;
  }
  pipeModuleFlag.value = true;
}

function handleShaftModuleOk(payload: ModuleOkPayload) {
  shaftModuleFlag.value = false;
  applyShaftBrowseResult(parameterTempList.value, payload);
  setLocalData();
  setSaveBtnEnable();
}

function handlePipeModuleOk(payload: ModuleOkPayload) {
  pipeModuleFlag.value = false;
  applyPipeBrowseResult(parameterTempList.value, payload);
  setLocalData();
  setSaveBtnEnable();
}

async function handleOpenModel() {
  await openReferenceModel(parameterTempList.value);
}

async function handleApplicationNewNum() {
  const ok = await requestShaftPartNumber(parameterTempList.value);
  if (ok) {
    setLocalData();
    setSaveBtnEnable();
  }
}

async function handleRenameModule() {
  await renameShaftModule(parameterTempList.value);
}

async function handleAssemblePipe() {
  resetParameterTempList();
  await assemblePipeModule(parameterTempList.value);
}

async function handleConfirm() {
  resetParameterTempList();
  try {
    const result = await confirmDesignAndSave(parameterTempList.value);
    emit('initData', result.pipePartNo, result.shaftPartNo, result.innerDiameter, result.outerDiameter);
  } catch (error) {
    message.error(error instanceof Error ? error.message : '保存失败');
  }
}

function initData() {
  clearDesignForm(parameterTempList.value);
  setLocalData();
}

function updateEl() {
  nextTick(() => {

    void 0;
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

mountWithTaskParamMap(updateEl);

defineExpose({
  initData,
  updateEl,
  setSaveBtnEnable,
  setLocalData,
  resetParameterTempList,
});
</script>

<style scoped>
.transmissionShaft_page2 {
  padding: 0 10px;
  height: 100%;
  min-height: 520px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.Shaft_page2_top {
  height: 30px;
  font-weight: bold;
  font-size: 14px;
}

.formData_left {
  width: 700px;
}

.formItem_label {
  margin-bottom: 10px;
  margin-left: 10px;
}

.formIte_num {
  margin-top: 6px;
}

.formItem_label1 {
  margin-top: 20px;
}

.section-subtitle {
  width: auto;
  font-weight: bold;
  font-size: 14px;
  margin: 10px 0 10px 10px;
}

.browse-btn {
  margin-left: 10px;
}

.btnSty + .btnSty {
  margin-left: 10px;
}

.confirm-row {
  margin-top: auto;
  padding: 16px 10px 10px;
  text-align: right;
}
</style>
