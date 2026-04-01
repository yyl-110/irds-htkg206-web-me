<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
export default defineComponent({
  name: "selectBoomTree",
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

    const customFieldNames = ref({
      children: "childrenList",
    });
    const confirmSelectTreeNode = () => {
      isPending.value = true;
      context.emit("confirmSelectTreeNode");
      // 模拟异步操作完成后重置加载状态
      setTimeout(() => {
        isPending.value = false;
      }, 300);
    };

    const cancelSelectTreeNode = () => {
      context.emit("cancelSelectTreeNode");
    };

    const handleSelectTreeNode = (selectedKeys: any[], info: any) => {
      context.emit("handleSelectTreeNode", selectedKeys, info);
    };

    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector(".modal-container");
    }

    return {
      visible,
      isPending,
      customGetContainer,
      confirmSelectTreeNode,
      cancelSelectTreeNode,
      handleSelectTreeNode,
      customFieldNames,
    };
  },
});
</script>

<template>
  <!-- <div class="modal-container" v-dragModal>
          :getContainer="customGetContainer" -->
  <a-modal
    v-model:visible="visible"
    title="选择节点"
    width="450px"
    @ok="confirmSelectTreeNode"
    @cancel="cancelSelectTreeNode"
    style="width: 40%"
    :confirm-loading="isPending"
    :mask-closable="false"
    :zIndex="5000"
  >
    <a-directory-tree
      style="height: calc(100vh - 533px); width: 100%; overflow-y: auto"
      :show-icon="true"
      :tree-data="selectTreeData"
      :field-names="customFieldNames"
      :expand-action="false"
      default-expand-all
      :selected-keys="[selectTreeSelectedKeys]"
      @select="handleSelectTreeNode"
    >
      <template #title="item">
        {{ item.nodeName }}
      </template>
    </a-directory-tree>
    <template #footer>
      <a-button type="primary" @click="confirmSelectTreeNode">
        {{ $t("确定") }}
      </a-button>
      <a-button @click="cancelSelectTreeNode">
        {{ $t("取消") }}
      </a-button>
    </template>
  </a-modal>
  <!-- </div> -->
</template>

<style scoped lang="less"></style>
