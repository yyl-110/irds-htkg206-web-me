<template>
  <div class="my-process-designer" :class="{ 'ant-spin-nested-loading': loading }">
    <a-spin :spinning="loading" size="large">
      <div class="my-process-designer__header">
        <slot name="control-header"></slot>
        <template v-if="!$slots['control-header']">
          <!-- 文件控制按钮组 -->
          <a-space :size="8">
            <a-button-group key="file-control" style="display: flex; align-items: center">
              <a-tooltip title="打开文件">
                <a-button :size="headerButtonSize" :type="headerButtonType" @click="$refs.refFile.click()">
                  <EpcIcon type="icon-folder-opened" style="font-size: 12px" />
                  打开文件
                </a-button>
              </a-tooltip>

              <a-dropdown key="download-dropdown">
                <a-tooltip title="下载文件">
                  <a-button :size="headerButtonSize" :type="headerButtonType">
                    <EpcIcon type="icon-bottom" style="font-size: 12px" />
                    下载文件
                  </a-button>
                </a-tooltip>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="downloadProcessAsXml()">下载为XML文件</a-menu-item>
                    <a-menu-item @click="downloadProcessAsSvg()">下载为SVG文件</a-menu-item>
                    <a-menu-item @click="downloadProcessAsBpmn()">下载为BPMN文件</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

              <!-- <a-dropdown key="preview-dropdown">
                <a-tooltip title="预览">
                  <a-button :size="headerButtonSize" :type="headerButtonType">
                    <EpcIcon type="icon-liulan" style="font-size: 12px" />
                    预览
                  </a-button>
                </a-tooltip>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="previewProcessXML">预览XML</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown> -->

              <a-tooltip v-if="simulation" :title="simulationStatus ? '退出模拟' : '开启模拟'">
                <a-button :size="headerButtonSize" :type="headerButtonType" @click="processSimulation">
                  <EpcIcon type="icon-weiwangguanicon-defuben-" style="font-size: 12px" />
                  模拟
                </a-button>
              </a-tooltip>

              <a-tooltip title="保存">
                <a-button :size="headerButtonSize" :type="headerButtonType" @click="viewXML">
                  <EpcIcon type="icon-baocun" style="font-size: 12px" />
                  保存
                </a-button>
              </a-tooltip>

              <a-tooltip title="返回">
                <a-button :size="headerButtonSize" :type="headerButtonType" @click="goBack">
                  <EpcIcon type="icon-fanhui" style="font-size: 12px" />
                  返回
                </a-button>
              </a-tooltip>
            </a-button-group>

            <!-- 缩放控制按钮组 -->
            <a-button-group key="scale-control" style="display: flex; align-items: center">
              <a-tooltip title="缩小视图">
                <a-button :size="headerButtonSize" :disabled="defaultZoom < 0.2" @click="processZoomOut()">
                  <EpcIcon type="icon-suoxiao" style="font-size: 13px" />
                </a-button>
              </a-tooltip>

              <a-button :size="headerButtonSize">
                {{ Math.floor(defaultZoom * 10 * 10) + '%' }}
              </a-button>

              <a-tooltip title="放大视图">
                <a-button :size="headerButtonSize" :disabled="defaultZoom > 4" @click="processZoomIn()">
                  <EpcIcon type="icon-fangda" style="font-size: 13px" />
                </a-button>
              </a-tooltip>

              <a-tooltip title="重置视图并居中">
                <a-button :size="headerButtonSize" @click="processReZoom()">
                  <EpcIcon type="icon-zhongzhibingjuzhong" style="font-size: 13px" />
                </a-button>
              </a-tooltip>
            </a-button-group>

            <!-- 撤销/重做控制按钮组 -->
            <a-button-group key="stack-control" style="display: flex; align-items: center">
              <a-tooltip title="撤销">
                <a-button :size="headerButtonSize" :disabled="!revocable" @click="processUndo()">
                  <EpcIcon type="icon-a-huifu1" style="font-size: 12px" />
                </a-button>
              </a-tooltip>

              <a-tooltip title="恢复">
                <a-button :size="headerButtonSize" :disabled="!recoverable" @click="processRedo()">
                  <EpcIcon type="icon-a-huifu2" style="font-size: 13px" />
                </a-button>
              </a-tooltip>

              <a-tooltip title="重新绘制">
                <a-button :size="headerButtonSize" @click="processRestart">
                  <EpcIcon type="icon-tongbu2" style="font-size: 13px" />
                </a-button>
              </a-tooltip>
            </a-button-group>
          </a-space>

          <!-- 用于打开本地文件 -->
          <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn" @change="importLocalFile" />
        </template>
      </div>

      <div class="my-process-designer__container">
        <div class="my-process-designer__canvas" ref="bpmnCanvas"></div>
      </div>
    </a-spin>

    <!-- 预览对话框 -->
    <a-modal v-model:open="previewModelVisible" :destroy-on-close="true" :mask-closable="false" :title="`预览${previewType}`" width="60%" :footer="null" centered>
      <CodeMirror v-model:value="previewResult" :options="cmOptions" border :height="600" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, onActivated, defineExpose } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import DefaultEmptyXML from './plugins/defaultEmpty';
import customTranslate from './plugins/translate/customTranslate';
import translationsCN from './plugins/translate/zh';
import tokenSimulation from 'bpmn-js-token-simulation';
import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json';
import activitiModdleDescriptor from './plugins/descriptor/activitiDescriptor.json';
import flowableModdleDescriptor from './plugins/descriptor/flowableDescriptor.json';
import camundaModdleExtension from './plugins/extension-moddle/camunda';
import activitiModdleExtension from './plugins/extension-moddle/activiti';
import flowableModdleExtension from './plugins/extension-moddle/flowable';
import { AdminApiSystemCheckFlowInfoApi } from '@/api/tags/check/计算流程后台';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
// 引入 CodeMirror (需要确保有 Vue 3 版本)
import CodeMirror from 'codemirror-editor-vue3';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/xml/xml.js';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// Props
const props = defineProps({
  flag: Number,
  currentNode: String,
  modelValue: String,
  processId: String,
  taskId: String,
  processName: String,
  translations: Object,
  options: {
    type: Object,
    default: () => ({}),
  },
  additionalModel: [Object, Array],
  moddleExtension: Object,
  onlyCustomizeAddi: {
    type: Boolean,
    default: false,
  },
  onlyCustomizeModdle: {
    type: Boolean,
    default: false,
  },
  simulation: {
    type: Boolean,
    default: true,
  },
  keyboard: {
    type: Boolean,
    default: true,
  },
  prefix: {
    type: String,
    default: 'camunda',
  },
  events: {
    type: Array,
    default: () => ['element.click'],
  },
  headerButtonSize: {
    type: String,
    default: 'small',
    validator: value => ['large', 'middle', 'small'].includes(value),
  },
  headerButtonType: {
    type: String,
    default: 'primary',
    validator: value => ['default', 'primary', 'dashed', 'link', 'text'].includes(value),
  },
});

// Emits
const emit = defineEmits(['destroy', 'init-finished', 'commandStack-changed', 'update:modelValue', 'change', 'canvas-viewbox-changed', 'element-click', 'element-contextmenu']);

// Refs
const loading = ref(false);
const defaultZoom = ref(1.3);
const previewModelVisible = ref(false);
const simulationStatus = ref(false);
const previewResult = ref('');
const previewType = ref('xml');
const recoverable = ref(false);
const revocable = ref(false);
const bpmnModeler = ref(null);
const refFile = ref(null);
const bpmnCanvas = ref(null);

// 计算属性
const additionalModules = computed(() => {
  const Modules = [];

  if (props.onlyCustomizeAddi) {
    if (Array.isArray(props.additionalModel)) {
      return props.additionalModel || [];
    }
    return [props.additionalModel];
  }

  if (Array.isArray(props.additionalModel)) {
    Modules.push(...props.additionalModel);
  } else {
    props.additionalModel && Modules.push(props.additionalModel);
  }

  const TranslateModule = {
    translate: ['value', customTranslate(props.translations || translationsCN)],
  };
  Modules.push(TranslateModule);

  if (props.simulation) {
    Modules.push(tokenSimulation);
  }

  if (props.prefix === 'camunda') {
    Modules.push(camundaModdleExtension);
  }
  if (props.prefix === 'flowable') {
    Modules.push(flowableModdleExtension);
  }
  if (props.prefix === 'activiti') {
    Modules.push(activitiModdleExtension);
  }

  return Modules;
});

const moddleExtensions = computed(() => {
  const Extensions = {};

  if (props.onlyCustomizeModdle) {
    return props.moddleExtension || null;
  }

  if (props.moddleExtension) {
    Object.keys(props.moddleExtension).forEach(key => {
      Extensions[key] = props.moddleExtension[key];
    });
  }

  if (props.prefix === 'activiti') {
    Extensions.activiti = activitiModdleDescriptor;
  }
  if (props.prefix === 'flowable') {
    Extensions.flowable = flowableModdleDescriptor;
  }
  if (props.prefix === 'camunda') {
    Extensions.camunda = camundaModdleDescriptor;
  }

  return Extensions;
});

const flowCategory = ref();
const rowEdit = ref();
const calcRowData = ref();
const calcFlowData = ref();
const sign = ref();
const createData = ref();

const resetInteractionState = () => {
  if (!bpmnModeler.value) return;
  const safeGet = key => {
    try {
      return bpmnModeler.value.get(key);
    } catch {
      return null;
    }
  };
  const dragging = safeGet('dragging');
  const directEditing = safeGet('directEditing');
  const contextPad = safeGet('contextPad');
  const toolManager = safeGet('toolManager');

  if (dragging && typeof dragging.cancel === 'function') {
    dragging.cancel();
  }
  if (directEditing && typeof directEditing.cancel === 'function') {
    directEditing.cancel();
  }
  if (contextPad && typeof contextPad.close === 'function') {
    contextPad.close();
  }
  if (toolManager && typeof toolManager.setActive === 'function') {
    toolManager.setActive(null);
  }
};

const onGlobalKeydown = event => {
  if (event.key !== 'Escape') return;
  resetInteractionState();
};

// CodeMirror 配置
const cmOptions = reactive({
  mode: 'xml',
  theme: 'monokai',
  lineNumbers: true,
  smartIndent: true,
  readOnly: true,
  indentUnit: 2,
  foldGutter: true,
  styleActiveLine: true,
});

onActivated(() => {
  nextTick(() => {
    initBpmnModeler();
  });
  if (createData.value === 1) {
    processRestart();
  }
});

onMounted(() => {
  document.addEventListener('keydown', onGlobalKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobalKeydown);
  if (bpmnModeler.value) {
    bpmnModeler.value.destroy();
    emit('destroy', bpmnModeler.value);
    bpmnModeler.value = null;
  }
  localStorage.removeItem('selecData');
});

// 方法
const initBpmnModeler = () => {
  if (bpmnModeler.value) return;
  bpmnModeler.value = new BpmnModeler({
    container: bpmnCanvas.value,
    // keyboard: props.keyboard ? { bindTo: document } : null,
    additionalModules: additionalModules.value,
    moddleExtensions: moddleExtensions.value,
    ...props.options,
  });
  emit('init-finished', bpmnModeler.value);
  // initModelListeners();
};

const initModelListeners = () => {
  const EventBus = bpmnModeler.value.get('eventBus');

  props.events.forEach(event => {
    EventBus.on(event, eventObj => {
      const eventName = event.replace(/\./g, '-');
      const element = eventObj ? eventObj.element : null;
      emit(eventName, element, eventObj);
    });
  });

  EventBus.on('commandStack.changed', async event => {
    try {
      recoverable.value = bpmnModeler.value.get('commandStack').canRedo();
      revocable.value = bpmnModeler.value.get('commandStack').canUndo();
      const { xml } = await bpmnModeler.value.saveXML({ format: true });
      emit('commandStack-changed', event);
      emit('update:modelValue', xml);
      emit('change', xml);
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e.message || e}`);
    }
  });

  bpmnModeler.value.on('canvas.viewbox.changed', ({ viewbox }) => {
    emit('canvas-viewbox-changed', { viewbox });
    const { scale } = viewbox;
    defaultZoom.value = Math.floor(scale * 100) / 100;
  });
};

const createNewDiagram = async data => {
  data = data.replace(/<!\[CDATA\[(.+?)]]>/g, (match, str) => {
    return str.replace(/</g, '&lt;');
  });

  try {
    await bpmnModeler.value.importXML(data);
    fitViewport();
  } catch (err) {
    console.error(err.message, err.warnings);
  }
};

const fitViewport = () => {
  const zoom = bpmnModeler.value.get('canvas').zoom('fit-viewport');
  const bbox = document.querySelector('.flow-containers .viewport')?.getBBox();
  if (!bbox) return;

  const currentViewbox = bpmnModeler.value.get('canvas').viewbox();
  const elementMid = {
    x: bbox.x + bbox.width / 2 - 65,
    y: bbox.y + bbox.height / 2,
  };

  bpmnModeler.value.get('canvas').viewbox({
    x: elementMid.x - currentViewbox.width / 2,
    y: elementMid.y - currentViewbox.height / 2,
    width: currentViewbox.width,
    height: currentViewbox.height,
  });
};

const createNewDiagramNew = async xml => {
  const newId = props.processId || `Process_${new Date().getTime()}`;
  const newName = props.processName || `计算程序_${new Date().getTime()}`;
  const xmlString = xml || DefaultEmptyXML(newId, newName, props.prefix);

  try {
    const { warnings } = await bpmnModeler.value.importXML(xmlString);
    if (warnings && warnings.length) {
      warnings.forEach(warn => console.warn(warn));
    }
  } catch (e) {
    console.error(`[Process Designer Warn]: ${e?.message || e}`);
  }
};

const saveXML = async () => {
  const categoryLocal = localStorage.getItem('categoryCalc');
  const routeTag = route.query.tag;
  if (routeTag && routeTag == 1) {
    if (!flowCategory.value) {
      message.warning('请选择流程分类');
      return;
    }
  } else {
    if (!categoryLocal) {
      message.warning('请选择流程分类');
      return;
    }
  }

  loading.value = true;
  const categoryName = localStorage.getItem('categoryName');
  const params = {
    bpmnXml: previewResult.value,
    taskId: String(props.taskId || route.query?.taskId || ''),
  };
  try {
    const res = await AdminApiSystemProcessTask.bpmnSaveXmlTree(params);
    if (res && res.data.code == 200) {
      localStorage.removeItem('categoryCalc');
      // 保存后返回上一个页面（设计任务列表页）
      message.success(res.data.msg || '保存成功');
      router.back();

      localStorage.removeItem('category');
      localStorage.removeItem('queryList');
    } else {
      message.error(res?.msg || '保存失败');
    }
  } catch (error) {
    message.error('服务错误，请联系管理员!');
  } finally {
    loading.value = false;
  }
};

const viewXML = () => {
  bpmnModeler.value.saveXML({ format: true }).then(({ xml }) => {
    previewResult.value = xml;
    getXMLNode(xml);
  });

  // store.dispatch("dict/setSign", sign.value);
  // store.dispatch("dict/createData", 0);
};

const getXMLNode = str => {
  const xmlDoc = new DOMParser().parseFromString(str, 'text/xml');
  const finds = xmlDoc.getElementsByTagName('bpmn2:userTask');
  if (finds.length === 0) {
    message.error('流程图绘制错误, 请绑定页面！');
    return;
  }

  const arrObj = [];
  for (let i = 0; i < finds.length; i++) {
    const finder = finds[i].attributes;
    const arrData = Object.values(finder);
    if (arrData.length > 2 && arrData[arrData.length - 1]?.value) {
      arrObj.push(arrData[arrData.length - 1].value);
    }
  }
  if (finds.length === arrObj.length) {
    saveXML();
  } else {
    message.error('流程图绘制错误, 请绑定页面！');
  }
};

const goBack = () => {
  // 与保存后的行为保持一致：返回上一个页面（设计任务列表页）
  if (window.history.length > 1) {
    router.back();
    return;
  }
  // 无历史记录时兜底到首页，避免停留当前页
  message.warning('未找到可返回的上一页，已跳转首页');
  router.push({ path: '/home/workbench' });
};

const downloadProcess = async (type, name = 'diagram') => {
  try {
    if (type === 'xml' || type === 'bpmn') {
      const { err, xml } = await bpmnModeler.value.saveXML();
      if (err) {
        console.error(`[Process Designer Warn]: ${err.message || err}`);
        return;
      }
      const { href, filename } = setEncoded(type.toUpperCase(), name, xml);
      downloadFunc(href, filename);
    } else {
      const { err, svg } = await bpmnModeler.value.saveSVG();
      if (err) {
        console.error(err);
        return;
      }
      const { href, filename } = setEncoded('SVG', name, svg);
      downloadFunc(href, filename);
    }
  } catch (e) {
    console.error(`[Process Designer Warn]: ${e.message || e}`);
  }
};

const setEncoded = (type, filename, data) => {
  const encodedData = encodeURIComponent(data);
  return {
    filename: `${filename}.${type}`,
    href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
    data,
  };
};

const importLocalFile = () => {
  const file = refFile.value.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    const xmlStr = this.result;
    createNewDiagramNew(xmlStr);
  };
};

const downloadProcessAsXml = () => downloadProcess('xml');
const downloadProcessAsBpmn = () => downloadProcess('bpmn');
const downloadProcessAsSvg = () => downloadProcess('svg');

const processSimulation = () => {
  simulationStatus.value = !simulationStatus.value;
  props.simulation && bpmnModeler.value.get('toggleMode').toggleMode();
};

const processRedo = () => {
  bpmnModeler.value.get('commandStack').redo();
};

const processUndo = () => {
  bpmnModeler.value.get('commandStack').undo();
};

const processZoomIn = (zoomStep = 0.1) => {
  const newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100;
  if (newZoom > 4) {
    message.error('缩放比例不能大于4');
    return;
  }
  defaultZoom.value = newZoom;
  bpmnModeler.value.get('canvas').zoom(defaultZoom.value);
};

const processZoomOut = (zoomStep = 0.1) => {
  const newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100;
  if (newZoom < 0.2) {
    message.error('缩放比例不能小于0.2');
    return;
  }
  defaultZoom.value = newZoom;
  bpmnModeler.value.get('canvas').zoom(defaultZoom.value);
};

const processReZoom = () => {
  defaultZoom.value = 1.3;
  bpmnModeler.value.get('canvas').zoom('fit-viewport', 'auto');
};

const processRestart = () => {
  recoverable.value = false;
  revocable.value = false;
  createNewDiagramNew(null);
};

const previewProcessXML = () => {
  bpmnModeler.value.saveXML({ format: true }).then(({ xml }) => {
    previewResult.value = xml;
    previewType.value = 'xml';
    cmOptions.mode = 'xml';
    previewModelVisible.value = true;
  });
};

const downloadFunc = (href, filename) => {
  if (href && filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = href;
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

// 如果需要保留 alignElements 功能
const elementsAlign = align => {
  const Align = bpmnModeler.value.get('alignElements');
  const Selection = bpmnModeler.value.get('selection');
  const SelectedElements = Selection.get();

  if (!SelectedElements || SelectedElements.length <= 1) {
    message.warning('请按住 Ctrl 键选择多个元素对齐');
    return;
  }

  Modal.confirm({
    title: '警告',
    content: '自动对齐可能造成图形变形，是否继续？',
    okText: '确定',
    cancelText: '取消',
    onOk: () => Align.trigger(SelectedElements, align),
  });
};
defineExpose({ createNewDiagram, createNewDiagramNew });
</script>

<style lang="less" scoped>
.my-process-designer {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__container {
    flex: 1;
    overflow: hidden;
    background: #f5f5f5;
  }

  &__canvas {
    width: 100%;
    height: calc(100vh - 120px) !important;
    min-height: 600px;
  }
}

// Ant Design 按钮组样式调整
.ant-btn-group {
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }
}

// 自定义样式
.top-btn {
  width: 64px;
  height: 25px;
  background-color: #1890ff;
  color: #fff;
  border-radius: 0;
  border: none;

  &:hover {
    background-color: #40a9ff;
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .my-process-designer__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .ant-btn-group {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
