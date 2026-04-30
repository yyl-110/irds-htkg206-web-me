<template>
  <div ref="screenRef" class="screen-container">
    <template v-if="isReady">
      <slot></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { debounce } from "lodash-es";

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
  }>(),
  {
    width: 0,
    height: 0,
  }
);

const screenRef = ref<HTMLDivElement | null>(null);
const isReady = ref<boolean>(false);
const width = ref<number>(0);
const height = ref<number>(0);

const initContentSize = () => {
  width.value = props.width || window.innerWidth;
  height.value = props.height || window.innerHeight;
  if (screenRef.value) {
    screenRef.value.style.width = `${width.value}px`;
    screenRef.value.style.height = `${height.value}px`;
  }
};

const setScale = () => {
  if (screenRef.value) {
    const scaleX = window.innerWidth / width.value;
    const scaleY = window.innerHeight / height.value;
    screenRef.value.style.transform = `scale(${scaleX}, ${scaleY})`;
  }
};

const handleScale = debounce(setScale, 100);

const autoResizeInit = () => {
  initContentSize();
  setScale();
  isReady.value = true;
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  autoResizeInit();
  
  resizeObserver = new ResizeObserver(() => {
    handleScale();
  });
  
  resizeObserver.observe(document.body);
  window.addEventListener('resize', handleScale);
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', handleScale);
});
</script>

<style lang="less" scoped>
.screen-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  overflow: hidden;
  transform-origin: left top;
  background-color: transparent;
}
</style>
