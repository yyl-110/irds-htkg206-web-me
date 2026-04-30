import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { App } from 'vue'
import { computed } from 'vue'

import VChart, { THEME_KEY } from 'vue-echarts'
// 引入需要的图表
import {
  BarChart,
  GaugeChart,
  LineChart,
  PieChart,
  RadarChart,
  FunnelChart,
  PictorialBarChart,
} from 'echarts/charts'
// 引入 echarts components
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import { registerTheme } from 'echarts'
import { WeiTheme } from './WeiTheme'
import CustomDarkThemeJson from '@/assets/custom-dark.theme.json'

/**
 * echarts 相关处理逻辑封装
 */
export class VueEchartsHandler {
  /** 按需加载 echarts 依赖项 */
  static include() {
    use([
      PieChart,
      BarChart,
      GaugeChart,
      RadarChart,
      FunnelChart,
      PictorialBarChart,
      GridComponent,
      ToolboxComponent,
      LineChart,
      CanvasRenderer,
      TitleComponent,
      TooltipComponent,
      LegendComponent,
    ])
  }

  /** echarts 主题 */
  static theme = computed<string>(() => {
    return WeiTheme.isDark.value ? 'dark' : ''
  })

  /**
   * 加载 echarts 相关依赖
   * @param app
   */
  static init(app: App<Element>) {
    VueEchartsHandler.include()
    // 注册 Dark 主题
    registerTheme('dark', CustomDarkThemeJson)
    // 全局注册 v-chart 组件
    app.component('VChart', VChart)
    // 在 App 实例中添加 echarts 主题变量
    app.provide(THEME_KEY, VueEchartsHandler.theme)
  }
}
