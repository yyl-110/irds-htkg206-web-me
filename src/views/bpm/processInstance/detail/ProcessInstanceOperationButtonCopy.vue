<template>
  <div class="h-50px bottom-10 text-14px flex items-center color-#32373c dark:color-#fff font-bold btn-container">
    <!-- 【通过】按钮 -->
    <el-button
      v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.APPROVE) && subButton"
      plain
      class="mr-20px"
      type="success"
      @click="openPopover('approve')">
      <Icon icon="ep:select" />&nbsp; {{ getButtonDisplayName(OperationButtonType.APPROVE) }}
    </el-button>

    <el-button
      v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.REJECT) && subButton"
      class="mr-20px"
      plain
      type="danger"
      @click="openPopover('reject')">
      <Icon icon="ep:close" />&nbsp; {{ getButtonDisplayName(OperationButtonType.REJECT) }}
    </el-button>

    <el-button type="danger" @click="handleCancel" class="mr-20px" v-if="cancelFlag && runningTask">
      <Icon icon="ep:close" />&nbsp; {{ '取消' }}
    </el-button>

    <el-button type="info" @click="handleGoBack" class="mr-20px">
      <Icon :size="14" icon="ep:back" />&nbsp; {{ '关闭' }}
    </el-button>

    <!-- 【抄送】按钮 -->
    <!-- <el-popover
      :visible="popOverVisible.copy"
      placement="top-start"
      :width="420"
      trigger="click"
      v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.COPY)"
    >
      <template #reference>
        <div @click="openPopover('copy')" class="hover-bg-gray-100 rounded-xl p-6px">
          <Icon :size="14" icon="svg-icon:send" />&nbsp;
          {{ getButtonDisplayName(OperationButtonType.COPY) }}
        </div>
      </template>
      <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
        <el-form
          label-position="top"
          class="mb-auto"
          ref="copyFormRef"
          :model="copyForm"
          :rules="copyFormRule"
          label-width="100px"
        >
          <el-form-item label="抄送人" prop="copyUserIds">
            <el-select
              v-model="copyForm.copyUserIds"
              clearable
              style="width: 100%"
              multiple
              placeholder="请选择抄送人"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="抄送意见" prop="copyReason">
            <el-input
              v-model="copyForm.copyReason"
              clearable
              placeholder="请输入抄送意见"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="handleCopy">
              {{ getButtonDisplayName(OperationButtonType.COPY) }}
            </el-button>
            <el-button @click="closePopover('copy', copyFormRef)"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover> -->
    <!-- {{ runningTask}}
    {{ isHandleTaskStatus() }} -->
    <!-- 【转办】按钮 -->
    <el-popover
      :visible="popOverVisible.transfer"
      placement="top-start"
      :width="420"
      trigger="click"
      v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.TRANSFER)">
      <!-- 任务是否在处理中 isHandleTaskStatus()
     是否显示转办按钮 isShowButton(OperationButtonType.TRANSFER)
      -->
      <template #reference>
        <div @click="openPopover('transfer')" class="hover-bg-gray-100 rounded-xl p-6px">
          <Icon :size="14" icon="fa:share-square-o" />&nbsp;
          {{ getButtonDisplayName(OperationButtonType.TRANSFER) }}
        </div>
      </template>
      <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
        <el-form
          label-position="top"
          class="mb-auto"
          ref="transferFormRef"
          :model="transferForm"
          :rules="transferFormRule"
          label-width="100px">
          <el-form-item label="新审批人" prop="assigneeUserId">
            <el-button type="info" @click="handleSelectUser" v-if="editType === 1">
              {{ '选择转办对象' }}
            </el-button>
            <div v-if="transferForm.assigneeUserId" class="ml-10px">
              <el-tag>
                {{ approveUser[0].psnName }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="审批意见" prop="reason">
            <el-input v-model="transferForm.reason" clearable placeholder="请输入审批意见" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="handleTransfer()">
              {{ getButtonDisplayName(OperationButtonType.TRANSFER) }}
            </el-button>
            <el-button @click="closePopover('transfer', transferFormRef)"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover>
    <!-- <UserSelectFormRadio
      ref="userSelectFormRef"
      :operationType="currentOperationType"
      :singleType="currentOperationType === 'transfer'"
      @confirm="handleUserSelectConfirm" /> -->
    <!-- 【委派】按钮 -->
    <!-- <el-popover
      :visible="popOverVisible.delegate"
      placement="top-start"
      :width="420"
      trigger="click"
      v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.DELEGATE)"
    >
      <template #reference>
        <div @click="openPopover('delegate')" class="hover-bg-gray-100 rounded-xl p-6px">
          <Icon :size="14" icon="ep:position" />&nbsp;
          {{ getButtonDisplayName(OperationButtonType.DELEGATE) }}
        </div>
      </template>
      <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
        <el-form
          label-position="top"
          class="mb-auto"
          ref="delegateFormRef"
          :model="delegateForm"
          :rules="delegateFormRule"
          label-width="100px"
        >
          <el-form-item label="接收人" prop="delegateUserId">
            <el-select v-model="delegateForm.delegateUserId" clearable style="width: 100%">
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审批意见" prop="reason">
            <el-input
              v-model="delegateForm.reason"
              clearable
              placeholder="请输入审批意见"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="handleDelegate()">
              {{ getButtonDisplayName(OperationButtonType.DELEGATE) }}
            </el-button>
            <el-button @click="closePopover('delegate', delegateFormRef)"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover> -->

    <!-- 【加签】按钮 当前任务审批人为A，向前加签选了一个C，则需要C先审批，然后再是A审批，向后加签B，A审批完，需要B再审批完，才算完成这个任务节点 -->
    <!-- v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.ADD_SIGN)" -->
    <el-popover
      :visible="popOverVisible.addSign"
      placement="top-start"
      :width="420"
      trigger="click"
      v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.ADD_SIGN)">
      <template #reference>
        <div @click="openPopover('addSign')" class="hover-bg-gray-100 rounded-xl p-6px">
          <Icon :size="14" icon="ep:plus" />&nbsp;
          {{ getButtonDisplayName(OperationButtonType.ADD_SIGN) }}
        </div>
      </template>
      <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
        <el-form
          label-position="top"
          class="mb-auto"
          ref="addSignFormRef"
          :model="addSignForm"
          :rules="addSignFormRule"
          label-width="100px">
          <el-form-item label="加签处理人" prop="addSignUserIds">
            <!-- <el-select v-model="addSignForm.addSignUserIds" multiple clearable style="width: 100%">
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select> -->
            <el-button type="info" @click="handleaddSignSelectUser" v-if="editType === 1">
              {{ '选择加签对象' }}
            </el-button>
            <div v-if="addSignForm.addSignUserIds && addSignForm.addSignUserIds.length > 0" class="ml-10px">
              <el-tag
                v-for="user in addSignUser"
                :key="user.userId"
                class="mr-5px mb-5px"
                closable
                @close="handleRemoveUser(user.userId)">
                {{ user.psnName }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="审批意见" prop="reason">
            <el-input v-model="addSignForm.reason" clearable placeholder="请输入审批意见" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="handlerAddSign('before')">
              向前{{ getButtonDisplayName(OperationButtonType.ADD_SIGN) }}
            </el-button>
            <el-button :disabled="formLoading" type="primary" @click="handlerAddSign('after')">
              向后{{ getButtonDisplayName(OperationButtonType.ADD_SIGN) }}
            </el-button>
            <el-button @click="closePopover('addSign', addSignFormRef)"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover>

    <!-- 【减签】按钮 -->
    <!-- <el-popover
      :visible="popOverVisible.deleteSign"
      placement="top-start"
      :width="420"
      trigger="click"
      v-if="runningTask?.children.length > 0"
    >
      <template #reference>
        <div @click="openPopover('deleteSign')" class="hover-bg-gray-100 rounded-xl p-6px">
          <Icon :size="14" icon="ep:semi-select" />&nbsp; 减签
        </div>
      </template>
      <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
        <el-form
          label-position="top"
          class="mb-auto"
          ref="deleteSignFormRef"
          :model="deleteSignForm"
          :rules="deleteSignFormRule"
          label-width="100px"
        >
          <el-form-item label="减签人员" prop="deleteSignTaskId">
            <el-select v-model="deleteSignForm.deleteSignTaskId" clearable style="width: 100%">
              <el-option
                v-for="item in runningTask.children"
                :key="item.id"
                :label="getDeleteSignUserLabel(item)"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审批意见" prop="reason">
            <el-input
              v-model="deleteSignForm.reason"
              clearable
              placeholder="请输入审批意见"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="handlerDeleteSign()">
              减签
            </el-button>
            <el-button @click="closePopover('deleteSign', deleteSignFormRef)"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover> -->

    <!-- 【退回】按钮 -->
    <!-- <el-popover
      :visible="popOverVisible.return"
      placement="top-start"
      :width="420"
      trigger="click"
      v-if="runningTask && isHandleTaskStatus() && isShowButton(OperationButtonType.RETURN)"
    >
      <template #reference>
        <div @click="openPopover('return')" class="hover-bg-gray-100 rounded-xl p-6px">
          <Icon :size="14" icon="ep:back" />&nbsp;
          {{ getButtonDisplayName(OperationButtonType.RETURN) }}
        </div>
      </template>
      <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
        <el-form
          label-position="top"
          class="mb-auto"
          ref="returnFormRef"
          :model="returnForm"
          :rules="returnFormRule"
          label-width="100px"
        >
          <el-form-item label="退回节点" prop="targetTaskDefinitionKey">
            <el-select v-model="returnForm.targetTaskDefinitionKey" clearable style="width: 100%">
              <el-option
                v-for="item in returnList"
                :key="item.taskDefinitionKey"
                :label="item.name"
                :value="item.taskDefinitionKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="退回理由" prop="returnReason">
            <el-input
              v-model="returnForm.returnReason"
              clearable
              placeholder="请输入退回理由"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="handleReturn()">
              {{ getButtonDisplayName(OperationButtonType.RETURN) }}
            </el-button>
            <el-button @click="closePopover('return', returnFormRef)"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover> -->

    <!--【取消】按钮 这个对应发起人的取消, 只有发起人可以取消 -->
    <!-- <el-popover
      :visible="popOverVisible.cancel"
      placement="top-start"
      :width="420"
      trigger="click"
      v-if="
        userId === processInstance?.startUser?.id && !isEndProcessStatus(processInstance?.status)
      "
    >
      <template #reference>
        <div @click="openPopover('cancel')" class="hover-bg-gray-100 rounded-xl p-6px">
          <Icon :size="14" icon="fa:mail-reply" />&nbsp; 取消
        </div>
      </template>
      <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
        <el-form
          label-position="top"
          class="mb-auto"
          ref="cancelFormRef"
          :model="cancelForm"
          :rules="cancelFormRule"
          label-width="100px"
        >
          <el-form-item label="取消理由" prop="cancelReason">
            <span class="text-#878c93 text-12px">&nbsp; 取消后，该审批流程将自动结束</span>
            <el-input
              v-model="cancelForm.cancelReason"
              clearable
              placeholder="请输入取消理由"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="handleCancel()">
              确认
            </el-button>
            <el-button @click="closePopover('cancel', cancelFormRef)"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover> -->
    <!-- 【再次提交】 按钮-->
    <!-- <div
      @click="handleReCreate()"
      class="hover-bg-gray-100 rounded-xl p-6px"
      v-if="
        userId === processInstance?.startUser?.id &&
        isEndProcessStatus(processInstance?.status) &&
        processDefinition?.formType === 10
      "
    >
      <Icon :size="14" icon="ep:refresh" />&nbsp; 再次提交
    </div> -->
  </div>

  <!-- 签名弹窗 -->
  <SignDialog ref="signRef" @success="handleSignFinish" />
</template>
<script lang="ts" setup>
import { setConfAndFields2 } from '@/utils/formCreate'
import * as TaskApi from '@/api/bpm/task'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import * as UserApi from '@/api/system/user'
import {
  NodeType,
  OPERATION_BUTTON_NAME,
  OperationButtonType,
  CandidateStrategy,
} from '@/components/SimpleProcessDesignerV2/src/consts'
import { BpmModelFormType, BpmProcessInstanceStatus } from '@/utils/constants'
import type { FormInstance, FormRules } from 'element-plus'
import SignDialog from './SignDialog.vue'
import { ElMessageBox } from 'element-plus'
import { isEmpty } from '@/utils/is'
import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'
import ApprovalPersonnel from './components/ApprovalPersonnel.vue'
import { UserVO } from '@/api/system/user'
// import UserSelectFormRadio from '@/components/UserSelectFormRadio/index.vue'
import { useMessage } from '@/hooks/web/useMessage'
defineOptions({ name: 'ProcessInstanceBtnContainer' })
const router = useRouter() // 路由
const { push } = useRouter()
const message = useMessage() // 消息弹窗

const emit = defineEmits(['success', 'handleLoading']) // 定义 success 事件，用于操作成功后的回调

const props = defineProps<{
  processInstance: any // 流程实例信息
  processDefinition: any // 流程定义信息
  userOptions: UserApi.UserVO[]
  normalForm: any // 流程表单 formCreate
  normalFormApi: any // 流程表单 formCreate Api
  writableFields: string[] // 流程表单可以编辑的字段
  writableFieldsCopy: any[] // 流程表单选人字段
  editType: number // 编辑类型  0:查看 1:编辑
  aTab: string // 流程表单的 aTab
  firstTimeEditSubmit: boolean // 是否是第一次编辑提交
  opinion: string // 处理意见
  isManual: boolean // 是否手动更改销售配置
  taskType: any // 节点类型
  areaSaleRelease: any // 区域销售审批信息
  pageIndex: any // 当前页码
  approveUser: any[]
  mainEnginePlantsUser: any[]
  isMainEnginePlants: boolean
  currentOperationType: string
}>()
const approveUser = ref<any>([])
const userOptions = ref<UserApi.UserVO[]>([])
const userSelectFormRef = ref(null)
const currentOperationType = ref('')
const addSignUser = ref<any>([])
// 用户选择回显
const handleSelectUser = () => {
  let list = []
  if (approveUser.value.length > 0) {
    list = approveUser.value
  }
  //通过当前操作类型区分转办和加签
  currentOperationType.value = 'transfer'
  userSelectFormRef.value.open(0, list)
}
// 用户选择确认
const handleUserSelectConfirm = (_, users: UserVO[]) => {
  if (currentOperationType.value === 'transfer') {
    if (users.length === 0) {
      window.message.error('请选择一位用户')
      return
    }
    if (users.length > 0) {
      window.message.success('选择成功')
    }
    transferForm.assigneeUserId = users[0].userId
    approveUser.value = users
  }
  if (currentOperationType.value === 'addSign') {
    if (users.length > 0) {
      window.message.success('选择成功')
    }
    addSignForm.addSignUserIds = users.map(user => user.userId)
    addSignUser.value = users
  }
}
const handleaddSignSelectUser = () => {
  let list = []
  // 将选中的用户添加到list 中
  if (addSignUser.value && addSignUser.value.length > 0) {
    list = addSignUser.value
  }
  //通过当前操作类型区分转办和加签
  currentOperationType.value = 'addSign'
  userSelectFormRef.value.open(0, list)
}
// 移除加签对象的处
const handleRemoveUser = userId => {
  // 从 addSignUser 中移除
  addSignUser.value = addSignUser.value.filter(user => user.userId !== userId)

  // 同步更新 addSignForm.addSignUserIds
  addSignForm.addSignUserIds = addSignForm.addSignUserIds.filter(id => id !== userId)
}
const formLoading = ref(false) // 表单加载中
const popOverVisible = ref({
  approve: false,
  reject: false,
  transfer: false,
  delegate: false,
  addSign: false,
  return: false,
  copy: false,
  cancel: false,
  deleteSign: false,
}) // 气泡卡是否展示
const returnList = ref([] as any) // 退回节点

// ========== 审批信息 ==========
const runningTask = ref<any>() // 运行中的任务
const approveForm = ref<any>({}) // 审批通过时，额外的补充信息
const approveFormFApi = ref<any>({}) // approveForms 的 fAPi
const nodeTypeName = ref('审批') // 节点类型名称
const subButton = ref<boolean>(true) // 是否显示子按钮
const cancelFlag = computed(() => {
  if (
    props.processInstance.formVariables?.salesRole == '' ||
    props.processInstance.formVariables?.salesRole === false
  ) {
    return true
  } else {
    return false
  }
}) // 是否显示取消按钮

// 审批通过意见表单
const reasonRequire = ref()
const approveFormRef = ref<FormInstance>()
const signRef = ref()
const approveSignFormRef = ref()
const nextAssigneesActivityNode = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([]) // 下一个审批节点信息
const approveReasonForm = reactive({
  reason: '',
  signPicUrl: '',
  nextAssignees: {},
})
const approveReasonRule = computed(() => {
  return {
    reason: [{ required: reasonRequire.value, message: nodeTypeName + '意见不能为空', trigger: 'blur' }],
    signPicUrl: [{ required: true, message: '签名不能为空', trigger: 'change' }],
    nextAssignees: [{ required: true, message: '审批人不能为空', trigger: 'blur' }],
  }
})

// 拒绝表单
const rejectFormRef = ref<FormInstance>()
const rejectReasonForm = reactive({
  reason: '',
})
const rejectReasonRule = computed(() => {
  return {
    reason: [{ required: reasonRequire.value, message: '审批意见不能为空', trigger: 'blur' }],
  }
})

// 抄送表单
const copyFormRef = ref<FormInstance>()
const copyForm = reactive({
  copyUserIds: [],
  copyReason: '',
})
const copyFormRule = reactive<FormRules<typeof copyForm>>({
  copyUserIds: [{ required: true, message: '抄送人不能为空', trigger: 'change' }],
})

// 转办表单
const transferFormRef = ref<FormInstance>()
const transferForm = reactive({
  assigneeUserId: undefined,
  reason: '',
})
const transferFormRule = reactive<FormRules<typeof transferForm>>({
  assigneeUserId: [{ required: true, message: '新审批人不能为空', trigger: 'change' }],
  reason: [{ required: true, message: '转办意见不能为空', trigger: 'blur' }],
})

// 委派表单
const delegateFormRef = ref<FormInstance>()
const delegateForm = reactive({
  delegateUserId: undefined,
  reason: '',
})
const delegateFormRule = reactive<FormRules<typeof delegateForm>>({
  delegateUserId: [{ required: true, message: '接收人不能为空', trigger: 'change' }],
  reason: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
})

// 加签表单
const addSignFormRef = ref<FormInstance>()
const addSignForm = reactive({
  addSignUserIds: undefined,
  reason: '',
})
const addSignFormRule = reactive<FormRules<typeof addSignForm>>({
  addSignUserIds: [{ required: true, message: '加签处理人不能为空', trigger: 'change' }],
  reason: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
})

// 减签表单
const deleteSignFormRef = ref<FormInstance>()
const deleteSignForm = reactive({
  deleteSignTaskId: undefined,
  reason: '',
})
const deleteSignFormRule = reactive<FormRules<typeof deleteSignForm>>({
  deleteSignTaskId: [{ required: true, message: '减签人员不能为空', trigger: 'change' }],
  reason: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
})

// 退回表单
const returnFormRef = ref<FormInstance>()
const returnForm = reactive({
  targetTaskDefinitionKey: undefined,
  returnReason: '',
})
const returnFormRule = reactive<FormRules<typeof returnForm>>({
  targetTaskDefinitionKey: [{ required: true, message: '退回节点不能为空', trigger: 'change' }],
  returnReason: [{ required: true, message: '退回理由不能为空', trigger: 'blur' }],
})

// 取消表单
const cancelFormRef = ref<FormInstance>()
const cancelForm = reactive({
  cancelReason: '',
})
const cancelFormRule = reactive<FormRules<typeof cancelForm>>({
  cancelReason: [{ required: true, message: '取消理由不能为空', trigger: 'blur' }],
})

/** 监听 approveFormFApis，实现它对应的 form-create 初始化后，隐藏掉对应的表单提交按钮 */
watch(
  () => approveFormFApi.value,
  val => {
    val?.btn?.show(false)
    val?.resetBtn?.show(false)
  },
  {
    deep: true,
  },
)

const handleGoBack = () => {
  if (props.pageIndex === '0') {
    history.back()
    return
  }
  push({
    name: 'Home',
    query: {
      aTab: props.aTab,
      reface: '0',
      pageIndex: props.pageIndex,
    },
  })
}

/** 弹出气泡卡 */
const openPopover = async (type: string, buttonName: string) => {
  Object.keys(popOverVisible.value).forEach(item => {
    popOverVisible.value[item] = item === type
  })

  if (!taskId.value) {
    message.warning('任务ID不存在，无法执行操作!')
  }

  if (type === 'approve') {
    if (
      props.taskType === '主机厂技术主管审批' &&
      props.processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE
    ) {
      const variables = getUpdatedProcessInstanceVariables()
      if (!variables?.director) {
        message.error('请选择主机厂所长审批节点人员')
        return
      }
    } else {
      const valid2 = await validateUserForm()
      if (!valid2) {
        message.warning('请选择节点审批人!')
        return
      }
      // 校验流程表单
      const valid = await validateNormalForm()
      const valid3 = await validateAreaSaleRelease()
      if (!valid || !valid3) {
        message.warning('表单校验不通过，请先完善表单!!')
        return
      }
    }
    // return
    initNextAssigneesFormField()

    await ElMessageBox.confirm('确认 ' + getButtonDisplayName(OperationButtonType.APPROVE) + ' 操作吗？', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        emit('handleLoading', true)
        //调用提交接口
        handleAudit(true, approveFormRef.value)
      })
      .catch(() => {
        emit('handleLoading', false)
      })
  }
  if (type === 'return') {
    // 获取退回节点
    returnList.value = await TaskApi.getTaskListByReturn(runningTask.value.id)
    if (returnList.value.length === 0) {
      message.warning('当前没有可退回的节点')
      return
    }
  }

  // 驳回
  if (type === 'reject') {
    const regectLabel = getButtonDisplayName(OperationButtonType.REJECT)
    if (!props.opinion && !regectLabel?.includes('解算')) {
      message.error('处理意见不能为空！')
      return
    }

    if (
      props.taskType === '主机厂技术主管审批' &&
      props.processInstance.formVariables?.PROCESS_BUSINESS_TYPE ===
        BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_CHANGE
    ) {
      const variables = getUpdatedProcessInstanceVariables()
      if (!variables?.drafter) {
        message.error('请选择编制节点人员')
        return
      }
    }

    await ElMessageBox.confirm('确认 ' + getButtonDisplayName(OperationButtonType.REJECT) + ' 操作吗？', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        emit('handleLoading', true)
        //调用提交接口
        handleAudit(false, rejectFormRef.value)
      })
      .catch(() => {
        emit('handleLoading', false)
      })
  }

  // await nextTick()
  // formRef.value.resetFields()
}

/**
 * 验证区域销售发布的有效性
 *
 * @returns {boolean} 返回布尔值，表示验证结果。如果验证通过，则返回true；否则返回false。
 */
const validateAreaSaleRelease = () => {
  let falg = true
  if (['标配Mbom确认', '重新推送', '正式发布', '工艺审核', '研发审核'].includes(props.taskType)) {
    if (props.taskType === '标配Mbom确认') {
      if (props.areaSaleRelease.areaSaleRelease_genStMbomConfirm === null) {
        falg = false
      }
    }

    if (props.taskType === '重新推送') {
      if (props.areaSaleRelease.areaSaleRelease_rePushScpStMbomPre === null) {
        falg = false
      }
    }

    if (props.taskType === '正式发布') {
      if (props.areaSaleRelease.areaSaleRelease_officiallyReleased === null) {
        falg = false
      }
    }

    // if (props.taskType === '工艺审核') {
    //   if (props.areaSaleRelease.processOwnerToAdmin === null) {
    //     falg = false
    //   }
    // }

    if (props.taskType === '研发审核') {
      if (props.areaSaleRelease.rdOwnerToAdmin === null) {
        falg = false
      }
    }
  }
  return falg
}

/** 关闭气泡卡 */
const closePopover = (type: string, formRef: FormInstance | undefined) => {
  if (formRef) {
    formRef.resetFields()
  }
  popOverVisible.value[type] = false
  nextAssigneesActivityNode.value = []
}

/** 流程通过时，根据表单变量查询新的流程节点，判断下一个节点类型是否为自选审批人 */
const initNextAssigneesFormField = async () => {
  // 获取修改的流程变量, 暂时只支持流程表单
  const variables = getUpdatedProcessInstanceVariables()
  const data = await ProcessInstanceApi.getNextApprovalNodes({
    processInstanceId: props.processInstance.id,
    taskId: runningTask.value.id,
    processVariablesStr: JSON.stringify(variables),
  })
  if (data && data.length > 0) {
    data.forEach((node: any) => {
      if (
        // 情况一：当前节点没有审批人，并且是发起人自选
        (isEmpty(node.tasks) &&
          isEmpty(node.candidateUsers) &&
          CandidateStrategy.START_USER_SELECT === node.candidateStrategy) ||
        // 情况二：当前节点是审批人自选
        CandidateStrategy.APPROVE_USER_SELECT === node.candidateStrategy
      ) {
        nextAssigneesActivityNode.value.push(node)
      }
    })
  }
}

/** 选择下一个节点的审批人 */
const selectNextAssigneesConfirm = (id: string, userList: any[]) => {
  approveReasonForm.nextAssignees[id] = userList?.map((item: any) => item.id)
}
/** 审批通过时，校验每个自选审批人的节点是否都已配置了审批人 */
const validateNextAssignees = () => {
  if (Object.keys(nextAssigneesActivityNode.value).length === 0) {
    return true
  }
  // 如果需要自选审批人，则校验每个节点是否都已配置审批人
  for (const item of nextAssigneesActivityNode.value) {
    if (isEmpty(approveReasonForm.nextAssignees[item.id])) {
      message.warning('下一个节点的审批人不能为空!')
      return false
    }
  }
  return true
}

/** 处理审批通过和不通过的操作 */
const handleAudit = async (pass: boolean, formRef: FormInstance | undefined) => {
  formLoading.value = true
  try {
    // 校验表单
    // if (!formRef) return
    // await formRef.validate()
    // 校验流程表单必填字段
    const valid = await validateNormalForm()
    if (!valid) {
      emit('handleLoading', false)
      message.warning('表单校验不通过，请先完善表单!!')
      return
    }

    if (pass) {
      const nextAssigneesValid = validateNextAssignees()
      if (!nextAssigneesValid) return
      const variables = getUpdatedProcessInstanceVariables()

      // 审批通过数据
      const data = {
        id: taskId.value ? taskId.value : props.processInstance.id,
        reason: props.opinion,
        variables, // 审批通过, 把修改的字段值赋于流程实例变量
        nextAssignees: approveReasonForm.nextAssignees, // 下个自选节点选择的审批人信息
        firstTimeEditSubmit: props.firstTimeEditSubmit, // 是否是第一次编辑提交
      } as any
      // 签名
      if (runningTask.value.signEnable) {
        data.signPicUrl = approveReasonForm.signPicUrl
      }

      data.variables.ManualChange = props.isManual

      // 多表单处理，并且有额外的 approveForm 表单，需要校验 + 拼接到 data 表单里提交
      // TODO 芋艿 任务有多表单这里要如何处理，会和可编辑的字段冲突
      const formCreateApi = approveFormFApi.value
      if (Object.keys(formCreateApi)?.length > 0) {
        await formCreateApi.validate()
        // @ts-ignore
        data.variables = approveForm.value.value
      }
      await TaskApi.approveTask(data)
      popOverVisible.value.approve = false
      subButton.value = false
      nextAssigneesActivityNode.value = []
      emit('handleLoading', false)
      message.success('审批成功')
      handleGoBack()
    } else {
      const variables = getUpdatedProcessInstanceVariables()

      // 审批不通过数据
      const data = {
        id: taskId.value,
        reason: props.opinion,
        variables,
      }
      await TaskApi.rejectTask(data)
      popOverVisible.value.reject = false
      subButton.value = false
      emit('handleLoading', false)
      const regectLabel = getButtonDisplayName(OperationButtonType.REJECT)
      message.success(regectLabel?.includes('解算') ? '重新解算成功' : '提交成功')
      //重新结算的需要等待，不跳回列表

      if (regectLabel?.includes('解算')) {
        return
      }
      handleGoBack()
    }
    // 重置表单
    // formRef.resetFields()
    // 加载最新数据
    reload()
  } finally {
    emit('handleLoading', false)
    formLoading.value = false
  }
}

/** 校验流程表单 */
const validateUserForm = async (): Promise<boolean> => {
  let flag = true
  const list = props.writableFieldsCopy
  list.forEach(item => {
    const obj = item
    for (var key in item) {
      if (!obj[key]) {
        flag = false
        return
      }
    }
  })
  return flag
}

/** 处理抄送 */
const handleCopy = async () => {
  formLoading.value = true
  try {
    // 1. 校验表单
    if (!copyFormRef.value) return
    await copyFormRef.value.validate()
    // 2. 提交抄送
    const data = {
      id: runningTask.value.id,
      reason: copyForm.copyReason,
      copyUserIds: copyForm.copyUserIds,
    }
    await TaskApi.copyTask(data)
    copyFormRef.value.resetFields()
    popOverVisible.value.copy = false
    message.success('操作成功')
  } finally {
    formLoading.value = false
  }
}

/** 处理转办 */
const handleTransfer = async () => {
  formLoading.value = true
  try {
    // 1.1 校验表单
    if (!transferFormRef.value) return
    await transferFormRef.value.validate()
    // 1.2 提交转交
    const data = {
      id: runningTask.value.id,
      reason: transferForm.reason,
      assigneeUserId: transferForm.assigneeUserId,
    }
    await TaskApi.transferTask(data)
    transferFormRef.value.resetFields()
    popOverVisible.value.transfer = false
    message.success('操作成功')
    // 2. 加载最新数据
    reload()
  } finally {
    formLoading.value = false
  }
}

/** 处理委派 */
const handleDelegate = async () => {
  formLoading.value = true
  try {
    // 1.1 校验表单
    if (!delegateFormRef.value) return
    await delegateFormRef.value.validate()
    // 1.2 处理委派
    const data = {
      id: runningTask.value.id,
      reason: delegateForm.reason,
      delegateUserId: delegateForm.delegateUserId,
    }

    await TaskApi.delegateTask(data)
    popOverVisible.value.delegate = false
    delegateFormRef.value.resetFields()
    message.success('操作成功')
    // 2. 加载最新数据
    reload()
  } finally {
    formLoading.value = false
  }
}

/** 处理加签 */
const handlerAddSign = async (type: string) => {
  formLoading.value = true
  try {
    // 1.1 校验表单
    if (!addSignFormRef.value) return
    await addSignFormRef.value.validate()
    // 1.2 提交加签
    const data = {
      id: runningTask.value.id,
      type,
      reason: addSignForm.reason,
      userIds: addSignForm.addSignUserIds,
    }
    await TaskApi.signCreateTask(data)
    message.success('操作成功')
    addSignFormRef.value.resetFields()
    popOverVisible.value.addSign = false
    // 2 加载最新数据
    reload()
  } finally {
    formLoading.value = false
  }
}

/** 处理退回 */
const handleReturn = async () => {
  formLoading.value = true
  try {
    // 1.1 校验表单
    if (!returnFormRef.value) return
    await returnFormRef.value.validate()
    // 1.2 提交退回
    const data = {
      id: runningTask.value.id,
      reason: returnForm.returnReason,
      targetTaskDefinitionKey: returnForm.targetTaskDefinitionKey,
    }

    await TaskApi.returnTask(data)
    popOverVisible.value.return = false
    returnFormRef.value.resetFields()
    message.success('操作成功')
    // 2 重新加载数据
    reload()
  } finally {
    formLoading.value = false
  }
}

/** 处理取消 */
const handleCancel = async () => {
  if (!props.opinion) {
    message.error('处理意见不能为空！')
    return
  }
  await ElMessageBox.confirm('是否取消当前审批流程', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      //调用取消流程接口
      // return
      await ProcessInstanceApi.cancelProcessInstanceByStartUser(props.processInstance.id, props.opinion)
      message.success('取消成功')
      push({
        name: 'Home',
        query: {
          aTab: props.aTab,
          pageIndex: props.pageIndex,
        },
      })
    })
    .catch(() => {})
}

/** 处理再次提交 */
const handleReCreate = async () => {
  // 跳转发起流程界面
  await router.push({
    name: 'BpmProcessInstanceCreate',
    query: { processInstanceId: props.processInstance?.id },
  })
}

/** 获取减签人员标签 */
const getDeleteSignUserLabel = (task: any): string => {
  const deptName = task?.assigneeUser?.deptName || task?.ownerUser?.deptName
  const nickname = task?.assigneeUser?.nickname || task?.ownerUser?.nickname
  return `{nickname} ( 所属部门：{deptName} )`
}
/** 处理减签 */
const handlerDeleteSign = async () => {
  formLoading.value = true
  try {
    // 1.1 校验表单
    if (!deleteSignFormRef.value) return
    await deleteSignFormRef.value.validate()
    // 1.2 提交减签
    const data = {
      id: deleteSignForm.deleteSignTaskId,
      reason: deleteSignForm.reason,
    }
    await TaskApi.signDeleteTask(data)
    message.success('减签成功')
    deleteSignFormRef.value.resetFields()
    popOverVisible.value.deleteSign = false
    // 2 加载最新数据
    reload()
  } finally {
    formLoading.value = false
  }
}
/** 重新加载数据 */
const reload = () => {
  emit('success')
}

/** 任务是否为处理中状态 */
const isHandleTaskStatus = () => {
  let canHandle = false
  if (TaskApi.TaskStatusEnum.RUNNING === runningTask.value?.status) {
    canHandle = true
  }
  return canHandle
}

/** 流程状态是否为结束状态 */
const isEndProcessStatus = (status: number) => {
  let isEndStatus = false
  if (
    BpmProcessInstanceStatus.APPROVE === status ||
    BpmProcessInstanceStatus.REJECT === status ||
    BpmProcessInstanceStatus.CANCEL === status
  ) {
    isEndStatus = true
  }
  return isEndStatus
}

/** 是否显示按钮 */
const isShowButton = (btnType: OperationButtonType): boolean => {
  let isShow = true
  if (runningTask.value?.buttonsSetting && runningTask.value?.buttonsSetting[btnType]) {
    isShow = runningTask.value.buttonsSetting[btnType].enable
  }
  if (props.editType === 0) {
    isShow = false
  }

  //console.log('isShowButton1111', btnType, isShow)
  return isShow
}

/** 获取按钮的显示名称 */
const getButtonDisplayName = (btnType: OperationButtonType) => {
  let displayName = OPERATION_BUTTON_NAME.get(btnType)
  if (runningTask.value?.buttonsSetting && runningTask.value?.buttonsSetting[btnType]) {
    displayName = runningTask.value.buttonsSetting[btnType].displayName
  }
  return displayName
}

const taskId = ref<any>('')

const loadTodoTask = (task: any, id: any) => {
  approveForm.value = {}
  runningTask.value = task
  taskId.value = id
  approveFormFApi.value = {}
  reasonRequire.value = task?.reasonRequire ?? false
  nodeTypeName.value = task?.nodeType === NodeType.TRANSACTOR_NODE ? '办理' : '审批'

  // 添加按钮配置转换逻辑
  if (task?.buttonsSetting && Array.isArray(task.buttonsSetting)) {
    // 将数组转换为对象，以按钮类型为键
    const buttonsSettingObj = {}
    task.buttonsSetting.forEach(button => {
      buttonsSettingObj[button.id] = button
    })
    runningTask.value.buttonsSetting = buttonsSettingObj
  }

  // 处理 approve 表单.
  if (task && task.formId && task.formConf) {
    const tempApproveForm = {}
    setConfAndFields2(tempApproveForm, task.formConf, task.formFields, task.formVariables)
    approveForm.value = tempApproveForm
  } else {
    approveForm.value = {} // 占位，避免为空
  }
}

/** 校验流程表单 */
const validateNormalForm = async () => {
  if (props.processDefinition?.formType === BpmModelFormType.NORMAL) {
    let valid = true
    try {
      await props.normalFormApi?.validate()
    } catch {
      valid = false
    }
    return valid
  } else {
    return true
  }
}

/** 从可以编辑的流程表单字段，获取需要修改的流程实例的变量 */
const getUpdatedProcessInstanceVariables = () => {
  const variables = {}
  props.writableFields.forEach(field => {
    variables[field] = props.normalFormApi.getValue(field)
  })

  // 选择的人员字段
  props.writableFieldsCopy.forEach(field => {
    variables[Object.keys(field)[0]] = field[Object.keys(field)[0]]
  })

  // 区域销售状态
  if (['标配Mbom确认', '重新推送', '正式发布', '工艺审核', '研发审核'].includes(props.taskType)) {
    if (props.taskType === '标配Mbom确认') {
      if (props.areaSaleRelease.areaSaleRelease_genStMbomConfirm !== null) {
        variables['areaSaleRelease_genStMbomConfirm'] = props.areaSaleRelease?.areaSaleRelease_genStMbomConfirm
      }
    }
    if (props.taskType === '重新推送') {
      if (props.areaSaleRelease.areaSaleRelease_rePushScpStMbomPre !== null) {
        variables['areaSaleRelease_rePushScpStMbomPre'] = props.areaSaleRelease?.areaSaleRelease_rePushScpStMbomPre
      }
    }

    if (props.taskType === '正式发布') {
      if (props.areaSaleRelease.areaSaleRelease_officiallyReleased !== null) {
        variables['areaSaleRelease_officiallyReleased'] = props.areaSaleRelease?.areaSaleRelease_officiallyReleased
      }
    }
    if (props.taskType === '研发审核') {
      variables['rdOwnerToAdmin'] = props.areaSaleRelease?.rdOwnerToAdmin
    }

    if (props.taskType === '工艺审核') {
      variables['processOwnerToAdmin'] = props.areaSaleRelease?.processOwnerToAdmin
      variables['processOwnerToRdOwner'] = props.areaSaleRelease?.processOwnerToRdOwner
    }
  }

  return variables
}

/** 处理签名完成 */
const handleSignFinish = (url: string) => {
  approveReasonForm.signPicUrl = url
  approveSignFormRef.value.validate('change')
}

// const emits = defineEmits<{
//   (e: 'select-user', index: number, type: 'normal' | 'mainEngine'): void
// }>()

// const handleSelectUser = (index: number, type: 'normal' | 'mainEngine') => {
//   emit('select-user', index, type)
// }

defineExpose({ loadTodoTask })
</script>

<style lang="scss" scoped>
:deep(.el-affix--fixed) {
  background-color: var(--el-bg-color);
}

.btn-container {
  > div {
    display: flex;
    margin: 0 8px;
    cursor: pointer;
    align-items: center;

    &:hover {
      color: #6db5ff;
    }
  }
}
</style>
