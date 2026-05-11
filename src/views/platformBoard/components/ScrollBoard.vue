<template>
  <div class="dv-scroll-board" ref="scrollBoardRef">
    <!-- 表头 -->
    <div
      v-if="mergedConfig.header.length"
      class="dv-scroll-board-header"
      :style="{ backgroundColor: mergedConfig.headerBGC }"
    >
      <div
        v-for="(item, index) in mergedConfig.header"
        :key="`header-${index}`"
        class="dv-scroll-board-header-item"
        :style="getHeaderStyle(index)"
        v-html="item"
      />
    </div>

    <!-- 表体 -->
    <div
      class="dv-scroll-board-rows-wrapper"
      ref="rowsWrapperRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div
        class="dv-scroll-board-rows"
        :style="rowsStyle"
      >
        <div
          v-for="(row, rowIndex) in displayRows"
          :key="`row-${rowIndex}-${row._rowKey}`"
          class="dv-scroll-board-row"
          :style="getRowStyle(rowIndex)"
          @click="handleRowClick(row, rowIndex)"
        >
          <!-- 序号列 -->
          <div
            v-if="mergedConfig.index"
            class="dv-scroll-board-cell dv-scroll-board-index"
            :style="getIndexCellStyle()"
          >
            <span :style="{ color: mergedConfig.indexHeader ? '' : 'inherit' }">
              {{ row._index }}
            </span>
          </div>
          <!-- 数据列 -->
          <div
            v-for="(cell, cellIndex) in row._data"
            :key="`cell-${cellIndex}`"
            class="dv-scroll-board-cell"
            :style="getCellStyle(cellIndex)"
            v-html="cell"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['click', 'mouseover'])

// =============== 默认配置 ===============
const defaultConfig = {
  // 表头
  header: [],
  // 表头背景色
  headerBGC: '#00BAFF',
  // 表头高度
  headerHeight: 35,
  // 表头字体大小
  headerFontSize: 15,
  // 数据
  data: [],
  // 行数
  rowNum: 5,
  // 奇数行背景色
  oddRowBGC: '#003B51',
  // 偶数行背景色
  evenRowBGC: '#0A2732',
  // 等待时间(ms)
  waitTime: 2000,
  // 列宽度
  columnWidth: [],
  // 对齐方式
  align: [],
  // 是否显示行号
  index: false,
  // 行号表头
  indexHeader: '#',
  // 序号列宽度
  indexWidth: 50,
  // 轮播模式 'single' 单条 | 'page' 整页
  carousel: 'single',
  // 鼠标悬浮暂停
  hoverPause: true,
  // 字体大小
  fontSize: 13,
  // 字体颜色
  fontColor: '#fff',
}

// =============== 响应式状态 ===============
const scrollBoardRef = ref(null)
const rowsWrapperRef = ref(null)
const mergedConfig = ref({ ...defaultConfig })

// 滚动相关
const currentOffset = ref(0)
const isAnimating = ref(false)
const isPaused = ref(false)
let animationTimer = null
let scrollInterval = null

// 容器高度
const containerHeight = ref(0)

// =============== 计算属性 ===============

// 每行高度
const rowHeight = computed(() => {
  if (!containerHeight.value) return 0
  const headerH = mergedConfig.value.header.length ? mergedConfig.value.headerHeight : 0
  return (containerHeight.value - headerH) / mergedConfig.value.rowNum
})

// 处理后的数据行
const processedRows = computed(() => {
  const { data, index } = mergedConfig.value
  if (!data || !data.length) return []

  return data.map((row, i) => ({
    _index: i + 1,
    _data: row,
    _rowKey: i,
  }))
})

// 需要滚动的数据（复制一份以实现无缝滚动）
const displayRows = computed(() => {
  const rows = processedRows.value
  if (!rows.length) return []

  // 如果数据行数 <= 显示行数，无需滚动
  if (rows.length <= mergedConfig.value.rowNum) {
    return rows
  }

  // 复制一份数据以实现无缝滚动
  return [...rows, ...rows.map((r, i) => ({ ...r, _rowKey: r._rowKey + rows.length + i }))]
})

// 是否需要滚动
const needScroll = computed(() => {
  return processedRows.value.length > mergedConfig.value.rowNum
})

// 行容器的样式
const rowsStyle = computed(() => {
  return {
    transform: `translateY(${currentOffset.value}px)`,
    transition: isAnimating.value ? 'transform 0.5s ease-in-out' : 'none',
  }
})

// =============== 样式方法 ===============
function getHeaderStyle(index) {
  const { columnWidth, align, headerFontSize, index: showIndex, indexWidth } = mergedConfig.value
  const style = {
    fontSize: `${headerFontSize}px`,
    lineHeight: `${mergedConfig.value.headerHeight}px`,
    height: `${mergedConfig.value.headerHeight}px`,
  }

  // 计算实际列索引（考虑序号列偏移）
  const colIndex = showIndex ? index - (index === 0 ? 0 : 0) : index

  if (showIndex && index === 0) {
    // 序号表头
    style.width = `${indexWidth}px`
    style.minWidth = `${indexWidth}px`
    style.textAlign = 'center'
  } else {
    const adjustedIndex = showIndex ? index - 1 : index
    if (columnWidth[adjustedIndex]) {
      style.width = `${columnWidth[adjustedIndex]}px`
      style.minWidth = `${columnWidth[adjustedIndex]}px`
    } else {
      style.flex = '1'
    }
    style.textAlign = align[adjustedIndex] || 'left'
  }

  return style
}

function getRowStyle(rowIndex) {
  const { oddRowBGC, evenRowBGC } = mergedConfig.value
  const actualIndex = rowIndex % processedRows.value.length
  return {
    height: `${rowHeight.value}px`,
    lineHeight: `${rowHeight.value}px`,
    backgroundColor: actualIndex % 2 === 0 ? oddRowBGC : evenRowBGC,
  }
}

function getIndexCellStyle() {
  const { indexWidth } = mergedConfig.value
  return {
    width: `${indexWidth}px`,
    minWidth: `${indexWidth}px`,
    textAlign: 'center',
  }
}

function getCellStyle(cellIndex) {
  const { columnWidth, align, fontSize, fontColor } = mergedConfig.value
  const style = {
    fontSize: `${fontSize}px`,
    color: fontColor,
  }

  if (columnWidth[cellIndex]) {
    style.width = `${columnWidth[cellIndex]}px`
    style.minWidth = `${columnWidth[cellIndex]}px`
  } else {
    style.flex = '1'
  }

  style.textAlign = align[cellIndex] || 'left'

  return style
}

// =============== 滚动逻辑 ===============
function startScroll() {
  stopScroll()

  if (!needScroll.value) return

  const { waitTime, carousel } = mergedConfig.value

  scrollInterval = setInterval(() => {
    if (isPaused.value) return
    scroll()
  }, waitTime)
}

function scroll() {
  if (!needScroll.value) return

  const { carousel } = mergedConfig.value
  const totalOriginalRows = processedRows.value.length
  const scrollAmount = carousel === 'page'
    ? rowHeight.value * mergedConfig.value.rowNum
    : rowHeight.value

  isAnimating.value = true
  currentOffset.value -= scrollAmount

  // 检查是否滚完了原始数据
  const maxOffset = -(totalOriginalRows * rowHeight.value)

  setTimeout(() => {
    if (currentOffset.value <= maxOffset) {
      isAnimating.value = false
      currentOffset.value = 0
    }
  }, 500)
}

function stopScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval)
    scrollInterval = null
  }
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
}

function handleMouseEnter() {
  if (mergedConfig.value.hoverPause) {
    isPaused.value = true
  }
}

function handleMouseLeave() {
  isPaused.value = false
}

function handleRowClick(row, rowIndex) {
  const actualIndex = rowIndex % processedRows.value.length
  emit('click', {
    row: row._data,
    index: actualIndex,
    rowIndex: row._index,
  })
}

// =============== 初始化 ===============
function mergeConfig() {
  const merged = { ...defaultConfig, ...props.config }

  // 如果有序号列，在表头前加入 indexHeader
  if (merged.index && merged.header.length) {
    merged.header = [merged.indexHeader || '#', ...merged.header]
  }

  mergedConfig.value = merged
}

function calcContainerHeight() {
  if (scrollBoardRef.value) {
    containerHeight.value = scrollBoardRef.value.clientHeight
  }
}

function init() {
  stopScroll()
  currentOffset.value = 0
  isAnimating.value = false
  isPaused.value = false

  mergeConfig()

  nextTick(() => {
    calcContainerHeight()
    nextTick(() => {
      startScroll()
    })
  })
}

// =============== 生命周期 ===============
onMounted(() => {
  init()

  // 监听容器尺寸变化
  if (window.ResizeObserver && scrollBoardRef.value) {
    const observer = new ResizeObserver(() => {
      calcContainerHeight()
    })
    observer.observe(scrollBoardRef.value)
    onBeforeUnmount(() => observer.disconnect())
  }
})

onBeforeUnmount(() => {
  stopScroll()
})

watch(
  () => props.config,
  () => {
    init()
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.dv-scroll-board {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #fff;
  font-family: inherit;

  .dv-scroll-board-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 15px;
    overflow: hidden;

    .dv-scroll-board-header-item {
      padding: 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }
  }

  .dv-scroll-board-rows-wrapper {
    overflow: hidden;
    flex: 1;
    height: 100%;

    .dv-scroll-board-rows {
      .dv-scroll-board-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        transition: background-color 0.3s;

        &:hover {
          cursor: pointer;
          filter: brightness(1.2);
        }

        .dv-scroll-board-cell {
          padding: 0 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }

        .dv-scroll-board-index {
          font-weight: bold;
          color: #52f5f9;
        }
      }
    }
  }
}
</style>
