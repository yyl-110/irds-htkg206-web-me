<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { AdminApiSystemCheckFlowInfoApi } from '@/api/tags/check/计算流程后台';
import { useUserStore } from '@/store/modules/user';
import { CheckTemplatePageRequestDTOModel } from '@/api/models/checkTemplate/CheckTemplatePageRequestDTOModel';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { TableColumnType, message, Modal } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { useRoute, useRouter } from 'vue-router';
import UploadImg from '@/components/UploadImg/index.vue';
import flowview from '@/components/flowview/index.vue';
const loading = ref<boolean>(false);
const pageList = ref<any>([]);
const emit = defineEmits(['actionNode']);
const currentTreeNode = ref<any>({});
const pageName = ref<any>('');
const categoryId = ref<any>('');
const ruleForm = reactive({
  category: '',
  createBy: useUserStore().getUser.id,
  pageName: '',
  pageType: '表单文本类',
  remark: '',
  treeId: '',
});
// 路由相关
const route = useRoute();
const router = useRouter();
/** 列表请求参数 */
const requestParams = reactive(new CheckTemplatePageRequestDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const activKey = ref('');
//初始化数据
async function infoReload(node: any, type: string) {
  currentTreeNode.value = node;
  activKey.value = type;
  categoryId.value = node.key || node.id;
  ruleForm.category = node.partName || node.nodeName;
  getListData();
}
/** 菜单树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};
const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.$t('流程名称'),
    dataIndex: 'proname',
    key: 'proname',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.proname, b.proname),
    width: 170,
  },
  {
    title: WeiI18n.$t('流程分类'),
    dataIndex: 'proCategory',
    key: 'proCategory',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.proCategory, b.proCategory),
    width: 170,
  },
  {
    title: WeiI18n.$t('发布状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 100,
  },
  {
    title: WeiI18n.$t('流程版本'),
    dataIndex: 'version',
    key: 'version',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
    width: 150,
  },
  {
    title: WeiI18n.$t('创建人'),
    dataIndex: 'userName',
    key: 'userName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.userName, b.userName),
    width: 130,
  },
  {
    title: WeiI18n.$t('创建时间'),
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
    width: 170,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 260,
    fixed: 'right',
  },
]);

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

function handleResizeColumn(w, col) {
  col.width = w;
}

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}

/** 勾选表格数据源  */
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}

function handleFinish() {
  getListData();
}

const resetForm = () => {
  pageName.value = '';
  getListData();
};

async function getListData() {
  try {
    selectedRowList.value = [];
    selectedRowkeys.value = [];
    loading.value = true;
    let data: any = {
      checkTreeId: categoryId.value + '',
      name: pageName.value,
      orderByColumn: '',
      pageNum: requestParams.pageNo,
      pageSize: requestParams.pageSize,
    };
    const res = await AdminApiSystemCheckFlowInfoApi.actDesignList(data);
    pageList.value = res.data.data.records;
    pagination.total = res.data.data.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}
const addPageArgs = ref({
  isShow: false,
  data: {},
});
async function handleAddOrUpdate() {
  if (activKey.value == '1') {
    addPageArgs.value = {
      isShow: true,
      data: currentTreeNode.value,
    };
  } else if (activKey.value == '2') {
    const visited = new WeakSet();
    const jsonStr = JSON.stringify(currentTreeNode.value, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (visited.has(value)) return undefined; // 跳过已访问的对象
        visited.add(value);
      }
      return value;
    });
    router.push({ path: '/business/processFormdefinition', query: { flag: 1, currentNode: jsonStr } });
  }
}

async function delModule() {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      var flag = true;
      selectedRowList.value.map((item: any) => {
        if (item.status == 1) {
          message.error('选择数据为已发布数据，请先撤销');
          flag = false;
        }
      });
      if (flag) {
        selectedRowList.value.map(async (item: any) => {
          const res = await AdminApiSystemCheckFlowInfoApi.deleteActDesign({
            id: item.prokey,
          });
          getListData();
        });
      }
    },
  });
}
const readImage = reactive({
  open: false,
  src: '',
  title: '',
});
const flowData = ref();
const flowloading = ref(false);
async function handleReadImage(record: any) {
  try {
    flowloading.value = true;
    const params = {
      procInsId: String(record.id),
      deployId: String(record.deployId),
    };
    readImage.title = '流程图';
    readImage.open = true;
    readImage.src = import.meta.env.VITE_KANBAN_SERVE + 'flowable-work-server/flowable/definition/readImage/' + record.deployId;
    AdminApiSystemCheckFlowInfoApi.flowXmlAndNode(params).then(res => {
      if (res && res.data.code == 200) {
        flowData.value = res.data.data;
        flowloading.value = false;
      }
    });
  } catch (error) {
    console.log(error, 'error');
    flowloading.value = false;
  }
}

async function handleLoadXml(record: any) {
  if (record) {
    localStorage.setItem('queryList', JSON.stringify(record));
    const visited = new WeakSet();
    const jsonStr = JSON.stringify(currentTreeNode.value, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (visited.has(value)) return undefined; // 跳过已访问的对象
        visited.add(value);
      }
      return value;
    });
    // uStore.dispatch('flow/calcEditRow', row);
    router.push({ path: '/business/processFormdefinition', query: { deployId: record.deployId, flag: 1, currentNode: jsonStr } });
  }
}
const uploadPictureModal = ref(false);
const fileList = ref<any>([]);
const pictureId = ref<any>('');
const pictureName = ref<any>('');
const pictureFileId = ref<any>('');
const prokeyValues = ref<any>('');
const uploadImgRef = ref<any>({});
async function uploadPicture(record: any) {
  uploadPictureModal.value = true;
  prokeyValues.value = record.prokey;
  fileList.value = [];
  nextTick(() => {
    uploadImgRef.value.ResetData();
  });
}

function datafilechange(file: any) {
  fileList.value = [];
}

async function datacustomRequest(options: any) {
  fileList.value.push({
    ...options,
    name: options?.documentName,
    status: 'done',
    url: options.fileUrl,
  });
  pictureName.value = fileList.value[0].oldFileName || '';
  pictureFileId.value = fileList.value[0].id || '';
}

async function okUploadInfo() {
  let data: any = {
    prokey: prokeyValues.value,
    coverImageId: pictureFileId.value,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.ActDesignSetCoverImage(data);
  uploadPictureModal.value = false;
  getListData();
}

async function release(record: any) {
  const statusA = ref(0);
  if (record.status === 1) {
    statusA.value = 0;
  } else {
    statusA.value = 1;
  }
  let data: any = {
    id: record.id,
    status: statusA.value,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.ActDesignUpdate(data);
  getListData();
}
async function deleteTemplateInfo(record: any) {
  const res = await AdminApiSystemCheckFlowInfoApi.deleteActDesign({
    id: record.prokey,
  });
  getListData();
}

defineExpose({ infoReload });
</script>

<template>
  <div class="imgList">
    <div>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" @finish="handleFinish">
        <a-form-item name="parameterName">
          <a-input v-model:value="pageName" style="width: 220px" allow-clear :placeholder="$t('请输入流程名称')" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="getListData">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            {{ $t('重置') }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="selectLeft">
      <div class="btn-box">
        <div style="background-color: #e5efff; width: 100%; height: 100%">
          <div class="btn-box-left">
            <div class="btn-item" @click="handleAddOrUpdate">
              <EpcIcon type="icon-md-add" style="color: #1a71ff; font-size: 17px" />
              添加
            </div>
            <div class="btn-item" style="color: red" @click="delModule" v-if="selectedRowkeys.length > 0">
              <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
              删除
            </div>
            <div class="btn-item-select" v-else>
              <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
              删除
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 10px" class="b-body">
      <!-- 表格 -->
      <a-table
        :scroll="{ x: 1200 }"
        :row-key="(record: any) => record.id"
        :columns="columns"
        :data-source="pageList"
        :pagination="pagination"
        :row-selection="rowSelection"
        :customRow="customRow"
        @resizeColumn="handleResizeColumn"
        :locale="locale"
        :loading="loading"
        :sticky="true"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <!-- 操作列：编辑/删除 等，阻止事件冒泡 -->
          <template v-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status === 0"> 未发布 </a-tag>
              <a-tag v-else color="blue"> 已发布 </a-tag>
            </span>
          </template>

          <template v-if="column.dataIndex === 'version'">
            <span> V{{ record.version }} </span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div style="display: flex; gap: 8px; align-items: center">
              <a @click.stop.prevent="handleReadImage(record)">{{ $t('查看') }}</a>
              <a @click.stop.prevent="handleLoadXml(record)">{{ $t('编辑') }}</a>
              <a v-if="record.status === 0" @click.stop.prevent="release(record)">{{ $t('发布') }}</a>
              <a v-if="record.status === 1" @click.stop.prevent="release(record)">{{ $t('撤销') }}</a>
              <a @click.stop.prevent="uploadPicture(record)">{{ $t('上传封面') }}</a>
              <!-- <a-divider type="vertical" /> -->
              <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="deleteTemplateInfo(record)">
                <a v-if="record.status === 0" @click.stop style="color: #ff4d4f; cursor: pointer">{{ $t('删除') }}</a>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <a-modal
    v-model:visible="uploadPictureModal"
    style="width: 700px; height: 500px; overflow-y: auto"
    :style="{ top: '10%' }"
    :title="$t('上传图片')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="okUploadInfo"
    @cancel="uploadPictureModal = false">
    <a-form>
      <a-row>
        <a-form-item :label="$t('请选择附件')">
          <UploadImg ref="uploadImgRef" style="color: red" :fileList="fileList" @change="datafilechange" @customRequest="datacustomRequest" />
        </a-form-item>
      </a-row>
    </a-form>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="okUploadInfo()"> 确定 </a-button>
        <a-button @click="uploadPictureModal = false">取消</a-button>
      </span>
    </template>
  </a-modal>

  <!-- 查看流程图 -->
  <a-modal
    :confirm-loading="$isPending()"
    :mask-closable="false"
    :title="readImage.title"
    v-model:visible="readImage.open"
    width="70%"
    height="100%"
    @cancel="readImage.open = false">
    <a-spin :spinning="flowloading" tip="加载中...">
      <flowview :flowData="flowData" />
    </a-spin>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="readImage.open = false"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
      </span>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
.imgList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 3px;
  background-color: #ffffff;
  width: auto;
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.imgBox {
  width: 231px;
  height: 210px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #eaeaf1;
  margin-left: 16px;
  cursor: pointer;
  margin-bottom: 16px;
}
.imgBox:hover {
  border-color: rgb(13, 83, 226);
  box-shadow: 0 0 5px 2px rgba(13, 83, 226, 0.2);
}
.imgBox:hover .itemBoxTitle {
  color: #0d53e2;
}

.itemBox1 {
  width: 199px;
  height: 142px;
  border-radius: 4px 4px 4px 4px;
  margin: 16px 16px 10px 16px;
}
.itemBox1 img {
  border-radius: 4px 4px 4px 4px;
}

.itemBoxTitle {
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
  margin-left: 16px;
}

.itemInfo {
  word-wrap: break-word;
  word-break: break-all;
}
.selectLeft {
  width: 100%;
  height: 8%;
  padding-top: 10px;
  background-color: #ffffff;
  overflow: auto;
  overflow-y: hidden;
}
.btn-box {
  width: 100%;
  height: 35px;
  background-color: #ffffff;
  text-align: left;
  font-size: 14px;
}
.btn-box-left {
  float: left;
  display: flex;
}

.btn-box-right {
  float: right;
  display: flex;
}
.btn-item-select {
  min-width: 28px;
  height: 35px;
  margin: 0 10px;
  text-align: center;
  line-height: 35px;
  color: #9a9fa7;
  cursor: pointer;
}

.btn-item {
  min-width: 28px;
  height: 35px;
  margin: 0 10px;
  text-align: center;
  line-height: 35px;
  color: #1a71ff;
  cursor: pointer;
}
</style>
