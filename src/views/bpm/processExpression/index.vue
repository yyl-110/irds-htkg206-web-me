<template>
  <ContentWrap class="pt-10px">
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item :label="$t('名字')" prop="params.name">
        <el-input
          v-model="queryParams.params.name"
          :placeholder="$t('请输入名字')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item :label="$t('状态')" prop="params.status">
        <el-select v-model="queryParams.params.status" :placeholder="$t('请选择状态')" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('创建时间')" prop="params.createTime">
        <el-date-picker
          v-model="queryParams.params.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> {{ $t('搜索') }}</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> {{ $t('重置') }}</el-button>
        <el-button type="primary" plain @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />
          {{ $t('新增') }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <div class="pt-20px">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column :label="$t('编号')" align="center" prop="id" />
        <el-table-column :label="$t('名字')" align="center" prop="name" />
        <el-table-column :label="$t('状态')" align="center" prop="status">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('表达式')" align="center" prop="expression" />
        <el-table-column
          :label="$t('创建时间')"
          align="center"
          prop="creationDate"
          :formatter="dateFormatter"
          width="180px" />
        <el-table-column :label="$t('操作')" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="openForm('update', scope.row.id)">
              {{ $t('编辑') }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)"> {{ $t('删除') }} </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageIndex"
        v-model:limit="queryParams.pageRows"
        @pagination="getList" />
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProcessExpressionForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { ProcessExpressionApi, ProcessExpressionVO } from '@/api/bpm/processExpression'
import ProcessExpressionForm from './ProcessExpressionForm.vue'

/** BPM 流程表达式列表 */
defineOptions({ name: 'BpmProcessExpression' })
import { useMessage } from '@/hooks/web/useMessage'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProcessExpressionVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  orderByBean: {
    attributeName: '',
    sortType: '',
  },
  params: {
    name: undefined,
    status: undefined,
    createTime: [],
  },
})

const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProcessExpressionApi.getProcessExpressionPage(queryParams)
    list.value = data.data
    total.value = data.count
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageIndex = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProcessExpressionApi.deleteProcessExpression(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
