<template>
  <div class="form-content">
    <!-- 字段列表 -->
    <div class="element-property list-property">
      <a-button type="primary" size="small" @click="addForm()">
        <template #icon><plus-outlined /></template>
        关联活动
      </a-button>
      <a-divider>
        <template #icon><wallet-outlined /></template>
        表单字段
      </a-divider>

      <a-table v-if="fieldList.length" :data-source="fieldList" size="small" :scroll="{ y: 240 }" bordered :pagination="false">
        <a-table-column key="pageName" title="活动名称" data-index="pageName" align="center" :width="80" :ellipsis="true" />
        <a-table-column key="pageType" title="活动类型" data-index="pageType" align="center" :width="80" :ellipsis="true">
          <template #default="{ record }">
            <span v-if="String(record.pageType) === '1'">{{ $t('设计配置页面') }}</span>
            <span v-else-if="String(record.pageType) === '2'">{{ $t('计算集成页面') }}</span>
            <span v-else-if="String(record.pageType) === '3'">{{ $t('自定义页面') }}</span>
            <span v-else>{{ record.pageType }}</span>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <!-- 添加表单抽屉 -->
    <a-drawer v-model:visible="drawer" title="添加表单" placement="right" width="920">
      <div class="selector-layout">
        <div class="selector-layout__left">
          <div class="selector-layout__title">活动分类</div>
          <a-tree
            v-if="activityTreeData.length"
            block-node
            :tree-data="activityTreeData"
            :field-names="{ title: 'name', key: 'id', children: 'children' }"
            :selectedKeys="treeSelectedKeys"
            :defaultExpandAll="true"
            @select="onTreeSelect" />
          <a-empty v-else description="暂无分类数据" />
        </div>
        <div class="selector-layout__right">
          <a-table
            ref="tableRef"
            :data-source="formList"
            size="small"
            :loading="loading"
            :pagination="false"
            :scroll="{ y: 'calc(85vh - 250px)' }"
            row-key="id"
            :customRow="customRow"
            :row-selection="{
              type: 'radio',
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectionChange,
              columnWidth: 40,
            }">
            <a-table-column key="pageName" title="活动名称" data-index="pageName" align="center" :width="130" :ellipsis="true" />
            <a-table-column key="pageType" title="活动类型" data-index="pageType" align="center" :width="120" :ellipsis="true">
              <template #default="{ record }">
                <span v-if="String(record.pageType) === '1'">{{ $t('设计配置页面') }}</span>
                <span v-else-if="String(record.pageType) === '2'">{{ $t('计算集成页面') }}</span>
                <span v-else-if="String(record.pageType) === '3'">{{ $t('自定义页面') }}</span>
                <span v-else>{{ record.pageType }}</span>
              </template>
            </a-table-column>
            <a-table-column key="treeName" title="所属分类" data-index="treeName" align="center" :width="110" :ellipsis="true" />
            <a-table-column key="groupName" title="组名称" data-index="groupName" align="center" :width="110" :ellipsis="true" />
            <a-table-column key="remark" title="备注" data-index="remark" align="center" :width="140" :ellipsis="true" />
            <a-table-column key="createTime" title="创建时间" data-index="createTime" align="center" :width="120" :ellipsis="true" />
          </a-table>
        </div>
      </div>
      <div class="pagination-wrapper">
        <a-pagination
          size="small"
          :total="total"
          :page-size="pageSize"
          :current="pageNum"
          :page-size-options="['10', '30', '50', '100', '200']"
          :show-total="(total: any) => `${$t('共') + total + $t('条')}`"
          :build-option-text="prop => `${prop.value}${$t('条/页')}`"
          show-size-changer
          show-less-items
          @change="onPageChange"
          @show-size-change="onPageSizeChange" />
      </div>
      <div class="action-buttons">
        <a-button type="primary" @click="confirm">确定</a-button>
        <a-button style="margin-left: 8px" @click="cancel">取消</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, toRaw } from 'vue';
import { PlusOutlined, WalletOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
const props = defineProps({
  elementBusinessObject: {
    type: Object,
    default: () => {},
  },
  currentNode: {
    type: Object,
    default: () => {},
  },
  /** 与流程配置路由上的 taskId 一致，隔离 localStorage 绑定表 */
  taskId: {
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
const deepCope = ref([]);
const arrData = ref([]);
const tableRef = ref();
const FORM_BINDING_MAP_PREFIX = 'activityFormBindingMap';
const FORM_BINDING_BY_FORMKEY_PREFIX = 'activityFormBindingByFormKey';

/** 有 taskId 时分桶，避免不同设计任务里 BPMN 元素 id 撞车；无 taskId 时用历史全局 key 以兼容旧数据 */
function bindingMapStorageKey() {
  const t = props.taskId != null ? String(props.taskId).trim() : '';
  return t ? `${FORM_BINDING_MAP_PREFIX}:${t}` : FORM_BINDING_MAP_PREFIX;
}

function formKeyMapStorageKey() {
  const t = props.taskId != null ? String(props.taskId).trim() : '';
  return t ? `${FORM_BINDING_BY_FORMKEY_PREFIX}:${t}` : FORM_BINDING_BY_FORMKEY_PREFIX;
}

/** 切换节点或重新同步时递增，用于丢弃过期的 tryHydrateFieldByFormKey 异步结果（避免表格显示成其它任务的关联活动） */
let fieldListHydrateGeneration = 0;

// 计算属性
// const flowImg = computed(() => store.getters.flowImg);
// const setName = computed(() => store.getters.setName);
// const nameFlag = computed(() => store.getters.nameFlag);

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
  await loadActivityTree();
  pageNum.value = 1;
  selectedRowKeys.value = [];
  selectedRow.value = {};
  drawer.value = true;
};

function getFirstNodeId(nodes) {
  if (!Array.isArray(nodes) || !nodes.length) return '';
  const first = nodes[0];
  if (!first) return '';
  return String(first.id ?? '');
}

const loadActivityTree = async () => {
  try {
    const res = await AdminApiActivityPage.getActivityTree({});
    const treeData = Array.isArray(res?.data?.data) ? res.data.data : [];
    activityTreeData.value = treeData;
    const firstId = getFirstNodeId(treeData);
    currentTreeId.value = firstId;
    treeSelectedKeys.value = firstId ? [firstId] : [];
    await getList();
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
    pageName: '',
    treeId: currentTreeId.value,
    pageNo: pageNum.value,
    pageSize: pageSize.value,
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
  }
};

/** 点击整行时，联动单选框选中效果 */
const customRow = record => {
  return {
    onClick: () => {
      selectedRowKeys.value = [record.id];
      selectedRow.value = record;
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
  if (!elementId) {
    fieldList.value = [];
    return;
  }
  const map = getBindingMap();
  const keyMap = getFormKeyBindingMap();

  // 1. 以 BPMN/XML 中的 formKey（关联活动主键）为准，优先于仅按元素 id 的缓存（Activity_xxx 在不同流程中易复用导致串数据）
  if (cur.formKey) {
    const byFormKey = keyMap[String(cur.formKey)];
    if (byFormKey) {
      fieldList.value = [byFormKey];
      if (String(byFormKey.id) === String(cur.formKey)) {
        map[elementId] = byFormKey;
        setBindingMap(map);
      }
      return;
    }
  }

  // 2. 元素级缓存：仅在无 formKey，或缓存行的 id 与当前 formKey 一致时使用
  if (map[elementId]) {
    const cached = map[elementId];
    if (!cur.formKey || String(cached.id) === String(cur.formKey)) {
      fieldList.value = [cached];
      return;
    }
  }

  // 3. 兜底：至少把已保存到 bpmn 的字段展示出来，并按 formKey 异步补全 pageType
  if (cur.formKey || cur.name) {
    fieldList.value = [
      {
        id: cur.formKey || '',
        pageName: cur.name || '',
        pageType: cur.pageType || cur.pageTypeName || '',
      },
    ];
    if (!fieldList.value[0].pageType && cur.formKey) {
      void tryHydrateFieldByFormKey(String(cur.formKey), elementId, hydrateToken);
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
    const treeRes = await AdminApiActivityPage.getActivityTree({});
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

const onPageSizeChange = (current, size) => {
  pageSize.value = size;
  pageNum.value = 1;
  getList();
};

const onPageChange = (page, pageSize) => {
  pageNum.value = page;
  getList();
};

const onTreeSelect = selectedKeys => {
  const selectedId = selectedKeys?.[0] ? String(selectedKeys[0]) : '';
  if (!selectedId) return;
  currentTreeId.value = selectedId;
  treeSelectedKeys.value = [selectedId];
  pageNum.value = 1;
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
  if (window.bpmnInstances?.modeling && currentElement) {
    window.bpmnInstances.modeling.updateProperties(
      toRaw(currentElement),
      toRaw({
        formKey: selectedRow.value.id,
        name: selectedRow.value.pageName,
        pageType: selectedRow.value.pageType,
      }),
    );
  }
  //   fieldList.value.map(v => {
  //   // 给xml添加对应的标识
  //   window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), toRaw({ formKey: v.id, name: v.pageName }));
  // });

  // 存储到 Vuex
  // store.dispatch("dict/getPageName", selectedRow.value);

  drawer.value = false;
  message.success('表单添加成功');
};

const cancel = () => {
  drawer.value = false;
  selectedRowKeys.value = [];
  selectedRow.value = {};
};

const cleanUp = () => {
  fieldList.value = [];
};
</script>

<style lang="less" scoped>
.form-content {
  margin: 10px;

  .element-property {
    .ant-btn {
      margin-bottom: 16px;
    }

    .ant-divider {
      margin: 16px 0;

      .anticon {
        margin-right: 8px;
      }
    }
  }
}

.selector-layout {
  display: flex;
  gap: 12px;
  height: calc(100% - 110px);
}

.selector-layout__left {
  width: 240px;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  padding: 10px 8px;
  overflow: auto;
}

.selector-layout__right {
  flex: 1;
  min-width: 0;
}

.selector-layout__title {
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
.action-buttons {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  button {
    min-width: 60px;
  }
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
// Ant Design 表格样式调整
:deep(.ant-table-small) {
  font-size: 12px;

  .ant-table-thead > tr > th {
    background-color: #fafafa;
    padding: 8px 8px;
  }

  .ant-table-tbody > tr > td {
    padding: 8px 8px;
  }
}

:deep(.ant-drawer-body) {
  display: flex;
  flex-direction: column;
  height: 100%;

  .ant-table-wrapper {
    flex: 1;
    margin-bottom: 16px;
  }
}

:deep(.ant-drawer-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px;
  text-align: right;
}
</style>
