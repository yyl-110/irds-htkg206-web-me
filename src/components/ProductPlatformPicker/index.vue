<script setup lang="ts">
import {
  PRODUCT_PLATFORM_DEFAULT_IMAGE,
  resolveProductPlatformImageUrl,
  type ProductPlatformListItem,
} from '@/utils/productPlatformImage';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    list: ProductPlatformListItem[];
    drawerStyle?: Record<string, unknown>;
    title?: string;
  }>(),
  {
    drawerStyle: () => ({}),
    title: '产品平台选择',
  },
);

const emit = defineEmits<{
  select: [item: ProductPlatformListItem];
  close: [];
}>();

function onSelect(item: ProductPlatformListItem) {
  emit('select', item);
}

function onImgError(event: Event) {
  const img = event.target as HTMLImageElement | null;
  if (!img || img.dataset.fallbackApplied === '1')
    return;
  img.dataset.fallbackApplied = '1';
  img.src = PRODUCT_PLATFORM_DEFAULT_IMAGE;
}
</script>

<template>
  <a-drawer
    :title="props.title"
    placement="left"
    :style="props.drawerStyle"
    :closable="false"
    :mask="true"
    :visible="props.visible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @blur="emit('close')"
    @close="emit('close')">
    <div
      v-for="(item, index) in props.list"
      :key="String(item.id ?? index)"
      class="platform-picker-item"
      @click="onSelect(item)">
      <img
        class="platform-picker-item__img"
        :src="resolveProductPlatformImageUrl(item)"
        :alt="String(item.categoryName ?? '平台')"
        @error="onImgError" />
      <a-badge>
        <div class="platform-picker-item__name">
          {{ item.categoryName }}
        </div>
      </a-badge>
    </div>
  </a-drawer>
</template>

<style lang="less" scoped>
:deep(.ant-drawer-content-wrapper) {
  width: 480px !important;
}

:deep(.ant-drawer-body) {
  padding: 2px;
}

.platform-picker-item {
  display: flex;
  background-color: #ecf5ff;
  margin: 15px 10px 0 10px;
  border-radius: 10px;
  height: 60px;
  cursor: pointer;

  &__img {
    width: 50px;
    height: 50px;
    margin: 5px;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__name {
    display: inline-block;
    margin: 20px 0 0 10px;
    color: rgba(0, 0, 0, 0.85);

    &:hover {
      transform: translateY(-2px);
      color: #165dff;
    }
  }
}
</style>
