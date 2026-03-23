<template>
  <div class="doc-list ask-list">
    <div class="ask-list-top">
      <div class="ask-list-left">
        <a-avatar class="elAvatar" :size="24">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar><span class="name">{{ askData.content.userName }}</span>
        <span class="time">{{ getAllTimes(Date.parse(askData.content.addTime)) }}</span>
        <span v-if="askData.content.urgency === '紧急'" class="status exigency">{{ askData.content.urgency }}</span>
        <span v-if="askData.content.urgency === '严重'" class="status importance">{{ askData.content.urgency }}</span>
      </div>
      <span class="ask-list-right" v-if="!askData.content.hideAnswerButton" @click="myAnswerFun(askData.content)">
        <img src="@/assets/images/group1.png" alt="" /><span class="author-myAnser-text">写回答</span>
      </span>
    </div>
    <div class="ask-list-title">
      <span v-if="askData.highlightFields?.description && askData.highlightFields?.description.length > 0"
        v-html="askData.highlightFields?.description[0]" class="highlightName"
        @click="changeHideFlag(askData.content)"></span>
      <span v-else class="highlightName" @click="changeHideFlag(askData.content)">
        {{ askData.content.description }}
      </span>
      <span class="ask-list-title-answerNum" v-if="askData.content?.answer && askData.content?.answer?.length > 0">
        已回复<span style="margin-left: 2px">{{ askData.content?.answer?.length }}</span>条
      </span>
    </div>
    <div class="author">
      <div class="authorOption">
        <div style="margin-right: 4px" v-if="askData.content?.answer && askData.content?.answer?.length > 0"
          @click="hidenFun(askData)">展开全部</div>
        <img src="@/assets/images/down11.png" v-if="askData.content?.answer && askData.content?.answer?.length > 0"
          @click="hidenFun(askData)" alt="" style="margin-right: 20px" />
      </div>
    </div>
    <div class="commont mt-[16px]" v-if="hideAnswer">
      <a-textarea v-model:value="answer" />
      <a-button class="commont-btn ml-auto flex mt-[8px]" type="primary" @click="confirmAnswer">确定</a-button>
    </div>
    <div v-if="hideFlag && askData.content.answer.length > 0">
      <div class="bottomAnswer" v-for="(myAnser, index) in askData.content.answer" :key="myAnser.id">
        <div class="titleTop">
          <div class="content">
            <span class="content-answer">答</span><span class="name">{{ myAnser.userName }}：</span> {{ myAnser.content }}
          </div>
        </div>
        <div class="starComment">
          <div class="elChatDotSquare" @click="commentQuestFun(myAnser)">
            <message-outlined />
            <span>{{ myAnser.discussNum }}</span>
          </div>
          <div class="icon-hanhan elChatDotSquare" @click="starFun(askData.content)">
            <HeartOutlined v-if="!askData.content.interestLight" />
            <HeartFilled v-else class="text-red" :style="{ color: 'red' }" />
            <span>{{ myAnser.discussNum }}</span>
          </div>
          <div class="elChatDotSquare fenxiang" @click="shareFun(askData)">
            <ShareAltOutlined /><span>{{ myAnser.discussNum
              }}</span>
          </div>
        </div>
      </div>
      <span class="up" @click="upData">
        <div style="margin-right: 4px">收起回答</div>
        <img src="@/assets/images/up11.png" alt="" />
      </span>
      <div style="height: 1px; width: 100%; margin-top: 16px; border: 1px solid #eee"></div>
    </div>

    <comment :comment-dialog-visible="commentDialogVisibleQuest" :common-deail="commonDeail"
      @close-comment-dialog-notification="closeCommentDialogNotification" @get-flag-list="getList" />

    <shareCell :share-dialog-visible="shareDialogVisible" :doc-id="docId" :quest-flag="2" :tab-flag="4"
      @close-share="closeShare" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HeartFilled, HeartOutlined, MessageOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons-vue';
import { getAllTimes } from '@/utils/dateUtils';
import { useUserStore } from '@/store/modules/user';
import { answerQuestion, doInterestQuestion, saveLookFileLog } from '@/api/knowledge';
import comment from '@/components/Comment/index.vue';
import shareCell from './share.vue'
import { message } from 'ant-design-vue';

const userStore = useUserStore()
const props = defineProps({
  askData: {
    type: Object,
    default: () => { }
  }
})

const emits = defineEmits(['handleFetchList']);

const hideAnswer = ref(false);
const hideFlag = ref(false);
const answer = ref('');
const flagId = ref('')
const commonDeail = ref({})
const commentDialogVisibleQuest = ref(false);
const docId = ref('');
const shareDialogVisible = ref(false);

// 我来回答
const myAnswerFun = item => {
  flagId.value = item.id;
  hideAnswer.value = !hideAnswer.value
};

// 显示隐藏评论数据
const changeHideFlag = item => {
  hideFlag.value = !hideFlag.value;
  const paramss = {
    name: userStore.getUser.userName, //userName
    userId: userStore.getUser.id,
    kldId: item.id, //fileId
    type: '1', //1,浏览  2，下载
  };
  saveLookFileLog(paramss).then(res => {
    if (res && res.data.code === '0') {
      // 浏览问题数据
      console.log(res, '显示隐藏评论数据');
      // getQuestList();
      // viewHistory();
    }
  });
};

const hidenFun = (data: any) => {
  hideFlag.value = !hideFlag.value;
}

const upData = () => {
  hideFlag.value = false;
}

// 回答接口
const confirmAnswer = () => {
  const params = {
    questionId: flagId.value,
    userId: userStore.getUser.id,
    content: answer.value,
  };
  answerQuestion(params).then(res => {
    if (res && res.data.code === '0') {
      hideAnswer.value = false;
      answer.value = '';
      emits('handleFetchList');
    }
  });
};

const getList = () => {
  emits('handleFetchList');
}

// 关闭评论弹框
const closeCommentDialogNotification = () => {
  commentDialogVisibleQuest.value = false;
  emits('handleFetchList');
}

const commentQuestFun = (answer: any) => {
  commonDeail.value = answer;
  // numberFlag.value = 2;
  commentDialogVisibleQuest.value = true;
}

//star星星数
const starFun = item => {
  const params = {
    questionId: item.id,
    userId: userStore.getUser.id,
  };
  doInterestQuestion(params).then(res => {
    if (res && res.data.code === '0') {
      if (item.interestLight === true) {
        message.success('取消关注成功！');
      } else {
        message.success('关注成功！');
      }
      emits('handleFetchList');
    }
  });
};

//分享
const shareFun = item => {
  docId.value = item.content.id;
  shareDialogVisible.value = true;
};
//关闭分享
const closeShare = () => {
  shareDialogVisible.value = false;
  // getRightUserList();
  // setTimeout(() => {
  //   if (tabFlag.value === 4) {
  //     getQuestList();
  //   } else {
  //     searchData();
  //   }
  // }, 1000);
};
</script>

<style scoped lang="less">
.doc-list {
  margin-bottom: 20px;

  .ask-list-top {
    display: flex;
    justify-content: space-between;

    // align-items: center;
    // line-height: 32px;
    .ask-list-left {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 32px;
      margin-bottom: 8px;

      .elAvatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid #d3d2d9;
      }

      .name {
        margin: 0 12px 0 8px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #313133;
      }

      .time {
        margin-top: 2px;
        margin-right: 8px;
      }

      .exigency {
        width: 36px;
        line-height: 20px;
        font-size: 12px;
        text-align: center;
        color: #f56c6c;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #f56c6c;
      }

      .importance {
        width: 36px;
        line-height: 20px;
        font-size: 12px;
        text-align: center;
        color: #e6a23c;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #e6a23c;
      }

      .normal {
        width: 36px;
        line-height: 20px;
        font-size: 12px;
        text-align: center;
        color: #909399;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #909399;
      }
    }

    .ask-list-right {
      display: flex;
      align-items: center;

      .imgColor {
        width: 14px;
        height: 14px;
        margin-right: 2px;
        color: #1366d1;
      }

      .author-myAnser-text {
        font-weight: 400;
        font-size: 16px;
        color: #1366d1;
        margin-left: 5px;
      }
    }
  }

  .ask-list-title {
    cursor: pointer;
    line-height: 26px;

    .highlightName {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #000;
    }

    .ask-list-title-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #000;
    }

    .ask-list-title-answerNum {
      font-size: 14px;
      height: 24px;
      padding: 0 10px;
      background-color: #e5f0db;
      font-weight: 500;
      margin-left: 10px;
      color: #155bd4;
    }

    .ask-list-title-answerUp {
      font-size: 14px;
      font-weight: 500;
      margin-left: 10px;
      color: #155bd4;
    }
  }

  .desc {
    font-size: 14px;
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 500;
    color: #646566;
    line-height: 22px;
  }

  .author {
    border-bottom: 1px solid #efefef;

    .authorOption {
      font-family: Source Sans 3, Source Sans 3;
      font-weight: 400;
      font-size: 14px;
      color: #6a696e;
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;
    }

    .isRelated {
      height: 22px;
      font-size: 12px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      // color: #969799;
      line-height: 22px;
    }

    span.time {
      margin-left: 13px;
      margin-right: 13px;
    }

    &-myAnser {
      margin-left: 13px;
      display: flex;
      align-items: center;

      &-text {
        color: #155bd4;
        cursor: pointer;
      }
    }

    .imgColor {
      color: #155bd4;
    }

    .elStarFilled {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-left: 10px;
      line-height: 23px;

      &:hover {
        color: #155bd4;
      }
    }

    .elStarFilled1 {
      line-height: 23px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: red;
      margin-left: 10px;
    }

    .elShare {
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }

  .bottomAnswer {
    margin-top: 8px;
    // border-bottom: 1px dashed #c3c3c3;
    margin-left: 10px;
    position: relative;

    .titleTop {
      display: flex;
      align-items: center;
      margin-left: 25px;

      .elAvatar {
        margin-right: 8px;
      }
    }

    span {
      height: 22px;
      font-size: 14px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      // color: #969799;
      line-height: 22px;
    }

    span.time {
      margin-left: 13px;
      margin-right: 13px;
    }

    .content {
      margin: 5px 20px 0 0;
      height: 24px;
      line-height: 24px;

      .content-answer {
        position: absolute;
        left: -10px;
        display: inline-block;
        text-align: center;
        width: 26px;
        height: 22px;
        background: #e6effb;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #1366d1;
        // line-height: 26px;
        border-radius: 8px 8px 0 8px;
        // padding: 3px;
        margin-right: 10px;
      }
    }
  }

  .up {
    // color: #155bd4;
    position: relative;
    top: 10px;
    // left: 50%;
    cursor: pointer;
    font-family: Source Sans 3, Source Sans 3;
    font-weight: 400;
    font-size: 14px;
    color: #6a696e;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .starComment {
    display: flex;
    margin: 15px 0 0 13px;
    padding-bottom: 15px;
    border-bottom: 2px dotted #c3c3c3;
    gap: 16px;

    .elStarFilled {
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        color: #155bd4;
      }
    }

    .elStarFilled1 {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: red;
    }

    .elChatDotSquare {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 4px;

      span {
        :first-child {
          margin-top: 5px;
        }
      }
    }
  }

  .commont {

    // display: flex;
    &-btn {
      margin-top: 5px;
    }
  }

  &:last-child {
    border: none;
  }

  .action-wrap {
    display: flex;
    margin: 21px 0 20px 0;

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
        margin: 0 9px;
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
    }

    .elStarFilled1 {
      cursor: pointer;
      color: red;

      &:hover {
        color: #155bd4;
      }
    }
  }
}

.ask-list {
  .author {
    display: flex;
    align-items: center;
    // height: 24px;
    padding-bottom: 15px;

    .elAvatar {
      min-height: 24px;
      min-width: 24px;
    }

    .name {
      margin-left: 8px;
      font-weight: 500;
      color: rgba(51, 51, 51, 0.8);
    }
  }

  .desc {
    height: 22px;
    overflow: hidden;

    span {
      height: 22px;
      font-size: 14px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #155bd4;
      line-height: 22px;
      margin-right: 11px;
    }
  }

  .action-wrap {
    position: relative;

    .right-action {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;

      .act-list {
        color: #155bd4;

        .delete-wrap {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
