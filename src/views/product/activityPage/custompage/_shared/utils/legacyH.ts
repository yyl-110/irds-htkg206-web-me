import { h, type VNode } from 'vue';
import { Input, Button, Select } from 'ant-design-vue';

const TAG_MAP: Record<string, unknown> = {
  Input,
  Button,
  Select,
  Option: Select.Option,
  'a-input': Input,
  'a-button': Button,
};

function mapEventProps(props: Record<string, unknown> | undefined) {
  if (!props) return props;
  const next: Record<string, unknown> = { ...props };
  const on = next.on as Record<string, unknown> | undefined;
  if (on && typeof on === 'object') {
    delete next.on;
    Object.entries(on).forEach(([key, handler]) => {
      const camel = key.replace(/^on-/, 'on').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const vue3Key = camel.startsWith('on')
        ? camel.charAt(0).toLowerCase() + camel.slice(1)
        : `on${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
      next[vue3Key] = handler;
    });
  }
  if ('value' in next && !('modelValue' in next)) {
    next.modelValue = next.value;
    delete next.value;
  }
  return next;
}

/** 兼容 Vue2 + iView 的 h('Input', { props, on }) 写法 */
export function legacyH(
  type: string | unknown,
  props?: Record<string, unknown> | string | number | null,
  children?: unknown,
): VNode {
  const resolved = typeof type === 'string' ? (TAG_MAP[type] ?? type) : type;
  if (props == null || typeof props === 'string' || typeof props === 'number') {
    return h(resolved as never, props as never, children as never);
  }
  const raw = props as Record<string, unknown>;
  const innerProps = (raw.props as Record<string, unknown> | undefined) ?? raw;
  return h(resolved as never, mapEventProps(innerProps) as never, children as never);
}
