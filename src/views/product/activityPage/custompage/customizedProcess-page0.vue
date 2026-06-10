<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="section-title">任务输入数据</div>

        <a-form-item label="任务ID：" class="task-id-item">
          <a-input
            v-model:value="parameterTempList[0].defaultValue"
            class="task-id-input"
            allow-clear
            placeholder="请输入..."
            @input="setSaveBtnEnable()" />
          <a-button type="primary" @click="readData">
            <template #icon><ReadOutlined /></template>
            读取
          </a-button>
          <a-button @click="clearData">
            <template #icon><ClearOutlined /></template>
            清空
          </a-button>
        </a-form-item>

        <div class="table-block">
          <div class="table-block__title">基本数据：</div>
          <a-table
            :columns="baseParamColumns"
            :data-source="parameterTempList[1].tableMap?.rowData ?? []"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ y: 150, x: 1000 }"
            :row-key="tableRowKey" />
        </div>

        <div class="table-block">
          <div class="table-block__title">工作参数：</div>
          <a-table
            :columns="workParamColumns"
            :data-source="parameterTempList[2].tableMap?.rowData ?? []"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ y: 120, x: 1000 }"
            :row-key="tableRowKey" />
        </div>

        <div class="table-row-pair">
          <div class="table-block table-block--narrow">
            <div class="table-block__title">通讯形式：</div>
            <a-table
              :columns="commParamColumns"
              :data-source="parameterTempList[3].tableMap?.rowData ?? []"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ y: 120 }"
              :row-key="tableRowKey" />
          </div>

          <div class="table-block table-block--wide">
            <div class="table-block__title">幅相参数：</div>
            <a-table
              :columns="fuxiangParamColumns"
              :data-source="parameterTempList[4].tableMap?.rowData ?? []"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ y: 120 }"
              :row-key="tableRowKey" />
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { ClearOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { isValid, readTDDPInputData } from '@/api/flowData/flowData';
import { useUserStore } from '@/store/modules/user';
import { createDefaultPage0ParameterList, type Page0ParameterItem } from './page0/parameterDefaults';
import {
  BASE_PARAMS_COLUMNS,
  COMM_PARAMS_COLUMNS,
  FUXIANG_PARAMS_COLUMNS,
  toAntTableColumns,
  WORK_PARAMS_COLUMNS,
} from './page0/tableColumns';
import { loadPage0PageParameters } from './page0/loadPageParameters';
import { applyTddpInputToParameters, clearPage0TableData, type TddpKeyValue } from './page0/tddpData';

defineOptions({ name: 'rx-customizedProcess-page0' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page0ParameterItem[];
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

const userStore = useUserStore();
const formLabelCol = { style: { width: '120px' } };

const baseParamColumns = computed(() => toAntTableColumns(BASE_PARAMS_COLUMNS));
const workParamColumns = computed(() => toAntTableColumns(WORK_PARAMS_COLUMNS));
const commParamColumns = computed(() => toAntTableColumns(COMM_PARAMS_COLUMNS));
const fuxiangParamColumns = computed(() => toAntTableColumns(FUXIANG_PARAMS_COLUMNS));

const authtoken = ref('');
const tddpInputData = ref<TddpKeyValue[]>([]);

function cloneParameterList(source: Page0ParameterItem[]) {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: Array.isArray(item.tableMap.rowData) ? item.tableMap.rowData.map(row => ({ ...row })) : [],
        }
      : item.tableMap,
  }));
}

function createInitialParameterList(): Page0ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage0ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page0ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage0PageParameters,
  });


function tableRowKey(record: Record<string, string>, index?: number) {
  return String(record?.p0 ?? index ?? 0);
}


function resetTableData() {
  clearPage0TableData(parameterTempList.value);
  tddpInputData.value = [];
  authtoken.value = '';
  parameterTempList.value = cloneParameterList(parameterTempList.value);
}

function clearData() {
  if (parameterTempList.value[0]) {
    parameterTempList.value[0].defaultValue = '';
  }
  resetTableData();
  setSaveBtnEnable();
  message.success('已清空');
}

async function readData() {
  if (!isValid(parameterTempList.value[0]?.defaultValue)) {
    message.error('请填写任务ID');
    return;
  }
  resetTableData();
  const data = {
    userid: userStore.getUser.id,
    entityId: parameterTempList.value[0].defaultValue,
    authtoken: authtoken.value,
  };
  try {
    const response: any = await readTDDPInputData(data);
    if (response == null || response.code != '0' || response.data == null || response.data.result != true) {
      message.error('读取任务输入数据失败');
      return;
    }
    message.success('读取任务输入数据成功');
    authtoken.value = String(response.data.authtoken ?? '');
    tddpInputData.value = Array.isArray(response.data.data) ? response.data.data : [];
    applyTddpInputToParameters(parameterTempList.value, tddpInputData.value);
    parameterTempList.value = cloneParameterList(parameterTempList.value);
    setSaveBtnEnable();
  } catch {
    message.error('读取任务输入数据失败');
  }
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
    } else if (item.tableMap && Number(item.tableMap.colNums) > 0) {
      const colNums = Number(item.tableMap.colNums);
      item.tableMap.rowData?.forEach(row => {
        for (let i = 0; i < colNums; i++) {
          if (row[`cellParameterId${i}`] === parameterId) {
            row[`p${i}`] = parameterValue;
          }
        }
      });
    }
  });
}

function getCurrentSaveParamValues() {
  return parameterTempList.value
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

function getCurrentTableSavePayload() {
  return parameterTempList.value
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => ({
      tableNum: String(item.tableNum ?? ''),
      tableName: String(item.tableName ?? ''),
      rowData: item.tableMap?.rowData ?? [],
      colStr: item.tableMap?.colStr ?? [],
    }))
    .filter(row => row.tableNum);
}

async function initPageData() {
  await loadPageParametersIfNeeded();
  await nextTick();
}

defineExpose({
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

onMounted(() => {
  void initPageData();
});
</script>

<style scoped>
.layout-wrapper {
  padding: 12px 16px 24px;
  background: #ffffff;
  min-height: 680px;
}

.layout-content {
  background: #ffffff;
}

.section-title {
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.task-id-item :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-id-input {
  width: 200px;
}

.table-block {
  margin-bottom: 20px;
}

.table-block__title {
  margin-bottom: 8px;
  font-weight: 500;
}

.table-row-pair {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.table-block--narrow {
  flex: 0 0 400px;
  max-width: 100%;
}

.table-block--wide {
  flex: 1 1 580px;
  min-width: 320px;
}

:deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
</style>
