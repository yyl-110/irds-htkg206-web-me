<template>
  <DyjgCabinetPanel
    :title="`${DYJG1_CONFIG.label}：`"
    :parameter-temp-list="parameterTempList"
    :elect-file="electFile"
    :env-file="envFile"
    :table-data="tableData"
    @set-save-btn-enable="setSaveBtnEnable()"
    @sync-files="syncFiles"
    @down-file="downFile"
    @init-data="initData" />
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import DyjgCabinetPanel from './Process7-page5-Dyjg/DyjgCabinetPanel.vue';
import { ELECT_FILE_INDEX, ENV_FILE_INDEX, TABLE_INDEX } from './Process7-page5-Dyjg/types';
import {
  applyDyjgSaveBtnEnable,
  getDownloadUrl,
  loadDyjgTableData,
  parseFileParam,
} from './Process7-page5-Dyjg/rowOperations';
import {
  DYJG1_CONFIG,
  cloneDyjg1ParameterList,
  initCustomizedProcessPage7Data5_Dyjg1,
  type DyjgParameterItem,
} from './Process7-page5-Dyjg1/parameterDefaults';

defineOptions({ name: 'customizedProcess7-page5-Dyjg1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    taskid?: string;
    parameterTempList?: DyjgParameterItem[];
  }>(),
  {
    width: 1000,
    modalFlag: false,
    pageid: '',
    taskid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();
const route = useRoute();
function createInitialParameterList(): DyjgParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_Dyjg1(props.pageid);
  }
  return cloneDyjg1ParameterList(props.parameterTempList);
}

const parameterTempList = ref<DyjgParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const tableData = computed(() => parameterTempList.value[TABLE_INDEX]?.tableMap?.rowData ?? []);

const electFile = reactive({ fileName: '', fileId: '' });
const envFile = reactive({ fileName: '', fileId: '' });

function syncFiles() {
  Object.assign(electFile, parseFileParam(String(parameterTempList.value[ELECT_FILE_INDEX]?.defaultValue ?? '')));
  Object.assign(envFile, parseFileParam(String(parameterTempList.value[ENV_FILE_INDEX]?.defaultValue ?? '')));
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyDyjgSaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

async function initData() {
  const result = await loadDyjgTableData(parameterTempList.value, {
    taskid: props.taskid,
    pageid: props.pageid,
    tableNum: DYJG1_CONFIG.tableNum,
  });
  if (!result.ok) {
    message.info(result.message);
    return;
  }
  setSaveBtnEnable();
}

function downFile(type: '1' | '2') {
  const fileId = type === '1' ? electFile.fileId : envFile.fileId;
  if (!fileId) return;
  window.location.href = getDownloadUrl(fileId);
}

function updateEl() {
  nextTick(() => {

    syncFiles();
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

onMounted(() => {
  if (props.parameterTempList?.length) {
    updateEl();
  }
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
mountWithTaskParamMap(updateEl);
</script>