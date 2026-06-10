<template>
  <div>
    <div class="layout-wrapper" style="padding: 0 10px; background-color: #ffffff">
      <div class="layout-content">
        <a-form label-align="left" :colon="false">
          <div style="width: 99%; float: left">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <div style="width: 30%; height: 100%; float: left">
                <a-form-item label="电源机柜数量：" :label-col="{ style: { width: '115px' } }">
                  <a-input v-model:value="paramz2_2" style="width: 100px; display: none" allow-clear disabled />
                  <a-input v-model:value="parameterTempList[1].defaultValue" style="width: 100px" allow-clear disabled />
                </a-form-item>
              </div>
            </section>
          </div>
        </a-form>
      </div>

      <a-divider />

      <div style="width: 20%; height: 100%">电源机柜1：</div>

      <div class="selectBox">
        <a-button
          type="primary"
          class="btnSty"
          style="margin-left: 5px; margin-top: 10px; margin-right: 30px"
          @click="initData('1')">
          更新数据
        </a-button>

        <div style="width: 1143px">
          <a-table
            :columns="CABINET_ASSEMBLY_TABLE_COLUMNS"
            :data-source="tableData1"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: 1461 }"
            :row-key="tableRowKey"
            class="page56-table">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'p1'">
                {{ formatCategoryLabel(record.p1) }}
              </template>
            </template>
          </a-table>
        </div>
      </div>

      <div style="width: 30%; height: 100%; float: left">
        <a-form label-align="left" :colon="false">
          <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
            <a-form-item label="输出电流A(求和)：" :label-col="{ style: { width: '115px' } }">
              <a-input v-model:value="paramz_1" style="width: 100px; display: none" allow-clear disabled />

              <a-input v-model:value="parameterTempList[5].defaultValue" style="width: 100px" allow-clear disabled />
            </a-form-item>
          </section>
        </a-form>
      </div>

      <div v-if="Number(parameterTempList[1].defaultValue) >= 2">
        <a-divider />

        <div style="width: 20%; height: 100%">电源机柜2：</div>

        <div class="selectBox">
          <a-button
            type="primary"
            class="btnSty"
            style="margin-left: 5px; margin-top: 10px; margin-right: 30px"
            @click="initData('2')">
            更新数据
          </a-button>

          <div style="width: 1143px">
            <a-table
              :columns="CABINET_ASSEMBLY_TABLE_COLUMNS"
              :data-source="tableData2"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ x: 1461 }"
              :row-key="tableRowKey"
              class="page56-table">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'p1'">
                  {{ formatCategoryLabel(record.p1) }}
                </template>
              </template>
            </a-table>
          </div>
        </div>

        <div style="width: 30%; height: 100%; float: left">
          <a-form label-align="left" :colon="false">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <a-form-item label="输出电流A(求和)：" :label-col="{ style: { width: '115px' } }">
                <a-input v-model:value="paramz_2" style="width: 100px; display: none" allow-clear disabled />

                <a-input v-model:value="parameterTempList[6].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </section>
          </a-form>
        </div>
      </div>

      <div v-if="Number(parameterTempList[1].defaultValue) >= 3">
        <a-divider />

        <div style="width: 20%; height: 100%">电源机柜3：</div>

        <div class="selectBox">
          <a-button
            type="primary"
            class="btnSty"
            style="margin-left: 5px; margin-top: 10px; margin-right: 30px"
            @click="initData('3')">
            更新数据
          </a-button>

          <div style="width: 1143px">
            <a-table
              :columns="CABINET_ASSEMBLY_TABLE_COLUMNS"
              :data-source="tableData3"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ x: 1461 }"
              :row-key="tableRowKey"
              class="page56-table">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'p1'">
                  {{ formatCategoryLabel(record.p1) }}
                </template>
              </template>
            </a-table>
          </div>
        </div>

        <div style="width: 30%; height: 100%; float: left">
          <a-form label-align="left" :colon="false">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <a-form-item label="输出电流A(求和)：" :label-col="{ style: { width: '115px' } }">
                <a-input v-model:value="paramz_3" style="width: 100px; display: none" allow-clear disabled />

                <a-input v-model:value="parameterTempList[7].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </section>
          </a-form>
        </div>
      </div>

      <div v-if="Number(parameterTempList[1].defaultValue) >= 4">
        <a-divider />

        <div style="width: 20%; height: 100%">电源机柜4：</div>

        <div class="selectBox">
          <a-button
            type="primary"
            class="btnSty"
            style="margin-left: 5px; margin-top: 10px; margin-right: 30px"
            @click="initData('4')">
            更新数据
          </a-button>

          <div style="width: 1143px">
            <a-table
              :columns="CABINET_ASSEMBLY_TABLE_COLUMNS"
              :data-source="tableData4"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ x: 1461 }"
              :row-key="tableRowKey"
              class="page56-table">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'p1'">
                  {{ formatCategoryLabel(record.p1) }}
                </template>
              </template>
            </a-table>
          </div>
        </div>

        <div style="width: 30%; height: 100%; float: left">
          <a-form label-align="left" :colon="false">
            <section style="width: 100%; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
              <a-form-item label="输出电流A(求和)：" :label-col="{ style: { width: '115px' } }">
                <a-input v-model:value="paramz_4" style="width: 100px; display: none" allow-clear disabled />

                <a-input v-model:value="parameterTempList[8].defaultValue" style="width: 100px" allow-clear disabled />
              </a-form-item>
            </section>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';

import { message } from 'ant-design-vue';

import { applyProcess7SaveBtnEnable } from './shared/process7/setSaveBtnEnable';

import {
  cloneParameterList,
  initCustomizedProcessPage7Data5_6,
  type CabinetAssemblyTableRow,
  type Page5_6ParameterItem,
} from './Process7-page5-6/parameterDefaults';

import { loadCabinetAssemblyData } from './Process7-page5-6/rowOperations';

import { CABINET_ASSEMBLY_TABLE_COLUMNS, formatCategoryLabel } from './Process7-page5-6/tableColumns';

defineOptions({ name: 'customizedProcess7-page5-6' });

const props = withDefaults(
  defineProps<{
    width?: number;

    modalFlag?: boolean;

    pageid?: string;

    taskid?: string;

    parameterTempList?: Page5_6ParameterItem[];
  }>(),

  {
    width: 1000,

    modalFlag: false,

    pageid: '',

    taskid: '',

    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();
const route = useRoute();
function createInitialParameterList(): Page5_6ParameterItem[] {
  if (!props.parameterTempList?.length) {
    return initCustomizedProcessPage7Data5_6(props.pageid);
  }

  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page5_6ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
  });




const tableData1 = computed(() => parameterTempList.value[0]?.tableMap?.rowData ?? []);

const tableData2 = computed(() => parameterTempList.value[2]?.tableMap?.rowData ?? []);

const tableData3 = computed(() => parameterTempList.value[3]?.tableMap?.rowData ?? []);

const tableData4 = computed(() => parameterTempList.value[4]?.tableMap?.rowData ?? []);

const paramz2_2 = ref('');

const paramz_1 = ref('');

const paramz_2 = ref('');

const paramz_3 = ref('');

const paramz_4 = ref('');

function tableRowKey(record: CabinetAssemblyTableRow, index: number) {
  return String(record.p0 ?? index);
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string | number, parameterValue?: string) {
  emit('setSaveBtnEnable', true);

  applyProcess7SaveBtnEnable(parameterTempList.value, inputOrOutput, parameterId, parameterValue);
}

async function initData(type: string) {
  const result = await loadCabinetAssemblyData(type, parameterTempList.value, props.pageid, props.taskid);

  if (!result.ok) {
    message.info(result.message ?? '未找到数据');

    return;
  }

  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {

    paramz2_2.value = String(parameterTempList.value[1]?.defaultValue ?? '');

    paramz_1.value = String(parameterTempList.value[5]?.defaultValue ?? '');

    paramz_2.value = String(parameterTempList.value[6]?.defaultValue ?? '');

    paramz_3.value = String(parameterTempList.value[7]?.defaultValue ?? '');

    paramz_4.value = String(parameterTempList.value[8]?.defaultValue ?? '');
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

defineExpose({
  updateEl,

  setSaveBtnEnable,
});
</script>

<style scoped>
.selectBox {
  width: 100%;

  height: auto;

  float: left;

  margin-bottom: 20px;
}

.layout-content {
  background: #ffffff;
}

.page56-table {
  width: 100%;

  border: 1px solid #eee;

  margin-top: 10px;
}

.page56-table :deep(.ant-table-cell) {
  padding: 4px 8px !important;
}
</style>
