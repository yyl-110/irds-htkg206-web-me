<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { BoardPageRequestDTOModel } from '@/api/models/board/BoardPageRequestDTOModel';
import { AdminApiCompetitor } from '@/api/tags/competitor/竞品数据库管理';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { EpcIcon } from '@/components/icon/EpcIcon';
import CompetitorComparing from '@/views/competitor/manage/components/CompetitorComparing.vue';
import ScatterPlot from '@/views/competitor/manage/components/ScatterPlot.vue';
import FileList from '@/views/competitor/manage/components/FileList.vue';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { debounce } from 'lodash-es';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import { useLayoutStore } from '@/store/modules/layout/layout';
const layoutStore = useLayoutStore();
const userStore = useUserStore();
const router = useRoute();
const spinningloading = ref<boolean>(false);
const loading = ref<boolean>(false);
const visible = ref<boolean>(false);
const scatterPlotVisible = ref<boolean>(false);
const attributeModel = ref<any>();
const competitorUpdateModel = ref<any>();
const scatterPlotModel = ref<any>();
const fileListModel = ref<any>();
const competitorUpdateVisible = ref<boolean>(false);
const columns = ref<any>([]);
const datasource = ref<any>([]);
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const defaultExpandedKeys = ref<any>([]);
const tableHeight = ref(window.innerHeight - 400);
const checkComp = ref<any>([]);
const drawerVisible = ref<boolean>(false);
const factoryList = ref<any>([]);
const factoryListChil = ref<any>([]);
const factoryLevel = ref<any>("");
const multiple = ref<any>("");
const multipleChil = ref<any>("");
const fileListVisible = ref<boolean>(false);
const competitorComparingvisible = ref<boolean>(false);
const fileTitle = ref('');
const fileName = ref('');
const activatedFlag = ref<boolean>(true);
const titleVisible = ref<boolean>(false);
const treeData = ref<any[]>([]);
const titleList = ref<any>([]);
const allColyms = ref<any>([]);
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
  checkComp.value = [];
  getResources();
});
/** 加载列表信息 */
async function getResources() {
  loading.value = true;
  try {
    if (treeId.value == 0) {
      return;
    }
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
    //调用接口获取所有清单和信息
    const res = await AdminApiCompetitor.getComparisonLevelList({ treeId: treeId.value });
    allColyms.value = res.data.data.columnStr;
    
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
    const res = await AdminApiSystemProduct.getProductTree({ ...productTreeInfoRequestDTOModel });
    titleList.value = res.data.data[0].children;
    // 处理返回的数据格式
  } catch (error) {
    console.error('获取树数据失败:', error);
  } finally {
    spinningloading.value = false;
    
  }
}


function competitorComparisonMain() {
  checkComp.value = [];
  multiple.value = "";
  competitorComparison();
  drawerVisible.value = true;
}
async function competitorComparison() {
  factoryList.value = [];
  let itemChildren1 = {
    label: '请选择制造商',
    value: ''
  };
  factoryList.value.push(itemChildren1);
  //循环编辑columns中的一级目录
  allColyms.value.forEach((item: any) => {
    if (item.title != '制造商' && item.title != '' && item.children && item.children.length > 0) {
      let itemChildren = {
        label: item.title,
        value: item.title
      };
      //判断不是所有子节点都在checkComp中则添加
      let nums = 0
      item.children.forEach((item: any) => {
        //判断不再checkComp存在则添加
        if (!checkComp.value.some((itemc: any) => itemc.title === item.title)) {
          nums++;
        }
      });
      if (nums !=0) {
        factoryList.value.push(itemChildren);
      }
    }
  });
  factoryLevel.value = 1;
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
    competitorUpdateModel.value?.getListData(id);
  });
}

// 删除数据
function delComponetitorInfo(item: any) {
  //移除checkComp中对象
  checkComp.value = checkComp.value.filter((itemc: any) => itemc.title !== item.title);
  competitorComparison();
}

function clearTabSelect() {
  checkComp.value = [];
  multiple.value = "";
  multipleChil.value = "";
  factoryListChil.value = [];
  competitorComparison();
} 

function factoryChange() {
    if (multiple.value != "") {
      //查找车型数据
      factoryListChil.value = [];
      multipleChil.value = "";
      let itemChildren1 = {
        label: '请选择车型',
        value: ''
      };
      factoryListChil.value.push(itemChildren1);
      //循环编辑columns中的一级目录
      allColyms.value.forEach((item: any) => {
        if (item.title == multiple.value && item.children && item.children.length > 0) {
          item.children.forEach((item: any) => {
            //判断不再checkComp存在则添加
            if (!checkComp.value.some((itemc: any) => itemc.title === item.title)) {
              let itemChildren = {
                label: item.title,
                value: item.title
              };
              factoryListChil.value.push(itemChildren);
            }
            factoryLevel.value = 2;
          });
        }
      });
    }

} 

function factoryChangeChil() { 
  allColyms.value.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
          item.children.forEach((item2: any) => {
            if (item2.title == multipleChil.value) {
              checkComp.value.push(item2);
            }
          });
      }
    });
  factoryLevel.value = 1;
  competitorComparison();
  multiple.value = "";
  multipleChil.value = "";
}
//开始比较
function startComparing() {
  competitorComparingvisible.value = true;
  nextTick(() => {
    attributeModel.value?.getListData(checkComp.value,treeId.value);
  });
} 
function handleCloseAttributeModal() {
  competitorComparingvisible.value = false;
}

function handleCloseScatterPlotModel() {
  scatterPlotVisible.value = false;
}

function handleCloseFileList() {
  fileListVisible.value = false;
}

function propComparisonMain() {
  //获取复选框选中的数据
  scatterPlotVisible.value = true;
  //获取当前选中的数据构建散点图横竖坐标
  nextTick(() => {
    scatterPlotModel.value?.getListData();
  });
}

function getFooter() {
  //插入底部合计
  let footer = "合计,100,合计,100";
  return footer;
 
}

function getCompetitorFileList(id: any) {
  fileListVisible.value = true;
  fileTitle.value = '附件名称';
  fileName.value = '附件查看';
  nextTick(() => {
    fileListModel.value?.getListData(id,2);
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

/** 勾选表格数据源  */
const selectedRowList = ref<any[]>([]);
const selectedRowkeys = ref<any[]>([]);
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRows: selectedRowList.value,
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: any) => {
      if (selected) {
        selectedRowkeys.value.push(record.id);
        const newSelectedKeys = [...new Set([...selectedRowkeys.value])];
        selectedRowkeys.value = newSelectedKeys;
      } else {
        const newSelectedRows = selectedRowkeys.value.filter(item => item != record.id);
        selectedRowkeys.value = newSelectedRows;
      }
    },

  };
});

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

const tableRef = ref(null);
const getTableScrollContainer = () => {
  if (tableRef.value) {
    return tableRef.value.$el.querySelector('.ant-table-body');
  }
  return null;
};
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
        <a-form-item>
          <a-button type="primary" @click="competitorComparisonMain()">
            <EpcIcon type="icon-bianji-blue" style="font-size: 12px" />
            {{ $t('整车比较') }}
          </a-button>
        </a-form-item>
        <!-- <a-form-item>
          <a-button type="primary" @click="propComparisonMain()">
            <EpcIcon type="icon-caidan" style="font-size: 12px" />
            {{ $t('参数比较') }}
          </a-button>
        </a-form-item> -->
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
                {{ record[column.dataIndex] }}<span v-if="record.unit != null && record.unit != '' && record.unit != ' ' && record.unit != undefined && record.unit != 'null'">({{ record.unit }})</span>
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
              <a-tooltip :title="record[column.dataIndex]" placement="top">
                {{ record[column.dataIndex] }}
              </a-tooltip>
            </div>
          </template>
        </template>
        
      </a-table>
      <div v-if="datasource.length > 0" class="custom-btn" >
        <a-back-top visibility-height="100" :target="getTableScrollContainer">
          <div class="ant-back-top-inner">
            <EpcIcon type="icon-huidaodingbu" style="font-size: 30px;color: white;" />
          </div>
        </a-back-top>
      </div>
    </a-card>
  </div>
  <a-drawer title="" placement="right" :closable="false" v-model:visible="drawerVisible">
    <p>
      <img src="@/assets/images/pk.png" alt="logo" style="width: 150px" />
    </p>
    <p style="color: #969696">最多可添加十个车型</p>
    <p style="margin-top: 20px;">
      <div v-for="(item, index) in checkComp" :key="index">
      <div
        style="display: flex; background-color: #ecf5ff; margin-top: 30px; margin-left: 10px; margin-right: 10px; border-radius: 10px; cursor: pointer">
        <div style="height: 60px; width: 100px; border-radius: 10px; background-color: #165dff">
          <center>
            <img  width="100" height="60" :src="item.imgUrl" preview="false" />
          </center>
        </div>
        <span style="margin-top: 20px;margin-left: 10px;" v-if="item.parentName != ''"><b>{{ item.parentName }}</b></span>
        <span style="margin-top: 20px;margin-left: 10px;width:130px;">{{ item.title }}</span>
        <!--最后防止一个x移除数据-->
        <div style="position: absolute; right: 40px;margin-top: 20px;;">
          <a-popconfirm :title="`${$t('确定要移除吗')}?`" placement="topLeft" :ok-text="$t('确定')" :cancel-text="$t('取消')" @confirm="delComponetitorInfo(item)">
            <EpcIcon type="icon-shanchu2" style="color: red; margin-left: 5px" />
          </a-popconfirm>
        </div>
      </div>
    </div>
    </p>
    <p style="margin-top: 20px;">
      <a-select v-model:value="multiple" placeholder="请选择制造商" style="width: 320px;margin-left: 15px;" @change="factoryChange">
        <a-select-option v-for="item in factoryList" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </p>
    <p style="margin-top: 20px;">
      <a-select v-model:value="multipleChil" placeholder="请选择车型" style="width: 320px;margin-left: 15px;" @change="factoryChangeChil">
        <a-select-option v-for="item in factoryListChil" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </p>
    <p>
      <a-button type="primary" @click="startComparing" :disabled="checkComp.length<2" style="margin-top: 20px;margin-left: 15px;height: 45px;width: 320px;">
        <EpcIcon type="icon-search" style="font-size: 12px" />
        {{ $t('开始对比') }}</a-button>
    </p>
      <div style="text-align: center;cursor:pointer" @click="clearTabSelect"><EpcIcon type="icon-shanchu2" style="font-size:12px;margin-right:3px;"/>清空所有车型</div>
  </a-drawer>

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
  <CompetitorComparing ref="attributeModel" :modal-visible="competitorComparingvisible" @close="handleCloseAttributeModal" />
  <ScatterPlot ref="scatterPlotModel" :modal-visible="scatterPlotVisible" @close="handleCloseScatterPlotModel" />
  <FileList ref="fileListModel" :modal-visible="fileListVisible" :file-title="fileTitle" :file-name="fileName" @close="handleCloseFileList" />


  
</template>

<style lang="less" scoped>
:deep(.custom-btn .ant-back-top){
 bottom: 50px;
 right: 50px;
}
:deep(.custom-btn .ant-back-top-inner){
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
:deep(.ant-select-selection-item) {
  color: #bfbfcb;
}
</style>
