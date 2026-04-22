<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import MemberAuthPicker from '@/components/MemberAuthPicker/index.vue';
import { sortermethod } from '@/utils/tools';

type ProjectTeamRow = {
  id?: string | number;
  roleName?: string;
  authorityRemarks?: string;
  orderNumber?: number;
  userIds?: string[] | string;
  userNames?: string;
  userName?: string;
  principalName?: string;
  responsibleName?: string;
  memberNames?: string;
};

type MemberAuthUser = {
  id: string;
  name: string;
  username: string;
  deptId?: string;
};

type MemberAuthDept = {
  id: string;
  name: string;
};

const props = defineProps<{
  projectId: string | number;
}>();

const projectTeamLoading = ref(false);
const projectTeamRows = ref<ProjectTeamRow[]>([]);
type ProjectTeamSortOrder = 'ascend' | 'descend' | '';
const projectTeamTableSortState = ref<{ key: string; order: ProjectTeamSortOrder }>({ key: '', order: '' });

const memberAuthVisible = ref(false);
const currentTeamId = ref<string | number | undefined>();
const memberAuthUsers = ref<MemberAuthUser[]>([]);
const memberAuthDepts = ref<MemberAuthDept[]>([]);
const memberAuthUserIds = ref<string[]>([]);

const projectTeamColumns: TableColumnType<ProjectTeamRow>[] = [
  { title: WeiI18n.$t('序号'), key: 'index', align: 'center', width: 90, fixed: 'left' },
  { title: WeiI18n.$t('角色名称'), dataIndex: 'roleName', key: 'roleName', align: 'left', width: 220, fixed: 'left', ellipsis: { showTitle: true } },
  {
    title: WeiI18n.$t('责任人'),
    dataIndex: 'responsibleUserNames',
    key: 'responsibleUserNames',
    align: 'left',
    width: 260,
    ellipsis: { showTitle: true },
  },
  { title: WeiI18n.$t('权限'), dataIndex: 'authorityRemarks', key: 'authorityRemarks', align: 'left', width: 280, ellipsis: { showTitle: true } },
  { title: WeiI18n.$t('操作'), key: 'operation', dataIndex: 'operation', align: 'center', width: 160, fixed: 'right' },
];

const PROJECT_TEAM_TABLE_SCROLL_BUFFER = 24;
const projectTeamTableScrollX = computed(() => {
  let sum = 0;
  for (const col of projectTeamColumns) {
    const w = (col as { width?: number }).width;
    if (typeof w === 'number') sum += w;
  }
  return sum + PROJECT_TEAM_TABLE_SCROLL_BUFFER;
});

function isProjectTeamSortableColumn(column: { key?: string; dataIndex?: unknown }) {
  if (column.key === 'index' || column.key === 'operation') return false;
  return true;
}

function getProjectTeamColumnSortKey(column: { key?: string; dataIndex?: unknown }) {
  return String((column as { dataIndex?: string; key?: string }).dataIndex ?? (column as { key?: string }).key ?? '');
}

function getProjectTeamTableSortOrder(dataIndex: string): ProjectTeamSortOrder {
  return projectTeamTableSortState.value.key === dataIndex ? projectTeamTableSortState.value.order : '';
}

function toggleProjectTeamTableColumnSort(column: { key?: string; dataIndex?: unknown }) {
  if (!isProjectTeamSortableColumn(column)) return;
  const key = getProjectTeamColumnSortKey(column);
  if (projectTeamTableSortState.value.key !== key) {
    projectTeamTableSortState.value = { key, order: 'ascend' };
    return;
  }
  if (projectTeamTableSortState.value.order === 'ascend') {
    projectTeamTableSortState.value = { key, order: 'descend' };
    return;
  }
  if (projectTeamTableSortState.value.order === 'descend') {
    projectTeamTableSortState.value = { key: '', order: '' };
    return;
  }
  projectTeamTableSortState.value = { key, order: 'ascend' };
}

function getProjectTeamResponsibleUsers(record: ProjectTeamRow): string {
  return record.userName ?? record.userNames ?? record.principalName ?? record.responsibleName ?? record.memberNames ?? '-';
}

function getProjectTeamAuthorizedUserIds(record: ProjectTeamRow): string[] {
  const raw = record.userIds;
  if (Array.isArray(raw)) return raw.map(id => String(id));
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
  }
  return [];
}

const projectTeamDisplayList = computed(() => {
  const list = [...projectTeamRows.value];
  if (!projectTeamTableSortState.value.key || !projectTeamTableSortState.value.order) return list;
  const k = projectTeamTableSortState.value.key;
  const sorted = [...list].sort((a, b) => {
    if (k === 'responsibleUserNames') {
      return sortermethod(getProjectTeamResponsibleUsers(a), getProjectTeamResponsibleUsers(b));
    }
    if (k === 'roleName' || k === 'authorityRemarks') {
      return sortermethod((a as any)[k], (b as any)[k]);
    }
    return 0;
  });
  return projectTeamTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function projectTeamRowKey(record: ProjectTeamRow) {
  if (record.id != null && record.id !== '') return record.id;
  return `team-${String(record.roleName ?? 'role')}-${String(record.orderNumber ?? '')}`;
}

function projectTeamRowClassName(_record: ProjectTeamRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

async function loadProjectTeam() {
  if (!props.projectId) return;
  projectTeamLoading.value = true;
  try {
    const res = await AdminApiProjectTemp.projectTeamList({ projectId: props.projectId });
    const list = res?.data?.data;
    projectTeamRows.value = Array.isArray(list) ? list : [];
  } finally {
    projectTeamLoading.value = false;
  }
}

async function openMemberAuth(record: ProjectTeamRow) {
  currentTeamId.value = record.id;
  const res = await AdminApiSystemDept.getDeptInfo({});
  if (res.data.code === 200) {
    memberAuthDepts.value = res.data.data.adminDeptResponseDTO || [];
    memberAuthUsers.value = res.data.data.adminUserResponseDTO || [];
  } else {
    memberAuthDepts.value = [];
    memberAuthUsers.value = [];
  }
  memberAuthUserIds.value = getProjectTeamAuthorizedUserIds(record);
  memberAuthVisible.value = true;
}

async function handleMemberAuthConfirm(userIds: string[]) {
  await AdminApiProjectTemp.createProjectTeamUserAuth({
    projectId: props.projectId,
    userIds,
    teamId: currentTeamId.value,
  });
  message.success(WeiI18n.$t('授权成功!'));
  memberAuthVisible.value = false;
  await loadProjectTeam();
}

defineExpose({
  loadProjectTeam,
});
</script>

<template>
  <div class="project-team-table-wrap">
    <a-table
      class="project-team-list-table exe-config-table parameter-table-spaced"
      bordered
      table-layout="fixed"
      :columns="projectTeamColumns"
      :data-source="projectTeamDisplayList"
      :loading="projectTeamLoading"
      :pagination="false"
      :scroll="{ x: projectTeamTableScrollX }"
      :row-key="projectTeamRowKey"
      :row-class-name="projectTeamRowClassName">
      <template #headerCell="{ column }">
        <template v-if="isProjectTeamSortableColumn(column)">
          <div class="header-cell-main header-cell-main--static">
            <span class="header-title-sort" @click.stop="toggleProjectTeamTableColumnSort(column)">
              <span>{{ column.title }}</span>
              <span class="header-sort-icon">
                <CaretUpOutlined v-if="getProjectTeamTableSortOrder(getProjectTeamColumnSortKey(column)) === 'ascend'" />
                <CaretDownOutlined v-else-if="getProjectTeamTableSortOrder(getProjectTeamColumnSortKey(column)) === 'descend'" />
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
        <template v-else-if="column.key === 'responsibleUserNames'">
          {{ getProjectTeamResponsibleUsers(record) }}
        </template>
        <template v-else-if="column.key === 'roleName' || column.key === 'authorityRemarks'">
          <span>{{ record[String(column.dataIndex || column.key || '')] }}</span>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-button type="primary" size="small" @click="openMemberAuth(record)">{{ $t('分配人员') }}</a-button>
        </template>
      </template>
    </a-table>
  </div>

  <MemberAuthPicker
    v-model:visible="memberAuthVisible"
    :title="$t('成员授权')"
    :users="memberAuthUsers"
    :depts="memberAuthDepts"
    :authorized-user-ids="memberAuthUserIds"
    @confirm="handleMemberAuthConfirm" />
</template>

<style scoped lang="less">
.project-team-table-wrap {
  padding-top: 4px;
  min-width: 0;
}

.project-team-list-table.exe-config-table.parameter-table-spaced {
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
</style>
