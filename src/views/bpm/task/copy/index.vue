<!-- 工作流 - 抄送我的流程 -->
<template>
  <ContentWrap class="pt-10px">
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" :inline="true" class="-mb-15px" label-width="68px">
      <el-form-item :label="$t('流程名称')" prop="name">
        <el-input
          v-model="queryParams.processInstanceName"
          @keyup.enter="handleQuery"
          class="!w-240px"
          clearable
          :placeholder="$t('请输入流程名称')"
        />
      </el-form-item>
      <el-form-item :label="$t('抄送时间')" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          :end-placeholder="$t('结束日期')"
          :start-placeholder="$t('开始日期')"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
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
      <el-table v-loading="loading" :data="list">
        <!-- TODO 芋艿：增加摘要 -->
        <el-table-column
          align="center"
          :label="$t('流程名')"
          prop="processInstanceName"
          min-width="180"
        />
        <el-table-column :label="$t('摘要')" prop="summary" min-width="180">
          <template #default="scope">
            <div class="flex flex-col" v-if="scope.row.summary && scope.row.summary.length > 0">
              <div v-for="(item, index) in scope.row.summary" :key="index">
                <el-text type="info"> {{ item.key }} : {{ item.value }} </el-text>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('流程发起人')"
          prop="startUser.nickname"
          min-width="100"
        />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          :label="$t('流程发起时间')"
          prop="processInstanceStartTime"
          width="180"
        />
        <el-table-column
          align="center"
          :label="$t('抄送节点')"
          prop="activityName"
          min-width="180"
        />
        <el-table-column align="center" :label="$t('抄送人')" min-width="100">
          <template #default="scope"> {{ scope.row.createUser?.nickname || '系统' }} </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('抄送意见')" prop="reason" width="150" />
        <el-table-column
          align="center"
          :label="$t('抄送时间')"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column align="center" :label="$t('操作')" fixed="right" width="80">
          <template #default="scope">
            <el-button link type="primary" @click="handleAudit(scope.row)">{{ $t('详情') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageRows"
        v-model:page="queryParams.pageIndex"
        :total="total"
        @pagination="getList"
      />
    </div>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'

defineOptions({ name: 'BpmProcessInstanceCopy' })

const { push } = useRouter() // 路由

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
// const queryParams = reactive({
//   pageNo: 1,
//   pageSize: 10,
//   processInstanceId: '',
//   processInstanceName: '',
//   createTime: []
// })

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  params: {
    processInstanceName: '',
    createTime: []
  }
})

const queryFormRef = ref() // 搜索的表单

/** 查询任务列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProcessInstanceApi.getProcessInstanceCopyPage(queryParams)
    list.value = data.data
    total.value = data.count
  } finally {
    loading.value = false
  }
}

/** 处理审批按钮 */
const handleAudit = (row: any) => {
  const query = {
    id: row.processInstanceId,
    activityId: undefined
  }
  if (row.activityId) {
    query.activityId = row.activityId
  }
  push({
    name: 'BpmProcessInstanceDetail',
    query: query
  })
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
