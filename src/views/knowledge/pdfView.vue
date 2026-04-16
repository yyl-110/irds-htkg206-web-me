<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { LearningCompleted } from '@/api/knowledge';

const router = useRouter();
const route = useRoute();
const fileDataUrl = ref('https://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf');
const docId = ref('');
const pdfViewerSrc = computed(() => {
  if (!fileDataUrl.value) return '';
  return `/pdfjs-2.12.313/web/viewer.html?file=${encodeURIComponent(fileDataUrl.value)}`;
});

const hidden = ref(false);

const goback = () => {
  router.go(-1);
};
const openInNewTab = () => {
  if (!fileDataUrl.value) return;
  window.open(fileDataUrl.value, '_blank');
};

const completed = () => {
  const stateData = history.state.itemData || window.history.state;
  const learnNodeId = stateData?.id || stateData?.nodeId || route.query.learnNodeId;
  const params = {
    id: learnNodeId,
  };
  LearningCompleted(params).then(res => {
    if (res && res.data.code === '0') {
      message.success('学习完成');
      router.go(-1);
    } else {
      message.error(res.data.msg);
      router.go(-1);
    }
  });
};

watch(
  route,
  (newVal, oldVal) => {
    if (newVal.query.docId) {
      nextTick(() => {
        docId.value = newVal.query.docId as string;
        const stateData = history.state.itemData || window.history.state;
        if (newVal.query.flag === '1' && stateData?.status == 0) {
          hidden.value = true;
        } else {
          hidden.value = false;
        }
        fileDataUrl.value = docId.value;
      });
    }
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <div class="pdf-layout">
    <div class="content">
      <iframe v-if="pdfViewerSrc" :src="pdfViewerSrc" />
      <div v-else class="empty-tip">未获取到可预览的文件地址</div>
    </div>
    <a-button type="primary" class="goback" @click="goback">返回</a-button>
    <!-- <a-button v-if="fileDataUrl" class="open-link" @click="openInNewTab">新窗<br/>打开</a-button> -->
    <a-button v-if="hidden" class="buttn" type="primary" @click="completed">学习<br/>完成</a-button>
  </div>
</template>

<style lang="less" scoped>
.pdf-layout {
  width: 99%;
  height: 98%;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdee0;
  margin: 15px auto;
  overflow-y: auto;

  :deep(.ant-btn) {
    padding: 0;
  }

  .top {
    margin: 20px;
    text-align: left;
    display: flex;
    border-bottom: 1px solid #ebedf0;
    position: relative;

    .title {
      height: 22px;
      font-size: 16px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: bold;
      color: #323233;
      line-height: 22px;
      margin-bottom: 13px;
    }

    .tags {
      margin-bottom: 20px;
      display: flex;

      span {
        height: 22px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdee0;
        padding: 0 12px;
        text-align: center;
      }
    }

    .user {
      display: flex;
      align-items: center;
      height: 22px;
      font-size: 14px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #969799;
      line-height: 22px;
      margin-bottom: 4px;
      margin-left: 30px;

      .name {
        margin-right: 14px;
      }
    }

    .see {
      display: flex;
      align-items: center;
      height: 22px;
      font-size: 14px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #969799;
      line-height: 22px;
      margin-bottom: 20px;

      span {
        margin-left: 6px;
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .buttn {
    position: fixed;
    right: 24px;
    bottom: 140px;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    font-size: 12px;
    line-height: 1.2;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    z-index: 10;
  }

  .goback {
    position: fixed;
    right: 24px;
    bottom: 24px;
    font-size: 14px;
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .open-link {
    position: fixed;
    right: 24px;
    bottom: 82px;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    font-size: 12px;
    line-height: 1.2;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    z-index: 10;
    text-align: center;
  }

  .open-link :deep(span) {
    display: inline-block;
  }

  .empty-tip {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 14px;
  }
}
</style>
