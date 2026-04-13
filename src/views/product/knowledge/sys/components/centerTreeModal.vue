<template>
  <div class="content-layout">
    <draggable-modal
      :visible="tagDialogVisible"
      :title="modalType === 2 ? '编辑节点' : '添加节点'"
      :closable="false"
      centered
      @cancel="closeFun"
      @ok="submitFun"
      :ok-text="modalType === 2 ? '确认' : '确认'"
      :cancel-text="'取消'"
      :width="550"
    >
      <a-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="父项节点名称：">
          <a-input v-model:value="ruleForm.parentName" disabled />
        </a-form-item>
        <a-form-item label="节点名称：" name="nodeName">
          <a-input
            v-model:value="ruleForm.nodeName"
            placeholder="请输入节点名称"
          />
        </a-form-item>
        <!-- <a-form-item label="URL链接：">
          <a-input v-model:value="ruleForm.url" placeholder="请输入URL链接" />
        </a-form-item> -->
      </a-form>
    </draggable-modal>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import { saveknowledgeTree, tagSave } from "@/api/knowledge";
import draggableModal from "@/components/DraggableModal/index.vue";

const defProps = defineProps({});
const emit = defineEmits(["saveSuccess"]);

const tagDialogVisible = ref(false);
const modalType = ref(1);
const nodeData = ref({});
const parentNode = ref({});
const ruleFormRef = ref();
const ruleForm = reactive({
  parentName: "",
  nodeName: null,
  // url: "",
});

// 注意：Ant Design Vue 的 rules 需配合 a-form-item 的 name 使用
const rules = {
  nodeName: [{ required: true, message: "请输入节点名称", trigger: "blur" }],
};

const tagsType = ref("0");

/**
 * 显示标签弹窗
 * @param {Object} node 当前节点
 * @param {Object} parent 父级节点
 * @param {String} modalType 弹窗类型 1 新增 2 修改
 */
const show = (node, parent, type) => {
  nodeData.value = node;
  modalType.value = type;
  if (type === 2) {
    parentNode.value = parent;
    ruleForm.parentName = parentNode.value.nodeName;
    ruleForm.nodeName = nodeData.value.partName;
  } else {
    ruleForm.parentName = nodeData.value.partName;
  }
  // ruleForm.url = nodeData.value.url;
  tagDialogVisible.value = true;
};

const close = () => {
  tagDialogVisible.value = false;
  ruleForm.parentName = nodeData.value.nodeName;
  ruleForm.nodeName = "";
  // ruleForm.url = "";
};

defineExpose({
  show,
  close,
});

const closeFun = () => {
  // Ant Design Vue 的 form 没有 resetFields，需手动重置或使用 form 实例方法
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
  close();
};

const submitFun = async () => {
  try {
    await ruleFormRef.value.validateFields();
    if (modalType.value === 1) {
      add();
    } else {
      edit();
    }
  } catch (error) {
    console.warn("Validation failed:", error);
  }
};

const add = () => {
  const params = {
    id: "",
    nodeName: ruleForm.nodeName,
    parentId: Number(nodeData.value.key),
    treeType: "1",
    tagType: tagsType.value,
    categoryId: nodeData.value.categoryId,
    categoryParentId: nodeData.value.categoryParentId,
    nodeLevel: Number(nodeData.value.nodeLevel) + 1,
    // url: ruleForm.url,
  };
  saveknowledgeTree(params).then((res) => {
    if (res && res.data.code === "0") {
      close();
      emit("saveSuccess");
    } else {
      message.warning(res.msg);
    }
  });
};

const edit = () => {
  const params = {
    nodeName: ruleForm.nodeName,
    id: nodeData.value.key,
    treeType: "1",
    parentId: parentNode.value.id,
    tagType: tagsType.value,
    categoryId: nodeData.value.categoryId,
    categoryParentId: nodeData.value.categoryParentId,
    nodeLevel: Number(nodeData.value.nodeLevel),
    // url: ruleForm.url,
  };
  saveknowledgeTree(params).then((res) => {
    if (res && res.data.code === "0") {
      message.success(res.data.msg);
      close();
      emit("saveSuccess");
    } else {
      message.warning(res.msg);
    }
  });
};
</script>

<style lang="less" scoped>
.content-layout {
  /* Ant Design Modal 默认居中，宽度已在 props 设置 */
}
</style>