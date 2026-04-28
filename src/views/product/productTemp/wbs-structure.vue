<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { TableColumnsType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { FileOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';

const { t } = useI18n();

/** 接口返回的任务项 */
export type WbsTaskItem = {
  nodeId: string;
  taskId: string;
  taskName: string;
  publishVersionId?: string;
  publishVersionNo?: number;
  selected: boolean;
  requiredFlag?: number | null;
};

/** 前端表格行数据（从接口 tree 节点映射而来） */
export type WbsRow = {
  id: string;
  /** 序号（接口字段 sort） */
  serialNo: number;
  /** 前端根据树位置生成，如 1.1.2 */
  wbsCode: string;
  /** 节点名称（接口字段 name） */
  nodeName: string;
  /** 任务层级（根据树深度计算） */
  planLevel: string;
  /** 是否必选项（接口字段 requiredFlag: 0|1） */
  required: boolean;
  /** 关联任务流程展示文本 */
  taskFlow: string;
  /** 当前选中的任务 ID */
  taskFlowSelectValue?: string;
  /** 该节点可选的任务列表（接口字段 taskList） */
  taskOptions: Array<{ value: string; label: string }>;
  /** 原始 taskList，保存时需要 */
  _rawTaskList: WbsTaskItem[];
  /** 接口字段 selected */
  selected: boolean;
  /** 接口字段 menuId */
  menuId?: string;
  /** 接口字段 parentId */
  parentId?: string;
  children?: WbsRow[];
};

// ─── 接口数据 → WbsRow 转换 ─────────────────────────────────

/** 将接口返回的 tree 节点递归转换为 WbsRow */
function mapApiNodeToWbsRow(node: any, index: number, prefix: string): WbsRow {
  const wbsCode = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
  const taskList: WbsTaskItem[] = node.taskList ?? [];
  const taskOptions = taskList.map((tk: WbsTaskItem) => ({
    value: tk.taskId,
    label: tk.taskName,
  }));
  const selectedTask = taskList.find((tk: WbsTaskItem) => tk.selected);

  const children: WbsRow[] = (node.children ?? []).map((child: any, i: number) =>
    mapApiNodeToWbsRow(child, i, wbsCode),
  );

  return {
    id: String(node.id ?? ''),
    serialNo: node.sort ?? (index + 1),
    wbsCode,
    nodeName: node.name ?? '',
    planLevel: '',
    required: node.requiredFlag === 1,
    taskFlow: '',
    taskFlowSelectValue: node.taskId ? String(node.taskId) : (selectedTask?.taskId ? String(selectedTask.taskId) : undefined),
    taskOptions,
    _rawTaskList: taskList,
    selected: !!node.selected,
    menuId: node.menuId != null ? String(node.menuId) : undefined,
    parentId: node.parentId != null ? String(node.parentId) : undefined,
    children: children.length ? children : undefined,
  };
}

/** 将接口 tree 数组转为 WbsRow[] 并填充计算字段 */
function transformApiTree(apiTree: any[]): WbsRow[] {
  const rows = apiTree.map((node: any, i: number) => mapApiNodeToWbsRow(node, i, ''));
  applyPlanLevelByTreeDepth(rows);
  syncTaskFlowLabel(rows);
  return rows;
}

// ─── 辅助函数 ───────────────────────────────────────────────

/** 是否显示任务下拉（taskList 非空且有选项时才显示） */
function isTaskFlowDropdownRow(row: WbsRow): boolean {
  return Array.isArray(row.taskOptions) && row.taskOptions.length > 0;
}

function taskFlowLabelFromSelectValue(value: string | undefined, row: WbsRow): string {
  if (!value) return `${row.nodeName ?? ''}流程`;
  const hit = row.taskOptions?.find(o => o.value === value);
  return hit?.label ?? `${row.nodeName ?? ''}流程`;
}

/** 根为一级，子节点依次为二级、三级… */
function depthToTaskLevel(depth: number): string {
  if (depth < 1) return '-';
  const d = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (depth < 10) return `${d[depth]}级`;
  if (depth === 10) return '十级';
  if (depth < 20) return `十${d[depth % 10]}级`;
  if (depth < 100) {
    const tens = Math.floor(depth / 10);
    const ones = depth % 10;
    return `${tens === 1 ? '十' : `${d[tens]}十`}${ones ? d[ones] : ''}级`;
  }
  return `${depth}级`;
}

function applyPlanLevelByTreeDepth(rows: WbsRow[], depth = 1): void {
  for (const row of rows) {
    row.planLevel = depthToTaskLevel(depth);
    if (row.children?.length) applyPlanLevelByTreeDepth(row.children, depth + 1);
  }
}

function syncTaskFlowLabel(rows: WbsRow[]): void {
  for (const row of rows) {
    if (isTaskFlowDropdownRow(row)) {
      row.taskFlow = taskFlowLabelFromSelectValue(row.taskFlowSelectValue, row);
    } else {
      row.taskFlow = `${row.nodeName ?? ''}流程`;
    }
    if (row.children?.length) syncTaskFlowLabel(row.children);
  }
}

function onTaskFlowSelectChange(record: WbsRow) {
  record.taskFlow = taskFlowLabelFromSelectValue(record.taskFlowSelectValue, record);
}

// ─── 路由 & 状态 ────────────────────────────────────────────

const route = useRoute();
const router = useRouter();

const tempId = computed(() => (route.query.id as string) || '');
const loading = ref<boolean>(false);
const tableData = ref<WbsRow[]>([]);

const pageTitle = computed(() => {
  const name = (route.query.tempName as string) || '';
  const num = (route.query.tempNum as string) || '';
  if (name && num) return `${name}（${num}）`;
  if (name) return name;
  return t('WBS结构');
});

// ─── 表格列 ─────────────────────────────────────────────────

const SCROLL_X_BUFFER_PX = 48;

function createWbsColumns(): TableColumnsType<WbsRow> {
  return [
    { title: t('序号'), dataIndex: 'serialNo', key: 'serialNo', width: 60, align: 'center', fixed: 'left', resizable: true },
    { title: t('WBS编号'), dataIndex: 'wbsCode', key: 'wbsCode', width: 180, ellipsis: true, fixed: 'left', resizable: true },
    { title: t('节点名称'), dataIndex: 'nodeName', key: 'nodeName', width: 260, ellipsis: true, fixed: 'left', resizable: true },
    { title: t('任务层级'), dataIndex: 'planLevel', key: 'planLevel', width: 120, align: 'center', ellipsis: true, resizable: true },
    { title: t('是否必选项'), dataIndex: 'required', key: 'required', width: 96, align: 'center', resizable: true },
    { title: t('关联任务流程'), dataIndex: 'taskFlow', key: 'taskFlow', width: 220, align: 'left', ellipsis: true, resizable: true },
    { title: t('操作'), key: 'operation', dataIndex: 'operation', width: 180, align: 'center', fixed: 'right', resizable: false },
  ];
}

const columns = ref<TableColumnsType<WbsRow>>(createWbsColumns());
const scrollX = computed(() => columns.value.reduce((s, c) => s + (Number(c.width) || 0), 0) + SCROLL_X_BUFFER_PX);

function handleResizeColumn(w: number, col: { width?: number | string }) { col.width = w; }
function wbsRowKey(r: WbsRow) { return r.id; }
function isLeaf(record: WbsRow) { return !record.children?.length; }
function toggleRequired(record: WbsRow) { record.required = !record.required; }

// ─── API 调用 ───────────────────────────────────────────────

async function fetchWbsTree() {
  if (!tempId.value) return;
  loading.value = true;
  try {
    const res = await AdminApiProductTemp.getWbsTreeList({ tempId: tempId.value, menuId: 1 });
    const apiTree = res?.data?.data?.tree ?? res?.data?.tree ?? [];
    tableData.value = transformApiTree(apiTree);
  } catch (err: any) {
    message.error(err?.message || t('加载WBS树失败'));
  } finally {
    loading.value = false;
  }
}

/** 将表格树映射为保存接口所需的 tree 格式 */
function mapToSaveTree(rows: WbsRow[]): any[] {
  return rows.map(row => ({
    id: row.id,
    name: row.nodeName,
    parentId: row.parentId,
    sort: row.serialNo,
    selected: row.selected,
    requiredFlag: row.required ? 1 : 0,
    taskId: row.taskFlowSelectValue,
    children: row.children ? mapToSaveTree(row.children) : [],
  }));
}

// validation logic is moved inline inline over to onSave

// ─── 节点编辑状态 ─────────────────────────────────────────────
const editingId = ref<string>('');
const editingRequired = ref<boolean>(false);
const editingTaskFlowSelectValue = ref<string | undefined>(undefined);

function onAddRoot() { message.info(t('新增节点（演示）')); }

function onEdit(record: WbsRow) {
  editingId.value = record.id;
  editingRequired.value = record.required;
  editingTaskFlowSelectValue.value = record.taskFlowSelectValue;
}

function onSaveEdit(record: WbsRow) {
  record.required = editingRequired.value;
  record.taskFlowSelectValue = editingTaskFlowSelectValue.value;
  record.taskFlow = taskFlowLabelFromSelectValue(record.taskFlowSelectValue, record);
  editingId.value = '';
}

function onCancelEdit() {
  editingId.value = '';
}

async function onDelete(record: WbsRow) {
  if (!tempId.value) return;
  if (record.children?.length) { message.warning(t('该节点包含子节点，无法删除')); return; }
  try {
    await AdminApiProductTemp.deleteWbsNode({ tempId: tempId.value, nodeId: record.id, menuId: 1 });
    message.success(`${t('删除成功')}：${record.nodeName}`);
    await fetchWbsTree();
  } catch (err: any) { message.error(err?.message || t('删除失败')); }
}

function findSiblings(rows: WbsRow[], targetId: string): WbsRow[] | null {
  for (const row of rows) {
    if (row.id === targetId) return rows;
    if (row.children?.length) {
      const found = findSiblings(row.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

async function onMoveUp(record: WbsRow) {
  if (!tempId.value) return;
  const siblings = findSiblings(tableData.value, record.id);
  if (siblings) {
    if (siblings.length === 1) {
      message.warning(t('同级仅有一条数据，无法移动'));
      return;
    }
    if (siblings[0].id === record.id) {
      message.warning(t('已经是第一条，无法上移'));
      return;
    }
  }
  
  try {
    await AdminApiProductTemp.moveUpNode({ tempId: tempId.value, nodeId: record.id });
    await fetchWbsTree();
  } catch (err: any) { message.error(err?.message || t('上移失败')); }
}

async function onMoveDown(record: WbsRow) {
  if (!tempId.value) return;
  const siblings = findSiblings(tableData.value, record.id);
  if (siblings) {
    if (siblings.length === 1) {
      message.warning(t('同级仅有一条数据，无法移动'));
      return;
    }
    if (siblings[siblings.length - 1].id === record.id) {
      message.warning(t('已经是最后一条，无法下移'));
      return;
    }
  }

  try {
    await AdminApiProductTemp.moveDownNode({ tempId: tempId.value, nodeId: record.id });
    await fetchWbsTree();
  } catch (err: any) { message.error(err?.message || t('下移失败')); }
}

function goBack() { router.back(); }

async function onSave() {
  if (!tempId.value) return;

  if (editingId.value) {
    message.warning(t('请确保所有列表都为完成状态'));
    return;
  }
  
  const validateTasks = (rows: WbsRow[]): boolean => {
    for (const row of rows) {
      // 校验: 对于选中节点，且其后端返回的 taskList 不为空时，必须选择一个 taskId
      const hasTaskList = Array.isArray(row._rawTaskList) && row._rawTaskList.length > 0;
      if (row.selected && hasTaskList && !row.taskFlowSelectValue) {
        message.warning(`节点【${row.nodeName}】必须选择关联任务流程`);
        return false;
      }
      if (row.children?.length && !validateTasks(row.children)) {
        return false;
      }
    }
    return true;
  };

  if (!validateTasks(tableData.value)) {
    return;
  }

  try {
    const res = await AdminApiProductTemp.saveWbsSnapshot({
      tempId: tempId.value,
      menuId: 1,
      tree: mapToSaveTree(tableData.value),
    });
    message.success(WeiI18n.$t('保存成功'));
    
    const savedTree = res?.data?.data?.tree ?? res?.data?.tree;
    if (savedTree && Array.isArray(savedTree) && savedTree.length > 0) {
      tableData.value = transformApiTree(savedTree);
    } else {
      await fetchWbsTree();
    }
  } catch (err: any) { message.error(err?.message || WeiI18n.$t('保存失败')); }
}

onMounted(() => { fetchWbsTree(); });
</script>

<template>
  <div class="drawerContent product-temp-wbs-page">
    <a-card class="wbs-card" :bordered="false">
      <div class="wbs-top-bar">
        <div class="wbs-top-bar__left">
          <a-button type="primary" @click="onAddRoot">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ $t('新增') }}
          </a-button>
        </div>
        <div class="wbs-top-bar__right">{{ t('模版名称') }}：{{ pageTitle }}</div>
      </div>
      <a-table
        class="wbs-table exe-config-table mt-[16px]"
        table-layout="fixed"
        :columns="columns"
        :data-source="tableData"
        :row-key="wbsRowKey"
        :pagination="false"
        bordered
        :loading="loading"
        :scroll="{ x: scrollX }"
        default-expand-all-rows
        :expand-icon-column-index="1"
        @resize-column="handleResizeColumn">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'wbsCode'">
            <span class="wbs-code-cell">
              <component :is="isLeaf(record) ? FileOutlined : FolderOutlined" class="wbs-code-cell__icon" />
              <span>{{ record.wbsCode }}</span>
            </span>
          </template>
          <template v-else-if="column.key === 'nodeName'">
            <span class="wbs-node-name-text" :title="record.nodeName">{{ record.nodeName }}</span>
          </template>
          <template v-else-if="column.key === 'required'">
            <a-switch
              :checked="editingId === record.id ? editingRequired : record.required"
              :disabled="editingId !== record.id"
              checked-children="ON"
              un-checked-children="OFF"
              @change="(val) => { if (editingId === record.id) editingRequired = val }"
              @click.stop
            />
          </template>
          <template v-else-if="column.key === 'taskFlow'">
            <a-select
              v-if="editingId === record.id && isTaskFlowDropdownRow(record)"
              v-model:value="editingTaskFlowSelectValue"
              :options="record.taskOptions"
              class="wbs-taskflow-select"
              dropdown-class-name="wbs-taskflow-select-dropdown"
              allow-clear
              :placeholder="t('请选择')"
              @click.stop />
            <span v-else class="wbs-taskflow-text">{{ record.taskFlow }}</span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span v-if="editingId === record.id" class="wbs-ops">
              <a class="wbs-ops__link" @click.prevent="onSaveEdit(record)">{{ $t('完成') }}</a>
              <a class="wbs-ops__link" @click.prevent="onCancelEdit()">{{ $t('取消') }}</a>
            </span>
            <span v-else class="wbs-ops">
              <a class="wbs-ops__link" @click.prevent="onEdit(record)">{{ $t('编辑') }}</a>
              <a class="wbs-ops__link" @click.prevent="onMoveUp(record)">{{ $t('上移') }}</a>
              <a class="wbs-ops__link" @click.prevent="onMoveDown(record)">{{ $t('下移') }}</a>
              <a-popconfirm
                :title="$t('确定要删除该节点吗？')"
                @confirm="onDelete(record)"
              >
                <a class="wbs-ops__link wbs-ops__link--danger" @click.prevent>{{ $t('删除') }}</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
      <div class="wbs-footer-actions">
        <a-button type="primary" @click="onSave">{{ $t('保存') }}</a-button>
        <a-button @click="goBack">{{ $t('返回') }}</a-button>
      </div>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.product-temp-wbs-page {
  min-height: 0;
  padding: 0 12px 12px;
  box-sizing: border-box;
}

.wbs-card {
  border: none !important;
  box-shadow: none !important;

  :deep(.ant-card-body) {
    padding: 12px 0;
  }
}

.wbs-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.wbs-top-bar__left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.wbs-top-bar__right {
  flex: 1 1 200px;
  min-width: 0;
  text-align: right;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.88);
  line-height: 32px;
}

.wbs-footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.wbs-table {
  :deep(.ant-table-thead > tr > th) {
    background: #fafafa;
  }
}

/* 与 ant-table 表体一致：14px（与 .ant-table-tbody 默认字号对齐） */
.wbs-taskflow-select {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  font-size: 14px;
}

.wbs-taskflow-select :deep(.ant-select-selector) {
  display: flex !important;
  align-items: center !important;
  font-size: 14px !important;
}

.wbs-taskflow-select :deep(.ant-select-selection-item),
.wbs-taskflow-select :deep(.ant-select-selection-placeholder) {
  display: flex !important;
  align-items: center !important;
  font-size: 14px !important;
  line-height: 1.5715 !important;
}

.wbs-taskflow-select :deep(.ant-select-selection-search-input) {
  font-size: 14px !important;
  line-height: 1.5715 !important;
}

.wbs-taskflow-text {
  display: inline-block;
  max-width: 100%;
  font-size: 14px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.wbs-code-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.wbs-code-cell__icon {
  color: #8c8c8c;
  font-size: 14px;
}


.wbs-ops {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.wbs-ops__link {
  /* 与「样式配置 → 系统主题」一致：common.less 中 --ant-primary-color 随 --project-system-primary 更新 */
  color: var(--ant-primary-color);
  cursor: pointer;
  user-select: none;
}

.wbs-ops__link:hover {
  color: var(--ant-primary-color-hover);
}

.wbs-ops__link--danger {
  color: #ff4d4f;
}


</style>

<style lang="less">
.wbs-taskflow-select-dropdown .ant-select-item-option {
  display: flex !important;
  align-items: center !important;
}

.wbs-taskflow-select-dropdown .ant-select-item-option-content {
  font-size: 14px;
  line-height: 1.5715;
  display: flex;
  align-items: center;
}
</style>
