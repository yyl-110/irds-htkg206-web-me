<template>
  <ContentWrap class="pt-10px">
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <!-- <el-form-item label="发起人" prop="params.startUserId">
        <el-select v-model="queryParams.params.startUserId" placeholder="请选择发起人" class="!w-240px">
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickName"
            :value="user.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item :label="$t('流程名称')" prop="params.name">
        <el-input
          v-model="queryParams.params.name"
          :placeholder="$t('请输入流程名称')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item :label="$t('流程主题')" prop="params.processBusinessTypeName">
        <el-input
          v-model="queryParams.params.processBusinessTypeName"
          :placeholder="$t('请输入流程主题')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item :label="$t('流程分类')" prop="category">
        <el-select v-model="queryParams.params.category" :placeholder="$t('请选择流程分类')" clearable class="!w-240px">
          <el-option
            v-for="category in categoryList"
            :key="category.code"
            :label="category.name"
            :value="category.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('流程状态')" prop="params.status">
        <el-select v-model="queryParams.params.status" :placeholder="$t('请选择流程状态')" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('发起时间')" prop="params.createTime">
        <el-date-picker
          v-model="queryParams.params.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px" />
      </el-form-item>
      <el-form-item :label="$t('流程编号')" prop="params.processInstanceId">
        <el-input
          v-model="queryParams.params.processInstanceId"
          :placeholder="$t('请输入流程实例编号')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> {{ $t('搜索') }}</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> {{ $t('重置') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="pt-20px">
      <!-- 列表 -->
      <el-table v-loading="loading" :data="list" height="calc(100vh - 300px)" style="width: 100%" border>
        <el-table-column
          label="主题"
          align="left"
          prop="processVariables.PROCESS_BUSINESS_TYPE_NAME"
          min-width="500px"
          fixed="left">
          <template #default="scope">
            <el-tooltip class="item" placement="top">
              <template #content>
                <component :is="getTipContent(scope.row, '主题')" />
              </template>
              <el-link
                type="primary"
                :underline="false"
                @click="showProcessDetail(scope.row)"
                class="process-title-link">
                {{ scope.row.processVariables.PROCESS_BUSINESS_TYPE_NAME }}
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('任务名称')" align="center" prop="tasks" min-width="120px">
          <template #default="scope">
            <div type="primary" v-for="task in scope.row.tasks" :key="task.id">
              <el-tooltip class="item" placement="top">
                <template #content>
                  <div v-html="getTipContent(task, '任务名称')"></div>
                </template>
                <el-link type="primary" :underline="false">{{ task.name }}</el-link>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('当前审批人')" align="center" prop="taskUser" min-width="120px">
          <template #default="scope">
            <v-if scope.row.tasks>
              <div type="primary" v-for="user in scope.row.tasks" :key="user.id" link>
                <el-tooltip class="item" placement="top">
                  <template #content>
                    <div v-html="getTipContent(user, '当前审批人')"></div>
                  </template>
                  <el-link type="primary" :underline="false">{{ user?.assigneeUser?.nickname }}</el-link>
                </el-tooltip>
              </div>
            </v-if>
          </template>
        </el-table-column>

        <el-table-column label="流程名称" align="left" prop="name" min-width="180px" />
        <el-table-column :label="$t('流程分类')" align="left" prop="categoryName" min-width="180" />
        <el-table-column :label="$t('发起人')" align="center" prop="startUser.nickname" width="80">
          <template #default="scope">
            <el-tooltip :content="scope.row.startUser?.account" placement="top">
              <span>{{ scope.row.startUser?.nickname }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('发起部门')" align="center" prop="startUser.deptName" width="120" />
        <el-table-column :label="$t('流程状态')" prop="status" width="120">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('发起时间')"
          align="left"
          prop="startTime"
          width="170"
          :formatter="dateFormatter"
          sortable />
        <el-table-column
          :label="$t('结束时间')"
          align="left"
          prop="endTime"
          width="190"
          :formatter="dateFormatter"
          sortable />
        <!-- <el-table-column align="center" :label="$t('耗时')" prop="durationInMillis" width="120">
          <template #default="scope">
            {{ scope.row.durationInMillis > 0 ? formatPast2(scope.row.durationInMillis) : '-' }}
          </template>
        </el-table-column> -->

        <el-table-column :label="$t('流程编号')" align="center" prop="id" min-width="320px" />
        <el-table-column :label="$t('操作')" align="center" left fixed="right" width="190">
          <template #default="scope">
            <el-button link type="primary" @click="handleDetail(scope.row)">
              {{ $t('详情') }}
            </el-button>
            <el-button link type="primary" @click="showProcessVariables(scope.row)">
              {{ $t('流程变量') }}
            </el-button>
            <el-button link type="primary" v-if="scope.row.status === 1" @click="handleCancel(scope.row)">
              <span style="color: red">{{ $t('取消') }}</span>
            </el-button>
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

    <!-- 流程变量弹窗 -->
    <el-dialog v-model="processVariablesDialogVisible" title="流程变量" width="60%" :close-on-click-modal="false">
      <div class="process-variables-container">
        <el-input
          v-model="processVariablesContent"
          type="textarea"
          :rows="20"
          readonly
          placeholder="流程变量内容将显示在这里"
          class="process-variables-textarea"
          style="font-weight: 800 !important" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="processVariablesDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="copyProcessVariables">复制内容</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 流程详情抽屉 -->
    <ProcessDetailDrawer
      v-model="processDetailDrawerVisible"
      :process-detail="currentProcessDetail"
      @show-process-variables="showProcessVariables" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { ElMessageBox } from 'element-plus'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { CategoryApi } from '@/api/bpm/category'
import * as UserApi from '@/api/system/user'
import { useI18n } from 'vue-i18n'
import { h } from 'vue'
import DictTag from '@/components/DictTag/src/DictTag.vue'
import ProcessDetailDrawer from './components/ProcessDetailDrawer.vue'
const { t } = useI18n() // 国际化
// 它和【我的流程】的差异是，该菜单可以看全部的流程实例
defineOptions({ name: 'BpmProcessInstanceManager' })
import { useMessage } from '@/hooks/web/useMessage'
const router = useRouter() // 路由
const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 20,
  orderByBean: {
    attributeName: '',
    sortType: '',
  },
  params: {
    startUserId: undefined,
    name: '',
    processDefinitionId: undefined,
    processInstanceId: undefined,
    processBusinessTypeName: undefined,
    category: undefined,
    status: undefined,
    createTime: [],
    formFieldsParams: '{}', // 新增formFieldsParams字段，存储JSON字符串
  },
})

const queryParams2 = reactive({
  pageIndex: 1,
  pageRows: 9999,
  params: {},
})

const queryFormRef = ref() // 搜索的表单
const categoryList = ref<any[]>([]) // 流程分类列表
const userList = ref<any[]>([]) // 用户列表

// 流程变量弹窗相关
const processVariablesDialogVisible = ref(false) // 弹窗显示状态
const processVariablesContent = ref('') // 流程变量内容
const processInstanceId = ref('') // 当前流程实例ID

// 流程详情抽屉相关
const processDetailDrawerVisible = ref(false) // 抽屉显示状态
const currentProcessDetail = ref(null) // 当前流程详情数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProcessInstanceApi.getProcessInstanceManagerPage(queryParams)
    list.value = data.data
    total.value = data.count
  } finally {
    loading.value = false
  }
}

const getTipContent = (row, label) => {
  if (label === '当前审批人') {
    return `<div>
      <div>名称：${row.assigneeUser?.nickname}</div>
      <div>工号：${row.assigneeUser?.account}</div>
    </div>`
  }
  if (label === '任务名称') {
    return `<div>
      暂无任务状态
    </div>`
  }
  if (label === '主题') {
    // 需要对流程状态进行h渲染，使用el tag的形式
    return h('div', [
      h('div', `流程编号：${row.id}`),
      h('div', `流程名称：${row.name}`),
      h('div', `流程分类：${row.categoryName}`),
      h('div', [
        '流程状态：',
        h(DictTag, {
          type: DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS,
          value: row.status,
        }),
      ]),
      h('div', `发起时间：${row.startTime}`),
      h('div', `结束时间：${row.endTime || '-'}`),
      h('div', `发起人：${row.startUser?.nickname}`),
      h('div', `发起部门：${row.startUser?.deptName}`),
    ])
  }
  return '暂无定义提示信息'
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageIndex = 1
  // 构建formFieldsParams JSON字符串
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

/** 查看详情 */
const handleDetail = row => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.id,
      pageIndex: 0,
      orderNo: row.processVariables.orderNo,
    },
  })
}

/** 取消按钮操作 */
const handleCancel = async row => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('确定'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空',
  })
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstanceByAdmin(row.id, value)
  message.success(t('取消成功'))
  // 刷新列表
  await getList()
}

/** 查看流程变量 */
const showProcessVariables = async row => {
  try {
    processInstanceId.value = row.id
    processVariablesContent.value = '加载中...'
    processVariablesDialogVisible.value = true

    // 调用API获取流程变量
    const response = await ProcessInstanceApi.getProcessVariables(row.id)

    if (response && response.data) {
      // 格式化JSON数据，使其更易读
      processVariablesContent.value = JSON.stringify(response.data, null, 2)
    } else {
      processVariablesContent.value = '暂无流程变量数据'
    }
  } catch (error) {
    console.error('获取流程变量失败:', error)
    processVariablesContent.value = '获取流程变量失败，请重试'
    message.error('获取流程变量失败')
  }
}

/** 复制流程变量内容 */
const copyProcessVariables = async () => {
  try {
    await navigator.clipboard.writeText(processVariablesContent.value)
    message.success('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    message.error('复制失败，请手动复制')
  }
}

/** 显示流程详情抽屉 */
const showProcessDetail = row => {
  currentProcessDetail.value = row
  processDetailDrawerVisible.value = true
}

/** 激活时 **/
onActivated(() => {
  getList()
})

/** 初始化 **/
onMounted(async () => {
  await getList()
  const resp = await CategoryApi.getCategoryPage(queryParams2)
  categoryList.value = resp.data || []
  console.log(categoryList.value, 'categoryList')

  const resp2 = (await UserApi.getSimpleUserList()) as any
  userList.value = resp2 && resp2.data ? resp2.data : []
})
</script>

<style lang="scss" scoped>
.process-variables-container {
  .process-variables-textarea {
    :deep(.el-textarea__inner) {
      font-family: 'Courier New', Courier, monospace !important;
      font-size: 12px !important;
      font-weight: 800 !important;
      line-height: 1.5 !important;
      background-color: #f8f9fa !important;
      border: 1px solid #e9ecef !important;
      resize: vertical !important;
    }
  }
}

// 使用更高优先级的选择器确保样式生效
:deep(.el-dialog .el-textarea__inner) {
  font-weight: 800 !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 流程详情抽屉样式 */
.process-detail-content {
  padding: 0 10px;
}

.process-title-link {
  cursor: pointer;
  transition: color 0.3s ease;
}

.process-title-link:hover {
  color: #409eff !important;
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
</style>
