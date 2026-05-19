<script lang="ts" setup>
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
// useAppStore().getIsDark
const isDark = computed(() => false) // 是否黑暗模式
const router = useRouter() // 路由

const isModelSorting = ref(false) // 是否正处于排序状态
const originalData = ref<ModelInfo[]>([]) // 原始数据
const modelList = ref<ModelInfo[]>([]) // 模型列表
const isExpand = ref(false) // 是否处于展开状态

// 使用 computed 优化表格样式计算
const tableHeaderStyle = computed(() => ({
  backgroundColor: isDark.value ? '' : '#edeff0',
  paddingLeft: '10px',
}))

const tableCellStyle = computed(() => ({
  paddingLeft: '10px',
}))

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
    message.success('common.delSuccess')
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
  isModelSorting.value = true
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
    const tbody = tableRef.value?.$el?.querySelector?.('.el-table__body-wrapper tbody')
    if (!tbody) return

    tableSortable = Sortable.create(tbody as HTMLElement, {
      animation: 150,
      draggable: '.el-table__row',
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
    message.success('common.delSuccess')
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
    <div v-show="isExpand">
      <el-table
        v-if="modelList && modelList.length > 0"
        ref="tableRef"
        :data="modelList"
        row-key="id"
        :header-cell-style="tableHeaderStyle"
        :cell-style="tableCellStyle"
        :row-style="{ height: '68px' }">
        <el-table-column label="流程名" prop="name" min-width="150">
          <template #default="scope">
            <div v-if="scope?.row" class="flex items-center">
              <el-tooltip v-if="isModelSorting" content="拖动排序">
                <Icon icon="ic:round-drag-indicator" class="drag-icon cursor-move text-#8a909c mr-10px" />
              </el-tooltip>
              <el-image v-if="scope.row.icon" :src="scope.row.icon" class="h-38px w-38px mr-10px rounded" />
              <div v-else class="flow-icon">
                <span
                  style="
                    font-size: 12px;
                    color: #fff;
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  >{{ subString(scope.row.name, 0, 2) }}</span
                >
              </div>
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可见范围" prop="startUserIds" min-width="150">
          <template #default="scope">
            <template v-if="scope?.row">
              <el-text v-if="!scope.row.startUsers?.length && !scope.row.startDepts?.length">
                {{ '全部可见' }}
              </el-text>
              <el-text v-else-if="scope.row.startUsers?.length === 1">
                {{ scope.row.startUsers[0].nickname }}
              </el-text>
              <el-text v-else-if="scope.row.startDepts?.length === 1">
                {{ scope.row.startDepts[0].name }}
              </el-text>
              <el-text v-else-if="(scope.row.startDepts?.length ?? 0) > 1">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="top"
                  :content="(scope.row.startDepts ?? []).map(dept => dept.name).join('、')">
                  {{ scope.row.startDepts?.[0]?.name }}{{ '等' }} {{ scope.row.startDepts?.length }}
                  {{ '个部门可见' }}
                </el-tooltip>
              </el-text>
              <el-text v-else>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="top"
                  :content="(scope.row.startUsers ?? []).map(user => user.nickname).join('、')">
                  {{ scope.row.startUsers?.[0]?.nickname }}{{ '等' }} {{ scope.row.startUsers?.length }}
                  {{ '人可见' }}
                </el-tooltip>
              </el-text>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="流程类型" prop="type" min-width="120">
          <template #default="scope">
            <dict-tag v-if="scope?.row" :value="scope.row.type" :type="DICT_TYPE.BPM_MODEL_TYPE" />
          </template>
        </el-table-column>
        <el-table-column label="表单信息" prop="formType" min-width="150">
          <template #default="scope">
            <template v-if="scope?.row">
              <el-button
                v-if="scope.row.formType === BpmModelFormType.NORMAL"
                type="primary"
                link
                @click="handleFormDetail(scope.row)">
                <span>{{ scope.row.formName }}</span>
              </el-button>
              <el-button
                v-else-if="scope.row.formType === BpmModelFormType.CUSTOM"
                type="primary"
                link
                @click="handleFormDetail(scope.row)">
                <span>{{ scope.row.formCustomCreatePath }}</span>
              </el-button>
              <label v-else>{{ '暂无表单' }}</label>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="最后发布" prop="deploymentTime" min-width="250">
          <template #default="scope">
            <div v-if="scope?.row" class="flex items-center">
              <span v-if="scope.row.processDefinition" class="w-150px">
                {{ formatDate(scope.row.processDefinition.deploymentTime) }}
              </span>
              <el-tag v-if="scope.row.processDefinition"> v{{ scope.row.processDefinition.version }} </el-tag>
              <el-tag v-else type="warning">
                {{ '未部署' }}
              </el-tag>
              <el-tag v-if="scope.row.processDefinition?.suspensionState === 2" type="warning" class="ml-10px">
                {{ '已停用' }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <template v-if="scope?.row">
              <el-button link type="primary" @click="openModelForm('update', scope.row.id)">
                <!-- :disabled="!isManagerUser(scope.row)" -->
                {{ '修改' }}
              </el-button>
              <el-button link type="primary" @click="openModelForm('copy', scope.row.id)">
                <!-- :disabled="!isManagerUser(scope.row)" -->
                {{ '复制' }}
              </el-button>
              <el-button link class="!ml-5px" type="primary" @click="handleDeploy(scope.row)">
                <!-- :disabled="!isManagerUser(scope.row)" -->
                {{ '发布' }}
              </el-button>
              <el-dropdown class="!align-middle ml-5px" @command="command => handleModelCommand(command, scope.row)">
                <el-button type="primary" link>
                  {{ '更多' }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="handleDefinitionList">
                      {{ '历史' }}
                    </el-dropdown-item>
                    <!-- <el-dropdown-item
                    command="handleReport"
                    v-if="
                      scope.row.processDefinition
                    "
                    :disabled="!isManagerUser(scope.row)"
                  >
                    报表
                  </el-dropdown-item> -->
                    <el-dropdown-item v-if="scope.row.processDefinition" command="handleChangeState">
                      <!-- :disabled="!isManagerUser(scope.row)" -->
                      {{ scope.row.processDefinition.suspensionState === 1 ? '停用' : '启用' }}
                    </el-dropdown-item>
                    <el-dropdown-item type="danger" command="handleClean">
                      <!-- :disabled="!isManagerUser(scope.row)" -->
                      {{ '清理' }}
                    </el-dropdown-item>
                    <el-dropdown-item type="danger" command="handleDelete">
                      <!-- :disabled="!isManagerUser(scope.row)" -->
                      {{ '删除' }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>
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

<style lang="scss" scoped>
.flow-icon {
  display: flex;
  width: 38px;
  height: 38px;
  margin-right: 10px;
  background-color: var(--el-color-primary);
  border-radius: 0.25rem;
  align-items: center;
  justify-content: center;
}

.category-draggable-model {
  :deep(.el-table__cell) {
    overflow: hidden;
    border-bottom: none !important;
  }

  // 优化表格渲染性能
  :deep(.el-table__body) {
    will-change: transform;
    transform: translateZ(0);
  }
}
</style>
