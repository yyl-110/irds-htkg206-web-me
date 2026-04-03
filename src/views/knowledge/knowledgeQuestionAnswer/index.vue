<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Empty, message } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined, MessageOutlined, SearchOutlined, UserOutlined, HeartOutlined, HeartFilled, ShareAltOutlined } from '@ant-design/icons-vue';
import PoseQuestion from '../components/poseQuestion.vue';
import searchTag from '../components/search-tag.vue';
import { knowledgeQuestion, removeAnswer, doInterestQuestion, answerQuestion, removeQuestion } from '@/api/knowledge/index.js';
import { useUserStore } from '@/store/modules/user';
import questionCard from './questionCard.vue';

const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE);


const flag = ref(1);
const searchKey = ref('');
const activeName = ref('all');
const page = ref({ pageSize: 10, pageCount: 100, currentPage: 1 });
const poseDialogVisible = ref(false);
const tabFlag = ref(1);
const totalList = ref([]);
const editData = ref({});
const selectId = ref('');
const expertFlag = ref(0);
const addFlag = ref('');
const exportId = ref('');
const spinning = ref(false);

const emit = defineEmits(['clearExposeAskDesId']);
const props = defineProps({
  getCurrentTab: String,
  exposeAskDesId: String,
});

const tabFlagMap = { all: 1, myQuestion: 2, myAnswer: 3, expert: 4 };

const userId = computed(() => useUserStore().getUser.id);

watch(
  () => props,
  val => {
    if (val.exposeAskDesId) {
      nextTick(() => {
        tabFlag.value = 4;
        activeName.value = 'expert';
        exportId.value = val.exposeAskDesId;
        initData();
      });
    }
  },
  { deep: true }
);


onMounted(() => {
  initData();
});

const handleClick = key => {
  emit('clearExposeAskDesId');
  tabFlag.value = tabFlagMap[key] ?? 1;
  exportId.value = '';
  initData();
};

const initData = () => {
  const params = {
    all: searchKey.value || '',
    searchType: tabFlag.value,
    creatUser: exportId.value || '',
    kldTagIds: selectId.value || '',
    userId: userId.value,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  };
  spinning.value = true
  knowledgeQuestion(params).then(res => {
    if (res && res.data.code === '0') {
      totalList.value = res.data.data.result
      page.value.pageCount = res.data.data.rowCount;
      expertFlag.value = 3;
    }
  }).finally(() => {
    spinning.value = false
  });
};

const poseFun = () => {
  addFlag.value = '1';
  poseDialogVisible.value = true;
};


const closeDialog = (val, num) => {
  poseDialogVisible.value = val;
  if (num) addFlag.value = num;
  setTimeout(initData, 1000);
};

const changeFlag = val => {
  selectId.value = val.toString();
  initData();
};

const handleCurrentChange = (val, size) => {
  page.value.currentPage = val;
  page.value.pageSize = size;
  initData();
};
</script>

<template>
  <div class="layout h-full">
    <div class="elMain">
      <div class="content h-full flex flex-col" id="tabContent">
        <a-tabs v-model:active-key="activeName" class="elTabs" @change="handleClick" size="small">
          <a-tab-pane tab="全部问答" key="all" />
          <a-tab-pane tab="我的问题" key="myQuestion" />
          <a-tab-pane tab="我的问答" key="myAnswer" />
          <!-- <a-tab-pane tab="专家发布" key="expert" /> -->
          <template #rightExtra>
            <div class="flex items-center">
              <a-input-search v-model:value="searchKey" placeholder="输入关键字进行搜索" @search="initData"
                class="max-w-[300px]">
                <template #enterButton>
                  <div class="flex items-center">
                    <SearchOutlined />
                    <span class="ml-[4px]">搜索</span>
                  </div>
                </template>
              </a-input-search>
              <a-button type="primary" @click="poseFun" class="ml-[16px]">
                <img style="margin-right: 5px" src="@/assets/images/msg.png" alt="" />
                我要提问
              </a-button>
            </div>
          </template>
        </a-tabs>

        <searchTag @changeFlag="changeFlag" :flag="flag" />

        <div class="doc-wrap flex-1 wei-scrollbar">
          <div class="doc-list ask-list" v-for="allQues in totalList" :key="allQues.id">
            <question-card :allQues="allQues" @handleReload="initData" />
          </div>
          <a-empty v-if="totalList.length === 0 && !spinning" :image="simpleImage" />
        </div>
        <footer class="pagination-footer flex justify-end">
          <a-pagination v-model:current="page.currentPage" :total="page.pageCount" :default-page-size="page.pageSize"
            show-less-items show-size-changer :show-total="(total) => `共${total}条`" @change="handleCurrentChange" />
        </footer>
      </div>
    </div>

    <PoseQuestion :poseDialogVisible="poseDialogVisible" :editData="editData" :addFlag="addFlag"
      @closeDialog="closeDialog">
    </PoseQuestion>
  </div>
</template>

<style lang="less" scoped>
:deep(.ant-tabs-tab+.ant-tabs-tab) {
  margin-left: 0px;
}

.layout {
  .ask-wrap {
    height: 102px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    padding-left: 20px;

    .btn {
      width: 180px;
      background: #155bd4;
      border-radius: 8px;
      font-size: 24px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      line-height: 54px;
      cursor: pointer;
    }
  }
}

.elMain {
  padding: 0;
  height: 100%;

  .content {
    position: relative;
    background: #fff;

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
          color: #1366d1;
        }
      }

      :deep(.ant-tabs-ink-bar) {
        display: none;
      }

      :deep(.ant-tabs-content-holder) {
        display: none;
      }
    }

    .doc-wrap {
      overflow-y: auto;
      background: #ffffff;
      border-radius: 4px;
      padding: 0 16px 16px 16px;

      .doc-list {
        margin-bottom: 14px;
        border-top: 2px solid #eaeaf1;
        padding-top: 16px;

        &:first-child {
          border: none;
        }

        .ask-list-top {
          display: flex;
          justify-content: space-between;

          .ask-list-left {
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 32px;
            margin-bottom: 8px;

            .elAvatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 1px solid #d3d2d9;
            }

            .name {
              margin: 0 12px 0 8px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              font-size: 14px;
              color: #313133;
            }

            .time {
              margin-top: 2px;
              margin-right: 8px;
            }

            .exigency {
              width: 36px;
              line-height: 20px;
              font-size: 12px;
              text-align: center;
              color: #f56c6c;
              border-radius: 2px;
              border: 1px solid #f56c6c;
            }

            .importance {
              width: 36px;
              line-height: 20px;
              font-size: 12px;
              text-align: center;
              color: #e6a23c;
              border-radius: 2px;
              border: 1px solid #e6a23c;
            }
          }

          .ask-list-right {
            display: flex;
            align-items: center;
            margin-right: 16px;
            cursor: pointer;

            .author-myAnser-text {
              font-weight: 400;
              font-size: 16px;
              color: #1366d1;
              margin-left: 5px;
            }
          }
        }

        .ask-list-title {
          cursor: pointer;
          line-height: 26px;

          .ask-list-title-name {
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 16px;
            color: #000;
          }
        }

        .action-row {
          font-family: Source Sans 3, Source Sans 3;
          font-weight: 400;
          font-size: 14px;
          color: #6a696e;
          cursor: pointer;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 12px;
        }

        .author {
          display: flex;
          height: 24px;

          .elStarFilled {
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-left: 10px;

            &:hover {
              color: #155bd4;
            }
          }

          .elStarFilled1 {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: red;
            margin-left: 10px;
          }

          .elShare {
            margin-left: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          &-elEdit {
            display: flex;
            align-items: center;
            font-size: 12px;
            margin: 0 20px 0 0;

            &-text {
              color: #155bd4;
              cursor: pointer;
              margin-top: 2px;
            }
          }

          &-elDelete {
            display: flex;
            align-items: center;
            font-size: 12px;
            padding-top: 3px;

            &-text {
              color: #155bd4;
              cursor: pointer;
            }
          }
        }

        .bottomAnswer {
          margin-top: 8px;
          margin-left: 10px;
          position: relative;

          .titleTop {
            display: flex;
            align-items: center;
            margin-left: 25px;

            .elAvatar {
              margin-right: 8px;
            }
          }

          span {
            height: 22px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            line-height: 22px;
          }

          .content {
            margin: 5px 20px 0 0;
            line-height: 24px;

            .content-answer {
              position: absolute;
              left: -35px;
              display: inline-block;
              text-align: center;
              width: 26px;
              height: 22px;
              background: #e6effb;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              font-size: 14px;
              color: #1366d1;
              border-radius: 8px 8px 0 8px;
              margin-right: 10px;
            }
          }
        }

        .up {
          position: relative;
          top: 10px;
          cursor: pointer;
          font-family: Source Sans 3, Source Sans 3;
          font-weight: 400;
          font-size: 14px;
          color: #6a696e;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .starComment {
          display: flex;
          gap: 16px;
          align-items: center;
          margin: 15px 0 0 25px;
          padding-bottom: 15px;
          border-bottom: 2px dotted #c3c3c3;

          .elStarFilled {
            cursor: pointer;
            display: flex;
            align-items: center;

            &:hover {
              color: #155bd4;
            }
          }

          .elStarFilled1 {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: red;
          }

          .elChatDotSquare {
            display: flex;
            align-items: center;
            cursor: pointer;
            gap: 4px;

            span {
              :first-child {
                margin-top: 4px;
              }
            }
          }
        }

        .commont {
          &-btn {
            margin-top: 5px;
          }
        }
      }
    }

    .elPage {
      margin: 5px 20px 0 0;
      padding-bottom: 15px;

      :deep(.is-active) {
        color: #fff;
        width: 24px;
        height: 24px;
        background-color: #409eff;
      }
    }
  }

  .search_btn {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 100px;
    line-height: 32px;
    background: #1366d1;
    border-radius: 4px;
    font-weight: 400;
    color: #ffffff !important;
    text-align: center;
    cursor: pointer;
  }

  .top-header {
    position: absolute;
    width: 400px;
    top: 10px;
    right: 135px;
    background: #ffffff;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;

    .search-wrap {
      width: 360px;
      height: 52px;
      position: relative;
      display: inline-block;

      .input-with-select {
        width: 100%;
        height: 30px;
        line-height: 52px;
        background: #fff;
        padding-left: 10px;
        border: 1px solid #eaeaf1;
        top: 4px;
        outline: 1px solid #eaeaf1;
      }

      .btn {
        width: 57px;
        height: 32px;
        background: #155bd4;
        border: 1px solid #1366d1;
        border-radius: 0 5px 5px 0;
        font-size: 16px;
        color: #ffffff;
        position: absolute;
        top: 3px;
        right: 0;
        font-family: PingFangSC, PingFang SC;
        line-height: 32px;
      }
    }
  }
}

.elAside {
  width: 244px;
  overflow: hidden;
}

.imgColor {
  color: #155bd4;
  padding-top: 2px;
}

.icon-hanhan-01-01:before {
  color: #a2a1a6;
}

.icon-hanhan,
.icon-hanhan1 {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 14px;
}


.icon-hanhan1:before {
  color: #ff4f44;
}

.icon-fenxiang:before {
  font-size: 16px;
  color: #a2a1a6;
}

.icon-hanhan-01-01,
.icon-fenxiang {
  margin-right: 4px;
}
</style>
