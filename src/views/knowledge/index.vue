<script setup lang="ts">
import { ref, computed } from 'vue'
import knowledgeCenter from './knowledgeCenter/index.vue'
import knowledgeMap from './knowledgeMap/index.vue'

const componentsMap = {
  0: knowledgeCenter,
  1: knowledgeMap
}
type ComponentKey = keyof typeof componentsMap // 推导出 0 | 1
const tabList = ['知识中心', '知识地图', '知识学习', '知识问答', '技术标准', '个人主页']
const activeKey = ref(0)
const hasRightPanel = computed(() => [0, 3, 4].includes(activeKey.value))
const handleTabchange = (key: number) => {
  console.log('key:', key)
  activeKey.value = key
  if (key in componentsMap) {
    activeKey.value = key as ComponentKey
  } else {
    activeKey.value = key as ComponentKey // 若允许非组件 tab，可保留 number，但需调整类型策略
  }
}

</script>

<template>
  <div class="knowledgeCenter h-full">
    <a-row :gutter="[16, 0]">
      <a-col :span="hasRightPanel ? 18 : 24">
        <a-tabs v-model:active-key="activeKey" @change="handleTabchange" size="small">
          <a-tab-pane :key="index" :tab="value" v-for="(value, index) in tabList">
            <keep-alive>
              <component v-if="index in componentsMap" :is="componentsMap[index]" />
            </keep-alive>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="6" v-if="hasRightPanel">
        23424
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
.knowledgeCenter {
  padding: 16px;
}
</style>