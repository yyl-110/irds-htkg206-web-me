<template>
  <div class="dyjg-page">
    <div class="dyjg-section__title">{{ title }}</div>

    <div class="dyjg-section__params">
      <div class="dyjg-section__col">
        <a-form-item
          v-for="field in DYJG_LEFT_FIELDS"
          :key="field.index"
          :label="field.label"
          :label-col="formLabelCol"
          class="dyjg-form-item">
          <div class="dyjg-field-row">
            <a-input
              v-model:value="parameterTempList[field.index].defaultValue"
              class="dyjg-input"
              allow-clear
              disabled
              @input="emit('setSaveBtnEnable')" />
            <GlobalValueSyncIcon
              :item="parameterTempList[field.index]"
              @apply-global="emit('setSaveBtnEnable')"
              @resolved="emit('setSaveBtnEnable')" />
          </div>
        </a-form-item>
      </div>

      <div class="dyjg-section__col">
        <a-form-item
          v-for="field in DYJG_RIGHT_FIELDS"
          :key="field.index"
          :label="field.label"
          :label-col="formLabelCol"
          class="dyjg-form-item">
          <div class="dyjg-field-row">
            <a-input
              v-model:value="parameterTempList[field.index].defaultValue"
              class="dyjg-input"
              allow-clear
              disabled
              @input="emit('setSaveBtnEnable')" />
            <GlobalValueSyncIcon
              :item="parameterTempList[field.index]"
              @apply-global="emit('setSaveBtnEnable')"
              @resolved="emit('setSaveBtnEnable')" />
          </div>
        </a-form-item>
      </div>
    </div>

    <div class="dyjg-section__extra">
      <div class="dyjg-section__extra-grid">
        <a-form-item label="电气接口：" :label-col="formLabelCol" class="dyjg-form-item">
          <div class="dyjg-field-row dyjg-field-row--block">
            <a-textarea
              v-model:value="parameterTempList[10].defaultValue"
              class="dyjg-textarea"
              :rows="2"
              disabled
              @input="emit('setSaveBtnEnable')" />
            <GlobalValueSyncIcon
              :item="parameterTempList[10]"
              @apply-global="emit('setSaveBtnEnable')"
              @resolved="emit('setSaveBtnEnable')" />
          </div>
        </a-form-item>

        <a-form-item label="环境适应性要求：" :label-col="formLabelCol" class="dyjg-form-item">
          <div class="dyjg-field-row dyjg-field-row--block">
            <a-textarea
              v-model:value="parameterTempList[12].defaultValue"
              class="dyjg-textarea"
              :rows="2"
              disabled
              @input="emit('setSaveBtnEnable')" />
            <GlobalValueSyncIcon
              :item="parameterTempList[12]"
              @apply-global="emit('setSaveBtnEnable')"
              @resolved="emit('setSaveBtnEnable')" />
          </div>
        </a-form-item>

        <a-form-item label="电气接口文件：" :label-col="formLabelCol" class="dyjg-form-item">
          <div class="dyjg-file-row">
            <a-input v-model:value="electFile.fileName" class="dyjg-file-input" allow-clear disabled />
            <GlobalValueSyncIcon
              :item="parameterTempList[ELECT_FILE_INDEX]"
              @apply-global="emit('setSaveBtnEnable')"
              @resolved="emit('syncFiles')" />
            <a-button type="primary" :disabled="!electFile.fileId" @click="emit('downFile', '1')">下载</a-button>
          </div>
        </a-form-item>

        <a-form-item label="环境适应性文件：" :label-col="formLabelCol" class="dyjg-form-item">
          <div class="dyjg-file-row">
            <a-input v-model:value="envFile.fileName" class="dyjg-file-input" allow-clear disabled />
            <GlobalValueSyncIcon
              :item="parameterTempList[ENV_FILE_INDEX]"
              @apply-global="emit('setSaveBtnEnable')"
              @resolved="emit('syncFiles')" />
            <a-button type="primary" :disabled="!envFile.fileId" @click="emit('downFile', '2')">下载</a-button>
          </div>
        </a-form-item>
      </div>

      <a-form-item label="输出路数：" :label-col="formLabelCol" class="dyjg-form-item dyjg-form-item--route">
        <div class="dyjg-file-row">
          <a-input
            v-model:value="parameterTempList[OUTPUT_ROUTE_INDEX].defaultValue"
            class="dyjg-input"
            allow-clear
            disabled />
          <GlobalValueSyncIcon
            :item="parameterTempList[OUTPUT_ROUTE_INDEX]"
            @apply-global="emit('setSaveBtnEnable')"
            @resolved="emit('setSaveBtnEnable')" />
          <a-button type="primary" @click="emit('initData')">更新数据</a-button>
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
      class="dyjg-table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'p9'">
          {{ formatVoltageControlLabel(record.p9) }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import GlobalValueSyncIcon from '../shared/process7/GlobalValueSyncIcon.vue';
import { OUTPUT_TABLE_COLUMNS } from '../Process7-page5-5/tableColumns';
import type { OutputTableRow } from '../Process7-page5-5/types';
import { formatVoltageControlLabel } from './rowOperations';
import {
  DYJG_LEFT_FIELDS,
  DYJG_RIGHT_FIELDS,
  ELECT_FILE_INDEX,
  ENV_FILE_INDEX,
  OUTPUT_ROUTE_INDEX,
  type DyjgParameterItem,
} from './types';

const formLabelCol = { style: { width: '200px' } };

defineProps<{
  title: string;
  parameterTempList: DyjgParameterItem[];
  electFile: { fileName: string; fileId: string };
  envFile: { fileName: string; fileId: string };
  tableData: OutputTableRow[];
}>();

const emit = defineEmits<{
  setSaveBtnEnable: [];
  syncFiles: [];
  downFile: [type: '1' | '2'];
  initData: [];
}>();

function tableRowKey(record: OutputTableRow, index: number) {
  return String(record.p0 ?? index);
}
</script>

<style scoped>
.dyjg-page {
  min-height: 680px;
  margin-top: 20px;
  padding: 20px 16px;
  background-color: #ffffff;
}

.dyjg-section__title {
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.88);
}

.dyjg-section__params {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 48px;
  margin-bottom: 16px;
}

.dyjg-section__extra {
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.dyjg-section__extra-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 48px;
}

.dyjg-form-item {
  margin-bottom: 12px;
}

.dyjg-form-item :deep(.ant-form-item-label) {
  flex: 0 0 200px;
  max-width: 200px;
}

.dyjg-form-item :deep(.ant-form-item-label > label) {
  height: auto;
  line-height: 1.5;
  white-space: normal;
}

.dyjg-form-item :deep(.ant-form-item-control-input-content) {
  min-height: 32px;
}

.dyjg-form-item--route {
  margin-top: 4px;
  margin-bottom: 0;
}

.dyjg-field-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dyjg-field-row--block {
  align-items: flex-start;
  width: 100%;
}

.dyjg-input {
  width: 160px;
}

.dyjg-textarea {
  width: 100%;
  max-width: 420px;
}

.dyjg-file-row {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
}

.dyjg-file-input {
  flex: 1;
  min-width: 160px;
  max-width: 280px;
}

.dyjg-table {
  width: 100%;
  z-index: 0;
}

.dyjg-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
</style>
