<template>
  <div class="adapter-page">
    <div class="adapter-page__title">{{ pageConfig.title }}</div>
    <div class="adapter-page__body">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol" class="adapter-page__form">
        <div class="adapter-page__form-grid">
          <div class="adapter-page__form-col">
            <a-form-item v-for="field in formLeftFields" :key="field.index" :label="field.label">
              <a-input
                v-model:value="parameterTempList[field.index].defaultValue"
                :type="field.type ?? 'text'"
                class="field-input"
                :disabled="field.disabled"
                @blur="setSaveBtnEnable()" />
            </a-form-item>
          </div>
          <div class="adapter-page__form-col adapter-page__form-col--wide">
            <a-form-item
              v-for="field in formRightFields"
              :key="field.index"
              :label="field.label"
              :label-col="formLabelColWide">
              <a-input
                v-model:value="parameterTempList[field.index].defaultValue"
                :type="field.type ?? 'text'"
                class="field-input"
                :disabled="field.disabled"
                @blur="setSaveBtnEnable()" />
            </a-form-item>
          </div>
        </div>
      </a-form>

      <div class="adapter-page__toolbar">
        <a-space :size="12">
          <a-button type="primary" @click="handleAddRow">添加行</a-button>
          <a-button type="primary" :disabled="assemblingFlag" @click="handleAssembleModule">装配</a-button>
          <a-button type="primary" :disabled="assemblingFlag" @click="handleRegenModel">再生模型</a-button>
          <a-button danger :disabled="deleteDisabled" @click="handleDeleteRow">删除</a-button>
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
        class="adapter-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolveColumn(column)?.cellMode === 'select'">
            <a-select
              v-model:value="record.p1"
              class="table-cell-select"
              :options="typeOptions.map(item => ({ value: item.label, label: item.label }))"
              @change="(value: string) => handleTypeChange(record, value)" />
          </template>
          <template v-else-if="resolveColumn(column)?.cellMode === 'number'">
            <a-input-number
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
              @input="setSaveBtnEnable()" />
          </template>
          <template v-else-if="resolveColumn(column)?.cellMode === 'editable'">
            <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ADAPTER_PAGE_CONFIG } from './FS1_12_1_2B/config';
import { useAdapterPage } from './FS1_12_1_2/_common/useAdapterPage';
import type { AdapterParameterItem } from './FS1_12_1_2/_common/parameterDefaults';

defineOptions({ name: 'customizedProcess3-FS1-12-1-2B' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    pageid?: string;
    parameterTempList?: AdapterParameterItem[];
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

const {
  pageConfig,
  tabHeight,
  formLabelCol,
  formLabelColWide,
  tableColumns,
  formLeftFields,
  formRightFields,
  typeOptions,
  parameterTempList,
  tableRows,
  assemblingFlag,
  deleteDisabled,
  rowSelection,
  resolveColumn,
  tableRowKey,
  setSaveBtnEnable,
  handleNumberBlur,
  handleTypeChange,
  handleAddRow,
  handleDeleteRow,
  handleAssembleModule,
  handleRegenModel,
  updateEl,
  getCurrentSaveParamValues,
} = useAdapterPage(ADAPTER_PAGE_CONFIG, props, emit);

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});
</script>

<style scoped>
.adapter-page {
  min-height: 100%;
  padding: 10px 10px 24px;
  overflow: auto;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.adapter-page__title {
  margin: 0 10px 10px;
  padding-bottom: 5px;
  height: 35px;
  font-size: 15px;
  font-weight: 600;
}

.adapter-page__body {
  margin-left: 50px;
}

.adapter-page__form-grid {
  display: flex;
  gap: 40px;
  min-height: calc(100vh - 400px);
  padding: 10px 15px 0;
}

.adapter-page__form-col {
  width: 350px;
}

.adapter-page__form-col--wide {
  width: 400px;
}

.adapter-page__toolbar {
  width: 930px;
  padding: 10px 0 10px 10px;
  font-weight: 600;
}

.field-input {
  width: 80px;
}

.adapter-table {
  width: 960px;
}

.adapter-table :deep(.ant-table) {
  font-size: 12px;
}

.adapter-table :deep(.ant-table-thead > tr > th),
.adapter-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: center;
}

.table-cell-input,
.table-cell-select {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}
</style>
