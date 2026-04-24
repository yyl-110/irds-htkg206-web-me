<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Pane, Splitpanes } from 'splitpanes';
import { SPLITPANES_TREE_COLLAPSE_TOGGLE_COLLAPSED_LEFT } from '@/composables/useSplitpanesTreeCollapse';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import ProcessFlowAppNodePreview from './process-flow-app-node-preview.vue';
import ProcessFlowAppCheckNodePreview from './process-flow-app-check-node-preview.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
type FlowNode = {
  bpmnElementId?: string;
  nodeName?: string;
  activityType?: string | number;
  pageType?: string | number;
  type?: string | number;
  parentBpmnElementId?: string;
  nodeStatus?: string;
  activityPageId?: string;
  componentsJson?: unknown;
  savedParamValues?: unknown[];
  children?: FlowNode[];
};

type WorkspaceData = {
  appId?: string;
  appCode?: string;
  appName?: string;
  taskId?: string;
  taskPublishVersionId?: string;
  currentBpmnElementId?: string;
  pages?: FlowNode[];
};

type TreeItem = {
  key: string;
  title: string;
  raw: FlowNode | null;
  children?: TreeItem[];
};

const route = useRoute();
const router = useRouter();
const workspaceData = ref<WorkspaceData>({});
const selectedNodeKey = ref<string>('');
const leftPaneSize = ref(20);
const rightPaneSize = ref(24);
const leftPaneBeforeCollapse = ref(20);
const rightPaneBeforeCollapse = ref(24);
const leftCollapsed = ref(false);
const rightCollapsed = ref(false);
const minExpanded = 12;
const nodeDetailLoading = ref(false);
const nodeDetailData = ref<Record<string, any> | null>(null);

function loadWorkspaceData() {
  const cacheKey = String(route.query.cacheKey ?? '');
  if (!cacheKey) return;
  const raw = sessionStorage.getItem(cacheKey);
  if (!raw) return;
  try {
    workspaceData.value = JSON.parse(raw) as WorkspaceData;
  } catch {
    workspaceData.value = {};
  }
}

function buildTreeNodes(nodes: FlowNode[] | undefined): TreeItem[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((item, index) => {
    const key = String(item.bpmnElementId ?? `node-${index}-${Date.now()}`);
    return {
      key,
      title: String(item.nodeName ?? '未命名活动'),
      raw: item,
      children: buildTreeNodes(item.children),
    };
  });
}

const treeData = computed<TreeItem[]>(() => {
  const rootTitle = String(workspaceData.value?.appName ?? '独立应用');
  const appCode = String(workspaceData.value?.appCode ?? '');
  const rootKey = appCode || 'root';
  return [
    {
      key: rootKey,
      title: rootTitle,
      raw: null,
      children: buildTreeNodes(workspaceData.value?.pages),
    },
  ];
});

const allNodeMap = computed(() => {
  const map = new Map<string, FlowNode | null>();
  const walk = (arr: TreeItem[]) => {
    arr.forEach(item => {
      map.set(item.key, item.raw);
      if (item.children?.length) walk(item.children);
    });
  };
  walk(treeData.value);
  return map;
});

const selectedNode = computed<FlowNode | null>(() => {
  if (!selectedNodeKey.value) return null;
  return allNodeMap.value.get(selectedNodeKey.value) ?? null;
});

const orderedActivityNodeKeys = computed<string[]>(() => {
  const keys: string[] = [];
  const walk = (nodes: FlowNode[] | undefined) => {
    if (!Array.isArray(nodes)) return;
    nodes.forEach((node: FlowNode) => {
      const key = String(node?.bpmnElementId ?? '').trim();
      if (key) keys.push(key);
      if (Array.isArray(node?.children) && node.children.length) {
        walk(node.children);
      }
    });
  };
  walk(workspaceData.value?.pages);
  return keys;
});

const currentActivityIndex = computed(() => orderedActivityNodeKeys.value.findIndex(k => k === selectedNodeKey.value));
const canGoPrev = computed(() => currentActivityIndex.value > 0);
const canGoNext = computed(() => currentActivityIndex.value >= 0 && currentActivityIndex.value < orderedActivityNodeKeys.value.length - 1);
const isLastActivity = computed(() => currentActivityIndex.value >= 0 && currentActivityIndex.value === orderedActivityNodeKeys.value.length - 1);
const selectedNodeActivityType = computed(() => {
  const raw = selectedNode.value || {};
  const detail = nodeDetailData.value || {};
  const v = raw?.activityType ?? raw?.pageType ?? raw?.type ?? detail?.activityType ?? detail?.pageType ?? detail?.type;
  return String(v ?? '').trim();
});
const isCalcNodePreview = computed(() => {
  if (selectedNodeActivityType.value === '2') return true;
  const nodeName = String(nodeDetailData.value?.nodeName ?? selectedNode.value?.nodeName ?? '').trim();
  return nodeName.includes('计算');
});

const selectedNodeTitle = computed(() => {
  const detailName = String(nodeDetailData.value?.nodeName ?? '').trim();
  if (detailName) return detailName;
  if (!selectedNodeKey.value) return String(workspaceData.value?.appName ?? '--');
  const node = selectedNode.value;
  if (!node) return String(workspaceData.value?.appName ?? '--');
  return String(node.nodeName ?? '--');
});

async function requestNodeDetailByKey(key: string) {
  if (!key) return;
  const targetNode = allNodeMap.value.get(key);
  if (!targetNode) return;
  const data = {
    appCode: workspaceData.value.appCode,
    bpmnElementId: key,
  };
  nodeDetailLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.nodePageDetail(data);
    const detail = res?.data?.data;
    nodeDetailData.value = detail && typeof detail === 'object' ? detail : null;
  } finally {
    nodeDetailLoading.value = false;
  }
}

async function onSelectTree(keys: (string | number)[]) {
  const k = String(keys?.[0] ?? '');
  selectedNodeKey.value = k;
  await requestNodeDetailByKey(k);
}

function findFirstSelectableNodeKey() {
  const roots = treeData.value;
  const root = Array.isArray(roots) && roots.length ? roots[0] : null;
  const firstChild = root?.children && root.children.length ? root.children[0] : null;
  return firstChild?.key ? String(firstChild.key) : '';
}

async function initDefaultSelectedNode() {
  const preferred = String(workspaceData.value?.currentBpmnElementId ?? '').trim();
  const firstNodeKey = findFirstSelectableNodeKey();
  const fallbackRootKey = String(workspaceData.value?.appCode ?? 'root');
  const targetKey = preferred || firstNodeKey || fallbackRootKey;
  selectedNodeKey.value = targetKey;
  await requestNodeDetailByKey(targetKey);
}

async function goPrevNode() {
  if (!canGoPrev.value) return;
  const key = orderedActivityNodeKeys.value[currentActivityIndex.value - 1];
  if (!key) return;
  selectedNodeKey.value = key;
  await requestNodeDetailByKey(key);
}

async function saveFlowInfo() {
  const res = await AdminApiSystemProcessTask.saveParams(data);
}

async function goNextNode() {
  if (!canGoNext.value) return;
  const key = orderedActivityNodeKeys.value[currentActivityIndex.value + 1];
  if (!key) return;
  selectedNodeKey.value = key;
  await requestNodeDetailByKey(key);
}

function finishFlow() {
  message.success('已完成当前流程浏览');
  router.back();
}

const centerPaneSize = computed(() => Math.max(0, 100 - leftPaneSize.value - rightPaneSize.value));

function toggleLeftPanel() {
  if (!leftCollapsed.value) {
    leftPaneBeforeCollapse.value = leftPaneSize.value || 20;
    leftCollapsed.value = true;
    leftPaneSize.value = 0;
    if (rightCollapsed.value) {
      rightCollapsed.value = false;
      rightPaneSize.value = rightPaneBeforeCollapse.value || 24;
    }
    return;
  }
  leftCollapsed.value = false;
  leftPaneSize.value = leftPaneBeforeCollapse.value || 20;
}

function toggleRightPanel() {
  if (!rightCollapsed.value) {
    rightPaneBeforeCollapse.value = rightPaneSize.value || 24;
    rightCollapsed.value = true;
    rightPaneSize.value = 0;
    if (leftCollapsed.value) {
      leftCollapsed.value = false;
      leftPaneSize.value = leftPaneBeforeCollapse.value || 20;
    }
    return;
  }
  rightCollapsed.value = false;
  rightPaneSize.value = rightPaneBeforeCollapse.value || 24;
}

function onSplitpanesResized(panes: any[]) {
  const p0 = panes?.[0];
  const p2 = panes?.[2];
  const left = Number(p0?.size);
  const right = Number(p2?.size);
  if (!leftCollapsed.value && Number.isFinite(left) && left >= 5) {
    leftPaneSize.value = left;
  }
  if (!rightCollapsed.value && Number.isFinite(right) && right >= 5) {
    rightPaneSize.value = right;
  }
}

const leftToggleStyle = computed(() => {
  const top = '50%';
  if (leftCollapsed.value) {
    return { left: '2px', top, transform: 'translateY(-50%)' };
  }
  return { left: `${leftPaneSize.value}%`, top, transform: 'translate(-50%, -50%)' };
});

const rightToggleStyle = computed(() => {
  const top = '50%';
  if (rightCollapsed.value) {
    return { right: '2px', top, transform: 'translateY(-50%)' };
  }
  return { left: `${100 - rightPaneSize.value}%`, top, transform: 'translate(-50%, -50%)' };
});

loadWorkspaceData();
void initDefaultSelectedNode();
</script>

<template>
  <div class="workspace-page splitpanes-tree-collapse-wrap">
    <Splitpanes class="default-theme workspace-splitpanes" @resized="onSplitpanesResized">
      <Pane :size="leftPaneSize" :min-size="leftCollapsed ? 0 : minExpanded" :class="['workspace-left', { 'workspace-left--collapsed': leftCollapsed }]">
        <a-tree :tree-data="treeData" :selected-keys="[selectedNodeKey]" :default-expand-all="true" @select="onSelectTree" />
      </Pane>
      <Pane :size="centerPaneSize" :min-size="20" class="workspace-center">
        <div class="workspace-center-body">
          <a-spin :spinning="nodeDetailLoading" class="workspace-center-spin">
            <ProcessFlowAppCheckNodePreview
              v-if="isCalcNodePreview"
              :components-json="nodeDetailData?.componentsJson"
              :saved-param-values="nodeDetailData?.savedParamValues"
              :node-detail-data="nodeDetailData" />
            <ProcessFlowAppNodePreview v-else :components-json="nodeDetailData?.componentsJson" :saved-param-values="nodeDetailData?.savedParamValues" />
          </a-spin>
        </div>
        <div class="workspace-center-footer">
          <a-button type="primary" @click="saveFlowInfo"><EpcIcon type="icon-baocun" style="font-size: 12px" />保 存</a-button>
          <a-button type="primary" v-if="canGoPrev" @click="goPrevNode"><EpcIcon type="icon-paixujiantou2" style="font-size: 12px" />上一步</a-button>
          <a-button type="primary" v-if="canGoNext" @click="goNextNode"><EpcIcon type="icon-paixujiantou" style="font-size: 12px" />提 交</a-button>
          <a-button v-if="isLastActivity" type="primary" @click="finishFlow"><EpcIcon type="icon-yiwancheng" style="font-size: 12px" />完 成</a-button>
        </div>
      </Pane>
      <Pane :size="rightPaneSize" :min-size="rightCollapsed ? 0 : minExpanded" :class="['workspace-right', { 'workspace-right--collapsed': rightCollapsed }]">
        <div class="panel-title">知识信息</div>
        <a-input-search placeholder="请输入" enter-button="搜索" />
        <div class="knowledge-text">我是设计知识，包括文本关联知识和页面关联知识</div>
      </Pane>
    </Splitpanes>
    <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="leftToggleStyle" @click="toggleLeftPanel" @mousedown.stop>
      <LeftOutlined v-if="!leftCollapsed" />
      <RightOutlined v-else />
    </button>
    <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="rightToggleStyle" @click="toggleRightPanel" @mousedown.stop>
      <RightOutlined v-if="!rightCollapsed" />
      <LeftOutlined v-else />
    </button>
  </div>
</template>

<style scoped lang="less">
.workspace-page {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
}

.workspace-splitpanes {
  height: 100%;
}

.workspace-left {
  padding: 12px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: auto;
}

.workspace-left--collapsed {
  padding: 0 !important;
  overflow: hidden !important;
}

.workspace-center {
  padding: 16px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.workspace-right {
  padding: 16px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: auto;
}

.workspace-right--collapsed {
  padding: 0 !important;
  overflow: hidden !important;
}

:deep(.workspace-splitpanes .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}

:deep(.workspace-splitpanes .splitpanes__splitter::before),
:deep(.workspace-splitpanes .splitpanes__splitter::after) {
  display: none !important;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
}

.workspace-center-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.workspace-center-spin {
  min-height: 100%;
}

.workspace-center-spin :deep(.ant-spin-nested-loading) {
  height: 100%;
  min-height: 0;
}

.workspace-center-spin :deep(.ant-spin-container) {
  min-height: 100%;
  height: auto;
}

.workspace-center-footer {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}

.knowledge-text {
  margin-top: 14px;
  color: #333;
  line-height: 22px;
}
</style>
