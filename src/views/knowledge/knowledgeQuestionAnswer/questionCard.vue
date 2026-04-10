<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Empty, message } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined, MessageOutlined, SearchOutlined, UserOutlined, HeartOutlined, HeartFilled, ShareAltOutlined } from '@ant-design/icons-vue';
import shareCell from '../components/share.vue';
import PoseQuestion from '../components/poseQuestion.vue';
import { knowledgeQuestion, removeAnswer, doInterestQuestion, answerQuestion, removeQuestion } from '@/api/knowledge/index.js';
import { getAllTimes } from '@/utils/dateUtils.js';
import comment from '@/components/Comment/index.vue';
import { useUserStore } from '@/store/modules/user';


const shareDialogVisible = ref(false);
const docId = ref('');
const page = ref({ pageSize: 10, pageCount: 100, currentPage: 1 });
const poseDialogVisible = ref(false);
const commentDialogVisible = ref(false);
const hideFlag = ref(false);
const commonDeail = ref({});
const editData = ref({});
const answer = ref('');
const hideAnswer = ref(false);
const numberFlag = ref();
const flagId = ref();
const addFlag = ref('');

const emit = defineEmits(['handleReload']);
const props = defineProps({
  allQues: {
    type: Array,
    default: () => []
  }
});

const userId = computed(() => useUserStore().getUser.id);


const closeDialog = (val, num) => {
  poseDialogVisible.value = val;
  if (num) addFlag.value = num;
  emit('handleReload');
};

// 展开/收起回答（原 changeHideFlag 与 hidenFun 逻辑完全相同，合并为一个）
const toggleAnswers = item => {
  hideFlag.value = !hideFlag.value;
};

const upData = () => {
  hideFlag.value = false;
};

const confirmAnswer = () => {
  answerQuestion({
    questionId: flagId.value,
    userId: userId.value,
    content: answer.value,
  }).then(res => {
    if (res && res.data.code === '0') {
      hideAnswer.value = false;
      answer.value = '';
      emit('handleReload');
    }
  });
};

const cancelAnswer = () => {
  answer.value = '';
  hideAnswer.value = false;
};

const commentFun = item => {
  commonDeail.value = item;
  numberFlag.value = 2;
  commentDialogVisible.value = true;
};

const closeCommentDialogNotification = () => {
  commentDialogVisible.value = false;
};

const myAnswerFun = item => {
  flagId.value = item.id;
  hideAnswer.value = !hideAnswer.value;
};

const editFun = item => {
  addFlag.value = '2';
  editData.value = item;
  poseDialogVisible.value = true;
};

const deleteFun = item => {
  removeQuestion({ questionId: item.id }).then(res => {
    if (res && res.data.code === '0') emit('handleReload');
  });
};

const answerDelete = val => {
  removeAnswer({
    questionId: val.questionId,
    userId: userId.value,
    answerId: val.id,
  }).then(res => {
    if (res && res.data.code === '0') emit('handleReload');
  });
};

const starFun = item => {
  doInterestQuestion({ questionId: item.id, userId: userId.value }).then(res => {
    if (res && res.data.code === '0') {
      message.success(item.interestLight ? '取消关注成功！' : '关注成功！');
      emit('handleReload');
    }
  });
};

const shareFun = item => {
  docId.value = item.id;
  shareDialogVisible.value = true;
};

const closeShare = () => {
  shareDialogVisible.value = false;
  emit('handleReload');
};

const handleCurrentChange = (val, size) => {
  page.value.currentPage = val;
  page.value.pageSize = size;
  emit('handleReload');
};
</script>

<template>
  <div>
    <div class="ask-list-top">
      <div class="ask-list-left">
        <a-avatar class="elAvatar" :size="24">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <span class="name">{{ allQues.userName }}</span>
        <span
          style="font-family: PingFang SC, PingFang SC; font-weight: 400; font-size: 14px; color: #6a696e">提了一个问题</span>
        <span class="time"><span style="margin: 0 3px">·</span>{{ getAllTimes(Date.parse(allQues.addTime))
        }}</span>
        <span v-if="allQues.urgency === '紧急'" class="status exigency">{{ allQues.urgency }}</span>
        <span v-if="allQues.urgency === '严重'" class="status importance">{{ allQues.urgency }}</span>
      </div>
      <div class="ask-list-right" v-if="!allQues.hideAnswerButton" @click="myAnswerFun(allQues)">
        <img src="@/assets/images/group1.png" alt="" /><span class="author-myAnser-text">写回答</span>
      </div>
    </div>

    <div class="ask-list-title" @click="toggleAnswers(allQues)">
      <span class="ask-list-title-name">{{ allQues.description }}</span>
    </div>

    <div class="action-row">
      <div v-if="allQues.answer.length > 0" @click="toggleAnswers(allQues)" class="flex items-center gap-[2px]">
        <div style="margin-right: 4px">展开全部</div>
        <img src="@/assets/images/down11.png" alt="" style="margin-right: 20px" />
      </div>
      <span v-if="allQues.userId === Number(userId)" class="author-elEdit flex items-center gap-[2px]"
        @click="editFun(allQues)">
        <edit-outlined class="imgColor" /><span class="author-elEdit-text">编辑</span>
      </span>
      <span v-if="allQues.userId === Number(userId)" class="author-elDelete">
        <a-popconfirm ok-text="确定" cancel-text="取消" title="确定要删除吗?" @confirm="deleteFun(allQues)">
          <div class="flex items-center gap-[2px] text-[12px]">
            <delete-outlined class="imgColor" />
            <span class="author-elDelete-text">删除</span>
          </div>
        </a-popconfirm>
      </span>
    </div>

    <div class="commont mt-[16px]" v-if="hideAnswer">
      <a-textarea v-model:value="answer" />
      <div class="flex justify-end mt-[8px] gap-[8px]">
        <a-button class="commont-btn" type="primary" @click="confirmAnswer">确定</a-button>
        <a-button class="commont-btn" @click="cancelAnswer">取消</a-button>
      </div>
    </div>

    <div v-if="hideFlag && allQues.answer.length > 0">
      <div class="bottomAnswer" v-for="myAnser in allQues.answer" :key="myAnser.id">
        <div class="titleTop">
          <div class="content">
            <span class="content-answer">答</span><span class="name">{{ myAnser.userName }}：</span>{{
              myAnser.content }}
          </div>
          <div style="margin-top: 5px" v-if="myAnser.showDeleteBotton">
            <a-popconfirm ok-text="确定" cancel-text="取消" title="确定要删除吗?" @confirm="answerDelete(myAnser)">
              <div class="flex items-center gap-[2px] text-[12px]">
                <delete-outlined class="imgColor" />
                <span class="author-elDelete-text">删除</span>
              </div>
            </a-popconfirm>
          </div>
        </div>
        <div class="starComment">
          <div class="elChatDotSquare" @click="commentFun(myAnser)">
            <message-outlined /><span>{{ myAnser.discussNum }}</span>
          </div>
          <div class="icon-hanhan elChatDotSquare" @click="starFun(allQues)">
            <HeartOutlined v-if="!allQues.interestLight" />
            <HeartFilled v-else class="text-red" :style="{ color: 'red' }" />
            <span>{{ myAnser.discussNum }}</span>
          </div>
          <div class="elChatDotSquare" @click="shareFun(myAnser)">
            <ShareAltOutlined /><span>{{ myAnser.discussNum }}</span>
          </div>
        </div>
      </div>
      <span class="up" @click="upData">
        <div style="margin-right: 4px">收起回答</div>
        <img src="@/assets/images/up11.png" alt="" />
      </span>
    </div>
    <shareCell :shareDialogVisible="shareDialogVisible" :docId="docId" @closeShare="closeShare" />
    <PoseQuestion :poseDialogVisible="poseDialogVisible" :editData="editData" :addFlag="addFlag"
      @closeDialog="closeDialog">
    </PoseQuestion>

    <comment :commentDialogVisible="commentDialogVisible" :commonDeail="commonDeail" :numberFlag="numberFlag"
      @closeCommentDialogNotification="closeCommentDialogNotification" @getFlagList="initData" />
  </div>

</template>

<style lang="less" scoped>
.doc-list {
  margin-bottom: 14px;
  border-top: 1px solid #E7EAEE;
  padding-top: 16px;

  &:first-child {
    border: none;
  }

  .ask-list-top {
    display: flex;
    justify-content: space-between;

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
        border-radius: 2px;
        border: 1px solid #f56c6c;
      }

      .importance {
        width: 36px;
        line-height: 20px;
        font-size: 12px;
        text-align: center;
        color: #e6a23c;
        border-radius: 2px;
        border: 1px solid #e6a23c;
      }
    }

    .ask-list-right {
      display: flex;
      align-items: center;
      margin-right: 16px;
      cursor: pointer;

      .author-myAnser-text {
        font-weight: 400;
        font-size: 16px;
        color: var(--ant-primary-color);
        margin-left: 5px;
      }
    }
  }

  .ask-list-title {
    cursor: pointer;
    line-height: 26px;

    .ask-list-title-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #000;
    }
  }

  .action-row {
    font-family: Source Sans 3, Source Sans 3;
    font-weight: 400;
    font-size: 14px;
    color: #6a696e;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 12px;
  }

  .author {
    display: flex;
    height: 24px;

    .elStarFilled {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-left: 10px;

      &:hover {
        color: var(--ant-primary-color);
      }
    }

    .elStarFilled1 {
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

    &-elEdit {
      display: flex;
      align-items: center;
      font-size: 12px;
      margin: 0 20px 0 0;

      &-text {
        color: var(--ant-primary-color);
        cursor: pointer;
        margin-top: 2px;
      }
    }

    &-elDelete {
      display: flex;
      align-items: center;
      font-size: 12px;
      padding-top: 3px;

      &-text {
        color: var(--ant-primary-color);
        cursor: pointer;
      }
    }
  }

  .bottomAnswer {
    margin-top: 8px;
    margin-left: 10px;
    position: relative;

    .titleTop {
      display: flex;
      align-items: center;
      // margin-left: 25px;

      .elAvatar {
        margin-right: 8px;
      }
    }


    .content {
      margin: 5px 20px 0 0;
      line-height: 24px;

      span {
        height: 22px;
        font-size: 14px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        line-height: 22px;
      }

      .content-answer {
        display: inline-block;
        text-align: center;
        width: 26px;
        height: 22px;
        background: #e6effb;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: var(--ant-primary-color);
        border-radius: 8px 8px 0 8px;
        margin-right: 10px;
      }
    }
  }

  .up {
    position: relative;
    top: 10px;
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
    gap: 16px;
    align-items: center;
    margin: 15px 0 0 25px;
    padding-bottom: 15px;
    border-bottom: 2px dotted #c3c3c3;

    .elStarFilled {
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        color: var(--ant-primary-color);
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
          margin-top: 4px;
        }
      }
    }
  }

  .commont {
    &-btn {
      margin-top: 5px;
    }
  }
}


.imgColor {
  color: var(--ant-primary-color);
  padding-top: 2px;
}

.icon-hanhan,
.icon-hanhan1 {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 14px;
}


.icon-hanhan1:before {
  color: #ff4f44;
}

.icon-fenxiang:before {
  font-size: 16px;
  color: #a2a1a6;
}
</style>
