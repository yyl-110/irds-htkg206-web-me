<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, reactive, ref, watch } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message, Modal } from 'ant-design-vue';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
import { usePagination } from '@/hooks/usePagination';
import { useUserStore } from '@/store/modules/user';
import ExeConfigAddModal from './exeConfigAddModal.vue';
import ExeConfigEditModal from './exeConfigEditModal.vue';

type ExeConfigRecord = {
  id: string | number;
  calcName: string;
  fileName: string;
  calcType: string;
  treeName: string;
  levelName: string;
  statusDisplay: string;
  createUser: string;
  updateUser: string;
  createTime: string;
  updateTime: string;
};

/** 密级数值与展示文案（与 userStore 中定义一致） */
const CONFIDENTIAL_LEVEL_LABELS: Record<number, string> = {
  0: '公开',
  1: '内部',
  2: '秘密',
  3: '机密',
};

/** 列表行原始数据中 fileList[0] 为主文件信息（含 oldFileName、fileId） */
function getPrimaryFileEntry(item: any): any {
  const fl = item?.fileList;
  if (Array.isArray(fl) && fl.length > 0 && fl[0] != null && typeof fl[0] === 'object') {
    return fl[0];
  }
  return item;
}

function formatConfidentialLevelLabel(item: any): string {
  const raw = item?.confidentialLevel ?? item?.securityLevel;
  const n = Number(raw);
  if (Number.isFinite(n) && CONFIDENTIAL_LEVEL_LABELS[n]) {
    return CONFIDENTIAL_LEVEL_LABELS[n];
  }
  const text = String(raw ?? item?.levelName ?? item?.secretLevel ?? '').trim();
  if (['公开', '内部', '秘密', '机密'].includes(text)) return text;
  return text || '--';
}

function formatYMD(val: unknown): string {
  if (val === undefined || val === null || val === '') return '--';
  const d = dayjs(val as string | number | Date);
  return d.isValid() ? d.format('YYYY-MM-DD') : String(val).slice(0, 10) || '--';
}

function pickFirstText(item: any, keys: string[]): string {
  for (const k of keys) {
    const v = item?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return '--';
}

/** 列表展示：优先 status（1 已发布 / 0 未发布，与添加、发布接口一致）；否则兼容 releaseStatus 等 */
function formatPublishStatusText(item: any): string {
  const st = item?.status;
  if (st === 1 || st === '1') return '已发布';
  if (st === 0 || st === '0') return '未发布';
  if (st === '已发布' || st === '未发布') return st;
  if (st === true) return '已发布';
  if (st === false) return '未发布';

  const rs = item?.releaseStatus ?? item?.publishStatus;
  if (rs !== undefined && rs !== null && rs !== '') {
    const s = String(rs);
    if (s === '0') return '已发布';
    if (s === '1') return '未发布';
  }
  return '未发布';
}

const props = defineProps<{
  /** 左侧分类树当前节点 id，与参数列表接口 treeId 一致 */
  treeId?: string;
  currentNodeName?: string;
}>();

const emit = defineEmits<{
  action: [action: string, record: ExeConfigRecord];
}>();

const userStore = useUserStore();
const keyword = ref('');
const loading = ref(false);
const exeListRaw = ref<any[]>([]);
const requestParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const { pagination } = usePagination(requestParams as any, () => {
  void fetchExeList();
});

async function fetchExeList() {
  loading.value = true;
  try {
    const body: Record<string, unknown> = {
      userId: userStore.getUser.id,
      pageNo: requestParams.pageNo,
      pageSize: requestParams.pageSize,
    };
    const tid = String(props.treeId ?? '').trim();
    if (tid) body.treeId = tid;
    const name = keyword.value.trim();
    if (name) body.checkName = name;

    const res = await AdminApiSystemCheckInfoApi.checkPageParamExeList(body);
    const code = res?.data?.code as number | string | undefined;
    const ok = code === 0 || code === 200 || code === '0';
    const raw = res?.data?.data;
    let list: any[] = [];
    let total = 0;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (Array.isArray((raw as any).list)) {
        list = (raw as any).list;
        total = Number((raw as any).total ?? list.length);
      } else if (Array.isArray((raw as any).records)) {
        list = (raw as any).records;
        total = Number((raw as any).total ?? list.length);
      }
    } else if (Array.isArray(raw)) {
      list = raw;
      total = list.length;
    }
    exeListRaw.value = ok ? list : [];
    pagination.total = total;
    if (!ok && res?.data?.msg) message.error(String(res.data.msg));
  } catch {
    exeListRaw.value = [];
    message.error('获取exe计算列表失败');
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.treeId,
  () => {
    requestParams.pageNo = 1;
    pagination.current = 1;
    void fetchExeList();
  },
  { immediate: true },
);
/** 表头与单元格均居中 */
const CENTER_ALIGNED_KEYS = ['calcType', 'levelName', 'statusDisplay', 'createTime', 'updateTime'];

const exeConfigColumns = ref<TableColumnType<ExeConfigRecord>[]>([
  { title: '计算名称', dataIndex: 'calcName', key: 'calcName', align: 'left', width: 160, ellipsis: true },
  { title: '计算类型', dataIndex: 'calcType', key: 'calcType', align: 'center', width: 120, ellipsis: true },
  { title: '所属分类', dataIndex: 'treeName', key: 'treeName', align: 'left', width: 160, ellipsis: true },
  { title: '密级', dataIndex: 'levelName', key: 'levelName', align: 'center', width: 100, ellipsis: true },
  { title: '状态', dataIndex: 'statusDisplay', key: 'statusDisplay', align: 'center', width: 110, ellipsis: false },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName', align: 'left', width: 200, ellipsis: true },
  { title: '创建人', dataIndex: 'createUser', key: 'createUser', align: 'left', width: 100, ellipsis: true },
  { title: '编辑人', dataIndex: 'updateUser', key: 'updateUser', align: 'left', width: 100, ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', align: 'center', width: 120, ellipsis: true },
  { title: '编辑时间', dataIndex: 'updateTime', key: 'updateTime', align: 'center', width: 120, ellipsis: true },
  { title: '操作', dataIndex: 'operation', key: 'operation', align: 'left', width: 200, fixed: 'right' },
]);

type SortOrder = 'ascend' | 'descend' | '';
const sortState = ref<{ key: string; order: SortOrder }>({ key: '', order: '' });
const filterValueMap = ref<Record<string, string>>({});
const filterOpenMap = ref<Record<string, boolean>>({});
const addModalVisible = ref(false);
const editModalVisible = ref(false);
const editRow = ref<Record<string, unknown> | null>(null);
/** 发布/取消发布请求中的行 id，用于防重复点击 */
const publishBusyId = ref<string | number | null>(null);

const sourceList = computed<ExeConfigRecord[]>(() => {
  return (exeListRaw.value || []).map((item: any, index: number) => {
    const primary = getPrimaryFileEntry(item);
    const oldName = String(primary?.oldFileName ?? '').trim();
    return {
      id: item?.id ?? `${index}-${item?.checkNum ?? item?.parameterNum ?? ''}`,
      calcName: item?.checkName ?? item?.parameterName ?? item?.calcName ?? '--',
      fileName: oldName || String(primary?.fileName ?? primary?.newFileName ?? '').trim() || '--',
      calcType: item?.useType ?? item?.parameterTypeName ?? item?.calcType ?? 'exe',
      treeName: item?.treeName ?? item?.categoryName ?? props.currentNodeName ?? '--',
      levelName: formatConfidentialLevelLabel(item),
      statusDisplay: formatPublishStatusText(item),
      createUser: pickFirstText(item, ['createName', 'createUserName', 'createByName', 'createUser', 'creatorName', 'creator']),
      updateUser: pickFirstText(item, ['updateName', 'updateUserName', 'updateByName', 'updateUser', 'editorName', 'modifyUserName', 'editUserName']),
      createTime: formatYMD(item?.createTime ?? item?.createData),
      updateTime: formatYMD(item?.updateTime ?? item?.editTime ?? item?.modifyTime),
    };
  });
});

const exeConfigList = computed<ExeConfigRecord[]>(() => {
  let list = [...sourceList.value];

  Object.keys(filterValueMap.value).forEach((key: string) => {
    const filterValue = String(filterValueMap.value[key] ?? '').trim().toLowerCase();
    if (!filterValue) return;
    list = list.filter((item: any) => String(item?.[key] ?? '').toLowerCase().includes(filterValue));
  });

  if (!sortState.value.key || !sortState.value.order) return list;
  const sorted = [...list].sort((a: any, b: any) => {
    if (sortState.value.key === 'statusDisplay') {
      return Number(a.statusDisplay === '已发布') - Number(b.statusDisplay === '已发布');
    }
    return sortText(a?.[sortState.value.key], b?.[sortState.value.key]);
  });
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function sortText(a: unknown, b: unknown) {
  return String(a ?? '').localeCompare(String(b ?? ''), 'zh-CN');
}

function isSortableColumn(column: any) {
  return column?.dataIndex && column.dataIndex !== 'operation';
}

function isFilterableColumn(column: any) {
  return column?.dataIndex === 'calcName';
}

function isHeaderCenterColumn(column: any): boolean {
  return CENTER_ALIGNED_KEYS.includes(String(column?.dataIndex ?? ''));
}

function isStatusPublished(text: string): boolean {
  return text === '已发布' || text === '开启';
}

function toggleColumnSort(column: any) {
  if (!isSortableColumn(column)) return;
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

function getSortOrder(key: string): SortOrder {
  return sortState.value.key === key ? sortState.value.order : '';
}

function setFilterOpen(key: string, open: boolean) {
  filterOpenMap.value = { ...filterOpenMap.value, [key]: open };
}

function handleFilterOpenChange(key: string, open: boolean) {
  setFilterOpen(key, open);
}

function getFilterOpen(key: string) {
  return Boolean(filterOpenMap.value[key]);
}

function applyColumnFilter(key: string) {
  setFilterOpen(key, false);
}

function resetColumnFilter(key: string) {
  filterValueMap.value = { ...filterValueMap.value, [key]: '' };
  setFilterOpen(key, false);
}

function getRowKey(record: ExeConfigRecord) {
  return record.id;
}

function getRowClassName(_record: ExeConfigRecord, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function onSearch() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  void fetchExeList();
}

function onAdd() {
  addModalVisible.value = true;
}

function openEdit(record: ExeConfigRecord) {
  const raw = exeListRaw.value.find((r: any) => String(r?.id ?? '') === String(record.id));
  editRow.value = raw ? ({ ...raw } as Record<string, unknown>) : ({ id: record.id, checkName: record.calcName, treeName: record.treeName } as Record<string, unknown>);
  editModalVisible.value = true;
}

async function requestDeleteExe(record: ExeConfigRecord) {
  try {
    const res = await AdminApiSystemCheckInfoApi.deleteCheckExeInfo({
      id: record.id,
      userId: userStore.getUser.id,
    });
    const code = res?.data?.code as number | string | undefined;
    if (code !== 0 && code !== 200 && code !== '0') {
      message.error(String(res?.data?.msg || '删除失败'));
      return;
    }
    message.success('删除成功');
    void fetchExeList();
  } catch {
    message.error('删除失败，请稍后重试');
  }
}

function confirmDeleteExe(record: ExeConfigRecord) {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除「${record.calcName}」吗？删除后不可恢复。`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: () => requestDeleteExe(record),
  });
}

function getExeRawByRecord(record: ExeConfigRecord): Record<string, unknown> | null {
  const raw = exeListRaw.value.find((r: any) => String(r?.id ?? '') === String(record.id));
  return raw ? ({ ...raw } as Record<string, unknown>) : null;
}

function resolveConfidentialLevelFromRow(row: Record<string, unknown>): number {
  const n = Number(row.confidentialLevel ?? row.securityLevel);
  return Number.isFinite(n) ? n : 0;
}

function isApiOk(res: any): boolean {
  const code = res?.data?.code as number | string | undefined;
  return code === 0 || code === 200 || code === '0';
}

/** 发布：写入计算清单（saveCheckSummar）后更新 exe 状态为已发布 */
async function requestPublishExe(record: ExeConfigRecord) {
  if (publishBusyId.value != null) {
    message.warning('请等待当前操作完成');
    return;
  }
  const row = getExeRawByRecord(record);
  if (!row) {
    message.error('未找到记录');
    return;
  }
  const primary = getPrimaryFileEntry(row);
  const fileId = String(primary?.fileId ?? primary?.queryId ?? row.fileId ?? row.queryId ?? '').trim();
  if (!fileId) {
    message.warning('缺少文件信息，无法发布');
    return;
  }

  const id = String(row.id ?? record.id);
  const checkName = String(row.checkName ?? row.parameterName ?? record.calcName ?? '');
  const checkNum = String(row.checkNum ?? row.parameterNum ?? row.checkName ?? record.calcName ?? '');
  const useType = String(row.useType ?? 'exe计算');
  const confidentialLevel = resolveConfidentialLevelFromRow(row);
  const treeName = String(row.treeName ?? props.currentNodeName ?? '');
  const treeId = String(props.treeId ?? row.treeId ?? '').trim();
  const remarks = String(row.remarks ?? '');

  publishBusyId.value = record.id;
  try {
    const summarRes = await AdminApiSystemCheckInfoApi.saveCheckSummar({
      userId: userStore.getUser.id,
      exeCheckId: id,
      checkName,
      checkType: 'exe计算',
      status: 3,
      remarks,
      confidentialLevel,
      ...(treeId ? { treeId } : {}),
    });
    if (!isApiOk(summarRes)) {
      message.error(String(summarRes?.data?.msg || '发布失败：写入计算清单失败'));
      return;
    }

    const updRes = await AdminApiSystemCheckInfoApi.updateCheckExeInfo({
      id,
      checkName,
      checkNum,
      fileId,
      useType,
      status: 1,
      confidentialLevel,
      treeName,
      userId: userStore.getUser.id,
    });
    if (!isApiOk(updRes)) {
      message.error(String(updRes?.data?.msg || '发布失败：更新状态失败'));
      return;
    }
    message.success('发布成功');
    void fetchExeList();
  } catch {
    message.error('发布失败，请稍后重试');
  } finally {
    publishBusyId.value = null;
  }
}

/** 取消发布：saveCheckSummar 传删除语义后更新 exe 状态为未发布 */
async function requestUnpublishExe(record: ExeConfigRecord) {
  if (publishBusyId.value != null) {
    message.warning('请等待当前操作完成');
    return;
  }
  const row = getExeRawByRecord(record);
  if (!row) {
    message.error('未找到记录');
    return;
  }
  const primary = getPrimaryFileEntry(row);
  const fileId = String(primary?.fileId ?? primary?.queryId ?? row.fileId ?? row.queryId ?? '').trim();
  if (!fileId) {
    message.warning('缺少文件信息，无法取消发布');
    return;
  }

  const id = String(row.id ?? record.id);
  const checkName = String(row.checkName ?? row.parameterName ?? record.calcName ?? '');
  const checkNum = String(row.checkNum ?? row.parameterNum ?? row.checkName ?? record.calcName ?? '');
  const useType = String(row.useType ?? 'exe计算');
  const confidentialLevel = resolveConfidentialLevelFromRow(row);
  const treeName = String(row.treeName ?? props.currentNodeName ?? '');

  publishBusyId.value = record.id;
  try {
    const summarRes = await AdminApiSystemCheckInfoApi.saveCheckSummar({
      userId: userStore.getUser.id,
      id,
      checkExeInfoId: id,
      operation: 'DELETE',
    });
    if (!isApiOk(summarRes)) {
      message.error(String(summarRes?.data?.msg || '取消发布失败：从计算清单移除失败'));
      return;
    }

    const updRes = await AdminApiSystemCheckInfoApi.updateCheckExeInfo({
      id,
      checkName,
      checkNum,
      fileId,
      useType,
      status: 0,
      confidentialLevel,
      treeName,
      userId: userStore.getUser.id,
    });
    if (!isApiOk(updRes)) {
      message.error(String(updRes?.data?.msg || '取消发布失败：更新状态失败'));
      return;
    }
    message.success('已取消发布');
    void fetchExeList();
  } catch {
    message.error('取消发布失败，请稍后重试');
  } finally {
    publishBusyId.value = null;
  }
}

function confirmCancelPublish(record: ExeConfigRecord) {
  Modal.confirm({
    title: '取消发布',
    content: `确定取消发布「${record.calcName}」吗？将从计算清单中移除对应应用。`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => requestUnpublishExe(record),
  });
}

function onAction(action: string, record: ExeConfigRecord) {
  if (action === '编辑') {
    openEdit(record);
    return;
  }
  if (action === '删除') {
    confirmDeleteExe(record);
    return;
  }
  if (action === '发布') {
    void requestPublishExe(record);
    return;
  }
  if (action === '取消发布') {
    confirmCancelPublish(record);
    return;
  }
  emit('action', action, record);
}

function isRecordPublished(record: ExeConfigRecord): boolean {
  return record.statusDisplay === '已发布';
}

function handleAddSuccess() {
  void fetchExeList();
}

watch(editModalVisible, (v) => {
  if (!v) editRow.value = null;
});
</script>

<template>
  <div class="calc-config-pane">
    <a-card class="calc-toolbar-card">
      <a-form layout="inline" class="calc-toolbar-form">
        <a-form-item label="">
          <a-input v-model:value="keyword" placeholder="请输入计算名称" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSearch">
            <SearchOutlined />
            查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onAdd">
            <PlusOutlined />
            添加
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="calc-table-card">
      <a-table
        class="exe-config-table"
        :columns="exeConfigColumns"
        :data-source="exeConfigList"
        :pagination="pagination"
        :loading="loading"
        bordered
        table-layout="fixed"
        :row-key="getRowKey"
        :scroll="{ x: 1520, y: 420 }"
        :row-class-name="getRowClassName">
        <template #headerCell="{ column }">
          <div class="header-cell-main" :class="{ 'header-cell-main--center': isHeaderCenterColumn(column) }">
            <span
              class="header-title-sort"
              :class="{ 'header-title-sort--disabled': !isSortableColumn(column) }"
              @click.stop="toggleColumnSort(column)">
              <span>{{ column.title }}</span>
              <span v-if="isSortableColumn(column)" class="header-sort-icon">
                <CaretUpOutlined v-if="getSortOrder(String(column.dataIndex)) === 'ascend'" />
                <CaretDownOutlined v-else-if="getSortOrder(String(column.dataIndex)) === 'descend'" />
                <CaretUpOutlined v-else class="header-sort-icon--muted" />
              </span>
            </span>
            <a-popover
              v-if="isFilterableColumn(column)"
              trigger="click"
              placement="bottomRight"
              :open="getFilterOpen(String(column.dataIndex))"
              @openChange="handleFilterOpenChange(String(column.dataIndex), $event)">
              <template #content>
                <div class="header-filter-pop">
                  <a-input
                    v-model:value="filterValueMap[String(column.dataIndex)]"
                    :placeholder="`搜索 ${column.title}`"
                    allow-clear />
                  <div class="header-filter-actions">
                    <a-button type="primary" size="small" @click="applyColumnFilter(String(column.dataIndex))">
                      <SearchOutlined />
                      确定
                    </a-button>
                    <a-button size="small" @click="resetColumnFilter(String(column.dataIndex))">重置</a-button>
                  </div>
                </div>
              </template>
              <FilterOutlined class="header-query-icon" />
            </a-popover>
          </div>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'statusDisplay'">
            <a-tooltip :title="record.statusDisplay">
              <a-tag
                :class="[
                  'exe-status-tag',
                  isStatusPublished(record.statusDisplay) ? 'exe-status-tag--on' : 'exe-status-tag--off',
                ]">
                {{ record.statusDisplay }}
              </a-tag>
            </a-tooltip>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="calc-operation-links">
              <a @click.stop.prevent="onAction('编辑', record)">编辑</a>
              <a @click.stop.prevent="onAction('删除', record)" style="color: #ff4d4f">删除</a>
              <a
                v-if="isRecordPublished(record)"
                :class="{ 'calc-operation-links--disabled': publishBusyId === record.id }"
                @click.stop.prevent="onAction('取消发布', record)">
                {{ publishBusyId === record.id ? '处理中…' : '取消发布' }}
              </a>
              <a
                v-else
                :class="{ 'calc-operation-links--disabled': publishBusyId === record.id }"
                @click.stop.prevent="onAction('发布', record)">
                {{ publishBusyId === record.id ? '处理中…' : '发布' }}
              </a>
            </div>
          </template>
          <template v-else-if="column.ellipsis">
            <a-tooltip :title="String(text ?? '')">
              <span class="exe-config-cell-ellipsis">{{ text }}</span>
            </a-tooltip>
          </template>
          <template v-else>{{ text }}</template>
        </template>
      </a-table>
    </a-card>
    <ExeConfigAddModal
      v-model:visible="addModalVisible"
      :current-node-name="currentNodeName"
      @success="handleAddSuccess" />
    <ExeConfigEditModal
      v-model:visible="editModalVisible"
      :record="editRow"
      :current-node-name="currentNodeName"
      @success="handleAddSuccess" />
  </div>
</template>

<style scoped lang="less">
.calc-config-pane {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calc-toolbar-card {
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 12px 0;
  }
}

.calc-toolbar-form {
  gap: 4px;
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
  }

  :deep(.ant-table-thead > tr > th:last-child) {
    border-right: none;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
  }
}

.exe-config-table {
  :deep(.ant-table-cell-ellipsis .ant-typography) {
    margin-bottom: 0;
  }
}

.exe-config-cell-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.calc-operation-links {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.calc-operation-links--disabled {
  color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
  cursor: not-allowed;
}

.header-cell-main--center {
  justify-content: center;
}

.header-cell-main--center .header-title-sort {
  justify-content: center;
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

.header-cell-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.header-query-icon {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
}

.header-cell-main {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
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
</style>
