<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed, nextTick } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
export default defineComponent({
  name: 'selectBoomTree',
  props: {
    modalVisible: {
      type: Boolean,
    },
    selectTreeData: {
      type: Array,
    },
    selectTreeSelectedKeys: {
      type: String,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });
    const isPending = ref(false);

    const confirmSelectTreeNode = () => {
      isPending.value = true;
      context.emit('confirmSelectTreeNode');
      // 模拟异步操作完成后重置加载状态
      setTimeout(() => {
        isPending.value = false;
      }, 300);
    };

    const cancelSelectTreeNode = () => {
      context.emit('cancelSelectTreeNode');
    };

    const handleSelectTreeNode = (selectedKeys: any[], info: any) => {
      context.emit('handleSelectTreeNode', selectedKeys, info);
    };

    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container');
    }

    return {
      visible,
      isPending,
      customGetContainer,
      confirmSelectTreeNode,
      cancelSelectTreeNode,
      handleSelectTreeNode,
    };
  },
});
</script>

<template>
  <div class="modal-container" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      v-model:visible="visible"
      title="选择节点"
      width="450px"
      @ok="confirmSelectTreeNode"
      @cancel="cancelSelectTreeNode"
      style="width: 40%"
      :confirm-loading="isPending"
      :mask-closable="false"
      :z-index="2000">
      <a-directory-tree
        style="height: calc(100vh - 533px); width: 100%; overflow-y: auto"
        :show-icon="true"
        :tree-data="selectTreeData"
        :expand-action="false"
        default-expand-all
        :selected-keys="[selectTreeSelectedKeys]"
        @select="handleSelectTreeNode">
        <template #title="item">
          {{ item.partName }}
        </template>
      </a-directory-tree>
      <template #footer>
        <a-button type="primary" @click="confirmSelectTreeNode">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="cancelSelectTreeNode">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.modal-container {
  position: relative;
  z-index: 2000;
}

/deep/ .ant-modal-mask {
  z-index: 1999 !important;
}
</style>
