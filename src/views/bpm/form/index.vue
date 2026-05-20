<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as FormApi from '@/api/bpm/form'
import { setConfAndFields2 } from '@/utils/formCreate'
import { useMessage } from '@/hooks/web/useMessage'
import { ContentWrap } from '@/components/ContentWrap'
import { DictTag } from '@/components/DictTag'
import { Dialog } from '@/components/Dialog'
defineOptions({ name: 'BpmForm' })
const message = useMessage() // 消息弹窗
const { currentRoute, push } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  orderByBean: {
    attributeName: '',
    sortType: '',
  },
  params: {
    name: '',
  },
})

const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
async function getList() {
  loading.value = true
  try {
    const data = await FormApi.getFormPage(queryParams)
    if (data.data.code === 200) {
      list.value = data.data.data.data
      total.value = data.data.data.count
    }
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageIndex = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 添加/修改操作
 * @param type
 * @param id
 */
function openForm(type: string, id?: number) {
  const toRouter: { name: string; query: { type: string; id?: number } } = {
    name: 'BpmFormEditor',
    query: {
      type,
    },
  }
  console.log(typeof id)
  // 表单新建的时候id传的是event需要排除
  if (typeof id === 'number' || typeof id === 'string') {
    toRouter.query.id = id
  }
  push(toRouter)
}

/**
 * 删除按钮操作
 * @param id
 */
async function handleDelete(id: number) {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FormApi.deleteForm(id)
    message.success('common.delSuccess')
    // 刷新列表
    await getList()
  } catch {}
}

/** 详情操作 */
const detailVisible = ref(false)
const detailData = ref({
  rule: [],
  option: {},
})
async function openDetail(rowId: number) {
  // 设置表单
  const data = await FormApi.getForm(rowId)
  if (data.data.code !== 200) return
  setConfAndFields2(detailData, data.data.data.conf, data.data.data.fields)
  console.log(detailData, 'detailData')
  // 弹窗打开
  detailVisible.value = true
}
/** 表单保存返回后重新加载列表 */
watch(
  () => currentRoute.value,
  () => {
    getList()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <ContentWrap class="pt-10px">
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
      <el-form-item label="表单名" prop="params.name">
        <el-input
          v-model="queryParams.params.name"
          class="!w-240px"
          clearable
          placeholder="请输入表单名"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          {{ '搜索' }}
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          {{ '重置' }}
        </el-button>
        <el-button plain type="primary" @click="openForm">
          <Icon class="mr-5px" icon="ep:plus" />
          {{ '新增' }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="pt-20px">
      <el-table v-loading="loading" :data="list">
        <el-table-column align="center" label="编号" prop="id" />
        <el-table-column align="center" label="表单名" prop="name" />
        <el-table-column align="center" label="状态" prop="status">
          <template #default="scope">
            <DictTag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark" />
        <el-table-column :formatter="dateFormatter" align="center" label="创建时间" prop="creationDate" />
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button v-hasPermi="['bpm:form:update']" link type="primary" @click="openForm('copy', scope.row.id)">
              {{ '复制' }}
            </el-button>
            <el-button v-hasPermi="['bpm:form:update']" link type="primary" @click="openForm('update', scope.row.id)">
              {{ '编辑' }}
            </el-button>
            <el-button v-hasPermi="['bpm:form:query']" link @click="openDetail(scope.row.id)">
              {{ '详情' }}
            </el-button>
            <el-button v-hasPermi="['bpm:form:delete']" link type="danger" @click="handleDelete(scope.row.id)">
              {{ '删除' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageRows"
        v-model:page="queryParams.pageIndex"
        :total="total"
        @pagination="getList" />
    </div>
  </ContentWrap>

  <!-- 表单详情的弹窗 -->
  <Dialog v-model="detailVisible" title="表单详情" width="800">
    <form-create :option="detailData.option" :rule="detailData.rule" />
  </Dialog>
</template>
