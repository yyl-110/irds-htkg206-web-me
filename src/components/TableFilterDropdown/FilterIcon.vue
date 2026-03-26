<script lang="ts" setup>
import { FilterOutlined } from "@ant-design/icons-vue";

defineProps<{
  filtered?: boolean;
  activeColor?: string;
}>();
</script>

<template>
  <FilterOutlined
    :style="{ color: filtered ? (activeColor || '#1884ff') : undefined }"
  />
</template>
