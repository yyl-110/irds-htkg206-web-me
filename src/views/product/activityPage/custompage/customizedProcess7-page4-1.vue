<template>
  <div>
    <div class="layout-wrapper" style="padding: 0 10px; height: 680px; background-color: #ffffff">
      <div class="layout-header">
        <div style="width: 100%; padding-left: 10px">
          供配电机制确定：
          <a-input v-model:value="param1" style="width: 100px; display: none" allow-clear disabled />
          <a-input
            v-model:value="parameterTempList[0].defaultValue"
            placeholder="请输入..."
            style="width: 200px"
            allow-clear
            disabled />
          <a-button type="primary" class="btnSty" style="margin-left: 10px" @click="initData">更新数据</a-button>
        </div>

        <div
          v-show="pageType === 0"
          style="width: 100%; font-weight: 600; padding-left: 10px; padding-top: 10px; float: left">
          <a-form label-align="left" :colon="false">
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="柴油发电机组:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input v-model:value="param2" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[1].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
              <a-form-item
                label="低压电池:"
                :label-col="{ style: { width: '70px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 30px">
                <a-input v-model:value="param3" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[2].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
              <a-form-item
                label="取力发电机组:"
                :label-col="{ style: { width: '90px' } }"
                style="float: left; margin-left: 30px; margin-bottom: 10px">
                <a-input v-model:value="param4" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[3].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
            </div>
          </a-form>
        </div>

        <div
          v-show="pageType === 1"
          style="width: 100%; font-weight: 600; padding-left: 10px; padding-top: 10px; float: left">
          <a-form label-align="left" :colon="false">
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="柴油发电机组:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input v-model:value="param5" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[4].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
              <a-form-item
                label="取力发电机组:"
                :label-col="{ style: { width: '90px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 30px">
                <a-input v-model:value="param6" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[5].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
              <a-form-item
                label="高压电池:"
                :label-col="{ style: { width: '70px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 30px">
                <a-input v-model:value="param7" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[6].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
            </div>
          </a-form>
        </div>

        <div
          v-show="pageType === 2"
          style="width: 100%; font-weight: 600; padding-left: 10px; padding-top: 10px; float: left">
          <a-form label-align="left" :colon="false">
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="柴油发电机组:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input v-model:value="param8" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[7].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
              <a-form-item
                label="外接市电:"
                :label-col="{ style: { width: '70px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 30px">
                <a-input v-model:value="param9" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[8].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
              <a-form-item
                label="整流电源:"
                :label-col="{ style: { width: '70px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 30px">
                <a-input v-model:value="param10" style="width: 100px; display: none" allow-clear disabled />
                <a-input
                  v-model:value="parameterTempList[9].defaultValue"
                  placeholder="请输入..."
                  style="width: 80px"
                  allow-clear
                  disabled />
              </a-form-item>
            </div>
          </a-form>
        </div>

        <div style="width: 650px; height: 300px; float: left; margin-top: 10px">
          <img :src="imgurl" style="width: 100%; height: 100%" alt="原理图" />
        </div>

        <div class="selectBox">
          <div style="width: auto; font-size: 15px; font-weight: 600; padding-left: 10px">产品组成：</div>
          <div>
            <a-button type="primary" @click="addColumns">
              <template #icon><PlusOutlined /></template>添加行</a-button
            >
            <a-button danger style="margin-left: 10px" @click="delColumns">
              <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
              删除行</a-button
            >
          </div>
          <div style="width: 100%; min-height: 330px">
            <a-table
              :columns="PRODUCT_TABLE_COLUMNS"
              :data-source="tableData"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ y: 320 }"
              :row-key="tableRowKey"
              :row-selection="rowSelection"
              class="page4-table">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'p1'">
                  <a-input
                    v-if="record.p0 === ''"
                    v-model:value="record.p2"
                    class="table-cell-input"
                    @blur="onNameBlur(record, index)" />
                  <span v-else>{{ record.p1 }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'p2'">
                  <a-input v-model:value="record.p2" class="table-cell-input" @blur="onRemarkBlur(record, index)" />
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import defaultDiagram from '@/assets/images/viz-schematic-placeholder.png';
import { getFlowParameterList } from './shared/flowContext';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import { PRODUCT_TABLE_COLUMNS } from './Process7-page4-1/customizedProcess7-page4-1.columns';
import {
  cloneParameterList,
  initCustomizedProcessPage7Data4_1,
  type Page4_1ParameterItem,
} from './Process7-page4-1/parameterDefaults';
import { applyDiagramState, type PageType } from './Process7-page4-1/queryImg';

type TableRow = Record<string, string | number | undefined>;

defineOptions({ name: 'customizedProcess7-page4-1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page4_1ParameterItem[];
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

function createInitialParameterList(): Page4_1ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data4_1(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page4_1ParameterItem[]>(createInitialParameterList());

const tableData = computed(() => parameterTempList.value[10]?.tableMap?.rowData ?? []);

const param1 = ref<string | number>(0);
const param2 = ref('');
const param3 = ref('');
const param4 = ref('');
const param5 = ref('');
const param6 = ref('');
const param7 = ref('');
const param8 = ref('');
const param9 = ref('');
const param10 = ref('');
const selectList = ref<TableRow[]>([]);
const selectedRowKeys = ref<(string | number)[]>([]);
const imgIndex = ref('1');
const imgurl = ref(defaultDiagram);
const pageType = ref<PageType>(0);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (_keys: (string | number)[], rows: TableRow[]) => {
    selectList.value = rows;
    selectedRowKeys.value = rows.map((row, idx) => tableRowKey(row, idx));
  },
}));

function tableRowKey(record: TableRow, index: number) {
  if (record.delIndex != null && record.delIndex !== '') return String(record.delIndex);
  if (record.p0 != null && record.p0 !== '') return `fixed-${record.p0}`;
  return `custom-${index}`;
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function queryImg() {
  applyDiagramState(parameterTempList, pageType, imgIndex, imgurl, defaultDiagram);
  const rows = parameterTempList.value[10]?.tableMap?.rowData ?? [];
  parameterTempList.value[10].tableMap!.rowData = rows.map((row, index) => ({
    ...row,
    delIndex: row.delIndex ?? index,
  }));
}

function initData() {
  for (let i = 1; i < 10; i += 1) {
    parameterTempList.value[i].defaultValue = '';
  }
  getFlowParameterList().forEach(item => {
    if (parameterTempList.value[1].defaultValue === '' && item.paramnum === 'DY1_1_5_CYFDJZ_Y') {
      parameterTempList.value[1].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[2].defaultValue === '' && item.paramnum === 'DY1_1_7_DYDC_Y') {
      parameterTempList.value[2].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[3].defaultValue === '' && item.paramnum === 'DY1_1_6_QLFDJZ_Y') {
      parameterTempList.value[3].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[4].defaultValue === '' && item.paramnum === 'DY1_1_5_CYFDJZ_Y') {
      parameterTempList.value[4].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[5].defaultValue === '' && item.paramnum === 'DY1_1_6_QLFDJZ_Y') {
      parameterTempList.value[5].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[6].defaultValue === '' && item.paramnum === 'DY1_1_7_GYDC_Y') {
      parameterTempList.value[6].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[7].defaultValue === '' && item.paramnum === 'DY1_1_5_CYFDJZ_Y') {
      parameterTempList.value[7].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[8].defaultValue === '' && item.paramnum === 'DY1_1_7_SDJLSRV') {
      parameterTempList.value[8].defaultValue = item.paramvalue;
    }
    if (parameterTempList.value[9].defaultValue === '' && item.paramnum === 'DY1_1_7_ZLDY_Y') {
      parameterTempList.value[9].defaultValue = item.paramvalue;
    }
  });
  queryImg();
}

function updateEl() {
  nextTick(() => {
    queryImg();
  });
}

function addColumns() {
  const rows = [...(parameterTempList.value[10].tableMap?.rowData ?? [])] as TableRow[];
  rows.push({
    p0: '',
    p1: '',
    p2: '',
    delIndex: rows.length,
  });
  parameterTempList.value[10].tableMap!.rowData = rows;
}

function delColumns() {
  const columnData = [...(parameterTempList.value[10].tableMap?.rowData ?? [])] as TableRow[];
  const delcheckList = selectList.value;
  if (delcheckList.length <= 0) return;

  const delList1: TableRow[] = [];
  const delList2: TableRow[] = [];
  delcheckList.forEach(item => {
    if (item.p0 === '') {
      delList2.push(item);
    } else {
      delList1.push(item);
    }
  });

  let nextRows = columnData;

  if (delList1.length > 0) {
    nextRows = nextRows.filter(row => !delList1.some(item => item.delIndex === row.delIndex));
  }

  if (delList2.length > 0) {
    nextRows = nextRows.filter(row => !delcheckList.some(item => item.p0 !== undefined && item.p0 === row.p0));
  }

  parameterTempList.value[10].tableMap!.rowData = nextRows;
  selectList.value = [];
  selectedRowKeys.value = [];
}

function onNameBlur(record: TableRow, index: number) {
  parameterTempList.value[10].tableMap!.rowData![index] = { ...record };
}

function onRemarkBlur(record: TableRow, index: number) {
  parameterTempList.value[10].tableMap!.rowData![index] = { ...record };
}

onMounted(() => {
  queryImg();
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.layout-header {
  background: #ffffff;
  min-height: 680px;
  height: 680px;
  line-height: 40px;
  padding: 0px;
  margin-bottom: 10px;
}
.selectBox {
  width: 100%;
  height: auto;
  float: left;
}
.page4-table {
  width: 100%;
}
.page4-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
.table-cell-input {
  width: 100%;
}
</style>
