<script setup lang="ts">
import { reactive, ref, watch, h, computed } from 'vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import type { TableColumnType } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { usePagination } from '@/hooks/usePagination';
import { ProcessFlowListPageRequestDTOModel } from '@/api/models/processTask/ProcessFlowListPageRequestDTOModel';
import { sortermethod } from '@/utils/tools';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import type { RequestParams } from '@/api/tags/http-client';
import Empty from '@/components/Empty/index.vue';
import FlowView from '@/components/flowview/indexManager.vue';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import DesignResourceShareModal from '../../components/design-resource-share-modal.vue';
import { normalizeListSnowflakeIds, toSnowflakeIdStr } from '@/utils/snowflakeId';
import { formatDate } from '@/utils/formatTime';
import { fetchPlatformPickerList } from '@/utils/platformPickerList';

const emit = defineEmits<{
  (e: 'category-assigned', menuId: string): void;
}>();

const props = defineProps<{
  menuId?: string | number;
  treeNodeKey?: string | number;
}>();

const userStore = useUserStore();
const router = useRouter();
/** 与后端流程基础信息字段一致的驼峰结构 */
type FlowRow = {
  id: number | string;
  processKey?: string;
  processName?: string;
  processType?: string;
  collabStatus?: string | number;
  appStatus?: string | number;
  ownerName?: string;
  treeId?: number | string;
  creator?: number | string;
  createTime?: string;
  updater?: number | string;
  updateTime?: string;
  deleted?: number;
  tenantId?: number | string;
  versionNum?: number | string;
  confidentialLevel?: number | string;
  bpmnXml?: string;
  latestPublishVersionId?: number | string;
  latestPublishVersionNo?: number;
  collabLatestPublishVersionNo?: number;
  appLatestPublishVersionNo?: number;
  sharedUserNames?: string;
  canOperate?: boolean;
  canShare?: boolean;
};

function canRowOperate(record?: FlowRow) {
  return record?.canOperate === true;
}

function canRowShare(record?: FlowRow) {
  return record?.canShare === true;
}

function formatCreateTimeDisplay(value?: string | null) {
  if (!value) return '—';
  return formatDate(value as unknown as Date, 'YYYY-MM-DD') || '—';
}

const designShareModalVisible = ref(false);
const designShareTarget = ref<{ bizId: string | number } | null>(null);

function openDesignShareModal(record: FlowRow) {
  if (!record?.id) return;
  designShareTarget.value = { bizId: toSnowflakeIdStr(record.id) };
  designShareModalVisible.value = true;
}

function onDesignShareSaved() {
  void loadFlowListData();
}

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
    description: '暂无数据',
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
    width: 56,
    fixed: 'left',
    resizable: false,
    customRender: ({ index }) => {
      const current = Number(pagination.current || 1);
      const pageSize = Number(pagination.pageSize || 10);
      return (current - 1) * pageSize + index + 1;
    },
  },
  {
    title: '任务名称',
    dataIndex: 'processName',
    key: 'processName',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 180,
  },
  {
    title: '密级',
    dataIndex: 'confidentialLevel',
    key: 'confidentialLevel',
    align: 'center',
    resizable: true,
    width: 90,
  },
  {
    title: '发布任务',
    dataIndex: 'collabStatus',
    key: 'collabStatus',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '任务版本',
    dataIndex: 'collabLatestPublishVersionNo',
    key: 'collabLatestPublishVersionNo',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '独立应用',
    dataIndex: 'appStatus',
    key: 'appStatus',
    align: 'center',
    resizable: true,
    width: 120,
  },
  {
    title: '应用版本',
    dataIndex: 'appLatestPublishVersionNo',
    key: 'appLatestPublishVersionNo',
    align: 'center',
    resizable: true,
    width: 130,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    resizable: true,
    width: 120,
  },
  {
    title: '创建者',
    dataIndex: 'ownerName',
    key: 'ownerName',
    align: 'center',
    resizable: true,
    width: 120,
  },
  {
    title: '共享人',
    dataIndex: 'sharedUserNames',
    key: 'sharedUserNames',
    align: 'left',
    ellipsis: true,
    resizable: true,
    width: 140,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 360,
    fixed: 'right',
    resizable: false,
  },
]);

type TaskUsedParamItem = {
  paramCode?: string;
  paramName?: string;
  paramSource?: string;
  activityPageId?: number | string;
  activityName?: string;
  bpmnElementId?: string;
  nodeName?: string;
};

function resolveTaskUsedParamSourceText(source?: string) {
  const s = String(source ?? '')
    .trim()
    .toUpperCase();
  if (s === 'COMPONENT') return '组件';
  if (s === 'FORMULA') return '公式';
  return source || '—';
}

/** 横向滚动：列宽之和 + 勾选列 + 缓冲（与 parameter/index.vue 一致） */
const SCROLL_X_BUFFER_PX = 2;
const TABLE_SELECTION_COL_WIDTH_PX = 60;
const processFlowTableScrollX = computed(() => {
  const sum = columns.value.reduce((acc, col) => {
    const w = col.width;
    return acc + (typeof w === 'number' ? w : Number(w) || 0);
  }, 0);
  return sum + TABLE_SELECTION_COL_WIDTH_PX + SCROLL_X_BUFFER_PX;
});

/** 表头排序、任务名称列检索（与 parameter/index.vue 一致） */
type ProcessFlowSortOrder = 'ascend' | 'descend' | '';
const sortState = ref<{ key: string; order: ProcessFlowSortOrder }>({ key: '', order: '' });
const filterValueMap = ref<Record<string, string>>({ processName: '' });
const filterOpenMap = ref<Record<string, boolean>>({});

const processFlowTableDisplayList = computed(() => {
  let list = [...tableData.value];
  if (!sortState.value.key || !sortState.value.order) return list;
  const key = sortState.value.key;
  const sorted = [...list].sort((a: FlowRow, b: FlowRow) => sortermethod((a as any)[key], (b as any)[key]));
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function isProcessFlowTableSelectionColumn(column: any) {
  const c = column?.className;
  if (typeof c === 'string') return c.includes('selection-column');
  if (Array.isArray(c)) return c.some((x: unknown) => String(x).includes('selection-column'));
  return false;
}

function isSortableProcessFlowColumn(column: any) {
  const di = column?.dataIndex;
  if (!di || di === 'operation' || di === 'rowIndex') return false;
  return true;
}

/** 首列可检索字段：任务名称（与顶部「流程名称」查询一致；序号列为计算列不做表头筛选） */
function isFilterableProcessFlowColumn(column: any) {
  return column?.dataIndex === 'processName';
}

function toggleProcessFlowColumnSort(column: any) {
  if (!isSortableProcessFlowColumn(column)) return;
  const key = String(column.dataIndex);
  if (sortState.value.key !== key) {
    sortState.value = { key, order: 'ascend' };
    return;
  }
  if (sortState.value.order === 'ascend') {
    sortState.value = { key, order: 'descend' };
    return;
  }
  if (sortState.value.order === 'descend') {
    sortState.value = { key: '', order: '' };
    return;
  }
  sortState.value = { key, order: 'ascend' };
}

function getProcessFlowSortOrder(key: string): ProcessFlowSortOrder {
  return sortState.value.key === key ? sortState.value.order : '';
}

function getProcessFlowFilterOpen(key: string) {
  return Boolean(filterOpenMap.value[key]);
}

function handleProcessFlowFilterOpenChange(key: string, open: boolean) {
  if (open && key === 'processName') {
    filterValueMap.value = { ...filterValueMap.value, processName: String(requestParams.processName ?? '') };
  }
  filterOpenMap.value = { ...filterOpenMap.value, [key]: open };
}

function applyProcessFlowColumnFilter(key: string) {
  const v = String(filterValueMap.value[key] ?? '').trim();
  if (key === 'processName') requestParams.processName = v;
  requestParams.pageNo = 1;
  pagination.current = 1;
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
  void loadFlowListData();
}

function resetProcessFlowColumnFilter(key: string) {
  filterValueMap.value = { ...filterValueMap.value, [key]: '' };
  if (key === 'processName') requestParams.processName = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
  void loadFlowListData();
}

async function loadFlowListData() {
  loading.value = true;
  try {
    requestParams.menuId = props.menuId ?? '';
    requestParams.treeId = props.treeNodeKey ?? '';
    requestParams.releaseType = 1;
    const res = await AdminApiSystemProcessTask.taskBasicInfoPage(requestParams);
    tableData.value = normalizeListSnowflakeIds(Array.isArray(res.data.data.list) ? res.data.data.list : []);
    pagination.total = Number(res.data.data.total ?? 0);
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

/** 按流程名称、流程标识查询（回到第一页） */
function handleQuerySearch() {
  resetAndReload();
}

async function handleDeleteClick(record: FlowRow) {
  if (!canRowOperate(record)) {
    message.warning('无操作权限，仅可预览');
    return;
  }
  await AdminApiSystemProcessTask.deleteTaskBasicInfo({ id: record.id });
  await loadFlowListData();
}

async function handlePublishAction(record: FlowRow, publishType: PublishType) {
  if (!canRowOperate(record)) {
    message.warning('无操作权限，仅可预览');
    return;
  }
  const taskId = record.id;
  const isPublished = publishType === 'COLLAB' ? isCollabPublished(record) : isAppPublished(record);
  const requestOpts: RequestParams = { skipErrorNotify: true };
  try {
    if (isPublished) {
      await AdminApiSystemProcessTask.taskRevokePublish({ taskId, publishType }, requestOpts);
      message.success(publishType === 'COLLAB' ? '撤销发布任务成功' : '撤销发布应用成功');
    } else {
      await AdminApiSystemProcessTask.taskPublish({ taskId, publishType, publishedBy: userStore.getUser.id }, requestOpts);
      message.success(publishType === 'COLLAB' ? '发布任务成功' : '发布应用成功');
    }
    await loadFlowListData();
  } catch {
    message.error(isPublished ? '撤销发布失败' : '发布失败，任务内容未配置完成！');
  }
}

type PublishType = 'COLLAB' | 'APP';

/** 发布任务状态：与列表「已发布」标签同一判定 */
function isCollabPublished(record: FlowRow) {
  return record.collabStatus == 1;
}

/** 独立应用状态：与列表「已发布」标签同一判定 */
function isAppPublished(record: FlowRow) {
  return record.appStatus == 1;
}

type TaskPublishVersionHistoryItem = {
  id?: number | string;
  versionNo?: number;
  publishStatus?: string;
  processName?: string;
  remark?: string;
  publishedByName?: string;
  publishedTime?: string;
  revokedTime?: string;
  revokeReason?: string;
};

const visibleHistoryModal = ref(false);
const historyLoading = ref(false);
const historyList = ref<TaskPublishVersionHistoryItem[]>([]);
const historyModalTitle = ref('历史版本');

function getPublishVersionDisplayText(versionNo?: number | null) {
  return `V${versionNo ?? '-'}.0`;
}

function getVersionText(versionNo?: number | string | null) {
  return `V${versionNo ?? '-'}.0`;
}

function resolvePublishStatusText(status?: string) {
  const s = String(status ?? '')
    .trim()
    .toUpperCase();
  if (s === 'PUBLISHED') return '已发布';
  if (s === 'REVOKED') return '已撤销';
  return status || '—';
}

async function showVersionHistory(record: FlowRow, publishType: PublishType) {
  if (!record?.id) return;
  historyModalTitle.value = publishType === 'COLLAB' ? '协同发布历史版本' : '独立应用发布历史版本';
  visibleHistoryModal.value = true;
  historyLoading.value = true;
  historyList.value = [];
  try {
    const res = await AdminApiSystemProcessTask.listTaskPublishVersionHistory({
      taskId: record.id,
      publishType,
    });
    historyList.value = (res?.data?.data || []).sort((a: TaskPublishVersionHistoryItem, b: TaskPublishVersionHistoryItem) => Number(b.versionNo || 0) - Number(a.versionNo || 0));
  } catch {
    message.error('加载版本历史失败');
    historyList.value = [];
  } finally {
    historyLoading.value = false;
  }
}

function closeHistoryModal() {
  visibleHistoryModal.value = false;
  historyList.value = [];
}

const taskUsedParamModalVisible = ref(false);
const taskUsedParamLoading = ref(false);
const taskUsedParamList = ref<TaskUsedParamItem[]>([]);
const taskUsedParamModalTitle = ref('任务使用参数');

const taskUsedParamColumns: TableColumnType<TaskUsedParamItem>[] = [
  { title: '参数代码', dataIndex: 'paramCode', key: 'paramCode', width: 140, ellipsis: true },
  { title: '参数名称', dataIndex: 'paramName', key: 'paramName', width: 160, ellipsis: true },
  { title: '来源', dataIndex: 'paramSource', key: 'paramSource', width: 80, align: 'center' },
  { title: '活动名称', dataIndex: 'activityName', key: 'activityName', width: 160, ellipsis: true },
  { title: '流程节点', dataIndex: 'nodeName', key: 'nodeName', ellipsis: true },
];

async function openTaskUsedParamsModal(record: FlowRow) {
  if (!record?.id) return;
  taskUsedParamModalTitle.value = `${record.processName || '设计任务'} - 使用参数`;
  taskUsedParamModalVisible.value = true;
  taskUsedParamList.value = [];
  taskUsedParamLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.listTaskUsedParams({ taskId: record.id });
    const ok = res?.data?.code === 0 || res?.data?.code === 200 || res?.data?.code === '0' || res?.data?.code === '200';
    if (!ok) {
      message.error(res?.data?.msg || '加载失败');
      return;
    }
    const raw = res?.data?.data;
    taskUsedParamList.value = Array.isArray(raw?.items) ? raw.items : [];
  } catch {
    message.error('加载任务使用参数失败');
    taskUsedParamList.value = [];
  } finally {
    taskUsedParamLoading.value = false;
  }
}

function closeTaskUsedParamsModal() {
  taskUsedParamModalVisible.value = false;
  taskUsedParamList.value = [];
  taskUsedParamModalTitle.value = '任务使用参数';
}

/** 发布任务、独立应用均为未发布时，才允许进入「配置」 */
function isFlowConfigEditable(record: FlowRow) {
  return !isCollabPublished(record) && !isAppPublished(record);
}

const selectedFlowRows = computed(() => {
  const rows = selectedRowList.value as FlowRow[];
  if (rows.length) return rows;
  const keySet = new Set((selectedRowkeys.value || []).map(k => String(k)));
  return (tableData.value || []).filter(item => keySet.has(String(item.id)));
});

/** 勾选一条可查看流程图 */
const canToolbarView = computed(() => selectedFlowRows.value.length === 1);

/** 勾选一条、有操作权限且未发布任务时可编辑 */
const canToolbarEdit = computed(() => {
  const rows = selectedFlowRows.value;
  if (rows.length !== 1) return false;
  if (!canRowOperate(rows[0])) return false;
  return !isCollabPublished(rows[0]);
});

function getOperableSelectedRows() {
  return selectedFlowRows.value.filter(row => canRowOperate(row));
}

const canAssignCategory = computed(() => getOperableSelectedRows().length > 0);

const saveAsLoading = ref(false);

function resolveSaveAsTargetMenuId() {
  const menuId = props.menuId ?? requestParams.menuId;
  if (menuId === undefined || menuId === null || menuId === '') return '';
  return menuId;
}

function resolveSaveAsTargetTreeId() {
  const treeId = props.treeNodeKey ?? requestParams.treeId;
  if (treeId === undefined || treeId === null || treeId === '') return '';
  return treeId;
}

/** 勾选任务即可另存为（目标节点在点击时校验，与「新建」一致） */
const canSaveAs = computed(() => selectedFlowRows.value.length > 0);

function buildSaveAsProcessName(name?: string | null) {
  return `${String(name ?? '').trim()}bak`;
}

async function handleSaveAs() {
  const rows = selectedFlowRows.value;
  if (!rows.length) {
    message.warning('请先勾选要另存为的设计任务');
    return;
  }
  const treeId = resolveSaveAsTargetTreeId();
  if (treeId === '') {
    message.warning('请先在左侧选择分类节点');
    return;
  }
  const targetMenuId = resolveSaveAsTargetMenuId();
  if (targetMenuId === '') {
    message.warning('缺少产品平台信息');
    return;
  }

  saveAsLoading.value = true;
  try {
    for (const row of rows) {
      if (!row?.id) continue;
      const res = await AdminApiSystemProcessTask.saveAsTaskBasicInfo({
        sourceTaskBasicInfoId: row.id,
        targetMenuId,
        targetTreeId: treeId,
        processName: buildSaveAsProcessName(row.processName),
      });
      const ok = res?.data?.code === 0 || res?.data?.code === 200;
      if (!ok) {
        message.error(res?.data?.msg || '另存为失败');
        return;
      }
    }
    message.success('另存为成功');
    selectedRowList.value = [];
    selectedRowkeys.value = [];
    await loadFlowListData();
  } catch (error) {
    console.error('handleSaveAs failed:', error);
    message.error('另存为失败');
  } finally {
    saveAsLoading.value = false;
  }
}

// ---------------------------分配分类------------------------------------
const assignCategoryModalVisible = ref(false);
const assignCategoryLoading = ref(false);
const assignCategorySubmitLoading = ref(false);
const assignCategoryPlatforms = ref<any[]>([]);
const assignCategoryActiveMenuId = ref<string>('');
const assignCategoryTreeData = ref<any[]>([]);
const assignCategorySelectedKey = ref<string>('');

function convertAssignCategoryTreeNodes(data: any[]): any[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map(item => {
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
    let level = 3;
    if (hasChildren) {
      level = 2;
    }
    return {
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || '',
      categoryType: item.type,
      parentId: item.parentId,
      level,
      children: hasChildren ? convertAssignCategoryTreeNodes(item.children) : [],
    };
  });
}

function findAssignCategoryNodeById(tree: any[], targetId: string): any | null {
  for (const node of tree) {
    if (node.key === targetId) {
      return node;
    }
    if (node.children?.length) {
      const found = findAssignCategoryNodeById(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function canAssignTaskToTargetNode(node: any) {
  if (!node?.key) return false;
  const categoryType = node.categoryType ?? node.type;
  return categoryType === 2 || String(categoryType) === '2';
}

async function loadAssignCategoryTree(menuIdValue: string) {
  if (!menuIdValue) {
    assignCategoryTreeData.value = [];
    return;
  }
  assignCategoryLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.getDesignTaskTreeList({ menuId: menuIdValue });
    if ((res.data.code === 0 || res.data.code === 200) && res.data.data != null) {
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      assignCategoryTreeData.value = convertAssignCategoryTreeNodes(rawData);
    } else {
      assignCategoryTreeData.value = [];
    }
  } catch (error) {
    console.error('loadAssignCategoryTree failed:', error);
    assignCategoryTreeData.value = [];
    message.error('加载分类树失败');
  } finally {
    assignCategoryLoading.value = false;
  }
}

async function openAssignCategoryModal() {
  const rows = getOperableSelectedRows();
  if (!rows.length) {
    message.warning('请先勾选要分配的设计任务');
    return;
  }
  assignCategoryModalVisible.value = true;
  assignCategorySelectedKey.value = '';
  assignCategoryLoading.value = true;
  try {
    assignCategoryPlatforms.value = await fetchPlatformPickerList();
    if (!assignCategoryPlatforms.value.length) {
      message.warning('暂无可选产品平台');
      assignCategoryTreeData.value = [];
      return;
    }
    const defaultMenuId = String(props.menuId || assignCategoryPlatforms.value[0]?.id || '');
    assignCategoryActiveMenuId.value = defaultMenuId;
    await loadAssignCategoryTree(defaultMenuId);
  } catch (error) {
    console.error('openAssignCategoryModal failed:', error);
    message.error('加载产品平台失败');
  } finally {
    assignCategoryLoading.value = false;
  }
}

async function onAssignCategoryTabChange(activeKey: string | number) {
  assignCategoryActiveMenuId.value = String(activeKey);
  assignCategorySelectedKey.value = '';
  await loadAssignCategoryTree(assignCategoryActiveMenuId.value);
}

function onAssignCategoryTreeSelect(selectedKeys: any[]) {
  assignCategorySelectedKey.value = selectedKeys?.[0] ?? '';
}

function cancelAssignCategory() {
  assignCategoryModalVisible.value = false;
  assignCategorySelectedKey.value = '';
  assignCategoryTreeData.value = [];
}

async function confirmAssignCategory() {
  if (!assignCategorySelectedKey.value) {
    message.warning('请选择目标分类节点');
    return;
  }
  const targetNode = findAssignCategoryNodeById(assignCategoryTreeData.value, assignCategorySelectedKey.value);
  if (!canAssignTaskToTargetNode(targetNode)) {
    message.warning('请选择任务节点（末层节点）');
    return;
  }
  if (!assignCategoryActiveMenuId.value) {
    message.warning('请选择产品平台');
    return;
  }
  const taskBasicInfoIds = getOperableSelectedRows()
    .map(row => row.id)
    .filter(id => id != null && id !== '');
  if (!taskBasicInfoIds.length) {
    message.warning('未找到有效的设计任务记录');
    return;
  }
  assignCategorySubmitLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.assignTasksToCategory({
      taskBasicInfoIds,
      treeId: assignCategorySelectedKey.value,
      menuId: assignCategoryActiveMenuId.value,
    });
    if (res?.data?.code === 0 || res?.data?.code === 200) {
      const resultMsg = res?.data?.data?.message || '分配成功';
      message.success(resultMsg);
      assignCategoryModalVisible.value = false;
      selectedRowList.value = [];
      selectedRowkeys.value = [];
      await loadFlowListData();
      emit('category-assigned', assignCategoryActiveMenuId.value);
    } else {
      message.error(res?.data?.msg || '分配失败');
    }
  } catch (error) {
    console.error('confirmAssignCategory failed:', error);
    message.error('分配失败');
  } finally {
    assignCategorySubmitLoading.value = false;
    assignCategorySelectedKey.value = '';
  }
}

const flowViewVisible = ref(false);
const flowViewData = ref<{ xmlData?: string }>({});

function closeFlowView() {
  flowViewVisible.value = false;
  flowViewData.value = {};
}

async function handleToolbarView(record?: FlowRow) {
  const row = record ?? selectedFlowRows.value[0];
  if (!row) {
    message.warning('请勾选一条流程');
    return;
  }
  let hideLoading: (() => void) | undefined;
  try {
    hideLoading = message.loading('加载中...', 0);
    const res = await AdminApiSystemProcessTask.getXmlInfo({ id: row.id });
    const xml = String(res?.data?.data?.bpmnXml ?? '').trim();
    if (!xml) {
      message.warning('暂无流程图数据');
      return;
    }
    flowViewData.value = { xmlData: xml };
    flowViewVisible.value = true;
  } catch {
    message.error('获取流程图失败');
  } finally {
    hideLoading?.();
  }
}

/** 密级默认取当前用户可选列表第一项（一般为「公开」） */
function getDefaultConfidentialLevel(): number {
  const list = userStore.getConfidentialLevel;
  return list.length ? list[0].value : 0;
}

const flowFormVisible = ref(false);
const flowFormSubmitting = ref(false);
const flowFormMode = ref<'add' | 'edit'>('add');
const flowFormRef = ref<FormInstance>();
const flowFormModel = reactive({
  id: undefined as number | string | undefined,
  processName: '',
  confidentialLevel: getDefaultConfidentialLevel(),
});

const flowFormRules = {
  processKey: [{ required: true, message: '请输入流程标识', trigger: 'blur' }],
  processName: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  confidentialLevel: [{ required: true, message: '请选择密级', trigger: 'change' }],
};

function resetFlowForm() {
  flowFormModel.id = undefined;
  flowFormModel.processKey = '';
  flowFormModel.processName = '';
  flowFormModel.confidentialLevel = getDefaultConfidentialLevel();
  flowFormRef.value?.clearValidate?.();
}

function openFlowFormAdd() {
  resetFlowForm();
  flowFormMode.value = 'add';
  flowFormVisible.value = true;
}

function openFlowFormEdit() {
  const rows = selectedFlowRows.value;
  if (rows.length !== 1) {
    message.warning('请勾选一条流程');
    return;
  }
  const row = rows[0];
  if (!canRowOperate(row)) {
    message.warning('无操作权限，仅可预览');
    return;
  }
  if (isCollabPublished(row)) {
    message.warning('已发布任务的流程不可编辑');
    return;
  }
  resetFlowForm();
  flowFormMode.value = 'edit';
  flowFormModel.id = row.id;
  flowFormModel.processKey = row.processKey ?? '';
  flowFormModel.processName = row.processName ?? '';
  const cl = row.confidentialLevel;
  if (cl === undefined || cl === '' || cl === null) {
    flowFormModel.confidentialLevel = getDefaultConfidentialLevel();
  } else {
    const n = Number(cl);
    flowFormModel.confidentialLevel = Number.isFinite(n) ? n : getDefaultConfidentialLevel();
  }
  flowFormVisible.value = true;
}

function handleFlowFormCancel() {
  flowFormVisible.value = false;
  resetFlowForm();
}

async function handleFlowFormOk() {
  try {
    await flowFormRef.value!.validate();
  } catch {
    return Promise.reject();
  }
  if (flowFormMode.value === 'add') {
    const tid = props.treeNodeKey;
    if (tid === undefined || tid === null || tid === '') {
      message.warning('请先在左侧选择分类节点');
      return Promise.reject();
    }
  }
  flowFormSubmitting.value = true;
  try {
    const payload = {
      menuId: props.menuId,
      treeId: props.treeNodeKey,
      processName: flowFormModel.processName.trim(),
      confidentialLevel: flowFormModel.confidentialLevel,
      ownerName: userStore.getUser.nickname,
      releaseType: 1,
    };
    if (flowFormMode.value === 'add') {
      await AdminApiSystemProcessTask.createTaskBasicInfo(payload);
      message.success(WeiI18n.$t('新增成功'));
    } else {
      await AdminApiSystemProcessTask.updateTaskBasicInfo({
        ...payload,
        id: flowFormModel.id,
      });
      message.success(WeiI18n.$t('保存成功'));
    }
    flowFormVisible.value = false;
    resetFlowForm();
    void loadFlowListData();
  } finally {
    flowFormSubmitting.value = false;
  }
}

function handleToolbarEdit() {
  openFlowFormEdit();
}

async function handleToolbarConfig(record?: FlowRow) {
  const row = record ?? selectedFlowRows.value[0];
  if (!row) {
    message.warning('请选择一条任务');
    return;
  }
  if (!canRowOperate(row)) {
    message.warning('无操作权限，仅可预览');
    return;
  }
  if (!isFlowConfigEditable(row)) {
    message.warning('发布任务与独立应用均为未发布时才可配置');
    return;
  }
  const taskName = String(row.processName ?? '').trim();
  const taskId = String(row.id ?? '').trim();
  const menuId = props.menuId != null ? String(props.menuId).trim() : '';
  try {
    const res = await AdminApiSystemProcessTask.getXmlInfo({ id: taskId });
    const xml = String(res?.data?.data?.bpmnXml ?? '').trim();
    const cacheKey = `designTaskBpmnXml:${taskId}`;
    if (xml) {
      sessionStorage.setItem(cacheKey, xml);
    } else {
      sessionStorage.removeItem(cacheKey);
    }
  } catch (error) {
    // 查询 XML 失败不阻断进入配置页，交由配置页按新建流程处理
    sessionStorage.removeItem(`designTaskBpmnXml:${taskId}`);
  }
  router.push({
    path: '/business/processFormdefinition',
    query: {
      flag: 1,
      ...(taskName ? { processName: taskName } : {}),
      ...(taskId ? { taskId } : {}),
      ...(menuId ? { menuId } : {}),
    },
  });
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
    <div class="process-panel__search">
      <a-input v-model:value="requestParams.processName" allow-clear placeholder="请输入流程名称" class="process-panel__search-input" @pressEnter="handleQuerySearch" />
      <a-input v-model:value="requestParams.processCode" allow-clear placeholder="请输入流程标识" class="process-panel__search-input" @pressEnter="handleQuerySearch" />
      <a-button type="primary" @click="handleQuerySearch"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />查询 </a-button>
      <a-button type="primary" @click="openFlowFormAdd"><EpcIcon type="icon-tianjia1" style="font-size: 12px" /> {{ $t('新建') }}</a-button>
      <a-button type="primary" :disabled="!canToolbarView" @click="handleToolbarView()"><EpcIcon type="icon-liulan" style="font-size: 12px" />查看</a-button>
      <a-button type="primary" :disabled="!canToolbarEdit" @click="handleToolbarEdit"><EpcIcon type="icon-bianji" style="font-size: 12px" />编辑</a-button>
      <a-button type="primary" :disabled="!canAssignCategory" @click="openAssignCategoryModal()">
        <EpcIcon type="icon-fenpei" style="font-size: 12px" /> {{ $t('分配分类') }}
      </a-button>
      <a-button type="primary" :loading="saveAsLoading" :disabled="!canSaveAs" @click="handleSaveAs">
        <EpcIcon type="icon-daiyanshou1" style="font-size: 12px" /> {{ $t('另存为') }}
      </a-button>
    </div>

    <a-card class="calc-table-card process-flow-table-card">
      <a-table
        class="exe-config-table"
        :scroll="{ x: processFlowTableScrollX, y: 'calc(100vh - 300px)' }"
        :row-key="record => record.id"
        :columns="columns"
        :data-source="processFlowTableDisplayList"
        :pagination="pagination"
        :row-selection="rowSelection"
        :customRow="customRow"
        bordered
        table-layout="fixed"
        @resize-column="handleResizeColumn"
        :locale="locale"
        :loading="loading"
        :sticky="true"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #headerCell="{ column }">
          <template v-if="isProcessFlowTableSelectionColumn(column)">
            <span />
          </template>
          <template v-else-if="isSortableProcessFlowColumn(column) || isFilterableProcessFlowColumn(column)">
            <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isFilterableProcessFlowColumn(column) }">
              <span class="header-title-sort" :class="{ 'header-title-sort--disabled': !isSortableProcessFlowColumn(column) }" @click.stop="toggleProcessFlowColumnSort(column)">
                <span>{{ column.title }}</span>
                <span v-if="isSortableProcessFlowColumn(column)" class="header-sort-icon">
                  <CaretUpOutlined v-if="getProcessFlowSortOrder(String(column.dataIndex)) === 'ascend'" />
                  <CaretDownOutlined v-else-if="getProcessFlowSortOrder(String(column.dataIndex)) === 'descend'" />
                  <CaretUpOutlined v-else class="header-sort-icon--muted" />
                </span>
              </span>
              <span v-if="isFilterableProcessFlowColumn(column)" class="header-filter-anchor" @mousedown.stop>
                <a-popover
                  trigger="click"
                  placement="bottomRight"
                  :open="getProcessFlowFilterOpen(String(column.dataIndex))"
                  @openChange="handleProcessFlowFilterOpenChange(String(column.dataIndex), $event)">
                  <template #content>
                    <div class="header-filter-pop">
                      <a-input
                        v-model:value="filterValueMap[String(column.dataIndex)]"
                        :placeholder="`请输入${column.title}`"
                        allow-clear
                        @pressEnter="applyProcessFlowColumnFilter(String(column.dataIndex))" />
                      <div class="header-filter-actions">
                        <a-button type="primary" size="small" @click="applyProcessFlowColumnFilter(String(column.dataIndex))">
                          <SearchOutlined />
                          搜索
                        </a-button>
                        <a-button size="small" @click="resetProcessFlowColumnFilter(String(column.dataIndex))">重置</a-button>
                      </div>
                    </div>
                  </template>
                  <span class="header-filter-trigger" @click.stop>
                    <FilterOutlined class="header-query-icon" />
                  </span>
                </a-popover>
              </span>
            </div>
          </template>
          <template v-else>
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort header-title-sort--disabled">
                <span>{{ column.title }}</span>
              </span>
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'appStatus'">
            <span>
              <a-tag v-if="isAppPublished(record)" :class="['exe-status-tag', 'exe-status-tag--on']">已发布</a-tag>
              <a-tag v-else :class="['exe-status-tag', 'exe-status-tag--off']">未发布</a-tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'collabLatestPublishVersionNo'">
            <span v-if="isCollabPublished(record)" style="display: inline-flex; align-items: center; gap: 6px">
              <span>{{ getPublishVersionDisplayText(record.collabLatestPublishVersionNo) }}</span>
              <a href="#" style="cursor: pointer" title="查看协同发布历史版本" @click.stop.prevent="showVersionHistory(record, 'COLLAB')">
                <EpcIcon type="icon-banbenlishi" style="font-size: 14px; color: #1890ff" />
              </a>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'appLatestPublishVersionNo'">
            <span v-if="isAppPublished(record)" style="display: inline-flex; align-items: center; gap: 6px">
              <span>{{ getPublishVersionDisplayText(record.appLatestPublishVersionNo) }}</span>
              <a href="#" style="cursor: pointer" title="查看独立应用发布历史版本" @click.stop.prevent="showVersionHistory(record, 'APP')">
                <EpcIcon type="icon-banbenlishi" style="font-size: 14px; color: #1890ff" />
              </a>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'collabStatus'">
            <span>
              <a-tag v-if="isCollabPublished(record)" :class="['exe-status-tag', 'exe-status-tag--on']">已发布</a-tag>
              <a-tag v-else :class="['exe-status-tag', 'exe-status-tag--off']">未发布</a-tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            <span>{{ formatCreateTimeDisplay(record.createTime) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'confidentialLevel'">
            <span v-if="record.confidentialLevel == 0">公开</span>
            <span v-else-if="record.confidentialLevel == 1">内部</span>
            <span v-else-if="record.confidentialLevel == 2">秘密</span>
            <span v-else-if="record.confidentialLevel == 3">机密</span>
          </template>
          <template v-else-if="column.dataIndex === 'sharedUserNames'">
            <span>{{ record.sharedUserNames || '—' }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="calc-operation-links" @click.stop>
              <template v-if="canRowOperate(record)">
                <a v-if="isFlowConfigEditable(record)" href="#" @click.prevent="handleToolbarConfig(record)">配置</a>
                <span v-else class="operation-disabled">配置</span>
              </template>
              <a href="#" @click.prevent="handleToolbarView(record)">预览</a>
              <template v-if="canRowOperate(record)">
                <a-popconfirm
                  v-if="!isCollabPublished(record)"
                  placement="topLeft"
                  title="确定要发布任务吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm.stop.prevent="handlePublishAction(record, 'COLLAB')">
                  <a href="#" @click.prevent>发布任务</a>
                </a-popconfirm>
                <a-popconfirm
                  v-else
                  placement="topLeft"
                  title="确定要取消发布任务吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm.stop.prevent="handlePublishAction(record, 'COLLAB')">
                  <a href="#" @click.prevent>撤销任务</a>
                </a-popconfirm>
                <a-popconfirm
                  v-if="!isAppPublished(record)"
                  placement="topLeft"
                  title="确定要发布应用吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm.stop.prevent="handlePublishAction(record, 'APP')">
                  <a href="#" @click.prevent>发布应用</a>
                </a-popconfirm>
                <a-popconfirm
                  v-else
                  placement="topLeft"
                  title="确定要取消发布应用吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm.stop.prevent="handlePublishAction(record, 'APP')">
                  <a href="#" @click.prevent>撤销应用</a>
                </a-popconfirm>
                <a-popconfirm v-if="!isCollabPublished(record)" title="确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="handleDeleteClick(record)">
                  <a href="#" class="operation-danger" @click.prevent>删除</a>
                </a-popconfirm>
                <span v-else class="operation-disabled">删除</span>
              </template>
              <a v-if="canRowShare(record)" href="#" @click.prevent="openDesignShareModal(record)">共享</a>
              <a href="#" @click.prevent="openTaskUsedParamsModal(record)">使用参数</a>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <DesignResourceShareModal v-model:visible="designShareModalVisible" biz-type="TASK" :biz-id="designShareTarget?.bizId" @saved="onDesignShareSaved" />

    <a-modal
      v-model:visible="flowFormVisible"
      :title="flowFormMode === 'add' ? '新建流程' : '编辑流程'"
      :width="520"
      :mask-closable="false"
      destroy-on-close
      @cancel="handleFlowFormCancel">
      <a-form
        ref="flowFormRef"
        class="process-panel__flow-form"
        :model="flowFormModel"
        :rules="flowFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off">
        <a-form-item label="任务名称" name="processName">
          <a-input v-model:value="flowFormModel.processName" placeholder="请输入流程名称" allow-clear maxlength="128" show-count />
        </a-form-item>
        <a-form-item label="密级" name="confidentialLevel">
          <a-select v-model:value="flowFormModel.confidentialLevel" placeholder="请选择密级" allow-clear class="process-panel__flow-form-select">
            <a-select-option v-for="item in userStore.getConfidentialLevel" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" :loading="flowFormSubmitting" @click="handleFlowFormOk">确定</a-button>
        <a-button @click="handleFlowFormCancel">取消</a-button>
      </template>
    </a-modal>

    <a-modal v-model:visible="flowViewVisible" title="流程图" :width="1000" centered destroy-on-close :mask-closable="true" @cancel="closeFlowView">
      <div class="process-panel__flow-view-wrap">
        <FlowView :flow-data="flowViewData" />
      </div>
      <template #footer>
        <div class="process-panel__flow-view-footer">
          <a-button type="primary" @click="closeFlowView"> <EpcIcon type="icon-quxiao" style="font-size: 14px" /> 关闭 </a-button>
        </div>
      </template>
    </a-modal>

    <a-modal v-model:visible="taskUsedParamModalVisible" :title="taskUsedParamModalTitle" :width="900" :mask-closable="true" destroy-on-close @cancel="closeTaskUsedParamsModal">
      <a-spin :spinning="taskUsedParamLoading">
        <a-table
          v-if="taskUsedParamList.length"
          :columns="taskUsedParamColumns"
          :data-source="taskUsedParamList"
          :pagination="false"
          :scroll="{ y: 420 }"
          :row-key="(record, index) => `${index}-${record.paramCode}-${record.activityPageId}-${record.paramSource}`"
          size="small"
          bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'paramSource'">
              <span>{{ resolveTaskUsedParamSourceText(record.paramSource) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'paramName'">
              <span>{{ record.paramName || '—' }}</span>
            </template>
          </template>
        </a-table>
        <a-empty v-else-if="!taskUsedParamLoading" description="该任务未配置关联活动，或活动页未引用参数" />
      </a-spin>
      <template #footer>
        <a-button type="primary" @click="closeTaskUsedParamsModal">关闭</a-button>
      </template>
    </a-modal>

    <a-modal
      v-model:visible="visibleHistoryModal"
      :title="historyModalTitle"
      :width="760"
      :body-style="{ padding: '0' }"
      :mask-closable="false"
      :footer="null"
      centered
      destroy-on-close
      @cancel="closeHistoryModal">
      <div class="history-modal-wrap">
        <div v-if="!historyLoading" class="history-modal-content">
          <div v-if="historyList.length" class="history-timeline">
            <div v-for="item in historyList" :key="item.id || item.versionNo" class="history-item">
              <div class="history-dot" :class="{ 'history-dot--revoked': item.publishStatus === 'REVOKED' }"></div>
              <div class="history-main">
                <div class="history-version">{{ getVersionText(item.versionNo) }}</div>
                <div class="history-card">
                  <div class="history-title">
                    {{ item.processName || '—' }}
                    <a-tag size="small" :color="item.publishStatus === 'REVOKED' ? 'default' : 'success'">
                      {{ resolvePublishStatusText(item.publishStatus) }}
                    </a-tag>
                  </div>
                  <div v-if="item.remark" class="history-remark">{{ item.remark }}</div>
                  <div class="history-meta">({{ item.publishedByName || '-' }}) {{ item.publishedTime || '-' }}</div>
                  <div v-if="item.publishStatus === 'REVOKED'" class="history-meta history-meta--revoke">
                    撤销：{{ item.revokedTime || '-' }}{{ item.revokeReason ? `（${item.revokeReason}）` : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a-empty v-else description="暂无发布版本记录" />
        </div>
        <div v-else class="history-loading-wrap">
          <a-spin />
        </div>
        <div class="history-footer">
          <a-button type="primary" @click="closeHistoryModal">关闭</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 分配分类弹窗 -->
    <a-modal
      v-model:visible="assignCategoryModalVisible"
      :title="$t('分配分类')"
      width="720px"
      :confirm-loading="assignCategorySubmitLoading"
      destroy-on-close
      @ok="confirmAssignCategory"
      @cancel="cancelAssignCategory">
      <a-spin :spinning="assignCategoryLoading">
        <a-tabs v-if="assignCategoryPlatforms.length" v-model:activeKey="assignCategoryActiveMenuId" @change="onAssignCategoryTabChange">
          <a-tab-pane v-for="platform in assignCategoryPlatforms" :key="String(platform.id)" :tab="platform.categoryName || platform.name || String(platform.id)" />
        </a-tabs>
        <div v-if="assignCategoryTreeData.length" class="assign-category-tree-wrap">
          <a-directory-tree
            :show-icon="true"
            :tree-data="assignCategoryTreeData"
            :expand-action="false"
            default-expand-all
            :selected-keys="assignCategorySelectedKey ? [assignCategorySelectedKey] : []"
            @select="onAssignCategoryTreeSelect">
            <template #title="item">
              {{ item.partName }}
            </template>
          </a-directory-tree>
        </div>
        <div v-else-if="!assignCategoryLoading" class="assign-category-empty">{{ $t('暂无分类数据') }}</div>
      </a-spin>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.process-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* 不在分栏内再按 100vh 强撑高度，避免高于右侧 Pane 时把外层主区顶出竖向滚动条 */
  min-height: 0;
  padding: 10px;
  box-sizing: border-box;
}

.process-panel__search {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
}

.process-panel__search-input {
  width: 220px;
}

.process-panel__search-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 与 parameter/index.vue 列表表格一致 */
.process-flow-table-card {
  margin-top: 8px;
}

.calc-table-card {
  flex: 1;
  min-height: 0;
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    height: 100%;
    padding: 0;
  }

  :deep(.ant-table-wrapper) {
    height: 100%;
  }

  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  /* 表头标题与内置排序区整体居中（与 parameter 一致） */
  :deep(.ant-table-thead .ant-table-column-sorters) {
    justify-content: center !important;
  }

  :deep(.ant-table-thead .ant-table-column-title) {
    flex: none;
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

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }
}

.exe-config-table {
  :deep(.ant-table-cell-ellipsis .ant-typography) {
    margin-bottom: 0;
  }

  :deep(.ant-table-content),
  :deep(.ant-table-body) {
    padding-bottom: 14px;
    box-sizing: border-box;
  }

  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-cell-fix-left-last::after),
  :deep(.ant-table-cell-fix-right-first::after),
  :deep(.ant-table-cell-fix-left-first::after) {
    display: none !important;
  }

  :deep(.ant-table-cell-fix-left-last) {
    box-shadow: inset -8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }

  :deep(.ant-table-cell-fix-right-first) {
    box-shadow: inset 8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }
}

@exe-op-links-divider: #e0e0e0;
@exe-op-links-line-gap: 8px;
@exe-op-links-divider-h: 1em;

.calc-operation-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  row-gap: 6px;
  column-gap: 0;

  > * {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 2px @exe-op-links-line-gap;
    line-height: inherit;
    font-size: inherit;
    white-space: nowrap;
    border: none;
    border-radius: 0;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    &:not(:first-child) {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 1px;
        height: @exe-op-links-divider-h;
        margin-left: -0.5px;
        background: @exe-op-links-divider;
        transform: translateY(-50%);
        pointer-events: none;
      }
    }
  }
}

.history-modal-wrap {
  height: 620px;
  display: flex;
  flex-direction: column;
}

.history-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px 0;
}

.history-timeline {
  padding-left: 16px;
  border-left: 2px solid #e8e8e8;
}

.history-item {
  position: relative;
  margin-bottom: 28px;
}

.history-dot {
  position: absolute;
  left: -23px;
  top: 42px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #20c997;
}

.history-dot--revoked {
  background: #bfbfbf;
}

.history-version {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.history-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 18px 20px;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.history-remark {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.history-meta {
  margin-top: 10px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.85);
}

.history-meta--revoke {
  color: rgba(0, 0, 0, 0.45);
}

.history-loading-wrap {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.history-footer {
  border-top: 1px solid #f0f0f0;
  padding: 14px 24px;
  display: flex;
  justify-content: flex-end;
}

.exe-status-tag {
  margin: 0;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  padding: 0 10px;
  border-style: solid;
  border-width: 1px;
}

.exe-status-tag--on {
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.exe-status-tag--off {
  color: rgba(0, 0, 0, 0.65);
  background: #fafafa;
  border-color: #d9d9d9;
}

/* 表头：标题 + 排序 + 筛选（与 parameter/index.vue 一致） */
.header-query-icon {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
}

.header-filter-trigger {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  cursor: pointer;
}

.header-cell-main {
  position: relative;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 14px;
}

.header-cell-main--static {
  padding-right: 0;
}

.header-cell-main--has-filter {
  padding-right: 22px;
}

.header-filter-anchor {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}

.header-title-sort--disabled {
  cursor: default;
}

.header-sort-icon {
  font-size: 11px;
  color: #595959;
  display: inline-flex;
}

.header-sort-icon--muted {
  color: #bfbfbf;
}

.header-filter-pop {
  width: 220px;
}

.header-filter-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
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

:deep(.operation-danger) {
  color: #ff4d4f;
}

:deep(.p-0) {
  padding: 0 !important;
}

.process-panel__flow-form {
  margin-top: 8px;
}

.process-panel__flow-form-select {
  width: 100%;
}

.process-panel__flow-view-wrap {
  height: 560px;
  min-height: 480px;
  box-sizing: border-box;
}

.process-panel__flow-view-footer {
  display: flex;
  justify-content: flex-end;
}

.assign-category-tree-wrap {
  margin-top: 12px;
  max-height: calc(100vh - 360px);
  overflow-y: auto;
}

.assign-category-empty {
  padding: 24px 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}
</style>
