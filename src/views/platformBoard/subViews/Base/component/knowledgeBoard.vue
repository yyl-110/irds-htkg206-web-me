<template>
  <div class="moduleBoardWrap">
    <div class="scrollBoard">
      <ScrollBoard :config="config" style="width:100%;height:100%" />
    </div>
  </div>
</template>

<script setup>
import ScrollBoard from '@/views/platformBoard/components/ScrollBoard.vue'
import dayjs from 'dayjs';

const props = defineProps({
  chartData: {
    type: Object,
    default: () => null,
  },
})

const config = ref({})

const initTable = () => {
  const data = props.chartData
  if (!data || !data.months || !data.firstLevelCategories) return

  // 表头：第一列为分类名，后面列为月份（格式化为 M月）
  const header = ['分类', ...data.months.map(m => dayjs(m).format('M月'))]

  // 每一行：分类名 + 各月份数量（从 cells 中查找）
  const tableData = data.firstLevelCategories.map(category => {
    const row = [category]
    data.months.forEach(month => {
      const key = `${category}|${month}`
      row.push(data.cells[key] || '0')
    })
    return row
  })

  config.value = {
    header,
    data: tableData,
    columnWidth: [95],
    align: ['center'],
    headerBGC: '#043C64',
    oddRowBGC: '#051841',
    evenRowBGC: 'transparent',
    waitTime: 3000,
    rowNum: 7,
  }
}

// ====== Mock 数据（预览用）======
const mockData = () => {
  config.value = {
    header: ['分类', '1月', '2月', '3月', '4月', '5月', '6月'],
    data: [
      ['技术文档', '45', '67', '89', '56', '78', '92'],
      ['操作手册', '32', '41', '58', '63', '47', '71'],
      ['培训资料', '78', '92', '105', '87', '96', '113'],
      ['规范标准', '23', '35', '42', '38', '29', '51'],
      ['案例库', '56', '64', '73', '81', '69', '88'],
    ],
    columnWidth: [95],
    align: ['center'],
    headerBGC: '#043C64',
    oddRowBGC: '#051841',
    evenRowBGC: 'transparent',
    waitTime: 3000,
    rowNum: 7,
  }
}

watch(() => props.chartData, () => {
  initTable()
}, { deep: true })

</script>

<style lang="less" scoped>
.moduleBoardWrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;

  .scrollBoard {
    width: 100%;
    height: 100%;
  }
}
</style>