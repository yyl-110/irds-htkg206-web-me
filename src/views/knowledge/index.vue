<template>
  <div class="knowledgeCenter h-full">
    <a-row :gutter="[16, 0]">
      <a-col :span="18">
        <a-tabs v-model:active-key="activeKey" @change="handleTabchange" size="small">
          <a-tab-pane :key="index" :tab="value" v-for="(value, index) in tabList">
            <knowledge-center v-if="activeKey === 0" />
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="6">
        23424
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import knowledgeCenter from './knowledgeCenter/index.vue'
const tabList = ['知识中心', '知识地图', '知识学习', '知识问答', '技术标准', '个人主页']
const activeKey = ref(0)
const handleTabchange = (key: number) => {
  console.log('key:', key)
  activeKey.value = key
}

</script>

<style lang="less" scoped>
.knowledgeCenter {
  padding: 16px;
}
</style>