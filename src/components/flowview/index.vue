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
    await nextTick();
    applyNodeStatusStyles(props.flowData?.nodeStatusMap);
    setTimeout(() => applyNodeStatusStyles(props.flowData?.nodeStatusMap), 180);
  } catch (err) {
    console.error('BPMN加载失败:', err.message, err.warnings);
  }
};

const resolveNodeStatusColor = statusRaw => {
  const status = String(statusRaw ?? '').trim();
  if (status.includes('已完成')) return { fill: '#f6ffed', stroke: '#52c41a' };
  if (status.includes('进行中') || status.includes('设计中')) return { fill: '#fffbe6', stroke: '#faad14' };
  if (status.includes('待确认')) return { fill: '#f5f0ff', stroke: '#722ed1' };
  if (status.includes('未开始')) return { fill: '#fafafa', stroke: '#999999' };
  return null;
};

const applyNodeStatusStyles = statusMapRaw => {
  if (!bpmnViewer.value || !statusMapRaw || typeof statusMapRaw !== 'object') return;
  const statusMap = new Map(
    Object.entries(statusMapRaw)
      .map(([k, v]) => [String(k ?? '').trim(), String(v ?? '').trim()])
      .filter(([k]) => !!k),
  );
  if (!statusMap.size) return;
  const completedStyle = resolveNodeStatusColor('已完成');
  const allCompleted = Array.from(statusMap.values()).every(status => String(status ?? '').includes('已完成'));
  const elementRegistry = bpmnViewer.value.get('elementRegistry');
  const root = flowCanvas.value;
  if (!root || !elementRegistry?.get) return;
  const domNodes = root.querySelectorAll('.djs-element[data-element-id]');
  domNodes.forEach(dom => {
    const elementId = String(dom.getAttribute('data-element-id') ?? '').trim();
    if (!elementId) return;
    const el = elementRegistry.get(elementId);
    if (!el || Array.isArray(el?.waypoints)) return;
    const nodeName = String(el?.businessObject?.name ?? '').trim();
    const elementType = String(el?.type ?? '');
    let style = nodeName ? resolveNodeStatusColor(statusMap.get(nodeName)) : null;
    // 开始节点默认按已完成样式渲染
    if (!style && elementType === 'bpmn:StartEvent') style = completedStyle;
    // 仅当左侧全部活动已完成时，结束节点也按已完成样式渲染
    if (!style && allCompleted && elementType === 'bpmn:EndEvent') style = completedStyle;
    if (!style) return;
    const visual = dom.querySelector('.djs-visual');
    if (!visual) return;
    const shapes = visual.querySelectorAll('rect, polygon, path, ellipse, circle');
    shapes.forEach(shape => {
      // 主体图形统一填充背景色，确保不仅是边框变色
      shape.setAttribute('fill', style.fill);
      shape.style.fill = style.fill;
      const stroke = String(shape.getAttribute('stroke') ?? '').trim().toLowerCase();
      if (!stroke || stroke !== 'none') {
        shape.setAttribute('stroke', style.stroke);
        shape.style.stroke = style.stroke;
      }
    });
  });
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
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
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
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  /* bpmn-js 右下角 BPMN.IO 水印 */
  :deep(.bjs-powered-by) {
    display: none !important;
  }
  .canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    min-height: 0;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    border: none;
    background: #fafafa;
    :deep(.djs-container) {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
    :deep(svg) {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
    :deep(svg .viewport) {
      pointer-events: all;
    }
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
