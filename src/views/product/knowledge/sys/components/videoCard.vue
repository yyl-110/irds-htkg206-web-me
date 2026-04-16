<script setup lang="ts">
import { doCollectFile, modifyInit, removeFile, saveLookFileLog, updateKldCounting } from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
import { getTimes } from "@/utils/dateUtils";
import {
  CaretRightFilled,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import shareCell from "@/views/knowledge/components/share.vue";
import Video from "@/views/knowledge/components/videoImg.vue";

const props = defineProps({
  videoData: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["handleFetchList", 'handleEdit']);

const shareDialogVisible = ref(false);
const docId = ref("");
const showDetail = ref(false);
const formInline = ref<Record<string, any>>({});
const videoHide = ref(false);
const fileUrlPlay = ref<string>();

const viewPdfFun = () => {
  const item = props.videoData;
  const logParams = {
    name: useUserStore().getUser.userName,
    userId: useUserStore().getUser.id,
    kldId: item.id,
    type: "1",
  };
  saveLookFileLog(logParams);
  fileUrlPlay.value = item.fileUrl;
  videoHide.value = true;
  updateKldCounting({ kldFileId: item.id, countingType: 1 });
};

const getVideoHide = (val: boolean) => {
  videoHide.value = val;
};

const deleteData = async () => {
  try {
    const res = await removeFile({ kldFileId: props.videoData.id })
    if (res.data.code === '0') {
      message.success('删除成功')
      emits('handleFetchList');
    }
  } catch (error) {
    console.log('error:', error)
  }
}

const confidentialLevel = computed(() => {
  if (props.videoData.confidential_level === '0')
    return '公开';
  if (props.videoData.confidential_level === '1')
    return '内部';
  if (props.videoData.confidential_level === '2')
    return '秘密';
  if (props.videoData.confidential_level === '3')
    return '机密';
  return '公开';
})

const handleEditCard = () => {
  emits('handleEdit');
}
</script>

<template>
  <div class="doc-list">
    <div class="playBtn" @click="viewPdfFun">
      <caret-right-filled style="font-size: 40px; color: #fff; margin: 55px 80px; cursor: pointer" />
    </div>
    <video class="video-list" :src="videoData.fileUrl" width="199" height="142"></video>
    <div class="video-wrap-title">
      <a-tooltip :title="videoData.fileName + '.' + videoData.fileType" placement="top">
        <h3 class="fontHide w-full mt-[6px] mb-0" @click="viewPdfFun">
          {{ videoData.fileName }}.{{ videoData.fileType }}
        </h3>
      </a-tooltip>
    </div>
    <div class="video-wrap-title-right justify-between">
      <span>{{ JSON.parse(videoData.counting).previewed }}次播放</span>
      <span v-if="videoData.releaseStatus === 0">【已发布】</span>
      <span v-else-if="videoData.releaseStatus === 1">【未发布】</span>
    </div>
    <div class="author pr-[16px]" style="display: flex">
      <span class="name">{{ videoData.userName }}</span>
      <span class="time">{{ getTimes(Date.parse(videoData.addTime)) || '' }}</span>
      <span class="level ml-auto">{{ confidentialLevel }}</span>
      <span></span>
    </div>

    <div class="flex items-center px-[16px] justify-end mt-[6px]">
      <span class="flex items-center gap-[2px] text-[12px] text-primary cursor-pointer" @click="handleEditCard">
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
}

.doc-list {
  // margin-bottom: 16px;
  width: 230px;
  height: 270px;
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
    // color: var(--ant-primary-color);
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
