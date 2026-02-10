<script lang="ts" setup>
import { modalProps } from 'ant-design-vue/es/modal/Modal' // 引入组件定义的 props
import { ref } from 'vue'

const props = defineProps({
  ...modalProps(),
  footer: {
    type: Object,
    default: null,
  },
}) // 定义 props
const component = ref()
</script>

<template>
  <a-modal ref="component" class="wei-schema-modal" v-bind="props">
    <template v-for="(slot, k) in $slots" :key="k" #[k]="slotProps">
      <component :is="(slot as any)" v-bind="slotProps" />
    </template>
  </a-modal>
</template>
