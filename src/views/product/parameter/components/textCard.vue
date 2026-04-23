<script setup lang="ts">
import { doCollectFile, getPdfPreviewPath, modifyInit, removeFile, saveLookFileLog, updateKldCounting } from '@/api/knowledge';
import { useUserStore } from '@/store/modules/user';
import { getTimes } from '@/utils/dateUtils';
import { EyeOutlined, MessageOutlined, StarOutlined, StarFilled, ShareAltOutlined, DownloadOutlined, InfoCircleFilled, UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const props = defineProps({
  textData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  activeId: String,
});

const emits = defineEmits(['handlePreview']);

const confidentialLevel = computed(() => {
  if (props.textData.confidential_level === '0')
    return '公开';
  if (props.textData.confidential_level === '1')
    return '内部';
  if (props.textData.confidential_level === '2')
    return '秘密';
  if (props.textData.confidential_level === '3')
    return '机密';
  return '公开';
})

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

// 查看pdf
const viewPdf = async (item) => {
  try {
    updateKldCounting({ kldFileId: item.id, countingType: 1 });
    const res = await getPdfPreviewPath({ id: item.fileId });
    emits('handlePreview')
    const filePath = res.data.fileUrl;
    router.push({ path: '/knowledge/pdfView', query: { docId: filePath } });
  } catch (error) {
    console.log('error:', error);
  }
};
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
          <div v-html="textData.highlightFields?.fileName[0] + '.' + textData.fileType" class="highlightName"></div>
        </div>
        <div v-else class="box-item" :class="{ 'active': activeId === textData.fileId }">
          <div class="highlightName">{{ textData.fileName }}.{{ textData.fileType
          }}【{{ textData.version || '' }}】 <span v-if="textData.releaseStatus === 0">【已发布】</span>
            <span v-else-if="textData.releaseStatus === 1">【未发布】</span>
          </div>
        </div>
        <div style="height: 26px; margin-top: 4px" class="flex items-center">
          <a-breadcrumb separator="|">
            <a-breadcrumb-item>{{ textData.userName }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ getTimes(Date.parse(textData.addTime)) || '' }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ confidentialLevel }}</a-breadcrumb-item>
          </a-breadcrumb>
          <span class="text-primary ml-auto cursor-pointer" @click="viewPdfFun">预览</span>
        </div>
      </div>
    </div>
    <div v-if="textData.highlightFields?.summary && textData.highlightFields?.summary.length > 0"
      v-html="textData.highlightFields?.summary[0]" class="desc descColor"></div>
    <div v-else class="desc">{{ textData.summary }}</div>
  </div>
</template>

<style lang="less" scoped>
.doc-list {
  margin-bottom: 1%;
  border-bottom: 1px solid #eaeaf1;
  padding: 0 8px;
  width: 100%;
  max-height: 180px;
  padding-bottom: 10px;

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
  .active {
    .highlightName {
      color: var(--ant-primary-color)
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
