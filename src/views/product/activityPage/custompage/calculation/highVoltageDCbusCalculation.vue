<template>
  <div>
    <a-modal
      v-model:open="isShow"
      :mask-closable="false"
      :width="width"
      title="高压直流母线功率计算"
      @cancel="handleCancel">
      <div class="page layout-wrapper">
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
              高压直流供电支路：
              <a-input-number
                v-model:value="paprm2"
                style="width: 200px"
                :min="dataMin"
                :max="dataMax"
                @blur="validateIntegerParam(2)" />
            </div>
            <div class="parm-label">
              整流电源效率：
              <a-input-number v-model:value="paprm3" style="width: 200px" @blur="handleRectifierEfficiencyBlur" />
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
              merge="20"
              margin-top="0px"
              :page-flag="false"
              @select-model-list-check="handleSelectCheck" />
          </div>

          <div class="section-title section-title--result">计算结果：</div>

          <div class="result-block">
            <div class="result-caption">高压直流母线功率计算设计输出（交流总输入功率）</div>
            <ProcessRxTable
              :columns="columns2"
              :data="data2"
              width="80%"
              :height="tabHeight2"
              margin-top="0px"
              merge="21"
              :page-flag="false"
              @select-model-list-check="handleSelectCheck" />
          </div>
        </div>
      </div>

      <template #footer>
        <a-space>
          <a-button type="primary" @click="handleOk">确定</a-button>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import ProcessRxTable from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.vue';
import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';

import {
  applyRectifierEfficiencyChange,
  buildHighVoltageDCbusTables,
} from './highVoltageDCbus/calculation';
import {
  createHighVoltageDCbusColumns1,
  createHighVoltageDCbusColumns2,
} from './highVoltageDCbus/tableColumns';
import type { HighVoltageDCbusRow } from './highVoltageDCbus/types';

defineOptions({ name: 'highVoltageDCbusCalculation' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
  }>(),
  {
    width: 1000,
    modalFlag: false,
  },
);

const emit = defineEmits<{
  customizedOk: [];
  customizedCancel: [];
}>();

const INT_REG = /^[1-9]\d*$/;

const isShow = ref(false);
const paprm1 = ref<number | null>(null);
const paprm2 = ref<number | null>(null);
const paprm3 = ref<number | null>(null);
const tabHeight = 285;
const tabHeight2 = 305;
const dataMin = 1;
const dataMax = 100;

const data1 = ref<HighVoltageDCbusRow[]>([]);
const data2 = ref<HighVoltageDCbusRow[]>([]);

const columns1 = ref<LegacyColumn[]>(
  createHighVoltageDCbusColumns1({
    getContext: () => ({
      data1: data1.value,
      data2: data2.value,
      rectifierEfficiency: paprm3.value,
    }),
  }),
);
const columns2 = ref<LegacyColumn[]>(createHighVoltageDCbusColumns2());

function validateIntegerParam(type: 1 | 2) {
  const value = type === 1 ? paprm1.value : paprm2.value;
  if (value != null && !INT_REG.test(String(value))) {
    message.error('请输入整数');
  }
}

function handleRectifierEfficiencyBlur() {
  applyRectifierEfficiencyChange(paprm3.value, {
    data1: data1.value,
    data2: data2.value,
    rectifierEfficiency: paprm3.value,
  });
}

function handleConfirm() {
  const tables = buildHighVoltageDCbusTables(paprm1.value, paprm2.value);
  data1.value = tables.data1;
  data2.value = tables.data2;
}

function handleSelectCheck() {}

function handleOk() {
  emit('customizedOk');
}

function handleCancel() {
  emit('customizedCancel');
}

function resetForm() {
  paprm1.value = null;
  paprm2.value = null;
  paprm3.value = null;
  data1.value = [];
  data2.value = [];
}

watch(
  () => props.modalFlag,
  val => {
    isShow.value = val;
  },
  { immediate: true },
);

watch(isShow, val => {
  if (!val) {
    resetForm();
  }
});
</script>

<style scoped>
.page {
  background-color: #ffffff;
  padding: 0 10px;
  font-size: 15px;
}

.layout-header {
  background: #ffffff;
  min-height: 95px;
  margin-bottom: 10px;
}

.section-title {
  border-bottom: 1px silver solid;
  width: 100%;
  font-weight: 600;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.section-title--result {
  font-size: 15px;
  margin-left: 10px;
}

.param-row {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding-top: 10px;
}

.parm-label {
  margin-left: 20px;
  height: 38px;
  float: left;
  width: 350px;
}

.parm-label--action {
  width: 70px;
  float: right;
}

.layout-content {
  background: #ffffff;
  min-height: 610px;
  margin-top: 15px;
}

.table-block--input {
  width: 100%;
  padding: 0 10px;
  height: 310px;
}

.result-block {
  width: 100%;
  padding: 0 10px;
  height: 358px;
}

.result-caption {
  width: 100%;
  margin-bottom: 10px;
  height: 32px;
}
</style>
