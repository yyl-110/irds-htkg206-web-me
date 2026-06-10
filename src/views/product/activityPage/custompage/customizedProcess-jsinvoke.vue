<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="section-title">
          <div class="section-title-text">JS计算</div>
        </div>
        <section class="main-section">
          <div class="form-column">
            <a-form-item label="参数1：">
              <a-input v-model:value="parameterTempList[0].defaultValue" class="field-input" @input="onParamInput" />
            </a-form-item>
            <a-form-item label="参数2：">
              <a-input v-model:value="parameterTempList[1].defaultValue" class="field-input" @input="onParamInput" />
            </a-form-item>
            <a-form-item label="结果：">
              <div class="result-field">
                <a-input v-model:value="parameterTempList[2].defaultValue" class="field-input" disabled />
                <a-button type="primary" class="result-field__action" @click="openJsEditor">
                  <template #icon><CodeOutlined /></template>
                  js编辑
                </a-button>
              </div>
            </a-form-item>
          </div>
        </section>
      </a-form>
    </div>

    <a-modal
      v-model:visible="jseditShow"
      title="编辑JS代码"
      :mask-closable="false"
      :width="640"
      @cancel="jseditShow = false">
      <a-textarea v-model:value="jsStr" :rows="20" class="js-editor" />
      <template #footer>
        <a-button @click="jseditShow = false">关闭</a-button>
        <a-button type="primary" @click="saveJsScript">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { CodeOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import HttpRequestConfig from '@/httpRequest/config';
import { useUserStore } from '@/store/modules/user';
import { getJsContent, setJsContent } from '@/api/flowData/flowData';
import { loadScript } from '@/utils/loadScript';
import { createDefaultJsinvokeParameterList } from './jsinvoke/parameterDefaults';
import { loadJsinvokePageParameters } from './jsinvoke/loadPageParameters';

defineOptions({ name: 'rx-customizedProcess-jsinvoke' });

interface ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  pageId?: string;
  inputName?: string;
  id?: string | number;
  tableMap?: {
    colNums: number;
    rowData: Record<string, unknown>[];
  };
}

type JsCalcFn = (data: string[]) => string | number;

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: ParameterItem[];
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
const jsname = ref('test_add.js');
const jsloaded = ref(false);
const jseditShow = ref(false);
const jsStr = ref('');

function createInitialParameterList(): ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultJsinvokeParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadJsinvokePageParameters,
  });


function myIsNaN(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  return !Number.isNaN(Number(value));
}

function resolveJsScriptUrl() {
  const base = String(HttpRequestConfig.baseUrl ?? '').replace(/\/$/, '');
  return `${base}/flow/${jsname.value}`;
}

function getJsCalcFn(): JsCalcFn | null {
  const fn = (window as Window & { jscalc?: JsCalcFn }).jscalc;
  return typeof fn === 'function' ? fn : null;
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
    } else if (item.tableMap && item.tableMap.colNums > 0) {
      const colNums = item.tableMap.colNums;
      item.tableMap.rowData.forEach(row => {
        for (let i = 0; i < colNums; i++) {
          if (row[`cellParameterId${i}`] === parameterId) {
            row[`p${i}`] = parameterValue;
          }
        }
      });
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

  try {
    if (!jsloaded.value) {
      await loadScript(resolveJsScriptUrl());
      jsloaded.value = true;
    }
  } catch {
    message.info('JS脚本加载失败');
    jsloaded.value = false;
    return;
  }

  const calcFn = getJsCalcFn();
  if (!calcFn) {
    message.info('未找到 jscalc 方法，请检查 JS 脚本');
    return;
  }

  parameterTempList.value[2].defaultValue = String(calcFn(data));
  setSaveBtnEnable(
    parameterTempList.value[2].inputOrOutput,
    parameterTempList.value[2].parameterId,
    parameterTempList.value[2].defaultValue,
  );
}

function onParamInput() {
  void jsinvoke();
}

async function openJsEditor() {
  const data = {
    filename: jsname.value,
    userid: userStore.getUser.id,
  };
  try {
    const response: any = await getJsContent(data);
    if (response === undefined) {
      message.info('服务异常，获取js内容失败');
      return;
    }
    if (response.code != '0') {
      message.info(`获取js内容失败:${response.msg ?? ''}`);
      return;
    }
    if (response.data === undefined || response.data.result != true) {
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
  const data = {
    filename: jsname.value,
    userid: userStore.getUser.id,
    content: jsStr.value,
  };
  try {
    const response: any = await setJsContent(data);
    if (response === undefined) {
      message.info('服务异常，保存js内容失败');
      return;
    }
    if (response.code != '0') {
      message.info(`保存js内容失败:${response.msg ?? ''}`);
      return;
    }
    if (response.data === undefined || response.data.result != true) {
      message.info('保存js内容失败');
      return;
    }
    message.success('保存成功');
    jseditShow.value = false;
  } catch {
    message.info('服务异常，保存js内容失败');
  }
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
  getCurrentSaveParamValues,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.layout-wrapper {
  padding: 12px 16px 24px;
  background-color: #ffffff;
}

.section-title {
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 16px;
  padding-bottom: 8px;
}

.section-title-text {
  font-weight: 700;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.88);
}

.main-section {
  padding-top: 8px;
}

.form-column {
  width: 430px;
}

.field-input {
  width: 200px;
}

.result-field {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.result-field__action {
  padding-inline: 4px;
  margin-left: 4px;
}

.js-editor {
  width: 100%;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input[disabled]) {
  color: rgba(0, 0, 0, 0.65);
  background: #f5f5f5;
}
</style>
