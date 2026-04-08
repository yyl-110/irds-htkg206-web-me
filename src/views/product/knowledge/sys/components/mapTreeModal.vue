<template>
  <div class="content-layout">
    <draggable-modal :visible="tagDialogVisible" :title="modalType === 2 ? '编辑节点' : '添加节点'" :closable="false" centered
      @cancel="closeFun" @ok="submitFun" :ok-text="modalType === 2 ? '确认' : '确认'" :cancel-text="'取消'"
      :width="modalType === 2 ? 1000 : 550">
      <a-row>
        <a-col :span="modalType === 2 ? 10 : 24">
          <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }">
            <a-form-item label="父项名称：">
              <a-input v-model:value="ruleForm.titleMap" disabled />
            </a-form-item>
            <a-form-item label="节点名称：" name="nodeName">
              <a-input v-model:value="ruleForm.nodeName" placeholder="请输入节点名称" />
            </a-form-item>
            <a-form-item label="风格样式" v-if="showStyle">
              <a-select v-model:value="ruleForm.styleMap" placeholder="请选择风格样式" allow-clear>
                <a-select-option :value="item.value" v-for="item in tagList" :key="item.id">{{ item.name
                  }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="标签类型" v-if="modalType === 2">
              <a-select v-model:value="ruleForm.labelType" placeholder="请选择类型" allow-clear>
                <a-select-option value="标签分类">标签分类</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col v-if="modalType === 2" :span="14" class="h-[460px] flex items-center justify-center">
          <img class="image w-full" v-if="ruleForm.styleMap === '1'" src="@/assets/images/style1.png" alt="" />
          <img class="image w-full" v-if="ruleForm.styleMap === '2'"  src="@/assets/images/style2.png" alt="" />
          <img class="image w-full" v-if="ruleForm.styleMap === '3'"  src="@/assets/images/style3.png" alt="" />
        </a-col>
      </a-row>
    </draggable-modal>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import { saveknowledgeTree, tagSave } from "@/api/knowledge";
import draggableModal from "@/components/DraggableModal/index.vue";

const defProps = defineProps({
  dialogTit: String,
  tagList: Array,
});
const emit = defineEmits(["saveSuccess"]);

const tagDialogVisible = ref(false);
const modalType = ref(1);
const nodeData = ref({});
const parentNode = ref({});
const ruleFormRef = ref();
const ruleForm = reactive({
  titleMap: "",
  nodeName: null,
  styleMap: null,
  labelType: null,
});

// 注意：Ant Design Vue 的 rules 需配合 a-form-item 的 name 使用
const rules = {
  // labelName: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
};

const tagsType = ref("0");

const showStyle = computed(() => (modalType.value === 1 && nodeData.value.level === 1) || (modalType.value === 2 && nodeData.value.level === 2))
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
    ruleForm.titleMap = parentNode.value.nodeName;
    ruleForm.nodeName = nodeData.value.partName;
    ruleForm.styleMap = defProps.tagList.find(item => item.value === nodeData.value.style)?.value;
    ruleForm.labelType = '标签分类';
  } else {
    ruleForm.titleMap = nodeData.value.partName;
  }
  tagDialogVisible.value = true;
};

const close = () => {
  tagDialogVisible.value = false;
  ruleForm.titleMap = nodeData.value.nodeName;
  ruleForm.nodeName = ''
  ruleForm.styleMap = ''
  ruleForm.labelType = ''
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
    id: '',
    nodeName: ruleForm.nodeName,
    parentId: Number(nodeData.value.key),
    treeType: '2',
    style: ruleForm.styleMap,
    tagType: tagsType.value,
    // tagType: ruleForm.value.labelType === '标签分类' ? '0' : '1',
    categoryId: nodeData.value.categoryId,
    categoryParentId: nodeData.value.categoryParentId,
    nodeLevel: Number(nodeData.value.nodeLevel) + 1,
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
    treeType: '2',
    parentId: parentNode.value.id,
    style: ruleForm.styleMap,
    tagType: tagsType.value,
    // tagType: ruleForm.value.labelType === '标签分类' ? '0' : '1',
    categoryId: nodeData.value.categoryId,
    categoryParentId: nodeData.value.categoryParentId,
    nodeLevel: Number(nodeData.value.nodeLevel),
  };
  saveknowledgeTree(params).then((res) => {
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