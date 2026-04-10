<script setup lang="ts">
import { doCollectFile, getPdfPreviewPath, modifyInit, saveLookFileLog } from '@/api/knowledge';
import comment from '@/components/Comment/index.vue';
import { useUserStore } from '@/store/modules/user';
import { getTimes } from '@/utils/dateUtils';
import { EyeOutlined, MessageOutlined, StarOutlined, StarFilled, ShareAltOutlined, DownloadOutlined, InfoCircleFilled, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import shareCell from './share.vue';
import draggableModal from '@/components/DraggableModal/index.vue';

const router = useRouter();

const props = defineProps({
  textData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emits = defineEmits(['handleFetchList']);

const commentDialogVisible = ref(false);
const shareDialogVisible = ref(false);
const commentDetail = ref({});
const docId = ref('');
const showDetail = ref(false);
const formInline = ref({});

const confidentialLevel = computed(() => {
  if (props.textData.content.confidential_level === 0)
    return '公开';
  if (props.textData.content.confidential_level === 1)
    return '内部';
  if (props.textData.content.confidential_level === 2)
    return '秘密';
  if (props.textData.content.confidential_level === 3)
    return '机密';
  return '公开';
})

const viewPdfFun = async () => {
  const params = {
    name: useUserStore().getUser.userName, //userName
    userId: useUserStore().getUser.id,
    kldId: props.textData.content.id, //fileId
    type: '1', //1,浏览  2，下载
  };
  await saveLookFileLog(params);

  viewPdf(props.textData.content.fileId);
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
  commentDetail.value = answer.content;
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
    kldId: props.textData.content.id,
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
  docId.value = props.textData.content.id;
  shareDialogVisible.value = true;
};
//关闭分享
const closeShare = () => {
  shareDialogVisible.value = false;
  setTimeout(() => {
    emits('handleFetchList');
  }, 1000);
};

const downFun = () => { };

const getDes = () => {
  showDetail.value = true;
  modifyInit({ kldFileId: props.textData.content.id }).then(res => {
    if (res && res.data.code === '0') {
      const names = [res.data.data.ou1Name, res.data.data.ou2Name, res.data.data.ou3Name];
      formInline.value = {
        fileName: res.data.data.fileName,
        keywords: res.data.data.keywords,
        ouName: names.join(','),
        kldTageNames: res.data.data.kldTageNames.replace(/^\[|\]$/g, ''),
      };
      console.log(res.data.data, formInline.value);
    }
  });
};
</script>

<template>
  <div class="doc-list">
    <div style="display: flex; margin-top: 16px">
      <div class="header">
        <span>{{ textData.content.fileType[0] }}</span>
      </div>
      <div style="width: 85%">
        <div v-if="textData.highlightFields?.fileName && textData.highlightFields?.fileName.length > 0"
          class="box-item">
          <div v-html="textData.highlightFields?.fileName[0] + '.' + textData.content.fileType" class="highlightName"
            @click="viewPdfFun"></div>
        </div>
        <div v-else class="box-item">
          <div class="highlightName" @click="viewPdfFun">{{ textData.content.fileName }}.{{ textData.content.fileType }}
          </div>
        </div>
        <div style="height: 26px; margin-top: 4px">
          <a-breadcrumb separator="|">
            <a-breadcrumb-item>{{ textData.content.version || '' }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ getTimes(Date.parse(textData.content.addTime)) || '' }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ confidentialLevel }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
    </div>
    <div v-if="textData.highlightFields?.summary && textData.highlightFields?.summary.length > 0"
      v-html="textData.highlightFields?.summary[0]" class="desc descColor"></div>
    <div v-else class="desc">{{ textData.content.summary }}</div>
    <div class="doc-list-bottom">
      <div class="author">
        <a-avatar class="elAvatar" :size="24">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <span class="name">{{ textData.content.userName }}</span>
      </div>
      <div class="action-wrap">
        <a-tooltip :mouse-enter-delay="0.5" title="查看次数" placement="topLeft">
          <div class="act-list">
            <eye-outlined /><span>{{ JSON.parse(textData.content.counting).previewed }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="评论" placement="topLeft">
          <div class="act-list elChatDotSquare" @click="commentFun(textData)">
            <message-outlined /><span>{{ JSON.parse(textData.content.counting).commented }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="收藏" placement="topLeft">
          <div v-if="!textData.content.collectedLight" class="act-list elStarFilled" @click="followFun">
            <star-outlined /><span>{{ JSON.parse(textData.content.counting).collectd }}</span>
          </div>
          <div v-else class="act-list elStarFilled1" @click="followFun">
            <star-filled /><span>{{ JSON.parse(textData.content.counting).collectd }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="分享" placement="topLeft">
          <div class="act-list elShare" @click="shareFun">
            <share-alt-outlined /><span>{{ JSON.parse(textData.content.counting).shared }}</span>
          </div>
        </a-tooltip>
        <!-- <a-tooltip :mouse-enter-delay="0.5" title="下载" placement="topLeft">
          <div
            v-if="textData.content.allowDownload !== '1'"
            class="act-list elShare"
            @click="downFun"
          >
            <download-outlined /><span>{{
              JSON.parse(textData.content.counting).downloaded
            }}</span>
          </div>
        </a-tooltip> -->
        <a-tooltip :mouse-enter-delay="0.5" title="详情" placement="topLeft">
          <div class="act-list elStarFilled" @click="getDes">
            <info-circle-filled />
          </div>
        </a-tooltip>
      </div>
    </div>
    <comment :comment-dialog-visible="commentDialogVisible" :common-deail="commentDetail"
      @close-comment-dialog-notification="closeCommentDialogNotification" @get-flag-list="getList" />

    <shareCell :share-dialog-visible="shareDialogVisible" :doc-id="docId" :quest-flag="1" :tab-flag="1"
      @close-share="closeShare" />

    <draggable-modal :closable="false" v-model:visible="showDetail" title="查看详情" width="40%" centered>
      <a-form-item label="附件名称：" :label-col="{ style: { width: '80px' } }">
        <a-input v-model:value="formInline.fileName" disabled />
      </a-form-item>
      <a-form-item label="标签属性：" :label-col="{ style: { width: '80px' } }">
        <a-input v-model:value="formInline.kldTageNames" disabled />
      </a-form-item>
      <a-form-item label="OU属性：" :label-col="{ style: { width: '80px' } }" style="display: none">
        <a-input v-model:value="formInline.ouName" disabled />
      </a-form-item>
      <a-form-item label="关键字：" :label-col="{ style: { width: '80px' } }">
        <a-input v-model:value="formInline.keywords" disabled />
      </a-form-item>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="showDetail = false">关闭</a-button>
        </div>
      </template>
    </draggable-modal>
  </div>
</template>

<style lang="less" scoped>
.doc-list {
  margin-bottom: 1%;
  border: 1px solid #eee;
  padding: 0 16px;
  width: 100%;
  max-height: 180px;

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
    border-color: var(--ant-primary-color);

    .highlightName {
      color: var(--ant-primary-color);
    }
  }

  .desc {
    height: 42px;
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

  .doc-list-bottom {
    display: flex;
    justify-content: space-between;

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

    .action-wrap {
      display: flex;
      margin-left: 20px;
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
