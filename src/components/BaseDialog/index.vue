<!--
 @name: index.vue
 @description: 自定义弹窗组件(基于element-plus)(支持5种基本类型:error,success,warning,info,''并支持内容自定义插槽方式使用)
-->
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="modalClose"
    :show-close="showClose"
    class="custom-dialog"
    @close="handleClose"
    align-center
  >
    <template #header>
      <div class="dialog-header">
        <svg-icon :icon-class="iconClass" v-if="type" :style="{ width: '20px', height: '20px' }" />
        <span class="dialog-title" :style="{ 'margin-left': type ? '8px' : '0px' }">{{ title }}</span>
        <svg-icon
          icon-class="g-x"
          style="margin-left: auto"
          v-if="!showClose"
          :style="{ cursor: 'pointer', width: '12.99px', height: '12.99px' }"
          @click="handleClose"
        />
      </div>
    </template>
    <slot>
      <div class="dialog-content" :style="{ 'margin-left': type ? '28px' : '0px' }">
        {{ content }}
      </div>
    </slot>
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button :color="color" @click="handleRightButtonClick" :disabled="rightButtonDisabled">{{ rightButtonText }}</el-button>
          <el-button @click="handleLeftButtonClick" :disabled="leftButtonDisabled">{{ leftButtonText }}</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
const props = withDefaults(
  defineProps<{
    dialogVisible: boolean
    title?: string
    content?: string
    width?: string
    showClose?: boolean
    modalClose?: boolean
    type?: string
    leftButtonText?: string
    rightButtonText?: string
    leftButtonDisabled?: boolean
    rightButtonDisabled?: boolean
  }>(),
  {
    dialogVisible: false,
    title: '',
    content: '',
    width: '472px',
    showClose: false,
    modalClose: true,
    type: '', //'error' || 'success' || 'warning' || 'info' || ''
    leftButtonText: '取消',
    rightButtonText: '确定',
    leftButtonDisabled: false,
    rightButtonDisabled: false
  }
)
const color = computed(() => {
  if (props.type === 'error') {
    return '#F5463D'
  } else if (props.type === 'success') {
    return '#0158F0'
  } else if (props.type === 'warning') {
    return '#0158F0'
  } else if (props.type === 'info') {
    return '#0158F0'
  } else {
    return '#0158F0'
  }
})
const prefix = 'dialog-'
const iconClass = computed(() => {
  return `${prefix}${props.type}`
})
const visible = ref(props.dialogVisible)
// 监听dialogVisible prop属性
watch(
  () => props.dialogVisible,
  newVal => {
    visible.value = newVal
  }
)
const emits = defineEmits(['update:dialogVisible', 'leftButtonClick', 'rightButtonClick'])
const handleClose = () => {
  visible.value = false
  emits('update:dialogVisible', visible.value)
}
const handleLeftButtonClick = () => {
  emits('leftButtonClick')
}
const handleRightButtonClick = () => {
  emits('rightButtonClick')
}
</script>
<style lang="scss">
/* 注意：移除了scoped，让样式全局生效，以覆盖.sie-ecp中的样式 */
.custom-dialog {
  padding: 20px !important;
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__footer {
    padding: 0 !important;
    margin-top: 16px !important;
  }
}
</style>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  .dialog-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    color: #161e2e;
  }
}
.dialog-content {
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #555d6d;
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
</style>
