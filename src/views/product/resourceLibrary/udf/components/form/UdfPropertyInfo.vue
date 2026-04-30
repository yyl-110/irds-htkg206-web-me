<script setup lang="ts">
import { ref } from 'vue';

const currentCategoryId = ref<string>('');

function initColumnData(categoryId: string) {
  currentCategoryId.value = categoryId;
}

defineExpose({ initColumnData });
</script>

<template>
  <a-empty :description="currentCategoryId ? `属性管理待接入（分类ID: ${currentCategoryId}）` : '属性管理待接入'" />
</template>
