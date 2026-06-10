<template>
  <div>
    <div class="layout-wrapper">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div class="form-grid">
            <div class="form-column">
              <div class="parm-title parm-title--with-btn">
                确定纵梁长度：
                <a-button type="primary" class="btnSty init-btn" @click="initData">更新数据</a-button>
              </div>
              <section class="parm-body parm-body--length">
                <a-form-item label="车架前悬：" :label-col="formLabelCol">
                  <a-input v-model:value="param0" style="display: none" />
                  <a-input v-model:value="parameterTempList[0].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="车架后悬：" :label-col="formLabelCol">
                  <a-input v-model:value="param1" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[1].defaultValue"
                    style="width: 150px"
                    allow-clear
                    :disabled="flag"
                    @input="setSaveBtnEnable()" />
                </a-form-item>
                <a-form-item label="驱动形式：" :label-col="formLabelCol">
                  <a-input v-model:value="param2" style="display: none" />
                  <a-input v-model:value="parameterTempList[2].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="主轴距(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param3" style="display: none" />
                  <a-input v-model:value="parameterTempList[3].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="双联驱动桥轴距(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param4" style="display: none" />
                  <a-input v-model:value="parameterTempList[4].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="纵梁长度(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param5" style="display: none" />
                  <a-input v-model:value="parameterTempList[5].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
              </section>
            </div>

            <div class="form-column">
              <div class="parm-title parm-title--spaced">确定纵梁截面：</div>
              <section class="parm-body parm-body--section">
                <a-form-item label="腹面高度(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param6" style="display: none" />
                  <a-input v-model:value="parameterTempList[6].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="翼面高度(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param7" style="display: none" />
                  <a-input v-model:value="parameterTempList[7].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="纵梁厚度(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param8" style="display: none" />
                  <a-input v-model:value="parameterTempList[8].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
              </section>
            </div>

            <div class="form-column">
              <div class="parm-title">纵梁变形区：</div>
              <section class="parm-body parm-body--deform">
                <a-form-item label="起点位置(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param9" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[9].defaultValue"
                    style="width: 150px"
                    allow-clear
                    :disabled="flag"
                    @input="setSaveBtnEnable()" />
                </a-form-item>
                <a-form-item label="角度(°)：" :label-col="formLabelCol">
                  <a-input v-model:value="param10" style="display: none" />
                  <a-input
                    v-model:value="parameterTempList[10].defaultValue"
                    style="width: 150px"
                    allow-clear
                    :disabled="flag"
                    @input="setSaveBtnEnable()" />
                </a-form-item>
              </section>
            </div>

            <div class="form-column">
              <div class="parm-title">确定加强梁尺寸：</div>
              <section class="parm-body parm-body--reinforce">
                <a-form-item label="加强梁层数：" :label-col="formLabelCol">
                  <a-input v-model:value="param11" style="display: none" />
                  <a-select v-model:value="parameterTempList[11].defaultValue" style="width: 150px" disabled allow-clear>
                    <a-select-option v-for="item in REINFORCEMENT_LAYER_OPTIONS" :key="item.value" :value="item.value">
                      {{ item.value }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="内加强梁厚度(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param12" style="display: none" />
                  <a-input v-model:value="parameterTempList[12].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="外加强梁厚度(mm)：" :label-col="formLabelCol">
                  <a-input v-model:value="param13" style="display: none" />
                  <a-input v-model:value="parameterTempList[13].defaultValue" style="width: 150px" allow-clear disabled />
                </a-form-item>
              </section>
            </div>

            <div class="form-column">
              <div class="parm-title">确定纵梁切口：</div>
              <section class="parm-body parm-body--notch">
                <a-form-item label="前端切口：" :label-col="formLabelCol">
                  <a-input v-model:value="param14" style="display: none" />
                  <a-select v-model:value="parameterTempList[14].defaultValue" style="width: 150px" disabled allow-clear>
                    <a-select-option v-for="item in NOTCH_OPTIONS" :key="item.value" :value="item.value">
                      {{ item.value }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="后端切口：" :label-col="formLabelCol">
                  <a-input v-model:value="param15" style="display: none" />
                  <a-select v-model:value="parameterTempList[15].defaultValue" style="width: 150px" disabled allow-clear>
                    <a-select-option v-for="item in NOTCH_OPTIONS" :key="item.value" :value="item.value">
                      {{ item.value }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </section>
            </div>

            <div class="form-column">
              <div class="parm-title">确定纵梁材料：</div>
              <section class="parm-body parm-body--material">
                <a-form-item label="纵梁材料：" :label-col="formLabelCol">
                  <a-input v-model:value="param16" style="display: none" />
                  <a-select
                    v-model:value="parameterTempList[16].defaultValue"
                    style="width: 150px"
                    allow-clear
                    @change="setSaveBtnEnable()">
                    <a-select-option v-for="item in BEAM_MATERIAL_OPTIONS" :key="item.value" :value="item.value">
                      {{ item.value }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </section>
            </div>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import { applyFlowParameters } from './zq-frameDesign-page2/operations';
import {
  BEAM_MATERIAL_OPTIONS,
  cloneParameterList,
  createDefaultZqFrameDesignPage2ParameterList,
  NOTCH_OPTIONS,
  PARAM_FIELD_COUNT,
  REINFORCEMENT_LAYER_OPTIONS,
  type ZqFrameDesignPage2ParameterItem,
} from './zq-frameDesign-page2/parameterDefaults';

defineOptions({ name: 'zq-frameDesign-page2' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: ZqFrameDesignPage2ParameterItem[];
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
const formLabelCol = { style: { width: '150px' } };

function createInitialParameterList(): ZqFrameDesignPage2ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return createDefaultZqFrameDesignPage2ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<ZqFrameDesignPage2ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const flag = ref(false);

const param0 = ref('');
const param1 = ref('');
const param2 = ref('');
const param3 = ref('');
const param4 = ref('');
const param5 = ref('');
const param6 = ref('');
const param7 = ref('');
const param8 = ref('');
const param9 = ref('');
const param10 = ref('');
const param11 = ref('');
const param12 = ref('');
const param13 = ref('');
const param14 = ref('');
const param15 = ref('');
const param16 = ref('');

const paramRefs = [
  param0,
  param1,
  param2,
  param3,
  param4,
  param5,
  param6,
  param7,
  param8,
  param9,
  param10,
  param11,
  param12,
  param13,
  param14,
  param15,
  param16,
];

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function setLocalData() {
  for (let i = 0; i < PARAM_FIELD_COUNT; i += 1) {
    paramRefs[i].value = String(parameterTempList.value[i]?.defaultValue ?? '');
  }
}

function resetParameterTempList() {
  for (let i = 0; i < PARAM_FIELD_COUNT; i += 1) {
    parameterTempList.value[i].defaultValue = paramRefs[i].value;
  }
}

function initData() {
  applyFlowParameters(parameterTempList.value);
  setLocalData();
}

function updateEl() {
  nextTick(() => {

    void 0;
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

onMounted(async () => {
  await loadPageParametersIfNeeded();
  if (props.parameterTempList?.length) {
    initData();
  } else {
    setLocalData();
  }
  updateEl();
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
  initData,
  setLocalData,
  resetParameterTempList,
});
</script>

<style scoped>
.layout-wrapper {
  padding: 0 10px;
  height: 650px;
  background-color: #ffffff;
  margin-top: 20px;
}

.layout-content {
  background: #ffffff;
}

.form-grid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 620px;
}

.form-column {
  width: 460px;
}

.parm-title {
  height: 30px;
  width: 100%;
  font-weight: 600;
  padding-left: 15px;
}

.parm-title--with-btn {
  height: 45px;
}

.parm-title--spaced {
  margin-top: 20px;
}

.init-btn {
  margin-left: 20px;
  margin-bottom: 5px;
}

.parm-body {
  width: 100%;
  background-color: #ffffff;
  padding-top: 20px;
  margin-left: 15px;
}

.parm-body--length {
  height: 272px;
}

.parm-body--section {
  height: 180px;
}

.parm-body--deform {
  height: 110px;
}

.parm-body--reinforce {
  height: 165px;
}

.parm-body--notch {
  height: 122px;
}

.parm-body--material {
  height: 210px;
}

:deep(.ant-form-item) {
  margin-bottom: 10px;
}
</style>
