<script lang="ts" setup>
defineProps<{
  /** true：折叠全部（三角在上、横杠在下）；false：展开全部（横杠在上、三角在下） */
  expanded?: boolean;
}>();
</script>

<template>
  <svg
    class="tree-root-expand-icon"
    viewBox="0 0 14 14"
    width="1em"
    height="1em"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
    <template v-if="expanded">
      <path
        d="M3.5 3.5 L7 7.5 L10.5 3.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round" />
      <rect
        x="2"
        y="9.75"
        width="10"
        height="2.5"
        rx="1.25"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none" />
    </template>
    <template v-else>
      <rect
        x="2"
        y="1.75"
        width="10"
        height="2.5"
        rx="1.25"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none" />
      <path
        d="M3.5 6.5 L7 10.5 L10.5 6.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </template>
  </svg>
</template>

<style scoped>
.tree-root-expand-icon {
  display: block;
}
</style>
