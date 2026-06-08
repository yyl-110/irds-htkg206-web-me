<template>
  <div class="page">
    <div class="layout-wrapper">
      <div class="page-title">起竖油缸行程计算</div>

      <div class="layout-header">
        <div class="section-title">参数定义：</div>

        <a-form :model="formParams" layout="horizontal" :colon="false" class="param-form">
          <a-form-item label="G(t):" class="param-form-item">
            <a-input v-model:value="formParams.loadWeight" style="width: 230px" />
          </a-form-item>
          <a-form-item label="a(°):" class="param-form-item">
            <a-input v-model:value="formParams.angleA" style="width: 230px" />
          </a-form-item>
          <a-form-item label="a(mm):" class="param-form-item">
            <a-input v-model:value="formParams.lengthA" style="width: 230px" />
          </a-form-item>
          <a-form-item label="a0(°):" class="param-form-item">
            <a-input v-model:value="formParams.angleA0" style="width: 230px" />
          </a-form-item>
          <a-form-item label="b(mm):" class="param-form-item">
            <a-input v-model:value="formParams.lengthB" style="width: 230px" />
          </a-form-item>
          <a-form-item label="β(°):" class="param-form-item">
            <a-input v-model:value="formParams.angleBeta" style="width: 230px" />
          </a-form-item>
          <a-form-item label="c(mm):" class="param-form-item">
            <a-input v-model:value="formParams.lengthC" style="width: 230px" />
          </a-form-item>
          <a-form-item label="θ(°):" class="param-form-item">
            <a-input v-model:value="formParams.angleTheta" style="width: 230px" />
          </a-form-item>
        </a-form>

        <div class="angle-section">设置变化角度及参数计算</div>

        <div class="calc-toolbar">
          <span class="calc-field">
            a最大值(°):
            <a-input v-model:value="formParams.maxAngleA" style="width: 70px; margin-left: 20px" />
          </span>
          <span class="calc-field">
            角度增加数量:
            <a-input v-model:value="formParams.angleIncrementCount" style="width: 70px; margin-left: 20px" />
          </span>
          <a-button type="primary" @click="handleCalculate">计算</a-button>
        </div>

        <div class="section-title section-title--table">起竖杠参数定义：</div>

        <ProcessRxTable :columns="columns" :data="resultData" width="100%" :height="521" :page-flag="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import ProcessRxTable from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.vue';
import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';

import { DEFAULT_RESULT_ROWS, createDefaultFormParams, type QsygXcResultRow } from './qsygXc/types';
import { createQsygXcResultColumns } from './qsygXc/tableColumns';

defineOptions({ name: 'AppQsygXcCalculation' });

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

const formParams = reactive(createDefaultFormParams());
const resultData = ref<QsygXcResultRow[]>([...DEFAULT_RESULT_ROWS]);
const columns = ref<LegacyColumn[]>(createQsygXcResultColumns());

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
  min-width: 80px;
}

.angle-section {
  margin: 20px 0 0 20px;
}

.calc-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin: 30px 0 0 20px;
}

.calc-field {
  display: inline-flex;
  align-items: center;
}
</style>
