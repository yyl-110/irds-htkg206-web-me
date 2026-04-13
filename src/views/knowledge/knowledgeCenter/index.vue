<script setup lang="ts">
import { fileList, getNodeByLevel, knowledgeQueryPage, queryPageQuestion, querySecondTagNode, queryThreeTagNode } from '@/api/knowledge';
import textCard from '../components/textCard.vue';
import askCard from '../components/askCard.vue';
import videoCard from '../components/videoCard.vue';
import imgCard from '../components/imgCard.vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/modules/user';
import searchTag from '../components/search-tag.vue';
const userStore = useUserStore();

const tabValue = ref(1);
const searchType = ref([]);
const searchValue = ref('');

// 所属类目1
const elTagcheckedOneData = ref([]);
// 所属类目2
const elTagcheckedTwoData = ref([]);

const hiddenStatus = ref(false);

// 展开收藏的控制
const elTagcheckedOneStatus = ref(false);
const elTagcheckedTwoStatus = ref(false);

const keyWord = ref('');
const isDownload = ref(false);

// 所有三级节点的id
const arrayData = ref([]);

const thirdData = ref([]);
const changeTabFlag = ref(1);

const documentList = ref([]);

const flagSecondData = ref([]);

const firstId = ref('');

const page = ref({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

const currentPageData = ref(1);

const searchOptions = [
  {
    label: '关键字',
    value: '1',
  },
  // {
  //   label: "下载项",
  //   value: "2",
  // },
];
const onSearch = () => {
  initPage();
  if (tabValue.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};

// 公共函数
const publicFun = () => {
  if (changeTabFlag.value === 2) {
    arrayData.value = [];
    thirdData.value = [];
  } else {
    arrayData.value = [...new Set(arrayData.value)];
  }
};

// 搜索数据按钮接口
const searchData = () => {
  publicFun();
  const params = {
    kldType: tabValue.value,
    keyWords: searchType.value[0] === '1' ? searchValue.value : '', // 判断点没点关键字
    userName: userStore.getUser.userName,
    allowDownload: searchType.value[0] === '2' ? '0' : '',
    all: searchValue.value || '',
    kldTagIds: Array.isArray(arrayData.value) ? arrayData.value.toString() : '',
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
    userId: userStore.getUser.id,
  };
  knowledgeQueryPage(params).then(res => {
    if (res && res.data.code === '0') {
      changeTabFlag.value = 3;
      documentList.value = [];
      documentList.value = res.data.data.data;
      page.value.pageCount = res.data.data.total;
      // viewHistory();
      // hotArticle();
    }
  });
};

// 获取问答列表
const getQuestList = () => {
  publicFun();
  const params = {
    all: keyWord.value || '',
    kldTagIds: Array.isArray(arrayData.value) ? arrayData.value.toString() : '',
    userId: userStore.getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  queryPageQuestion(params).then(res => {
    if (res && res.data.code === '0') {
      changeTabFlag.value = 3;
      documentList.value = [];
      documentList.value = res.data.data.data;
      page.value.pageCount = res.data.data.total;
      // viewHistory();
      // hotArticle();
    }
  });
};

// 切换标识
const changeType = () => {
  initPage();
  initSearch();
  documentList.value = [];
  if (tabValue.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
  getTaglist();
  hiddenStatus.value = false;
};

// 获取二级节点数据
const getTaglist = () => {
  const params = {
    tagType: 1,
    nodeLevel: '2',
    fileType: tabValue.value,
  };
  querySecondTagNode(params).then(res => {
    if (res && res.data.code === '0') {
      // 二级节点
      elTagcheckedOneData.value = [];
      elTagcheckedOneData.value = res.data.data.result;
      if (res.data.data.result.length > 12 && elTagcheckedOneStatus.value === false) {
        elTagcheckedOneData.value = [];
        elTagcheckedOneData.value = res.data.data.result.splice(0, 13);
      } else if (res.data.data.result.length > 12 && elTagcheckedOneStatus.value === true) {
        elTagcheckedOneData.value = [];
        elTagcheckedOneData.value = res.data.data.result;
      }
    }
  });
};

// 获取三级节点数据
const getThirdData = id => {
  const params = {
    tagType: 1,
    id,
    fileType: tabValue.value,
  };
  queryThreeTagNode(params).then(res => {
    if (res && res.data.code === '0') {
      arrayData.value = [];
      elTagcheckedTwoData.value = [];
      flagSecondData.value = [];
      // 三级节点
      flagSecondData.value = JSON.parse(JSON.stringify(res.data.data.result));
      elTagcheckedTwoData.value = res.data.data.result;

      res.data.data.result.map(v => {
        arrayData.value.push(v.id);
      });

      if (elTagcheckedTwoData.value.length > 12 && elTagcheckedTwoStatus.value === false) {
        elTagcheckedTwoData.value = elTagcheckedTwoData.value.splice(0, 13);
      } else if (elTagcheckedTwoData.value.length > 12 && elTagcheckedTwoStatus.value === true) {
        elTagcheckedTwoData.value = [];
        elTagcheckedTwoData.value = flagSecondData.value;
      }
      if (tabValue.value === 4) {
        getQuestList();
      } else {
        searchData();
      }
    }
  });
};

// 所属类目1切换
const onChangeElCheckTagOne = (val, item, index) => {
  elTagcheckedTwoData.value = [];
  if (item.id && val) {
    hiddenStatus.value = true;
    getThirdData(item.id);
  }
  // 保存类目1的id
  firstId.value = item.id;
  elTagcheckedOneData.value.forEach((item: any) => {
    item.check = false;
  });
  elTagcheckedOneData.value[index].check = val;
  if (val === false && tabValue.value === 4) {
    arrayData.value = [];
    getQuestList();
    hiddenStatus.value = false;
  } else if (val === false && tabValue.value !== 4) {
    arrayData.value = [];
    searchData();
    hiddenStatus.value = false;
  }
  thirdData.value = [];
};

//所属类目2切换
const onChangeElCheckTagTwo = val => {
  initPage();
  arrayData.value = val;
  if (tabValue.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
  // 把需要的三级节点id传给父级
};

const initPage = () => {
  page.value.pageSize = 10;
  page.value.currentPage = 1;
};
const initSearch = () => {
  arrayData.value = [];
  thirdData.value = [];
};
// 分页
const handleCurrentChange = (val, size) => {
  page.value.currentPage = val;
  page.value.pageSize = size;
  if (tabValue.value === 4) {
    getQuestList();
  } else {
    searchData();
  }
};

onMounted(() => {
  searchData();
  getTaglist();
});
</script>

<template>
  <div class="knowledge-container flex flex-col h-full">
    <div class="w-full flex items-center justify-between header">
      <a-tabs v-model:active-key="tabValue" class="elTabs" @change="changeType" size="small">
        <a-tab-pane tab="文档" :key="1" />
        <a-tab-pane tab="问答" :key="4" />
        <a-tab-pane tab="视频" :key="2" />
        <a-tab-pane tab="图片" :key="3" />
        <template #rightExtra>
          <div class="flex items-center">
            <a-input-search v-model:value="searchValue" placeholder="输入关键字进行搜索" @search="onSearch" class="max-w-[300px]">
              <template #enterButton>
                <div class="flex items-center">
                  <SearchOutlined />
                  <span class="ml-[4px]">搜索</span>
                </div>
              </template>
            </a-input-search>
            <a-checkbox-group v-model:value="searchType" :options="searchOptions" class="ml-[8px] flex-shrink-0" />
          </div>
        </template>
      </a-tabs>
    </div>
    <searchTag
      :elTagcheckedOneData="elTagcheckedOneData"
      :hiddenStatus="hiddenStatus"
      :elTagcheckedOneStatus="elTagcheckedOneStatus"
      :elTagcheckedTwoStatus="elTagcheckedTwoStatus"
      :elTagcheckedTwoData="elTagcheckedTwoData"
      @onChangeElCheckTagOne="onChangeElCheckTagOne"
      @onChangeElCheckTagTwo="onChangeElCheckTagTwo"
      class="mt-[16px]" />
    <main class="flex-1 h-0">
      <div class="list wei-scrollbar h-full overflow-y-auto pt-[16px]">
        <a-row class="w-full items-start" v-if="tabValue === 1" :gutter="[16, 16]">
          <a-col :span="12" class="item" v-for="item in documentList" :key="item.id">
            <text-card :text-data="item" @handleFetchList="searchData" />
          </a-col>
        </a-row>

        <div class="w-full h-full" v-if="tabValue === 4">
          <div class="item" v-for="item in documentList" :key="item.id">
            <ask-card :ask-data="item" @handleFetchList="getQuestList" />
          </div>
        </div>
        <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="tabValue === 2">
          <div class="item" v-for="item in documentList" :key="item.id">
            <video-card :video-data="item" @handleFetchList="searchData" />
          </div>
        </div>
        <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="tabValue === 3">
          <div class="item" v-for="item in documentList" :key="item.id">
            <img-card :img-data="item" @handleFetchList="searchData" />
          </div>
        </div>
      </div>
    </main>
    <footer class="flex justify-end pt-[16px]">
      <a-pagination
        v-model:current="page.currentPage"
        :total="page.pageCount"
        :default-page-size="page.pageSize"
        show-less-items
        show-size-changer
        :show-total="total => `共${total}条`"
        @change="handleCurrentChange" />
    </footer>
  </div>
</template>

<style lang="less" scoped>
.knowledge-tab {
  :deep(.ant-radio-group) {
    display: inline-flex;
    gap: 6px;

    .ant-radio-button-wrapper {
      border-radius: 0 !important;
    }
  }

  .header {
    border-bottom: 1px solid #eaeaf1;
  }
}
:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin-left: 0px;
}
.elTabs {
  border-radius: 4px;
  width: 100%;

  :deep(.ant-tabs-nav) {
    // height: 48px;
    margin-bottom: 0;
    background-color: #ffffff;
    padding: 0 0 16px 0;
  }

  :deep(.ant-tabs-tab) {
    width: 72px;
    // height: 32px;
    font-size: 14px;
    background: #f2f5f7;
    border-radius: 2px 0 0 2px;
    border: 1px solid #ffffff;
    margin-right: 2px;
    justify-content: center;
    padding: 0 !important;
  }

  :deep(.ant-tabs-tab-active) {
    background: #e6effb;

    .ant-tabs-tab-btn {
      font-weight: 600;
      font-size: 14px;
      color: var(--ant-primary-color);
      text-shadow: none !important;
    }
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }

  :deep(.ant-tabs-content-holder) {
    display: none;
  }
}
</style>
