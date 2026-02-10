<script lang="ts" setup>
import buttonProps from 'ant-design-vue/es/button/buttonTypes'
import { computed, ref } from 'vue'
import { ButtonIcons } from './buttons'
import { WeiIcon } from '@/wei-components/index'

const props = defineProps({
  ...buttonProps(),
  /**
   * 按钮名称, 在 `ButtonIcons` 中为每种按钮添加指定的图标, 用于统一项目中的相同名称的按钮的图标
   * @description 参考 `src/wei-components/WeiTableButton/buttons.ts`
   */
  label: {
    type: String,
    required: true,
  },
})

const component = ref()

/** 按钮图标 */
const icon = computed(() => ButtonIcons[props.label])
</script>

<template>
  <a-button ref="component" class="wei-button px-[10px]" v-bind="props" type="link">
    <template v-for="(slot, k) in $slots" :key="k" #[k]="slotProps">
      <component :is="(slot as any)" v-bind="slotProps" />
    </template>
    <template v-if="!$slots.icon">
      <!-- <component :is="icon" style="vertical-align: middle;"></component> -->
      <WeiIcon :icon="icon" />
    </template>
    <span class="ml-[5px]">{{ label }}</span>
  </a-button>
</template>
