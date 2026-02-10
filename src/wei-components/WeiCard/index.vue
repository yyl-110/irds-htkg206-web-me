<script lang="ts" setup>
import { cardProps } from 'ant-design-vue/es/card/Card' // 引入组件定义的 props
import { ref } from 'vue'
import { WeiEmpty } from '../index'

const props = defineProps(cardProps()) // 定义 props
const component = ref()
</script>

<template>
  <a-card ref="component" class="wei-card" v-bind="props">
    <div v-if="Object.keys($slots).length === 0" class="empty flex justify-center items-center w-full h-full">
      <WeiEmpty />
    </div>
    <template v-for="(slot, k) in $slots" :key="k" #[k]="slotProps">
      <component :is="(slot as any)" v-bind="slotProps" />
    </template>
  </a-card>
</template>
