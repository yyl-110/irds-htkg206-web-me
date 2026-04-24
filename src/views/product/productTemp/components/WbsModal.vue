<script lang="ts" setup>
import { ref, computed, h } from 'vue';
import { CaretDownOutlined, CaretRightOutlined, EyeOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import draggableModal from '@/components/DraggableModal/index.vue';
import Empty from '@/components/Empty/index.vue';

// ─── 类型 ────────────────────────────────────────────────────────────────────
interface WbsNode {
  id: string;
  wbsCode: string;        // WBS编号
  wbsName: string;        // 节点名称
  planLevel: string;      // 计划级别
  milestone: string;      // 里程碑（是/否）
  isCritical: string;     // 是否关键任务（是/否）
  children?: WbsNode[];
}

// ─── 状态 ────────────────────────────────────────────────────────────────────
const visible = ref(false);
const moduleName = ref('');
const selectedRowKeys = ref<string[]>([]);

// ─── Mock 树形数据（贴合图片结构） ───────────────────────────────────────────
const mockData: WbsNode[] = [
  {
    id: '1',
    wbsCode: '1',
    wbsName: '厨房龙头',
    planLevel: '设计阶段',
    milestone: '否',
    isCritical: '否',
    children: [
      {
        id: '1-1',
        wbsCode: '1.1',
        wbsName: '一字拉出式龙头',
        planLevel: '一级',
        milestone: '否',
        isCritical: '否',
        children: [
          {
            id: '1-1-1',
            wbsCode: '1.1.1',
            wbsName: '需求录入',
            planLevel: '',
            milestone: '否',
            isCritical: '否',
          },
          {
            id: '1-1-2',
            wbsCode: '1.1.2',
            wbsName: '产品配置',
            planLevel: '',
            milestone: '否',
            isCritical: '否',
            children: [
              {
                id: '1-1-2-1',
                wbsCode: '1.1.2.1',
                wbsName: '主体',
                planLevel: '/',
                milestone: '否',
                isCritical: '否',
              },
              {
                id: '1-1-2-2',
                wbsCode: '1.1.2.2',
                wbsName: '抽拉头',
                planLevel: '/',
                milestone: '否',
                isCritical: '否',
              },
              {
                id: '1-1-2-3',
                wbsCode: '1.1.2.3',
                wbsName: '出水弯管',
                planLevel: '/',
                milestone: '否',
                isCritical: '否',
              },
              {
                id: '1-1-2-4',
                wbsCode: '1.1.2.4',
                wbsName: '把手',
                planLevel: '/',
                milestone: '否',
                isCritical: '否',
              },
            ],
          },
          {
            id: '1-1-3',
            wbsCode: '1.1.3',
            wbsName: 'DBOM搭建及出图',
            planLevel: '',
            milestone: '否',
            isCritical: '否',
          },
          {
            id: '1-1-4',
            wbsCode: '1.1.4',
            wbsName: 'MBOM搭建',
            planLevel: '',
            milestone: '否',
            isCritical: '否',
          },
        ],
      },
    ],
  },
];

const wbsData = ref<WbsNode[]>(mockData);
const expandedRowKeys = ref<string[]>(['1', '1-1', '1-1-2']);

// ─── 展平序号（用于渲染序号列，按可见顺序递增） ──────────────────────────────
function flattenVisible(nodes: WbsNode[], expanded: string[]): WbsNode[] {
  const result: WbsNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children?.length && expanded.includes(node.id)) {
      result.push(...flattenVisible(node.children, expanded));
    }
  }
  return result;
}

const visibleRows = computed(() => flattenVisible(wbsData.value, expandedRowKeys.value));
function getRowIndex(id: string) {
  return visibleRows.value.findIndex(r => r.id === id) + 1;
}

// ─── 行勾选 ──────────────────────────────────────────────────────────────────
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
}));

// ─── 列定义 ──────────────────────────────────────────────────────────────────
const columns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: 'WBS编号',
    dataIndex: 'wbsCode',
    key: 'wbsCode',
    width: 160,
    align: 'left',
    ellipsis: true,
  },
  {
    title: '节点名称',
    dataIndex: 'wbsName',
    key: 'wbsName',
    width: 200,
    align: 'left',
    ellipsis: true,
  },
  {
    title: '计划级别',
    dataIndex: 'planLevel',
    key: 'planLevel',
    width: 120,
    align: 'center',
  },
  {
    title: '里程碑',
    dataIndex: 'milestone',
    key: 'milestone',
    width: 100,
    align: 'center',
  },
  {
    title: '是否关键任务',
    dataIndex: 'isCritical',
    key: 'isCritical',
    width: 130,
    align: 'center',
  },
  {
    title: '操作',
    key: 'operation',
    dataIndex: 'operation',
    width: 180,
    align: 'center',
    fixed: 'right',
  },
];

const wbsTableScrollX = columns.reduce((acc, col) => acc + (typeof col.width === 'number' ? col.width : 0), 0) + 2;

const locale = {
  emptyText: h(Empty, { description: '暂无WBS数据', style: { paddingBottom: '30px' } }),
};

// ─── 行内编辑状态 ─────────────────────────────────────────────────────────────
const editingId = ref<string>('');
const editingRecord = ref<Partial<WbsNode>>({});

const yesNoOptions = [
  { label: '是', value: '是' },
  { label: '否', value: '否' },
];

function handleEdit(record: WbsNode) {
  editingId.value = record.id;
  editingRecord.value = { ...record };
}

function handleSave(record: WbsNode) {
  // 将 editingRecord 写回原数据（mock）
  const patch = (nodes: WbsNode[]): WbsNode[] =>
    nodes.map(n => {
      if (n.id === record.id) {
        return { ...n, ...editingRecord.value };
      }
      return n.children ? { ...n, children: patch(n.children) } : n;
    });
  wbsData.value = patch(wbsData.value);
  editingId.value = '';
  editingRecord.value = {};
}

function handleCancelEdit() {
  editingId.value = '';
  editingRecord.value = {};
}
function handleMoveUp(record: WbsNode) {
  console.log('上移', record);
}
function handleMoveDown(record: WbsNode) {
  console.log('下移', record);
}
function handleDelete(record: WbsNode) {
  console.log('删除', record);
}

// ─── 展开受控 ─────────────────────────────────────────────────────────────────
function onExpand(expanded: boolean, record: WbsNode) {
  if (expanded) {
    expandedRowKeys.value = [...expandedRowKeys.value, record.id];
  } else {
    expandedRowKeys.value = expandedRowKeys.value.filter(k => k !== record.id);
  }
}

// ─── show / close ─────────────────────────────────────────────────────────────
function show(name: string) {
  moduleName.value = name || '模块';
  selectedRowKeys.value = [];
  expandedRowKeys.value = ['1', '1-1', '1-1-2'];
  visible.value = true;
}

function close() {
  visible.value = false;
}

defineExpose({ show });
</script>

<template>
  <draggable-modal
    v-model:visible="visible"
    :width="1000"
    :footer="null"
    centered
    :closable="true"
    :mask-closable="false"
    :body-style="{ padding: '0' }"
    @cancel="close">
    <!-- 标题区 -->
    <template #title>
      <div class="wbs-modal-title">
        <span class="wbs-modal-title__icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="#1677ff" />
            <rect x="9" y="1" width="6" height="6" rx="1" fill="#1677ff" opacity=".5" />
            <rect x="1" y="9" width="6" height="6" rx="1" fill="#1677ff" opacity=".5" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="#1677ff" opacity=".3" />
          </svg>
        </span>
        <span class="wbs-modal-title__module">{{ moduleName }}</span>
      </div>
    </template>

    <!-- 工具栏 -->
    <div class="wbs-toolbar">
      <a-button type="primary">
        <template #icon><EyeOutlined /></template>
        浏览
      </a-button>
      <a-button type="primary">
        <template #icon><PlusCircleOutlined /></template>
        新建
      </a-button>
      <a-button :disabled="selectedRowKeys.length === 0">
        <template #icon><DeleteOutlined /></template>
        删除
      </a-button>
    </div>

    <!-- 表格主体 -->
    <div class="wbs-modal-body">
      <a-table
        class="wbs-table exe-config-table"
        :columns="columns"
        :data-source="wbsData"
        :row-key="record => record.id"
        :row-selection="rowSelection"
        :expanded-row-keys="expandedRowKeys"
        :scroll="{ x: wbsTableScrollX, y: 'calc(70vh - 100px)' }"
        :pagination="false"
        :locale="locale"
        bordered
        table-layout="fixed"
        :row-class-name="(_record, index) => (index % 2 === 0 ? 'odd' : 'even')"
        @expand="onExpand">
        <!-- 展开图标自定义 -->
        <template #expandIcon="{ expanded: isExpanded, record, onExpand: onExp }">
          <span
            v-if="record.children && record.children.length"
            class="wbs-expand-icon"
            @click.stop="onExp(record, $event)">
            <CaretDownOutlined v-if="isExpanded" />
            <CaretRightOutlined v-else />
          </span>
          <span v-else class="wbs-expand-placeholder" />
        </template>

        <!-- 列渲染 -->
        <template #bodyCell="{ column, record }">
          <!-- 序号 -->
          <template v-if="column.key === 'index'">
            <span class="wbs-seq">{{ getRowIndex(record.id) }}</span>
          </template>

          <!-- WBS编号：编辑态显示输入框 -->
          <template v-else-if="column.key === 'wbsCode'">
            <a-input
              v-if="editingId === record.id"
              v-model:value="editingRecord.wbsCode"
              size="small"
              class="wbs-cell-input" />
            <span v-else class="wbs-code-text">{{ record.wbsCode }}</span>
          </template>

          <!-- 里程碌：编辑态显示下拉 -->
          <template v-else-if="column.key === 'milestone'">
            <a-select
              v-if="editingId === record.id"
              v-model:value="editingRecord.milestone"
              :options="yesNoOptions"
              class="wbs-cell-select" />
            <span v-else>{{ record.milestone }}</span>
          </template>

          <!-- 是否关键任务：编辑态显示下拉 -->
          <template v-else-if="column.key === 'isCritical'">
            <a-select
              v-if="editingId === record.id"
              v-model:value="editingRecord.isCritical"
              :options="yesNoOptions"
              class="wbs-cell-select" />
            <span v-else>{{ record.isCritical }}</span>
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'operation'">
            <!-- 编辑态 -->
            <div v-if="editingId === record.id" class="wbs-operation-links" @click.stop>
              <a @click.stop.prevent="handleSave(record)">保存</a>
              <a @click.stop.prevent="handleCancelEdit">取消</a>
            </div>
            <!-- 只读态 -->
            <div v-else class="wbs-operation-links" @click.stop>
              <a @click.stop.prevent="handleEdit(record)">编辑</a>
              <a @click.stop.prevent="handleMoveUp(record)">上移</a>
              <a @click.stop.prevent="handleMoveDown(record)">下移</a>
              <a class="wbs-del-link" @click.stop.prevent="handleDelete(record)">删除</a>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 底部按钮 -->
    <div class="wbs-modal-footer">
      <a-button type="primary" @click="close">确定</a-button>
      <a-button @click="close">关闭</a-button>
    </div>
  </draggable-modal>
</template>

<style lang="less" scoped>
/* ── 标题区 ─────────────────────────────────────────────── */
.wbs-modal-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;

  &__icon {
    display: inline-flex;
    align-items: center;
  }

  &__module {
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* ── 工具栏 ──────────────────────────────────────────────── */
.wbs-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
}

/* ── 弹框表格主体 ─────────────────────────────────────────── */
.wbs-modal-body {
  padding: 12px 16px 0;
}

/* ── 表格（与项目 exe-config-table 一致） ────────────────── */
.wbs-table {
  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 13px;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }

  /* 展开列收紧 */
  :deep(.ant-table-row-expand-icon-cell),
  :deep(.ant-table-expand-icon-col) {
    width: 32px !important;
    min-width: 32px !important;
  }

  /* 勾选列 */
  :deep(.ant-table-selection-column) {
    width: 40px !important;
    min-width: 40px !important;
  }
}

/* ── 展开图标 ────────────────────────────────────────────── */
.wbs-expand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  cursor: pointer;
  color: #1677ff;
  font-size: 11px;
  border-radius: 3px;
  transition: background 0.2s;

  &:hover {
    background: #e6f4ff;
  }
}

.wbs-expand-placeholder {
  display: inline-block;
  width: 18px;
}

/* ── 序号 ────────────────────────────────────────────────── */
.wbs-seq {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}

/* ── 操作链接（编辑 上移 下移 | 删除） ──────────────────── */
@wbs-op-gap: 6px;
@wbs-divider: #e0e0e0;

.wbs-operation-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;

  > a {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 2px @wbs-op-gap;
    font-size: 13px;
    color: var(--ant-primary-color, #1677ff);
    white-space: nowrap;
    text-decoration: none;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    &:not(:first-child)::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 1px;
      height: 1em;
      margin-left: -0.5px;
      background: @wbs-divider;
      transform: translateY(-50%);
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

.wbs-del-link {
  color: #ff4d4f !important;
}

/* ── 底部按钮 ────────────────────────────────────────────── */
.wbs-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

/* ── 行内编辑控件 ─────────────────────────────────────────── */
.wbs-cell-input {
  width: 100%;
  min-width: 80px;
}

.wbs-cell-select {
  width: 100%;
  min-width: 80px;
}

.wbs-code-text {
  color: rgba(0, 0, 0, 0.85);
}
</style>
