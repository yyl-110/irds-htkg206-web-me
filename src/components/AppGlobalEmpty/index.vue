<script lang="ts" setup>
import { Empty } from 'ant-design-vue';
import { computed, useAttrs, useSlots } from 'vue';
import { createEmptyImageNode, EMPTY_IMAGE_STYLE } from '@/utils/emptyState';

defineOptions({ name: 'AEmpty', inheritAttrs: false });

const attrs = useAttrs();
const slots = useSlots();

const DEFAULT_IMAGE_STYLE = EMPTY_IMAGE_STYLE;

const resolvedImage = computed(() => {
  if (slots.image) return undefined;
  if (attrs.image !== undefined && attrs.image !== null) return attrs.image;
  const alt = typeof attrs.description === 'string' ? attrs.description : '暂无数据';
  return createEmptyImageNode(alt);
});

const resolvedImageStyle = computed(() => {
  if (slots.image) return attrs.imageStyle as Record<string, string> | undefined;
  if (attrs.imageStyle) return attrs.imageStyle as Record<string, string>;
  if (attrs.image !== undefined && attrs.image !== null) return attrs.imageStyle as Record<string, string> | undefined;
  return DEFAULT_IMAGE_STYLE;
});
</script>

<template>
  <Empty v-bind="$attrs" :image="resolvedImage" :image-style="resolvedImageStyle">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </Empty>
</template>
