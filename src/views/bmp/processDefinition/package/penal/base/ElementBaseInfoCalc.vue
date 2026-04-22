<template>
  <div class="panel-tab__content">
    <a-form ref="formRef" layout="horizontal" size="small" :model="formState" :label-col="{ style: { width: '80px' } }">
      <a-form-item v-if="false" label="ID">
        <a-input v-model:value="elementBaseInfo.id" :disabled="true" allowClear @change="updateBaseInfo('id')" />
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-input :value="elementTypeText" :disabled="true" />
      </a-form-item>
      <a-form-item :label="nameFieldLabel" name="name">
        <a-input
          :value="nameFieldValue"
          :placeholder="nameFieldPlaceholder"
          :disabled="isProcessNameReadonly"
          @update:value="onNameFieldInput" />
      </a-form-item>

      <!-- 流程的基础属性 -->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <a-form-item v-if="false" label="版本标签">
          <a-input v-model:value="elementBaseInfo.versionTag" allowClear @change="updateBaseInfo('versionTag')" />
        </a-form-item>
        <a-form-item v-if="false" label="可执行">
          <a-switch v-model:checked="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable')" />
        </a-form-item>
      </template>

      <!-- 子流程状态 -->
      <a-form-item v-if="elementBaseInfo.$type === 'bpmn:SubProcess'" label="状态">
        <a-switch v-model:checked="elementBaseInfo.isExpanded" checked-children="展开" un-checked-children="折叠" @change="updateBaseInfo('isExpanded')" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
// Props
const props = defineProps({
  businessObject: Object,
  type: String,
  /** 设计任务「配置」进入时为 1，流程根节点名称只读 */
  flag: {
    type: Number,
    default: 0,
  },
  idEditDisabled: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(['on-click']);

// Refs
const formRef = ref();
const bpmnElement = ref({});
const elementBaseInfo = ref({
  id: '',
  name: '用户任务',
  versionTag: '',
  isExecutable: '',
  isExpanded: '',
});

/** 从任务列表「配置」进入（flag=1）时，流程根节点(Process)名称只读置灰 */
const isProcessNameReadonly = computed(() => Number(props.flag) === 1 && elementBaseInfo.value.$type === 'bpmn:Process');
/** 分解节点（并行网关）名称字段按“参数代号”语义展示 */
const isSplitGateway = computed(() => elementBaseInfo.value.$type === 'bpmn:ParallelGateway');
/** 分解后的连线（顺序流）按“条件”语义展示 */
const isSequenceFlow = computed(() => elementBaseInfo.value.$type === 'bpmn:SequenceFlow');
const elementTypeText = computed(() => String(elementBaseInfo.value.$type ?? props.type ?? '').trim());
const nameFieldLabel = computed(() => {
  if (isSplitGateway.value) return '参数代号';
  if (isSequenceFlow.value) return '条件';
  return '名称';
});
const nameFieldPlaceholder = computed(() => {
  if (isSplitGateway.value) return '配置参数代号';
  if (isSequenceFlow.value) return '配置条件';
  return '请输入名称';
});
const nameFieldValue = computed(() => {
  if (isSplitGateway.value) {
    const paraNo = elementBaseInfo.value?.paraNo;
    if (paraNo != null && String(paraNo).trim() !== '') return String(paraNo);
  }
  if (isSequenceFlow.value) {
    const where = elementBaseInfo.value?.where;
    if (where != null && String(where).trim() !== '') return String(where);
  }
  return String(elementBaseInfo.value?.name ?? '');
});
// Reactive data
const formState = reactive({
  category: '计算工具',
});

const categoryList = ref([{ label: '计算工具', value: '计算工具' }]);

// Computed
const calcRowData = ref();
const pageName = ref();

// Lifecycle hooks
onMounted(() => {
  initFormData();
  formState.category = '计算工具';
  localStorage.setItem('categoryCalc', formState.category);
});

onBeforeUnmount(() => {
  bpmnElement.value = null;
});

// Watchers
watch(
  () => props.businessObject,
  val => {
    if (val) {
      nextTick(() => {
        resetBaseInfo();
      });
      // if (!val.name) {
      //   store.dispatch("dict/setFolwjudge", false);
      // } else {
      //   store.dispatch("dict/setFolwjudge", true);
      // }
    }
  },
  { immediate: true, deep: true },
);

watch(
  () => elementBaseInfo.value,
  val => {
    if (val) {
      localStorage.setItem('categoryName', nameFieldValue.value);
      emit('on-click', val);
    }
  },
  { deep: true },
);
watch(
  () => pageName.value,
  val => {
    if (val) {
      elementBaseInfo.value.name = val;
    }
  },
  { deep: true },
);

// Methods
const initFormData = () => {
  if (calcRowData.value) {
    elementBaseInfo.value.name = calcRowData.value.name || '';
    formState.category = calcRowData.value.category || '计算工具';
    localStorage.setItem('category', formState.category);
  }
};

const resetBaseInfo = () => {
  const instances = window.bpmnInstances;
  bpmnElement.value = instances?.bpmnElement || {};
  if (bpmnElement.value?.businessObject) {
    elementBaseInfo.value = JSON.parse(JSON.stringify(bpmnElement.value.businessObject));
    // 存储流程名称
    if (elementBaseInfo.value.name) {
      // store.dispatch("dict/setFolwName", elementBaseInfo.value.name);
      // store.dispatch("dict/setFolwjudge", true);
    }
    if (elementBaseInfo.value.$type === 'bpmn:UserTask') {
      elementBaseInfo.value.name = elementBaseInfo.value.name;
    }
    if (elementBaseInfo.value.$type === 'bpmn:ParallelGateway') {
      const paraNo = String(elementBaseInfo.value.paraNo ?? '').trim();
      if (!paraNo) {
        elementBaseInfo.value.paraNo = String(elementBaseInfo.value.name ?? '').trim();
      }
    }
    if (elementBaseInfo.value.$type === 'bpmn:SequenceFlow') {
      const where = String(elementBaseInfo.value.where ?? '').trim();
      if (!where) {
        elementBaseInfo.value.where = String(elementBaseInfo.value.name ?? '').trim();
      }
    }
    // 处理子流程状态
    if (elementBaseInfo.value && elementBaseInfo.value.$type === 'bpmn:SubProcess') {
      elementBaseInfo.value['isExpanded'] = elementBaseInfo.value.di?.isExpanded;
    }
  }
};

const onNameFieldInput = value => {
  const text = String(value ?? '');
  if (isSplitGateway.value) {
    elementBaseInfo.value.paraNo = text;
    // 兼容 BPMN 序列化：自定义键 paraNo 同步镜像到 name，确保保存后可回显
    elementBaseInfo.value.name = text;
    window.bpmnInstances.modeling.updateProperties(bpmnElement.value, { paraNo: text, name: text });
    return;
  }
  if (isSequenceFlow.value) {
    elementBaseInfo.value.where = text;
    // 兼容 BPMN 序列化：自定义键 where 同步镜像到 name，确保保存后可回显
    elementBaseInfo.value.name = text;
    window.bpmnInstances.modeling.updateProperties(bpmnElement.value, { where: text, name: text });
    return;
  }
  elementBaseInfo.value.name = text;
  window.bpmnInstances.modeling.updateProperties(bpmnElement.value, { name: text });
};

const updateBaseInfo = key => {
  if (key === 'id') {
    window.bpmnInstances.modeling.updateProperties(bpmnElement.value, {
      id: elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` },
    });
    return;
  }
  if (key === 'isExpanded') {
    window?.bpmnInstances?.modeling.toggleCollapse(bpmnElement.value);
    return;
  }
  const attrObj = Object.create(null);
  attrObj[key] = elementBaseInfo.value[key];
  window.bpmnInstances.modeling.updateProperties(bpmnElement.value, attrObj);
};

const handleCategoryChange = value => {
  formState.category = value;
  localStorage.setItem('categoryCalc', value);
  // store.dispatch("flow/setCalcCategory", value);
};

// 获取流程分类（如果需要）
const getCategory = async () => {
  // 如果需要从API获取分类，可以启用此方法
  // try {
  //   const res = await category()
  //   if (res.data) {
  //     categoryList.value = res.data.map(v => ({
  //       label: `${v.categoryName}-${v.content}`,
  //       value: `${v.categoryName}-${v.content}`
  //     }))
  //   }
  // } catch (error) {
  //   console.error('获取流程分类失败:', error)
  // }
};
</script>

<style lang="less" scoped>
.panel-tab__content {
  padding: 16px;
  :deep(.ant-form-item) {
    margin-bottom: 16px;

    .ant-form-item-label {
      padding: 0;

      label {
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
      }
    }

    .ant-form-item-control {
      .ant-input,
      .ant-select {
        width: 100%;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .panel-tab__content {
    padding: 12px;

    :deep(.ant-form-item) {
      margin-bottom: 12px;
    }
  }
}
</style>
