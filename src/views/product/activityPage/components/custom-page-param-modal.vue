<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import draggableModal from '@/components/DraggableModal/index.vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { ParameterPageRequestDTOModel } from '@/api/models/parameter/ParameterPageRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import Tree from '@/components/tree/tree.vue';

const userStore = useUserStore();

const visible = ref(false);
const loading = ref(false);
const saving = ref(false);
const activityPageId = ref<number | string | null>(null);

const treeData = ref<any[]>([]);
const rawTreeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>('');
const treePage = ref<any>(null);
const selectNodeKeys = ref<string>('');
const currentNode = ref<any>(null);

const parameterList = ref<any[]>([]);
const listRequest = reactive(new ParameterPageRequestDTOModel());
listRequest.pageNo = 1;
listRequest.pageSize = 500;

/** 已关联参数 id（Transfer 键：p-{id}） */
const associatedKeys = ref<string[]>([]);
/** 跨分类缓存，用于右侧展示已关联项文案（key 为参数字符串 id） */
const parameterById = ref<Map<string, any>>(new Map());

const leftSearch = ref('');
const rightSearch = ref('');
const leftSelected = ref<string[]>([]);
const rightSelected = ref<string[]>([]);

const emit = defineEmits<{
  (e: 'saved'): void;
}>();

function paramKey(id: number | string) {
  return `p-${String(id)}`;
}

/** 行主键：兼容 id / parameterId / paramId */
function rowParamId(p: any): string | null {
  if (p == null || typeof p !== 'object') return null;
  const raw = p.id ?? p.parameterId ?? p.paramId;
  if (raw === null || raw === undefined || raw === '') return null;
  return String(raw);
}

/** 兼容 query-parameter-page 与 list：data 为数组或 { list | records | rows } */
function normalizeParameterListPayload(payload: unknown): any[] {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === 'object') {
    const o = payload as Record<string, unknown>;
    if (Array.isArray(o.list)) return o.list;
    if (Array.isArray(o.records)) return o.records;
    if (Array.isArray(o.rows)) return o.rows;
    if (Array.isArray(o.data)) return o.data as any[];
  }
  return [];
}

/** 列表展示：参数代号/参数值（不含所属分类） */
function formatParameterRow(p: any) {
  const code = p?.parameterNum ?? '-';
  const val = p?.exampleVal ?? p?.parameterName ?? '-';
  return `${code}/${val}`;
}

/**
 * 从 Tree @select 传入的 node 解析分类节点 id（与系统参数页 treeId 一致）。
 * Ant Design Vue 目录树可能使用 dataRef 挂载原始项，不能仅用 node.key。
 */
function resolveTreeNodeKey(node: unknown): string {
  if (node == null || typeof node !== 'object') return '';
  const n = node as Record<string, unknown>;
  const dataRef = n.dataRef;
  let fromRef = '';
  if (dataRef != null && typeof dataRef === 'object') {
    const dr = dataRef as Record<string, unknown>;
    const rid = dr.key ?? dr.id ?? dr.tid;
    if (rid != null && rid !== '') fromRef = String(rid);
  }
  const raw = n.key ?? n.eventKey ?? (fromRef || undefined) ?? n.id ?? n.tid;
  return raw != null && raw !== '' ? String(raw) : '';
}

/** 与系统参数页一致：POST 分页查询参数列表 */
async function fetchParameterListPage(treeId: string, pageNo: number, pageSize: number): Promise<any[]> {
  const query: any = {
    treeId,
    parameterName: '',
    parameterNum: '',
    userId: userStore.getUser.id,
  };
  const res: any = await AdminApiSystemParameter.getParameterInfoList(query);
  const ok = res?.data?.code == 0 || res?.data?.code == 200 || res?.data?.code === '0';
  if (!ok) return [];
  return normalizeParameterListPayload(res?.data?.data);
}

function convertToTreeNodes(data: any[]): any[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map(item => {
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
    let level = 3;
    if (hasChildren) level = 2;
    return {
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || '',
      type: 'param',
      categoryType: item.type,
      parentId: item.parentId,
      level,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

function mergeParameterCache(list: any[]) {
  const m = new Map(parameterById.value);
  for (const row of list || []) {
    const sid = rowParamId(row);
    if (sid) m.set(sid, row);
  }
  parameterById.value = m;
}

/** 参数分类树叶子节点 id（与左侧列表 treeId 一致），用于跨分类补齐已关联参数的展示数据 */
function collectLeafTreeIds(nodes: any[]): string[] {
  const out: string[] = [];
  function walk(items: any[]) {
    for (const item of items || []) {
      const children = item?.children;
      const hasChildren = Array.isArray(children) && children.length > 0;
      if (hasChildren) {
        walk(children);
      } else {
        const id = item?.id != null ? String(item.id) : item?.tid != null ? String(item.tid) : '';
        if (id) out.push(id);
      }
    }
  }
  walk(nodes);
  return out;
}

/**
 * 已关联参数可能分布在多个分类下，初始化时仅加载了当前选中分类的列表。
 * 根据关联 id 在整棵树叶子分类中分页查询，直到缓存中有全部已关联项（或已遍历完）。
 */
async function hydrateParameterCacheForAssociated() {
  const missing = new Set<string>();
  for (const key of associatedKeys.value) {
    if (!key.startsWith('p-')) continue;
    const sid = key.slice(2);
    if (sid && !parameterById.value.has(sid)) missing.add(sid);
  }
  if (!missing.size) return;

  const userId = userStore.getUser.id;
  const pageSize = listRequest.pageSize || 500;
  const leafTreeIds = collectLeafTreeIds(rawTreeData.value);

  for (const treeId of leafTreeIds) {
    if (!missing.size) break;
    let pageNo = 1;
    for (;;) {
      const list = await fetchParameterListPage(treeId, pageNo, pageSize);
      if (!list.length) break;
      mergeParameterCache(list);
      for (const sid of [...missing]) {
        if (parameterById.value.has(sid)) missing.delete(sid);
      }
      if (list.length < pageSize) break;
      pageNo += 1;
    }
  }
}

const leftCandidates = computed(() => {
  const q = leftSearch.value.trim().toLowerCase();
  return parameterList.value
    .map(p => {
      const sid = rowParamId(p);
      const key = sid ? paramKey(sid) : '';
      return { key, label: formatParameterRow(p), raw: p, sid };
    })
    .filter(it => it.sid && !associatedKeys.value.includes(it.key))
    .filter(it => !q || it.label.toLowerCase().includes(q));
});

const rightRowsAll = computed(() => {
  const rows: { key: string; label: string }[] = [];
  for (const key of associatedKeys.value) {
    if (!key.startsWith('p-')) continue;
    const sid = key.slice(2);
    const p = parameterById.value.get(sid);
    const label = p ? formatParameterRow(p) : `参数#${sid}`;
    rows.push({ key, label });
  }
  return rows;
});

const rightRowsFiltered = computed(() => {
  const q = rightSearch.value.trim().toLowerCase();
  const rows = rightRowsAll.value;
  if (!q) return rows;
  return rows.filter(r => r.label.toLowerCase().includes(q));
});

watch(visible, v => {
  if (!v) {
    leftSearch.value = '';
    rightSearch.value = '';
    leftSelected.value = [];
    rightSelected.value = [];
    treeData.value = [];
    parameterList.value = [];
    associatedKeys.value = [];
    parameterById.value = new Map();
    selectedKeys.value = '';
    expandedKeys.value = '';
    selectNodeKeys.value = '';
    currentNode.value = null;
  }
});

async function loadParameterTree() {
  const res: any = await AdminApiSystemParameter.getParameterTree({
    userId: userStore.getUser.id,
  } as ParameterPageRequestDTOModel);
  const ok = res?.data?.code == 0 || res?.data?.code == 200 || res?.data?.code === '0';
  if (!ok || !res?.data?.data) {
    treeData.value = [];
    rawTreeData.value = [];
    return;
  }
  const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
  rawTreeData.value = rawData;
  treeData.value = convertToTreeNodes(rawData);
  await nextTick();
  if (treeData.value.length > 0) {
    const first = treeData.value[0];
    selectedKeys.value = first.key;
    expandedKeys.value = first.key;
    currentNode.value = first;
    selectNodeKeys.value = first.key;
  } else {
    selectedKeys.value = '';
    expandedKeys.value = '';
    selectNodeKeys.value = '';
    currentNode.value = null;
  }
}

async function loadParameterList() {
  const treeId = selectNodeKeys.value || selectedKeys.value;
  if (!treeId) {
    parameterList.value = [];
    return;
  }
  const list = await fetchParameterListPage(treeId, listRequest.pageNo || 1, listRequest.pageSize || 500);
  parameterList.value = list;
  mergeParameterCache(list);
}

async function loadRelation() {
  if (activityPageId.value == null) return;
  try {
    const res: any = await AdminApiActivityPage.getCustomPageParamRelation({ pageId: activityPageId.value });
    const ok = res?.data?.code === 0 || res?.data?.code === 200 || res?.data?.code === '0';
    const data = res?.data?.data;
    if (ok && data && typeof data === 'object') {
      const pids = Array.isArray(data.parameterIds)
        ? data.parameterIds
        : Array.isArray((data as any).parameterIdList)
          ? (data as any).parameterIdList
          : [];
      if (pids.length) {
        associatedKeys.value = pids.map((id: number | string) => paramKey(String(id)));
        return;
      }
    }
  } catch {
    /* 接口未就绪 */
  }
  associatedKeys.value = [];
}

async function open(record: any) {
  activityPageId.value = record?.id ?? null;
  visible.value = true;
  associatedKeys.value = [];
  parameterById.value = new Map();
  loading.value = true;
  try {
    await loadParameterTree();
    await loadParameterList();
    await loadRelation();
    await hydrateParameterCacheForAssociated();
  } catch (e) {
    console.error(e);
    message.error('参数数据加载失败');
  } finally {
    loading.value = false;
  }
}

function close() {
  visible.value = false;
}

async function onSelectTreeNode(node: any) {
  const treeId = resolveTreeNodeKey(node);
  if (!treeId) {
    message.warning('无法识别分类节点，请重试');
    return;
  }
  const dataRow =
    node != null && typeof node === 'object' && (node as any).dataRef && typeof (node as any).dataRef === 'object'
      ? (node as any).dataRef
      : node;
  currentNode.value = dataRow;
  selectedKeys.value = treeId;
  selectNodeKeys.value = treeId;
  leftSelected.value = [];
  loading.value = true;
  try {
    await loadParameterList();
  } finally {
    loading.value = false;
  }
}

function noopTree() {
  /* 弹窗内树只读，不需增删改 */
}

function toggleLeft(key: string, checked: boolean) {
  if (checked) {
    if (!leftSelected.value.includes(key)) leftSelected.value = [...leftSelected.value, key];
  } else {
    leftSelected.value = leftSelected.value.filter(k => k !== key);
  }
}

function toggleRight(key: string, checked: boolean) {
  if (checked) {
    if (!rightSelected.value.includes(key)) rightSelected.value = [...rightSelected.value, key];
  } else {
    rightSelected.value = rightSelected.value.filter(k => k !== key);
  }
}

function moveToAssociated() {
  if (!leftSelected.value.length) return;
  const set = new Set(associatedKeys.value);
  for (const k of leftSelected.value) {
    set.add(k);
    const sid = k.startsWith('p-') ? k.slice(2) : '';
    const row = parameterList.value.find((r: any) => rowParamId(r) === sid);
    if (row && sid) {
      const m = new Map(parameterById.value);
      m.set(sid, row);
      parameterById.value = m;
    }
  }
  associatedKeys.value = Array.from(set);
  leftSelected.value = [];
}

function moveToUnassociated() {
  if (!rightSelected.value.length) return;
  const remove = new Set(rightSelected.value);
  associatedKeys.value = associatedKeys.value.filter(k => !remove.has(k));
  rightSelected.value = [];
}

async function handleConfirm() {
  if (activityPageId.value == null) {
    message.warning('缺少活动页面标识');
    return;
  }
  // 雪花 ID 超出安全整数，以字符串提交避免 Number 精度丢失
  const parameterIds: string[] = associatedKeys.value
    .filter(k => k.startsWith('p-'))
    .map(k => k.slice(2))
    .filter(sid => sid.length > 0);
  saving.value = true;
  try {
    const res: any = await AdminApiActivityPage.saveCustomPageParamRelation({
      activityPageId: activityPageId.value,
      parameterIds,
    });
    const ok = res?.data?.code === 0 || res?.data?.code === 200 || res?.data?.code === '0';
    if (ok) {
      message.success('保存成功');
      emit('saved');
      close();
    } else {
      message.error(res?.data?.msg || '保存失败，请确认后端接口已配置');
    }
  } catch (e) {
    console.error(e);
    message.error('保存失败，请确认后端接口已配置');
  } finally {
    saving.value = false;
  }
}

defineExpose({ open, close });
</script>

<template>
  <draggable-modal
    v-model:visible="visible"
    title="自定义页面关联参数"
    width="1040px"
    :footer="null"
    centered
    draggable
    destroy-on-close
    @cancel="close">
    <a-spin :spinning="loading">
      <div class="cppm-body">
        <div class="cppm-pane cppm-pane--left">
          <div class="cppm-pane-head">
            <span class="cppm-pane-title">未关联参数</span>
            <span class="cppm-pane-count">{{ leftSelected.length }}/{{ leftCandidates.length }}</span>
          </div>
          <div class="cppm-left-split">
            <div class="cppm-tree-wrap">
              <Tree
                ref="treePage"
                :operate-flag="false"
                :tree-data="treeData"
                bomType="unBom"
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
                @select-node="onSelectTreeNode"
                @up-Node="noopTree"
                @down-Node="noopTree"
                @get-node-update-data="noopTree"
                @get-node-add-data="noopTree"
                @delete-tree-node="noopTree"
                @submit="noopTree"
                @select-Boom-Tree="noopTree"
                @edit="noopTree"
                @reload-tree="noopTree"
                @change-select-key="noopTree" />
            </div>
            <div class="cppm-list-wrap">
              <a-input v-model:value="leftSearch" allow-clear placeholder="请输入搜索内容" class="cppm-search" />
              <div class="cppm-list">
                <template v-if="leftCandidates.length">
                  <label v-for="row in leftCandidates" :key="row.key" class="cppm-row">
                    <a-checkbox :checked="leftSelected.includes(row.key)" @change="e => toggleLeft(row.key, !!e?.target?.checked)" />
                    <span class="cppm-row-text">{{ row.label }}</span>
                  </label>
                </template>
                <div v-else class="cppm-empty">暂无数据</div>
              </div>
            </div>
          </div>
        </div>

        <div class="cppm-actions">
          <a-button type="primary" :disabled="!leftSelected.length" class="cppm-move-btn" @click="moveToAssociated">&gt;</a-button>
          <a-button type="primary" :disabled="!rightSelected.length" class="cppm-move-btn" @click="moveToUnassociated">&lt;</a-button>
        </div>

        <div class="cppm-pane cppm-pane--right">
          <div class="cppm-pane-head">
            <span class="cppm-pane-title">已关联参数</span>
            <span class="cppm-pane-count">{{ rightSelected.length }}/{{ rightRowsAll.length }}</span>
          </div>
          <a-input v-model:value="rightSearch" allow-clear placeholder="请输入搜索内容" class="cppm-search" />
          <div class="cppm-list cppm-list--right">
            <template v-if="rightRowsFiltered.length">
              <label v-for="row in rightRowsFiltered" :key="row.key" class="cppm-row">
                <a-checkbox :checked="rightSelected.includes(row.key)" @change="e => toggleRight(row.key, !!e?.target?.checked)" />
                <span class="cppm-row-text">{{ row.label }}</span>
              </label>
            </template>
            <div v-else class="cppm-empty">暂无数据</div>
          </div>
        </div>
      </div>
    </a-spin>

    <div class="cppm-footer">
      <a-button type="primary" :loading="saving" @click="handleConfirm">确定</a-button>
      <a-button @click="close">取消</a-button>
    </div>
  </draggable-modal>
</template>

<style scoped lang="less">
.cppm-body {
  display: flex;
  align-items: stretch;
  gap: 12px;
  min-height: 440px;
}

.cppm-pane {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  min-width: 0;
}

.cppm-pane--left {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
}

.cppm-pane--right {
  flex: 0 0 248px;
  max-width: 280px;
}

.cppm-left-split {
  display: flex;
  flex: 1;
  min-height: 0;
  gap: 10px;
  margin-top: 4px;
}

.cppm-tree-wrap {
  flex: 0 0 220px;
  width: 220px;
  min-width: 200px;
  max-width: 260px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px 6px;
  background: #fff;
  /* 仅由内层 Tree 滚动，避免出现双滚动条 */
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 400px;
  overflow: hidden;
}

.cppm-tree-wrap :deep(.action) {
  display: none;
}

.cppm-tree-wrap :deep(.container) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}

.cppm-tree-wrap :deep(.controls-wrap) {
  flex-shrink: 0;
}

/* Tree 模板里搜索下、目录树外的包裹层 */
.cppm-tree-wrap :deep(.container > div:nth-child(2)) {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 覆盖 Tree 内联的 100vh 高度，只保留这一层纵向滚动 */
.cppm-tree-wrap :deep(.ant-tree) {
  flex: 1 1 auto;
  min-height: 0 !important;
  height: 100% !important;
  max-height: 100% !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}

.cppm-tree-wrap :deep(.ant-tree-list-holder) {
  max-height: none !important;
  overflow: visible !important;
}

.cppm-list-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.cppm-pane-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cppm-pane-title {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.cppm-pane-count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.cppm-search {
  margin-bottom: 8px;
}

.cppm-list {
  flex: 1;
  overflow: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px 10px;
  min-height: 200px;
  max-height: 360px;
}

.cppm-list--right {
  max-height: 380px;
}

.cppm-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.5;
}

.cppm-row-text {
  flex: 1;
  word-break: break-all;
}

.cppm-empty {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  padding: 24px 0;
  font-size: 13px;
}

.cppm-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding-top: 100px;
  flex-shrink: 0;
}

.cppm-move-btn {
  min-width: 40px;
  padding: 0 12px;
}

.cppm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
</style>
