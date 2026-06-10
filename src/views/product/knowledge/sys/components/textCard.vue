<script setup lang="ts">
import {
  doCollectFile,
  getPdfPreviewPath,
  modifyInit,
  removeFile,
  saveLookFileLog,
  updateKldCounting,
} from '@/api/knowledge';
import comment from '@/components/Comment/index.vue';
import { useUserStore } from '@/store/modules/user';
import { getTimes } from '@/utils/dateUtils';
import {
  EyeOutlined,
  MessageOutlined,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  DownloadOutlined,
  InfoCircleFilled,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  AuditOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import shareCell from '@/views/knowledge/components/share.vue';
import HttpRequestConfig from '@/httpRequest/config';
import { downloadFileFromStream } from '@/utils/file';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { Knowledgebase, getKnowledgebaseColor, getKnowledgebaseLabel } from '@/enums/Knowledgebase';
const router = useRouter();
import priviewFile from '@/components/PriviewFileInfo/index.vue';

const props = defineProps({
  textData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  hideSubmitAudit: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['handleFetchList', 'handleEdit', 'handleSubmitAudit']);

const commentDialogVisible = ref(false);
const shareDialogVisible = ref(false);
const previewVisible = ref(false);
const filePath = ref('');
const fileType = ref('');
const commentDetail = ref({});
const docId = ref('');
const confidentialLevel = computed(() => {
  if (props.textData.confidential_level === '0') return '公开';
  if (props.textData.confidential_level === '1') return '内部';
  if (props.textData.confidential_level === '2') return '秘密';
  if (props.textData.confidential_level === '3') return '机密';
  return '公开';
});

const viewPdfFun = async () => {
  const params = {
    name: useUserStore().getUser.userName, //userName
    userId: useUserStore().getUser.id,
    kldId: props.textData.id, //fileId
    type: '1', //1,浏览  2，下载
  };
  await saveLookFileLog(params);

  viewPdf(props.textData);
};

function isExcelFileType(fileType?: string) {
  const type = String(fileType ?? '')
    .toLowerCase()
    .replace(/^\./, '');
  return type === 'xlsx' || type === 'xls' || type === 'excel';
}

// 查看pdf
const viewPdf = async (item: any) => {
  try {
    updateKldCounting({ kldFileId: item.id, countingType: 1 });
    if (isExcelFileType(item.fileType)) {
      const ext = item.fileType?.startsWith('.') ? item.fileType : `.${item.fileType}`;
      fileType.value = ext;
      filePath.value = item.fileUrl;
      previewVisible.value = true;
      return;
    }
    const res = await getPdfPreviewPath({ id: item.fileId });
    router.push({ path: '/knowledge/pdfView', query: { docId: res.data.fileUrl } });
  } catch (error) {
    console.log('error:', error);
  }
};

const handleClosePreviewModal = () => {
  previewVisible.value = false;
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

//下载
const download = async () => {
  // window.location.href = import.meta.env.VITE_BASE_HTMLPREVIEW_URL + '/base-service/fileManagerController/download.json?fileId=' + props.textData.fileId;
  const res = await AdminApiSystemUploadFile.downloadEpcFile({ fileId: props.textData.fileId } as any);
  //根据fileID查找文件信息
  const fileInfo = await AdminApiSystemUploadFile.getFileByIds({ fileIds: props.textData.fileId } as any);
  const stream = (res as any)?.data !== undefined ? (res as any).data : res;
  downloadFileFromStream(stream, fileInfo.data[0].oldFileName || '知识文件.doc');
};

const deleteData = async () => {
  try {
    const res = await removeFile({ kldFileId: props.textData.id });
    if (res.data.code === '0') {
      message.success('删除成功');
      emits('handleFetchList');
    }
  } catch (error) {
    console.log('error:', error);
  }
};

const handleEditCard = () => {
  emits('handleEdit');
};

const handleSubmitAudit = () => {
  if (!canSubmitAudit.value) return;
  emits('handleSubmitAudit');
};

const canSubmitAudit = computed(() => {
  const status = String(props.textData.approveStatus ?? '');
  const isAllowedStatus = status === Knowledgebase.DESIGNING || status === Knowledgebase.COMPILING;
  const isOwner = String(props.textData.userId ?? '') === String(useUserStore().getUser.id ?? '');
  return isAllowedStatus && isOwner;
});

const approveStatus = computed(() => String(props.textData.approveStatus ?? ''));

function DynamicIcon(item: { fileType?: string }) {
  const fileType = String(item?.fileType ?? '').toLowerCase();
  if (fileType === 'pdf') return 'icon-pdf';
  if (fileType === 'docx' || fileType === 'doc') return 'icon-docx';
  if (fileType === 'xlsx' || fileType === 'xls') return 'icon-xlsx';
  if (fileType === 'pptx' || fileType === 'ppt') return 'icon-pptx';
  if (['mp4', 'wmv', 'avi', 'flv', 'mkv'].includes(fileType)) return 'icon-shipin2';
  if (['rar', 'zip', '7z', 'tar', 'gz'].includes(fileType)) return 'icon-zip-1';
  return 'icon-wushuju';
}
</script>

<template>
  <div class="doc-list">
    <div class="doc-list-top">
      <div class="header">
        <EpcIcon :type="DynamicIcon(textData)" class="header__icon" />
      </div>
      <div class="doc-list-content">
        <div v-if="textData.highlightFields?.fileName && textData.highlightFields?.fileName.length > 0" class="box-item">
          <div
            v-html="textData.highlightFields?.fileName[0] + '.' + textData.fileType"
            class="highlightName"
            @click="viewPdfFun"></div>
        </div>
        <div v-else class="box-item">
          <div class="highlightName" @click="viewPdfFun">
            {{ textData.fileName }}.{{ textData.fileType }}【{{ textData.version || '' }}】
            <span v-if="textData.releaseStatus === 0">【已发布】</span>
            <span v-else-if="textData.releaseStatus === 1">【未发布】</span>
          </div>
        </div>
        <div style="height: 26px; margin-top: 4px">
          <a-breadcrumb separator="|">
            <a-breadcrumb-item>{{ textData.userName }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ getTimes(Date.parse(textData.addTime)) || '' }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ confidentialLevel }}</a-breadcrumb-item>
            <a-breadcrumb-item>
              <span :style="{ color: getKnowledgebaseColor(approveStatus) }">
                {{ getKnowledgebaseLabel(approveStatus) }}
              </span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
    </div>
    <div
      v-if="textData.highlightFields?.summary && textData.highlightFields?.summary.length > 0"
      v-html="textData.highlightFields?.summary[0]"
      class="desc descColor"></div>
    <div v-else class="desc">{{ textData.summary }}</div>
    <div class="doc-list-bottom">
      <div class="action-wrap">
        <a-tooltip :mouse-enter-delay="0.5" title="查看次数" placement="topLeft">
          <div class="act-list">
            <eye-outlined /><span>{{ JSON.parse(textData.counting).previewed }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="评论" placement="topLeft" v-if="!hideSubmitAudit">
          <div class="act-list elChatDotSquare" @click="commentFun(textData)">
            <message-outlined /><span>{{ JSON.parse(textData.counting).commented }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="收藏" placement="topLeft" v-if="!hideSubmitAudit">
          <div v-if="!textData.collectedLight" class="act-list elStarFilled" @click="followFun">
            <star-outlined /><span>{{ JSON.parse(textData.counting).collectd }}</span>
          </div>
          <div v-else class="act-list elStarFilled1" @click="followFun">
            <star-filled /><span>{{ JSON.parse(textData.counting).collectd }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="分享" placement="topLeft" v-if="!hideSubmitAudit">
          <div class="act-list elShare" @click="shareFun">
            <share-alt-outlined /><span>{{ JSON.parse(textData.counting).shared }}</span>
          </div>
        </a-tooltip>
        <a-tooltip :mouse-enter-delay="0.5" title="下载" placement="topLeft" v-if="textData.allowDownload === 0">
          <div class="act-list elStarFilled" @click="download">
            <DownloadOutlined />
          </div>
        </a-tooltip>
      </div>
      <div class="flex items-center" v-if="!hideSubmitAudit">
        <span
          class="ml-[8px] flex items-center gap-[2px] text-[12px]"
          :class="canSubmitAudit ? 'text-primary cursor-pointer' : 'submit-audit-disabled'"
          @click="handleSubmitAudit">
          <audit-outlined :class="{ imgColor: canSubmitAudit }" />
          <span class="author-elEdit-text">提交审核</span>
        </span>
        <span class="ml-[8px] flex items-center gap-[2px] text-[12px] text-primary cursor-pointer" @click="handleEditCard">
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
    <comment
      :comment-dialog-visible="commentDialogVisible"
      :common-deail="commentDetail"
      @close-comment-dialog-notification="closeCommentDialogNotification"
      @get-flag-list="getList" />

    <shareCell
      :share-dialog-visible="shareDialogVisible"
      :doc-id="docId"
      :quest-flag="1"
      :tab-flag="1"
      @close-share="closeShare" />

    <priviewFile
      :modal-visible="previewVisible"
      :pdf-url="filePath"
      :file-type="fileType"
      @onClose="handleClosePreviewModal" />
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
    color: var(--ant-primary-color);
  }

  .submit-audit-btn {
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
    line-height: 22px;
  }

  .submit-audit-disabled {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }

  .doc-list-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 16px;
  }

  .doc-list-content {
    flex: 1;
    min-width: 0;
  }

  .header {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: #f5f7fa;
    border: 1px solid #ebeef2;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .header__icon {
    font-size: 28px;
    line-height: 1;

    :deep(svg) {
      fill: unset;
    }
  }

  &:hover {
    .highlightName {
      color: var(--ant-primary-color);
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
