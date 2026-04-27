<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { WeiI18n } from '@/utils/WeiI18n';
import localeA from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';
import ProjectBasicInfoTab from './ProjectBasicInfoTab.vue';
import ProjectTeamTab from './ProjectTeamTab.vue';
import ProjectTaskWbsPanel from './ProjectTaskWbsPanel.vue';

const PROJECT_EDITOR_DRAFT_KEY = 'project-info-editor-draft';
const PROJECT_LIST_REFRESH_FLAG = 'project-info-list-refresh';
const PROJECT_LIST_SKIP_DRAWER_ON_RETURN = 'project-info-list-skip-drawer-on-return';

type BasicInfoExpose = {
  validateForm: () => Promise<void>;
  getMaterialFileIds: () => string[];
  setMaterialFileListFromProject: (rawFileList: any[]) => void;
  resetMaterialFiles: () => void;
};

type ProjectTeamExpose = {
  loadProjectTeam: () => Promise<void>;
};

const route = useRoute();
const router = useRouter();

const projectFormTab = ref('1');
const projectFormSubmitting = ref(false);
const basicInfoRef = ref<BasicInfoExpose>();
const projectTeamRef = ref<ProjectTeamExpose>();

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

const projectId = ref<any>();

function disabledPlanStartDate(current: Dayjs) {
  if (!current) return false;
  return current.isBefore(dayjs(), 'day');
}

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
  basicInfoRef.value?.resetMaterialFiles();
}

async function handleTabchange(key: string) {
  if (key !== '2' || !projectId.value) return;
  await nextTick();
  await projectTeamRef.value?.loadProjectTeam();
}

async function submitProjectForm() {
  try {
    await basicInfoRef.value?.validateForm();
  } catch {
    return;
  }
  projectFormSubmitting.value = true;
  try {
    const data: any = {
      projectName: projectForm.projectName,
      projectNum: projectForm.projectNum,
      planStartTime: projectForm.planStartTime,
      planEndTime: projectForm.planEndTime,
      remarks: projectForm.remarks,
      productTempId: projectForm.productTempId,
      productPlatform: projectForm.productPlatform,
      confidentialLevel: projectForm.confidentialLevel,
      productPlatformId: projectForm.productPlatformId,
      fileIds: basicInfoRef.value?.getMaterialFileIds() ?? [],
    };
    if (projectId.value) {
      data.id = projectId.value;
      data.actualStartTime = projectForm.actualStartTime;
      data.actualEndTime = projectForm.actualEndTime;
      data.projectStatus = projectForm.projectstatus || 1;
      await AdminApiProjectTemp.updateProject(data);
    } else {
      data.projectStatus = 1;
      const res = await AdminApiProjectTemp.createProject(data);
      projectId.value = res.data.data;
    }
    message.success(WeiI18n.$t('保存成功'));
  } finally {
    projectFormSubmitting.value = false;
  }
}

function goBack() {
  sessionStorage.setItem(PROJECT_LIST_REFRESH_FLAG, '1');
  sessionStorage.setItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN, '1');
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

onMounted(async () => {
  resetProjectForm();
  const id = route.query.id;
  projectForm.productPlatform = route.query.categoryName as string;
  projectForm.productPlatformId = route.query.categoryId as string;
  if (!id) return;
  projectId.value = id;
  const raw = sessionStorage.getItem(PROJECT_EDITOR_DRAFT_KEY);
  if (!raw) return;
  try {
    await getProjectInfo();
  } catch {
    /* ignore */
  }
  sessionStorage.removeItem(PROJECT_EDITOR_DRAFT_KEY);
});

async function getProjectInfo() {
  const res = await AdminApiProjectTemp.getProjectInfoEditFile({ id: projectId.value });
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

  const rawFileList = projectDto?.fileList ?? projectDto?.materialFileList;
  if (Array.isArray(rawFileList)) {
    await nextTick();
    basicInfoRef.value?.setMaterialFileListFromProject(rawFileList);
  }
}
</script>

<template>
  <div class="project-info-editor-page">
    <a-card :bordered="false" class="editor-main-card">
      <a-tabs v-model:activeKey="projectFormTab" @change="handleTabchange" class="project-editor-tabs">
        <a-tab-pane key="1" :tab="$t('基本信息')">
          <ProjectBasicInfoTab
            ref="basicInfoRef"
            :project-form="projectForm"
            :project-form-label-col="projectFormLabelCol"
            :project-form-wrapper-col="projectFormWrapperCol"
            :confidential-options="confidentialOptions"
            :locale-a="localeA"
            :disabled-plan-start-date="disabledPlanStartDate"
            :disabled-plan-end-date="disabledPlanEndDate" />
        </a-tab-pane>
        <a-tab-pane v-if="projectId" key="2" :tab="$t('项目团队')">
          <ProjectTeamTab ref="projectTeamRef" :project-id="projectId" />
        </a-tab-pane>
        <a-tab-pane v-if="projectId" key="3" :tab="$t('任务管理')" class="project-editor-tabs-pane--wbs">
          <div class="project-editor-tab-wbs">
            <ProjectTaskWbsPanel v-if="projectFormTab === '3'" :project-id="projectId" />
          </div>
        </a-tab-pane>
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

/* 任务管理：表格+甘特占满 Tab 可分配高度，无 max-height/100vh 掐断 */
.project-editor-tabs :deep(.ant-tabs-tabpane.project-editor-tabs-pane--wbs) {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: 0;
}

.project-editor-tab-wbs {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
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
  margin-top: 10px;
  padding: 12px 16px 0;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  border-radius: 2px;
}
</style>
