# 图表

图表库使用的是 [echarts](https://echarts.apache.org/examples/zh/index.html#chart-type-line), 在框架中使用了更适合 `vue` 项目的 [vue-echarts](https://github.com/ecomfe/vue-echarts/blob/main/README.zh-Hans.md) 库

## 为什么要使用 vue-echarts

- 支持 `echarts` [按需引入 `echarts` 图表和组件](https://echarts.apache.org/handbook/zh/basics/import#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6)
- `options` 支持响应式: `options` 更新后图表也会重新渲染
- 支持在 `resize` 事件触发时重新渲染图标
- 更直观的 [事件处理](https://github.com/ecomfe/vue-echarts/blob/main/README.zh-Hans.md#%E4%BA%8B%E4%BB%B6) 方式
- 支持 [基于 `Provide / Inject` 的全局配置](https://github.com/ecomfe/vue-echarts/blob/main/README.zh-Hans.md#provide--inject): 可以全局控制图表配置, 例如 `theme` / `init-options` / `loading-options`

## 使用
1. 在 `src/utils/echarts.ts` [按需引入](https://echarts.apache.org/handbook/zh/basics/import#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6) 依赖的 `charts` / `echarts components`

```typescript
import { use } from 'echarts/core'
// 引入需要的图表
import {
  BarChart,
  PieChart,
  // ...
} from 'echarts/charts'
// 引入 echarts components
import {
  GridComponent,
  // ...
} from 'echarts/components'

/**
 * echarts 相关处理逻辑封装
 */
export class VueEchartsHandler {
  /** 按需加载 echarts 依赖项 */
  static include() {
    use([
      PieChart,
      BarChart,
      GridComponent,
      // ...
    ])
  }
  // ...
}
```

2. 使用 `<v-charts>` 组件

```vue
<template>
  <v-chart class="chart" :option="option" autoresize />
</template>
```

```typescript
import VChart from 'vue-echarts'
import { ref } from 'vue'
import type { EChartsOption } from 'echarts'

const option: EChartsOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
  ]
}
```
