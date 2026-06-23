<template>
  <div class="form-content">
    <!-- 字段列表 -->
    <div class="element-property list-property">
      <a-button type="primary" size="small" @click="addForm()">
        <template #icon><plus-outlined /></template>
        关联活动
      </a-button>
      <a-divider>
        <template #icon><table-outlined /></template>
        表单字段
      </a-divider>

      <a-table
        v-if="formFieldDisplayRows.length"
        class="exe-config-table form-field-table"
        :data-source="formFieldDisplayRows"
        :scroll="{ y: 240 }"
        bordered
        table-layout="fixed"
        :pagination="false"
        :row-class-name="getFormFieldTableRowClassName">
        <a-table-column key="displayPageName" title="活动名称" data-index="displayPageName" align="left" :width="formFieldColWidths.pageName" :ellipsis="true" />
        <a-table-column key="displayPageType" title="活动类型" data-index="displayPageType" align="center" :width="formFieldColWidths.pageType">
          <template #default="{ record }">
            <span v-if="String(record.displayPageType) === '1'">{{ $t('设计配置页面') }}</span>
            <span v-else-if="String(record.displayPageType) === '2'">{{ $t('计算集成页面') }}</span>
            <span v-else-if="String(record.displayPageType) === '3'">{{ $t('自定义页面') }}</span>
            <span v-else-if="record.displayPageType != null && String(record.displayPageType).trim() !== ''">{{ record.displayPageType }}</span>
            <span v-else class="form-field-page-type-empty">—</span>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" align="left" :width="formFieldColWidths.action">
          <template #default="{ record }">
            <span class="form-field-unlink" @click="unlinkActivity(record)">取消关联</span>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <!-- 添加表单抽屉：左右布局，底栏按钮，表格样式与参数字典一致 -->
    <a-drawer
      v-model:visible="drawer"
      title="关联活动"
      placement="right"
      width="920"
      class="form-selector-drawer"
      :body-style="{ padding: 0 }"
      destroy-on-close>
      <div class="selector-drawer">
        <div class="selector-drawer__main">
          <div class="selector-layout__left">
            <a-tree
              v-if="activityTreeData.length"
              block-node
              :tree-data="activityTreeData"
              :field-names="{ title: 'name', key: 'id', children: 'children' }"
              :selected-keys="treeSelectedKeys"
              :default-expand-all="true"
              @select="onTreeSelect" />
            <a-empty v-else description="暂无分类数据" />
          </div>
          <div class="selector-layout__right">
            <div class="selector-drawer__query">
              <a-form layout="inline" class="selector-drawer__query-form">
                <a-form-item :label="$t('活动名称')">
                  <a-input
                    v-model:value="searchPageName"
                    allow-clear
                    :placeholder="$t('请输入活动名称')"
                    style="width: 180px"
                    @press-enter="handleSelectorSearch" />
                </a-form-item>
                <a-form-item :label="$t('活动类型')">
                  <a-select
                    v-model:value="searchPageType"
                    allow-clear
                    :placeholder="$t('请选择活动类型')"
                    style="width: 160px"
                    :options="activityPageTypeOptions" />
                </a-form-item>
                <a-form-item class="selector-drawer__query-btn">
                  <a-button type="primary" @click="handleSelectorSearch">{{ $t('查询') }}</a-button>
                </a-form-item>
              </a-form>
            </div>
            <a-table
              ref="tableRef"
              class="exe-config-table selector-activity-table"
              :data-source="formList"
              :loading="loading"
              :pagination="false"
              bordered
              table-layout="fixed"
              :scroll="{ x: selectorTableScrollX }"
              row-key="id"
              :custom-row="customRow"
              :row-class-name="getSelectorTableRowClassName"
              :row-selection="{
                type: 'radio',
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectionChange,
                columnWidth: 48,
              }">
              <a-table-column key="pageName" title="活动名称" data-index="pageName" align="left" :width="220" :ellipsis="true" />
              <a-table-column key="pageType" title="活动类型" data-index="pageType" align="center" :width="120" :ellipsis="true">
                <template #default="{ record }">
                  <span v-if="String(record.pageType) === '1'">{{ $t('设计配置页面') }}</span>
                  <span v-else-if="String(record.pageType) === '2'">{{ $t('计算集成页面') }}</span>
                  <span v-else-if="String(record.pageType) === '3'">{{ $t('自定义页面') }}</span>
                  <span v-else>{{ record.pageType }}</span>
                </template>
              </a-table-column>
              <a-table-column key="treeName" title="所属分类" data-index="treeName" align="center" :width="120" :ellipsis="true" />
              <a-table-column key="groupName" title="组名称" data-index="groupName" align="center" :width="110" :ellipsis="true" />
              <a-table-column key="remark" title="备注" data-index="remark" align="center" :width="140" :ellipsis="true" />
            </a-table>
            <div class="selector-drawer__pagination">
              <a-pagination
                size="small"
                :total="total"
                :page-size="pageSize"
                :current="pageNum"
                :page-size-options="['10', '30', '50', '100', '200']"
                :show-total="showSelectorPaginationTotal"
                :build-option-text="prop => `${prop.value}${$t('条/页')}`"
                show-size-changer
                show-less-items
                @change="onPageChange"
                @show-size-change="onPageSizeChange" />
            </div>
          </div>
        </div>
        <div class="selector-drawer__footer">
          <a-button type="primary" @click="confirm">确定</a-button>
          <a-button @click="cancel">取消</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, toRaw } from 'vue';
import { PlusOutlined, TableOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { WeiI18n } from '@/utils/WeiI18n';
const props = defineProps({
  elementBusinessObject: {
    type: Object,
    default: () => {},
  },
  currentNode: {
    type: Object,
    default: () => {},
  },
  /** 与路由 taskId 一致，隔离 localStorage，避免不同流程里 BPMN 元素 id 复用串数据 */
  taskId: {
    type: [String, Number],
    default: '',
  },
  menuId: {
    type: [String, Number],
    default: '',
  },
});
// 响应式数据
const bpmnElement = ref(null);
const loading = ref(false);
const drawer = ref(false);
const fieldList = ref([]);
const formList = ref([]);
const activityTreeData = ref([]);
const treeSelectedKeys = ref([]);
const currentTreeId = ref('');
const selectedRowKeys = ref([]);
const selectedRow = ref({});
const pageSize = ref(10);
const pageNum = ref(1);
const total = ref(0);
const searchPageName = ref('');
const searchPageType = ref(undefined);
/** 关联活动抽屉：记住上次选中的分类、分页与活动行 */
const lastSelectorTreeId = ref('');
const lastSelectorPageNum = ref(1);
const lastSelectorRowId = ref(null);
const activityPageTypeOptions = computed(() => [
  { label: WeiI18n.t('设计配置页面').value, value: '1' },
  { label: WeiI18n.t('计算集成页面').value, value: '2' },
  { label: WeiI18n.t('自定义页面').value, value: '3' },
]);
const deepCope = ref([]);
const arrData = ref([]);
const tableRef = ref();

/** 属性面板「表单字段」表列宽（合计约 372px，贴合 400px 侧栏内容区） */
const formFieldColWidths = {
  pageName: 104,
  pageType: 172,
  action: 96,
};
/** 选择器表格列宽之和 + 单选列（与 parameter/index.vue 横向滚动一致） */
const SELECTOR_RADIO_COL_WIDTH = 48;
const SELECTOR_SCROLL_X_BUFFER = 2;
const selectorTableScrollX = computed(() => {
  const colWidths = [220, 120, 120, 110, 140];
  const sum = colWidths.reduce((a, b) => a + b, 0);
  return sum + SELECTOR_RADIO_COL_WIDTH + SELECTOR_SCROLL_X_BUFFER;
});

function getSelectorTableRowClassName(_record, index) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function getFormFieldTableRowClassName(_record, index) {
  return index % 2 === 0 ? 'odd' : 'even';
}

const FORM_BINDING_MAP_PREFIX = 'activityFormBindingMap';
const FORM_BINDING_BY_FORMKEY_PREFIX = 'activityFormBindingByFormKey';

function bindingMapStorageKey() {
  const t = props.taskId != null ? String(props.taskId).trim() : '';
  return t ? `${FORM_BINDING_MAP_PREFIX}:${t}` : FORM_BINDING_MAP_PREFIX;
}

function formKeyMapStorageKey() {
  const t = props.taskId != null ? String(props.taskId).trim() : '';
  return t ? `${FORM_BINDING_BY_FORMKEY_PREFIX}:${t}` : FORM_BINDING_BY_FORMKEY_PREFIX;
}

/** 切换节点或重新同步时递增，丢弃过期的异步回查结果 */
let fieldListHydrateGeneration = 0;

function getMenuIdParam() {
  const m = props.menuId != null ? props.menuId : '';
  return m ? { menuId: m } : {};
}

/** 表格行：活动名称与节点「名称」一致；活动类型优先节点 pageType，否则用关联活动数据 */
const formFieldDisplayRows = computed(() => {
  const bo = props.elementBusinessObject || {};
  const nodeName = bo.name != null && String(bo.name).trim() !== '' ? String(bo.name) : '';
  const nodePt = getNodePageTypeFromBo(bo);
  return fieldList.value.map(row => {
    const rowPt = pickPageTypeFromActivityRow(row);
    // 优先用关联活动数据中的类型；节点 pageType 为空时（如取消关联后）仍可从活动行展示
    const displayPt = rowPt !== '' ? rowPt : nodePt;
    return {
      ...row,
      displayPageName: nodeName || row.pageName || '',
      displayPageType: displayPt,
    };
  });
});

function getNodePageTypeFromBo(bo) {
  if (!bo) return '';
  const v = bo.pageType ?? bo['flowable:pageType'] ?? bo.pageTypeName;
  if (v === undefined || v === null || v === '') return '';
  return String(v).trim();
}

/** 从活动列表/缓存行解析页面类型（兼容数字、多种字段名） */
function pickPageTypeFromActivityRow(row) {
  if (!row || typeof row !== 'object') return '';
  const v = row.pageType ?? row.page_type ?? row.activityPageType;
  if (v === undefined || v === null || v === '') return '';
  return String(v).trim();
}

function getFormKeyFromBusinessObject(bo) {
  if (!bo) return '';
  const fk = bo.formKey ?? bo['flowable:formKey'];
  if (fk === undefined || fk === null || fk === '') return '';
  return String(fk);
}

// 生命周期
onMounted(() => {
  bpmnElement.value = window.bpmnInstances?.bpmnElement || null;
  syncFieldListFromCurrentElement();
  getList();
  // store.dispatch("dict/setFolwjudge", true);
});

onBeforeUnmount(() => {
  cleanUp();
});

// 监听器
watch(
  () => props.elementBusinessObject,
  val => {
    if (val) {
      // 属性面板切换到不同任务节点时，同步当前 bpmnElement 引用
      bpmnElement.value = window.bpmnInstances?.bpmnElement || val;
      syncFieldListFromCurrentElement();
    }
  },
  { immediate: true, deep: true },
);

watch(
  () => props.taskId,
  () => {
    bpmnElement.value = window.bpmnInstances?.bpmnElement || null;
    syncFieldListFromCurrentElement();
  },
);
// watch(nameFlag, val => {
//   if (val === false) {
//     fieldList.value = [];
//   }
// });

// watch(setName, val => {
//   if (val) {
//     fieldList.value = [];
//     arrData.value = formList.value.filter(v => v.pageName === val);

//     if (arrData.value.length > 0) {
//       fieldList.value = arrData.value;
//       // store.dispatch("dict/setFolwjudge", true);
//     } else {
//       // store.dispatch("dict/setFolwjudge", false);
//     }
//   }
// });

// 方法
const addForm = async () => {
  searchPageName.value = '';
  searchPageType.value = undefined;
  formList.value = [];
  total.value = 0;
  selectedRowKeys.value = [];
  selectedRow.value = {};
  drawer.value = true;
  await loadActivityTree(buildSelectorRestoreState());
};

function getFirstNodeId(nodes) {
  if (!Array.isArray(nodes) || !nodes.length) return '';
  const first = nodes[0];
  if (!first) return '';
  return String(first.id ?? '');
}

function treeContainsId(nodes, id) {
  const targetId = id != null ? String(id).trim() : '';
  if (!targetId) return false;
  return flattenTreeNodes(nodes, []).some(node => String(node?.id ?? '') === targetId);
}

function resolveSelectorTreeId(treeData, preferredId) {
  const preferred = preferredId != null ? String(preferredId).trim() : '';
  if (preferred && treeContainsId(treeData, preferred)) {
    return preferred;
  }
  return getFirstNodeId(treeData);
}

function buildSelectorRestoreState() {
  const linked = fieldList.value[0];
  const linkedTreeId = linked?.treeId != null ? String(linked.treeId).trim() : '';
  const linkedRowId = linked?.id != null ? linked.id : null;
  const preferredTreeId = linkedTreeId || lastSelectorTreeId.value;
  const sameAsLastTree = !linkedTreeId || linkedTreeId === String(lastSelectorTreeId.value ?? '');
  let preferredPageNum = 1;
  if (!linkedRowId && sameAsLastTree) {
    preferredPageNum = lastSelectorPageNum.value > 0 ? lastSelectorPageNum.value : 1;
  }
  const preferredRowId = linkedRowId ?? lastSelectorRowId.value;

  return {
    preferredTreeId,
    preferredPageNum,
    preferredRowId,
  };
}

function resetSelectorQueryState() {
  pageNum.value = 1;
  searchPageName.value = '';
  searchPageType.value = undefined;
  formList.value = [];
  total.value = 0;
}

function restoreSelectorRowSelection(preferredRowId) {
  if (preferredRowId == null || String(preferredRowId).trim() === '') {
    selectedRowKeys.value = [];
    selectedRow.value = {};
    return;
  }
  const targetId = String(preferredRowId);
  const matched = formList.value.find(item => String(item.id) === targetId);
  if (matched) {
    selectedRowKeys.value = [matched.id];
    selectedRow.value = matched;
    lastSelectorRowId.value = matched.id;
    return;
  }
  selectedRowKeys.value = [];
  selectedRow.value = {};
}

function persistSelectorSession() {
  if (currentTreeId.value) {
    lastSelectorTreeId.value = currentTreeId.value;
  }
  if (pageNum.value > 0) {
    lastSelectorPageNum.value = pageNum.value;
  }
  if (selectedRow.value?.id != null) {
    lastSelectorRowId.value = selectedRow.value.id;
  }
}

const loadActivityTree = async (restore = {}) => {
  try {
    const res = await AdminApiActivityPage.getActivityTree({
      ...getMenuIdParam(),
    });
    const treeData = Array.isArray(res?.data?.data) ? res.data.data : [];
    activityTreeData.value = treeData;
    const treeId = resolveSelectorTreeId(treeData, restore.preferredTreeId);
    currentTreeId.value = treeId;
    treeSelectedKeys.value = treeId ? [treeId] : [];
    pageNum.value = restore.preferredPageNum > 0 ? restore.preferredPageNum : 1;
    await getList();
    restoreSelectorRowSelection(restore.preferredRowId);
  } catch (error) {
    activityTreeData.value = [];
    treeSelectedKeys.value = [];
    currentTreeId.value = '';
    formList.value = [];
    total.value = 0;
    message.error('获取活动分类失败');
  }
};

const getList = async () => {
  if (!currentTreeId.value) {
    formList.value = [];
    total.value = 0;
    return;
  }
  const params = {
    pageName: String(searchPageName.value ?? '').trim(),
    pageType: searchPageType.value != null && String(searchPageType.value).trim() !== '' ? String(searchPageType.value) : undefined,
    treeId: currentTreeId.value,
    pageNo: pageNum.value,
    pageSize: pageSize.value,
    ...getMenuIdParam(),
  };
  try {
    loading.value = true;
    const res = await AdminApiActivityPage.getActivityPage(params);
    const pageData = res?.data?.data || {};
    formList.value = Array.isArray(pageData.list) ? pageData.list : [];
    total.value = Number(pageData.total ?? 0);
    deepCope.value = JSON.parse(JSON.stringify(formList.value));
  } catch (error) {
    console.error('获取表单列表失败:', error);
    message.error('获取表单列表失败，请重试');
  } finally {
    loading.value = false;
  }
};

const onSelectionChange = (selectedKeys, selectedRows) => {
  selectedRowKeys.value = selectedKeys;
  if (selectedRows.length > 0) {
    selectedRow.value = selectedRows[0];
    lastSelectorRowId.value = selectedRows[0].id;
  }
};

/** 点击整行时，联动单选框选中效果 */
const customRow = record => {
  return {
    onClick: () => {
      selectedRowKeys.value = [record.id];
      selectedRow.value = record;
      lastSelectorRowId.value = record.id;
    },
  };
};

function getCurrentElementId() {
  const cur = window.bpmnInstances?.bpmnElement || bpmnElement.value || props.elementBusinessObject;
  return cur?.id ? String(cur.id) : '';
}

function getBindingMap() {
  const raw = localStorage.getItem(bindingMapStorageKey());
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function setBindingMap(map) {
  localStorage.setItem(bindingMapStorageKey(), JSON.stringify(map));
}

function getFormKeyBindingMap() {
  const raw = localStorage.getItem(formKeyMapStorageKey());
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function setFormKeyBindingMap(map) {
  localStorage.setItem(formKeyMapStorageKey(), JSON.stringify(map));
}

function syncFieldListFromCurrentElement() {
  fieldListHydrateGeneration += 1;
  const hydrateToken = fieldListHydrateGeneration;
  const cur = props.elementBusinessObject || {};
  const elementId = getCurrentElementId();
  const formKey = getFormKeyFromBusinessObject(cur);

  if (!elementId) {
    fieldList.value = [];
    return;
  }

  const map = getBindingMap();
  const keyMap = getFormKeyBindingMap();

  // 1. 以 XML 中的 formKey（关联活动 id）为准，优先于仅按图形 id 的缓存
  if (formKey) {
    const byFormKey = keyMap[formKey];
    if (byFormKey) {
      fieldList.value = [byFormKey];
      if (String(byFormKey.id) === formKey) {
        map[elementId] = byFormKey;
        setBindingMap(map);
      }
      return;
    }
  }

  // 2. 图形 id 缓存：仅当无 formKey，或与当前 formKey 对应活动 id 一致时采用
  if (map[elementId]) {
    const cached = map[elementId];
    if (!formKey || String(cached.id) === formKey) {
      fieldList.value = [cached];
      return;
    }
  }

  // 3. 兜底：仅存在 formKey 时展示关联（仅有节点名称不算已关联，避免取消关联后误显示空类型行）
  if (formKey) {
    fieldList.value = [
      {
        id: formKey,
        pageName: cur.name || '',
        pageType: getNodePageTypeFromBo(cur) || cur.pageTypeName || '',
      },
    ];
    if (!fieldList.value[0].pageType) {
      void tryHydrateFieldByFormKey(formKey, elementId, hydrateToken);
    }
    return;
  }
  fieldList.value = [];
}

function flattenTreeNodes(nodes, acc = []) {
  if (!Array.isArray(nodes)) return acc;
  nodes.forEach(node => {
    acc.push(node);
    if (Array.isArray(node.children) && node.children.length) {
      flattenTreeNodes(node.children, acc);
    }
  });
  return acc;
}

async function tryHydrateFieldByFormKey(formKey, requestElementId, hydrateToken) {
  if (!formKey) return;
  try {
    const treeRes = await AdminApiActivityPage.getActivityTree({
      ...getMenuIdParam(),
    });
    if (hydrateToken !== fieldListHydrateGeneration || getCurrentElementId() !== requestElementId) {
      return;
    }
    const treeData = Array.isArray(treeRes?.data?.data) ? treeRes.data.data : [];
    const allNodes = flattenTreeNodes(treeData, []);
    for (const node of allNodes) {
      if (hydrateToken !== fieldListHydrateGeneration || getCurrentElementId() !== requestElementId) {
        return;
      }
      const treeId = String(node?.id ?? '').trim();
      if (!treeId) continue;
      const pageRes = await AdminApiActivityPage.getActivityPage({
        pageName: '',
        treeId,
        pageNo: 1,
        pageSize: 200,
        ...getMenuIdParam(),
      });
      if (hydrateToken !== fieldListHydrateGeneration || getCurrentElementId() !== requestElementId) {
        return;
      }
      const list = Array.isArray(pageRes?.data?.data?.list) ? pageRes.data.data.list : [];
      const matched = list.find(item => String(item.id) === String(formKey));
      if (!matched) continue;

      if (hydrateToken !== fieldListHydrateGeneration || getCurrentElementId() !== requestElementId) {
        return;
      }

      fieldList.value = [matched];
      if (requestElementId) {
        const map = getBindingMap();
        map[requestElementId] = matched;
        setBindingMap(map);
      }
      const keyMap = getFormKeyBindingMap();
      keyMap[String(formKey)] = matched;
      setFormKeyBindingMap(keyMap);

      const registryEl = window.bpmnInstances?.elementRegistry?.get(requestElementId);
      if (registryEl && window.bpmnInstances?.modeling && String(registryEl.id) === String(requestElementId)) {
        window.bpmnInstances.modeling.updateProperties(toRaw(registryEl), toRaw({ pageType: matched.pageType }));
      }
      return;
    }
  } catch (error) {
    // 回查失败时保持现有展示，不阻断配置页使用
  }
}

// const customRow = record => {
//   // 单选逻辑
//   if (selectedRowKeys.value.includes(record.id)) {
//     selectedRowKeys.value = [];
//     selectedRow.value = {};
//   } else {
//     selectedRowKeys.value = [record.id];
//     selectedRow.value = record;
//   }
//   localStorage.setItem('selecData', JSON.stringify(selectedRow.value));
//   console.log(JSON.parse(localStorage.getItem('selecData')), '+++-----');
// };

function showSelectorPaginationTotal(totalCount) {
  return `${WeiI18n.t('共').value}${totalCount}${WeiI18n.t('条').value}`;
}

const handleSelectorSearch = () => {
  pageNum.value = 1;
  selectedRowKeys.value = [];
  selectedRow.value = {};
  getList();
};

const onPageSizeChange = (current, size) => {
  pageSize.value = size;
  pageNum.value = 1;
  getList();
};

const onPageChange = (page, pageSize) => {
  pageNum.value = page;
  lastSelectorPageNum.value = page;
  getList();
};

const onTreeSelect = selectedKeys => {
  const selectedId = selectedKeys?.[0] ? String(selectedKeys[0]) : '';
  if (!selectedId) return;
  currentTreeId.value = selectedId;
  treeSelectedKeys.value = [selectedId];
  lastSelectorTreeId.value = selectedId;
  lastSelectorPageNum.value = 1;
  resetSelectorQueryState();
  selectedRowKeys.value = [];
  selectedRow.value = {};
  getList();
};

const confirm = () => {
  if (!selectedRow.value || !selectedRow.value.id) {
    message.warning('请选择表单');
    return;
  }

  fieldList.value = [selectedRow.value];
  const elementId = getCurrentElementId();
  if (elementId) {
    const map = getBindingMap();
    map[elementId] = selectedRow.value;
    setBindingMap(map);
  }
  if (selectedRow.value.id) {
    const formKeyMap = getFormKeyBindingMap();
    formKeyMap[String(selectedRow.value.id)] = selectedRow.value;
    setFormKeyBindingMap(formKeyMap);
  }
  // 更新 BPMN 属性
  const currentElement = window.bpmnInstances?.bpmnElement || bpmnElement.value || props.elementBusinessObject;
  const currentElementId = currentElement?.id ? String(currentElement.id) : '';
  const registryElement = currentElementId ? window.bpmnInstances?.elementRegistry?.get(currentElementId) : null;
  const targetElement = registryElement || currentElement;
  if (window.bpmnInstances?.modeling && targetElement) {
    window.bpmnInstances.modeling.updateProperties(
      toRaw(targetElement),
      toRaw({
        formKey: selectedRow.value.id,
        name: selectedRow.value.pageName,
        pageType: selectedRow.value.pageType,
      }),
    );
    // 某些场景下仅 updateProperties 不会立即刷新节点内文字，补一次 updateLabel 保证画布可见
    window.bpmnInstances.modeling.updateLabel(toRaw(targetElement), String(selectedRow.value.pageName ?? ''));
  }
  //   fieldList.value.map(v => {
  //   // 给xml添加对应的标识
  //   window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), toRaw({ formKey: v.id, name: v.pageName }));
  // });

  // 存储到 Vuex
  // store.dispatch("dict/getPageName", selectedRow.value);

  persistSelectorSession();
  drawer.value = false;
  message.success('表单添加成功');
};

const cancel = () => {
  persistSelectorSession();
  drawer.value = false;
  selectedRowKeys.value = [];
  selectedRow.value = {};
};

/** 取消当前节点与活动的关联 */
const unlinkActivity = record => {
  const elementId = getCurrentElementId();
  const formKey =
    record?.id != null && String(record.id).trim() !== ''
      ? String(record.id)
      : getFormKeyFromBusinessObject(props.elementBusinessObject);

  fieldListHydrateGeneration += 1;
  fieldList.value = [];

  if (elementId) {
    const map = getBindingMap();
    delete map[elementId];
    setBindingMap(map);
  }
  if (formKey) {
    const formKeyMap = getFormKeyBindingMap();
    delete formKeyMap[formKey];
    setFormKeyBindingMap(formKeyMap);
  }

  const currentElement = window.bpmnInstances?.bpmnElement || bpmnElement.value || props.elementBusinessObject;
  const currentElementId = currentElement?.id ? String(currentElement.id) : '';
  const registryElement = currentElementId ? window.bpmnInstances?.elementRegistry?.get(currentElementId) : null;
  const targetElement = registryElement || currentElement;
  if (window.bpmnInstances?.modeling && targetElement) {
    const rawEl = toRaw(targetElement);
    window.bpmnInstances.modeling.updateProperties(
      rawEl,
      toRaw({
        formKey: undefined,
        pageType: undefined,
        name: undefined,
      }),
    );
    // 同步清空画布节点文字（与关联时 updateLabel 对应）
    window.bpmnInstances.modeling.updateLabel(rawEl, '');
  }

  message.success('已取消关联');
};

const cleanUp = () => {
  fieldList.value = [];
};
</script>

<style lang="less" scoped>
.form-content {
  margin: 10px 4px;
  width: 100%;
  box-sizing: border-box;

  .element-property {
    width: 100%;
    .ant-btn {
      margin-bottom: 16px;
    }

    .ant-divider {
      margin: 16px 0;

      .anticon {
        margin-right: 8px;
        color: var(--project-system-primary, var(--ant-primary-color, #124dd6));
      }
    }
  }
}

.selector-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 480px;
  padding: 12px 16px 16px;
  box-sizing: border-box;
}

.selector-drawer__main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
}

.selector-layout__left {
  flex: 0 0 220px;
  width: 220px;
  align-self: stretch;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  padding: 10px 8px;
  overflow: auto;
  background: #fff;
}

.selector-layout__right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.selector-drawer__query {
  flex: 0 0 auto;
  margin-bottom: 12px;
}

.selector-drawer__query-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;

  :deep(.ant-form-item) {
    margin-bottom: 0;
    margin-right: 16px;
  }
}

.selector-drawer__query-btn {
  margin-left: auto;
  margin-right: 0;
}

.selector-drawer__pagination {
  flex: 0 0 auto;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.selector-drawer__footer {
  flex: 0 0 auto;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.form-selector-drawer {
  :deep(.ant-drawer-body) {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 !important;
    overflow: hidden;
  }
}

@selector-table-row-height: 42px;

.selector-activity-table {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  :deep(.ant-spin-nested-loading),
  :deep(.ant-spin-container),
  :deep(.ant-table-wrapper) {
    flex: 1;
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.ant-table) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.ant-table-container) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.ant-table-content) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.ant-table-body) {
    flex: 1;
    min-height: 0;
    overflow: auto !important;
  }

  :deep(.ant-table-thead > tr > th) {
    height: @selector-table-row-height;
    max-height: @selector-table-row-height;
    padding: 0 12px;
    box-sizing: border-box;
    border-right: 1px solid #e8e8e8;
    text-align: center;
    vertical-align: middle;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    line-height: @selector-table-row-height;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-thead > tr > th.ant-table-cell-align-left) {
    text-align: left;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    height: @selector-table-row-height;
    max-height: @selector-table-row-height;
    padding: 0 12px;
    box-sizing: border-box;
    border-right: none !important;
    font-size: 14px;
    line-height: @selector-table-row-height;
    vertical-align: middle;
  }

  :deep(.ant-table-tbody > tr > td.ant-table-cell-align-left) {
    text-align: left;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
    background: #e6f4ff !important;
  }
}

.form-field-table {
  flex: 1;
  min-height: 0;

  :deep(.ant-table-thead > tr > th) {
    height: @selector-table-row-height;
    max-height: @selector-table-row-height;
    padding: 0 12px;
    box-sizing: border-box;
    border-right: 1px solid #e8e8e8;
    text-align: center;
    vertical-align: middle;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    line-height: @selector-table-row-height;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-thead > tr > th.ant-table-cell-align-left) {
    text-align: left;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    height: @selector-table-row-height;
    max-height: @selector-table-row-height;
    padding: 0 12px;
    box-sizing: border-box;
    border-right: none !important;
    font-size: 14px;
    line-height: @selector-table-row-height;
    vertical-align: middle;
  }

  :deep(.ant-table-tbody > tr > td.ant-table-cell-align-left) {
    text-align: left;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
    background: #e6f4ff !important;
  }
}

.exe-config-table {
  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }
}

.form-field-table {
  width: 100%;

  :deep(.ant-table-wrapper),
  :deep(.ant-table),
  :deep(.ant-table-container),
  :deep(.ant-table-content),
  :deep(.ant-table-content > table) {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-table-body) {
    overflow-x: hidden !important;
  }

  :deep(.ant-table-cell-ellipsis) {
    word-break: keep-all;
  }

  :deep(.form-field-unlink) {
    font-size: 14px;
    line-height: 22px;
    color: var(--project-system-primary, var(--ant-primary-color, #124dd6));
    cursor: pointer;

    &:hover {
      color: var(--ant-primary-color-hover, var(--project-system-primary, var(--ant-primary-color, #124dd6)));
      opacity: 0.85;
    }
  }
}
</style>
