<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import Cookies from "js-cookie";
import { commentDetail, commentSave, commentFavour } from "@/api/knowledge";
import { getTimes } from "@/utils/dateUtils.js";
import { useUserStore } from "@/store/modules/user";
import { LikeOutlined, UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import draggableModal from "../DraggableModal/index.vue";

const props = defineProps({
  commentDialogVisible: Boolean,
  commonDeail: Object,
  numberFlag: Number,
});

const emit = defineEmits(["closeCommentDialogNotification", "getFlagList"]);

const userStore = useUserStore();

const commentText = ref();

const commentTextDetail = ref();

// 评论的数据
const commentData = ref([]);

// 当前回复评论
const hiddenComment = ref(false);

// 点击回复详情数据
const detailData = ref({});

// 回复别人信息得数据
const responseData = ref({});

const visible = ref(false);

watch(
  () => props.commentDialogVisible,
  (val) => {
    visible.value = val;
    if (val) {
      initDiscuss();
    }
  }
);

const initDiscuss = () => {
  const params = {
    kldId: props.commonDeail?.kldFileId
      ? props.commonDeail?.kldFileId
      : props.commonDeail.id,
    userId: userStore.getUser.id,
    kldType: props.numberFlag ? 2 : 1,
  };
  commentDetail(params).then((res) => {
    if (res.data && res.data.code === "0") {
      commentData.value = [];
      commentData.value = res.data.data;
      commentData.value.map((v) => {
        v.hidden = false;
        v.like = true;
        // 给里面的添加点赞标识
        if (v.child && v.child.length > 0) {
          v.child.map((k) => {
            k.commentLike = false;
          });
        }
      });
    }
  });
};

// 发布
const release = () => {
  if(!commentText.value) return message.warning('请输入评论内容');
  const params = {
    kldId: props.commonDeail?.kldFileId
      ? props.commonDeail?.kldFileId
      : props.commonDeail.id,
    type: 0, // 0回复的原帖子，1回复的评论
    replyUserId: props.commonDeail.userId,
    replyUserName: "",
    content: commentText.value,
    parentId: "",
    beReplyUserId: userStore.getUser.id,
    beReplyUserName: userStore.getUser.userName,
    kldType: props.numberFlag ? props.numberFlag : 1,
  };
  commentSave(params).then((res) => {
    if (res && res.data.code === "0") {
      commentText.value = "";
      initDiscuss();
    } else {
      message.error(res.data.msg);
    }
  });
};

watch(
  () => commentData.value,
  (val) => {
    if (val) {
      commentData.value = val;
    }
  },
  { deep: true }
);
// 回复数据
const replyData = (item) => {
  detailData.value = item;
  if (commentData.value.length > 0) {
    commentData.value.map((v) => {
      if (v.id === item.id) {
        v.hidden = true;
      } else {
        v.hidden = false;
      }
    });
  }
};

// 详情发布
const detailReplace = () => {
  const params = {
    kldId: props.commonDeail?.kldFileId
      ? props.commonDeail?.kldFileId
      : props.commonDeail.id,
    type: 1, // 0回复的原帖子，1回复的评论
    replyUserId: props.commonDeail.userId,
    replyUserName: userStore.getUser.userName,
    content: commentTextDetail.value,
    parentId: detailData.value.id,
    beReplyUserId: detailData.value.beReplyUserId,
    beReplyUserName: detailData.value.beReplyUserName,
    kldType: props.numberFlag ? props.numberFlag : 1,
  };
  commentSave(params).then((res) => {
    if (res && res.data.code === "0") {
      commentTextDetail.value = "";
      responseData.value = res.data.data;
      hiddenComment.value = false;
      initDiscuss();
    } else {
      message.error(res.data.msg);
    }
  });
};

// 评论点赞
const likeComment = (item) => {
  console.log(item, "评论点赞");
  if (commentData.value && commentData.value.length > 0) {
    commentData.value.map((v) => {
      if (v.id === item.id) {
        if (item.like === true) {
          v.like = false;
        } else {
          v.like = true;
        }
      }
    });
  }
  // iconHide.value = !iconHide.value;
  const params = {
    userId: userStore.getUser.id,
    discussId: item.id,
  };
  commentFavour(params).then((res) => {
    if (res && res.data.code === "0") {
      initDiscuss();
    } else {
      message.error(res.data.msg);
    }
  });
};

const likeCommentDetail = (item) => {
  if (commentData.value && commentData.value.length > 0) {
    commentData.value.map((v) => {
      // 里层的评论
      if (v.child && v.child.length > 0) {
        v.child.map((l) => {
          if (l.id === item.id) {
            if (item.commentLike === true) {
              l.commentLike = false;
            } else {
              l.commentLike = true;
            }
          }
        });
      }
    });
  }
  // iconHideDetail.value = !iconHideDetail.value;
  const params = {
    userId: userStore.getUser.id,
    discussId: item.id,
  };
  commentFavour(params).then((res) => {
    if (res && res.data.code === "0") {
      initDiscuss();
    } else {
      message.error(res.data.msg);
    }
  });
};

const handleClose = () => {
  emit("closeCommentDialogNotification");
  emit("getFlagList");
};
</script>

<template>
  <div class="comment-dialog-layout">
    <draggable-modal v-model:visible="visible" centered :maskClosable="false" title="评论" :width="1000" @cancel="handleClose" :footer="null">
      <div class="comment-wrap">
        <a-textarea v-model:value="commentText" :rows="4" maxlength="200" placeholder="请输入评论，最多200字" />
        <div class="elrow flex justify-end mt-[16px]">
          <!-- <el-checkbox v-model="checked">同时转发</el-checkbox> -->
          <a-button type="primary" @click="release">发布</a-button>
        </div>
        <!-- <p class="totality">共123条评论</p> -->
        <div class="max-h-[400px] overflow-y-auto wei-scrollbar mt-[8px]">
          <div v-for="(item, index) in commentData" :key="item.id" class="comment-list">
            <div class="user">
              <a-avatar class="avatar" size="34">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <span class="name">{{ item.beReplyUserName }}</span>
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="time-wrap">
              <span class="time">{{ getTimes(Date.parse(item.addTime)) }}</span>
              <span class="pra">
                <span class="reply flex items-center" @click="replyData(item)">回复</span>
                <LikeOutlined class="mr-[2px]" :class="[item.like ? 'icon' : 'icon1']" @click="likeComment(item)" />
                {{ item.favourNum }}
              </span>
            </div>
            <div v-if="item.hidden">
              <a-textarea v-model:value="commentTextDetail" class="inputStyle" :rows="3" maxlength="200"
                placeholder="请输入评论，最多200字" />
              <span class="fontColor" @click="detailReplace">发布</span>
            </div>
            <div v-if="item.child && item.child.length > 0" class="comment-inner-list">
              <div v-for="(val, index) in item.child" :key="val.id">
                <div class="user">
                  <a-avatar class="avatar" size="34">
                    <template #icon>
                      <UserOutlined />
                    </template>
                  </a-avatar>
                  <span class="name">{{ val.replyUserName }}</span>
                </div>
                <div class="content">{{ val.content }}</div>
                <div class="time-wrap">
                  <span class="time">{{
                    getTimes(Date.parse(val.addTime))
                    }}</span>
                  <span class="pra">
                    <LikeOutlined :class="[val.commentLike ? 'icon' : 'icon1']" @click="likeCommentDetail(item)" />
                    {{ val.favourNum }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </draggable-modal>
  </div>
</template>

<style lang="less" scoped>
.comment-list {
  margin-bottom: 32px;

  .user {
    display: flex;
    align-items: center;

    .avatar {
      width: 34px;
      height: 34px;
    }

    .name {
      margin-left: 8px;
    }
  }

  .content {
    margin-left: 42px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #323233;
    line-height: 20px;
  }

  .time-wrap {
    margin-left: 42px;
    margin-top: 8px;
    font-size: 12px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #646566;
    line-height: 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .pra {
      display: flex;
      align-items: center;
      cursor: pointer;

      .ico {
        margin-right: 5px;
        // cursor: pointer;
      }

      .ico1 {
        margin-right: 5px;
        color: red;
      }

      .reply {
        margin-right: 10px;
        // cursor: pointer;
      }
    }
  }

  .inputStyle {
    width: 90%;
    margin-left: 40px;
    margin-top: 5px;

    :deep(.el-textarea__inner) {
      height: 60px !important;
    }
  }

  .fontColor {
    color: #409eff;
    margin-left: 10px;
    cursor: pointer;
  }

  .comment-inner-list {
    margin-left: 42px;
    margin-top: 16px;
  }
}

.comment-dialog-layout {
  :deep(.el-dialog__body) {
    margin: 0 !important;
  }

  .elrow {
    display: flex;
    flex-direction: row-reverse;
    margin: 22px 0 36px 0;
  }

  .totality {
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 500;
    color: #969799;
    line-height: 20px;
    margin-bottom: 20px;
  }

  .comment-wrap {
    height: 600px;
    overflow-y: auto;
    padding: 0 20px;
  }
}
</style>
