<script lang="ts" setup>
import { ref } from 'vue'
import { UploadChangeParam, message } from 'ant-design-vue'
import { dePreviewFile, handleEpcDownload, kkFilePreview } from '@/utils/file'

const props = defineProps({
  /** 视频URL */
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
/**  建议浏览器是否应在<video>加载元素后立即开始下载视频数据。 */
const preload = ref('auto')
// 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
const controls = ref(true)

const autoplay = ref(false)

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
    width="950px"

    wrap-class-name="wrapClassName"
    :ok-button-props="{ hidden: true }"
    title="文件预览"
    cancel-text="关闭"
    :mask-closable="false"
    @cancel="cancel"
  >
    <video v-if="visible" ref="vueRef" :preload="preload" width="900" height="600" text-align="center" :controls="controls" :autoplay="autoplay">
      <source :src="props.fileUrl" type="video/mp4">
    </video>
  </a-modal>
</template>

<style lang="less" scoped>

</style>
