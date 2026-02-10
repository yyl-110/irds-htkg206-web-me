import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'vue3-common-framework',
  description: 'vue3-common-framework',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/assets/VUE3icon.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '介绍', link: '/framework/introduce' },
      { text: '快速开始', link: '/framework/start' },
      { text: '芋道文档', link: 'https://doc.iocoder.cn/vue3/dev-spec/' },
      { text: '芋道 Swagger', link: 'http://api-dashboard.yudao.iocoder.cn/swagger-ui/index.html' },
    ],

    sidebar: [
      {
        text: 'Project',
        items: [
          { text: '开始', link: '/project/start' },
        ],
      },
      {
        text: 'Framework',
        items: [
          { text: '介绍', link: '/framework/introduce' },
          { text: '开始', link: '/framework/start' },
          { text: '开发规范', link: '/framework/specifications' },
          { text: '注释', link: '/framework/comment' },
          { text: '路由', link: '/framework/route' },
          { text: '权限', link: '/framework/permission' },
          { text: '请求', link: '/framework/request' },
          { text: '组件', link: '/framework/component' },
          { text: '样式', link: '/framework/sheet' },
          { text: '图标', link: '/framework/icon' },
          { text: '主题', link: '/framework/theme' },
          { text: '图表', link: '/framework/charts' },
          { text: '多语言', link: '/framework/i18n' },
          { text: '代码生成', link: '/framework/codegen' },
          { text: 'Model Class', link: '/framework/Model' },
          { text: '单点登录', link: '/framework/sso-login' },
          { text: '字典', link: '/framework/dict' },
          { text: '日志埋点', link: '/framework/statistics-log' },
          { text: '软件测试', link: '/framework/test' },
          { text: '自动化', link: '/framework/automation' },
          { text: '数值运算', link: '/framework/calculator' },
          { text: '检查更新', link: '/framework/update' },
          { text: 'TypeScript 支持', link: '/framework/typescript' },
          { text: 'CHANGELOGS', link: '/framework/CHANGELOGS' },
        ],
      },
      {
        text: 'Other',
        items: [
          { text: 'Markdown extension', link: '/markdown-examples' },
        ],
      },
    ],

    outline: {
      level: [2, 4],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],

    search: {
      provider: 'local',
    },
  },
  lastUpdated: true,
})
