<template>
  <ContentWrap
    :bodyStyle="{
      padding: '10px 20px 0',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }"
    class="process-instance-detail-wrap position-relative"
    v-loading="loadingFlag">
    <div class="processInstance-wrap-main">
      <ProcessInstanceHeader
        :id="id"
        :process-instance="processInstance"
        :audit-icons-map="auditIconsMap"
        :task-definition-key="taskActivityId"
        :task-name="tName" />

      <el-tabs v-model="activeTab" class="process-instance-tabs">
        <!-- 审批详情 -->
        <el-tab-pane :label="'审批详情'" name="form">
          <div class="form-scroll-area">
            <el-scrollbar>
              <el-row>
                <el-col :span="19" class="!flex !flex-col formCol">
                  <div v-loading="processInstanceLoading" class="form-box flex flex-col mb-30px flex-1">
                    <!-- 动态业务类型组件 - 包含审批内容和审签信息 -->
                    <component
                      v-if="currentBusinessComponent"
                      :is="currentBusinessComponent"
                      :process-instance="processInstance"
                      :title-list="titleList"
                      :error-title-list="errorTitleList"
                      :error-insatnce-list="errorInsatnceList"
                      :opinion="opinion"
                      :todo-task="todoTask" />

                    <!-- 节点审批人员组件 -->
                    <ApprovalPersonnel
                      :process-definition-list="processDefinitionList"
                      :approve-user="approveUser"
                      :edit-type="editType"
                      @select-user="handleSelectApprover" />

                    <!-- 处理意见组件 -->
                    <ProcessOpinion
                      v-model="opinion"
                      :disabled="editType === 0"
                      :visible="aTab != 3 && !isAtEstablishmentNode" />

                    <!-- 流程状态选择组件 -->
                    <ProcessStatusSelector
                      :disabled="editType === 0"
                      :show-manual-config="showManualConfigCard"
                      :show-status-selector="showStatusSelectorCard"
                      v-model:is-manual="isManual"
                      v-model:status-values="areaSaleRelease"
                      :todo-task-name="todoTask?.name" />
                  </div>
                </el-col>

                <el-col :span="5">
                  <!-- 审批记录时间线 -->
                  <ProcessInstanceTimeline :activity-nodes="activityNodes" />
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </el-tab-pane>

        <!-- 流程图：lazy 避免隐藏 Tab 下以 0 高度初始化 BPMN -->
        <el-tab-pane :label="'流程图'" name="diagram" lazy>
          <div class="diagram-container">
            <div class="diagram-toolbar">
              <el-button type="danger" plain size="small" @click="refreshProcessDiagram">
                {{ '刷新' }}
              </el-button>
              <el-button type="primary" plain size="small" @click="showProcessVariables">
                {{ '查看流程变量' }}
              </el-button>
            </div>
            <div class="diagram-viewer-body" v-loading="diagramLoading">
              <ProcessInstanceSimpleViewer
                v-show="processDefinition.modelType && processDefinition.modelType === BpmModelType.SIMPLE"
                :loading="diagramLoading"
                :model-view="processModelView" />
              <ProcessInstanceBpmnViewer
                v-show="processDefinition.modelType && processDefinition.modelType === BpmModelType.BPMN"
                :loading="diagramLoading"
                :model-view="processModelView"
                @transferSuccess="refresh" />
            </div>
          </div>
        </el-tab-pane>

        <!-- 流转记录：lazy + 切到该 Tab 再拉任务列表 -->
        <el-tab-pane :label="'流转记录'" name="record" lazy>
          <div class="form-scroll-area">
            <el-scrollbar>
              <ProcessInstanceTaskList
                v-if="activeTab === 'record'"
                :id="id"
                :refresh-key="taskListRefreshKey" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 操作栏按钮 -->
      <div v-if="orderRedType" class="process-instance-footer b--solid border--1px border-[var(--el-border-color)]">
        <ProcessInstanceOperationButtonCopy
          v-if="taskType !== ETASKTYPE.ESTABLISHMENT"
          ref="operationButtonRef"
          :process-instance="processInstance"
          :process-definition="processDefinition"
          :userOptions="userOptions"
          :normal-form="detailForm"
          :normal-form-api="fApi"
          :writable-fields="writableFields"
          :writableFieldsCopy="processVariablesList"
          @success="refresh"
          @handleLoading="handleLoading"
          :editType="editType"
          :opinion="opinion"
          :taskType="taskType"
          :pageIndex="route.query.pageIndex"
          :aTab="aTab"
          :isManual="isManual"
          :areaSaleRelease="areaSaleRelease"
          :firstTimeEditSubmit="firstTimeEditSubmit" />
        <ProcessInstanceSubButton
          v-else
          ref="operationButtonRef"
          :process-instance="processInstance"
          :process-definition="processDefinition"
          :normal-form="detailForm"
          :normal-form-api="fApi"
          :writable-fields="processVariablesList"
          @success="refresh"
          @handleLoading="handleLoading"
          :editType="editType"
          :aTab="aTab"
          :opinion="opinion"
          :taskType="taskType"
          :activity-nodes="activityNodes"
          :areaSaleRelease="areaSaleRelease"
          :pageIndex="route.query.pageIndex"
          :firstTimeEditSubmit="firstTimeEditSubmit" />
      </div>
      <!-- <EpOnlyCompareDrawer
        v-model="showEpCompareDrawer"
        :configNo="configNo"
        :orderID="orderID"
        :orderNo="orderNo"
        :designModelId="designModelId" /> -->
      <!-- 用户选择弹窗 -->
      <MemberAuthPicker
        v-model:visible="memberAuthVisible"
        :title="$t('选择审批人')"
        :users="memberAuthUsers"
        :depts="memberAuthDepts"
        :authorized-user-ids="memberAuthUserIds"
        @confirm="handleMemberAuthConfirm" />

      <!-- 流程变量弹窗 -->
      <el-dialog v-model="processVariablesDialogVisible" title="流程变量" width="60%" :close-on-click-modal="false">
        <div class="process-variables-container">
          <el-input
            v-model="processVariablesContent"
            type="textarea"
            :rows="20"
            readonly
            placeholder="流程变量内容将显示在这里"
            class="process-variables-textarea"
            />
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="processVariablesDialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="copyProcessVariables">复制内容</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BpmModelType, BpmModelFormType } from '@/utils/constants';
import { setConfAndFields2 } from '@/utils/formCreate';
import { registerComponent } from '@/utils/routerHelper';
import type { ApiAttrs } from '@form-create/element-ui/types/config';
import * as ProcessInstanceApi from '@/api/bpm/processInstance';
import { FieldPermissionType } from '@/components/SimpleProcessDesignerV2/src/consts';
import { ETASKTYPE } from '../components/config/constant';
import { BpmBusinessProcessTypeEnum } from '@/components/config/consts';
import { getBusinessTypeComponent } from './businessTypes/index';
import { useMessage } from '@/hooks/web/useMessage';
import { ContentWrap } from '@/components/ContentWrap';
import { TaskStatusEnum } from '@/api/bpm/task';
import MemberAuthPicker from '@/components/MemberAuthPicker/index.vue';
// 导入组件
import ProcessInstanceHeader from './components/ProcessInstanceHeader.vue';
import ProcessInstanceBpmnViewer from './ProcessInstanceBpmnViewer.vue';
import ProcessInstanceSimpleViewer from './ProcessInstanceSimpleViewer.vue';
import ProcessInstanceTaskList from './ProcessInstanceTaskList.vue';
import ProcessInstanceOperationButtonCopy from './ProcessInstanceOperationButtonCopy.vue';
import ProcessInstanceSubButton from '../components/ProcessInstanceSubButton.vue';
import ProcessInstanceTimeline from './ProcessInstanceTimeline.vue';
import ApprovalPersonnel from './components/ApprovalPersonnel.vue';
import ProcessOpinion from './components/ProcessOpinion.vue';
import ProcessStatusSelector from './components/ProcessStatusSelector.vue';
import runningSvg from '@/assets/svgs/bpm/running.svg';
import approveSvg from '@/assets/svgs/bpm/approve.svg';
import rejectSvg from '@/assets/svgs/bpm/reject.svg';
import cancelSvg from '@/assets/svgs/bpm/cancel.svg';
defineOptions({ name: 'BpmProcessInstanceDetail' });
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
const props = defineProps<{
  id: string;
  taskId?: string;
  activityId?: string;
  orderInstance?: object;
}>();
const route = useRoute();
const message = useMessage();
// ==================== 核心状态 ====================
const processInstanceLoading = ref(false);
const diagramLoading = ref(false);
const processInstance = ref<any>({});
const processDefinition = ref<any>({});
const processModelView = ref<any>({});
const operationButtonRef = ref();
const auditIconsMap = {
  [TaskStatusEnum.RUNNING]: runningSvg,
  [TaskStatusEnum.APPROVE]: approveSvg,
  [TaskStatusEnum.REJECT]: rejectSvg,
  [TaskStatusEnum.CANCEL]: cancelSvg,
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
// 表单相关
const fApi = ref<ApiAttrs>();
const detailForm = ref({ rule: [], option: {}, value: {} });
const writableFields: Array<any> = [];
const memberAuthUsers = ref<MemberAuthUser[]>([]);
const memberAuthDepts = ref<MemberAuthDept[]>([]);
// 业务数据
const titleList = ref<any>([]);
const insatnceList = ref<any>([]);
const errorTitleList = ref<any>([]);
const errorInsatnceList = ref<any>([]);
const opinion = ref<any>('');
const isManual = ref<boolean>(false);
const showStatus = ref<boolean>(false);
const areaSaleRelease = ref<any>({
  areaSaleRelease_genStMbomConfirm: null,
  areaSaleRelease_rePushScpStMbomPre: null,
  areaSaleRelease_officiallyReleased: null,
  crmRelease: null,
  rdOwnerToAdmin: false,
  processOwnerToAdmin: false,
  processOwnerToRdOwner: false,
});
const memberAuthUserIds = ref<string[]>([]);
// 其他状态
const todoTask = ref<any>();
const todoTaskStatus = computed(() => {
  return ['标配Mbom确认', '重新推送', '正式发布', '研发审核', '工艺审核'].includes(todoTask.value?.name);
});
const memberAuthVisible = ref(false);
const loadingFlag = ref<boolean>(false);
const activeTab = ref('form');
const taskType = ref('');
const taskActivityId = ref('');
const tName = ref('');
const qId = ref<any>('');
const processDefinitionId = ref<any>('');
const processDefinitionKey = ref<any>('');
const processDefinitionList = ref<any>([]);
const approveUser = ref<any>([]);
const processVariablesList = ref<any[]>([]);
const rowIndex = ref(0);
const processInstanceId = ref<any>('');
const editType = ref<any>(1);
const aTab = ref<any>('');
const firstTimeEditSubmit = ref(true);
const toTaskId = ref<any>('');
const userOptions = ref<[]>([]);
const BusinessFormComponent = ref<any>(null);
const activityNodes = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([]);
const currentBusinessComponent = ref<any>(null);
const diagramLoaded = ref(false);
const taskListRefreshKey = ref(0);

// 流程变量弹窗相关
const processVariablesDialogVisible = ref(false); // 弹窗显示状态
const processVariablesContent = ref(''); // 流程变量内容

// ==================== 计算属性 ====================
const showManualConfigCard = computed(() => {
  return (
    aTab.value != 3 &&
    taskType.value !== ETASKTYPE.ESTABLISHMENT &&
    processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
      BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE &&
    showStatus.value
  );
});

const showStatusSelectorCard = computed(() => {
  return (
    aTab.value != 3 &&
    (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.REGIONAL_SALES_CHANGE ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE_TEM ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS) &&
    todoTaskStatus.value
  );
});

/** 流程是否处于「编制」节点（进行中/待处理） */
const isAtEstablishmentNode = computed(() =>
  activityNodes.value.some(
    node => node.name === ETASKTYPE.ESTABLISHMENT && [TaskStatusEnum.WAIT, TaskStatusEnum.RUNNING].includes(node.status),
  ),
);

// ==================== 监听器 ====================
watch(
  () => processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE,
  async businessType => {
    if (businessType) {
      let componentLoader = getBusinessTypeComponent(businessType);
      if (!componentLoader) {
        componentLoader = getBusinessTypeComponent(BpmBusinessProcessTypeEnum.DEFAULT);
      }
      if (componentLoader) {
        currentBusinessComponent.value = defineAsyncComponent(componentLoader);
      } else {
        currentBusinessComponent.value = null;
      }
    }
  },
  { immediate: true },
);

const handleSelectApprover = (index: number) => {
  rowIndex.value = index;
  const current = approveUser.value[index];
  const userId = current?.id ?? current?.userId;
  memberAuthUserIds.value = userId ? [String(userId)].slice(0, 1) : [];
  memberAuthVisible.value = true;
};

/** 将 MemberAuthPicker 用户结构转为审批人展示/提交结构 */
function mapMemberToApproveUser(user: MemberAuthUser & { nickname?: string; psnName?: string }) {
  const displayName = user.name || user.nickname || user.psnName || user.username || '';
  return {
    ...user,
    id: user.id,
    userId: user.id,
    nickname: displayName,
    psnName: displayName,
    name: displayName,
  };
}

function handleMemberAuthConfirm(userIds: string[]) {
  if (!userIds.length) {
    approveUser.value[rowIndex.value] = undefined;
    approveUser.value = [...approveUser.value];

    const placeholder = processDefinitionList.value[rowIndex.value]?.assigneePlaceholder;
    if (placeholder && processVariablesList.value[rowIndex.value]) {
      processVariablesList.value[rowIndex.value][placeholder] = '';
    }

    memberAuthUserIds.value = [];
    memberAuthVisible.value = false;
    return;
  }

  if (userIds.length > 1) {
    message.warning('只能选择一个审批人');
    return;
  }

  const selectedUser = pickUsersByIds([userIds[0]])[0];
  if (!selectedUser) {
    message.warning('未找到所选用户');
    return;
  }

  const mappedUser = mapMemberToApproveUser(selectedUser);
  approveUser.value[rowIndex.value] = mappedUser;
  approveUser.value = [...approveUser.value];

  const placeholder = processDefinitionList.value[rowIndex.value]?.assigneePlaceholder;
  if (placeholder) {
    if (!processVariablesList.value[rowIndex.value]) {
      processVariablesList.value[rowIndex.value] = {};
    }
    processVariablesList.value[rowIndex.value][placeholder] = mappedUser.id;
  }

  memberAuthUserIds.value = [String(mappedUser.id)];
  message.success('选择成功');
  memberAuthVisible.value = false;
}

function pickUsersByIds(userIds: string[]) {
  const userIdSet = new Set(userIds.map(String));
  return memberAuthUsers.value.filter(u => userIdSet.has(String(u.id)));
}

/** 查看流程变量 */
const showProcessVariables = async () => {
  try {
    processVariablesContent.value = '加载中...';
    processVariablesDialogVisible.value = true;

    // 调用API获取流程变量
    const response = await ProcessInstanceApi.getProcessVariables(props.id);

    if (response && response.data) {
      // 格式化JSON数据，使其更易读
      processVariablesContent.value = JSON.stringify(response.data, null, 2);
    } else {
      processVariablesContent.value = '暂无流程变量数据';
    }
  } catch (error) {
    console.error('获取流程变量失败:', error);
    processVariablesContent.value = '获取流程变量失败，请重试';
    message.error('获取流程变量失败');
  }
};

/** 复制流程变量内容 */
const copyProcessVariables = async () => {
  try {
    await navigator.clipboard.writeText(processVariablesContent.value);
    message.success('内容已复制到剪贴板');
  } catch (error) {
    console.error('复制失败:', error);
    message.error('复制失败，请手动复制');
  }
};

const getApprovalDetail = async () => {
  processInstanceLoading.value = true;
  try {
    const param = {
      processInstanceId: props.id || qId.value,
      activityId: props.activityId,
      taskId: props.taskId,
    };
    const res = await ProcessInstanceApi.getApprovalDetail(param);
    let data = null;
    if (res.data.code === 200) {
      data = res.data.data;
    }
    if (!data) {
      message.error('查询不到审批详情信息！');
      return;
    }
    if (!data.processDefinition || !data.processInstance) {
      message.error('查询不到流程信息！');
      return;
    }

    processInstance.value = data.processInstance;
    processDefinition.value = data.processDefinition;

    let taskBpmType = taskType.value ? taskType.value : data.todoTask?.name;
    if (taskBpmType === ETASKTYPE.ESTABLISHMENT || taskBpmType === ETASKTYPE.MAIN_ENGINE_PLANTS) {
      await getprocessUserModel();
    }

    if (
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS &&
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.FORWARD_DATA_FAIL &&
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.STANDARD_BOM_RE &&
      processInstance.value?.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.TASK_OWNER_NOTICE &&
      processInstance.value?.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.STANDARD_PROCESSROUTE_RE
    ) {
    }

    if (processInstance.value.formVariables?.BUSINESS_COLLECTION_TITILE) {
      const obj = JSON.parse(processInstance.value.formVariables?.BUSINESS_COLLECTION_TITILE);
      titleList.value = Object.keys(obj).map(key => ({ key, value: obj[key] }));
    }

    if (processInstance.value.formVariables?.BUSINESS_COLLECTION_VALUE) {
      const list = JSON.parse(processInstance.value.formVariables?.BUSINESS_COLLECTION_VALUE);
      insatnceList.value = list;
    }

    if (processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_TITILE) {
      const obj = JSON.parse(processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_TITILE);
      errorTitleList.value = Object.keys(obj).map(key => ({ key, value: obj[key] }));
    }

    if (processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_VALUE) {
      const list = JSON.parse(processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_VALUE);
      if (list) {
        list.forEach((item: any) => {
          item['orderId'] = processInstance.value.formVariables?.orderId;
          item['areaSaleConfigId'] = processInstance.value.formVariables?.BUSINESS_KEY;
        });
      }
      errorInsatnceList.value = list;
    }

    if (processDefinition.value.formType === BpmModelFormType.NORMAL) {
      const formFieldsPermission = data.formFieldsPermission;
      writableFields.splice(0);
      if (detailForm.value.rule?.length > 0) {
        detailForm.value.value = processInstance.value.formVariables;
      } else {
        setConfAndFields2(
          detailForm,
          processDefinition.value.formConf,
          processDefinition.value.formFields,
          processInstance.value.formVariables,
        );
      }
      nextTick().then(() => {
        fApi.value?.btn.show(false);
        fApi.value?.resetBtn.show(false);
        //@ts-ignore
        fApi.value?.disabled(true);
        if (formFieldsPermission) {
          Object.keys(data.formFieldsPermission).forEach(item => {
            setFieldPermission(item, formFieldsPermission[item]);
          });
        }
      });
    } else {
      BusinessFormComponent.value = registerComponent(data.processDefinition.formCustomViewPath);
    }
    activityNodes.value = data.activityNodes;
    todoTask.value = data.todoTask;
    if (!taskType.value) {
      taskType.value = data.todoTask?.name;
    }
    nextTick(() => {
      operationButtonRef.value?.loadTodoTask(data.todoTask, toTaskId.value);
    });
    showStatus.value = data.todoTask?.name === '销售审批';
  } finally {
    processInstanceLoading.value = false;
  }
};

const getProcessModelView = async () => {
  diagramLoading.value = true;
  try {
    if (BpmModelType.BPMN === processDefinition.value?.modelType) {
      processModelView.value = { bpmnXml: '' };
    }
    const res = await ProcessInstanceApi.getProcessInstanceBpmnModelView(props.id);
    if (res.data.code === 200) {
      processModelView.value = res.data.data;
    }
  } finally {
    diagramLoading.value = false;
  }
};

const setFieldPermission = (field: string, permission: string) => {
  if (permission === FieldPermissionType.READ) {
    //@ts-ignore
    fApi.value?.disabled(true, field);
  }
  if (permission === FieldPermissionType.WRITE) {
    //@ts-ignore
    fApi.value?.disabled(false, field);
    writableFields.push(field);
  }
  if (permission === FieldPermissionType.NONE) {
    //@ts-ignore
    fApi.value?.hidden(true, field);
  }
};

const refresh = () => {
  void getApprovalDetail();
  if (activeTab.value === 'diagram') {
    void getProcessModelView();
  }
  if (activeTab.value === 'record') {
    taskListRefreshKey.value += 1;
  }
};

const refreshProcessDiagram = () => {
  void getProcessModelView();
};

const handleLoading = (loading: boolean) => {
  loadingFlag.value = loading;
};

async function getprocessUserModel() {
  // if (!processDefinitionKey.value) return
  let data = {
    processDefinitionKey: processDefinitionKey.value ? processDefinition.value.key : processDefinition.value.key,
    processInstanceId: processInstanceId.value ? processInstanceId.value : processInstance.value.id,
    director:
      taskType.value === ETASKTYPE.ESTABLISHMENT &&
      (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE ||
        processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
          BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_RELEASE)
        ? ETASKTYPE.MAIN_ENGINE_PLANTS
        : '',
  };

  const res = await ProcessInstanceApi.getUserModel(data);
  if (res.data.code === 200) {
    processDefinitionList.value = res.data.data;
  }
  if (processDefinitionList.value) {
    processDefinitionList.value.map((item, index) => {
      if (item.userInfo) {
        if (taskType.value === ETASKTYPE.MAIN_ENGINE_PLANTS) {
          approvEmainEnginePlantsUser.value[index] = { ...item.userInfo };
        } else {
          approveUser.value[index] = { ...item.userInfo };
        }
        firstTimeEditSubmit.value = false;
      }
      processVariablesList.value.push({
        [item?.assigneePlaceholder]: item.userInfo?.id || '',
      });
    });
  }
}

const orderRedType = ref(true);

watch(activeTab, newVal => {
  if (newVal === 'diagram' && !diagramLoaded.value) {
    setTimeout(() => {
      void getProcessModelView().then(() => {
        diagramLoaded.value = true;
      });
    }, 50);
  }
});
const getDeptuseInfo = async () => {
  const res = await AdminApiSystemDept.getDeptInfo({});
  if (res.data.code === 200) {
    const rawUsers = res.data?.data?.adminUserResponseDTO || [];
    userOptions.value = rawUsers;
    memberAuthUsers.value = rawUsers.map((u: any) => ({
      id: String(u.id ?? u.userId),
      name: u.nickname ?? u.psnName ?? u.name ?? u.username ?? '',
      username: u.username ?? '',
      deptId: u.deptId != null ? String(u.deptId) : undefined,
    }));
    memberAuthDepts.value = (res.data?.data?.adminDeptResponseDTO || []).map((d: any) => ({
      id: String(d.id),
      name: d.name ?? d.deptName ?? '',
    }));
  }
};
onMounted(async () => {
  if (props.orderInstance) {
    orderRedType.value = props.orderInstance?.operationType === 1 ? false : true;
    qId.value = props.orderInstance?.id || ('' as string);
    processDefinitionId.value = '0';
    processDefinitionKey.value = '';
    processInstanceId.value = props.orderInstance?.id;
    editType.value = Number(props.orderInstance?.readType);
    aTab.value = '';
    opinion.value = '';
    taskActivityId.value = '';
    tName.value = '';
  } else {
    const {
      id,
      pDefinitionId,
      pProcessDefinitionKey,
      type,
      pIId,
      readType,
      activeTab,
      tId,
      reason,
      taskDefinitionKey,
      taskName,
    } = route.query;
    taskType.value = type as string;
    toTaskId.value = tId || '';
    qId.value = id || ('' as string);
    processDefinitionId.value = pDefinitionId || ('' as string);
    processDefinitionKey.value = pProcessDefinitionKey || ('' as string);
    processInstanceId.value = pIId || ('' as string);
    editType.value = Number(readType || (1 as number));
    aTab.value = activeTab || ('' as string);
    opinion.value = reason || ('' as string);
    taskActivityId.value = taskDefinitionKey || ('' as string);
    tName.value = taskName || ('' as string);
  }

  loadingFlag.value = true;
  try {
    await Promise.all([getApprovalDetail(), getDeptuseInfo()]);
  } finally {
    loadingFlag.value = false;
  }
});
</script>

<style lang="scss" scoped>
.process-instance-detail-wrap {
  height: 100%;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 13px;
  font-weight: 400;

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }
}

.processInstance-wrap-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.font-bold),
  :deep(.text-14px),
  :deep(.text-15px),
  :deep(.text-26px) {
    font-size: 13px;
    font-weight: 400;
  }

  :deep(*) {
    font-weight: 400 !important;
  }
}

.process-instance-tabs {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.el-tabs__header) {
    flex-shrink: 0;
    margin-bottom: 0;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
    height: 0;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.form-scroll-area {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

  :deep(.box-card) {
    height: 100%;

    .el-card__body {
      height: 100%;
      padding: 0;
    }
  }
}

.process-instance-footer {
  flex-shrink: 0;
}

.form-box {
  :deep(.el-card) {
    border: none;
  }
}

.diagram-container {
  position: relative;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  .diagram-toolbar {
    position: absolute;
    top: 10px;
    left: 20px;
    z-index: 10;
  }

  .diagram-viewer-body {
    flex: 1;
    min-height: 0;
    height: 100%;
    width: 100%;
    position: relative;

    :deep(.process-viewer-container),
    :deep(.box-card) {
      height: 100% !important;
      min-height: 0;
      margin-bottom: 0 !important;
      display: flex;
      flex-direction: column;
    }

    :deep(.el-card__body) {
      flex: 1;
      min-height: 0;
      height: 100%;
      padding: 0;
    }

    :deep(.process-viewer),
    :deep(.djs-container),
    :deep(.bjs-container) {
      height: 100% !important;
      width: 100% !important;
      min-height: 0;
      box-sizing: border-box;
    }
  }
}

.process-variables-container {
  .process-variables-textarea {
    :deep(.el-textarea__inner) {
      font-family: 'Courier New', Courier, monospace !important;
      font-size: 13px !important;
      font-weight: 400 !important;
      line-height: 1.5 !important;
      background-color: #f8f9fa !important;
      border: 1px solid #e9ecef !important;
      resize: vertical !important;
    }
  }
}

:deep(.el-dialog .el-textarea__inner) {
  font-weight: 400 !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
