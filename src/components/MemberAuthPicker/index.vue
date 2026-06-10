<template>
  <a-modal
    :visible="visible"
    :title="title"
    :width="1200"
    :z-index="zIndex"
    :wrap-class-name="wrapClassName"
    :mask-closable="false"
    :footer="null"
    @cancel="handleCancel">
    <div class="member-auth-picker">
      <div class="picker-panel">
        <div class="panel-title">
          <span>{{ leftTitleText }}</span>
          <span class="panel-title-count">{{ leftTitleCount }}</span>
        </div>
        <a-input v-model:value="leftKeyword" :placeholder="$t('请输入搜索内容')" allow-clear />
        <a-tabs v-model:activeKey="leftType" size="small">
          <a-tab-pane key="user" :tab="$t('用户')" />
          <a-tab-pane key="dept" :tab="$t('部门')" />
        </a-tabs>
        <div class="panel-list">
          <template v-if="leftType === 'user'">
            <a-checkbox-group v-model:value="leftSelectedUserIds" class="check-list">
              <div
                v-for="u in leftFilteredUsers"
                :key="u.id"
                class="check-item"
                @dblclick="onLeftUserDblClick(u)"
              >
                <a-checkbox :value="u.id">{{ formatUserDisplay(u) }}</a-checkbox>
              </div>
            </a-checkbox-group>
          </template>
          <template v-else>
            <a-checkbox-group v-model:value="leftSelectedDeptIds" class="check-list">
              <div
                v-for="d in leftFilteredDepts"
                :key="d.id"
                class="check-item"
                @dblclick="onLeftDeptDblClick(d)"
              >
                <a-checkbox :value="d.id">{{ d.name }}</a-checkbox>
              </div>
            </a-checkbox-group>
          </template>
        </div>
      </div>

      <div class="picker-actions">
        <a-button class="picker-action-btn" @click="authorizeSelected">&gt;</a-button>
        <a-button class="picker-action-btn" @click="removeSelected">&lt;</a-button>
      </div>

      <div class="picker-panel">
        <div class="panel-title">
          <span>{{ rightTitleText }}</span>
          <span class="panel-title-actions">
            <a-button
              type="link"
              size="small"
              class="panel-clear-btn"
              :disabled="!rightUsers.length"
              @click="removeAllAuthorized">
              一键删除
            </a-button>
            <span class="panel-title-count">{{ rightTitleCount }}</span>
          </span>
        </div>
        <a-input v-model:value="rightKeyword" :placeholder="$t('请输入搜索内容')" allow-clear />
        <a-tabs v-model:activeKey="rightType" size="small">
          <a-tab-pane key="user" :tab="$t('用户')" />
          <a-tab-pane key="dept" :tab="$t('部门')" />
        </a-tabs>
        <div class="panel-list">
          <template v-if="rightType === 'user'">
            <a-checkbox-group v-model:value="rightSelectedUserIds" class="check-list">
              <div
                v-for="u in rightFilteredUsers"
                :key="u.id"
                class="check-item"
                @dblclick="onRightUserDblClick(u)"
              >
                <a-checkbox :value="u.id">{{ formatUserDisplay(u) }}</a-checkbox>
              </div>
            </a-checkbox-group>
          </template>
          <template v-else>
            <a-checkbox-group v-model:value="rightSelectedDeptIds" class="check-list">
              <div
                v-for="d in rightFilteredDepts"
                :key="d.id"
                class="check-item"
                @dblclick="onRightDeptDblClick(d)"
              >
                <a-checkbox :value="d.id">{{ d.name }}</a-checkbox>
              </div>
            </a-checkbox-group>
          </template>
        </div>
      </div>
    </div>

    <div class="footer-actions">
      <a-button type="primary" @click="handleConfirm">{{ $t('确定') }}</a-button>
      <a-button @click="handleCancel">{{ $t('取消') }}</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Modal } from 'ant-design-vue'

type MemberUser = {
  id: string
  name: string
  username: string
  deptId?: string
}

type MemberDept = {
  id: string
  name: string
}

const props = withDefaults(
  defineProps<{
    visible: boolean
    title?: string
    users: MemberUser[]
    depts: MemberDept[]
    authorizedUserIds: string[]
    zIndex?: number
    wrapClassName?: string
  }>(),
  {
    title: '成员授权',
  },
)

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'confirm', userIds: string[]): void
}>()

const leftType = ref<'user' | 'dept'>('user')
const rightType = ref<'user' | 'dept'>('user')
const leftKeyword = ref('')
const rightKeyword = ref('')
const leftSelectedUserIds = ref<string[]>([])
const leftSelectedDeptIds = ref<string[]>([])
const rightSelectedUserIds = ref<string[]>([])
const rightSelectedDeptIds = ref<string[]>([])
const currentAuthorized = ref<string[]>([])

watch(
  () => props.visible,
  visible => {
    if (!visible) return
    currentAuthorized.value = [...props.authorizedUserIds]
    leftType.value = 'user'
    rightType.value = 'user'
    leftKeyword.value = ''
    rightKeyword.value = ''
    leftSelectedUserIds.value = []
    leftSelectedDeptIds.value = []
    rightSelectedUserIds.value = []
    rightSelectedDeptIds.value = []
  },
  { immediate: true },
)

watch(leftType, () => {
  leftSelectedUserIds.value = []
  leftSelectedDeptIds.value = []
})

watch(rightType, () => {
  rightSelectedUserIds.value = []
  rightSelectedDeptIds.value = []
})

const authorizedSet = computed(() => new Set(currentAuthorized.value))

const deptNameMap = computed(() => {
  const map = new Map<string, string>()
  props.depts.forEach(d => map.set(d.id, d.name))
  return map
})

const leftUsers = computed(() => props.users.filter(u => !authorizedSet.value.has(u.id)))
const leftFilteredUsers = computed(() => {
  const keyword = leftKeyword.value.trim()
  if (!keyword) return leftUsers.value
  return leftUsers.value.filter(u => {
    const deptName = u.deptId ? (deptNameMap.value.get(u.deptId) ?? '') : ''
    return `${u.name}${u.username}${deptName}`.includes(keyword)
  })
})

const leftDepts = computed(() => {
  return props.depts.filter(d => props.users.some(u => u.deptId === d.id && !authorizedSet.value.has(u.id)))
})
const leftFilteredDepts = computed(() => {
  const keyword = leftKeyword.value.trim()
  if (!keyword) return leftDepts.value
  return leftDepts.value.filter(d => d.name.includes(keyword))
})

const rightUsers = computed(() => props.users.filter(u => authorizedSet.value.has(u.id)))
const rightFilteredUsers = computed(() => {
  const keyword = rightKeyword.value.trim()
  if (!keyword) return rightUsers.value
  return rightUsers.value.filter(u => {
    const deptName = u.deptId ? (deptNameMap.value.get(u.deptId) ?? '') : ''
    return `${u.name}${u.username}${deptName}`.includes(keyword)
  })
})

/** 右侧部门 Tab：至少有一名成员已在授权列表中 */
const rightDepts = computed(() => {
  return props.depts.filter(d => props.users.some(u => u.deptId === d.id && authorizedSet.value.has(u.id)))
})
const rightFilteredDepts = computed(() => {
  const keyword = rightKeyword.value.trim()
  if (!keyword) return rightDepts.value
  return rightDepts.value.filter(d => d.name.includes(keyword))
})

const leftTitleText = computed(() => `未授权${leftType.value === 'user' ? '用户' : '部门'}`)
const leftTitleCount = computed(() => {
  if (leftType.value === 'user') {
    return `${leftSelectedUserIds.value.length}/${leftUsers.value.length}`
  }
  return `${leftSelectedDeptIds.value.length}/${leftDepts.value.length}`
})
const rightTitleText = computed(() => `已授权${rightType.value === 'user' ? '用户' : '部门'}`)
const rightTitleCount = computed(() => {
  if (rightType.value === 'user') {
    return `${rightSelectedUserIds.value.length}/${rightUsers.value.length}`
  }
  return `${rightSelectedDeptIds.value.length}/${rightDepts.value.length}`
})

function formatUserDisplay(user: MemberUser): string {
  const deptName = user.deptId ? (deptNameMap.value.get(user.deptId) ?? '-') : '-'
  return `${user.name}/${user.username}/${deptName}`
}

function authorizeSelected() {
  const next = new Set(currentAuthorized.value)
  for (const userId of leftSelectedUserIds.value) {
    next.add(userId)
  }
  for (const deptId of leftSelectedDeptIds.value) {
    props.users.filter(u => u.deptId === deptId).forEach(u => next.add(u.id))
  }
  currentAuthorized.value = [...next]
  leftSelectedUserIds.value = []
  leftSelectedDeptIds.value = []
}

function removeSelected() {
  const toRemove = new Set(rightSelectedUserIds.value)
  for (const deptId of rightSelectedDeptIds.value) {
    props.users.filter(u => u.deptId === deptId).forEach(u => toRemove.add(u.id))
  }
  currentAuthorized.value = currentAuthorized.value.filter(id => !toRemove.has(id))
  rightSelectedUserIds.value = []
  rightSelectedDeptIds.value = []
}

function removeUserIds(userIds: string[]) {
  if (!userIds.length) return
  const toRemove = new Set(userIds)
  currentAuthorized.value = currentAuthorized.value.filter(id => !toRemove.has(id))
  rightSelectedUserIds.value = rightSelectedUserIds.value.filter(id => !toRemove.has(id))
  const stillAuthorized = new Set(currentAuthorized.value)
  rightSelectedDeptIds.value = rightSelectedDeptIds.value.filter(deptId =>
    props.users.some(u => u.deptId === deptId && stillAuthorized.has(u.id)),
  )
}

function authorizeUserIds(userIds: string[]) {
  if (!userIds.length)
    return
  const next = new Set(currentAuthorized.value)
  for (const userId of userIds)
    next.add(userId)
  currentAuthorized.value = [...next]
  leftSelectedUserIds.value = leftSelectedUserIds.value.filter(id => !userIds.includes(id))
}

function onLeftUserDblClick(user: MemberUser) {
  if (!authorizedSet.value.has(user.id))
    authorizeUserIds([user.id])
}

function onLeftDeptDblClick(dept: MemberDept) {
  const userIds = props.users
    .filter(u => u.deptId === dept.id && !authorizedSet.value.has(u.id))
    .map(u => u.id)
  authorizeUserIds(userIds)
}

function onRightUserDblClick(user: MemberUser) {
  if (!authorizedSet.value.has(user.id))
    return
  removeUserIds([user.id])
}

function onRightDeptDblClick(dept: MemberDept) {
  const userIds = props.users
    .filter(u => u.deptId === dept.id && authorizedSet.value.has(u.id))
    .map(u => u.id)
  removeUserIds(userIds)
}

function removeAllAuthorized() {
  if (!currentAuthorized.value.length) return
  Modal.confirm({
    title: '确认清空已授权成员？',
    content: `将移除全部 ${currentAuthorized.value.length} 名已授权成员。`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      currentAuthorized.value = []
      rightSelectedUserIds.value = []
      rightSelectedDeptIds.value = []
    },
  })
}

function handleCancel() {
  emit('update:visible', false)
}

function handleConfirm() {
  emit('confirm', [...currentAuthorized.value])
  emit('update:visible', false)
}
</script>

<style scoped>
.member-auth-picker {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: stretch;
}

.picker-panel {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 12px;
  height: min(520px, calc(100vh - 280px));
  max-height: min(520px, calc(100vh - 280px));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-title {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.65);
}

.panel-title-count {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}

.panel-title-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.panel-clear-btn {
  height: auto;
  padding: 0 4px;
  font-size: 13px;
}

.panel-list {
  flex: 1 1 auto;
  min-height: 0;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px 12px;
  overflow-x: hidden;
  overflow-y: auto;
}

.check-list {
  width: 100%;
}

.check-item {
  padding: 8px 0;
  border-bottom: 1px dashed #f5f5f5;
}

.check-item:last-child {
  border-bottom: 0;
}

.picker-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-actions {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
