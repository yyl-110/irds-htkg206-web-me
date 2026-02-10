<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { useRender } from '@/components/escape';
import { BoardPageRequestDTOModel } from '@/api/models/board/BoardPageRequestDTOModel';
import { AdminApiCompetitor } from '@/api/tags/competitor/竞品数据库管理';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { EpcIcon } from '@/components/icon/EpcIcon';
import AttributeAdm from '@/views/competitor/manage/tree/TreeModule.vue';
import CompetitorAdm from '@/views/competitor/manage/components/CompetitorModule.vue';
import CompetitorInfoAdd from '@/views/competitor/manage/components/CompetitorAddModule.vue';
import CompetitorInfoUpdate from '@/views/competitor/manage/components/CompetitorUpdateModule.vue';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import FileList from '@/views/competitor/manage/components/FileList.vue';
import { debounce } from 'lodash-es';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import { useLayoutStore } from '@/store/modules/layout/layout';
const layoutStore = useLayoutStore();
const router = useRoute();
const spinningloading = ref<boolean>(false);
import dayjs from 'dayjs';
const loading = ref<boolean>(false);
const visible = ref<boolean>(false);
const userStore = useUserStore();
const attributeModel = ref<any>();
const competitorVisible = ref<boolean>(false);
const competitorModel = ref<any>();
const competitorInfoVisible = ref<boolean>(false);
const competitorInfoModel = ref<any>();
const competitorUpdateModel = ref<any>();
const competitorUpdateVisible = ref<boolean>(false);
const columns = ref<any>([]);
const datasource = ref<any>([]);
const fileListModel = ref<any>();
const defaultExpandedKeys = ref<any>([]);
const tableHeight = ref(window.innerHeight - 400);
const fileListVisible = ref<boolean>(false);
const fileTitle = ref('');
const fileName = ref('');
const activatedFlag = ref<boolean>(true);
const titleVisible = ref<boolean>(false);
const treeData = ref<any[]>([]);
const titleList = ref<any>([]);
const treeId = ref<any>(0);
const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '65px',
  width: 'calc(100% - 201px)',
  height: 'calc(100vh - 65px)',
});

/** 列表请求参数 */
const requestParams = reactive(new BoardPageRequestDTOModel());
//窗口大小变化后计算高度
onMounted(() => {
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 400;
  });
});
/** 加载列表信息 */
async function getResources() {
  loading.value = true;
  try {
    AdminApiCompetitor.getCompetitorList({ treeId: treeId.value }).then(res => {
      if (res && res.data.code == 200) {
        //根据返回的行、列、图片的信息构建动态表格
        columns.value = res.data.data.columnStr || [];
        datasource.value = res.data.data.tableStr.treeNodesList || [];
        defaultExpandedKeys.value = [];
        datasource.value.forEach((item: any) => {
          if (item.children && item.children.length > 0) {
            defaultExpandedKeys.value.push(item.categoryName);
          }
        });
      }
    });
  } finally {
    loading.value = false;
    drawerStyle.value = ref({});
    titleVisible.value = false;
  }
}

/** 获取分类数据 */
async function getMenuListData() {
  spinningloading.value = true;
  titleVisible.value = true;
  treeData.value = [];
  drawerStyle.value = {
    marginLeft: layoutStore.asideWidthStyle,
    marginTop: '65px',
    width: 'calc(100% - 241px)',
    height: 'calc(100vh - 65px)',
  };
  loading.value = true;
  try {
    const productTreeInfoRequestDTOModel = new ProductTreeInfoRequestDTOModel();
    productTreeInfoRequestDTOModel.userId = userStore.getUser.id;
    productTreeInfoRequestDTOModel.type = 1;
    const res = await AdminApiSystemProduct.getProductTree({
      ...productTreeInfoRequestDTOModel,
    });
    titleList.value = res.data.data[0].children;
    // 处理返回的数据格式
  } catch (error) {
    console.error('获取树数据失败:', error);
  } finally {
    spinningloading.value = false;
  }
}

function attributeManage() {
  visible.value = true;
  nextTick(() => {
    attributeModel.value?.initTreeData(false, treeId.value);
  });
}

// 添加数据
function competitorInfoAdd() {
  competitorInfoVisible.value = true;
  nextTick(() => {
    competitorInfoModel.value?.getListData(treeId.value);
  });
}

function handleCloseAttributeModal() {
  visible.value = false;
}

function handleCloseCompetitorModal() {
  competitorVisible.value = false;
}
function handleCloseCompetitorInfoModal() {
  competitorInfoVisible.value = false;
}
function handleCloseCompetitorUpdateModal() {
  competitorUpdateVisible.value = false;
}

const customRow = (record: any, index: number) => {
  return {
    onClick: () => {
      const key = record.categoryName;
      if (defaultExpandedKeys.value.includes(key)) {
        // 如果已选中则取消选中
        defaultExpandedKeys.value = defaultExpandedKeys.value.filter((k: any) => k !== key);
      } else {
        // 如果未选中则选中
        defaultExpandedKeys.value = [...defaultExpandedKeys.value, key];
      }
    },
    style: {
      backgroundColor: record.children && record.children.length > 0 ? '#fff8e6' : 'transparent',
    },
  };
};

// 编辑数据
function updateComponetitorInfo(id: any) {
  competitorUpdateVisible.value = true;
  nextTick(() => {
    competitorUpdateModel.value?.getListData(id, treeId.value);
  });
}

// 删除数据
function delComponetitorInfo(id: any) {
  AdminApiCompetitor.deleteCompetitorData({ id: id }).then(res => {
    if (res && res.data.code == 200) {
      getResources();
    }
  });
}

function getCompetitorFileList(id: any) {
  fileListVisible.value = true;
  fileTitle.value = '附件名称';
  fileName.value = '附件查看';
  nextTick(() => {
    fileListModel.value?.getListData(id, 2);
  });
}
function getCompetitorImgFileList(id: any) {
  fileListVisible.value = true;
  fileTitle.value = '图片名称';
  fileName.value = '图片查看';
  nextTick(() => {
    fileListModel.value?.getListData(id, 3);
  });
}

function handleCloseFileList() {
  fileListVisible.value = false;
}

function onClose() {
  drawerStyle.value = ref({});
  titleVisible.value = false;
}

function changeSelectCate(id: any) {
  treeId.value = id;
  nextTick(() => {
    getResources();
  });
}
const tableRef = ref(null);
const getTableScrollContainer = () => {
  if (tableRef.value) {
    return tableRef.value.$el.querySelector('.ant-table-body');
  }
  return null;
};
watch(
  () => router.query.parms,
  debounce(() => {
    let paramStr = '';
    if (router.query.parms && activatedFlag.value) {
      activatedFlag.value = false;
      // 对界面上的参数进行解密处理
      paramStr = decryptValue(router.query.parms);
      if (paramStr) {
        getMenuListData();
      }
    }
  }, 100),
  { immediate: true }
);
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
        <a-form-item>
          <a-button type="primary" @click="attributeManage()">
            <EpcIcon type="icon-bianji-blue" style="font-size: 12px" />
            {{ $t('属性管理') }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="competitorInfoAdd()">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加数据') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card style="overflow-y: hidden">
      <a-table
        v-if="datasource.length > 0"
        ref="tableRef"
        :columns="columns"
        :data-source="datasource"
        row-key="categoryName"
        bordered
        v-model:expandedRowKeys="defaultExpandedKeys"
        :pagination="false"
        :scroll="{ x: 'max-content', y: tableHeight }"
        :customRow="customRow">
        <template #headerCell="{ column }">
          <template v-if="column.imgUrl != null && column.imgUrl != ''">
            <div style="text-align: center">
              <div style="display: flex">
                <!--文字数量长度超过10个字时，显示省略号，鼠标移入时显示完整文字-->
                <div class="tableTitle" style="width: 160px; margin-top: -3px">
                  <a-tooltip :title="column.title" placement="top">
                    {{ column.title }}
                  </a-tooltip>
                </div>
                <EpcIcon type="icon-bianji-blue" style="color: blue; margin-left: 5px" @click="updateComponetitorInfo(column.id)" />
                <a-popconfirm :title="`${$t('确定要删除吗')}?`" :ok-text="$t('确定')" :cancel-text="$t('取消')" @confirm="delComponetitorInfo(column.id)">
                  <EpcIcon type="icon-shanchu2" style="color: red; margin-left: 5px" />
                </a-popconfirm>
                <EpcIcon
                  type="icon-cankaowenjian"
                  v-if="column.fileStatus > 0"
                  style="color: #165dff; cursor: pointer; margin-left: 5px"
                  @click="getCompetitorFileList(column.id)" />
                <EpcIcon
                  type="icon-picture"
                  v-if="column.imgFileStatus > 0"
                  style="color: #165dff; cursor: pointer; margin-left: 5px"
                  @click="getCompetitorImgFileList(column.id)" />
              </div>
              <img :src="column.imgUrl" height="90px" width="190px" alt="" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'x1'">
            <div class="tableTitle" style="width: 160px; text-align: left">
              <a-tooltip :title="record[column.dataIndex]" placement="top">
                {{ record[column.dataIndex] }}
                <span v-if="record.unit != null && record.unit != '' && record.unit != ' ' && record.unit != undefined && record.unit != 'null'">({{ record.unit }})</span>
              </a-tooltip>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'x2'">
            <div class="tableTitle" style="width: 160px; text-align: left; display: flex; justify-content: flex-start">
              <a-tooltip :title="record[column.dataIndex]" placement="top">
                {{ record[column.dataIndex] }}
              </a-tooltip>
            </div>
          </template>
          <template v-else>
            <div class="tableTitle" style="width: 160px; text-align: left; white-space: normal; word-break: break-word">
              <a-tooltip :title="record[column.dataIndex]" placement="top"> {{ record[column.dataIndex] }}</a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
      <div v-if="datasource.length > 0" class="custom-btn">
        <a-back-top visibility-height="100" :target="getTableScrollContainer">
          <div class="ant-back-top-inner">
            <EpcIcon type="icon-huidaodingbu" style="font-size: 30px; color: white" />
          </div>
        </a-back-top>
      </div>
    </a-card>
  </div>

  <a-drawer
    :title="`平台车型选取`"
    placement="left"
    :style="drawerStyle"
    :closable="false"
    :visible="titleVisible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @blur="onClose"
    @close="onClose">
    <a-spin :spinning="spinningloading" tip="加载中..." style="margin-left: 200px"> </a-spin>
    <div v-for="(item, index) in titleList" :key="index">
      <p style="margin-left: 15px; margin-top: 10px">
        <EpcIcon type="icon-caidan" style="font-size: 12px" />
        <b style="margin-left: 10px">{{ item.name }}</b>
      </p>
      <div style="width: 460px; display: flex; flex-wrap: wrap; margin-left: 30px">
        <div v-for="(item2, index2) in item.children" :key="index2" style="width: 200px; padding: 0 0 20px 0; cursor: pointer" @click="changeSelectCate(item2.id)">
          <EpcIcon type="icon-chilun--" style="font-size: 14px; color: #0d65ff" /><a class="menuLi">{{ item2.name }}</a>
        </div>
      </div>
    </div>
  </a-drawer>

  <AttributeAdm ref="attributeModel" :modal-visible="visible" @refresh-table-data="getResources" @close="handleCloseAttributeModal" />

  <CompetitorAdm ref="competitorModel" :modal-visible="competitorVisible" @refresh-table-data="getResources" @close="handleCloseCompetitorModal" />

  <CompetitorInfoAdd ref="competitorInfoModel" :modal-visible="competitorInfoVisible" @refresh-table-data="getResources" @close="handleCloseCompetitorInfoModal" />
  <CompetitorInfoUpdate ref="competitorUpdateModel" :modal-visible="competitorUpdateVisible" @refresh-table-data="getResources" @close="handleCloseCompetitorUpdateModal" />
  <FileList ref="fileListModel" :modal-visible="fileListVisible" :file-title="fileTitle" :file-name="fileName" @close="handleCloseFileList" />
</template>

<style lang="less" scoped>
:deep(.custom-btn .ant-back-top) {
  bottom: 50px;
  right: 50px;
}
:deep(.custom-btn .ant-back-top-inner) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4d4d4d;
  &:hover {
    background-color: #151515;
  }
}
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}
.example {
  position: absolute;
  top: 40%;
  left: 50%;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
.tableTitle {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
:deep(.ant-drawer-content-wrapper) {
  width: 500px !important;
}
</style>
