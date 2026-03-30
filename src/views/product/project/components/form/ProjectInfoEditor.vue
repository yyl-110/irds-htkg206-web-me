<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, UploadFile } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { InboxOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import localeA from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { AdminApiProductTemp } from '@/api/tags/project/项目信息后台';
const PROJECT_EDITOR_DRAFT_KEY = 'project-info-editor-draft';
/** 与列表页约定：返回/保存后回到列表时触发刷新 */
const PROJECT_LIST_REFRESH_FLAG = 'project-info-list-refresh';

const route = useRoute();
const router = useRouter();

const projectFormTab = ref('basic');
const projectFormRef = ref<FormInstance>();
const materialFileList = ref<UploadFile[]>([]);
const projectFormSubmitting = ref(false);

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
  projectFormTab.value = 'basic';
  projectForm.projectNum = '';
  projectForm.productPlatform = '';
  projectForm.projectName = '';
  projectForm.planStartTime = undefined;
  projectForm.planEndTime = undefined;
  projectForm.confidentialLevel = 1;
  projectForm.remarks = '';
  projectForm.dataConfidentialLevel = '公开';
  materialFileList.value = [];
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

const beforeMaterialUpload = () => false;

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
    data.projectStatus = 1;
    const res = await AdminApiProductTemp.createProject(data);
    // TODO: 对接项目创建/更新接口
    message.success(WeiI18n.$t('保存成功'));
    // goBack();
  } finally {
    projectFormSubmitting.value = false;
  }
}

onMounted(() => {
  resetProjectForm();
  const id = route.query.id;
  projectForm.productPlatform = route.query.categoryName;
  projectForm.productPlatformId = route.query.categoryId;
  if (id) {
    const raw = sessionStorage.getItem(PROJECT_EDITOR_DRAFT_KEY);
    if (raw) {
      try {
        const record = JSON.parse(raw) as Record<string, unknown>;
        projectForm.projectNum = String(record.projectNum ?? '');
        projectForm.productPlatform = String(record.productPlatform ?? '');
        projectForm.projectName = String(record.projectName ?? '');
        projectForm.confidentialLevel = String(record.confidentialLevel ?? 1);
      } catch {
        /* ignore */
      }
      sessionStorage.removeItem(PROJECT_EDITOR_DRAFT_KEY);
    }
  }
});
</script>

<template>
  <div class="project-info-editor-page">
    <a-card :bordered="false" class="editor-main-card">
      <a-tabs v-model:activeKey="projectFormTab" class="project-editor-tabs">
        <a-tab-pane key="basic" :tab="$t('基本信息')">
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
                  <a-input v-model:value="projectForm.productTempName" :placeholder="$t('请选择')" disabled />
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
                  <a-upload-dragger v-model:file-list="materialFileList" name="file" :multiple="true" :before-upload="beforeMaterialUpload">
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
        <!-- <a-tab-pane key="structure" :tab="$t('结构&团队')">
          <div class="project-editor-tab-placeholder">
            <a-empty :description="$t('暂无内容')" />
          </div>
        </a-tab-pane> -->
      </a-tabs>
    </a-card>

    <div class="project-editor-page-footer">
      <a-button type="primary" :loading="projectFormSubmitting" @click="submitProjectForm">{{ $t('保存') }}</a-button>
      <a-button @click="goBack">{{ $t('返回') }}</a-button>
    </div>
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
