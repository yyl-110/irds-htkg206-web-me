<template>
  <component :is="eventComponent" :id="id" :type="type" v-if="eventComponent" />
  <div v-else class="panel-tab__content">
    <el-empty description="暂无事件配置" />
  </div>
</template>

<script lang="ts" setup>
import { installedEventComponent } from './data'

defineOptions({ name: 'ElementEvent' })

const props = defineProps({
  id: String,
  type: String
})

const eventComponent = computed(() => {
  return installedEventComponent[props.type]?.component
})
</script>
