<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Pane, Splitpanes } from 'splitpanes';
import { SPLITPANES_TREE_COLLAPSE_TOGGLE_COLLAPSED_LEFT } from '@/composables/useSplitpanesTreeCollapse';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
type FlowNode = {
  bpmnElementId?: string;
  nodeName?: string;
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
const workspaceData = ref<WorkspaceData>({});
const selectedNodeKey = ref<string>('');
const leftPaneSize = ref(20);
const rightPaneSize = ref(24);
const leftPaneBeforeCollapse = ref(20);
const rightPaneBeforeCollapse = ref(24);
const leftCollapsed = ref(false);
const rightCollapsed = ref(false);
const minExpanded = 12;

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

const selectedNodeTitle = computed(() => {
  if (!selectedNodeKey.value) return String(workspaceData.value?.appName ?? '--');
  const node = selectedNode.value;
  if (!node) return String(workspaceData.value?.appName ?? '--');
  return String(node.nodeName ?? '--');
});

async function onSelectTree(keys: (string | number)[]) {
  const data = {
    appCode: workspaceData.value.appCode,
    bpmnElementId: String(keys?.[0] ?? ''),
  };
  const res = await AdminApiSystemProcessTask.nodePageDetail(data);
  const k = String(keys?.[0] ?? '');
  selectedNodeKey.value = k;
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
    return {
      left: SPLITPANES_TREE_COLLAPSE_TOGGLE_COLLAPSED_LEFT,
      top,
      transform: 'translate(-50%, -50%)',
    };
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
if (workspaceData.value?.currentBpmnElementId) {
  selectedNodeKey.value = String(workspaceData.value.currentBpmnElementId);
} else {
  selectedNodeKey.value = String(workspaceData.value?.appCode ?? 'root');
}
</script>

<template>
  <div
    class="workspace-page splitpanes-tree-collapse-wrap"
    :class="{ 'splitpanes-tree-collapse-wrap--left-collapsed': leftCollapsed }">
    <Splitpanes class="default-theme workspace-splitpanes" @resize="onSplitpanesResized" @resized="onSplitpanesResized">
      <Pane :size="leftPaneSize" :min-size="leftCollapsed ? 0 : minExpanded" class="workspace-left">
        <a-tree :tree-data="treeData" :selected-keys="[selectedNodeKey]" :default-expand-all="true" @select="onSelectTree" />
      </Pane>
      <Pane :size="centerPaneSize" :min-size="20" class="workspace-center">
        <div class="panel-title">{{ selectedNodeTitle }}</div>
        <div class="detail-grid">
          <div class="detail-row">
            <span class="label">独立应用编号:</span>
            <span>{{ workspaceData.appCode || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">独立应用名称:</span>
            <span>{{ workspaceData.appName || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">节点名称:</span>
            <span>{{ selectedNode?.nodeName || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">节点状态:</span>
            <span>{{ selectedNode?.nodeStatus || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">节点标识:</span>
            <span>{{ selectedNode?.bpmnElementId || workspaceData.currentBpmnElementId || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">活动页面ID:</span>
            <span>{{ selectedNode?.activityPageId || '--' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">父节点标识:</span>
            <span>{{ selectedNode?.parentBpmnElementId || '--' }}</span>
          </div>
        </div>
      </Pane>
      <Pane :size="rightPaneSize" :min-size="rightCollapsed ? 0 : minExpanded" class="workspace-right">
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
  height: calc(100vh - 96px);
  background: #fff;
}

.workspace-left {
  padding: 12px;
  overflow: auto;
}

.workspace-center {
  padding: 16px;
  overflow: auto;
}

.workspace-right {
  padding: 16px;
  overflow: auto;
}

:deep(.workspace-splitpanes .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}

:deep(.workspace-splitpanes .splitpanes__splitter::before),
:deep(.workspace-splitpanes .splitpanes__splitter::after) {
  display: none !important;
}

.panel-title {
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 10px;
}

.detail-row {
  display: flex;
  gap: 8px;
  line-height: 24px;
}

.label {
  width: 110px;
  color: #666;
  flex-shrink: 0;
}

.knowledge-text {
  margin-top: 14px;
  color: #333;
  line-height: 22px;
}
</style>
