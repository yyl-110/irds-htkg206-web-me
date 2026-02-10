<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { useRoute, useRouter } from 'vue-router';
import { decryptValue } from '@/utils';
import { debounce } from 'lodash-es';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';

/**自定义页面组件引入 */
import Gsgcdy from './components/020-Gsgcdy.vue';
import Gszcdy from './components/030-Gszcdy.vue';
import Zlmbfj from './components/040-Zlmbfj.vue';
import Qdcpzhpx from './components/180-Qdcpzhpx.vue';
import Ssgdph from './components/190-Ssgdph.vue';
import Cpjzlss from './components/200-Cpjzlss.vue';
import Zdcplb from './components/300-Zdcplb.vue';
import Zdcpkfjh from './components/390-Zdcpkfjh.vue';
import Yftzys from './components/310-Yftzys.vue';
import Ghhgfx from './components/050-Ghhgfx.vue';
import Jpfx from './components/070-Jpfx.vue';
import Zdyxcl from './components/320-Zdyxcl.vue';
import Jsqxfx from './components/080-Jsqxfx.vue';
import Scqxfx from './components/100-Scqxfx.vue';
import Yhtdfx from './components/110-Yhtdfx.vue';
import Flfgfx from './components/120-Flfgfx.vue';
import Wgbjfx from './components/140-Wgbjfx.vue';
import Tzhgfx from './components/150-Tzhgfx.vue';
import Xqfx from './components/XQ050-Xqfx.vue';
import Dybfqcpzhqdpc from './components/160-Dybfqcpzhqdpc.vue';
import Zdcpzhsmzqcl from './components/210-Zdcpzhsmzqcl.vue';
import Jswwkfxq from './components/220-Jswwkfxq.vue';
import Xlyc from './components/240-Xlyc.vue';
import Zdcghzcl from './components/230-Zdcghzcl.vue';
import Srylryc from './components/250-Srylryc.vue';
import Tzphss from './components/260-Tzphss.vue';
import Zdbfqcpzhclps from './components/270-Zdbfqcpzhclps.vue';
import Zdfbfa from './components/330-Zdfbfa.vue';
import Gctzgh from './components/340-Gctzgh.vue';
import Tzyshgs from './components/350-Tzyshgs.vue';
import Dybfqzhcpghbgps from './components/360-Dybfqzhcpghbgps.vue';
const router = useRoute();
const productInfo = ref<any>({});
const definitionTaName = ref<string>('');
const treeData = ref<any>([]);
const filteredTreeData = ref<any>([]);
const selectedKeys = ref<string[]>([]);
const newExpandedKeys = ref<string[]>([]);
const searchValue = ref<string>('');
const dynamicCmpRef = ref<any>({});
const selectedNode = ref<any>({});
const currentComponent = ref<any>(Gsgcdy);
const activatedFlag = ref<boolean>(true);
const fieldNames: TreeProps['fieldNames'] = {
  key: 'id',
};
async function selectNode(node: any) {
  // 更新选中状态
  if (node.associatePageUrl == null || node.associatePageUrl == 'null') {
    return;
  }
  selectedKeys.value = [node.id];
  switch (node.associatePageUrl) {
    case '020-Gsgcdy':
      currentComponent.value = Gsgcdy;
      break;
    case '030-Gszcdy':
      currentComponent.value = Gszcdy;
      break;
    case '040-Zlmbfj':
      currentComponent.value = Zlmbfj;
      break;
    case '180-Qdcpzhpx':
      currentComponent.value = Qdcpzhpx;
      break;
    case '190-Ssgdph':
      currentComponent.value = Ssgdph;
      break;
    case '200-Cpjzlss':
      currentComponent.value = Cpjzlss;
      break;
    case '300-Zdcplb':
      currentComponent.value = Zdcplb;
      break;
    case '390-Zdcpkfjh':
      currentComponent.value = Zdcpkfjh;
      break;
    case '310-Yftzys':
      currentComponent.value = Yftzys;
      break;
    case '050-Ghhgfx':
      currentComponent.value = Ghhgfx;
      break;
    case '070-Jpfx':
      currentComponent.value = Jpfx;
      break;
    case '320-Zdyxcl':
      currentComponent.value = Zdyxcl;
      break;
    case '080-Jsqxfx':
      currentComponent.value = Jsqxfx;
      break;
    case '100-Scqxfx':
      currentComponent.value = Scqxfx;
      break;
    case '110-Yhtdfx':
      currentComponent.value = Yhtdfx;
      break;
    case '120-Flfgfx':
      currentComponent.value = Flfgfx;
      break;
    case '140-Wgbjfx':
      currentComponent.value = Wgbjfx;
      break;
    case '150-Tzhgfx':
      currentComponent.value = Tzhgfx;
      break;
    case 'XQ050-Xqfx':
      currentComponent.value = Xqfx;
      break;
    case '160-Dybfqcpzhqdpc':
      currentComponent.value = Dybfqcpzhqdpc;
      break;
    case '210-Zdcpzhsmzqcl':
      currentComponent.value = Zdcpzhsmzqcl;
      break;
    case '220-Jswwkfxq':
      currentComponent.value = Jswwkfxq;
      break;
    case '240-Xlyc':
      currentComponent.value = Xlyc;
      break;
    case '230-Zdcghzcl':
      currentComponent.value = Zdcghzcl;
      break;
    case '250-Srylryc':
      currentComponent.value = Srylryc;
      break;
    case '260-Tzphss':
      currentComponent.value = Tzphss;
      break;
    case '270-Zdbfqcpzhclps':
      currentComponent.value = Zdbfqcpzhclps;
      break;
    case '330-Zdfbfa':
      currentComponent.value = Zdfbfa;
      break;
    case '340-Gctzgh':
      currentComponent.value = Gctzgh;
      break;
    case '350-Tzyshgs':
      currentComponent.value = Tzyshgs;
      break;
    case '360-Dybfqzhcpghbgps':
      currentComponent.value = Dybfqzhcpghbgps;
      break;
    default:
      break;
  }
  nextTick(() => {
    dynamicCmpRef.value?.initInfo(node, productInfo.value);
  });
}
/** 处理树节点选择事件 */
function onSelect(keys: string[], info: any) {
  selectedNode.value = info.node;
  selectNode(info.node);
}
function isEmptyObject(obj: any) {
  // 先判断是否为对象类型（排除 null/数组/其他类型）
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false; // 非对象类型直接返回 false
  }
  return Object.keys(obj).length === 0;
}

/**
 * 过滤树节点数据
 * @param keyword 搜索关键字
 */
function filterTreeData(keyword?: string) {
  const searchText = keyword || searchValue.value;
  let selectnode = {};
  if (!searchText.trim()) {
    // 如果搜索框为空，显示全部数据
    filteredTreeData.value = JSON.parse(JSON.stringify(treeData.value));
    // return;
  }

  // 递归过滤树节点
  const filterNodes = (nodes: any[]) => {
    return nodes
      .map(node => {
        const filteredNode = { ...node };
        // 检查当前节点是否匹配
        const isMatch = node.nodeName && node.nodeName.toLowerCase().includes(searchText.toLowerCase());
        if (!isEmptyObject(selectedNode.value) && selectedNode.value.associatePageUrl == node.associatePageUrl) {
          selectnode = node;
          dynamicCmpRef.value?.initInfo(node, productInfo.value);
        } else {
          if (node.associatePageUrl == productInfo.value.associatePageUrl) {
            selectnode = node;
            dynamicCmpRef.value?.initInfo(node, productInfo.value);
            selectedKeys.value.push(node.id);
            newExpandedKeys.value.push('0');
            newExpandedKeys.value.push(node.parentId);
          }
        }
        // 递归过滤子节点
        if (node.children && node.children.length > 0) {
          filteredNode.children = filterNodes(node.children);
          // 如果有匹配的子节点，也显示当前节点
          return isMatch || filteredNode.children.length > 0 ? filteredNode : null;
        }
        return isMatch ? filteredNode : null;
      })
      .filter(Boolean);
  };
  filteredTreeData.value = filterNodes(JSON.parse(JSON.stringify(treeData.value)));
  selectedNode.value = selectnode;
}

async function refreshTree(id: any) {
  selectedKeys.value = [id];
  let data = {
    id: productInfo.value.planId,
  };
  const res = await AdminApiSystemProductSpecification.getProductTaskTreeInfo(data);
  treeData.value = res.data.data;
  // 初始化过滤后的数据
  nextTick(() => {
    filterTreeData();
  });
}
async function getTreeData() {
  selectedKeys.value = [];
  let data = {
    id: productInfo.value.planId,
  };
  const res = await AdminApiSystemProductSpecification.getProductTaskTreeInfo(data);
  treeData.value = res.data.data;
  // 初始化过滤后的数据
  nextTick(() => {
    filterTreeData();
  });
}

// 监听搜索框输入变化
watch(searchValue, newValue => {
  filterTreeData(newValue);
});

// watch(
//   () => router.query.parms,
//   (newvalue: any, oldValue: any) => {
//     let parm = decryptValue(newvalue);
//     let paramStr = JSON.parse(parm);
//     productInfo.value = paramStr;
//   },
//   { immediate: true, deep: true }
// );

watch(
  () => router.query.parms,
  debounce((newParm, oldParm) => {
    // 只有在当前的路由下面才去触发事件处理函数
    if (newParm !== oldParm && router.path === '/home/taskFlow') {
      if (router.query.parms && activatedFlag.value) {
        activatedFlag.value = false;
        let parm = decryptValue(newParm);
        let paramStr = JSON.parse(parm);
        productInfo.value = paramStr;
        getTreeData();
        switch (productInfo.value.associatePageUrl) {
          case '020-Gsgcdy':
            currentComponent.value = Gsgcdy;
            break;
          case '030-Gszcdy':
            currentComponent.value = Gszcdy;
            break;
          case '040-Zlmbfj':
            currentComponent.value = Zlmbfj;
            break;
          case '180-Qdcpzhpx':
            currentComponent.value = Qdcpzhpx;
            break;
          case '190-Ssgdph':
            currentComponent.value = Ssgdph;
            break;
          case '200-Cpjzlss':
            currentComponent.value = Cpjzlss;
            break;
          case '300-Zdcplb':
            currentComponent.value = Zdcplb;
            break;
          case '390-Zdcpkfjh':
            currentComponent.value = Zdcpkfjh;
            break;
          case '310-Yftzys':
            currentComponent.value = Yftzys;
            break;
          case '050-Ghhgfx':
            currentComponent.value = Ghhgfx;
            break;
          case '070-Jpfx':
            currentComponent.value = Jpfx;
            break;
          case '320-Zdyxcl':
            currentComponent.value = Zdyxcl;
            break;
          case '080-Jsqxfx':
            currentComponent.value = Jsqxfx;
            break;
          case '100-Scqxfx':
            currentComponent.value = Scqxfx;
            break;
          case '110-Yhtdfx':
            currentComponent.value = Yhtdfx;
            break;
          case '120-Flfgfx':
            currentComponent.value = Flfgfx;
            break;
          case '140-Wgbjfx':
            currentComponent.value = Wgbjfx;
            break;
          case '150-Tzhgfx':
            currentComponent.value = Tzhgfx;
            break;
          case 'XQ050-Xqfx':
            currentComponent.value = Xqfx;
            break;
          case '160-Dybfqcpzhqdpc':
            currentComponent.value = Dybfqcpzhqdpc;
            break;
          case '210-Zdcpzhsmzqcl':
            currentComponent.value = Zdcpzhsmzqcl;
            break;
          case '220-Jswwkfxq':
            currentComponent.value = Jswwkfxq;
            break;
          case '240-Xlyc':
            currentComponent.value = Xlyc;
            break;
          case '230-Zdcghzcl':
            currentComponent.value = Zdcghzcl;
            break;
          case '250-Srylryc':
            currentComponent.value = Srylryc;
            break;
          case '260-Tzphss':
            currentComponent.value = Tzphss;
            break;
          case '270-Zdbfqcpzhclps':
            currentComponent.value = Zdbfqcpzhclps;
            break;
          case '330-Zdfbfa':
            currentComponent.value = Zdfbfa;
            break;
          case '340-Gctzgh':
            currentComponent.value = Gctzgh;
            break;
          case '350-Tzyshgs':
            currentComponent.value = Tzyshgs;
            break;
          case '360-Dybfqzhcpghbgps':
            currentComponent.value = Dybfqzhcpghbgps;
            break;
          default:
            break;
        }
      }
    }
  }, 10),
  { immediate: true }
);

onActivated(() => {
  activatedFlag.value = true;
});
</script>

<template>
  <div class="drawerContent">
    <!-- 左侧树结构 -->
    <Splitpanes class="default-theme sbom">
      <Pane min-size="15" :size="20" class="splitpane-cls marginstyle">
        <div class="controls-wrap">
          <a-input v-model:value="searchValue" style="margin-left: 10px; margin-bottom: 8px; width: 90%" :placeholder="$t('请输入关键字')" allow-clear />
        </div>
        <div>
          <a-directory-tree
            v-model:selected-keys="selectedKeys"
            v-model:expanded-keys="newExpandedKeys"
            style="height: calc(100vh - 180px); width: 100%; overflow-y: auto"
            :field-names="fieldNames"
            :show-icon="true"
            :tree-data="filteredTreeData"
            :expand-action="false"
            default-expand-all
            @select="onSelect">
            <template #title="item">
              <span :style="{ color: item.status == 3 ? '#67c23a' : '#rgba(0,0,0,.85)' }" v-if="item.nodeType == '任务'"
                >{{ item.nodeName }}<span v-if="item.headUserName">（{{ item.headUserName }}）</span></span
              >
              <span :style="{ color: item.status == 3 ? '#67c23a' : '#rgba(0,0,0,.85)' }" v-if="item.nodeType != '任务'">{{ item.nodeName }}</span>
            </template>
          </a-directory-tree>
        </div>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <keep-alive>
          <component :is="currentComponent" ref="dynamicCmpRef" @refreshTree="refreshTree" />
        </keep-alive>
      </Pane>
    </Splitpanes>
  </div>
</template>

<style lang="less" scoped>
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
  display: flex;
  height: calc(100vh - 120px);
  background-color: #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
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

//表格里的适用阶段样式
.status-tags {
  span {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: #6a696e;
    line-height: 12px;
    font-style: normal;
    text-transform: none;
    min-width: 64px;
    height: 20px;
    background: #eaeaf1;
    border-radius: 13px 13px 13px 13px;
    text-align: center;
    padding: 4px 8px;
    margin-right: 4px;
  }
}

// ant-tree-treenode
:deep(.ant-tree-treenode) {
  width: 400px;
}
</style>
