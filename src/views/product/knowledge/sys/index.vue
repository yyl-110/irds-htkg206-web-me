<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons-vue";
import KnowledgeTagManage from "./KnowledgeTagManage/index.vue";
import KnowledgeLearningManage from "./KnowledgeLearningManage/index.vue";
import KnowledgeMapManage from './KnowledgeMapManage/index.vue'
import KnowledgeCenterManage from './KnowledgeCenterManage/index.vue'

const router = useRouter();
const userStore = useUserStore();
const activeName = ref("knowledgeCenter");

onMounted(() => { });
</script>

<template>
  <a-tabs v-model="activeName" class="work_nav_top" destroyInactiveTabPane>
    <a-tab-pane key="knowledgeCenter">
      <template #tab> 知识中心管理 </template>
      <KnowledgeCenterManage />
    </a-tab-pane>
    <a-tab-pane key="knowledgeMap">
      <template #tab> 知识地图管理 </template>
      <KnowledgeMapManage />
    </a-tab-pane>
    <a-tab-pane key="knowledgeStudy">
      <template #tab> 知识学习管理 </template>
      <KnowledgeLearningManage />
    </a-tab-pane>
    <a-tab-pane key="knowledgeType">
      <template #tab> 知识标签管理 </template>
      <!-- 标签管理组件-->
      <KnowledgeTagManage ref="tagManageRef"></KnowledgeTagManage>
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="less" scoped>
.work_nav_top {
  padding: 16px;
  padding-top: 8px;
  height: 100%;
}

:deep(.ant-tabs-content) {
  height: 100%;
}

:deep(.ant-tabs-nav) {
  margin: 0 0 0 0px !important;
}
</style>
