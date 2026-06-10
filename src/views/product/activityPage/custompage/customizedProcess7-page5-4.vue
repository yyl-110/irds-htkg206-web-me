<template>
  <div>
    <div class="layout-content">
      <a-form label-align="left" :colon="false" label-position="left">
        <div style="width: 100%; float: left">
          <div style="width: 120px; font-weight: 600; padding-left: 10px">交流输入参数：</div>
          <div style="width: 99%; float: left">
            <section
              style="
                width: 100%;
                min-height: calc(100vh - 700px);
                background-color: #ffffff;
                padding-top: 20px;
                margin-left: 15px;
              ">
              <div style="width: 44%; height: 100%; float: left">
                <a-form-item label="市电交流输入类型：" :label-col="{ style: { width: `${labelWidth}px` } }">
                  <a-input v-model:value="param1" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[0].defaultValue"
                    style="width: 200px"
                    allow-clear
                    disabled
                    @blur="setSaveBtnEnable()" />
                </a-form-item>
                <a-form-item label="市电交流输入额定电压（V）：" :label-col="{ style: { width: `${labelWidth}px` } }">
                  <a-input v-model:value="param2" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[1].defaultValue"
                    style="width: 200px"
                    allow-clear
                    disabled
                    @blur="setSaveBtnEnable()" />
                </a-form-item>
                <a-form-item label="市电交流输入电压范围：" :label-col="{ style: { width: `${labelWidth}px` } }">
                  <a-input v-model:value="param3" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[2].defaultValue"
                    style="width: 200px"
                    allow-clear
                    disabled
                    @blur="setSaveBtnEnable()" />
                </a-form-item>
              </div>
              <div style="width: 50%; height: 100%; float: left; padding-left: 60px">
                <a-form-item label="市电额定交流频率（Hz）：" :label-col="{ style: { width: `${labelWidth}px` } }">
                  <a-input v-model:value="param4" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[3].defaultValue"
                    style="width: 200px"
                    allow-clear
                    disabled
                    @blur="setSaveBtnEnable()" />
                </a-form-item>
                <a-form-item label="市电交流频率范围（Hz）：" :label-col="{ style: { width: `${labelWidth}px` } }">
                  <a-input v-model:value="param5" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[4].defaultValue"
                    style="width: 200px"
                    allow-clear
                    disabled
                    @blur="setSaveBtnEnable()" />
                </a-form-item>
              </div>
            </section>
          </div>
        </div>

        <div v-show="highVoltageDCFlag" style="width: 100%; margin-top: 20px; float: left">
          <div style="border-bottom: 1px silver solid; width: 140px; font-weight: 600; padding-left: 10px">
            高压直流输入参数：
          </div>
          <div style="width: 99%; float: left">
            <section
              style="
                width: 100%;
                min-height: calc(100vh - 700px);
                background-color: #ffffff;
                padding-top: 20px;
                margin-left: 15px;
              ">
              <div style="width: 44%; height: 100%; float: left">
                <a-form-item label="额定电压（V）：" :label-col="{ style: { width: `${labelWidth}px` } }">
                  <a-input v-model:value="param6" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[5].defaultValue"
                    style="width: 200px"
                    allow-clear
                    disabled
                    @blur="setSaveBtnEnable()" />
                </a-form-item>
              </div>
              <div style="width: 50%; height: 100%; float: left; padding-left: 60px">
                <a-form-item label="电压范围（V）：" :label-col="{ style: { width: `${labelWidth}px` } }">
                  <a-input v-model:value="param7" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[6].defaultValue"
                    style="width: 200px"
                    allow-clear
                    disabled
                    @blur="setSaveBtnEnable()" />
                </a-form-item>
              </div>
            </section>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  cloneParameterList,
  initCustomizedProcessPage7Data5_4,
  type Page5_4ParameterItem,
} from './Process7-page5-4/parameterDefaults';

defineOptions({ name: 'customizedProcess7-page5-4' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page5_4ParameterItem[];
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
function createInitialParameterList(): Page5_4ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_4(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page5_4ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const labelWidth = 200;
const param1 = ref('');
const param2 = ref('');
const param3 = ref('');
const param4 = ref('');
const param5 = ref('');
const param6 = ref('');
const param7 = ref('');
const highVoltageDCFlag = ref(false);

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function updateEl() {
  nextTick(() => {

    const list = getFlowParameterList();
    const supplyType = list.find(item => item.paramnum === 'DY1_1_GPDTZ');
    if (supplyType?.paramvalue === '高压直流输入、高压直流母线') {
      highVoltageDCFlag.value = true;
    } else {
      highVoltageDCFlag.value = false;
      if (parameterTempList.value[5]) parameterTempList.value[5].defaultValue = '';
      if (parameterTempList.value[6]) parameterTempList.value[6].defaultValue = '';
    }
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.layout-content {
  background: #ffffff;
}
</style>
