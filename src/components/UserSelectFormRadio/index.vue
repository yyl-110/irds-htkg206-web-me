<template>
  <Dialog v-model="dialogVisible" title="人员选择" width="1300">
    <el-row class="gap2" v-loading="formLoading">
      <el-col :span="6">
        <ContentWrap class="h-1/1">
          <el-tree
            ref="treeRef"
            :data="deptTree"
            :expand-on-click-node="false"
            :props="defaultProps"
            default-expand-all
            highlight-current
            node-key="id"
            @node-click="handleNodeClick"
          />
        </ContentWrap>
      </el-col>
      <el-col :span="17">
        <el-form
        @submit.native.prevent
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        style="padding-left: 20px;"
        label-width="68px">
          <el-form-item label="登录账号" prop="params.userName">
            <el-input
              v-model="queryParams.params.userName"
              placeholder="请输入登录账号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户名称" prop="params.nickName">
            <el-input
              v-model="queryParams.params.nickName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="状态" prop="status" style="margin-right: 32px">
            <el-select
              v-model="queryParams.params.status"
              placeholder="授权状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in typeList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" icon="Search" size="small" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="Refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table  ref="singleTableRef" :data="userList" style="padding:20px;" height="600" @select="selectChange"  @select-all="selectChange" >
          <el-table-column type="selection"  width="55" />
           <el-table-column prop="loginAccount" label="用户编号"></el-table-column>
          <el-table-column prop="psnName" label="姓名"></el-table-column>
          <el-table-column prop="depName" label="所属部门"></el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageIndex"
          v-model:limit="queryParams.pageRows"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <template #footer>
      <el-button
        :disabled="!selectedUserIdList?.length"
        type="primary"
        @click="submitForm">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { defaultProps, handleTree, treeToList } from '@/utils/tree'
import { findDeptTree } from '@/api/system-manage/dept'
import { getUserfindList, findPagination } from '@/api/system-manage/user'

const props = defineProps({
  singleType: Boolean,  // true 单选模式 false 多选模式
  default:() => false,
})

defineOptions({ name: 'UserSelectForm' })
const emit = defineEmits<{
  confirm: [id: any, userList: any[]]
}>()
const { t } = useI18n() // 国际
const deptTree = ref<Tree[]>([]) // 部门树形结构化
const deptList = ref<any[]>([]) // 保存扁平化的部门列表数据
const userList = ref<any[]>([]) // 所有用户列表
const filteredUserList = ref<any[]>([]) // 当前部门过滤后的用户列表
const selectedUserIdList: any = ref([]) // 选中的用户列表
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const activityId = ref()

const typeList = ref([
  { value: 0, label: '已授权' },
  { value: 1, label: '未授权' }
])

const singleTableRef = ref(null)


/**
 * 处理选择变化事件
 *
 * @param selection 当前选中的项
 */
const selectChange = (selection,userObject) => {
  if (props.singleType) {
    if (selection.length > 1) {
      // 1. 拿到选中数组中前一项的行数据
      const preRow = selection[0];
      // 2. 再把选中数组中的第一项（前一项）删除
      selection.splice(0, 1);
      // 3. 再根据前一项的数据去表格中取消选中对应的那一行
      singleTableRef.value?.toggleRowSelection(preRow, false);
    }
    selectedUserIdList.value = selection
  } else {
        // 允许多选，直接更新选中的用户列表
    selectedUserIdList.value = selectedUserIdList.value.concat(selection) 
    if (selection.length === 0 || !selection.some(item => item.userId === userObject.userId)) {
      selectedUserIdList.value  = selectedUserIdList.value.filter(item => item.userId !== userObject.userId) 
    }
  }
  
};




// 查询参数
const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  deptId: undefined,
  orderByBean: { sortType: 'asc' },
  params: {
    nickName: undefined,
    userName: undefined,
    status: undefined
  }
})

const total = ref(0)

const queryForm = ref(null)

const selectedList = ref<any>([])



/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageIndex = 1
  getList()
}



//     /** 重置按钮操作 */
function resetQuery() {
  if (queryForm.value) {
    queryForm.value.resetFields()
  }
  handleQuery()
}



/** 打开弹窗 */
const open = async (id: number, selectedUserList?: any[]) => {
   
  activityId.value = id
  queryParams.params.nickName = undefined
  queryParams.pageIndex = 1
  queryParams.pageRows = 10
  resetForm()
  // 加载部门、用户列表
  const response = await findDeptTree({})
  const deptData = response.data;
  deptTree.value = deptData // 转换成树形结构
  deptList.value = treeToList(deptData) // 保存扁平结构的部门数据
  selectedList.value = selectedUserList
  dialogVisible.value = true
  selectedUserIdList.value = selectedUserList || []

  // 加载用户列表
  getList()
  // 初始状态下，过滤列表等于所有用户列表
  filteredUserList.value = [...userList.value]

 
}


/**
 * 获取用户列表
 *
 * @returns 无返回值
 */
async function getList() {
   
  try {
    const response = await findPagination({ ...queryParams })
    userList.value = response.data.data
    total.value = response.data.count
    if (selectedUserIdList.value) {
      nextTick(() => {
        userList.value.forEach(item => {
            // if (selectedList.value.includes(item.userId)) {
            if (selectedUserIdList.value.some(item2 => item2.userId === item.userId)) {
              singleTableRef.value?.toggleRowSelection(item, true);
              // selectedUserIdList.value.push(item)
            } 
          })
       })
    }
   
  } finally {
  }
}



/** 获取指定部门及其所有子部门的ID列表 */
const getChildDeptIds = (deptId: number, deptList: any[]): number[] => {
  const ids = [deptId]
  const children = deptList.filter((dept) => dept.parentId === deptId)
  children.forEach((child) => {
    ids.push(...getChildDeptIds(child.id, deptList))
  })
  return ids
}

/** 获取部门过滤后的用户列表 */
const filterUserList = async (deptId?: number) => {
  formLoading.value = true
  try {
    if (!deptId) {
      // 如果没有选择部门，显示所有用户
      filteredUserList.value = [...userList.value]
      return
    }

    // 直接使用已保存的部门列表数据进行过滤
    const deptIds = getChildDeptIds(deptId, deptList.value)

    // 过滤出这些部门下的用户
    filteredUserList.value = userList.value.filter((user) => deptIds.includes(user.deptId))
  } finally {
    formLoading.value = false
  }
}

function filterUniqueAndNonEmpty(data) {
    const seen = new Set();
    const result = [];
    
    for (const item of data) {
        // 检查userId是否存在且不为空
        if (item.userId && item.userId.trim() !== "") {
            // 如果还没见过这个userId，则添加到结果中
            if (!seen.has(item.userId)) {
                seen.add(item.userId);
                result.push(item);
            }
        }
    }
    
    return result;
}

/** 提交选择 */
const submitForm = async () => {
  debugger
  try {
    if (selectedUserIdList.value.length === 0) {
      window.$message.error('请至少选择一个用户')
      return
    }
    
    dialogVisible.value = false
    // 从所有用户列表中筛选出已选择的用户
    // const emitUserList = userList.value.filter((user: any) =>
    //   selectedUserIdList.value.includes(user.id)
    // )
    // 发送操作成功的事件
    emit('confirm', activityId.value, filterUniqueAndNonEmpty(selectedUserIdList.value))
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  deptTree.value = []
  deptList.value = []
  userList.value = []
  filteredUserList.value = []
  selectedUserIdList.value = []
}

/** 处理部门被点击 */
const handleNodeClick = (row: { [key: string]: any }) => {
  filterUserList(row.id)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
:deep() {
  .el-transfer {
    display: flex;
  }
  .el-transfer__buttons {
    display: flex !important;
    flex-direction: column-reverse;
    justify-content: center;
    gap: 20px;
    .el-transfer__button:nth-child(2) {
      margin: 0;
    }
  }
}
</style>
