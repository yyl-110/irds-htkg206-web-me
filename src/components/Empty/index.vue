<script setup lang="ts">
import { WeiI18n } from '@/utils/WeiI18n';

const props = defineProps({
  /** 文件内容 */
  text: {
    require: false,
    type: String,
    default: '',
  },
  width: {
    require: false,
    type: String,
    default: '235',
  },
  height: {
    require: false,
    type: String,
    default: '235',
  },
});
/** 资源为空图片 */
const soureImg = computed(() => {
  return new URL('@/assets/images/empty.png', import.meta.url).href;
});
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; height: 100%">
    <div :style="`width: ${width}px; height: ${height}px`">
      <img :src="soureImg" width="100%" height="auto" alt="资源为空" />
      <p class="empty-text">
        {{ $t(text) ? $t(text) : $t('数据为空') }}
      </p>
    </div>
    <slot name="emptyTip" />
  </div>
</template>
