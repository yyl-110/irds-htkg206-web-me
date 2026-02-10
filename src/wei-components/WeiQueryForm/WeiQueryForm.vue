<script lang="ts" setup>
import { rowProps } from 'ant-design-vue/lib/grid/Row'; // 引入组件定义的 props
import { ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { WeiQueryFormItem } from '../index';
import { EpcIcon } from '@/components/icon/EpcIcon';

const props = defineProps(rowProps());

const emit = defineEmits<{
  query: [];
  reset: [];
}>();

// 定义 props

// const gutter = props.gutter || WeiQueryColGridConfig.ROW_GUTTER

const component = ref<FormInstance>();
const onResetForm = () => component.value?.resetFields();
</script>

<template>
  <a-form v-bind="props" ref="component">
    <div class="flex flex-wrap gap-4">
      <!-- <a-row :gutter="gutter"> -->
      <slot />
      <!-- 包含查询按钮的 col -->
      <WeiQueryFormItem>
        <a-button type="primary" @click="emit('query')">
          <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
          {{ $t('查询') }}
        </a-button>
        <slot name="action" />
      </WeiQueryFormItem>
      <!-- </a-row> -->
    </div>
  </a-form>
</template>
