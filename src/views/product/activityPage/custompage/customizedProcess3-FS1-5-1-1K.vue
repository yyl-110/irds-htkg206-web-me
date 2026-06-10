<template>
  <div class="laminate-page">
    <section class="laminate-page__form">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="laminate-page__material-row">
          <span class="laminate-page__subtitle">材料1：</span>
          <div class="laminate-page__material-fields">
            <a-form-item v-for="field in material1Fields" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                @input="setSaveBtnEnable()"
                style="width: 200px" />
            </a-form-item>
          </div>
        </div>
        <div class="laminate-page__material-row">
          <span class="laminate-page__subtitle">材料2：</span>
          <div class="laminate-page__material-fields">
            <a-form-item v-for="field in material2Fields" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                @input="setSaveBtnEnable()"
                style="width: 200px" />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </section>

    <section class="laminate-page__table">
      <div class="laminate-page__table-header">
        <span class="laminate-page__title">夹层筒壁校核计算：</span>
        <a-space :size="12">
          <a-button type="primary" :disabled="calcDisabled" :loading="calculating" @click="handleCalculation">
            <template #icon><CalculatorOutlined /></template>
            计算
          </a-button>
          <a-button type="primary" @click="handleAddData">
            <template #icon><PlusOutlined /></template>
            添加
          </a-button>
          <a-button type="primary" danger :disabled="calcDisabled" @click="handleDelData">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
        </a-space>
      </div>
      <a-table
        :columns="tableColumns"
        :data-source="tableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="tableRowKey"
        :row-selection="rowSelection"
        class="laminate-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolveColumn(column)?.cellMode === 'number'">
            <a-input-number
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
              @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { CalculatorOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { useUserStore } from '@/store/modules/user';
import { runLaminateCalculation } from './FS1_5_1_1_K/calculation';
import { extractFs151_1_1KSaveParamValues, loadFs151_1_1KPageParameters } from './FS1_5_1_1_K/loadPageParameters';
import {
  createDefaultFs151_1_1KParameterList,
  getLaminateTableRows,
  NUMERIC_REG,
  type Fs151_1_1KParameterItem,
  type LaminateRow,
} from './FS1_5_1_1_K/parameterDefaults';
import { addLaminateSegment, deleteLaminateRows } from './FS1_5_1_1_K/rowOperations';
import {
  LAMINATE_COLUMN_MAP,
  LAMINATE_TABLE_COLUMNS,
  MATERIAL1_FIELDS,
  MATERIAL2_FIELDS,
  type LaminateAntColumn,
} from './FS1_5_1_1_K/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1K' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_1_1KParameterItem[];
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
const tabHeight = 400;
const formLabelCol = { style: { width: '260px' } };
const tableColumns = LAMINATE_TABLE_COLUMNS;
const material1Fields = MATERIAL1_FIELDS;
const material2Fields = MATERIAL2_FIELDS;

const codeNum = ref(1);
const calculating = ref(false);
const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<LaminateRow[]>([]);

function cloneParameterList(source: Fs151_1_1KParameterItem[]): Fs151_1_1KParameterItem[] {
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

function createInitialParameterList(): Fs151_1_1KParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_1KParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_1KParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151_1_1KPageParameters,
  });

const tableRows = computed(() => getLaminateTableRows(parameterTempList.value));
const calcDisabled = computed(() => selectedRows.value.length !== 1);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: LaminateRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): LaminateAntColumn | undefined {
  return LAMINATE_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: LaminateRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  const seg = String(record.p0 ?? '');
  const desc = String(record.p1 ?? '');
  return `${seg}-${desc}-${record.delIndex ?? index ?? ''}`;
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
          for (let i = 0; i < colNums; i += 1) {
            if (row[`cellParameterId${i}`] === parameterId) {
              row[`p${i}`] = parameterValue;
            }
          }
        });
      }
    }
  });
}

function handleNumberBlur(record: LaminateRow, field: string, event: FocusEvent) {
  const col = LAMINATE_COLUMN_MAP.get(field);
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (col?.validateNumeric && value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  if (value) {
    record[field] = value;
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  }
}

async function handleCalculation() {
  if (selectedRows.value.length !== 1) return;
  calculating.value = true;
  try {
    const userId = userStore.getUser.id ?? '';
    await runLaminateCalculation(parameterTempList.value, selectedRows.value[0], userId);
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  } catch (err) {
    message.error(err instanceof Error ? err.message : '计算请求失败');
  } finally {
    calculating.value = false;
  }
}

function handleAddData() {
  codeNum.value += 1;
  addLaminateSegment(parameterTempList.value, codeNum.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDelData() {
  if (selectedRows.value.length <= 0) return;
  deleteLaminateRows(parameterTempList.value, selectedRows.value);
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
  return extractFs151_1_1KSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.laminate-page {
  padding: 20px 10px 24px;
  min-height: 650px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.laminate-page__title,
.laminate-page__subtitle {
  font-size: 15px;
  font-weight: 600;
}

.laminate-page__material-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 10px 0;
}

.laminate-page__material-fields {
  flex: 1;
  min-width: 280px;
}

.laminate-page__table {
  margin-top: 16px;
}

.laminate-page__table-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.field-input {
  width: 100px;
}

.laminate-table {
  width: 100%;
}

.laminate-table :deep(.ant-table) {
  font-size: 12px;
}

.laminate-table :deep(.ant-table-thead > tr > th),
.laminate-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: center;
}

.table-cell-input {
  width: 100%;
}
</style>
