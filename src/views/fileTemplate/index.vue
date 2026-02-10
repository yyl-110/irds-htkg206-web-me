<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message, UploadProps, Modal } from 'ant-design-vue';
import { useRender } from '@/components/escape';
import { AdminApiSystemBoard } from '@/api/tags/board/平台看板管理';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
const loading = ref<boolean>(false);
const fileloading = ref<boolean>(false);
const userStore = useUserStore();
/** 是否显示 新增 / 编辑 弹窗 */
const visibleEditor = ref<boolean>(false);
const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: WeiI18n.$t('任务名称'),
    dataIndex: 'taskName',
    key: 'taskName',
    align: 'center',
    resizable: true,
    width: 260,
    sorter: (a: any, b: any) => sortermethod(a.taskName, b.taskName),
  },
  {
    title: WeiI18n.$t('模板名称'),
    dataIndex: 'fileName',
    key: 'fileName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(String(a.fileName.length), String(b.fileName.length)),
    width: 490,
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'center',
    width: 150,
  },
]);
/** 列表数据 */
const resources = ref<any>([]);
onMounted(() => {
  getResources();
});
const fileListDataEnds = ref<any[]>([]);
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
function handleResizeColumn(w, col) {
  col.width = w;
}

/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

/** 获取文件模板数据 */
async function getResources() {
  loading.value = true;
  try {
    const res = await AdminApiSystemProductSpecification.fileTemplateFileList({});
    console.log(res);
    resources.value = res.data.data || [];
  } finally {
    loading.value = false;
  }
}

/**
 * 添加数据和编辑页面
 */
const fileInfo = ref<any>({});
async function infoAdd(record?: any) {
  fileInfo.value = record || {};
  visibleEditor.value = true;
  fileListDataEnds.value = [];
  let data: any = {};
  data.fileType = record ? record.fileType : '';
  const res = await AdminApiSystemProductSpecification.fileGetTemplateFile(data);
  fileListDataEnds.value = res.data.data.fileInfoList;
}
async function handlefileSave() {
  let data: any = {};
  let ids: any = [];
  data.fileType = fileInfo ? fileInfo.value.fileType : '';
  fileListDataEnds.value.forEach(element => {
    ids.push(element.fileId);
  });
  data.fileIds = ids;
  console.log(data);
  const res = await AdminApiSystemProductSpecification.fileUpdateTemplateFile(data);
  if (res.data.code == 200) {
    message.success(WeiI18n.t('保存成功').value);
    visibleEditor.value = false;
  } else {
    message.error(WeiI18n.t('保存失败').value);
  }
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.fileTemplateIndex');
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
  fileloading.value = true;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      fileListDataEnds.value.push({
        fileId: res.data.data.id,
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
  } finally {
    fileloading.value = false;
  }
}
function linkClick(url: string) {
  window.open(url);
}
function delEnSystemUpload(row: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      fileListDataEnds.value = fileListDataEnds.value.filter((item: any) => item.fileId !== row.fileId);
      message.success('删除成功!');
    },
  });
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
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
</script>

<template>
  <div class="drawerContent">
    <a-card class="mt-[10px] b-body2">
      <a-table
        :scroll="{ x: 1200 }"
        :row-key="(record: any) => record.id"
        :columns="columns"
        :data-source="resources"
        :pagination="false"
        @resizeColumn="handleResizeColumn"
        :locale="locale"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a @click="infoAdd(record)">{{ $t('模板上传') }}</a>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <div class="fileTemplateIndex" v-dragModal>
    <a-modal
      v-model:visible="visibleEditor"
      :getContainer="customGetContainer"
      style="width: 60%"
      :title="$t('模板文件上传')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="handlefileSave"
      @cancel="visibleEditor = false">
      <div style="height: 500px; overflow-y: auto">
        <a-spin :spinning="fileloading" tip="加载中...">
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
          <div class="upload-file-wrap">
            <div v-for="(item, index) in fileListDataEnds" :key="index">
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
        </a-spin>
      </div>
      <template #footer>
        <a-button type="primary" @click="handlefileSave">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="visibleEditor = false">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
.fileTemplateIndex {
  position: relative;
  z-index: 1000;
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

//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 10px;
  display: flex;
  flex-wrap: wrap;
  // width: calc(100% + 50px);
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
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}

.del-text {
  color: var(--ant-error-color);
}

.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

.form_css .ant-form-item {
  margin-bottom: 20px;
}

.ant-table {
  margin: 0;
  border-top: 0;
  border-bottom: 0;

  .ant-table-thead > tr > th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: 500;
    padding: 12px;
    border-bottom: 1px solid #e6e7e9;
  }

  .ant-table-tbody > tr > td {
    padding: 10px;
    border-bottom: 1px solid #e6e7e9;
  }
}
</style>
