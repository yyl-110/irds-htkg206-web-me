<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import MemberAuthPicker from '@/components/MemberAuthPicker/index.vue';
import { AdminApiDesignResourceShare } from '@/api/tags/designResource/设计资源共享';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { toSnowflakeIdStr } from '@/utils/snowflakeId';

const visible = defineModel<boolean>('visible', { default: false });

const props = withDefaults(
  defineProps<{
    bizType: 'ACTIVITY' | 'TASK';
    bizId?: string | number;
    title?: string;
  }>(),
  {
    title: '成员授权',
  },
);

const emit = defineEmits<{
  (e: 'saved'): void;
}>();

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

const loading = ref(false);
const saving = ref(false);
const pickerVisible = ref(false);
const memberAuthUsers = ref<MemberAuthUser[]>([]);
const memberAuthDepts = ref<MemberAuthDept[]>([]);
const memberAuthUserIds = ref<string[]>([]);

function mapDeptUserToMemberAuth(raw: Record<string, unknown>): MemberAuthUser | null {
  const idRaw = raw.id ?? raw.userId;
  if (idRaw == null || idRaw === '') return null;
  return {
    id: String(idRaw),
    name: String(raw.nickname ?? raw.name ?? ''),
    username: String(raw.username ?? ''),
    deptId: raw.deptId != null && raw.deptId !== '' ? String(raw.deptId) : undefined,
  };
}

function mapDeptToMemberAuth(raw: Record<string, unknown>): MemberAuthDept | null {
  const idRaw = raw.id;
  if (idRaw == null || idRaw === '') return null;
  return {
    id: String(idRaw),
    name: String(raw.name ?? ''),
  };
}

async function loadMemberAuthData() {
  if (props.bizId == null || props.bizId === '') return;
  loading.value = true;
  try {
    const [deptRes, shareRes] = await Promise.all([
      AdminApiSystemDept.getDeptInfo({} as any),
      AdminApiDesignResourceShare.getShareUsers({
        bizType: props.bizType,
        bizId: toSnowflakeIdStr(props.bizId),
      }),
    ]);
    const deptPayload = deptRes.data?.data as Record<string, unknown> | undefined;
    if (deptRes.data?.code === 200 && deptPayload) {
      const rawDepts = Array.isArray(deptPayload.adminDeptResponseDTO) ? deptPayload.adminDeptResponseDTO : [];
      const rawUsers = Array.isArray(deptPayload.adminUserResponseDTO) ? deptPayload.adminUserResponseDTO : [];
      memberAuthDepts.value = rawDepts
        .map((d: Record<string, unknown>) => mapDeptToMemberAuth(d))
        .filter((d): d is MemberAuthDept => d != null);
      memberAuthUsers.value = rawUsers
        .map((u: Record<string, unknown>) => mapDeptUserToMemberAuth(u))
        .filter((u): u is MemberAuthUser => u != null);
    } else {
      memberAuthDepts.value = [];
      memberAuthUsers.value = [];
    }
    const sharePayload = shareRes?.data?.data as { sharedUserIds?: unknown[] } | undefined;
    const ids = sharePayload?.sharedUserIds;
    memberAuthUserIds.value = Array.isArray(ids) ? ids.map((id: unknown) => toSnowflakeIdStr(id)).filter(Boolean) : [];
  } catch {
    message.error('加载共享人员失败');
    memberAuthDepts.value = [];
    memberAuthUsers.value = [];
    memberAuthUserIds.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => [visible.value, props.bizId] as const,
  async ([vis, bizId]) => {
    if (!vis) {
      pickerVisible.value = false;
      memberAuthUserIds.value = [];
      return;
    }
    if (bizId == null || bizId === '') return;
    const hideLoading = message.loading('加载中...', 0);
    try {
      await loadMemberAuthData();
      if (visible.value) {
        pickerVisible.value = true;
      }
    } finally {
      hideLoading();
    }
  },
);

watch(pickerVisible, vis => {
  if (!vis) {
    visible.value = false;
  }
});

async function handleMemberAuthConfirm(userIds: string[]) {
  if (props.bizId == null || props.bizId === '') {
    message.warning('缺少业务数据标识');
    return;
  }
  saving.value = true;
  try {
    await AdminApiDesignResourceShare.saveShareUsers({
      bizType: props.bizType,
      bizId: toSnowflakeIdStr(props.bizId),
      sharedUserIds: userIds,
    });
    message.success('授权成功');
    emit('saved');
    pickerVisible.value = false;
  } catch {
    message.error('保存共享配置失败');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <a-spin :spinning="loading || saving">
    <MemberAuthPicker
      v-model:visible="pickerVisible"
      :title="title"
      :users="memberAuthUsers"
      :depts="memberAuthDepts"
      :authorized-user-ids="memberAuthUserIds"
      @confirm="handleMemberAuthConfirm" />
  </a-spin>
</template>
