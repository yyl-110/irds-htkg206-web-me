<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Modal, Popconfirm, message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { useTreeOperateTooltips } from '@/composables/useTreeOperateTooltips';

const treeOpTip = useTreeOperateTooltips();
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 默认展开的树节点 */
  expandedKeys: {
    require: false,
    type: Array<nodeSource>,
    default: () => {
      return [];
    },
  },
});

const emit = defineEmits<{
  /** 添加、编辑点击确认 */
  submit: [nodelist: Array<nodeSource>, selectedKeys: any];
  /** 点击选择节点按钮触发 */
  selectNode: [selectedKeys: any];

  /** 重新加载结构树 */
  reloadTree: [languageSel: string];

  /** 获取节点修改信息 */
  getNodeUpdateData: [selectedKeys: any];

  /** 获取节点添加信息 */
  getNodeAddData: [selectedKeys: any];

  /** 删除节点 */
  deleteTreeNode: [selectedKeys: any];

  /** 上移节点 */
  upNode: [id: any];

  /** 下移节点 */
  downNode: [id: any];

  /** 获取兄弟节点数组 */
  close: any;

  /** 节点查询 */
  changeSelectKey: [title: any, languageSel: any];

  /** 选择Boom树节点 */
  'select-Boom-Tree': [item: any];
}>();
/** 树节点类型定义,根据实际业务情况进行调整 */
interface nodeSource {
  title: string;
  key: string;
  value: string;
}
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const userStore = useUserStore();
const searchValue = ref<string>('');
const selectedKey = ref<any>();
const selectedKeys = ref<any>([]);
const selectedNode = ref<any>();
const newExpandedKeys = ref<any>([]);
const formRef = ref<any>(null);
/**
 * @param selectedKeys - 选中节点key
 * @param info - 选中节点信息
 * @param info.selected 是否选中
 * @param info.key  节点key
 * @param info.node 选中节点
 * @param info.event   事件
 * @param info.index
 */
function onSelect(
  selectedKeys: any[],
  info: {
    selected: boolean;
    key: string;
    node: any;
    event: Event;
    index: number;
  },
): void {
  selectedKey.value = selectedKeys[0];
  selectedNode.value = info.node;
  emit('selectNode', selectedNode.value);
}

function initMenuState() {
  newExpandedKeys.value = [];
  // 获取初始化选中节点
  if (TreeselectedKeys.value != null) {
    selectedKeys.value = [TreeselectedKeys.value];
    selectedKey.value = TreeselectedKeys.value;
  }
  // 获取初始化展开节点数据
  if (TreeexpandedKeys.value != null) {
    const list = TreeexpandedKeys.value as Array<any>;
    if (list.includes(',')) {
      list
        .toString()
        .split(',')
        .forEach((item: any) => {
          newExpandedKeys.value.push(item);
        });
    } else if (list && !list.includes(',')) {
      newExpandedKeys.value.push(list);
    }
  }
}
const parentNodeTitle = ref('');
// 响应式数据
const dialogVisible = ref(false);
const AddDialogVisible = ref(false);
const loading = ref(false);
const treeData = ref<any>([]);
const coptData = ref<any>();
const TreeselectedKeys = ref<any>();
const TreeexpandedKeys = ref([]);
// 初始化数据方法
const updateMenu = async (type?: any) => {
  dialogVisible.value = true;
  AddDialogVisible.value = false;
  loading.value = true;
  const params: any = {
    userID: userStore.getUser.id,
    userName: userStore.getUser.userName,
    name: 'admin',
    organizationID: '',
  };
  try {
    const res = await AdminApiSystemProduct.browseProductModuleTree(params);
    console.log(res);
    if (res && res.data.code == 200) {
      let data: any = res.data.data;
      treeData.value = [data];
      loading.value = false;
      coptData.value = data;
      TreeselectedKeys.value = data.id;
      TreeexpandedKeys.value = data.id;
      if (type) {
        selectedNode.value = data;
      }
    }
  } catch (error) {
    loading.value = false;
    console.error('Failed to fetch product module tree:', error);
  }
};
const DataTitle = ref('');
const nodeName = ref('');

// 树添加
function addTreedata() {
  if (selectedNode.value.id) {
    parentNodeTitle.value = selectedNode.value.categoryName;
    AddDialogVisible.value = true;
    DataTitle.value = '添加数据';
    nodeName.value = '';
  } else {
    message.warning('请先选择节点！');
  }
  if (selectedNode.value.categoryType == '2') {
    AddDialogVisible.value = false;
    message.warning('请先选择上一级节点添加！');
  } else {
    AddDialogVisible.value = true;
  }
}
// 编辑
function editTree() {
  if (selectedNode.value.id) {
    AddDialogVisible.value = true;
    DataTitle.value = '编辑数据';
    nodeName.value = '';
    if (coptData.value.children && coptData.value.children.length > 0) {
      coptData.value.children.map((v: any) => {
        if (v.id === selectedNode.value.id) {
          parentNodeTitle.value = coptData.value.categoryName;
          nodeName.value = v.categoryName;
        }
      });
      coptData.value.children.map((v: any) => {
        if (v.children && v.children.length > 0) {
          v.children.map((k: any) => {
            if (k.id === selectedNode.value.id) {
              parentNodeTitle.value = v.categoryName;
              nodeName.value = k.categoryName;
            }
          });
        }
      });
    }
  } else {
    message.warning('请先选择节点！');
  }
  if (selectedNode.value.parentId == 0) {
    AddDialogVisible.value = false;
    message.warning('该节点不能被编辑！');
  } else {
    AddDialogVisible.value = true;
  }
}
// 上下移动
function toUpTreeNode() {
  console.log(selectedNode.value, ' selectedNode.value');
  if (selectedNode.value.categoryName === '模块库') {
    return message.warning('此节点不可移动！');
  }
  if (selectedNode.value.id) {
    // 做操作
    const params = {
      id: selectedNode.value.id,
    };
    AdminApiSystemProduct.sortUp(params).then(res => {
      if (res && res.data.code == 200) {
        updateMenu();
      }
    });
  } else {
    message.warning('请先选择节点！');
  }
}
// 上下移动
function toDownTreeNode() {
  if (selectedNode.value.categoryName === '模块库') {
    return message.warning('此节点不可移动！');
  }
  if (selectedNode.value.id) {
    // 做操作
    const params = {
      id: selectedNode.value.id,
    };
    AdminApiSystemProduct.sortDown(params).then(res => {
      if (res && res.data.code == 200) {
        updateMenu();
      }
    });
  } else {
    message.warning('请先选择节点！');
  }
}
// 删除
function delTreedata() {
  if (selectedNode.value.id) {
    // 做操作
    Modal.confirm({
      title: '确认删除此数据?',
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      onOk: async () => {
        const params = {
          userid: userStore.getUser.id,
          id: selectedNode.value.id,
        };
        AdminApiSystemProduct.delTreeNodetoManagement(params).then(res => {
          if (res && res.data.code == 200) {
            updateMenu();
            message.success('删除成功!');
          }
        });
      },
    });
  }
}
// 增加编辑弹窗
function confirm() {
  console.log(selectedNode.value);
  const params = {
    id: DataTitle.value == '添加数据' ? '' : selectedNode.value.id,
    categoryName: nodeName.value,
    categoryType: selectedNode.value?.parentId == 0 ? '1' : '2',
    menuId: selectedNode.value.menuId,
    parentId: DataTitle.value == '添加数据' ? selectedNode.value.id : selectedNode.value.parentId, // 父节点
    allowAuth: 0,
    allowDelete: 0,
    creator: userStore.getUser.id,
  };
  if (DataTitle.value == '添加数据') {
    AdminApiSystemProduct.addEmptyNodetoManagement(params).then(res => {
      if (res && res.data.code == 200) {
        updateMenu();
        AddDialogVisible.value = false;
      }
    });
  } else {
    params.categoryType = selectedNode.value.categoryType;
    AdminApiSystemProduct.updateTreeNodetoManagement(params).then(res => {
      if (res && res.data.code == 200) {
        updateMenu();
        AddDialogVisible.value = false;
      }
    });
  }
}
watch(
  () => TreeselectedKeys.value || TreeexpandedKeys.value,
  () => {
    nextTick(() => {
      initMenuState();
    });
  },
  { immediate: true, deep: true },
);
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.TreeModuleModal');
}
defineExpose({ updateMenu });
</script>

<template>
  <div class="TreeModuleModal" v-dragModal>
    <a-modal title="结构编辑" v-model:visible="visible" width="28%" :getContainer="customGetContainer" :confirm-loading="$isPending()" @cancel="emit('close')">
      <div class="container">
        <div class="controls-wrap">
          <div class="action">
            <div class="icon" style="margin-left: 0" :title="treeOpTip.add" @click="addTreedata">
              <PlusCircleOutlined />
            </div>
            <div class="icon" :title="treeOpTip.edit" @click="editTree">
              <FormOutlined />
            </div>
            <div class="icon" :title="treeOpTip.up" @click="toUpTreeNode">
              <ArrowUpOutlined />
            </div>
            <div class="icon" :title="treeOpTip.down" @click="toDownTreeNode">
              <ArrowDownOutlined />
            </div>
            <div class="icon" :title="treeOpTip.del" @click="delTreedata">
              <DeleteOutlined />
            </div>
          </div>
        </div>
      </div>
      <el-divider class="eldivider" />
      <!-- {{ selectedKeys }}--选中节点 {{ newExpandedKeys }}--展开节点 -->
      <a-spin :spinning="loading" tip="加载中...">
        <div style="height: 400px; overflow-y: auto">
          <a-directory-tree
            v-model:selected-keys="selectedKeys"
            v-model:expanded-keys="newExpandedKeys"
            :show-icon="true"
            default-expand-all
            style="width: 100%; overflow-y: auto; margin-top: 10px"
            :tree-data="treeData"
            :expand-action="false"
            @select="onSelect"
            :field-names="{
              key: 'id',
              title: 'categoryName',
              children: 'children',
            }">
            <template #title="{ categoryName }">
              <span>{{ categoryName }}</span>
            </template>
          </a-directory-tree>
        </div>
      </a-spin>
      <template #footer>
        <a-button type="primary" @click="emit('close')">确定</a-button>
        <a-button @click="emit('close')">取消</a-button>
      </template>
    </a-modal>
  </div>

  <a-modal v-model:visible="AddDialogVisible" :title="DataTitle" width="30%">
    <a-form :label-col="{ style: { width: '100px' } }" label-position="right" label-width="100">
      <a-form-item label="父节点名称">
        <a-input v-model:value="parentNodeTitle" disabled></a-input>
      </a-form-item>
      <a-form-item label="节点名称">
        <a-input v-model:value="nodeName"></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="confirm">确定</a-button>
      <a-button @click="AddDialogVisible = false">取消</a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  // padding: 20px;
}
.controls-wrap {
  .action {
    display: flex;
    align-items: center;
    justify-content: flex-star;
    border-bottom: 0.0625rem solid #f1f1f1;
    padding-bottom: 0.625rem;

    .icon {
      margin-left: 40px;
      font-size: 1.125rem;
      cursor: pointer;
      &:hover {
        color: var(--main-selected);
      }
    }
  }
}
:deep(.ant-tree .ant-tree-title) {
  user-select: text; /* 或者使用 auto，这样用户可以复制文本 */
}
// :deep(.ant-tree-switcher-noop) {
//   display: none;
// }
// :deep(.ant-tree-node-content-wrapper){
//   display: flex
// }
// 控制树节点中图标与倒三角符号的间距
:deep(.ant-tree-iconEle) {
  margin-left: -4px !important; /* 进一步减小图标与倒三角之间的间距 */
  width: 14px; /* 设置固定宽度确保图标大小一致 */
  display: inline-block;
}

// 调整节点内容的布局
:deep(.ant-tree-node-content-wrapper) {
  padding: 2px 6px; /* 调整整个节点内容的内边距 */
  display: flex;
  align-items: center;
}

// 完全重置树节点相关元素的间距
:deep(.ant-tree) {
  .ant-tree-treenode {
    .ant-tree-switcher {
      margin-right: 0 !important; /* 完全移除开关与图标之间的右边距 */
      width: 16px; /* 控制开关宽度 */
      flex-shrink: 0;
    }

    .ant-tree-iconEle {
      margin-left: 0 !important; /* 移除图标左侧边距 */
      margin-right: 4px; /* 仅保留图标与文字之间的间距 */
      width: 14px; /* 设置固定宽度确保图标大小一致 */
      flex-shrink: 0;
    }

    .ant-tree-node-content-wrapper {
      padding: 2px 6px !important; /* 调整整个节点内容的内边距 */
      display: flex;
      align-items: center;
    }
  }
}

// 确保折叠/展开图标区域与节点图标紧密相连
:deep(.ant-tree-switcher-noop) {
  width: 16px; /* 控制空白开关的宽度 */
  margin-right: 0 !important;
}

.operate-tree {
  height: calc(100vh - 213px);
  width: 100%;
  overflow-y: auto;
}
.operate-tree2 {
  height: calc(100vh - 190px);
  width: 100%;
  overflow-y: auto;
}
</style>
