<script lang="ts" setup>
import { WeiI18n } from '@/utils/WeiI18n'

const props = defineProps({
  /** 标题 */
  title: {
    require: false,
    type: String,
    default: '',
  },
  fongSize: {
    require: false,
    type: String,
    default: '16',
  },
})
</script>

<template>
  <div style="display: flex; align-items: center;">
    <div class="label-imag-body" />
    <div class="footer-title" :style="`font-size:${fongSize}px`">
      {{ $t(title) }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer-title{
  margin-left: 5px;
  font-size: 16px;
  font-weight: 500;
  //user-select: none;
}
.label-imag-body{
  width: 5px;
  background-color: var(--main-finish-text-color);
  margin-top: 2px;
  height: 18px;
  border-radius: 5px;
  //user-select: none;
}
</style>
