<template>
  <div class="page">
    <div class="layout-wrapper">
      <div class="page-title">交流输入交流母线功率计算</div>

      <div class="layout-header">
        <div class="section-title">计算输入参数：</div>
        <div class="param-row">
          <div class="parm-label">
            低压直流供电支路：
            <a-input-number
              v-model:value="paprm1"
              style="width: 200px"
              :min="dataMin"
              :max="dataMax"
              @blur="validateIntegerParam(1)" />
          </div>
          <div class="parm-label">
            交流供电支路：
            <a-input-number
              v-model:value="paprm2"
              style="width: 200px"
              :min="dataMin"
              :max="dataMax"
              @blur="validateIntegerParam(2)" />
          </div>
          <div class="parm-label parm-label--action">
            <a-button type="primary" @click="handleConfirm">确定</a-button>
          </div>
        </div>
      </div>

      <div class="layout-content">
        <div class="table-block table-block--input">
          <ProcessRxTable
            :columns="columns1"
            :data="data1"
            width="100%"
            :height="tabHeight"
            margin-top="0px"
            merge="00"
            :page-flag="false"
            @select-model-list-check="handleSelectCheck" />
        </div>

        <div class="section-title section-title--result">计算结果：</div>

        <div class="result-block">
          <div class="result-caption">低压直流母线总输出功率</div>
          <div class="result-table">
            <ProcessRxTable
              :columns="columns2"
              :data="data2"
              width="100%"
              :height="tabHeight"
              margin-top="0px"
              merge="01"
              :page-flag="false"
              @select-model-list-check="handleSelectCheck" />
          </div>

          <div class="result-caption result-caption--secondary">设计输出（交流总输入功率）</div>
          <div class="result-table result-table--bottom">
            <ProcessRxTable
              :columns="columns3"
              :data="data3"
              width="100%"
              :height="tabHeight"
              margin-top="0px"
              merge="02"
              :page-flag="false"
              @select-model-list-check="handleSelectCheck" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import ProcessRxTable from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.vue';
import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';

import { buildAcbusPowerTables } from './acbusPower/calculation';
import {
  createAcbusPowerColumns1,
  createAcbusPowerColumns2,
  createAcbusPowerColumns3,
} from './acbusPower/tableColumns';
import type { AcbusPowerRow } from './acbusPower/types';

defineOptions({ name: 'AppAcbusPowerCalculation' });

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

const INT_REG = /^[1-9]\d*$/;

const paprm1 = ref<number | null>(null);
const paprm2 = ref<number | null>(null);
const tabHeight = 305;
const dataMin = 1;
const dataMax = 100;

const data1 = ref<AcbusPowerRow[]>([]);
const data2 = ref<AcbusPowerRow[]>([]);
const data3 = ref<AcbusPowerRow[]>([]);

const columns1 = ref<LegacyColumn[]>(
  createAcbusPowerColumns1({
    getContext: () => ({
      data1: data1.value,
      data2: data2.value,
      data3: data3.value,
    }),
  }),
);
const columns2 = ref<LegacyColumn[]>(createAcbusPowerColumns2());
const columns3 = ref<LegacyColumn[]>(createAcbusPowerColumns3());

function validateIntegerParam(type: 1 | 2) {
  const value = type === 1 ? paprm1.value : paprm2.value;
  if (value != null && !INT_REG.test(String(value))) {
    message.error('请输入整数');
  }
}

function handleConfirm() {
  const tables = buildAcbusPowerTables(paprm1.value, paprm2.value);
  data1.value = tables.data1;
  data2.value = tables.data2;
  data3.value = tables.data3;
}

function handleSelectCheck() {}
</script>

<style scoped>
.page {
  font-size: 15px;
  height: calc(100vh - 124px);
  overflow: auto;
}

.layout-wrapper {
  background-color: #ffffff;
  padding: 0 10px;
}

.page-title {
  padding-left: 10px;
}

.layout-header {
  background: #ffffff;
  min-height: 95px;
  margin-bottom: 10px;
}

.section-title {
  border-bottom: 1px silver solid;
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.section-title--result {
  margin-bottom: 10px;
}

.param-row {
  width: 100%;
  height: 70px;
  line-height: 70px;
}

.parm-label {
  margin-left: 20px;
  margin-bottom: 10px;
  height: 38px;
  float: left;
}

.parm-label--action {
  width: 70px;
  float: right;
}

.layout-content {
  background: #ffffff;
  min-height: 595px;
}

.table-block--input {
  width: 100%;
  padding: 0 10px;
  height: 330px;
}

.result-block {
  width: 100%;
  padding: 0 10px;
  height: 380px;
}

.result-caption {
  width: 100%;
  height: 22px;
  padding-left: 10px;
  margin-bottom: 10px;
}

.result-caption--secondary {
  height: 14px;
  margin-top: 14px;
  padding-left: 0;
}

.result-table {
  width: 100%;
  float: left;
  height: 305px;
}

.result-table--bottom {
  height: auto;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
