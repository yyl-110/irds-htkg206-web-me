<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { useUserStore } from '@/store/modules/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const detailData = ref<Record<string, any>>({});
const listLoading = ref(false);
const createFlowLoading = ref(false);
const createFlowModalVisible = ref(false);
const queryAppCode = ref('');
const queryAppName = ref('');
const appList = ref<any[]>([]);
const createForm = ref({
  appCode: '',
  appName: '',
  confidentialLevel: undefined as number | undefined,
});

const pageTitle = computed(() => String(detailData.value?.processName ?? detailData.value?.categoryName ?? '设计任务应用'));
const tableColumns = [
  { title: '独立应用编号', dataIndex: 'appCode', key: 'appCode' },
  { title: '独立应用名称', dataIndex: 'appName', key: 'appName' },
  { title: '创建人', dataIndex: 'creatorName', key: 'creatorName' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' },
];

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
  if (!appCode) {
    message.warning('请输入独立应用编号');
    return;
  }
  if (!appName) {
    message.warning('请输入独立应用名称');
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
      message.error(String(res?.data?.msg ?? '创建流程失败'));
      return;
    }
    message.success('创建流程成功');
    createFlowModalVisible.value = false;
    await loadAppList();
  } catch (e) {
    message.error('创建流程失败');
  } finally {
    createFlowLoading.value = false;
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
    const cacheKey = `designTaskAppWorkspace:${String((payload as Record<string, any>)?.appId ?? Date.now())}:${Date.now()}`;
    sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    const taskId = String(detailData.value?.id ?? '').trim();
    const targetAppId = String(appId || (payload as Record<string, any>)?.appId || '').trim();
    router.push({
      path: '/internal/design-task-app-workspace',
      query: { cacheKey, taskId, appId: targetAppId },
    });
  } catch {
    message.error('获取流程页面失败');
  }
}

function goBack() {
  router.back();
}

loadDetailData();
void loadAppList();
</script>

<template>
  <div class="detail-page">
    <div class="detail-page__title">{{ pageTitle }}</div>
    <div class="detail-page__toolbar">
      <a-input v-model:value="queryAppCode" placeholder="请输入独立应用编号" allow-clear class="detail-page__search" />
      <a-input v-model:value="queryAppName" placeholder="请输入独立应用名称" allow-clear class="detail-page__search" />
      <a-button type="primary" @click="loadAppList">查询</a-button>
      <a-button type="primary" @click="openCreateModal"><EpcIcon type="icon-tianjia1" style="font-size: 12px" />创建流程</a-button>
      <a-button @click="goBack"><EpcIcon type="icon-fanhui" style="font-size: 12px" />返回</a-button>
    </div>
    <a-table :columns="tableColumns" :data-source="appList" :loading="listLoading" row-key="appId" :pagination="false" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          {{ record?.statusName || record?.status || record?.nodeStatus || '--' }}
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="designFlow(record)">设计</a-button>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="createFlowModalVisible" title="创建流程" :confirm-loading="createFlowLoading" @ok="confirmCreateFlow" @cancel="createFlowModalVisible = false">
      <div class="create-flow-form">
        <div class="create-flow-form__row">
          <span class="create-flow-form__label">独立应用编号:</span>
          <div class="create-flow-form__code-input-wrap">
            <a-input v-model:value="createForm.appCode" placeholder="请点击申请编号" disabled />
          </div>
          <a-button class="create-flow-form__apply-btn" type="primary" @click="applyAppCode"><EpcIcon type="icon-tianjia1" style="font-size: 12px" />申请编号</a-button>
        </div>
        <div class="create-flow-form__row">
          <span class="create-flow-form__label">独立应用名称:</span>
          <a-input v-model:value="createForm.appName" placeholder="请输入独立应用名称" />
        </div>
        <div class="create-flow-form__row">
          <span class="create-flow-form__label">密级:</span>
          <a-select v-model:value="createForm.confidentialLevel" placeholder="请选择密级" allow-clear>
            <a-select-option v-for="item in userStore.getConfidentialLevel" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
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
</style>
