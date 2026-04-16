<script setup lang="ts">
import {
  doCollectFile,
  doInterestQuestion,
  fileList,
  getPdfPreviewPath,
  saveLookFileLog,
  updateKldCounting,
} from "@/api/knowledge";
import { getTimes, getAllTimes } from "@/utils/dateUtils";
import {
  ExportOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  DownloadOutlined,
  HeartFilled,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons-vue";
import { Empty, message } from "ant-design-vue";
import shareCell from "./share.vue";
import comment from "@/components/Comment/index.vue";
import Video from "./videoImg.vue";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
interface IOpenParams {
  kldTreeId: string;
  userId: string;
}
const open = ref<boolean>(false);
const searchText = ref<string>("");
const tabValue = ref<number>(1);
const nodeParams = ref<IOpenParams>({
  kldTreeId: "",
  userId: "",
});
const answer = ref("");
const page = ref({
  pageSize: 10000,
  pageCount: 100,
  currentPage: 1,
});
const hideFlag = ref(false);
const documentList = ref<any[]>([]);
const docId = ref("");
const questFlag = ref(1);
const shareDialogVisible = ref(false);

// 点击评论获得当前条数据
const commonDeail = ref({});

const videoHide = ref(false);

const fileUrlPlay = ref();

const titleType = ref();

const dialogType = ref("");

const commentDialogVisible = ref(false);

const commentDialogVisibleQuest = ref(false);

const numberFlag = ref();

const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE);

const spinning = ref(false);
function onSearch() {
  page.value.currentPage = 1;
  fetchFileList();
}
const openDrawer = (params: IOpenParams) => {
  nodeParams.value = params;
  open.value = true;
  fetchFileList();
};

const changeType = (e: any) => {
  page.value.currentPage = 1;
  documentList.value = [];
  fetchFileList();
};

// 向上收起
const upData = () => {
  hideFlag.value = false;
};

const changeHideFlag = (item) => {
  documentList.value.map((v) => {
    if (v.id === item.id) {
      v.hidden = true;
      hideFlag.value = !hideFlag.value;
    } else {
      v.hidden = false;
    }
  });
};

const fetchFileList = async () => {
  try {
    const { currentPage, pageSize } = page.value;
    spinning.value = true;
    const payload = {
      pageSize,
      currentPage,
      type: tabValue.value,
      titleOrUserName: searchText.value,
      ...nodeParams.value,
    };
    const res = await fileList(payload);
    if (res.data && res.data.code === "0") {
      documentList.value = res.data.data?.result || [];
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    spinning.value = false;
  }
};

// star星星数
const starFun = async (item) => {
  // console.log(item, 'itemitem');
  const { userId } = nodeParams.value;
  const params = {
    questionId: item.id,
    userId,
  };
  try {
    const res = await doInterestQuestion(params);
    if (res.data && res.data.code === "0") {
      if (item.interestLight) {
        message.success("取消关注成功！");
      } else {
        message.success("关注成功！");
      }
      fetchFileList();
    }
  } catch (error) {
    console.log("error", error);
  }
};

// 评论
const commentFun = (item) => {
  // console.log(item, 'sdfhsdgjkdshfbgsdf');
  commonDeail.value = item;
  commentDialogVisible.value = true;
};

// 问答评论
const commentQuestFun = (item) => {
  commonDeail.value = item;
  numberFlag.value = 2;
  commentDialogVisibleQuest.value = true;
};

// 分享
const shareFun = (item) => {
  docId.value = item.kldFileId;
  if (tabValue.value === 4) {
    questFlag.value = 2;
  }
  shareDialogVisible.value = true;
};
//关闭分享
const closeShare = () => {
  shareDialogVisible.value = false;
  fetchFileList();
};

const closeCommentDialogNotification = () => {
  commentDialogVisible.value = false;
  commentDialogVisibleQuest.value = false;
};

// 关注
const followFun = (item) => {
  const params = {
    kldId: item.kldFileId,
    userId: useUserStore().getUser.id,
  };
  doCollectFile(params).then((res) => {
    if (res && res.data.code === "0") {
      message.success("关注成功！");
      fetchFileList();
    }
  });
};

// 下载
const downFun = (item) => {
  window.location.href = `${import.meta.env.VITE_BASE_PREVIEW_URL
    }/base-server/fileManagerController/download.json?fileId=${item.fileId}`;
};

const getVideoHide = (val) => {
  videoHide.value = val;
  fetchFileList();
};

// 查看pdf
const viewPdf = async (item) => {
  const params = {
    id: item.fileId,
  };
  try {
    updateKldCounting({ kldFileId: item.kldFileId, countingType: 1 });
    const res = await getPdfPreviewPath(params)
    if (res && res.status === 200) {
      open.value = false
      router.push({
        path: "/knowledge/pdfView",
        query: { docId: res.data.fileUrl },
      });
    }
  } catch (error) {
    console.log('error', error)
  }
};

//查看pdf
const viewPdfFun = (item) => {
  const paramss = {
    name: useUserStore().getUser.userName, //userName
    userId: useUserStore().getUser.id,
    kldId: item.kldFileId, //fileId
    type: "1", //1,浏览  2，下载
  };
  saveLookFileLog(paramss).then((res) => {
    if (res && res.data.code === "0") {
      // 浏览记录数据
      console.log(res, "dfgsdfdfhfd");
    }
  });

  // store.commit("SET_OBJECTITEM", item);
  if (tabValue.value === 1) {
    viewPdf(item);
  }
  if (tabValue.value === 2) {
    fileUrlPlay.value = item.fileUrl;
    videoHide.value = true;
    titleType.value = "视频播放";
    dialogType.value = "2";
  }
  if (tabValue.value === 3) {
    fileUrlPlay.value = item.fileUrl;
    videoHide.value = true;
    titleType.value = "图片查看";
    dialogType.value = "3";
  }
  const params = {
    kldFileId: item.kldFileId,
    countingType: 1,
  };
  updateKldCounting(params).then((res) => {
    if (res && res.data.code === "0") {
    }
  });
  fetchFileList();
};


const confidentialLevel = (val) => {
  if (val.confidential_level === '0')
    return '公开';
  if (val.confidential_level === '1')
    return '内部';
  if (val.confidential_level === '2')
    return '秘密';
  if (val.confidential_level === '3')
    return '机密';
  return '公开';
}

defineExpose({
  openDrawer,
});
</script>

<template>
  <a-drawer v-model:visible="open" :closable="false" :width="800">
    <div class="h-full flex flex-col">
      <div class="header">
        <a-input-search v-model:value="searchText" placeholder="请输入标题或作者搜索" @search="onSearch">
          <template #enterButton>
            <div class="flex items-center">
              <SearchOutlined />
              <span class="ml-[4px]">搜索</span>
            </div>
          </template>
        </a-input-search>
        <a-tabs v-model:active-key="tabValue" class="elTabs" @change="changeType" size="small">
          <a-tab-pane tab="文档" :key="1" />
          <a-tab-pane tab="问答" :key="4" />
          <a-tab-pane tab="视频" :key="2" />
          <a-tab-pane tab="图片" :key="3" />
        </a-tabs>
      </div>
      <div class="drawerMain overflow-y-auto wei-scrollbar">
        <a-spin :spinning="spinning" class="h-full">
          <div v-if="tabValue === 1" class="doc-wrap">
            <div class="doc-list" v-for="(item, index) in documentList">
              <div style="display: flex; margin-top: 16px">
                <div style="
                    min-width: 44px;
                    height: 44px;
                    background: #fbd5d5;
                    border-radius: 4px;
                    margin-right: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  ">
                  <span style="
                      text-align: center;
                      font-weight: bold;
                      font-size: 24px;
                      color: #d71515;
                      line-height: 24px;
                      font-style: normal;
                      text-transform: none;
                    ">{{ item.fileType[0] }}</span>
                </div>
                <div class="flex-1 w-0">
                  <a-tooltip class="box-item" placement="top">
                    <template #title>{{
                      item.fileName + "." + item.fileType
                    }}</template>
                    <div class="highlightName" @click="viewPdfFun(item)">
                      {{ item.fileName }}.{{ item.fileType }}
                    </div>
                  </a-tooltip>
                  <div style="height: 26px; margin-top: 4px">
                    <a-breadcrumb separator="|">
                      <a-breadcrumb-item>{{
                        item.version || ""
                      }}</a-breadcrumb-item>
                      <a-breadcrumb-item>{{
                        getTimes(Date.parse(item.addTime)) || ""
                      }}</a-breadcrumb-item>
                      <a-breadcrumb-item>{{ confidentialLevel(item) }}</a-breadcrumb-item>
                    </a-breadcrumb>
                  </div>
                </div>
              </div>
              <div v-if="item.summary" class="desc">{{ item.summary }}</div>
              <div style="
                  display: flex;
                  margin-top: 10px;
                  justify-content: space-between;
                  margin: 5px 0;
                ">
                <div style="display: flex; align-items: center">
                  <el-avatar class="elAvatar" :size="24" />
                  <div class="name">{{ item.userName }}</div>
                </div>
                <div class="action-wrap">
                  <div class="act-list">
                    <eye-outlined />
                    <span>{{ JSON.parse(item.counting).previewed }}</span>
                  </div>
                  <div class="act-list elChatDotSquare" @click="commentFun(item)">
                    <message-outlined /><span>{{
                      JSON.parse(item.counting).commented
                    }}</span>
                  </div>
                  <div class="act-list elStarFilled icon-hanhan" @click="followFun(item)">
                    <star-outlined v-if="!item.collectedLight" />
                    <star-filled v-else class="text-red" :style="{ color: 'red' }" />
                    <span>{{ JSON.parse(item.counting).collectd }}</span>
                  </div>
                  <div class="act-list elShare" @click="shareFun(item)">
                    <share-alt-outlined /><span>{{
                      JSON.parse(item.counting).shared
                    }}</span>
                  </div>
                  <div v-if="item.allowDownload !== 1" class="act-list elShare" @click="downFun(item)">
                    <download-outlined /><span>{{
                      JSON.parse(item.counting).downloaded
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tabValue === 4" class="quest-wrap">
            <div class="doc-list ask-list" v-for="(allQues, index) in documentList" :key="allQues.id">
              <div class="ask-list-top">
                <div class="ask-list-left">
                  <el-avatar class="elAvatar" :size="24" />
                  <span class="name">{{ allQues.userName }}</span>
                  <span class="time">{{
                    getAllTimes(Date.parse(allQues.addTime))
                  }}</span>
                  <span v-if="allQues.urgency === '紧急'" class="exigency">{{
                    allQues.urgency
                  }}</span>
                  <span v-if="allQues.urgency === '严重'" class="importance">{{
                    allQues.urgency
                  }}</span>
                  <!-- <span v-if="allQues.urgency === '一般'" class="normal">{{ allQues.urgency }}</span> -->
                </div>
              </div>

              <div class="ask-list-title">
                <span class="ask-list-title-name" @click="changeHideFlag(allQues)">{{ allQues.description }}</span>
                <span class="ask-list-title-answerNum" v-if="allQues.answer && allQues?.answer.length > 0">
                  已回复<span>{{ allQues.answer.length }}</span>条
                </span>
                <!-- <span class="ask-list-title-answerUp" v-if="allQues.answer.length > 0" @click="changeHideFlag(allQues)">展开/收起</span> -->
              </div>
              <div class="author">
                <div style="font-size: 14px; color: #6a696e; cursor: pointer"
                  class="flex justify-start items-center mt-[10px] text-[14px]"
                  v-if="allQues.answer && allQues.answer.length > 0" @click="changeHideFlag(allQues)">
                  <div style="margin-right: 4px">展开全部</div>
                  <img src="@/assets/images/down11.png" alt="" style="margin-right: 20px" />
                </div>
                <div class="commont" v-if="hideAnswer && allQues.replay === true">
                  <a-input v-model:value="answer" type="textarea" />
                  <a-button class="commont-btn" type="primary" @click="confirmAnswer">确定</a-button>
                </div>
                <div v-if="
                  hideFlag &&
                  allQues.hidden === true &&
                  allQues.answer &&
                  allQues.answer.length > 0
                ">
                  <div class="bottomAnswer" v-for="(myAnser, index) in allQues.answer" :key="myAnser.id">
                    <div class="titleTop">
                      <div class="contents">
                        <span class="content-answer">答</span><span class="name">{{ myAnser.userName }}：</span>
                        {{ myAnser.content }}
                      </div>
                    </div>
                    <div class="starComment">
                      <div class="elChatDotSquare" @click="commentQuestFun(myAnser)">
                        <message-outlined class="mr-[5px]" /><span>{{
                          myAnser.discussNum
                        }}</span>
                      </div>
                      <div v-if="!allQues.interestLight" class="icon-hanhan elChatDotSquare" @click="starFun(allQues)">
                        <heart-outlined class="mr-[5px]" /><span>{{
                          myAnser.discussNum
                        }}</span>
                      </div>
                      <div v-else class="elChatDotSquare" @click="starFun(allQues)">
                        <heart-filled class="mr-[5px] text-red" :style="{ color: 'red' }" /><span>{{ myAnser.discussNum
                        }}</span>
                      </div>
                      <div class="elChatDotSquare" @click="shareFun(allQues)">
                        <share-alt-outlined /><span>{{
                          myAnser.discussNum
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <span class="up" @click="upData">
                    <div style="margin-right: 4px">收起回答</div>
                    <img src="@/assets/images/up11.png" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tabValue === 2" class="video-wrap">
            <div class="doc-list" v-for="(item, index) in documentList">
              <video class="img-list" :src="item.fileUrl" width="199" height="142" controls />
              <div class="video-wrap-title">
                <a-tooltip class="box-item" effect="light" placement="top">
                  <template #title>{{ item.fileName }}.{{ item.fileType }}</template>
                  <h3 class="fontHide" @click="viewPdfFun(item)">
                    {{ item.fileName }}.{{ item.fileType }}
                  </h3>
                </a-tooltip>
                <div class="video-wrap-title-right">
                  <span>{{ JSON.parse(item.counting).previewed }}次播放</span>
                  <div class="act-list elStarFilled" @click="followFun(item)">
                    <star-outlined v-if="!item.collectedLight" />
                    <star-filled v-else style="color: red" />
                    <span>{{ JSON.parse(item.counting).collectd }}</span>
                  </div>
                  <div class="act-list elShare" @click="shareFun(item)">
                    <ShareAltOutlined />
                    <span>{{ JSON.parse(item.counting).shared }}</span>
                  </div>
                </div>
              </div>
              <div class="author" style="display: flex">
                <div>
                  <span class="name">{{ item.userName }}</span>
                  <span class="time">{{
                    getTimes(Date.parse(item.addTime)) || ""
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tabValue === 3" class="img-wrap">
            <div class="doc-list" v-for="(item, index) in documentList">
              <img class="img-list" style="width: 199px; height: 142px" :src="item.fileUrl" />
              <div class="img-wrap-title">
                <a-tooltip class="box-item" placement="top" :show-after="500">
                  <template #title>{{ item.fileName }}.{{ item.fileType }}</template>
                  <h3 class="fontHide" @click="viewPdfFun(item)">
                    {{ item.fileName }}.{{ item.fileType }}
                  </h3>
                </a-tooltip>
                <div class="img-wrap-title-right">
                  <span>{{ JSON.parse(item.counting).previewed }}次预览</span>
                  <div v-if="!item.collectedLight" class="act-list elStarFilled" @click="followFun(item)">
                    <StarFilled :style="{ color: !item.collectedLight ? '' : '#87d068' }" /><span>{{
                      JSON.parse(item.counting).collectd }}</span>
                  </div>
                  <div class="act-list elShare" @click="shareFun(item)">
                    <el-icon>
                      <Share />
                    </el-icon><span>{{ JSON.parse(item.counting).shared }}</span>
                  </div>
                </div>
              </div>
              <div class="author" style="display: flex">
                <div>
                  <span class="name">{{ item.userName }}</span>
                  <span class="time">{{
                    getTimes(Date.parse(item.addTime)) || ""
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <a-empty v-if="documentList.length === 0 && !spinning" :image="simpleImage" />
        </a-spin>
      </div>
    </div>
    <shareCell :share-dialog-visible="shareDialogVisible" :doc-id="docId" :quest-flag="questFlag" :tab-flag="tabValue"
      @close-share="closeShare" />

    <comment :comment-dialog-visible="commentDialogVisible" :common-deail="commonDeail"
      @close-comment-dialog-notification="closeCommentDialogNotification" @get-flag-list="fetchFileList" />
    <comment :comment-dialog-visible="commentDialogVisibleQuest" :common-deail="commonDeail"
      @close-comment-dialog-notification="closeCommentDialogNotification" @get-flag-list="fetchFileList" />
    <Video :video-hide="videoHide" :file-url-play="fileUrlPlay" :dialog-type="dialogType" :title-type="titleType"
      @get-video-hide="getVideoHide" />

    <template #footer>
      <div class="flex justify-end">
        <a-button type="primary" @click="open = false">关闭</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style lang="less" scoped>
:deep(.ant-tabs-tab+.ant-tabs-tab) {
  margin-left: 0px;
}

.elTabs {
  border-radius: 4px;
  width: 100%;
  margin-top: 16px;

  :deep(.ant-tabs-nav) {
    // height: 48px;
    margin-bottom: 0;
    background-color: #ffffff;
    padding: 0 0 0 0;

    &::before {
      display: none;
    }
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
    padding: 4px 0 !important;
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

:deep(.ant-spin-nested-loading) {
  height: 100%;

  .ant-spin-container {
    height: 100%;
  }
}

.drawerMain {
  flex: 1;

  .doc-wrap {
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;

    .doc-list {
      margin-bottom: 10px;
      border: 1px solid #eee;
      padding: 0 16px;

      .desc {
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #333;
        height: 55px;
        line-height: 30px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        /* 定义文本的行数 */
      }

      .elAvatar {
        margin-right: 5px;
      }

      .author {
        margin-top: 8px;

        span {
          height: 22px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 0.8);
          line-height: 22px;
        }

        span.time {
          margin-left: 13px;
        }
      }

      .action-wrap {
        display: flex;
        margin-right: 10px;
        justify-content: center;
        align-items: center;

        .act-list {
          display: flex;
          align-items: center;
          border-right: 1px solid #dcdee0;
          margin-right: 10px;
          height: 16px;

          &:last-child {
            border: none;
          }

          span {
            margin: 0 6px;
          }
        }

        .elChatDotSquare,
        .elConnection,
        .elEdit,
        .elDelete,
        .elStarFilled,
        .elShare {
          cursor: pointer;

          &:hover {
            color: var(--ant-primary-color);
          }

          &:last-child {
            margin-right: 0;
          }
        }

        .elStarFilled1 {
          cursor: pointer;
          color: red;
        }
      }

      .highlightName {
        height: 26px !important;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 16px;
        color: #000;
        line-height: 26px;
        width: calc(100% - 10px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover {
          color: var(--ant-primary-color)
        }

        :deep(em) {
          color: red !important;
        }
      }

      .descColor {
        :deep(em) {
          color: red !important;
        }
      }
    }

    .ask-list {
      .author {
        display: flex;
        align-items: center;
        height: 24px;
        margin-bottom: 8px;

        .elAvatar {
          min-height: 24px;
          min-width: 24px;
        }

        .name {
          margin-left: 8px;
          font-weight: 500;
          color: #323233;
        }
      }

      .desc {
        height: 22px;
        overflow: hidden;

        span {
          height: 22px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: var(--ant-primary-color);
          line-height: 22px;
          margin-right: 11px;
        }
      }

      .action-wrap {
        position: relative;

        .right-action {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;

          .act-list {
            color: var(--ant-primary-color);

            .delete-wrap {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }

  .video-wrap {
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    place-content: flex-start;

    .img-list {
      margin: 16px 16px 0 16px;
      border-radius: 4px;
      overflow: hidden;
      background: #ccc;
    }

    &-title {
      padding-left: 16px;

      &-right {
        display: flex;
        line-height: 22px;

        .act-list {
          display: flex;
          align-items: center;
          margin-left: 10px;

          span {
            margin: 0 5px;
          }
        }

        .elChatDotSquare,
        .elConnection,
        .elEdit,
        .elDelete,
        .elStarFilled,
        .elShare {
          cursor: pointer;

          &:hover {
            color: var(--ant-primary-color);
          }
        }

        .elStarFilled1 {
          cursor: pointer;
          color: red;
        }
      }
    }

    .doc-list {
      margin-bottom: 16px;
      width: 240px;
      min-height: 240px;
      margin-right: 16px;
      border: 1px solid #eaeaf1;
      padding-bottom: 16px;

      h3 {
        height: 22px;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        // font-weight: bold;
        color: var(--ant-primary-color);
        line-height: 22px;
        display: inline-block;
        cursor: pointer;
      }

      .desc {
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #646566;
        line-height: 22px;
      }

      .author {
        padding-left: 16px;

        span {
          height: 22px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: #969799;
          line-height: 22px;
        }

        span.time {
          margin-left: 13px;
        }
      }

      .action-wrap {
        display: flex;
        margin: 5px 0 20px 0;

        .act-list {
          display: flex;
          align-items: center;
          border-right: 1px solid #dcdee0;
          margin-right: 10px;
          height: 16px;

          &:last-child {
            border: none;
          }

          span {
            margin: 0 6px;
          }
        }

        .elChatDotSquare,
        .elConnection,
        .elEdit,
        .elDelete,
        .elStarFilled,
        .elShare {
          cursor: pointer;

          &:hover {
            color: var(--ant-primary-color);
          }
        }

        .elStarFilled1 {
          cursor: pointer;
          color: red;
        }
      }

      .highlightName {
        :deep(em) {
          color: red !important;
        }
      }

      .descColor {
        :deep(em) {
          color: red !important;
        }
      }
    }

    .ask-list {
      .author {
        display: flex;
        align-items: center;
        height: 24px;
        margin-bottom: 8px;

        .elAvatar {
          min-height: 24px;
          min-width: 24px;
        }

        .name {
          margin-left: 8px;
          font-weight: 500;
          color: #323233;
        }
      }

      .desc {
        height: 22px;
        overflow: hidden;

        span {
          height: 22px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: var(--ant-primary-color);
          line-height: 22px;
          margin-right: 11px;
        }
      }

      .action-wrap {
        position: relative;

        .right-action {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;

          .act-list {
            color: var(--ant-primary-color);

            .delete-wrap {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }

  .img-wrap {
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    place-content: flex-start;

    .img-list {
      margin: 16px 16px 0 16px;
      border-radius: 4px;
      overflow: hidden;
      background: #ccc;
    }

    &-title {
      // display: flex;
      margin-left: 16px;

      &-right {
        display: flex;
        // margin-left: 20px;
        line-height: 22px;

        .act-list {
          display: flex;
          align-items: center;
          margin-left: 10px;

          // &:last-child {
          //   border: none;
          // }
          span {
            margin: 0 5px;
          }
        }

        .elChatDotSquare,
        .elConnection,
        .elEdit,
        .elDelete,
        .elStarFilled,
        .elShare {
          cursor: pointer;

          &:hover {
            color: var(--ant-primary-color);
          }
        }

        .elStarFilled1 {
          cursor: pointer;
          color: red;
        }
      }
    }

    .doc-list {
      margin-bottom: 16px;
      margin-right: 10px;
      width: 230px;
      height: 245px;
      border-radius: 6px;
      border: 1px solid #eaeaf1;

      h3 {
        height: 22px;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 400;
        color: var(--ant-primary-color);
        line-height: 22px;
        display: inline-block;
        cursor: pointer;
      }

      .desc {
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #646566;
        line-height: 22px;
      }

      .author {
        // margin-top: 8px;
        margin-left: 16px;

        span {
          height: 22px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: #969799;
          line-height: 22px;
        }

        span.time {
          margin-left: 13px;
        }
      }

      // &:last-child {
      //   border: none;
      // }
      .action-wrap {
        display: flex;
        margin: 5px 0 20px 0;

        .act-list {
          display: flex;
          align-items: center;
          border-right: 1px solid #dcdee0;
          margin-right: 10px;
          height: 16px;

          &:last-child {
            border: none;
          }

          span {
            margin: 0 6px;
          }
        }

        .elChatDotSquare,
        .elConnection,
        .elEdit,
        .elDelete,
        .elStarFilled,
        .elShare {
          cursor: pointer;

          &:hover {
            color: var(--ant-primary-color);
          }
        }

        .elStarFilled1 {
          cursor: pointer;
          color: red;
        }
      }

      .highlightName {
        :deep(em) {
          color: red !important;
        }
      }

      .descColor {
        :deep(em) {
          color: red !important;
        }
      }
    }

    .ask-list {
      .author {
        display: flex;
        align-items: center;
        height: 24px;
        margin-bottom: 8px;

        .elAvatar {
          min-height: 24px;
          min-width: 24px;
        }

        .name {
          margin-left: 8px;
          font-weight: 500;
          color: #323233;
        }
      }

      .desc {
        height: 22px;
        overflow: hidden;

        span {
          height: 22px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: var(--ant-primary-color);
          line-height: 22px;
          margin-right: 11px;
        }
      }

      .action-wrap {
        position: relative;

        .right-action {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;

          .act-list {
            color: var(--ant-primary-color);

            .delete-wrap {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }

  .quest-wrap {
    overflow-y: auto;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;

    .doc-list {
      margin-bottom: 20px;

      .ask-list-top {
        display: flex;
        justify-content: space-between;
        line-height: 32px;

        .ask-list-left {
          // line-height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;

          .elAvatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid #d3d2d9;
          }

          .name {
            margin: 0 12px 0 8px;
          }

          .time {
            margin-right: 8px;
          }

          .exigency {
            width: 36px;
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            color: #f56c6c;
            border-radius: 2px 2px 2px 2px;
            border: 1px solid #f56c6c;
          }

          .importance {
            width: 36px;
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            color: #e6a23c;
            border-radius: 2px 2px 2px 2px;
            border: 1px solid #e6a23c;
          }

          .normal {
            width: 36px;
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            color: #909399;
            border-radius: 2px 2px 2px 2px;
            border: 1px solid #909399;
          }
        }

        .ask-list-right {
          display: flex;
          align-items: center;

          .imgColor {
            width: 14px;
            height: 14px;
            margin-right: 2px;
            color: var(--ant-primary-color);
          }

          .author-myAnser-text {
            font-weight: 400;
            font-size: 16px;
            color: var(--ant-primary-color);
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

        .ask-list-title-answerNum {
          font-size: 14px;
          height: 24px;
          padding: 0 10px;
          background-color: #e5f0db;
          font-weight: 500;
          margin-left: 10px;
          color: var(--ant-primary-color);
        }

        .ask-list-title-answerUp {
          font-size: 14px;
          font-weight: 500;
          margin-left: 10px;
          color: var(--ant-primary-color);
        }
      }

      .author {
        border-bottom: 2px solid #efefef;

        .isRelated {
          height: 22px;
          font-size: 12px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          line-height: 22px;
        }

        span.time {
          margin-left: 13px;
          margin-right: 13px;
        }

        &-myAnser {
          margin-left: 13px;
          display: flex;
          align-items: center;

          &-text {
            color: var(--ant-primary-color);
            cursor: pointer;
          }
        }

        &-elEdit {
          margin: 0 13px;
          display: flex;
          align-items: center;

          &-text {
            color: var(--ant-primary-color);
            cursor: pointer;
          }
        }

        &-elDelete {
          display: flex;
          align-items: center;

          &-text {
            color: var(--ant-primary-color);
            cursor: pointer;
          }
        }

        .imgColor {
          color: var(--ant-primary-color);
        }

        .elStarFilled {
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-left: 10px;

          &:hover {
            color: var(--ant-primary-color);
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
      }

      .bottomAnswer {
        margin-top: 8px;
        // border-bottom: 1px dashed #c3c3c3;
        padding-bottom: 10px;
        margin-left: 10px;
        position: relative;

        .titleTop {
          display: flex;
          align-items: center;

          .elAvatar {
            margin-right: 8px;
          }
        }

        span.time {
          margin-left: 13px;
          margin-right: 13px;
        }

        .contents {
          margin: 5px 20px 0 30px;
          height: 24px;
          line-height: 24px;

          span {
            height: 22px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 500;
            line-height: 22px;
          }

          .content-answer {
            position: absolute;
            left: -10px;
            display: inline-block;
            text-align: center;
            width: 26px;
            height: 22px;
            background: #e6effb;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: var(--ant-primary-color);
            // line-height: 26px;
            border-radius: 8px 8px 0 8px;
            // padding: 3px;
            margin-right: 10px;
          }
        }
      }

      .up {
        // color: var(--ant-primary-color);
        position: relative;
        top: 10px;
        // left: 50%;
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
        margin: 15px 0 0 30px;
        padding-bottom: 15px;
        border-bottom: 2px dotted #c3c3c3;

        .elStarFilled {
          cursor: pointer;
          display: flex;
          align-items: center;

          &:hover {
            color: var(--ant-primary-color);
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
          height: 14px;
          margin-right: 17px;
        }
      }

      .commont {
        &-btn {
          margin-top: 5px;
        }
      }

      h3 {
        height: 22px;
        font-size: 16px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: bold;
        color: #323233;
        line-height: 22px;
        margin-bottom: 10px;
        display: inline-block;
        cursor: pointer;
      }

      h3:hover {
        color: var(--ant-primary-color);
      }

      .desc {
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        color: #646566;
        line-height: 22px;
      }

      .action-wrap {
        display: flex;
        margin: 21px 0 20px 0;

        .act-list {
          display: flex;
          align-items: center;
          border-right: 1px solid #dcdee0;
          margin-right: 10px;
          height: 16px;

          &:last-child {
            border: none;
          }

          span {
            margin: 0 6px;
          }
        }

        .elChatDotSquare,
        .elConnection,
        .elEdit,
        .elDelete,
        .elStarFilled,
        .elShare {
          cursor: pointer;
          display: flex;
          align-items: center;

          &:hover {
            color: var(--ant-primary-color);
          }
        }

        .elStarFilled1 {
          cursor: pointer;
          color: red;

          &:hover {
            color: var(--ant-primary-color);
          }
        }
      }
    }

    .ask-list {
      .author {
        // height: 24px;
        padding-bottom: 15px;

        .elAvatar {
          min-height: 24px;
          min-width: 24px;
        }

        .name {
          margin-left: 30px;
          font-weight: 500;
          color: #323233;
        }
      }

      .desc {
        height: 22px;
        overflow: hidden;

        span {
          height: 22px;
          font-size: 14px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: var(--ant-primary-color);
          line-height: 22px;
          margin-right: 11px;
        }
      }

      .action-wrap {
        position: relative;

        .right-action {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;

          .act-list {
            color: var(--ant-primary-color);

            .delete-wrap {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }

  .fontHide {
    width: 200px;
    color: var(--ant-primary-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>