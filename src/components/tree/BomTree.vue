<script setup lang="ts">
import { ref, watch } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import httpRequest from '@/httpRequest';

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
});
const emit = defineEmits(['changeRightPanel']);
onMounted(() => {});

const selectedKeys: any = ref([]);

const genData: any = ref([]);
const searchValue = ref('');
const expandedKeys = ref(['']);
const autoExpandParent = ref(true);
function onExpand(keys: any) {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
}
watch(searchValue, value => {
  expandedKeys.value = [];
  searchValue.value = value;
  autoExpandParent.value = true;
});

const collectNumbers: any = ref([]);

function handleAdd(val: any) {
  // 如果已经收藏，则移除收藏
  if (collectNumbers.value.includes(val)) {
    collectNumbers.value.splice(collectNumbers.value.indexOf(val), 1);
    return;
  }
  collectNumbers.value.push(val);
}
function handleEdit(val: any) {
  message.success('功能开发中...');
}

function selectNode(node: any, e: any) {
  selectedKeys.value = [e.node.partNumber];
  emit('changeRightPanel', e.node);
}
</script>

<template>
  <div class="bom-tree">
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" :placeholder="$t('请输入关键字')" />
    <div class="tree-container">
      <a-tree
        show-icon
        :default-expand-all="true"
        :auto-expand-parent="autoExpandParent"
        :field-names="{
          key: 'partNumber',
          title: 'partName',
          children: 'children',
        }"
        :tree-data="genData"
        :on-expand="onExpand"
        :on-select="selectNode">
        <template #title="{ partNumber, partName, lineNumber }">
          <span v-if="`${partNumber}-${partName}>>>${lineNumber}`.indexOf(searchValue) > -1">
            {{ `${partNumber}-${partName}>>>${lineNumber}`.substring(0, `${partNumber}-${partName}>>>${lineNumber}`.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ `${partNumber}-${partName}>>>${lineNumber}`.substring(`${partNumber}-${partName}>>>${lineNumber}`.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ `${partNumber}-${partName}>>>${lineNumber}` }}</span>
          <span class="tree-node-actions">
            <span class="but_type" size="small" @click.stop="handleAdd(partNumber)">
              <EpcIcon v-if="collectNumbers.indexOf(partNumber) === -1" type="icon-shoucang1" style="font-size: 14px" />
              <EpcIcon v-else type="icon-shoucang" style="font-size: 14px" />
            </span>
            <span class="but_type" size="small" @click.stop="handleEdit(partNumber)">
              <EpcIcon type="icon-gouwuchetianjia" style="font-size: 14px" />
            </span>
          </span>
        </template>
        <template #icon>
          <SettingOutlined />
        </template>
      </a-tree>
    </div>
  </div>
</template>

<style scoped lang="less">
.bom-tree {
  padding: 0 5px;
  height: calc(100vh - 210px);
  .tree-container {
    height: 100%;
    overflow: auto;
  }
}

.but_type {
  color: #1890ff;
  cursor: pointer;
  padding-left: 5px;
  padding-right: 5px;
}
/*修改全局a-tree样式*/
.ant-tree {
  position: relative;
}
.ant-tree > li span.ant-tree-node-content-wrapper::before,
.ant-tree .ant-tree-child-tree > li span.ant-tree-node-content-wrapper::before {
  position: absolute;
  right: 0;
  left: 0;
  height: 24px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  content: '';
}
.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected::before {
  background: rgba(173, 224, 251, 0.4);
}
.ant-tree li .ant-tree-node-content-wrapper:hover {
  background-color: transparent;
  color: #000;
}
.ant-tree li .ant-tree-node-content-wrapper:hover .but_operation {
  opacity: 1;
}
.ant-tree li .ant-tree-node-content-wrapper:hover.ant-tree-node-content-wrapper-normal::before,
.ant-tree li .ant-tree-node-content-wrapper:hover.ant-tree-node-content-wrapper::before {
  background: rgba(173, 224, 251, 0.4);
  color: #000;
}
.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  background: transparent;
}
.ant-tree > li span.ant-tree-node-content-wrapper.ant-tree-node-selected {
  color: #000;
  background: transparent;
}
.ant-tree li span.ant-tree-switcher {
  z-index: 1;
}

:deep(.ant-tree .ant-tree-treenode) {
  width: calc(100% - 20px); // 这里使用响应式会出现滚动条
}
.tree-node-actions {
  float: right;
  margin-right: 10px;
}
</style>
