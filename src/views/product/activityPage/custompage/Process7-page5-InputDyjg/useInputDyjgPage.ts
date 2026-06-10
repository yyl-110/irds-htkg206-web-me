import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { useCustomPageTaskParamMap } from '../_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { baseUrl, ifGateway } from '@/views/product/activityPage/custompage/_shared/utils/legacyEnv';
import { globaluserId } from '@/views/product/activityPage/custompage/_shared/utils/legacyUser';
import { applyProcess7SaveBtnEnable } from '../shared/process7/setSaveBtnEnable';
import type { CabinetSectionConfig } from '../Process7-page5-5/types';
import {
  applyUploadResult,
  confirmOutputRows,
  getDownloadUrl,
  parseFileParam,
  validateOutputRouteCount,
} from '../Process7-page5-5/rowOperations';
import {
  cloneParameterList,
  initCustomizedProcessPage7Data5_InputDyjg,
  type Page5_5ParameterItem,
} from './parameterDefaults';

export function useInputDyjgPage(
  props: { pageid?: string; parameterTempList?: Page5_5ParameterItem[] },
  emit: (event: 'setSaveBtnEnable', value: boolean) => void,
  section: CabinetSectionConfig,
) {
  function createInitialParameterList(): Page5_5ParameterItem[] {
    if (!props.parameterTempList?.length) {
      return initCustomizedProcessPage7Data5_InputDyjg(props.pageid ?? '');
    }
    return cloneParameterList(props.parameterTempList);
  }

  const parameterTempList = ref<Page5_5ParameterItem[]>(createInitialParameterList());
  const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
    props,
    parameterTempList,
    cloneItem: cloneParameterList,
  });
  const supplyType = computed(() => String(parameterTempList.value[0]?.defaultValue ?? ''));
  const actionUrl = ref('');
  const loginUserId = { userId: globaluserId() };

  const fileState = reactive({
    elect: { fileName: '', fileId: '' },
    env: { fileName: '', fileId: '' },
  });

  function syncFileStates() {
    const elect = parseFileParam(String(parameterTempList.value[section.electFileParamIndex]?.defaultValue ?? ''));
    const env = parseFileParam(String(parameterTempList.value[section.envFileParamIndex]?.defaultValue ?? ''));
    fileState.elect = elect;
    fileState.env = env;
  }

  function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
    emit('setSaveBtnEnable', true);
    applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
  }

  function onConfirmOutput() {
    confirmOutputRows(parameterTempList.value, section);
    setSaveBtnEnable();
  }

  function onChangeOutputRoute() {
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
    kind: 'elect' | 'env',
    response: { data?: { id?: string; oldFileName?: string } },
  ) {
    if (!response.data?.id) return;
    message.info('上传成功');
    const paramIndex = kind === 'elect' ? section.electFileParamIndex : section.envFileParamIndex;
    const parsed = applyUploadResult(
      parameterTempList.value,
      paramIndex,
      response.data.oldFileName ?? '',
      response.data.id,
    );
    if (kind === 'elect') {
      fileState.elect = parsed;
    } else {
      fileState.env = parsed;
    }
    setSaveBtnEnable();
  }

  function onDownloadFile(kind: 'elect' | 'env') {
    const fileId = kind === 'elect' ? fileState.elect.fileId : fileState.env.fileId;
    if (!fileId) return;
    window.location.href = getDownloadUrl(fileId, ifGateway, baseUrl);
  }

  function updateEl() {
    nextTick(() => {
      syncFileStates();
      applyTaskParamMapToList();
    });
  }

  setupParameterWatch(updateEl);
  mountWithTaskParamMap(updateEl);

  onMounted(() => {
    actionUrl.value = ifGateway
      ? `${baseUrl}/base-server/fileManagerController/upload.json`
      : `${baseUrl}/fileManagerController/upload.json`;
    if (!props.parameterTempList?.length) {
      syncFileStates();
    }
  });

  return {
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
  };
}
