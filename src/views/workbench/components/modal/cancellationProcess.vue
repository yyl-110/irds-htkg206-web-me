<script lang="ts" setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { showRequestErrorIfNeeded } from '@/httpRequest'
import type { WorkbenchBpmTaskItem } from '../../data'

const props = defineProps<{
  visible: boolean
  targetTask: WorkbenchBpmTaskItem | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const reason = ref('')
const submitLoading = ref(false)

watch(
  () => props.visible,
  visible => {
    if (visible) {
      reason.value = ''
    }
  },
)

function close() {
  emit('update:visible', false)
}

async function submit() {
  const trimmedReason = reason.value.trim()
  if (!trimmedReason) {
    message.warning('请输入取消原因')
    return Promise.reject()
  }
  const processInstanceId = props.targetTask?.processInstance?.id
  if (!processInstanceId) {
    message.warning('缺少流程实例标识')
    return Promise.reject()
  }
  submitLoading.value = true
  try {
    await ProcessInstanceApi.cancelProcessInstanceByStartUser(processInstanceId, trimmedReason)
    message.success('取消成功')
    emit('success')
    close()
  } catch (e) {
    showRequestErrorIfNeeded(e, '取消失败')
    return Promise.reject()
  } finally {
    submitLoading.value = false
  }
}

function handleVisibleChange(v: boolean) {
  emit('update:visible', v)
}
</script>

<template>
  <a-modal
    :visible="visible"
    title="取消流程"
    width="520px"
    class="cancellation-process-modal"
    :confirm-loading="submitLoading"
    :mask-closable="false"
    destroy-on-close
    ok-text="确认取消"
    cancel-text="关闭"
    @ok="submit"
    @cancel="close"
    @update:visible="handleVisibleChange">
    <p v-if="targetTask" class="cancellation-process-modal__tip">
      确定要取消流程「{{ targetTask.processInstance?.name }}」吗？取消后流程将终止。
    </p>
    <div class="cancellation-process-modal__label">取消原因</div>
    <a-textarea
      v-model:value="reason"
      class="cancellation-process-modal__textarea"
      :rows="4"
      :maxlength="500"
      show-count
      placeholder="请输入取消原因"
      allow-clear />
  </a-modal>
</template>

<style lang="less" scoped>
.cancellation-process-modal__tip {
  margin-bottom: 12px;
  color: #666;
  line-height: 1.6;
}

.cancellation-process-modal__label {
  margin-bottom: 8px;
  color: #313133;
}

.cancellation-process-modal__textarea {
  :deep(textarea.ant-input) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    min-height: calc(1.5715 * 14px * 4 + 8px);
    resize: vertical;
    overflow: auto;
  }
}
</style>

<style lang="less">
.cancellation-process-modal {
  .ant-input-affix-wrapper-textarea-with-clear-btn {
    display: block;
    height: auto !important;
    overflow: visible;
  }
}
</style>
