<script lang="ts" setup>
// 系统功能配置
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { ProductSeriesGBOMModuleInfoDTOModel } from '@/api/models/product/ProductSeriesGBOMModuleInfoDTOModel';
const seriesGBOMModuleInfoDTOModel = reactive(new ProductSeriesGBOMModuleInfoDTOModel());
import TreeNode from '@/components/tree/TreeNode.vue';
import getModuleInfoById from '../modal/getModuleInfoById.vue';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { boolean } from 'mathjs';
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  systemTableData: {
    require: false,
    type: Array,
    default: () => [],
  },
  illustrateFile: {
    require: false,
    type: Array,
    default: () => [],
  },
  illustrateString: {
    require: false,
    type: String,
  },
  dataString: {
    require: false,
    type: Object,
    default: () => {},
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
  editBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  isShowBottomBtns: {
    require: false,
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['detaDataUpload', 'toUpload', 'submitOk', 'submitStatus', 'getModuleTree']);
const selfIsShowBottomBtns = ref(true);
const selectTreeVisible = ref<boolean>(false);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
/** 表格列属性 */
const columns = ref<any[]>([
  {
    title: WeiI18n.t('超级GBOM').value,
    dataIndex: 'descript',
    key: 'descript',
    width: 260,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('系统功能分类标识').value,
    dataIndex: 'techid',
    key: 'techid',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('模块选取').value,
    dataIndex: 'moduleSelected',
    key: 'moduleSelected',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('模块编码').value,
    dataIndex: 'moduleNumber',
    key: 'moduleNumber',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('模块名称').value,
    dataIndex: 'moduleName',
    key: 'moduleName',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('应用类型').value,
    dataIndex: 'applicationType',
    key: 'applicationType',
    minWidth: 300,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
function submitStatus(num: any, operationType: any, nodeId: any) {
  emit('submitStatus', num, operationType, nodeId);
}
const existingAssociatedModules = ref<any>([]);
const selectTreeData = ref<any>([]);

const categoryNamesString = ref<any>([]);
const userStore = useUserStore();
const parameterInfoData = ref<{
  moduleParaList: any[];
  moduleList: any[];
}>({
  moduleParaList: [],
  moduleList: [],
});

async function handleApplicationTypeClick(str: any, type: any) {
  let data = {};
  data.applicationType = type;
  data.id = str.id;
  const resA = await AdminApiSystemProduct.updateApplicationType(data);
}

async function relevanceModule(data: any) {
  let param: any = {};
  param.seriesId = data.seriesId;
  param.descript = data.descript;
  const resInfo = await AdminApiSystemProduct.getSericesId(param);
  // 获取第一个键（如果只有一个可变键）
  if (resInfo.data.data) {
    let seId = resInfo.data.data[0].id;

    let param_b: any = {};
    param_b.id = seId;
    const resInfo_b = await AdminApiSystemProduct.getSeriesGBOMModules(param_b);
    const dynamicKey = Object.keys(resInfo_b.data.data)[0];
    let moduleInfoS = '';
    const dataac = resInfo_b.data.data;
    // 获取所有键
    const keys = Object.keys(dataac);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = dataac[key];
      const concatenatedString = value.join(',');
      // 如果不是第一个元素，先添加逗号
      if (i > 0) {
        moduleInfoS += ',';
      }
      moduleInfoS += concatenatedString;
    }
    // 设置参数
    seriesGBOMModuleInfoDTOModel.id = data.id;
    seriesGBOMModuleInfoDTOModel.userId = 60; // 使用当前用户ID而不是硬编码
    // 获取系列GBOM模块数据
    const resA = await AdminApiSystemProduct.getModuleBack(seriesGBOMModuleInfoDTOModel);
    // 存储resA.data到existingAssociatedModules变量中
    existingAssociatedModules.value = resA.data || {};

    let gbomParam: any = {};
    // 获取表格和列表头数据 (resC中的moduleList和moduleParaList)
    gbomParam.categoryId = dynamicKey;
    gbomParam.userName = userStore.getUser.username || 'admin';
    gbomParam.moduleInfoId = moduleInfoS;
    const resC = await AdminApiSystemProduct.findModelByCategoryId(gbomParam);
    // 设置parameterInfoData，包含moduleParaList（动态列表头数据）和moduleList（表格数据）
    if (resC.data && resC.data.data) {
      parameterInfoData.value = {
        moduleParaList: resC.data.data.moduleParaList || [],
        moduleList: resC.data.data.moduleList || [],
      };
    }
    // 打开弹框
    selectTreeVisible.value = true;
  }
}

/**
 * 确认选择树节点，将选中的节点名称传回tree组件
 */
async function confirmSelectTreeNode(item: any) {
  console.log(item);
  let data = {};
  data.id = seriesGBOMModuleInfoDTOModel.id;
  data.moduleId = item[0];
  const resC = await AdminApiSystemProduct.ckSystemDesignCheckModule(data);
  if (resC.status == 200) {
    emit('getModuleTree');
    selectTreeVisible.value = false;
    message.success(WeiI18n.t('关联成功').value);
  } else {
    message.success(WeiI18n.t('关联失败').value);
  }
}

async function cancelSelectTreeNode(item: any) {
  selectTreeVisible.value = false;
}

async function handleSelectTreeNode(item: any, info: any) {
  try {
    // 设置当前节点ID
    seriesGBOMModuleInfoDTOModel.categoryId = info.node.id; // 使用点击节点的ID
    seriesGBOMModuleInfoDTOModel.userName = userStore.getUser.username || 'admin'; // 设置当前用户名
    // 调用接口获取数据
    const resC = await AdminApiSystemProduct.findModelByCategoryId(seriesGBOMModuleInfoDTOModel);
    // 更新parameterInfoData，包含moduleParaList（动态列表头数据）和moduleList（表格数据）
    if (resC.data && resC.data.data) {
      parameterInfoData.value = {
        moduleParaList: resC.data.data.moduleParaList || [],
        moduleList: resC.data.data.moduleList || [],
      };
    }
  } catch (error) {
    message.error(WeiI18n.t('获取数据失败').value);
  }
}

defineExpose({});
</script>

<template>
  <div class="container">
    <div class="box">
      <a-row class="elrowheight">
        <div class="top-block">
          <div class="block-inner">
            <img class="pic" :src="taskInfoData.picUrl" />
            <div class="dec-wrap">
              <div class="t">{{ taskInfoData.taskName }}</div>
              <div class="tm">平台名称：{{ taskInfoData.platformName }}</div>
              <div class="tm">任务时间：{{ taskInfoData.startTime }} ~ {{ taskInfoData.endTime }}</div>
              <div class="pr">
                <span>当前进度：{{ taskInfoData.taskPercentage }}%</span><span>距截止还剩{{ taskInfoData.deadlineDays }}天</span>
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
          <span>模块选型</span>
        </div>
        <div style="margin: 20px 20px 28px 16px; width: 100%">
          <a-table
            :scroll="{ y: 400 }"
            style="margin-top: 5px; margin-right: 16px"
            :pagination="false"
            row-key="id"
            :locale="locale"
            :columns="columns"
            :data-source="systemTableData"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'moduleSelected'">
                <div style="display: flex">
                  <a-button type="link" :disabled="commitBtnStatus" @click="!commitBtnStatus && relevanceModule(record)" style="padding: 0"> 浏览 </a-button>
                </div>
              </template>
              <template v-if="column.dataIndex === 'applicationType'">
                <a-select v-model:value="record.applicationType" placeholder="请选择应用类型" allow-clear show-search style="width: 170px">
                  <a-select-option key="0" value="0" @click="handleApplicationTypeClick(record, '0')">{{ '直接应用' }} </a-select-option>
                  <a-select-option key="1" value="1" @click="handleApplicationTypeClick(record, '1')">{{ '变形设计' }} </a-select-option>
                </a-select>
              </template>
            </template>
          </a-table>
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="selfIsShowBottomBtns && isShowBottomBtns">
            <a-button type="primary" @click="submitStatus(2, 1, selectedKeys)" :disabled="commitBtnStatus">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button type="primary" class="btn_left" @click="submitStatus(2, 0)" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>

  <getModuleInfoById
    ref="selectBoomTreeRef"
    :modal-visible="selectTreeVisible"
    :select-tree-data="selectTreeData"
    :parameter-info-data="parameterInfoData"
    :existing-resources="existingAssociatedModules"
    :category-names-string="categoryNamesString"
    @confirm-select-tree-node="confirmSelectTreeNode"
    @cancelSelectTreeNode="cancelSelectTreeNode"
    @handle-select-tree-node="handleSelectTreeNode" />
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
.box {
  width: 100%;
  height: 100%;
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
