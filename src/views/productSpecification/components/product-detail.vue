<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import dayjs from 'dayjs';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { TableColumnType, TableProps, Modal, UploadFile, UploadProps } from 'ant-design-vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { handleEpcDownload } from '@/utils/file';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import taskManaement from './chirdrenComponents/taskManagementDetail.vue';
import planDeliveryFile1 from './chirdrenComponents/planDeliveryFileList.vue';
import Empty from '@/components/Empty/index.vue';
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  editStage: [type: string];
  uploadsuccess: [fileList: any];
  onFileremove: [fileList: any];
  uploadOk: any;
  reloadListData: any;
}>();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const formRef = ref();
/** 富文本对象 */
const activeKey = ref<string>('1');
const uploadData_A = ref<any>([]);
const uploadData_B = ref<any>([]);
const uploadData_C = ref<any>([]);
const uploadData_D = ref<any>([]);
const powVisible = ref<boolean>(false);
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const disabledPriview = ref<boolean>(false);
// 表单数据
let formData = reactive({
  id: 0,
  title: '',
  planCode: '',
  planName: '',
  planYear: '',
  planQuarter: '',
  initiator: userStore.getUser.id,
  initiatorName: userStore.getUser.nickname,
  planStartTime: '',
  planCompleteTime: '',
  status: '',
  actualStartTime: '',
  actualEndTime: '',
  planDescribe: '',
  planPhase: '',
  creator: '',
  createTime: '',
  updater: '',
  updateTime: '',
  deleted: '',
  fileInfoA: [],
  fileInfoB: [],
  fileInfoC: [],
  fileInfoD: [],
});

const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: flex-start;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: WeiI18n.$t('文件名称'),
    dataIndex: 'fileName',
    key: 'fileName',
    align: 'left',
    resizable: true,
    width: 400,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 300,
    fixed: 'right',
  },
]);

const planId = ref('');
function handleClosePowModal() {
  powVisible.value = false;
}
const planYearList = ref<any>([]);
const planQuarterList = ref<any>([
  {
    label: 'Q1',
    value: 'Q1',
  },
  {
    label: 'Q2',
    value: 'Q2',
  },
  {
    label: 'Q3',
    value: 'Q3',
  },
  {
    label: 'Q4',
    value: 'Q4',
  },
]);
function getPlanYearList() {
  const currentYear = new Date().getFullYear();
  const nextTenYears = Array.from({ length: 10 }, (_, i) => currentYear + 1 + i);
  planYearList.value = nextTenYears.map(year => ({
    label: year,
    value: year.toString(),
  }));
}
/**
 * 详情
 * @param id
 * @param parentId
 */
const handleModalAddOrUpdate = async (row: any, type: any) => {
  getPlanYearList();
  disabledPriview.value = type;
  planId.value = row.id;
  if (row != undefined && row != '') {
    activeKey.value = '2';
    formData = row || {};
    uploadData_A.value = row.fileInfoA || [];
    uploadData_B.value = row.fileInfoB || [];
    uploadData_C.value = row.fileInfoC || [];
    uploadData_D.value = row.fileInfoD || [];
    activeOnClick('2');
  } else {
    //添加页面，初始化所有信息
    activeKey.value = '1';
    formData = reactive({
      id: 0,
      title: '',
      planCode: '',
      planName: '',
      planYear: '',
      planQuarter: '',
      initiator: userStore.getUser.id,
      initiatorName: userStore.getUser.nickname,
      planStartTime: '',
      planCompleteTime: '',
      status: '',
      actualStartTime: '',
      actualEndTime: '',
      planDescribe: '',
      planPhase: '',
      creator: '',
      createTime: '',
      updater: '',
      updateTime: '',
      deleted: '',
      fileInfoA: [],
      fileInfoB: [],
      fileInfoC: [],
      fileInfoD: [],
    });
    uploadData_A.value = [];
    uploadData_B.value = [];
    uploadData_C.value = [];
    uploadData_D.value = [];
  }
};

const activeOnClick = async (newTab: string) => {
  activeKey.value = newTab;
  if (newTab == '2') {
    nextTick(() => {
      taskManaementRef.value?.reloadTaskInfo(planId.value, formData.planStartTime, formData.planCompleteTime, formData.planPhase);
    });
  } else if (newTab == '3') {
    nextTick(() => {
      planDeliverylistRef2.value?.reloadTaskInfosss(planId.value);
    });
  }
};

const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

const onSubmitFormData = async () => {
  await formRef.value?.validate();
  formData.fileInfoA = uploadData_A.value || [];
  formData.fileInfoB = uploadData_B.value || [];
  formData.fileInfoC = uploadData_C.value || [];
  formData.fileInfoD = uploadData_D.value || [];
  if (formData.id) {
    const res = await AdminApiSystemProductSpecification.productSpecificationInfoUpdate(formData);
    if (res.data.code == 200) {
      message.success('修改成功!');
      activeKey.value = '2';
      activeOnClick('2');
    } else {
      message.success('修改失败。');
    }
  } else {
    formData.planPhase = '1';
    const res = await AdminApiSystemProductSpecification.productSpecificationInfoAdd(formData);
    if (res.data.code == 200) {
      formData.id = res.data.data;
      planId.value = formData.id.toString();
      message.success('添加成功!');
      const resA = await AdminApiSystemProductSpecification.createTask(formData);
      nextTick(() => {
        activeKey.value = '2';
        activeOnClick('2');
      });
    } else {
      message.success('添加失败。');
    }
  }
  emit('onClose', true);
};

const disabledDate = (current: any) => {
  return current && current < dayjs().startOf('day');
};

function cancel() {
  emit('onClose', false);
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
    if (res.data.code == 200) {
      message.success(WeiI18n.t('上传成功').value);
      switch (type) {
        case 1:
          uploadData_A.value.push({
            fileId: res.data.data.id,
            type: '1',
            oldFileName: res.data.data.oldFileName,
            fileName: res.data.data.newFileName,
            filePath: imgRooturl + res.data.data.newFileName,
            pdfFileName: imgRooturl + res.data.data.pdfFileName,
          });
          break;
        case 2:
          uploadData_B.value.push({
            fileId: res.data.data.id,
            type: '2',
            oldFileName: res.data.data.oldFileName,
            fileName: res.data.data.newFileName,
            filePath: imgRooturl + res.data.data.newFileName,
            pdfFileName: imgRooturl + res.data.data.pdfFileName,
          });
          break;
        case 3:
          uploadData_C.value.push({
            fileId: res.data.data.id,
            type: '3',
            oldFileName: res.data.data.oldFileName,
            fileName: res.data.data.newFileName,
            filePath: imgRooturl + res.data.data.newFileName,
            pdfFileName: imgRooturl + res.data.data.pdfFileName,
          });
          break;
        case 4:
          uploadData_D.value.push({
            fileId: res.data.data.id,
            type: '4',
            oldFileName: res.data.data.oldFileName,
            fileName: res.data.data.newFileName,
            filePath: imgRooturl + res.data.data.newFileName,
            pdfFileName: imgRooturl + res.data.data.pdfFileName,
          });
          break;
        default:
          break;
      }
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

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

async function removeFile(row: any) {
  var type = row.type;
  var fileId = row.fileId;

  // 弹出确认对话框
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该文件吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      // 用户确认后执行删除操作
      switch (type) {
        case '1':
          // 从uploadData_A数组中删除指定id的文件
          uploadData_A.value = uploadData_A.value.filter((item: any) => item.fileId !== fileId);
          message.success('文件删除成功');
          break;
        case '2':
          // 从uploadData_B数组中删除指定id的文件
          uploadData_B.value = uploadData_B.value.filter((item: any) => item.fileId !== fileId);
          message.success('文件删除成功');
          break;
        case '3':
          // 从uploadData_C数组中删除指定id的文件
          uploadData_C.value = uploadData_C.value.filter((item: any) => item.fileId !== fileId);
          message.success('文件删除成功');
          break;
        case '4':
          // 从uploadData_D数组中删除指定id的文件
          uploadData_D.value = uploadData_D.value.filter((item: any) => item.fileId !== fileId);
          message.success('文件删除成功');
          break;
        default:
          message.warning('未知文件类型');
          break;
      }
    },
  });
}

async function downFile(row: any) {
  const downLoadItem = {
    fileId: row.fileId,
  };
  handleEpcDownload(downLoadItem, row.oldFileName);
}
const taskManaementRef = ref();
const planDeliverylistRef2 = ref();
async function reloadListData() {
  emit('reloadListData', false);
}

defineExpose({ handleModalAddOrUpdate });
</script>
<template>
  <div>
    <a-modal width="100%" wrapClassName="full-modal" v-model:visible="visible" :mask-closable="false" @cancel="cancel">
      <a-tabs @tab-click="activeOnClick" v-model:activeKey="activeKey" :tabBarStyle="{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', width: '80%' }">
        <a-tab-pane key="1" tab="产品规划信息">
          <div class="scrollable-content">
            <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '120px' } }" style="padding-top: 20px">
              <div class="pagecontent-title">
                <i></i>
                <span>产品规划信息</span>
              </div>
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    style="margin-left: 100px"
                    :label="$t('产品规划编号')"
                    name="planCode"
                    :rules="[{ required: true, message: `${$t('请输入产品规划编号')}` }]"
                    class="f-item">
                    <a-input style="width: 300px" disabled="true" v-model:value="formData.planCode" :placeholder="'请输入产品规划编号'" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="$t('产品规划名称')" name="planName" :rules="[{ required: true, message: `${$t('请输入产品规划名称')}` }]" class="f-item">
                    <a-input style="width: 300px" disabled="true" v-model:value="formData.planName" :placeholder="'请输入产品规划名称'" />
                  </a-form-item>
                </a-col>
              </a-row>
              <!-- <a-row>
                <a-col :span="12">
                  <a-form-item
                    style="margin-left: 100px"
                    :label="$t('产品规划年度')"
                    name="planYear"
                    :rules="[{ required: true, message: `${$t('请选择产品规划年度')}` }]"
                    class="f-item">
                    <a-select allowClear :disabled="disabledPriview" v-model:value="formData.planYear" placeholder="请选择产品规划年度" style="width: 300px">
                      <a-select-option v-for="item in planYearList" :key="item.value" :value="item.value">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="$t('产品规划季度')" name="planQuarter" :rules="[{ required: true, message: `${$t('请选择产品规划季度')}` }]" class="f-item">
                    <a-select allowClear :disabled="disabledPriview" v-model:value="formData.planQuarter" placeholder="请选择产品规划季度" style="width: 300px">
                      <a-select-option v-for="item in planQuarterList" :key="item.value" :value="item.value">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row> -->
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('计划开始时间')"
                    style="margin-left: 100px"
                    name="planStartTime"
                    :rules="[{ required: true, message: `${$t('请选择时间')}` }]"
                    class="f-item">
                    <a-date-picker
                      :locale="locale"
                      :disabled-date="disabledDate"
                      v-model:value="formData.planStartTime"
                      disabled="true"
                      format="YYYY-MM-DD "
                      value-format="YYYY-MM-DD"
                      style="width: 300px; text-align: left"
                      :placeholder="'计划开始时间'" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="$t('计划完成时间')" :rules="[{ required: true, message: `${$t('请选择时间')}` }]" name="planCompleteTime" class="f-item">
                    <a-date-picker
                      :locale="locale"
                      :disabled-date="disabledDate"
                      v-model:value="formData.planCompleteTime"
                      disabled="true"
                      format="YYYY-MM-DD "
                      value-format="YYYY-MM-DD"
                      style="width: 300px; text-align: left"
                      :placeholder="'计划完成时间'" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-item :label="$t('实际开始时间')" style="margin-left: 100px" name="actualStartTime" class="f-item">
                    <a-input style="width: 300px" :disabled="true" v-model:value="formData.actualStartTime" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="$t('实际完成时间')" name="actualEndTime" class="f-item">
                    <a-input style="width: 300px" :disabled="true" v-model:value="formData.actualEndTime" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-item style="margin-left: 100px" :label="$t('发起人')" name="initiatorName" class="f-item">
                    <a-input style="width: 300px" :disabled="true" v-model:value="formData.initiatorName" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="18">
                  <a-form-item style="margin-left: 100px" :label="$t('产品规划详细描述')" name="planDescribe" class="f-item">
                    <a-textarea v-model:value="formData.planDescribe" :disabled="true" :rows="4" placeholder="请输入产品规划详细描述" />
                  </a-form-item>
                </a-col>
              </a-row>
              <div class="pagecontent-title">
                <i></i>
                <span>上期规划资料</span>
              </div>
              <!-- 产品规划资料定义-->
              <a-row>
                <a-col :span="12">
                  <a-form-item style="margin-left: 100px; font-weight: bold; padding: 0" :label="$t('产品规划资料')" name="plan_code" class="f-item"></a-form-item>
                </a-col>
              </a-row>
              <a-row> </a-row>
              <a-row>
                <a-col :span="18">
                  <a-table :locale="localeA" style="margin-left: 60px; overflow-y: auto" :columns="columns" :pagination="false" :data-source="uploadData_A">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.dataIndex === 'fileName'">
                        <a @click="priview(record)">{{ record.oldFileName }}</a>
                      </template>
                      <template v-if="column.dataIndex === 'operation'">
                        <a-button @click="downFile(record)" type="link">下载</a-button>
                      </template>
                    </template>
                  </a-table>
                </a-col>
              </a-row>

              <!-- 国内铁路市场定义-->
              <a-row>
                <a-col :span="12">
                  <a-form-item style="margin-left: 100px; font-weight: bold; margin-top: 20px" :label="$t('国内铁路市场')" name="plan_code" class="f-item"> </a-form-item>
                </a-col>
              </a-row>
              <a-row> </a-row>
              <a-row>
                <a-col :span="18">
                  <a-table :locale="localeA" style="margin-left: 60px; overflow-y: auto" :columns="columns" :pagination="false" :data-source="uploadData_B">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.dataIndex === 'fileName'">
                        <a @click="priview(record)">{{ record.oldFileName }}</a>
                      </template>
                      <template v-if="column.dataIndex === 'operation'">
                        <a-button @click="downFile(record)" type="link">下载</a-button>
                      </template>
                    </template>
                  </a-table>
                </a-col>
              </a-row>

              <!-- 国内城铁市场定义-->
              <a-row>
                <a-col :span="12">
                  <a-form-item style="margin-left: 100px; font-weight: bold; margin-top: 20px" :label="$t('国内城铁市场')" name="plan_code" class="f-item"> </a-form-item>
                </a-col>
              </a-row>
              <a-row> </a-row>
              <a-row>
                <a-col :span="18">
                  <a-table :locale="localeA" style="margin-left: 60px; overflow-y: auto" :columns="columns" :pagination="false" :data-source="uploadData_C">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.dataIndex === 'fileName'">
                        <a @click="priview(record)">{{ record.oldFileName }}</a>
                      </template>
                      <template v-if="column.dataIndex === 'operation'">
                        <a-button @click="downFile(record)" type="link">下载</a-button>
                      </template>
                    </template>
                  </a-table>
                </a-col>
              </a-row>

              <!-- 海外产品市场定义-->
              <a-row>
                <a-col :span="12">
                  <a-form-item style="margin-left: 100px; font-weight: bold; margin-top: 20px" :label="$t('海外产品市场')" name="plan_code" class="f-item"> </a-form-item>
                </a-col>
              </a-row>
              <a-row> </a-row>
              <a-row>
                <a-col :span="18">
                  <a-table :locale="localeA" style="margin-left: 60px; overflow-y: auto" :columns="columns" :pagination="false" :data-source="uploadData_D">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.dataIndex === 'fileName'">
                        <a @click="priview(record)">{{ record.oldFileName }}</a>
                      </template>
                      <template v-if="column.dataIndex === 'operation'">
                        <a-button @click="downFile(record)" type="link">下载</a-button>
                      </template>
                    </template>
                  </a-table>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="任务管理">
          <taskManaement ref="taskManaementRef" @reloadListData="reloadListData" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="交付清单">
          <planDeliveryFile1 ref="planDeliverylistRef2" />
        </a-tab-pane>
      </a-tabs>
      <!-- 固定的底部按钮区域 -->
      <template #footer>
        <div class="fixed-footer">
          <a-button @click="cancel" type="primary"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
        </div>
      </template>
    </a-modal>
    <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
  </div>
</template>

<style scoped lang="less">
.upload-btn-wrap {
  margin-left: 120px;
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
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .ant-modal-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-modal-body {
    flex: 1;
    overflow: hidden;
    padding: 0;
  }
  .ant-modal-footer {
    position: sticky;
    bottom: 0;
    z-index: 100;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
}

.fixed-title {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 16px;
  font-weight: 500;
}

.fixed-title span:not(:first-child) {
  font-size: 14px;
  color: #666;
}

.scrollable-content {
  height: calc(100vh - 170px);
  overflow-y: auto;
  padding: 0 24px;
}

.tab-content {
  padding-bottom: 24px;
}

.conter_title {
  margin-top: 5px;
  font-weight: bold; /* 等同于 700，标准加粗 */
}

/* 滚动条样式优化 */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
