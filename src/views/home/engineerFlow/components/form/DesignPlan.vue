<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import TreeNode from '@/components/tree/TreeNode.vue';
import { boolean, string } from 'mathjs';
const props = defineProps({
  taskInfoData: {
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
  designPlanUpload: {
    require: false,
    type: Array,
    default: () => [],
  },
  designPlanString: {
    require: false,
    type: String, 
  },
  projectPlanUpload: {
    require: false,
    type: Array,
    default: () => [],
  }, 
  projectPlanString: {
    require: false,
    type: String, 
  }, 
  isEdit: {
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
const saveBtnStatus = ref<boolean>(false);
const commitBtnStatus = ref<boolean>(false);
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
      <el-row class="elrowheight">
        <div class="top-block">
          <div class="block-inner">
            <img class="pic" :src="taskInfoData.picUrl" />
            <div class="dec-wrap">
              <div class="t">{{ taskInfoData.taskName }}</div>
              <div class="tm">平台名称：{{ taskInfoData.platformName }}</div>
              <div class="tm">任务时间：{{ taskInfoData.startTime }} ~ {{ taskInfoData.endTime }}</div>
              <div class="pr">
                <span>当前进度：{{ taskInfoData.taskPercentage }}%</span><span>距截止还剩{{ taskInfoData.deadlineDays }}天</span>
              </div>
              <div class="user-wrap">
                <el-progress :stroke-width="12" :text-inside="true" :percentage="taskInfoData.taskPercentage" class="elprogress" />
                <div class="create-pop">
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <i></i>
          <span>设计计划</span>
        </div>
         <div class="upload-file-wrap">
              <div class="file-list" v-for="(item, index) in designPlanUpload" :key="index">
                <el-icon class="icon" size="40"><DocumentChecked /></el-icon>
                <div class="file-dec">
                  <div class="tit">{{ item.originalFilename }}</div>
                  <div class="number">
                    <span>编号：{{ item.docNumber }}</span
                    ><a type="primary" :href="item.url" target="_blank">连接：{{ item.url }}</a>
                  </div>
                  <!-- <el-button class="elbutton" v-if="item.url" :disabled="isEdit" @click="openPDMur(row.url)">
                    <el-icon size="20"><Position /></el-icon>
                  </el-button> -->
                </div>
              </div>
            </div>

            <div class="textar-wrap">
              <div class="sub-title">设计计划描述：</div>
              <a-textarea class="textarea" :value="props.designPlanString" :rows="4" type="textarea" placeholder="设计计划" disabled />
            </div>

            <div class="textar-wrap" style="margin-top: 28px">
              <div class="sub-title">项目计划：</div>
            </div>

            <div class="upload-file-wrap">
              <div class="file-list" v-for="(item, index) in projectPlanUpload" :key="index">
                <el-icon class="icon" size="40"><DocumentChecked /></el-icon>
                <div class="file-dec">
                  <div class="tit">{{ item.originalFilename }}</div>
                  <div class="number">
                    <span>编号：{{ item.docNumber }}</span
                    ><a type="primary" :href="item.url" target="_blank">连接：{{ item.url }}</a>
                  </div>
                  <!-- <el-button class="elbutton" v-if="item.url" :disabled="isEdit" @click="openPDMur(row.url)">
                    <el-icon size="20"><Position /></el-icon>
                  </el-button> -->
                </div>
              </div>
            </div>
            <div class="textar-wrap" style="padding-bottom: 60px">
              <div class="sub-title">项目计划描述：</div>
              <a-textarea class="textarea" :value="props.projectPlanString" :rows="4" type="textarea" placeholder="项目计划" disabled />
            </div>
      </el-row>
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
