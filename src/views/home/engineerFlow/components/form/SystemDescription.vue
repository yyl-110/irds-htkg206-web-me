<!-- 项目资料定义 -->
<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  taskId: {
    require: false,
    type: Number,
    default: () => '',
  },
  projectId: {
    require: false,
    type: Number,
    default: () => '',
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
});
const emit = defineEmits(['toUpload', 'ProjectMaterialssubmitOk', 'submitStatus']);
const dataUpload = ref<any>([]); //项目资料上传文件
const enSystemString = ref(null); //项目资料
const getDataDetail = async () => {
  // const designObj = route.query.id ? route.query : JSON.parse(localStorage.getItem('designObj'));
  let data = {};
  data.projectId = props.projectId;
  data.taskId = props.taskId;
  const res = await DesignApiInfo.querySysConfigList(data);
  console.log(res);
  if (res.data.code == '0') {
    dataUpload.value = res.data.data.pageData.ckPdmFileInfos == null ? [] : res.data.data.pageData.ckPdmFileInfos;
    enSystemString.value = res.data.data.pageData.remark;
  }
};
function toUpload() {
  if (props.isEdit) {
    return;
  }
  emit('toUpload', '系统配置文件');
}
function detaDataUpload(row: any) {
  dataUpload.value = dataUpload.value.filter((item: any) => item.id !== row.id);
}
function linkClick(url: string) {
  window.open(url);
}
// 保存
function submitOk() {
  emit('ProjectMaterialssubmitOk', enSystemString.value, dataUpload.value);
}
function submitStatus(num: any, operationType: any, nodeId?: any) {
  emit('submitStatus', num, operationType, nodeId);
}
function Changefilelist(uploadSuccesscData: any) {
  if (dataUpload.value != null && dataUpload.value.length > 0) {
    dataUpload.value = dataUpload.value.concat(uploadSuccesscData);
  } else {
    dataUpload.value = uploadSuccesscData;
  }
}

defineExpose({ getDataDetail, Changefilelist });
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
          <span>系统配置说明</span>
        </div>
        <div class="upload-layout">
          <div class="sub-title">系统配置文件：</div>
          <div class="upload-btn-wrap">
            <div class="upload-btn" :disabled="isEdit" @click="toUpload()" :style="{ cursor: isEdit ? 'not-allowed' : 'pointer', background: isEdit ? '#f5f5f5' : '' }">
              <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 20px; position: absolute; left: 35px; top: 20px" />
              <div>上传文件</div>
            </div>
            <div class="upload-dec">
              <div>文件要求</div>
              <p>格式：支持格式PDF、Word文档（DOCX）、CAD文件</p>
              <p>文件大小限制：对单个文件大小有限制，每个文档不超过100M</p>
            </div>
          </div>
        </div>

        <div class="upload-file-wrap">
          <div v-for="(item, index) in dataUpload" :key="index">
            <div class="file-list" v-if="item.url">
              <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
              <div class="file-dec">
                <div class="tit">{{ item.originalFilename }}</div>
                <div class="number">
                  <span>编号：{{ item.docNumber }}</span>
                  <div class="hover-link" @click="linkClick(item.url)">链接：{{ item.url }}</div>
                </div>
                <a-button class="elbutton" v-if="item.docNumber" :disabled="isEdit" @click="detaDataUpload(item)">
                  <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="textar-wrap">
          <div class="sub-title">系统配置说明：</div>
          <a-textarea class="textarea" :disabled="isEdit" v-model:value="enSystemString" :rows="4" placeholder="系统配置说明" />
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="isShowBottomBtns">
            <a-button @click="submitOk(4)" type="primary" :disabled="saveBtnStatus">
              <EpcIcon type="icon-baocun" style="font-size: 15px" />
              保存</a-button
            >
            <a-button class="btn_left" @click="submitStatus(4, 1, selectedKeys)" type="primary" :disabled="commitBtnStatus">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button class="btn_left" @click="submitStatus(4, 0)" type="primary" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
.box {
  width: 100%;
  height: calc(100vh - 80px);
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
</style>
