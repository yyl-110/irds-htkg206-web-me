<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
const props = defineProps({
  treeData: {
    require: false,
    type: Array,
  },
  /** 操作按钮状态 */
  operateFlag: {
    require: false,
    type: Boolean,
    default: true,
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
  currentNodeList: [id: any, type: any];

  /** 节点查询 */
  changeSelectKey: [title: any, languageSel: any];

  /** 选择Boom树节点 */
  'select-Boom-Tree': [item: any];
}>();

const searchValue = ref<string>('');
const languageSel = ref<string>('');
const selectedKey = ref<any>();
const modalVisible = ref<boolean>(false);
const title = ref<string>('');
const selectedKeys = ref<any>([]);
const selectedNode = ref<any>();
const newExpandedKeys = ref<any>([]);
function initMenuState() {
  newExpandedKeys.value = [];
  // 获取初始化选中节点
  if (props.selectedKeys != null) {
    selectedKeys.value = [props.selectedKeys];
    selectedKey.value = props.selectedKeys;
  }
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
// initMenuState()
watch(
  () => props.selectedKeys || props.expandedKeys,
  () => {
    nextTick(() => {
      initMenuState();
    });
  },
  { immediate: true, deep: true }
);

watch(searchValue, value => {
  // 查询条件变更更改结构树
  emit('changeSelectKey', value, languageSel.value);
});

/** 树节点类型定义,根据实际业务情况进行调整 */
interface nodeSource {
  title: string;
  key: string;
  value: string;
}
const pretreatment = ref<any>([]);

/**
 * 修改弹出页面的属性和数据展示
 * @param treeNodeColmoun
 */
function reloadTableStyle(treeNodeColmoun: any, oldFileName: string) {
  pretreatment.value = [...treeNodeColmoun];
  console.log(pretreatment.value, 'pretreatment.value');
  if (title.value == '新增节点') {
    fileList.value = [];
  } else {
    if (oldFileName != null && oldFileName != undefined) {
      fileList.value = [{ name: oldFileName }];
    } else {
      fileList.value = [];
    }
  }
  // 初始化formData，确保表单验证能正确识别初始值
  formData.value = {};
  treeNodeColmoun.forEach((item: any) => {
    formData.value[item.key] = item.value || '';
  });

  modalVisible.value = true;
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
  selectedNode.value = info.node;
  emit('selectNode', selectedNode.value);
}
// 创建一个响应式对象来存储表单数据
const formData = ref<any>({});

/**
 * 接收从index.vue传递过来的选中节点数据
 * @param nodeData 选中的节点数据，包含key、title和fieldKey
 */
function onTreeNodeSelected(nodeData: any) {
  if (nodeData && nodeData.fieldKey) {
    // 根据fieldKey找到对应的表单项并更新其值
    const fieldKey = nodeData.fieldKey;
    if (formData.value.hasOwnProperty(fieldKey)) {
      formData.value[fieldKey] = nodeData.title;
      formData.value['pid'] = nodeData.key;
      console.log(formData.value);
    }
  }
}

const fileList = ref<any>([]);

defineExpose({ reloadTableStyle, onTreeNodeSelected });
</script>

<template>
  <div class="container">
    <div class="controls-wrap">
      <a-input v-model:value="searchValue" style="margin-bottom: 8px" :placeholder="$t('请输入')" allow-clear />
    </div>
    <div>
      <!-- {{ selectedKeys }}--选中节点 {{ newExpandedKeys }}--展开节点 -->
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
          <span :style="{ color: item.flag == 1 ? '#67c23a' : 'rgba(0,0,0,.85)' }">{{ item.partName }}</span>
        </template>
        <template #icon="item">
          <EpcIcon v-if="item.type === 'category' && item.level == '1'" type="icon-zuzhushouce" />
          <EpcIcon v-else-if="item.type === 'category' && item.level == '2'" type="icon-a-xiangmu1" />
          <EpcIcon v-else-if="item.type === 'category' && item.level == '3'" type="icon-chanpinpingtai" />
        </template>
      </a-directory-tree>
    </div>
  </div>
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
</style>
