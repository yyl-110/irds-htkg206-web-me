<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { ProdDesignPageRequestDTOModel } from '@/api/models/design/ProdDesignPageRequestDTOModel';
import myrequest from './myrequest/index.vue'; // 我的需求
import requirementsgathering from './requirementsgathering/index.vue'; // 需求收集
import requirementsanalysis from './requirementsanalysis/index.vue'; // 需求分析
import demanddistribution from './demanddistribution/index.vue'; // 需求分发
import requirementimplementation from './requirementimplementation/index.vue'; // 需求实现
import acceptanceRequirements from './acceptanceRequirements/index.vue'; // 需求验收
import requirementchange from './requirementchange/index.vue'; // 需求变更
import { debounce } from 'lodash-es';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import { useLayoutStore } from '@/store/modules/layout/layout';
const layoutStore = useLayoutStore();
const router = useRoute();
// 树结构相关属性
const treeData = ref<any[]>([]);
const userStore = useUserStore();
const titleVisible = ref<boolean>(false);
const spinningloading = ref<boolean>(false);
const designType = ref(0); // 页面状态展示
const titleList = ref([
  {
    key: '1',
    title: WeiI18n.t('我的需求').value,
    iconType: 'icon-wodexuqiu',
    Key: 'my-needs',
    count: '',
  },
  {
    key: '2',
    title: WeiI18n.t('需求收集').value,
    iconType: 'icon-xuqiushouji',
    Key: 'demand-gathering',
    demandGatheringCount: 'demandGatheringCount',
    count: '',
  },
  {
    key: '3',
    title: WeiI18n.t('需求分析').value,
    iconType: 'icon-edit',
    Key: 'demand-analysis',
    demandAnalysisCount: 'demandAnalysisCount',
    count: '',
  },
  {
    key: '4',
    title: WeiI18n.t('需求分发').value,
    iconType: 'icon-xuqiufenfa',
    Key: 'demand-distribution',
    demandDistributionCount: 'demandDistributionCount',
    count: '',
  },
  {
    key: '5',
    title: WeiI18n.t('需求实现').value,
    iconType: 'icon-xuqiushixian',
    Key: 'demand-implementation',
    demandImplementationCount: 'demandImplementationCount',
    count: '',
  },
  {
    key: '6',
    title: WeiI18n.t('需求验收').value,
    iconType: 'icon-icon-xuqiu-yanshouguanli',
    Key: 'demand-acceptance',
    demandAcceptanceCount: 'demandAcceptanceCount',
    count: '',
  },
  {
    key: '7',
    title: WeiI18n.t('需求变更').value,
    iconType: 'icon-xuqiubiangeng',
    Key: 'demand-change',
    demandChangeCount: 'demandChangeCount',
    count: '',
  },
  // {
  //   key: '8',
  //   title: WeiI18n.t('数据看板').value,
  //   iconType: 'icon-juecefenxi',
  //   Key: 'data-dashboard',
  //   count: '',
  // },
]);

const activatedFlag = ref<boolean>(true);
const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '65px',
  width: '200px',
  height: 'calc(100vh - 65px)',
});
const myrequestRef = ref<any>(); // 我的需求
const requirementsgatheringRef = ref<any>(); // 需求收集
const requirementsanalysisRef = ref<any>(); // 需求分析
const demanddistributionRef = ref<any>(); // 需求分发
const requirementimplementationRef = ref<any>(); // 需求分发
const acceptanceRequirementsRef = ref<any>(); // 需求验收
const requirementchangeRef = ref<any>(); // 需求变更分析
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

  try {
    spinningloading.value = true;
    const res = await AdminApiSystemDemand.getDemandMenuList({});
    if (res.data.code == 200) {
      let data: any = res.data.data;
      titleList.value = titleList.value.filter((item: any) => data.includes(item.Key));
      getDemandTodoList();
    }
  } catch (error) {
    console.error('获取树数据失败:', error);
  } finally {
    spinningloading.value = false;
  }
}
async function getDemandTodoList() {
  try {
    const res = await AdminApiSystemDemand.getDemandTodoList({});
    if (res.data.code == 200) {
      let obj: any = res.data.data;
      await Assignthesamekey(obj);
    }
  } catch (error) {
    console.error('error', error);
  }
}
function Assignthesamekey(obj: any) {
  titleList.value.forEach((item: any) => {
    // 只检查以 'Count' 结尾的属性（假设特殊属性均符合此规律）
    const countProp = Object.keys(item).find(key => key.endsWith('Count') && obj.hasOwnProperty(item[key]));
    if (countProp) {
      item.count = obj[item[countProp]];
    }
  });
}
function todocount(type: string) {
  let str = '';
  titleList.value.forEach((item: any) => {
    if (item.title == type) {
      str = item.count;
    }
  });
  return str;
}
function onClose() {
  drawerStyle.value = ref({});
  titleVisible.value = false;
}

function changeSelectCate(item: any) {
  designType.value = item.key;
  drawerStyle.value = ref({});
  titleVisible.value = false;
  nextTick(() => {
    if (item.key == 1) {
      myrequestRef.value.initnotification();
    } else if (item.key == 2) {
      requirementsgatheringRef.value.getListData();
      requirementsgatheringRef.value.getListData2();
    } else if (item.key == 3) {
      requirementsanalysisRef.value.getListData();
      requirementsanalysisRef.value.getListData2();
    } else if (item.key == 4) {
      demanddistributionRef.value.getListData();
      demanddistributionRef.value.getListData2();
    } else if (item.key == 5) {
      requirementimplementationRef.value.getListData();
      requirementimplementationRef.value.getListData2();
    } else if (item.key == 6) {
      acceptanceRequirementsRef.value.getListData();
    } else if (item.key == 7) {
      requirementchangeRef.value.getListData();
    }
  });
}

onActivated(() => {
  activatedFlag.value = true;
});
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
  <div>
    <myrequest v-if="designType == 1" ref="myrequestRef"></myrequest>
    <requirementsgathering
      v-if="designType == 2"
      :todocount="todocount('需求收集')"
      @Refreshpendingtasks="getDemandTodoList"
      ref="requirementsgatheringRef"></requirementsgathering>
    <requirementsanalysis v-if="designType == 3" :todocount="todocount('需求分析')" @Refreshpendingtasks="getDemandTodoList" ref="requirementsanalysisRef"></requirementsanalysis>
    <demanddistribution v-if="designType == 4" :todocount="todocount('需求分发')" @Refreshpendingtasks="getDemandTodoList" ref="demanddistributionRef"></demanddistribution>
    <requirementimplementation
      v-if="designType == 5"
      :todocount="todocount('需求实现')"
      @Refreshpendingtasks="getDemandTodoList"
      ref="requirementimplementationRef"></requirementimplementation>
    <acceptanceRequirements
      v-if="designType == 6"
      :todocount="todocount('需求验收')"
      @Refreshpendingtasks="getDemandTodoList"
      ref="acceptanceRequirementsRef"></acceptanceRequirements>
    <requirementchange v-if="designType == 7" :todocount="todocount('需求变更')" @Refreshpendingtasks="getDemandTodoList" ref="requirementchangeRef"></requirementchange>
  </div>
  <a-drawer
    :title="`需求菜单`"
    placement="left"
    :style="drawerStyle"
    :closable="false"
    :visible="titleVisible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @blur="onClose"
    @close="onClose">
    <a-spin :spinning="spinningloading" tip="加载中...">
      <div v-for="(item, index) in titleList" :key="index">
        <div style="display: flex; background-color: #ecf5ff; margin: 15px 10px 0 10px; border-radius: 10px; height: 30px; cursor: pointer" @click="changeSelectCate(item)">
          <EpcIcon :type="item.iconType" style="font-size: 22px; margin: 5px 10px 0 10px; color: #165dff" />
          <div class="menuLi">{{ item.title }}</div>
          <a-badge :count="item.count" title="待办数量" :overflow-count="99"> </a-badge>
        </div>
      </div>
    </a-spin>
  </a-drawer>
</template>

<style lang="less" scoped>
:deep(.ant-badge-count) {
  top: -3px;
  width: auto;
  height: 20px; /* 设置高度 */
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
  margin: 5px 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
}
.menuLi:hover {
  transform: translateY(-2px);
  color: #165dff;
}
</style>
