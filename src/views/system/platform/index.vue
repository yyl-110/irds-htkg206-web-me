<script lang="ts" setup>
import { computed, h, nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, TableColumnType } from 'ant-design-vue'
import { Modal, message } from 'ant-design-vue'
import { CaretDownOutlined, CaretUpOutlined, PlusOutlined } from '@ant-design/icons-vue'
import Empty from '@/components/Empty/index.vue'
import { WeiI18n } from '@/utils/WeiI18n'
import { sortermethod } from '@/utils/tools'
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台'
import { AdminApiSystemDept } from '@/api/tags/管理后台部门'
import MemberAuthPicker from '@/components/MemberAuthPicker/index.vue'

/** 1: 固定平台；2: 自定义平台（来自列表接口 status） */
type PlatformStatus = 1 | 2

interface PlatformRoleRow {
  id: string
  roleName: string
  attribute: string
  userName: string
  /** 已授权用户 id，用于成员授权弹窗回显 */
  authUserIds: string[]
  status: PlatformStatus
}

interface MemberAuthUser {
  id: string
  name: string
  username: string
  deptId?: string
}

interface MemberAuthDept {
  id: string
  name: string
}

const loading = ref(false)

const dataSource = ref<PlatformRoleRow[]>([])

function formatAuthorizedNames(item: Record<string, unknown>): string {
  const leaders = item.leaders
  if (Array.isArray(leaders) && leaders.length) {
    return leaders
      .map((l: Record<string, unknown>) => String(l.nickname ?? l.name ?? '').trim())
      .filter(Boolean)
      .join('、')
  }
  for (const key of ['userName', 'assignUserNames', 'userNames'] as const) {
    const v = item[key]
    if (typeof v === 'string' && v.trim())
      return v.trim()
  }
  return ''
}

function formatAttribute(item: Record<string, unknown>): string {
  for (const key of [
    'attribute',
    'attributeName',
    'attrName',
    'property',
    'propertyName',
    'categoryTypeName',
    'typeName',
    'extProperty',
    'remark',
  ] as const) {
    const v = item[key]
    if (v != null && String(v).trim())
      return String(v).trim()
  }
  const type = item.categoryType
  if (type != null && String(type).trim())
    return String(type).trim()
  return ''
}

function getAuthorizedUserIdsFromItem(item: Record<string, unknown>): string[] {
  const raw = item.userIds
  if (Array.isArray(raw))
    return raw.map(v => String(v))
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
  }
  const assignIds = item.assignUserIds
  if (Array.isArray(assignIds))
    return assignIds.map(v => String(v))
  if (typeof assignIds === 'string' && assignIds.trim()) {
    return assignIds
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
  }
  const leaderUserId = item.leaderUserId
  if (Array.isArray(leaderUserId))
    return leaderUserId.map(v => String(v))
  return []
}

function parseListItemStatus(item: Record<string, unknown>): PlatformStatus | null {
  const s = item.status
  if (s === 1 || s === '1')
    return 1
  if (s === 2 || s === '2')
    return 2
  return null
}

function rowIsFixedPlatform(record: PlatformRoleRow) {
  return record.status === 1
}

function mapProjectTreeItemToRow(item: Record<string, unknown>, idx: number): PlatformRoleRow {
  const idRaw = item.id
  const st = parseListItemStatus(item)
  const status: PlatformStatus = st ?? 2
  const attribute = st != null
    ? (st === 1
        ? String(WeiI18n.$t('固定平台'))
        : String(WeiI18n.$t('自定义平台')))
    : formatAttribute(item)
  return {
    id: idRaw != null && idRaw !== '' ? String(idRaw) : `row-${idx}`,
    roleName: String(item.categoryName ?? item.name ?? ''),
    attribute,
    userName: formatAuthorizedNames(item),
    authUserIds: getAuthorizedUserIdsFromItem(item),
    status,
  }
}

async function fetchPlatformList() {
  loading.value = true
  try {
    const res = await AdminApiSystemProduct.getProjectTreeAllList()
    const payload = res.data
    const codeOk = payload?.code === 200 || payload?.code === undefined
    const rawList = payload?.data
    if (codeOk && rawList != null) {
      const raw = Array.isArray(rawList) ? rawList : [rawList]
      dataSource.value = raw.map((row, i) => mapProjectTreeItemToRow(row as Record<string, unknown>, i))
    }
    else {
      dataSource.value = []
      if (payload?.msg)
        message.error(payload.msg)
    }
  }
  catch {
    dataSource.value = []
    message.error(WeiI18n.$t('获取数据失败'))
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPlatformList()
})

const addModalVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addSubmitting = ref(false)
const addFormState = reactive({
  categoryName: '',
})

const addFormRules = {
  categoryName: [
    { required: true, message: () => WeiI18n.$t('请输入平台名称'), trigger: 'blur' },
    { max: 100, message: () => WeiI18n.$t('名称过长'), trigger: 'blur' },
  ],
}

const addLabelCol = { span: 6 }
const addWrapperCol = { span: 16 }

function closeAddModal() {
  addModalVisible.value = false
}

async function submitAddForm() {
  await addFormRef.value?.validate()
  addSubmitting.value = true
  try {
    const res = await AdminApiSystemProduct.createProjectTree({
      categoryName: addFormState.categoryName.trim(),
    })
    const payload = res.data
    const codeOk = payload?.code === 200 || payload?.code === undefined
    if (codeOk) {
      message.success(WeiI18n.$t('保存成功'))
      addModalVisible.value = false
      fetchPlatformList()
    }
    else {
      message.error(payload?.msg || WeiI18n.$t('保存失败'))
    }
  }
  catch {
    message.error(WeiI18n.$t('保存失败'))
  }
  finally {
    addSubmitting.value = false
  }
}

const editModalVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editSubmitting = ref(false)
const editFormState = reactive({
  id: '',
  categoryName: '',
  status: 2 as PlatformStatus,
})

const editFormRules = {
  categoryName: [
    { required: true, message: () => WeiI18n.$t('请输入平台名称'), trigger: 'blur' },
    { max: 100, message: () => WeiI18n.$t('名称过长'), trigger: 'blur' },
  ],
}

function closeEditModal() {
  editModalVisible.value = false
}

async function submitEditForm() {
  await editFormRef.value?.validate()
  editSubmitting.value = true
  try {
    const res = await AdminApiSystemProduct.updateProjectTree({
      id: editFormState.id,
      categoryName: editFormState.categoryName.trim(),
    })
    const payload = res.data
    const codeOk = payload?.code === 200 || payload?.code === undefined
    if (codeOk) {
      message.success(WeiI18n.$t('保存成功'))
      editModalVisible.value = false
      fetchPlatformList()
    }
    else {
      message.error(payload?.msg || WeiI18n.$t('保存失败'))
    }
  }
  catch {
    message.error(WeiI18n.$t('保存失败'))
  }
  finally {
    editSubmitting.value = false
  }
}

const columns = ref<TableColumnType<PlatformRoleRow>[]>([
  {
    title: WeiI18n.$t('序号'),
    key: 'index',
    align: 'center',
    width: 70,
    fixed: 'left',
    resizable: true,
  },
  {
    title: WeiI18n.$t('平台名称'),
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'left',
    width: 150,
    fixed: 'left',
    resizable: true,
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.$t('属性'),
    dataIndex: 'attribute',
    key: 'attribute',
    align: 'left',
    width: 120,
    resizable: true,
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.$t('授权人员'),
    dataIndex: 'userName',
    key: 'userName',
    align: 'left',
    width: 220,
    resizable: true,
    className: 'platform-role-col-owner',
  },
  {
    title: WeiI18n.$t('操作'),
    key: 'operation',
    dataIndex: 'operation',
    align: 'center',
    width: 180,
    fixed: 'right',
    resizable: false,
  },
])

const TABLE_SCROLL_BUFFER = 24
const tableScrollX = computed(() => {
  let sum = 0
  for (const col of columns.value) {
    const w = col.width
    sum += typeof w === 'number' ? w : Number(w) || 0
  }
  return sum + TABLE_SCROLL_BUFFER
})

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
})

function handleResizeColumn(w: number, col: TableColumnType<PlatformRoleRow>) {
  col.width = w
}

type SortOrder = 'ascend' | 'descend' | ''
const sortState = ref<{ key: string, order: SortOrder }>({ key: '', order: '' })

function isSortableColumn(column: { key?: string, dataIndex?: unknown }) {
  if (column.key === 'index' || column.key === 'operation')
    return false
  return true
}

function getColumnSortKey(column: { dataIndex?: string, key?: string }) {
  return String(column.dataIndex ?? column.key ?? '')
}

function getSortOrder(dataIndex: string): SortOrder {
  return sortState.value.key === dataIndex ? sortState.value.order : ''
}

function toggleColumnSort(column: { key?: string, dataIndex?: unknown }) {
  if (!isSortableColumn(column))
    return
  const key = getColumnSortKey(column as { dataIndex?: string, key?: string })
  if (sortState.value.key !== key) {
    sortState.value = { key, order: 'ascend' }
    return
  }
  if (sortState.value.order === 'ascend') {
    sortState.value = { key, order: 'descend' }
    return
  }
  if (sortState.value.order === 'descend') {
    sortState.value = { key: '', order: '' }
    return
  }
  sortState.value = { key, order: 'ascend' }
}

const displayList = computed(() => {
  const list = [...dataSource.value]
  if (!sortState.value.key || !sortState.value.order)
    return list
  const k = sortState.value.key
  const sorted = [...list].sort((a, b) => sortermethod((a as any)[k], (b as any)[k]))
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse()
})

function rowKey(record: PlatformRoleRow) {
  return record.id
}

function rowClassName(_record: PlatformRoleRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even'
}

function onCreate() {
  addFormState.categoryName = ''
  addModalVisible.value = true
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

const memberAuthVisible = ref(false)
const currentPlatformTreeId = ref<string | number | undefined>()
const memberAuthUsers = ref<MemberAuthUser[]>([])
const memberAuthDepts = ref<MemberAuthDept[]>([])
const memberAuthUserIds = ref<string[]>([])

function mapDeptUserToMemberAuth(raw: Record<string, unknown>): MemberAuthUser | null {
  const idRaw = raw.id ?? raw.userId
  if (idRaw == null || idRaw === '')
    return null
  return {
    id: String(idRaw),
    name: String(raw.nickname ?? raw.name ?? ''),
    username: String(raw.username ?? ''),
    deptId: raw.deptId != null && raw.deptId !== '' ? String(raw.deptId) : undefined,
  }
}

function mapDeptToMemberAuth(raw: Record<string, unknown>): MemberAuthDept | null {
  const idRaw = raw.id
  if (idRaw == null || idRaw === '')
    return null
  return {
    id: String(idRaw),
    name: String(raw.name ?? ''),
  }
}

/**
 * 解析「树节点授权」接口返回的 userId 列表（兼容多种 data 形态）
 * @param resBody
 */
function parseProjectTreeAuthUserIds(resBody: Record<string, unknown>): string[] {
  const data = resBody.data
  if (data == null)
    return []
  if (Array.isArray(data)) {
    return data
      .map((x): string => {
        if (typeof x === 'string' || typeof x === 'number')
          return String(x)
        if (x && typeof x === 'object') {
          const o = x as Record<string, unknown>
          const id = o.userId ?? o.id ?? o.adminUserId
          return id != null ? String(id) : ''
        }
        return ''
      })
      .filter(Boolean)
  }
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>
    const raw = o.userIds ?? o.assignUserIds ?? o.ids
    if (Array.isArray(raw))
      return raw.map(v => String(v)).filter(Boolean)
    if (typeof raw === 'string' && raw.trim()) {
      return raw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    }
  }
  return []
}

async function openMemberAuth(record: PlatformRoleRow) {
  currentPlatformTreeId.value = record.id
  const [deptRes, authRes] = await Promise.all([
    AdminApiSystemDept.getDeptInfo({} as any),
    AdminApiSystemProduct.getProjectTreeUserAuth({ treeId: record.id }).catch(() => null),
  ])
  const deptPayload = deptRes.data?.data as Record<string, unknown> | undefined
  if (deptRes.data.code === 200 && deptPayload) {
    const rawDepts = Array.isArray(deptPayload.adminDeptResponseDTO) ? deptPayload.adminDeptResponseDTO : []
    const rawUsers = Array.isArray(deptPayload.adminUserResponseDTO) ? deptPayload.adminUserResponseDTO : []
    memberAuthDepts.value = rawDepts
      .map((d: Record<string, unknown>) => mapDeptToMemberAuth(d))
      .filter((d): d is MemberAuthDept => d != null)
    memberAuthUsers.value = rawUsers
      .map((u: Record<string, unknown>) => mapDeptUserToMemberAuth(u))
      .filter((u): u is MemberAuthUser => u != null)
  }
  else {
    memberAuthDepts.value = []
    memberAuthUsers.value = []
  }

  const authPayload = authRes?.data as Record<string, unknown> | undefined
  const authCodeOk = authPayload?.code === 200 || authPayload?.code === undefined
  let resolvedAuthIds: string[] | null = null
  if (authRes && authCodeOk && authPayload)
    resolvedAuthIds = parseProjectTreeAuthUserIds(authPayload)
  memberAuthUserIds.value = resolvedAuthIds ?? record.authUserIds.map(id => String(id))

  memberAuthVisible.value = true
}

async function handleMemberAuthConfirm(userIds: string[]) {
  if (currentPlatformTreeId.value == null)
    return
  try {
    const res = await AdminApiSystemProduct.createProjectTreeUserAuth({
      treeId: currentPlatformTreeId.value,
      userIds,
    })
    const payload = res.data
    const codeOk = payload?.code === 200 || payload?.code === undefined
    if (!codeOk) {
      message.error(payload?.msg || WeiI18n.$t('保存失败'))
      return
    }
    message.success(WeiI18n.$t('授权成功!'))
    memberAuthVisible.value = false
    await fetchPlatformList()
  }
  catch {
    message.error(WeiI18n.$t('保存失败'))
  }
}

function onEdit(record: PlatformRoleRow) {
  if (rowIsFixedPlatform(record)) {
    message.warning(WeiI18n.$t('固定平台不可编辑'))
    return
  }
  if (record.id.startsWith('row-')) {
    message.warning(WeiI18n.$t('当前数据无法编辑'))
    return
  }
  editFormState.id = record.id
  editFormState.categoryName = record.roleName
  editFormState.status = record.status
  editModalVisible.value = true
  nextTick(() => {
    editFormRef.value?.clearValidate()
  })
}

function onDelete(record: PlatformRoleRow) {
  if (rowIsFixedPlatform(record)) {
    message.warning(WeiI18n.$t('固定平台不可删除'))
    return
  }
  Modal.confirm({
    title: WeiI18n.$t('是否确认删除'),
    okText: WeiI18n.$t('确定'),
    cancelText: WeiI18n.$t('取消'),
    okType: 'danger',
    onOk() {
      dataSource.value = dataSource.value.filter(r => r.id !== record.id)
      message.success(WeiI18n.$t('删除成功'))
    },
  })
}
</script>

<template>
  <div class="platform-role-page">
    <div class="platform-role-toolbar">
      <a-button type="primary" @click="onCreate">
        <template #icon>
          <PlusOutlined />
        </template>
        {{ $t('添加') }}
      </a-button>
    </div>

    <div class="platform-table-wrap">
      <a-table
        class="platform-role-table exe-config-table parameter-table-spaced"
        bordered
        table-layout="fixed"
        :columns="columns"
        :data-source="displayList"
        :loading="loading"
        :locale="locale"
        :pagination="false"
        :scroll="{ x: tableScrollX }"
        :row-key="rowKey"
        :row-class-name="rowClassName"
        @resize-column="handleResizeColumn"
      >
        <template #headerCell="{ column }">
          <template v-if="isSortableColumn(column)">
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort" @click.stop="toggleColumnSort(column)">
                <span>{{ column.title }}</span>
                <span class="header-sort-icon">
                  <CaretUpOutlined v-if="getSortOrder(getColumnSortKey(column)) === 'ascend'" />
                  <CaretDownOutlined v-else-if="getSortOrder(getColumnSortKey(column)) === 'descend'" />
                  <CaretUpOutlined v-else class="header-sort-icon--muted" />
                </span>
              </span>
            </div>
          </template>
          <template v-else>
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort header-title-sort--disabled">
                <span>{{ column.title }}</span>
              </span>
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ Number(index) + 1 }}
          </template>
          <template v-else-if="column.key === 'attribute'">
            {{ record.attribute || '\u00a0' }}
          </template>
          <template v-else-if="column.key === 'userName'">
            <a-tooltip v-if="record.userName" placement="topLeft" :title="record.userName">
              <span class="platform-role-owner-cell">{{ record.userName }}</span>
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span class="platform-role-actions">
              <template v-if="rowIsFixedPlatform(record)">
                <a-typography-link @click="openMemberAuth(record)">
                  {{ $t('分配人员') }}
                </a-typography-link>
                <span class="platform-role-actions__sep">|</span>
                <span class="platform-role-actions--disabled">{{ WeiI18n.$t('编辑') }}</span>
                <span class="platform-role-actions__sep">|</span>
                <span class="platform-role-actions--disabled">{{ WeiI18n.$t('删除') }}</span>
              </template>
              <template v-else>
                <a-typography-link @click="openMemberAuth(record)">
                  {{ $t('分配人员') }}
                </a-typography-link>
                <span class="platform-role-actions__sep">|</span>
                <a-typography-link @click="onEdit(record)">
                  {{ WeiI18n.$t('编辑') }}
                </a-typography-link>
                <span class="platform-role-actions__sep">|</span>
                <a-typography-link type="danger" @click="onDelete(record)">
                  {{ WeiI18n.$t('删除') }}
                </a-typography-link>
              </template>
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:visible="addModalVisible"
      :title="WeiI18n.$t('添加')"
      :width="480"
      :mask-closable="false"
      destroy-on-close
      @cancel="closeAddModal"
    >
      <a-form
        ref="addFormRef"
        :model="addFormState"
        :rules="addFormRules"
        :label-col="addLabelCol"
        :wrapper-col="addWrapperCol"
        class="platform-add-modal-form"
      >
        <a-form-item :label="WeiI18n.$t('平台名称')" name="categoryName">
          <a-input
            v-model:value="addFormState.categoryName"
            :placeholder="WeiI18n.$t('请输入平台名称')"
            allow-clear
            :maxlength="100"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" :loading="addSubmitting" @click="submitAddForm">
          {{ WeiI18n.$t('保存') }}
        </a-button>
        <a-button @click="closeAddModal">
          {{ WeiI18n.$t('取消') }}
        </a-button>
      </template>
    </a-modal>

    <a-modal
      v-model:visible="editModalVisible"
      :title="WeiI18n.$t('编辑')"
      :width="480"
      :mask-closable="false"
      destroy-on-close
      @cancel="closeEditModal"
    >
      <a-form
        ref="editFormRef"
        :model="editFormState"
        :rules="editFormRules"
        :label-col="addLabelCol"
        :wrapper-col="addWrapperCol"
        class="platform-add-modal-form"
      >
        <a-form-item :label="WeiI18n.$t('平台名称')" name="categoryName">
          <a-input
            v-model:value="editFormState.categoryName"
            :placeholder="WeiI18n.$t('请输入平台名称')"
            allow-clear
            :maxlength="100"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" :loading="editSubmitting" @click="submitEditForm">
          {{ WeiI18n.$t('保存') }}
        </a-button>
        <a-button @click="closeEditModal">
          {{ WeiI18n.$t('取消') }}
        </a-button>
      </template>
    </a-modal>

    <MemberAuthPicker
      v-model:visible="memberAuthVisible"
      :title="$t('成员授权')"
      :users="memberAuthUsers"
      :depts="memberAuthDepts"
      :authorized-user-ids="memberAuthUserIds"
      @confirm="handleMemberAuthConfirm"
    />
  </div>
</template>

<style lang="less" scoped>
.platform-role-page {
  padding: 16px;
  min-width: 0;
}

.platform-table-wrap {
  padding-top: 4px;
  min-width: 0;
}

.platform-add-modal-form {
  margin-top: 8px;
}

.platform-role-toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.platform-role-table.exe-config-table.parameter-table-spaced {
  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center !important;
    vertical-align: middle;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-tbody > tr > td.platform-role-col-owner) {
    overflow: hidden;
    vertical-align: middle;
  }

  :deep(.ant-table-tbody > tr > td:first-child) {
    text-align: center;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-content),
  :deep(.ant-table-body) {
    padding-bottom: 8px;
    box-sizing: border-box;
  }

  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-cell-fix-left-last::after),
  :deep(.ant-table-cell-fix-right-first::after),
  :deep(.ant-table-cell-fix-left-first::after) {
    display: none !important;
  }

  :deep(.ant-table-cell-fix-left-last) {
    box-shadow: inset -8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }

  :deep(.ant-table-cell-fix-right-first) {
    box-shadow: inset 8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }
}

.header-cell-main {
  position: relative;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 14px;
}

.header-cell-main--static {
  padding-right: 0;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}

.header-title-sort--disabled {
  cursor: default;
}

.header-sort-icon {
  font-size: 11px;
  color: #595959;
  display: inline-flex;
}

.header-sort-icon--muted {
  color: #bfbfbf;
}

.platform-role-actions {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0;
  white-space: nowrap;
}

.platform-role-actions__sep {
  margin: 0 8px;
  color: #d9d9d9;
  user-select: none;
}

.platform-role-actions--disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
  user-select: none;
}

.platform-role-owner-cell {
  display: block;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}
</style>
