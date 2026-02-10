<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, UploadProps } from 'ant-design-vue';
const { TabPane: ATabPane } = ATabs;
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import DesignTree from '@/components/tree/DesignTree.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { handleEpcDownload } from '@/utils/file';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
const userStore = useUserStore();
const props = defineProps({
  paramDisabled: {
    require: false,
    type: Boolean,
    default: '',
  },
  titleInfo: {
    require: false,
    type: String,
    default: '',
  },
  uploadInfoData: {
    require: false,
    type: Array,
    default: () => [],
  },
  planTaskInfo: {
    require: false,
    type: Object,
    default: () => {},
  },
});
const isdownload = ref<boolean>(true);
const uploadColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
    ellipsis: true,
    align: 'left',
    width: 150,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.fileName, b.fileName),
  },
  {
    title: '文件编号',
    dataIndex: 'fileNumber',
    key: 'fileNumber',
    align: 'left',
    width: 150,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.fileNumber, b.fileNumber),
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    align: 'center',
    width: 80,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
  },
  {
    title: '责任人',
    dataIndex: 'headerUserName',
    key: 'headerUserName',
    align: 'center',
    width: 100,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.headerUserName, b.headerUserName),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 100,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
  },
]);

const uploadInfoListData = ref<any>([]);
const uploadColumnsInfoList = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '文件名称',
    dataIndex: 'oldFileName',
    key: 'oldFileName',
    ellipsis: true,
    align: 'left',
    width: 270,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.oldFileName, b.oldFileName),
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    align: 'center',
    width: 80,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
  },
  {
    title: '上传时间',
    dataIndex: 'addTime',
    key: 'addTime',
    align: 'center',
    width: 100,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.addTime, b.addTime),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
  },
]);
const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

const emit = defineEmits(['emitCustomRequest']);

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

async function customRequest_A(options: any, type: any) {
  // 调用上传接口
  loading.value = true;
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      emit('emitCustomRequest', res);
      loading.value = false;
      message.success(WeiI18n.t('上传成功').value);
      isdownload.value = false;
    } else {
      loading.value = false;
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
}
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);
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

function handleClosePowModal() {
  powVisible.value = false;
}
async function downFile(row: any) {
  const downLoadItem = {
    fileId: row.fileId,
  };
  handleEpcDownload(downLoadItem, row.oldFileName);
}

async function downLoadTemplate(type: any) {
  let data: any = {};
  if (props.planTaskInfo.nodeName == '020 公司高层调研') {
    data.fileType = '103';
  } else if (props.planTaskInfo.nodeName == '030 公司中层调研') {
    data.fileType = '104';
  } else if (props.planTaskInfo.nodeName == '050 规划回顾分析') {
    data.fileType = '101';
  } else if (props.planTaskInfo.nodeName == '150 投资回顾分析') {
    data.fileType = '102';
  } else if (props.planTaskInfo.nodeName == '070 竞品分析') {
    data.fileType = '105';
  } else if (props.planTaskInfo.nodeName == '200 产品竞争力审视') {
    data.fileType = '106';
  } else if (props.planTaskInfo.nodeName == '220 技术委外开发需求（分包方案）') {
    data.fileType = '107';
  } else if (props.planTaskInfo.nodeName == '230 制定采购/合作策略') {
    data.fileType = '108';
  } else if (props.planTaskInfo.nodeName == '260 投资平衡审视') {
    data.fileType = '109';
  } else if (props.planTaskInfo.nodeName == '320 制定营销策略') {
    data.fileType = '110';
  } else if (props.planTaskInfo.nodeName == '330 制定分包方案') {
    data.fileType = '111';
  } else if (props.planTaskInfo.nodeName == '340 工厂投资规划') {
    data.fileType = '112';
  } else if (props.planTaskInfo.nodeName == '350 投资预算和概算') {
    data.fileType = '113';
  }
  const res = await AdminApiProductPlanTaskDesign.getTemplateFile(data);
  if (res.data.data.fileInfoList.length > 0) {
    res.data.data.fileInfoList.forEach((selectedRow: any) => {
      if (selectedRow.fileId != null) {
        const downLoadItem = {
          fileId: selectedRow.fileId,
        };
        if (selectedRow.oldFileName != null && selectedRow.oldFileName != '') {
          handleEpcDownload(downLoadItem, `${selectedRow.oldFileName}`);
        }
      }
    });
  } else {
    message.warn(WeiI18n.t('请先上传模板文件').value);
  }
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.fileListComponents');
}

async function catVersion(row: any) {
  let data: any = {};
  data.taskId = props.planTaskInfo.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiProductPlanTaskDesign.getDeliverablesAffFileInfo(data);
  uploadInfoListData.value = res.data.data.uploadInfoData || [];
  isModalVisible.value = true;
}

async function helckClick() {
  isModalVisible.value = false;
}

const loading = ref<boolean>(false);
onMounted(() => {
  setisdownload();
});
function setisdownload() {
  isdownload.value = true;
}
defineExpose({ setisdownload });
</script>

<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="content-title">
      <i></i>
      <span class="test">{{ titleInfo }}</span>
      <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate('1')"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
      <a-upload ref="fileUpload" multiple :before-upload="beforeUpload" :custom-request="options => customRequest_A(options, 1)" :show-upload-list="false">
        <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled">
          <EpcIcon type="icon-shangchuanwenjian1" style="font-size: 16px" />
          {{ $t('上传文件') }}
        </a-button>
      </a-upload>
    </div>
    <div>
      <a-table
        :scroll="{ x: 'max-content' }"
        :locale="localeA"
        @resizeColumn="handleResizeColumn"
        style="margin-left: 10px; overflow-y: auto"
        :columns="uploadColumns"
        :pagination="false"
        bordered
        :data-source="uploadInfoData">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'version'">
            <a @click="catVersion(record)" type="link">{{ record.version }}</a>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a @click="priview(record)" type="link">预览</a>
            <a-divider type="vertical" />
            <a v-if="isdownload" @click="downFile(record)" type="link">下载</a>
            <sapn v-else type="link" style="color: #d8cdcd">下载</sapn>
          </template>
        </template>
      </a-table>
    </div>
    <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
    <div class="fileListComponents" v-dragModal>
      <a-modal v-model:visible="isModalVisible" :getContainer="customGetContainer" width="60%" title="查看文件" ok-text="确定" cancel-text="取消" :mask-closable="false">
        <div>
          <div :span="18">
            <a-table
              :scroll="{ x: 'max-content' }"
              :locale="localeA"
              @resizeColumn="handleResizeColumn"
              style="margin-left: 20px; overflow-y: auto"
              :columns="uploadColumnsInfoList"
              :pagination="false"
              :data-source="uploadInfoListData">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                  {{ index + 1 }}
                </template>
                <template v-if="column.dataIndex === 'action'">
                  <a @click="priview(record)" type="link">预览</a>
                  <a-divider type="vertical" />
                  <a @click="downFile(record)" type="link">下载</a>
                </template>
              </template>
            </a-table>
          </div>
        </div>
        <template #footer>
          <a-button @click="helckClick">
            {{ $t('关闭') }}
          </a-button>
        </template>
      </a-modal>
    </div>
  </a-spin>
</template>

<style lang="less" scoped>
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
  .test {
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
</style>
