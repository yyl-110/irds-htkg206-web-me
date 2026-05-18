<script setup lang="ts">
import { WeiI18n } from '@/utils/WeiI18n';

const props = defineProps({
  /** 空状态文案（与 description 二选一） */
  text: {
    require: false,
    type: String,
    default: '',
  },
  /** 与 ant-design-vue Empty 对齐的文案字段 */
  description: {
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

const displayText = computed(() => props.description || props.text || '数据为空');

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
        {{ $t(displayText) ? $t(displayText) : $t('数据为空') }}
      </p>
    </div>
    <slot name="emptyTip" />
  </div>
</template>
