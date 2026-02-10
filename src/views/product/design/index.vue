<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { ProdDesignPageRequestDTOModel } from '@/api/models/design/ProdDesignPageRequestDTOModel';
import { ProdDesignInfoRequestDTOModel } from '@/api/models/design/ProdDesignInfoRequestDTOModel';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import ImageText from './components/ImageText.vue';
import ProductInfoAdd from './components/ProductInfoAdd.vue';
import ProductInfoEdit from './components/ProductInfoEdit.vue';
import ProductInfoDetail from './components/ProductInfoDetail.vue';
import { useLayoutStore } from '@/store/modules/layout/layout';
const layoutStore = useLayoutStore();
const router = useRoute();
// 树结构相关属性
const treeData = ref<any[]>([]);
const userStore = useUserStore();
const keyword = ref(''); // 系列搜索keyword
const seriesTable = ref([]); // 系列数据
const visible = ref<boolean>(false);
const visibleEdit = ref<boolean>(false);
const visibleDetail = ref<boolean>(false);
const titleVisible = ref<boolean>(false);
const designType = ref(1); // 页面状态展示
const productSericeId = ref(0); // 产品系列ID
const productSericeName = ref(''); // 产品系列ID
const modelTypeId = ref(0); // 产品二级分类ID
const loading = ref<boolean>(false);
const designData = ref([]); // 系列设计列表数据
const parameterSelectRowIds = ref<any[]>([]);
const titleList = ref<any>([]);
const designKeywords = ref(''); // 设计列表模糊名称搜索
const designCode = ref(''); // 设计列表模糊code搜索
const addModel = ref<any>([]);
const editModel = ref<any>([]);
const detailModel = ref<any>([]);

const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '65px',
  width: 'calc(100% - 201px)',
  height: 'calc(100vh - 65px)',
});

/** 列表请求参数 */
const requestParams = reactive(new ModuleTypeRequestDTOModel());

/** 列表请求参数 */
const requestDesignParams = reactive(new ProdDesignPageRequestDTOModel());

/** 列表请求参数 */
const requestDesignInfoParams = reactive(new ProdDesignInfoRequestDTOModel());

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestDesignInfoParams, getInfoPage);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);

/** 获取分类数据 */
async function getMenuListData() {
  treeData.value = [];
  titleVisible.value = true;
  drawerStyle.value = {
    marginLeft: layoutStore.asideWidthStyle,
    marginTop: '65px',
    width: 'calc(100% - 241px)',
    height: 'calc(100vh - 65px)',
  };
  loading.value = true;
  try {
    const res = await AdminApiSystemModule.getPlatform({ ...requestParams });
    titleList.value = res.data.data;
  } catch (error) {
    console.error('获取树数据失败:', error);
  } finally {
  }
}

const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    fixed: 'left',
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
    title: WeiI18n.$t('项目编号'),
    dataIndex: 'code',
    key: 'code',
    align: 'left',
    fixed: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.code, b.code),
    width: 120,
  },
  {
    title: WeiI18n.$t('项目名称'),
    dataIndex: 'nameCN',
    key: 'nameCN',
    align: 'left',
    fixed: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.nameCN, b.nameCN),
    width: 160,
  },
  {
    title: WeiI18n.$t('平台名称'),
    dataIndex: 'platformName',
    key: 'platformName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.platformName, b.platformName),
    width: 120,
  },
  {
    title: WeiI18n.$t('项目类别'),
    dataIndex: 'projectCategory',
    key: 'projectCategory',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.projectCategory, b.projectCategory),
    width: 120,
  },
  {
    title: WeiI18n.$t('设计经理'),
    dataIndex: 'designManagerName',
    key: 'designManagerName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.designManagerName, b.designManagerName),
    width: 140,
  },
  {
    title: WeiI18n.$t('项目类型'),
    dataIndex: 'projectType',
    key: 'projectType',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.projectType, b.projectType),
    width: 120,
  },
  {
    title: WeiI18n.$t('计划开始时'),
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.startTime, b.startTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('计划结束时间'),
    dataIndex: 'endTime',
    key: 'endTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.endTime, b.endTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('状态'),
    dataIndex: 'go',
    key: 'go',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.go, b.go),
    width: 130,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 200,
    fixed: 'right',
  },
]);

function onClose() {
  drawerStyle.value = ref({});
  titleVisible.value = false;
}

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
function changeSelectCate(item: any) {
  productSericeId.value = item.id;
  productSericeName.value = item.name;
  getSeries(item.id, '');
  drawerStyle.value = ref({});
  designType.value = 1;
  loading.value = false;
  titleVisible.value = false;
}

// 获取系列基础信息
const getSeries = async (id: number, keywords: string) => {
  requestDesignParams.id = id;
  requestDesignParams.keywords = keywords;
  const res = await DesignApiInfo.getSeriesApi({ ...requestDesignParams });
  if (res.data.code == 0) {
    seriesTable.value = res.data.data;
  } else {
    message.error('数据查询有误！');
  }
};
// 模糊搜索系列
function serialSearch() {
  getSeries(productSericeId.value, keyword.value);
}

// 获取设计列表数据
async function getInfoPage() {
  loading.value = true;
  try {
    requestDesignInfoParams.seriesId = modelTypeId.value;
    requestDesignInfoParams.keywords = designKeywords.value;
    requestDesignInfoParams.code = designCode.value;
    requestDesignInfoParams.userId = userStore.getUser.id;
    requestDesignInfoParams.currentPage = requestDesignInfoParams.pageNo;
    requestDesignInfoParams.numberPage = requestDesignInfoParams.pageSize;
    const res = await DesignApiInfo.getInfoPageApi({
      ...requestDesignInfoParams,
    });
    designData.value = res.data.data.data || [];
    pagination.total = res.data.data.pageCount;
  } finally {
    loading.value = false;
  }
}

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

// 前往设计
function design(item: any) {
  modelTypeId.value = item.id;
  getInfoPage();
  nextTick(() => {
    designType.value = 2;
  });
}

function handleCloseAddModal() {
  visible.value = false;
}
function handleCloseEditModal() {
  visibleEdit.value = false;
}
function handleCloseDetailModal() {
  visibleDetail.value = false;
}

/**
 * 新增
 * @param id id
 * @param parentId parentId
 */
function handleAddOrUpdate() {
  visible.value = true;
  // 根据menuId获取修改的记录
  nextTick(() => {
    addModel.value?.infoReload(modelTypeId.value, productSericeName.value, productSericeId.value);
  });
}

//项目启动
function startDes(row: any) {
  Modal.confirm({
    title: `确定要启动项目吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      requestDesignParams.id = row.id;
      const res = await DesignApiInfo.startProjectApi({ ...requestDesignParams });
      getInfoPage();
      message.success('项目启动成功！');
    },
  });
}

// 删除当前项目
async function delDesignClick(row: any) {
  requestDesignParams.ids = [row.id];
  const res = await DesignApiInfo.delProjectApi({ ...requestDesignParams });
  getInfoPage();
  message.success('删除成功!');
}

//编辑项目
function editDesignClick(row: any) {
  visibleEdit.value = true;
  nextTick(() => {
    editModel.value?.infoReload(modelTypeId.value, productSericeName.value, productSericeId.value, row);
  });
}

//项目详情
function detailTask(row: any) {
  visibleDetail.value = true;
  nextTick(() => {
    detailModel.value?.infoReload(modelTypeId.value, productSericeName.value, productSericeId.value, row);
  });
}
function resetForm(value: string) {
  keyword.value = '';
  getSeries(productSericeId.value, '');
}
function resetTable(value: string) {
  designKeywords.value = '';
  designCode.value = '';
  getInfoPage();
}
function imgSrc(item: any) {
  return new URL(`../../../assets/images/train${item.imgLogoicon}.png`, import.meta.url).href;
}
function oncancel() {
  designType.value = 1;
}
watch(
  () => router.query.parms,
  () => {
    let paramStr = '';
    if (router.query.parms) {
      // 对界面上的参数进行解密处理
      paramStr = decryptValue(router.query.parms);
    }
    if (paramStr) {
      getMenuListData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="drawerContent">
    <a-card v-if="designType === 1">
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
        <a-form-item>
          <a-input v-model:value="keyword" style="width: 220px" placeholder="请输入关键字搜索" allowClear />
          <a-button type="primary" @click="serialSearch" style="margin-left: 10px"
            ><a-icon><Search /></a-icon><EpcIcon type="icon-fangdajing" style="font-size: 12px" /> {{ $t('查询') }}</a-button
          >
          <a-button @click="resetForm" style="margin-left: 10px">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            {{ $t('重置') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="mt-[10px] b-body2" v-if="designType === 1">
      <div class="img-card" style="margin-top: 16px">
        <ImageText :seriesTable="seriesTable" @design="design" />
      </div>
    </a-card>

    <a-card v-if="designType === 2">
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
        <a-form-item>
          <a-input v-model:value="designKeywords" style="width: 220px; margin-right: 10px" placeholder="请输入项目名称搜索" allowClear />
          <a-input v-model:value="designCode" style="width: 220px; margin-right: 10px" placeholder="请输入项目编号搜索" allowClear />
          <a-button type="primary" @click="getInfoPage"
            ><a-icon><Search /></a-icon><EpcIcon type="icon-fangdajing" style="font-size: 12px" /> {{ $t('查询') }}</a-button
          >
          <a-button @click="resetTable" style="margin-left: 10px">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            {{ $t('重置') }}
          </a-button>
          <a-button type="primary" @click="handleAddOrUpdate" style="margin-left: 10px"
            ><a-icon><Search /></a-icon><EpcIcon type="icon-tianjia1" style="font-size: 12px" /> {{ $t('添加') }}</a-button
          >
          <a-button type="primary" @click="oncancel()" style="margin-left: 15px">
            <EpcIcon type="icon-fanhui-copy" style="font-size: 12px" />
            {{ $t('返回') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="mt-[10px] b-body2" v-if="designType === 2">
      <!--    表格处 -->
      <a-table
        :scroll="{ x: 1200 }"
        :row-key="(record: any) => record.id"
        :columns="columns"
        :data-source="designData"
        :locale="locale"
        :pagination="pagination"
        @resizeColumn="handleResizeColumn"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>
          <template v-else-if="column.dataIndex === 'projectCategory'">
            <div v-if="record.projectCategory === '1'">市场执行项目</div>
            <div v-else-if="record.projectCategory === '2'">科技开发项目</div>
            <div v-else-if="record.projectCategory === '3'">机电业务项目</div>
            <div v-else-if="record.projectCategory === '4'">检修运维项目</div>
          </template>

          <template v-else-if="column.dataIndex === 'designManagerName'">
            <div class="create-pop">
              <span class="user"
                ><img src="../../../assets/workbench/avatar.jpg" alt="" />{{
                  record.designManagerName != undefined && record.designManagerName != null ? record.designManagerName : ''
                }}</span
              >
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'projectType'">
            <div v-if="record.projectType === '1'">一般改进型产品</div>
            <div v-else-if="record.projectType === '2'">重大改进型产品</div>
            <div v-else-if="record.projectType === '3'">延续型产品</div>
            <div v-else>全新产品</div>
          </template>

          <template v-else-if="column.dataIndex === 'go'">
            <span>
              <div v-if="+record.projectStatus === 1">未开启</div>
              <div style="color: #3172f5" v-else-if="record.projectStatus == 2"><a-progress :percent="record.projectPercentage" /></div>
              <div v-else style="color: #50bc6d"><a-progress :percent="100" status="success" /></div>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <a v-if="record.projectStatus == 1" @click="startDes(record)">{{ $t('启动') }}</a>
            <a-divider type="vertical" v-if="record.projectStatus == 1" />
            <a @click="editDesignClick(record)" v-if="record.projectStatus == 1">{{ $t('编辑') }}</a>
            <a-divider type="vertical" v-if="record.projectStatus == 1" />
            <a @click="detailTask(record)">{{ $t('查看') }}</a>
            <a-divider type="vertical" v-if="record.projectStatus == 1" />
            <a-popconfirm v-if="record.projectStatus == 1" :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="delDesignClick(record)">
              <a-button type="link" danger class="p-0">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-drawer
      :title="`产品平台选取`"
      placement="left"
      :style="drawerStyle"
      :closable="false"
      :visible="titleVisible"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      @blur="onClose"
      @close="onClose">
      <div v-for="(item, index) in titleList" :key="index">
        <!-- <div
          style="display: flex; height: 30px; background-color: #ecf5ff; margin-top: 15px; margin-left: 10px; margin-right: 10px; border-radius: 10px; cursor: pointer"
          @click="changeSelectCate(item)">
          <div style="height: 35px; width: 35px; border-radius: 10px; background-color: #165dff">
            <center style="margin-top: 3px">
              <img style="width: 30px; height: 30px" :src="imgSrc(item)" preview="false" />
            </center>
          </div>
          <EpcIcon type="icon-fangdajing" style="font-size: 18px" />
          <a class="menuLi" style="margin-top: 8px">{{ item.name || item.menuName }}</a>
        </div> -->

        <div style="display: flex; background-color: #ecf5ff; margin: 15px 10px 0 10px; border-radius: 10px; height: 35px; cursor: pointer" @click="changeSelectCate(item)">
          <EpcIcon type="icon-gaotie" v-if="item.imgLogoicon == 1" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-tielu" v-else-if="item.imgLogoicon == 2" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-ditie1" v-else-if="item.imgLogoicon == 3" style="font-size: 20px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-ditie" v-else-if="item.imgLogoicon == 4" style="font-size: 23px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-ditie2" v-else-if="item.imgLogoicon == 5" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-tram-full" v-else-if="item.imgLogoicon == 6" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-huoche" v-else-if="item.imgLogoicon == 7" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-gaotie24" v-else-if="item.imgLogoicon == 8" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-icon_train" v-else-if="item.imgLogoicon == 9" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <EpcIcon type="icon-gaotie" v-else style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <a-badge :count="item.count">
            <div class="menuLi">{{ item.name || item.menuName }}</div>
          </a-badge>
        </div>
      </div>
    </a-drawer>

    <ProductInfoAdd ref="addModel" :modal-visible="visible" @refresh-table-data="getInfoPage" @close="handleCloseAddModal" />
    <ProductInfoEdit ref="editModel" :modal-visible="visibleEdit" @refresh-table-data="getInfoPage" @close="handleCloseEditModal" />
    <ProductInfoDetail ref="detailModel" :modal-visible="visibleDetail" @refresh-table-data="getInfoPage" @close="handleCloseDetailModal" />
  </div>
</template>

<style lang="less" scoped>
@import '../../../assets/css/designFlow/designFlow.css';
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}

.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
::v-deep(.splitpanes__splitter:after),
::v-deep(.splitpanes__splitter:before) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.sbom > .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: #fff;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
.drawerContent {
  background-color: #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-drawer-content-wrapper) {
  width: 300px !important;
}

:deep(.b-body) {
  height: calc(100vh - 125px);
  overflow: auto;
}
:deep(.ant-drawer-body) {
  padding: 2px;
}

.menuLi {
  display: inline-block;
  margin: 10px 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
}
.menuLi:hover {
  transform: translateY(-2px);
  color: #165dff;
}
</style>
