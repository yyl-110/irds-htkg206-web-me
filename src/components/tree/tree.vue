<script lang="ts" setup>
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { WeiMessage } from '@/utils/WeiMessage';
import { WeiI18n } from '@/utils/WeiI18n';
import TreeNode from '@/components/tree/TreeNode.vue';
import { Uploado_draggerFile } from '@/components/UploadFile';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import { WeiIcon } from '@/wei-components';
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
  selectBoomTree: [item: any];

  /** 选择Boom树节点 */
  selectBoomTree1: [item: any];
  /** 浏览人员*/
  Personnelselection: [item: any];
}>();

const searchValue = ref<string>('');
const languageSel = ref<string>('');
const selectedKey = ref<any>();
const modalVisible = ref<boolean>(false);
const title = ref<string>('');
const labelCol = ref({ style: { width: '100px' } });
const selectedKeys = ref<any>([]);
const selectedNode = ref<any>();
const newExpandedKeys = ref<any>([]);
const btnReadOnly = ref<string>('0');
const formRef = ref<any>(null);
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
  { immediate: true, deep: true },
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
// 当通过“构型编码”浏览并选择节点时，编辑（更新）接口不应传 parentId
const skipParentOnEdit = ref<boolean>(false);

/**
 * @description 树节点进行添加
 */
function addTree() {
  pretreatment.value = [];
  if (checkedNode()) {
    title.value = '新增节点';
    if (props.treeData?.length === 0) {
      emit('getNodeAddData', '');
    } else {
      emit('getNodeAddData', selectedNode.value);
    }
  }
}

function updTree() {
  pretreatment.value = [];
  if (checkedNode()) {
    title.value = '编辑节点';
    if (props.treeData?.length === 0) {
      emit('getNodeUpdateData', '');
    } else {
      emit('getNodeUpdateData', selectedNode.value);
    }
  }
}

/**
 * 修改弹出页面的属性和数据展示
 * @param treeNodeColmoun
 */
function reloadTableStyle(treeNodeColmoun: any, oldFileName: string) {
  pretreatment.value = [...treeNodeColmoun];
  // 重置构型编码选择标志
  skipParentOnEdit.value = false;
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
    debugger;
    formData.value[item.key] = item.value || '';
  });
  console.log(formData.value);
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
 * @description 树节点进行排序 向上
 */
function toUpTreeNode() {
  emit('upNode', selectedNode.value);
}

/**
 * @description 树节点进行排序 向下
 */
function toDownTreeNode() {
  emit('downNode', selectedNode.value);
}

/**
 * @description 树节点进行删除
 */
function delTree() {
  if (checkedNode()) {
    emit('deleteTreeNode', selectedNode.value);
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
  },
): void {
  selectedKey.value = selectedKeys[0];
  selectedNode.value = info.node;
  emit('selectNode', selectedNode.value);
}

/**
 * 取消点击事件时触发
 * @param e MouseEvent
 */
function cancel(e: MouseEvent) {
  message.error('取消删除');
}

// 创建一个响应式对象来存储表单数据
const formData = ref<any>({});

function onOk() {
  // 调用表单验证方法
  formRef.value
    .validate()
    .then(() => {
      // 验证通过，处理提交逻辑
      if (selectedNode.value == undefined) {
        selectedNode.value = props.treeData[0];
      }
      if (title.value == '新增节点') {
        formData.value.parentId = selectedNode.value.key;
        formData.value.level = selectedNode.value.level;
        if (fileList.value.length > 0) {
          formData.value.fileId = fileList.value[0].id;
          formData.value.fileUrl = fileList.value[0].fileUrl;
        } else {
          formData.value.fileId = '';
          formData.value.fileUrl = '';
        }
        // 关闭弹窗并提交数据
        modalVisible.value = false;
        emit('submit', formData.value);
      } else {
        console.log(formData.value);
        formData.value.id = selectedNode.value.key;
        formData.value.level = selectedNode.value.level;
        if (fileList.value.length > 0) {
          if (fileList.value[0].id != undefined) {
            formData.value.fileId = fileList.value[0].id;
          }
          if (fileList.value[0].fileUrl != undefined) {
            formData.value.fileUrl = fileList.value[0].fileUrl;
          }
        }
        // 如果通过构型编码选择了节点，更新接口不应传 parentId/pid，先移除再提交
        if (skipParentOnEdit.value) {
          try {
            delete formData.value.parentId;
            delete formData.value.pid;
          } catch (e) {
            // ignore
          }
          skipParentOnEdit.value = false;
        }
        // 关闭弹窗并提交数据
        modalVisible.value = false;
        emit('edit', formData.value);
      }
    })
    .catch(errorInfo => {
      // 验证失败
      console.log('验证失败', errorInfo);
    });
}

/**
 * 处理浏览按钮点击事件
 * @param item 当前表单项
 */
function browseItem(item: any) {
  emit('selectBoomTree', item);
}
/**
 * 处理浏览按钮点击事件
 * @param item 当前表单项
 */
function browseItem1(item: any) {
  debugger;
  emit('selectBoomTree1', item);
}
function Browsemembers(item: any) {
  emit('Personnelselection', item);
}

/**
 * 接收从index.vue传递过来的选中节点数据
 * @param nodeData 选中的节点数据，包含key、title和fieldKey
 */
function onTreeNodeSelected(nodeData: any) {
  if (nodeData && nodeData.fieldKey) {
    // 根据fieldKey找到对应的表单项并更新其值
    const fieldKey = nodeData.fieldKey;
    // 调试日志：打印传入数据和当前表单值
    // eslint-disable-next-line no-console
    console.log('onTreeNodeSelected called', { nodeData, before: formData.value[fieldKey] });
    if (formData.value.hasOwnProperty(fieldKey)) {
      // 显示：选择树中展示的是 partName(techid)
      // 回显/保存：将实际值设为 techid（若存在），便于提交使用；同时保留 display 字段
      if (nodeData.techid !== undefined && nodeData.techid !== '') {
        formData.value[fieldKey] = nodeData.techid; // 把 gxbm 字段设置为 techid
        formData.value[`${fieldKey}_display`] = nodeData.title; // 保留用于显示的文本
        formData.value[`${fieldKey}_techid`] = nodeData.techid; // 兼容旧字段名
      } else {
        formData.value[fieldKey] = nodeData.title;
      }
      if (nodeData.categoryType !== undefined && nodeData.categoryType !== '') {
        formData.value['categoryType'] = nodeData.categoryType;
      }
      formData.value['pid'] = nodeData.key;
      // 如果该 fieldKey 对应的表单项标题为 '构型编码'，标记在更新时跳过 parentId/pid 字段
      try {
        const fieldItem = pretreatment.value.find((i: any) => i.key === fieldKey);
        skipParentOnEdit.value = !!(fieldItem && fieldItem.title === '构型编码');
      } catch (e) {
        skipParentOnEdit.value = false;
      }
      // 调试日志：打印设置后的值
      // eslint-disable-next-line no-console
      console.log('onTreeNodeSelected applied', { after: formData.value[fieldKey], display: formData.value[`${fieldKey}_display`], techid: formData.value[`${fieldKey}_techid`] });
    }
  }
}

/**
 * @description 切换国际化语言，重新加载结构树
 */
function changeLanguage() {
  emit('reloadTree', languageSel.value);
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

const fileList = ref<any>([]);
const userStore = useUserStore();
async function customRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
      securityLevel: 1,
    });
    if (res.data.code === 0) {
      const file: any = { ...res.data, name: res.data?.oldFileName };
      fileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

function filechange(file: any) {
  fileList.value[0] = file;
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

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.treeModal');
}
function DisplayPersonnel(key: string, names: any, ids: string) {
  if (key == 'managerIdsname') {
    formData.value.managerIds = ids;
  }
  formData.value[key] = names;
}
function initializationassignment(node: any) {
  selectedNode.value = node;
}
function getExpandedKeys () {
  return newExpandedKeys.value
}
defineExpose({
  reloadTableStyle,
  changeBtnStyle,
  onTreeNodeSelected,
  DisplayPersonnel,
  initializationassignment,
  getExpandedKeys
});
</script>

<template>
  <div class="container">
    <div class="controls-wrap">
      <a-input v-model:value="searchValue" style="margin-bottom: 8px" :placeholder="$t('请输入')" allow-clear />
      <div v-if="props.operateFlag" class="action">
        <div class="icon" @click="addTree">
          <PlusCircleOutlined />
        </div>

        <div v-if="btnReadOnly === '1'" class="icon">
          <FormOutlined style="color: #dededf" />
        </div>
        <div v-else class="icon" @click="updTree">
          <FormOutlined />
        </div>

        <div class="icon" @click="toUpTreeNode">
          <ArrowUpOutlined />
        </div>

        <div class="icon" @click="toDownTreeNode">
          <ArrowDownOutlined />
        </div>
        <div v-if="btnReadOnly === '1'" class="icon">
          <DeleteOutlined style="color: #dededf" />
        </div>
        <div v-else class="icon">
          <a-popconfirm :title="WeiI18n.t('是否确认删除').value" :ok-text="WeiI18n.t('确定').value" :cancel-text="WeiI18n.t('取消').value" @confirm="delTree" @cancel="cancel">
            <DeleteOutlined />
          </a-popconfirm>
        </div>
      </div>
    </div>
    <div class="mt-[10px]">
      <!-- {{ selectedKeys }}--选中节点 {{ newExpandedKeys }}--展开节点 -->
      <a-directory-tree
        v-model:selected-keys="selectedKeys"
        v-model:expanded-keys="newExpandedKeys"
        :style="{
          width: '100%',
          overflowY: 'auto',
          height: operateFlag ? 'calc(100vh - 213px)' : 'calc(100vh - 200px)',
        }"
        :show-icon="true"
        :tree-data="treeData"
        show-line
        :expand-action="false"
        default-expand-all
        @select="onSelect">
        <template #title="item">
          <a-dropdown v-if="bomType === 'unBom'">
            <TreeNode
              :show-name="`${item.partName} (${item.moduleCount})`"
              :search-value="searchValue"
              :node="item"
              v-if="item.moduleCount != undefined && item.moduleCount != 0" />
            <TreeNode :show-name="$t(item.partName)" :search-value="searchValue" :node="item" v-else />
          </a-dropdown>
          <a-dropdown v-else>
            <TreeNode :node="item" :show-name="$t(item.title)" :search-value="searchValue" />
          </a-dropdown>
        </template>
        <template #icon="item">
          <WeiIcon icon="icon-project" :size="16" v-if="(item.type === 'category' && item.level == '1') || (item.categoryType == 1 && item.type === 'category')" />
          <WeiIcon icon="icon-wjj" :size="16" v-else-if="item.type === 'category' && item.level == '2'" />
          <WeiIcon icon="icon-wj" :size="16" v-else-if="item.type === 'category' && item.level == '3'" />
          <WeiIcon icon="icon-wjj" :size="16" v-else-if="item.type === 'param' && item.categoryType == 0" />
          <WeiIcon icon="icon-wjj" :size="16" v-else-if="item.type === 'param' && item.level == '2'" />
          <WeiIcon icon="icon-wj" :size="16" v-else-if="item.type === 'param' && item.level == '3'"/>
          <!-- <EpcIcon v-if="(item.type === 'category' && item.level == '1') || (item.categoryType == 1 && item.type === 'category')" type="icon-wenjianjia" />
           <EpcIcon v-else-if="item.type === 'category' && item.level == '2'" type="icon-wenjianjia" />
           <EpcIcon v-else-if="item.type === 'category' && item.level == '3'" type="icon-a-xiangmu1" />
           <EpcIcon v-else-if="item.type === 'param' && item.categoryType == 0" type="icon-wenjianjia" />
           <EpcIcon v-else-if="item.type === 'param' && item.level == '2'" type="icon-wenjianjia" />
          <EpcIcon v-else-if="item.type === 'param' && item.level == '3'" type="icon-a-xiangmu1" /> -->
        </template>
      </a-directory-tree>
    </div>
  </div>
  <div class="treeModal" v-dragModal>
    <a-modal
      v-model:visible="modalVisible"
      :getContainer="customGetContainer"
      style="width: 50%"
      :title="$t(title)"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="onOk"
      @cancel="modalVisible = false">
      <!-- 自定义footer，设置按钮文本为中文 -->
      <a-form ref="formRef" :model="formData" :label-col="labelCol">
        <div v-for="item in pretreatment" :key="item.key">
          <!-- 注意这里应该用item.key作为key -->
          <a-form-item :label="item.title" :name="item.key" :rules="item.rules" :style="item.hidden === true ? 'display:none' : ''">
            <!-- 根据字段类型渲染不同的表单控件 -->
            <div v-if="item.type === 'select'" style="display: flex; align-items: center; gap: 8px">
              <a-select v-model:value="formData[item.key]" :disabled="item.disabled" style="flex: 1" :placeholder="item.placeholder || '请选择'">
                <a-select-option v-for="option in item.selectStr" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </div>
            <div v-else-if="item.type === 'input'" style="display: flex; align-items: center; gap: 8px">
              <a-input v-model:value="formData[item.key]" :placeholder="$t('请输入...')" :disabled="item.disabled" style="flex: 1" />
              <a-button v-if="['父节点名称'].includes(item.title)" type="primary" style="font-size: 12px" @click="browseItem(item)">
                <EpcIcon type="icon-liulan" style="font-size: 14px" />
                浏览
              </a-button>
            </div>
            <a-textarea v-else-if="item.type === 'textarea'" v-model:value="formData[item.key]" :placeholder="$t('请输入...')" :disabled="item.disabled" show-word-limit />
            <!-- 添加上传示意图区域 -->
            <div v-if="item.type === 'upload'" class="upload-area">
              <Uploado_draggerFile width="100%" :file-list="fileList" @change="filechange" @custom-request="customRequest" />
            </div>
          </a-form-item>
        </div>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="onOk">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="modalVisible = false">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
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
    padding: 0 10px;
    padding-bottom: 10px;

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
  display: inline-flex !important;
  align-items: center;
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
      color: unset;
      display: flex;
      align-items: center;
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
  display: none!important;
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
