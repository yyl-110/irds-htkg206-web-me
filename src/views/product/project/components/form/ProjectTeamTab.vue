<script setup lang="ts">
import { ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import MemberAuthPicker from '@/components/MemberAuthPicker/index.vue';

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
const memberAuthVisible = ref(false);
const currentTeamId = ref<string | number | undefined>();
const memberAuthUsers = ref<MemberAuthUser[]>([]);
const memberAuthDepts = ref<MemberAuthDept[]>([]);
const memberAuthUserIds = ref<string[]>([]);

const projectTeamColumns: TableColumnType<ProjectTeamRow>[] = [
  { title: WeiI18n.$t('序号'), key: 'index', align: 'center', width: 90 },
  { title: WeiI18n.$t('角色名称'), dataIndex: 'roleName', key: 'roleName', align: 'left', width: 220 },
  { title: WeiI18n.$t('责任人'), dataIndex: 'responsibleUserNames', key: 'responsibleUserNames', align: 'left', width: 260 },
  { title: WeiI18n.$t('权限'), dataIndex: 'authorityRemarks', key: 'authorityRemarks', align: 'left' },
  { title: WeiI18n.$t('操作'), key: 'operation', align: 'center', width: 140, fixed: 'right' },
];

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
  <a-table
    class="project-team-table"
    :columns="projectTeamColumns"
    :data-source="projectTeamRows"
    :loading="projectTeamLoading"
    :pagination="false"
    :scroll="{ x: 1000 }"
    :row-key="(record: ProjectTeamRow, index: number) => record.id ?? `${record.roleName ?? 'role'}-${index}`">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ Number(index) + 1 }}
      </template>
      <template v-else-if="column.key === 'responsibleUserNames'">
        {{ getProjectTeamResponsibleUsers(record) }}
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-button type="primary" size="small" @click="openMemberAuth(record)">{{ $t('分配人员') }}</a-button>
      </template>
    </template>
  </a-table>

  <MemberAuthPicker
    v-model:visible="memberAuthVisible"
    :title="$t('成员授权')"
    :users="memberAuthUsers"
    :depts="memberAuthDepts"
    :authorized-user-ids="memberAuthUserIds"
    @confirm="handleMemberAuthConfirm" />
</template>

<style scoped lang="less">
.project-team-table {
  padding-top: 4px;
}
</style>
