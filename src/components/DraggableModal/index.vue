<script setup lang="ts">
import { useDraggable } from '@vueuse/core';
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useAttrs, useSlots, watch } from 'vue';

defineOptions({
  name: 'DraggableModal',
  inheritAttrs: false,
});

const props = defineProps({
  draggable: {
    type: Boolean,
    default: true,
  },
});

const attrs = useAttrs();
const slots = useSlots();
const instanceClassName = `draggable-modal__${Math.random().toString(36).slice(2, 10)}`;

const mergedWrapClassName = computed(() => {
  const wrapClassName = (attrs as any).wrapClassName;
  return [wrapClassName, instanceClassName].filter(Boolean).join(' ');
});

const modalAttrs = computed(() => {
  return {
    ...attrs,
    wrapClassName: mergedWrapClassName.value,
  };
});

const isVisible = computed(() => Boolean((attrs as any).visible || (attrs as any).open));

// 【核心修改点 1】目标元素改为内部的 content 容器
const modalContentEl = shallowRef<HTMLElement | null>(null);
const headerEl = shallowRef<HTMLElement | null>(null);

const transformX = ref(0);
const transformY = ref(0);
let startX = 0;
let startY = 0;
let preTransformX = 0;
let preTransformY = 0;
let isDragging = false;

function cleanup() {
  modalContentEl.value = null;
  headerEl.value = null;
  isDragging = false;
}

async function resolveModalDom() {
  await nextTick();
  for (let i = 0; i < 30; i += 1) {
    if (!isVisible.value) return;

    const wrap = document.querySelector(`.ant-modal-wrap.${instanceClassName}`) as HTMLElement | null;
    // 【核心修改点 2】提取 .ant-modal-content 而不是 .ant-modal
    const content = wrap?.querySelector('.ant-modal-content') as HTMLElement | null;
    const header = wrap?.querySelector('.ant-modal-header') as HTMLElement | null;

    if (wrap && content && header) {
      modalContentEl.value = content;
      headerEl.value = header;
      return;
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

// 将拖拽位移绑定到内层容器上
useDraggable(modalContentEl, {
  handle: headerEl,
  preventDefault: true,
  stopPropagation: true,
  onStart: (position, event) => {
    if (!props.draggable || !isVisible.value) return false;
    const target = event.target as HTMLElement | null;
    if (target?.closest('.ant-modal-close')) return false;

    startX = event.clientX;
    startY = event.clientY;
    preTransformX = transformX.value;
    preTransformY = transformY.value;
    isDragging = true;
  },
  onMove: (position, event) => {
    if (!isDragging) return;
    transformX.value = preTransformX + (event.clientX - startX);
    transformY.value = preTransformY + (event.clientY - startY);
  },
  onEnd: () => {
    isDragging = false;
  },
});

watch(
  [transformX, transformY],
  ([x, y]) => {
    if (!modalContentEl.value) return;
    if (x === 0 && y === 0) {
      modalContentEl.value.style.transform = '';
    } else {
      modalContentEl.value.style.transform = `translate(${x}px, ${y}px)`;
    }
  },
  { flush: 'sync' }
);

watch(
  [isVisible, () => props.draggable],
  async ([visible, draggable]) => {
    if (!visible || !draggable) {
      cleanup();
      return;
    }

    await resolveModalDom();
    
    // 清理内层容器的遗留样式
    if (modalContentEl.value) {
      modalContentEl.value.style.transform = '';
    }

    transformX.value = 0;
    transformY.value = 0;
    preTransformX = 0;
    preTransformY = 0;
    
    if (headerEl.value) {
      headerEl.value.style.cursor = 'move';
      headerEl.value.style.userSelect = 'none';
    }
  },
  { flush: 'post' }
);

onBeforeUnmount(() => cleanup());
</script>

<template>
  <a-modal v-bind="modalAttrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </a-modal>
</template>