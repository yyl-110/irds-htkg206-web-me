<script setup lang="ts">
import { doCollectFile, modifyInit, saveLookFileLog, updateKldCounting } from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
import { getTimes } from "@/utils/dateUtils";
import {
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  InfoCircleFilled,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import shareCell from "./share.vue";
import VideoImg from "./videoImg.vue";
import draggableModal from "@/components/DraggableModal/index.vue";

const props = defineProps({
  imgData: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["handleFetchList"]);

const shareDialogVisible = ref(false);
const docId = ref("");
const showDetail = ref(false);
const formInline = ref<Record<string, any>>({});
const imgHide = ref(false);
const fileUrlPlay = ref<string>();

const viewPdfFun = () => {
  const item = props.imgData.content;
  const logParams = {
    name: useUserStore().getUser.userName,
    userId: useUserStore().getUser.id,
    kldId: item.kldFileId,
    type: "1",
  };
  saveLookFileLog(logParams);
  fileUrlPlay.value = item.fileUrl;
  imgHide.value = true;
  updateKldCounting({ kldFileId: item.kldFileId, countingType: 1 });
};

const getImgHide = (val: boolean) => {
  imgHide.value = val;
};

const followFun = () => {
  const params = {
    kldId: props.imgData.content.id,
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
  docId.value = props.imgData.content.id;
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
  modifyInit({ kldFileId: props.imgData.content.id }).then((res) => {
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
    <img
      class="img-list"
      style="width: 199px; height: 142px"
      :src="imgData.content.fileUrl"
      alt=""
      @click="viewPdfFun"
    />
    <div class="img-wrap-title">
      <a-tooltip
        :mouse-enter-delay="0.5"
        :title="imgData.content.fileName + '.' + imgData.content.fileType"
        placement="top"
      >
        <h3 class="fontHide" @click="viewPdfFun">
          {{ imgData.content.fileName }}.{{ imgData.content.fileType }}
        </h3>
      </a-tooltip>
    </div>
    <div class="img-wrap-title-right">
      <span>{{ JSON.parse(imgData.content.counting).previewed }}次预览</span>
      <a-tooltip :mouse-enter-delay="0.5" title="收藏" placement="top-start">
        <div
          v-if="!imgData.content.collectedLight"
          class="act-list elStarFilled ml-auto"
          @click="followFun"
        >
          <star-outlined /><span>{{ JSON.parse(imgData.content.counting).collectd }}</span>
        </div>
        <div v-else class="act-list elStarFilled1 ml-auto" @click="followFun">
          <star-filled /><span>{{ JSON.parse(imgData.content.counting).collectd }}</span>
        </div>
      </a-tooltip>
      <a-tooltip :mouse-enter-delay="0.5" title="分享" placement="top-start">
        <div class="act-list elShare" @click="shareFun">
          <share-alt-outlined /><span>{{ JSON.parse(imgData.content.counting).shared }}</span>
        </div>
      </a-tooltip>
      <a-tooltip :mouse-enter-delay="0.5" title="详情" placement="top-start">
        <div class="act-list elStarFilled" @click="getDes">
          <info-circle-filled />
        </div>
      </a-tooltip>
    </div>
    <div class="author" style="display: flex">
      <span class="name">{{ imgData.content.userName }}</span>
      <span class="time">{{ getTimes(Date.parse(imgData.content.addTime)) || '' }}</span>
    </div>

    <shareCell
      :share-dialog-visible="shareDialogVisible"
      :doc-id="docId"
      :quest-flag="1"
      :tab-flag="1"
      @close-share="closeShare"
    />

    <draggable-modal :closable="false" v-model:visible="showDetail" title="查看详情" width="40%" centered>
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
    </draggable-modal>

    <VideoImg
      :video-hide="imgHide"
      :file-url-play="fileUrlPlay"
      dialog-type="3"
      title-type="图片预览"
      @get-video-hide="getImgHide"
    />
  </div>
</template>

<style scoped lang="less">
.fontHide {
  width: 285px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.img-wrap-title-right {
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

  &:hover {
    border-color: var(--ant-primary-color);

    h3 {
      color: var(--ant-primary-color);
    }
  }

  .img-list {
    margin: 16px 16px 0 16px;
    border-radius: 5px;
    overflow: hidden;
    background: #ccc;
    cursor: pointer;
  }

  .img-wrap-title {
    padding: 0;
  }

  .img-wrap-title-right {
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
