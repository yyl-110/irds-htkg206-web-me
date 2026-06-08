<template>
  <div v-if="alwaysVisible || parameterTempList[section.visibleParamIndex]?.defaultValue === '有'">
    <a-divider v-if="showDivider" />
    <div style="width: 20%; height: 100%">{{ section.label }}：</div>
    <div style="height: 100%; float: left; padding-top: 25px">
      <a-form-item label="柜体最大高：" :label-col="{ style: { width: '160px' } }">
        <a-input v-model:value="parameterTempList[param(section.paramStart)].defaultValue" style="width: 100px" allow-clear @input="emitSave()" />
      </a-form-item>
      <a-form-item label="柜体最大宽：" :label-col="{ style: { width: '160px' } }">
        <a-input v-model:value="parameterTempList[param(section.paramStart + 2)].defaultValue" style="width: 100px" allow-clear @input="emitSave()" />
      </a-form-item>
      <a-form-item label="柜体最大深：" :label-col="{ style: { width: '160px' } }">
        <a-input v-model:value="parameterTempList[param(section.paramStart + 4)].defaultValue" style="width: 100px" allow-clear @input="emitSave()" />
      </a-form-item>
      <a-form-item label="最大质量：" :label-col="{ style: { width: '160px' } }">
        <a-input v-model:value="parameterTempList[param(section.paramStart + 6)].defaultValue" style="width: 100px" allow-clear @input="emitSave()" />
      </a-form-item>
      <a-form-item label="高压直流母线电压范围(V)：" :label-col="{ style: { width: '160px' } }" style="float: left; margin-bottom: 10px">
        <a-input
          v-if="highVoltageEditable"
          v-model:value="parameterTempList[param(section.paramStart + 8)].defaultValue"
          style="width: 100px"
          allow-clear
          @input="emitSave()" />
        <a-input v-else v-model:value="parameterTempList[param(section.paramStart + 8)].defaultValue" style="width: 100px" disabled />
        <span class="rx-knowledge-wrap">
          <a-alert type="success" message="注:交流输入、高压直流母线，高压直流输入、高压直流母线" show-icon style="margin-top: 4px" />
        </span>
      </a-form-item>
    </div>
    <div style="width: 50%; height: 100%; float: left; padding-top: 25px; padding-left: 110px">
      <a-form-item label="额定输入电压：" :label-col="{ style: { width: '160px' } }">
        <a-input v-model:value="parameterTempList[param(section.paramStart + 1)].defaultValue" style="width: 100px" allow-clear @input="emitSave()" />
      </a-form-item>
      <a-form-item label="输入电压范围：" :label-col="{ style: { width: '160px' } }">
        <a-input v-model:value="parameterTempList[param(section.paramStart + 3)].defaultValue" style="width: 100px" allow-clear @input="emitSave()" />
      </a-form-item>
      <a-form-item label="额定输入频率(Hz)：" :label-col="{ style: { width: '160px' } }">
        <a-input
          v-if="acBusOnlyEditable"
          v-model:value="parameterTempList[param(section.paramStart + 5)].defaultValue"
          style="width: 100px"
          allow-clear
          @input="emitSave()" />
        <a-input v-else v-model:value="parameterTempList[param(section.paramStart + 5)].defaultValue" style="width: 100px" disabled />
      </a-form-item>
      <a-form-item label="额定输入频率范围(Hz)：" :label-col="{ style: { width: '160px' } }">
        <a-input
          v-if="acBusOnlyEditable"
          v-model:value="parameterTempList[param(section.paramStart + 7)].defaultValue"
          style="width: 100px"
          allow-clear
          @input="emitSave()" />
        <a-input v-else v-model:value="parameterTempList[param(section.paramStart + 7)].defaultValue" style="width: 100px" disabled />
      </a-form-item>
      <a-form-item label="低压直流母线电压范围(V)：" :label-col="{ style: { width: '160px' } }">
        <a-input
          v-if="lowVoltageEditable"
          v-model:value="parameterTempList[param(section.paramStart + 9)].defaultValue"
          style="width: 100px"
          allow-clear
          @input="emitSave()" />
        <a-input v-else v-model:value="parameterTempList[param(section.paramStart + 9)].defaultValue" style="width: 100px" disabled />
        <span class="rx-knowledge-wrap">
          <a-alert type="success" message="注:交流输入、交流母线" show-icon style="margin-top: 4px" />
        </span>
      </a-form-item>
    </div>
    <div style="width: 44%; height: 100%; float: left; padding-top: 25px">
      <a-form-item label="电气接口：" :label-col="{ style: { width: '160px' } }">
        <a-textarea v-model:value="parameterTempList[param(section.paramStart + 10)].defaultValue" style="width: 300px" @input="emitSave()" />
      </a-form-item>
      <a-form-item :label-col="{ style: { width: '160px' } }">
        <a-input :value="electFileName" placeholder="请浏览上传..." allow-clear style="width: 135px" disabled />
        <div style="padding-left: 12px; display: inline-block">
          <a-upload
            :data="loginUserId"
            :multiple="false"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :action="actionUrl"
            @change="info => onUploadChange(info, 'elect')">
            <a-button type="primary">浏览</a-button>
          </a-upload>
        </div>
        <a-button type="primary" style="margin-left: 10px" :disabled="!electFileId" @click="emitDownload('elect')">下载</a-button>
      </a-form-item>
      <a-form-item label="环境适应性要求：" :label-col="{ style: { width: '160px' } }">
        <a-textarea v-model:value="parameterTempList[param(section.paramStart + 12)].defaultValue" style="width: 300px" @input="emitSave()" />
      </a-form-item>
      <a-form-item :label-col="{ style: { width: '160px' } }">
        <a-input :value="envFileName" placeholder="请浏览上传..." allow-clear style="width: 135px" disabled />
        <div style="padding-left: 12px; display: inline-block">
          <a-upload
            :data="loginUserId"
            :multiple="false"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :action="actionUrl"
            @change="info => onUploadChange(info, 'env')">
            <a-button type="primary">浏览</a-button>
          </a-upload>
        </div>
        <a-button type="primary" style="margin-left: 10px" :disabled="!envFileId" @click="emitDownload('env')">下载</a-button>
      </a-form-item>
      <a-form-item label="输出路数：" :label-col="{ style: { width: '160px' } }">
        <a-input
          v-model:value="outputRouteCount"
          style="width: 100px"
          allow-clear
          @blur="onRouteBlur" />
        <a-button type="primary" style="margin-left: 10px" :disabled="!canConfirmRoute" @click="emitConfirm">确定</a-button>
      </a-form-item>
    </div>
    <div style="width: 100%; float: left">
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
.page55-table {
  width: 100%;
  z-index: 0;
}
.page55-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
.table-cell-input {
  text-align: center;
}
</style>
