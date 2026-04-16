<script setup lang="ts">
import { reactive, ref, watch, h } from 'vue';
import { message } from 'ant-design-vue';
import type { TableColumnType } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { usePagination } from '@/hooks/usePagination';
import { ProcessFlowListPageRequestDTOModel } from '@/api/models/processTask/ProcessFlowListPageRequestDTOModel';
import { sortermethod } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
const props = defineProps<{
  menuId?: string | number;
  treeNodeKey?: string | number;
}>();

type FlowRow = {
  id: number | string;
  processCode: string;
  processName: string;
  level: string;
  processType: string;
  publishState: string;
  appState: string;
  createTime: string;
  contributor: string;
};

const loading = ref(false);
const tableData = ref<FlowRow[]>([]);
const requestParams = reactive(new ProcessFlowListPageRequestDTOModel());

function handleResizeColumn(w, col) {
  col.width = w;
}

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

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
/** 勾选表格数据源  */
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, loadFlowListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

const selectedRowKeys = ref<Array<string | number>>([]);
const columns = ref<TableColumnType<FlowRow>[]>([
  {
    title: '序号',
    key: 'rowIndex',
    dataIndex: 'rowIndex',
    align: 'center',
    width: 80,
    fixed: 'left',
    customRender: ({ index }) => {
      const current = Number(pagination.current || 1);
      const pageSize = Number(pagination.pageSize || 10);
      return (current - 1) * pageSize + index + 1;
    },
  },
  {
    title: '流程标识',
    dataIndex: 'processCode',
    key: 'processCode',
    align: 'left',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.processCode, b.processCode),
    width: 180,
  },
  {
    title: '流程名称',
    dataIndex: 'processName',
    key: 'processName',
    align: 'left',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.processName, b.processName),
    width: 180,
  },
  {
    title: '密级',
    dataIndex: 'level',
    key: 'level',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.level, b.level),
    width: 120,
  },
  {
    title: '流程类型',
    dataIndex: 'processType',
    key: 'processType',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.processType, b.processType),
    width: 120,
  },
  {
    title: '发布协同',
    dataIndex: 'publishState',
    key: 'publishState',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.publishState, b.publishState),
    width: 120,
  },
  {
    title: '独立应用',
    dataIndex: 'appState',
    key: 'appState',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.appState, b.appState),
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.createTime, b.createTime),
    width: 190,
  },
  {
    title: '贡献者',
    dataIndex: 'contributor',
    key: 'contributor',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.contributor, b.contributor),
    width: 120,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 180,
    fixed: 'right',
  },
  { fixed: 'right', width: 1 },
]);

async function queryFlowListFromBackend(params: ProcessFlowListPageRequestDTOModel) {
  /**
   * TODO: 后续你在这里替换成真实后端接口
   * 例如：
   * const res = await AdminApiSystemProcessTask.xxxProcessPageList(params);
   * return {
   *   list: res.data?.data?.list ?? [],
   *   total: Number(res.data?.data?.total ?? 0),
   * };
   */
  const pageNo = Number(params.pageNo || 1);
  const pageSize = Number(params.pageSize || 10);
  const total = 36;
  const start = (pageNo - 1) * pageSize + 1;
  const end = Math.min(total, start + pageSize - 1);
  const list: FlowRow[] = [];
  for (let i = start; i <= end; i++) {
    list.push({
      id: i,
      processCode: `process${Date.now()}${i}`,
      processName: `流程测试${i}`,
      level: i % 2 === 0 ? '公开' : '内部',
      processType: '设计流程',
      publishState: i % 3 === 0 ? '已发布' : '待发布',
      appState: i % 2 === 0 ? '已发布' : '未发布',
      createTime: '2025/03/26 17:52:41',
      contributor: 'admin',
    });
  }
  return { list, total };
}

async function loadFlowListData() {
  loading.value = true;
  try {
    requestParams.menuId = props.menuId ?? '';
    requestParams.treeId = props.treeNodeKey ?? '';
    const res = await queryFlowListFromBackend(requestParams);
    tableData.value = Array.isArray(res.list) ? res.list : [];
    pagination.total = Number(res.total ?? 0);
  } catch (e) {
    tableData.value = [];
    pagination.total = 0;
    message.error('流程列表加载失败');
  } finally {
    loading.value = false;
  }
}

function resetAndReload() {
  pagination.current = 1;
  requestParams.pageNo = 1;
  void loadFlowListData();
}

function handleActionClick(action: string) {
  message.info(`${action}（待接后端）`);
}

watch(
  () => [props.menuId, props.treeNodeKey],
  () => {
    resetAndReload();
  },
  { immediate: true },
);

defineExpose({
  reloadList(resetPage = false) {
    if (resetPage) {
      resetAndReload();
      return;
    }
    void loadFlowListData();
  },
});
</script>

<template>
  <div class="process-panel">
    <div class="process-panel__toolbar">
      <a-space :size="10" wrap>
        <a-button type="primary" @click="handleActionClick('新增')">添加</a-button>
        <a-button type="primary" @click="handleActionClick('编辑')">编辑</a-button>
        <a-button type="primary" @click="handleActionClick('复制')">复制</a-button>
        <a-button type="primary" @click="handleActionClick('发布协同')">发布协同</a-button>
        <a-button type="primary" @click="handleActionClick('驳回发布协同')">撤回协同</a-button>
        <a-button type="primary" @click="handleActionClick('发布独立应用')">发布独立应用</a-button>
        <a-button type="primary" @click="handleActionClick('取消发布应用')">撤回发布应用</a-button>
      </a-space>
    </div>

    <a-table
      style="margin-top: 5px"
      :scroll="{ x: 1200, y: 500 }"
      :row-key="(record: any) => record.id"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :row-selection="rowSelection"
      :customRow="customRow"
      @resizeColumn="handleResizeColumn"
      :locale="locale"
      :loading="loading"
      :sticky="true"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <template v-if="record.publishState !== '已发布'">
            <a @click="handleActionClick(`查看-${record.id}`)">查看</a>
            <a-divider type="vertical" />
            <a @click="handleActionClick(`编辑-${record.id}`)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="handleActionClick(`删除-${record.id}`)">
              <a-button type="link" danger class="p-0">删除</a-button>
            </a-popconfirm>
          </template>
          <template v-else>
            <span class="operation-disabled">查看</span>
            <a-divider type="vertical" />
            <span class="operation-disabled">编辑</span>
            <a-divider type="vertical" />
            <span class="operation-disabled">删除</span>
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang="less" scoped>
.process-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 180px);
  padding: 10px;
  box-sizing: border-box;
}

.process-panel__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.process-panel__level {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

:deep(.flow-row-actions) {
  display: flex;
  justify-content: center;
  gap: 10px;
}

:deep(.operation-disabled) {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

:deep(.p-0) {
  padding: 0 !important;
}
</style>
