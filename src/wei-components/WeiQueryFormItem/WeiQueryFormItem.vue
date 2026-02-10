<script lang="ts" setup>
// import { ref } from 'vue';
// import { WeiQueryColGridConfig } from './grid';
import type { ColProps } from 'ant-design-vue'

defineProps<ColProps>() // 定义 props

// const colProps = { props, ...WeiQueryColGridConfig.COL_SIZE }
</script>

<template>
  <!-- <a-col v-bind="colProps"> -->
  <a-form-item class="mb-0" v-bind="$attrs">
    <slot />
  </a-form-item>
  <!-- </a-col> -->
</template>
