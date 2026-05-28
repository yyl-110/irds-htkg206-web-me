<template>
  <a-card
    v-if="processDefinitionList.length > 0"
    class="approval-personnel-card"
    :bordered="false"
    :title="$t('节点审批人员')">
    <div class="approval-personnel-list">
      <div v-for="(item, index) in processDefinitionList" :key="index" class="approval-personnel-row">
        <div class="approval-personnel-row__node">
          <span class="approval-personnel-row__label">{{ $t('流程节点:') }}</span>
          <span class="approval-personnel-row__node-name">{{ item.name }}</span>
        </div>

        <div class="approval-personnel-row__approver">
          <span class="approval-personnel-row__label">{{ $t('审批人:') }}</span>
          <span class="approval-personnel-row__approver-name">
            {{ approveUser[index]?.nickname || approveUser[index]?.psnName || approveUser[index]?.name || '' }}
          </span>
        </div>

        <a-button v-if="editType === 1" type="primary" @click="handleSelectUser(index)">
          <template #icon>
            <UserAddOutlined />
          </template>
          {{ $t('选择审批人') }}
        </a-button>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { UserAddOutlined } from '@ant-design/icons-vue'

defineProps<{
  processDefinitionList: any[]
  approveUser: any[]
  editType: number
}>()

const emit = defineEmits<{
  (e: 'select-user', index: number): void
}>()

const handleSelectUser = (index: number) => {
  emit('select-user', index)
}
</script>

<style lang="scss" scoped>
.approval-personnel-card {
  margin: 10px 10px 10px 0;
  min-height: 100px;

  :deep(.ant-card-head) {
    min-height: 48px;
    padding: 0 16px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.ant-card-head-title) {
    padding: 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #313133;
  }

  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.approval-personnel-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 70%;
}

.approval-personnel-row {
  display: flex;
  align-items: center;
  min-height: 32px;
  gap: 48px;

  &__node,
  &__approver {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  &__node {
    flex: 0 0 220px;
  }

  &__approver {
    flex: 1;
    min-width: 180px;
  }

  &__label {
    flex-shrink: 0;
    margin-right: 8px;
    font-weight: 700;
    color: #313133;
    white-space: nowrap;
  }

  &__node-name,
  &__approver-name {
    color: #313133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__btn {
    flex-shrink: 0;
    margin-left: auto;
    min-width: 108px;
    color: #fff;
    background: #909399;
    border-color: #909399;

    &:hover,
    &:focus {
      color: #fff !important;
      background: #a6a9ad !important;
      border-color: #a6a9ad !important;
    }
  }
}
</style>
