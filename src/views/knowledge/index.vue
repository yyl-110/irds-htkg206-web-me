<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import knowledgeCenter from "./knowledgeCenter/index.vue";
import knowledgeMap from "./knowledgeMap/index.vue";
import knowledgeQuestionAnswer from "./knowledgeQuestionAnswer/index.vue";
import RightContent from "./components/knowledge-center-right-content.vue";
import QuestionRightContent from "./components/knowledge-question-right-content.vue";
import homeRightPage from "./components/knowledge-home-right-page.vue";
import knowledgeStandard from "./knowledgeStandard/index.vue";
import flowTaskMap from "./flowTaskMap/index.vue";
import personal from "./personal/index.vue";
import {
  hotFileList,
  knowledgePersonal,
  lookFileLogList,
} from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();

const componentsMap = {
  0: knowledgeCenter,
  2: flowTaskMap,
  1: knowledgeMap,
  3: knowledgeQuestionAnswer,
  4: knowledgeStandard,
  5: personal
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
const hasRightPanel = computed(() => [1, 4, 6].includes(activeKey.value));
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

const personalInfo = ref({});

const handleTabchange = (key: number) => {
  activeKey.value = key as ComponentKey;
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

const getInfo = data => {
  personalInfo.value = data;
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
    <a-row class="h-full">
      <a-col :span="hasRightPanel ? 19 : 24" class="h-full bg-white p-[16px] rounded-[4px]">
        <a-tabs v-model:active-key="activeKey" @change="handleTabchange" size="small" class="h-full"
          destroyInactiveTabPane>
          <a-tab-pane :key="index + 1" :tab="value" v-for="(value, index) in tabList">
            <keep-alive>
              <component v-if="index in componentsMap" :is="componentsMap[index]" :exposeAskDesId="exposeAskDesId"
                :personalInfo="personalInfo" />
            </keep-alive>
          </a-tab-pane>
          <template #rightExtra>
            <div>密级：公开</div>
          </template>
        </a-tabs>
      </a-col>
      <a-col v-if="hasRightPanel" :span="5" class="h-full pl-[16px]">
        <RightContent v-if="activeKey === 1" :user-info-list="userInfoList" :view-history-data="viewHistoryData"
          :hot-article-data="hotArticleData" :view-total="viewTotal" :hot-file-total="hotFileTotal"
          :tab-flag="activeKey" />
        <QuestionRightContent v-if="activeKey === 4" :expertFlag="expertFlag" @exposeAskDes="exposeAskDes" />
        <homeRightPage @getInfo="getInfo" v-if="activeKey === 6" />
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
.knowledgeCenter {
  background: #f3f2f7;
}

:deep(.ant-tabs-content) {
  height: 100%;
}
</style>