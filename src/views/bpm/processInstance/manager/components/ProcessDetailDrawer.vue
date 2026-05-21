<template>
  <el-drawer
    v-model="visible"
    title="流程详情"
    direction="rtl"
    size="75%"
    :before-close="handleClose"
    custom-class="process-detail-drawer">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <!-- 流程信息 -->
      <el-tab-pane label="流程信息" name="info">
        <div v-if="processDetail" class="process-detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="流程编号">
              {{ processDetail.id }}
            </el-descriptions-item>
            <el-descriptions-item label="流程名称">
              {{ processDetail.name }}
            </el-descriptions-item>
            <el-descriptions-item label="流程分类">
              {{ processDetail.categoryName }}
            </el-descriptions-item>
            <el-descriptions-item label="流程状态">
              <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="processDetail.status" />
            </el-descriptions-item>
            <el-descriptions-item label="发起时间">
              {{ processDetail.startTime }}
            </el-descriptions-item>
            <el-descriptions-item label="结束时间">
              {{ processDetail.endTime || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="发起人">
              {{ processDetail.startUser?.nickname || '' }}
            </el-descriptions-item>
            <el-descriptions-item label="发起部门">
              {{ processDetail.startUser?.deptName || '' }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- 流程变量信息 -->
          <div v-if="processDetail.processVariables" class="process-variables mt-4">
            <h4>流程变量</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item v-for="(value, key) in processDetail.processVariables" :key="key" :label="key">
                {{ value }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 任务信息 -->
          <div v-if="processDetail.tasks && processDetail.tasks.length > 0" class="process-tasks mt-4">
            <h4>任务信息</h4>
            <el-table :data="processDetail.tasks" style="width: 100%">
              <el-table-column prop="name" label="任务名称" />
              <el-table-column prop="assigneeUser.nickname" label="审批人" />
              <el-table-column prop="createTime" label="创建时间" />
              <el-table-column prop="endTime" label="结束时间" />
            </el-table>
          </div>
        </div>
      </el-tab-pane>

      <!-- 流程图 -->
      <el-tab-pane label="流程图" name="diagram">
        <div class="diagram-container">
          <!-- Simple 流程图 -->
          <div class="diagram-wrapper">
            <div class="diagram-toolbar">
              <el-button type="danger" plain size="small" @click="refreshProcessDiagram"> 刷新 </el-button>
              <el-button type="primary" plain size="small" @click="showProcessVariables"> 查看流程变量 </el-button>
            </div>

            <ProcessInstanceSimpleViewer
              v-show="processDefinition?.modelType === BpmModelType.SIMPLE"
              :loading="diagramLoading"
              :model-view="processModelView" />

            <!-- BPMN 流程图 -->
            <ProcessInstanceBpmnViewer
              v-show="processDefinition?.modelType === BpmModelType.BPMN"
              :loading="diagramLoading"
              :model-view="processModelView" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 流转记录 -->
      <el-tab-pane label="流转记录" name="record">
        <div class="record-container">
          <el-scrollbar>
            <ProcessInstanceTaskList :loading="recordLoading" :id="processDetail?.id" />
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts">
import { ref, watch, nextTick, defineComponent, defineAsyncComponent } from 'vue'
import { DICT_TYPE } from '@/utils/dict'
import { BpmModelType } from '@/utils/constants'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import * as ProcessDefinitionApi from '@/api/bpm/definition'
import DictTag from '@/components/DictTag/src/DictTag.vue'

const ProcessInstanceSimpleViewer = defineAsyncComponent(() => import('../../detail/ProcessInstanceSimpleViewer.vue'))
const ProcessInstanceBpmnViewer = defineAsyncComponent(() => import('../../detail/ProcessInstanceBpmnViewer.vue'))
// eslint-disable-next-line no-unused-vars
const ProcessInstanceTaskList = defineAsyncComponent(() => import('../../detail/ProcessInstanceTaskList.vue'))

export default defineComponent({
  name: 'ProcessDetailDrawer',
  components: {
    ProcessInstanceSimpleViewer,
    ProcessInstanceBpmnViewer,
    ProcessInstanceTaskList,
    DictTag,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    processDetail: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:modelValue', 'show-process-variables'],
  setup(props, { emit }) {
    // 响应式数据
    const visible = ref(false)
    const activeTab = ref('info')
    const diagramLoading = ref(false)
    const recordLoading = ref(false)
    const processDefinition = ref<any>({})
    const processModelView = ref<any>({})

    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      newVal => {
        visible.value = newVal
      },
    )

    // 监听 visible 变化
    watch(visible, newVal => {
      emit('update:modelValue', newVal)
      // 当抽屉打开时，强制设置样式
      if (newVal) {
        nextTick(() => {
          const drawerHeader = document.querySelector('.process-detail-drawer .el-drawer__header')
          if (drawerHeader) {
            ;(drawerHeader as HTMLElement).style.marginBottom = '0px'
          }
        })
      }
    })

    // 监听 processDetail 变化
    watch(
      () => props.processDetail,
      newDetail => {
        if (newDetail) {
          processDefinition.value = newDetail.processDefinition || {}
          // 如果切换到流程图tab，自动加载流程图
          if (activeTab.value === 'diagram') {
            nextTick(() => {
              refreshProcessDiagram()
            })
          }
        }
      },
    )

    // Tab 切换处理
    const handleTabChange = (tabName: string) => {
      if (tabName === 'diagram') {
        nextTick(() => {
          refreshProcessDiagram()
        })
      } else if (tabName === 'record') {
        nextTick(() => {
          recordLoading.value = true
          // ProcessInstanceTaskList 组件会自动处理加载
          setTimeout(() => {
            recordLoading.value = false
          }, 100)
        })
      }
    }

    // 刷新流程图
    const refreshProcessDiagram = async () => {
      if (!props.processDetail?.id) return
      diagramLoading.value = true
      try {
        // 获取流程定义信息
        const definitionData = await ProcessDefinitionApi.getProcessDefinition(props.processDetail.processDefinitionId)
        if (definitionData.data.code === 200) {
          processDefinition.value = definitionData.data.data
        }

        // 获取流程图数据
        const modelViewData = await ProcessInstanceApi.getProcessInstanceBpmnModelView(props.processDetail.id)
        if (modelViewData.data.code === 200) {
          processModelView.value = modelViewData.data.data
        }
      } catch (error) {
        console.error('获取流程图失败:', error)
      } finally {
        diagramLoading.value = false
      }
    }

    // 显示流程变量
    const showProcessVariables = () => {
      emit('show-process-variables', props.processDetail)
    }

    // 关闭抽屉
    const handleClose = (done: () => void) => {
      activeTab.value = 'info'
      processModelView.value = {}
      processDefinition.value = {}
      done()
    }

    return {
      visible,
      activeTab,
      diagramLoading,
      recordLoading,
      processDefinition,
      processModelView,
      handleTabChange,
      refreshProcessDiagram,
      showProcessVariables,
      handleClose,
      DICT_TYPE,
      BpmModelType,
    }
  },
})
</script>

<style lang="scss" scoped>
/* 使用 custom-class 来精确控制样式 */
:deep(.process-detail-drawer .el-drawer__header) {
  margin-bottom: 0 !important;
}

/* 备用方案：如果上面不生效，使用更强的选择器 */
:deep(.el-drawer__header) {
  margin-bottom: 0 !important;
}

.process-detail-content {
  padding: 0 10px;
}

.process-variables,
.process-tasks {
  margin-top: 20px;
}

.process-variables h4,
.process-tasks h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 8px;
}

.mt-4 {
  margin-top: 1rem;
}

.diagram-container {
  height: calc(100vh - 200px);
  padding: 0;
  position: relative;
  overflow: hidden;
}

.diagram-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.diagram-toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 移除流程图组件的底部空白 */
:deep(.el-card) {
  height: 100% !important;
  margin-bottom: 0 !important;
}

:deep(.el-card__body) {
  height: 100% !important;
  padding: 0 !important;
}

:deep(.process-viewer-container) {
  height: 100% !important;
}

:deep(.box-card) {
  height: 100% !important;
  margin-bottom: 0 !important;
}

/* 确保流程图组件填满容器 */
:deep(.process-viewer) {
  height: 100% !important;
  min-height: auto !important;
}

/* 流转记录容器样式 */
.record-container {
  height: calc(100vh - 200px);
  padding: 10px;
}

.record-container :deep(.el-scrollbar) {
  height: 100%;
}

.record-container :deep(.el-scrollbar__view) {
  height: 100%;
}
</style>

<!-- 全局样式备用方案，如果 scoped 样式不生效 -->
<style lang="scss">
.process-detail-drawer .el-drawer__header {
  margin-bottom: 0 !important;
}

/* 更强制性的样式覆盖 */
.el-drawer__header {
  margin-bottom: 0 !important;
}

/* 使用属性选择器 */
[class*='process-detail-drawer'] .el-drawer__header {
  margin-bottom: 0 !important;
}

/* 直接针对抽屉标题 */
.el-drawer__title {
  margin-bottom: 0 !important;
}

/* 最高优先级的样式覆盖 */
body .el-drawer__header {
  margin-bottom: 0 !important;
}

/* 使用 ID 选择器提高优先级 */
#app .el-drawer__header {
  margin-bottom: 0 !important;
}
</style>
