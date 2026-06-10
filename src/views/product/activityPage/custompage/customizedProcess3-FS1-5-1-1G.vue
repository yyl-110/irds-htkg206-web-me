<template>
  <div class="material-page">
    <section class="material-page__header">
      <div class="material-page__section-header">
        <span class="material-page__title">材料设置：</span>

        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>

          更新数据
        </a-button>
      </div>

      <div class="material-page__actions">
        <a-space :size="12">
          <a-button type="primary" @click="handleBrowseMaterial">
            <template #icon><FolderOpenOutlined /></template>
            浏览
          </a-button>
          <a-button type="primary" danger :disabled="deleteDisabled" @click="handleDelete">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
        </a-space>
      </div>
    </section>

    <section class="material-page__table">
      <a-table
        :columns="tableColumns"
        :data-source="tableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="tableRowKey"
        :row-selection="rowSelection"
        class="material-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>

          <template v-else-if="resolveColumn(column)?.cellMode === 'editable'">
            <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>

    <ModuleDataClSelect
      ref="moduleDataSelectRef"
      :moduleDataSelect="moduleDataClFlag"
      :mcategoryid="moduleCategoryId"
      @moduleOk="handleModuleOk"
      @moduleCancel="handleModuleCancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';

import { message } from 'ant-design-vue';

import { FolderOpenOutlined, SyncOutlined } from '@ant-design/icons-vue';

import type { Key } from 'ant-design-vue/es/table/interface';

import { EpcIcon } from '@/components/icon/EpcIcon';

import ModuleDataClSelect from './FS1_5_1_1G/moduleDataClSelect.vue';

import { applyFs151_1GInitData } from './FS1_5_1_1G/initData';

import { extractFs151_1GSaveParamValues, loadFs151_1GPageParameters } from './FS1_5_1_1G/loadPageParameters';

import {
  applyMaterialProperties,
  createDefaultFs151_1GParameterList,
  deleteSelectedMaterialRows,
  getMaterialTableRows,
  MATERIAL_CATEGORY_ID,
  setMaterialTableRows,
  type Fs151_1GParameterItem,
  type MaterialSettingRow,
} from './FS1_5_1_1G/parameterDefaults';

import { MATERIAL_COLUMN_MAP, MATERIAL_TABLE_COLUMNS, type MaterialAntColumn } from './FS1_5_1_1G/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1G' });

interface ModuleDataSelectExpose {
  initData: (categoryId: string, pageStr: string) => void;
}

interface ModuleOkPayload {
  arr?: Array<{ name?: string; val?: string }>;
}

const props = withDefaults(
  defineProps<{
    width?: number;

    modalFlag?: boolean;

    pageid?: string;

    parameterTempList?: Fs151_1GParameterItem[];
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

const tabHeight = 530;

const tableColumns = MATERIAL_TABLE_COLUMNS;

const moduleCategoryId = '';

const moduleDataClFlag = ref(false);

const moduleDataSelectRef = ref<ModuleDataSelectExpose | null>(null);

const selectedRowKeys = ref<Key[]>([]);

const selectedRows = ref<MaterialSettingRow[]>([]);

function cloneParameterList(source: Fs151_1GParameterItem[]): Fs151_1GParameterItem[] {
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

function createInitialParameterList(): Fs151_1GParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1GParameterList(props.pageid);
  }

  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1GParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151_1GPageParameters,
  });



const tableRows = computed(() => getMaterialTableRows(parameterTempList.value));

const deleteDisabled = computed(() => selectedRows.value.length <= 0);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,

  onChange: (keys: Key[], rows: MaterialSettingRow[]) => {
    selectedRowKeys.value = keys;

    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): MaterialAntColumn | undefined {
  return MATERIAL_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: MaterialSettingRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);

  return String(record.delIndex ?? record.p0 ?? index ?? '');
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

function handleInitData() {
  const ok = applyFs151_1GInitData(parameterTempList.value);

  parameterTempList.value = [...parameterTempList.value];

  if (!ok) {
    message.warning('未能从流程上下文读取数据，请确认前置页面 FS1-5-1-1F 已保存');

    return;
  }

  setSaveBtnEnable();
}

function handleBrowseMaterial() {
  moduleDataSelectRef.value?.initData(MATERIAL_CATEGORY_ID, '');

  moduleDataClFlag.value = true;
}

function handleModuleOk(payload: ModuleOkPayload) {
  moduleDataClFlag.value = false;

  applyMaterialProperties(parameterTempList.value, payload?.arr ?? []);

  parameterTempList.value = [...parameterTempList.value];

  setSaveBtnEnable();
}

function handleModuleCancel() {
  moduleDataClFlag.value = false;
}

function handleDelete() {
  const rows = deleteSelectedMaterialRows(getMaterialTableRows(parameterTempList.value), selectedRows.value);

  setMaterialTableRows(parameterTempList.value, rows);

  selectedRowKeys.value = [];

  selectedRows.value = [];

  parameterTempList.value = [...parameterTempList.value];

  setSaveBtnEnable();
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractFs151_1GSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,

  getCurrentSaveParamValues,

  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.material-page {
  padding: 0 10px 24px;

  min-height: 680px;

  background: #fff;

  box-sizing: border-box;

  text-align: left;
}

.material-page__title {
  font-size: 15px;

  font-weight: 600;
}

.material-page__section-header {
  display: flex;

  align-items: center;

  gap: 20px;

  padding: 10px 0 0 10px;
}

.material-page__actions {
  padding: 10px 0 0 10px;
}

.material-page__table {
  padding-top: 10px;
}

.material-table {
  width: 100%;
}

.material-table :deep(.ant-table) {
  font-size: 12px;
}

.material-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;

  text-align: left;

  background: #fafafa;
}

.material-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;

  text-align: left;
}

.table-cell-input {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: left;
}
</style>
