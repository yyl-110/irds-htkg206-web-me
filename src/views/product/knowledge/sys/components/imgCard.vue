<script setup lang="ts">
import { doCollectFile, modifyInit, removeFile, saveLookFileLog, updateKldCounting } from '@/api/knowledge';
import { useUserStore } from '@/store/modules/user';
import { getTimes } from '@/utils/dateUtils';
import { EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import VideoImg from '@/views/knowledge/components/videoImg.vue';
import { Knowledgebase, getKnowledgebaseColor, getKnowledgebaseLabel } from '@/enums/Knowledgebase';

const props = defineProps({
  imgData: {
    type: Object,
    default: () => ({}),
  },
  hideSubmitAudit: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['handleFetchList', 'handleEdit', 'handleSubmitAudit']);

const shareDialogVisible = ref(false);
const docId = ref('');
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
    type: '1',
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
    const res = await removeFile({ kldFileId: props.imgData.id });
    if (res.data.code === '0') {
      message.success('删除成功');
      emits('handleFetchList');
    }
  } catch (error) {
    console.log('error:', error);
  }
};

const confidentialLevel = computed(() => {
  if (props.imgData.confidential_level === '0') return '公开';
  if (props.imgData.confidential_level === '1') return '内部';
  if (props.imgData.confidential_level === '2') return '秘密';
  if (props.imgData.confidential_level === '3') return '机密';
  return '公开';
});

const handleEditCard = () => {
  emits('handleEdit');
};
const handleSubmitAudit = () => {
  if (!canSubmitAudit.value) return;
  emits('handleSubmitAudit');
};

const canSubmitAudit = computed(() => {
  const status = String(props.imgData.approveStatus ?? '');
  const isAllowedStatus = status === Knowledgebase.DESIGNING || status === Knowledgebase.COMPILING;
  const isOwner = String(props.imgData.userId ?? '') === String(useUserStore().getUser.id ?? '');
  return isAllowedStatus && isOwner;
});

const approveStatus = computed(() => String(props.imgData.approveStatus ?? ''));
</script>

<template>
  <div class="doc-list">
    <img class="img-list" style="width: 199px; height: 142px" :src="imgData.fileUrl" alt="" @click="viewPdfFun" />
    <div class="img-wrap-title">
      <a-tooltip :mouse-enter-delay="0.5" :title="imgData.fileName + '.' + imgData.fileType" placement="top">
        <h3 class="fontHide w-full mt-[6px] mb-0" @click="viewPdfFun">{{ imgData.fileName }}.{{ imgData.fileType }}</h3>
      </a-tooltip>
    </div>
    <div class="img-wrap-title-right justify-between">
      <span>{{ JSON.parse(imgData.counting).previewed }}次预览</span>
      <span v-if="imgData.releaseStatus === 0">【已发布】</span>
      <span v-else-if="imgData.releaseStatus === 1">【未发布】</span>
    </div>
    <div class="meta-info">
      <div class="meta-row">
        <span class="meta-name">{{ imgData.userName }}</span>
        <span class="meta-time">{{ getTimes(Date.parse(imgData.addTime)) || '' }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-level">{{ confidentialLevel }}</span>
        <span class="meta-divider">|</span>
        <span class="meta-status" :style="{ color: getKnowledgebaseColor(approveStatus) }">
          {{ getKnowledgebaseLabel(approveStatus) }}
        </span>
      </div>
    </div>

    <div class="card-actions" v-if="!hideSubmitAudit">
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
          <div class="flex items-center gap-[2px] text-[12px] cursor-pointer calc-operation-links__danger">
            <delete-outlined />
            <span>删除</span>
          </div>
        </a-popconfirm>
      </span>
    </div>

    <VideoImg
      :video-hide="imgHide"
      :file-url-play="fileUrlPlay"
      dialog-type="3"
      title-type="图片预览"
      @get-video-hide="getImgHide" />
  </div>
</template>

<style scoped lang="less">
.fontHide {
  width: 198px;
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
  min-height: 300px;
  border-radius: 6px;
  border: 1px solid #eaeaf1;
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  box-sizing: border-box;

  .imgColor {
    color: var(--ant-primary-color);
  }

  .submit-audit-disabled {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }

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
    // color: var(--ant-primary-color);
    line-height: 22px;
    display: inline-block;
    cursor: pointer;
    padding-left: 16px;
  }

  .meta-info {
    padding: 4px 16px 0;
    flex-shrink: 0;

    .meta-row {
      display: flex;
      align-items: center;
      min-height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #969799;

      & + .meta-row {
        margin-top: 2px;
      }
    }

    .meta-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta-time {
      flex-shrink: 0;
      margin-left: 8px;
    }

    .meta-level,
    .meta-status {
      flex-shrink: 0;
    }

    .meta-divider {
      margin: 0 6px;
      color: #dcdee0;
    }

    .meta-status {
      font-weight: 500;
    }
  }

  .card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 16px 0;
    margin-top: auto;
    flex-shrink: 0;
  }
}
</style>
