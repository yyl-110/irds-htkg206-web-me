<template>
  <div class="containers main-box">
    <a-button-group key="scale-control" class="flowview-toolbar">
      <a-button type="primary" size="small" @click="zoomViewport(true)">
        <EpcIcon type="icon-fangda" style="font-size: 13px" />
        放大</a-button
      >
      <a-button type="primary" size="small" @click="zoomViewport(false)" style="margin-left: 5px">
        <EpcIcon type="icon-suoxiao" style="font-size: 13px" />
        缩小</a-button
      >
      <a-button type="primary" size="small" @click="fitViewport" style="margin-left: 5px">
        <EpcIcon type="icon-zhongzhibingjuzhong" style="font-size: 13px" />
        适中</a-button
      >
    </a-button-group>
    <div class="canvas" ref="flowCanvas"></div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import { CustomViewer as BpmnViewer } from '@/utils/customBpmn';
import { EpcIcon } from '@/components/icon/EpcIcon';
// 1. 响应式变量声明（替代Vue2的data）
const flowCanvas = ref(null); // 绑定DOM容器
const bpmnViewer = ref(null); // 存储BPMN实例
const zoom = ref(1); // 替代Vue2的this.zoom

// 2. 接收props（替代Vue2的props选项）
const props = defineProps({
  flowData: {
    type: Object,
    default: () => ({}),
  },
});

// 3. 监听 flowData（含 xmlData），容器挂载后再创建 Viewer
watch(
  () => props.flowData,
  async newVal => {
    const xml = newVal?.xmlData;
    if (!xml || typeof xml !== 'string') {
      bpmnViewer.value?.destroy();
      bpmnViewer.value = null;
      return;
    }
    await nextTick();
    if (!flowCanvas.value) return;
    bpmnViewer.value?.destroy();
    bpmnViewer.value = new BpmnViewer({
      container: flowCanvas.value,
    });
    await loadFlowCanvas(xml);
  },
  { immediate: true, deep: true, flush: 'post' },
);

// 4. 方法定义（替代Vue2的methods）
const loadFlowCanvas = async xmlString => {
  if (!bpmnViewer.value) return;
  try {
    await bpmnViewer.value.importXML(xmlString);
    fitViewport();
  } catch (err) {
    console.error('BPMN加载失败:', err.message, err.warnings);
  }
};

const fitViewport = () => {
  if (!bpmnViewer.value) return;
  zoom.value = bpmnViewer.value.get('canvas').zoom('fit-viewport', 'auto');
};

const zoomViewport = (zoomIn = true) => {
  if (!bpmnViewer.value) return;
  zoom.value = bpmnViewer.value.get('canvas').zoom();
  zoom.value += zoomIn ? 0.1 : -0.1;
  if (zoom.value >= 0.2) {
    bpmnViewer.value.get('canvas').zoom(zoom.value);
  }
};

// 5. 组件销毁时清理资源（替代Vue2的beforeDestroy）
onUnmounted(() => {
  bpmnViewer.value?.destroy();
});
</script>

<style lang="less" scoped>
.flowview-toolbar {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.view-mode {
  .el-header,
  .el-aside,
  .djs-palette,
  .bjs-powered-by {
    display: none;
  }
  .el-loading-mask {
    background-color: initial;
  }
  .el-loading-spinner {
    display: none;
  }
}
.containers {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-height: 480px;
  /* bpmn-js 右下角 BPMN.IO 水印 */
  :deep(.bjs-powered-by) {
    display: none !important;
  }
  .canvas {
    flex: 1;
    width: 100%;
    min-height: 440px;
    border: 1px solid #f0f0f0;
    background: #fafafa;
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 300px;
  }
  .load {
    margin-right: 10px;
  }
  .el-form-item__label {
    font-size: 13px;
  }
  .djs-palette {
    left: 0px !important;
    top: 0px;
    border-top: none;
  }
  .overlays-div {
    font-size: 10px;
    color: red;
    width: 100px;
    top: -20px !important;
  }
}
</style>
