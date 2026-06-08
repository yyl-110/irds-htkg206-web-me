<template>
  <div v-if="alwaysVisible || parameterTempList[section.visibleParamIndex]?.defaultValue === '有'" class="cabinet-section">
    <a-divider v-if="showDivider" />
    <div class="cabinet-section__title">{{ section.label }}</div>

    <div class="cabinet-section__params">
      <div class="cabinet-section__col">
        <a-form-item label="柜体最大高：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-model:value="parameterTempList[param(section.paramStart)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
        </a-form-item>
        <a-form-item label="柜体最大宽：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-model:value="parameterTempList[param(section.paramStart + 2)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
        </a-form-item>
        <a-form-item label="柜体最大深：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-model:value="parameterTempList[param(section.paramStart + 4)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
        </a-form-item>
        <a-form-item label="最大质量：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-model:value="parameterTempList[param(section.paramStart + 6)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
        </a-form-item>
        <a-form-item
          label="高压直流母线电压范围(V)："
          :label-col="formLabelCol"
          class="cabinet-form-item cabinet-form-item--stacked">
          <div class="cabinet-field-stack">
            <a-input
              v-if="highVoltageEditable"
              v-model:value="parameterTempList[param(section.paramStart + 8)].defaultValue"
              class="cabinet-input"
              allow-clear
              @input="emitSave()" />
            <a-input
              v-else
              v-model:value="parameterTempList[param(section.paramStart + 8)].defaultValue"
              class="cabinet-input"
              disabled />
            <a-alert
              class="cabinet-note"
              type="success"
              message="注:交流输入、高压直流母线，高压直流输入、高压直流母线"
              show-icon />
          </div>
        </a-form-item>
      </div>

      <div class="cabinet-section__col">
        <a-form-item label="额定输入电压：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-model:value="parameterTempList[param(section.paramStart + 1)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
        </a-form-item>
        <a-form-item label="输入电压范围：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-model:value="parameterTempList[param(section.paramStart + 3)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
        </a-form-item>
        <a-form-item label="额定输入频率(Hz)：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-if="acBusOnlyEditable"
            v-model:value="parameterTempList[param(section.paramStart + 5)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
          <a-input
            v-else
            v-model:value="parameterTempList[param(section.paramStart + 5)].defaultValue"
            class="cabinet-input"
            disabled />
        </a-form-item>
        <a-form-item label="额定输入频率范围(Hz)：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-input
            v-if="acBusOnlyEditable"
            v-model:value="parameterTempList[param(section.paramStart + 7)].defaultValue"
            class="cabinet-input"
            allow-clear
            @input="emitSave()" />
          <a-input
            v-else
            v-model:value="parameterTempList[param(section.paramStart + 7)].defaultValue"
            class="cabinet-input"
            disabled />
        </a-form-item>
        <a-form-item
          label="低压直流母线电压范围(V)："
          :label-col="formLabelCol"
          class="cabinet-form-item cabinet-form-item--stacked">
          <div class="cabinet-field-stack">
            <a-input
              v-if="lowVoltageEditable"
              v-model:value="parameterTempList[param(section.paramStart + 9)].defaultValue"
              class="cabinet-input"
              allow-clear
              @input="emitSave()" />
            <a-input
              v-else
              v-model:value="parameterTempList[param(section.paramStart + 9)].defaultValue"
              class="cabinet-input"
              disabled />
            <a-alert class="cabinet-note" type="success" message="注:交流输入、交流母线" show-icon />
          </div>
        </a-form-item>
      </div>
    </div>

    <div class="cabinet-section__extra">
      <div class="cabinet-section__extra-grid">
        <a-form-item label="电气接口：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-textarea
            v-model:value="parameterTempList[param(section.paramStart + 10)].defaultValue"
            class="cabinet-textarea"
            :rows="2"
            @input="emitSave()" />
        </a-form-item>
        <a-form-item label="环境适应性要求：" :label-col="formLabelCol" class="cabinet-form-item">
          <a-textarea
            v-model:value="parameterTempList[param(section.paramStart + 12)].defaultValue"
            class="cabinet-textarea"
            :rows="2"
            @input="emitSave()" />
        </a-form-item>
        <a-form-item label="电气接口文件：" :label-col="formLabelCol" class="cabinet-form-item">
          <div class="cabinet-file-row">
            <a-input :value="electFileName" placeholder="请浏览上传..." class="cabinet-file-input" disabled />
            <a-upload
              :data="loginUserId"
              :multiple="false"
              :show-upload-list="false"
              :before-upload="beforeUpload"
              :action="actionUrl"
              @change="info => onUploadChange(info, 'elect')">
              <a-button type="primary">浏览</a-button>
            </a-upload>
            <a-button type="primary" :disabled="!electFileId" @click="emitDownload('elect')">下载</a-button>
          </div>
        </a-form-item>
        <a-form-item label="环境适应性文件：" :label-col="formLabelCol" class="cabinet-form-item">
          <div class="cabinet-file-row">
            <a-input :value="envFileName" placeholder="请浏览上传..." class="cabinet-file-input" disabled />
            <a-upload
              :data="loginUserId"
              :multiple="false"
              :show-upload-list="false"
              :before-upload="beforeUpload"
              :action="actionUrl"
              @change="info => onUploadChange(info, 'env')">
              <a-button type="primary">浏览</a-button>
            </a-upload>
            <a-button type="primary" :disabled="!envFileId" @click="emitDownload('env')">下载</a-button>
          </div>
        </a-form-item>
      </div>
      <a-form-item label="输出路数：" :label-col="formLabelCol" class="cabinet-form-item cabinet-form-item--route">
        <div class="cabinet-file-row">
          <a-input v-model:value="outputRouteCount" class="cabinet-input" allow-clear @blur="onRouteBlur" />
          <a-button type="primary" :disabled="!canConfirmRoute" @click="emitConfirm">确定</a-button>
        </div>
      </a-form-item>
    </div>

    <a-table
      :columns="OUTPUT_TABLE_COLUMNS"
      :data-source="tableData"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ x: 1022 }"
      :row-key="tableRowKey"
      class="page55-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="isNumericTableField(column.dataIndex)">
          <a-input
            v-model:value="record[String(column.dataIndex)]"
            class="table-cell-input"
            @blur="onNumericBlur(record, String(column.dataIndex), index)" />
        </template>
        <template v-else-if="isTextTableField(column.dataIndex)">
          <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="emitSave()" />
        </template>
        <template v-else-if="isSelectTableField(column.dataIndex)">
          <a-select
            v-model:value="record.p9"
            :options="VOLTAGE_CONTROL_OPTIONS"
            style="width: 100%"
            @change="emitSave()" />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import type { UploadChangeParam } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { computed } from 'vue';
import { HIGH_VOLTAGE_SUPPLY_TYPES, LOW_VOLTAGE_AC_SUPPLY_TYPE } from './cabinetConfig';
import type { CabinetSectionConfig, OutputTableRow, Page5_5ParameterItem } from './types';
import {
  NUMERIC_REG,
  OUTPUT_TABLE_COLUMNS,
  VOLTAGE_CONTROL_OPTIONS,
  isNumericTableField,
  isSelectTableField,
  isTextTableField,
} from './tableColumns';

const formLabelCol = { style: { width: '200px' } };

const props = defineProps<{
  section: CabinetSectionConfig;
  parameterTempList: Page5_5ParameterItem[];
  supplyType: string;
  actionUrl: string;
  loginUserId: { userId: string | number };
  electFileName: string;
  electFileId: string;
  envFileName: string;
  envFileId: string;
  beforeUpload: () => Promise<void> | void;
  alwaysVisible?: boolean;
  showDivider?: boolean;
}>();

const alwaysVisible = computed(() => props.alwaysVisible ?? false);
const showDivider = computed(() => props.showDivider ?? true);

const emit = defineEmits<{
  setSaveBtnEnable: [];
  confirm: [section: CabinetSectionConfig];
  changeNumber: [section: CabinetSectionConfig];
  uploadElect: [response: { data?: { id?: string; oldFileName?: string } }];
  uploadEnv: [response: { data?: { id?: string; oldFileName?: string } }];
  download: [kind: 'elect' | 'env', section: CabinetSectionConfig];
}>();

const param = (index: number) => index;

const tableData = computed(() => props.parameterTempList[props.section.tableIndex]?.tableMap?.rowData ?? []);

const highVoltageEditable = computed(() => HIGH_VOLTAGE_SUPPLY_TYPES.includes(props.supplyType));
const lowVoltageEditable = computed(() => props.supplyType === LOW_VOLTAGE_AC_SUPPLY_TYPE);
const acBusOnlyEditable = computed(() => props.supplyType === LOW_VOLTAGE_AC_SUPPLY_TYPE);

const outputRouteCount = computed({
  get: () => props.parameterTempList[props.section.outputRouteIndex]?.defaultValue ?? '',
  set: (value: string | number) => {
    if (props.parameterTempList[props.section.outputRouteIndex]) {
      props.parameterTempList[props.section.outputRouteIndex].defaultValue = String(value ?? '');
    }
  },
});

const canConfirmRoute = computed(() => {
  const count = Number(outputRouteCount.value);
  return count > 0 && count <= 15;
});

function tableRowKey(record: OutputTableRow, index: number) {
  return String(record.p0 ?? index);
}

function emitSave() {
  emit('setSaveBtnEnable');
}

function emitConfirm() {
  emit('confirm', props.section);
}

function onRouteBlur() {
  emit('changeNumber', props.section);
}

function onNumericBlur(record: OutputTableRow, field: string, index: number) {
  const value = String(record[field] ?? '');
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  const rows = props.parameterTempList[props.section.tableIndex]?.tableMap?.rowData;
  if (rows?.[index]) {
    rows[index] = { ...record };
  }
  emitSave();
}

function onUploadChange(info: UploadChangeParam, kind: 'elect' | 'env') {
  if (info.file.status !== 'done') return;
  const response = info.file.response as { data?: { id?: string; oldFileName?: string } } | undefined;
  if (!response) return;
  if (kind === 'elect') {
    emit('uploadElect', response);
  } else {
    emit('uploadEnv', response);
  }
}

function emitDownload(kind: 'elect' | 'env') {
  emit('download', kind, props.section);
}
</script>

<style scoped>
.cabinet-section {
  margin-top: 8px;
}

.cabinet-section__title {
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.88);
}

.cabinet-section__params {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 48px;
  margin-bottom: 16px;
}

.cabinet-section__extra {
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.cabinet-section__extra-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 48px;
}

.cabinet-form-item--route {
  margin-top: 4px;
  margin-bottom: 0;
}

.cabinet-section__col {
  min-width: 0;
}

.cabinet-form-item {
  margin-bottom: 12px;
}

.cabinet-form-item :deep(.ant-form-item-label) {
  flex: 0 0 200px;
  max-width: 200px;
}

.cabinet-form-item :deep(.ant-form-item-label > label) {
  height: auto;
  line-height: 1.5;
  white-space: normal;
}

.cabinet-form-item :deep(.ant-form-item-control-input-content) {
  min-height: 32px;
  display: flex;
  align-items: center;
}

.cabinet-form-item--stacked :deep(.ant-form-item-control-input-content) {
  align-items: flex-start;
}

.cabinet-input {
  width: 160px;
}

.cabinet-textarea {
  width: 100%;
  max-width: 420px;
}

.cabinet-field-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.cabinet-note {
  width: 100%;
  max-width: 360px;
  margin: 0;
}

.cabinet-note :deep(.ant-alert-message) {
  font-size: 12px;
  line-height: 1.5;
}

.cabinet-file-row {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
}

.cabinet-file-input {
  flex: 1;
  min-width: 160px;
  max-width: 280px;
}

.page55-table {
  width: 100%;
  z-index: 0;
}

.page55-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}
</style>
