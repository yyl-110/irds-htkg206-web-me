<template>
  <ContentWrap class="pt-10px">
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
      <el-form-item :label="$t('任务名称')" prop="params.name">
        <el-input
          v-model="queryParams.params.name"
          class="!w-240px"
          clearable
          :placeholder="$t('请输入任务名称')"
          @keyup.enter="handleQuery" />
      </el-form-item>

      <el-form-item :label="$t('流程主题')" prop="params.processBusinessTypeName">
        <el-input
          v-model="queryParams.params.processBusinessTypeName"
          :placeholder="$t('请输入流程主题')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item :label="$t('创建时间')" prop="params.createTime">
        <el-date-picker
          v-model="queryParams.params.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          :end-placeholder="$t('结束日期')"
          :start-placeholder="$t('开始日期')"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          {{ $t('搜索') }}
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          {{ $t('重置') }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="pt-20px">
      <el-table v-loading="loading" :data="list" height="calc(100vh - 300px)" style="width: 100%" border>
        <el-table-column align="center" :label="$t('流程名称')" prop="processInstance.name" width="180" />
        <el-table-column
          align="center"
          :label="$t('流程主题')"
          prop="processInstance.processVariables.PROCESS_BUSINESS_TYPE_NAME"
          width="180" />
        <el-table-column
          align="center"
          :label="$t('发起人')"
          prop="processInstance.startUser.nickname"
          width="100"
          sortable />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          :label="$t('发起时间')"
          prop="createTime"
          width="180"
          sortable />

        <el-table-column align="center" :label="$t('当前任务')" prop="name" width="180" />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          :label="$t('任务开始时间')"
          prop="createTime"
          width="180"
          sortable />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          :label="$t('任务结束时间')"
          prop="endTime"
          width="180"
          sortable />
        <el-table-column align="center" :label="$t('审批人')" prop="assigneeUser.nickname" width="100" />
        <el-table-column align="center" :label="$t('审批状态')" prop="status" width="120">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('审批建议')" prop="reason" min-width="180" />
        <el-table-column align="center" :label="$t('耗时')" prop="durationInMillis" width="160">
          <template #default="scope">
            {{ formatPast2(scope.row.durationInMillis) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('流程编号')"
          prop="processInstanceId"
          width="220"
          :show-overflow-tooltip="true" />
        <el-table-column align="center" :label="$t('任务编号')" prop="id" width="220" :show-overflow-tooltip="true" />
        <el-table-column align="center" :label="$t('操作')" fixed="right" width="80">
          <template #default="scope">
            <el-button link type="primary" @click="handleAudit(scope.row)">{{ $t('历史') }}</el-button>
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
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter, formatPast2 } from '@/utils/formatTime'
import * as TaskApi from '@/api/bpm/task'
import { ContentWrap } from '@/components/ContentWrap'
// 它和【待办任务】【已办任务】的差异是，该菜单可以看全部的流程任务
defineOptions({ name: 'BpmManagerTask' })

const { push } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  params: {
    name: '',
    createTime: [],
    processBusinessTypeName: undefined,
    formFieldsParams: '{}',
  },
})

const queryFormRef = ref() // 搜索的表单

/** 查询任务列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TaskApi.getTaskManagerPage(queryParams)
    if (data.data.code === 200) {
      list.value = data.data.data.data || []
      total.value = data.data.data.count || 0
    }
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageIndex = 1
  const formFields = { PROCESS_BUSINESS_TYPE_NAME: '' }
  if (queryParams.params.processBusinessTypeName) {
    formFields.PROCESS_BUSINESS_TYPE_NAME = queryParams.params.processBusinessTypeName
  }

  // 将JSON对象转换为字符串
  queryParams.params.formFieldsParams = JSON.stringify(formFields)
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 处理审批按钮 */
const handleAudit = (row: any) => {
  // push({
  //   name: 'BpmProcessInstanceDetail',
  //   query: {
  //     id: row.processInstance.id,
  //   },
  // })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
