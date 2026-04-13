<template>
  <el-aside class="elAside">
    <div class="rt-layout">
      <div class="home-intro">
        <div class="user">
          <a-avatar class="elAvatar flex-shrink-0" :size="50">
            <template #icon> <user-outlined /></template>
          </a-avatar>
          <div class="intro">
            <div class="name">{{ userInfoList.name || useUserStore().getUser.userName }}</div>
            <div class="tags">{{ userInfoList.expertRole }}</div>
          </div>
        </div>
        <!-- <div class="desc">个人简介：{{ userInfoList.remarks }}</div> -->
        <div class="incollect mt-[16px]">
          <div v-for="(item, index) in myData" :key="index" class="text item" @click="sideFun(item)">
            <div class="incollectInfo" v-if="index == 0 || index == 1 || index == 4">
              <div class="incollectInfoVal">{{ item.value }}</div>
              <div class="incollectInfoTitle">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { knowledgePersonal } from '@/api/knowledge';
import { UserOutlined } from '@ant-design/icons-vue';

interface MyDataItem {
  title: string;
  key: string;
  value: number; // 根据后端返回，collectsSize 等应为数字
}

// 用户信息
const userInfoList = ref({});
const roleName = ref();

const myData = ref<MyDataItem[]>([]);

const emit = defineEmits('getInfo');

onMounted(() => {
  getUserInfo();
})

// 获取个人简介信息
const getUserInfo = () => {
  const params = {
    userId: useUserStore().getUser.id,
  };
  knowledgePersonal(params).then(res => {
    if (res && res.data.code === '0') {
      userInfoList.value = res.data.data.userInfo;
      roleName.value = res.data.data.roleName;
      myData.value = [];
      myData.value = [
        {
          title: '收藏',
          key: 'my-contribution',
          value: res.data.data.collectsSize,
        },
        {
          title: '关注',
          key: 'my-follow',
          value: res.data.data.interestSize,
        },

        {
          title: '问题',
          key: 'my-collect',
          value: res.data.data.questionSize,
        },

        {
          title: '回答',
          key: 'my-quest',
          value: res.data.data.answerSize,
        },
        {
          title: '分享',
          key: 'my-knowledgeShare',
          value: res.data.data.shareSize,
        },
      ];
    } else {
      message.error(res.data.msg);
    }
  });
};

// 右侧数据
const sideFun = item => {
  console.log(item, 'itemitem');
  emit('getInfo', item);
};
</script>

<style lang="less" scoped>
.elAside {
  width: 100%;
  margin-top: 10px;

  // height: ~'calc(100vh - 75px)';
  // background-color: #fff;
  .home-intro {
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 10px;
    width: 100%;
    height: 180px;
    background: linear-gradient(181deg, #fae2ab 0%, #ffffff 100%);
    border-radius: 4px 4px 4px 4px;

    .user {
      display: flex;
      border-bottom: 1px solid #ebedf0;
      margin-right: 20px;

      .elAvatar {
        width: 60px;
        height: 60px;
        margin-top: 24px;
        margin-left: 16px;
      }

      .intro {
        padding-left: 16px;

        .name {
          height: 26px;
          margin-top: 24px;
          margin-bottom: 6px;
          font-family: PingFangSC, PingFang SC;
          line-height: 26px;
          font-weight: 600;
          font-size: 16px;
          color: #000000;
        }

        .tags {
          width: 90px;
          line-height: 24px;
          text-align: center;
          border-radius: 2px 2px 2px 2px;
          background: #f4bd3f;
          font-weight: 400;
          font-size: 14px;
          color: #674800;
        }
      }
    }

    .desc {
      margin: 16px 18px 20px 16px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333;
      line-height: 20px;
    }

    .incollect {
      display: flex;

      .incollectInfo {
        width: 63px;
        height: 65px;
        margin-left: 14px;
        text-align: center;
        background-color: #fff;
        cursor: pointer;
        padding-top: 10px;

        .incollectInfoVal {
          height: 20px;
          font-weight: bold;
          font-size: 18px;
          color: #000;
          margin-bottom: 4px;
        }

        .incollectInfoTitle {
          height: 20px;
          font-weight: 400;
          font-size: 14px;
          color: #6a696e;
        }
      }
    }

    .elCard {
      padding-top: 23px;
      border: none;

      :deep(.el-card__body) {
        padding: 0;
      }

      .item {
        display: flex;
        align-items: center;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 20px;
        margin-bottom: 15px;
        cursor: pointer;

        .elIcon {
          margin-right: 10px;
          margin-left: 8px;
          font-size: 14px;
          cursor: pointer;

          .TrophyBase-ico {
            color: #2da641;
          }

          .StarFilled-ico {
            color: #fad20c;
          }

          .Opportunity-ico {
            color: #d40000;
          }

          .Document-ico {
            color: var(--ant-primary-color);
          }
        }
      }
    }
  }
}
</style>
