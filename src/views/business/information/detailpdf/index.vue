<script lang="ts" setup>
const props = defineProps({
  /** 资料URL */
  fileUrl: {
    require: false,
    type: String,
    default: '',
  },

  /** modalVisible */
  modalVisible: {
    require: false,
    type: Boolean,
  },

})

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean]
}>()

/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible
})

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false)
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    width="100vw"
    height="calc(100vh - 100px)"
    wrap-class-name="full-modal"
    :ok-button-props="{ hidden: true }"
    title="文件预览"
    cancel-text="关闭"
    :mask-closable="false"
    @cancel="cancel"
  >
    <!-- <embed :src="props.fileUrl" width="100%" type="application/pdf" v-if="visible" style="height: calc(100vh - 165px)" frameborder="0" /> -->
    <iframe
      width="100%"
      style="height: calc(100vh - 165px)"
      :src="`/pdfjs-2.12.313/web/viewer.html?file=${encodeURIComponent(props.fileUrl)}`"
    />
  </a-modal>
</template>

<style lang="less" scoped>

</style>
