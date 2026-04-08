<script setup lang="ts">
import { doCollectFile, modifyInit, removeFile, saveLookFileLog, updateKldCounting } from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
import { getTimes } from "@/utils/dateUtils";
import {
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import VideoImg from "@/views/knowledge/components/videoImg.vue";

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
  const item = props.imgData;
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

const deleteData = async () => {
  try {
    const res = await removeFile({ kldFileId: props.imgData.id })
    if (res.data.code === '0') {
      message.success('删除成功')
      emits('handleFetchList');
    }
  } catch (error) {
    console.log('error:', error)
  }
}
</script>

<template>
  <div class="doc-list">
    <img class="img-list" style="width: 199px; height: 142px" :src="imgData.fileUrl" alt="" @click="viewPdfFun" />
    <div class="img-wrap-title">
      <a-tooltip :mouse-enter-delay="0.5" :title="imgData.fileName + '.' + imgData.fileType" placement="top">
        <h3 class="fontHide w-full mt-[6px] mb-0" @click="viewPdfFun">
          {{ imgData.fileName }}.{{ imgData.fileType }}
        </h3>
      </a-tooltip>
    </div>
    <div class="img-wrap-title-right justify-between">
      <span>{{ JSON.parse(imgData.counting).previewed }}次预览</span>
      <span v-if="imgData.releaseStatus === 0">【已发布】</span>
      <span v-else-if="imgData.releaseStatus === 1">【未发布】</span>
    </div>
    <div class="author" style="display: flex">
      <span class="name">{{ imgData.userName }}</span>
      <span class="time">{{ getTimes(Date.parse(imgData.addTime)) || '' }}</span>
    </div>

    <div class="flex items-center px-[16px] justify-end mt-[6px]">
      <span class="flex items-center gap-[2px] text-[12px] text-primary cursor-pointer">
        <edit-outlined class="imgColor" /><span class="author-elEdit-text">编辑</span>
      </span>
      <span class="ml-[8px]">
        <a-popconfirm ok-text="确定" cancel-text="取消" title="确定要删除吗?" @confirm="deleteData">
          <div class="flex items-center gap-[2px] text-[12px] text-primary cursor-pointer">
            <delete-outlined class="imgColor" />
            <span>删除</span>
          </div>
        </a-popconfirm>
      </span>
    </div>

    <VideoImg :video-hide="imgHide" :file-url-play="fileUrlPlay" dialog-type="3" title-type="图片预览"
      @get-video-hide="getImgHide" />
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
}

.doc-list {
  width: 230px;
  height: 270px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #eaeaf1;

  &:hover {
    border-color: #155bd4;

    h3 {
      color: #155bd4;
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
    color: #155bd4;
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
