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
                <el-col :span="17" class="!flex !flex-col formCol">
                  <div v-loading="processInstanceLoading" class="form-box flex flex-col mb-30px flex-1">
                    <!-- 动态业务类型组件 - 包含审批内容和审签信息 -->
                    <component
                      v-if="currentBusinessComponent"
                      :is="currentBusinessComponent"
                      :process-instance="processInstance"
                      :title-list="titleList"
                      :approval-data="approvalData"
                      :error-title-list="errorTitleList"
                      :error-insatnce-list="errorInsatnceList"
                      :opinion="opinion"
                      :todo-task="todoTask"
                      @search="handleBusinessSearch"
                      @show-feature-detail="handleShowModal('feature', $event)"
                      @show-order-set="handleShowModal('orderSet', $event)"
                      @show-customize-feature="handleShowModal('customizeFeature', $event)"
                      @show-project-config="handleShowModal('projectConfig', $event)"
                      @show-super-bom="handleShowSuperBom"
                      @show-ep-compare="handleShowEpCompare" />

                    <!-- 节点审批人员组件 -->
                    <ApprovalPersonnel
                      :process-definition-list="processDefinitionList"
                      :approve-user="approveUser"
                      :main-engine-plants-user="approvEmainEnginePlantsUser"
                      :is-main-engine-plants="emainEnginePlants"
                      :edit-type="editType"
                      @select-user="handleSelectApprover" />

                    <!-- 处理意见组件 -->
                    <ProcessOpinion v-model="opinion" :disabled="editType === 0" :visible="aTab != 3" />

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

                <el-col :span="7">
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
            <div class="diagram-viewer-body">
              <ProcessInstanceSimpleViewer
                v-show="processDefinition.modelType && processDefinition.modelType === BpmModelType.SIMPLE"
                :loading="processInstanceLoading"
                :model-view="processModelView" />
              <ProcessInstanceBpmnViewer
                v-show="processDefinition.modelType && processDefinition.modelType === BpmModelType.BPMN"
                :loading="processInstanceLoading"
                :model-view="processModelView"
                @transferSuccess="refresh" />
            </div>
          </div>
        </el-tab-pane>

        <!-- 流转记录 -->
        <el-tab-pane :label="'流转记录'" name="record">
          <div class="form-scroll-area">
            <el-scrollbar>
              <ProcessInstanceTaskList :loading="processInstanceLoading" :id="id" />
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
          :editType="editType"
          :aTab="aTab"
          :opinion="opinion"
          :taskType="taskType"
          :areaSaleRelease="areaSaleRelease"
          :pageIndex="route.query.pageIndex"
          :firstTimeEditSubmit="firstTimeEditSubmit" />
      </div>

      <!-- 弹窗和抽屉 -->
      <!-- <UserSelectFormRadio ref="userSelectFormRef" :singleType="true" @confirm="handleUserSelectConfirm" /> -->
      <!-- <FeatureDetailModal ref="FeatureDetailModalRef" /> -->
      <!-- <BomOrderSet title="订单BOM" ref="OrderSetRef" /> -->
      <!-- <CustomizeFeatureDetailModal ref="CustomizeFeatureDetailModalRef" /> -->
      <!-- <ProjectConfigDeatil ref="projectConfigDeatilRef" /> -->
      <!-- <EpOnlyCompareDrawer
        v-model="showEpCompareDrawer"
        :configNo="configNo"
        :orderID="orderID"
        :orderNo="orderNo"
        :designModelId="designModelId" /> -->
      <!-- <VersionCompareDrawer ref="versionCompareDrawerRef" /> -->
      <!-- <SuperBom ref="refSuperBom" /> -->

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
            style="font-weight: 800 !important" />
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
import { ref, computed, defineAsyncComponent, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BpmModelType, BpmModelFormType } from '@/utils/constants'
import { setConfAndFields2 } from '@/utils/formCreate'
import { registerComponent } from '@/utils/routerHelper'
import type { ApiAttrs } from '@form-create/element-ui/types/config'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import * as UserApi from '@/api/system/user'
import { FieldPermissionType } from '@/components/SimpleProcessDesignerV2/src/consts'
import { ETASKTYPE } from '../components/config/constant'
import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'
import { getBusinessTypeComponent } from './businessTypes/index'
import { useMessage } from '@/hooks/web/useMessage'
import { ContentWrap } from '@/components/ContentWrap'
import { TaskStatusEnum } from '@/api/bpm/task'
// 导入组件
import ProcessInstanceHeader from './components/ProcessInstanceHeader.vue'
import ProcessInstanceBpmnViewer from './ProcessInstanceBpmnViewer.vue'
import ProcessInstanceSimpleViewer from './ProcessInstanceSimpleViewer.vue'
import ProcessInstanceTaskList from './ProcessInstanceTaskList.vue'
import ProcessInstanceOperationButtonCopy from './ProcessInstanceOperationButtonCopy.vue'
import ProcessInstanceSubButton from '../components/ProcessInstanceSubButton.vue'
import ProcessInstanceTimeline from './ProcessInstanceTimeline.vue'
import ApprovalPersonnel from './components/ApprovalPersonnel.vue'
import ProcessOpinion from './components/ProcessOpinion.vue'
import ProcessStatusSelector from './components/ProcessStatusSelector.vue'

import runningSvg from '@/assets/svgs/bpm/running.svg'
import approveSvg from '@/assets/svgs/bpm/approve.svg'
import rejectSvg from '@/assets/svgs/bpm/reject.svg'
import cancelSvg from '@/assets/svgs/bpm/cancel.svg'
defineOptions({ name: 'BpmProcessInstanceDetail' })
import { AdminApiSystemDept } from '@/api/tags/管理后台部门'
const props = defineProps<{
  id: string
  taskId?: string
  activityId?: string
  orderInstance?: object
}>()

const route = useRoute()
const message = useMessage()

// ==================== 核心状态 ====================
const processInstanceLoading = ref(false)
const processInstance = ref<any>({})
const processDefinition = ref<any>({})
const processModelView = ref<any>({})
const operationButtonRef = ref()
const auditIconsMap = {
  [TaskStatusEnum.RUNNING]: runningSvg,
  [TaskStatusEnum.APPROVE]: approveSvg,
  [TaskStatusEnum.REJECT]: rejectSvg,
  [TaskStatusEnum.CANCEL]: cancelSvg,
}

// 表单相关
const fApi = ref<ApiAttrs>()
const detailForm = ref({ rule: [], option: {}, value: {} })
const writableFields: Array<any> = []

// 业务数据
const titleList = ref<any>([])
const insatnceList = ref<any>([])
const errorTitleList = ref<any>([])
const errorInsatnceList = ref<any>([])
const opinion = ref<any>('')
const approvalData = ref<any>([])
const content = ref<string>()
const isManual = ref<boolean>(false)
const showStatus = ref<boolean>(false)
const areaSaleRelease = ref<any>({
  areaSaleRelease_genStMbomConfirm: null,
  areaSaleRelease_rePushScpStMbomPre: null,
  areaSaleRelease_officiallyReleased: null,
  crmRelease: null,
  rdOwnerToAdmin: false,
  processOwnerToAdmin: false,
  processOwnerToRdOwner: false,
})

// Refs
const FeatureDetailModalRef = ref(null)
const OrderSetRef = ref(null)
const CustomizeFeatureDetailModalRef = ref(null)
const projectConfigDeatilRef = ref(null)
const userSelectFormRef = ref()

// 其他状态
const todoTask = ref<any>()
const todoTaskStatus = computed(() => {
  return ['标配Mbom确认', '重新推送', '正式发布', '研发审核', '工艺审核'].includes(todoTask.value?.name)
})
const userType = ref<any>('1')
const loadingFlag = ref<boolean>(false)
const showEpCompareDrawer = ref<boolean>(false)
const designModelId = ref<string>('')
const configNo = ref<string>('')
const orderID = ref()
const orderNo = ref()
const activeTab = ref('form')
const taskType = ref('')
const taskActivityId = ref('')
const tName = ref('')
const qId = ref<any>('')
const processDefinitionId = ref<any>('')
const processDefinitionKey = ref<any>('')
const processDefinitionList = ref<any>([])
const approveUser = ref<any>([])
const processVariablesList = ref<any[]>([])
const rowIndex = ref(0)
const processInstanceId = ref<any>('')
const editType = ref<any>(1)
const aTab = ref<any>('')
const firstTimeEditSubmit = ref(true)
const approvEmainEnginePlantsUser = ref<any>([])
const emainEnginePlants = ref<boolean>(false)
const toTaskId = ref<any>('')
const userOptions = ref<[]>([])
const BusinessFormComponent = ref<any>(null)
const activityNodes = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([])
const currentBusinessComponent = ref<any>(null)

// 流程变量弹窗相关
const processVariablesDialogVisible = ref(false) // 弹窗显示状态
const processVariablesContent = ref('') // 流程变量内容

// ==================== 计算属性 ====================
const showManualConfigCard = computed(() => {
  return (
    aTab.value != 3 &&
    taskType.value !== ETASKTYPE.ESTABLISHMENT &&
    processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
      BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE &&
    showStatus.value
  )
})

const showStatusSelectorCard = computed(() => {
  return (
    aTab.value != 3 &&
    (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.REGIONAL_SALES_CHANGE ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.REGIONAL_SALES_RELEASE_TEM ||
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE === BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS) &&
    todoTaskStatus.value
  )
})

// ==================== 监听器 ====================
watch(
  () => processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE,
  async businessType => {
    if (businessType) {
      let componentLoader = getBusinessTypeComponent(businessType)
      if (!componentLoader) {
        componentLoader = getBusinessTypeComponent(BpmBusinessProcessTypeEnum.DEFAULT)
      }
      if (componentLoader) {
        currentBusinessComponent.value = defineAsyncComponent(componentLoader)
      } else {
        currentBusinessComponent.value = null
      }
    }
  },
  { immediate: true },
)

// ==================== 事件处理 ====================
const handleBusinessSearch = (searchContent: string) => {
  content.value = searchContent
  getProcessLinkedBusinessList()
}

const handleShowModal = (type: string, row: any) => {
  const modalMap = {
    feature: () => FeatureDetailModalRef.value?.show(1, row.id, 'optional'),
    orderSet: () => OrderSetRef.value?.show('detail', row.configureIden, 'process'),
    customizeFeature: () => CustomizeFeatureDetailModalRef.value?.show(3, row.id),
    projectConfig: () => projectConfigDeatilRef.value?.show(row.id),
  }
  modalMap[type]?.()
}

const handleShowSuperBom = ({ areaSConfigId, type, bomData }) => {
  // refSuperBom.value?.show(areaSConfigId, type, bomData)
}

const handleShowEpCompare = ({ orderId, orderNo: orderNum, designModelId: dmId, configNo: cfgNo }) => {
  designModelId.value = dmId
  orderID.value = orderId
  configNo.value = cfgNo
  orderNo.value = orderNum
  showEpCompareDrawer.value = true
}

const handleSelectApprover = (index: number, type: 'normal' | 'mainEngine') => {
  rowIndex.value = index
  let list = []
  userType.value = type === 'normal' ? '1' : '2'
  if (approveUser.value[index]) {
    list = [approveUser.value[index]]
  } else if (approvEmainEnginePlantsUser.value[index]) {
    list = [approvEmainEnginePlantsUser.value[index]]
  }

  userSelectFormRef.value.open(0, list)
}

const handleUserSelectConfirm = (_, users: []) => {
  debugger
  if (users) {
    window.$message.success('选择成功')
  }
  const targetArray = userType.value === '1' ? approveUser : approvEmainEnginePlantsUser
  targetArray.value[rowIndex.value] = users[0]
  processVariablesList.value[rowIndex.value][processDefinitionList.value[rowIndex.value].assigneePlaceholder] =
    users[0].userId
}

/** 查看流程变量 */
const showProcessVariables = async () => {
  try {
    processVariablesContent.value = '加载中...'
    processVariablesDialogVisible.value = true

    // 调用API获取流程变量
    const response = await ProcessInstanceApi.getProcessVariables(props.id)

    if (response && response.data) {
      // 格式化JSON数据，使其更易读
      processVariablesContent.value = JSON.stringify(response.data, null, 2)
    } else {
      processVariablesContent.value = '暂无流程变量数据'
    }
  } catch (error) {
    console.error('获取流程变量失败:', error)
    processVariablesContent.value = '获取流程变量失败，请重试'
    message.error('获取流程变量失败')
  }
}

/** 复制流程变量内容 */
const copyProcessVariables = async () => {
  try {
    await navigator.clipboard.writeText(processVariablesContent.value)
    message.success('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    message.error('复制失败，请手动复制')
  }
}

// ==================== API 调用 ====================
const getProcessLinkedBusinessList = () => {
  let data = {
    businessType: processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE,
    content: content.value,
    processId: props.id,
  }
  ProcessInstanceApi.getProcessLinkedBusiness(data).then(res => {
    approvalData.value = res.data
  })
}

const getApprovalDetail = async () => {
  processInstanceLoading.value = true
  try {
    const param = {
      processInstanceId: props.id || qId.value,
      activityId: props.activityId,
      taskId: props.taskId,
    }
    const res = await ProcessInstanceApi.getApprovalDetail(param)
    let data = null
    if (res.data.code === 200) {
      data = res.data.data
    }
    debugger
    if (!data) {
      message.error('查询不到审批详情信息！')
      return
    }
    if (!data.processDefinition || !data.processInstance) {
      message.error('查询不到流程信息！')
      return
    }

    processInstance.value = data.processInstance
    processDefinition.value = data.processDefinition

    if (taskType.value === ETASKTYPE.ESTABLISHMENT || taskType.value === ETASKTYPE.MAIN_ENGINE_PLANTS) {
      await getprocessUserModel()
    }

    if (
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS &&
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.FORWARD_DATA_FAIL &&
      processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.STANDARD_BOM_RE &&
      processInstance.value?.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.TASK_OWNER_NOTICE &&
      processInstance.value?.formVariables?.PROCESS_BUSINESS_TYPE != BpmBusinessProcessTypeEnum.STANDARD_PROCESSROUTE_RE
    ) {
      // await getProcessLinkedBusinessList()
    }

    if (processInstance.value.formVariables?.BUSINESS_COLLECTION_TITILE) {
      const obj = JSON.parse(processInstance.value.formVariables?.BUSINESS_COLLECTION_TITILE)
      titleList.value = Object.keys(obj).map(key => ({ key, value: obj[key] }))
    }

    if (processInstance.value.formVariables?.BUSINESS_COLLECTION_VALUE) {
      const list = JSON.parse(processInstance.value.formVariables?.BUSINESS_COLLECTION_VALUE)
      insatnceList.value = list
    }

    if (processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_TITILE) {
      const obj = JSON.parse(processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_TITILE)
      errorTitleList.value = Object.keys(obj).map(key => ({ key, value: obj[key] }))
    }

    if (processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_VALUE) {
      const list = JSON.parse(processInstance.value.formVariables?.BUSINESS_ERROR_MESSAGE_VALUE)
      if (list) {
        list.forEach((item: any) => {
          item['orderId'] = processInstance.value.formVariables?.orderId
          item['areaSaleConfigId'] = processInstance.value.formVariables?.BUSINESS_KEY
        })
      }
      errorInsatnceList.value = list
    }

    if (processDefinition.value.formType === BpmModelFormType.NORMAL) {
      const formFieldsPermission = data.formFieldsPermission
      writableFields.splice(0)
      if (detailForm.value.rule?.length > 0) {
        detailForm.value.value = processInstance.value.formVariables
      } else {
        setConfAndFields2(
          detailForm,
          processDefinition.value.formConf,
          processDefinition.value.formFields,
          processInstance.value.formVariables,
        )
      }
      nextTick().then(() => {
        fApi.value?.btn.show(false)
        fApi.value?.resetBtn.show(false)
        //@ts-ignore
        fApi.value?.disabled(true)
        if (formFieldsPermission) {
          Object.keys(data.formFieldsPermission).forEach(item => {
            setFieldPermission(item, formFieldsPermission[item])
          })
        }
      })
    } else {
      BusinessFormComponent.value = registerComponent(data.processDefinition.formCustomViewPath)
    }
    activityNodes.value = data.activityNodes
    todoTask.value = data.todoTask
    if (!taskType.value) {
      taskType.value = data.todoTask?.name
    }

    operationButtonRef.value?.loadTodoTask(data.todoTask, toTaskId.value)
    showStatus.value = data.todoTask?.name === '销售审批'
    emainEnginePlants.value = data.todoTask?.name === '主机厂技术主管审批'
  } finally {
    processInstanceLoading.value = false
  }
}

const getProcessModelView = async () => {
  if (BpmModelType.BPMN === processDefinition.value?.modelType) {
    processModelView.value = { bpmnXml: '' }
  }
  const res = await ProcessInstanceApi.getProcessInstanceBpmnModelView(props.id)
  if (res.data.code === 200) {
    processModelView.value = res.data.data
  }
}

const setFieldPermission = (field: string, permission: string) => {
  if (permission === FieldPermissionType.READ) {
    //@ts-ignore
    fApi.value?.disabled(true, field)
  }
  if (permission === FieldPermissionType.WRITE) {
    //@ts-ignore
    fApi.value?.disabled(false, field)
    writableFields.push(field)
  }
  if (permission === FieldPermissionType.NONE) {
    //@ts-ignore
    fApi.value?.hidden(true, field)
  }
}

const refresh = () => {
  getApprovalDetail()
  getProcessModelView()
}

const refreshProcessDiagram = () => {
  getProcessModelView()
}

const handleLoading = (loading: boolean) => {
  loadingFlag.value = loading
}

async function getprocessUserModel() {
  if (!processDefinitionKey.value) return
  let data = {
    processDefinitionKey: processDefinitionKey.value,
    processInstanceId: processInstanceId.value,
    director:
      taskType.value === ETASKTYPE.ESTABLISHMENT &&
      (processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE ||
        processInstance.value.formVariables?.PROCESS_BUSINESS_TYPE ===
          BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_RELEASE)
        ? ETASKTYPE.MAIN_ENGINE_PLANTS
        : '',
  }

  const res = await ProcessInstanceApi.getUserModel(data)
  if (res.data.code === 200) {
    processDefinitionList.value = res.data.data
  }
  if (processDefinitionList.value) {
    processDefinitionList.value.map((item, index) => {
      if (item.userInfo) {
        if (taskType.value === ETASKTYPE.MAIN_ENGINE_PLANTS) {
          approvEmainEnginePlantsUser.value[index] = { ...item.userInfo }
        } else {
          approveUser.value[index] = { ...item.userInfo }
        }
        firstTimeEditSubmit.value = false
      }
      processVariablesList.value.push({
        [item?.assigneePlaceholder]: item.userInfo?.id || '',
      })
    })
  }
}

const orderRedType = ref(true)

watch(activeTab, newVal => {
  if (newVal === 'diagram') {
    setTimeout(() => {
      refreshProcessDiagram()
    }, 50)
  }
})
const getDeptuseInfo = async () => {
  const res = await AdminApiSystemDept.getDeptInfo({})
  if (res.data.code === 200) {
    userOptions.value = res.data?.data?.adminUserResponseDTO || []
  }
}
onMounted(async () => {
  if (props.orderInstance) {
    orderRedType.value = props.orderInstance?.operationType === 1 ? false : true
    qId.value = props.orderInstance?.id || ('' as string)
    processDefinitionId.value = '0'
    processDefinitionKey.value = ''
    processInstanceId.value = props.orderInstance?.id
    editType.value = Number(props.orderInstance?.readType)
    aTab.value = ''
    opinion.value = ''
    taskActivityId.value = ''
    tName.value = ''
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
    } = route.query
    taskType.value = type as string
    toTaskId.value = tId || ''
    qId.value = id || ('' as string)
    processDefinitionId.value = pDefinitionId || ('' as string)
    processDefinitionKey.value = pProcessDefinitionKey || ('' as string)
    processInstanceId.value = pIId || ('' as string)
    editType.value = Number(readType || (1 as number))
    aTab.value = activeTab || ('' as string)
    opinion.value = reason || ('' as string)
    taskActivityId.value = taskDefinitionKey || ('' as string)
    tName.value = taskName || ('' as string)
  }

  loadingFlag.value = false
  refresh()
  getDeptuseInfo()
})
</script>

<style lang="scss" scoped>
.process-instance-detail-wrap {
  // height: calc(100vh - var(--top-tool-height) - var(--tags-view-height) - var(--app-footer-height) - 35px);
  // max-height: calc(100vh - var(--top-tool-height) - var(--tags-view-height) - var(--app-footer-height) - 35px);
  height: 100%;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

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
      font-size: 12px !important;
      font-weight: 800 !important;
      line-height: 1.5 !important;
      background-color: #f8f9fa !important;
      border: 1px solid #e9ecef !important;
      resize: vertical !important;
    }
  }
}

// 使用更高优先级的选择器确保样式生效
:deep(.el-dialog .el-textarea__inner) {
  font-weight: 800 !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
