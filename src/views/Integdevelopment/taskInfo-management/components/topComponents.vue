<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
const { TabPane: ATabPane } = ATabs;
import { WeiI18n } from '@/utils/WeiI18n';
import DesignTree from '@/components/tree/DesignTree.vue';

const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const nodeName = ref<any>('');
const planStartTime = ref<any>('');
const planEndTime = ref<any>('');
const deadlineDays = ref<any>('');
const editableProgress = ref<number>(0); // 可编辑的进度值
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nodeName.value = planTaskInfo.value.nodeName.split(' ')[1];
  planStartTime.value = planTaskInfo.value.planStartTime.split(' ')[0];
  planEndTime.value = planTaskInfo.value.planEndTime.split(' ')[0];

  // 初始化可编辑进度值
  editableProgress.value = planTaskInfo.value.progress || 0;

  // 计算截止天数
  const endDate = new Date(planEndTime.value);
  const currentDate = new Date();
  // 设置时间为00:00:00以仅比较日期部分
  currentDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // 计算毫秒差并转换为天数
  const diffTime = endDate.getTime() - currentDate.getTime();
  deadlineDays.value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 处理进度输入变化
function handleProgressChange(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = Number(input.value);

  // 限制范围在0-100之间
  if (value < 0) {
    value = 0;
    planTaskInfo.value.progress = 0;
    input.value = '0';
  } else if (value > 100) {
    value = 100;
    planTaskInfo.value.progress = 100;
    input.value = '100';
  }
}

// 处理进度输入框失焦事件
function onProgressBlur() {
  // 确保进度值为整数
  planTaskInfo.value.progress = Math.round(planTaskInfo.value.progress);
  planTaskInfo.value.progress = planTaskInfo.value.progress;
  // 这里可以添加保存进度的逻辑
  console.log('进度已更新为:', planTaskInfo.value.progress + '%');
}

defineExpose({ initInfo });
</script>

<template>
  <div class="top-block">
    <div class="block-inner">
      <img class="pic" src="../../../../assets/workbench/taskPicInfo.png" />
      <div class="dec-wrap">
        <div class="t">{{ productInfo.planName }}-{{ productInfo.planCode }}</div>
        <div class="tm">当前所处阶段：{{ planTaskInfo.parentNodeName }}</div>
        <div class="tm">任务名称：{{ nodeName }}</div>
        <div class="tm">
          任务计划时间：{{ planStartTime }} ~ {{ planEndTime }} <span style="margin-left: 220px">距截止还剩{{ deadlineDays }}天</span>
        </div>
        <div class="pr">
          <div v-if="planTaskInfo.id == productInfo.id" style="display: flex; width: 200px; color: rgba(0, 0, 0, 0.8)">
            当前进度： <input type="number" v-model.number="planTaskInfo.progress" @input="handleProgressChange" @blur="onProgressBlur" min="0" max="100" class="progress-input" />%
          </div>
          <div v-else style="display: flex; width: 200px; color: rgba(0, 0, 0, 0.8)">当前进度： {{ planTaskInfo.progress }}%</div>
          <div class="user-wrap">
            <a-progress status="active" :percent="planTaskInfo.progress" class="elprogress" />
            <div style="color: rgba(0, 0, 0, 0.8)" :style="{ position: 'absolute', right: '9%' }">负责人：</div>
            <div class="create-pop">
              <div class="user"><img src="../../../../assets/workbench/avatar.jpg" alt="" />{{ planTaskInfo.headUserName || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//用户头像
.create-pop {
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 14px;
  color: #6a696e;
  line-height: 22px;
  text-align: right;
  font-style: normal;
  text-transform: none;
  display: flex;

  .user {
    height: 24px;
    background: #fff;
    border-radius: 15px 15px 15px 15px;
    display: flex;
    align-items: center;
    padding-right: 8px;
    img {
      min-width: 20px;
      max-width: 20px;
      height: 20px;
      border-radius: 20px;
      margin: 1px 4px 1px 2px;
    }
  }
}
//流程顶部资料
.top-block {
  width: 96.5%;
  background: #f3f2f7;
  border-radius: 8px 8px 8px 8px;
  margin: 20px 20px 20px 16px;
  .block-inner {
    padding: 16px 20px 16px 16px;
    display: flex;
    .pic {
      min-width: 168px;
      max-width: 168px;
      height: 120px;
      border-radius: 4px 4px 4px 4px;
      background: #ccc;
      margin-right: 20px;
    }
    .dec-wrap {
      width: 100%;
      .t {
        height: 25px;
        font-family:
          Source Sans 2,
          Source Sans 2;
        font-size: 15px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 22px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin: 4px 0 5px 0;
      }
      .tm {
        height: 22px;
        font-family:
          Source Sans 2,
          Source Sans 2;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 22px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-bottom: 0px;
      }
      .pr {
        display: flex;
        height: 22px;
        font-family:
          Source Sans 3,
          Source Sans 3;
        font-weight: 400;
        font-size: 12px;
        color: #6a696e;
        line-height: 20px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        span {
          &:last-child {
            margin-left: 170px;
          }
        }
        .progress-input {
          width: 50px;
          height: 20px;
          padding: 0 4px;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          font-size: 12px;
          text-align: center;
          margin: 0 2px;
          &:focus {
            border-color: #1890ff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
        }
      }
      .user-wrap {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .elprogress {
          width: 366px;
          :deep(.ant-progress-inner) {
            background-color: #ebeef5;
          }
        }
      }
    }
  }
}
//内容标题
.content-title {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  margin-left: 16px;
  i {
    width: 6px;
    height: 20px;
    background: #0d53e2;
    border-radius: 0px 0px 0px 0px;
    margin-right: 8px;
  }
  span {
    height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}
.sub-title {
  height: 22px;
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 8px;
}

//文本域
.textar-wrap {
  margin: 0 20px 28px 16px;
  width: 100%;
  .textarea {
    width: 100%;
  }
}
//底部按钮
.foot-btn {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin-left: 16px;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  .btn_left {
    margin-left: 15px;
  }
}

.drawerContent {
  display: flex;
  height: calc(100vh - 120px);
  background-color: #ffffff !important;
}
</style>
