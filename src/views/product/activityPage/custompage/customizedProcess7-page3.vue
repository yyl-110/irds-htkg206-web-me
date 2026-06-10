<template>
  <div class="page">
    <div class="page3-wrapper">
      <section class="page3-section">
        <div class="page3-section__head">
          <span class="page3-section__title">计算输入参数：</span>
          <a-button type="primary" @click="initData">更新数据</a-button>
        </div>

        <a-form label-align="left" :colon="false" class="page3-params-form">
          <div class="page3-params-grid">
            <a-form-item label="低压直流供电支路：" :label-col="formLabelCol" class="page3-form-item">
              <a-input-number
                v-model:value="parameterTempList[2].defaultValue"
                type="number"
                class="page3-input"
                disabled
                style="width: 200px" />
            </a-form-item>
            <a-form-item label="高压直流供电支路：" :label-col="formLabelCol" class="page3-form-item">
              <a-input-number
                v-model:value="parameterTempList[3].defaultValue"
                class="page3-input-number"
                :min="dataMin"
                :max="dataMax"
                @blur="changeNumber(2)"
                style="width: 200px" />
            </a-form-item>
            <a-form-item label="整流电源效率：" :label-col="formLabelCol" class="page3-form-item">
              <a-input-number
                v-model:value="parameterTempList[4].defaultValue"
                class="page3-input-number"
                :max="1"
                :min="0"
                :step="0.1"
                @blur="changeNumber(3)"
                style="width: 200px" />
            </a-form-item>
            <div class="page3-params-action">
              <a-button type="primary" @click="confirm1">确定</a-button>
            </div>
          </div>
        </a-form>

        <div class="page3-table-wrap">
          <a-table
            :columns="table1Columns"
            :data-source="table1Data"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: TABLE1_MIN_WIDTH }"
            :row-key="tableRowKey"
            class="page3-table">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'p2'">
                <a-input
                  v-if="record.p0 === '高压直流'"
                  v-model:value="record.p2"
                  class="table-cell-input"
                  @blur="onTable1P2Blur(record, index)" />
                <span v-else>{{ record.p2 }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'p3'">
                <span v-if="record.p0 === '高压直流'">—— ——</span>
                <a-input v-else v-model:value="record.p3" class="table-cell-input" @blur="onTable1P3Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p4'">
                <a-input
                  v-if="record.p0 === '高压直流'"
                  v-model:value="record.p4"
                  class="table-cell-input"
                  @blur="onTable1P4Blur(record, index)" />
                <span v-else>{{ record.p4 }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'p5'">
                <a-input v-model:value="record.p5" class="table-cell-input" @blur="onTable1P5Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p6'">
                <a-input
                  v-if="record.p0 === '高压直流'"
                  v-model:value="record.p6"
                  class="table-cell-input"
                  @blur="onTable1P6Blur(record, index)" />
                <span v-else>{{ record.p6 }}</span>
              </template>
            </template>
          </a-table>
        </div>
      </section>

      <section class="page3-section">
        <div class="page3-section__head">
          <span class="page3-section__title">计算结果：</span>
          <a-button type="primary" @click="calculation">计算</a-button>
        </div>
        <div class="page3-section__subtitle">高压直流母线功率计算设计输出（交流总输入功率）</div>
        <div class="page3-table-wrap">
          <a-table
            :columns="table2Columns"
            :data-source="table2Data"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: TABLE2_MIN_WIDTH }"
            :row-key="tableRowKey"
            class="page3-table">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'p3'">
                <span v-if="isTable2P3Dash(record.p0)">—— ——</span>
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
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { getFlowTableList } from './shared/flowContext';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { handleCutZero } from '@/utils/tools';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  TABLE1_COLUMNS,
  TABLE1_MIN_WIDTH,
  TABLE2_COLUMNS,
  TABLE2_MIN_WIDTH,
  TABLE2_P3_DASH_P0,
  type Page3ParameterItem,
} from './Process7-page3/customizedProcess7-page3.columns';
import { withMerge20Columns, withMerge21Columns } from './Process7-page3/tableMerge';

type TableRow = Record<string, string | number | undefined>;

defineOptions({ name: 'customizedProcess7-page3' });

const formLabelCol = { style: { width: '160px' } };

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page3ParameterItem[];
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
  customizedOk: [];
  customizedCancel: [];
}>();
const route = useRoute();
const NUMBER_REG = /^\d+(?=\.{0,1}\d+$|$)/;
const POSITIVE_INT_REG = /^[1-9]\d*$/;

function initCustomizedProcessPage7Data3(pageid: string): Page3ParameterItem[] {
  const data1: TableRow[] = [];
  const data2: TableRow[] = [];
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '1',
        colNums: '7',
        rowNums: '',
        rowData: data1,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: 'DY1-1-3_2_T_SRCS',
      colData: [
        { colName: '供电种类', isShowCol: '1' },
        { colName: '供电支路', isShowCol: '1' },
        { colName: '功率（W）', isShowCol: '1' },
        { colName: '高压DC/DC模块效率', isShowCol: '1' },
        { colName: '输出额定电压（V）', isShowCol: '1' },
        { colName: '用电设备', isShowCol: '1' },
        { colName: '电压范围（V）', isShowCol: '1' },
      ],
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '2',
        colNums: '4',
        rowNums: '',
        rowData: data2,
        colStr: ['p0', 'p1', 'p2', 'p3'],
      },
      tableName: '高压直流母线功率计算设计输出（交流总输入功率）',
      inputName: '高压直流母线功率计算设计输出（交流总输入功率）',
      tableType: '1',
      tableNum: 'DY1-1-3_2_T_GYZLMXGLSJSC',
      colData: [
        { colName: '供电种类', isShowCol: '1' },
        { colName: '供电支路', isShowCol: '1' },
        { colName: '功率（W）', isShowCol: '1' },
        { colName: '输出额定电压（V）', isShowCol: '1' },
      ],
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_3_GDZL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '低压直流供电支路',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_3_GYZLS',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '高压直流供电支路',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_3_ZLDYXL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '整流电源效率',
    },
  ];
}

function cloneParameterList(source: Page3ParameterItem[]): Page3ParameterItem[] {
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

function createInitialParameterList(): Page3ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data3(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page3ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });




const table1Data = computed(() => parameterTempList.value[0]?.tableMap?.rowData ?? []);
const table2Data = computed(() => parameterTempList.value[1]?.tableMap?.rowData ?? []);

const table1Columns = computed(() => withMerge20Columns(TABLE1_COLUMNS, () => table1Data.value));
const table2Columns = computed(() => withMerge21Columns(TABLE2_COLUMNS, () => table2Data.value));

const data1 = ref<TableRow[]>([]);
const data2 = ref<TableRow[]>([]);
const param1 = ref<string | number | null>(null);
const param2 = ref<string | number | null>(null);
const param3 = ref<string | number | null>(null);
const isShow = ref(false);
const newData1 = ref<TableRow[]>([]);
const dataMin = ref(1);
const dataMax = ref(100);

function tableRowKey(record: TableRow, index: number) {
  return String(record?.p2 ?? record?.p0 ?? index);
}

function isTable2P3Dash(p0: unknown) {
  return TABLE2_P3_DASH_P0.has(String(p0));
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function onTable1P2Blur(record: TableRow, index: number) {
  const value = String(record.p2 ?? '');
  if (value && !NUMBER_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function onTable1P3Blur(record: TableRow, index: number) {
  const value = String(record.p3 ?? '');
  if (value && !NUMBER_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function onTable1P4Blur(record: TableRow, index: number) {
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function onTable1P5Blur(record: TableRow, index: number) {
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function onTable1P6Blur(record: TableRow, index: number) {
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function initData() {
  const allTableList = getFlowTableList();
  let dyzlList: TableRow[] = [];
  let dyzlList2: TableRow[] = [];
  const dataList: TableRow[] = [];
  const dataList2: TableRow[] = [];

  allTableList.forEach(item => {
    if (item.tablenum === 'DY1-1-3_1_T_SRCS') {
      dyzlList = item.rowdata as TableRow[];
    }
    if (item.tablenum === 'DY1-1-3_1_T_DYZLSJSC') {
      dyzlList2 = item.rowdata as TableRow[];
    }
  });

  dyzlList.forEach(item => {
    if (item.p6 != undefined) {
      dataList.push({
        p0: '低压直流',
        p1: item.p0,
        p2: '',
        p3: '',
        p4: item.p3,
        p5: '',
        p6: item.p6,
      });
    }
  });

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
    item.p5 = val;
  });

  dataList.forEach((item2, index2) => {
    item2.p2 = dyzlList2[index2]?.p1;
  });

  dataList.forEach(item => {
    dataList2.push({
      p0: '各低压直流供电支路对应的高压直流输入功率',
      p1: item.p1,
      p2: '',
      p3: item.p4,
    });
  });

  param1.value = dataList.length;
  parameterTempList.value[2].defaultValue = String(dataList.length);
  parameterTempList.value[0].tableMap!.rowData = dataList;
  parameterTempList.value[1].tableMap!.rowData = dataList2;
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {

    void 0;
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function setLocalData() {
  data1.value = (parameterTempList.value[0].tableMap?.rowData ?? []) as TableRow[];
  data2.value = (parameterTempList.value[1].tableMap?.rowData ?? []) as TableRow[];
  param1.value = parameterTempList.value[2].defaultValue ?? null;
  param2.value = parameterTempList.value[3].defaultValue ?? null;
  param3.value = parameterTempList.value[4].defaultValue ?? null;
}

function resetParameterTempList() {
  if (parameterTempList.value[0].tableMap) {
    parameterTempList.value[0].tableMap.rowData = data1.value;
    parameterTempList.value[0].tableMap.rowNums = data1.value.length;
    parameterTempList.value[0].tableMap.colStr = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
  }
  if (parameterTempList.value[1].tableMap) {
    parameterTempList.value[1].tableMap.rowData = data2.value;
    parameterTempList.value[1].tableMap.rowNums = data2.value.length;
    parameterTempList.value[1].tableMap.colStr = ['p0', 'p1', 'p2', 'p3'];
  }
  parameterTempList.value[2].defaultValue = param1.value != null ? String(param1.value) : '';
  parameterTempList.value[3].defaultValue = param2.value != null ? String(param2.value) : '';
  parameterTempList.value[4].defaultValue = param3.value != null ? String(param3.value) : '';
}

function calculation() {
  const tableData1 = parameterTempList.value[0].tableMap?.rowData ?? [];
  let sumPowerAll = 0;
  setLocalData();

  tableData1.forEach((item, index) => {
    let sumPower = 0;
    if (item.p0 == '低压直流') {
      sumPower = Number(item.p2) / Number(item.p3);
      if (isNaN(sumPower)) {
        sumPower = 0;
      }
      sumPowerAll = sumPowerAll + sumPower;
      const rowData2 = parameterTempList.value[1].tableMap?.rowData ?? [];
      if (rowData2[index]) {
        rowData2[index].p2 = handleCutZero(sumPower.toFixed(3));
        rowData2[index].p3 = item.p4;
      }
    }

    if (item.p0 == '高压直流') {
      parameterTempList.value[1].tableMap?.rowData?.forEach(item1 => {
        if (item1.p0 == '高压直流用电设备功率' && item.p1 == item1.p1) {
          item1.p2 = item.p2;
          if (item.p4 != '' && item.p4 != undefined) {
            item1.p3 = item.p4;
          }
        }
      });
    }
  });

  let sumPowerAll1 = 0;
  let sumPowerAll2 = 0;
  let sumPowerAll3 = 0;
  let sumPowerAll4 = 0;
  let val = 0;

  parameterTempList.value[1].tableMap?.rowData?.forEach(item => {
    if (item.p0 == '高压直流用电设备功率') {
      sumPowerAll1 = sumPowerAll1 + Number(item.p2);
      if (item.p3 != '' && item.p3 != undefined) {
        val = Number(item.p3);
      }
    }

    if (item.p0 == '高压直流用电设备总功率') {
      item.p2 = handleCutZero(sumPowerAll1.toFixed(3));
    }

    if (item.p0 == '各低压直流供电支路对应的高压直流输入功率') {
      sumPowerAll2 = sumPowerAll2 + Number(item.p2);
    }

    if (item.p0 == '电源机柜总输入功率（高压DC/DC模块总输入功率）') {
      item.p2 = handleCutZero(sumPowerAll2.toFixed(3));
    }

    if (item.p0 == '高压直流用电设备功率' || item.p0 == '各低压直流供电支路对应的高压直流输入功率') {
      sumPowerAll3 = sumPowerAll3 + Number(item.p2);
    }

    if (item.p0 == '高压直流母线总输出功率') {
      item.p2 = handleCutZero(sumPowerAll3.toFixed(3));
      sumPowerAll4 = sumPowerAll3 * Number(param3.value);
      item.p3 = val;
    }

    if (item.p0 == '总交流输入功率') {
      item.p2 = handleCutZero(sumPowerAll4.toFixed(3));
    }
  });

  resetParameterTempList();
}

function changeNumber(type: number) {
  setLocalData();
  if (type == 1) {
    if (param1.value) {
      if (!POSITIVE_INT_REG.test(String(param1.value))) {
        message.error('请输入整数');
      }
    }
  } else if (type == 2) {
    param2.value = parameterTempList.value[3].defaultValue ?? null;
    if (param2.value) {
      if (!POSITIVE_INT_REG.test(String(param2.value))) {
        message.error('请输入整数');
      }
    }
  } else if (type == 3) {
    param3.value = parameterTempList.value[4].defaultValue ?? null;
    if (param3.value != null) {
      const str = Number(param3.value);
      let sumOutputPower = 0;
      data2.value.forEach(item => {
        if (item.p0 == '高压直流母线总输出功率') {
          sumOutputPower = Number(item.p2);
        }
        if (item.p0 == '总交流输入功率') {
          item.p2 = (sumOutputPower / str).toFixed(3);
        }
      });
    }
  }
}

function confirm1() {
  param2.value = parameterTempList.value[3].defaultValue ?? null;
  const tableData1 = [...(parameterTempList.value[0].tableMap?.rowData ?? [])] as TableRow[];
  const tableData2 = [...(parameterTempList.value[1].tableMap?.rowData ?? [])] as TableRow[];

  for (let i = 0; i < Number(param2.value); i += 1) {
    tableData1.push({
      p0: '高压直流',
      p1: `第${i + 1}路`,
      p2: '',
      p3: '',
      p4: '',
      p5: '',
      p6: '',
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
    });

    tableData2.push({
      p0: '高压直流用电设备功率',
      p1: `第${i + 1}路`,
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
    });
  }

  const summaryRows: TableRow[] = [
    {
      p0: '高压直流用电设备总功率',
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
      p0: '电源机柜总输入功率（高压DC/DC模块总输入功率）',
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
      p0: '高压直流母线总输出功率',
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

  parameterTempList.value[0].tableMap!.rowData = tableData1;
  parameterTempList.value[1].tableMap!.rowData = tableData2.concat(summaryRows);
  setSaveBtnEnable();
}

watch(
  () => props.modalFlag,
  val => {
    isShow.value = val;
  },
);

watch(isShow, val => {
  if (!val) {
    param1.value = '';
    param2.value = '';
    param3.value = '';
    data1.value = [];
    data2.value = [];
  }
});

onMounted(() => {
  newData1.value = data1.value;
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

.page3-wrapper {
  background: #ffffff;
  padding: 0 10px 16px;
  min-height: 100%;
  overflow: auto;
}

.page3-section {
  margin-bottom: 24px;
}

.page3-section__title {
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
}

.page3-section__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
  margin-bottom: 12px;
}

.page3-section__subtitle {
  padding: 0 10px;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 22px;
}

.page3-params-form {
  margin-bottom: 12px;
}

.page3-params-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px 48px;
  align-items: center;
  padding: 0 10px;
}

.page3-params-action {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.page3-form-item {
  margin-bottom: 0;
}

.page3-form-item :deep(.ant-form-item-label > label) {
  height: auto;
  line-height: 32px;
}

.page3-input {
  width: 120px;
}

.page3-input-number {
  width: 120px;
}

.page3-input-number :deep(.ant-input-number) {
  width: 100%;
}

.page3-table-wrap {
  width: 100%;
  padding: 0 10px;
  overflow-x: auto;
}

.page3-table {
  width: 100%;
  min-width: 100%;
}

.page3-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}
</style>
