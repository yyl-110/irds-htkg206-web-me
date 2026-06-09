<template>
  <div class="page">
    <div class="page2-wrapper">
      <section class="page2-section">
        <div class="page2-section__title">计算输入参数：</div>

        <div class="page2-params-row">
          <a-form label-align="left" :colon="false">
            <a-form-item label="供电支路：" :label-col="formLabelCol" class="page2-form-item">
              <a-input-number
                v-model:value="parameterTempList[2].defaultValue"
                type="number"
                class="page2-input page2-input--sm"
                :min="1"
                :max="12"
                @blur="changeNumber(1)"
                style="width: 200px" />
            </a-form-item>
          </a-form>
        </div>

        <div v-if="compactData.length" class="page2-branch-grid">
          <a-form label-align="left" :colon="false">
            <a-form-item
              v-for="item in compactData"
              :key="item.id"
              :label="item.labelName"
              :label-col="branchLabelCol"
              class="page2-form-item">
              <a-input v-model:value="item.newModeTypeVal" class="page2-input page2-input--sm" allow-clear />
            </a-form-item>
          </a-form>
        </div>

        <div class="page2-actions">
          <a-button type="primary" @click="confirm">确定</a-button>
        </div>

        <div class="page2-table-wrap">
          <a-table
            :columns="table1Columns"
            :data-source="table1Data"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: TABLE1_MIN_WIDTH }"
            :row-key="tableRowKey"
            class="page2-table">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'p3'">
                <span v-if="record.p0 === '总低压直流输出功率'">—— ——</span>
                <a-input v-else v-model:value="record.p3" class="table-cell-input" @blur="onTable1P3Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p4'">
                <a-input v-model:value="record.p4" class="table-cell-input" @blur="onTable1P4Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p5'">
                <a-input v-model:value="record.p5" class="table-cell-input" @blur="onTable1P5Blur(record, index)" />
              </template>
              <template v-else-if="column.dataIndex === 'p6'">
                <a-input v-model:value="record.p6" class="table-cell-input" @blur="onTable1P6Blur(record, index)" />
              </template>
            </template>
          </a-table>
        </div>
      </section>

      <section class="page2-section">
        <div class="page2-section__head">
          <span class="page2-section__title">计算结果：</span>
          <a-button type="primary" @click="calculation" style="margin-top: -10px">计算</a-button>
        </div>
        <div class="page2-section__subtitle">低压直流设计输出（低压直流功率）</div>
        <div class="page2-table-wrap">
          <a-table
            :columns="table2Columns"
            :data-source="table2Data"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: TABLE2_MIN_WIDTH }"
            :row-key="tableRowKey"
            class="page2-table">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'p2'">
                <span v-if="record.p0 === '总低压直流输出功率'">—— ——</span>
                <span v-else>{{ record.p2 }}</span>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { handleCutZero } from '@/utils/tools';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  TABLE1_COLUMNS,
  TABLE1_MIN_WIDTH,
  TABLE2_COLUMNS,
  TABLE2_MIN_WIDTH,
  type Page2ParameterItem,
} from './Process7-page2/customizedProcess7-page2.columns';
import { withMerge10Columns, withMerge11Columns } from './Process7-page2/tableMerge';

type TableRow = Record<string, string | number | undefined>;

defineOptions({ name: 'customizedProcess7-page2' });

const formLabelCol = { style: { width: '100px' } };
const branchLabelCol = { style: { width: '130px' } };

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page2ParameterItem[];
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

interface CompactDataItem {
  id: number;
  labelName: string;
  typeKey: string;
  modeTypeVal: string | number | undefined;
  newModeTypeVal?: string | number | undefined;
}

const NUMBER_REG = /^\d+(?=\.{0,1}\d+$|$)/;
const POSITIVE_INT_REG = /^[1-9]\d*$/;

function initCustomizedProcessPage7Data2(pageid: string): Page2ParameterItem[] {
  const data1: TableRow[] = [];
  const data2: TableRow[] = [];
  const list: Page2ParameterItem[] = [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '1',
        colNums: '5',
        rowNums: '',
        rowData: data1,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: 'DY1-1-3_1_T_SRCS',
      colData: [
        { colName: '供电支路', isShowCol: '1' },
        { colName: '供电分支', isShowCol: '1' },
        { colName: '供电分支代号', isShowCol: '1' },
        { colName: '额定输出电压（V）', isShowCol: '1' },
        { colName: '功率（W）', isShowCol: '1' },
        { colName: '用电设备', isShowCol: '1' },
        { colName: '电压范围', isShowCol: '1' },
      ],
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '2',
        colNums: '3',
        rowData: data2,
        colStr: ['p0', 'p1', 'p2'],
      },
      tableName: '低压直流设计输出（低压直流功率）',
      inputName: '低压直流设计输出（低压直流功率）',
      tableType: '1',
      tableNum: 'DY1-1-3_1_T_DYZLSJSC',
      colData: [
        { colName: '供电支路', isShowCol: '1' },
        { colName: '功率', isShowCol: '1' },
        { colName: '输出额定电压（V）', isShowCol: '1' },
      ],
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_3_GDZL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '低压直流供电支路',
    },
  ];
  for (let i = 3; i < 53; i += 1) {
    list.push({
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: `DY1_1_${i}_1BRANCH`,
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: `第${i}路分支数`,
    });
  }
  return list;
}

function cloneParameterList(source: Page2ParameterItem[]): Page2ParameterItem[] {
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

function createInitialParameterList(): Page2ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data2(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page2ParameterItem[]>(createInitialParameterList());

const table1Data = computed(() => parameterTempList.value[0]?.tableMap?.rowData ?? []);
const table2Data = computed(() => parameterTempList.value[1]?.tableMap?.rowData ?? []);

const table1Columns = computed(() => withMerge10Columns(TABLE1_COLUMNS, () => table1Data.value));
const table2Columns = computed(() => withMerge11Columns(TABLE2_COLUMNS));

const data1 = ref<TableRow[]>([]);
const data2 = ref<TableRow[]>([]);
const param1 = ref<string | null>(null);
const isShow = ref(false);
const newData1 = ref<TableRow[]>([]);
const compactData = ref<CompactDataItem[]>([]);

function tableRowKey(record: TableRow, index: number) {
  return String(record?.p2 ?? record?.p0 ?? index);
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
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
  const value = String(record.p4 ?? '');
  if (value && !NUMBER_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function onTable1P5Blur(record: TableRow, index: number) {
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function onTable1P6Blur(record: TableRow, index: number) {
  parameterTempList.value[0].tableMap!.rowData![index] = { ...record };
}

function updateEl() {
  nextTick(() => {
    changeNumber(1);
  });
}

function setLocalData() {
  data1.value = (parameterTempList.value[0].tableMap?.rowData ?? []) as TableRow[];
  data2.value = (parameterTempList.value[1].tableMap?.rowData ?? []) as TableRow[];
  param1.value = String(parameterTempList.value[2].defaultValue ?? '');
  compactData.value = [];
  for (let i = 3; i < 53; i += 1) {
    if (parameterTempList.value[i].defaultValue === undefined || parameterTempList.value[i].defaultValue === '') {
      break;
    }
    compactData.value.push({
      id: i - 2,
      labelName: `第${i - 2}路分支数量：`,
      typeKey: String(i - 2),
      modeTypeVal: parameterTempList.value[i].defaultValue,
      newModeTypeVal: parameterTempList.value[i].defaultValue,
    });
  }
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
    parameterTempList.value[1].tableMap.colStr = ['p0', 'p1', 'p2'];
  }
  parameterTempList.value[2].defaultValue = param1.value ?? '';
  for (let i = 3; i < 53; i += 1) {
    if (i - 3 < compactData.value.length) {
      parameterTempList.value[i].defaultValue = String(compactData.value[i - 3].newModeTypeVal ?? '');
    } else {
      parameterTempList.value[i].defaultValue = '';
    }
  }
}

function calculation() {
  const tableData1 = parameterTempList.value[0].tableMap?.rowData ?? [];
  for (let i = 0; i < Number(param1.value); i += 1) {
    const name = `第${i + 1}路`;
    let sumPower = 0;
    let val1 = 0;
    tableData1.forEach(item => {
      if (item.p0 == name) {
        sumPower += Number(item.p4);
        if (item.p3 != '' && item.p3 != undefined) {
          val1 = Number(item.p3);
        }
      }
    });
    const rowData2 = parameterTempList.value[1].tableMap?.rowData ?? [];
    if (rowData2[i]) {
      rowData2[i].p1 = handleCutZero(sumPower.toFixed(3));
      rowData2[i].p2 = handleCutZero(val1.toFixed(3));
    }
  }
  let sumPowerAll = 0;
  parameterTempList.value[1].tableMap?.rowData?.forEach(item => {
    if (item.p0 == '总低压直流输出功率') {
      item.p1 = handleCutZero(sumPowerAll.toFixed(3));
    } else {
      sumPowerAll += Number(item.p1);
    }
  });
}

function confirm() {
  param1.value = String(parameterTempList.value[2].defaultValue ?? '');
  data1.value = [];
  data2.value = [];
  let flag = false;
  const paramList = compactData.value;
  for (let i = 0; i < Number(param1.value); i += 1) {
    paramList.forEach(item => {
      if (i + 1 == item.id) {
        const paramLenght = item.newModeTypeVal;
        if (!POSITIVE_INT_REG.test(String(paramLenght))) {
          message.error(`第${i + 1}路分支数量有误，请输入正确的数字`);
          data1.value = [];
          flag = true;
        } else {
          flag = false;
          for (let j = 0; j < Number(paramLenght); j += 1) {
            data1.value.push({
              p0: `第${i + 1}路`,
              p1: `供电分支${j + 1}`,
              p2: `P${i + 1}-${j + 1}`,
              p3: '',
              p4: '',
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
            });
          }
        }
      }
    });
    if (!flag) {
      data2.value.push({
        p0: `第${i + 1}路低压直流功率`,
        p1: '',
        p2: '',
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
      });
    }
  }
  data2.value.push({
    p0: '总低压直流输出功率',
    p1: '',
    p2: '',
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
  });
  resetParameterTempList();
  setSaveBtnEnable();
}

function changeNumber(type: number) {
  setLocalData();
  compactData.value = [];
  if (type == 1) {
    if (param1.value) {
      if (!POSITIVE_INT_REG.test(String(param1.value))) {
        message.error('请输入整数');
      } else if (Number(param1.value) > 50) {
        message.error('不能大于50');
        return;
      } else {
        for (let i = 0; i < Number(param1.value); i += 1) {
          compactData.value.push({
            id: i + 1,
            labelName: `第${i + 1}路分支数量：`,
            typeKey: String(i + 1),
            modeTypeVal: parameterTempList.value[i + 3].defaultValue,
            newModeTypeVal: parameterTempList.value[i + 3].defaultValue,
          });
        }
      }
    }
  }
  setSaveBtnEnable();
  resetParameterTempList();
}

watch(isShow, val => {
  if (!val) {
    param1.value = '';
    data1.value = [];
    data2.value = [];
    compactData.value = [];
  }
});

onMounted(() => {
  newData1.value = data1.value;
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

.page2-wrapper {
  background: #ffffff;
  padding: 0 10px 16px;
  min-height: 100%;
  overflow: auto;
}

.page2-section {
  margin-bottom: 24px;
}

.page2-section__title {
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  padding: 0 10px;
  margin-bottom: 12px;
}

.page2-section__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
  margin-bottom: 8px;
}

.page2-section__subtitle {
  padding: 0 10px;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 22px;
}

.page2-params-row {
  padding: 0 10px;
}

.page2-branch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px 32px;
  padding: 0 10px;
}

.page2-branch-grid :deep(.ant-form) {
  display: contents;
}

.page2-actions {
  padding: 8px 10px 12px;
}

.page2-form-item {
  margin-bottom: 0;
}

.page2-form-item :deep(.ant-form-item-label > label) {
  height: auto;
  line-height: 32px;
}

.page2-input {
  width: 160px;
}

.page2-input--sm {
  width: 120px;
}

.page2-table-wrap {
  width: 100%;
  padding: 0 10px;
  overflow-x: auto;
}

.page2-table {
  width: 100%;
  min-width: 100%;
}

.page2-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}
</style>
