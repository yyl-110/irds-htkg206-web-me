<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { TableColumnsType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { CaretDownOutlined, CaretRightOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { showRequestErrorIfNeeded } from '@/httpRequest';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import FlowView from '@/components/flowview/indexManager.vue';
import { markSkipPlatformPickerDrawerOnTab } from '@/utils/platformPickerDrawerNav';

const PROJECT_LIST_SKIP_DRAWER_ON_RETURN = 'project-info-list-skip-drawer-on-return';

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
  /** 节点类型（接口字段 type：1分类节点 2任务节点） */
  type?: number | null;
  /** 任务层级（根据树深度计算） */
  planLevel: string;
  /** 是否可裁剪（接口字段 requiredFlag: 0|1） */
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
  /** 接口字段 taskCount */
  taskCount?: number;
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
    type: node.type ?? undefined,
    planLevel: '',
    required: node.requiredFlag === 1,
    taskFlow: '',
    taskFlowSelectValue: node.taskId ? String(node.taskId) : (selectedTask?.taskId ? String(selectedTask.taskId) : undefined),
    taskOptions,
    _rawTaskList: taskList,
    selected: !!node.selected,
    menuId: node.menuId != null ? String(node.menuId) : undefined,
    parentId: node.parentId != null ? String(node.parentId) : undefined,
    taskCount: node.taskCount == null ? undefined : Number(node.taskCount),
    children: children.length ? children : undefined,
  };
}

/** 将接口 tree 数组转为 WbsRow[] 并填充计算字段 */
function transformApiTree(apiTree: any[]): WbsRow[] {
  const rows = apiTree.map((node: any, i: number) => mapApiNodeToWbsRow(node, i, ''));
  assignDefaultTaskFlow(rows);
  applyPlanLevelByTreeDepth(rows);
  syncTaskFlowLabel(rows);
  return rows;
}

function assignDefaultTaskFlow(rows: WbsRow[]): void {
  for (const row of rows) {
    if (!row.taskFlowSelectValue && Array.isArray(row.taskOptions) && row.taskOptions.length > 0) {
      row.taskFlowSelectValue = row.taskOptions[0].value;
    }
    if (row.children?.length) assignDefaultTaskFlow(row.children);
  }
}

// ─── 辅助函数 ───────────────────────────────────────────────

/** 是否有关联任务可选（taskList 非空且有选项） */
function isTaskFlowDropdownRow(row: WbsRow): boolean {
  return Array.isArray(row.taskOptions) && row.taskOptions.length > 0;
}

/** 多个任务选项时需展示「浏览」按钮供用户切换 */
function isTaskFlowMultiOptionRow(row: WbsRow): boolean {
  return Array.isArray(row.taskOptions) && row.taskOptions.length > 1;
}

function taskFlowLabelFromSelectValue(value: string | undefined, row: WbsRow): string {
  if (!value) return `${row.nodeName ?? ''}流程`;
  const hit = row.taskOptions?.find(o => o.value === value);
  return hit?.label ?? `${row.nodeName ?? ''}流程`;
}

/** 根节点为「产品」，子节点依次为一级、二级… */
function depthToTaskLevel(depth: number): string {
  if (depth < 1) return '-';
  if (depth === 1) return t('产品');
  const level = depth - 1;
  const d = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (level < 10) return `${d[level]}级`;
  if (level === 10) return '十级';
  if (level < 20) return `十${d[level % 10]}级`;
  if (level < 100) {
    const tens = Math.floor(level / 10);
    const ones = level % 10;
    return `${tens === 1 ? '十' : `${d[tens]}十`}${ones ? d[ones] : ''}级`;
  }
  return `${level}级`;
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
      row.taskFlow = '';
    }
    if (row.children?.length) syncTaskFlowLabel(row.children);
  }
}

function onTaskFlowSelectChange(record: WbsRow) {
  record.taskFlow = taskFlowLabelFromSelectValue(record.taskFlowSelectValue, record);
}

type TaskFlowPickerTableRow = {
  key: string;
  taskId: string;
  taskName: string;
};

const taskFlowPickerVisible = ref(false);
const taskFlowPickerRecord = ref<WbsRow | null>(null);
const taskFlowPickerValue = ref<string | undefined>(undefined);
const taskFlowPickerPreviewingId = ref<string | null>(null);

const taskFlowPickerColumns = computed<TableColumnsType<TaskFlowPickerTableRow>>(() => [
  { title: t('任务名称'), dataIndex: 'taskName', key: 'taskName', ellipsis: true },
  { title: t('操作'), key: 'operation', width: 88, align: 'center' },
]);

const taskFlowPickerTableData = computed<TaskFlowPickerTableRow[]>(() => {
  const record = taskFlowPickerRecord.value;
  if (!record) return [];
  return (record._rawTaskList ?? []).map((tk) => ({
    key: String(tk.taskId),
    taskId: String(tk.taskId),
    taskName: tk.taskName,
  }));
});

const taskFlowPickerTitle = computed(() => {
  const nodeName = taskFlowPickerRecord.value?.nodeName?.trim();
  if (!nodeName) return t('选择关联任务流程');
  return `${t('选择关联任务流程')} - ${nodeName}`;
});

const taskFlowPickerRowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: taskFlowPickerValue.value ? [taskFlowPickerValue.value] : [],
  onChange: (keys: (string | number)[]) => {
    taskFlowPickerValue.value = keys.length ? String(keys[0]) : undefined;
  },
}));

const flowViewVisible = ref(false);
const flowViewData = ref<{ xmlData?: string }>({});

function openTaskFlowPicker(record: WbsRow) {
  taskFlowPickerRecord.value = record;
  taskFlowPickerValue.value = record.taskFlowSelectValue ?? record.taskOptions[0]?.value;
  taskFlowPickerVisible.value = true;
}

function onTaskFlowPickerOk() {
  const record = taskFlowPickerRecord.value;
  if (!record) {
    taskFlowPickerVisible.value = false;
    return;
  }
  if (!taskFlowPickerValue.value) {
    message.warning(t('请选择关联任务流程'));
    return;
  }
  record.taskFlowSelectValue = taskFlowPickerValue.value;
  onTaskFlowSelectChange(record);
  taskFlowPickerVisible.value = false;
  taskFlowPickerRecord.value = null;
}

function onTaskFlowPickerCancel() {
  taskFlowPickerVisible.value = false;
  taskFlowPickerRecord.value = null;
}

function closeFlowView() {
  flowViewVisible.value = false;
  flowViewData.value = {};
}

function taskFlowPickerRowKey(r: TaskFlowPickerTableRow) {
  return r.key;
}

function taskFlowPickerCustomRow(pickerRow: TaskFlowPickerTableRow) {
  return {
    class: taskFlowPickerValue.value === pickerRow.taskId ? 'wbs-taskflow-picker-row--selected' : '',
    style: { cursor: 'pointer' },
    onClick: (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
      if (el?.closest('.wbs-ops__link')) return;
      taskFlowPickerValue.value = pickerRow.taskId;
    },
  };
}

async function onTaskFlowPreview(taskId: string) {
  if (!taskId || taskFlowPickerPreviewingId.value === taskId) return;
  let hideLoading: (() => void) | undefined;
  taskFlowPickerPreviewingId.value = taskId;
  try {
    hideLoading = message.loading(t('加载中...'), 0);
    const res = await AdminApiSystemProcessTask.getXmlInfo({ id: taskId });
    const xml = String(res?.data?.data?.bpmnXml ?? '').trim();
    if (!xml) {
      message.warning(t('暂无流程图数据'));
      return;
    }
    flowViewData.value = { xmlData: xml };
    flowViewVisible.value = true;
  } catch {
    message.error(t('获取流程图失败'));
  } finally {
    hideLoading?.();
    taskFlowPickerPreviewingId.value = null;
  }
}

/** 递归设置子树「是否可裁剪」 */
function setRequiredOnDescendants(rows: WbsRow[], required: boolean): void {
  for (const row of rows) {
    row.required = required;
    if (row.children?.length) setRequiredOnDescendants(row.children, required);
  }
}

function findWbsRowById(rows: WbsRow[], id: string): WbsRow | null {
  for (const row of rows) {
    if (row.id === id) return row;
    if (row.children?.length) {
      const found = findWbsRowById(row.children, id);
      if (found) return found;
    }
  }
  return null;
}

function normalizeWbsParentId(parentId?: string): string | undefined {
  const id = parentId?.trim();
  if (!id || id === '0') return undefined;
  return id;
}

/** 任一祖先为 Y 时，子节点不可单独改为 N */
function isRequiredSwitchDisabled(record: WbsRow): boolean {
  let parentId = normalizeWbsParentId(record.parentId);
  while (parentId) {
    const parent = findWbsRowById(tableData.value, parentId);
    if (!parent) break;
    if (parent.required) return true;
    parentId = normalizeWbsParentId(parent.parentId);
  }
  return false;
}

/** 父节点为 Y 时级联开启全部子孙；为 N 时不影响子孙（v-model 已更新当前节点） */
function onRequiredSwitchChange(record: WbsRow, checked: boolean): void {
  if (checked && record.children?.length) {
    setRequiredOnDescendants(record.children, true);
  }
}

function collectAllKeys(rows: WbsRow[]): string[] {
  const out: string[] = [];
  const walk = (nodes: WbsRow[]) => {
    nodes.forEach((n) => {
      out.push(n.id);
      if (n.children?.length) walk(n.children);
    });
  };
  walk(rows);
  return out;
}

function expandAllTableRows() {
  expandedRowKeys.value = collectAllKeys(tableData.value);
}

function collapseAllTableRows() {
  expandedRowKeys.value = [];
}

const isWbsTableFullyExpanded = computed(() => {
  const all = collectAllKeys(tableData.value);
  if (all.length === 0) return false;
  if (expandedRowKeys.value.length !== all.length) return false;
  const exp = new Set(expandedRowKeys.value);
  return all.every((k) => exp.has(k));
});

function toggleWbsTableExpandAll() {
  if (isWbsTableFullyExpanded.value) {
    collapseAllTableRows();
  } else {
    expandAllTableRows();
  }
}

function onTableExpand(expanded: boolean, record: WbsRow) {
  const key = record.id;
  const set = new Set(expandedRowKeys.value);
  if (expanded) {
    set.add(key);
  } else {
    set.delete(key);
  }
  expandedRowKeys.value = Array.from(set);
}

function onTableExpandedRowsChange(keys: (string | number)[]) {
  expandedRowKeys.value = (keys || []).map((k) => String(k));
}

/** 与点击树形展开图标一致：切换 expandedRowKeys */
function toggleWbsRowExpanded(record: WbsRow) {
  if (!record.children?.length) return;
  const id = record.id;
  const keys = expandedRowKeys.value;
  expandedRowKeys.value = keys.includes(id) ? keys.filter(k => k !== id) : [...keys, id];
}

function wbsTableCustomRow(record: WbsRow) {
  const parts: string[] = [];
  if (record.children?.length) {
    parts.push('wbs-row--expandable');
  }
  return {
    class: parts.join(' '),
    onClick: (e: MouseEvent) => {
      if (e.button !== 0) return;
      const raw = e.target;
      const el = raw instanceof Element ? raw : (raw as Node).parentElement;
      if (!el) return;
      if (
        el.closest('.wbs-expand-icon') ||
        el.closest('.ant-table-row-expand-icon') ||
        el.closest('.wbs-ops') ||
        el.closest('.wbs-ops__link') ||
        el.closest('.wbs-required-switch-wrap') ||
        el.closest('.ant-switch') ||
        el.closest('.wbs-taskflow-cell') ||
        el.closest('.wbs-taskflow-browse-btn') ||
        el.closest('.ant-select') ||
        el.closest('.ant-popconfirm') ||
        el.closest('button') ||
        el.closest('a[href]') ||
        el.closest('input') ||
        el.closest('textarea')
      ) {
        return;
      }
      toggleWbsRowExpanded(record);
    },
  };
}

function expandAllStructureTree() {
  structureExpandedKeys.value = collectAllKeys(structureTreeRows.value);
}

function collapseAllStructureTree() {
  structureExpandedKeys.value = [];
}

function onStructureExpand(keys: (string | number)[]) {
  structureExpandedKeys.value = (keys || []).map((k) => String(k));
}

// ─── 路由 & 状态 ────────────────────────────────────────────

const route = useRoute();
const router = useRouter();

const tempId = computed(() => (route.query.id as string) || '');
/** 当前产品平台库 menuId（与列表页 /page 筛选一致） */
const menuId = computed(() => {
  const raw = route.query.menuId;
  if (raw == null) return '';
  const s = String(raw).trim();
  return s || '';
});
const loading = ref<boolean>(false);
const tableData = ref<WbsRow[]>([]);
const pageMode = ref<'structure-select' | 'edit-saved'>('edit-saved');
const structureModalVisible = ref<boolean>(false);
const structureModalLoading = ref<boolean>(false);
const structureTreeRows = ref<WbsRow[]>([]);
const checkedStructureKeys = ref<string[]>([]);
const expandedRowKeys = ref<string[]>([]);
const structureExpandedKeys = ref<string[]>([]);
const saveLoading = ref<boolean>(false);

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
    { title: t('是否可裁剪'), dataIndex: 'required', key: 'required', width: 96, align: 'center', resizable: true },
    { title: t('关联任务流程'), dataIndex: 'taskFlow', key: 'taskFlow', width: 220, align: 'left', ellipsis: true, resizable: true },
    { title: t('操作'), key: 'operation', dataIndex: 'operation', width: 130, align: 'center', fixed: 'right', resizable: false },
  ];
}

const columns = ref<TableColumnsType<WbsRow>>(createWbsColumns());
const scrollX = computed(() => columns.value.reduce((s, c) => s + (Number(c.width) || 0), 0) + SCROLL_X_BUFFER_PX);

function handleResizeColumn(w: number, col: { width?: number | string }) { col.width = w; }
function wbsRowKey(r: WbsRow) { return r.id; }

/** 业务 catch 兜底提示，避免与 axios 响应拦截器重复弹错 */
function notifyAxiosFailure(err: unknown, fallback: string) {
  showRequestErrorIfNeeded(err, fallback);
}

// ─── API 调用 ───────────────────────────────────────────────

function resolveMenuIdOrWarn(): string | null {
  if (!menuId.value) {
    message.warning(t('缺少平台库参数，请从产品模板库重新进入'));
    return null;
  }
  return menuId.value;
}

async function fetchWbsTree() {
  if (!tempId.value) return;
  const mid = resolveMenuIdOrWarn();
  if (!mid) return;
  loading.value = true;
  try {
    const res = await AdminApiProductTemp.getTempInfo({ tempId: tempId.value, menuId: mid });
    const apiTree = res?.data?.data?.tree ?? res?.data?.tree ?? [];
    tableData.value = transformApiTree(apiTree);
    expandedRowKeys.value = collectAllKeys(tableData.value);
    pageMode.value = 'edit-saved';
  } catch (err: unknown) {
    notifyAxiosFailure(err, t('加载已保存WBS结构失败'));
  } finally {
    loading.value = false;
  }
}

async function fetchAllWbsTree() {
  if (!tempId.value) return;
  const mid = resolveMenuIdOrWarn();
  if (!mid) return;
  structureModalLoading.value = true;
  try {
    const res = await AdminApiProductTemp.getWbsAllTreeList({ tempId: tempId.value, menuId: mid });
    const apiTree = res?.data?.data?.tree ?? res?.data?.tree ?? [];
    const allRows = transformApiTree(apiTree);
    // 展示裁剪已由后端 filterDesignTreeByTaskLeafData 完成；不可再用「本节点 taskCount」过滤：
    // 分类节点 type=1 的 taskCount 恒为 0，会把顶层与其它父级整枝删掉，导致弹窗树空白。
    structureTreeRows.value = allRows;
    structureExpandedKeys.value = collectAllKeys(structureTreeRows.value);
    checkedStructureKeys.value = collectSelectedKeys(structureTreeRows.value);
  } catch (err: unknown) {
    notifyAxiosFailure(err, t('加载全量WBS结构失败'));
  } finally {
    structureModalLoading.value = false;
  }
}

/** 将表格树映射为保存接口所需的 tree 格式 */
function mapToSaveTree(rows: WbsRow[]): any[] {
  return rows.map(row => ({
    id: row.id,
    // 兜底清洗：仅提交纯节点名称，避免把“展示态数量后缀（xx）”写回后端
    name: normalizeNodeName(row.nodeName),
    parentId: row.parentId,
    sort: row.serialNo,
    selected: row.selected,
    requiredFlag: row.required ? 1 : 0,
    type: row.type ?? null,
    taskId: row.taskFlowSelectValue,
    children: row.children ? mapToSaveTree(row.children) : [],
  }));
}

function normalizeNodeName(name?: string): string {
  const s = String(name ?? '');
  return s
    .replace(/\s*（\d+）\s*$/u, '')
    .replace(/\s*\(\d+\)\s*$/u, '')
    .trim();
}

// validation logic is moved inline inline over to onSave

function collectSelectedKeys(rows: WbsRow[]): string[] {
  const out: string[] = [];
  const walk = (nodes: WbsRow[]) => {
    nodes.forEach((n) => {
      if (n.selected) out.push(n.id);
      if (n.children?.length) walk(n.children);
    });
  };
  walk(rows);
  return out;
}

function applySelectedByCheckedKeys(rows: WbsRow[], selectedKeys: Set<string>) {
  rows.forEach((row) => {
    row.selected = selectedKeys.has(row.id);
    if (row.selected) {
      // 结构勾选阶段：默认“是否可裁剪”为 N
      row.required = false;
    }
    if (row.children?.length) {
      applySelectedByCheckedKeys(row.children, selectedKeys);
    }
  });
}

function mapRowsToTreeData(rows: WbsRow[]): any[] {
  return rows.map((row) => ({
    key: row.id,
    title: row.nodeName || row.wbsCode,
    children: row.children?.length ? mapRowsToTreeData(row.children) : undefined,
  }));
}

function onStructureCheckedKeysChange(keys: any) {
  checkedStructureKeys.value = Array.isArray(keys)
    ? keys.map((k: any) => String(k))
    : (keys?.checked || []).map((k: any) => String(k));
}

async function onAddRoot() {
  structureModalVisible.value = true;
  await fetchAllWbsTree();
}

function onStructureModalCancel() {
  structureModalVisible.value = false;
}

async function onStructureModalOk() {
  if (!tempId.value) return;
  const mid = resolveMenuIdOrWarn();
  if (!mid) return;
  const selectedKeys = new Set(checkedStructureKeys.value);
  applySelectedByCheckedKeys(structureTreeRows.value, selectedKeys);
  try {
    structureModalLoading.value = true;
    const res = await AdminApiProductTemp.saveWbsStructure({
      tempId: tempId.value,
      menuId: mid,
      tree: mapToSaveTree(structureTreeRows.value),
    });
    message.success(WeiI18n.$t('结构保存成功'));
    structureModalVisible.value = false;
    const savedTree = res?.data?.data?.tree ?? res?.data?.tree;
    if (savedTree && Array.isArray(savedTree) && savedTree.length > 0) {
      tableData.value = transformApiTree(savedTree);
      expandedRowKeys.value = collectAllKeys(tableData.value);
    } else {
      await fetchWbsTree();
    }
    pageMode.value = 'edit-saved';
  } catch (err: unknown) {
    notifyAxiosFailure(err, WeiI18n.$t('结构保存失败'));
  } finally {
    structureModalLoading.value = false;
  }
}

async function onDelete(record: WbsRow) {
  if (!tempId.value) return;
  if (record.children?.length) { message.warning(t('该节点包含子节点，无法删除')); return; }
  try {
    await AdminApiProductTemp.deleteWbsNode({ tempId: tempId.value, nodeId: record.id });
    message.success(`${t('删除成功')}：${record.nodeName}`);
    await fetchWbsTree();
  } catch (err: unknown) {
    notifyAxiosFailure(err, t('删除失败'));
  }
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
  } catch (err: unknown) {
    notifyAxiosFailure(err, t('上移失败'));
  }
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
  } catch (err: unknown) {
    notifyAxiosFailure(err, t('下移失败'));
  }
}

function goBack() {
  sessionStorage.setItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN, '1');
  markSkipPlatformPickerDrawerOnTab();
  router.back();
}

async function onSave() {
  if (!tempId.value) return;
  const mid = resolveMenuIdOrWarn();
  if (!mid) return;

  try {
    saveLoading.value = true;
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

    const res = await AdminApiProductTemp.saveWbsSnapshot({
      tempId: tempId.value,
      menuId: mid,
      tree: mapToSaveTree(tableData.value),
    });
    message.success(WeiI18n.$t('保存成功'));

    const savedTree = res?.data?.data?.tree ?? res?.data?.tree;
    if (savedTree && Array.isArray(savedTree) && savedTree.length > 0) {
      tableData.value = transformApiTree(savedTree);
      expandedRowKeys.value = collectAllKeys(tableData.value);
    } else {
      await fetchWbsTree();
    }
  } catch (err: unknown) {
    notifyAxiosFailure(err, WeiI18n.$t('保存失败'));
  } finally { saveLoading.value = false; }
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
            {{ $t('新增（全量结构）') }}
          </a-button>
          <a-button @click="toggleWbsTableExpandAll">
            {{ isWbsTableFullyExpanded ? $t('全收起') : $t('全展开') }}
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
        :expanded-row-keys="expandedRowKeys"
        :expand-icon-column-index="1"
        :custom-row="wbsTableCustomRow"
        @expand="onTableExpand"
        @expandedRowsChange="onTableExpandedRowsChange"
        @resize-column="handleResizeColumn">
        <template #expandIcon="{ expanded: isExpanded, record, onExpand: onExp }">
          <span
            v-if="record.children?.length"
            class="wbs-expand-icon"
            @click.stop="onExp(record, $event)">
            <CaretDownOutlined v-if="isExpanded" />
            <CaretRightOutlined v-else />
          </span>
          <span v-else class="wbs-expand-placeholder" />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'wbsCode'">
            <span class="wbs-code-text">{{ record.wbsCode }}</span>
          </template>
          <template v-else-if="column.key === 'nodeName'">
            <span class="wbs-node-name-text" :title="record.nodeName">{{ record.nodeName }}</span>
          </template>
          <template v-else-if="column.key === 'required'">
            <span class="wbs-required-switch-wrap" @click.stop>
              <a-switch
                v-model:checked="record.required"
                :disabled="isRequiredSwitchDisabled(record)"
                class="wbs-required-switch"
                checked-children="Y"
                un-checked-children="N"
                @change="onRequiredSwitchChange(record, $event)"
              />
            </span>
          </template>
          <template v-else-if="column.key === 'taskFlow'">
            <div v-if="isTaskFlowDropdownRow(record)" class="wbs-taskflow-cell" @click.stop>
              <span class="wbs-taskflow-text" :title="record.taskFlow">{{ record.taskFlow }}</span>
              <a-button
                v-if="isTaskFlowMultiOptionRow(record)"
                type="primary"
                size="small"
                class="wbs-taskflow-browse-btn"
                @click.stop="openTaskFlowPicker(record)">
                <template #icon><SearchOutlined /></template>
                {{ $t('浏览') }}
              </a-button>
            </div>
            <span v-else class="wbs-taskflow-text">{{ record.taskFlow }}</span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span class="wbs-ops">
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
        <a-button type="primary" :loading="saveLoading" @click="onSave">{{ $t('保存') }}</a-button>
        <a-button @click="goBack">{{ $t('返回') }}</a-button>
      </div>
    </a-card>

    <a-modal
      v-model:visible="structureModalVisible"
      :title="$t('选择模板结构')"
      :confirm-loading="structureModalLoading"
      width="680px"
      @ok="onStructureModalOk"
      @cancel="onStructureModalCancel"
    >
      <div style="margin-bottom: 8px; display: flex; gap: 8px;">
        <a-button size="small" @click="expandAllStructureTree">{{ $t('全展开') }}</a-button>
        <a-button size="small" @click="collapseAllStructureTree">{{ $t('全收起') }}</a-button>
      </div>
      <a-spin :spinning="structureModalLoading">
        <a-tree
          checkable
          :expanded-keys="structureExpandedKeys"
          :tree-data="mapRowsToTreeData(structureTreeRows)"
          :checked-keys="checkedStructureKeys"
          @expand="onStructureExpand"
          @update:checkedKeys="onStructureCheckedKeysChange"
        />
      </a-spin>
    </a-modal>

    <a-modal
      v-model:visible="taskFlowPickerVisible"
      :title="taskFlowPickerTitle"
      width="560px"
      destroy-on-close
      @cancel="onTaskFlowPickerCancel"
    >
      <div v-if="taskFlowPickerRecord" class="wbs-taskflow-picker">
        <a-table
          class="wbs-taskflow-picker-table"
          :columns="taskFlowPickerColumns"
          :data-source="taskFlowPickerTableData"
          :row-key="taskFlowPickerRowKey"
          :pagination="false"
          bordered
          size="small"
          :custom-row="taskFlowPickerCustomRow"
          :row-selection="taskFlowPickerRowSelection">
          <template #bodyCell="{ column, record: pickerRow }">
            <template v-if="column.key === 'operation'">
              <a
                class="wbs-ops__link"
                :class="{ 'is-disabled': taskFlowPickerPreviewingId === pickerRow.taskId }"
                @click.stop.prevent="onTaskFlowPreview(pickerRow.taskId)">
                {{ $t('预览') }}
              </a>
            </template>
          </template>
        </a-table>
      </div>
      <template #footer>
        <a-button type="primary" @click="onTaskFlowPickerOk">{{ $t('确定') }}</a-button>
        <a-button @click="onTaskFlowPickerCancel">{{ $t('取消') }}</a-button>
      </template>
    </a-modal>

    <a-modal
      v-model:visible="flowViewVisible"
      :title="$t('流程图')"
      :width="1000"
      centered
      destroy-on-close
      :mask-closable="true"
      @cancel="closeFlowView">
      <div class="wbs-flow-view-wrap">
        <FlowView :flow-data="flowViewData" />
      </div>
      <template #footer>
        <a-button type="primary" @click="closeFlowView">{{ $t('关闭') }}</a-button>
      </template>
    </a-modal>
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
  margin-left: auto;
  padding-right: 120px;
  text-align: left;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.88);
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  /* 本表统一 12px，含文字列与内嵌控件 */
  --wbs-table-cell-font-size: 12px;
  --wbs-table-cell-line-height: 1.5;
  --wbs-table-row-height: 34px;

  :deep(.ant-table-thead > tr > th) {
    background: #fafafa;
    font-size: var(--wbs-table-cell-font-size);
    line-height: var(--wbs-table-cell-line-height);
    height: var(--wbs-table-row-height);
    max-height: var(--wbs-table-row-height);
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    box-sizing: border-box;
    vertical-align: middle;
  }

  :deep(.ant-table-tbody > tr > td) {
    font-size: var(--wbs-table-cell-font-size);
    line-height: var(--wbs-table-cell-line-height);
    height: var(--wbs-table-row-height);
    max-height: var(--wbs-table-row-height);
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    box-sizing: border-box;
    vertical-align: middle;
  }

  :deep(.ant-table-thead > tr) {
    height: var(--wbs-table-row-height);
  }

  :deep(.ant-table-tbody > tr.ant-table-row) {
    height: var(--wbs-table-row-height);
  }

  .wbs-required-switch:deep(.ant-switch-inner) {
    font-size: var(--wbs-table-cell-font-size) !important;
    line-height: 18px;
  }

  .wbs-required-switch:deep(.ant-switch-inner-checked),
  .wbs-required-switch:deep(.ant-switch-inner-unchecked) {
    font-size: var(--wbs-table-cell-font-size) !important;
  }

  .wbs-taskflow-select:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    min-height: 22px !important;
    height: 22px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .wbs-taskflow-select:deep(.ant-select-selection-item),
  .wbs-taskflow-select:deep(.ant-select-selection-placeholder) {
    line-height: 20px !important;
  }

  .wbs-taskflow-select:deep(.ant-select-selector),
  .wbs-taskflow-select:deep(.ant-select-selection-search-input) {
    font-size: var(--wbs-table-cell-font-size) !important;
    line-height: var(--wbs-table-cell-line-height) !important;
  }

  .wbs-taskflow-select:deep(.ant-select-selection-item),
  .wbs-taskflow-select:deep(.ant-select-selection-placeholder) {
    font-size: var(--wbs-table-cell-font-size) !important;
  }

  .wbs-ops__link {
    font-size: var(--wbs-table-cell-font-size);
  }
}

.wbs-taskflow-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  font-size: var(--wbs-table-cell-font-size, 12px);
}

.wbs-taskflow-select :deep(.ant-select-selector) {
  display: flex !important;
  align-items: center !important;
  font-size: var(--wbs-table-cell-font-size, 12px) !important;
  min-height: 22px !important;
  height: 22px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.wbs-taskflow-select :deep(.ant-select-selection-item),
.wbs-taskflow-select :deep(.ant-select-selection-placeholder) {
  display: flex !important;
  align-items: center !important;
  font-size: var(--wbs-table-cell-font-size, 12px) !important;
  line-height: 20px !important;
}

.wbs-taskflow-select :deep(.ant-select-selection-search-input) {
  font-size: var(--wbs-table-cell-font-size, 12px) !important;
  line-height: 20px !important;
}

.wbs-taskflow-text {
  flex: 1 1 0;
  min-width: 0;
  font-size: var(--wbs-table-cell-font-size, 12px);
  line-height: var(--wbs-table-cell-line-height, 1.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wbs-taskflow-browse-btn {
  flex: 0 0 auto;
  font-size: 12px;
  line-height: 18px;
  height: 22px;
  padding: 0 8px;
}

.wbs-taskflow-browse-btn :deep(.anticon) {
  font-size: 12px;
}

.wbs-taskflow-picker-table {
  :deep(.ant-table-thead > tr > th),
  :deep(.ant-table-tbody > tr > td) {
    font-size: 13px;
  }

  :deep(.ant-table-tbody > tr) {
    cursor: pointer;
  }

  :deep(.ant-table-tbody > tr.wbs-taskflow-picker-row--selected > td) {
    background: #e6f4ff;
  }
}

.wbs-flow-view-wrap {
  height: 560px;
  min-height: 480px;
  box-sizing: border-box;
}

.wbs-ops__link.is-disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
  pointer-events: none;
}

.wbs-table :deep(.ant-table-row-expand-icon-cell),
.wbs-table :deep(.ant-table-expand-icon-col) {
  width: 28px !important;
  min-width: 28px !important;
  padding-left: 4px !important;
  padding-right: 0 !important;
}

.wbs-table :deep(.ant-table-row-expand-icon) {
  display: none !important;
}

.wbs-expand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  font-size: 10px;
  vertical-align: middle;
  transition: color 0.2s;
}

.wbs-expand-icon:hover {
  color: #1677ff;
}

.wbs-expand-placeholder {
  display: inline-block;
  width: 16px;
  height: 16px;
}

.wbs-code-text {
  font-size: var(--wbs-table-cell-font-size, 12px);
  line-height: var(--wbs-table-cell-line-height, 1.5);
}

.wbs-required-switch-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.wbs-table :deep(tr.wbs-row--expandable) {
  cursor: pointer;
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
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  align-items: center;
}
</style>
