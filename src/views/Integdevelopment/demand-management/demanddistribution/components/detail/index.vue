<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import TreeNode from '@/components/tree/TreeNode.vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { AdminApiSystemistribution } from '@/api/tags/demand/管理需求分发';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { sortermethod } from '@/utils/tools';
import { filterTree } from '@/utils/tools';
import { ChangeTreeattribute, getSelectedNodeIds } from '@/utils/tree';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
interface OptionrItem {
  label: string;
  value: string;
}
const searchValue = ref('');
const CustomerNamelist = ref<OptionrItem[]>([
  { label: '产品规划团队', value: 'PRODUCT_PLAN' },
  { label: '技术规划团队', value: 'TECHNICAL_PLAN' },
  { label: '产品立项团队', value: 'PRODUCT_PROJECT' },
  { label: '产品开发团队', value: 'PRODUCT_DEV' },
  { label: 'DFX需求管理团队', value: 'DFX' },
]);
const Customertype = ref('');
const selectedNode = ref<any>();
const selectedKey = ref<any>();
const expandedKeys = ref<any>([]);
const checkedKeys = ref<any>([]);
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  RefreshtableData: any;
}>();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const demandrow = ref<any>({});
const loading = ref<boolean>(false);
const activeKey = ref<string[]>(['1', '2']);
const labelCol = ref({ style: { width: '260px' } });
// 产品平台
const treeData = ref<any>([]);
const temporaryTreeData = ref<any>([]);
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
  selectedNode.value = info.node.children;
}
const fieldNames: TreeProps['fieldNames'] = {
  key: 'nodeId',
};
/** 获取分类数据 */
async function getListData(row: any) {
  selectedKey.value = [];
  try {
    loading.value = true;
    const res = await AdminApiSystemistribution.getAllocateDetail({ basicId: row.basicId });
    let data: any = res.data;
    if (data.code == 200 && data.data.allocateTree && data.data.allocateTree.length > 0) {
      Customertype.value = data.data.type;
      treeData.value = data.data.allocateTree || [];
      temporaryTreeData.value = data.data.allocateTree || [];
      // expandedKeys.value = [];
      // expandedKeys.value.push(treeData.value[0].nodeId);
      checkedKeys.value = getSelectedNodeIds(treeData.value, 'nodeId') || [];
    }
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
}

const handleModalAddOrdetail = async (row: any, type: string) => {
  selectedKey.value = [];
  demandrow.value = row;
  getListData(row);
};

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
watch(searchValue, value => {
  // 查询条件变更更改结构树
  if (value) {
    const condition = (node: any) => node?.nodeName.includes(value);
    treeData.value = filterTree(treeData.value, condition);
  } else {
    treeData.value = temporaryTreeData.value;
  }
});
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.ibution-detail');
}
defineExpose({ handleModalAddOrdetail });
</script>
<template>
  <div class="ibution-detail" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      style="width: 60%"
      v-model:visible="visible"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'分发详情'"
      @cancel="cancel">
      <a-collapse class="custom-collapse form-container" v-model:activeKey="activeKey" :bordered="false">
        <a-collapse-panel key="1" header="需求分发">
          <a-spin :spinning="loading" tip="加载中...">
            <div style="margin: 5px 0 10px 0">
              <a-select disabled style="width: 220px" v-model:value="Customertype">
                <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
              <a-input allowClear v-model:value="searchValue" style="width: 220px; margin-left: 10px; margin-bottom: 8px" placeholder="请输入要检索的内容" />
            </div>
            <!-- v-model:expanded-keys="expandedKeys" -->
            <a-directory-tree
              v-if="treeData.length > 0"
              defaultExpandAll
              v-model:selected-keys="selectedKey"
              v-model:checkedKeys="checkedKeys"
              checkable
              checkStrictly
              :disabled="true"
              :selectable="false"
              :style="{ width: '100%', height: 'auto' }"
              :field-names="fieldNames"
              :show-icon="true"
              :tree-data="treeData"
              :expand-action="false"
              @check="onSelect">
              <template #title="item">
                <a-dropdown>
                  <TreeNode :show-name="$t(item.nodeName)" :search-value="searchValue" :node="item" />
                </a-dropdown>
              </template>
              <template #icon="item">
                <EpcIcon v-if="item.level == '1'" type="icon-wenjianjia" />
                <EpcIcon v-else-if="item.level == '2'" type="icon-wenjianjia" />
                <EpcIcon v-else-if="item.level == '3'" type="icon-a-xiangmu1" />
              </template>
            </a-directory-tree>
          </a-spin>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="分发原则">
          <div style="margin-top: 10px">
            <ul>
              <li>(1) 将技术类需求分发至技术规划团队。</li>
              <li>(2) 将产品类长期需求分发至产品规划团队。</li>
              <li>(3) 将产品类中期需求分发至产品立项团队。</li>
              <li>(4) 将产品类短期需求分发至产品开发团队。</li>
              <li>(5) 将通用需求、适用于多产品的需求，分发至DFX需求管理团队，按DFX管理流程考虑纳入基线库。</li>
            </ul>
          </div>
        </a-collapse-panel>
      </a-collapse>

      <template #footer>
        <a-button @click="cancel()" type="primary">
          <EpcIcon type="icon-quxiao" style="font-size: 15px" />
          关闭</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
@import '../../.././../../../sheets/collapse.less';
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
</style>
