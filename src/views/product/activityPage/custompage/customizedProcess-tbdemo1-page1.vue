<template>
  <div class="tbdemo1-page1">
    <a-form label-align="left" :colon="false" :label-col="formLabelCol" class="tbdemo1-page1-form">
      <div class="tbdemo1-page1-section-title">调压参数</div>

      <div class="tbdemo1-page1-fields">
        <a-form-item label="调压位置：">
          <a-select
            v-model:value="parameterTempList[0].defaultValue"
            :options="tyWzOptions"
            class="field-control"
            @change="setSaveBtnEnable" />
        </a-form-item>
        <a-form-item label="调压方式：">
          <a-select
            v-model:value="parameterTempList[1].defaultValue"
            :options="tyFsOptions"
            class="field-control"
            @change="setSaveBtnEnable" />
        </a-form-item>
        <a-form-item label="最正调压级数：">
          <a-input-number
            v-model:value="parameterTempList[2].defaultValue"
            type="number"
            class="field-control"
            @input="setSaveBtnEnable" />
        </a-form-item>
        <a-form-item label="最负调压级数：">
          <a-input-number
            v-model:value="parameterTempList[3].defaultValue"
            type="number"
            class="field-control"
            @input="setSaveBtnEnable" />
        </a-form-item>
        <a-form-item label="每级调压百分比：">
          <a-input v-model:value="parameterTempList[4].defaultValue" class="field-control" @input="setSaveBtnEnable" />
        </a-form-item>
        <a-form-item label="实际匝电势et：">
          <a-input v-model:value="parameterTempList[5].defaultValue" class="field-control" @input="setSaveBtnEnable" />
        </a-form-item>

        <div class="tbdemo1-page1-hot-wrap">
          <HotTable ref="textHotRef" :settings="hotSettings" :license-key="licenseKey" />
        </div>
      </div>
    </a-form>

    <a-modal v-model:open="jseditShow" title="编辑JS代码" :mask-closable="false" :width="600" @cancel="jseditShow = false">
      <a-textarea v-model:value="jsStr" :rows="20" class="js-editor" />
      <template #footer>
        <a-button @click="jseditShow = false">
          <template #icon><CloseOutlined /></template>
          关闭
        </a-button>
        <a-button type="primary" @click="saveJsScript">
          <template #icon><SaveOutlined /></template>
          保存
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { HotTable } from '@handsontable/vue3';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/languages/zh-CN';
import 'handsontable/dist/handsontable.full.css';
import HttpRequestConfig from '@/httpRequest/config';
import { useUserStore } from '@/store/modules/user';
import { getJsContent, setJsContent } from '@/api/flowData/flowData';
import { loadScript } from '@/utils/loadScript';
import { createTbdemo1HotSettings, HOT_LICENSE_KEY } from './tbdemo1-page1/handsontableSettings';
import { extractTbdemo1SaveParamValues, loadTbdemo1PageParameters } from './tbdemo1-page1/loadPageParameters';
import {
  createDefaultTbdemo1ParameterList,
  getTerminalTableRows,
  TY_FS_OPTIONS,
  TY_WZ_OPTIONS,
  type Tbdemo1ParameterItem,
} from './tbdemo1-page1/parameterDefaults';

registerAllModules();

defineOptions({ name: 'rx-customizedProcess-tbdemo1-page1' });

type JsCalcFn = (data: string[]) => string | number;

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Tbdemo1ParameterItem[];
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

const userStore = useUserStore();
const route = useRoute();
const formLabelCol = { style: { width: '120px' } };
const tyWzOptions = TY_WZ_OPTIONS;
const tyFsOptions = TY_FS_OPTIONS;
const licenseKey = HOT_LICENSE_KEY;
const jsname = 'test_add.js';
const jsloaded = ref(false);
const jseditShow = ref(false);
const jsStr = ref('');
const textHotRef = ref<InstanceType<typeof HotTable> | null>(null);

function cloneParameterList(source: Tbdemo1ParameterItem[]): Tbdemo1ParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: item.tableMap.rowData?.map(row => ({ ...row })),
        }
      : item.tableMap,
  }));
}

function createInitialParameterList(): Tbdemo1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultTbdemo1ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Tbdemo1ParameterItem[]>(createInitialParameterList());

const hotSettings = ref(createTbdemo1HotSettings(getTerminalTableRows(parameterTempList.value), () => setSaveBtnEnable()));

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
      reloadHotTable();
    }
  },
  { deep: true },
);

function myIsNaN(value: unknown) {
  if (value === undefined || value === null || value === '') return false;
  return !Number.isNaN(Number(value));
}

function resolveJsScriptUrl() {
  const base = String(HttpRequestConfig.baseUrl ?? '').replace(/\/$/, '');
  return `${base}/flow/${jsname}`;
}

function getJsCalcFn(): JsCalcFn | null {
  const fn = (window as Window & { jscalc?: JsCalcFn }).jscalc;
  return typeof fn === 'function' ? fn : null;
}

function reloadHotTable() {
  nextTick(() => {
    textHotRef.value?.hotInstance?.loadData(getTerminalTableRows(parameterTempList.value));
  });
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') return;
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) return;
  if (parameterValue === undefined || parameterValue === null) return;

  parameterTempList.value.forEach(item => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === parameterId) {
        item.defaultValue = parameterValue;
      }
    } else {
      const colNums = Number(item.tableMap?.colNums ?? 0);
      if (colNums > 0) {
        item.tableMap?.rowData?.forEach(row => {
          for (let i = 0; i < colNums; i++) {
            if (row[`cellParameterId${i}`] === parameterId) {
              row[`p${i}`] = parameterValue;
            }
          }
        });
      }
    }
  });
}

async function jsinvoke() {
  const data: string[] = [];
  for (let i = 0; i < 2; i++) {
    if (!myIsNaN(parameterTempList.value[i]?.defaultValue)) {
      message.info('参数值不是数字');
      return;
    }
    data.push(String(parameterTempList.value[i]?.defaultValue ?? ''));
  }

  if (!jsloaded.value) {
    await loadScript(resolveJsScriptUrl());
    jsloaded.value = true;
  }

  const calcFn = getJsCalcFn();
  if (!calcFn) return;

  const result = calcFn(data);
  if (parameterTempList.value[2]) {
    parameterTempList.value[2].defaultValue = String(result);
    setSaveBtnEnable(
      parameterTempList.value[2].inputOrOutput,
      parameterTempList.value[2].parameterId,
      parameterTempList.value[2].defaultValue,
    );
  }
}

async function jsedit() {
  const userId = String(userStore.getUser?.id ?? '');
  try {
    const response: any = await getJsContent({ filename: jsname, userid: userId });
    if (!response) {
      message.info('服务异常，获取js内容失败');
      return;
    }
    if (response.code != '0') {
      message.info(`获取js内容失败:${response.msg ?? ''}`);
      return;
    }
    if (!response.data?.result) {
      message.info('获取js内容失败');
      return;
    }
    jsStr.value = String(response.data.data ?? '');
    jseditShow.value = true;
  } catch {
    message.info('服务异常，获取js内容失败');
  }
}

async function saveJsScript() {
  jsloaded.value = false;
  const userId = String(userStore.getUser?.id ?? '');
  try {
    const response: any = await setJsContent({
      filename: jsname,
      userid: userId,
      content: jsStr.value,
    });
    if (!response) {
      message.info('服务异常，保存js内容失败');
      return;
    }
    if (response.code != '0') {
      message.info(`保存js内容失败:${response.msg ?? ''}`);
      return;
    }
    if (!response.data?.result) {
      message.info('保存js内容失败');
      return;
    }
    message.success('保存成功');
    jseditShow.value = false;
  } catch {
    message.info('服务异常，保存js内容失败');
  }
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadTbdemo1PageParameters(pageId);
  hotSettings.value = createTbdemo1HotSettings(getTerminalTableRows(parameterTempList.value), () => setSaveBtnEnable());
}

function updateEl() {
  nextTick(() => {
    reloadHotTable();
  });
}

function getCurrentSaveParamValues() {
  return extractTbdemo1SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  jsinvoke,
  jsedit,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  reloadHotTable();
});
</script>

<style scoped>
.tbdemo1-page1 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.tbdemo1-page1-section-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  padding-bottom: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #c0c0c0;
  width: 100px;
}

.tbdemo1-page1-fields {
  width: 430px;
  max-width: 100%;
}

.field-control {
  width: 150px;
}

.tbdemo1-page1-hot-wrap {
  margin-top: 8px;
  width: 100%;
}

.tbdemo1-page1-hot-wrap :deep(.handsontable) {
  font-size: 12px;
}

.js-editor {
  width: 100%;
}
</style>
