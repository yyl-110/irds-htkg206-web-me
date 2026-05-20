<script lang="ts" setup>
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import { useDebounceFn } from '@vueuse/core'
import CategoryForm from '../category/CategoryForm.vue'
import CategoryDraggableModel from './CategoryDraggableModel.vue'
import { ContentWrap } from '@/components/ContentWrap'
import * as ModelApi from '@/api/bpm/model'
import { CategoryApi } from '@/api/bpm/category'

// 国际化
defineOptions({ name: 'bpm/model' })
const route = useRoute()
const { push } = useRouter()
const loading = ref(false) // 列表的加载中
const isCategorySorting = ref(false) // 是否 category 正处于排序状态
const queryParams = reactive({
  name: undefined,
})
const queryFormRef = ref() // 搜索的表单
const categoryGroup: any = ref([]) // 按照 category 分组的数据
const originalData: any = ref([]) // 原始数据

/** 搜索按钮操作 */
function handleQuery() {
  getList()
}

/**
 * 添加/修改操作
 * @param type
 * @param id
 */
function openForm(type: string, id?: number) {
  if (type === 'create') {
    push({ name: 'BpmModelCreate' })
  } else {
    push({
      name: 'BpmModelUpdate',
      params: { id },
    })
  }
}

/** 流程表单的详情按钮操作 */
const formDetailVisible = ref(false)
const formDetailPreview = ref({
  rule: [],
  option: {},
})

/**
 * 右上角设置按钮
 * @param command
 */
function handleCommand(command: string) {
  switch (command) {
    case 'handleCategoryAdd':
      handleCategoryAdd()
      break
    case 'handleCategorySort':
      handleCategorySort()
      break
    default:
      break
  }
}

/** 新建分类 */
const categoryFormRef = ref()
function handleCategoryAdd() {
  categoryFormRef.value.open('create')
}

/** 分类排序的提交 */
function handleCategorySort() {
  // 保存初始数据
  originalData.value = cloneDeep(categoryGroup.value)
  isCategorySorting.value = true
}

/** 分类排序的取消 */
function handleCategorySortCancel() {
  // 恢复初始数据
  categoryGroup.value = cloneDeep(originalData.value)
  isCategorySorting.value = false
}

/** 分类排序的保存 */
async function handleCategorySortSubmit() {
  // 保存排序
  const ids = categoryGroup.value.map((item: any) => item.id)
  await CategoryApi.updateCategorySortBatch(ids)
  // 刷新列表
  isCategorySorting.value = false
  message.success('排序分类成功')
  await getList()
}

/** 加载数据 */
async function getList() {
  loading.value = true
  try {
    // 查询模型 + 分裂的列表
    const modelList = await ModelApi.getModelList(queryParams.name)
    const categoryList = await CategoryApi.getCategorySimpleList()
    // 按照 category 聚合
    // 注意：必须一次性赋值给 categoryGroup，否则每次操作后，列表会重新渲染，滚动条的位置会偏离！！！
    categoryGroup.value = categoryList.data.data.map((category: any) => ({
      ...category,
      modelList: modelList.data.data.filter((model: any) => model.categoryName === category.name),
    }))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

/** 仅在本页路由激活时刷新列表；防抖合并短时间内的多次触发 */
const debouncedGetList = useDebounceFn(() => {
  void getList()
}, 300)

watch(
  () => route.path,
  path => {
    if (path === '/bpm/model') {
      debouncedGetList()
    }
  },
  { immediate: true },
)
</script>

<template>
  <ContentWrap>
    <div class="flex justify-between pl-20px items-center pt-10px">
      <h3 class="font-extrabold">
        {{ '流程模型' }}
      </h3>
      <!-- 搜索工作栏 -->
      <el-form
        v-if="!isCategorySorting"
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        label-width="68px"
        @submit.prevent>
        <el-form-item prop="name" class="ml-auto">
          <el-input
            v-model="queryParams.name"
            placeholder="搜索流程"
            clearable
            class="!w-240px"
            @keyup.enter="handleQuery">
            <template #prefix>
              <Icon icon="ep:search" class="mx-10px" />
            </template>
          </el-input>
        </el-form-item>
        <!-- 右上角：新建模型、更多操作 -->
        <el-form-item>
          <el-button type="primary" @click="openForm('create')">
            <Icon icon="ep:plus" class="mr-5px" />
            {{ '新建模型' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown placement="bottom-end" @command="command => handleCommand(command)">
            <el-button class="w-30px" plain>
              <Icon icon="ep:setting" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="handleCategoryAdd">
                  <Icon icon="ep:circle-plus" :size="13" class="mr-5px" />
                  {{ '新建分类' }}
                </el-dropdown-item>
                <el-dropdown-item command="handleCategorySort">
                  <Icon icon="fa:sort-amount-desc" :size="13" class="mr-5px" />
                  {{ '分类排序' }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <div v-else class="mr-20px">
        <el-button @click="handleCategorySortCancel">
          {{ '取 消' }}
        </el-button>
        <el-button type="primary" @click="handleCategorySortSubmit">
          {{ '保存排序' }}
        </el-button>
      </div>
    </div>

    <el-divider />

    <!-- 按照分类，展示其所属的模型列表 -->
    <div v-loading="loading" class="px-15px position-relative min-h-200px">
      <draggable
        v-model="categoryGroup"
        :disabled="!isCategorySorting"
        item-key="id"
        :animation="400"
        handle=".category-drag-icon">
        <template #item="{ element }">
          <ContentWrap
            :key="element.id"
            class="rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl"
            :body-style="{ padding: 0 }">
            <CategoryDraggableModel
              :is-category-sorting="isCategorySorting"
              :category-info="element"
              @success="getList" />
          </ContentWrap>
        </template>
      </draggable>
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加分类 -->
  <CategoryForm ref="categoryFormRef" @success="getList" />
  <!-- 弹窗：表单详情 -->
  <Dialog v-model="formDetailVisible" title="表单详情" width="800">
    <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.option" />
  </Dialog>
</template>

<style lang="scss" scoped>
:deep() {
  .el-table--fit .el-table__inner-wrapper:before {
    height: 0;
  }
  .el-card {
    border-radius: 8px;
  }
  .el-form--inline .el-form-item {
    margin-right: 10px;
  }
  .el-divider--horizontal {
    margin-top: 6px;
  }
}
</style>
