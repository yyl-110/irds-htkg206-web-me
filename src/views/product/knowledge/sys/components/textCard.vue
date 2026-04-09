<script setup lang="ts">
import { doCollectFile, getPdfPreviewPath, modifyInit, removeFile, saveLookFileLog } from '@/api/knowledge';
import comment from '@/components/Comment/index.vue';
import { useUserStore } from '@/store/modules/user';
import { getTimes } from '@/utils/dateUtils';
import { EyeOutlined, MessageOutlined, StarOutlined, StarFilled, ShareAltOutlined, DownloadOutlined, InfoCircleFilled, UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import shareCell from '@/views/knowledge/components/share.vue';

const router = useRouter();

const props = defineProps({
  textData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emits = defineEmits(['handleFetchList', 'handleEdit']);

const commentDialogVisible = ref(false);
const shareDialogVisible = ref(false);
const commentDetail = ref({});
const docId = ref('');
const formInline = ref({});

const viewPdfFun = async () => {
  const params = {
    name: useUserStore().getUser.userName, //userName
    userId: useUserStore().getUser.id,
    kldId: props.textData.id, //fileId
    type: '1', //1,浏览  2，下载
  };
  await saveLookFileLog(params);

  viewPdf(props.textData.fileId);
};

// 查看pdf
const viewPdf = async (id: string) => {
  try {
    const res = await getPdfPreviewPath({ id });
    console.log('res:', res);
    const filePath = res.data.fileUrl;
    router.push({ path: '/knowledge/pdfView', query: { docId: filePath } });
    // if (res.data.fileUrl) {
    //   const filePath = res.data.fileUrl;
    //   router.push({ path: '/knowledge/pdfView', query: { docId: filePath } });
    // } else {
    //   message.error('文件不存在');
    //   getList();
    // }
  } catch (error) {
    console.log('error:', error);
  }
};

const commentFun = (answer: any) => {
  commentDetail.value = answer;
  // numberFlag.value = 2;
  commentDialogVisible.value = true;
};
const getList = () => {
  emits('handleFetchList');
};

// 关闭评论弹框
const closeCommentDialogNotification = () => {
  commentDialogVisible.value = false;
  emits('handleFetchList');
};

//关注
const followFun = () => {
  const params = {
    kldId: props.textData.id,
    userId: useUserStore().getUser.id,
  };
  doCollectFile(params).then(res => {
    if (res && res.data.code === '0') {
      message.success(res.data.msg);
      setTimeout(() => {
        emits('handleFetchList');
      }, 1000);
    }
  });
};
//分享
const shareFun = () => {
  docId.value = props.textData.id;
  shareDialogVisible.value = true;
};
//关闭分享
const closeShare = () => {
  shareDialogVisible.value = false;
  setTimeout(() => {
    emits('handleFetchList');
  }, 1000);
};

const download = () => { };

const deleteData = async () => {
  try {
    const res = await removeFile({ kldFileId: props.textData.id })
    if (res.data.code === '0') {
      message.success('删除成功')
      emits('handleFetchList');
    }
  } catch (error) {
    console.log('error:', error)
  }
}

const handleEditCard = () => {
  emits('handleEdit');
}
</script>

<template>
  <div class="doc-list">
    <div style="display: flex; margin-top: 16px">
      <div class="header">
        <span>{{ textData.fileType[0] }}</span>
      </div>
      <div style="width: 85%">
        <div v-if="textData.highlightFields?.fileName && textData.highlightFields?.fileName.length > 0"
          class="box-item">
          <div v-html="textData.highlightFields?.fileName[0] + '.' + textData.fileType" class="highlightName"
            @click="viewPdfFun"></div>
        </div>
        <div v-else class="box-item">
          <div class="highlightName" @click="viewPdfFun">{{ textData.fileName }}.{{ textData.fileType
            }}【{{ textData.version || '' }}】 <span v-if="textData.releaseStatus === 0">【已发布】</span>
            <span v-else-if="textData.releaseStatus === 1">【未发布】</span>
          </div>
        </div>
        <div style="height: 26px; margin-top: 4px">
          <a-breadcrumb separator="|">
            <a-breadcrumb-item>{{ textData.userName }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ getTimes(Date.parse(textData.addTime)) || '' }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
    </div>
    <div v-if="textData.highlightFields?.summary && textData.highlightFields?.summary.length > 0"
      v-html="textData.highlightFields?.summary[0]" class="desc descColor"></div>
    <div v-else class="desc">{{ textData.summary }}</div>
    <div class="doc-list-bottom">
      <div class="action-wrap">
        <a-tooltip :mouse-enter-delay="0.5" title="查看次数" placement="topLeft">
          <div class="act-list">
            <eye-outlined /><span>{{ JSON.parse(textData.counting).previewed }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="评论" placement="topLeft">
          <div class="act-list elChatDotSquare" @click="commentFun(textData)">
            <message-outlined /><span>{{ JSON.parse(textData.counting).commented }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="收藏" placement="topLeft">
          <div v-if="!textData.collectedLight" class="act-list elStarFilled" @click="followFun">
            <star-outlined /><span>{{ JSON.parse(textData.counting).collectd }}</span>
          </div>
          <div v-else class="act-list elStarFilled1" @click="followFun">
            <star-filled /><span>{{ JSON.parse(textData.counting).collectd }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="分享" placement="topLeft">
          <div class="act-list elShare" @click="shareFun">
            <share-alt-outlined /><span>{{ JSON.parse(textData.counting).shared }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="下载" placement="topLeft">
          <div class="act-list elStarFilled" @click="download">
            <DownloadOutlined />
            <span>
              {{ textData.downloaded }}
            </span>
          </div>
        </a-tooltip>
      </div>
      <div class="flex items-center">
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
    </div>
    <comment :comment-dialog-visible="commentDialogVisible" :common-deail="commentDetail"
      @close-comment-dialog-notification="closeCommentDialogNotification" @get-flag-list="getList" />

    <shareCell :share-dialog-visible="shareDialogVisible" :doc-id="docId" :quest-flag="1" :tab-flag="1"
      @close-share="closeShare" />
  </div>
</template>

<style lang="less" scoped>
.doc-list {
  margin-bottom: 1%;
  border-bottom: 1px solid #eaeaf1;
  padding: 0 8px;
  width: 100%;
  max-height: 180px;

  .imgColor {
    color: #155bd4;
  }

  .header {
    min-width: 44px;
    height: 44px;
    background: #fbd5d5;
    border-radius: 4px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      text-align: center;
      font-weight: bold;
      font-size: 24px;
      color: #d71515;
      line-height: 24px;
      font-style: normal;
      text-transform: none;
    }
  }

  &:hover {
    .highlightName {
      color: #155bd4;
    }
  }

  .desc {
    max-height: 42px;
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #6a696e;
    line-height: 22px;
    font-style: normal;
    text-transform: none;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 定义文本的行数 */
  }

  .author {
    // line-height: 44px;
    margin-top: 10px;
    display: flex;

    .elAvatar {
      // font-size: 18px;
      height: 24px;
      width: 24px;
      margin-right: 5px;
    }

    span {
      height: 22px;
      font-size: 14px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 0.8);
      padding-top: 0.125rem;
    }

    span.time {
      margin-left: 13px;
    }
  }

  .doc-list-bottom {
    display: flex;
    justify-content: space-between;

    .action-wrap {
      display: flex;
      height: 44px;
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
          margin: 0 4px;
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
          color: #155bd4;
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
  }

  .highlightName {
    height: 26px !important;
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #000;
    line-height: 26px;
    width: calc(100% - 10px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    :deep(em) {
      color: red !important;
      height: 26px !important;
      margin-top: -10px !important;
    }
  }

  .descColor {
    :deep(em) {
      color: red !important;
    }
  }
}
</style>
