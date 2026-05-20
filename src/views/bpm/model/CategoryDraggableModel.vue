<script lang="ts" setup>
import type { TableColumnType } from 'ant-design-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import Sortable from 'sortablejs'
import type { SortableEvent } from 'sortablejs'
import { cloneDeep, isEqual } from 'lodash-es'
import { useDebounceFn } from '@vueuse/core'
import { DICT_TYPE } from '@/utils/dict'
import type { CategoryVO } from '@/api/bpm/category'
import { CategoryApi } from '@/api/bpm/category'
import { formatDate } from '@/utils/formatTime'
import * as ModelApi from '@/api/bpm/model'
import * as FormApi from '@/api/bpm/form'
import { setConfAndFields2, subString } from '@/utils/formCreate'
import { BpmModelFormType } from '@/utils/constants'
import { checkPermi } from '@/utils/permission'
// import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useMessage } from '@/hooks/web/useMessage'
const message = useMessage()
defineOptions({ name: 'bpm/model' })
import { Dialog } from '@/components/Dialog'
const props = defineProps<{
  categoryInfo: CategoryInfoProps
  isCategorySorting: boolean
}>()

const emit = defineEmits(['success'])

// 优化 Props 类型定义
interface UserInfo {
  nickname: string
  [key: string]: any
}

interface ProcessDefinition {
  deploymentTime: string
  version: number
  suspensionState: number
}

interface ModelInfo {
  id: number
  name: string
  icon?: string
  startUsers?: UserInfo[]
  processDefinition?: ProcessDefinition
  formType?: number
  formId?: number
  formName?: string
  formCustomCreatePath?: string
  managerUserIds?: number[]
  [key: string]: any
}

interface CategoryInfoProps {
  id: number
  name: string
  modelList: ModelInfo[]
}

const { push } = useRouter() // 路由
const router = useRouter() // 路由

const isModelSorting = ref(false) // 是否正处于排序状态
const originalData = ref<ModelInfo[]>([]) // 原始数据
const modelList = ref<ModelInfo[]>([]) // 模型列表
const isExpand = ref(false) // 是否处于展开状态

const BPM_MODEL_TABLE_SCROLL_BUFFER = 2
const modelTableColumns: TableColumnType[] = [
  {
    title: '流程名',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    width: 220,
    fixed: 'left',
    resizable: false,
  },
  {
    title: '可见范围',
    dataIndex: 'startUserIds',
    key: 'startUserIds',
    align: 'left',
    width: 160,
    resizable: true,
  },
  {
    title: '流程类型',
    dataIndex: 'type',
    key: 'type',
    align: 'left',
    width: 120,
    resizable: true,
  },
  {
    title: '表单信息',
    dataIndex: 'formType',
    key: 'formType',
    align: 'left',
    width: 180,
    resizable: true,
  },
  {
    title: '最后发布',
    dataIndex: 'deploymentTime',
    key: 'deploymentTime',
    align: 'left',
    width: 280,
    resizable: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 220,
    fixed: 'right',
  },
]

const modelTableScrollX = computed(() =>
  modelTableColumns.reduce((acc, col) => acc + (Number(col.width) || 0), 0) + BPM_MODEL_TABLE_SCROLL_BUFFER,
)

function getModelTableRowClassName(_record: ModelInfo, index: number) {
  return index % 2 === 0 ? 'odd' : 'even'
}

function modelRowKey(record: ModelInfo) {
  return record.id
}

function handleModelMenuClick(info: MenuInfo, row: ModelInfo) {
  handleModelCommand(String(info.key), row)
}

/** 权限校验：通过 computed 解决列表的卡顿问题 */
const hasPermiUpdate = computed(() => {
  return checkPermi(['bpm:model:update'])
})
const hasPermiDelete = computed(() => {
  return checkPermi(['bpm:model:delete'])
})
const hasPermiDeploy = computed(() => {
  return checkPermi(['bpm:model:deploy'])
})
const hasPermiMore = computed(() => {
  return checkPermi(['bpm:process-definition:query', 'bpm:model:update', 'bpm:model:delete'])
})
const hasPermiPdQuery = computed(() => {
  return checkPermi(['bpm:process-definition:query'])
})

/**
 * '更多'操作按钮
 * @param command
 * @param row
 */
function handleModelCommand(command: string, row: any) {
  switch (command) {
    case 'handleDefinitionList':
      handleDefinitionList(row)
      break
    case 'handleDelete':
      handleDelete(row)
      break
    case 'handleChangeState':
      handleChangeState(row)
      break
    case 'handleClean':
      handleClean(row)
      break
    case 'handleReport':
      router.push({
        name: 'BpmProcessInstanceReport',
        query: {
          processDefinitionId: row.processDefinition.id,
          processDefinitionKey: row.key,
        },
      })
      break
    default:
      break
  }
}

/**
 * '分类'操作按钮
 * @param command
 * @param row
 */
async function handleCategoryCommand(command: string, row: any) {
  switch (command) {
    case 'handleRename':
      const res = await CategoryApi.getCategory(row.id)
      if (res.data.code === 200) {
        renameCategoryForm.value = res.data.data
      }
      renameCategoryVisible.value = true
      break
    case 'handleDeleteCategory':
      await handleDeleteCategory()
      break
    default:
      break
  }
}

/**
 * 删除按钮操作
 * @param row
 */
async function handleDelete(row: any) {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ModelApi.deleteModel(row.id)
    message.success('删除成功')
    // 刷新列表
    emit('success')
  } catch {}
}

/**
 * 清理按钮操作
 * @param row
 */
async function handleClean(row: any) {
  try {
    // 清理的二次确认
    await message.confirm(`是否确认清理流程名字为"${row.name}"的数据项?`)
    // 发起清理
    await ModelApi.cleanModel(row.id)
    message.success('清理成功')
    // 刷新列表
    emit('success')
  } catch {}
}

/**
 * 更新状态操作
 * @param row
 */
async function handleChangeState(row: any) {
  const state = row.processDefinition.suspensionState
  const newState = state === 1 ? 2 : 1
  try {
    // 修改状态的二次确认
    const id = row.id
    const statusState = state === 1 ? '停用' : '启用'
    const content = `是否确认${statusState}流程名字为"{row.name}"的数据项?`
    await message.confirm(content)
    // 发起修改状态
    await ModelApi.updateModelState(id, newState)
    message.success(`${statusState}成功`)
    // 刷新列表
    emit('success')
  } catch {}
}

/**
 * 发布流程
 * @param row
 */
async function handleDeploy(row: any) {
  try {
    await message.confirm('是否确认发布该流程？')
    // 发起部署
    await ModelApi.deployModel(row.id)
    message.success('发布成功')
    // 刷新列表
    emit('success')
  } catch {}
}

/**
 * 跳转到指定流程定义列表
 * @param row
 */
function handleDefinitionList(row: any) {
  push({
    name: 'BpmProcessDefinition',
    query: {
      key: row.key,
    },
  })
}

/** 流程表单的详情按钮操作 */
const formDetailVisible = ref(false)
const formDetailPreview = ref({
  rule: [],
  option: {},
})
async function handleFormDetail(row: any) {
  if (row.formType == BpmModelFormType.NORMAL) {
    const res = await FormApi.getForm(row.formId)
    if (res.data?.code !== 200) return
    const formRow = res.data.data
    if (!formRow) return
    setConfAndFields2(formDetailPreview, formRow.conf, formRow.fields)
    // 弹窗打开
    formDetailVisible.value = true
  } else {
    await push({
      path: row.formCustomCreatePath,
    })
  }
}

/**
 * 判断是否可以操作
 * @param row
 */
function isManagerUser(row: any) {
  const userId = useUserStore().getUser.id
  return row.managerUserIds && row.managerUserIds.includes(userId)
}

/** 处理模型的排序 */
function handleModelSort() {
  // 保存初始数据
  originalData.value = cloneDeep(modelList.value)
  isModelSorting.value = !isModelSorting.value
  isExpand.value = true
  initSort()
}

/** 处理模型的排序提交 */
async function handleModelSortSubmit() {
  // 保存排序
  const ids = modelList.value.map((item: any) => item.id)
  await ModelApi.updateModelSortBatch(ids)
  // 刷新列表
  isModelSorting.value = false
  destroyTableSortable()
  message.success('排序模型成功')
  emit('success')
}

/** 处理模型的排序取消 */
function handleModelSortCancel() {
  // 恢复初始数据
  modelList.value = cloneDeep(originalData.value)
  isModelSorting.value = false
  destroyTableSortable()
}

/** 创建拖拽实例 */
const tableRef = ref()
let tableSortable: Sortable | null = null

function destroyTableSortable() {
  tableSortable?.destroy()
  tableSortable = null
}

const initSort = useDebounceFn(() => {
  nextTick(() => {
    destroyTableSortable()
    const tbody = tableRef.value?.$el?.querySelector?.('.ant-table-tbody')
    if (!tbody) return

    tableSortable = Sortable.create(tbody as HTMLElement, {
      animation: 150,
      draggable: '.ant-table-row',
      handle: '.drag-icon',
      onEnd(evt: SortableEvent) {
        const { newIndex, oldIndex } = evt
        if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return
        const list = [...modelList.value]
        const [moved] = list.splice(oldIndex, 1)
        list.splice(newIndex, 0, moved)
        modelList.value = list
      },
    })
  })
}, 200)

onBeforeUnmount(() => {
  destroyTableSortable()
})

/** 更新 modelList 模型列表 */
const updateModeList = useDebounceFn(() => {
  const newModelList = props.categoryInfo.modelList
  if (!isEqual(modelList.value, newModelList)) {
    modelList.value = cloneDeep(newModelList)
    if (newModelList?.length > 0) {
      isExpand.value = true
    }
  }
}, 100)

/** 重命名弹窗确定 */
const renameCategoryVisible = ref(false)
const renameCategoryForm = ref({
  name: '',
})
async function handleRenameConfirm() {
  if (renameCategoryForm.value?.name.length === 0) {
    return message.warning('请输入名称')
  }
  // 发起修改
  await CategoryApi.updateCategory(renameCategoryForm.value as CategoryVO)
  message.success('重命名成功')
  // 刷新列表
  renameCategoryVisible.value = false
  emit('success')
}

/** 删除分类 */
async function handleDeleteCategory() {
  try {
    if (props.categoryInfo.modelList.length > 0) {
      return message.warning('该分类下仍有流程定义,不允许删除')
    }
    await message.confirm('确认删除分类吗?')
    // 发起删除
    await CategoryApi.deleteCategory(props.categoryInfo.id)
    message.success('删除成功')
    // 刷新列表
    emit('success')
  } catch {}
}

/**
 * 添加/修改/复制流程模型弹窗
 * @param type
 * @param id
 */
async function openModelForm(type: string, id?: number) {
  if (type === 'create') {
    await push({ name: 'BpmModelCreate' })
  } else {
    await push({
      name: 'BpmModelUpdate',
      params: { id, type },
    })
  }
}

watchEffect(() => {
  if (props.categoryInfo?.modelList) {
    updateModeList()
  }

  if (props.isCategorySorting) {
    isExpand.value = false
  }
})
</script>

<template>
  <div v-memo="[categoryInfo.name, isCategorySorting]" class="flex items-center h-50px">
    <!-- 头部：分类名 -->
    <div class="flex items-center">
      <el-tooltip v-if="isCategorySorting" content="拖动排序">
        <Icon :size="22" icon="ic:round-drag-indicator" class="ml-10px category-drag-icon cursor-move text-#8a909c" />
      </el-tooltip>
      <h3 class="ml-20px mr-8px text-15px mb-0">
        {{ categoryInfo.name }}
      </h3>
      <div class="color-gray-600 text-15px">({{ categoryInfo.modelList?.length || 0 }})</div>
    </div>
    <!-- 头部：操作 -->
    <div v-show="!isCategorySorting" class="flex-1 flex">
      <div
        v-if="categoryInfo.modelList.length > 0"
        class="ml-20px flex items-center transition-transform duration-300 cursor-pointer"
        :class="[isExpand ? 'rotate-180' : 'rotate-0']"
        @click="isExpand = !isExpand">
        <Icon icon="ep:arrow-down-bold" color="#999" />
      </div>
      <div class="ml-auto flex items-center" :class="isModelSorting ? 'mr-15px' : 'mr-45px'">
        <template v-if="!isModelSorting">
          <el-button
            v-if="categoryInfo.modelList.length > 0"
            link
            type="info"
            class="mr-20px"
            @click.stop="handleModelSort">
            <Icon icon="fa:sort-amount-desc" class="mr-5px" />
            {{ '排序' }}
          </el-button>
          <el-button v-else link type="info" class="mr-20px" @click.stop="openModelForm('create')">
            <Icon icon="fa:plus" class="mr-5px" />
            {{ '新建' }}
          </el-button>
          <el-dropdown placement="bottom" @command="command => handleCategoryCommand(command, categoryInfo)">
            <el-button link type="info">
              <Icon icon="ep:setting" class="mr-5px" />
              {{ '分类' }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="handleRename">
                  {{ '重命名' }}
                </el-dropdown-item>
                <el-dropdown-item command="handleDeleteCategory">
                  {{ '删除该类' }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button @click.stop="handleModelSortCancel">
            {{ '取 消' }}
          </el-button>
          <el-button type="primary" @click.stop="handleModelSortSubmit">
            {{ '保存排序' }}
          </el-button>
        </template>
      </div>
    </div>
  </div>

  <!-- 模型列表 -->
  <el-collapse-transition>
    <div v-show="isExpand" class="category-draggable-model">
      <a-table
        v-if="modelList && modelList.length > 0"
        ref="tableRef"
        class="bpm-model-table exe-config-table parameter-table-spaced"
        bordered
        table-layout="fixed"
        :columns="modelTableColumns"
        :data-source="modelList"
        :row-key="modelRowKey"
        :scroll="{ x: modelTableScrollX }"
        :pagination="false"
        :row-class-name="getModelTableRowClassName">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <div class="bpm-model-name-cell">
              <a-tooltip v-if="isModelSorting" title="拖动排序">
                <Icon icon="ic:round-drag-indicator" class="drag-icon cursor-move text-#8a909c mr-10px" />
              </a-tooltip>
              <img v-if="record.icon" :src="record.icon" class="bpm-model-flow-icon bpm-model-flow-icon--img" alt="" />
              <div v-else class="flow-icon">
                <span>{{ subString(record.name, 0, 2) }}</span>
              </div>
              <span class="bpm-model-name-text">{{ record.name }}</span>
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'startUserIds'">
            <span v-if="!record.startUsers?.length && !record.startDepts?.length">全部可见</span>
            <span v-else-if="record.startUsers?.length === 1">{{ record.startUsers[0].nickname }}</span>
            <span v-else-if="record.startDepts?.length === 1">{{ record.startDepts[0].name }}</span>
            <a-tooltip
              v-else-if="(record.startDepts?.length ?? 0) > 1"
              placement="top"
              :title="(record.startDepts ?? []).map(dept => dept.name).join('、')">
              <span>
                {{ record.startDepts?.[0]?.name }}等 {{ record.startDepts?.length }} 个部门可见
              </span>
            </a-tooltip>
            <a-tooltip
              v-else
              placement="top"
              :title="(record.startUsers ?? []).map(user => user.nickname).join('、')">
              <span>
                {{ record.startUsers?.[0]?.nickname }}等 {{ record.startUsers?.length }} 人可见
              </span>
            </a-tooltip>
          </template>

          <template v-else-if="column.dataIndex === 'type'">
            <dict-tag :value="record.type" :type="DICT_TYPE.BPM_MODEL_TYPE" />
          </template>

          <template v-else-if="column.dataIndex === 'formType'">
            <a
              v-if="record.formType === BpmModelFormType.NORMAL"
              class="bpm-model-form-link"
              @click.stop.prevent="handleFormDetail(record)">
              {{ record.formName }}
            </a>
            <a
              v-else-if="record.formType === BpmModelFormType.CUSTOM"
              class="bpm-model-form-link"
              @click.stop.prevent="handleFormDetail(record)">
              {{ record.formCustomCreatePath }}
            </a>
            <span v-else class="bpm-model-form-empty">暂无表单</span>
          </template>

          <template v-else-if="column.dataIndex === 'deploymentTime'">
            <div class="bpm-model-deploy-cell">
              <span v-if="record.processDefinition" class="bpm-model-deploy-time">
                {{ formatDate(record.processDefinition.deploymentTime) }}
              </span>
              <a-tag v-if="record.processDefinition" color="blue" class="bpm-model-version-tag">
                v{{ record.processDefinition.version }}
              </a-tag>
              <a-tag v-else color="warning">未部署</a-tag>
              <a-tag v-if="record.processDefinition?.suspensionState === 2" color="warning" class="ml-10px">
                已停用
              </a-tag>
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'operation'">
            <div class="calc-operation-links" @click.stop>
              <a @click.stop.prevent="openModelForm('update', record.id)">修改</a>
              <a @click.stop.prevent="openModelForm('copy', record.id)">复制</a>
              <a @click.stop.prevent="handleDeploy(record)">发布</a>
              <a-dropdown placement="bottomRight">
                <a @click.prevent>更多</a>
                <template #overlay>
                  <a-menu @click="info => handleModelMenuClick(info, record)">
                    <a-menu-item key="handleDefinitionList">历史</a-menu-item>
                    <a-menu-item v-if="record.processDefinition" key="handleChangeState">
                      {{ record.processDefinition.suspensionState === 1 ? '停用' : '启用' }}
                    </a-menu-item>
                    <a-menu-item key="handleClean">清理</a-menu-item>
                    <a-menu-item key="handleDelete">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </el-collapse-transition>

  <!-- 弹窗：重命名分类 -->
  <Dialog v-model="renameCategoryVisible" :fullscreen="false" class="rename-dialog" width="400">
    <template #title>
      <div class="pl-10px font-bold text-18px">
        {{ '重命名分类' }}
      </div>
    </template>
    <div class="px-30px">
      <el-input v-model="renameCategoryForm.name" />
    </div>
    <template #footer>
      <div class="pr-25px pb-25px">
        <el-button @click="renameCategoryVisible = false">
          {{ '取 消' }}
        </el-button>
        <el-button type="primary" @click="handleRenameConfirm">
          {{ '确 定' }}
        </el-button>
      </div>
    </template>
  </Dialog>

  <!-- 弹窗：表单详情 -->
  <Dialog v-model="formDetailVisible" title="表单详情" :fullscreen="true">
    <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.option" />
  </Dialog>
</template>

<style lang="scss">
.rename-dialog.el-dialog {
  padding: 0 !important;

  .el-dialog__header {
    border-bottom: none;
  }

  .el-dialog__footer {
    border-top: none !important;
  }
}
</style>

<style lang="less" scoped>
.flow-icon {
  display: flex;
  width: 28px;
  height: 28px;
  margin-right: 8px;
  background-color: var(--ant-color-primary, #1677ff);
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-size: 10px;
    color: #fff;
    line-height: 1;
  }
}

.bpm-model-flow-icon--img {
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.bpm-model-name-cell {
  display: flex;
  align-items: center;
}

.bpm-model-name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bpm-model-form-link {
  color: #1677ff;
}

.bpm-model-form-empty {
  color: rgba(0, 0, 0, 0.45);
}

.bpm-model-deploy-cell {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  line-height: 22px;
}

.bpm-model-deploy-time {
  min-width: 150px;
}

.bpm-model-version-tag {
  margin: 0;
  line-height: 18px;
}

.category-draggable-model {
  :deep(.ant-tag) {
    margin-inline-end: 0;
  }

  :deep(.parameter-table-spaced) {
    margin-top: 0;
  }

  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center;
    vertical-align: middle;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-thead .ant-table-column-sorters) {
    justify-content: center !important;
  }

  :deep(.ant-table-thead .ant-table-column-title) {
    flex: none;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-content),
  :deep(.ant-table-body) {
    padding-bottom: 14px;
    box-sizing: border-box;
  }

  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-cell-fix-left-last::after),
  :deep(.ant-table-cell-fix-right-first::after),
  :deep(.ant-table-cell-fix-left-first::after) {
    display: none !important;
  }

  :deep(.ant-table-cell-fix-left-last) {
    box-shadow: inset -8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }

  :deep(.ant-table-cell-fix-right-first) {
    box-shadow: inset 8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }

  :deep(.ant-table-tbody) {
    will-change: transform;
    transform: translateZ(0);
  }
}

@exe-op-links-divider: #e0e0e0;
@exe-op-links-line-gap: 8px;
@exe-op-links-divider-h: 1em;

.calc-operation-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  row-gap: 6px;
  column-gap: 0;

  > * {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 2px @exe-op-links-line-gap;
    line-height: inherit;
    font-size: inherit;
    white-space: nowrap;
    border: none;
    border-radius: 0;
    color: #1677ff;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    &:not(:first-child)::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 1px;
      height: @exe-op-links-divider-h;
      margin-left: -0.5px;
      background: @exe-op-links-divider;
      transform: translateY(-50%);
      pointer-events: none;
    }
  }
}
</style>
