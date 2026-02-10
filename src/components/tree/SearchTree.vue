<script lang="ts" setup>
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { WeiMessage } from '@/utils/WeiMessage';
import { WeiI18n } from '@/utils/WeiI18n';
import TreeNode from '@/components/tree/TreeNode.vue';

const props = defineProps({
  treeData: {
    require: false,
    type: Array,
  },

  /** 添加列 */
  nodeColmoun: {
    require: false,
    type: Array,
    default: () => [],
  },
  /** 默认展开的树节点 */
  expandedKeys: {
    require: false,
    type: Array<nodeSource>,
    default: () => {
      return [];
    },
  },

  /** 是否允许添加根节点 */
  ifAddRoot: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 唯一性标识 */
  sign: {
    require: false,
    type: String,
    default: '',
  },

  selectedKeys: {
    require: false,
    type: String,
    default: '',
  },

  /** bom 类型 */
  bomType: {
    require: false,
    type: String,
    default: '',
  },

  defaultExpandKeys: {
    require: false,
    type: Array,
    default: () => [],
  },
  /** 收藏、加购权限  */
  operateshowFlag: {
    require: false,
    type: Boolean,
    default: true,
  },
  /** 基础机树节点第一条数据key */
  parentNode: {
    require: false,
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  /** 添加、编辑点击确认 */
  submit: [nodelist: Array<nodeSource>, selectedKeys: any];
  /** 点击选择节点按钮触发 */
  selectNode: [selectedKeys: any, nodeSource: any];

  /** 获取节点修改信息 */
  getNodeDetailData: [selectedKeys: any];

  /** 获取节点添加信息 */
  getNodeAddData: [selectedKeys: any];

  /** 删除节点 */
  deleteTreeNode: [selectedKeys: any];

  /** 上移或下移节点 */
  upOrDownNode: [id: any, brotherId: any];

  /** 获取兄弟节点数组 */
  currentNodeList: [id: any, type: any];

  /** 节点查询 */
  changeSelectKey: [title: any, languageSel: any];
}>();

const searchValue = ref<string>('');
const languageSel = ref<string>('');
const selectedKey = ref<string>();
const modalVisible = ref<boolean>(false);
const title = ref<string>('');
const labelCol = ref({ style: { width: '100px' } });
const selectedKeys = ref<any>([]);
const newExpandedKeys = ref<any>([]);
const btnReadOnly = ref<string>('0');
function initMenuState() {
  newExpandedKeys.value = [];
  // 获取初始化展开节点数据
  if (props.expandedKeys != null) {
    const list = props.expandedKeys as Array<any>;
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
watch(
  () => props.selectedKeys,
  () => {
    nextTick(() => {
      // 获取初始化选中节点
      if (props.selectedKeys != null) {
        selectedKeys.value = [props.selectedKeys];
      }
    });
  },
  { immediate: true, deep: true }
);

watch(
  () => props.expandedKeys,
  () => {
    nextTick(() => {
      initMenuState();
    });
  },
  { immediate: true, deep: true }
);

// watch(searchValue, (value) => {
//   // 查询条件变更更改结构树
//   emit('changeSelectKey', value, languageSel.value)
// })

/** 树节点类型定义,根据实际业务情况进行调整 */
interface nodeSource {
  title: string;
  key: string;
  value: string;
}
// const pretreatment = ref<Array<nodeSource>>([])
const pretreatment = ref<any>([]);

/**
 * @description 节点名称编辑取消
 * @param item item 当前点击的节点
 */
function cancleEditNode(item: any) {
  // item.isEditable = false
}

/**
 * @description 节点名称编辑保存
 * @param item item 当前点击的节点
 */
function saveEditNode(item: any) {}

/**
 * @description 树节点进行添加
 */
function addTree() {
  pretreatment.value = [];
  if (checkedNode()) {
    title.value = '添加';
    if (props.treeData?.length === 0) {
      emit('getNodeAddData', '');
    } else {
      emit('getNodeAddData', selectedKey.value);
    }
  }
}

/**
 * @description 树节点进行编辑
 */
function updTree() {
  if (checkedNode()) {
    title.value = '编辑';
    emit('getNodeDetailData', selectedKey.value);
  }
}

/**
 * 修改弹出页面的属性和数据展示
 * @param treeNodeColmoun
 */
function reloadTableStyle(treeNodeColmoun: any) {
  pretreatment.value = [...treeNodeColmoun];
  modalVisible.value = true;
}

/**
 * 判断选中的节点是否有效
 * @returns 返回布尔值，如果选中的节点有效返回true，否则返回false
 */
function checkedNode(): boolean {
  let flag = true;
  if (props.ifAddRoot !== true) {
    if (selectedKey.value === undefined) {
      WeiMessage.warning(WeiI18n.$t('请选择'));
      flag = false;
    }
    //  需要根据实际返回数据进行调整， 这里只是模拟数据 1 为根节点
    if (selectedKey.value === '0') {
      WeiMessage.warning(WeiI18n.$t('请选择根节点'));
      flag = false;
    }
  }
  return flag;
}

/**
 * 树节点进行排序
 *
 * @param type 排序类型，0 表示上移，1 表示下移
 * @param data 当前节点数据
 * @param node 当前节点对象
 * @param brotherNode
 * @param index
 */
function sort(type: any, brotherNode: any[], index: any) {
  if (type === 0) {
    // 上移
    if (index === 0) {
      WeiMessage.warning(WeiI18n.$t('已经是第一条数据！'));
    } else {
      emit('upOrDownNode', brotherNode[index], brotherNode[index - 1]);
    }
  } else if (type === 1) {
    // 下移
    if (index + 1 === brotherNode.length) {
      WeiMessage.warning(WeiI18n.$t('已经是最后一条数据！'));
    } else {
      emit('upOrDownNode', brotherNode[index], brotherNode[index + 1]);
    }
  }
}

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
  }
): void {
  selectedKey.value = selectedKeys[0];
  emit('selectNode', `${selectedKey.value}`, info.node);
}

/**
 * @param treeNode 右键选中的节点
 * @param  menuKey  右键下拉选中的菜单key
 * @description 右键菜单
 */
function onContextMenuClick(treeNode: any, menuKey: string | number) {
  // 选中右击的节点
  switch (menuKey) {
    case '1':
      // 添加
      addTreeNode(treeNode.key);
      break;
    case '2':
      // 编辑
      updTreeNode(treeNode.key);
      break;
    case '3':
      // 删除
      delTreeNode(treeNode.key);
      break;
  }
}

/**
 * 确认点击事件时触发
 * @param treeNode 右键选中的节点
 */
function confirm(treeNode: any) {
  delTreeNode(treeNode.key);
  message.success('操作成功');
}

/**
 * 取消点击事件时触发
 * @param e MouseEvent
 */
function cancel(e: MouseEvent) {
  message.error('取消');
}

/**
 * @param treeKey
 * @description 右键修改树节点
 */
function updTreeNode(treeKey: string) {
  title.value = '编辑';
  emit('getNodeDetailData', treeKey);
}

/**
 * @param treeKey
 * @description 右键删除树节点
 */
function delTreeNode(treeKey: string) {
  // 判断节点是否为叶子节点，只有叶子节点能被删除
  const childNode = findNodeById(props.treeData, treeKey);
  if (childNode.children.length > 0) {
    WeiMessage.warning(WeiI18n.$t('父项节点不允许删除'));
  } else {
    emit('deleteTreeNode', treeKey);
  }
}

/**
 * @param treeKey
 * @description 添加节点
 */
function addTreeNode(treeKey: string) {
  emit('getNodeAddData', treeKey);
}

/**
 * @description 查找节点
 * @param tree 树结构
 * @param targetId  鼠标选中的树节点id
 */
function findNodeById(tree: any, targetId: string): any | null {
  if (tree) {
    for (const node of tree) {
      if (node.key === targetId) {
        return node;
      }
      if (node.children) {
        const childNode = findNodeById(node.children, targetId);
        if (childNode) {
          return childNode;
        }
      }
    }
  }
  return null;
}

function onOk() {
  pretreatment.value;
  modalVisible.value = false;
  emit('submit', pretreatment.value);
}

/**
 * @param innerFlag
 * @description 添加节点
 */
function changeBtnStyle(innerFlag: boolean) {
  if (innerFlag) {
    // 内部节点不可编辑删除
    btnReadOnly.value = '1';
  } else {
    // 外部节点可编辑删除
    btnReadOnly.value = '0';
  }
}
// 搜索树的子节点
function searchSubTree(node: any) {
  const { children } = node;
  if (children && children.length) {
    let hasVisibleChild = false;
    const newChildren = children.filter(child => {
      const { partNumber, partName } = child;
      const showName = partNumber + partName;
      const isVisible = showName.includes(searchValue.value) || searchSubTree(child);
      if (isVisible) hasVisibleChild = true;
      return isVisible;
    });
    if (!hasVisibleChild) return false;
    node.children = newChildren;
  }
  return true;
}

function filterTreeNode(node: any) {
  if (!searchValue.value.trim()) {
    return false;
  }
  // 针对不同的bom类型处理方式不同
  if (props.bomType === 'bom') {
    const { partNumber, partName } = node;
    const showName = partNumber + partName;
    return showName.includes(searchValue.value) || searchSubTree(node);
  }
  return false;
}

function onSearch(value: string) {
  emit('changeSelectKey', value, languageSel.value);
}

defineExpose({ reloadTableStyle, sort, changeBtnStyle });
</script>

<template>
  <div class="container">
    <div class="controls-wrap">
      <!-- 其它树 -->
      <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" :placeholder="$t('请输入')" allow-clear @search="onSearch" />
    </div>
    <div>
      <!-- {{ selectedKeys }}--选中节点
      {{ newExpandedKeys }}--展开节点 -->
      <a-directory-tree
        v-model:selected-keys="selectedKeys"
        v-model:expanded-keys="newExpandedKeys"
        style="height: calc(100vh - 233px); width: 100%; overflow-y: auto"
        :show-icon="true"
        :tree-data="treeData"
        :expand-action="false"
        default-expand-all
        @select="onSelect">
        <template #title="item">
          <!-- 装机bom结构树 -->
          <a-dropdown v-if="bomType === 'unBom'">
            <TreeNode :operateshow-flag="operateshowFlag" :show-name="item.partName" :search-value="searchValue" :node="item" :parent-node="parentNode" />
          </a-dropdown>
          <!-- 零件图册BOM  -->
          <a-dropdown v-else-if="bomType === 'bom'">
            <TreeNode
              :operateshow-flag="operateshowFlag"
              :node="item"
              :parent-node="parentNode"
              :show-name="`${item.partNumber ? item.partNumber : ''} ${item.partName ? item.partName : ''}`"
              :search-value="searchValue" />
            <!-- (${
                  item.version ? item.version : ''
                }) - ${
                  item.effDate ? item.effDate : ''}  -->
          </a-dropdown>
          <a-dropdown v-else>
            <TreeNode :operateshow-flag="operateshowFlag" :node="item" :show-name="item.title" :search-value="searchValue" :parent-node="parentNode" />
          </a-dropdown>
        </template>
        <template v-if="bomType === 'bom'" #icon="item">
          <EpcIcon v-if="item.svgFileId && item.svgFileId !== '-1000'" type="icon-svgtubiao" />
          <EpcIcon v-else-if="item.pvzFileId && item.pvzFileId !== '-1000'" type="icon-tupian" />
          <EpcIcon v-else type="icon-lingjian1" />
        </template>
      </a-directory-tree>
    </div>
  </div>

  <a-modal v-model:visible="modalVisible" style="width: 40%" :title="$t(title)" :confirm-loading="$isPending()" :mask-closable="false" @ok="onOk" @cancel="modalVisible = false">
    <a-form :model="pretreatment" :label-col="labelCol">
      <div v-for="item in pretreatment" :key="item">
        <a-form-item :label="item.title" :name="item.key" :style="item.hidden === true ? 'display:none' : ''">
          <a-input v-model:value="item.value" :placeholder="$t('请输入')" :disabled="item.disabled" />
        </a-form-item>
      </div>
    </a-form>
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
    justify-content: space-between;
    border-bottom: 0.0625rem solid #f1f1f1;
    padding-bottom: 0.625rem;

    .icon {
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
</style>
