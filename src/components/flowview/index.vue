<template>
  <div class="containers main-box">
    <a-button-group key="scale-control" style="display: flex; align-items: center">
      <a-button type="primary" size="small" @click="zoomViewport(true)">
        <EpcIcon type="icon-suoxiao" style="font-size: 13px" />
        放大</a-button
      >
      <a-button type="primary" size="small" @click="zoomViewport(false)">
        <EpcIcon type="icon-suoxiao" style="font-size: 13px" />
        缩小</a-button
      >
      <a-button type="primary" size="small" @click="fitViewport">
        <EpcIcon type="icon-zhongzhibingjuzhong" style="font-size: 13px" />
        适中</a-button
      >
    </a-button-group>
    <div class="canvas" ref="flowCanvas"></div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
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

// 3. 监听flowData变化（替代Vue2的watch选项）
watch(
  () => props.flowData, // 监听props的flowData
  newVal => {
    if (Object.keys(newVal).length > 0) {
      // 销毁旧实例
      bpmnViewer.value?.destroy();
      // 创建新实例
      bpmnViewer.value = new BpmnViewer({
        container: flowCanvas.value,
        height: 'calc(100vh - 350px)',
      });
      // 加载BPMN数据
      loadFlowCanvas(newVal);
    }
  },
  { immediate: true, deep: true } // 立即执行+深度监听
);

// 4. 方法定义（替代Vue2的methods）
const loadFlowCanvas = async flowData => {
  try {
    await bpmnViewer.value.importXML(flowData.xmlData);
    fitViewport(); // 加载完成后自适应
  } catch (err) {
    console.error('BPMN加载失败:', err.message, err.warnings);
  }
};

const fitViewport = () => {
  zoom.value = bpmnViewer.value.get('canvas').zoom('fit-viewport', 'auto');
};

const zoomViewport = (zoomIn = true) => {
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
/* 保留原样式，仅调整Element Plus的适配（若需） */
.bjs-powered-by {
  display: none;
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
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
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
  .djs-container svg {
    min-height: 650px;
  }
  .overlays-div {
    font-size: 10px;
    color: red;
    width: 100px;
    top: -20px !important;
  }
}
</style>
