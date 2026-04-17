<template>
  <div class="content-layout">
    <a-modal :visible="tagDialogVisible" :title="modalType === 2 ? '修改标签' : '添加标签'" :closable="false" centered
      @cancel="closeFun" @ok="submitFun" :ok-text="modalType === 2 ? '确认' : '确认'" :cancel-text="'取消'" :width="650">
      <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="父项名称：">
          <a-input v-model:value="ruleForm.parentName" disabled />
        </a-form-item>

        <a-form-item label="标签名称：" name="labelName">
          <a-input v-model:value="ruleForm.labelName" />
        </a-form-item>
        <!-- <a-form-item label="URL链接：" name="url">
          <a-input v-model:value="ruleForm.url" />
        </a-form-item> -->

        <!-- <a-form-item label="密级">
          <a-select v-model:value="ruleForm.confidentialLevel" placeholder="请选择密级"
            allow-clear>
            <a-select-option :value="0">公开</a-select-option>
            <a-select-option :value="1">内部</a-select-option>
            <a-select-option :value="2">秘密</a-select-option>
            <a-select-option :value="3">机密</a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import { tagSave } from "@/api/knowledge";

const defProps = defineProps({
  dialogTit: String,
});
const emit = defineEmits(["saveSuccess"]);

const tagDialogVisible = ref(false);
const modalType = ref(1);
const nodeData = ref({});
const parentNode = ref({});
const ruleFormRef = ref();
const ruleForm = reactive({
  parentName: "",
  labelName: "",
  level: "",
  region: "",
});

// 注意：Ant Design Vue 的 rules 需配合 a-form-item 的 name 使用
const rules = {
  labelName: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
};

const tagsType = ref("1");

/**
 * 显示标签弹窗
 * @param {Object} node 当前节点
 * @param {Object} parent 父级节点
 * @param {String} modalType 弹窗类型 1 新增 2 修改
 */
const show = (node, parent, type) => {
  nodeData.value = node;
  parentNode.value = parent;
  modalType.value = type;
  tagDialogVisible.value = true;
  ruleForm.parentName = parentNode.value.nodeName;
  if (type === 2) {
    ruleForm.labelName = nodeData.value.partName;
    ruleForm.level = nodeData.value.level;
    ruleForm.region = nodeData.value.selectType;
  }
};

const close = () => {
  tagDialogVisible.value = false;
  ruleForm.parentName = nodeData.value.nodeName;
  ruleForm.labelName = "";
  ruleForm.level = "";
  ruleForm.region = "";
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
    nodeName: ruleForm.labelName,
    parentId: nodeData.value.key,
    categoryId: nodeData.value.categoryId,
    categoryParentId: nodeData.value.categoryParentId,
    id: "",
    level: '',
    tagType: tagsType.value,
    style: "teststyle",
    selectType: ruleForm.region || 0,
    tageLevel: '',
    nodeLevel: nodeData.value.level === 1 ? 2 : 3,
  };
  tagSave(params).then((res) => {
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
    nodeName: ruleForm.labelName,
    parentId: parentNode.value.id,
    categoryId: nodeData.value.categoryId,
    categoryParentId: nodeData.value.categoryParentId,
    id: nodeData.value.key,
    tagType: tagsType.value,
    style: "teststyle",
    selectType: ruleForm.region || 0,
    tageLevel: ruleForm.level,
  };
  tagSave(params).then((res) => {
    if (res && res.data.code === "0") {
      message.success(res.data.msg);
      close()
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