<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { useUserStore } from '@/store/modules/user';
import { WeiI18n } from '@/utils/WeiI18n';
import { markSkipPlatformPickerDrawerOnTab } from '@/utils/platformPickerDrawerNav';

const PROJECT_LIST_SKIP_DRAWER_ON_RETURN = 'project-info-list-skip-drawer-on-return';
const DESIGN_TASK_APP_CARD_PATH = '/designTaskApplication';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const detailData = ref<Record<string, any>>({});
const listLoading = ref(false);
const createFlowLoading = ref(false);
const createFlowModalVisible = ref(false);
const editFlowLoading = ref(false);
const editFlowModalVisible = ref(false);
const queryAppCode = ref('');
const queryAppName = ref('');
const appList = ref<any[]>([]);
const createForm = ref({
  appCode: '',
  appName: '',
  confidentialLevel: undefined as number | undefined,
});
const editForm = ref({
  appId: '',
  appCode: '',
  appName: '',
});

const pageTitle = computed(() => String(detailData.value?.processName ?? detailData.value?.categoryName ?? '设计任务应用'));
const isCheckEntry = computed(() => String(route.query.entry ?? '').trim() === 'check');
const appCodeLabel = computed(() => (isCheckEntry.value ? '计算应用编号' : '独立应用编号'));
const appNameLabel = computed(() => (isCheckEntry.value ? '计算应用名称' : '独立应用名称'));
const createActionLabel = computed(() => (isCheckEntry.value ? '新建计算' : '新建'));

/** 操作列宽度（与 parameter/index.vue 一致，3 个操作用 --main-operation3-width） */
const operationWidth = computed(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation3-width');
  return Number(width) || 160;
});

const tableColumns = computed(() => [
  { title: appCodeLabel.value, dataIndex: 'appCode', key: 'appCode', width: 300, ellipsis: true },
  { title: appNameLabel.value, dataIndex: 'appName', key: 'appName', width: 220, ellipsis: true },
  { title: '任务版本', dataIndex: 'versionNum', key: 'versionNum', align: 'center', width: 100 },
  { title: '密级', dataIndex: 'confidentialLevel', key: 'confidentialLevel', align: 'center', width: 100 },
  { title: '创建人', dataIndex: 'creatorName', key: 'creatorName', align: 'center', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', align: 'center', width: 150 },
  { title: '状态', key: 'status', align: 'center', width: 96 },
  /** 固定右侧列不建议 resizable（与 parameter/index.vue、exeConfigTab 一致） */
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: operationWidth.value,
    fixed: 'right' as const,
  },
]);

/** 横向滚动宽度：列 width 之和 + 缓冲（与 parameter/index.vue 一致） */
const SCROLL_X_BUFFER_PX = 2;
const appTableScrollX = computed(() => {
  const sum = tableColumns.value.reduce((acc, col) => {
    const w = col.width;
    return acc + (typeof w === 'number' ? w : Number(w) || 0);
  }, 0);
  return sum + SCROLL_X_BUFFER_PX;
});

function normalizeUserIdString(v: unknown) {
  if (v === undefined || v === null) return '';
  const s = String(v).trim();
  return s === '' || s === 'undefined' || s === 'null' ? '' : s;
}

function sameUserId(a: unknown, b: unknown) {
  if (a === b) return true;
  const sa = normalizeUserIdString(a);
  const sb = normalizeUserIdString(b);
  if (!sa || !sb) return false;
  if (sa === sb) return true;
  if (/^\d+$/.test(sa) && /^\d+$/.test(sb)) {
    try {
      return BigInt(sa) === BigInt(sb);
    } catch {
      return false;
    }
  }
  return false;
}

function resolveRecordCreatorId(record: Record<string, any>) {
  return record?.creator ?? record?.creatorId ?? record?.createUserId;
}

/** 仅当前登录用户为记录创建人时可编辑、删除 */
function canManageApp(record: Record<string, any>) {
  const creatorId = resolveRecordCreatorId(record);
  if (creatorId == null || creatorId === '') return false;
  return sameUserId(creatorId, userStore.getUser.id);
}

function getConfidentialLevelText(record: Record<string, any>) {
  const raw = record?.confidentialLevel ?? record?.levelName ?? record?.secretLevel;
  if (raw === undefined || raw === null || raw === '') return '--';
  const found = userStore.getConfidentialLevel.find((item) => String(item.value) === String(raw));
  if (found) return found.label;
  const text = String(raw).trim();
  if (['公开', '内部', '秘密', '机密'].includes(text)) return text;
  return text || '--';
}

function resolveAppStatusText(record: Record<string, any>) {
  const text = String(record?.statusName || record?.status || record?.nodeStatus || '').trim();
  return text || '--';
}

function resolveAppStatusTagClass(statusText: string) {
  const status = String(statusText ?? '').trim();
  if (!status || status === '--') return 'app-status-tag--default';
  if (status.includes('未完成') || status.includes('未开始')) return 'app-status-tag--pending';
  if (status.includes('进行中') || status.includes('设计中')) return 'app-status-tag--in-progress';
  if (status.includes('待确认')) return 'app-status-tag--confirm';
  if (status.includes('已完成')) return 'app-status-tag--completed';
  if (status.includes('延迟') || status.includes('逾期')) return 'app-status-tag--delayed';
  return 'app-status-tag--default';
}

function getTableRowClassName(_record: Record<string, any>, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function loadDetailData() {
  const cacheKey = String(route.query.cacheKey ?? '');
  if (!cacheKey) return;
  const raw = sessionStorage.getItem(cacheKey);
  if (!raw) return;
  try {
    detailData.value = JSON.parse(raw);
  } catch {
    detailData.value = {};
  }
}

async function loadAppList() {
  listLoading.value = true;
  try {
    const payload = {
      appCode: queryAppCode.value,
      appName: queryAppName.value,
      taskId: detailData.value?.id ?? '',
    };
    const res = await AdminApiSystemProcessTask.appList(payload);
    const list = res?.data?.data;
    appList.value = Array.isArray(list) ? list : [];
  } catch {
    appList.value = [];
    message.error('独立应用列表加载失败');
  } finally {
    listLoading.value = false;
  }
}

function openCreateModal() {
  createForm.value = { appCode: '', appName: '', confidentialLevel: undefined };
  createFlowModalVisible.value = true;
}

async function applyAppCode() {
  try {
    const res = await AdminApiSystemProcessTask.nextAppCode({});
    createForm.value.appCode = String(res?.data?.data ?? '').trim();
  } catch {
    message.error('申请编号失败');
  }
}

async function confirmCreateFlow() {
  const appCode = String(createForm.value.appCode ?? '').trim();
  const appName = String(createForm.value.appName ?? '').trim();
  const confidentialLevel = createForm.value.confidentialLevel;
  if (!appCode) {
    message.warning(`请输入${appCodeLabel.value}`);
    return;
  }
  if (!appName) {
    message.warning(`请输入${appNameLabel.value}`);
    return;
  }
  if (confidentialLevel == null) {
    message.warning('请选择密级');
    return;
  }
  createFlowLoading.value = true;
  try {
    const payload = {
      appCode,
      appName,
      confidentialLevel: createForm.value.confidentialLevel,
      taskId: detailData.value?.id ?? '',
    };
    const res = await AdminApiSystemProcessTask.createApp(payload);
    const code = res?.data?.code;
    if (!(code === 0 || code === 200 || code === '0' || code === '200')) {
      message.error(String(res?.data?.msg ?? `${createActionLabel.value}失败`));
      return;
    }
    message.success(`${createActionLabel.value}成功`);
    createFlowModalVisible.value = false;
    await loadAppList();
  } catch (e) {
    message.error(`${createActionLabel.value}失败`);
  } finally {
    createFlowLoading.value = false;
  }
}

async function deleteApp(record: Record<string, any>) {
  if (!canManageApp(record)) {
    message.warning('仅创建人可删除');
    return;
  }
  const appId = String(record?.appId ?? '').trim();
  if (!appId) {
    message.warning('缺少应用标识，无法删除');
    return;
  }
  try {
    const res = await AdminApiSystemProcessTask.deleteApp({ appId });
    const code = res?.data?.code;
    if (!(code === 0 || code === 200 || code === '0' || code === '200')) {
      message.error(String(res?.data?.msg ?? '删除失败'));
      return;
    }
    message.success('删除成功');
    await loadAppList();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { msg?: string; message?: string } } };
    const serverMsg = err?.response?.data?.msg ?? err?.response?.data?.message;
    message.error(typeof serverMsg === 'string' && serverMsg.trim() ? serverMsg : '删除失败');
  }
}

function openEditModal(record: Record<string, any>) {
  if (!canManageApp(record)) {
    message.warning('仅创建人可编辑');
    return;
  }
  editForm.value = {
    appId: String(record?.appId ?? '').trim(),
    appCode: String(record?.appCode ?? '').trim(),
    appName: String(record?.appName ?? '').trim(),
  };
  editFlowModalVisible.value = true;
}

async function confirmEditFlow() {
  const appId = String(editForm.value.appId ?? '').trim();
  const appName = String(editForm.value.appName ?? '').trim();
  if (!appId) {
    message.warning('缺少应用标识，无法编辑');
    return;
  }
  if (!appName) {
    message.warning(`请输入${appNameLabel.value}`);
    return;
  }
  editFlowLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.updateApp({ appId, appName });
    const code = res?.data?.code;
    if (!(code === 0 || code === 200 || code === '0' || code === '200')) {
      message.error(String(res?.data?.msg ?? '编辑失败'));
      return;
    }
    message.success('编辑成功');
    editFlowModalVisible.value = false;
    await loadAppList();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { msg?: string; message?: string } } };
    const serverMsg = err?.response?.data?.msg ?? err?.response?.data?.message;
    message.error(typeof serverMsg === 'string' && serverMsg.trim() ? serverMsg : '编辑失败');
  } finally {
    editFlowLoading.value = false;
  }
}

async function designFlow(record: Record<string, any>) {
  const appId = String(record?.appId ?? '').trim();
  const appCode = String(record?.appCode ?? '').trim();
  if (!appId && !appCode) {
    message.warning('缺少应用标识，无法进入设计');
    return;
  }
  const data: Record<string, any> = {};
  if (appId) data.appId = appId;
  if (appCode) data.appCode = appCode;
  try {
    const res = await AdminApiSystemProcessTask.projectPages(data);
    const payload = res?.data?.data;
    if (!payload || typeof payload !== 'object') {
      message.error('流程页面数据为空');
      return;
    }
    const p = payload as Record<string, any>;
    const merged = {
      ...p,
      confidentialLevel:
        p.confidentialLevel ?? record?.confidentialLevel ?? detailData.value?.confidentialLevel,
    };
    const cacheKey = `designTaskAppWorkspace:${String(p?.appId ?? Date.now())}:${Date.now()}`;
    sessionStorage.setItem(cacheKey, JSON.stringify(merged));
    const taskId = String(detailData.value?.id ?? '').trim();
    const targetAppId = String(appId || p?.appId || '').trim();
    router.push({
      path: '/internal/design-task-app-workspace',
      query: { cacheKey, taskId, appId: targetAppId },
    });
  } catch {
    message.error('获取流程页面失败');
  }
}

function isDesignTaskAppCardPath(path: string) {
  const pathname = path.split('?')[0]?.split('#')[0] ?? '';
  return pathname === DESIGN_TASK_APP_CARD_PATH || pathname.endsWith(DESIGN_TASK_APP_CARD_PATH);
}

function markReturnToDesignTaskAppCardPage() {
  sessionStorage.setItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN, '1');
  markSkipPlatformPickerDrawerOnTab();
}

function goBack() {
  const returnPath = String(route.query.returnPath ?? '').trim();
  if (returnPath) {
    if (isDesignTaskAppCardPath(returnPath)) {
      markReturnToDesignTaskAppCardPage();
    }
    router.push(returnPath);
    return;
  }
  if (isCheckEntry.value) {
    router.back();
    return;
  }
  markReturnToDesignTaskAppCardPage();
  router.push({
    path: DESIGN_TASK_APP_CARD_PATH,
    query: { t: String(Date.now()) },
  });
}

loadDetailData();
void loadAppList();
</script>

<template>
  <div class="detail-page">
    <div class="detail-page__toolbar">
      <a-input v-model:value="queryAppCode" :placeholder="`请输入${appCodeLabel}`" allow-clear class="detail-page__search" />
      <a-input v-model:value="queryAppName" :placeholder="`请输入${appNameLabel}`" allow-clear class="detail-page__search" />
      <a-button type="primary" @click="loadAppList"><EpcIcon type="icon-fangdajing" style="font-size: 12px" />查询</a-button>
      <a-button type="primary" @click="openCreateModal"><EpcIcon type="icon-tianjia1" style="font-size: 12px" />{{ createActionLabel }}</a-button>
      <a-button @click="goBack"><EpcIcon type="icon-fanhui" style="font-size: 12px" />返回</a-button>
    </div>
    <a-card class="calc-table-card detail-page__table-card">
      <a-table
        class="exe-config-table"
        :columns="tableColumns"
        :data-source="appList"
        :loading="listLoading"
        row-key="appId"
        :pagination="false"
        bordered
        table-layout="fixed"
        :scroll="{ x: appTableScrollX }"
        :row-class-name="getTableRowClassName">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'versionNum'">
            <span>{{ record.versionNum != null && record.versionNum !== '' ? `V${record.versionNum}.0` : 'V-.0' }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'confidentialLevel'">
            <span>{{ getConfidentialLevelText(record) }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :class="['app-status-tag', resolveAppStatusTagClass(resolveAppStatusText(record))]">
              {{ resolveAppStatusText(record) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="calc-operation-links" @click.stop>
              <a href="#" @click.stop.prevent="designFlow(record)">设计</a>
              <a v-if="canManageApp(record)" href="#" @click.stop.prevent="openEditModal(record)">编辑</a>
              <a-popconfirm
                v-if="canManageApp(record)"
                placement="topLeft"
                :title="`${$t('确定要删除吗')}?`"
                ok-text="确定"
                cancel-text="取消"
                @confirm.stop.prevent="deleteApp(record)">
                <a href="#" style="color: #ff4d4f" @click.prevent>删除</a>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="createFlowModalVisible" :title="createActionLabel" :confirm-loading="createFlowLoading" @ok="confirmCreateFlow" @cancel="createFlowModalVisible = false">
      <div class="create-flow-form">
        <div class="create-flow-form__row">
          <span class="create-flow-form__label">{{ appCodeLabel }}:</span>
          <div class="create-flow-form__code-input-wrap">
            <a-input v-model:value="createForm.appCode" placeholder="请点击申请编号" disabled />
          </div>
          <a-button class="create-flow-form__apply-btn" type="primary" @click="applyAppCode"><EpcIcon type="icon-tianjia1" style="font-size: 12px" />申请编号</a-button>
        </div>
        <div class="create-flow-form__row">
          <span class="create-flow-form__label">{{ appNameLabel }}:</span>
          <a-input v-model:value="createForm.appName" :placeholder="`请输入${appNameLabel}`" />
        </div>
        <div class="create-flow-form__row">
          <span class="create-flow-form__label create-flow-form__label--required">密级:</span>
          <a-select v-model:value="createForm.confidentialLevel" placeholder="请选择密级">
            <a-select-option v-for="item in userStore.getConfidentialLevel" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" :loading="createFlowLoading" @click="confirmCreateFlow">{{ $t('确定') }}</a-button>
        <a-button @click="createFlowModalVisible = false">{{ $t('取消') }}</a-button>
      </template>
    </a-modal>
    <a-modal
      v-model:visible="editFlowModalVisible"
      title="编辑"
      :confirm-loading="editFlowLoading"
      @ok="confirmEditFlow"
      @cancel="editFlowModalVisible = false">
      <div class="create-flow-form">
        <div class="create-flow-form__row">
          <span class="create-flow-form__label">{{ appCodeLabel }}:</span>
          <a-input v-model:value="editForm.appCode" disabled />
        </div>
        <div class="create-flow-form__row">
          <span class="create-flow-form__label">{{ appNameLabel }}:</span>
          <a-input v-model:value="editForm.appName" :placeholder="`请输入${appNameLabel}`" />
        </div>
      </div>
      <template #footer>
        <a-button type="primary" :loading="editFlowLoading" @click="confirmEditFlow">{{ $t('确定') }}</a-button>
        <a-button @click="editFlowModalVisible = false">{{ $t('取消') }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.detail-page {
  min-height: calc(100vh - 120px);
  padding: 16px;
  background: #fff;
  box-sizing: border-box;
}

.detail-page__title {
  margin-bottom: 14px;
  font-size: 24px;
  font-weight: 700;
  color: #1f2d3d;
}

.detail-page__toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-page__search {
  width: 240px;
}

.create-flow-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-flow-form__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.create-flow-form__row :deep(.ant-input),
.create-flow-form__row :deep(.ant-select) {
  flex: 1;
  min-width: 0;
}

.create-flow-form__code-input-wrap {
  flex: 1;
  min-width: 0;
}

.create-flow-form__apply-btn {
  flex: 0 0 auto;
}

.create-flow-form__label {
  width: 110px;
  text-align: left;
  color: #1f2937;
  flex: 0 0 auto;
}

.create-flow-form__label--required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}

.detail-page__table-card {
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 0;
  }
}

.calc-table-card {
  --detail-table-row-height: 42px;

  :deep(.ant-table-thead > tr > th) {
    height: var(--detail-table-row-height);
    max-height: var(--detail-table-row-height);
    padding: 0 12px;
    box-sizing: border-box;
    border-right: 1px solid #e8e8e8;
    text-align: center;
    vertical-align: middle;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    line-height: var(--detail-table-row-height);
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    height: var(--detail-table-row-height);
    max-height: var(--detail-table-row-height);
    padding: 0 12px;
    box-sizing: border-box;
    border-right: none !important;
    font-size: 14px;
    line-height: var(--detail-table-row-height);
    vertical-align: middle;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }
}

.exe-config-table {
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
  justify-content: center;
  width: 100%;
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

.app-status-tag {
  margin: 0;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  padding: 0 10px;
  border-style: solid;
  border-width: 1px;
}

.app-status-tag--in-progress {
  color: #d48806;
  background: #fffbe6;
  border-color: #ffe58f;
}

.app-status-tag--completed {
  color: #389e0d;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.app-status-tag--pending,
.app-status-tag--default {
  color: rgba(0, 0, 0, 0.65);
  background: #fafafa;
  border-color: #d9d9d9;
}

.app-status-tag--confirm {
  color: #722ed1;
  background: #f9f0ff;
  border-color: #d3adf7;
}

.app-status-tag--delayed {
  color: #cf1322;
  background: #fff1f0;
  border-color: #ffccc7;
}
</style>
