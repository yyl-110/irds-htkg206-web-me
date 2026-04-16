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
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
const props = defineProps<{
  menuId?: string | number;
  treeNodeKey?: string | number;
}>();

const userStore = useUserStore();

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
    dataIndex: 'processKey',
    key: 'processKey',
    align: 'left',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.processKey, b.processKey),
    width: 180,
  },
  {
    title: '任务名称',
    dataIndex: 'processName',
    key: 'processName',
    align: 'left',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.processName, b.processName),
    width: 180,
  },
  {
    title: '密级',
    dataIndex: 'confidentialLevel',
    key: 'confidentialLevel',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.confidentialLevel, b.confidentialLevel),
    width: 120,
  },
  {
    title: '发布协同',
    dataIndex: 'collabStatus',
    key: 'collabStatus',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.collabStatus, b.collabStatus),
    width: 120,
  },
  {
    title: '独立应用',
    dataIndex: 'appStatus',
    key: 'appStatus',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.appStatus, b.appStatus),
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
    dataIndex: 'ownerName',
    key: 'ownerName',
    align: 'center',
    resizable: true,
    sorter: (a: FlowRow, b: FlowRow) => sortermethod(a.ownerName, b.ownerName),
    width: 120,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 380,
    fixed: 'right',
  },
  { fixed: 'right', width: 1 },
]);

async function loadFlowListData() {
  loading.value = true;
  try {
    requestParams.menuId = props.menuId ?? '';
    requestParams.treeId = props.treeNodeKey ?? '';
    const res = await AdminApiSystemProcessTask.taskBasicInfoPage(requestParams);
    console.log('loadFlowListData res:', res);
    tableData.value = Array.isArray(res.data.data.list) ? res.data.data.list : [];
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

function handleActionClick(action: string) {
  message.info(`${action}（待接后端）`);
}

async function handleDeleteClick(taskId: string) {
  const res = await AdminApiSystemProcessTask.deleteTaskBasicInfo({ id: taskId });
  loadFlowListData();
}

/** 发布协同状态：1 / 已发布 视为已发布 */
function isCollabPublished(record: FlowRow) {
  return String(record.collabStatus) === '1' || record.collabStatus === '已发布';
}

/** 独立应用状态：1 / 已发布 视为已发布 */
function isAppPublished(record: FlowRow) {
  return String(record.appStatus) === '1' || record.appStatus === '已发布';
}

const selectedFlowRows = computed(() => selectedRowList.value as FlowRow[]);

/** 勾选一条且未发布协同时可查看、编辑 */
const canToolbarViewOrEdit = computed(() => {
  const rows = selectedFlowRows.value;
  if (rows.length !== 1) return false;
  return !isCollabPublished(rows[0]);
});

/** 勾选一条时可配置 */
const canToolbarConfig = computed(() => selectedFlowRows.value.length == 1);

function handleToolbarView() {
  const rows = selectedFlowRows.value;
  if (rows.length !== 1) {
    message.warning('请勾选一条流程');
    return;
  }
  handleActionClick(`查看-${rows[0].id}`);
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
  if (isCollabPublished(row)) {
    message.warning('已发布协同的流程不可编辑');
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

function handleToolbarConfig() {
  const rows = selectedFlowRows.value;
  if (rows.length !== 1) {
    message.warning('请勾选一条流程');
    return;
  }
  handleActionClick(`配置-${rows[0].id}`);
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
      <a-button type="primary" class="process-panel__search-btn" @click="handleQuerySearch"> 查询 </a-button>
      <a-button type="primary" @click="openFlowFormAdd">添加</a-button>
      <a-button type="primary" :disabled="!canToolbarViewOrEdit" @click="handleToolbarView">查看</a-button>
      <a-button type="primary" :disabled="!canToolbarViewOrEdit" @click="handleToolbarEdit">编辑</a-button>
      <a-button type="primary" :disabled="!canToolbarConfig" @click="handleToolbarConfig">配置</a-button>
    </div>

    <a-table
      style="margin-top: 5px"
      :scroll="{ x: 1340, y: 500 }"
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
        <template v-if="column.dataIndex === 'confidentialLevel'">
          <span v-if="record.confidentialLevel == 0">公开</span>
          <span v-if="record.confidentialLevel == 1">内部</span>
          <span v-if="record.confidentialLevel == 2">秘密</span>
          <span v-if="record.confidentialLevel == 3">机密</span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div class="process-panel__ops">
            <div class="process-panel__ops-line">
              <template v-if="!isCollabPublished(record)">
                <a @click="handleActionClick(`发布协同-${record.id}`)">发布协同</a>
              </template>
              <template v-else>
                <span class="operation-disabled">发布协同</span>
              </template>
              <a-divider type="vertical" />
              <template v-if="isCollabPublished(record)">
                <a @click="handleActionClick(`撤回协同-${record.id}`)">撤回协同</a>
              </template>
              <template v-else>
                <span class="operation-disabled">撤回协同</span>
              </template>
              <a-divider type="vertical" />
              <template v-if="!isAppPublished(record)">
                <a @click="handleActionClick(`发布独立应用-${record.id}`)">发布独立应用</a>
              </template>
              <template v-else>
                <span class="operation-disabled">发布独立应用</span>
              </template>
              <a-divider type="vertical" />
              <template v-if="isAppPublished(record)">
                <a @click="handleActionClick(`取消独立应用-${record.id}`)">取消独立应用</a>
              </template>
              <template v-else>
                <span class="operation-disabled">取消独立应用</span>
              </template>
              <a-divider type="vertical" />
              <template v-if="!isCollabPublished(record)">
                <a-popconfirm title="确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="handleDeleteClick(record.id)">
                  <a class="operation-danger">删除</a>
                </a-popconfirm>
              </template>
              <template v-else>
                <span class="operation-disabled">删除</span>
              </template>
            </div>
          </div>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:visible="flowFormVisible"
      :title="flowFormMode === 'add' ? '添加流程' : '编辑流程'"
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

.process-panel__search {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  margin-bottom: 4px;
  border-bottom: 1px solid #f0f0f0;
}

.process-panel__search-input {
  width: 220px;
}

.process-panel__search-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.process-panel__ops {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  line-height: 1.5;
}

.process-panel__ops-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0;
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
</style>
