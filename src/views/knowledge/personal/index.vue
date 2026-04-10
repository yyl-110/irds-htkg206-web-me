<template>
  <div class="layout h-full">
    <div class="elMain">
      <div class="content h-full flex flex-col" id="tabContent">
        <a-tabs v-model:active-key="activeName" class="elTabs" @change="handleClick" size="small">
          <a-tab-pane tab="文档" key="doc" v-if="hideFile"></a-tab-pane>
          <a-tab-pane tab="问答" key="ask" v-if="hideQuest"></a-tab-pane>
          <a-tab-pane tab="视频" key="video" v-if="hideFile"></a-tab-pane>
          <a-tab-pane tab="图片" key="pic" v-if="hideFile"></a-tab-pane>
          <template #rightExtra>
            <div class="flex items-center">
              <a-input-search v-model:value="searchKey" placeholder="输入关键字进行搜索" @search="publicFun"
                class="max-w-[400px]">
                <template #enterButton>
                  <div class="flex items-center">
                    <SearchOutlined />
                    <span class="ml-[4px]">搜索</span>
                  </div>
                </template>
              </a-input-search>
            </div>
          </template>
        </a-tabs>
        <main class="flex-1 h-0">
          <div class="list h-full overflow-y-auto pt-[16px]">
            <a-empty v-if="documentList.length === 0 && !spinning" :image="simpleImage" />
            <a-row class="w-full items-start h-full" v-if="activeName === 'doc'" :gutter="[16, 16]">
              <a-col :span="12" class="item" v-for="item in documentList" :key="item.id">
                <text-card :text-data="{ content: item }" @handleFetchList="publicFun" />
              </a-col>
            </a-row>

            <div class="w-full h-full" v-if="activeName === 'ask'">
              <div class="item" v-for="item in documentList" :key="item.id">
                <ask-card :ask-data="{ content: item }" @handleFetchList="publicFun" />
              </div>
            </div>
            <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="activeName === 'video'">
              <div class="item" v-for="item in documentList" :key="item.id">
                <video-card :video-data="{ content: item }" @handleFetchList="publicFun" />
              </div>
            </div>
            <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="activeName === 'pic'">
              <div class="item" v-for="item in documentList" :key="item.id">
                <img-card :img-data="{ content: item }" @handleFetchList="publicFun" />
              </div>
            </div>
          </div>
        </main>
        <footer class="pagination-footer flex justify-end">
          <a-pagination v-model:current="page.currentPage" :total="page.pageCount" :default-page-size="page.pageSize"
            show-less-items show-size-changer :show-total="(total) => `共${total}条`" @change="handleCurrentChange" />
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collectFileList, interestList, shareFileList, shareQuestionList } from '@/api/knowledge'
import askCard from '../components/askCard.vue'
import imgCard from '../components/imgCard.vue'
import textCard from '../components/textCard.vue'
import videoCard from '../components/videoCard.vue'
import { useUserStore } from '@/store/modules/user'
import { Empty, message } from 'ant-design-vue'
import { ref, onMounted, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE);

const activeName = ref('doc')
const searchKey = ref('')
const documentList = ref([])
const spinning = ref(false)

const hideFile = ref(true);
const hideQuest = ref(false);

// 点击右侧的数据
const sideData = ref({});

// tab标识
const tabFlag = ref(1);

const props = defineProps({
  personalInfo: Object,
});

const page = ref({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
});

// 收藏
const myCollect = async () => {
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    userId: useUserStore().getUser.id,
    attachmentType: tabFlag.value, //文件类型.1,文档，2视频，3图片
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  try {
    const res = await collectFileList(params);
    if (res && res.data.code === '0') {
      documentList.value = [];
      documentList.value = res.data.data.result || [];
      page.value.pageCount = res.data.data.rowCount;
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    spinning.value = false
  }
};

// 关注
const myInterestList = async () => {
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    userId: useUserStore().getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  try {
    const res = await interestList(params);
    if (res && res.data.code === '0') {
      documentList.value = [];
      documentList.value = res.data.data.result || [];
      page.value.pageCount = res.data.data.rowCount;
      documentList.value.map(v => {
        v.hidden = false;
        v.replay = false;
      });
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    spinning.value = false
  }
};

// 问题分享
const myShareQuestionList = async () => {
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    userId: useUserStore().getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  try {
    const res = await shareQuestionList(params);
    if (res && res.data.code === '0') {
      documentList.value = [];
      documentList.value = res.data.data.result || [];
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    spinning.value = false
  }
};

// 分享
const myShareFileList = async () => {
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    attachmentType: tabFlag.value,
    userId: useUserStore().getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  try {
    const res = await shareFileList(params)
    if (res && res.data.code === '0') {
      console.log(res.data.data, '我是关注列表');
      documentList.value = [];
      documentList.value = res.data.data.result;
      page.value.pageCount = res.data.data.rowCount;
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    spinning.value = false
  }
};

// 公共函数
const publicFun = () => {
  if ((activeName.value === 'doc' || activeName.value === 'video' || activeName.value === 'pic') && sideData.value.key === 'my-contribution') {
    myCollect();
  } else if (activeName.value === 'ask' && sideData.value.key === 'my-follow') {
    activeName.value = 'ask';
    myInterestList();
  } else if (sideData.value.key === 'my-knowledgeShare') {
    if (tabFlag.value === 4) {
      myShareQuestionList();
    } else {
      myShareFileList();
    }
  } else {
    if (sideData.value.key === 'my-contribution' || activeName.value === 'doc' || activeName.value === 'video' || activeName.value === 'pic') {
      myCollect();
    } else if (sideData.value.key === 'my-follow') {
      myInterestList();
    } else if (sideData.value.key === 'my-knowledgeShare') {
      if (tabFlag.value === 4) {
        myShareQuestionList();
      } else {
        myShareFileList();
      }
    }
  }
};

// 点击右侧数据
const sideFun = item => {
  page.value.currentPage = 1;
  page.value.pageSize = 10;
  sideData.value = item;
  documentList.value = []
  if (item.key === 'my-contribution') {
    activeName.value = 'doc';
    hideFile.value = true;
    hideQuest.value = false;
    tabFlag.value = 1;
    myCollect();
  } else if (item.key === 'my-follow') {
    activeName.value = 'ask';
    hideFile.value = false;
    hideQuest.value = true;
    myInterestList();
  } else if (item.key === 'my-knowledgeShare') {
    activeName.value = 'doc';
    hideFile.value = true;
    hideQuest.value = true;
    if (tabFlag.value === 4) {
      myShareQuestionList();
    } else {
      tabFlag.value = 1;
      myShareFileList();
    }
  } else {
    // emit('changetab');
  }
};
const searchData = () => { }
const handleCurrentChange = (val, size) => {
  page.value.currentPage = val;
  page.value.pageSize = size;
  publicFun();
};

// tab 栏切换
const handleClick = val => {
  page.value.currentPage = 1;
  page.value.pageSize = 10;
  if (activeName.value === 'doc') {
    tabFlag.value = 1;
  } else if (activeName.value === 'video') {
    tabFlag.value = 2;
  } else if (activeName.value === 'pic') {
    tabFlag.value = 3;
  } else {
    tabFlag.value = 4;
  }
  publicFun();
};

onMounted(() => {
  publicFun()
});

watch(
  () => props.personalInfo,
  (data: any) => {
    if (data.key) {
      sideFun(data);
    }
  }
);

</script>

<style scoped lang="less">
.elMain {
  padding: 0;
  height: 100%;

  .content {
    position: relative;
    background: #fff;

    :deep(.ant-tabs-tab+.ant-tabs-tab) {
      margin-left: 0px;
    }

    .elTabs {
      border-radius: 4px;

      :deep(.ant-tabs-nav) {
        // height: 48px;
        margin-bottom: 0;
        background-color: #ffffff;
        padding: 0 0 16px 0;
      }

      :deep(.ant-tabs-tab) {
        width: 96px;
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
        }
      }

      :deep(.ant-tabs-ink-bar) {
        display: none;
      }

      :deep(.ant-tabs-content-holder) {
        display: none;
      }
    }
  }
}
</style>