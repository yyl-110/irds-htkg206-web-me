<script setup lang="ts">
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  elTagcheckedOneData: {
    type: Array,
    default: () => [],
  },
  elTagcheckedTwoData: {
    type: Array,
    default: () => [],
  },
  elTagcheckedOneStatus: Boolean,
  elTagcheckedTwoStatus: Boolean,
  hiddenStatus: Boolean,
});

const emit = defineEmits(['onChangeElCheckTagOne', 'onChangeElCheckTagTwo', 'onOffFun']);

const type1 = ref([]);
const type2 = ref([]);

const tagChangeOne = (item, index) => {
  emit('onChangeElCheckTagOne', !item.check, item, index);
};

const tagChangeTwo = val => {
  emit('onChangeElCheckTagTwo', val);
};

const clickOffFun = val => {
  emit('onOffFun', val);
};

const tag2 = computed(() =>
  props.elTagcheckedTwoData.map(item => ({
    label: item.nodeName,
    value: item.id,
  })),
);
</script>

<template>
  <div class="classify">
    <div v-if="elTagcheckedOneData.length > 0" class="cla-list">
      <div class="total">
        <div class="second">
          <span class="secondSpan flex-shrink-0">所属类目1：</span>
          <div class="el-check-tag-wrap1">
            <a-checkbox v-for="(item, index) in elTagcheckedOneData" :key="item.id" :checked="item.check" @change="val => tagChangeOne(item, index)">{{
              item.nodeName
            }}</a-checkbox>
          </div>
        </div>
        <span v-if="elTagcheckedOneData.length > 11" class="btn" @click="clickOffFun('elTagcheckedOne')">
          <span v-if="!elTagcheckedOneStatus">展开<down-outlined /></span>
          <span v-else>收起<UpOutlined /></span>
        </span>
      </div>
    </div>
    <div v-if="hiddenStatus && elTagcheckedTwoData.length > 0 && elTagcheckedOneData.length > 0" class="cla-list">
      <div class="total">
        <div class="second">
          <span class="secondSpan flex-shrink-0">所属类目2：</span>
          <div class="el-check-tag-wrap1">
            <a-checkbox-group v-model:value="type2" :options="tag2" @change="tagChangeTwo" />
          </div>
        </div>
        <span v-if="elTagcheckedTwoData.length > 11" class="btn" @click="clickOffFun('elTagcheckedTwo')">
          <span v-if="!elTagcheckedTwoStatus">展开<DownOutlined /></span>
          <span v-else>收起<UpOutlined /></span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.classify {
  margin-top: 0.3125rem;
  max-height: 200px;
  background: #ffffff;
  border-radius: 4px;
  // margin-bottom: 10px;
  width: 100%;
  overflow: auto;
  .cla-list {
    padding: 0 20px 0 0;
    display: flex;
    align-items: center;
    .total {
      display: flex;
      justify-content: space-between;
      .second {
        display: flex;
        // align-items: center;
        .secondSpan {
          line-height: 36px;
          width: 80px;
          // margin-top: 7px;
          color: #333;
          font-weight: 400;
          font-size: 14px;
        }
        .el-check-tag-wrap {
          min-height: 28px;
          margin-right: 50px;
          display: flex;
          flex-wrap: wrap;
          line-height: 33px;
          // align-items: center;
          .elCheckTag {
            // margin-right: 24px;
            // margin-top: 5px;
            color: #333;
            font-weight: 400;
            font-size: 14px;
            border-radius: 0;
            background-color: #f2f5f7;
            width: 5rem;
          }
          :deep(.is-checked) {
            background-color: #f2f5f7;
            font-family:
              Source Sans 3,
              Source Sans 3;
            font-weight: 600;
            font-size: 14px;
            color: #1366d1;
          }
        }
        .el-check-tag-wrap1 {
          min-height: 28px;
          margin-right: 50px;
          display: flex;
          flex-wrap: wrap;
          line-height: 33px;
          .ant-checkbox-group {
            display: inline-flex;
            align-items: center;
            flex-wrap: wrap;
          }
          // align-items: center;
          .elCheckTag {
            // margin-right: 60px;
            // margin-top: 5px;
            color: #333;
            font-weight: 400;
            font-size: 14px;
            border-radius: 0;
            width: 5rem;
            // background-color: #f2f5f7;
          }
          :deep(.is-checked) {
            // background-color: #1366d1;
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.2) !important;
            .el-checkbox__label {
              color: #313133;
            }
            .el-checkbox__inner {
              background-color: #1366d1;
            }
          }
        }
      }
      .btn {
        font-size: 14px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        color: #155bd4;
        cursor: pointer;
        margin-left: 18px;
        vertical-align: middle;
        // margin-top: 5px;
        width: 45px;
        height: 30px;
      }
      &:last-child {
        border: none;
      }
    }
    &:last-child {
      border-bottom: 1px solid #eaeaf1;
      padding-bottom: 0.5rem;
    }
  }
}
</style>
