<script setup lang="ts">
import { computed, h, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { CheckCircleOutlined, ClockCircleOutlined, EditOutlined, LeftOutlined, QuestionCircleOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { Pane, Splitpanes } from 'splitpanes';
import { SPLITPANES_TREE_COLLAPSE_TOGGLE_COLLAPSED_LEFT } from '@/composables/useSplitpanesTreeCollapse';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import ProcessFlowAppNodePreview from './process-flow-app-node-preview.vue';
import ProcessFlowAppCheckNodePreview from './process-flow-app-check-node-preview.vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
type FlowNode = {
  id?: string | number;
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
/** 左侧 / 右侧默认宽度 px → 换算为 Splitpanes 占比 */
const DEFAULT_LEFT_WIDTH_PX = 210;
const DEFAULT_RIGHT_WIDTH_PX = 280;
const workspacePageRef = ref<HTMLElement | null>(null);
const leftPaneSize = ref(20);
const rightPaneSize = ref(24);
const leftPaneBeforeCollapse = ref(20);
const rightPaneBeforeCollapse = ref(24);
const leftCollapsed = ref(false);
const rightCollapsed = ref(false);
/** 右侧：设计知识 | 操作日志 | 设计流程 */
const knowledgeRightActiveKey = ref<'design' | 'log' | 'flow'>('design');
const minExpanded = 12;
const nodeDetailLoading = ref(false);
const nodeDetailData = ref<Record<string, any> | null>(null);
const activityImageUrl = ref('');
const activityImageMarginTop = ref(0);
const activityImageWidth = ref(260);
const saveFlowLoading = ref(false);
const submitFlowLoading = ref(false);
const finishFlowLoading = ref(false);
const toolbarActionLoadingIndex = ref<number | null>(null);
const nodePreviewRef = ref<any>(null);
const checkNodePreviewRef = ref<any>(null);
const currentActivityParamList = ref<any[]>([]);
const knowledgeLoading = ref(false);
const knowledgeKeyword = ref('');
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

function normalizeTextForSearch(v: unknown) {
  return String(v ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const filteredKnowledgeList = computed<any[]>(() => {
  const list = Array.isArray(currentActivityParamList.value) ? currentActivityParamList.value : [];
  const kw = normalizeTextForSearch(knowledgeKeyword.value);
  if (!kw) return list;
  return list.filter((item: any) => {
    const title = normalizeTextForSearch(item?.file?.title);
    const remark = normalizeTextForSearch(item?.remark);
    const versionNum = normalizeTextForSearch(item?.versionNum);
    const content = normalizeTextForSearch(item?.file?.content);
    return title.includes(kw) || remark.includes(kw) || versionNum.includes(kw) || content.includes(kw);
  });
});

function escapeRegExp(v: string) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(v: unknown) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightPlainText(v: unknown) {
  const text = String(v ?? '');
  const kw = String(knowledgeKeyword.value ?? '').trim();
  if (!kw) return escapeHtml(text);
  const parts = text.split(new RegExp(`(${escapeRegExp(kw)})`, 'ig'));
  const kwLower = kw.toLowerCase();
  return parts
    .map(part => {
      if (part.toLowerCase() === kwLower) return `<span class="workspace-kw-highlight">${escapeHtml(part)}</span>`;
      return escapeHtml(part);
    })
    .join('');
}

function highlightRichHtml(v: unknown) {
  const html = String(v ?? '');
  const kw = String(knowledgeKeyword.value ?? '').trim();
  if (!kw || !html) return html;
  return html.replace(new RegExp(escapeRegExp(kw), 'ig'), m => `<span class="workspace-kw-highlight">${m}</span>`);
}

/** 解析 node-page-detail 返回的 `button` 字段（逗号分隔） */
function parseNodeDetailButtonLabels(raw: unknown): string[] {
  const s = String(raw ?? '').trim();
  if (!s) return [];
  return s
    .split(/[,，]/)
    .map(x => x.trim())
    .filter(Boolean);
}

const nodeDetailToolbarButtons = computed(() => parseNodeDetailButtonLabels(nodeDetailData.value?.button));

/** 再生模型 */
async function handleToolbarRegenerateModel(): Promise<boolean> {
  return (await checkNodePreviewRef.value?.runToolbarAction?.('再生模型')) === true;
}

/** 导出报告 */
async function handleToolbarExportReport(): Promise<boolean> {
  const toColIndex = (colName: string): number => {
    const s = String(colName ?? '')
      .trim()
      .toUpperCase();
    if (!s) return 0;
    let n = 0;
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code < 65 || code > 90) return 0;
      n = n * 26 + (code - 64);
    }
    return n;
  };
  const parseCellAddr = (cellKey: string): { rowNo: number; colNo: number } | null => {
    const m = /^([a-zA-Z]+)(\d+)$/.exec(String(cellKey ?? '').trim());
    if (!m) return null;
    const colNo = toColIndex(m[1]);
    const rowNo = Number(m[2]);
    if (!colNo || !rowNo) return null;
    return { rowNo, colNo };
  };

  const detail = nodeDetailData.value || {};
  const reportFileId = String(detail?.reportFileId ?? detail?.reportFileInfo?.fileId ?? detail?.reportFileInfo?.id ?? '').trim();
  if (!reportFileId) {
    message.warning('当前节点缺少 reportFileId，无法构建导出报告参数');
    return false;
  }

  const tableCfgList = Array.isArray(detail?.componentsJson?.tableComponentList) ? detail.componentsJson.tableComponentList : [];
  const cfgByComponentId = new Map<string, any>();
  tableCfgList.forEach((cfg: any) => {
    const cid = String(cfg?.id ?? '').trim();
    if (!cid) return;
    cfgByComponentId.set(cid, cfg);
  });

  // 文本参数：先用 task-param-map 快照，再用页面实时值覆盖，确保是最新输入
  const params: Record<string, string> = {};
  const paramRows = Array.isArray(detail?.savedParamValues) ? detail.savedParamValues : [];
  paramRows.forEach((row: any) => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    if (!code) return;
    params[code] = String(row?.paramValue ?? '');
  });
  const fromCheckPreview = checkNodePreviewRef.value?.getCurrentSaveParamValues?.();
  const fromNodePreview = nodePreviewRef.value?.getCurrentSaveParamValues?.();
  const liveParamRows = (Array.isArray(fromCheckPreview) && fromCheckPreview.length ? fromCheckPreview : fromNodePreview) || [];
  liveParamRows.forEach((row: any) => {
    const code = String(row?.paramKey ?? row?.paramCode ?? '').trim();
    if (!code) return;
    params[code] = String(row?.paramValue ?? '');
  });

  const normalizeTableRows = (arr: any[]) =>
    arr.map((tb: any) => {
      const componentId = String(tb?.componentId ?? '').trim();
      const cfg = componentId ? cfgByComponentId.get(componentId) : null;
      const rowCount = Number(cfg?.customProps?.tableBodyRows ?? 0) || 0;
      const colCount = Number(cfg?.customProps?.tableColCount ?? 0) || 0;
      const values = Array.isArray(tb?.values) ? tb.values : [];
      const mergedCellMap: Record<string, any> = {};
      values.forEach((m: any) => {
        if (!m || typeof m !== 'object') return;
        Object.assign(mergedCellMap, m);
      });

      // 与预览渲染规则一致：有操作列的业务类型，末列为操作列
      const tableBizType = String(cfg?.customProps?.tableBizType ?? '');
      const hasOperationCol =
        tableBizType === 'MODULE_LIB_READ' || tableBizType === 'BASIC_RESOURCE_LIB_READ' || tableBizType === 'FILE_COLLAB' || tableBizType === 'FILE_COLLAB_SIMPLE';
      const previewColCount = hasOperationCol ? colCount + 1 : colCount;
      const isOperationCol = (physicalCol: number) => hasOperationCol && physicalCol === previewColCount;

      const getHeaderByPhysicalCol = (physicalCol: number) => {
        if (isOperationCol(physicalCol)) return '操作';
        if (tableBizType === 'MODULE_LIB_READ') {
          if (physicalCol === 2) return '模型件号';
          if (physicalCol === 3) return '模型名称';
        }
        if (tableBizType === 'FILE_COLLAB_SIMPLE' && physicalCol === 2) return '文件名称';
        const firstType = String(cfg?.customProps?.firstColumnType ?? 'INDEX');
        if (physicalCol === 1) return firstType === 'INDEX' ? '序号' : '';
        const raw = cfg?.customProps?.tableColDefs?.[physicalCol - 1]?.columnName;
        if (raw != null && String(raw).trim() !== '') return String(raw).trim();
        return `列名${physicalCol - 1}`;
      };

      // dataColIndex(Excel列号) -> 物理列号（跳过序号列与操作列）
      const dataColToPhysicalCol = new Map<number, number>();
      let dataColIdx = 0;
      for (let physicalCol = 1; physicalCol <= previewColCount; physicalCol++) {
        if (physicalCol === 1) continue;
        if (isOperationCol(physicalCol)) continue;
        dataColIdx++;
        dataColToPhysicalCol.set(dataColIdx, physicalCol);
      }

      const cells = Object.entries(mergedCellMap as Record<string, any>)
        .filter(([k]) => !/FileId$/i.test(String(k)))
        .map(([cell, value]) => {
          const rc = parseCellAddr(cell);
          const physicalCol = rc?.colNo ? (dataColToPhysicalCol.get(rc.colNo) ?? 0) : 0;
          const header = physicalCol ? getHeaderByPhysicalCol(physicalCol) : '';
          return {
            cell,
            rowNo: rc?.rowNo ?? 0,
            colNo: physicalCol,
            header,
            value: String(value ?? ''),
          };
        })
        .filter(c => c.rowNo > 0 && c.colNo > 0 && c.header && c.header !== '操作');

      // 最终按“列头”输出整表行数据（去掉操作列）
      const rowsByNo = new Map<number, Record<string, any>>();
      cells.forEach(c => {
        if (!rowsByNo.has(c.rowNo)) rowsByNo.set(c.rowNo, { rowNo: c.rowNo, cellsByHeader: {} as Record<string, string> });
        const rowObj = rowsByNo.get(c.rowNo)!;
        rowObj.cellsByHeader[c.header] = c.value;
      });
      const rows = Array.from(rowsByNo.values()).sort((a, b) => a.rowNo - b.rowNo);

      const headers = Array.from(
        new Set(
          Array.from({ length: previewColCount }, (_, i) => i + 1)
            .filter(physicalCol => physicalCol !== 1 && !isOperationCol(physicalCol))
            .map(physicalCol => getHeaderByPhysicalCol(physicalCol))
            .filter(Boolean),
        ),
      );

      return {
        componentId,
        tableTitle: String(tb?.tableName ?? cfg?.customProps?.tableTitle ?? cfg?.paramName ?? ''),
        rowCount,
        colCount,
        headers,
        rows,
        values,
      };
    });

  // 表格参数：先用 task-param-map 快照，再用页面实时表格覆盖同 componentId
  const baseTables = normalizeTableRows(Array.isArray(detail?.savedTables) ? detail.savedTables : []);
  const liveTablePayload = nodePreviewRef.value?.getCurrentTableSavePayload?.() || [];
  const liveTables = normalizeTableRows(Array.isArray(liveTablePayload) ? liveTablePayload : []);
  const tableMap = new Map<string, any>();
  baseTables.forEach((tb: any, idx: number) => tableMap.set(tb.componentId || `base-${idx}`, tb));
  liveTables.forEach((tb: any, idx: number) => tableMap.set(tb.componentId || `live-${idx}`, tb));
  const tables = Array.from(tableMap.values());

  const payload = {
    // taskId: String(route.query.taskId ?? workspaceData.value?.taskId ?? ''),
    // appId: String(route.query.appId ?? workspaceData.value?.appId ?? ''),
    // appCode: String(workspaceData.value?.appCode ?? ''),
    // bpmnElementId: String(selectedNodeKey.value || detail?.bpmnElementId || ''),
    // activityPageId: String(detail?.activityPageId ?? ''),
    reportFileId,
    params,
    tables,
    userId: useUserStore().getUser.id,
  };
  const res = await AdminApiSystemProcessTask.exportReport(payload);
  window.open(res.data.data.fileUrl);
  return true;
}

/** 导入参数 */
async function handleToolbarImportParams(): Promise<boolean> {
  return (await nodePreviewRef.value?.runToolbarAction?.('导入参数')) === true;
}

/** 导出参数（Excel：参数名称 / 参数代号 / 参数值） */
async function handleToolbarExportParams(): Promise<boolean> {
  const fn = nodePreviewRef.value?.exportParamsToExcel;
  if (typeof fn !== 'function') return false;
  return fn() === true;
}

function resolveToolbarActionHandler(label: string): (() => Promise<boolean>) | null {
  const t = String(label ?? '').trim();
  if (t === '再生模型') return handleToolbarRegenerateModel;
  if (t === '导出报告') return handleToolbarExportReport;
  if (t === '导入参数') return handleToolbarImportParams;
  if (t === '导出参数') return handleToolbarExportParams;
  return null;
}

async function onNodeDetailToolbarAction(label: string, index: number) {
  const text = String(label ?? '').trim();
  if (!text) return;
  if (saveFlowLoading.value || submitFlowLoading.value || finishFlowLoading.value) return;
  if (toolbarActionLoadingIndex.value !== null) return;
  const handler = resolveToolbarActionHandler(text);
  if (!handler) {
    message.warning(`「${text}」暂不支持`);
    return;
  }
  toolbarActionLoadingIndex.value = index;
  try {
    await handler();
  } finally {
    toolbarActionLoadingIndex.value = null;
  }
}

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

  knowledgeLoading.value = true;
  try {
    const paramRes = await AdminApiSystemParameter.getParameterActList({ businessId: detailObj?.activityPageId, type: '2' });
    const list = paramRes?.data?.data;
    currentActivityParamList.value = Array.isArray(list) ? list : [];
  } catch {
    // 左侧树切换时参数接口失败不阻断节点展示
    currentActivityParamList.value = [];
  } finally {
    knowledgeLoading.value = false;
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
    const fullMapValues = Array.from(sourceMap.entries()).map(([paramCode, paramValue]) => ({
      paramCode,
      paramName: paramCode,
      paramValue: String(paramValue ?? ''),
    }));
    const mergedByCode = new Map<string, { paramCode: string; paramName: string; paramValue: string }>();
    fullMapValues.forEach(row => {
      const code = String(row?.paramCode ?? '').trim();
      if (!code) return;
      mergedByCode.set(code, row);
    });
    normalizedValues.forEach(row => {
      const code = String(row?.paramCode ?? '').trim();
      if (!code) return;
      // 当前页组件参数优先（保留更准确的 paramName）
      mergedByCode.set(code, row);
    });
    nodeDetailData.value = {
      ...detailObj,
      savedParamValues: Array.from(mergedByCode.values()),
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
  if (toolbarActionLoadingIndex.value !== null) return;
  const key = orderedActivityNodeKeys.value[currentActivityIndex.value - 1];
  if (!key) return;
  selectedNodeKey.value = key;
  await requestNodeDetailByKey(key);
}

async function saveCurrentNodeParams(options?: { successMessage?: string; loadingType?: 'save' | 'submit' | 'finish' }) {
  if (saveFlowLoading.value || submitFlowLoading.value || finishFlowLoading.value || toolbarActionLoadingIndex.value !== null) return false;
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
  const tableUniqueCodeValues = nodePreviewRef.value?.getCurrentTableUniqueCodeSaveValues?.() || [];
  const tablePayload = nodePreviewRef.value?.getCurrentTableSavePayload?.() || [];
  const sourceValues = (Array.isArray(fromCheckPreview) && fromCheckPreview.length ? fromCheckPreview : fromNodePreview) || [];
  const baseValues = sourceValues
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  const extraValues = (Array.isArray(tableUniqueCodeValues) ? tableUniqueCodeValues : [])
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? row?.paramKey ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  const dedup = new Map<string, any>();
  [...baseValues, ...extraValues].forEach((row: any) => dedup.set(String(row.paramKey), row));
  const values = Array.from(dedup.values());
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
  if (saveFlowLoading.value || submitFlowLoading.value || finishFlowLoading.value || toolbarActionLoadingIndex.value !== null) return;
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
  const tableUniqueCodeValues = nodePreviewRef.value?.getCurrentTableUniqueCodeSaveValues?.() || [];
  const tablePayload = nodePreviewRef.value?.getCurrentTableSavePayload?.() || [];
  const sourceValues = (Array.isArray(fromCheckPreview) && fromCheckPreview.length ? fromCheckPreview : fromNodePreview) || [];
  const baseValues = sourceValues
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  const extraValues = (Array.isArray(tableUniqueCodeValues) ? tableUniqueCodeValues : [])
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? row?.paramKey ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  const dedup = new Map<string, any>();
  [...baseValues, ...extraValues].forEach((row: any) => dedup.set(String(row.paramKey), row));
  const values = Array.from(dedup.values());
  if (!values.length) {
    message.warning('当前节点暂无可提交参数');
    return;
  }
  const activityId = String(nodeDetailData.value?.id ?? selectedNode.value?.id ?? '').trim();
  if (!activityId) {
    message.warning('缺少活动ID，无法调取活动参数');
    return;
  }
  try {
    await AdminApiSystemParameter.getParameterActList({ businessId: activityId, type: '2' });
  } catch {
    message.error('活动参数获取失败，无法提交');
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
  if (saveFlowLoading.value || submitFlowLoading.value || finishFlowLoading.value || toolbarActionLoadingIndex.value !== null) return;
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
  const tableUniqueCodeValues = nodePreviewRef.value?.getCurrentTableUniqueCodeSaveValues?.() || [];
  const tablePayload = nodePreviewRef.value?.getCurrentTableSavePayload?.() || [];
  const sourceValues = (Array.isArray(fromCheckPreview) && fromCheckPreview.length ? fromCheckPreview : fromNodePreview) || [];
  const baseValues = sourceValues
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  const extraValues = (Array.isArray(tableUniqueCodeValues) ? tableUniqueCodeValues : [])
    .map((row: any) => ({
      bpmnElementId: String(row?.bpmnElementId ?? currentNodeKey),
      paramKey: String(row?.paramKey ?? '').trim(),
      paramName: String(row?.paramName ?? row?.paramKey ?? '').trim(),
      paramValue: String(row?.paramValue ?? ''),
    }))
    .filter((row: any) => row.paramKey);
  const dedup = new Map<string, any>();
  [...baseValues, ...extraValues].forEach((row: any) => dedup.set(String(row.paramKey), row));
  const values = Array.from(dedup.values());
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
  finishFlowLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.nextStep(data);
    const code = res?.data?.code;
    if (!(code === 0 || code === 200 || code === '0' || code === '200')) {
      message.error(String(res?.data?.msg ?? '提交失败'));
      return;
    }
    message.success('提交成功');
    router.back();
  } catch {
    message.error('提交失败');
  } finally {
    finishFlowLoading.value = false;
  }
}

const centerPaneSize = computed(() => Math.max(0, 100 - leftPaneSize.value - rightPaneSize.value));

function computeLeftPercentFromWidthPx(px: number): number {
  const el = workspacePageRef.value;
  if (!el || el.clientWidth <= 0) return minExpanded;
  const w = el.clientWidth;
  const rawPct = (px / w) * 100;
  const centerMin = 20;
  const maxLeft = Math.max(minExpanded, 100 - rightPaneSize.value - centerMin);
  return Math.min(Math.max(rawPct, minExpanded), maxLeft);
}

function applyDefaultLeftWidthPx() {
  leftPaneSize.value = computeLeftPercentFromWidthPx(DEFAULT_LEFT_WIDTH_PX);
}

function computeRightPercentFromWidthPx(px: number): number {
  const el = workspacePageRef.value;
  if (!el || el.clientWidth <= 0) return minExpanded;
  const w = el.clientWidth;
  const rawPct = (px / w) * 100;
  const centerMin = 20;
  const maxRight = Math.max(minExpanded, 100 - leftPaneSize.value - centerMin);
  return Math.min(Math.max(rawPct, minExpanded), maxRight);
}

function applyDefaultRightWidthPx() {
  rightPaneSize.value = computeRightPercentFromWidthPx(DEFAULT_RIGHT_WIDTH_PX);
}

function toggleLeftPanel() {
  if (!leftCollapsed.value) {
    leftPaneBeforeCollapse.value = leftPaneSize.value || computeLeftPercentFromWidthPx(DEFAULT_LEFT_WIDTH_PX);
    leftCollapsed.value = true;
    leftPaneSize.value = 0;
    if (rightCollapsed.value) {
      rightCollapsed.value = false;
      rightPaneSize.value = rightPaneBeforeCollapse.value || computeRightPercentFromWidthPx(DEFAULT_RIGHT_WIDTH_PX);
    }
    return;
  }
  leftCollapsed.value = false;
  leftPaneSize.value = leftPaneBeforeCollapse.value || computeLeftPercentFromWidthPx(DEFAULT_LEFT_WIDTH_PX);
}

function toggleRightPanel() {
  if (!rightCollapsed.value) {
    rightPaneBeforeCollapse.value = rightPaneSize.value || computeRightPercentFromWidthPx(DEFAULT_RIGHT_WIDTH_PX);
    rightCollapsed.value = true;
    rightPaneSize.value = 0;
    if (leftCollapsed.value) {
      leftCollapsed.value = false;
      leftPaneSize.value = leftPaneBeforeCollapse.value || computeLeftPercentFromWidthPx(DEFAULT_LEFT_WIDTH_PX);
    }
    return;
  }
  rightCollapsed.value = false;
  rightPaneSize.value = rightPaneBeforeCollapse.value || computeRightPercentFromWidthPx(DEFAULT_RIGHT_WIDTH_PX);
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
    return { left: SPLITPANES_TREE_COLLAPSE_TOGGLE_COLLAPSED_LEFT, top, transform: 'translate(-50%, -50%)' };
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

onMounted(() => {
  nextTick(() => {
    applyDefaultLeftWidthPx();
    leftPaneBeforeCollapse.value = leftPaneSize.value;
    applyDefaultRightWidthPx();
    rightPaneBeforeCollapse.value = rightPaneSize.value;
  });
});
</script>

<template>
  <div ref="workspacePageRef" class="workspace-page splitpanes-tree-collapse-wrap">
    <Splitpanes class="default-theme workspace-splitpanes" @resize="onSplitpanesResized" @resized="onSplitpanesResized">
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
            :disabled="saveFlowLoading || submitFlowLoading || finishFlowLoading || toolbarActionLoadingIndex !== null"
            @click="saveFlowInfo"
            ><EpcIcon type="icon-baocun" style="font-size: 12px" />保 存</a-button
          >
          <a-button
            v-for="(tbLabel, tbIdx) in nodeDetailToolbarButtons"
            :key="`node-toolbar-${tbIdx}-${tbLabel}`"
            type="primary"
            :loading="toolbarActionLoadingIndex === tbIdx"
            :disabled="saveFlowLoading || submitFlowLoading || finishFlowLoading || toolbarActionLoadingIndex !== null"
            @click="onNodeDetailToolbarAction(tbLabel, tbIdx)"
            >{{ tbLabel }}</a-button
          >
          <a-button type="primary" v-if="canGoPrev" :disabled="finishFlowLoading || toolbarActionLoadingIndex !== null" @click="goPrevNode"
            ><EpcIcon type="icon-paixujiantou2" style="font-size: 12px" />上一步</a-button
          >
          <a-button
            type="primary"
            v-if="canGoNext"
            :loading="submitFlowLoading"
            :disabled="saveFlowLoading || submitFlowLoading || finishFlowLoading || toolbarActionLoadingIndex !== null"
            @click="goNextNode"
            ><EpcIcon type="icon-paixujiantou" style="font-size: 12px" />提 交</a-button
          >
          <a-button
            v-if="isLastActivity"
            type="primary"
            :loading="finishFlowLoading"
            :disabled="saveFlowLoading || submitFlowLoading || finishFlowLoading || toolbarActionLoadingIndex !== null"
            @click="finishFlow"
            ><EpcIcon type="icon-yiwancheng" style="font-size: 12px" />完 成</a-button
          >
        </div>
      </Pane>
      <Pane :size="rightPaneSize" :min-size="rightCollapsed ? 0 : minExpanded" :class="['workspace-right', { 'workspace-right--collapsed': rightCollapsed }]">
        <div class="workspace-right-inner">
          <a-tabs v-model:activeKey="knowledgeRightActiveKey" class="workspace-knowledge-tabs">
            <a-tab-pane key="design" tab="设计知识">
              <a-input-search v-model:value="knowledgeKeyword" placeholder="请输入标题/内容关键字" class="workspace-knowledge-search" allow-clear>
                <template #enterButton>
                  <a-button type="primary">
                    <SearchOutlined class="workspace-knowledge-search__icon" />
                    搜索
                  </a-button>
                </template>
              </a-input-search>
              <a-spin :spinning="knowledgeLoading">
                <div class="workspace-knowledge-list">
                  <template v-if="filteredKnowledgeList.length > 0">
                    <div v-for="(item, idx) in filteredKnowledgeList" :key="item?.id ?? item?.knowledgeParseId ?? idx" class="workspace-knowledge-item">
                      <div class="workspace-knowledge-meta">
                        <a-tag color="blue"><span v-html="highlightPlainText(item.file?.title || '知识文档')" /></a-tag>
                        <a-tag v-if="item.remark" color="default"><span v-html="highlightPlainText(item.remark)" /></a-tag>
                        <a-tag v-if="item.versionNum" color="cyan">V<span v-html="highlightPlainText(item.versionNum)" /></a-tag>
                      </div>
                      <div v-if="item.file?.picture" class="workspace-knowledge-pictures">
                        <a-image :src="item.file?.picture" :width="240" class="workspace-knowledge-img" />
                      </div>
                      <div v-if="item.file?.content" class="workspace-knowledge-content" v-html="highlightRichHtml(item.file.content)" />
                      <a-divider v-if="idx < filteredKnowledgeList.length - 1" style="margin: 12px 0" />
                    </div>
                  </template>
                  <div v-else-if="!knowledgeLoading" class="workspace-knowledge-empty">暂无关联知识</div>
                </div>
              </a-spin>
            </a-tab-pane>
            <a-tab-pane key="log" tab="操作日志">
              <div class="workspace-right-tab-body">暂无操作日志</div>
            </a-tab-pane>
            <a-tab-pane key="flow" tab="设计流程">
              <div class="workspace-right-tab-body">暂无设计流程信息</div>
            </a-tab-pane>
          </a-tabs>
        </div>
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

/* 右侧不设 padding，滚动条贴齐与右栏之间的分割线；上/左/下仍留白 */
.workspace-center {
  padding: 16px 0 16px 16px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.workspace-right {
  padding: 12px 16px 16px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.workspace-right-inner {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.workspace-knowledge-tabs {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workspace-knowledge-tabs :deep(.ant-tabs-nav) {
  flex-shrink: 0;
  margin-bottom: 0;
}

.workspace-knowledge-tabs :deep(.ant-tabs-nav::before) {
  border-bottom-color: #e8e8e8;
}

.workspace-knowledge-tabs :deep(.ant-tabs-tab) {
  padding: 8px 0;
  margin: 0 20px 0 0;
  font-size: 14px;
}

.workspace-knowledge-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  font-weight: 500;
}

.workspace-knowledge-tabs :deep(.ant-tabs-content-holder) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.workspace-knowledge-tabs :deep(.ant-tabs-content),
.workspace-knowledge-tabs :deep(.ant-tabs-tabpane) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

.workspace-knowledge-search {
  margin-top: 12px;
}

.workspace-knowledge-search :deep(.ant-input-group .ant-input) {
  border-color: #d9d9d9;
}

.workspace-knowledge-search__icon {
  margin-right: 4px;
}

.workspace-right-tab-body {
  margin-top: 12px;
  color: #8c8c8c;
  font-size: 14px;
  line-height: 22px;
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
  padding: 12px 16px 0 0;
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}

.workspace-knowledge-list {
  margin-top: 12px;
  min-height: 220px;
}

.workspace-knowledge-item {
  padding: 2px 0;
}

.workspace-knowledge-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.workspace-knowledge-pictures {
  margin-top: 10px;
}

.workspace-knowledge-img {
  max-width: 100%;
}

.workspace-knowledge-content {
  margin-top: 10px;
  color: #333;
  line-height: 22px;
  word-break: break-word;
}

.workspace-knowledge-empty {
  margin-top: 10px;
  color: #8c8c8c;
}

:deep(.workspace-kw-highlight) {
  background-color: #fff1b8;
  color: #262626;
  padding: 0 1px;
  border-radius: 2px;
}
</style>
