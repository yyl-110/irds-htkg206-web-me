<template>
  <div>
    <el-form-item label="异步执行:">
      <el-switch v-model="asyncValue" @change="updateAsync" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, inject, toRaw } from 'vue'

defineOptions({ name: 'ServiceTaskCustomConfig' })

const props = defineProps({
  id: String,
  type: String,
  businessObject: {
    type: Object,
    default: () => {}
  }
})

const prefix = inject('prefix', 'flowable')
const bpmnInstances = () => (window as any)?.bpmnInstances
const bpmnElement = ref()
const asyncValue = ref(false)

const resetCustomConfig = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  const businessObject = bpmnElement.value?.businessObject
  
  // 读取异步执行属性，参考 ElementTask 的实现方式，直接使用属性名
  // 对于 Activity 类型，async 属性在 businessObject 中直接使用属性名
  asyncValue.value = businessObject?.async || false
}

const updateAsync = () => {
  if (!bpmnElement.value) return
  
  const modeling = bpmnInstances().modeling
  // 参考 ElementTask 的实现方式，直接使用属性名，不使用前缀
  // 使用 bpmnInstances().bpmnElement 确保获取最新的元素引用
  modeling.updateProperties(toRaw(bpmnInstances().bpmnElement), {
    async: asyncValue.value
  })
}

watch(
  () => props.id,
  () => {
    if (props.id && props.id.length) {
      nextTick(() => {
        resetCustomConfig()
      })
    }
  },
  { immediate: true }
)

watch(
  () => props.businessObject,
  () => {
    if (props.businessObject) {
      nextTick(() => {
        resetCustomConfig()
      })
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped></style>

