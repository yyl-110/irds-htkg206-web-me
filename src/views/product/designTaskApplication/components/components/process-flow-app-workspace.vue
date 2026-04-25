<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { CheckCircleOutlined, ClockCircleOutlined, EditOutlined, LeftOutlined, QuestionCircleOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Pane, Splitpanes } from 'splitpanes';
import { SPLITPANES_TREE_COLLAPSE_TOGGLE_COLLAPSED_LEFT } from '@/composables/useSplitpanesTreeCollapse';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import ProcessFlowAppNodePreview from './process-flow-app-node-preview.vue';
import ProcessFlowAppCheckNodePreview from './process-flow-app-check-node-preview.vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
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
const activityImageUrl = ref('');
const activityImageMarginTop = ref(0);
const activityImageWidth = ref(260);
const saveFlowLoading = ref(false);
const submitFlowLoading = ref(false);
const finishFlowLoading = ref(false);
const nodePreviewRef = ref<any>(null);
const checkNodePreviewRef = ref<any>(null);
const activityImagePaneStyle = computed<Record<string, string>>(() => {
  const mt = Number(activityImageMarginTop.value);
  const width = Number(activityImageWidth.value);
  return {
    marginTop: `${Number.isFinite(mt) && mt >= 0 ? mt : 0}px`,
    width: `${Number.isFinite(width) && width > 0 ? width : 260}px`,
    minWidth: `${Number.isFinite(width) && width > 0 ? width : 260}px`,
  };
});

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
      title: renderNodeTitle(item),
      raw: item,
      children: buildTreeNodes(item.children),
    };
  });
}

function resolveNodeStatusStyle(statusRaw: unknown) {
  const status = String(statusRaw ?? '').trim();
  if (status.includes('未开始')) return { color: '#999999', icon: ClockCircleOutlined };
  if (status.includes('进行中') || status.includes('设计中')) return { color: '#1890ff', icon: EditOutlined };
  if (status.includes('待确认')) return { color: '#fa8c16', icon: QuestionCircleOutlined };
  if (status.includes('已完成')) return { color: '#52c41a', icon: CheckCircleOutlined };
  return null;
}

function renderNodeTitle(item: FlowNode) {
  const name = String(item.nodeName ?? '未命名活动');
  const style = resolveNodeStatusStyle(item.nodeStatus);
  if (!style) return name;
  return h('span', { class: 'workspace-tree-node-title', style: { color: style.color } }, [
    h(style.icon, { style: { marginRight: '6px', color: style.color, fontSize: '13px' } }),
    h('span', null, name),
  ]);
}

function flattenFlowNodes(nodes: FlowNode[] | undefined): FlowNode[] {
  if (!Array.isArray(nodes)) return [];
  const result: FlowNode[] = [];
  const walk = (arr: FlowNode[]) => {
    arr.forEach((node: FlowNode) => {
      result.push(node);
      if (Array.isArray(node.children) && node.children.length) walk(node.children);
    });
  };
  walk(nodes);
  return result;
}

function resolveRootStatusByChildren(nodes: FlowNode[] | undefined): '进行中' | '已完成' {
  const all = flattenFlowNodes(nodes).filter(n => String(n?.bpmnElementId ?? '').trim() !== '');
  if (!all.length) return '进行中';
  const allCompleted = all.every(n => String(n?.nodeStatus ?? '').includes('已完成'));
  return allCompleted ? '已完成' : '进行中';
}

function renderRootTitle(name: string, nodes: FlowNode[] | undefined) {
  const status = resolveRootStatusByChildren(nodes);
  const style = status === '已完成' ? { color: '#52c41a', icon: CheckCircleOutlined } : { color: '#1890ff', icon: EditOutlined };
  return h('span', { class: 'workspace-tree-node-title workspace-tree-node-title--root', style: { color: style.color } }, [
    h(style.icon, { style: { marginRight: '6px', color: style.color, fontSize: '13px' } }),
    h('span', null, name),
  ]);
}

const treeData = computed<TreeItem[]>(() => {
  const rootTitle = String(workspaceData.value?.appName ?? '独立应用');
  const appCode = String(workspaceData.value?.appCode ?? '');
  const rootKey = appCode || 'root';
  const pages = workspaceData.value?.pages;
  return [
    {
      key: rootKey,
      title: renderRootTitle(rootTitle, pages),
      raw: null,
      children: buildTreeNodes(pages),
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
  let detailObj: Record<string, any> | null = null;
  try {
    const res = await AdminApiSystemProcessTask.nodePageDetail(data);
    const detail = res?.data?.data;
    detailObj = detail && typeof detail === 'object' ? detail : null;
    nodeDetailData.value = detailObj;
    activityImageUrl.value = '';
    activityImageMarginTop.value = 0;
    activityImageWidth.value = 260;
    const activityPageId = detailObj?.activityPageId;
    if (activityPageId) {
      try {
        const imgRes = await AdminApiActivityPage.activityImageList({ activityPageId });
        const list = imgRes?.data?.data;
        const first = Array.isArray(list) ? list[0] : null;
        const imageUrl = String(first?.fileInfo?.filePath ?? first?.filePath ?? '').trim();
        const marginTop = Number(first?.marginTop ?? 0);
        const width = Number(first?.width ?? 260);
        activityImageUrl.value = imageUrl;
        activityImageMarginTop.value = Number.isFinite(marginTop) && marginTop >= 0 ? marginTop : 0;
        activityImageWidth.value = Number.isFinite(width) && width > 0 ? width : 260;
      } catch {
        activityImageUrl.value = '';
        activityImageMarginTop.value = 0;
        activityImageWidth.value = 260;
      }
    }
  } finally {
    nodeDetailLoading.value = false;
  }

  const taskId = route.query.taskId ?? workspaceData.value?.taskId ?? '';
  const appId = route.query.appId ?? workspaceData.value?.appId ?? '';
  const appCode = String(workspaceData.value?.appCode ?? '').trim();
  if (!taskId || (!appId && !appCode) || !detailObj) return;
  const paramQuery: Record<string, any> = { taskId };
  if (appId) paramQuery.appId = appId;
  else paramQuery.appCode = appCode;
  try {
    const mapRes = await AdminApiSystemProcessTask.taskParamMap(paramQuery);
    const raw = mapRes?.data?.data;
    if (!raw || typeof raw !== 'object') return;
    const dataObj = raw as Record<string, any>;
    const paramsObj = dataObj?.params && typeof dataObj.params === 'object' ? dataObj.params : null;
    const tablesObj = Array.isArray(dataObj?.tables) ? dataObj.tables : [];
    const currentNodeMap = dataObj?.[key];
    const source = paramsObj ?? currentNodeMap ?? dataObj;
    const cfg = detailObj?.componentsJson || {};
    const pageComponents = [
      ...(Array.isArray(cfg.basicComponentList) ? cfg.basicComponentList : []),
      ...(Array.isArray(cfg.threeDComponentList) ? cfg.threeDComponentList : []),
      ...(Array.isArray(cfg.uploadComponentList) ? cfg.uploadComponentList : []),
      ...(Array.isArray(cfg.tableComponentList) ? cfg.tableComponentList : []),
    ];
    const pageParamRows = pageComponents
      .map((item: any) => ({
        paramCode: String(item?.paramCode ?? item?.paramKey ?? '').trim(),
        paramName: String(item?.paramName ?? '').trim(),
      }))
      .filter((row: any) => row.paramCode);
    if (!pageParamRows.length) return;
    const sourceMap = new Map<string, string>();
    if (Array.isArray(source)) {
      source.forEach((row: any) => {
        const code = String(row?.paramCode ?? row?.paramKey ?? row?.code ?? '').trim();
        if (!code) return;
        sourceMap.set(code, String(row?.paramValue ?? row?.value ?? row?.savedValue ?? ''));
      });
    } else if (source && typeof source === 'object') {
      Object.entries(source as Record<string, any>).forEach(([k, v]) => {
        const code = String(k ?? '').trim();
        if (!code) return;
        if (v != null && typeof v === 'object' && !Array.isArray(v)) {
          sourceMap.set(code, String((v as any)?.paramValue ?? (v as any)?.value ?? (v as any)?.savedValue ?? ''));
          return;
        }
        sourceMap.set(code, String(v ?? ''));
      });
    }
    const normalizedValues = pageParamRows.map((row: any) => ({
      paramCode: row.paramCode,
      paramName: row.paramName,
      paramValue: String(sourceMap.get(row.paramCode) ?? ''),
    }));
    if (!normalizedValues.length) return;
    nodeDetailData.value = {
      ...detailObj,
      savedParamValues: normalizedValues,
      savedTables: tablesObj,
    };
  } catch {
    // task-param-map 失败不阻断节点详情展示
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

async function refreshWorkspaceTreeData() {
  const appId = route.query.appId ?? workspaceData.value?.appId ?? '';
  const appCode = String(workspaceData.value?.appCode ?? '').trim();
  if (!appId && !appCode) return;
  const query: Record<string, any> = {};
  if (appId) query.appId = appId;
  if (appCode) query.appCode = appCode;
  try {
    const res = await AdminApiSystemProcessTask.projectPages(query);
    const payload = res?.data?.data;
    if (!payload || typeof payload !== 'object') return;
    workspaceData.value = {
      ...workspaceData.value,
      ...(payload as Record<string, any>),
    };
  } catch {
    // 刷新树失败不阻断当前流程
  }
}

async function goPrevNode() {
  if (!canGoPrev.value) return;
  const key = orderedActivityNodeKeys.value[currentActivityIndex.value - 1];
  if (!key) return;
  selectedNodeKey.value = key;
  await requestNodeDetailByKey(key);
}

async function saveCurrentNodeParams(options?: { successMessage?: string; loadingType?: 'save' | 'submit' | 'finish' }) {
  if (saveFlowLoading.value || submitFlowLoading.value || finishFlowLoading.value) return false;
  const loadingType = options?.loadingType || 'save';
  const setLoading = (v: boolean) => {
    if (loadingType === 'submit') submitFlowLoading.value = v;
    else if (loadingType === 'finish') finishFlowLoading.value = v;
    else saveFlowLoading.value = v;
  };
  const currentNodeKey = String(selectedNodeKey.value || nodeDetailData.value?.bpmnElementId || '').trim();
  if (!currentNodeKey) {
    message.warning('未选择流程节点，无法保存');
    return false;
  }
  const appId = route.query.appId;
  const appCode = String(workspaceData.value?.appCode ?? '').trim();
  if (!appId && !appCode) {
    message.warning('缺少应用标识（appId/appCode），无法保存');
    return false;
  }
  const taskId = route.query.taskId;
  if (!taskId) {
    message.warning('缺少任务ID，无法保存');
    return false;
  }
  const projectId = route.query.projectId;
  const activityPageId = nodeDetailData.value?.activityPageId;
  if (!activityPageId) {
    message.warning('缺少活动页面ID，无法保存');
    return false;
  }
  const fromCheckPreview = checkNodePreviewRef.value?.getCurrentSaveParamValues?.();
  const fromNodePreview = nodePreviewRef.value?.getCurrentSaveParamValues?.();
  const tablePayload = nodePreviewRef.value?.getCurrentTableSavePayload?.() || [];
  const sourceValues = (Array.isArray(fromCheckPreview) && fromCheckPreview.length ? fromCheckPreview : fromNodePreview) || [];
  const values = sourceValues
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  if (!values.length) {
    message.warning('当前节点暂无可保存参数');
    return false;
  }
  const data: Record<string, any> = {
    bpmnElementId: currentNodeKey,
    taskId,
    projectId,
    activityPageId,
    values,
    tables: Array.isArray(tablePayload) ? tablePayload : [],
  };
  if (appId) data.appId = appId;
  else data.appCode = appCode;
  setLoading(true);
  try {
    const res = await AdminApiSystemProcessTask.saveParams(data);
    const code = res?.data?.code;
    if (code === 0 || code === 200 || code === '0' || code === '200') {
      message.success(options?.successMessage || '保存成功');
      return true;
    }
    message.error(String(res?.data?.msg ?? '保存失败'));
    return false;
  } catch {
    message.error('保存失败');
    return false;
  } finally {
    setLoading(false);
  }
}

async function saveFlowInfo() {
  const ok = await saveCurrentNodeParams({ successMessage: '保存成功', loadingType: 'save' });
  if (ok) await refreshWorkspaceTreeData();
}

async function goNextNode() {
  if (!canGoNext.value) return;
  if (saveFlowLoading.value || submitFlowLoading.value || finishFlowLoading.value) return;
  const currentNodeKey = String(selectedNodeKey.value || nodeDetailData.value?.bpmnElementId || '').trim();
  if (!currentNodeKey) {
    message.warning('未选择流程节点，无法提交');
    return;
  }
  const appId = route.query.appId;
  const appCode = String(workspaceData.value?.appCode ?? '').trim();
  if (!appId && !appCode) {
    message.warning('缺少应用标识（appId/appCode），无法提交');
    return;
  }
  const taskId = route.query.taskId;
  if (!taskId) {
    message.warning('缺少任务ID，无法提交');
    return;
  }
  const projectId = route.query.projectId;
  const activityPageId = nodeDetailData.value?.activityPageId;
  if (!activityPageId) {
    message.warning('缺少活动页面ID，无法提交');
    return;
  }
  const fromCheckPreview = checkNodePreviewRef.value?.getCurrentSaveParamValues?.();
  const fromNodePreview = nodePreviewRef.value?.getCurrentSaveParamValues?.();
  const tablePayload = nodePreviewRef.value?.getCurrentTableSavePayload?.() || [];
  const sourceValues = (Array.isArray(fromCheckPreview) && fromCheckPreview.length ? fromCheckPreview : fromNodePreview) || [];
  const values = sourceValues
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  if (!values.length) {
    message.warning('当前节点暂无可提交参数');
    return;
  }
  const data: Record<string, any> = {
    bpmnElementId: currentNodeKey,
    taskId,
    projectId,
    activityPageId,
    values,
    tables: Array.isArray(tablePayload) ? tablePayload : [],
  };
  if (appId) data.appId = appId;
  else data.appCode = appCode;
  let serverNextBpmnElementId = '';
  submitFlowLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.nextStep(data);
    const code = res?.data?.code;
    if (!(code === 0 || code === 200 || code === '0' || code === '200')) {
      message.error(String(res?.data?.msg ?? '提交失败'));
      return;
    }
    const payload = res?.data?.data;
    if (payload && typeof payload === 'object') {
      serverNextBpmnElementId = String((payload as Record<string, unknown>).nextBpmnElementId ?? '').trim();
    }
    message.success('提交成功');
    await refreshWorkspaceTreeData();
  } catch {
    message.error('提交失败');
    return;
  } finally {
    submitFlowLoading.value = false;
  }
  let key = serverNextBpmnElementId;
  if (key && !allNodeMap.value.has(key)) {
    key = '';
  }
  if (!key) {
    const submittedKey = String(selectedNodeKey.value || currentNodeKey || '').trim();
    const idx = orderedActivityNodeKeys.value.findIndex(k => k === submittedKey);
    key = (idx >= 0 ? orderedActivityNodeKeys.value[idx + 1] : '') || '';
  }
  if (!key) return;
  selectedNodeKey.value = key;
  await requestNodeDetailByKey(key);
}

async function finishFlow() {
  if (saveFlowLoading.value || submitFlowLoading.value || finishFlowLoading.value) return;
  const ok = await saveCurrentNodeParams({
    successMessage: '保存成功，已完成当前流程浏览',
    loadingType: 'finish',
  });
  if (!ok) return;
  await refreshWorkspaceTreeData();
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
            <div class="workspace-preview-scroll-row">
              <div class="workspace-preview-main">
                <ProcessFlowAppCheckNodePreview
                  v-if="isCalcNodePreview"
                  ref="checkNodePreviewRef"
                  :components-json="nodeDetailData?.componentsJson"
                  :saved-param-values="nodeDetailData?.savedParamValues"
                  :node-detail-data="nodeDetailData" />
                <ProcessFlowAppNodePreview
                  v-else
                  ref="nodePreviewRef"
                  :components-json="nodeDetailData?.componentsJson"
                  :saved-param-values="nodeDetailData?.savedParamValues"
                  :saved-tables="nodeDetailData?.savedTables" />
              </div>
              <div v-if="activityImageUrl" class="workspace-preview-image-pane" :style="activityImagePaneStyle">
                <img :src="activityImageUrl" alt="活动示意图" class="workspace-preview-image" />
              </div>
            </div>
          </a-spin>
        </div>
        <div class="workspace-center-footer">
          <a-button
            type="primary"
            :loading="saveFlowLoading"
            :disabled="saveFlowLoading || submitFlowLoading || finishFlowLoading"
            @click="saveFlowInfo"
            ><EpcIcon type="icon-baocun" style="font-size: 12px" />保 存</a-button
          >
          <a-button type="primary" v-if="canGoPrev" :disabled="finishFlowLoading" @click="goPrevNode"
            ><EpcIcon type="icon-paixujiantou2" style="font-size: 12px" />上一步</a-button
          >
          <a-button
            type="primary"
            v-if="canGoNext"
            :loading="submitFlowLoading"
            :disabled="saveFlowLoading || submitFlowLoading || finishFlowLoading"
            @click="goNextNode"
            ><EpcIcon type="icon-paixujiantou" style="font-size: 12px" />提 交</a-button
          >
          <a-button
            v-if="isLastActivity"
            type="primary"
            :loading="finishFlowLoading"
            :disabled="saveFlowLoading || submitFlowLoading || finishFlowLoading"
            @click="finishFlow"
            ><EpcIcon type="icon-yiwancheng" style="font-size: 12px" />完 成</a-button
          >
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

.workspace-tree-node-title {
  display: inline-flex;
  align-items: center;
}

.workspace-tree-node-title--root {
  color: #262626;
  font-weight: 600;
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

.workspace-preview-scroll-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
  width: max-content;
  min-width: 100%;
}

.workspace-preview-main {
  flex: 0 0 auto;
  width: max-content;
  min-width: 85%;
  max-width: none;
}

.workspace-preview-image-pane {
  flex: 0 0 auto;
  margin-left: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.workspace-preview-image {
  width: 100%;
  height: auto;
  object-fit: contain;
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
