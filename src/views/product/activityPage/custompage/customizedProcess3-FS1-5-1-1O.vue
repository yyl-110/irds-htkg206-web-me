<template>
  <div class="laminate-page">
    <section class="laminate-page__form">
      <div class="laminate-page__material-grid">
        <div class="laminate-page__material-block">
          <div class="laminate-page__subtitle">材料1：</div>
          <a-form label-align="left" :colon="false" :label-col="formLabelCol">
            <a-form-item v-for="field in material1Fields" :key="field.index" :label="field.label" class="laminate-form-item">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                @input="setSaveBtnEnable()" />
            </a-form-item>
          </a-form>
        </div>
        <div class="laminate-page__material-block">
          <div class="laminate-page__subtitle">材料2：</div>
          <a-form label-align="left" :colon="false" :label-col="formLabelCol">
            <a-form-item v-for="field in material2Fields" :key="field.index" :label="field.label" class="laminate-form-item">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                @input="setSaveBtnEnable()" />
            </a-form-item>
          </a-form>
        </div>
      </div>
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
          <a-button type="primary" danger :disabled="deleteDisabled" @click="handleDelData">
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
import { CalculatorOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { useUserStore } from '@/store/modules/user';
import { runLaminateCalculation } from './FS1_5_1_1_K/calculation';
import {
  LAMINATE_COLUMN_MAP,
  LAMINATE_TABLE_COLUMNS,
  MATERIAL1_FIELDS,
  MATERIAL2_FIELDS,
  type LaminateAntColumn,
} from './FS1_5_1_1_K/tableColumns';
import { extractFs151_1_1OSaveParamValues, loadFs151_1_1OPageParameters } from './FS1_5_1_1_O/loadPageParameters';
import {
  createDefaultFs151_1_1OParameterList,
  getLaminateTableRows,
  NUMERIC_REG,
  type Fs151_1_1OParameterItem,
  type LaminateRow,
} from './FS1_5_1_1_O/parameterDefaults';
import { addLaminateOSegment, deleteLaminateORows } from './FS1_5_1_1_O/rowOperations';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1O' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_1_1OParameterItem[];
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

function cloneParameterList(source: Fs151_1_1OParameterItem[]): Fs151_1_1OParameterItem[] {
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

function createInitialParameterList(): Fs151_1_1OParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_1OParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_1OParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151_1_1OPageParameters,
  });

const tableRows = computed(() => getLaminateTableRows(parameterTempList.value));
const calcDisabled = computed(() => selectedRows.value.length !== 1);
const deleteDisabled = computed(() => selectedRows.value.length <= 0);

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
  addLaminateOSegment(parameterTempList.value, codeNum.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDelData() {
  if (selectedRows.value.length <= 0) return;
  deleteLaminateORows(parameterTempList.value, selectedRows.value);
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
  return extractFs151_1_1OSaveParamValues(parameterTempList.value);
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
  padding: 16px 10px 24px;
  min-height: 650px;
  background: #fff;
  box-sizing: border-box;
}

.laminate-page__title,
.laminate-page__subtitle {
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 12px;
}

.laminate-page__material-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 48px;
  padding: 0 10px;
}

.laminate-page__material-block {
  min-width: 0;
}

.laminate-form-item {
  margin-bottom: 12px;
}

.laminate-form-item :deep(.ant-form-item-label > label) {
  height: auto;
  line-height: 1.5;
  white-space: normal;
}

.laminate-page__table {
  margin-top: 20px;
}

.laminate-page__table-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  padding: 0 10px;
}

.field-input {
  width: 160px;
}

.laminate-table {
  width: 100%;
  padding: 0 10px;
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
