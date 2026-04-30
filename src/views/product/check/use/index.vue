<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import { message, Tooltip } from 'ant-design-vue';
import { LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
import { WeiI18n } from '@/utils/WeiI18n';
import { findNodeByIdFromKey } from '@/utils/tools';
import { ParameterPageRequestDTOModel } from '@/api/models/parameter/ParameterPageRequestDTOModel';
import Tree from '@/components/tree/tree.vue';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { useUserStore } from '@/store/modules/user';
import checkExeBg from '@/assets/images/check-exe.png';
import checkMatlabBg from '@/assets/images/check-matlab.png';
import checkExcelBg from '@/assets/images/check-excel.png';

import { download } from '@/libs/webSocketNew';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const loadingTree = ref<boolean>(false);
const currentNode = ref<any>();
const dataSource = ref<Array<any>>([]);
const treeParameterParams = reactive(new ParameterPageRequestDTOModel());
const rawTreeData = ref<Array<any>>([]);

/** 右侧计算清单 */
const checklistKeyword = ref('');
const checklistRaw = ref<any[]>([]);
const checklistLoading = ref(false);
let fetchChecklistSeq = 0;

/** 点击 exe 卡片后，getCheckExeInfoById 返回的数据（可接弹窗/路由） */
const lastCheckExeDetail = ref<any>(null);

const CONFIDENTIAL_LEVEL_LABELS: Record<number, string> = {
  0: '公开',
  1: '内部',
  2: '秘密',
  3: '机密',
};

type ChecklistCard = {
  id: string | number;
  title: string;
  authorText: string;
  dateText: string;
  statusTag: string;
  /** 计算类型文案：exe / matlab / excel */
  typeLabel: string;
  /** 编号、用途、分类等合并展示与检索 */
  infoLine: string;
  /** 顶部背景：checkType 3/2/其它 对应 exe / matlab / excel 图 */
  heroBgUrl: string;
  /** 原始行数据，供点击跳转等使用 */
  raw: Record<string, unknown>;
};

function pickFirstText(item: any, keys: string[]): string {
  for (const k of keys) {
    const v = item?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return '--';
}

function formatConfidentialTag(item: any): string {
  const raw = item?.confidentialLevel;
  const n = Number(raw);
  if (Number.isFinite(n) && CONFIDENTIAL_LEVEL_LABELS[n]) {
    return CONFIDENTIAL_LEVEL_LABELS[n];
  }
  const text = String(raw ?? item?.levelName ?? item?.secretLevel ?? '').trim();
  if (['公开', '内部', '秘密', '机密'].includes(text)) return text;
  return text || '公开';
}

/** checkType：3 → exe 图，2 → matlab 图，其它 → excel 图 */
function heroBgUrlForCheckType(item: any): string {
  const ct = Number(item?.checkType);
  if (Number.isFinite(ct) && ct === 3) return checkExeBg;
  if (Number.isFinite(ct) && ct === 2) return checkMatlabBg;
  return checkExcelBg;
}

/** 类型展示文案 */
function checkTypeLabel(item: any): string {
  const ct = Number(item?.checkType);
  if (Number.isFinite(ct) && ct === 3) return 'exe计算';
  if (Number.isFinite(ct) && ct === 2) return 'matlab计算';
  return 'excel计算';
}

/** 编号、用途、分类、发布状态等，用于副标题与关键字搜索 */
function buildInfoLine(item: any): string {
  const parts: string[] = [];
  const num = pickFirstText(item, ['checkNum', 'parameterNum', 'checkCode', 'code']);
  if (num && num !== '--') parts.push(`编号 ${num}`);
  const useType = String(item?.useType ?? '').trim();
  if (useType) parts.push(useType);
  const tree = String(item?.treeName ?? item?.categoryName ?? '').trim();
  if (tree) parts.push(tree);
  const st = item?.status;
  if (st === 1 || st === '1') parts.push('已发布');
  else if (st === 0 || st === '0') parts.push('未发布');
  const rem = String(item?.remarks ?? '').trim();
  if (rem) parts.push(rem.length > 36 ? `${rem.slice(0, 36)}…` : rem);
  return parts.join(' · ');
}

/** checkType：3 → (exe)，2 → (matlab)，其它 → (excel) */
function appendCheckTypeSuffix(baseTitle: string, item: any): string {
  const base = baseTitle.trim() || '--';
  if (base === '--') return base;
  if (/\((exe|matlab|excel)\)$/i.test(base)) return base;
  const ct = Number(item?.checkType);
  const tag = Number.isFinite(ct) && ct === 3 ? '(exe)' : Number.isFinite(ct) && ct === 2 ? '(matlab)' : '(excel)';
  return `${base}${tag}`;
}

function mapItemToCard(item: any, index: number): ChecklistCard {
  const rawTitle =
    String(item?.checkName ?? item?.checkTitle ?? item?.summarName ?? item?.applicationName ?? item?.parameterName ?? item?.calcName ?? item?.name ?? item?.title ?? '--').trim() ||
    '--';
  const title = appendCheckTypeSuffix(rawTitle, item);
  const authorText = pickFirstText(item, [
    'createName',
    'createUserName',
    'createByName',
    'createUser',
    'creatorName',
    'creator',
    'userName',
    'nickName',
    'updateName',
    'updateUserName',
  ]);
  const t = item?.createTime ?? item?.createData ?? item?.updateTime ?? item?.editTime ?? item?.gmtCreate;
  const dateText = t ? dayjs(t).format('YYYY-MM-DD') : '--';
  const id = item?.id ?? item?.exeCheckId ?? item?.summarId ?? `row-${index}`;
  const typeLabel = checkTypeLabel(item);
  const infoLine = buildInfoLine(item);
  return {
    id,
    title,
    authorText,
    dateText,
    statusTag: formatConfidentialTag(item),
    typeLabel,
    infoLine,
    heroBgUrl: heroBgUrlForCheckType(item),
    raw: { ...(item as Record<string, unknown>) },
  };
}

const checklistCards = computed<ChecklistCard[]>(() => {
  const kw = checklistKeyword.value.trim().toLowerCase();
  const rows = checklistRaw.value || [];
  const mapped = rows.map((item, i) => mapItemToCard(item, i));
  if (!kw) return mapped;
  return mapped.filter(
    c =>
      c.title.toLowerCase().includes(kw) ||
      c.typeLabel.toLowerCase().includes(kw) ||
      c.infoLine.toLowerCase().includes(kw) ||
      c.authorText.toLowerCase().includes(kw) ||
      c.statusTag.toLowerCase().includes(kw) ||
      c.dateText.includes(kw),
  );
});

async function fetchChecklist(options?: { serverSearch?: boolean }) {
  const treeId = String(currentNode.value?.key ?? '').trim();
  if (!treeId) {
    checklistRaw.value = [];
    return;
  }

  const seq = ++fetchChecklistSeq;
  checklistLoading.value = true;
  try {
    const query: Record<string, unknown> = {
      userId: userStore.getUser.id,
      treeId,
    };
    const kw = checklistKeyword.value.trim();
    if (options?.serverSearch && kw) {
      query.checkName = kw;
    }

    const res = await AdminApiSystemCheckInfoApi.getCheckSummarListByTreeId(query);
    if (seq !== fetchChecklistSeq) return;

    const code = res?.data?.code as number | string | undefined;
    const ok = code === 0 || code === 200 || code === '0' || code === '200';
    const raw = res?.data?.data;
    let list: any[] = [];
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (Array.isArray((raw as any).list)) {
        list = (raw as any).list;
      } else if (Array.isArray((raw as any).records)) {
        list = (raw as any).records;
      }
    } else if (Array.isArray(raw)) {
      list = raw;
    }
    checklistRaw.value = ok ? list : [];
    if (!ok && res?.data?.msg) message.error(String(res.data.msg));
  } catch {
    if (seq !== fetchChecklistSeq) return;
    checklistRaw.value = [];
    message.error('获取计算清单失败');
  } finally {
    if (seq === fetchChecklistSeq) {
      checklistLoading.value = false;
    }
  }
}

function onChecklistSearch() {
  void fetchChecklist({ serverSearch: true });
}

/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    const res = await AdminApiSystemParameter.checkTreeAppList(treeParameterParams);
    loadingTree.value = false;
    if ((res.data.code == 0 || res.data.code == 200) && res.data.data) {
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      dataSource.value = rawData[0];
      rawTreeData.value = rawData;
      const treeNodes = convertToTreeNodes(rawTreeData.value);
      treeData.value = treeNodes;
      if (treeNodes.length > 0) {
        selectedKeys.value = '';
        nextTick(() => {
          if (type) {
            if (currentNode.value.key) {
              const rootNode = findNodeByIdFromKey(treeData.value, currentNode.value.key, 'key');
              const pathNodes = findNodePathByKey(treeNodes, String(currentNode.value.key));
              if (pathNodes && pathNodes.length) {
                expandedKeys.value = pathNodes
                  .filter(n => Array.isArray(n?.children) && n.children.length > 0)
                  .map(n => n.key)
                  .join(',');
              }
              selectNode(rootNode);
            }
          } else {
            selectedKeys.value = treeNodes[0].key;
            expandedKeys.value = treeNodes[0].key;
            selectNode(treeNodes[0]);
          }
        });
      }
    }
  } catch (error) {
    console.error('获取树数据失败:', error);
    message.error('获取数据失败');
  } finally {
    loadingTree.value = false;
  }
}

onMounted(() => {
  getListData();
});

function convertToTreeNodes(data: any[]): any[] {
  if (!data || !Array.isArray(data)) return [];

  return data.map(item => {
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
    let level = 3;
    if (hasChildren) {
      level = 2;
    }
    return {
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.categoryName || '',
      type: 'param',
      categoryType: item.type,
      parentId: item.parentId,
      level: level,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  if (!nodes || !Array.isArray(nodes)) return [];

  return nodes
    .map(node => {
      const isMatch = node.categoryName && node.categoryName.toLowerCase().includes(searchValue.toLowerCase());
      let matchingChildren = [];
      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        matchingChildren = filterTreeNodes(node.children, searchValue);
      }
      if (isMatch || matchingChildren.length > 0) {
        return {
          ...node,
          children: matchingChildren,
        };
      }
      return null;
    })
    .filter(Boolean);
}

function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}

function selectNode(node: any) {
  if (!node) return;
  currentNode.value = node;
  selectedKeys.value = String(node.key ?? '');
  checklistKeyword.value = '';
  void fetchChecklist();
}

function findNodePathByKey(nodes: any[], targetKey: string, path: any[] = []): any[] | null {
  for (const node of nodes || []) {
    const nextPath = [...path, node];
    if (String(node?.key ?? '') === String(targetKey ?? '')) {
      return nextPath;
    }
    if (Array.isArray(node?.children) && node.children.length > 0) {
      const childPath = findNodePathByKey(node.children, targetKey, nextPath);
      if (childPath) return childPath;
    }
  }
  return null;
}

async function submitTreeData(nodeList: any) {
  const data: any = {};
  data.categoryName = nodeList.categoryName;
  data.parentId = nodeList.pid;
  await AdminApiSystemParameter.createCheckTree(data);
  await getListData('change');
  Selectafterchanges();
  message.success(WeiI18n.t('保存成功').value);
}

async function editTreeData(nodeList: any, _selectedKeys: any) {
  const data: any = {};
  data.categoryName = nodeList.categoryName;
  data.parentId = nodeList.pid;
  data.id = nodeList.id;
  await AdminApiSystemParameter.updateCheckTree(data);
  await getListData('change');
  message.success(WeiI18n.t('修改成功').value);
  Selectafterchanges();
}

async function reloadTree() {
  await getListData();
}

async function handleChangeSelectKey(searchValue: string) {
  if (!searchValue) {
    await getListData();
    return;
  }
  const filteredData = filterTreeNodes([dataSource.value], searchValue);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;
}

async function checkContentStart(card: ChecklistCard) {
  const raw = card.raw as Record<string, unknown>;
  const ct = Number(raw?.checkType);
  if (ct === 1 || raw?.checkType === '1') {
    const cacheKey = `designTaskAppDetail:${String(raw?.id ?? Date.now())}:${Date.now()}`;
    sessionStorage.setItem(cacheKey, JSON.stringify(raw ?? {}));
    router.push({
      path: '/internal/design-task-app-detail',
      query: {
        cacheKey,
        returnPath: route.fullPath,
        entry: 'check',
      },
    });
    return;
  }
  if (ct !== 3 && raw?.checkType !== '3') {
    message.info('当前类型暂未配置详情请求');
    return;
  }
  const exeId = raw?.exeCheckId ?? raw?.id;
  if (exeId == null || String(exeId).trim() === '') {
    message.warning('缺少 exeCheckId，无法获取 exe 详情');
    return;
  }
  const hide = message.loading('正在获取 exe 信息…', 0);
  try {
    const res = await AdminApiSystemCheckInfoApi.getCheckExeInfoById({
      id: exeId,
      userId: userStore.getUser.id,
    });
    const code = res?.data?.code as number | string | undefined;
    const ok = code === 0 || code === 200 || code === '0' || code === '200';
    if (!ok) {
      message.error(String(res?.data?.msg ?? '获取 exe 信息失败'));
      lastCheckExeDetail.value = null;
      return;
    }
    const detail = res?.data?.data ?? null;
    lastCheckExeDetail.value = detail;
    const fileList = detail?.fileList as unknown[] | undefined;
    const first = Array.isArray(fileList) && fileList[0] != null && typeof fileList[0] === 'object' ? (fileList[0] as Record<string, unknown>) : null;
    const filePath = String(first?.filePath ?? (detail as Record<string, unknown> | null)?.filePath ?? '').trim();
    if (filePath) {
      const downloadDir = (import.meta.env.VITE_BASE_FILE_DOWNLOAD_URL ?? '').trim();
      if (!downloadDir) {
        message.warning('未配置本地下载目录（VITE_BASE_FILE_DOWNLOAD_URL）');
        return;
      }
      void download(filePath, downloadDir, String(first?.oldFileName), true).catch(() => {});
    } else {
      message.warning('未返回 filePath');
    }
  } catch (e) {
    console.error(e);
    message.error('获取 exe 信息失败');
    lastCheckExeDetail.value = null;
  } finally {
    hide();
  }
}

const { leftTreeCollapsed, leftTreePaneSize, rightTreePaneSize, minExpanded, onSplitpanesResized, toggleLeftTreePanel, splitToggleStyle, splitpanesTreeCollapseWrapClass } =
  useSplitpanesTreeCollapse();
</script>

<template>
  <div class="drawerContent h-full">
    <div :class="splitpanesTreeCollapseWrapClass">
      <Splitpanes class="default-theme sbom" @resize="onSplitpanesResized" @resized="onSplitpanesResized">
        <Pane :min-size="leftTreeCollapsed ? 0 : minExpanded" :size="leftTreePaneSize" class="splitpane-cls marginstyle">
          <a-spin :spinning="loadingTree" tip="加载中...">
            <Tree
              :operate-flag="false"
              :tree-data="treeData"
              bom-type="unBom"
              :selected-keys="selectedKeys"
              :expanded-keys="expandedKeys"
              @select-node="selectNode"
              @submit="submitTreeData"
              @edit="editTreeData"
              @reload-tree="reloadTree"
              @change-select-key="handleChangeSelectKey" />
          </a-spin>
        </Pane>

        <Pane class="splitpane-cls splitpane-cls--right" :size="rightTreePaneSize">
          <div class="checklist-pane">
            <div class="checklist-toolbar">
              <a-input v-model:value="checklistKeyword" placeholder="请输入查询条件" allow-clear class="checklist-toolbar__input" @pressEnter="onChecklistSearch">
                <template #prefix>
                  <SearchOutlined class="checklist-toolbar__search-icon" />
                </template>
              </a-input>
            </div>
            <a-spin :spinning="checklistLoading" class="checklist-spin">
              <div v-if="checklistCards.length" class="checklist-grid">
                <div v-for="card in checklistCards" :key="String(card.id)" class="checklist-card" @click="checkContentStart(card)">
                  <div class="checklist-card__hero" :style="{ backgroundImage: `url(${card.heroBgUrl})` }">
                    <div class="checklist-card__hero-stack">
                      <span class="checklist-card__hero-title" :title="card.title">{{ card.title }}</span>
                      <div class="checklist-card__hero-meta" :title="`类型：${card.typeLabel}${card.infoLine ? ' · ' + card.infoLine : ''}`">
                        <span v-if="card.infoLine" class="checklist-card__hero-meta-info">{{ card.infoLine }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="checklist-card__footer">
                    <span class="checklist-card__footer-left" :title="card.authorText">{{ card.authorText }}</span>
                    <span class="checklist-card__footer-center">{{ card.dateText }}</span>
                    <span class="checklist-card__footer-right">{{ card.statusTag }}</span>
                  </div>
                </div>
              </div>
              <a-empty v-else class="checklist-empty" description="暂无计算工具" />
            </a-spin>
          </div>
        </Pane>
      </Splitpanes>
      <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
        <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="splitToggleStyle" @click="toggleLeftTreePanel" @mousedown.stop>
          <LeftOutlined v-if="!leftTreeCollapsed" />
          <RightOutlined v-else />
        </button>
      </Tooltip>
    </div>
  </div>
</template>

<style lang="less" scoped>
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}

.splitpane-cls--right {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: #fff;
}

.checklist-pane {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px;
  overflow: hidden;
  background: #fff;
}

.checklist-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-shrink: 0;
}

.checklist-toolbar__input {
  width: 260px;
  max-width: 260px;
  flex-shrink: 0;
}

.checklist-toolbar__input :deep(.ant-input-affix-wrapper) {
  width: 260px;
  max-width: 260px;
  border-radius: 10px;
  padding: 6px 14px;
  min-height: 40px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.checklist-toolbar__input :deep(.ant-input-affix-wrapper:hover) {
  border-color: #69b1ff;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.08);
}

.checklist-toolbar__input :deep(.ant-input-affix-wrapper-focused),
.checklist-toolbar__input :deep(.ant-input-affix-wrapper:focus-within) {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
}

.checklist-toolbar__search-icon {
  color: #8c8c8c;
  font-size: 15px;
  transition: color 0.2s ease;
}

.checklist-toolbar__input :deep(.ant-input-affix-wrapper-focused) .checklist-toolbar__search-icon,
.checklist-toolbar__input :deep(.ant-input-affix-wrapper:focus-within) .checklist-toolbar__search-icon {
  color: #1677ff;
}

.checklist-spin {
  flex: 1;
  min-height: 0;
}

.checklist-spin :deep(.ant-spin-container) {
  min-height: 200px;
  height: 100%;
  overflow: auto;
}

.checklist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 256px);
  gap: 18px 20px;
  align-content: start;
  justify-content: start;
  padding-bottom: 8px;
}

.checklist-card {
  box-sizing: border-box;
  width: 256px;
  height: 223px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease;
  will-change: transform;
}

.checklist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.checklist-card__hero {
  position: relative;
  box-sizing: border-box;
  height: 179px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  background-color: #1a6bb8;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.checklist-card__hero-stack {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  max-height: 100%;
}

.checklist-card__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 40, 90, 0.35) 0%, rgba(0, 0, 0, 0.12) 100%);
  pointer-events: none;
  transition:
    opacity 0.28s ease,
    background 0.28s ease;
}

.checklist-card:hover .checklist-card__hero::before {
  opacity: 0.55;
  background: linear-gradient(135deg, rgba(0, 40, 90, 0.18) 0%, rgba(0, 0, 0, 0.06) 100%);
}

.checklist-card__hero-title {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  transition:
    color 0.28s ease,
    text-shadow 0.28s ease;
  width: 100%;
}

.checklist-card:hover .checklist-card__hero-title {
  color: #0052d9;
  text-shadow: none;
}

.checklist-card__hero-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;
  font-size: 11px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  transition: color 0.28s ease;
}

.checklist-card__hero-meta-type {
  flex-shrink: 0;
}

.checklist-card__hero-meta-info {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  opacity: 0.95;
}

.checklist-card:hover .checklist-card__hero-meta {
  color: rgba(255, 255, 255, 0.88);
}

.checklist-card:hover .checklist-card__hero-meta-type {
  color: #7eb6ff;
}

.checklist-card__footer {
  box-sizing: border-box;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 0 10px;
  background: #fff;
  font-size: 12px;
  color: #262626;
}

.checklist-card__footer-left {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checklist-card__footer-center {
  flex-shrink: 0;
  color: #595959;
}

.checklist-card__footer-right {
  flex-shrink: 0;
  color: #262626;
}

.checklist-empty {
  margin-top: 48px;
}

:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
  background-color: #ffffff !important;
}
</style>
