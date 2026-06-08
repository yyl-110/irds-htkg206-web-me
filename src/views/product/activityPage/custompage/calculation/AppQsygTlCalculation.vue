<template>
  <div class="page">
    <div class="layout-wrapper">
      <div class="page-title">起竖油缸推力计算</div>

      <div class="layout-header">
        <div class="section-title">参数定义：</div>

        <a-form :model="formParams" layout="horizontal" :colon="false" class="param-form">
          <a-form-item label="负载重量G(t):" class="param-form-item">
            <a-input v-model:value="formParams.loadWeight" style="width: 230px" />
          </a-form-item>
          <a-form-item label="起竖转动角度(°):" class="param-form-item">
            <a-input v-model:value="formParams.rotationAngle" style="width: 230px" />
          </a-form-item>
          <a-form-item label="油缸导向长度(mm):" class="param-form-item">
            <a-input v-model:value="formParams.guideLength" style="width: 230px" />
          </a-form-item>
          <a-form-item label="起坚回转中心坐标(x,z):" class="param-form-item">
            <a-input v-model:value="formParams.pivotCoord" style="width: 230px" />
          </a-form-item>

          <div class="param-form-row">
            <a-form-item label="起坚前负载质心坐标(xg,zg):" class="param-form-item param-form-item--wide">
              <a-input v-model:value="formParams.centroidCoord" style="width: 230px" />
            </a-form-item>
            <a-form-item label="步长(mm):" class="param-form-item param-form-item--step">
              <a-select v-model:value="formParams.centroidStep" style="width: 70px" placeholder="请选择" allow-clear>
                <a-select-option v-for="item in stepOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <div class="param-form-row">
            <a-form-item label="起坚前上支点坐标(xu,zu):" class="param-form-item param-form-item--wide">
              <a-input v-model:value="formParams.upperPivotCoord" style="width: 230px" />
            </a-form-item>
            <a-form-item label="步长(mm):" class="param-form-item param-form-item--step">
              <a-select v-model:value="formParams.upperPivotStep" style="width: 70px" placeholder="请选择" allow-clear>
                <a-select-option v-for="item in stepOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <div class="param-form-row">
            <a-form-item label="下支与坐标(xd,zd):" class="param-form-item param-form-item--wide">
              <a-input v-model:value="formParams.lowerPivotCoord" style="width: 230px" />
            </a-form-item>
            <a-form-item label="步长(mm):" class="param-form-item param-form-item--step">
              <a-select v-model:value="formParams.lowerPivotStep" style="width: 70px" placeholder="请选择" allow-clear>
                <a-select-option v-for="item in stepOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form>

        <a-space class="toolbar">
          <a-button type="primary" @click="handleSave">保存</a-button>
          <a-button type="primary" @click="handleCalculate">计算</a-button>
        </a-space>

        <div class="section-title section-title--table">起竖杠参数定义：</div>

        <div class="table-toolbar">
          <a-button danger :disabled="removeDisabled" @click="handleDeleteRows">
            <template #icon><DeleteOutlined /></template>
            删除
          </a-button>
        </div>

        <ProcessRxTable
          :columns="columns"
          :data="groupData"
          width="100%"
          :height="521"
          :page-flag="false"
          @select-model-list-check="handleSelectionChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import ProcessRxTable from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.vue';
import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';

import {
  DEFAULT_CYLINDER_ROWS,
  STEP_OPTIONS,
  createDefaultFormParams,
  type QsygTlCylinderRow,
} from './qsygTl/types';
import { createQsygTlCylinderColumns } from './qsygTl/tableColumns';

defineOptions({ name: 'AppQsygTlCalculation' });

withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
  }>(),
  {
    checkId: '',
    categoryId: '',
  },
);

const stepOptions = STEP_OPTIONS;
const formParams = reactive(createDefaultFormParams());
const groupData = ref<QsygTlCylinderRow[]>([...DEFAULT_CYLINDER_ROWS]);
const selectedRows = ref<QsygTlCylinderRow[]>([]);
const columns = ref<LegacyColumn[]>(createQsygTlCylinderColumns());

const removeDisabled = computed(() => selectedRows.value.length === 0);

function handleSelectionChange(selection: Array<Record<string, unknown>>) {
  selectedRows.value = selection as QsygTlCylinderRow[];
}

function handleDeleteRows() {
  if (!selectedRows.value.length) return;

  const selectedSet = new Set(selectedRows.value);
  groupData.value = groupData.value.filter(row => !selectedSet.has(row));
  selectedRows.value = [];
  message.success('已删除选中行');
}

function handleSave() {
  message.info('参数已保存');
}

function handleCalculate() {
  message.info('计算功能待接入');
}
</script>

<style scoped>
.page {
  font-size: 15px;
}

.layout-wrapper {
  background-color: #ffffff;
  padding: 0 10px;
  height: 811px;
  overflow: auto;
}

.page-title {
  padding-left: 10px;
}

.layout-header {
  background: #ffffff;
  padding-bottom: 16px;
}

.section-title {
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
}

.section-title--table {
  margin-top: 30px;
}

.param-form {
  margin-top: 8px;
}

.param-form-item {
  margin-bottom: 8px;
  margin-left: 20px;
}

.param-form-item :deep(.ant-form-item-label) {
  min-width: 220px;
}

.param-form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.param-form-item--wide :deep(.ant-form-item-label) {
  min-width: 240px;
}

.param-form-item--step {
  margin-left: 20px;
}

.param-form-item--step :deep(.ant-form-item-label) {
  min-width: 72px;
}

.toolbar {
  margin: 30px 0 0 20px;
}

.table-toolbar {
  margin: 10px 0 10px 20px;
}
</style>
