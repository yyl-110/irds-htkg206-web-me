<script setup lang="ts">
import { doCollectFile, modifyInit, saveLookFileLog, updateKldCounting } from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
import { getTimes } from "@/utils/dateUtils";
import {
  CaretRightFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  InfoCircleFilled,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import shareCell from "./share.vue";
import Video from "./videoImg.vue";

const props = defineProps({
  videoData: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["handleFetchList"]);

const shareDialogVisible = ref(false);
const docId = ref("");
const showDetail = ref(false);
const formInline = ref<Record<string, any>>({});
const videoHide = ref(false);
const fileUrlPlay = ref<string>();

const confidentialLevel = computed(() => {
  if (props.videoData?.content.confidential_level === 0)
    return '公开';
  if (props.videoData?.content.confidential_level === 1)
    return '内部';
  if (props.videoData?.content.confidential_level === 2)
    return '秘密';
  if (props.videoData?.content.confidential_level === 3)
    return '机密';
  return '公开';
})

const viewPdfFun = () => {
  const item = props.videoData.content;
  const logParams = {
    name: useUserStore().getUser.userName,
    userId: useUserStore().getUser.id,
    kldId: item.kldFileId,
    type: "1",
  };
  saveLookFileLog(logParams);
  fileUrlPlay.value = item.fileUrl;
  videoHide.value = true;
  updateKldCounting({ kldFileId: item.kldFileId, countingType: 1 });
};

const getVideoHide = (val: boolean) => {
  videoHide.value = val;
};

const followFun = () => {
  const params = {
    kldId: props.videoData.content.id,
    userId: useUserStore().getUser.id,
  };
  doCollectFile(params).then((res) => {
    if (res && res.data.code === "0") {
      message.success(res.data.msg);
      setTimeout(() => {
        emits("handleFetchList");
      }, 1000);
    }
  });
};

const shareFun = () => {
  docId.value = props.videoData.content.id;
  shareDialogVisible.value = true;
};

const closeShare = () => {
  shareDialogVisible.value = false;
  setTimeout(() => {
    emits("handleFetchList");
  }, 1000);
};

const getDes = () => {
  showDetail.value = true;
  modifyInit({ kldFileId: props.videoData.content.id }).then((res) => {
    if (res && res.data.code === "0") {
      const names = [
        res.data.data.ou1Name,
        res.data.data.ou2Name,
        res.data.data.ou3Name,
      ];
      formInline.value = {
        fileName: res.data.data.fileName,
        keywords: res.data.data.keywords,
        ouName: names.join(","),
        kldTageNames: res.data.data.kldTageNames.replace(/^\[|\]$/g, ""),
      };
    }
  });
};
</script>

<template>
  <div class="doc-list">
    <div class="playBtn" @click="viewPdfFun">
      <caret-right-filled style="font-size: 40px; color: #fff; margin: 55px 80px; cursor: pointer" />
    </div>
    <video class="video-list" :src="videoData.content.fileUrl" width="199" height="142"></video>
    <div class="video-wrap-title">
      <a-tooltip :title="videoData.content.fileName + '.' + videoData.content.fileType" placement="top">
        <h3 class="fontHide" @click="viewPdfFun">
          {{ videoData.content.fileName }}.{{ videoData.content.fileType }}
        </h3>
      </a-tooltip>
    </div>
    <div class="video-wrap-title-right">
      <span>{{ JSON.parse(videoData.content.counting).previewed }}次播放</span>
      <a-tooltip :mouse-enter-delay="0.5" title="收藏" placement="top-start">
        <div v-if="!videoData.content.collectedLight" class="act-list elStarFilled ml-auto" @click="followFun">
          <star-outlined /><span>{{ JSON.parse(videoData.content.counting).collectd }}</span>
        </div>
        <div v-else class="act-list elStarFilled1 ml-auto" @click="followFun">
          <star-filled /><span>{{ JSON.parse(videoData.content.counting).collectd }}</span>
        </div>
      </a-tooltip>
      <a-tooltip :mouse-enter-delay="0.5" title="分享" placement="top-start">
        <div class="act-list elShare" @click="shareFun">
          <share-alt-outlined /><span>{{ JSON.parse(videoData.content.counting).shared }}</span>
        </div>
      </a-tooltip>
      <a-tooltip :mouse-enter-delay="0.5" title="详情" placement="top-start">
        <div class="act-list elStarFilled" @click="getDes">
          <info-circle-filled />
        </div>
      </a-tooltip>
    </div>
    <div class="author pr-[16px]" style="display: flex">
      <span class="name">{{ videoData.content.userName }}</span>
      <span class="time">{{ getTimes(Date.parse(videoData.content.addTime)) || '' }}</span>
      <span class="level ml-auto">{{ confidentialLevel }}</span>
    </div>

    <shareCell :share-dialog-visible="shareDialogVisible" :doc-id="docId" :quest-flag="1" :tab-flag="1"
      @close-share="closeShare" />

    <a-modal :closable="false" v-model:visible="showDetail" title="查看详情" width="40%" centered>
      <a-form-item label="附件名称：" label-width="100">
        <a-input v-model:value="formInline.fileName" disabled />
      </a-form-item>
      <a-form-item label="标签属性：" label-width="100">
        <a-input v-model:value="formInline.kldTageNames" disabled />
      </a-form-item>
      <a-form-item label="OU属性：" label-width="100" style="display: none;">
        <a-input v-model:value="formInline.ouName" disabled />
      </a-form-item>
      <a-form-item label="关键字：" label-width="100">
        <a-input v-model:value="formInline.keywords" disabled />
      </a-form-item>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="showDetail = false">关闭</a-button>
        </div>
      </template>
    </a-modal>
    <Video :video-hide="videoHide" :file-url-play="fileUrlPlay" dialog-type="2" title-type="视频播放"
      @get-video-hide="getVideoHide" />
  </div>
</template>

<style scoped lang="less">
.video-wrap-title {
  display: flex;
}

.fontHide {
  width: 285px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-wrap-title-right {
  display: flex;
  line-height: 22px;
  padding: 0 16px;

  .act-list {
    display: flex;
    align-items: center;
    margin-left: 10px;

    &:last-child {
      border: none;
    }

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
    line-height: 23px;
    cursor: pointer;

    &:hover {
      color: var(--ant-primary-color);
    }
  }

  .elStarFilled1 {
    line-height: 23px;
    cursor: pointer;
    color: red;
  }
}

.doc-list {
  margin-bottom: 16px;
  width: 230px;
  height: 245px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #eaeaf1;
  position: relative;

  &:hover {
    border-color: var(--ant-primary-color);

    h3 {
      color: var(--ant-primary-color);
    }

    .playBtn {
      display: block;
    }
  }

  .playBtn {
    width: 199px;
    height: 142px;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 16px;
    left: 16px;
    display: none;
    cursor: pointer;
    z-index: 1000;
  }

  .video-list {
    margin: 16px 16px 0 16px;
    border-radius: 5px;
    overflow: hidden;
  }

  .video-wrap-title {
    padding: 0;
  }

  .video-wrap-title-right {
    font-size: 12px;
  }

  h3 {
    height: 22px;
    font-size: 14px;
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 400;
    color: var(--ant-primary-color);
    line-height: 22px;
    display: inline-block;
    cursor: pointer;
    padding-left: 16px;
  }

  .author {
    margin-left: 16px;

    span {
      height: 22px;
      font-size: 12px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #969799;
      line-height: 22px;
    }

    span.time {
      margin-left: 13px;
    }
  }
}
</style>
