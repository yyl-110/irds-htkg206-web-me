<script lang="ts" setup>
import Icon from '@ant-design/icons-vue';
import Iconify from '@purge-icons/generated';
// import { useDesign } from '@/hooks/web/useDesign'
import { computed, nextTick, ref, unref, watch } from 'vue';
import type { RouteMeta } from 'vue-router';
import { EpcIcon } from '@/components/icon/EpcIcon.js';

type Nullable<T> = T | null;
type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

defineOptions({ name: 'WeiIcon' });

const props = withDefaults(defineProps<ComponentProp>(), { size: 16, svgClass: '' });
interface ComponentProp {
  icon: RouteMeta['icon'];
  color?: string;
  size?: number;
  svgClass?: string;
}
const elRef = ref<ElRef>(null);

const isLocal = computed(() => (props.icon && typeof props.icon === 'string' ? props.icon.startsWith('svg-icon:') : ''));

const symbolId = computed(() => {
  return unref(isLocal) ? `#icon-${(props.icon && typeof props.icon === 'string' ? props.icon : '').split('svg-icon:')[1]}` : props.icon;
});

const getIconifyStyle = computed(() => {
  const { color, size } = props;
  return {
    fontSize: `${size}px`,
    color,
  };
});

const getSvgClass = computed(() => {
  const { svgClass } = props;
  return `iconify ${svgClass}`;
});

async function updateIcon(icon: ComponentProp['icon']) {
  if (unref(isLocal)) return;

  const el = unref(elRef);
  if (!el) return;

  await nextTick();

  if (!icon || typeof icon !== 'string') return;

  const svg = Iconify.renderSVG(icon, {});
  if (svg) {
    el.textContent = '';
    el.appendChild(svg);
  } else {
    const span = document.createElement('span');
    span.className = 'iconify';
    span.dataset.icon = icon;
    el.textContent = '';
    el.appendChild(span);
  }
}

watch(
  () => props.icon,
  (icon: ComponentProp['icon']) => {
    updateIcon(icon);
  }
);
</script>

<template>
  <Icon v-if="icon">
    <template #component="svgProps">
      <template v-if="typeof icon === 'string'">
        <!-- 本地 svg 图标 -->
        <svg v-if="isLocal" :class="getSvgClass" aria-hidden="true" v-bind="svgProps">
          <use :xlink:href="symbolId" />
        </svg>
        <!-- iconify 图标 -->
        <span v-else ref="elRef" :class="$attrs.class" :style="getIconifyStyle">
          <EpcIcon v-if="icon.indexOf('icon-') !== -1" :type="icon" style="font-size: 16px" />
          <span v-else :class="getSvgClass" :data-icon="symbolId" />
        </span>
      </template>
      <!-- ant-design-vue 或 自定义图标组件 -->
      <component :is="icon" v-else :style="getIconifyStyle" />
    </template>
  </Icon>
</template>
