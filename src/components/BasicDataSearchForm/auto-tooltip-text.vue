<template>
  <div class="auto-tooltip-container" ref="container">
    <el-tooltip :content="text" :disabled="!isOverflow" placement="top">
      <div class="auto-tooltip-text" ref="textEl">{{ text }}</div>
    </el-tooltip>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  text: String,
  maxWidth: { type: String, default: '100%' }
})

const container = ref(null)
const textEl = ref(null)
const isOverflow = ref(false)
let resizeObserver = null

const checkOverflow = () => {
  if (container.value && textEl.value) {
    isOverflow.value = textEl.value.scrollWidth > container.value.offsetWidth
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(checkOverflow)
  if (container.value) {
    resizeObserver.observe(container.value)
  }
  nextTick(() => {
    checkOverflow()
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

watch(() => props.text, checkOverflow)
</script>

<style scoped>
.auto-tooltip-container {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: v-bind(maxWidth);
}

.auto-tooltip-text {
  /* display: inline-block; */
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
