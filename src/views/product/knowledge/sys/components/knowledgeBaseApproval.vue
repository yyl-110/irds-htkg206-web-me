<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import { AuditOutlined, CheckCircleFilled, FileDoneOutlined, NodeIndexOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { getBpmSimpleList, instanceCreateProcess, updateKnowledgeFileStatusFromBpmCallback } from '@/api/bpm/process/index';

const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false,
  },
  selectModelList: {
    type: Array as () => any[],
    default: () => [],
  },
  modulePropertyInfo: {
    type: Array as () => any[],
    default: () => [],
  },
});
const router = useRouter();
const emit = defineEmits<{
  onClose: [visible: boolean];
  onSuccess: [];
  handleSave: [resource: any];
  modalInit: any;
}>();

const visible = computed({
  get: () => props.modalVisible,
  set: (val: boolean) => {
    if (!val) emit('onClose', false);
  },
});

const loading = ref(false);
const submitting = ref(false);
const selectedProcessId = ref<string | number | null>(null);
const listData = ref<any[]>([]);

const BPM_DETAIL_PAGE = () => import('@/views/bpm/processInstance/detail/index.vue');

const SKIP_APPROVAL_ID = '__SKIP_APPROVAL__';

const SKIP_APPROVAL_ITEM = {
  id: SKIP_APPROVAL_ID,
  key: 'SKIP_APPROVAL',
  name: '知识中心无需审批',
};

const PROCESS_META: Record<string, { desc: string; tag: string; icon: typeof AuditOutlined }> = {
  KNOWLEDGE_SINGLE_APPROVAL: {
    desc: '仅需一级审批即可完成模型发布',
    tag: '一级',
    icon: AuditOutlined,
  },
  KNOWLEDGE_DUAL_APPROVAL: {
    desc: '需经过两级审批后完成模型发布',
    tag: '二级',
    icon: NodeIndexOutlined,
  },
  SKIP_APPROVAL: {
    desc: '跳过审批流程，直接发布知识',
    tag: '无需',
    icon: FileDoneOutlined,
  },
};

/** 展示顺序：一级审批在前，二级审批在后 */
const PROCESS_SORT_ORDER: Record<string, number> = {
  KNOWLEDGE_SINGLE_APPROVAL: 0,
  KNOWLEDGE_DUAL_APPROVAL: 1,
};

const selectedProcess = computed(() => listData.value.find(item => item.id === selectedProcessId.value));

const displayList = computed(() => [...listData.value, SKIP_APPROVAL_ITEM]);

const isSkipApprovalSelected = computed(() => selectedProcessId.value === SKIP_APPROVAL_ID);

const selectedModel = computed(() =>
  Array.isArray(props.selectModelList) && props.selectModelList.length > 0 ? props.selectModelList[0] : null,
);

const selectedModelLabel = computed(() => {
  const model = selectedModel.value;
  if (!model) return '—';
  return model.fileName || '—';
});

watch(
  () => props.modalVisible,
  visible => {
    if (visible) {
      selectedProcessId.value = null;
      getListData();
      void BPM_DETAIL_PAGE();
    }
  },
);

async function getListData() {
  try {
    loading.value = true;
    const res = await getBpmSimpleList({});
    if (res.data.code === 200 || res.data.code === '0') {
      listData.value =
        res.data.data
          ?.filter((item: any) => item.key === 'KNOWLEDGE_SINGLE_APPROVAL' || item.key === 'KNOWLEDGE_DUAL_APPROVAL')
          .sort((a: any, b: any) => (PROCESS_SORT_ORDER[a.key] ?? 99) - (PROCESS_SORT_ORDER[b.key] ?? 99)) ?? [];
      if (listData.value.length === 1) {
        selectedProcessId.value = listData.value[0].id;
      }
    } else {
      listData.value = [];
    }
  } catch (error) {
    console.log(error);
    listData.value = [];
  } finally {
    loading.value = false;
  }
}

function selectProcess(item: any) {
  selectedProcessId.value = item.id;
}

function getProcessMeta(item: any) {
  return (
    PROCESS_META[item.key] ?? {
      desc: '点击选择该审批流程',
      tag: '流程',
      icon: AuditOutlined,
    }
  );
}

async function handleSave() {
  if (!selectedProcessId.value) {
    message.warning('请选择要发起的流程类型');
    return;
  }
  if (!props.selectModelList?.length) {
    message.warning('请先选择要发起审批的知识数据');
    return;
  }
  if (isSkipApprovalSelected.value) {
    handleSkipApproval();
    return;
  }
  if (!selectedProcess.value) {
    message.warning('请选择要发起的流程类型');
    return;
  }
  void BPM_DETAIL_PAGE();
  Modal.confirm({
    title: `${WeiI18n.$t('此数据确认要发起流程吗')}?`,
    content: `将使用「${selectedProcess.value.name}」对「${selectedModelLabel.value}」发起审批`,
    async onOk() {
      try {
        submitting.value = true;
        const res = await instanceCreateProcess({
          processDefinitionKey: selectedProcess.value.id,
          variables: {
            ModelList: props.selectModelList || [],
            modulePropertyInfo: props.modulePropertyInfo || [],
            businessName: props.selectModelList[0].fileName, //知识名称
            businessCode: '', //知识编号
          },
          businessKey: props.selectModelList[0].id,
          startUserSelectAssignees: {},
          businessType: selectedProcess.value.key,
          userId: useUserStore().getUser.id,
        });
        if (res.data.code === 200) {
          const processInstanceId = res.data.data;
          submitting.value = false;
          emit('onClose', false);
          message.success('操作成功');
          void router.push({
            name: 'BpmProcessInstanceDetail',
            query: {
              id: processInstanceId,
            },
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        submitting.value = false;
      }
    },
  });
}

function handleSkipApproval() {
  if (!props.selectModelList?.length) {
    message.warning('请先选择要发布的知识数据');
    return;
  }
  Modal.confirm({
    title: '确认无需审批？',
    content: `确定后将直接发布「${selectedModelLabel.value}」，不再走审批流程。`,
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        submitting.value = true;
        const res = await updateKnowledgeFileStatusFromBpmCallback({
          businessKey: props.selectModelList[0].id,
          callbackScene: 'PROCESS_APPROVED',
          userId: useUserStore().getUser.id,
        });
        if (res.data.code === 200 || res.data.code === '0') {
          message.success('操作成功');
          emit('onSuccess');
          emit('onClose', false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        submitting.value = false;
      }
    },
  });
}

function cancel() {
  if (submitting.value) return;
  emit('onClose', false);
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    class="initiate-process-modal"
    :width="560"
    centered
    destroy-on-close
    :title="$t('发起流程审批')"
    :mask-closable="false"
    :closable="!submitting"
    :keyboard="!submitting"
    @cancel="cancel">
    <a-spin :spinning="loading || submitting">
      <div class="process-modal">
        <div v-if="selectedModel" class="process-modal__model">
          <span class="process-modal__model-label">当前知识名称:</span>
          <span class="process-modal__model-value" :title="selectedModelLabel">{{ selectedModelLabel }}</span>
        </div>

        <div class="process-modal__hint">请选择要发起的审批流程</div>

        <div v-if="displayList.length" class="process-list">
          <div
            v-for="item in displayList"
            :key="item.id"
            class="process-card"
            :class="{ 'process-card--active': selectedProcessId === item.id }"
            role="button"
            tabindex="0"
            @click="selectProcess(item)"
            @keydown.enter="selectProcess(item)">
            <div class="process-card__radio">
              <span class="process-card__radio-dot" />
            </div>
            <div class="process-card__icon">
              <component :is="getProcessMeta(item).icon" />
            </div>
            <div class="process-card__body">
              <div class="process-card__title-row">
                <span class="process-card__title">{{ item.name }}</span>
                <span class="process-card__tag">{{ getProcessMeta(item).tag }}审批</span>
              </div>
              <p class="process-card__desc">{{ getProcessMeta(item).desc }}</p>
            </div>
            <CheckCircleFilled v-if="selectedProcessId === item.id" class="process-card__check" />
          </div>
        </div>

        <Empty v-else-if="!loading" description="暂无可用的审批流程" />
      </div>
    </a-spin>

    <template #footer>
      <a-button :disabled="submitting" @click="cancel">取消</a-button>
      <a-button type="primary" :loading="submitting" :disabled="!selectedProcessId || submitting" @click="handleSave">
        确定发起
      </a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.process-modal {
  padding: 4px 0 8px;
}

.process-modal__model {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f0f6ff 0%, #f8fbff 100%);
  border: 1px solid #d6e4ff;
  border-radius: 8px;
}

.process-modal__model-label {
  flex-shrink: 0;
  font-size: 13px;
  color: #8c8c8c;
}

.process-modal__model-value {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  color: #1a71ff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.process-modal__hint {
  margin-bottom: 12px;
  font-size: 13px;
  color: #595959;
}

.process-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.process-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;

  &:hover {
    border-color: #91caff;
    box-shadow: 0 2px 8px rgba(26, 113, 255, 0.08);
  }

  &--active {
    border-color: #1a71ff;
    background: #f6f9ff;
    box-shadow: 0 2px 12px rgba(26, 113, 255, 0.12);
  }

  &:focus-visible {
    outline: 2px solid #1a71ff;
    outline-offset: 2px;
  }
}

.process-card__radio {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
  transition: border-color 0.2s;

  .process-card--active & {
    border-color: #1a71ff;
  }
}

.process-card__radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.2s;

  .process-card--active & {
    background: #1a71ff;
  }
}

.process-card__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 20px;
  color: #1a71ff;
  background: #e8f1ff;

  .process-card--active & {
    color: #fff;
    background: linear-gradient(135deg, #1a71ff 0%, #4d94ff 100%);
  }
}

.process-card__body {
  flex: 1;
  min-width: 0;
  padding-right: 20px;
}

.process-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.process-card__title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
}

.process-card__tag {
  flex-shrink: 0;
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
  color: #1a71ff;
  background: #e8f1ff;
  border-radius: 4px;

  .process-card--active & {
    color: #fff;
    background: #1a71ff;
  }
}

.process-card__desc {
  margin: 0;
  font-size: 13px;
  color: #8c8c8c;
  line-height: 1.5;
}

.process-card__check {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 18px;
  color: #1a71ff;
}
</style>

<style lang="less">
.initiate-process-modal .ant-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
