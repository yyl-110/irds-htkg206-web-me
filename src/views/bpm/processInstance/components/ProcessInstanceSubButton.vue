<template>
  <div class="h-50px bottom-10 text-14px flex items-center color-#32373c dark:color-#fff font-bold btn-container">
    <el-button
      type="primary"
      @click="handleAudit(true, rejectFormRef)"
      class="m-r10px"
      v-if="editType === 1 && subButton">
      <Icon icon="ep:select" /> &nbsp; {{ '提交' }}
    </el-button>

    <el-button type="danger" @click="handleCancel" class="m-r10px" v-if="editType === 1 && subButton">
      <Icon icon="ep:close" />&nbsp; {{ '取消' }}
    </el-button>

    <el-button type="info" @click="handleGoBack"> <Icon :size="14" icon="ep:back" />&nbsp; {{ '关闭' }} </el-button>
  </div>
</template>
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { setConfAndFields2 } from '@/utils/formCreate'
import * as TaskApi from '@/api/bpm/task'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { NodeType, CandidateStrategy } from '@/components/SimpleProcessDesignerV2/src/consts'
import { BpmModelFormType } from '@/utils/constants'
import type { FormInstance } from 'element-plus'
import { isEmpty } from '@/utils/is'
import { pickWorkbenchReturnQueryFromRoute } from '@/views/workbench/workbenchRouteQuery'

defineOptions({ name: 'ProcessInstanceBtnContainer' })
import { useMessage } from '@/hooks/web/useMessage'
const router = useRouter() // 路由
const route = useRoute()
const { push } = useRouter()
const message = useMessage() // 消息弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const props = defineProps<{
  processInstance: any // 流程实例信息
  processDefinition: any // 流程定义信息
  normalForm: any // 流程表单 formCreate
  normalFormApi: any // 流程表单 formCreate Api
  writableFields: string[] // 流程表单可以编辑的字段
  editType: number // 编辑类型  0:查看 1:编辑
  aTab: string // 流程表单的 aTab
  firstTimeEditSubmit: boolean // 是否是第一次编辑提交
  opinion: any // 处理意见
  taskType: any // 节点类型
  areaSaleRelease: any // 区域销售审批信息
  pageIndex: any // 当前页码
}>()

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

// ========== 审批信息 ==========
const runningTask = ref<any>() // 运行中的任务
const approveForm = ref<any>({}) // 审批通过时，额外的补充信息
const approveFormFApi = ref<any>({}) // approveForms 的 fAPi
const nodeTypeName = ref('审批') // 节点类型名称
const subButton = ref<boolean>(true) // 是否显示子按钮

// 审批通过意见表单
const reasonRequire = ref()
const nextAssigneesActivityNode = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([]) // 下一个审批节点信息
const approveReasonForm = reactive({
  reason: '',
  signPicUrl: '',
  nextAssignees: {},
})

// 拒绝表单
const rejectFormRef = ref<FormInstance>()
const rejectReasonForm = reactive({
  reason: '',
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
      await ProcessInstanceApi.cancelProcessInstanceByStartUser(props.processInstance.id, props.opinion)
      message.success('取消成功')
      push({
        name: '/home/workbench',
        query: pickWorkbenchReturnQueryFromRoute(route.query),
      })
    })
    .catch(() => {})
}

const handleGoBack = () => {
  const query = pickWorkbenchReturnQueryFromRoute(route.query)
  push({
    name: '/home/workbench',
    query: Object.keys(query).length ? query : { activeName: 'process' },
  })
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
    const valid = await validateUserForm()
    if (!valid) {
      message.warning('请选择节点审批人!')
      return
    }

    const valid3 = await validateAreaSaleRelease()
    if (!valid3) {
      message.warning('表单校验不通过，请先完善表单!!')
      return
    }

    if (pass) {
      const nextAssigneesValid = validateNextAssignees()
      if (!nextAssigneesValid) return
      const variables = getUpdatedProcessInstanceVariables()
      // 审批通过数据
      const data = {
        id: taskId.value, //runningTask.value.id
        reason: '编制任务提交',
        variables, // 审批通过, 把修改的字段值赋于流程实例变量
        nextAssignees: approveReasonForm.nextAssignees, // 下个自选节点选择的审批人信息
        firstTimeEditSubmit: props.firstTimeEditSubmit,
      } as any
      // 签名
      if (runningTask.value.signEnable) {
        data.signPicUrl = approveReasonForm.signPicUrl
      }
      // 多表单处理，并且有额外的 approveForm 表单，需要校验 + 拼接到 data 表单里提交
      // TODO 芋艿 任务有多表单这里要如何处理，会和可编辑的字段冲突
      const formCreateApi = approveFormFApi.value
      if (Object.keys(formCreateApi)?.length > 0) {
        await formCreateApi.validate()
        // @ts-ignore
        data.variables = approveForm.value.value
      }
      console.log(data)
      await TaskApi.approveTask(data)
      popOverVisible.value.approve = false
      subButton.value = false
      nextAssigneesActivityNode.value = []
      message.success('审批通过成功')
      handleGoBack()
    } else {
      // 审批不通过数据
      const data = {
        id: taskId.value, // runningTask.value.id,
        reason: rejectReasonForm.reason,
      }
      await TaskApi.rejectTask(data)
      popOverVisible.value.reject = false
      subButton.value = false
      message.success('审批不通过成功')
    }
    // 加载最新数据
    reload()
  } finally {
    formLoading.value = false
  }
}

/**
 * 验证区域销售发布的有效性
 *
 * @returns {boolean} 返回布尔值，表示验证结果。如果验证通过，则返回true；否则返回false。
 */
const validateAreaSaleRelease = () => {
  let falg = true
  if (['标配Mbom确认', '重新推送', '正式发布'].includes(props.taskType)) {
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
  }
  return falg
}

/** 重新加载数据 */
const reload = () => {
  emit('success')
}

const taskId = ref<any>('')

const loadTodoTask = (task: any, id: any) => {
  approveForm.value = {}
  runningTask.value = task
  taskId.value = id
  approveFormFApi.value = {}
  reasonRequire.value = task?.reasonRequire ?? false
  nodeTypeName.value = task?.nodeType === NodeType.TRANSACTOR_NODE ? '办理' : '审批'
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

/** 校验流程表单 */
const validateUserForm = async (): Promise<boolean> => {
  let flag = true
  const list = props.writableFields
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

/** 从可以编辑的流程表单字段，获取需要修改的流程实例的变量 */
const getUpdatedProcessInstanceVariables = () => {
  const variables = {}
  props.writableFields.forEach(field => {
    variables[Object.keys(field)[0]] = field[Object.keys(field)[0]]
  })

  // 区域销售状态
  if (['标配Mbom确认', '重新推送', '正式发布'].includes(props.taskType)) {
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
  }

  return variables
}

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
