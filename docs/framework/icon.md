# 图标

## 使用

```vue
<script lang="ts" setup>
import { BarChartOutlined } from '@ant-design/icons-vue'
import { WeiIcon } from '@/wei-components'
</script>

<template>
  <!-- 使用 `src/assets/svgs/` 目录下的 `svg` 文件作为图标 -->
  <WeiIcon icon="svg-icon:message" />

  <!-- 使用 iconify 图标 -->
  <WeiIcon icon="ep:aim" />

  <!-- 使用 ant-design-vue 图标 -->
  <WeiIcon icon="BarChartOutlined" />
</template>
```

## 图标选择器
提供了 `<wei-icon-select>` 用于选择在 `src/wei-components/WeiIcon/src/data.ts` 中定义的图标

```vue
<template>
  <a-input-group compact>
    <a-input v-model:value="formData.icon" placeholder="请选择图标" style="width: calc(100% - 200px)" />
    <wei-icon-select v-model="formData.icon">
      <a-button>
        <template #icon>
          <wei-icon :icon="formData.icon || 'svg-icon:select'" />
        </template>
      </a-button>
    </wei-icon-select>
  </a-input-group>
</template>
```

## 参考
- [iconify](https://iconify.design/)
- [Icon 图标 - 芋道](https://doc.iocoder.cn/vue3/icon/#_1-%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)
