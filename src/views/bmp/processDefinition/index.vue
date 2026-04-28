<template>
  <div>
    <ProcessDesigner
      ref="processDesigner"
      :key="`designer-${reloadIndex}`"
      :options="{
        taskResizingEnabled: true,
        eventResizingEnabled: true,
        minimap: { open: true },
      }"
      :modelValue="xmlString"
      v-bind="controlForm"
      :flag="flag"
      :current-node="currentNode"
      keyboard
      @element-click="elementClick"
      @element-contextmenu="elementContextmenu"
      @init-finished="initModeler" />
    <propertiesPanel
      :key="`penal-${reloadIndex}`"
      :bpmn-modeler="modeler"
      :currentNode="currentNode"
      :task-id="controlForm.taskId"
      :menu-id="controlForm.menuId"
      :prefix="controlForm.prefix"
      :flag="flag"
      class="process-panel" />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onActivated, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 自定义渲染（隐藏了 label 标签）
import CustomRenderer from './modules/custom-renderer';
import ProcessDesigner from './package/designer/ProcessDesigner.vue';
import propertiesPanel from './package/penal/PropertiesPanel.vue';
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from './package/designer/plugins/content-pad';
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from './package/designer/plugins/palette';
import Log from './package/Log';
// 任务resize
// import resizeTask from "bpmn-js-task-resize/lib"
// 小地图
import minimapModule from 'diagram-js-minimap';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import { AdminApiSystemCheckFlowInfoApi } from '@/api/tags/check/计算流程后台';

function safeDecodeQueryParam(val) {
  const s = String(val ?? '').trim();
  if (!s) return '';
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

const route = useRoute();
const router = useRouter();
// 响应式数据
const xmlString = ref('');
const modeler = ref(null);
const reloadIndex = ref(0);
const flag = ref(0);
const currentNode = ref(null);
const element = ref(null);
const processDesigner = ref(null);
const controlForm = reactive({
  processId: '',
  taskId: '',
  menuId: '',
  processName: '',
  simulation: true,
  labelEditing: false,
  labelVisible: false,
  prefix: 'flowable',
  headerButtonSize: 'small',
  events: ['element.click', 'element.contextmenu'],
  additionalModel: [CustomContentPadProvider, CustomPaletteProvider, minimapModule],
});

onActivated(async () => {
  xmlString.value = '';
  const deployId = route.query?.deployId;
  flag.value = route.query?.flag || 0;
  /** 从设计任务列表「配置」携带的任务名称，用于流程根节点「名称」 */
  const qName = route.query?.processName;
  if (qName != null && String(qName).trim() !== '') {
    controlForm.processName = safeDecodeQueryParam(qName);
  } else {
    controlForm.processName = '';
  }
  const qTaskId = route.query?.taskId;
  controlForm.taskId = qTaskId != null ? String(qTaskId).trim() : '';
  const qMenuId = route.query?.menuId;
  controlForm.menuId = qMenuId != null ? String(qMenuId).trim() : '';
  const cachedXml = controlForm.taskId ? sessionStorage.getItem(`designTaskBpmnXml:${controlForm.taskId}`) || '' : '';
  if (route.query?.currentNode) {
    currentNode.value = JSON.parse(route.query?.currentNode) || null;
  }
  if (cachedXml) {
    xmlString.value = cachedXml;
    nextTick(() => {
      processDesigner.value.createNewDiagram(xmlString.value);
    });
  } else if (deployId) {
    await getXmlData(deployId);
    nextTick(() => {
      processDesigner.value.createNewDiagram(xmlString.value);
    });
  } else {
    nextTick(() => {
      processDesigner.value.createNewDiagramNew(xmlString.value);
    });
  }
});

// 方法
const initModeler = modelerInstance => {
  setTimeout(() => {
    nextTick(() => {
      modeler.value = modelerInstance;
      const canvas = modelerInstance.get('canvas');
      const rootElement = canvas.getRootElement();
      Log.prettyPrimary('Process Id:', rootElement.id);
      if (rootElement.businessObject && rootElement.businessObject.name) {
        Log.prettyPrimary('Process Name:', rootElement.businessObject.name);
      }
    });
  }, 10);
};

const getXmlData = async deployId => {
  try {
    const res = await AdminApiSystemCheckFlowInfoApi.readXml({ deployId });
    xmlString.value = res.data.data;
  } catch (error) {
    console.error('获取XML数据失败:', error);
  }
};

const elementClick = clickedElement => {
  element.value = clickedElement;
  // console.log(clickedElement);
};

const elementContextmenu = element => {
  // console.log('elementContextmenu:', element);
};

const closeDialog = () => {
  router.push({
    path: '/business/processFormdefinition',
    query: { t: Date.now() },
  });
  initModeler(null);
};

// 监听路由变化
// watch(
//   () => route.query,
//   newQuery => {
//     currentNode.value = newQuery.currentNode;
//   },
//   { deep: true }
// );
</script>

<style lang="less" scoped>
// 修复 Ant Design Modal 样式
:deep(.ant-modal) {
  top: 3%;

  .ant-modal-body {
    padding: 0;
    height: calc(50vh - 108px); // 50% 视口高度减去标题和padding
  }
}

:deep(.app-dialog) {
  .ant-modal {
    max-width: 90%;
  }
}

.process-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.process-panel {
  position: absolute;
  top: 158px;
  z-index: 1000;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
</style>
