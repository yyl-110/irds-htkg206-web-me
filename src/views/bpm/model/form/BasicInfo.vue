<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import type { UserVO } from '@/api/system/user'
// import type { DeptVO } from '@/api/system/dept'
import type { CategoryVO } from '@/api/bpm/category'
// import { findPagination, findPaginationByUsers } from '@/api/system-manage/user'
import { InformationPageRequestDTOModel } from '@/api/models/information/InformationPageRequestDTOModel'
import { useDictStore } from '@/store/modules/dict'
import UserSelectForm from '@/components/UserSelectForm/index.vue'
// 国际化
const props = defineProps({
  categoryList: {
    type: Array as PropType<CategoryVO[]>,
    required: true,
  },
  // userList: {
  //   type: Array,
  //   required: true
  // },
  deptList: {
    type: Array,
    required: true,
  },
})
const formRef = ref()
const selectedStartUsers = ref<any[]>([])
const selectedStartDepts = ref<[]>([])
const selectedManagerUsers = ref<any[]>([])
const userSelectFormRef = ref()
const deptSelectFormRef = ref()
const currentSelectType = ref<'start' | 'manager'>('start')
/** 获取字典 */
const useDict = useDictStore()
const rules = {
  name: [{ required: true, message: '流程名称不能为空', trigger: 'blur' }],
  key: [{ required: true, message: '流程标识不能为空', trigger: 'blur' }],
  category: [{ required: true, message: '流程分类不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '流程类型不能为空', trigger: 'blur' }],
  visible: [{ required: true, message: '是否可见不能为空', trigger: 'blur' }],
  managerUserIds: [{ required: true, message: '流程管理员不能为空', trigger: 'blur' }],
}

// 创建本地数据副本
const modelData = defineModel<any>()

// 查询参数
const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  params: {
    name: undefined,
    type: undefined,
    status: undefined,
  },
})

const userList = ref<any[]>([])

// async function  initData()  {
//   const response2 = await findPagination({...queryParams})
//   userList.value = response2.data.data
// }

// 初始化选中的用户
watch(
  () => modelData.value,
  async newVal => {
    // // await initData()
    // if (newVal.startUserIds?.length) {
    //   const resp = await findPaginationByUsers(selectedStartUsers.value)
    //   selectedStartUsers.value = resp.data
    //   // selectedStartUsers.value = userList.value.filter((user: UserVO) =>
    //   //   newVal.startUserIds.includes(user.id)
    //   // ) as UserVO[]
    // } else {
    //   selectedStartUsers.value = []
    // }
    // if (newVal.startDeptIds?.length) {
    //   selectedStartDepts.value = props.deptList.filter((dept: DeptVO) =>
    //     newVal.startDeptIds.includes(dept.id),
    //   ) as DeptVO[]
    // } else {
    //   selectedStartDepts.value = []
    // }
    // // nextTick(() => {
    // if (newVal.managerUserIds?.length) {
    //   const resp = await findPaginationByUsers(newVal.managerUserIds)
    //   selectedManagerUsers.value = resp.data
    //   // selectedManagerUsers.value = userList.value.filter((user:any) =>
    //   //   newVal.managerUserIds.includes(user.id)
    //   // )
    // } else {
    //   selectedManagerUsers.value = []
    // }
    // // })
  },
  {
    immediate: true,
  },
)

/** 打开发起人选择 */
function openStartUserSelect() {
  currentSelectType.value = 'start'
  userSelectFormRef.value.open(0, selectedStartUsers.value)
}

/** 打开部门选择 */
function openStartDeptSelect() {
  deptSelectFormRef.value.open(selectedStartDepts.value)
}

/** 打开管理员选择 */
function openManagerUserSelect() {
  currentSelectType.value = 'manager'
  console.log(userSelectFormRef.value, 'userSelectFormRef.value')
  userSelectFormRef.value.open(0, selectedManagerUsers.value)
}

/**
 * 处理用户选择确认
 * @param _
 * @param users
 */
function handleUserSelectConfirm(_, users: UserVO[]) {
  if (currentSelectType.value === 'start') {
    modelData.value = {
      ...modelData.value,
      startUserIds: users.map(u => u.id),
    }
  } else {
    modelData.value = {
      ...modelData.value,
      managerUserIds: users.map(u => u.id),
    }
  }
}

/**
 * 处理部门选择确认
 * @param depts
 */
function handleDeptSelectConfirm(depts: DeptVO[]) {
  modelData.value = {
    ...modelData.value,
    startDeptIds: depts.map(d => d.id),
  }
}

/**
 * 处理发起人类型变化
 * @param value
 */
function handleStartUserTypeChange(value: number) {
  if (value === 0) {
    modelData.value = {
      ...modelData.value,
      startUserIds: [],
      startDeptIds: [],
    }
  } else if (value === 1) {
    modelData.value = {
      ...modelData.value,
      startDeptIds: [],
    }
  } else if (value === 2) {
    modelData.value = {
      ...modelData.value,
      startUserIds: [],
    }
  }
}

/**
 * 移除发起人
 * @param user
 */
function handleRemoveStartUser(user: UserVO) {
  modelData.value = {
    ...modelData.value,
    startUserIds: modelData.value.startUserIds.filter((id: number) => id !== user.id),
  }
}

/**
 * 移除部门
 * @param dept
 */
function handleRemoveStartDept(dept: DeptVO) {
  modelData.value = {
    ...modelData.value,
    startDeptIds: modelData.value.startDeptIds.filter((id: number) => id !== dept.id),
  }
}

/**
 * 移除管理员
 * @param user
 */
function handleRemoveManagerUser(user: UserVO) {
  modelData.value = {
    ...modelData.value,
    managerUserIds: modelData.value.managerUserIds.filter((id: number) => id !== user.id),
  }
}

/** 表单校验 */
async function validate() {
  await formRef.value?.validate()
}

defineExpose({
  validate,
})
</script>

<template>
  <el-form ref="formRef" :model="modelData" :rules="rules" label-width="120px" class="mt-20px">
    <el-form-item label="流程标识" prop="key" class="mb-20px">
      <div class="flex items-center">
        <el-input
          v-model="modelData.key"
          class="!w-440px"
          :disabled="!!modelData.id"
          placeholder="请输入流程标识，以字母或下划线开头" />
        <el-tooltip
          class="item"
          :content="modelData.id ? '流程标识不可修改！' : '新建后，流程标识不可修改！'"
          effect="light"
          placement="top">
          <Icon icon="ep:question-filled" class="ml-5px" />
        </el-tooltip>
      </div>
    </el-form-item>
    <el-form-item label="流程名称" prop="name" class="mb-20px">
      <el-input v-model="modelData.name" :disabled="!!modelData.id" clearable placeholder="请输入流程名称" />
    </el-form-item>
    <el-form-item label="流程分类" prop="category" class="mb-20px">
      <!-- !w-full -->
      <el-select v-model="modelData.category" class="w-full" clearable placeholder="请选择流程分类">
        <el-option
          v-for="category in categoryList"
          :key="category.code"
          :label="category.name"
          :value="category.code" />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="流程图标" class="mb-20px">
      <UploadImg v-model="modelData.icon" :limit="1" height="64px" width="64px" />
    </el-form-item> -->
    <el-form-item label="流程描述" prop="description" class="mb-20px">
      <el-input v-model="modelData.description" clearable type="textarea" />
    </el-form-item>
    <el-form-item label="流程类型" prop="type" class="mb-20px">
      <el-radio-group v-model="modelData.type">
        <el-radio
          v-for="dict in useDict.getIntDictOptions(DICT_TYPE.BPM_MODEL_TYPE)"
          :key="dict.value"
          :value="dict.value">
          {{ dict.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('是否可见')" prop="visible" class="mb-20px">
      <el-radio-group v-model="modelData.visible">
        <el-radio
          v-for="dict in useDict.getStrDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
          :key="dict.value"
          :value="dict.value">
          {{ dict.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="谁可以发起" prop="startUserType" class="mb-20px">
      <el-select v-model="modelData.startUserType" placeholder="请选择谁可以发起" @change="handleStartUserTypeChange">
        <el-option label="全员" :value="0" />
        <el-option label="指定人员" :value="1" />
        <el-option label="指定部门" :value="2" />
      </el-select>

      <div v-if="modelData.startUserType === 1" class="mt-2 flex flex-wrap gap-2">
        <div
          v-for="user in selectedStartUsers"
          :key="user.id"
          class="bg-gray-100 h-35px rounded-3xl flex items-center pr-8px dark:color-gray-600 position-relative">
          <el-avatar v-if="user.avatar" class="!m-5px" :size="28" :src="user.avatar" />
          <el-avatar v-else class="!m-5px" :size="28">
            {{ user?.nickName?.substring(0, 1) }}
          </el-avatar>
          {{ user?.nickName }}
          <Icon icon="ep:close" class="ml-2 cursor-pointer hover:text-red-500" @click="handleRemoveStartUser(user)" />
        </div>
        <el-button type="primary" link @click="openStartUserSelect">
          <Icon icon="ep:plus" />
          {{ '选择人员' }}
        </el-button>
      </div>
      <div v-if="modelData.startUserType === 2" class="mt-2 flex flex-wrap gap-2">
        <div
          v-for="dept in selectedStartDepts"
          :key="dept.id"
          class="bg-gray-100 h-35px rounded-3xl flex items-center pr-8px dark:color-gray-600 position-relative">
          <Icon icon="ep:office-building" class="!m-5px text-20px" />
          {{ dept.name }}
          <Icon icon="ep:close" class="ml-2 cursor-pointer hover:text-red-500" @click="handleRemoveStartDept(dept)" />
        </div>
        <el-button type="primary" link @click="openStartDeptSelect">
          <Icon icon="ep:plus" />

          {{ '选择部门' }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item label="流程管理员" prop="managerUserIds" class="mb-20px">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="user in selectedManagerUsers"
          :key="user.id"
          class="bg-gray-100 h-35px rounded-3xl flex items-center pr-8px dark:color-gray-600 position-relative">
          <el-avatar v-if="user.avatar" class="!m-5px" :size="28" :src="user.avatar" />
          <el-avatar v-else class="!m-5px" :size="28">
            {{ user?.nickName?.substring(0, 1) }}
          </el-avatar>
          {{ user?.nickName }}
          <Icon icon="ep:close" class="ml-2 cursor-pointer hover:text-red-500" @click="handleRemoveManagerUser(user)" />
        </div>
        <el-button type="primary" link @click="openManagerUserSelect">
          <Icon icon="ep:plus" />
          {{ '选择人员' }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>
  <!-- 用户选择弹窗 -->
  <UserSelectForm ref="userSelectFormRef" @confirm="handleUserSelectConfirm" />
  <!-- 部门选择弹窗 -->
  <DeptSelectForm ref="deptSelectFormRef" :multiple="true" :check-strictly="true" @confirm="handleDeptSelectConfirm" />
</template>

<style lang="scss" scoped>
.bg-gray-100 {
  background-color: #f5f7fa;
  transition: all 0.3s;

  &:hover {
    background-color: #e6e8eb;
  }

  .ep-close {
    font-size: 14px;
    color: #909399;
    transition: color 0.3s;

    &:hover {
      color: #f56c6c;
    }
  }
}
</style>
