<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { useUserStore } from '@/store/modules/user';
const route = useRoute();
const router = useRouter();
const detailData = ref<Record<string, any>>({});
const userStore = useUserStore();
const creatingFlow = ref(false);
const processCreated = ref(false);
const appCodeSource = ref<'none' | 'apply' | 'browse'>('none');
const browseModalVisible = ref(false);
const browseLoading = ref(false);
const browseTableData = ref<any[]>([]);
const browseSelectedRowKeys = ref<Array<string | number>>([]);
const browseSelectedRow = ref<Record<string, any> | null>(null);
const browseSearchCode = ref('');
const browseSearchName = ref('');
const browseColumns = [
  { title: '编号', dataIndex: 'appCode', key: 'appCode' },
  { title: '名称', dataIndex: 'appName', key: 'appName' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '创建人', dataIndex: 'creatorName', key: 'creatorName' },
  { title: '状态', dataIndex: 'status', key: 'status' },
];
const bpmnElementId = ref<any>();

function parseConfidentialLevel(level: unknown): number {
  const n = Number(level);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const v of values) {
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
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

const projectNo = ref('');
const projectName = computed(() => String(detailData.value?.processName ?? detailData.value?.categoryName ?? ''));
const confidentialLevel = ref<number>(0);
const appName = ref('');
const appCodeFromDetail = computed(() =>
  firstNonEmptyString(detailData.value?.appCode, detailData.value?.standaloneAppCode, detailData.value?.independentAppCode, detailData.value?.projectNo),
);
const createFlowDisabled = computed(() => {
  const appNameFilled = String(appName.value ?? '').trim() !== '';
  return appCodeSource.value !== 'apply' || !projectNo.value || !appNameFilled || processCreated.value || creatingFlow.value;
});
const nextStepDisabled = computed(() => {
  if (appCodeSource.value === 'browse') return false;
  if (appCodeSource.value === 'apply') return !processCreated.value;
  return true;
});

//申请编号
async function getAppCode() {
  const res = await AdminApiSystemProcessTask.nextAppCode({});
  projectNo.value = String(res?.data?.data ?? '');
  if (projectNo.value) {
    appCodeSource.value = 'apply';
    processCreated.value = false;
  }
}

async function createFlow() {
  if (createFlowDisabled.value) return;
  if (!String(appName.value ?? '').trim()) {
    message.warning('请先填写独立应用名称');
    return;
  }
  creatingFlow.value = true;
  try {
    const payload = {
      appCode: projectNo.value,
      appName: appName.value,
      confidentialLevel: confidentialLevel.value,
      taskId: detailData.value?.id ?? '',
    };
    const res = await AdminApiSystemProcessTask.createApp(payload);
    bpmnElementId.value = res?.data?.data?.appId ?? '';
    processCreated.value = true;
    message.success('创建流程成功');
  } catch (e) {
    message.error('创建流程失败');
  } finally {
    creatingFlow.value = false;
  }
}

async function nextFlow() {
  const data = {
    appId: bpmnElementId.value ?? '',
    appCode: projectNo.value,
  };
  try {
    const res = await AdminApiSystemProcessTask.projectPages(data);
    const payload = res?.data?.data;
    if (!payload || typeof payload !== 'object') {
      message.error('流程页面数据为空');
      return;
    }
    const cacheKey = `designTaskAppWorkspace:${String(payload?.appId ?? Date.now())}:${Date.now()}`;
    sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    const taskId = String(detailData.value?.id ?? '').trim();
    const appId = String(bpmnElementId.value ?? payload?.appId ?? '').trim();
    router.push({
      path: '/internal/design-task-app-workspace',
      query: { cacheKey, taskId, appId },
    });
  } catch (e) {
    message.error('获取流程页面失败');
  }
}

async function loadBrowseList() {
  const payload = {
    appCode: browseSearchCode.value,
    appName: browseSearchName.value,
    taskId: detailData.value?.id ?? '',
  };
  browseLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.appList(payload);
    const list = res?.data?.data;
    browseTableData.value = Array.isArray(list) ? list : [];
    browseSelectedRow.value = null;
    browseSelectedRowKeys.value = [];
    browseModalVisible.value = true;
  } catch (e) {
    message.error('独立应用列表加载失败');
  } finally {
    browseLoading.value = false;
  }
}

async function handleBrowseApp() {
  browseModalVisible.value = true;
  await loadBrowseList();
}

function handleBrowseSearch() {
  void loadBrowseList();
}

function onBrowseRowSelectChange(selectedRowKeys: Array<string | number>, selectedRows: Record<string, any>[]) {
  browseSelectedRowKeys.value = selectedRowKeys;
  browseSelectedRow.value = selectedRows?.[0] ?? null;
}

function onBrowseTableRow(record: Record<string, any>) {
  return {
    onClick: () => {
      const key = record?.appId;
      if (key == null) return;
      browseSelectedRowKeys.value = [key];
      browseSelectedRow.value = record;
    },
  };
}

function handleBrowseModalOk() {
  const row = browseSelectedRow.value;
  if (!row) {
    message.warning('请选择一条独立应用数据');
    return;
  }
  projectNo.value = String(row.appCode ?? '');
  appName.value = String(row.appName ?? '');
  bpmnElementId.value = String(row.appId ?? '');
  appCodeSource.value = 'browse';
  processCreated.value = true;
  browseModalVisible.value = false;
}

function handleBrowseModalCancel() {
  browseModalVisible.value = false;
}
function goBack() {
  router.back();
}

loadDetailData();
projectNo.value = appCodeFromDetail.value;
appName.value = firstNonEmptyString(detailData.value?.appName, detailData.value?.standaloneAppName, detailData.value?.projectName);
confidentialLevel.value = parseConfidentialLevel(detailData.value?.confidentialLevel);
if (projectNo.value) {
  appCodeSource.value = 'browse';
  processCreated.value = true;
}
</script>

<template>
  <div class="detail-page">
    <div class="detail-page__content">
      <div class="detail-page__name">{{ projectName || '未命名流程' }}</div>

      <div class="detail-page__form">
        <div class="detail-page__row">
          <span class="detail-page__label">独立应用编号:</span>
          <a-input class="detail-page__input" :value="projectNo" disabled />
          <a-button type="primary" @click="handleBrowseApp"><EpcIcon type="icon-liulan" style="font-size: 12px" />浏览</a-button>
          <a-button type="primary" @click="getAppCode"><EpcIcon type="icon-tianjia1" style="font-size: 12px" />申请编号</a-button>
        </div>
        <div class="detail-page__row">
          <span class="detail-page__label">独立应用名称:</span>
          <a-input class="detail-page__input" v-model:value="appName" />
        </div>
        <div class="detail-page__row">
          <span class="detail-page__label">密级:</span>
          <a-select class="detail-page__input" v-model:value="confidentialLevel" placeholder="请选择密级" allow-clear>
            <a-select-option v-for="item in userStore.getConfidentialLevel" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <div class="detail-page__actions">
        <a-button :disabled="createFlowDisabled" type="primary" :loading="creatingFlow" @click="createFlow"
          ><EpcIcon type="icon-wenjiandaoru" style="font-size: 12px" />创建流程</a-button
        >
        <a-button type="primary" :disabled="nextStepDisabled" @click="nextFlow"><EpcIcon type="icon-paixujiantou" style="font-size: 12px" />下一步</a-button>
        <a-button type="primary" @click="goBack"><EpcIcon type="icon-fanhui" style="font-size: 12px" />返回</a-button>
      </div>
    </div>
    <a-modal v-model:visible="browseModalVisible" title="浏览独立应用" width="900px" @ok="handleBrowseModalOk" @cancel="handleBrowseModalCancel">
      <div class="browse-toolbar">
        <a-input v-model:value="browseSearchCode" placeholder="请输入编号" allow-clear class="browse-toolbar__input" />
        <a-input v-model:value="browseSearchName" placeholder="请输入名称" allow-clear class="browse-toolbar__input" />
        <a-button type="primary" @click="handleBrowseSearch">查询</a-button>
      </div>
      <a-table
        :columns="browseColumns"
        :data-source="browseTableData"
        :loading="browseLoading"
        :pagination="false"
        row-key="appId"
        :custom-row="onBrowseTableRow"
        :row-selection="{
          type: 'radio',
          selectedRowKeys: browseSelectedRowKeys,
          onChange: onBrowseRowSelectChange,
        }" />
      <template #footer>
        <a-button type="primary" @click="handleBrowseModalOk">确定</a-button>
        <a-button @click="handleBrowseModalCancel">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.detail-page {
  min-height: calc(100vh - 140px);
  padding: 24px;
  background: #fff;
  box-sizing: border-box;
}

.detail-page__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-page__image {
  width: 360px;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
}

.detail-page__name {
  margin: 14px 0 18px;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.detail-page__form {
  width: 630px;
}

.detail-page__row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.detail-page__label {
  width: 90px;
  text-align: right;
  color: #1f2937;
}

.detail-page__input {
  width: 320px;
}

.detail-page__actions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.browse-toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.browse-toolbar__input {
  width: 170px;
}
</style>
