<template>
  <div>
    <div class="layout-wrapper" style="padding: 10px 10px; min-height: 680px; background-color: #ffffff">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div style="width: 100%; font-weight: 600; padding-left: 10px; height: 120px">
            <div style="width: auto">设计输入：</div>
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="柜体最大高尺寸:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input v-model:value="parameterTempList[0].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
              <a-form-item
                label="柜体最大深:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 120px">
                <a-input v-model:value="parameterTempList[1].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </div>
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="柜体最大宽:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input v-model:value="parameterTempList[2].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
              <a-form-item
                label="额定输入电压(V):"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 120px">
                <a-input v-model:value="parameterTempList[22].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </div>
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="输出路数:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input v-model:value="parameterTempList[23].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
              <a-form-item
                label="输入电压范围(V):"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 120px">
                <a-input v-model:value="parameterTempList[24].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </div>
          </div>

          <div style="width: 100%; font-weight: 600; padding-left: 10px; height: 120px; margin-top: 15px">
            <div style="width: auto">柜体尺寸：</div>
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="插箱高度(U)和:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input v-model:value="parameterTempList[3].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
              <a-form-item
                label="插箱最大宽:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 120px">
                <a-input v-model:value="parameterTempList[6].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </div>
            <div style="width: 100%; float: left; height: 47px">
              <a-form-item
                label="走线空间:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px">
                <a-input
                  v-model:value="parameterTempList[4].defaultValue"
                  style="width: 100px"
                  allow-clear
                  @blur="onWiringSpaceBlur" />
              </a-form-item>
              <a-form-item
                label="插箱最大深:"
                :label-col="{ style: { width: '115px' } }"
                style="float: left; margin-bottom: 10px; margin-left: 120px">
                <a-input v-model:value="parameterTempList[25].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </div>
          </div>

          <div style="width: 100%; font-weight: 600; float: left; height: 47px">
            <a-form-item
              label="柜体深(计算值):"
              :label-col="{ style: { width: '115px' } }"
              style="float: left; margin-bottom: 10px; margin-left: 10px">
              <a-input v-model:value="parameterTempList[5].defaultValue" style="width: 100px" allow-clear disabled />
            </a-form-item>
            <a-form-item
              label="机柜出线方式:"
              :label-col="{ style: { width: '115px' } }"
              style="float: left; margin-bottom: 10px; margin-left: 120px">
              <a-select v-model:value="parameterTempList[20].defaultValue" style="width: 100px" @change="setSaveBtnEnable()">
                <a-select-option
                  v-for="item in parameterTempList[20].selectStrVal ?? []"
                  :key="item.label"
                  :value="item.label">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <section class="page52-section">
            <div class="page52-section__title">
              查询标准柜体：
              <a-button type="primary" class="btnSty" @click="browserRowData">浏览</a-button>
            </div>
            <div class="page52-table-wrap">
              <a-table
                :columns="STANDARD_CABINET_COLUMNS"
                :data-source="standardTableData"
                :pagination="false"
                bordered
                size="small"
                :scroll="{ x: STANDARD_CABINET_MIN_WIDTH }"
                :row-key="standardRowKey"
                :row-selection="standardRowSelection"
                class="page52-table" />
            </div>
          </section>

          <section class="page52-section">
            <div class="page52-section__title">复合柜体尺寸：</div>
            <div class="page52-table-wrap">
              <a-table
                :columns="COMPOSITE_SIZE_COLUMNS"
                :data-source="compositeTableData"
                :pagination="false"
                bordered
                size="small"
                :scroll="{ x: COMPOSITE_SIZE_MIN_WIDTH }"
                :row-key="compositeRowKey"
                class="page52-table">
                <template #bodyCell="{ column, record }">
                  <template v-if="isCompositeCompareField(column.dataIndex)">
                    <span
                      :class="{
                        'composite-over': isCompositeOverLimit(String(column.dataIndex), record, compositeTableData),
                      }">
                      {{ record[String(column.dataIndex)] }}
                    </span>
                  </template>
                </template>
              </a-table>
            </div>
          </section>

          <section class="page52-section">
            <div class="page52-section__title">确认柜体尺寸：</div>
            <div class="page52-confirm-grid">
              <a-form-item label="柜体高度(U)：" :label-col="formLabelCol" class="page52-form-item">
                <a-input v-model:value="parameterTempList[9].defaultValue" class="page52-input" allow-clear disabled />
              </a-form-item>
              <a-form-item label="柜体内腔高H2(计算)：" :label-col="formLabelCol" class="page52-form-item">
                <div class="page52-field-row">
                  <a-input v-model:value="parameterTempList[10].defaultValue" class="page52-input" allow-clear disabled />
                  <span class="page52-hint">等于n*44.45</span>
                </div>
              </a-form-item>

              <a-form-item label="上框高HS：" :label-col="formLabelCol" class="page52-form-item">
                <a-input
                  v-model:value="parameterTempList[13].defaultValue"
                  class="page52-input"
                  allow-clear
                  @blur="onFrameBlur" />
              </a-form-item>
              <a-form-item label="余量间隙(计算)(mm)：" :label-col="formLabelCol" class="page52-form-item">
                <div class="page52-field-row">
                  <a-input
                    v-model:value="parameterTempList[12].defaultValue"
                    :class="{ 'input-call': colorFlag }"
                    class="page52-input"
                    allow-clear
                    disabled />
                  <span class="page52-hint">等于H2设计-H2计算 推荐在1.4~3.2之间</span>
                </div>
              </a-form-item>

              <a-form-item label="下框高HX：" :label-col="formLabelCol" class="page52-form-item">
                <a-input
                  v-model:value="parameterTempList[11].defaultValue"
                  class="page52-input"
                  allow-clear
                  @blur="onFrameBlur" />
              </a-form-item>
              <a-form-item label="柜体内腔高H2(设计)：" :label-col="formLabelCol" class="page52-form-item">
                <div class="page52-field-row">
                  <a-input
                    v-model:value="parameterTempList[14].defaultValue"
                    class="page52-input"
                    allow-clear
                    @blur="onDesignH2Blur" />
                  <span class="page52-hint">按照H2计算填写</span>
                </div>
              </a-form-item>

              <a-form-item label="柜体深：" :label-col="formLabelCol" class="page52-form-item">
                <a-input
                  v-model:value="parameterTempList[15].defaultValue"
                  class="page52-input"
                  allow-clear
                  @input="setSaveBtnEnable()" />
              </a-form-item>
              <a-form-item label="柜体高H1(设计)：" :label-col="formLabelCol" class="page52-form-item">
                <div class="page52-field-row">
                  <a-input v-model:value="parameterTempList[16].defaultValue" class="page52-input" allow-clear disabled />
                  <span class="page52-hint">柜体内腔高H2(设计)(mm)+上下框+5</span>
                </div>
              </a-form-item>

              <a-form-item label="柜体宽：" :label-col="formLabelCol" class="page52-form-item">
                <a-input
                  v-model:value="parameterTempList[17].defaultValue"
                  class="page52-input"
                  allow-clear
                  @input="setSaveBtnEnable()" />
              </a-form-item>
              <a-form-item label="背部减震器间距：" :label-col="formLabelCol" class="page52-form-item">
                <a-input
                  v-model:value="parameterTempList[26].defaultValue"
                  class="page52-input"
                  allow-clear
                  @input="setSaveBtnEnable()" />
              </a-form-item>

              <a-form-item label="底部减震器间距(横向)：" :label-col="formLabelCol" class="page52-form-item">
                <a-input
                  v-model:value="parameterTempList[28].defaultValue"
                  class="page52-input"
                  allow-clear
                  @input="setSaveBtnEnable()" />
              </a-form-item>
              <a-form-item label="底部减震器间距(纵向)：" :label-col="formLabelCol" class="page52-form-item">
                <a-input
                  v-model:value="parameterTempList[27].defaultValue"
                  class="page52-input"
                  allow-clear
                  @input="setSaveBtnEnable()" />
              </a-form-item>

              <a-form-item label="机柜备注：" :label-col="formLabelCol" class="page52-form-item page52-form-item--full">
                <a-textarea
                  v-model:value="parameterTempList[21].defaultValue"
                  class="page52-textarea"
                  @input="setSaveBtnEnable()" />
              </a-form-item>

              <a-form-item label="模板文件名：" :label-col="formLabelCol" class="page52-form-item page52-form-item--full">
                <a-input
                  v-model:value="parameterTempList[18].defaultValue"
                  class="page52-input--wide"
                  allow-clear
                  disabled />
              </a-form-item>

              <a-form-item label="新模型文件名：" :label-col="formLabelCol" class="page52-form-item page52-form-item--full">
                <div class="page52-field-row">
                  <a-input
                    v-model:value="parameterTempList[19].defaultValue"
                    class="page52-input--wide"
                    allow-clear
                    @input="setSaveBtnEnable()" />
                  <a-button type="primary" class="btnSty" @click="makeModuleByTemplate">生成模型</a-button>
                  <a-button type="primary" class="btnSty" @click="regenModule">再生模型</a-button>
                </div>
              </a-form-item>
            </div>
          </section>
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
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { computed, getCurrentInstance, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import ModuleDataSelect from '@/views/product/activityPage/components/module-data-select.vue';
import { getFlowModuleid, isValid } from '@/api/flowData/flowData';
import { FlowSynchronizeChildrenModels, openTopAsmTemplateInterfaceModel, parameterInFirstCsys } from '@/libs/webSocket';
import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';
import {
  cloneParameterList,
  initCustomizedProcessPage7Data5_2D,
  SELECT_TABLE_NUM,
  type CabinetTableRow,
  type Page5_2ParameterItem,
} from './Process7-page5-2D/parameterDefaults';
import {
  applyModuleBrowseResult,
  applyUpdateElDefaults,
  buildModelParametersStr,
  calcCabinetDepth,
  calcCabinetHeightH1,
  calcGapAndColor,
  isCompositeOverLimit,
  syncCompositeStandardRow,
  type ModuleOkPayload,
} from './Process7-page5-2/rowOperations';
import {
  COMPOSITE_COMPARE_FIELDS,
  COMPOSITE_SIZE_COLUMNS,
  COMPOSITE_SIZE_MIN_WIDTH,
  STANDARD_CABINET_COLUMNS,
  STANDARD_CABINET_MIN_WIDTH,
} from './Process7-page5-2/tableColumns';

const formLabelCol = { style: { width: '200px' } };

defineOptions({ name: 'customizedProcess7-page5-2D' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page5_2ParameterItem[];
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
function createInitialParameterList(): Page5_2ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_2D(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page5_2ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });



const standardTableData = computed(() => parameterTempList.value[7]?.tableMap?.rowData ?? []);
const compositeTableData = computed(() => parameterTempList.value[8]?.tableMap?.rowData ?? []);

const selectList = ref<CabinetTableRow[]>([]);
const selectedRowKeys = ref<Key[]>([]);
const moduleDataFlag = ref(false);
const modulecategoryid = ref('');
const selectRow = ref(0);
const colorFlag = ref(false);

const moduleDataSelectRef = ref<{ initData: (categoryId: string, pageStr: string) => void } | null>(null);

const standardRowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (_keys: Key[], rows: CabinetTableRow[]) => {
    selectList.value = rows;
    selectedRowKeys.value = rows.map((row, idx) => standardRowKey(row, idx));
  },
}));

function standardRowKey(record: CabinetTableRow, index: number) {
  return String(record.p0 ?? index);
}

function compositeRowKey(record: CabinetTableRow, index: number) {
  return String(record.p0 ?? index);
}

function isCompositeCompareField(dataIndex: unknown) {
  return COMPOSITE_COMPARE_FIELDS.includes(String(dataIndex));
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

function onWiringSpaceBlur() {
  calcCabinetDepth(parameterTempList.value);
  setSaveBtnEnable();
}

function onDesignH2Blur() {
  const designH2 = String(parameterTempList.value[14]?.defaultValue ?? '');
  colorFlag.value = calcGapAndColor(parameterTempList.value, designH2);
  calcCabinetHeightH1(parameterTempList.value);
  setSaveBtnEnable();
}

function onFrameBlur() {
  calcCabinetHeightH1(parameterTempList.value);
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {

    applyUpdateElDefaults(parameterTempList.value);
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

async function browserRowData() {
  if (!selectList.value.length) {
    message.info('请选择浏览行');
    return;
  }
  if (selectList.value.length !== 1) {
    message.info('请只选择一个浏览行');
    return;
  }

  if (!isValid(modulecategoryid.value)) {
    const response: { code?: string; data?: { data?: string } } = await getFlowModuleid({ moduleName: '机柜柜体(C)' });
    if (!response || response.code !== '0') {
      message.info('获取模型库id失败');
      return;
    }
    modulecategoryid.value = response.data?.data ?? '';
  }

  const rowData = parameterTempList.value[7].tableMap?.rowData ?? [];
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
  applyModuleBrowseResult(parameterTempList.value, selectRow.value, payload, SELECT_TABLE_NUM);
  syncCompositeStandardRow(parameterTempList.value);
  moduleDataFlag.value = false;
  setSaveBtnEnable();
}

function moduleCancel() {
  moduleDataFlag.value = false;
}

function makeModuleByTemplate() {
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  const parametersStr = buildModelParametersStr(parameterTempList.value, 4, 28);
  const newModuleNum = String(parameterTempList.value[19]?.defaultValue ?? '');
  const tempNum = String(parameterTempList.value[18]?.defaultValue ?? '');
  const tempNumS = tempNum.split('.');
  if (tempNumS.length === 2) {
    void openTopAsmTemplateInterfaceModel(instance, tempNumS[0], tempNumS[1], newModuleNum, '', parametersStr);
  }
}

async function regenModule() {
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  const parametersStr = buildModelParametersStr(parameterTempList.value, 4, 28);
  const response = await FlowSynchronizeChildrenModels(instance, '');
  if (!response) {
    message.info('通讯异常');
    return;
  }
  if (response.ReturnStatus !== 0) {
    message.info('遇到了错误');
    return;
  }

  const models = response.Models;
  if (!models?.length) {
    message.info('未找到被装配模型');
    return;
  }

  const distinctModels = (models as Array<{ ModelName?: string; ModelType?: string }>).filter(
    (element, index, self) =>
      self.findIndex(x => x.ModelName === element.ModelName && x.ModelType === element.ModelType) === index,
  );

  for (let i = 0; i < distinctModels.length; i += 1) {
    await parameterInFirstCsys(distinctModels[i].ModelName, distinctModels[i].ModelType, parametersStr);
  }
}

onMounted(() => {
  if (props.parameterTempList?.length) {
    updateEl();
  }
});

defineExpose({
  updateEl,
  setSaveBtnEnable,
});
</script>

<style scoped>
.layout-content {
  background: #ffffff;
}

.page52-section {
  margin-top: 16px;
  padding: 0 10px;
}

.page52-section__title {
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.88);
}

.page52-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.page52-table {
  width: 100%;
  min-width: 100%;
}

.page52-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.page52-confirm-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 48px;
}

.page52-form-item {
  margin-bottom: 0;
}

.page52-form-item--full {
  grid-column: 1 / -1;
}

.page52-form-item :deep(.ant-form-item-label) {
  flex: 0 0 200px;
  max-width: 200px;
}

.page52-form-item :deep(.ant-form-item-label > label) {
  height: auto;
  line-height: 1.5;
  white-space: normal;
}

.page52-form-item :deep(.ant-form-item-control-input-content) {
  min-height: 32px;
  display: flex;
  align-items: center;
}

.page52-field-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.page52-input {
  width: 160px;
}

.page52-input--wide {
  width: 360px;
}

.page52-textarea {
  width: 100%;
  max-width: 640px;
}

.page52-hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  line-height: 1.5;
}

.composite-over {
  color: #ea0b0b;
}

.input-call :deep(input) {
  color: red !important;
}
</style>
