<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { useUserStore } from '@/store/modules/user';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  paramDisabled: {
    require: false,
    type: Boolean,
    default: false,
  },
});
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const loading = ref<boolean>(false);
const datasource = ref<any>([]);
const columns = ref<any>([]);
const plantformId = ref(0);
const taskId = ref(0);
const formData = ref<any>({});
/** 获取分类数据 */
function initInfo(taskIds: any, plantformIds: any, form: any) {
  formData.value = form;
  console.log(formData.value);
  loading.value = true;
  try {
    plantformId.value = plantformIds;
    taskId.value = taskIds;
    const params = {
      taskId: taskIds,
      plantformId: plantformIds,
    };
    datasource.value = [];
    columns.value = [];
    //加载表格数据
    AdminApiProductPlanTaskDesign.getProductPlanScoreWeightList(params).then(res => {
      if (res && res.data.code == 200) {
        console.log(formData.value);
        for (let i = 0; i < res.data.data.tableStr.length; i++) {
          if (i == 0) {
            res.data.data.tableStr[i].k10001 = formData.value.salesTarget;
          } else if (i == 1) {
            res.data.data.tableStr[i].k10001 = formData.value.revenueTarget;
          } else if (i == 2) {
            res.data.data.tableStr[i].k10001 = formData.value.profitGrowth;
          } else if (i == 3) {
            res.data.data.tableStr[i].k10001 = formData.value.competitiveTarget;
          }
        }
        console.log(res.data.data.tableStr);
        datasource.value = res.data.data.tableStr;
        columns.value = res.data.data.columnStr;
      }
    });
  } catch (error) {
    message.error('获取数据失败！');
  } finally {
    loading.value = false;
  }
}
/** 保存表格数据 */
async function confirm() {
  const params = {
    tableStr: datasource.value,
    taskId: taskId.value,
    platformId: plantformId.value,
  };
  AdminApiProductPlanTaskDesign.productPlanTaskBreakdownsUpdate(params).then(res => {
    if (res && res.data.code == 200) {
      message.success('保存成功！');
      emit('refresh-table-data');
      emit('close');
    }
  });
}

const emit = defineEmits(['close', 'refresh-table-data']);

defineExpose({ initInfo });
</script>

<template>
  <a-modal title="产品战略目标分解" v-model:visible="visible" width="80%" :confirm-loading="$isPending()" @cancel="emit('close')">
    <div class="model-content">
      <a-table :columns="columns" :data-source="datasource" :scroll="{ x: 700 }" bordered :loading="loading" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'k10000'">
            {{ record.k10000 }}
          </template>
          <template v-else-if="column.dataIndex === 'k10001'"> <a-input v-model:value="record.k10001" disabled style="width: 100%" /></template>
          <template v-else>
            <a-input v-model:value="record[column.dataIndex]" style="width: 100%" />
          </template>
        </template>
      </a-table>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="confirm" :disabled="paramDisabled">确定</a-button>
        <a-button @click="emit('close')">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../sheets/collapse.less';
:deep(.ant-collapse-content-box) {
  padding: 0px !important;
  padding-top: 16px !important;
}
.model-content {
  height: calc(100vh - 300px);
  overflow: auto;
}
</style>
