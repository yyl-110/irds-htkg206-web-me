<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, Form, InputNumber } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { downloadFileFromStream } from '@/utils/file.ts';
import { getStatusStyle } from '@/style/StatusStyle';
import { getDistributionteamLabel } from '@/enums/ProductPortfolio';
const userStore = useUserStore();
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  initPageData();
  getTaskWorkStatus();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

async function initPageData() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.getProductPlanDemandList(data);
  tableList.value = res.data.data;
  tableList.value.forEach(item => {
    if (item.planId == planTaskInfo.value.planId) {
      item.taskStatus = '本期规划';
    } else {
      item.taskStatus = '待定';
    }
  });
}

async function submitOk(type: any) {
  if (type == 0) {
    var demandMasterId = [];
    tableList.value.forEach(item => {
      if (item.taskStatus == '本期规划') {
        demandMasterId.push(item.masterId);
      }
    });
    let data: any = {
      planId: planTaskInfo.value.planId,
      demandMasterIds: demandMasterId,
    };
    const res = await AdminApiProductPlanTaskDesign.saveProductPlanDemandLink(data);
    if (res.data.code === 200) {
      // message.success('保存成功');
      submitAdd();
    }
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 217;
    const res = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    if (res.data.code == 200) {
      submitCommit();
    }
  }
}

async function submitCommit() {
  //调取子方法
  taskStatusComponentsa.value?.submitCommit(planTaskInfo.value.progress);
}
async function submitAdd() {
  //调取子方法
  taskStatusComponentsa.value?.submitAdd(planTaskInfo.value.progress);
}

const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    text: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

async function updatePram(record: any) {
  modalTitle.value = '编辑用户痛点';
  currentRecord.value = record;
  // 填充表单数据
  formData.targetMarket = record.targetMarket || '';
  formData.painPoint = record.painPoint || '';
  formData.painSort = record.painSort || '';
  formData.actionPlan = record.actionPlan || '';
  modalVisible.value = true;
}

async function deletePram(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条用户痛点记录吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let data: any = {};
        data.id = record.id;
        const res = await AdminApiProductPlanTaskDesign.painPointDelete(data);
        if (res.data.code === 200) {
          message.success('删除成功');
          // 重新加载数据
          await initPageData();
        } else {
          message.error(res.data.message || '删除失败');
        }
      } catch (error) {
        message.error('删除失败，请重试');
      }
    },
  });
}

const tableList = ref<any>([]);
// 弹窗相关状态
const modalVisible = ref<boolean>(false);
const modalTitle = ref<string>('添加用户痛点');
const currentRecord = ref<any>(null);
// 表单数据
const formData = reactive({
  targetMarket: '',
  painPoint: '',
  painSort: '',
  actionPlan: '',
});
// 表单实例
const formRef = ref();
// 表单验证规则
const rules = {
  targetMarket: [
    {
      required: true,
      message: '请输入目标市场',
      trigger: 'blur',
    },
  ],
  painPoint: [
    {
      required: true,
      message: '请输入客户挑战，痛点，问题',
      trigger: 'change',
    },
  ],
  painSort: [
    {
      required: true,
      message: '请输入问题排序',
      trigger: 'blur',
    },
  ],
  actionPlan: [
    {
      required: true,
      message: '请输入行动方案',
      trigger: 'blur',
    },
  ],
};
// 表单验证错误信息
const formErrors = reactive({
  targetMarket: '',
  painPoint: '',
  painSort: '',
  actionPlan: '',
});
const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '需求编号',
    dataIndex: 'demandNum',
    key: 'demandNum',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandNum, b.demandNum),
  },
  {
    title: '需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandTitle, b.demandTitle),
  },
  {
    title: '需求来源',
    dataIndex: 'demandSource',
    key: 'demandSource',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandSource, b.demandSource),
  },
  {
    title: '区域市场',
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.regionalMarket, b.regionalMarket),
  },
  {
    title: '细分市场',
    dataIndex: 'marketSegment',
    key: 'marketSegment',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.marketSegment, b.marketSegment),
  },
  {
    title: '提出人',
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.originaUserName, b.originaUserName),
  },
  {
    title: 'RME',
    dataIndex: 'rmeUserName',
    key: 'rmeUserName',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.rmeUserName, b.rmeUserName),
  },
  {
    title: '需求状态',
    dataIndex: 'status',
    key: 'status',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
  },
  {
    title: '分析结论',
    dataIndex: 'conclusion',
    key: 'conclusion',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.conclusion, b.conclusion),
  },
  {
    title: '需求实现周期',
    dataIndex: 'periodicAttribute',
    key: 'periodicAttribute',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.periodicAttribute, b.periodicAttribute),
  },
  {
    title: '分发/关闭时间',
    dataIndex: 'allocateTime',
    key: 'allocateTime',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.allocateTime, b.allocateTime),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 200,
    align: 'center',
    fixed: 'right',
  },
]);

async function getTaskWorkStatus() {
  let data: any = {};
  data.id = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemProductSpecification.getProductTaskWorkStatus(data);
  paramDisabled.value = res.data.data.paramDisabled;
  keepDisabled.value = res.data.data.keepDisabled;
  submitDisabled.value = res.data.data.submitDisabled;
  updateDisabled.value = res.data.data.updateDisabled;
  planTaskInfo.value.progress = res.data.data.progress;
}

const emit = defineEmits(['refreshTree']);
async function refreshTree(id: any) {
  emit('refreshTree', id);
}

// 保存表单数据
async function saveForm() {
  // 首先检查问题重要排序是否重复
  const painSortNum = Number(formData.painSort);
  const duplicate = tableList.value.some((item: any) => Number(item.painSort) === painSortNum && (!currentRecord.value || item.id !== currentRecord.value.id));

  if (duplicate) {
    message.error('问题重要排序已存在，请输入其他值');
    return;
  }

  // 使用表单验证
  try {
    await formRef.value?.validate();

    let data: any = {
      id: currentRecord.value ? currentRecord.value.id : null,
      targetMarket: formData.targetMarket,
      painPoint: formData.painPoint,
      painSort: painSortNum,
      actionPlan: formData.actionPlan,
      taskId: planTaskInfo.value.id,
    };

    let res;
    if (currentRecord.value == null) {
      res = await AdminApiProductPlanTaskDesign.painPointCreate(data);
      if (res.data.code === 200) {
        message.success('添加成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '添加失败');
      }
    } else {
      res = await AdminApiProductPlanTaskDesign.painPointUpdate(data);
      if (res.data.code === 200) {
        message.success('修改成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '修改失败');
      }
    }
  } catch (error: any) {
    if (error?.errorFields) {
      message.error('表单验证失败，请检查输入信息');
    } else {
      message.error('操作失败，请重试');
    }
  }
}

async function exportExcel() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.productPlanDemandExport(data);
  const fileName = '产品规划-需求分发.xlsx';
  downloadFileFromStream(res, fileName);
}

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">产品规划-需求分发</span>
      <a-button type="primary" style="margin-left: 20px" @click="exportExcel()"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出 </a-button>
    </div>
    <a-div>
      <a-div :span="23">
        <a-table
          :scroll="{ x: 'max-content' }"
          :locale="localeA"
          @resizeColumn="handleResizeColumn"
          style="margin-left: 20px; margin-right: 10px; overflow-y: auto; height: 390px"
          :columns="columns"
          bordered
          :pagination="false"
          :data-source="tableList">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'periodicAttribute'">
              <span v-if="record.periodicAttribute == '1'">小于1年</span>
              <span v-if="record.periodicAttribute == '2'">1-3年</span>
              <span v-if="record.periodicAttribute == '3'">大于3年</span>
            </template>
            <template v-if="column.key === 'status'">
              <span :style="getStatusStyle(record.status)">{{ getDistributionteamLabel(record.status) }}</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a-select v-model:value="record.taskStatus" style="width: 170px">
                <a-select-option value="本期规划">本期规划</a-select-option>
                <a-select-option value="待定">待定</a-select-option>
              </a-select>
            </template>
          </template>
        </a-table>
      </a-div>
    </a-div>
  </div>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
</template>

<style lang="less" scoped>
:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input {
  text-align: left;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

:deep(.ant-picker) {
  width: 100%;
  border-radius: 2px;
}

:deep(.ant-table-thead > tr > th:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td) {
  text-align: center;
  height: 40px;
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td:first-child) {
  font-weight: 500;
}

:deep(.ant-table) {
  margin-bottom: 0;
}

// 表单样式
.form-content {
  padding: 10px 0;

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-input-number) {
    width: 100%;
  }
}

// 弹窗底部按钮样式
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;

  .ant-btn {
    margin-left: 8px;
  }
}

//底部按钮
.foot-btn {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin-left: 16px;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  .btn_left {
    margin-left: 15px;
  }
}

//内容标题
.content-title {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  margin-left: 16px;
  i {
    width: 6px;
    height: 20px;
    background: #0d53e2;
    border-radius: 0px 0px 0px 0px;
    margin-right: 8px;
  }
  .test {
    height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.bodyPageStyle {
  background-color: #ffffff !important;
  overflow-y: auto;
}
</style>
