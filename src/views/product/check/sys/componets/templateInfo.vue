<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
import { useUserStore } from '@/store/modules/user';
import { CheckTemplatePageRequestDTOModel } from '@/api/models/checkTemplate/CheckTemplatePageRequestDTOModel';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { TableColumnType, message, Modal } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import PageInfoDialog from './pageInfoDialog.vue';
import ViewDialog from './viewDialog.vue';
import SelectBoomTree from './selectCheckBoomTree.vue';
const loading = ref<boolean>(false);
const userStore = useUserStore();
const pageList = ref<any>([]);
const emit = defineEmits(['actionNode']);
const pageName = ref<any>('');
const categoryId = ref<any>('');
const copyTemplateModal = ref<any>(false);
const visible = ref(false);
const pageInfoDialogRef = ref<any>({});
const riviewPageInfoDialogRef = ref<any>({});
const treeDataInfo = ref<any>([]);
const selectTreeSelectedKeys = ref<string>('');
const categoryInfo = ref<any>({});
const selectTreeVisible = ref<any>(false);
const ruleForm = reactive({
  category: '',
  createBy: useUserStore().getUser.id,
  pageName: '',
  pageType: '表单文本类',
  remark: '',
  treeId: '',
});
const copyPage = reactive({
  name: '',
  type: '',
  typeID: '',
  rowID: '',
});
const formRef = ref<any>(null);
const copyFormRef = ref<any>(null);
const pageTypeList = ref([
  {
    value: '表单文本类',
    label: '表单文本类',
  },
  {
    value: '自定义类',
    label: '自定义类',
  },
]);
const rules = reactive({
  pageName: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
  pageType: [
    {
      required: true,
      message: '请选择页面类型',
      trigger: 'change',
    },
  ],
});
const copyRules = reactive({
  name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
  type: [
    {
      required: true,
      message: '请选择页面类型',
      trigger: 'change',
    },
  ],
});
/** 列表请求参数 */
const requestParams = reactive(new CheckTemplatePageRequestDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
//初始化数据
async function infoReload(node: any) {
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
    title: WeiI18n.$t('页面名称'),
    dataIndex: 'pageName',
    key: 'pageName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.pageName, b.pageName),
    width: 230,
  },
  {
    title: WeiI18n.$t('页面类型'),
    dataIndex: 'pageType',
    key: 'pageType',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.pageType, b.pageType),
    width: 260,
  },
  {
    title: WeiI18n.$t('所属分类'),
    dataIndex: 'category',
    key: 'category',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.category, b.category),
    width: 100,
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
    dataIndex: 'createTimeStr',
    key: 'createTimeStr',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createTimeStr, b.createTimeStr),
    width: 100,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.remark, b.remark),
    width: 150,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 200,
    fixed: 'right',
  },
  { fixed: 'right', width: 1 },
]);

const viewDialogArgs = ref({
  isShow: false,
  rowId: '',
  data: [],
  parameterImgList: [],
  workPageWidth: '',
  title: '',
  customPageUrl: '',
});
const pageInfoArgs = ref({
  pageInfoIsShow: false,
  rowData: {
    id: '',
    pageName: '',
  },
  productType: '',
});

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
//添加或者编辑完pageInfo后更新列表
const completePageInfoGetList = () => {
  // pageInfoArgs.value.pageInfoIsShow = false;
  getListData();
};
const closedPageInfoDialog = () => {
  getListData();
  pageInfoArgs.value.pageInfoIsShow = false;
};

const resetForm = () => {
  pageName.value = '';
  getListData();
};

async function getListData() {
  try {
    loading.value = true;
    let data: any = {
      pageName: pageName.value,
      pageNum: requestParams.pageNo,
      pageSize: requestParams.pageSize,
      treeId: categoryId.value,
    };
    const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewPageList(data);
    pageList.value = res.data.data.data;
    pagination.total = res.data.data.pageCount;
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}

async function handleAddOrUpdate() {
  ruleForm.pageName = '';
  ruleForm.pageType = '表单文本类';
  ruleForm.remark = '';
  ruleForm.treeId = categoryId.value;
  visible.value = true;
}

async function delModule() {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      let data: any = {};
      ((data.createBy = useUserStore().getUser.id), (data.idList = selectedRowkeys.value));
      const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewDeleteBatch(data);
      if (res.data.data.result) {
        message.info('删除成功');
        getListData();
        selectedRowList.value = [];
        selectedRowkeys.value = [];
      }
    },
  });
}

async function updateTemplateInfo(record: any) {
  pageInfoArgs.value.pageInfoIsShow = true;
  pageInfoArgs.value.rowData = record;
  pageInfoArgs.value.productType = '17';
  nextTick(() => {
    pageInfoDialogRef.value.reloadTableStyle();
  });
}

async function copyTemplateInfo(record: any) {
  copyPage.rowID = record.id;
  copyPage.type = '';
  copyPage.typeID = '';
  copyPage.name = '';
  copyTemplateModal.value = true;
}
async function priviewTemplateInfo(record: any) {
  let data: any = {
    checkPageInfoNewId: record.id,
  };
  const respon = await AdminApiSystemCheckInfoApi.checkPageParamPreviewCheckPageParamList(data);
  let isData = respon.data.data.resultVO && respon.data.data.resultVO.paramVOList && respon.data.data.resultVO.paramVOList.length > 0;
  let customPageUrl = respon.data.data.customPageUrl;
  if (isData || customPageUrl) {
    viewDialogArgs.value.isShow = true;
    viewDialogArgs.value.rowId = record.id;
    viewDialogArgs.value.data = respon.data.data.resultVO.paramVOList;
    viewDialogArgs.value.parameterImgList = respon.data.data.resultVO.imageDataVOList;
    viewDialogArgs.value.workPageWidth = respon.data.data.workPageWidth;
    viewDialogArgs.value.title = '预览';
    customPageUrl ? (viewDialogArgs.value.customPageUrl = customPageUrl) : '';
    riviewPageInfoDialogRef.value.reloadTableStyle();
  } else {
    message.warning('没有数据');
    return;
  }
}

const closeViewDialog = () => {
  viewDialogArgs.value.isShow = false;
  viewDialogArgs.value.rowId = '';
  viewDialogArgs.value.title = '预览';
};

async function deleteTemplateInfo(record: any) {
  const ids = [];
  ids.push(record.id);
  let data: any = {};
  ((data.createBy = useUserStore().getUser.id), (data.idList = ids));
  const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewDeleteBatch(data);
  if (res.data.data.result) {
    message.info('删除成功');
    getListData();
  }
}
async function saveCheckPageInfo() {
  formRef.value
    .validate()
    .then(async () => {
      const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewSaveOrUpdate(ruleForm);
      if (res.data.data.result) {
        message.info('添加成功');
        getListData();
        visible.value = false;
        //添加完page显示info弹窗
        pageInfoArgs.value.rowData = {
          id: res.data.data.result,
          pageName: ruleForm.pageName,
        };
        pageInfoArgs.value.pageInfoIsShow = true;
        nextTick(() => {
          pageInfoDialogRef.value.reloadTableStyle();
        });
      }
    })
    .catch(errorInfo => {
      // 验证失败
      console.log('验证失败', errorInfo);
    });
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.templateInfo-add');
}

async function showNoteTree() {
  let data: any = {
    productType: '17',
    toolType: '1',
  };
  const res = await AdminApiSystemCheckInfoApi.getAllCheckTreeData(data);
  treeDataInfo.value = res.data.data.result;
  selectTreeVisible.value = true;
}

/**
 * 确认选择树节点，将选中的节点名称传回tree组件
 */
function confirmSelectTreeNode() {
  copyPage.typeID = categoryInfo.value.id;
  copyPage.type = categoryInfo.value.nodeName;
  selectTreeVisible.value = false;
  // 重置选中状态
  selectTreeSelectedKeys.value = '';
}

/**
 * 取消选择树节点
 */
function cancelSelectTreeNode() {
  selectTreeVisible.value = false;
  // 重置选中状态
  selectTreeSelectedKeys.value = '';
}

/**
 * 处理树选择器中的节点选择
 * @param selectedKeys 选中的节点keys
 * @param info 节点信息
 */
function handleSelectTreeNode(selectedKeys: any[], info: any) {
  selectTreeSelectedKeys.value = selectedKeys[0];
  categoryInfo.value = info.node;
}

async function okCopyTemplateInfo() {
  copyFormRef.value
    .validate()
    .then(async () => {
      let data: any = {
        id: copyPage.rowID,
        treeId: copyPage.typeID,
        pageName: copyPage.name,
        createBy: useUserStore().getUser.id,
      };
      const res = await AdminApiSystemCheckInfoApi.checkPageInfoNewCopyCheckPage(data);
      message.success('复制成功');
      getListData();
      copyTemplateModal.value = false;
    })
    .catch(errorInfo => {
      // 验证失败
      console.log('验证失败', errorInfo);
    });
}
defineExpose({ infoReload });
</script>

<template>
  <div class="imgList">
    <div>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" @finish="handleFinish">
        <a-form-item name="parameterName">
          <a-input v-model:value="pageName" style="width: 220px" allow-clear :placeholder="$t('请输入页面名称')" />
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
            <div class="btn-item" @click="delModule" v-if="selectedRowkeys.length > 0">
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
          <template v-if="column.dataIndex === 'operation'">
            <div style="display: flex; gap: 8px; align-items: center">
              <a @click.stop.prevent="updateTemplateInfo(record)">{{ $t('编辑') }}</a>
              <a @click.stop.prevent="copyTemplateInfo(record)">{{ $t('复制') }}</a>
              <a @click.stop.prevent="priviewTemplateInfo(record)">{{ $t('预览') }}</a>
              <!-- <a-divider type="vertical" /> -->
              <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="deleteTemplateInfo(record)">
                <a @click.stop style="color: #ff4d4f; cursor: pointer">{{ $t('删除') }}</a>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <div class="templateInfo-add" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 700px"
      :style="{ top: '10%' }"
      :title="$t('添加')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="saveCheckPageInfo"
      @cancel="visible = false">
      <a-form ref="formRef" :model="ruleForm" :rules="rules" style="margin-top: 20px" :label-col="{ style: { width: '80px' } }">
        <a-form-item :label="$t('页面名称')" prop="pageName">
          <a-input v-model:value="ruleForm.pageName" placeholder="请输入页面名称" name="pageName" />
        </a-form-item>
        <a-form-item :label="$t('页面类型')" prop="pageType">
          <a-select placeholder="请选择页面类型" v-model:value="ruleForm.pageType" show-search name="pageType">
            <a-select-option v-for="item in pageTypeList" :value="item.value" :key="item.label">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('所属分类')">
          <a-input v-model:value="ruleForm.category" :disabled="true" name="category" />
        </a-form-item>
        <a-form-item :label="$t('备注')">
          <a-textarea type="textarea" style="height: 100px" v-model:value="ruleForm.remark" placeholder="请输入备注" name="remarks" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="saveCheckPageInfo">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="visible = false">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>

  <a-modal
    v-model:visible="copyTemplateModal"
    style="width: 500px; height: 500px; overflow-y: auto"
    :title="$t('复制')"
    :mask-closable="false"
    @ok="okCopyTemplateInfo"
    @cancel="copyTemplateModal = false">
    <a-form ref="copyFormRef" :model="copyPage" :rules="copyRules">
      <a-row>
        <a-form-item :label="$t('页面名称')" prop="name">
          <a-input v-model:value="copyPage.name" allow-clear placeholder="请输入页面名称" style="width: 200px" />
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item :label="$t('所属分类')" prop="type">
          <a-input v-model:value="copyPage.type" allow-clear placeholder="请输入浏览选择所属分类" style="width: 200px" :disabled="true" />
          <a-button type="primary" style="margin-left: 10px" @click="showNoteTree"> 浏览 </a-button>
        </a-form-item>
      </a-row>
    </a-form>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="okCopyTemplateInfo()"> 确定 </a-button>
        <a-button @click="copyTemplateModal = false">取消</a-button>
      </span>
    </template>
  </a-modal>

  <PageInfoDialog
    ref="pageInfoDialogRef"
    :pageInfoArgs="pageInfoArgs"
    @completePageInfoGetList="completePageInfoGetList"
    @closedPageInfoDialog="closedPageInfoDialog"></PageInfoDialog>

  <ViewDialog ref="riviewPageInfoDialogRef" :viewDialogArgs="viewDialogArgs" @closeViewDialog="closeViewDialog"></ViewDialog>

  <!-- 其他弹窗/组件 -->
  <SelectBoomTree
    ref="selectBoomTreeRef"
    :modal-visible="selectTreeVisible"
    :select-tree-data="treeDataInfo"
    :select-tree-selected-keys="selectTreeSelectedKeys"
    @confirm-select-tree-node="confirmSelectTreeNode"
    @cancel-select-tree-node="cancelSelectTreeNode"
    @handle-select-tree-node="handleSelectTreeNode" />
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
