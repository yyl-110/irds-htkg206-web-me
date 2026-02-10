<script lang="ts" setup>
// 引入 antd 组件
// import type { EmptyProps } from 'ant-design-vue/es/empty/index' // 引入组件定义的 props
import type { VueNode } from 'ant-design-vue/es/_util/type'
import type { CSSProperties } from 'vue'
import { ref } from 'vue'
import EmptyImage from './assets/empty.png'

export interface EmptyProps {
  prefixCls?: string
  class?: any
  style?: string | CSSProperties
  imageStyle?: CSSProperties
  image?: VueNode | null
  description?: VueNode
}
const props = defineProps<EmptyProps>() // 定义 props
const component = ref()
</script>

<template>
  <a-empty
    ref="component" class="wei-empty" v-bind="props" :image="$slots.image ? undefined : EmptyImage"
    :image-style="$slots.image ? undefined : { width: '187px', height: '193px', margin: 'auto' }"
  >
    <template v-for="(slot, k) in $slots" :key="k" #[k]="slotProps">
      <component :is="(slot as any)" v-bind="slotProps" />
    </template>
  </a-empty>
</template>
