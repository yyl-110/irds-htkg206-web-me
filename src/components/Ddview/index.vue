<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { useFullscreen } from '@vueuse/core';
import _ from 'lodash-es';
import ddView from './ddview.js';
import { WeiMessage } from '@/utils/WeiMessage';
import addScript from '@/utils/dynamicLoadScript.js';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { dePreviewFile } from '@/utils/file.ts';

const props = defineProps({
  /** 高度 */
  height: {
    type: String,
    required: true,
    default: 'calc(100vh - 283px)',
  },
});
const emit = defineEmits(['loadError', 'selectItem']);
const loading = ref(true);
const viewContainer = ref();
const { isFullscreen, enter, exit, toggle } = useFullscreen(viewContainer);
function markCallout(calloutId, callInfo) {
  emit('selectItem', callInfo.label);
}
let dView;
let initComplete = false;
const divId = ref(_.uniqueId('dd-view-plugin-'));

// 初始化ThingView的环境
function initThingView() {
  if (!window.thingViewInit) {
    addScript(`/thingview/thingview.js?_cache=${new Date().getTime()}`).then(() => {
      window.thingViewInit = true;
      dView = ddView(ThingView, divId.value, {
        callOutSelect: markCallout,
      });
      dView.init(() => {
        initComplete = true;
      });
    });
  } else {
    dView = ddView(ThingView, divId.value, {
      callOutSelect: markCallout,
    });
    dView.reInit(() => {
      initComplete = true;
    });
  }
}
// 初始化ThingView的环境
initThingView();

let initTimer = null;
// 加载模型
function loadModel(fileId, ops) {
  if (initTimer) clearInterval(initTimer);
  initTimer = setInterval(() => {
    if (initComplete) {
      clearInterval(initTimer);
      initTimer = null;
      // fileId = "1871856637625958402";
      if (dView) {
        dView.session.RemoveAllLoadSources();
        dView.unLoadModel();
        loading.value = true;
        fileId &&
          dView.LoadModel(dePreviewFile(fileId), {
            timeCb() {},
            errorCb(msg) {
              // WeiMessage.error(msg);
              emit('loadError');
            },
            loadPartList: ops ? ops.loadPartList : undefined, // 加载partList
            loadPartListCb: () => {
              if (ops.calloutLabel !== '-1') {
                changeMarkup(ops.calloutLabel);
              }
            },
            loadComplete: () => {
              loading.value = false;
            },
          });
      } else {
        loading.value = false;
      }
    }
  }, 100);
}
// 改变选中的球标
function changeMarkup(calloutLabel) {
  dView.itemListSelection(calloutLabel);
}

onBeforeUnmount(() => {
  Object.keys(dView.timer).forEach(item => {
    item && clearTimeout(item);
  });
});

// 还原初始化，默认视图
function reloadModel() {}
const resetView = () => dView && dView.btnOps.resetView();
const zoomSelect = () => dView && dView.btnOps.zoomSelected();
const zoomWindow = () => dView && dView.btnOps.zoomWindow();
const zoomIn = () => dView && dView.btnOps.zoomIn();
const zoomOut = () => dView && dView.btnOps.zoomOut();
const setSpinCenter = () => dView && dView.btnOps.setSpinCenter();
const autoSpinCenter = () => dView && dView.btnOps.autoSpinCenter();
const enablePartDrag = () => dView && dView.btnOps.setDragMode();
const sectionCut = () => dView && dView.btnOps.enableSectionCut();

defineExpose({ loadModel, changeMarkup });
</script>

<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div :id="divId" ref="viewContainer" class="db-container" :style="{ height: `${height}`, position: 'relative' }">
      <!-- 可视化数据加载中... -->
      <div class="btns">
        <div class="toolbar">
          <a-tooltip>
            <template #title> 还原窗口视图<br /><span class="tip-cls">直接点击显示模型到窗口内</span> </template>
            <EpcIcon type="icon-ResetView" class="icon-size" @click="resetView" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 缩放选中零件<br /><span class="tip-cls">先点击某个零件，然后再点击该按钮</span> </template>
            <EpcIcon type="icon-zoom-select" class="icon-size" @click="zoomSelect" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 放大选中窗口<br /><span class="tip-cls">先点击该按钮，然后在模型上圈出需要放大的内容</span> </template>
            <EpcIcon type="icon-jubufangda" class="icon-size" @click="zoomWindow" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 放大<br /><span class="tip-cls">点击后页面内容会在当前基础上放大</span> </template>
            <EpcIcon type="icon-zoomin" class="icon-size" @click="zoomIn" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 缩小<br /><span class="tip-cls">点击后页面内容会在当前基础上缩小</span> </template>
            <EpcIcon type="icon-zoomout" class="icon-size" @click="zoomOut" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 设置旋转中心<br /><span class="tip-cls">点击后，再点击零件，则会以点击的部位为选中中心</span> </template>
            <EpcIcon type="icon-xuanzhuan" class="icon-size" @click="setSpinCenter" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 自定义旋转中心<br /><span class="tip-cls">点击后，在模型视图内右键即以右键的位置进行旋转</span> </template>
            <EpcIcon type="icon-xuanzhuanzhou" class="icon-size" @click="autoSpinCenter" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 零件拖拽<br /><span class="tip-cls">点击后，在点击零件则可以对零件进行拖拽、旋转</span> </template>
            <EpcIcon type="icon-drag-drop-line" class="icon-size" @click="enablePartDrag" />
          </a-tooltip>
          <a-tooltip>
            <template #title> 模型剖切<br /><span class="tip-cls">点击后，界面上会出现剖切面，点击剖切面可以拖拽查看不同位置的剖切</span> </template>
            <EpcIcon type="icon-shitupouqiehe" class="icon-size" @click="sectionCut" />
          </a-tooltip>
        </div>
        <div class="fullscreen-btn">
          <EpcIcon v-if="!isFullscreen" type="icon-fullscreen1" @click="toggle()" />
          <EpcIcon v-else type="icon-fullscreen_exit" @click="toggle()" />
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style lang="less" scoped>
.db-container {
  width: 100%;
  height: calc(100vh - 283px) !important;
  border: 1px solid gray;
}
.tip-cls {
  color: #ffe567;
}
.btns {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .toolbar {
    position: absolute;
    top: 5px;
    left: 3px;
    display: flex;
    margin-top: 5px;
    justify-content: start;
    .icon-size {
      font-size: 18px;
      margin-right: 5px;
    }
  }
  .fullscreen-btn {
    position: absolute;
    top: 3px;
    right: 3px;
    font-size: 24px;
    .svg {
      fill: pink;
    }
  }
}
</style>
