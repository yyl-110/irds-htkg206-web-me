<template>
  <div class="process-panel__container" :style="{ width: `${width}px` }">
    <a-collapse class="custom-collapse" v-model:activeKey="activeTab" :bordered="false" style="margin-top: 10px">
      <a-collapse-panel key="base">
        <template #header>
          <div class="panel-tab__title">
            <info-circle-outlined />
            常规
          </div>
        </template>
        <ElementBaseInfoCalc :id-edit-disabled="idEditDisabled" :flag="flag" :business-object="elementBusinessObject" :type="elementType" @on-click="getType" />
      </a-collapse-panel>
      <a-collapse-panel v-if="formVisible && flag == 1 && obj.$type !== 'bpmn:StartEvent'" key="form">
        <template #header>
          <div class="panel-tab__title">
            <form-outlined />
            表单
          </div>
        </template>
        <ElementForm :id="elementId" :type="elementType" :task-id="taskId" :menu-id="menuId" :elementBusinessObject="elementBusinessObject" :currentNode="currentNode" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, provide } from 'vue';
import { InfoCircleOutlined, FormOutlined } from '@ant-design/icons-vue';

// 导入所有组件 - 注意组件名统一使用 PascalCase
import ElementBaseInfoCalc from './base/ElementBaseInfoCalc.vue';
import ElementForm from './form/ElementForm.vue';
import Log from '../Log';

// Props
const props = defineProps({
  bpmnModeler: Object,
  prefix: {
    type: String,
    default: 'camunda',
  },
  width: {
    type: Number,
    default: 400,
  },
  idEditDisabled: {
    type: Boolean,
    default: false,
  },
  flag: {
    type: Number,
    default: 0,
  },
  currentNode: {
    type: Object,
    default: () => {},
  },
  /** 设计任务 id，用于隔离「活动关联」本地缓存，避免不同流程里 BPMN 元素 id（如 Activity_1）复用导致串数据 */
  taskId: {
    type: [String, Number],
    default: '',
  },
  menuId: {
    type: [String, Number],
    default: '',
  },
});

// Emits
const emit = defineEmits(['on-click']);

// Reactive data
const activeTab = ref(['base', 'form']);
const elementId = ref('');
const elementType = ref('');
const elementBusinessObject = ref({});
const conditionFormVisible = ref(false);
const formVisible = ref(false);
const obj = ref({});
let timer = null;

// Provide for child components
provide('prefix', props.prefix);
provide('width', props.width);

// Watchers
watch(elementId, () => {
  activeTab.value = ['base', 'form'];
});

// Lifecycle hooks
onMounted(() => {
  initModels();
});

onBeforeUnmount(() => {
  window.bpmnInstances = null;
  if (timer) clearTimeout(timer);
});

// Methods
const initModels = () => {
  if (!props.bpmnModeler) {
    timer = setTimeout(() => initModels(), 10);
    return;
  }

  window.bpmnInstances = {
    modeler: props.bpmnModeler,
    modeling: props.bpmnModeler.get('modeling'),
    moddle: props.bpmnModeler.get('moddle'),
    eventBus: props.bpmnModeler.get('eventBus'),
    bpmnFactory: props.bpmnModeler.get('bpmnFactory'),
    elementFactory: props.bpmnModeler.get('elementFactory'),
    elementRegistry: props.bpmnModeler.get('elementRegistry'),
    replace: props.bpmnModeler.get('replace'),
    selection: props.bpmnModeler.get('selection'),
  };

  getActiveElement();
};

const getActiveElement = () => {
  initFormOnChanged(null);

  props.bpmnModeler.on('import.done', () => {
    initFormOnChanged(null);
  });

  props.bpmnModeler.on('selection.changed', ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null);
  });

  props.bpmnModeler.on('element.changed', ({ element }) => {
    if (element && element.id === elementId.value) {
      initFormOnChanged(element);
    }
  });
};

const initFormOnChanged = element => {
  let activatedElement = element;

  // 处理特定元素类型的默认名称设置
  if (activatedElement) {
    const { type } = activatedElement;
    const defaultNames = {
      'bpmn:StartEvent': '开始',
      'bpmn:EndEvent': '结束',
      // 'bpmn:UserTask': '请配置...' // 如果需要可以启用
    };

    if (defaultNames[type]) {
      const elementInRegistry = window.bpmnInstances?.elementRegistry?.find(el => el.type === type);
      if (elementInRegistry) {
        window.bpmnInstances?.modeling?.updateProperties(elementInRegistry, {
          name: defaultNames[type],
        });
      }
    }
  }

  if (!activatedElement) {
    activatedElement =
      window.bpmnInstances?.elementRegistry?.find(el => el.type === 'bpmn:Process') ?? window.bpmnInstances?.elementRegistry?.find(el => el.type === 'bpmn:Collaboration');
  }

  if (!activatedElement) return;

  Log.printBack(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`);
  Log.prettyInfo('businessObject', activatedElement.businessObject);

  window.bpmnInstances.bpmnElement = activatedElement;

  elementId.value = activatedElement.id;
  elementType.value = activatedElement.type.split(':')[1] || '';
  elementBusinessObject.value = JSON.parse(JSON.stringify(activatedElement.businessObject));

  // 判断是否显示流转条件设置
  conditionFormVisible.value = !!(elementType.value === 'SequenceFlow' && activatedElement.source && !activatedElement.source.type.includes('StartEvent'));

  // 判断是否显示表单配置
  formVisible.value = elementType.value === 'UserTask' || elementType.value === 'StartEvent';
};

const getType = val => {
  obj.value = val;
  emit('on-click', val);
};
</script>

<style lang="less" scoped>
@import '../../../../../sheets/collapse.less';
.process-panel__container {
  position: fixed;
  top: 137px;
  right: 0;
  height: calc(100vh - 137px);
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow-y: auto;

  :deep(.ant-collapse) {
    border: none;
    background: transparent;

    .ant-collapse-item {
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .ant-collapse-header {
        padding: 12px 16px;
        background: #fafafa;

        &:hover {
          background: #f5f5f5;
        }
      }

      .ant-collapse-content {
        border-top: none;

        .ant-collapse-content-box {
          padding: 16px;
        }
      }
    }
  }
}

.panel-tab__title {
  display: flex;
  align-items: center;
  margin-top: 3px;
  gap: 8px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);

  .anticon {
    font-size: 14px;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .process-panel__container {
    width: 100% !important;
    position: relative;
    top: 0;
    height: auto;
    max-height: 50vh;
  }
}
</style>
