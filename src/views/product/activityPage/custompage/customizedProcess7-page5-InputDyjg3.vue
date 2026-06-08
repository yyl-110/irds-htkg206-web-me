<template>
  <div>
    <div class="layout-wrapper" style="padding: 0 10px; min-height: 680px; background-color: #ffffff; margin-top: 20px">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div style="width: 99%; float: left">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <a-form-item label="供配电体质确定：" :label-col="{ style: { width: '160px' } }">
                <a-select
                  v-model:value="parameterTempList[0].defaultValue"
                  style="width: 190px"
                  @change="setSaveBtnEnable()">
                  <a-select-option
                    v-for="item in parameterTempList[0].selectStrVal ?? []"
                    :key="item.label"
                    :value="item.label">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <CabinetSection
                :section="INPUT_DYJG3_SECTION"
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
            </section>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CabinetSection from './Process7-page5-5/CabinetSection.vue';
import { INPUT_DYJG3_SECTION } from './Process7-page5-InputDyjg/config';
import { useInputDyjgPage } from './Process7-page5-InputDyjg/useInputDyjgPage';
import type { Page5_5ParameterItem } from './Process7-page5-InputDyjg/parameterDefaults';

defineOptions({ name: 'customizedProcess7-page5-InputDyjg3' });

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
} = useInputDyjgPage(props, emit, INPUT_DYJG3_SECTION);

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
