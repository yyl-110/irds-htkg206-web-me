<template>
  <div class="tbdemo1-page2">
    <div class="tbdemo1-page2-section-title">层级调压</div>

    <a-space :size="12" class="tbdemo1-page2-toolbar">
      <a-button type="primary" size="small" @click="handleTheoryDataLoad">
        <template #icon><ReadOutlined /></template>
        理论数据载入
      </a-button>
      <a-button size="small" @click="handleCalculate">
        <template #icon><CalculatorOutlined /></template>
        计算
      </a-button>
      <a-button size="small" @click="openJsEditor">
        <template #icon><CodeOutlined /></template>
        编辑JS
      </a-button>
      <a-button size="small" @click="handleExportExcel">
        <template #icon><FileExcelOutlined /></template>
        导出Excel
      </a-button>
    </a-space>

    <div class="tbdemo1-page2-hot-wrap">
      <HotTable ref="textHotRef" :settings="hotSettings" :license-key="licenseKey" />
    </div>

    <a-modal v-model:open="jseditShow" title="编辑JS代码" :mask-closable="false" :width="800" @cancel="jseditShow = false">
      <a-textarea v-model:value="jsStr" :rows="22" class="js-editor" />
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
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import {
  CalculatorOutlined,
  CloseOutlined,
  CodeOutlined,
  FileExcelOutlined,
  ReadOutlined,
  SaveOutlined,
} from '@ant-design/icons-vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import type Handsontable from 'handsontable';
import 'handsontable/languages/zh-CN';
import 'handsontable/dist/handsontable.full.css';
import { useUserStore } from '@/store/modules/user';
import { getJsContent, setJsContent } from '@/api/flowData/flowData';
import { invalidateFlowJsScript, loadFlowJsScript } from '@/utils/loadFlowJsScript';
import { buildCalcContextFromFlow, createDefaultCalcContext, type Tbdemo1CalcContext } from './tbdemo1-page2/calcContext';
import { exportLayerVoltageRowsToExcel } from './tbdemo1-page2/excelExport';
import {
  applyLayerVoltageCellColors,
  createLayerVoltageHotSettings,
  HOT_LICENSE_KEY,
} from './tbdemo1-page2/handsontableSettings';
import { loadTbdemo1Page2Parameters } from './tbdemo1-page2/loadPageParameters';
import {
  createDefaultTbdemo1Page2ParameterList,
  getLayerVoltageRows,
  setLayerVoltageRows,
  type Tbdemo1Page2ParameterItem,
  type Tbdemo1Page2Row,
} from './tbdemo1-page2/parameterDefaults';

registerAllModules();

defineOptions({ name: 'rx-customizedProcess-tbdemo1-page2' });

type JsCalcFn = (obj: Tbdemo1CalcContext) => Tbdemo1Page2Row[];
type CalcForValueChangedFn = (obj: Tbdemo1CalcContext) => Tbdemo1CalcContext;

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Tbdemo1Page2ParameterItem[];
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

const licenseKey = HOT_LICENSE_KEY;
const jsname = 'tb_demo1.js';
const jsloaded = ref(false);
const jseditShow = ref(false);
const jsStr = ref('');
const textHotRef = ref<InstanceType<typeof HotTable> | null>(null);
const calcContext = ref<Tbdemo1CalcContext>(createDefaultCalcContext());
const calculating = ref(false);

function cloneParameterList(source: Tbdemo1Page2ParameterItem[]): Tbdemo1Page2ParameterItem[] {
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

function createInitialParameterList(): Tbdemo1Page2ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultTbdemo1Page2ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Tbdemo1Page2ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadTbdemo1Page2Parameters,
  });


const hotSettings = ref(
  createLayerVoltageHotSettings({
    rowData: getLayerVoltageRows(parameterTempList.value),
    onCalculate: () => {
      if (!calculating.value) void handleCalculate();
    },
    onDirty: () => setSaveBtnEnable(),
    onAfterRender: hot => applyLayerVoltageCellColors(hot),
  }),
);

function getWindowJsFns() {
  const win = window as Window & {
    jscalc?: JsCalcFn;
    calcForValueChanged?: CalcForValueChangedFn;
  };
  return {
    jscalc: typeof win.jscalc === 'function' ? win.jscalc : null,
    calcForValueChanged: typeof win.calcForValueChanged === 'function' ? win.calcForValueChanged : null,
  };
}

async function ensureJsLoaded() {
  if (jsloaded.value) return true;
  const userId = String(userStore.getUser?.id ?? '');
  try {
    await loadFlowJsScript(jsname, userId);
    jsloaded.value = true;
    return true;
  } catch (err) {
    console.error('[tbdemo1-page2] load js failed', err);
    message.warning('JS脚本加载失败，请先点击「编辑JS」确认 tb_demo1.js 已在服务端保存');
    jsloaded.value = false;
    return false;
  }
}

function reloadHotTable() {
  nextTick(() => {
    textHotRef.value?.hotInstance?.loadData(getLayerVoltageRows(parameterTempList.value));
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
        // scalar param slot reserved for future use
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

async function handleTheoryDataLoad() {
  calcContext.value = buildCalcContextFromFlow();
  if (!calcContext.value.rowData.length) {
    message.warning('未能载入理论数据：请先在 page1 填写调压参数与端子定义，并注入流程上下文后再试');
    return;
  }

  if (!(await ensureJsLoaded())) return;

  const { jscalc } = getWindowJsFns();
  if (!jscalc) {
    message.info('未找到 jscalc 方法，请检查 JS 脚本');
    return;
  }

  const rows = jscalc({ ...calcContext.value });
  setLayerVoltageRows(
    parameterTempList.value,
    rows.map(row => ({ ...row })),
  );
  calcContext.value.rowData = getLayerVoltageRows(parameterTempList.value);
  reloadHotTable();
  setSaveBtnEnable();
}

async function handleCalculate() {
  if (calculating.value) return;
  calculating.value = true;
  try {
    calcContext.value.rowData = getLayerVoltageRows(parameterTempList.value);
    if (!(await ensureJsLoaded())) return;

    const { calcForValueChanged } = getWindowJsFns();
    if (!calcForValueChanged) {
      message.info('未找到 calcForValueChanged 方法，请检查 JS 脚本');
      return;
    }

    calcContext.value = calcForValueChanged({ ...calcContext.value, rowData: [...calcContext.value.rowData] });
    setLayerVoltageRows(
      parameterTempList.value,
      calcContext.value.rowData.map(row => ({ ...row })),
    );
    reloadHotTable();
    setSaveBtnEnable();
  } finally {
    calculating.value = false;
  }
}

async function openJsEditor() {
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
  invalidateFlowJsScript(jsname);
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

function handleExportExcel() {
  exportLayerVoltageRowsToExcel(getLayerVoltageRows(parameterTempList.value));
}


function updateEl() {
  nextTick(() => {

    calcContext.value.rowData = getLayerVoltageRows(parameterTempList.value);
    reloadHotTable();
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

defineExpose({
  updateEl,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  reloadHotTable();
});
</script>

<style scoped>
.tbdemo1-page2 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.tbdemo1-page2-section-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #c0c0c0;
  width: 100px;
}

.tbdemo1-page2-toolbar {
  margin-bottom: 16px;
}

.tbdemo1-page2-hot-wrap {
  overflow: auto;
}

.tbdemo1-page2-hot-wrap :deep(.handsontable) {
  font-size: 13px;
  font-family: arial, tahoma, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}

.js-editor {
  width: 100%;
  font-family: Consolas, Monaco, 'Courier New', monospace;
}
</style>
