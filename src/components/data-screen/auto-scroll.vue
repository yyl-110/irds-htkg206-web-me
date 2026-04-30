<template>
  <div class="auto-scroll" :id="id">
    <div
      v-if="showHeader"
      class="header-wrapper"
      :style="{
        backgroundColor: actualConfig.headerBGC,
        fontSize: `${actualConfig.headerFontSize}px`,
        color: actualConfig.headerColor,
      }">
      <div
        class="header-item text"
        v-for="(item, index) in actualHeaderData"
        v-html="item"
        :key="index"
        :style="{
          height: `${actualConfig.headerHeight}px`,
          lineHeight: `${actualConfig.headerHeight}px`,
          width: `${columnWidth[index]}px`,
          ...actualHeaderStyle[index],
        }"></div>
    </div>
    <div class="row-wrapper" :style="{ height: `${bodyHeight}px` }">
      <div
        class="row-list"
        v-for="(row, listIndex) in currentRowData"
        :key="`${row.index}-${listIndex}`"
        :style="{
          height: `${rowHeights[listIndex]}px`,
          lineHeight: `${rowHeights[listIndex]}px`,
          backgroundColor: row.index % 2 === 0 ? actualConfig.evenRowBGC : actualConfig.oddRowBGC,
          fontSize: `${actualConfig.rowFontSize}px`,
          color: actualConfig.rowColor,
        }">
        <div
          class="row-item text"
          v-for="(item, rowIndex) in row.data"
          :key="rowIndex"
          v-html="item"
          :style="{ width: `${columnWidth[rowIndex]}px`, ...actualRowStyle[rowIndex] }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { assign, cloneDeep } from 'lodash-es';
import useDomSize from '@/compositions/useDomSize.ts';

const props = withDefaults(
  defineProps<{
    config: any;
  }>(),
  {}
);

const defaultConfig = {
  // datav ScrollBoard header数据
  header: [],
  // datav ScrollBoard row数据
  data: [],
  // header数据
  headerData: [],
  // header样式
  headerStyle: [],
  // row数据
  rowData: [],
  // row样式
  rowStyle: [],
  // 是否使用索引
  indexFlag: false,
  // header索引内容
  headerIndexContent: '#',
  // row索引内容
  rowIndexContent: [],
  // header索引内容样式
  headerIndexStyle: {
    width: '80px',
  },
  // row索引内容样式
  rowIndexStyle: {
    width: '80px',
  },
  // 显示数据条数
  rowNum: 10,
  // 动画移动数据条数
  moveNum: 1,
  // 动画间隔时间
  duration: 2000,
  // datav ScrollBoard 动画间隔时间
  waitTime: 2000,
  // 内容位置
  align: [],
  aligns: [],
  // datav ScrollBoard 是否使用索引
  index: false,
  // datav ScrollBoard header索引内容
  indexHeader: '#',
  // datav ScrollBoard 轮播方式
  carousel: 'single',
  // datav ScrollBoard hover暂停
  hoverPause: true,
  // 公共样式
  commonBGC: '#fff',
  headerBGC: '#00BAFF',
  headerHeight: 35,
  headerFontSize: 15,
  headerColor: '#fff',
  oddRowBGC: '#003B51',
  evenRowBGC: '#0A2732',
  rowFontSize: 14,
  rowColor: '#fff',
};

const id = `basic-scroll-${Math.random().toString(36).substr(2, 9)}`;
const { width, height } = useDomSize(id);
const isAnimationStart = ref(true);
const animationSerial = ref(0);
const actualConfig = ref({}) as any;
const columnWidth = ref<number[]>([]);
const actualAligns = ref<string[]>([]);
const actualHeaderData = ref<any[]>([]);
const actualHeaderStyle = ref<any[]>([]);
const actualRowStyle = ref<any[]>([]);
const actualRowData = ref<any[]>([]);
const currentRowData = ref<any[]>([]);
const rowHeights = ref<number[]>([]);
const currentIndex = ref(0);
let avgHeight: number;
const hasOwn = (target: Record<string, any>, key: string) => Object.prototype.hasOwnProperty.call(target, key);
const showHeader = computed(() => actualHeaderData.value.length > 0);
const bodyHeight = computed(() => {
  const headerHeight = showHeader.value ? actualConfig.value.headerHeight || 0 : 0;
  return Math.max(0, height.value - headerHeight);
});

// 处理数据
const updateData = () => {
  animationSerial.value += 1;

  // 兼容 datav 的配置项名称
  const config = { ...props.config };
  if (hasOwn(config, 'header') && !hasOwn(config, 'headerData')) config.headerData = config.header;
  if (hasOwn(config, 'headerData') && !hasOwn(config, 'header')) config.header = config.headerData;
  if (hasOwn(config, 'data') && !hasOwn(config, 'rowData')) config.rowData = config.data;
  if (hasOwn(config, 'rowData') && !hasOwn(config, 'data')) config.data = config.rowData;
  if (hasOwn(config, 'align') && !hasOwn(config, 'aligns')) config.aligns = config.align;
  if (hasOwn(config, 'aligns') && !hasOwn(config, 'align')) config.align = config.aligns;
  if (hasOwn(config, 'index') && !hasOwn(config, 'indexFlag')) config.indexFlag = config.index;
  if (hasOwn(config, 'indexFlag') && !hasOwn(config, 'index')) config.index = config.indexFlag;
  if (hasOwn(config, 'indexHeader') && !hasOwn(config, 'headerIndexContent')) config.headerIndexContent = config.indexHeader;
  if (hasOwn(config, 'headerIndexContent') && !hasOwn(config, 'indexHeader')) config.indexHeader = config.headerIndexContent;
  if (hasOwn(config, 'duration') && !hasOwn(config, 'waitTime')) config.waitTime = config.duration;

  // 将人为定义的config与defaultConfig合并
  actualConfig.value = assign(cloneDeep(defaultConfig), config);
  // 处理header
  handleHeader();
  // 处理row
  handleRow();
  // 开始动画
  startAnimation(animationSerial.value);
};
// 处理header
const handleHeader = () => {
  const config = actualConfig.value;
  let _headerData = cloneDeep(config.headerData);
  let _headerStyle = cloneDeep(config.headerStyle);
  let _rowData = cloneDeep(config.rowData);
  let _rowStyle = cloneDeep(config.rowStyle);
  const _aligns = cloneDeep(config.aligns);
  const hasHeaderData = _headerData.length > 0;

  // 处理索引列数据
  if (config.indexFlag) {
    if (hasHeaderData) {
      _headerData = [config.headerIndexContent, ..._headerData];
      _headerStyle = [config.headerIndexStyle, ..._headerStyle];
    }
    _rowData = _rowData.map((item: any[], index: number) => {
      const row = Array.isArray(item) ? [...item] : [];
      const indexContent = config.rowIndexContent.length > 0 && config.rowIndexContent[index]
        ? config.rowIndexContent[index]
        : `<span class="index" style="background-color: ${config.headerBGC};">${index + 1}</span>`;
      row.unshift(indexContent);
      return row;
    });
    _rowStyle = [config.rowIndexStyle, ..._rowStyle];
    _aligns.unshift('center');
  }

  const columnCount = _headerData.length || _rowData[0]?.length || 0;
  if (!columnCount) {
    columnWidth.value = [];
    actualHeaderData.value = [];
    actualHeaderStyle.value = [];
    actualRowStyle.value = [];
    actualAligns.value = [];
    actualRowData.value = [];
    currentRowData.value = [];
    rowHeights.value = [];
    return;
  }

  _headerStyle = Array.from({ length: columnCount }, (_, index) => _headerStyle[index] ? { ..._headerStyle[index] } : {});
  _rowStyle = Array.from({ length: columnCount }, (_, index) => _rowStyle[index] ? { ..._rowStyle[index] } : {});

  if (Array.isArray(config.columnWidth)) {
    config.columnWidth.forEach((item: string | number, index: number) => {
      if (!_headerStyle[index] || !_rowStyle[index]) return;
      if (item === undefined || item === null || _headerStyle[index].width) return;
      const widthValue = typeof item === 'number' ? `${item}px` : item;
      _headerStyle[index].width = widthValue;
      _rowStyle[index].width = widthValue;
    });
  }

  if (Array.isArray(_aligns)) {
    _aligns.forEach((item: string, index: number) => {
      if (!_headerStyle[index] || !_rowStyle[index]) return;
      if (!item) return;
      if (!_headerStyle[index].textAlign) _headerStyle[index].textAlign = item;
      if (!_rowStyle[index].textAlign) _rowStyle[index].textAlign = item;
    });
  }

  // 动态计算宽度（个人定义的宽度优先）
  let usedWidth = 0;
  let usedColumnNum = 0;
  _headerStyle.forEach((item: any) => {
    if (item.width) {
      usedWidth += Number(item.width.replace('px', ''));
      usedColumnNum += 1;
    }
  });
  const autoColumnNum = Math.max(columnCount - usedColumnNum, 0);
  const avgWidth = autoColumnNum > 0 ? Math.max((width.value - usedWidth) / autoColumnNum, 0) : 0;
  const _columnWidth = new Array(columnCount).fill(avgWidth);
  _headerStyle.forEach((item: any, index: number) => {
    if (item.width) {
      _columnWidth[index] = Number(item.width.replace('px', ''));
    }
  });
  columnWidth.value = _columnWidth;

  actualHeaderData.value = _headerData;
  actualHeaderStyle.value = _headerStyle;
  actualRowStyle.value = _rowStyle;
  actualAligns.value = _aligns;
  // 为了滑动流畅，可以让滑动窗口大于等于两倍rowNum
  const { rowNum } = config;
  if (_rowData.length >= rowNum && _rowData.length < rowNum * 2) {
    _rowData = [..._rowData, ..._rowData];
  }
  actualRowData.value = _rowData.map((item: any, index: number) => ({
    data: item,
    index: index,
  }));
};
// 处理row
const handleRow = () => {
  let rowNum = actualConfig.value.rowNum;
  if (rowNum > actualRowData.value.length) {
    rowNum = actualRowData.value.length;
  }
  if (!rowNum) {
    avgHeight = 0;
    rowHeights.value = [];
    return;
  }
  avgHeight = bodyHeight.value / rowNum;
  rowHeights.value = new Array(Math.min(rowNum, actualRowData.value.length)).fill(avgHeight);
};
// 开始动画
const startAnimation = async (serial: number) => {
  if (!isAnimationStart.value) {
    return;
  }
  if (serial !== animationSerial.value) {
    return;
  }
  const config = actualConfig.value;
  const { rowNum, waitTime, carousel } = config;
  const totalNum = actualRowData.value.length;
  const moveNum = config.moveNum ?? (carousel === 'page' ? rowNum : 1);

  currentRowData.value = cloneDeep(actualRowData.value);

  if (totalNum <= rowNum) {
    rowHeights.value = new Array(totalNum).fill(avgHeight);
    return;
  }

  // 1. 数据首尾拼接
  const index = currentIndex.value;
  const _rowData = cloneDeep(actualRowData.value);
  const tempData = _rowData.slice(index);
  tempData.push(..._rowData.slice(0, index));
  currentRowData.value = tempData.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + moveNum);
  // 2.所有row的高度还原
  rowHeights.value = new Array(currentRowData.value.length).fill(avgHeight);
  const transitionWaitTime = 300;
  await sleep(transitionWaitTime);
  if (serial !== animationSerial.value) {
    return;
  }
  // 3. 将要消失的row高度设置为0
  rowHeights.value.splice(0, moveNum, ...new Array(moveNum).fill(0));
  currentIndex.value += moveNum;
  // 4. 判断是否达到最后一组数据
  const isLast = currentIndex.value - totalNum;
  if (isLast >= 0) {
    currentIndex.value = isLast;
  }
  // 5. 等待duration时间间隔并重复
  await sleep(Math.max(waitTime - transitionWaitTime, 0));
  if (serial !== animationSerial.value) {
    return;
  }
  await startAnimation(serial);
};

// 结束动画
const stopAnimation = () => {
  isAnimationStart.value = false;
};
const sleep = (duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

onMounted(() => {
  updateData();
});
onUnmounted(() => {
  stopAnimation();
});
watch(
  () => props.config,
  () => {
    updateData();
  },
  { deep: true }
);
watch([width, height], () => {
  if (!width.value || !height.value) return;
  updateData();
});
</script>

<style lang="less" scoped>
.auto-scroll {
  position: relative;
  height: 100%;
  width: 100%;
  color: #fff;

  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-wrapper {
    display: flex;
    flex-direction: row;
  }

  .header-item {
    padding: 0 10px;
    box-sizing: border-box;
    transition: all 0.3s;
  }

  .row-wrapper {
    overflow: hidden;

    .row-list {
      overflow: hidden;
      display: flex;
      transition: all 0.3s linear;
    }
  }

  .row-item {
    padding: 0 10px;
    box-sizing: border-box;
    transition: all 0.3s;
  }

  .index {
    border-radius: 3px;
    padding: 0 3px;
  }
}
</style>
