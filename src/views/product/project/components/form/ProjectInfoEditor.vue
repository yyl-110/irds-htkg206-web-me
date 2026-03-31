<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, TableColumnType, UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { InboxOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import localeA from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import MemberAuthPicker from '@/components/MemberAuthPicker/index.vue';
const PROJECT_EDITOR_DRAFT_KEY = 'project-info-editor-draft';
/** 与列表页约定：返回/保存后回到列表时触发刷新 */
const PROJECT_LIST_REFRESH_FLAG = 'project-info-list-refresh';

type ProductTemplateRow = {
  id?: string;
  tempName?: string;
  tempNum?: string;
  remarks?: string;
};
type ProjectTeamRow = {
  id?: string | number;
  roleName?: string;
  authorityRemarks?: string;
  orderNumber?: number;
  userIds?: string[] | string;
  userNames?: string;
  userName?: string;
  principalName?: string;
  responsibleName?: string;
  memberNames?: string;
};
type MemberAuthUser = {
  id: string;
  name: string;
  username: string;
  deptId?: string;
};
type MemberAuthDept = {
  id: string;
  name: string;
};

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const projectFormTab = ref('1');
const projectFormRef = ref<FormInstance>();
const materialFileList = ref<UploadFile[]>([]);
/** 用于识别「单次操作一次新增多个文件」（如一次拖拽多文件），仅保留该次第一个 */
const materialFileListPrevLen = ref(0);
const projectFormSubmitting = ref(false);

/** small 表格约 10 行 body 高度，超出出现纵向滚动条 */
const PRODUCT_TEMPLATE_TABLE_SCROLL_Y = 390;

const productTemplateModalVisible = ref(false);
const productTemplateLoading = ref(false);
const productTemplateList = ref<ProductTemplateRow[]>([]);
const selectedProductTemplateKeys = ref<string[]>([]);
const selectedProductTemplateRow = ref<ProductTemplateRow | null>(null);
const projectTeamLoading = ref(false);
const projectTeamRows = ref<ProjectTeamRow[]>([]);
const memberAuthVisible = ref(false);
const currentTeamRoleRow = ref<ProjectTeamRow | null>(null);
const memberAuthUsers = ref<MemberAuthUser[]>([]);
const memberAuthDepts = ref<MemberAuthDept[]>([]);
const memberAuthUserIds = ref<string[]>([]);
const projectTeamColumns: TableColumnType<ProjectTeamRow>[] = [
  { title: WeiI18n.$t('序号'), key: 'index', align: 'center', width: 90 },
  { title: WeiI18n.$t('角色名称'), dataIndex: 'roleName', key: 'roleName', align: 'left', width: 220 },
  { title: WeiI18n.$t('责任人'), dataIndex: 'responsibleUserNames', key: 'responsibleUserNames', align: 'left', width: 260 },
  { title: WeiI18n.$t('权限'), dataIndex: 'authorityRemarks', key: 'authorityRemarks', align: 'left' },
  { title: WeiI18n.$t('操作'), key: 'operation', align: 'center', width: 140, fixed: 'right' },
];

const productTemplateColumns: TableColumnType<ProductTemplateRow>[] = [
  {
    title: WeiI18n.$t('序号'),
    key: 'index',
    align: 'center',
    width: 72,
    customRender: ({ index }) => String((index ?? 0) + 1),
  },
  {
    title: WeiI18n.$t('模板名称'),
    dataIndex: 'tempName',
    key: 'tempName',
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('模板编号'),
    dataIndex: 'tempNum',
    key: 'tempNum',
    width: 160,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remarks',
    key: 'remarks',
    ellipsis: true,
  },
];

const productTemplateRowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: selectedProductTemplateKeys.value,
  onChange: (keys: (string | number)[], rows: ProductTemplateRow[]) => {
    selectedProductTemplateKeys.value = keys.map(String);
    selectedProductTemplateRow.value = rows[0] ?? null;
  },
}));

function productTemplateCustomRow(record: ProductTemplateRow) {
  return {
    onClick: () => {
      const id = record.id;
      if (id == null || id === '') return;
      selectedProductTemplateKeys.value = [String(id)];
      selectedProductTemplateRow.value = record;
    },
  };
}

const projectForm = reactive({
  projectNum: '',
  productPlatform: '',
  productPlatformId: '',
  projectName: '',
  planStartTime: undefined as string | undefined,
  planEndTime: undefined as string | undefined,
  confidentialLevel: 1,
  remarks: '',
  dataConfidentialLevel: '公开',
  productTempName: '',
  productTempId: '',
  actualEndTime: '',
  actualStartTime: '',
  projectstatus: '',
});

const confidentialOptions = [
  { label: '公开', value: 1 },
  { label: '内部', value: 2 },
  { label: '秘密', value: 3 },
  { label: '机密', value: 4 },
];

const projectFormLabelCol = { style: { width: '120px' } };
const projectFormWrapperCol = { span: 18 };

/** 计划开始：不可选今天之前的日期 */
function disabledPlanStartDate(current: Dayjs) {
  if (!current) return false;
  return current.isBefore(dayjs(), 'day');
}

/** 计划结束：不可选今天之前，且不可早于计划开始日 */
function disabledPlanEndDate(current: Dayjs) {
  if (!current) return false;
  if (current.isBefore(dayjs(), 'day')) return true;
  const start = projectForm.planStartTime;
  if (start) {
    return current.isBefore(dayjs(start), 'day');
  }
  return false;
}

watch(
  () => projectForm.planStartTime,
  start => {
    const end = projectForm.planEndTime;
    if (start && end && dayjs(end).isBefore(dayjs(start), 'day')) {
      projectForm.planEndTime = undefined;
    }
  },
);

function resetProjectForm() {
  projectFormTab.value = '1';
  projectForm.projectNum = '';
  projectForm.productPlatform = '';
  projectForm.projectName = '';
  projectForm.planStartTime = undefined;
  projectForm.planEndTime = undefined;
  projectForm.confidentialLevel = 1;
  projectForm.remarks = '';
  projectForm.dataConfidentialLevel = '公开';
  materialFileList.value = [];
  materialFileListPrevLen.value = 0;
}

async function handleTabchange(key: string) {
  if (key !== '2' || !projectId.value) return;
  projectTeamLoading.value = true;
  try {
    const data: any = {
      projectId: projectId.value,
    };
    const res = await AdminApiProjectTemp.projectTeamList(data);
    const list = res?.data?.data;
    projectTeamRows.value = Array.isArray(list) ? list : [];
  } finally {
    projectTeamLoading.value = false;
  }
}

function getProjectTeamResponsibleUsers(record: ProjectTeamRow): string {
  return record.userName ?? '-';
}

const tempId = ref<any>();
async function openMemberAuth(record: ProjectTeamRow) {
  tempId.value = record.id;
  currentTeamRoleRow.value = record;
  const data: any = {};
  const res = await AdminApiSystemDept.getDeptInfo(data);
  if (res.data.code == 200) {
    memberAuthDepts.value = res.data.data.adminDeptResponseDTO || [];
    memberAuthUsers.value = res.data.data.adminUserResponseDTO || [];
  }
  memberAuthUserIds.value = getProjectTeamAuthorizedUserIds(record);
  memberAuthVisible.value = true;
}

function getProjectTeamAuthorizedUserIds(record: ProjectTeamRow): string[] {
  const raw = record.userIds;
  if (Array.isArray(raw)) return raw.map(id => String(id));
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
  }
  return [];
}

async function handleMemberAuthConfirm(userIds: string[]) {
  const res = await AdminApiProjectTemp.createProjectTeamUserAuth({
    projectId: projectId.value,
    userIds: userIds,
    teamId: tempId.value,
  });
  message.success(WeiI18n.$t('授权成功!'));
  memberAuthVisible.value = false;
  handleTabchange('2');
}

function goBack() {
  sessionStorage.setItem(PROJECT_LIST_REFRESH_FLAG, '1');
  const raw = route.query.from;
  if (typeof raw === 'string' && raw.length) {
    try {
      router.push(decodeURIComponent(raw));
      return;
    } catch {
      /* fallthrough */
    }
  }
  router.back();
}

/** 返回 true 才会走 customRequest 调上传接口 */
const beforeMaterialUpload: UploadProps['beforeUpload'] = () => true;

const materialCustomRequest: UploadProps['customRequest'] = async options => {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
      securityLevel: projectForm.confidentialLevel,
    });
    if (res.data.code === 0) {
      options.onSuccess?.(res.data, options.file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      options.onError?.(new Error(res.data.msg || 'upload failed'));
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    options.onError?.(err as Error);
    message.error(WeiI18n.t('上传失败').value);
  }
};

/** 从上传接口返回的 response 中解析服务端文件 id（与接口返回的 response.id 一致，并兼容 data 内字段） */
function materialFileIdFromResponse(file: UploadFile): string | undefined {
  const r = file.response as Record<string, unknown> | undefined;
  if (!r) return undefined;
  const nested = r.data as Record<string, unknown> | undefined;
  const raw = r.id ?? nested?.id ?? nested?.queryId ?? r.queryId;
  if (raw == null || raw === '') return undefined;
  return String(raw);
}

/** 收集已上传成功文件 id，用于创建项目等接口传参 */
function getMaterialFileIds(): string[] {
  return materialFileList.value
    .filter(f => f.status === 'done')
    .map(f => materialFileIdFromResponse(f))
    .filter((id): id is string => id != null && id !== '');
}

/** 上传完成后把服务端 id 挂到列表项上，便于保存时使用 */
function enrichMaterialUploadFiles(files: UploadFile[]): UploadFile[] {
  return files.map(f => {
    const fileId = materialFileIdFromResponse(f);
    if (f.status === 'done' && fileId != null) {
      return { ...f, id: fileId } as UploadFile;
    }
    return f;
  });
}

/** 每次点击/选择只加一个；列表可累积多个。若一次拖拽带入多个文件，只采纳本次第一个 */
function onMaterialFileChange(info: UploadChangeParam) {
  const list = info.fileList;
  const prev = materialFileListPrevLen.value;
  let next: UploadFile[];
  if (list.length - prev > 1) {
    next = [...list.slice(0, prev), list[prev]!];
  } else {
    next = list;
  }
  materialFileList.value = enrichMaterialUploadFiles(next);
  materialFileListPrevLen.value = materialFileList.value.length;
}

async function submitProjectForm() {
  try {
    await projectFormRef.value?.validate();
  } catch {
    return;
  }
  projectFormSubmitting.value = true;
  try {
    const data: any = {};
    data.projectName = projectForm.projectName;
    data.projectNum = projectForm.projectNum;
    data.planStartTime = projectForm.planStartTime;
    data.planEndTime = projectForm.planEndTime;
    data.remarks = projectForm.remarks;
    data.productTempId = projectForm.productTempId;
    data.productPlatform = projectForm.productPlatform;
    data.confidentialLevel = projectForm.confidentialLevel;
    data.productPlatformId = projectForm.productPlatformId;
    data.fileIds = getMaterialFileIds();
    if (projectId.value) {
      data.id = projectId.value;
      data.actualStartTime = projectForm.actualStartTime;
      data.actualEndTime = projectForm.actualEndTime;
      data.projectStatus = projectForm.projectstatus || 1;
      const res = await AdminApiProjectTemp.updateProject(data);
    } else {
      data.projectStatus = 1;
      const res = await AdminApiProjectTemp.createProject(data);
      projectId.value = res.data.data;
    }
    // TODO: 对接项目创建/更新接口
    message.success(WeiI18n.$t('保存成功'));
    // goBack();
  } finally {
    projectFormSubmitting.value = false;
  }
}

function resetProductTemplateModalSelection() {
  selectedProductTemplateKeys.value = [];
  selectedProductTemplateRow.value = null;
}

async function selectProductTemplate() {
  resetProductTemplateModalSelection();
  productTemplateModalVisible.value = true;
  productTemplateLoading.value = true;
  try {
    const data: any = {};
    const res = await AdminApiProductTemp.getProductTempList(data);
    const list = res?.data?.data;
    productTemplateList.value = Array.isArray(list) ? list : [];
  } finally {
    productTemplateLoading.value = false;
  }
}

function closeProductTemplateModal() {
  productTemplateModalVisible.value = false;
}

function onProductTemplateModalAfterClose() {
  resetProductTemplateModalSelection();
}

function confirmProductTemplateSelection(): boolean {
  const row = selectedProductTemplateRow.value;
  if (!row?.id) {
    message.warning(WeiI18n.$t('请选择产品模板'));
    return false;
  }
  projectForm.productTempId = String(row.id);
  projectForm.productTempName = row.tempName ?? '';
  return true;
}

/** 自定义 footer 时不会走 Modal 的 @ok，需在确定逻辑成功后手动关闭 */
function handleProductTemplateModalOk() {
  if (confirmProductTemplateSelection()) {
    closeProductTemplateModal();
  }
}
const projectId = ref<any>();
onMounted(() => {
  resetProjectForm();
  const id = route.query.id;
  projectForm.productPlatform = route.query.categoryName;
  projectForm.productPlatformId = route.query.categoryId;
  if (id) {
    projectId.value = id;
    const raw = sessionStorage.getItem(PROJECT_EDITOR_DRAFT_KEY);
    if (raw) {
      try {
        getProjectInfo();
      } catch {
        /* ignore */
      }
      sessionStorage.removeItem(PROJECT_EDITOR_DRAFT_KEY);
    }
  }
});
async function getProjectInfo() {
  const data: any = {};
  data.id = projectId.value;
  const res = await AdminApiProjectTemp.getProjectInfoEditFile(data);
  const projectDto = res.data.data;
  projectForm.projectNum = projectDto.projectNum;
  projectForm.productPlatform = projectDto.productPlatform;
  projectForm.productPlatformId = projectDto.productPlatformId;
  projectForm.projectName = projectDto.projectName;
  projectForm.planStartTime = projectDto.planStartTime;
  projectForm.planEndTime = projectDto.planEndTime;
  projectForm.confidentialLevel = projectDto.confidentialLevel;
  projectForm.remarks = projectDto.remarks;
  projectForm.productTempName = projectDto.productTempName;
  projectForm.productTempId = projectDto.productTempId;
  projectForm.actualEndTime = projectDto.actualEndTime;
  projectForm.actualStartTime = projectDto.actualStartTime;
  projectForm.projectstatus = projectDto.projectstatus;

  // 回显「项目资料」文件列表
  // 接口返回约定：项目资料字段为 fileList（如图所示），元素包含 fileId/filename/filePath 等信息
  const rawFileList = projectDto?.fileList ?? projectDto?.materialFileList;
  if (Array.isArray(rawFileList)) {
    const mapped = rawFileList
      .map((f: any, index: number): UploadFile | null => {
        const fileId = f?.fileId ?? f?.id ?? f?.queryId;
        if (fileId == null || fileId === '') return null;

        const filename = f?.oldFileName ?? f?.fileName ?? f?.fileRealName ?? f?.fileTitle ?? `文件${index + 1}`;
        const fileUrl = f?.filePath ?? f?.url;

        return {
          uid: String(fileId),
          name: String(filename),
          status: 'done',
          url: fileUrl,
          // 用于保存时提取 fileIds：materialFileIdFromResponse 会优先读取 response.id/data.id
          response: {
            id: String(fileId),
            data: { id: String(fileId) },
          },
        } as UploadFile;
      })
      .filter((x): x is UploadFile => x != null);

    materialFileList.value = mapped;
    materialFileListPrevLen.value = mapped.length;
  }
}
</script>

<template>
  <div class="project-info-editor-page">
    <a-card :bordered="false" class="editor-main-card">
      <a-tabs v-model:activeKey="projectFormTab" @change="handleTabchange" class="project-editor-tabs">
        <a-tab-pane key="1" :tab="$t('基本信息')">
          <a-form
            ref="projectFormRef"
            :model="projectForm"
            layout="horizontal"
            :colon="false"
            :label-col="projectFormLabelCol"
            :wrapper-col="projectFormWrapperCol"
            label-align="right"
            class="project-editor-form project-editor-form--uniform">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :label="$t('项目编号：')" name="projectNum" :rules="[{ required: true, message: $t('请输入项目编号') }]">
                  <a-input v-model:value="projectForm.projectNum" :placeholder="$t('请输入项目编号')" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('平台：')">
                  <a-input v-model:value="projectForm.productPlatform" :placeholder="$t('请输入')" disabled />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :label="$t('项目名称：')" name="projectName" :rules="[{ required: true, message: $t('请输入项目名称') }]">
                  <a-input v-model:value="projectForm.projectName" :placeholder="$t('请输入项目名称')" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('产品模板：')">
                  <div class="project-num-with-browse">
                    <a-input v-model:value="projectForm.productTempName" :placeholder="$t('请选择')" disabled />
                    <a-button type="primary" @click="selectProductTemplate">{{ $t('浏览') }}</a-button>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :label="$t('计划开始时间：')">
                  <a-date-picker
                    :locale="localeA"
                    v-model:value="projectForm.planStartTime"
                    class="project-form-date"
                    style="width: 100%"
                    placeholder="计划开始时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disabledPlanStartDate" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('计划结束时间：')">
                  <a-date-picker
                    :locale="localeA"
                    v-model:value="projectForm.planEndTime"
                    class="project-form-date"
                    style="width: 100%"
                    placeholder="计划结束时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disabledPlanEndDate" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :label="$t('密级：')">
                  <a-select v-model:value="projectForm.confidentialLevel" :options="confidentialOptions"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12" />
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :label="$t('备注：')">
                  <a-textarea v-model:value="projectForm.remarks" :placeholder="$t('请输入备注')" :rows="4" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="4" />
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :label="$t('资料密级：')">
                  <a-select v-model:value="projectForm.dataConfidentialLevel" :options="confidentialOptions" />
                </a-form-item>
              </a-col>
              <a-col :span="12" />
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :label="$t('项目资料：')">
                  <a-upload-dragger
                    v-model:file-list="materialFileList"
                    name="file"
                    :multiple="false"
                    :before-upload="beforeMaterialUpload"
                    :custom-request="materialCustomRequest"
                    @change="onMaterialFileChange">
                    <p class="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p class="ant-upload-text">{{ $t('点击或将文件拖拽到这里上传') }}</p>
                    <p class="ant-upload-hint">{{ $t('支持扩展名：.rar .zip .doc .docx .pdf .jpg...') }}</p>
                  </a-upload-dragger>
                </a-form-item>
              </a-col>
              <a-col :span="4" />
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane v-if="projectId" key="2" :tab="$t('项目团队')">
          <a-table
            class="project-team-table"
            :columns="projectTeamColumns"
            :data-source="projectTeamRows"
            :loading="projectTeamLoading"
            :pagination="false"
            :scroll="{ x: 1000 }"
            :row-key="(record: ProjectTeamRow, index: number) => record.id ?? `${record.roleName ?? 'role'}-${index}`">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                {{ Number(index) + 1 }}
              </template>
              <template v-else-if="column.key === 'responsibleUserNames'">
                {{ getProjectTeamResponsibleUsers(record) }}
              </template>
              <template v-else-if="column.key === 'operation'">
                <a-button type="primary" size="small" @click="openMemberAuth(record)">{{ $t('分配人员') }}</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <div class="project-editor-page-footer">
      <a-button type="primary" :loading="projectFormSubmitting" @click="submitProjectForm">{{ $t('保存') }}</a-button>
      <a-button @click="goBack">{{ $t('返回') }}</a-button>
    </div>

    <a-modal
      v-model:visible="productTemplateModalVisible"
      wrap-class-name="product-template-select-modal"
      :title="$t('选择产品模板')"
      width="960px"
      destroy-on-close
      @cancel="closeProductTemplateModal"
      @after-close="onProductTemplateModalAfterClose">
      <a-table
        :columns="productTemplateColumns"
        :data-source="productTemplateList"
        :loading="productTemplateLoading"
        :pagination="false"
        :scroll="{ y: PRODUCT_TEMPLATE_TABLE_SCROLL_Y }"
        :row-selection="productTemplateRowSelection"
        :custom-row="productTemplateCustomRow"
        row-key="id"
        size="small" />
      <template #footer>
        <a-space>
          <a-button type="primary" @click="handleProductTemplateModalOk">{{ $t('确定') }}</a-button>
          <a-button @click="closeProductTemplateModal">{{ $t('取消') }}</a-button>
        </a-space>
      </template>
    </a-modal>

    <MemberAuthPicker
      v-model:visible="memberAuthVisible"
      :title="$t('成员授权')"
      :users="memberAuthUsers"
      :depts="memberAuthDepts"
      :authorized-user-ids="memberAuthUserIds"
      @confirm="handleMemberAuthConfirm" />
  </div>
</template>

<style lang="less" scoped>
.project-info-editor-page {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  background: #fff;
}

.editor-main-card {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.ant-card-body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    /* 缩小 Tab 上方空白（相对 ant 默认 24px） */
    padding-top: 8px;
  }
}

.project-editor-section-title {
  margin: -8px 0 12px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}

.project-editor-tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.project-editor-tabs :deep(.ant-tabs-nav) {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.project-editor-tabs :deep(.ant-tabs-content-holder) {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

.project-editor-tabs :deep(.ant-tabs-content) {
  height: 100%;
  min-height: 0;
}

.project-editor-tabs :deep(.ant-tabs-tabpane) {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.project-editor-form {
  padding-top: 4px;
}

.project-num-with-browse {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.project-num-with-browse :deep(.ant-input) {
  flex: 1;
  min-width: 0;
}

/* 双列等宽，控件在列内拉满，保证左右输入框视觉长度一致 */
.project-editor-form--uniform :deep(.ant-col-12) {
  flex: 0 0 50% !important;
  max-width: 50% !important;
}

.project-editor-form--uniform :deep(.ant-col-12 > .ant-form-item) {
  width: 100%;
}

.project-editor-form--uniform :deep(.ant-form-item-control) {
  flex: 1;
  min-width: 0;
}

.project-editor-form--uniform :deep(.ant-form-item-control-input-content) {
  width: 100% !important;
  max-width: 100%;
  box-sizing: border-box;
}

.project-editor-form--uniform .project-num-with-browse :deep(.ant-input),
.project-editor-form--uniform .project-num-with-browse :deep(.ant-input-affix-wrapper) {
  width: auto !important;
  flex: 1 1 0;
  min-width: 0;
}

.project-editor-form--uniform :deep(.ant-input),
.project-editor-form--uniform :deep(.ant-input-affix-wrapper),
.project-editor-form--uniform :deep(.ant-select),
.project-editor-form--uniform :deep(.ant-picker),
.project-editor-form--uniform :deep(.project-form-date),
.project-editor-form--uniform :deep(.project-form-range),
.project-editor-form--uniform :deep(.ant-input-textarea textarea) {
  width: 100% !important;
}

.project-editor-form--uniform :deep(.ant-upload.ant-upload-drag) {
  width: 100% !important;
}

.project-editor-tab-placeholder {
  min-height: 200px;
  padding: 48px 0;
}

.project-team-table {
  padding-top: 4px;
}

.project-editor-page-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-top: 8px;
  padding: 12px 16px 0;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  border-radius: 2px;
}
</style>

<style lang="less">
/* 弹窗内容挂载在 body，非 scoped 以便整行可点选时有手型提示 */
.product-template-select-modal .ant-table-tbody > tr {
  cursor: pointer;
}
</style>
