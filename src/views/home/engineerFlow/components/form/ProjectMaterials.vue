<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import TreeNode from '@/components/tree/TreeNode.vue';
import { boolean } from 'mathjs';
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  taskInfoData1: {
    require: false,
    type: Object,
    default: () => {},
  },
  dataUpload: {
    require: false,
    type: Array,
    default: () => [],
  },
  dataString: {
    require: false,
    type: Object,
    default: () => {},
  },
    description: {
    require: false,
    type: Object,
    default: null,
  },
  isEdit: {
    require: false,
    type: Boolean,
    default: false,
  },
  commitBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  saveBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  isShowBottomBtns: {
    require: false,
    type: Boolean,
    default: false,
  },
  editBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  selectedKeys: {
    require: false,
    type: String,
    default: false,
  },
});
const emit = defineEmits(['detaDataUpload', 'toUpload', 'submitOk', 'submitStatus']);
const isShowBottomBtns = ref(true);
function toUpload() {
  emit('toUpload', '项目资料');
}
function detaDataUpload(row: any) {
  emit('detaDataUpload', row);
}
// 保存
function submitOk(type: any) {
  emit('submitOk', type);
}
function submitStatus(num: any, operationType: any, nodeId: any) {
  emit('submitStatus', num, operationType, nodeId);
}

defineExpose({});
</script>

<template>
  <div class="container">
    <div class="box">
      <a-row class="elrowheight">
        <div class="top-block">
          <div class="block-inner">
            <img class="pic" :src="taskInfoData?.picUrl" />
            <div class="dec-wrap">
              <div class="t">{{ taskInfoData?.taskName }}</div>
              <div class="tm">平台名称：{{ taskInfoData?.platformName }}</div>
              <div class="tm">任务时间：{{ taskInfoData?.startTime }} ~ {{ taskInfoData?.endTime }}</div>
              <div class="pr">
                <span>当前进度：{{ taskInfoData?.taskPercentage }}%</span><span>距截止还剩{{ taskInfoData?.deadlineDays }}天</span>
              </div>
              <div class="user-wrap">
                <el-progress :stroke-width="12" :text-inside="true" :percentage="taskInfoData?.taskPercentage" class="elprogress" />
                <div class="create-pop">
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData?.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <i></i>
          <span>项目资料</span>
        </div>
        <div class="upload-file-wrap">
          <div v-for="(item, index) in dataUpload" :key="index">
            <div class="file-list" v-if="item.url">
              <!-- <el-icon class="icon" size="40"><DocumentChecked /></el-icon> -->
              <div class="file-dec">
                <div class="tit">{{ item.originalFilename }}</div>
                <div class="number">
                  <span>编号：{{ item.docNumber }}</span>
                  <span style="margin-left: 15px;">连接：</span>
                  <a type="primary" :href="item.url" target="_blank">{{ item.url }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="textar-wrap">
          <div class="sub-title">项目资料描述：</div>
          <a-textarea  class="textarea" :disabled="true" v-model:value="taskInfoData1.dataString" :rows="4" placeholder="用户合同，技术协议，设计联络等资料" />
        </div>
      </a-row>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
.box {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  /* 设置为滚动容器，position: sticky 在其子元素上生效 */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 固定顶部区域（设计计划定义） */
.top-block {
  position: sticky;
  top: 0; /* 若页面有全局 header，调整为 header 高度（例如 64px） */
  z-index: 50;
  color: #6b778c;  /* 遮盖下方内容，保持视觉一致 */
  /* 保持原有内边距/布局，避免添加 box-shadow 以不改变视觉 */
}
</style>
