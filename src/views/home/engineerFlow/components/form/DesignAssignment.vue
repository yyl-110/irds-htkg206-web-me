<script lang="ts" setup>
// 系统功能配置
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
  dataUpload: {
    require: false,
    type: Array,
    default: () => [],
  },
  gbomPlatformTableData: {
    require: false,
    type: Array,
    default: () => [],
  },
  compliance: {
    require: false,
    type: String,
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
  commitBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  editBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  saveBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  isShowBottomBtns:{
    require: false,
    type: Boolean,
    default: true,
  }
});
const emit = defineEmits(['detaDataUpload', 'toUpload', 'submitOk', 'submitStatus',"ProjectMaterialssubmitOk"]);
const selfIsShowBottomBtns = ref(true);
const enInpuColorType = reactive<any>({}); // 控制参数展示状态
// 保存
function submitOk(type: any) {
  emit('ProjectMaterialssubmitOk', type,props.gbomPlatformTableData);
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
            <img class="pic" :src="taskInfoData.picUrl" />
            <div class="dec-wrap">
              <div class="t">{{ taskInfoData.taskName }}</div>
              <div class="tm">平台名称：{{ taskInfoData.platformName }}</div>
              <div class="tm">任务时间：{{ taskInfoData.startTime }} ~ {{ taskInfoData.endTime }}</div>
              <div class="pr">
                <span>当前进度：{{ taskInfoData.taskPercentage }}%</span><span>距截止还剩{{ taskInfoData.deadlineDays }}天</span>
              </div>
              <div class="user-wrap">
                <a-progress status="active" :percent="taskInfoData?.taskPercentage" class="elprogress" />
                <div class="create-pop">
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData?.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <i></i>
          <span>定义系统参数</span>
        </div>
        <div class="textar-wrap" style="margin-bottom: -15px">
              <div class="sub-title">符合性：</div>
            </div>
            <div style="margin: 20px 0 16px 16px; width: 240px; overflow: hidden">
              <a-input disabled v-model:value="props.compliance" placeholder="符合性..." style="width: 234px" />
            </div>
            <div class="textar-wrap" style="margin-bottom: -15px">
              <div class="sub-title">参数：</div>
            </div>
            <div v-for="item in gbomPlatformTableData" :key="item.id" style="margin: 20px 0 0px 16px; width: 240px; overflow: hidden">
              <a-row>
                <a-col :span="24">
                  <div class="top-title">{{ item.parameterName }}：</div>
                </a-col>
                <a-col :span="24" v-if="+item.parameterType === 2">
                  <a-select :disabled="isEdit" v-model:value="item.value" placeholder="选择值" style="width: 234px">
                    <a-option label="是" value="是" />
                    <a-option label="否" value="否" />
                  </a-select>
                  
                </a-col>

                <a-col :span="24" v-else-if="+item.type === 2">
                  <a-select :disabled="isEdit" v-model:value="item.value" placeholder="选择值" style="width: 234px">
                    <a-option v-for="subitem in item.tabulations" :key="subitem.id" :label="subitem.value" :value="subitem.value" />
                  </a-select>
                  
                </a-col>
                <a-col :span="24" v-else-if="+item.parameterType === 1">
                  <a-input :disabled="isEdit" v-model:value="item.value" placeholder="暂无参数值..." style="width: 234px" />
                   
                </a-col>
                <a-col :span="24" v-else-if="+item.type === 1">
                  <a-input-number
                    :class="{
                      'number-left': true,
                      'green-left': +enInpuColorType[item.id] == 3,
                      'yellow-left': +enInpuColorType[item.id] == 2,
                      'red-left': +enInpuColorType[item.id] == 1,
                    }"
                    controls-position="right"
                    v-model:value="item.value"
                    placeholder="请填写数字..."
                    :controls="false"
                     
                    style="width: 234px"
                    :disabled="isEdit" />
                  
                  <div
                    style="margin-top: 5px; color: red; font-size: 12px"
                    v-if="
                      (item.id == seriesParameterId && enInpuColorType[item.id] == 2 && inputInfo) || (item.id == seriesParameterId && enInpuColorType[item.id] == 1 && inputInfo)
                    ">
                    {{ inputInfo }}
                  </div>
                </a-col>
                <a-col :span="24" v-else>
                  <a-input-number
                    :class="{
                      'number-left': true,
                      'green-left': +enInpuColorType[item.id] == 3,
                      'yellow-left': +enInpuColorType[item.id] == 2,
                      'red-left': +enInpuColorType[item.id] == 1,
                    }"
                    controls-position="right"
                    v-model:value="item.value"
                    placeholder="请填写数字..."
                    :controls="false"
                    
                    style="width: 234px"
                    :disabled="isEdit" />
                   
                  <div
                    style="margin-top: 5px; color: red; font-size: 12px"
                    v-if="
                      (item.id == seriesParameterId && enInpuColorType[item.id] == 2 && inputInfo) || (item.id == seriesParameterId && enInpuColorType[item.id] == 1 && inputInfo)
                    ">
                    {{ inputInfo }}
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="foot-btn" style="margin-top: 28px">
              <div class="backBtn" v-if="selfIsShowBottomBtns && isShowBottomBtns">
                <a-button @click="submitOk(1)" type="primary" :disabled="saveBtnStatus">
                  <EpcIcon type="icon-baocun" style="font-size: 15px" />
                  &nbsp;保存</a-button
                >
                <a-button style="margin-left: 10px;" type="primary" @click="submitStatus(1, 1, selectedKeys)" :disabled="commitBtnStatus">
                   <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
                  &nbsp;提交</a-button
                >
                <a-button style="margin-left: 10px;" @click="submitStatus(1,0)" type="primary" :disabled="editBtnStatus">
                    <EpcIcon type="icon-edit" style="font-size: 15px" />
                  &nbsp;编辑</a-button
                >
              </div>
            </div>
      </a-row>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
@import '../../../../../sheets/collapse.less';
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
  color: #6b778c;
  // background: #fff; /* 遮盖下方内容，保持视觉一致 */
  /* 保持原有内边距/布局，避免添加 box-shadow 以不改变视觉 */
}
.top-title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
  cursor: default;
}
/* 调整折叠面板样式 */
:deep(.ant-collapse-header) {
  background-color: #fafafa;
  border-radius: 2px 2px 0 0;
}
:deep(.ant-collapse-content) {
  padding: 16px 0 !important;
}
/* 调整输入框样式 */
:deep(.ant-input-disabled) {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.65);
  border-color: #d9d9d9;
  height: 32px;
}
/* 调整行间距 */
:deep(.ant-row) {
  margin-bottom: 8px;
}
/* 增加标签与输入框间距 */
:deep(.ant-col-8) {
  padding-right: 16px;
}
</style>
