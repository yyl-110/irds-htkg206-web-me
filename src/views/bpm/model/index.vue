<script lang="ts" setup>
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import { useDebounceFn } from '@vueuse/core'
import CategoryForm from '../category/CategoryForm.vue'
import CategoryDraggableModel from './CategoryDraggableModel.vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { SettingOutlined } from '@ant-design/icons-vue'
import { ContentWrap } from '@/components/ContentWrap'
import { EpcIcon } from '@/components/icon/EpcIcon'
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
function handleSettingsMenuClick({ key }: MenuInfo) {
  handleCommand(String(key))
}

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
    <div class="bpm-model-toolbar-wrap">
      <!-- 搜索工作栏 -->
      <a-form
        v-if="!isCategorySorting"
        ref="queryFormRef"
        class="calc-toolbar-form bpm-model-toolbar-form"
        layout="inline"
        :model="queryParams"
        @finish="handleQuery">
        <a-form-item name="name">
          <a-input
            v-model:value="queryParams.name"
            style="width: 240px"
            placeholder="请输入流程名称"
            allow-clear />
        </a-form-item>
        <a-form-item class="bpm-model-toolbar-form__actions">
          <a-button type="primary" html-type="submit">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            查询
          </a-button>
          <a-button type="primary" style="margin-left: 15px" @click="openForm('create')">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            新建流程
          </a-button>
          <a-dropdown placement="bottomRight">
            <a-button style="margin-left: 15px">
              <SettingOutlined />
            </a-button>
            <template #overlay>
              <a-menu @click="handleSettingsMenuClick">
                <a-menu-item key="handleCategoryAdd">
                  新建分类
                </a-menu-item>
                <a-menu-item key="handleCategorySort">
                  分类排序
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-form-item>
      </a-form>
      <div v-else class="bpm-model-sort-actions">
        <a-button @click="handleCategorySortCancel">
          取 消
        </a-button>
        <a-button type="primary" style="margin-left: 15px" @click="handleCategorySortSubmit">
          保存排序
        </a-button>
      </div>
    </div>

    <!-- 按照分类，展示其所属的模型列表 -->
    <a-spin :spinning="loading">
    <div class="px-15px position-relative min-h-200px bpm-model-list-body">
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
    </a-spin>
  </ContentWrap>

  <!-- 表单弹窗：添加分类 -->
  <CategoryForm ref="categoryFormRef" @success="getList" />
  <!-- 弹窗：表单详情 -->
  <Dialog v-model="formDetailVisible" title="表单详情" width="800">
    <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.option" />
  </Dialog>
</template>

<style lang="scss" scoped>
.bpm-model-toolbar-wrap {
  padding: 10px 20px 12px;
}

.calc-toolbar-form {
  gap: 4px;
}

.bpm-model-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.bpm-model-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.bpm-model-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 16px;
}

.bpm-model-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.bpm-model-sort-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.bpm-model-list-body {
  padding-top: 4px;
}

:deep() {
  .el-card {
    border-radius: 8px;
  }
}
</style>
