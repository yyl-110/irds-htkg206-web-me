<template>
  <div>1111111111111111111111</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
const props = defineProps<{
  processInstance: any;
  titleList: any[];
  opinion: string;
}>();
console.log(props.processInstance, 'props.processInstance');
</script>

<style lang="scss" scoped></style>
