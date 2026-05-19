<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import draggableModal from '@/components/DraggableModal/index.vue';
import { AdminApiDesignResourceShare } from '@/api/tags/designResource/设计资源共享';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { toSnowflakeIdStr } from '@/utils/snowflakeId';

const visible = defineModel<boolean>('visible', { default: false });

const props = withDefaults(
  defineProps<{
    bizType: 'ACTIVITY' | 'TASK';
    bizId?: string | number;
    title?: string;
  }>(),
  {
    title: '共享配置',
  },
);

const emit = defineEmits<{
  (e: 'saved'): void;
}>();

const loading = ref(false);
const saving = ref(false);
const selectedUserIds = ref<string[]>([]);
const userOptions = ref<Array<{ label: string; value: string }>>([]);

async function loadUserOptions() {
  const res = await AdminApiSystemUser.getSimpleUsers();
  const list = Array.isArray(res?.data?.data) ? res.data.data : [];
  userOptions.value = list
    .filter((u: any) => u?.id != null)
    .map((u: any) => {
      const nickname = (u.nickname ?? u.nickName ?? '').trim();
      const username = (u.username ?? '').trim();
      const label = nickname || username || toSnowflakeIdStr(u.id);
      return { value: toSnowflakeIdStr(u.id), label };
    });
}

async function loadShareData() {
  if (!props.bizId) return;
  loading.value = true;
  try {
    await loadUserOptions();
    const res = await AdminApiDesignResourceShare.getShareUsers({
      bizType: props.bizType,
      bizId: toSnowflakeIdStr(props.bizId),
    });
    const ids = res?.data?.data?.sharedUserIds;
    selectedUserIds.value = Array.isArray(ids) ? ids.map((id: unknown) => toSnowflakeIdStr(id)).filter(Boolean) : [];
  } catch {
    message.error('加载共享人失败');
    selectedUserIds.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => [visible.value, props.bizId] as const,
  ([vis, bizId]) => {
    if (vis && bizId != null && bizId !== '') {
      void loadShareData();
    }
    if (!vis) {
      selectedUserIds.value = [];
    }
  },
);

function handleCancel() {
  visible.value = false;
}

async function handleSave() {
  if (props.bizId == null || props.bizId === '') {
    message.warning('缺少业务数据标识');
    return;
  }
  saving.value = true;
  try {
    await AdminApiDesignResourceShare.saveShareUsers({
      bizType: props.bizType,
      bizId: toSnowflakeIdStr(props.bizId),
      sharedUserIds: selectedUserIds.value,
    });
    message.success('共享配置已保存');
    emit('saved');
    visible.value = false;
  } catch {
    message.error('保存共享配置失败');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <draggable-modal
    v-model:visible="visible"
    :title="title"
    width="640px"
    :mask-closable="false"
    destroy-on-close
    @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form layout="vertical">
        <a-form-item label="共享人员">
          <a-select
            v-model:value="selectedUserIds"
            mode="multiple"
            placeholder="请选择共享人员（被共享人可编辑，不可再次共享）"
            :options="userOptions"
            option-filter-prop="label"
            show-search
            allow-clear
            style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="saving" @click="handleSave">确定</a-button>
    </template>
  </draggable-modal>
</template>
