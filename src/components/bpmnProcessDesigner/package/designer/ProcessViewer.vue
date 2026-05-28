<template>
  <div class="process-viewer">
    <div style="height: 100%" ref="processCanvas" v-show="!isLoading"></div>

    <!-- 悬浮提示框 -->
    <div
      v-if="hoverTooltip.visible"
      class="bpmn-hover-tooltip"
      :style="{
        left: hoverTooltip.x + 'px',
        top: hoverTooltip.y + 'px',
      }"
      @mouseenter="onTooltipMouseEnter"
      @mouseleave="onTooltipMouseLeave">
      <div class="tooltip-header">
        <span class="tooltip-title">{{ hoverTooltip.title }}</span>
        <el-tag v-if="hoverTooltip.status !== undefined" :type="getTaskStatusType(hoverTooltip.status)" size="small">
          <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="hoverTooltip.status" />
        </el-tag>
        <el-tag v-else-if="hoverTooltip.taskType" type="info" size="small">
          {{ hoverTooltip.taskType }}
        </el-tag>
      </div>
      <div class="tooltip-content">
        <!-- 审批任务相关信息 -->
        <div class="tooltip-item" v-if="hoverTooltip.assignee">
          <span class="label">审批人:</span>
          <span class="value">{{ hoverTooltip.assignee }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.dept">
          <span class="label">部门:</span>
          <span class="value">{{ hoverTooltip.dept }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.startTime">
          <span class="label">开始时间:</span>
          <span class="value">{{ hoverTooltip.startTime }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.endTime">
          <span class="label">结束时间:</span>
          <span class="value">{{ hoverTooltip.endTime }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.duration">
          <span class="label">耗时:</span>
          <span class="value">{{ hoverTooltip.duration }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.reason">
          <span class="label">审批建议:</span>
          <span class="value reason">{{ hoverTooltip.reason }}</span>
        </div>

        <!-- 服务任务相关信息 -->
        <div class="tooltip-item" v-if="hoverTooltip.executeType">
          <span class="label">执行类型:</span>
          <span class="value">{{ hoverTooltip.executeType }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.executeValue">
          <span class="label">执行值:</span>
          <span class="value code">{{ hoverTooltip.executeValue }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.serviceStartTime">
          <span class="label">开始时间:</span>
          <span class="value">{{ hoverTooltip.serviceStartTime }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.serviceEndTime">
          <span class="label">结束时间:</span>
          <span class="value">{{ hoverTooltip.serviceEndTime }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.serviceDuration">
          <span class="label">执行耗时:</span>
          <span class="value">{{ hoverTooltip.serviceDuration }}</span>
        </div>
        <div class="tooltip-item" v-if="hoverTooltip.serviceStatus">
          <span class="label">执行状态:</span>
          <span class="value" :class="getServiceStatusClass(hoverTooltip.serviceStatus)">{{
            hoverTooltip.serviceStatus
          }}</span>
        </div>

        <div class="tooltip-footer" v-if="hoverTooltip.taskCount > 1">
          <el-icon><InfoFilled /></el-icon>
          <span>共 {{ hoverTooltip.taskCount }} 条记录，点击查看详情</span>
        </div>
      </div>
    </div>

    <!-- 自定义箭头样式，用于已完成状态下流程连线箭头 -->
    <defs ref="customDefs">
      <marker
        id="sequenceflow-end-white-success"
        viewBox="0 0 20 20"
        refX="11"
        refY="10"
        markerWidth="10"
        markerHeight="10"
        orient="auto">
        <path
          class="success-arrow"
          d="M 1 5 L 11 10 L 1 15 Z"
          style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1" />
      </marker>
      <marker
        id="conditional-flow-marker-white-success"
        viewBox="0 0 20 20"
        refX="-1"
        refY="10"
        markerWidth="10"
        markerHeight="10"
        orient="auto">
        <path
          class="success-conditional"
          d="M 0 10 L 8 6 L 16 10 L 8 14 Z"
          style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1" />
      </marker>
    </defs>

    <!-- 审批记录 -->
    <el-dialog :title="dialogTitle || '审批记录'" v-model="dialogVisible" width="1150px">
      <el-row>
        <el-table :data="selectTasks" size="small" border header-cell-class-name="table-header-gray">
          <el-table-column label="序号" header-align="center" align="center" type="index" width="50" />
          <el-table-column label="审批人" min-width="100" align="center" v-if="selectActivityType === 'bpmn:UserTask'">
            <template #default="scope">
              {{ scope.row.assigneeUser?.nickname || scope.row.ownerUser?.nickname }}
            </template>
          </el-table-column>
          <el-table-column label="发起人" prop="assigneeUser.nickname" min-width="100" align="center" v-else />
          <el-table-column label="部门" min-width="100" align="center">
            <template #default="scope">
              {{ scope.row.assigneeUser?.deptName || scope.row.ownerUser?.deptName }}
            </template>
          </el-table-column>
          <el-table-column
            :formatter="dateFormatter"
            align="center"
            label="开始时间"
            prop="createTime"
            min-width="140" />
          <el-table-column :formatter="dateFormatter" align="center" label="结束时间" prop="endTime" min-width="140" />
          <el-table-column align="center" label="审批状态" prop="status" min-width="90">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="审批建议"
            prop="reason"
            min-width="120"
            v-if="selectActivityType === 'bpmn:UserTask'" />
          <el-table-column
            align="center"
            label="转办记录"
            prop="transferRecords"
            min-width="120"
            v-if="selectActivityType === 'bpmn:UserTask'">
            <template #default="scope">
              {{ scope.row.transferRecords }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="耗时" prop="durationInMillis" width="100">
            <template #default="scope">
              {{ formatPast2(scope.row.durationInMillis) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160">
            <template #default="scope">
              <div style="display: flex">
                <el-button link type="primary" @click="showTaskVariables(scope.row)">任务变量</el-button>
                <!-- <el-button link type="primary" @click="showTaskLog(scope.row)">转办</el-button> -->
                <!-- v-if="showTransferButton && isShowButton(OperationButtonType.TRANSFER) && showTransferBtn" -->
                <div
                  @click="openPopover('transfer', scope.row, scope.$index)"
                  class="hover-bg-gray-100 rounded-xl ml-16px"
                  v-if="showTransferBtn && isHandleTaskStatus(scope.row)">
                  <Icon :size="14" icon="fa:share-square-o" />&nbsp;
                  {{ getButtonDisplayName(OperationButtonType.TRANSFER) }}
                </div>
              </div>
              <!-- <el-popover
                :visible="popOverVisible[scope.$index].transfer && isHandleTaskStatus(scope.row) && showTransferBtn"
                placement="top-start"
                :width="420"
                trigger="click"
                :loading="checkingPermission"
              >
                <template #reference>
                  <div @click="openPopover('transfer',scope.row,scope.$index)" class="hover-bg-gray-100 rounded-xl p-6px">
                    <Icon :size="14" icon="fa:share-square-o" />&nbsp;
                    {{ getButtonDisplayName(OperationButtonType.TRANSFER) }}---
                  </div>
                </template>
                <div class="flex flex-col flex-1 pt-20px px-20px" v-loading="formLoading">
                  <el-form
                    label-position="top"
                    class="mb-auto"
                    ref="transferFormRef"
                    :model="transferForm"
                    :rules="transferFormRule"
                    label-width="100px"
                  >
                    <el-form-item label="新审批人" prop="assigneeUserId">
                      <el-button type="info"  @click="handleSelectUser"  v-if="editType === 1">
                          {{ $t('选择转办对象') }}
                        </el-button>
                        <div v-if="transferForm.assigneeUserId" class="ml-10px">
                        <el-tag>
                          {{approveUser[0].psnName}}
                        </el-tag>
                        </div>
                    </el-form-item>
                    <el-form-item label="审批意见" prop="reason">
                      {{ transferForm }}--
                      <el-input
                        v-model="transferForm.reason"
                        clearable
                        placeholder="请输入审批意见"
                        type="textarea"
                        :rows="3"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button :disabled="formLoading" type="primary" @click="handleTransfer(scope.$index)">
                        {{ getButtonDisplayName(OperationButtonType.TRANSFER) }}
                      </el-button>
                      <el-button @click="closePopover('transfer', transferFormRef,scope.$index)"> 取消 </el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-popover> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>

    <el-dialog title="转办" v-model="transferVisible" width="600px">
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
              {{ $t('选择转办对象') }}
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
          <!-- <el-form-item>
              <el-button :disabled="formLoading" type="primary" @click="handleTransfer(scope.$index)">
                {{ getButtonDisplayName(OperationButtonType.TRANSFER) }}
              </el-button>
              <el-button @click="closePopover('transfer', transferFormRef,scope.$index)"> 取消 </el-button>
            </el-form-item> -->
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button :disabled="formLoading" type="primary" @click="handleTransfer(popIndex)">
            {{ getButtonDisplayName(OperationButtonType.TRANSFER) }}
          </el-button>
          <el-button @click="closePopover('transfer', transferFormRef, popIndex)"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 任务变量弹窗 -->
    <el-dialog title="任务变量" v-model="taskVariablesDialogVisible" width="800px" :close-on-click-modal="false">
      <div class="task-variables-container">
        <textarea
          v-model="taskVariablesContent"
          rows="20"
          cols="105"
          readonly
          placeholder="暂无任务变量数据"
          class="task-variables-textarea"></textarea>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="taskVariablesDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="copyTaskVariables">复制内容</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Zoom：放大、缩小 -->
    <div style="position: absolute; top: 0; left: 0; width: 100%">
      <el-row type="flex" justify="end">
        <el-button-group key="scale-control" size="default">
          <el-button
            size="default"
            :plain="true"
            :disabled="defaultZoom <= 0.3"
            :icon="ZoomOut"
            @click="processZoomOut()" />
          <el-button size="default" style="width: 90px">
            {{ Math.floor(defaultZoom * 10 * 10) + '%' }}
          </el-button>
          <el-button
            size="default"
            :plain="true"
            :disabled="defaultZoom >= 3.9"
            :icon="ZoomIn"
            @click="processZoomIn()" />
          <el-button size="default" :icon="ScaleToOriginal" @click="processReZoom()" />
        </el-button-group>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import '../theme/index.scss'
import BpmnViewer from 'bpmn-js/lib/Viewer'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import { ZoomOut, ZoomIn, ScaleToOriginal, InfoFilled } from '@element-plus/icons-vue'
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter, formatPast2, formatPast2WithMs } from '@/utils/formatTime'
import { BpmProcessInstanceStatus } from '@/utils/constants'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import {
  NodeType,
  OPERATION_BUTTON_NAME,
  OperationButtonType,
  CandidateStrategy,
} from '@/components/SimpleProcessDesignerV2/src/consts'
import * as TaskApi from '@/api/bpm/task'
import { useMessage } from '@/hooks/web/useMessage'
// 导入用户store
import { useUserStore } from '@/store/modules/user'
// 导入流程转办配置
import transferConfigService, { TransferConfig } from '@/api/bpm/transferUtils'
const props = defineProps({
  xml: {
    type: String,
    required: true,
  },
  view: {
    type: Object,
    require: true,
  },
  approveUser: {
    type: Array as () => any[], // 规范数组类型定义（避免类型推断问题）
    default: () => [], // 非必填数组建议设置默认空数组，避免 undefined 问题
  },
  currentOperationType: {
    type: String,
    default: '', // 字符串类型建议设置默认空字符串
  },
  editType: {
    type: Number,
    default: 1, // 编辑类型  0:查看 1:编辑
  },
})

const processCanvas = ref()
const bpmnViewer = ref<BpmnViewer | null>(null)
const customDefs = ref()
const defaultZoom = ref(1) // 默认缩放比例
const isLoading = ref(false) // 是否加载中

const processInstance = ref<any>({}) // 流程实例
const tasks = ref([]) // 流程任务
const processDefinition = ref<any>({}) // 流程定义

const dialogVisible = ref(false) // 弹窗可见性
const dialogTitle = ref<string | undefined>(undefined) // 弹窗标题
const selectActivityType = ref<string | undefined>(undefined) // 选中 Task 的活动编号
const selectTasks = ref<any[]>([]) // 选中的任务数组

// 任务变量相关
const taskVariablesDialogVisible = ref(false) // 任务变量弹窗可见性
const taskVariablesContent = ref('') // 任务变量内容
const currentTask = ref<any>(null) // 当前选中的任务
const popOverState = {
  approve: false,
  reject: false,
  transfer: false,
  delegate: false,
  addSign: false,
  return: false,
  copy: false,
  cancel: false,
  deleteSign: false,
}
const popOverVisible = ref([]) // 气泡卡是否展示
// 悬浮提示相关
const hoverTooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  assignee: '',
  dept: '',
  startTime: '',
  endTime: '',
  duration: '',
  reason: '',
  status: undefined,
  taskCount: 0,
  taskType: '', // 任务类型标签（用于服务任务等）
  executeType: '', // 服务任务执行类型
  executeValue: '', // 服务任务执行值
  serviceStartTime: '', // 服务任务开始时间
  serviceEndTime: '', // 服务任务结束时间
  serviceDuration: '', // 服务任务执行耗时
  serviceStatus: '', // 服务任务执行状态
})
let hoverTimer: any = null // 悬浮显示延迟定时器
let hideTimer: any = null // 隐藏延迟定时器
let isMouseOnTooltip = false // 鼠标是否在提示框上

/** Zoom：恢复 */
const processReZoom = () => {
  defaultZoom.value = 1
  bpmnViewer.value?.get('canvas').zoom('fit-viewport', 'auto')
}

/** Zoom：放大 */
const processZoomIn = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100
  if (newZoom > 4) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value?.get('canvas').zoom(defaultZoom.value)
}

/** Zoom：缩小 */
const processZoomOut = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100
  if (newZoom < 0.2) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value?.get('canvas').zoom(defaultZoom.value)
}

/** 流程图预览清空 */
const clearViewer = () => {
  if (processCanvas.value) {
    processCanvas.value.innerHTML = ''
  }
  if (bpmnViewer.value) {
    bpmnViewer.value.destroy()
  }
  bpmnViewer.value = null
}

/** 添加自定义箭头 */
// TODO 芋艿：自定义箭头不生效，有点奇怪！！！！相关的 marker-end、marker-start 暂时也注释了！！！
const addCustomDefs = () => {
  if (!bpmnViewer.value) {
    return
  }
  const canvas = bpmnViewer.value?.get('canvas')
  const svg = canvas?._svg
  svg.appendChild(customDefs.value)
}

/** 获取任务状态对应的 Element UI tag type */
const getTaskStatusType = (status: number) => {
  if (!status) return ''
  // 参考 DICT_TYPE.BPM_TASK_STATUS 的值
  // 1-审批中, 2-已通过, 3-已拒绝, 4-已取消, 5-已退回, 6-已委派, 7-审批中(已加签), 8-审批中(已减签)
  const statusMap: Record<number, string> = {
    1: '', // 审批中 - default
    2: 'success', // 已通过
    3: 'danger', // 已拒绝
    4: 'info', // 已取消
    5: 'warning', // 已退回
    6: '', // 已委派
    7: '', // 审批中(已加签)
    8: '', // 审批中(已减签)
  }
  return statusMap[status] || ''
}

/** 获取服务任务状态的样式类 */
const getServiceStatusClass = (status: string) => {
  const statusClassMap: Record<string, string> = {
    执行中: 'status-running',
    执行成功: 'status-success',
    执行失败: 'status-error',
    已取消: 'status-cancelled',
    已退回: 'status-rejected',
  }
  return statusClassMap[status] || ''
}

/** 鼠标悬浮在节点上 */
const onHoverElement = (element: any, event: any) => {
  // 清除之前的定时器
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
  }

  // 延迟显示，避免快速划过时频繁显示
  hoverTimer = setTimeout(() => {
    if (!element) {
      return
    }

    const activityType = element.type
    const businessObject = element.businessObject

    // 处理 UserTask
    if (activityType === 'bpmn:UserTask' && processInstance.value?.id) {
      const taskList = tasks.value.filter((item: any) => item?.taskDefinitionKey === element.id)

      if (taskList && taskList.length > 0) {
        // 显示最新的一条任务信息
        const latestTask = taskList[taskList.length - 1]
        const assigneeUser = latestTask.assigneeUser || latestTask.ownerUser

        hoverTooltip.value = {
          visible: true,
          x: event.clientX + 15,
          y: event.clientY + 15,
          title: businessObject?.name || '未命名任务',
          assignee: assigneeUser?.nickname || '',
          dept: assigneeUser?.deptName || '',
          startTime: latestTask.createTime ? dateFormatter(null, null, latestTask.createTime) : '',
          endTime: latestTask.endTime ? dateFormatter(null, null, latestTask.endTime) : '',
          duration: latestTask.durationInMillis ? formatPast2(latestTask.durationInMillis) : '',
          reason: latestTask.reason || '',
          status: latestTask.status,
          taskCount: taskList.length,
          taskType: '',
          executeType: '',
          executeValue: '',
          serviceStartTime: '',
          serviceEndTime: '',
          serviceDuration: '',
          serviceStatus: '',
        }
      }
    }
    // 处理 ServiceTask
    else if (activityType === 'bpmn:ServiceTask') {
      let executeType = ''
      let executeValue = ''

      // 检查执行类型和值
      if (businessObject.class) {
        executeType = 'Java类'
        executeValue = businessObject.class
      } else if (businessObject.expression) {
        executeType = '表达式'
        executeValue = businessObject.expression
      } else if (businessObject.delegateExpression) {
        executeType = '代理表达式'
        executeValue = businessObject.delegateExpression
      }

      // 查找对应的服务任务数据
      let serviceTaskData = null
      if (processInstance.value?.id) {
        // 优先从 activityInstances 中查找服务任务数据
        const activityInstances = (window as any).activityInstances
        if (activityInstances && Array.isArray(activityInstances)) {
          // 根据 activityId 过滤，获取所有匹配的活动实例
          const matchingInstances = activityInstances.filter((instance: any) => instance.activityId === element.id)

          if (matchingInstances.length > 0) {
            // 如果有多个相同的，按时间排序，取最新的
            const sortedInstances = matchingInstances.sort((a: any, b: any) => {
              const timeA = new Date(a.startTime || a.createTime || 0).getTime()
              const timeB = new Date(b.startTime || b.createTime || 0).getTime()
              return timeB - timeA // 降序，最新的在前
            })

            serviceTaskData = sortedInstances[0] // 取最新的
          }
        }

        // 如果 activityInstances 中没有找到，回退到 tasks 中查找
        if (!serviceTaskData) {
          serviceTaskData = tasks.value.find((item: any) => {
            return item?.taskDefinitionKey === element.id || item?.activityId === element.id || item?.id === element.id
          })
        }
      }

      // 格式化时间信息
      let serviceStartTime = ''
      let serviceEndTime = ''
      let serviceDuration = ''
      let serviceStatus = ''

      if (serviceTaskData) {
        serviceStartTime =
          serviceTaskData.startTime || serviceTaskData.createTime
            ? dateFormatter(null, null, serviceTaskData.startTime || serviceTaskData.createTime)
            : ''
        serviceEndTime = serviceTaskData.endTime ? dateFormatter(null, null, serviceTaskData.endTime) : ''
        serviceDuration = serviceTaskData.durationInMillis ? formatPast2WithMs(serviceTaskData.durationInMillis) : ''

        // 根据状态设置服务任务状态文本
        if (serviceTaskData.status) {
          const statusMap: Record<number, string> = {
            1: '执行中',
            2: '执行成功',
            3: '执行失败',
            4: '已取消',
            5: '已退回',
          }
          serviceStatus = statusMap[serviceTaskData.status] || '未知状态'
        }
      } else {
        // 如果没有找到服务任务数据，显示提示信息
        serviceStatus = '暂无执行记录'
      }

      hoverTooltip.value = {
        visible: true,
        x: event.clientX + 15,
        y: event.clientY + 15,
        title: businessObject?.name || '未命名服务任务',
        assignee: '',
        dept: '',
        startTime: '',
        endTime: '',
        duration: '',
        reason: '',
        status: undefined,
        taskCount: 0,
        taskType: '服务任务',
        executeType: executeType,
        executeValue: executeValue,
        serviceStartTime: serviceStartTime,
        serviceEndTime: serviceEndTime,
        serviceDuration: serviceDuration,
        serviceStatus: serviceStatus,
      }
    }
    // 处理 StartEvent
    else if (activityType === 'bpmn:StartEvent' && processInstance.value?.id) {
      hoverTooltip.value = {
        visible: true,
        x: event.clientX + 15,
        y: event.clientY + 15,
        title: '流程开始',
        assignee: processInstance.value.startUser?.nickname || '',
        dept: processInstance.value.startUser?.deptName || '',
        startTime: processInstance.value.startTime ? dateFormatter(null, null, processInstance.value.startTime) : '',
        endTime: '',
        duration: '',
        reason: '',
        status: processInstance.value.status,
        taskCount: 1,
        taskType: '',
        executeType: '',
        executeValue: '',
        serviceStartTime: '',
        serviceEndTime: '',
        serviceDuration: '',
        serviceStatus: '',
      }
    }
    // 处理 EndEvent
    else if (activityType === 'bpmn:EndEvent' && processInstance.value?.id) {
      hoverTooltip.value = {
        visible: true,
        x: event.clientX + 15,
        y: event.clientY + 15,
        title: '流程结束',
        assignee: processInstance.value.startUser?.nickname || '',
        dept: processInstance.value.startUser?.deptName || '',
        startTime: processInstance.value.startTime ? dateFormatter(null, null, processInstance.value.startTime) : '',
        endTime: processInstance.value.endTime ? dateFormatter(null, null, processInstance.value.endTime) : '',
        duration: processInstance.value.durationInMillis ? formatPast2(processInstance.value.durationInMillis) : '',
        reason: '',
        status: processInstance.value.status,
        taskCount: 1,
        taskType: '',
        executeType: '',
        executeValue: '',
        serviceStartTime: '',
        serviceEndTime: '',
        serviceDuration: '',
        serviceStatus: '',
      }
    }
  }, 300) // 300ms 延迟
}

/** 鼠标离开节点 */
const onLeaveElement = () => {
  // 清除显示定时器
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }

  // 延迟隐藏，给用户时间移动鼠标到提示框上
  hideTimer = setTimeout(() => {
    if (!isMouseOnTooltip) {
      hoverTooltip.value.visible = false
    }
  }, 200) // 200ms 延迟
}

/** 鼠标进入提示框 */
const onTooltipMouseEnter = () => {
  isMouseOnTooltip = true
  // 清除隐藏定时器
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
}

/** 鼠标离开提示框 */
const onTooltipMouseLeave = () => {
  isMouseOnTooltip = false
  // 延迟隐藏
  hideTimer = setTimeout(() => {
    hoverTooltip.value.visible = false
  }, 200) // 200ms 延迟
}

/** 节点选中 */
const onSelectElement = (element: any) => {
  // 清空原选中
  debugger
  selectActivityType.value = undefined
  dialogTitle.value = undefined
  if (!element || !processInstance.value?.id) {
    return
  }

  // UserTask 的情况
  const activityType = element.type
  selectActivityType.value = activityType
  if (activityType === 'bpmn:UserTask') {
    debugger
    dialogTitle.value = element.businessObject ? element.businessObject.name : undefined
    selectTasks.value = tasks.value.filter((item: any) => item?.taskDefinitionKey === element.id)
    dialogVisible.value = true
  } else if (activityType === 'bpmn:EndEvent' || activityType === 'bpmn:StartEvent') {
    dialogTitle.value = '审批信息'
    selectTasks.value = [
      {
        assigneeUser: processInstance.value.startUser,
        createTime: processInstance.value.startTime,
        endTime: processInstance.value.endTime,
        status: processInstance.value.status,
        durationInMillis: processInstance.value.durationInMillis,
      },
    ]
    dialogVisible.value = true
  }

  selectTasks.value.forEach((task: any) => {
    popOverVisible.value.push(cloneDeep(popOverState))
  })
}

/** 显示任务变量 */
const showTaskVariables = async (task: any) => {
  currentTask.value = task
  taskVariablesContent.value = '加载中...'
  taskVariablesDialogVisible.value = true

  try {
    // 获取任务变量
    // 调用接口实时获取任务变量
    const res = await TaskApi.getTaskVariables(task.id)
    if (res) {
      taskVariablesContent.value = JSON.stringify(res, null, 2)
    } else {
      taskVariablesContent.value = '暂无任务变量数据'
    }
    // const formVariables = task.formVariables || {}

    // if (Object.keys(formVariables).length > 0) {
    //   // 格式化JSON数据，使其更易读
    //   taskVariablesContent.value = JSON.stringify(formVariables, null, 2)
    // } else {
    //   taskVariablesContent.value = '暂无任务变量数据'
    // }
  } catch (error) {
    console.error('获取任务变量失败:', error)
    taskVariablesContent.value = '获取任务变量失败，请重试'
  }
}

/** 复制任务变量内容 */
const copyTaskVariables = async () => {
  try {
    await navigator.clipboard.writeText(taskVariablesContent.value)
    ElMessage.success('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}

/** 初始化 BPMN 视图 */
const importXML = async (xml: string) => {
  // 清空流程图
  clearViewer()

  // 初始化流程图
  if (xml != null && xml !== '') {
    try {
      bpmnViewer.value = new BpmnViewer({
        additionalModules: [MoveCanvasModule],
        container: processCanvas.value,
      })
      // 增加点击事件
      bpmnViewer.value.on('element.click', ({ element }) => {
        onSelectElement(element)
      })

      // 增加鼠标悬浮事件
      bpmnViewer.value.on('element.hover', ({ element, originalEvent }) => {
        onHoverElement(element, originalEvent)
      })

      // 增加鼠标离开事件
      bpmnViewer.value.on('element.out', () => {
        onLeaveElement()
      })

      // 初始化 BPMN 视图
      isLoading.value = true
      await bpmnViewer.value.importXML(xml)
      // 自定义成功的箭头
      addCustomDefs()
    } catch (e) {
      clearViewer()
    } finally {
      isLoading.value = false
      // 高亮流程
      setProcessStatus(props.view)
      nextTick(() => handleCanvasResize())
    }
  }
}
/** 高亮流程 */
const setProcessStatus = (view: any) => {
  // 设置相关变量
  if (!view || !view.processInstance) {
    return
  }
  processInstance.value = view.processInstance
  tasks.value = view.tasks
  // 添加 activityInstances 数据
  if (view.activityInstances) {
    // 将 activityInstances 存储到组件中，供服务任务使用
    ;(window as any).activityInstances = view.activityInstances
  }
  if (isLoading.value || !bpmnViewer.value) {
    return
  }
  const {
    unfinishedTaskActivityIds,
    finishedTaskActivityIds,
    finishedSequenceFlowActivityIds,
    rejectedTaskActivityIds,
  } = view
  const canvas = bpmnViewer.value.get('canvas')
  const elementRegistry = bpmnViewer.value.get('elementRegistry')

  // 已完成节点
  if (Array.isArray(finishedSequenceFlowActivityIds)) {
    finishedSequenceFlowActivityIds.forEach((item: any) => {
      if (item != null) {
        canvas.addMarker(item, 'success')
        const element = elementRegistry.get(item)
        const conditionExpression = element.businessObject.conditionExpression
        if (conditionExpression) {
          canvas.addMarker(item, 'condition-expression')
        }
      }
    })
  }
  if (Array.isArray(finishedTaskActivityIds)) {
    finishedTaskActivityIds.forEach((item: any) => canvas.addMarker(item, 'success'))
  }

  // 未完成节点
  if (Array.isArray(unfinishedTaskActivityIds)) {
    unfinishedTaskActivityIds.forEach((item: any) => canvas.addMarker(item, 'primary'))
  }

  // 被拒绝节点
  if (Array.isArray(rejectedTaskActivityIds)) {
    rejectedTaskActivityIds.forEach((item: any) => {
      if (item != null) {
        canvas.addMarker(item, 'danger')
      }
    })
  }

  // 特殊：处理 end 节点的高亮。因为 end 在拒绝、取消时，被后端计算成了 finishedTaskActivityIds 里
  if ([BpmProcessInstanceStatus.CANCEL, BpmProcessInstanceStatus.REJECT].includes(processInstance.value.status)) {
    const endNodes = elementRegistry.filter((element: any) => element.type === 'bpmn:EndEvent')
    endNodes.forEach((item: any) => {
      canvas.removeMarker(item.id, 'success')
      if (processInstance.value.status === BpmProcessInstanceStatus.CANCEL) {
        canvas.addMarker(item.id, 'cancel')
      } else {
        canvas.addMarker(item.id, 'danger')
      }
    })
  }
}

const nextAssigneesActivityNode = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([]) // 下一个审批节点信息
const taskId = ref<any>('')
const message = useMessage() // 消息弹窗
const approveUser = ref<any>([])
const currentOperationType = ref('')
const addSignUser = ref<any>([])
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const popIndex = ref<any>(0)
const transferVisible = ref<boolean>(false)

/** 是否显示转办按钮，暂时不能用，后台接口需要调整 */
const isShowButton = async (task: any) => {
  let transferEnable = false
  let result = await TaskApi.getTransfer(task.id)
  if (result) {
    transferEnable = true
  }
  return transferEnable
}
/** 任务是否为处理中状态 */
const isHandleTaskStatus = (task: any): boolean => {
  let canHandle = false
  if (task.status === 1 && task.name !== '编制') {
    canHandle = true
  }
  return canHandle
}

/** 获取按钮的显示名称 */
const getButtonDisplayName = (btnType: OperationButtonType) => {
  let displayName = OPERATION_BUTTON_NAME.get(btnType)
  if (runningTask.value?.buttonsSetting && runningTask.value?.buttonsSetting[btnType]) {
    displayName = runningTask.value.buttonsSetting[btnType].displayName
  }
  return displayName
}

/** 弹出气泡卡 */
const openPopover = async (type: string, task: any, index: any) => {
  // Object.keys(popOverVisible.value[index]).forEach((item) => {
  //   popOverVisible.value[index][item] = item === type
  // })
  popOverVisible.value[index][type] = true

  if (type === 'transfer' && showTransferBtn && isHandleTaskStatus(task)) {
    transferVisible.value = true
  }
  popIndex.value = index
  // currentTask.value = task
  taskId.value = task.id

  if (!taskId.value) {
    message.warning('任务ID不存在，无法执行操作!')
  }
}

/** 关闭气泡卡 */
const closePopover = (type: string, formRef: FormInstance | undefined, index: any) => {
  if (formRef) {
    formRef.resetFields()
  }
  popOverVisible.value[index][type] = false
  transferVisible.value = false
  nextAssigneesActivityNode.value = []
}

const formLoading = ref(false) // 表单加载中

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

/** 处理转办 */
const handleTransfer = async (index: any) => {
  debugger
  //currentTask.value = task
  formLoading.value = true
  try {
    // 1.1 校验表单
    if (!transferFormRef.value) return
    await transferFormRef.value.validate()
    // 1.2 提交转交
    const data = {
      id: taskId.value,
      reason: transferForm.reason,
      assigneeUserId: transferForm.assigneeUserId,
    }
    await TaskApi.transferTask(data)
    transferFormRef.value.resetFields()
    popOverVisible.value[index].transfer = false
    transferVisible.value = false
    dialogVisible.value = false
    message.success('操作成功')
    // 2. 加载最新数据
    reload()
  } finally {
    formLoading.value = false
  }
}

/** 重新加载数据 */
const reload = () => {
  emit('success')
}
// 用户选择回显
const handleSelectUser = () => {
  debugger
  let list = []
  if (approveUser.value.length > 0) {
    list = approveUser.value
  }
  //通过当前操作类型区分转办和加签
  currentOperationType.value = 'transfer'
}
// 用户选择确认
const handleUserSelectConfirm = (_, users: UserVO[]) => {
  if (currentOperationType.value === 'transfer') {
    if (users.length === 0) {
      window.$message.error('请选择一位用户')
      return
    }
    if (users.length > 0) {
      window.$message.success('选择成功')
    }
    transferForm.assigneeUserId = users[0].userId
    approveUser.value = users
  }
  if (currentOperationType.value === 'addSign') {
    if (users.length > 0) {
      window.$message.success('选择成功')
    }
    addSignForm.addSignUserIds = users.map(user => user.userId)
    addSignUser.value = users
  }
}

// 响应式数据
const showTransferBtn = ref(false)
const checkingPermission = ref(false)
const transferConfig = ref<any>(null)
//const transferPermissionStatus = ref('')

// 计算属性 - 是否有足够的流程数据
const hasProcessData = computed(() => {
  return processInstance.value && processInstance.value?.startUser
})

// 计算属性 - 是否有足够的用户数据
const hasUserData = computed(() => {
  return useUserStore().getUser && useUserStore().getUser?.id && useUserStore().getUser?.roleNames
})

// 计算属性 - 是否可以检查权限
const canCheckPermission = computed(() => {
  return hasProcessData.value && hasUserData.value
})
// 计算属性 - 当前登录用户是否为流程发起人
const isInitiator = computed(() => {
  const startUserId = processInstance.value.startUser?.id || ''
  if (startUserId === useUserStore().getUser.id) {
    return true
  } else {
    return false
  }
})

// 检查转办权限
const checkTransferPermission = async (): Promise<void> => {
  checkingPermission.value = true
  try {
    // 获取配置
    transferConfig.value = await transferConfigService.getConfig()
    // 检查发起人权限
    const hasInitiatorPermission = transferConfig.value['initiatorEnabled'] && isInitiator.value

    // 检查管理员权限
    const user = useUserStore().getUser
    // 先判断 user 是否存在，避免访问 roleNames 时报错
    const roleNames = user ? user.roleNames : null

    const userRoles = Array.isArray(roleNames)
      ? roleNames
      : typeof roleNames === 'string'
        ? roleNames.split(',').map(role => role.trim())
        : [] // 非数组且非字符串时，默认空数组
    const hasAdminPermission =
      transferConfig.value['adminEnabled'] && userRoles.some(role => transferConfig.value['adminRoles'].includes(role))
    // 根据权限设置转办按钮状态
    showTransferBtn.value = hasInitiatorPermission || hasAdminPermission
  } catch (error) {
    //console.error('检查转办权限失败:', error)
    showTransferBtn.value = false
    //transferPermissionStatus.value = '权限检查失败'
  } finally {
    checkingPermission.value = false
  }
}

// 监听流程信息和用户信息变化
watch(
  () => [processInstance.value, useUserStore().getUser],
  async (newVal, oldVal) => {
    // 只有当有实际变化时才检查权限
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && canCheckPermission.value) {
      await nextTick() // 确保数据已更新
      checkTransferPermission()
    }
  },
  { deep: true, immediate: false }, // 不立即执行
)

// 监听数据准备情况
watch(
  () => canCheckPermission.value,
  async canCheck => {
    if (canCheck) {
      await nextTick() // 确保数据已更新
      checkTransferPermission()
    }
  },
  { immediate: true }, // 立即执行以检查初始状态
)

watch(
  () => props.xml,
  newXml => {
    importXML(newXml)
  },
  { immediate: true },
)

watch(
  () => props.view,
  newView => {
    setProcessStatus(newView)
  },
  { immediate: true },
)
let canvasResizeObserver: ResizeObserver | null = null

/** 容器尺寸变化时重算 BPMN 画布，避免流程图只占顶部一小块 */
function handleCanvasResize() {
  if (!bpmnViewer.value) {
    return
  }
  try {
    bpmnViewer.value.get('canvas').resized()
    processReZoom()
  } catch {
    /* ignore */
  }
}

/** mounted：初始化 */
onMounted(() => {
  setProcessStatus(props.view)
  nextTick(() => {
    const container = processCanvas.value?.parentElement
    if (!container) {
      return
    }
    canvasResizeObserver = new ResizeObserver(() => {
      handleCanvasResize()
    })
    canvasResizeObserver.observe(container)
  })
})

/** unmount：销毁 */
onBeforeUnmount(() => {
  canvasResizeObserver?.disconnect()
  canvasResizeObserver = null
  clearViewer()
  // 清除所有定时器
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
})
</script>

<style lang="scss" scoped>
// 修复 el-popover 中输入框无法输入的问题
.el-popover {
  pointer-events: auto !important;
  z-index: 2000 !important; // 确保弹出层在最上层
  overflow: visible !important; // 防止内容被裁剪

  // 确保输入框可以获取焦点
  .el-form-item__content {
    pointer-events: auto !important;
  }

  // 文本区域样式修正
  .el-textarea {
    width: 100%; // 确保文本区域宽度

    &__inner {
      pointer-events: auto !important;
      background: white !important;
      min-height: 80px !important; // 设置最小高度
      resize: vertical !important; // 允许垂直调整大小
    }
  }

  // 表单按钮样式
  .el-button {
    margin-top: 10px;
  }
}

// 修复父容器可能影响输入的问题
.process-viewer {
  height: 100%;
  width: 100%;
  min-height: 0;
  box-sizing: border-box;

  :deep(.djs-container),
  :deep(.bjs-container) {
    height: 100% !important;
    width: 100% !important;
  }

  // 确保没有父容器阻止事件冒泡
  > * {
    pointer-events: auto !important;
  }

  // 确保画布不会阻挡弹窗
  #processCanvas {
    pointer-events: none !important; // 画布本身不需要接收事件

    // 只在特定元素上启用指针事件
    .bpmn-element {
      pointer-events: auto !important;
    }
  }
}

// 悬浮提示框样式
.bpmn-hover-tooltip {
  position: fixed;
  z-index: 9999;
  min-width: 280px;
  max-width: 450px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0;
  pointer-events: auto; // 允许鼠标事件，以便用户可以复制内容
  animation: fadeIn 0.2s ease-in-out;
  user-select: text; // 允许选择文本

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px 8px 0 0;
    color: #ffffff;

    .tooltip-title {
      font-size: 14px;
      font-weight: 600;
      flex: 1;
      margin-right: 8px;
    }

    :deep(.el-tag) {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      color: #ffffff;
    }
  }

  .tooltip-content {
    padding: 12px 16px;

    .tooltip-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #909399;
        min-width: 70px;
        font-weight: 500;
        flex-shrink: 0;
      }

      .value {
        color: #303133;
        flex: 1;
        word-break: break-all;

        &.reason {
          color: #606266;
          font-style: italic;
        }

        &.code {
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 12px;
          background-color: #f5f7fa;
          padding: 4px 8px;
          border-radius: 4px;
          color: #e83e8c;
          word-break: break-word;
        }

        // 服务任务状态样式
        &.status-running {
          color: #409eff;
          font-weight: 500;
        }

        &.status-success {
          color: #67c23a;
          font-weight: 500;
        }

        &.status-error {
          color: #f56c6c;
          font-weight: 500;
        }

        &.status-cancelled {
          color: #909399;
          font-weight: 500;
        }

        &.status-rejected {
          color: #e6a23c;
          font-weight: 500;
        }
      }
    }

    .tooltip-footer {
      display: flex;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #ebeef5;
      font-size: 12px;
      color: #909399;

      .el-icon {
        margin-right: 6px;
        font-size: 14px;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 任务变量弹窗样式

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
