<template>
  <el-form label-width="120px">
    <el-form-item label="规则类型" prop="candidateStrategy">
      <el-select
        v-model="userTaskForm.candidateStrategy"
        clearable
        style="width: 100%"
        @change="changeCandidateStrategy">
        <el-option v-for="(dict, index) in CANDIDATE_STRATEGY" :key="index" :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == CandidateStrategy.ROLE"
      label="指定角色"
      prop="candidateParam">
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        multiple
        style="width: 100%"
        @change="updateElementTask">
        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="
        userTaskForm.candidateStrategy == CandidateStrategy.DEPT_MEMBER ||
        userTaskForm.candidateStrategy == CandidateStrategy.DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER
      "
      label="指定部门"
      prop="candidateParam"
      span="24">
      <el-tree-select
        ref="treeRef"
        v-model="userTaskForm.candidateParam"
        :data="deptTreeOptions"
        :props="defaultProps"
        empty-text="加载中，请稍后"
        multiple
        node-key="id"
        show-checkbox
        @change="updateElementTask" />
    </el-form-item>
    <!-- <el-form-item
      v-if="userTaskForm.candidateStrategy == CandidateStrategy.POST"
      label="指定岗位"
      prop="candidateParam"
      span="24"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        multiple
        style="width: 100%"
        @change="updateElementTask"
      >
        <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item> -->
    <el-form-item
      v-if="userTaskForm.candidateStrategy == CandidateStrategy.USER"
      label="指定用户"
      prop="candidateParam"
      span="24">
      <div class="user-selection-container">
        <div class="user-tags-container" v-if="selectedUsers.length > 0">
          <el-tag
            v-for="(user, index) in selectedUsers"
            :key="user.userId"
            closable
            @close="removeUser(index)"
            class="user-tag"
            :title="`用户ID: ${user.userId}`">
            {{ getUserDisplayName(user) }}
          </el-tag>
        </div>
        <div class="el-input_user" @click="handleShowUser">
          <span style="text-align: left; color: #999">
            {{ selectedUsers.length > 0 ? '点击添加更多用户' : '请选择用户' }}
          </span>
        </div>
      </div>
    </el-form-item>
    <!-- <el-form-item
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.USER_GROUP"
      label="指定用户组"
      prop="candidateParam"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        multiple
        style="width: 100%"
        @change="updateElementTask"
      >
        <el-option
          v-for="item in userGroupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item> -->
    <el-form-item
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.FORM_USER"
      label="表单内用户字段"
      prop="formUser">
      <el-select v-model="userTaskForm.candidateParam" clearable style="width: 100%" @change="handleFormUserChange">
        <el-option
          v-for="(item, idx) in userFieldOnFormOptions"
          :key="idx"
          :label="item.title"
          :value="item.field"
          :disabled="!item.required" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.FORM_DEPT_LEADER"
      label="表单内部门字段"
      prop="formDept">
      <el-select v-model="userTaskForm.candidateParam" clearable style="width: 100%" @change="updateElementTask">
        <el-option
          v-for="(item, idx) in deptFieldOnFormOptions"
          :key="idx"
          :label="item.title"
          :value="item.field"
          :disabled="!item.required" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="
        userTaskForm.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.START_USER_DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER
      "
      :label="deptLevelLabel"
      prop="deptLevel"
      span="24">
      <el-select v-model="deptLevel" clearable @change="updateElementTask">
        <el-option v-for="(item, index) in MULTI_LEVEL_DEPT" :key="index" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.EXPRESSION"
      label="流程表达式"
      prop="candidateParam">
      <el-input
        type="textarea"
        v-model="userTaskForm.candidateParam[0]"
        clearable
        style="width: 100%"
        @change="updateElementTask" />
      <XButton
        class="!w-1/1 mt-5px"
        type="success"
        preIcon="ep:select"
        title="选择表达式"
        size="small"
        @click="openProcessExpressionDialog" />
      <!-- 选择弹窗 -->
      <ProcessExpressionDialog ref="processExpressionDialogRef" @select="selectProcessExpression" />
    </el-form-item>

    <el-form-item label="跳过表达式" prop="skipExpression">
      <el-input
        type="textarea"
        v-model="userTaskForm.skipExpression"
        clearable
        style="width: 100%"
        @change="updateSkipExpression" />
    </el-form-item>
  </el-form>

  <!-- 用户选择弹窗 -->
  <UserSelectFormRadio ref="userSelectFormRef" @confirm="handleUserSelectConfirm" />
</template>

<script lang="ts" setup>
import {
  CANDIDATE_STRATEGY,
  CandidateStrategy,
  FieldPermissionType,
  MULTI_LEVEL_DEPT,
} from '@/components/SimpleProcessDesignerV2/src/consts'
import { defaultProps,  } from '@/utils/bpmTools'
import * as RoleApi from '@/api/system/role'
// import * as DeptApi from '@/api/system/dept'
// import * as PostApi from '@/api/system/post'
import * as UserApi from '@/api/system/user'
import * as UserGroupApi from '@/api/bpm/userGroup'
// @ts-ignore
import ProcessExpressionDialog from './ProcessExpressionDialog.vue'
import { ProcessExpressionVO } from '@/api/bpm/processExpression'
import { useFormFieldsPermission } from '@/components/SimpleProcessDesignerV2/src/node'
import { UserVO } from '@/api/system/user'
// import { getUserById, findPaginationByUsers, findPagination } from '@/api/system-manage/user/index'
defineOptions({ name: 'UserTask' })
const props = defineProps({
  id: String,
  type: String,
})
const prefix = inject('prefix')
const userTaskForm = ref({
  candidateStrategy: undefined as any, // 分配规则
  candidateParam: [] as any[], // 分配选项
  skipExpression: '', // 跳过表达式
})
const bpmnElement = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances

const roleOptions = ref<RoleApi.RoleVO[]>([]) // 角色列表
const deptTreeOptions = ref() // 部门树
const postOptions = ref<[]>([]) // 岗位列表
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表
const userGroupOptions = ref<UserGroupApi.UserGroupVO[]>([]) // 用户组列表

const userSelectFormRef = ref<any>(null)

/**
 * 显示用户信息的处理函数
 */
const handleShowUser = () => {
  userSelectFormRef.value?.open(0, userTaskForm.value.candidateParam)
}

/** 处理用户选择确认 */
const handleUserSelectConfirm = async (_, users: UserVO[]) => {
  const list: string[] = []
  const userDetails: any[] = []

  // 处理所有选中的用户
  for (const user of users) {
    if (user.userId) {
      list.push(user.userId)

      // 构建用户信息对象
      const userInfo = {
        userId: user.userId,
        psnName: (user as any).psnName || user.nickname,
        nickName: user.nickname,
        loginAccount: (user as any).loginAccount || user.userId,
      }

      // 将用户信息加入缓存
      userCache.value.set(user.userId, userInfo)
      console.log('用户信息已缓存:', userInfo)

      userDetails.push(userInfo)
    }
  }

  // 更新选中的用户列表
  selectedUsers.value = userDetails
  userTaskForm.value['candidateParam'] = list
  updateElementTask()
}

const userName = ref('')
const selectedUsers = ref<any[]>([]) // 存储选中的用户详细信息
const userCache = ref<Map<string, any>>(new Map()) // 用户信息缓存

const getUserName = async (userId: string) => {
  // const res = await getUserById({ loginAccount: userId })
  // const name = res.data?.nickName || '请选择用户'
  // userName.value = name
}

// 批量获取用户详细信息（带缓存）
const getBatchUserInfo = async (userIds: string[]) => {
  console.log('开始批量获取用户信息，用户ID列表:', userIds)

  // 分离已缓存和未缓存的用户
  const cachedUsers: any[] = []
  const uncachedUserIds: string[] = []

  // for (const userId of userIds) {
  //   if (userCache.value.has(userId)) {
  //     cachedUsers.push(userCache.value.get(userId))
  //     console.log('从缓存获取用户信息:', userId, userCache.value.get(userId))
  //   } else {
  //     uncachedUserIds.push(userId)
  //   }
  // }

  // // 如果有未缓存的用户，批量查询
  // if (uncachedUserIds.length > 0) {
  //   try {
  //     console.log('批量查询未缓存的用户信息:', uncachedUserIds)

  //     // 直接使用 findPaginationByUsers API 根据用户ID列表查询
  //     console.log('调用API: findPaginationByUsers，参数:', uncachedUserIds)
  //     const res = await findPaginationByUsers(uncachedUserIds)
  //     console.log('findPaginationByUsers API响应:', res)

  //     console.log('API响应状态:', res?.status)
  //     console.log('API响应数据:', res?.data)
  //     console.log('API响应数据类型:', typeof res?.data)
  //     console.log('API响应数据长度:', res?.data?.length)

  //     if (res?.data && res.data.length > 0) {
  //       for (const userInfo of res.data) {
  //         // 输出原始用户信息，帮助调试
  //         console.log('=== 原始用户信息 ===')
  //         console.log('用户ID:', (userInfo as any)?.userId)
  //         console.log('ID:', (userInfo as any)?.id)
  //         console.log('loginAccount:', (userInfo as any)?.loginAccount)
  //         console.log('username:', (userInfo as any)?.username)
  //         console.log('nickName:', (userInfo as any)?.nickName)
  //         console.log('nickname:', (userInfo as any)?.nickname)
  //         console.log('psnName:', (userInfo as any)?.psnName)
  //         console.log('realName:', (userInfo as any)?.realName)
  //         console.log('完整原始数据:', JSON.stringify(userInfo, null, 2))
  //         console.log('==================')

  //         const completeUserInfo = {
  //           userId: (userInfo as any)?.userId || (userInfo as any)?.id || (userInfo as any)?.loginAccount,
  //           loginAccount: (userInfo as any)?.loginAccount || (userInfo as any)?.username || (userInfo as any)?.userId,
  //           nickName: (userInfo as any)?.nickName || (userInfo as any)?.nickname || (userInfo as any)?.psnName || `用户${(userInfo as any)?.userId || (userInfo as any)?.id}`,
  //           psnName: (userInfo as any)?.psnName || (userInfo as any)?.realName || (userInfo as any)?.nickName || (userInfo as any)?.nickname || `用户${(userInfo as any)?.userId || (userInfo as any)?.id}`
  //         }

  //         // 缓存用户信息
  //         userCache.value.set(completeUserInfo.userId, completeUserInfo)
  //         cachedUsers.push(completeUserInfo)
  //         console.log('处理后的用户信息:', completeUserInfo)
  //       }
  //     } else {
  //       // 如果批量查询失败，为每个用户创建默认信息
  //       for (const userId of uncachedUserIds) {
  //         const fallbackInfo = {
  //           userId,
  //           loginAccount: userId,
  //           nickName: `用户${userId}`,
  //           psnName: `用户${userId}`
  //         }
  //         userCache.value.set(userId, fallbackInfo)
  //         cachedUsers.push(fallbackInfo)
  //         console.log('批量查询失败，使用默认用户信息:', fallbackInfo)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('批量获取用户信息失败:', error)
  //     // 为每个用户创建默认信息
  //     for (const userId of uncachedUserIds) {
  //       const fallbackInfo = {
  //         userId,
  //         loginAccount: userId,
  //         nickName: `用户${userId}`,
  //         psnName: `用户${userId}`
  //       }
  //       userCache.value.set(userId, fallbackInfo)
  //       cachedUsers.push(fallbackInfo)
  //       console.log('批量查询异常，使用默认用户信息:', fallbackInfo)
  //     }
  //   }
  // }

  console.log('批量获取用户信息完成，结果:', cachedUsers)
  return cachedUsers
}

// 获取单个用户详细信息（带缓存）
const getUserInfo = async (userId: string) => {
  // // 先检查缓存
  // if (userCache.value.has(userId)) {
  //   console.log('从缓存获取用户信息:', userId)
  //   return userCache.value.get(userId)
  // }

  // try {
  //   console.log('开始获取单个用户信息，userId:', userId)

  //   // 直接使用 findPaginationByUsers API 根据用户ID查询
  //   console.log('调用API: findPaginationByUsers，参数:', [userId])
  //   const res = await findPaginationByUsers([userId])
  //   console.log('findPaginationByUsers API响应:', res)

  //   console.log('API响应状态:', res?.status)
  //   console.log('API响应数据:', res?.data)
  //   console.log('API响应数据类型:', typeof res?.data)
  //   console.log('API响应数据长度:', res?.data?.length)

  //   let userInfo = null
  //   if (res?.data && res.data.length > 0) {
  //     userInfo = res.data[0]
  //     console.log('从批量查询获取到用户信息:', userInfo)
  //   } else {
  //     // 如果批量查询失败，尝试单个查询
  //     console.log('批量查询无结果，尝试单个查询')
  //     console.log('调用API: getUserById，参数:', { loginAccount: userId })
  //     const singleRes = await getUserById({ loginAccount: userId })
  //     console.log('单个查询用户信息结果:', singleRes)
  //     console.log('单个查询API响应状态:', singleRes.status)
  //     console.log('单个查询API响应数据:', singleRes.data)
  //     console.log('单个查询API响应数据类型:', typeof singleRes.data)
  //     userInfo = singleRes.data
  //   }

  //   // 输出原始用户信息，帮助调试
  //   if (userInfo) {
  //     console.log('=== 单个查询原始用户信息 ===')
  //     console.log('用户ID:', (userInfo as any)?.userId)
  //     console.log('ID:', (userInfo as any)?.id)
  //     console.log('loginAccount:', (userInfo as any)?.loginAccount)
  //     console.log('username:', (userInfo as any)?.username)
  //     console.log('nickName:', (userInfo as any)?.nickName)
  //     console.log('nickname:', (userInfo as any)?.nickname)
  //     console.log('psnName:', (userInfo as any)?.psnName)
  //     console.log('realName:', (userInfo as any)?.realName)
  //     console.log('完整原始数据:', JSON.stringify(userInfo, null, 2))
  //     console.log('============================')
  //   }

  //   // 确保返回的用户信息包含所有必要字段
  //   const completeUserInfo = {
  //     userId: (userInfo as any)?.userId || (userInfo as any)?.id || userId,
  //     loginAccount: (userInfo as any)?.loginAccount || (userInfo as any)?.username || userId,
  //     nickName:
  //       (userInfo as any)?.nickName || (userInfo as any)?.nickname || (userInfo as any)?.psnName || `用户${userId}`,
  //     psnName:
  //       (userInfo as any)?.psnName ||
  //       (userInfo as any)?.realName ||
  //       (userInfo as any)?.nickName ||
  //       (userInfo as any)?.nickname ||
  //       `用户${userId}`,
  //   }

  //   // 缓存用户信息
  //   userCache.value.set(userId, completeUserInfo)
  //   console.log('获取用户信息成功并缓存:', completeUserInfo)

  //   return completeUserInfo
  // } catch (error) {
  //   console.error('获取用户信息失败:', error, 'userId:', userId)
  //   const fallbackInfo = {
  //     userId,
  //     loginAccount: userId,
  //     nickName: `用户${userId}`,
  //     psnName: `用户${userId}`,
  //   }

  //   // 即使失败也缓存，避免重复请求
  //   userCache.value.set(userId, fallbackInfo)

  //   return fallbackInfo
  // }
}

// 移除用户
const removeUser = (index: number) => {
  selectedUsers.value.splice(index, 1)
  // 更新 candidateParam
  userTaskForm.value.candidateParam = selectedUsers.value.map(user => user.userId)
  updateElementTask()
}

// 清理用户缓存（可选：在需要时手动清理）
const clearUserCache = () => {
  userCache.value.clear()
  console.log('用户缓存已清理')
}

// 获取用户显示名称，只显示用户名
const getUserDisplayName = (user: any) => {
  const userName = user.psnName || user.nickName || `用户${user.userId}`
  return userName
}

const { formFieldOptions } = useFormFieldsPermission(FieldPermissionType.READ)
// 表单内用户字段选项, 必须是必填和用户选择器
const userFieldOnFormOptions = computed(() => {
  return formFieldOptions.filter(item => item.type === 'UserSelect')
})
// 表单内部门字段选项, 必须是必填和部门选择器
const deptFieldOnFormOptions = computed(() => {
  return formFieldOptions.filter(item => item.type === 'DeptSelect')
})

const deptLevel = ref(1)
const deptLevelLabel = computed(() => {
  let label = '部门负责人来源'
  if (userTaskForm.value.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER) {
    label = label + '(指定部门向上)'
  } else if (userTaskForm.value.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER) {
    label = label + '(表单内部门向上)'
  } else {
    label = label + '(发起人部门向上)'
  }
  return label
})

const otherExtensions = ref()

const resetTaskForm = () => {
  // 检查 bpmnElement 是否存在
  if (!bpmnElement.value) {
    console.warn('bpmnElement 不存在，无法重置任务表单')
    return
  }

  const businessObject = bpmnElement.value.businessObject
  if (!businessObject) {
    return
  }

  const extensionElements =
    businessObject?.extensionElements ?? bpmnInstances().moddle.create('bpmn:ExtensionElements', { values: [] })
  userTaskForm.value.candidateStrategy = extensionElements.values?.filter(
    ex => ex.$type === `${prefix}:CandidateStrategy`,
  )?.[0]?.value
  const candidateParamStr = extensionElements.values?.filter(ex => ex.$type === `${prefix}:CandidateParam`)?.[0]?.value
  if (candidateParamStr && candidateParamStr.length > 0) {
    if (userTaskForm.value.candidateStrategy === CandidateStrategy.EXPRESSION) {
      // 特殊：流程表达式，只有一个 input 输入框
      userTaskForm.value.candidateParam = [candidateParamStr]
    } else if (userTaskForm.value.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER) {
      // 特殊：多级不部门负责人，需要通过'|'分割
      userTaskForm.value.candidateParam = candidateParamStr
        .split('|')[0]
        .split(',')
        .map(item => {
          // 如果数字超出了最大安全整数范围，则将其作为字符串处理
          let num = Number(item)
          return num > Number.MAX_SAFE_INTEGER || num < -Number.MAX_SAFE_INTEGER ? item : num
        })
      deptLevel.value = +candidateParamStr.split('|')[1]
    } else if (
      userTaskForm.value.candidateStrategy == CandidateStrategy.START_USER_DEPT_LEADER ||
      userTaskForm.value.candidateStrategy == CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER
    ) {
      userTaskForm.value.candidateParam = [+candidateParamStr]
      deptLevel.value = +candidateParamStr
    } else if (userTaskForm.value.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER) {
      userTaskForm.value.candidateParam = [candidateParamStr.split('|')[0]]
      deptLevel.value = +candidateParamStr.split('|')[1]
    } else if (userTaskForm.value.candidateStrategy == CandidateStrategy.USER) {
      // 特殊处理：用户策略，直接保存用户ID数组，不进行数字转换
      userTaskForm.value.candidateParam = candidateParamStr.split(',')
    } else {
      userTaskForm.value.candidateParam = candidateParamStr.split(',').map(item => {
        // 如果数字超出了最大安全整数范围，则将其作为字符串处理
        let num = Number(item)
        return num > Number.MAX_SAFE_INTEGER || num < -Number.MAX_SAFE_INTEGER ? item : num
      })
    }
  } else {
    userTaskForm.value.candidateParam = []
  }

  otherExtensions.value =
    extensionElements.values?.filter(
      ex => ex.$type !== `${prefix}:CandidateStrategy` && ex.$type !== `${prefix}:CandidateParam`,
    ) ?? []

  // 跳过表达式
  if (businessObject.skipExpression != undefined) {
    userTaskForm.value.skipExpression = businessObject.skipExpression
  } else {
    userTaskForm.value.skipExpression = ''
  }

  // 改用通过extensionElements来存储数据
  return
  if (businessObject.candidateStrategy != undefined) {
    userTaskForm.value.candidateStrategy = parseInt(businessObject.candidateStrategy) as any
  } else {
    userTaskForm.value.candidateStrategy = undefined
  }
  if (businessObject.candidateParam && businessObject.candidateParam.length > 0) {
    if (userTaskForm.value.candidateStrategy === 60) {
      // 特殊：流程表达式，只有一个 input 输入框
      userTaskForm.value.candidateParam = [businessObject.candidateParam]
    } else {
      userTaskForm.value.candidateParam = businessObject.candidateParam.split(',').map(item => item)
    }
  } else {
    userTaskForm.value.candidateParam = []
  }
}

/** 更新 candidateStrategy 字段时，需要清空 candidateParam，并触发 bpmn 图更新 */
const changeCandidateStrategy = () => {
  userTaskForm.value.candidateParam = []
  deptLevel.value = 1
  if (userTaskForm.value.candidateStrategy === CandidateStrategy.FORM_USER) {
    // 特殊处理表单内用户字段，当只有发起人选项时应选中发起人
    if (!userFieldOnFormOptions.value || userFieldOnFormOptions.value.length <= 1) {
      userTaskForm.value.candidateStrategy = CandidateStrategy.START_USER
    }
  }
  updateElementTask()
}

/** 选中某个 options 时候，更新 bpmn 图  */
const updateElementTask = () => {
  // 检查 bpmnElement 是否存在
  if (!bpmnElement.value) {
    console.warn('bpmnElement 不存在，无法更新任务属性')
    return
  }

  let candidateParam =
    userTaskForm.value.candidateParam instanceof Array
      ? userTaskForm.value.candidateParam.join(',')
      : String(userTaskForm.value.candidateParam ?? '')
  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: [
      ...otherExtensions.value,
      bpmnInstances().moddle.create(`${prefix}:CandidateStrategy`, {
        value: userTaskForm.value.candidateStrategy,
      }),
      bpmnInstances().moddle.create(`${prefix}:CandidateParam`, {
        value: candidateParam,
      }),
    ],
  })
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions,
  })

  // 改用通过extensionElements来存储数据
  return
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    candidateStrategy: userTaskForm.value.candidateStrategy,
    candidateParam: userTaskForm.value.candidateParam.join(','),
  })
}

const updateSkipExpression = () => {
  // 检查 bpmnElement 是否存在
  if (!bpmnElement.value) {
    console.warn('bpmnElement 不存在，无法更新跳过表达式')
    return
  }

  if (userTaskForm.value.skipExpression && userTaskForm.value.skipExpression !== '') {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      skipExpression: userTaskForm.value.skipExpression,
    })
  } else {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      skipExpression: null,
    })
  }
}

// 打开监听器弹窗
const processExpressionDialogRef = ref()
const openProcessExpressionDialog = async () => {
  processExpressionDialogRef.value.open()
}
const selectProcessExpression = (expression: ProcessExpressionVO) => {
  userTaskForm.value.candidateParam = [expression.expression]
  updateElementTask()
}

const handleFormUserChange = e => {
  if (e === 'PROCESS_START_USER_ID') {
    userTaskForm.value.candidateParam = []
    userTaskForm.value.candidateStrategy = CandidateStrategy.START_USER
  }
  updateElementTask()
}

watch(
  () => props.id,
  async () => {
    bpmnElement.value = bpmnInstances().bpmnElement
    nextTick(async () => {
      // 清空之前的用户选择
      selectedUsers.value = []
      resetTaskForm()

      if (userTaskForm.value.candidateStrategy == CandidateStrategy.USER) {
        // 处理多个用户的情况
        if (userTaskForm.value.candidateParam && userTaskForm.value.candidateParam.length > 0) {
          console.log('=== 开始加载用户信息 ===')
          console.log('候选策略: USER')
          console.log('用户ID列表:', userTaskForm.value.candidateParam)
          console.log('用户ID列表长度:', userTaskForm.value.candidateParam.length)

          // 使用批量获取用户信息
          const userDetails = await getBatchUserInfo(userTaskForm.value.candidateParam)
          console.log('批量获取到的用户详情数量:', userDetails.length)

          // 确保用户信息格式正确
          const formattedUserDetails = userDetails.map(user => ({
            userId: user.userId,
            psnName: user.psnName || user.nickName || `用户${user.userId}`,
            nickName: user.nickName || `用户${user.userId}`,
            loginAccount: user.loginAccount || user.userId
          }))

          selectedUsers.value = formattedUserDetails
          console.log('最终用户详情列表:', selectedUsers.value)
          console.log('最终用户详情列表长度:', selectedUsers.value.length)
          console.log('=== 用户信息加载完成 ===')
        } else {
          console.log('没有用户ID，清空用户选择')
          selectedUsers.value = []
        }
      } else {
        // 如果不是用户策略，清空用户选择
        selectedUsers.value = []
      }

    })
  },
  { immediate: true }
)

onMounted(async () => {
  // 获得角色列表
  // const resp1 = await RoleApi.getSimpleRoleList()
  // roleOptions.value = (resp1 as any).data || []
  // // 获得部门列表
  // const resp2 = await DeptApi.getSimpleDeptList()
  // const deptOptions = (resp2 as any).data || []
  // deptTreeOptions.value = handleTree(deptOptions, 'id')

  // // 获得岗位列表
  // // postOptions.value = await PostApi.getSimplePostList()

  // // 获得用户列表
  // const resp3 = await UserApi.getSimpleUserList()
  // userOptions.value = (resp3 as any).data?.data || []

  // 获得用户组列表
  // userGroupOptions.value = await UserGroupApi.getUserGroupSimpleList()
})

onBeforeUnmount(() => {
  bpmnElement.value = null
  // 清理用户缓存
  userCache.value.clear()
  selectedUsers.value = []
})
</script>

<style scoped>
.el-input_user {
  height: 32px;
  align-items: center;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  cursor: text;
  display: inline-flex;
  flex-grow: 1;
  padding: 1px 11px;
  transform: translateZ(0);
  transition: var(--el-transition-box-shadow);
}

.user-selection-container {
  width: 100%;
  min-height: 32px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 4px 8px;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  cursor: pointer;
  transition: var(--el-transition-box-shadow);
}

.user-selection-container:hover {
  border-color: var(--el-color-primary);
}

.user-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
}

.user-tag {
  margin: 0;
  max-width: 150px;
}

.user-tag .el-tag__content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
