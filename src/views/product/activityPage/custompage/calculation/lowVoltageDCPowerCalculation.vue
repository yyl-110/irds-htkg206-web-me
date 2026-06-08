<template>
  <div>
    <a-modal v-model:open="isShow" :mask-closable="false" :width="width" title="低压直流功率计算" @cancel="handleCancel">
      <div class="page layout-wrapper">
        <div class="layout-header">
          <div class="section-title">计算输入参数：</div>
          <div class="select-box">
            <div class="param-toolbar">
              <div class="parm-label">
                供电支路：
                <a-input-number
                  v-model:value="paprm1"
                  style="width: 200px"
                  :min="1"
                  :max="100"
                  @blur="handleBranchCountBlur" />
              </div>
              <div class="parm-label parm-label--action">
                <a-button type="primary" @click="handleConfirm">确定</a-button>
              </div>
            </div>

            <a-form label-align="left" :colon="false" class="form-box">
              <div v-for="item in branchFields" :key="item.id" class="branch-field">
                <RxLabelField
                  ref="branchFieldRefs"
                  :label-name="item.labelName"
                  type="0"
                  :type-key="item.typeKey"
                  :width="252"
                  :label-width="110" />
              </div>
            </a-form>
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
              merge="10"
              :page-flag="false"
              @select-model-list-check="handleSelectCheck" />
          </div>

          <div class="section-title section-title--result">计算结果：</div>

          <div class="result-block">
            <div class="result-caption">低压直流设计输出（低压直流功率）</div>
            <ProcessRxTable
              :columns="columns2"
              :data="data2"
              width="80%"
              :height="tabHeight2"
              margin-top="0px"
              merge="11"
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
import RxLabelField from '@/views/product/activityPage/custompage/calculation/RxLabelField.vue';

import { buildLowVoltageDCTables, collectBranchParams, createBranchCountFields } from './lowVoltageDC/calculation';
import { createLowVoltageDCColumns1, createLowVoltageDCColumns2 } from './lowVoltageDC/tableColumns';
import type { BranchCountField, LowVoltageDCRow } from './lowVoltageDC/types';

defineOptions({ name: 'lowVoltageDCPowerCalculation' });

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
const tabHeight = 265;
const tabHeight2 = 305;

const branchFields = ref<BranchCountField[]>([]);
const branchFieldRefs = ref<Array<{ newModeTypeVal?: unknown; typeKey?: string }>>([]);

const data1 = ref<LowVoltageDCRow[]>([]);
const data2 = ref<LowVoltageDCRow[]>([]);

const columns1 = ref<LegacyColumn[]>(
  createLowVoltageDCColumns1({
    getContext: () => ({
      data1: data1.value,
      data2: data2.value,
    }),
  }),
);
const columns2 = ref<LegacyColumn[]>(createLowVoltageDCColumns2());

function handleBranchCountBlur() {
  if (paprm1.value == null) {
    branchFields.value = [];
    return;
  }

  if (!INT_REG.test(String(paprm1.value))) {
    message.error('请输入整数');
    branchFields.value = [];
    return;
  }

  branchFields.value = createBranchCountFields(paprm1.value);
}

function handleConfirm() {
  const branchParams = collectBranchParams(branchFieldRefs.value);
  const tables = buildLowVoltageDCTables(paprm1.value, branchParams);

  if (!tables.valid) {
    return;
  }

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
  branchFields.value = [];
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
  min-height: 140px;
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

.select-box {
  width: 100%;
  padding-top: 10px;
  overflow: auto;
}

.param-toolbar {
  width: 100%;
  height: 52px;
  line-height: 50px;
}

.parm-label {
  margin-left: 20px;
  height: 45px;
  float: left;
  width: 350px;
}

.parm-label--action {
  width: 70px;
  float: right;
}

.form-box {
  width: 1250px;
  min-height: 100px;
  height: 97px;
  overflow: auto;
}

.branch-field {
  height: 50px;
  width: 290px;
  margin-left: 20px;
  margin-right: 22px;
  float: left;
}

.layout-content {
  background: #ffffff;
  min-height: 555px;
}

.table-block--input {
  width: 100%;
  padding: 0 10px;
  height: 280px;
}

.result-block {
  width: 100%;
  padding: 0 10px;
  height: 358px;
}

.result-caption {
  width: 100%;
  margin-bottom: 10px;
  height: 25px;
}
</style>
