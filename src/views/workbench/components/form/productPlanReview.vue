<script lang="ts" setup>
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import type { UnwrapRef } from 'vue';
import { message, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
const props = defineProps({
  modalVisible: {
    require: false,
    type: Boolean,
  },
  basicId: {
    require: true,
    type: String,
    default: () => '',
  },
});
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const process = ref('1');
const loading = ref<boolean>(false);
const userStore = useUserStore();
const emit = defineEmits(['close', 'refreshTableData', 'SubmitFormData']);
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
// 提交数据方法
const onSubmitFormData = async (type: string) => {
  if (itemReviewConclusion.value == '' || itemReviewConclusion.value == undefined || itemReviewConclusion.value == null) {
    message.error('请选择评审结论');
    return;
  }
  let data = {
    saveStatus: 1,
    planId: planTask.value.planId,
    id: planTask.value.id,
    itemReviewConclusion: itemReviewConclusion.value,
    itemReviewInstr: itemReviewInstr.value,
    proveFileId: proveFileId.value,
  };
  if (type == 'save') {
    data.saveStatus = 1;
  } else {
    data.saveStatus = 2;
  }
  const res = await AdminApiProductPlanTaskDesign.updateProvePlanTeamUserId(data);
  if (res.data.code == 200) {
    emit('refreshTableData');
    emit('close');
    message.success('操作成功');
  }
};
const Detailsflag = ref(false);
const fileListDataEnds = ref<any>([]);
const proveFileListData = ref<any>([]);
const proveFileId = ref<string>('');
function linkClick(url: string) {
  window.open(url);
}
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
const selectStr = [
  { label: '通过，进入制定产品组合策略阶段', value: '通过，进入制定产品组合策略阶段' },
  { label: '不通过，重新编制产品组合对象清单', value: '不通过，重新编制产品组合对象清单' },
];
const itemReviewConclusion = ref<any>('');
const itemReviewInstr = ref<string>('');
async function priview(row: any) {
  const lastDotIndex = row.fileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.fileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
function delEnSystemUpload(row: any) {
  proveFileListData.value = proveFileListData.value.filter((item: any) => item.fileId !== row.fileId);
}
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};
async function customRequest(options: any, type: any) {
  // 调用上传接口
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      proveFileListData.value = [];
      proveFileId.value = res.data.data.id;
      proveFileListData.value.push({
        fileId: res.data.data.id,
        type: '1',
        oldFileName: res.data.data.oldFileName,
        fileName: res.data.data.newFileName,
        filePath: imgRooturl + res.data.data.newFileName,
        pdfFileName: imgRooturl + res.data.data.pdfFileName,
      });
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}
function handleClosePowModal() {
  powVisible.value = false;
}
const planTask = ref<any>({});
const ViewDetails = async (row: any, type: string) => {
  loading.value = true;
  try {
    planTask.value = row;
    let data = {
      planId: row.planId,
      id: row.id,
      type: type,
    };
    if (type == 'detail') {
      Detailsflag.value = true;
    } else {
      Detailsflag.value = false;
    }
    const res = await AdminApiProductPlanTaskDesign.getpriviewDTO(data);
    if (res.data.code == 200) {
      fileListDataEnds.value = res.data.data.fileListDataEnds;
      proveFileListData.value = res.data.data.proveFileListData;
      proveFileId.value = res.data.data.proveFileId;
      itemReviewConclusion.value = res.data.data.itemReviewConclusion;
      itemReviewInstr.value = res.data.data.itemReviewInstr;
    }
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
};
function Photopath() {
  if (process.value == '1') {
    return new URL(`../../../../assets/images/process1.png`, import.meta.url).href;
  } else if (process.value == '2') {
    return new URL(`../../../../assets/images/process2.png`, import.meta.url).href;
  } else if (process.value == '3') {
    return new URL(`../../../../assets/images/process3.png`, import.meta.url).href;
  } else if (process.value == '4') {
    return new URL(`../../../../assets/images/process4.png`, import.meta.url).href;
  } else if (process.value == '5') {
    return new URL(`../../../../assets/images/process5.png`, import.meta.url).href;
  }
}
/** close */
const handleClose = () => {
  // 通过事件传过去
  emit('close');
};
defineExpose({
  ViewDetails,
});
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.productPlanReview');
}
</script>

<template>
  <div class="productPlanReview" v-dragModal>
    <a-modal
      v-model:visible="visible"
      style="width: 90%"
      :title="'产品组合清单评审'"
      :ok-text="false"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :getContainer="customGetContainer"
      @cancel="handleClose">
      <a-spin :spinning="loading" tip="加载中...">
        <div class="decision-analysis-container">
          <!-- 需求信息部分 -->
          <a-card class="requirement-card">
            <div class="pagecontent-title">
              <i></i>
              <span>产品组合对象清单</span>
            </div>
            <div class="upload-file-wrap">
              <div v-for="(item, index) in fileListDataEnds" :key="index">
                <div class="file-list">
                  <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                  <div class="file-dec">
                    <div class="tit">{{ item.oldFileName }}</div>
                    <div class="number">
                      <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                    </div>
                    <a-button class="elbutton" @click="priview(item)">
                      <EpcIcon type="icon-liulan" style="font-size: 15px" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
          <!-- 流程人员选取部分 -->
          <a-card class="personnel-selection-card">
            <div class="pagecontent-title">
              <i></i>
              <span>评审结论及结论</span>
            </div>
            <div style="display: flex">
              <div class="role-user-container">
                <div class="role-item">
                  <div class="role-label">评审结论：</div>
                  <a-select v-model:value="itemReviewConclusion" placeholder="请选择评审结论" :style="{ width: '300px', top: '3px' }" allowClear>
                    <a-select-option v-for="option in selectStr" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                  <div class="role-label" style="margin-left: 180px">评审说明：</div>
                  <a-textarea v-model:value="itemReviewInstr" placeholder="请输入评审说明" style="width: 500px; height: 150px" allowClear />
                </div>
              </div>
            </div>
            <div class="role-user-container" style="margin-top: 20px">
              <div class="role-item">
                <span class="role-label">证明材料：</span>
              </div>
            </div>
            <a-row>
              <div class="upload-btn-wrap">
                <div class="block">
                  <div class="file-uploaad">
                    <a-upload ref="fileUpload" multiple type="drag" :before-upload="beforeUpload" :custom-request="options => customRequest(options, 1)" :show-upload-list="false">
                      <div style="padding: 10px">
                        <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 30px; position: absolute; left: 45px; top: 20px" />
                        <div style="margin-top: 30px">上传文件</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
                <div class="upload-dec">
                  <div>文件要求</div>
                  <p>格式：支持格式为PDF、Word、Excel...文档</p>
                  <p>文件大小限制：对单个文件大小有限制，每个文档不超过20M</p>
                </div>
              </div>
            </a-row>
            <div class="upload-file-wrap">
              <div v-for="(item, index) in proveFileListData" :key="index">
                <div class="file-list">
                  <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                  <div class="file-dec">
                    <div class="tit">{{ item.oldFileName }}</div>
                    <div class="number">
                      <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                    </div>
                    <a-button class="elbuttoAn" @click="priview(item)">
                      <EpcIcon type="icon-liulan" style="font-size: 15px" />
                    </a-button>
                    <a-button class="elbutton" @click="delEnSystemUpload(item)">
                      <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </a-spin>
      <template #footer>
        <a-button v-if="!Detailsflag" @click="onSubmitFormData('save')" type="primary">
          <EpcIcon type="icon-baocun" style="font-size: 15px" />
          保存</a-button
        >
        <a-button v-if="!Detailsflag" @click="onSubmitFormData('submit')" type="primary">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
          提交</a-button
        >
        <a-button v-if="Detailsflag" @click="handleClose" type="primary"> 取消</a-button>
      </template>
    </a-modal>
  </div>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
.decision-analysis-container {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.requirement-card {
  margin-bottom: 20px;
}

.personnel-selection-card {
  margin-bottom: 20px;
}

.role-user-container {
  display: flex;
  flex-wrap: wrap;
}

.role-item {
  margin-right: 20px;
  margin-bottom: 10px;
}

.role-label {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
  text-align: right;
}

.process-diagram {
  width: 90%;
  height: auto;
}

.action-buttons {
  text-align: right;
}

//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 10px;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 50px);
  .file-list {
    min-width: 493px;
    max-width: 493px;
    height: 72px;
    background: #f3f2f7;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    margin-right: 12px;
    margin-bottom: 12px;
    .icon {
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      color: #0d53e2;
      margin: 15px 13px 20px 15px;
    }
    .file-dec {
      position: relative;
      width: 100%;
      .tit {
        margin: 16px 0 4px 0;
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
      }
      .number {
        display: flex;
        align-items: center;
        height: 12px;
        font-family:
          Source Sans 3,
          Source Sans 3;
        font-weight: 400;
        font-size: 12px;
        color: #6a696e;
        line-height: 12px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        .hover-link {
          font-size: 12px !important;
          height: 14px;
          width: 280px;
          overflow: hidden;
          color: #0d53e2;
          cursor: pointer;
        }
      }
      .elbutton {
        position: absolute;
        right: 0px;
        top: 20px;
        background: none !important;
        border: none !important;
      }
      .elbuttoAn {
        position: absolute;
        right: 30px;
        top: 20px;
        background: none !important;
        border: none !important;
      }
    }
  }
}

.upload-btn-wrap {
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  .block {
    margin-top: 2px;
    width: 122px;
    margin-bottom: 20px;
    height: 100px;
    border-radius: 8px;
    // border: 1px solid #d3d2d9;
    cursor: pointer;
  }
  .upload-dec {
    margin-top: 13px;
    margin-left: 15px;
    font-weight: Regular;
    font-style: Source Sans 3-Regular;
    div {
      margin: 9px 0;
      color: #6a696e;
    }
    p {
      color: #a2a1a6;
      font-size: 12px;
    }
    .correlationBtn {
      margin-top: 5px;
    }
  }
}
</style>
