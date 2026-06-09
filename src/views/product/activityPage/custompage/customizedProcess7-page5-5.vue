<template>
  <div>
    <div class="layout-wrapper" style="padding: 0 10px; min-height: 680px; background-color: #ffffff; margin-top: 20px">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div style="width: auto; font-weight: 600; padding-left: 10px">电源机柜输入：</div>
          <div style="width: 99%; float: left">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <div style="height: 100%; float: left">
                <a-form-item label="供配电体质确定：" :label-col="{ style: { width: '160px' } }">
                  <a-input v-model:value="parameterTempList[0].defaultValue" style="width: 200px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="电源机柜数量：" :label-col="{ style: { width: '160px' } }">
                  <a-select v-model:value="parameterTempList[1].defaultValue" style="width: 100px" @change="onDyjgNumChange">
                    <a-select-option
                      v-for="item in parameterTempList[1].selectStrVal ?? []"
                      :key="item.label"
                      :value="item.label">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="电源机柜1：" :label-col="{ style: { width: '160px' } }">
                  <a-input v-model:value="parameterTempList[2].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="电源机柜2：" :label-col="{ style: { width: '160px' } }">
                  <a-input v-model:value="parameterTempList[3].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
              </div>
              <div style="width: 50%; height: 100%; float: left; padding-top: 85px; padding-left: 10px">
                <a-form-item label="电源机柜3：" :label-col="{ style: { width: '160px' } }">
                  <a-input v-model:value="parameterTempList[4].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="电源机柜4：" :label-col="{ style: { width: '160px' } }">
                  <a-input v-model:value="parameterTempList[5].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
              </div>
            </section>
          </div>
          <CabinetSection
            v-for="section in CABINET_SECTIONS"
            :key="section.id"
            :section="section"
            :parameter-temp-list="parameterTempList"
            :supply-type="supplyType"
            :action-url="actionUrl"
            :login-user-id="loginUserId"
            :elect-file-name="fileStates[section.id].elect.fileName"
            :elect-file-id="fileStates[section.id].elect.fileId"
            :env-file-name="fileStates[section.id].env.fileName"
            :env-file-id="fileStates[section.id].env.fileId"
            :before-upload="handleBeforeUpload"
            @set-save-btn-enable="setSaveBtnEnable()"
            @confirm="onConfirmOutput"
            @change-number="onChangeOutputRoute"
            @upload-elect="response => onUploadSuccess(section, 'elect', response)"
            @upload-env="response => onUploadSuccess(section, 'env', response)"
            @download="onDownloadFile" />
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { baseUrl, ifGateway } from '@/views/product/activityPage/custompage/_shared/utils/legacyEnv';
import { globaluserId } from '@/views/product/activityPage/custompage/_shared/utils/legacyUser';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import CabinetSection from './Process7-page5-5/CabinetSection.vue';
import {
  CABINET_SECTIONS,
  cloneParameterList,
  initCustomizedProcessPage7Data5_5,
  type CabinetSectionConfig,
  type Page5_5ParameterItem,
} from './Process7-page5-5/parameterDefaults';
import {
  applyUploadResult,
  confirmOutputRows,
  getDownloadUrl,
  parseFileParam,
  setDyjgNum,
  validateOutputRouteCount,
} from './Process7-page5-5/rowOperations';

defineOptions({ name: 'customizedProcess7-page5-5' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page5_5ParameterItem[];
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

function createInitialParameterList(): Page5_5ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_5(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page5_5ParameterItem[]>(createInitialParameterList());
const supplyType = computed(() => String(parameterTempList.value[0]?.defaultValue ?? ''));
const actionUrl = ref('');
const loginUserId = { userId: globaluserId() };

type FileState = { fileName: string; fileId: string };
const fileStates = reactive<Record<number, { elect: FileState; env: FileState }>>({
  1: { elect: { fileName: '', fileId: '' }, env: { fileName: '', fileId: '' } },
  2: { elect: { fileName: '', fileId: '' }, env: { fileName: '', fileId: '' } },
  3: { elect: { fileName: '', fileId: '' }, env: { fileName: '', fileId: '' } },
  4: { elect: { fileName: '', fileId: '' }, env: { fileName: '', fileId: '' } },
});

function syncFileStates() {
  CABINET_SECTIONS.forEach(section => {
    const elect = parseFileParam(String(parameterTempList.value[section.electFileParamIndex]?.defaultValue ?? ''));
    const env = parseFileParam(String(parameterTempList.value[section.envFileParamIndex]?.defaultValue ?? ''));
    fileStates[section.id].elect = elect;
    fileStates[section.id].env = env;
  });
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function onDyjgNumChange() {
  setDyjgNum(parameterTempList.value);
  setSaveBtnEnable();
}

function onConfirmOutput(section: CabinetSectionConfig) {
  confirmOutputRows(parameterTempList.value, section);
  setSaveBtnEnable();
}

function onChangeOutputRoute(section: CabinetSectionConfig) {
  const value = String(parameterTempList.value[section.outputRouteIndex]?.defaultValue ?? '');
  validateOutputRouteCount(value);
}

async function handleBeforeUpload() {
  await nextTick();
  actionUrl.value = ifGateway
    ? `${baseUrl}/base-server/fileManagerController/upload.json`
    : `${baseUrl}/fileManagerController/upload.json`;
}

function onUploadSuccess(
  section: CabinetSectionConfig,
  kind: 'elect' | 'env',
  response: { data?: { id?: string; oldFileName?: string } },
) {
  if (!response.data?.id) return;
  message.info('上传成功');
  const paramIndex = kind === 'elect' ? section.electFileParamIndex : section.envFileParamIndex;
  const parsed = applyUploadResult(parameterTempList.value, paramIndex, response.data.oldFileName ?? '', response.data.id);
  if (kind === 'elect') {
    fileStates[section.id].elect = parsed;
  } else {
    fileStates[section.id].env = parsed;
  }
  setSaveBtnEnable();
}

function onDownloadFile(kind: 'elect' | 'env', section: CabinetSectionConfig) {
  const fileId = kind === 'elect' ? fileStates[section.id].elect.fileId : fileStates[section.id].env.fileId;
  if (!fileId) return;
  window.location.href = getDownloadUrl(fileId, ifGateway, baseUrl);
}

function updateEl() {
  nextTick(() => {
    syncFileStates();
  });
}

onMounted(() => {
  actionUrl.value = ifGateway
    ? `${baseUrl}/base-server/fileManagerController/upload.json`
    : `${baseUrl}/fileManagerController/upload.json`;
  if (props.parameterTempList?.length) {
    updateEl();
  } else {
    syncFileStates();
  }
});

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
