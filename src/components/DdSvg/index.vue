<script setup>
import { defineExpose, ref } from 'vue';
import svgPanZoom from 'svg-pan-zoom';
import { useFullscreen, useResizeObserver } from '@vueuse/core';
import _ from 'lodash-es';
import axios from 'axios';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { dePreviewFile } from '@/utils/file.ts';
import { getRefreshToken, getTenantId, setToken } from '@/utils/auth.ts';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证.ts';

const emit = defineEmits(['selectPartListItem']);
const svgContainerRef = ref();
const { isFullscreen, enter, exit, toggle } = useFullscreen(svgContainerRef);

const svgContainerId = ref(_.uniqueId('svgContainer-'));
let svgPan;
useResizeObserver(svgContainerRef, entries => {
  const entry = entries[0];
  if (svgPan) {
    if (!isFullscreen.value) {
      _embed.setAttribute('style', 'width: 100%; height: calc(100vh - 250px); border:1px solid black;');
    } else {
      _embed.setAttribute('style', 'width: 100%; height: calc(100vh - 0px); border:1px solid black;');
    }
    svgPan && svgPan.resize();
    svgPan && svgPan.fit();
    svgPan && svgPan.center();
  }
});
const fileId = ref('');
const svgLoading = ref(false);
// 刷新token后重新加载
async function refreshToken(cb) {
  axios.defaults.headers.common['tenant-id'] = getTenantId();
  const refreshTokenRes = await AdminApiSystemAuth.refreshToken({
    refreshToken: getRefreshToken(),
  });
  // 4.2.1 刷新成功，则回放队列的请求 + 当前请求
  setToken(refreshTokenRes.data.data);
  cb && cb();
}
async function loadSvg(svgFileId) {
  fileId.value = dePreviewFile(svgFileId);
  // const res = await fetch(fileId.value);
  // const txt = await res.text();
  removeEmbed();
  if (!svgFileId) {
    return;
  }
  svgLoading.value = true;
  let resultType = 0; // 0: 正常的流返回 1：错误的json返回数据
  fetch(fileId.value)
    .then(response => {
      const headers = response.headers;
      const contentType = headers.get('Content-Type');
      if (contentType === 'application/json') {
        resultType = 1;
        return response.json();
      }
      return response.body;
    })
    .then(stream => {
      if (resultType === 1) {
        console.log('加载svg返回的数据:', stream);
        return stream;
      }
      // 创建一个Blob对象，将流转换为Blob
      return new Response(stream).blob();
    })
    .then(blob => {
      if (blob.msg && blob.msg.split('=')[1] == 404) {
        return;
      }
      if (blob.msg && blob.msg.includes('SIM获取文件失败')) {
        return;
      }
      if (blob.code == 500) {
        return;
      }
      if (resultType === 1) {
        refreshToken(() => {
          setTimeout(() => {
            loadSvg(svgFileId);
          }, 300);
        });
        return;
      }
      // 创建一个URL对象，指向Blob对象
      const objectUrl = URL.createObjectURL(new Blob([blob], { type: 'image/svg+xml' }));

      // 这里可以使用objectUrl，例如将其设置为img元素的src
      // document.getElementById('my-image').src = objectUrl;

      // 在不需要时释放对象URL资源
      // 判断如果embed存在则不重新创建
      curSvgComponent = createNewEmbed(objectUrl, initOptions);
    })
    .catch(error => {
      console.error('Fetching or converting the image failed:', error);
    })
    .finally(() => {
      svgLoading.value = false;
    });
}
const svgOptions = {
  zoomEnabled: true,
  controlIconsEnabled: true,
  panEnabled: true,
  dblClickZoomEnabled: true,
  mouseWheelZoomEnabled: true,
  preventMouseEventsDefault: true,
  zoomScaleSensitivity: 0.2,
  minZoom: 0.5,
  maxZoom: 10,
  fit: false,
  contain: false,
  center: true,
};
let curSvgComponent;
let _embed;
let lastEventListener;
function removeEmbed() {
  // Destroy svgpanzoom
  let lastEmbed = document.getElementById(svgContainerId.value) && document.getElementById(svgContainerId.value).firstChild;
  if (!lastEmbed) return;

  // Remove event listener
  lastEmbed.removeEventListener('load', lastEventListener);
  // Null last event listener
  lastEventListener = null;
  // Remove embed element
  document.getElementById(svgContainerId.value).removeChild(lastEmbed);
  // svgPanZoom(lastEmbed).destroy()
  // Null reference to embed
  lastEmbed = null;
}
function createNewEmbed(src, cb) {
  const embed = document.createElement('embed');
  _embed = embed;
  embed.setAttribute('style', 'width: 100%; height: calc(100vh - 250px); border:1px solid black;');
  embed.setAttribute('type', 'image/svg+xml');
  embed.setAttribute('src', src);
  if (document.getElementById(svgContainerId.value) && document.getElementById(svgContainerId.value).appendChild(embed)) {
    document.getElementById(svgContainerId.value).appendChild(embed);
  }
  lastEventListener = function () {
    const t = setInterval(() => {
      try {
        svgPan = svgPanZoom(embed, {
          ...svgOptions,
        });
        clearInterval(t);
      } catch (err) {}
    }, 300);
    // window.svgPan = svgPan
    cb && cb();
  };
  embed.addEventListener('load', lastEventListener);
  return embed;
}
function getSvgRoot() {
  return curSvgComponent.getSVGDocument();
}
let _svg = null;
// 对数据添加悬浮样式
function initOptions() {
  const svgDocument = getSvgRoot();
  _svg = svgDocument;
  initSvgCursorGrab(svgDocument);
  // 初始化热区的悬浮样式
  initHotSpotHover(svgDocument);
  // 初始化非热区的内容
  initNoHotSpotHover(svgDocument);
}
// 作为变量，判断当前是以哪种方式进行的初始化
let initFlag = '1';
// 初始化非热区的svg点击区域
function initNoHotSpotHover(svgDocument) {
  const allHotSpot = svgDocument.querySelectorAll('text');
  // const allHotSpot = svgDocument.querySelectorAll('text')
  if (allHotSpot.length > 0) {
    initFlag = '2';
  }
  allHotSpot.forEach(node => {
    // 有的标签包裹一层desc标签 区分出来
    let nodeId = '';
    if (node.querySelector('desc')) {
      nodeId = node.querySelector('desc').textContent;
    } else {
      nodeId = node.textContent;
    }
    // const pathEle = node.previousElementSibling;
    // if (pathEle) {
    //   pathEle.style.cursor = 'pointer';
    //   pathEle.addEventListener(localStorage.getItem('isMobile') === '0' ? 'touchstart' : 'click', () => {
    //     if (!pathEle.getAttribute('oldFill')) {
    //       pathEle.setAttribute('oldFill', pathEle.getAttribute('fill'));
    //     }
    //     // selectSvgGraph(nodeId);
    //     changePartItem(nodeId);
    //   });
    // }
    // if (pathEle && pathEle.previousElementSibling) {
    //   var lineEle = pathEle.previousElementSibling;
    // }
    // if (lineEle) {
    //   lineEle.style.cursor = 'pointer';
    //   lineEle.addEventListener(localStorage.getItem('isMobile') === '0' ? 'touchstart' : 'click', () => {
    //     if (!pathEle.getAttribute('oldFill')) {
    //       pathEle.setAttribute('oldFill', pathEle.getAttribute('fill'));
    //     }
    //     // selectSvgGraph(nodeId);
    //     changePartItem(nodeId);
    //   });
    // }
    node.style.cursor = 'pointer';
    node.addEventListener(localStorage.getItem('isMobile') === '0' ? 'touchstart' : 'click', () => {
      // if (!pathEle.getAttribute('oldFill')) {
      //   pathEle.setAttribute('oldFill', pathEle.getAttribute('fill'));
      // }
      selectSvgGraph(nodeId);
      changePartItem(nodeId);
    });
  });
}
// 更改列表中的选中
function changePartItem(item) {
  emit('selectPartListItem', item);
}
// 将热点区域变成可点击的手
function initSvgCursorGrab(svgDocument) {
  if (!svgDocument) return;
  const svgEle = svgDocument.querySelector('svg');
  svgEle && (svgEle.style.cursor = 'grab');
}
// 清除选中的热点区域
function clearSelectStyle(svgDocument) {
  if (!svgDocument) return;
  const targetGpathArr = svgDocument.querySelectorAll('g.callout > path');
  targetGpathArr.forEach(el => {
    el.setAttribute('fill', '#fff');
  });
}
// 初始化热区的选择
// 为了保障代码的准去行，如果存在热区则先移除
function initHotSpotHover(svgDocument) {
  if (!svgDocument) return;
  const nodeListOf = svgDocument.querySelectorAll('path.hotspot');
  if (nodeListOf.length > 0) {
    // 如果存在热区则进行处理
    nodeListOf.forEach(node => {
      const pNode = node.parentElement;
      pNode.removeChild(node);
    });
    return;
    // nodeListOf = svgDocument.querySelectorAll('g.callout')
  }
  if (nodeListOf.length > 0) {
    initFlag = '1';
  }
  nodeListOf.forEach(node => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      let targetIndex = -1;
      node.classList.forEach(item => {
        const clsArr = item.split('_');
        if (clsArr.length > 1) {
          targetIndex = clsArr[1];
        }
      });
      if (targetIndex !== -1) {
        selectSvgGraph(targetIndex, 'svgClick');
        changePartListItem(targetIndex);
      }
    });
  });
}

function changePartListItem(targetIndex) {
  emit('selectPartListItem', targetIndex);
}
function clearSvgOtherSelect(svgDocument) {
  // const textNodeList = svgDocument.querySelectorAll('text[id^=AUTOID]')
  const textNodeList = svgDocument.querySelectorAll('text');
  textNodeList.forEach(node => {
    const pathEle = node.previousElementSibling;
    if (pathEle && pathEle.getAttribute('oldFill')) {
      pathEle.setAttribute('fill', pathEle.getAttribute('oldFill'));
    }
  });
}
// 根据内容选中目标元素
function findTargetEle(hotspotId) {
  const textEles = _svg.querySelectorAll(`text`);
  let targetEle = null;
  textEles.forEach(item => {
    // 有的标签包裹一层desc标签 区分出来
    if (item.querySelector('desc')) {
      let descContent = item.querySelector('desc').textContent;
      if (descContent == hotspotId) {
        targetEle = item;
      }
    } else {
      if (item.textContent == hotspotId) {
        targetEle = item;
      }
    }
  });
  return targetEle;
}
// 根据热点选中数据
function selectSvgGraph(hotspotId, flag) {
  hotspotId = String(hotspotId);
  if (!_svg) return;
  initFlag === '1' && clearSelectStyle(_svg);
  initFlag === '2' && clearSvgOtherSelect(_svg);
  if (initFlag === '1') {
    const targetGpath = _svg.querySelector(`g.callout_${hotspotId} > path`);
    // targetGpath && targetGpath.setAttribute("fill", "pink");
    if (targetGpath) {
      if (!flag) {
        svgPan.reset();
        const { x, y } = targetGpath.getBBox();
        // viewBox
        const { viewBox, realZoom } = svgPan.getSizes();
        // svgPan.resetZoom()
        const divW = viewBox.width / 2;
        const divH = viewBox.height / 2;

        // svgPan.panBy({x, y: y * -1})
        svgPan.pan({ x: (x - divW) * -1 * realZoom, y: (y - divH) * -1 * realZoom });
        // svgPan.zoomAtPointBy(1, {x: (x - divW) * -1, y: (y - divH) * -1})
      }
      targetGpath.setAttribute('fill', '#6aa1ff');
    }
  }
  // const targetGpath = _svg.querySelector(`g.callout_${hotspotId} > path`)
  if (initFlag === '2') {
    const targetGpath = findTargetEle(hotspotId); // _svg.querySelector(`text[textContent='${hotspotId}']`)
    if (targetGpath) {
      if (!flag) {
        svgPan.reset();
        const { x, y } = targetGpath.getBBox();
        // viewBox
        const { viewBox, realZoom } = svgPan.getSizes();
        // svgPan.resetZoom()
        const divW = viewBox.width / 2;
        const divH = viewBox.height / 2;

        // svgPan.panBy({x, y: y * -1})
        svgPan.pan({ x: (x - divW) * -1 * realZoom, y: (y - divH) * -1 * realZoom });
        // svgPan.zoomAtPointBy(1, {x: (x - divW) * -1, y: (y - divH) * -1})
      }
      // previousElementSibling
      const pathEle = targetGpath;
      if (pathEle) {
        if (!pathEle.getAttribute('oldFill')) {
          pathEle.setAttribute('oldFill', pathEle.getAttribute('fill'));
        }
        pathEle.setAttribute('fill', '#6aa1ff');
      }
    }
  }
}

defineExpose({ loadSvg, selectSvgGraph });
</script>

<template>
  <a-spin :spinning="svgLoading" tip="加载中...">
    <div ref="svgContainerRef" style="position: relative; background-color: white">
      <div :id="svgContainerId" />
      <div class="btns">
        <div class="fullscreen-btn">
          <EpcIcon v-if="!isFullscreen" type="icon-fullscreen1" @click="toggle()" />
          <EpcIcon v-else type="icon-fullscreen_exit" @click="toggle()" />
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style lang="less" scoped>
.btns {
  position: absolute;
  top: 3px;
  right: 3px;
  .fullscreen-btn {
    color: blue;
    font-size: 24px;
  }
}
:deep(.ant-spin-spinning) {
  margin-top: 50px;
}
</style>
