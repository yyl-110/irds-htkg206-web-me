/**
 * 该方法是为了颜色基础类可以提供设置透明度的快捷方式
 * @param variable css variable
 */
function withOpacityValue(variable) {
  // 返回一个函数，透明度为可选参数，这样在 HTML 元素中使用颜色基础类时，既可以采用 text-blue-500 方式，也支持 text-blue-500/20 快捷同时设置透明度的形式
  return ({ opacityValue }) => {
    if (opacityValue === undefined)
      return `rgb(var(${variable}))`

    return `rgba(var(${variable}), ${opacityValue})`
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false, // tailwind 默认样式与设置主题的 ant-desing-vue 组件样式冲突, 禁用默认样式, 参考自 https://www.jianshu.com/p/2162daf865d9
  },
  important: true,
  theme: {
    extend: {
      // refer: https://www.tailwindcss.cn/docs/customizing-colors#-6
      colors: {
        primary: 'var(--ant-primary-color)',
      },
      // 设置字体颜色基础类
      textColor: {
        highlight: withOpacityValue('--color-highlight'),
        main: withOpacityValue('--color-text-main'),
        muted: withOpacityValue('--color-text-muted'),
        invert: withOpacityValue('--color-text-invert'),
        secondary: withOpacityValue('--color-text-secondary'),
      },
      // 设置背景颜色基础类
      // 其中 base 基础类是用于设置网页背景色，nav 基础类用于设置导航栏背景色
      // 其他的基础类是用于设置元素的填充背景色
      backgroundColor: {
        'highlight': withOpacityValue('--color-highlight'),
        'base': withOpacityValue('--color-bg-base'),
        'nav': withOpacityValue('--color-bg-nav'),
        'layout-header': withOpacityValue('--color-bg-layout-header'),
        'main': withOpacityValue('--color-fill-main'),
        'muted': withOpacityValue('--color-fill-muted'),
      },
      // 设置渐变颜色基础类
      gradientColorStops: {
        highlight: withOpacityValue('--color-highlight'),
      },
      // 设置表单外框阴影颜色基础类
      ringColor: {
        highlight: withOpacityValue('--color-highlight'),
      },
      // 设置卡片阴影颜色基础类
      boxShadowColor: {
        highlight: withOpacityValue('--color-highlight'),
      },
      // 设置边框颜色基础类
      borderColor: {
        highlight: withOpacityValue('--color-highlight'),
      },
      // 设置光标颜色基础类
      caretColor: {
        highlight: withOpacityValue('--color-highlight'),
      },
      // 设置表单强调色基础类
      accentColor: {
        highlight: withOpacityValue('--color-highlight'),
      },
    },

  },
  plugins: [],
}
