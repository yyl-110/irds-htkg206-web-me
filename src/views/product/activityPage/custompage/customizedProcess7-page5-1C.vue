<template>
  <div>
    <div class="layout-wrapper" style="padding: 0 10px; min-height: 680px; background-color: #ffffff; margin-top: 20px">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div style="width: auto; font-weight: 600; padding-left: 10px">设计输入：</div>
          <div style="width: 99%; float: left">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <div style="width: 30%; height: 100%; float: left">
                <a-form-item label="柜体最大高尺寸：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramx1" style="display: none" />
                  <a-input v-model:value="parameterTempList[0].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="柜体最大宽：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramx2" style="display: none" />
                  <a-input v-model:value="parameterTempList[1].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="输出路数：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramx4" style="display: none" />
                  <a-input v-model:value="parameterTempList[3].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
              </div>
              <div style="width: 50%; height: 100%; float: left; padding-left: 60px">
                <a-form-item label="柜体最大深：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramx5" style="display: none" />
                  <a-input v-model:value="parameterTempList[4].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="额定输入电压(V)：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramx6" style="display: none" />
                  <a-input v-model:value="parameterTempList[5].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="输入电压范围(V)：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramx8" style="display: none" />
                  <a-input v-model:value="parameterTempList[7].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
              </div>
            </section>
          </div>
        </a-form>
      </div>

      <div class="selectBox">
        <div style="width: auto; font-size: 15px; font-weight: 600; padding-left: 10px">
          选择组合插箱：
          <a-button type="primary" class="btnSty" style="margin-bottom: 10px; margin-left: 20px" @click="browserRowData">
            浏览
          </a-button>
          <a-button type="primary" class="btnSty" style="margin-bottom: 10px; margin-left: 20px" @click="calculation">
            计算
          </a-button>
          <a-button type="primary" class="btnSty" style="margin-bottom: 10px; margin-left: 20px" @click="addrowData">
            添加行
          </a-button>
          <a-button
            danger
            class="btnSty"
            style="margin-bottom: 10px; margin-left: 20px"
            :disabled="deleteDisabled"
            @click="deleteRow">
            删除行
          </a-button>
        </div>
        <div style="width: 100%; min-height: 200px">
          <a-table
            :columns="TABLE_COLUMNS"
            :data-source="tableData"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: 1270 }"
            :row-key="tableRowKey"
            :row-selection="rowSelection"
            class="page5-table">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'p1'">
                <a-select
                  v-model:value="record.p1"
                  :options="TYPE_OPTIONS"
                  style="width: 100%"
                  @change="onTypeChange(record, index)" />
              </template>
              <template v-else-if="isEditableField(column.dataIndex)">
                <a-input
                  v-model:value="record[String(column.dataIndex)]"
                  class="table-cell-input"
                  :disabled="isBrowseType(record.p1) && column.dataIndex !== 'p10'"
                  @input="setSaveBtnEnable()"
                  @blur="onCellBlur(record, index, String(column.dataIndex), $event)" />
              </template>
            </template>
          </a-table>
        </div>
      </div>

      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div style="width: 99%">
            <section
              style="
                width: 100%;
                min-height: calc(100vh - 700px);
                background-color: #ffffff;
                padding-top: 20px;
                margin-left: 15px;
              ">
              <div style="width: 44%; height: 100%; float: left">
                <a-form-item label="插箱高度（U）和：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramz1" style="display: none" />
                  <a-input v-model:value="parameterTempList[9].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="插箱高度和：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramz2" style="display: none" />
                  <a-input v-model:value="parameterTempList[10].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="插箱最大深度：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramz3" style="display: none" />
                  <a-input v-model:value="parameterTempList[11].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="插箱最大宽：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramz4" style="display: none" />
                  <a-input v-model:value="parameterTempList[12].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
                <a-form-item label="输出电流A(求和)：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramz5" style="display: none" />
                  <a-input v-model:value="parameterTempList[13].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
              </div>
            </section>
          </div>
        </a-form>
      </div>
    </div>

    <ModuleDataSelect
      ref="moduleDataSelectRef"
      :module-data-select="moduleDataFlag"
      :mcategoryid="modulecategoryid"
      @moduleOk="moduleOk"
      @moduleCancel="moduleCancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import ModuleDataSelect from '@/views/product/activityPage/components/module-data-select.vue';
import { getFlowModuleid, isValid } from '@/api/flowData/flowData';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import { TABLE_COLUMNS, TYPE_OPTIONS } from './Process7-page5-1/tableColumns';
import {
  cloneParameterList,
  initCustomizedProcessPage7Data5_1C,
  TABLE_NUM,
  type ChassisTableRow,
  type Page5_1ParameterItem,
} from './Process7-page5-1C/parameterDefaults';
import {
  addTableRow,
  applyModuleBrowseResult,
  deleteTableRows,
  isBrowseType,
  NUMERIC_REG,
  runCalculation,
  type ModuleOkPayload,
} from './Process7-page5-1/rowOperations';

defineOptions({ name: 'customizedProcess7-page5-1C' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page5_1ParameterItem[];
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

function createInitialParameterList(): Page5_1ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_1C(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page5_1ParameterItem[]>(createInitialParameterList());
const tableData = computed(() => parameterTempList.value[8]?.tableMap?.rowData ?? []);

const paramx1 = ref('');
const paramx2 = ref('');
const paramx4 = ref('');
const paramx5 = ref('');
const paramx6 = ref('');
const paramx8 = ref('');
const paramz1 = ref('');
const paramz2 = ref('');
const paramz3 = ref('');
const paramz4 = ref('');
const paramz5 = ref('');

const selectList = ref<ChassisTableRow[]>([]);
const selectedRowKeys = ref<Key[]>([]);
const moduleDataFlag = ref(false);
const modulecategoryid = ref('');
const selectRow = ref(0);

const moduleDataSelectRef = ref<{ initData: (categoryId: string, pageStr: string) => void } | null>(null);

const deleteDisabled = computed(() => selectList.value.length <= 0);

const EDITABLE_FIELDS = new Set(['p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10']);

function isEditableField(dataIndex: unknown) {
  return EDITABLE_FIELDS.has(String(dataIndex));
}

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (_keys: Key[], rows: ChassisTableRow[]) => {
    selectList.value = rows;
    selectedRowKeys.value = rows.map((row, idx) => tableRowKey(row, idx));
  },
}));

function tableRowKey(record: ChassisTableRow, index: number) {
  if (record.delIndex != null && record.delIndex !== '') return String(record.delIndex);
  if (record.id != null) return String(record.id);
  return String(record.p0 ?? index);
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function setLocalData() {
  paramx1.value = String(parameterTempList.value[0].defaultValue ?? '');
  paramx2.value = String(parameterTempList.value[1].defaultValue ?? '');
  paramx4.value = String(parameterTempList.value[3].defaultValue ?? '');
  paramx5.value = String(parameterTempList.value[4].defaultValue ?? '');
  paramx6.value = String(parameterTempList.value[5].defaultValue ?? '');
  paramx8.value = String(parameterTempList.value[7].defaultValue ?? '');
  paramz1.value = String(parameterTempList.value[9].defaultValue ?? '');
  paramz2.value = String(parameterTempList.value[10].defaultValue ?? '');
  paramz3.value = String(parameterTempList.value[11].defaultValue ?? '');
  paramz4.value = String(parameterTempList.value[12].defaultValue ?? '');
  paramz5.value = String(parameterTempList.value[13].defaultValue ?? '');
}

function resetParameterTempList() {
  parameterTempList.value[0].defaultValue = paramx1.value;
  parameterTempList.value[1].defaultValue = paramx2.value;
  parameterTempList.value[3].defaultValue = paramx4.value;
  parameterTempList.value[4].defaultValue = paramx5.value;
  parameterTempList.value[5].defaultValue = paramx6.value;
  parameterTempList.value[7].defaultValue = paramx8.value;
  const rows = parameterTempList.value[8]?.tableMap?.rowData ?? [];
  parameterTempList.value[8].tableMap!.rowNums = rows.length;
  parameterTempList.value[8].tableMap!.colStr = [
    'p0',
    'p1',
    'p2',
    'p3',
    'p4',
    'p5',
    'p6',
    'p7',
    'p8',
    'p9',
    'p10',
    'p11',
    'p12',
  ];
}

function onTypeChange(record: ChassisTableRow, index: number) {
  if (record.p1 === 2 || record.p1 === '2') {
    record.p2 = '';
  }
  parameterTempList.value[8].tableMap!.rowData![index] = { ...record };
  setSaveBtnEnable();
}

function onCellBlur(record: ChassisTableRow, index: number, field: string, event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (field === 'p3' && !value) {
    message.error('请输入名称');
    return;
  }
  if (field === 'p10' && !value) {
    message.error('请输入备注');
    return;
  }
  if (['p4', 'p5', 'p6', 'p7', 'p8', 'p9'].includes(field) && value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  parameterTempList.value[8].tableMap!.rowData![index] = { ...record };
}

function addrowData() {
  addTableRow(parameterTempList.value);
  setLocalData();
  resetParameterTempList();
  setSaveBtnEnable();
}

function deleteRow() {
  setLocalData();
  deleteTableRows(parameterTempList.value, selectList.value);
  selectList.value = [];
  selectedRowKeys.value = [];
  resetParameterTempList();
  setSaveBtnEnable();
}

function calculation() {
  runCalculation(parameterTempList.value);
  setLocalData();
}

function updateEl() {
  nextTick(() => {
    void 0;
  });
}

async function browserRowData() {
  if (!selectList.value.length) {
    message.info('请选择浏览行');
    return;
  }
  if (selectList.value.length !== 1) {
    message.info('请只选择一个浏览行');
    return;
  }
  if (!isBrowseType(selectList.value[0].p1)) {
    message.info('请选择浏览行.');
    return;
  }

  if (!isValid(modulecategoryid.value)) {
    const response: { code?: string; data?: { data?: string } } = await getFlowModuleid({ moduleName: '插箱(C)' });
    if (!response || response.code !== '0') {
      message.info('获取模型库id失败');
      return;
    }
    modulecategoryid.value = response.data?.data ?? '';
  }

  const rowData = parameterTempList.value[8].tableMap?.rowData ?? [];
  for (let i = 0; i < rowData.length; i += 1) {
    if (selectList.value[0].p0 == rowData[i].p0) {
      selectRow.value = i;
      break;
    }
  }

  moduleDataSelectRef.value?.initData(modulecategoryid.value, '');
  moduleDataFlag.value = true;
}

function moduleOk(payload: ModuleOkPayload) {
  applyModuleBrowseResult(parameterTempList.value, selectRow.value, payload, TABLE_NUM);
  moduleDataFlag.value = false;
  setSaveBtnEnable();
}

function moduleCancel() {
  moduleDataFlag.value = false;
}

onMounted(() => {
  if (props.parameterTempList?.length) {
    setLocalData();
  }
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.selectBox {
  width: 100%;
  height: 100%;
  float: left;
  padding-top: 10px;
}
.layout-content {
  background: #ffffff;
}
.page5-table {
  width: 100%;
}
.page5-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
.table-cell-input {
  width: 100%;
  text-align: center;
}
</style>
