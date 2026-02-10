<template>
  <div class="params-toolbar">
    <a-input v-model:value="requestParams.demandNum" placeholder="请输入需求编号" style="width: 220px" />
    <a-button type="primary" class="ml-2" @click="getListData">
      <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
      {{ $t('查询') }}
    </a-button>
    <!-- <a-button type="primary" @click="exportParameterInfo()" style="margin-left: 12px">
      <EpcIcon type="icon-daochu" style="font-size: 12px" />
      {{ $t('Excel导出') }}
    </a-button> -->
  </div>
  <div class="b-body2">
    <a-table
      bordered
      :scroll="{ x: 2000 }"
      :row-key="(record: any) => record.id"
      :columns="columns"
      :locale="locale"
      :loading="loading"
      @resizeColumn="handleResizeColumn"
      :data-source="dataSource"
      :pagination="pagination"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'periodicAttribute'">
          <span>{{ periodicAttributemedth(record.periodicAttribute) }}</span>
        </template>
        <template v-if="column.dataIndex === 'taskStatus'">
          <span :style="getStatusStyle(record.taskStatus)">{{ record.taskStatus }}</span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <span :style="getStatusStyle(record.status)">{{ getTaskStatusLabel(record.status) }}</span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledconfirm(record)" @click="handleChangetask(record, 'edit')">确定</a-button>
          <a-divider type="vertical" />
          <a-button shape="circle" type="link" @click="handleChangetask(record, 'detail')">详情</a-button>
        </template>
      </template>
    </a-table>
  </div>
  <platRequirementimplementation
    :modalVisible="RequirementimplementationVisible"
    ref="RequirementimplementationRef"
    @onClose="RequirementimplementationVisible = false"
    @RefreshtableData="getListData" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { downloadFileFromStream } from '@/utils/file.ts';
import { message } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
import type { TableColumnType } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ProductPlatformgettaskRequestDTOModel } from '@/api/models/product/ProductPlatformgettaskRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { useUserStore } from '@/store/modules/user';
import { sortermethod } from '@/utils/tools';
import { getStatusStyle } from '@/style/StatusStyle';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { periodicAttributemedth } from '@/utils/Requirementtablejudgment';
import platRequirementimplementation from './modalComponent/platRequirementimplementation.vue';
import { AdminApiSystemplementation } from '@/api/tags/demand/管理需求实现';
import { Isiteditable } from '@/utils/Requirementtablejudgment';
// 组件接收的属性
interface Props {
  currentNodeData?: any;
}
const props = withDefaults(defineProps<Props>(), {
  currentNodeData: () => null,
});
function handleResizeColumn(w, col) {
  col.width = w;
}
const RequirementimplementationVisible = ref<boolean>(false);
const RequirementimplementationRef = ref<any>();
const userStore = useUserStore();
const loading = ref<boolean>(false);
const requestParams = reactive<any>(new ProductPlatformgettaskRequestDTOModel());
const dataSource = ref<any[]>([]);
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const categoryInfo = ref<any>(null);
// 不是已分发确认按钮禁用
function disabledconfirm(record: any) {
  if (record.status === TaskStatus.DISPATCHED) {
    return false;
  } else {
    return true;
  }
}
const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: center;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: WeiI18n.$t('需求编号'),
    dataIndex: 'demandNum',
    key: 'demandNum',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandNum, b.demandNum),
    width: 120,
  },
  {
    title: WeiI18n.$t('任务名称'),
    dataIndex: 'taskName',
    key: 'taskName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskName, b.taskName),
    width: 120,
  },
  {
    title: WeiI18n.$t('版本'),
    dataIndex: 'version',
    key: 'version',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
    width: 100,
  },
  {
    title: WeiI18n.$t('初始需求标题'),
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandTitle, b.demandTitle),
    width: 240,
  },
  {
    title: WeiI18n.$t('需求来源'),
    dataIndex: 'demandSource',
    key: 'demandSource',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandSource, b.demandSource),
    width: 120,
  },
  {
    title: WeiI18n.$t('区域市场'),
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.regionalMarket, b.regionalMarket),
    width: 120,
  },
  {
    title: WeiI18n.$t('细分市场'),
    dataIndex: 'marketSegment',
    key: 'marketSegment',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.marketSegment, b.marketSegment),
    width: 160,
  },
  {
    title: WeiI18n.$t('提出人'),
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.originaUserName, b.originaUserName),
    width: 120,
  },
  {
    title: WeiI18n.$t('需求状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 150,
  },
  {
    title: WeiI18n.$t('需求实现周期'),
    dataIndex: 'periodicAttribute',
    key: 'periodicAttribute',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.periodicAttribute, b.periodicAttribute),
    width: 130,
  },
  {
    title: WeiI18n.$t('分发时间'),
    dataIndex: 'allocateTime',
    key: 'allocateTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.allocateTime, b.allocateTime),
    width: 130,
  },
  {
    title: WeiI18n.$t('需求落实方案'),
    dataIndex: 'implementPlan',
    key: 'implementPlan',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.implementPlan, b.implementPlan),
    width: 130,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 100,
    fixed: 'right',
  },
]);
async function initgetListData(selectedKeys: any) {
  categoryInfo.value = selectedKeys;
  requestParams.platformId = selectedKeys.key;
  getListData();
}
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemplementation.productPlatformTaskPage({ ...requestParams });
    if (res.data.code == 200) {
      dataSource.value = res.data.data.list;
      pagination.total = res.data.data.total;
    }
  } finally {
    loading.value = false;
  }
}
function handleChangetask(row: any, type: string) {
  RequirementimplementationVisible.value = true;
  nextTick(() => {
    RequirementimplementationRef.value.handleModalChange(row, type);
  });
}
async function exportParameterInfo() {
  let data = categoryInfo.value.key;
  const res = await AdminApiSystemProduct.exportDataPlatParameterList(data);
  const fileName = categoryInfo.value.partName + '-参数.xlsx';
  downloadFileFromStream(res, fileName);
}

defineExpose({ initgetListData });
</script>

<style lang="less" scoped>
.parameter-definition {
  height: 100%;
}

.params-toolbar {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.b-body2 {
  height: calc(100vh - 320px);
  overflow: auto;
  margin-top: 20px;
}
:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}

/* 确保分页选择器有足够宽度显示完整文本 */
:deep(.ant-pagination-options-size-changer) {
  min-width: 100px;
}

:deep(.ant-select-selector) {
  min-width: 80px !important;
}

/* 减小数字和单位之间的间距 */
:deep(.ant-select-selection-item) {
  display: flex !important;
  align-items: center !important;
  gap: 2px !important;
}

:deep(.ant-select-selection-item-content) {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
