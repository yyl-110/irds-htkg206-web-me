<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getTimes } from "@/utils/dateUtils.js";
import { message } from "ant-design-vue";
import { LearningCompleted } from "@/api/knowledge";

const store = useStore();

const router = useRouter();
const route = useRoute();
const fileDataUrl = ref("https://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf");
const docId = ref("");

const hidden = ref(false);

const objectItem = computed(() => {
  return store.getters.objectItem;
});

const goback = () => {
  router.go(-1);
};

const completed = () => {
  const params = {
    id: objectItem.value.learnNodeId,
  };
  LearningCompleted(params).then((res) => {
    if (res && res.data.code === "0") {
      message.success("学习完成");
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
        docId.value = newVal.query.docId;
        if (newVal.query.flag === "1" && objectItem.value.status === 0) {
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
  }
);
</script>


<template>
  <div class="pdf-layout">
    <div class="content">
      <iframe
        v-if="fileDataUrl"
        :src="`/cir/lib/pdfjs-2.12.313-legacy-dist/web/viewer.html?file=${encodeURIComponent(
          fileDataUrl
        )}`"
      />
    </div>
    <a-button type="primary" class="goback" @click="goback"> 返回 </a-button>
    <a-button v-if="hidden" class="buttn" type="primary" @click="completed"
      >学习完成</a-button
    >
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
    width: 60px;
    height: 60px;
    border-radius: 100%;
    bottom: 90px;
    left: 94%;
    margin-left: 0;
    font-size: 12px;
  }
  .goback {
    position: fixed;
    left: 94%;
    bottom: 20px;
    font-size: 14px;
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 500;
    color: #155bd4;
    cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 100%;
  }
}
</style>
