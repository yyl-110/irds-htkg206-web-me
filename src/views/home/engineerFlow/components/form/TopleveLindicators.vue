<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import TreeNode from '@/components/tree/TreeNode.vue';
import { boolean } from 'mathjs';
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
  seriesTableData: {
    require: false,
    type: Array,
    default: () => [],
  },
  dataString: {
    require: false,
    type: Object,
    default: () => {},
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
    taskId: {
    require: false,
    type: Number,
    default: () => '',
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
function exportTop() {
  const data: any = {};
  data.taskId = props.taskId;
  DesignApiInfo.ckProjectexportDataApi(data).then(function (res) {
    const fileName = '顶层指标.xlsx';
    downloadFileFromStream(res, fileName);
  });
}
// 下载数据
function downloadFileFromStream(stream: any, fileName:string){
  const blob = new Blob([stream], { type: 'application/octet-stream' });
  if (navigator.msSaveBlob) {
    // 兼容性处理，适用于 Internet Explorer 和 Edge
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

defineExpose({});
</script>

<template>
  <div class="container">
    <div class="box">
      <a-row class="elrowheight">
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
                <a-progress :stroke-width="12" :text-inside="true" :percentage="taskInfoData.taskPercentage" class="elprogress" />
                <div class="create-pop">
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <!-- {{seriesTableData.map(intem => intem.value).join(',')}} -->
          <i></i>
          <span>顶层指标</span>
        </div>
        <div style="width: 100%; margin-left: 16px; margin-bottom: 16px">
          <a-button @click="exportTop" type="primary">数据导出</a-button>
        </div>
        <a-row class="elrowheight" style="padding-bottom: 60px; height: 700px; overflow-y: auto;">
          <div v-for="item in seriesTableData" :key="item.id" style="margin: 20px 0 0px 16px; width: 240px; overflow: hidden">
            <a-row>
              <a-col :span="24">
                <div class="top-title">{{ item.parameterName }}：</div>
              </a-col>
              <a-col :span="24" >
                <a-input disabled v-model:value="item.value" placeholder="暂无参数值..." style="width: 234px" />
              </a-col>
            </a-row>
          </div>
        </a-row>
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

.top-title {
  height: 100%;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
