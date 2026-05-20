<template>
  <ContentWrap class="pt-10px">
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="" prop="params.name">
        <el-input
          v-model="queryParams.params.name"
          :placeholder="$t('请输入流程名称')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> {{ $t('搜索') }}</el-button>
      </el-form-item>

      <el-form-item label="" prop="params.category" class="absolute right-[300px]">
        <el-select
          v-model="queryParams.params.category"
          :placeholder="$t('请选择流程分类')"
          clearable
          class="!w-155px"
          @change="handleQuery">
          <el-option
            v-for="category in categoryList"
            :key="category.code"
            :label="category.name"
            :value="category.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="params.status" class="absolute right-[130px]">
        <el-select
          v-model="queryParams.params.status"
          :placeholder="$t('请选择流程状态')"
          clearable
          class="!w-155px"
          @change="handleQuery">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>

      <!-- 高级筛选 -->
      <el-form-item class="absolute right-0">
        <el-popover :visible="showPopover" persistent :width="400" :show-arrow="false" placement="bottom-end">
          <template #reference>
            <el-button @click="showPopover = !showPopover">
              <Icon icon="ep:plus" class="mr-5px" />
              {{ $t('高级筛选') }}
            </el-button>
          </template>
          <el-form-item :label="$t('所属流程')" class="font-bold" label-position="top" prop="processDefinitionKey">
            <el-select
              v-model="queryParams.params.processDefinitionKey"
              :placeholder="$t('请选择流程定义')"
              clearable
              class="!w-390px"
              @change="handleQuery">
              <el-option v-for="item in processDefinitionList" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('发起时间')" class="font-bold" label-position="top" prop="time">
            <el-date-picker
              v-model="time"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              class="!w-240px" />
          </el-form-item>
          <el-form-item class="font-bold" label-position="top">
            <div class="flex justify-end w-full">
              <el-button @click="resetQuery">{{ $t('清空') }}</el-button>
              <el-button @click="showPopover = false">{{ $t('取消') }}</el-button>
              <el-button type="primary" @click="handleQuery">{{ $t('确认') }}</el-button>
            </div>
          </el-form-item>
        </el-popover>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <div class="pt-20px">
      <el-table v-loading="loading" :data="list">
        <el-table-column :label="$t('流程名称')" align="center" prop="name" min-width="200px" fixed="left" />
        <el-table-column :label="$t('摘要')" prop="summary" width="180" fixed="left">
          <template #default="scope">
            <div class="flex flex-col" v-if="scope.row.summary && scope.row.summary.length > 0">
              <div v-for="(item, index) in scope.row.summary" :key="index">
                <el-text type="info"> {{ item.key }} : {{ item.value }} </el-text>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('流程分类')" align="center" prop="categoryName" min-width="100" fixed="left" />
        <el-table-column :label="$t('流程状态')" prop="status" min-width="200">
          <template #default="scope">
            <!-- 审批中状态 -->
            <template v-if="scope.row.status === BpmProcessInstanceStatus.RUNNING && scope.row.tasks?.length > 0">
              <!-- 单人审批 -->
              <template v-if="scope.row.tasks.length === 1">
                <span>
                  <el-button link type="primary" @click="handleDetail(scope.row)">
                    {{ scope.row.tasks[0].assigneeUser?.nickname }}
                  </el-button>
                  ({{ scope.row.tasks[0].name }}) {{ $t('审批中') }}
                </span>
              </template>
              <!-- 多人审批 -->
              <template v-else>
                <span>
                  <el-button link type="primary" @click="handleDetail(scope.row)">
                    {{ scope.row.tasks[0].assigneeUser?.nickname }}
                  </el-button>
                  等 {{ scope.row.tasks.length }} 人 ({{ scope.row.tasks[0].name }})审批中
                </span>
              </template>
            </template>
            <!-- 非审批中状态 -->
            <template v-else>
              <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status" />
            </template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('发起时间')"
          align="center"
          prop="startTime"
          width="180"
          :formatter="dateFormatter" />
        <el-table-column :label="$t('结束时间')" align="center" prop="endTime" width="180" :formatter="dateFormatter" />
        <el-table-column :label="$t('操作')" align="center" fixed="right" width="180">
          <template #default="scope">
            <el-button
              link
              type="primary"
              v-hasPermi="['bpm:process-instance:cancel']"
              @click="handleDetail(scope.row)">
              {{ $t('详情') }}
            </el-button>
            <el-button
              link
              type="primary"
              v-if="scope.row.status === 1"
              v-hasPermi="['bpm:process-instance:query']"
              @click="handleCancel(scope.row)">
              {{ $t('取消') }}
            </el-button>
            <el-button link type="primary" v-else @click="handleCreate(scope.row)">
              {{ $t('重新发起') }}
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
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { ElMessageBox } from 'element-plus'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { CategoryApi, CategoryVO } from '@/api/bpm/category'
import { ProcessInstanceVO } from '@/api/bpm/processInstance'
import * as DefinitionApi from '@/api/bpm/definition'
import { BpmProcessInstanceStatus } from '@/utils/constants'

defineOptions({ name: 'BpmProcessInstanceMy' })
import { useMessage } from '@/hooks/web/useMessage'
const router = useRouter() // 路由
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const processDefinitionList = ref<any[]>([]) // 流程定义列表

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  params: {
    name: '',
    processDefinitionKey: undefined,
    category: undefined,
    status: undefined,
    createTime: [],
    endTime: [],
  },
})

const time = ref([])
const queryFormRef = ref() // 搜索的表单
const categoryList = ref<CategoryVO[]>([]) // 流程分类列表
const showPopover = ref(false) // 高级筛选是否展示

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProcessInstanceApi.getProcessInstanceMyPage(queryParams)
    list.value = data.data
    total.value = data.count
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  if (time.value.length) {
    queryParams.params.createTime = time.value[0] ? [time.value[0]] : []
    queryParams.params.endTime = time.value[1] ? [time.value[1]] : []
  } else {
    queryParams.params.createTime = []
    queryParams.params.endTime = []
  }
  queryParams.pageIndex = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  time.value = []
  handleQuery()
}

/** 发起流程操作 **/
const handleCreate = async (row?: ProcessInstanceVO) => {
  // 如果是【业务表单】，不支持重新发起
  if (row?.id) {
    const processDefinitionDetail = await DefinitionApi.getProcessDefinition(row.processDefinitionId)
    if (processDefinitionDetail.formType === 20) {
      message.error(t('重新发起流程失败，原因：该流程使用业务表单，不支持重新发起'))
      return
    }
  }
  // 跳转发起流程界面
  await router.push({
    name: 'BpmProcessInstanceCreate',
    query: { processInstanceId: row?.id },
  })
}

/** 查看详情 */
const handleDetail = (row: ProcessInstanceVO) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.id,
    },
  })
}

/** 取消按钮操作 */
const handleCancel = async (row: ProcessInstanceVO) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('确定'),
    cancelButtonText: t('取消'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空',
  })
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstanceByStartUser(row.id, value)
  message.success(t('取消成功'))
  // 刷新列表
  await getList()
}

/** 激活时 **/
onActivated(() => {
  getList()
})

/** 初始化 **/
onMounted(async () => {
  await getList()
  categoryList.value = await CategoryApi.getCategorySimpleList()
  // 获取流程定义列表
  processDefinitionList.value = await DefinitionApi.getSimpleProcessDefinitionList()
})
</script>
