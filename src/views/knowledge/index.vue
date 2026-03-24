<script setup lang="ts">
import { ref, computed } from "vue";
import knowledgeCenter from "./knowledgeCenter/index.vue";
import knowledgeMap from "./knowledgeMap/index.vue";
import knowledgeQuestionAnswer from "./knowledgeQuestionAnswer/index.vue";
import RightContent from "./components/knowledge-center-right-content.vue";
import QuestionRightContent from "./components/knowledge-question-right-content.vue";
import {
  hotFileList,
  knowledgePersonal,
  lookFileLogList,
} from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();

const componentsMap = {
  0: knowledgeCenter,
  1: knowledgeMap,
  3: knowledgeQuestionAnswer
};
type ComponentKey = keyof typeof componentsMap; // 推导出 0 | 1
const tabList = [
  "知识中心",
  "知识地图",
  "知识学习",
  "知识问答",
  "技术标准",
  "个人主页",
];
const activeKey = ref(1);
const hasRightPanel = computed(() => [1, 4, 5].includes(activeKey.value));
const userInfoList = ref([]);
//浏览数据
const viewHistoryData = ref([]);

// 热点文章
const hotArticleData = ref([]);

const viewTotal = ref();

const hotFileTotal = ref();

// 专家标识
const expertFlag = ref(0);
const exposeAskDesId = ref('');
const handleTabchange = (key: number) => {
  activeKey.value = key;
  if (key in componentsMap) {
    activeKey.value = key as ComponentKey;
  } else {
    activeKey.value = key as ComponentKey; // 若允许非组件 tab，可保留 number，但需调整类型策略
  }
};

// 获取右侧的用户列表
const getRightUserList = () => {
  const params = {
    userId: userStore.getUser.id,
  };
  knowledgePersonal(params).then((res) => {
    if (res && res.data.code === "0") {
      userInfoList.value = res.data.data;
    }
  });
};

// 浏览记录
const viewHistory = () => {
  const params = {
    currentPage: 1,
    pageSize: 10000,
    userId: userStore.getUser.id,
    type: "1", //1,浏览  2，下载
    fileType: activeKey.value,
  };
  lookFileLogList(params).then((res) => {
    if (res && res.data.code === "0") {
      viewHistoryData.value = [];
      viewHistoryData.value = res.data.data.result;
      viewTotal.value = res.data.data.total;
    }
  });
};

// 热点文章
const hotArticle = () => {
  const params = {
    currentPage: 1,
    pageSize: 10000,
    fileType: activeKey.value,
  };
  hotFileList(params).then((res) => {
    if (res && res.data.code === "0") {
      hotArticleData.value = [];
      hotArticleData.value = res.data.data.result;
      hotFileTotal.value = res.data.data.total;
    }
  });
};

const exposeAskDes = item => {
  exposeAskDesId.value = item;
};

onMounted(() => {
  getRightUserList();
  viewHistory();
  hotArticle();
});

watch(
  () => activeKey.value,
  (val) => {
    if (val === 1) {
      getRightUserList();
      viewHistory();
      hotArticle();
    }
  }
);
</script>

<template>
  <div class="knowledgeCenter h-full">
    <a-row :gutter="[16, 0]" class="h-full">
      <a-col :span="hasRightPanel ? 19 : 24" class="h-full">
        <a-tabs v-model:active-key="activeKey" @change="handleTabchange" size="small" class="h-full">
          <a-tab-pane :key="index + 1" :tab="value" v-for="(value, index) in tabList">
            <keep-alive>
              <component v-if="index in componentsMap" :is="componentsMap[index]" />
            </keep-alive>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col v-if="hasRightPanel" :span="5" class="h-full">
        <RightContent v-if="activeKey === 1" :user-info-list="userInfoList" :view-history-data="viewHistoryData"
          :hot-article-data="hotArticleData" :view-total="viewTotal" :hot-file-total="hotFileTotal"
          :tab-flag="activeKey" />
          <QuestionRightContent :expertFlag="expertFlag" :getCurrentTab="activeKey" @exposeAskDes="exposeAskDes" />
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
.knowledgeCenter {
  padding: 16px;
}

:deep(.ant-tabs-content) {
  height: 100%;
}
</style>