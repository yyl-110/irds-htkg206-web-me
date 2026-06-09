<template>
  <div class="page">
    <div class="page1-wrapper">
      <div class="page1-page-title">交流输入交流母线功率计算</div>

      <section class="page1-section">
        <div class="page1-section__head">
          <span class="page1-section__title">计算输入参数：</span>
          <a-button type="primary" @click="initData">更新数据</a-button>
        </div>

        <a-form label-align="left" :colon="false" class="page1-params-form">
          <div class="page1-params-grid">
            <a-form-item label="低压直流供电支路个数：" :label-col="formLabelCol" class="page1-form-item">
              <span style="display: none">{{ parameterTempList[0].defaultValue }}</span>
              <a-input-number
                v-model:value="parameterTempList[0].defaultValue"
                class="page1-input-number"
                :min="dataMin"
                :max="dataMax"
                disabled
                style="width: 200px"
                @blur="changeNumber(1)" />
            </a-form-item>
            <a-form-item label="交流供电支路个数：" :label-col="formLabelCol" class="page1-form-item">
              <a-input-number
                v-model:value="parameterTempList[1].defaultValue"
                class="page1-input-number"
                :min="dataMin"
                :max="dataMax"
                style="width: 200px"
                @blur="changeNumber(2)" />
            </a-form-item>
          </div>
        </a-form>

        <div class="page1-actions">
          <a-button type="primary" @click="confirm1">确定</a-button>
        </div>

        <div class="page1-table-wrap">
          <a-table
            :columns="table1Columns"
            :data-source="table1Data"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: TABLE1_MIN_WIDTH }"
            :row-key="tableRowKey"
            class="page1-table">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'p2'">
                <a-input-number
                  v-if="record.p0 === '交流'"
                  v-model:value="record.p2"
                  type="number"
                  class="table-cell-input"
                  @blur="onTable1P2Blur(record, index)" />
                <span v-else>{{ record.p2 }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'p3'">
                <span v-if="record.p0 === '交流'">—— ——</span>
                <a-input v-else v-model:value="record.p3" class="table-cell-input" @blur="onTable1P3Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p4'">
                <span v-if="record.p0 === '交流'">—— ——</span>
                <a-input v-else v-model:value="record.p4" class="table-cell-input" @blur="onTable1P4Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p5'">
                <a-input
                  v-if="record.p0 === '交流'"
                  v-model:value="record.p5"
                  class="table-cell-input"
                  @blur="onTable1P5Blur(record, index)" />
                <span v-else>{{ record.p5 }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'p6'">
                <a-input v-model:value="record.p6" class="table-cell-input" @blur="onTable1P6Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p7'">
                <a-input
                  v-if="record.p0 === '交流'"
                  v-model:value="record.p7"
                  class="table-cell-input"
                  @blur="onTable1P7Blur(record, index)" />
                <span v-else>{{ record.p7 }}</span>
              </template>
            </template>
          </a-table>
        </div>
      </section>

      <section class="page1-section">
        <div class="page1-section__head">
          <span class="page1-section__title">计算结果：</span>
          <a-button type="primary" @click="calculation">计算</a-button>
        </div>
        <div class="page1-section__subtitle">低压直流母线总输出功率</div>
        <div class="page1-table-wrap">
          <a-table
            :columns="table2Columns"
            :data-source="table2Data"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: TABLE2_MIN_WIDTH }"
            :row-key="tableRowKey"
            class="page1-table">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'p3'">
                <span v-if="record.p0 === '低压直流母线总输出功率'">—— ——</span>
                <span v-else>{{ record.p3 }}</span>
              </template>
            </template>
          </a-table>
        </div>
        <div class="page1-section__subtitle page1-section__subtitle--spaced">设计输出（交流总输入功率）</div>
        <div class="page1-table-wrap">
          <a-table
            :columns="table3Columns"
            :data-source="table3Data"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: TABLE3_MIN_WIDTH }"
            :row-key="tableRowKey"
            class="page1-table">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'p3'">
                <span v-if="isTable3P3Dash(record.p0)">—— ——</span>
                <span v-else>{{ record.p3 }}</span>
              </template>
            </template>
          </a-table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { getFlowTableList } from './shared/flowContext';
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import { handleCutZero } from '@/utils/tools';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  TABLE1_COLUMNS,
  TABLE1_MIN_WIDTH,
  TABLE2_COLUMNS,
  TABLE2_MIN_WIDTH,
  TABLE3_COLUMNS,
  TABLE3_MIN_WIDTH,
  type Page1ParameterItem,
} from './Process7-page1/customizedProcess7-page1.columns';
import { withMerge01Columns, withMerge02Columns, withP0RowSpanMerge } from './Process7-page1/tableMerge';

type TableRow = Record<string, string | number | undefined>;

defineOptions({ name: 'customizedProcess7-page1' });

const formLabelCol = { style: { width: '180px' } };

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    pageid?: string;
    parameterTempList?: Page1ParameterItem[];
  }>(),
  {
    checkId: '',
    categoryId: '',
    pageid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();

const dataListA = ref<TableRow[]>([]);
const dataListB = ref<TableRow[]>([]);
const data1 = ref<TableRow[]>([]);
const data2 = ref<TableRow[]>([]);
const data3 = ref<TableRow[]>([]);
const param1 = ref<string | null>(null);
const param2 = ref<string | null>(null);
const param3 = ref<string | null>(null);
const tabHeight = ref(305);
const isShow = ref(false);
const lowVoltageBranch = ref('');
const newData1 = ref<TableRow[]>([]);
const newData2 = ref<TableRow[]>([]);
const newData3 = ref<TableRow[]>([]);
const excludeData = ref<TableRow[]>([]);
const dyId = ref('');
const jlId = ref('');
const dataMin = ref(1);
const dataMax = ref(100);

function cloneParameterList(source: Page1ParameterItem[]): Page1ParameterItem[] {
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

function initCustomizedProcessPage7Data1(): Page1ParameterItem[] {
  const data1Rows: TableRow[] = [
    { p0: '低压直流', p1: '第1路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '低压直流', p1: '第2路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '低压直流', p1: '第3路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '低压直流', p1: '第4路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '低压直流', p1: '第5路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '低压直流', p1: '第6路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '交流', p1: '第1路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '交流', p1: '第2路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '交流', p1: '第3路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '交流', p1: '第4路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '交流', p1: '第5路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
    { p0: '交流', p1: '第6路', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
  ];
  const data2Rows: TableRow[] = [
    { p0: '低压直流', p1: '第1路', p2: '', p3: '' },
    { p0: '低压直流', p1: '第2路', p2: '', p3: '' },
    { p0: '低压直流', p1: '第3路', p2: '', p3: '' },
    { p0: '低压直流', p1: '第4路', p2: '', p3: '' },
    { p0: '低压直流', p1: '第5路', p2: '', p3: '' },
    { p0: '低压直流', p1: '第6路', p2: '', p3: '' },
    { p0: '低压直流母线总输出功率', p1: '', p2: '', p3: '' },
  ];
  const data3Rows: TableRow[] = [
    { p0: '各低压直流供电支路对应的交流输入功率', p1: '第1路', p2: '', p3: '' },
    { p0: '各低压直流供电支路对应的交流输入功率', p1: '第2路', p2: '', p3: '' },
    { p0: '各低压直流供电支路对应的交流输入功率', p1: '第3路', p2: '', p3: '' },
    { p0: '各低压直流供电支路对应的交流输入功率', p1: '第4路', p2: '', p3: '' },
    { p0: '各低压直流供电支路对应的交流输入功率', p1: '第5路', p2: '', p3: '' },
    { p0: '各低压直流供电支路对应的交流输入功率', p1: '第6路', p2: '', p3: '' },
    { p0: '各交流用电负载支路对应的交流输入功率', p1: '第1路', p2: '', p3: '' },
    { p0: '各交流用电负载支路对应的交流输入功率', p1: '第2路', p2: '', p3: '' },
    { p0: '各交流用电负载支路对应的交流输入功率', p1: '第3路', p2: '', p3: '' },
    { p0: '各交流用电负载支路对应的交流输入功率', p1: '第4路', p2: '', p3: '' },
    { p0: '各交流用电负载支路对应的交流输入功率', p1: '第5路', p2: '', p3: '' },
    { p0: '各交流用电负载支路对应的交流输入功率', p1: '第6路', p2: '', p3: '' },
    { p0: '低压直流母线总输出功率', p1: '', p2: '', p3: '' },
  ];
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_3_GDZL',
      parameterId: '',
      defaultValue: '6',
      propertyType: '1',
      pageId: props.pageid,
      inputName: '低压直流供电支路个数',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_2_JLLS',
      parameterId: '',
      defaultValue: '6',
      propertyType: '1',
      pageId: props.pageid,
      inputName: '交流供电支路',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: props.pageid,
      tableMap: {
        tableType: '1',
        colNums: '6',
        rowNums: '',
        rowData: data1Rows,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: 'DY1-1-2_1_T_SRCS',
      colData: [
        { colName: '供电种类', isShowCol: '1' },
        { colName: '供电支路', isShowCol: '1' },
        { colName: '功率（W）', isShowCol: '1' },
        { colName: '低压DC/DC组合效率', isShowCol: '1' },
        { colName: 'AC/DC组合效率', isShowCol: '1' },
        { colName: '额定输出电压（V）', isShowCol: '1' },
      ],
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: props.pageid,
      tableMap: {
        tableType: '2',
        colNums: '3',
        rowNums: '3',
        rowData: data2Rows,
        colStr: ['p0', 'p1', 'p2'],
      },
      tableName: '低压直流母线总输出功率',
      inputName: '低压直流母线总输出功率',
      tableType: '1',
      tableNum: 'DY1-1-2_1_T_DYZLMXZSCGL',
      colData: [
        { colName: '供电种类', isShowCol: '1' },
        { colName: '供电支路', isShowCol: '1' },
        { colName: '功率（W）', isShowCol: '1' },
      ],
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: props.pageid,
      tableMap: {
        tableType: '2',
        colNums: '4',
        rowData: data3Rows,
        colStr: ['p0', 'p1', 'p2', 'p3'],
      },
      tableName: '设计输出（交流总输入功率）',
      inputName: '设计输出（交流总输入功率）',
      tableNum: 'DY1-1-2_1_T_SJSC',
      tableType: '2',
      colData: [
        { colName: '供电种类', isShowCol: '1' },
        { colName: '供电支路', isShowCol: '1' },
        { colName: '功率（W）', isShowCol: '1' },
        { colName: '额定输出电压（V）', isShowCol: '1' },
      ],
    },
  ];
}

function createInitialParameterList(): Page1ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data1();
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page1ParameterItem[]>(createInitialParameterList());

const table1Data = computed(() => parameterTempList.value[2]?.tableMap?.rowData ?? []);
const table2Data = computed(() => parameterTempList.value[3]?.tableMap?.rowData ?? []);
const table3Data = computed(() => parameterTempList.value[4]?.tableMap?.rowData ?? []);

const table1Columns = computed(() => withP0RowSpanMerge(TABLE1_COLUMNS, () => table1Data.value));
const table2Columns = computed(() => withMerge01Columns(TABLE2_COLUMNS, () => table2Data.value));
const table3Columns = computed(() => withMerge02Columns(TABLE3_COLUMNS, () => table3Data.value));

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;

function tableRowKey(record: TableRow, index: number) {
  return String(record?.id ?? record?.p0 ?? index);
}

function isTable3P3Dash(p0: unknown) {
  return p0 === '低压直流母线总输出功率' || p0 === '电源机柜总输入功率（AD/DC组合总输入功率）' || p0 === '总交流输入功率';
}

function onTable1P2Blur(record: TableRow, index: number) {
  parameterTempList.value[2].tableMap!.rowData![index].p2 = record.p2;
  setSaveBtnEnable();
}

function onTable1P3Blur(record: TableRow, index: number) {
  const value = String(record.p3 ?? '');
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  if (value && (Number(value) > 1 || Number(value) <= 0)) {
    message.error('请输入0到1之间的数字，不包括0');
    return;
  }
  parameterTempList.value[2].tableMap!.rowData![index].p3 = record.p3;
  setSaveBtnEnable();
}

function onTable1P4Blur(record: TableRow, index: number) {
  const value = String(record.p4 ?? '');
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  if (value && (Number(value) > 1 || Number(value) <= 0)) {
    message.error('请输入0到1的数字，不包括0');
    return;
  }
  parameterTempList.value[2].tableMap!.rowData![index].p4 = record.p4;
  setSaveBtnEnable();
}

function onTable1P5Blur(record: TableRow, index: number) {
  parameterTempList.value[2].tableMap!.rowData![index] = { ...record };
  setSaveBtnEnable();
}

function onTable1P6Blur(record: TableRow, index: number) {
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
  setSaveBtnEnable();
}

function onTable1P7Blur(record: TableRow, index: number) {
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function initData() {
  const allTableList = getFlowTableList();
  let dyzlList: TableRow[] = [];
  let dyzlList2: TableRow[] = [];
  const dataList: TableRow[] = [];
  const dataList2: TableRow[] = [];
  let dataList3: TableRow[] = [];
  allTableList.forEach(item => {
    if (item.tablenum === 'DY1-1-3_1_T_SRCS') {
      dyzlList = item.rowdata as TableRow[];
    }
    if (item.tablenum === 'DY1-1-3_1_T_DYZLSJSC') {
      dyzlList2 = item.rowdata as TableRow[];
    }
    if (item.tablenum === 'DY1-1-2_1_T_SRCS') {
      dataList3 = item.rowdata as TableRow[];
    }
  });
  let i = 0;
  dyzlList.forEach(item => {
    if (item.p6 != undefined) {
      dataList.push({
        p0: '低压直流',
        p1: item.p0,
        p2: dataList3[i].p2,
        p3: dataList3[i].p3,
        p4: dataList3[i].p4,
        p5: item.p3,
        p6: item.p5,
        p7: item.p6,
      });
      i++;
    }
  });
  dataListA.value = dataList;

  dataList.forEach(item => {
    let val = '';
    dyzlList.forEach(item2 => {
      if (item.p1 == item2.p0) {
        if (val == '') {
          val = String(item2.p5 ?? '');
        } else {
          val = val + '、' + item2.p5;
        }
      }
    });
    item.p6 = val;
  });
  dataList.forEach((item2, index2) => {
    item2.p2 = dyzlList2[index2].p1;
  });
  let sumGL = 0;
  dataList.forEach(item => {
    sumGL = sumGL + Number(item.p2);
    dataList2.push({
      p0: '低压直流',
      p1: item.p1,
      p2: item.p2,
      p3: item.p5,
    });
  });
  dataList2.push({
    p0: '低压直流母线总输出功率',
    p1: '',
    p2: sumGL,
    p3: '--',
  });
  const dataList4: TableRow[] = [];
  for (let j = 0; j < dataList3.length; j++) {
    if (dataList3[j].p0 == '交流') {
      const str1: TableRow = {
        p0: dataList3[j].p0,
        p1: dataList3[j].p1,
        p2: dataList3[j].p2,
        p3: '',
        p4: '',
        p5: dataList3[j].p5,
        p6: dataList3[j].p6,
        p7: dataList3[j].p7,
        cellParameterId0: '',
        cellParentNum0: '',
        cellInputOrOutput0: '1',
        cellInputName0: '',
        cellParameterId1: '',
        cellParentNum1: '',
        cellInputOrOutput1: '1',
        cellInputName1: '',
        cellParameterId2: '',
        cellParentNum2: '',
        cellInputOrOutput2: '0',
        cellInputName2: '',
        cellParameterId3: '',
        cellParentNum3: '',
        cellInputOrOutput3: '0',
        cellInputName3: '',
        cellParameterId4: '',
        cellParentNum4: '',
        cellInputOrOutput4: '0',
        cellInputName4: '',
        cellParameterId5: '',
        cellParentNum5: '',
        cellInputOrOutput5: '0',
        cellInputName5: '',
        cellParameterId6: '',
        cellParentNum6: '',
        cellInputOrOutput6: '0',
        cellInputName6: '',
        cellParameterId7: '',
        cellParentNum7: '',
        cellInputOrOutput7: '0',
        cellInputName7: '',
      };
      dataList.push(str1);
      dataList4.push(str1);
    }
  }
  dataListB.value = dataList4;
  parameterTempList.value[0].defaultValue = String(i);
  parameterTempList.value[2].tableMap!.rowData = dataList;
  parameterTempList.value[3].tableMap!.rowData = dataList2;

  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {
    void 0;
  });
}

function setLocalData() {
  param1.value = parameterTempList.value[0].defaultValue ?? null;
  param2.value = parameterTempList.value[1].defaultValue ?? null;
  data1.value = (parameterTempList.value[2].tableMap?.rowData ?? []) as TableRow[];
  data2.value = (parameterTempList.value[3].tableMap?.rowData ?? []) as TableRow[];
  data3.value = (parameterTempList.value[4].tableMap?.rowData ?? []) as TableRow[];
}

function resetParameterTempList() {
  parameterTempList.value[0].defaultValue = param1.value ?? undefined;
  parameterTempList.value[1].defaultValue = param2.value ?? undefined;
  parameterTempList.value[2].tableMap!.rowData = data1.value;
  parameterTempList.value[2].tableMap!.rowNums = data1.value.length;
  parameterTempList.value[2].tableMap!.colStr = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
  parameterTempList.value[3].tableMap!.rowData = data2.value;
  parameterTempList.value[3].tableMap!.rowNums = data2.value.length;
  parameterTempList.value[3].tableMap!.colStr = ['p0', 'p1', 'p2', 'p3'];
  parameterTempList.value[4].tableMap!.rowData = data3.value;
  parameterTempList.value[4].tableMap!.rowNums = data3.value.length;
  parameterTempList.value[4].tableMap!.colStr = ['p0', 'p1', 'p2', 'p3'];
}

function calculation() {
  const tableData1 = parameterTempList.value[2].tableMap!.rowData!;
  let sumPowerAll = 0;
  let sumPowerAll1 = 0;
  tableData1.forEach((item, index) => {
    let sumPower = 0;
    let sumPower1 = 0;
    if (item.p0 == '低压直流') {
      sumPower = Number(item.p2) / Number(item.p3);
      sumPower1 = Number(item.p2) / (Number(item.p3) * Number(item.p4));
      if (isNaN(sumPower)) {
        sumPower = 0;
      }
      if (isNaN(sumPower1)) {
        sumPower1 = 0;
      }
      sumPowerAll = sumPowerAll + sumPower;
      sumPowerAll1 = sumPowerAll1 + sumPower1;
      parameterTempList.value[3].tableMap!.rowData![index].p2 = handleCutZero(sumPower.toFixed(3));
      parameterTempList.value[3].tableMap!.rowData![index].p3 = item.p5;

      parameterTempList.value[4].tableMap!.rowData![index].p2 = handleCutZero(sumPower1.toFixed(3));
      parameterTempList.value[4].tableMap!.rowData![index].p3 = item.p5;
    }

    if (item.p0 == '交流') {
      parameterTempList.value[4].tableMap!.rowData!.forEach(item1 => {
        if (item1.p0 == '各交流用电负载支路对应的交流输入功率' && item.p1 == item1.p1) {
          item1.p2 = item.p2;
          item1.p3 = item.p5;
        }
      });
    }
  });
  parameterTempList.value[3].tableMap!.rowData!.forEach(item => {
    if (item.p0 == '低压直流母线总输出功率') {
      item.p2 = handleCutZero(sumPowerAll.toFixed(3));
    }
  });

  let sumPowerAll2 = 0;
  parameterTempList.value[4].tableMap!.rowData!.forEach(item => {
    if (item.p0 == '电源机柜总输入功率（AD/DC组合总输入功率）') {
      item.p2 = handleCutZero(sumPowerAll1.toFixed(3));
    }

    if (item.p0 == '低压直流母线总输出功率') {
      item.p2 = handleCutZero(sumPowerAll.toFixed(3));
    }
    if (item.p0 == '各低压直流供电支路对应的交流输入功率' || item.p0 == '各交流用电负载支路对应的交流输入功率') {
      sumPowerAll2 = sumPowerAll2 + Number(item.p2);
    }

    if (item.p0 == '总交流输入功率') {
      item.p2 = handleCutZero(sumPowerAll2.toFixed(3));
    }
  });
}

function changeInput(row: TableRow, event: string) {
  let list: TableRow[] = [];
  let list1: TableRow[] = [];
  if (row.p0 == '低压直流') {
    list = data2.value;
    list.forEach(item => {
      if (item.p1 == row.p1) {
        item.p3 = event;
      }
    });
  }
  list1 = data3.value;
  list1.forEach((item1, index) => {
    if (index == row._index) {
      item1.p3 = event;
    }
  });
}

function changeInput1(row: TableRow, event: string) {
  let list: TableRow[] = [];
  let val = 0;
  let val1 = 1;
  if (row.p0 == '低压直流') {
    list = data2.value;
    list.forEach(item => {
      if (item.p1 == row.p1) {
        if (row.p3 !== '' && row.p3 != undefined && event != '') {
          val1 = Number(event) / Number(row.p3);
          item.p2 = handleCutZero(val1.toFixed(3));
        } else {
          item.p2 = '';
        }
      }
      if (row.p2 !== '' && row.p2 != undefined && row.p3 != '' && row.p3 != undefined && event != '' && row.p4 != '') {
        if (item.p0 == '低压直流' && item.p1 == row.p1) {
          val = Number(Number(event) / (Number(row.p3) * Number(row.p4)));
          summary2(val, row);
        }
      } else {
        summary2(0, row);
      }
    });
    summary(list);
  } else {
    list = data3.value;
    list.forEach(item => {
      if (item.p1 == row.p1 && item.p0 == '各交流用电负载支路对应的交流输入功率') {
        item.p2 = event;
      }
    });
    totalACInputPower();
  }
}

function changeInput2(row: TableRow, event: string) {
  let list: TableRow[] = [];
  let val = 0;
  if (row.p0 == '低压直流') {
    list = data2.value;
    list.forEach(item => {
      if (item.p1 == row.p1) {
        if (row.p3 !== '' && row.p3 != undefined && event != '') {
          val = Number(row.p2) / Number(event);
          item.p2 = handleCutZero(val.toFixed(3));
        } else {
          item.p2 = '';
        }
      }
      if (row.p2 !== '' && row.p2 != undefined && row.p3 != '' && row.p3 != undefined && event != '' && row.p4 != '') {
        if (item.p0 == '低压直流' && item.p1 == row.p1) {
          val = Number(Number(row.p2) / (Number(event) * Number(row.p4)));
          summary2(val, row);
        }
      } else {
        summary2(0, row);
      }
    });
    summary(list);
  } else {
    list = data3.value;
  }
}

function changeInput3(row: TableRow, event: string) {
  const list = data1.value;
  let val = 0;
  if (row.p2 != '' && row.p2 != undefined && row.p3 != '' && row.p3 != undefined && event != '') {
    list.forEach(item => {
      if (item.p0 == '低压直流' && item.p1 == row.p1) {
        val = Number(Number(item.p2) / (Number(item.p3) * Number(event)));
      }
    });
  }
  summary2(val, row);
}

function summary2(val: number, row: TableRow) {
  data3.value.forEach(item => {
    if (item.p0 == '各低压直流供电支路对应的交流输入功率' && item.p1 == row.p1) {
      item.p2 = handleCutZero(val.toFixed(3));
    }
  });
  totalInputPower();
}

function summary(list: TableRow[]) {
  let sumVal = 0;
  list.forEach(item => {
    if (item.p0 == '低压直流') {
      sumVal = sumVal + Number(item.p2);
    }
  });
  lowVoltageDCSummary(sumVal);
}

function lowVoltageDCSummary(sumVal: number) {
  data3.value.forEach(item => {
    if (item.p0 == '低压直流母线总输出功率') {
      const val = Number(sumVal);
      item.p2 = val.toFixed(3);
    }
  });

  data2.value.forEach(item => {
    if (item.p0 == '低压直流母线总输出功率') {
      const val = Number(sumVal);
      item.p2 = handleCutZero(val.toFixed(3));
    }
  });
}

function totalInputPower() {
  let sumVal = 0;
  data3.value.forEach(item => {
    if (item.p0 == '各低压直流供电支路对应的交流输入功率') {
      sumVal = sumVal + Number(item.p2);
    }
    if (item.p0 == '电源机柜总输入功率（AD/DC组合总输入功率）') {
      const val = Number(sumVal);
      item.p2 = handleCutZero(val.toFixed(3));
    }
  });
  totalACInputPower();
}

function totalACInputPower() {
  let sumVal = 0;
  data3.value.forEach(item => {
    if (item.p0 == '各低压直流供电支路对应的交流输入功率' || item.p0 == '各交流用电负载支路对应的交流输入功率') {
      sumVal = sumVal + Number(item.p2);
    }
    if (item.p0 == '总交流输入功率') {
      const val = Number(sumVal);
      item.p2 = handleCutZero(val.toFixed(3));
    }
  });
}

function param1Change(Option: string) {
  const list = newData1.value;
  data1.value = [];
  const list1: TableRow[] = [];
  let leg = 0;
  if (Option != '' && Option != undefined) {
    leg = Number(Option);
  } else {
    leg = 6;
  }
  for (let i = 0; i < leg; i++) {
    list1.push(list[i]);
  }
  let strLeg = 0;
  strLeg = Number(param2.value) + 5;
  list.forEach((item, index) => {
    if (item.a1 != '低压直流') {
      if (param2.value != '' && param2.value != undefined) {
        if (index <= strLeg) {
          list1.push(item);
        }
      } else {
        list1.push(item);
      }
    }
  });
  list1.forEach(item => {
    data1.value.push(item);
  });
}

function param2Change(Option: string) {
  const list = newData1.value;
  data1.value = [];
  const list1: TableRow[] = [];
  list.forEach((item, index) => {
    if (item.a1 != '交流') {
      if (param1.value != '') {
        if (index <= Number(Number(param1.value) - 1)) {
          list1.push(item);
        }
      } else {
        list1.push(item);
      }
    }
  });
  let leg = 0;
  if (Option == '' || Option == undefined) {
    leg = 12;
  } else {
    leg = 6 + Number(Option);
  }
  for (let i = 0; i < leg; i++) {
    if (list[i].a1 == '交流') {
      list1.push(list[i]);
    }
  }
  list1.forEach(item => {
    data1.value.push(item);
  });
}

function changeNumber(type: number) {
  if (type == 1) {
    if (param1.value) {
      const intReg = /^[1-9]\d*$/;
      if (!intReg.test(param1.value)) {
        message.error('请输入整数');
      }
    }
  } else if (type == 2) {
    if (param2.value) {
      const intReg = /^[1-9]\d*$/;
      if (!intReg.test(param2.value)) {
        message.error('请输入整数');
      }
    }
  } else if (type == 3) {
    if (param3.value) {
      const intReg = /^[1-9]\d*$/;
      if (!intReg.test(param3.value)) {
        message.error('请输入整数');
      }
    }
  }
}

function confirm1() {
  param2.value = parameterTempList.value[1].defaultValue ?? null;
  const nextData1: TableRow[] = [];
  const data2Rows = parameterTempList.value[3].tableMap!.rowData!;
  const data3Rows: TableRow[] = [];
  for (let i = 0; i < dataListA.value.length; i++) {
    if (dataListA.value[i].p0 == '低压直流') {
      nextData1.push(dataListA.value[i]);
    }
  }
  for (let i = 0; i < Number(data2Rows.length); i++) {
    if (data2Rows[i].p0 == '低压直流') {
      const str3: TableRow = {
        p0: '各低压直流供电支路对应的交流输入功率',
        p1: '第' + (i + 1) + '路',
        p2: '',
        p3: data2Rows[i].p3,
        cellParameterId0: '',
        cellParentNum0: '',
        cellInputOrOutput0: '1',
        cellInputName0: '',
        cellParameterId1: '',
        cellParentNum1: '',
        cellInputOrOutput1: '1',
        cellInputName1: '',
        cellParameterId2: '',
        cellParentNum2: '',
        cellInputOrOutput2: '1',
        cellInputName2: '',
        cellParameterId3: '',
        cellParentNum3: '',
        cellInputOrOutput3: '1',
        cellInputName3: '',
      };
      data3Rows.push(str3);
    }
  }
  for (let i = 0; i < Number(param2.value); i++) {
    const str1: TableRow = {};
    if (i + 1 <= dataListB.value.length) {
      str1.p0 = dataListB.value[i].p0;
      str1.p1 = dataListB.value[i].p1;
      str1.p2 = dataListB.value[i].p2;
      str1.p3 = '';
      str1.p4 = '';
      str1.p5 = dataListB.value[i].p5;
      str1.p6 = dataListB.value[i].p6;
      str1.p7 = dataListB.value[i].p7;
      str1.cellParameterId0 = '';
      str1.cellParentNum0 = '';
      str1.cellInputOrOutput0 = '1';
      str1.cellInputName0 = '';
      str1.cellParameterId1 = '';
      str1.cellParentNum1 = '';
      str1.cellInputOrOutput1 = '1';
      str1.cellInputName1 = '';
      str1.cellParameterId2 = '';
      str1.cellParentNum2 = '';
      str1.cellInputOrOutput2 = '0';
      str1.cellInputName2 = '';
      str1.cellParameterId3 = '';
      str1.cellParentNum3 = '';
      str1.cellInputOrOutput3 = '0';
      str1.cellInputName3 = '';
      str1.cellParameterId4 = '';
      str1.cellParentNum4 = '';
      str1.cellInputOrOutput4 = '0';
      str1.cellInputName4 = '';
      str1.cellParameterId5 = '';
      str1.cellParentNum5 = '';
      str1.cellInputOrOutput5 = '0';
      str1.cellInputName5 = '';
      str1.cellParameterId6 = '';
      str1.cellParentNum6 = '';
      str1.cellInputOrOutput6 = '0';
      str1.cellInputName6 = '';
      str1.cellParameterId7 = '';
      str1.cellParentNum7 = '';
      str1.cellInputOrOutput7 = '0';
      str1.cellInputName7 = '';
      nextData1.push(str1);
    } else {
      str1.p0 = '交流';
      str1.p1 = '第' + (i + 1) + '路';
      str1.p2 = '';
      str1.p3 = '';
      str1.p4 = '';
      str1.p5 = '';
      str1.p6 = '';
      str1.p7 = '';
      str1.cellParameterId0 = '';
      str1.cellParentNum0 = '';
      str1.cellInputOrOutput0 = '1';
      str1.cellInputName0 = '';
      str1.cellParameterId1 = '';
      str1.cellParentNum1 = '';
      str1.cellInputOrOutput1 = '1';
      str1.cellInputName1 = '';
      str1.cellParameterId2 = '';
      str1.cellParentNum2 = '';
      str1.cellInputOrOutput2 = '0';
      str1.cellInputName2 = '';
      str1.cellParameterId3 = '';
      str1.cellParentNum3 = '';
      str1.cellInputOrOutput3 = '0';
      str1.cellInputName3 = '';
      str1.cellParameterId4 = '';
      str1.cellParentNum4 = '';
      str1.cellInputOrOutput4 = '0';
      str1.cellInputName4 = '';
      str1.cellParameterId5 = '';
      str1.cellParentNum5 = '';
      str1.cellInputOrOutput5 = '0';
      str1.cellInputName5 = '';
      str1.cellParameterId6 = '';
      str1.cellParentNum6 = '';
      str1.cellInputOrOutput6 = '0';
      str1.cellInputName6 = '';
      str1.cellParameterId7 = '';
      str1.cellParentNum7 = '';
      str1.cellInputOrOutput7 = '0';
      str1.cellInputName7 = '';
      nextData1.push(str1);
    }
    const str2: TableRow = {
      p0: '各交流用电负载支路对应的交流输入功率',
      p1: '第' + (i + 1) + '路',
      p2: '',
      p3: '',
      cellParameterId0: '',
      cellParentNum0: '',
      cellInputOrOutput0: '1',
      cellInputName0: '',
      cellParameterId1: '',
      cellParentNum1: '',
      cellInputOrOutput1: '1',
      cellInputName1: '',
      cellParameterId2: '',
      cellParentNum2: '',
      cellInputOrOutput2: '1',
      cellInputName2: '',
      cellParameterId3: '',
      cellParentNum3: '',
      cellInputOrOutput3: '1',
      cellInputName3: '',
    };
    data3Rows.push(str2);
  }

  const str4: TableRow[] = [
    {
      p0: '低压直流母线总输出功率',
      p1: '',
      p2: '',
      p3: '',
      cellParameterId0: '',
      cellParentNum0: '',
      cellInputOrOutput0: '1',
      cellInputName0: '',
      cellParameterId1: '',
      cellParentNum1: '',
      cellInputOrOutput1: '1',
      cellInputName1: '',
      cellParameterId2: '',
      cellParentNum2: '',
      cellInputOrOutput2: '1',
      cellInputName2: '',
      cellParameterId3: '',
      cellParentNum3: '',
      cellInputOrOutput3: '1',
      cellInputName3: '',
    },
    {
      p0: '电源机柜总输入功率（AD/DC组合总输入功率）',
      p1: '',
      p2: '',
      p3: '',
      cellParameterId0: '',
      cellParentNum0: '',
      cellInputOrOutput0: '1',
      cellInputName0: '',
      cellParameterId1: '',
      cellParentNum1: '',
      cellInputOrOutput1: '1',
      cellInputName1: '',
      cellParameterId2: '',
      cellParentNum2: '',
      cellInputOrOutput2: '1',
      cellInputName2: '',
      cellParameterId3: '',
      cellParentNum3: '',
      cellInputOrOutput3: '1',
      cellInputName3: '',
    },
    {
      p0: '总交流输入功率',
      p1: '',
      p2: '',
      p3: '',
      cellParameterId0: '',
      cellParentNum0: '',
      cellInputOrOutput0: '1',
      cellInputName0: '',
      cellParameterId1: '',
      cellParentNum1: '',
      cellInputOrOutput1: '1',
      cellInputName1: '',
      cellParameterId2: '',
      cellParentNum2: '',
      cellInputOrOutput2: '1',
      cellInputName2: '',
      cellParameterId3: '',
      cellParentNum3: '',
      cellInputOrOutput3: '1',
      cellInputName3: '',
    },
  ];
  const newList = data3Rows.concat(str4);
  parameterTempList.value[2].tableMap!.rowData = [];
  parameterTempList.value[2].tableMap!.rowData = nextData1;
  parameterTempList.value[4].tableMap!.rowData = newList;
  setSaveBtnEnable();
}

watch(isShow, val => {
  if (!val) {
    param1.value = '';
    param2.value = '';
    data1.value = [];
    data2.value = [];
    data3.value = [];
  }
});

onMounted(() => {
  newData1.value = data1.value;
  newData2.value = data2.value;
  if (props.parameterTempList?.length) {
    initData();
  }
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.page {
  font-size: 15px;
}

.page1-wrapper {
  background: #ffffff;
  padding: 0 10px 16px;
  min-height: 100%;
  overflow: auto;
}

.page1-page-title {
  padding: 0 10px;
  font-weight: 600;
  font-size: 15px;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.88);
}

.page1-section {
  margin-bottom: 24px;
}

.page1-section__title {
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
}

.page1-section__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px 0;
  margin-bottom: 12px;
}

.page1-section__subtitle {
  padding: 0 10px;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 22px;
}

.page1-section__subtitle--spaced {
  margin-top: 20px;
}

.page1-params-form {
  margin-bottom: 0;
}

.page1-params-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 12px 48px;
  padding: 0 10px;
}

.page1-actions {
  padding: 12px 10px;
}

.page1-form-item {
  margin-bottom: 0;
}

.page1-form-item :deep(.ant-form-item-label > label) {
  height: auto;
  line-height: 32px;
}

.page1-input-number {
  width: 120px;
}

.page1-input-number :deep(.ant-input-number) {
  width: 100%;
}

.page1-table-wrap {
  width: 100%;
  padding: 0 10px;
  overflow-x: auto;
}

.page1-table {
  width: 100%;
  min-width: 100%;
}

.page1-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}
</style>
