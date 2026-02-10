<template>
  <a-modal
    v-model:visible="visible"
    :width="modalWidth"
    z-index="2000"
    :mask-closable="false"
    :footer="false"
    :title="'成员授权'"
    :confirm-loading="$isPending()"
    @cancel="handleCancel">
    <!--  Transfer 组件 -->
    <a-spin :spinning="leftLoading" tip="加载中...">
      <div class="transfer-container">
        <a-transfer
          :locale="locale"
          :target-keys="targetKeys"
          :data-source="dataSource"
          :titles="['未授权用户', '已授权用户']"
          :render="renderItem"
          :row-key="item => item.id"
          show-search
          style="width: 100%"
          :search-placeholder="'请输入'"
          :filter-option="filterOption"
          :pagination="{ pageSize: 20 }"
          :list-style="{ width: '50%', height: '500px' }"
          @change="handleChange"
          @select-change="handleSelectChange">
        </a-transfer>
      </div>
    </a-spin>

    <!-- 底部按钮 -->
    <div class="modal-footer">
      <a-button type="primary" @click="handleConfirm" :loading="leftLoading">
        {{ '确定' }}
      </a-button>
      <a-button @click="handleCancel">{{ '取消' }}</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { message } from 'ant-design-vue';
// 1. 定义 Props
const props = defineProps<{
  modalVisible: boolean;
  dataSource: Array<{ id: string | number; nickname: string; username: string }>; // 源数据
  targetKeys: Array<string | number>; // 已选目标键
  leftLoading?: boolean; // 左侧列表加载状态
  modalWidth?: number | string; // 弹窗宽度
  Singlechoice: boolean;
}>();
const locale = {
  itemUnit: '项',
  itemsUnit: '项',
  notFoundContent: '列表为空',
  searchPlaceholder: '请输入搜索内容',
};
const selectedKey = ref([]);
// 2. 定义 Emits
const emit = defineEmits<{
  (e: 'Cancel', value: boolean): void;
  (e: 'confirm', targetKeys: Array<string | number>): void;
  (e: 'change', targetKeys: Array<string | number>, direction: 'left' | 'right', moveKeys: Array<string | number>): void;
  (e: 'select-change', sourceSelectedKeys: Array<string | number>, targetSelectedKeys: Array<string | number>): void;
}>();

/** 弹窗状态 */
const visible = computed(() => {
  // 需要调用初始化接口
  return props.modalVisible;
});
interface MockData {
  key: string;
  title: string;
  username: string;
  nickname: string;
  chosen: boolean;
}
// 5. Transfer 核心方法
const renderItem = (item: { nickname: string; username: string }) => {
  return `${item.nickname} （${item.username}）`; // 渲染选项文本
};

const filterOption = (inputValue: string, option: any) => {
  console.log(option, option);

  // 搜索过滤逻辑：匹配昵称或用户名
  let arr = option.nickname + option.username;
  return arr.indexOf(inputValue) > -1;
};

// 6. 事件处理
const handleCancel = () => {
  emit('Cancel', false); // 关闭弹窗
};

const handleConfirm = () => {
  emit('confirm', props.targetKeys); // 触发确认事件，传递已选目标键
};

const handleChange = (targetKeys: Array<string | number>, direction: 'left' | 'right', moveKeys: Array<string | number>) => {
  if (targetKeys.length > 1 && props.Singlechoice) {
    selectedKey.value = [targetKeys[targetKeys.length - 1]];
    emit('change', selectedKey.value, direction, moveKeys);
  } else {
    emit('change', targetKeys, direction, moveKeys);
  }
};

const handleSelectChange = (sourceSelectedKeys: Array<string | number>, targetSelectedKeys: Array<string | number>) => {
  emit('select-change', sourceSelectedKeys, targetSelectedKeys); // 同步选中状态变化
};
</script>

<style scoped>
.transfer-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 调整按钮间距 */
.modal-footer :deep(.ant-btn) {
  margin-left: 8px;
}
</style>
