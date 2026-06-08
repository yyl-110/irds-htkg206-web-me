<template>
  <div class="input-dyjg-page">
    <a-form label-align="left" :colon="false" class="input-dyjg-form">
      <a-form-item label="供配电体质确定：" :label-col="formLabelCol" class="input-dyjg-supply-type">
        <a-select v-model:value="parameterTempList[0].defaultValue" class="input-dyjg-select" @change="setSaveBtnEnable()">
          <a-select-option
            v-for="item in parameterTempList[0].selectStrVal ?? []"
            :key="item.label"
            :value="item.label">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <CabinetSection
        :section="INPUT_DYJG2_SECTION"
        :parameter-temp-list="parameterTempList"
        :supply-type="supplyType"
        :action-url="actionUrl"
        :login-user-id="loginUserId"
        :elect-file-name="fileState.elect.fileName"
        :elect-file-id="fileState.elect.fileId"
        :env-file-name="fileState.env.fileName"
        :env-file-id="fileState.env.fileId"
        :before-upload="handleBeforeUpload"
        always-visible
        :show-divider="false"
        @set-save-btn-enable="setSaveBtnEnable()"
        @confirm="onConfirmOutput"
        @change-number="onChangeOutputRoute"
        @upload-elect="response => onUploadSuccess('elect', response)"
        @upload-env="response => onUploadSuccess('env', response)"
        @download="kind => onDownloadFile(kind)" />
    </a-form>
  </div>
</template>

<script setup lang="ts">
import CabinetSection from './Process7-page5-5/CabinetSection.vue';
import { INPUT_DYJG2_SECTION } from './Process7-page5-InputDyjg/config';
import { useInputDyjgPage } from './Process7-page5-InputDyjg/useInputDyjgPage';
import type { Page5_5ParameterItem } from './Process7-page5-InputDyjg/parameterDefaults';

defineOptions({ name: 'customizedProcess7-page5-InputDyjg2' });

const formLabelCol = { style: { width: '200px' } };

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

const {
  parameterTempList,
  supplyType,
  actionUrl,
  loginUserId,
  fileState,
  setSaveBtnEnable,
  onConfirmOutput,
  onChangeOutputRoute,
  handleBeforeUpload,
  onUploadSuccess,
  onDownloadFile,
  updateEl,
} = useInputDyjgPage(props, emit, INPUT_DYJG2_SECTION);

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.input-dyjg-page {
  min-height: 680px;
  margin-top: 20px;
  padding: 20px 16px;
  background-color: #ffffff;
}

.input-dyjg-form :deep(.ant-form-item-label) {
  flex: 0 0 200px;
  max-width: 200px;
}

.input-dyjg-supply-type {
  margin-bottom: 8px;
}

.input-dyjg-select {
  width: 280px;
}
</style>
