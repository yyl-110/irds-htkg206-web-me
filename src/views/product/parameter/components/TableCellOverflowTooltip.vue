<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

defineOptions({ name: 'TableCellOverflowTooltip' });

const props = withDefaults(
  defineProps<{
    /** 展示与提示文案 */
    text: string;
    /** single：单行省略；clamp：多行省略（备注） */
    variant?: 'single' | 'clamp';
  }>(),
  { variant: 'single' },
);

const rootOverflow = ref<HTMLElement | null>(null);
const rootPlain = ref<HTMLElement | null>(null);
const overflow = ref(false);

const spanClass = computed(() =>
  props.variant === 'clamp' ? 'table-cell-overflow-tooltip__clamp' : 'table-cell-overflow-tooltip__single',
);

function getMeasureEl(): HTMLElement | null {
  return rootOverflow.value ?? rootPlain.value;
}

function measure() {
  const el = getMeasureEl();
  if (!el || props.text === '') {
    overflow.value = false;
    return;
  }
  if (props.variant === 'single') {
    overflow.value = el.scrollWidth > el.clientWidth + 1;
  } else {
    overflow.value = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
  }
}

let ro: ResizeObserver | null = null;

function bindResizeObserver() {
  ro?.disconnect();
  ro = null;
  const el = getMeasureEl();
  if (!el || typeof ResizeObserver === 'undefined') return;
  ro = new ResizeObserver(() => measure());
  ro.observe(el);
}

function scheduleMeasure() {
  nextTick(() => {
    measure();
    bindResizeObserver();
  });
}

watch(() => [props.text, props.variant] as const, scheduleMeasure);

watch(overflow, scheduleMeasure);

onMounted(scheduleMeasure);

onUnmounted(() => {
  ro?.disconnect();
  ro = null;
});
</script>

<template>
  <a-tooltip v-if="overflow" :title="text" placement="topLeft" :mouse-enter-delay="0.08">
    <span ref="rootOverflow" :class="spanClass">{{ text }}</span>
  </a-tooltip>
  <span v-else ref="rootPlain" :class="spanClass">{{ text }}</span>
</template>

<style scoped lang="less">
.table-cell-overflow-tooltip__single {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.table-cell-overflow-tooltip__clamp {
  max-height: 48px;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
}
</style>
