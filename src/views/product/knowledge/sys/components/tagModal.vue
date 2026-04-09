<template>
  <draggable-modal :maskClosable="false" class="labelModal" v-model:visible="tabStatsDialogVisible" :width="600"
    title="标签应用" @cancel="closeTabStatsDialogFun">
    <div class="h-full overflow-y-auto wei-scrollbar">
      <div class="group" v-for="item in labelData" :key="item.nodeName">
        <div class="titleStyle mb-[8px]">
          <div :class="{ fontStyle: item.nodeLevel === '2' }" v-if="item.nodeLevel === '2'">
            {{ item.nodeName }}
          </div>
        </div>

        <a-checkbox-group class="checkGroup"
          v-if="item.children && item.children.length > 0 && item.nodeLevel === '2' && item.selectType === '1'"
          v-model:value="item.checkedValues">
          <a-checkbox class="checkBox" v-for="val in item.children" :key="val.nodeName" :value="val.nodeName">
            {{ val.nodeName }}
          </a-checkbox>
        </a-checkbox-group>

        <a-radio-group class="checkGroup"
          v-if="item.children && item.children.length > 0 && item.nodeLevel === '2' && item.selectType === '0'"
          v-model:value="item.modelVal">
          <a-radio class="checkBox" v-for="val in item.children" :key="val.nodeName" :value="val.nodeName">
            {{ val.nodeName }}
          </a-radio>
        </a-radio-group>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="closeTabStatsDialogFun">确定</a-button>
        <a-button @click="closeTabStatsDialogFun">取消</a-button>
      </span>
    </template>
  </draggable-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getTreeNodeByNodeLevel } from "@/api/knowledge";
import draggableModal from "@/components/DraggableModal/index.vue";

// --- Types (类型定义) ---
interface LabelNode {
  id: string;
  nodeName: string;
}

interface LabelGroup {
  nodeName: string;
  nodeLevel: string;
  selectType: '0' | '1'; // '0': 单选, '1': 多选
  children?: LabelNode[];
  modelVal?: string; // 承载单选选中的值
  checkedValues?: string[]; // 承载多选选中的值
}

const props = withDefaults(defineProps<{
  listData: LabelGroup[];
}>(), {
  listData: () => []
});

// --- Emits (事件抛出) ---
const emits = defineEmits<{
  (e: 'closeModal', selectedNames: string[], selectedIds: string[]): void;
}>();

// --- State (状态声明) ---
const tabStatsDialogVisible = ref<boolean>(false);
const labelData = ref<LabelGroup[]>([]);
const copyData = ref<string[]>([]); // 外部传入的回显选中数据

// --- Methods (业务逻辑) ---

// 获取弹窗列表并处理回显
const processData = async () => {
  try {
    const result: LabelGroup[] = props.listData || [];

    // 处理原始数据，注入用于双向绑定的初始值
    labelData.value = result.map(group => {
      let modelVal = '';
      let checkedValues: string[] = [];

      if (group.children && group.children.length > 0) {
        group.children.forEach(child => {
          // 判断当前 child 是否在回显数据中
          if (copyData.value.includes(child.nodeName)) {
            if (group.selectType === '0') {
              modelVal = child.nodeName;
            } else if (group.selectType === '1') {
              checkedValues.push(child.nodeName);
            }
          }
        });
      }

      return {
        ...group,
        modelVal,
        checkedValues: [...new Set(checkedValues)]
      };
    });

    tabStatsDialogVisible.value = true;
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
};

// 提交并关闭弹窗
const closeTabStatsDialogFun = () => {
  const selectedNames: string[] = [];
  const selectedIds: string[] = [];

  labelData.value.forEach(group => {
    if (!group.children || group.children.length === 0) return;

    // 收集单选结果
    if (group.selectType === '0' && group.modelVal) {
      selectedNames.push(group.modelVal);
      const matchedChild = group.children.find(c => c.nodeName === group.modelVal);
      if (matchedChild) selectedIds.push(matchedChild.id);
    }

    // 收集多选结果
    if (group.selectType === '1' && group.checkedValues && group.checkedValues.length > 0) {
      selectedNames.push(...group.checkedValues);
      group.checkedValues.forEach(name => {
        const matchedChild = group.children!.find(c => c.nodeName === name);
        if (matchedChild) selectedIds.push(matchedChild.id);
      });
    }
  });

  // 去重 (以防万一)
  const uniqueNames = [...new Set(selectedNames)];
  const uniqueIds = [...new Set(selectedIds)];

  tabStatsDialogVisible.value = false;

  // 抛出选择的名字和ID，方便父组件取用
  emits('closeModal', uniqueNames, uniqueIds);
};

// 暴露给父组件的方法
const show = (val: string[]) => {
  copyData.value = Array.isArray(val) ? val : [];
  processData();
};

defineExpose({
  show
});
</script>

<style lang="less">
.labelModal {
  .ant-modal-body {
    padding: 16px !important;

    .group {
      &:not(:first-child) {
        margin-top: 16px;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.checkGroup {
  display: flex;
  flex-wrap: wrap;
}

.checkBox {
  margin-left: 20px;
  width: 120px;
}
</style>