import type { App, Component, Plugin } from 'vue';
import { defineComponent, h, mergeProps } from 'vue';
import { AutoComplete, Cascader, Input, Select, TreeSelect, Textarea } from 'ant-design-vue';
import { ElInput } from 'element-plus';

type ComponentWithProps = Component & {
  name?: string;
  props?: Record<string, unknown>;
};

type ClearPropName = 'allowClear' | 'clearable';

/**
 * 为布尔 prop 设置默认值；显式传入 false 时仍以调用方为准。
 */
function patchBooleanPropDefault(component: ComponentWithProps, propName: string, defaultValue: boolean) {
  if (!component?.props) return;

  const prop = component.props[propName];
  if (!prop || typeof prop === 'function' || Array.isArray(prop)) {
    component.props[propName] = { type: Boolean, default: defaultValue };
    return;
  }

  if (typeof prop === 'object') {
    component.props[propName] = {
      ...(prop as Record<string, unknown>),
      type: (prop as { type?: unknown }).type ?? Boolean,
      default: defaultValue,
    };
  }
}

function isExplicitTrue(value: unknown): boolean {
  return value === true || value === '';
}

function resolveClearEnabled(
  props: Record<string, unknown>,
  attrs: Record<string, unknown>,
  clearProp: ClearPropName,
): boolean {
  const hyphenKey = clearProp === 'allowClear' ? 'allow-clear' : 'clearable';
  const explicit = props[clearProp] ?? attrs[clearProp] ?? attrs[hyphenKey];

  if (explicit === false) return false;
  if (isExplicitTrue(explicit)) return true;

  const disabled = props.disabled ?? attrs.disabled;
  if (disabled === true || disabled === '') return false;

  const readonly =
    props.readonly ??
    props.readOnly ??
    attrs.readonly ??
    attrs.readOnly ??
    attrs['read-only'];
  if (readonly === true || readonly === '') return false;

  return true;
}

/** 包装输入类组件：默认可清除，只读/禁用时不显示清除按钮（显式 allowClear 仍可覆盖） */
function wrapClearableComponent(Original: ComponentWithProps, clearProp: ClearPropName = 'allowClear'): Component {
  return defineComponent({
    name: `Clearable${Original.name ?? 'Component'}`,
    inheritAttrs: false,
    props: Original.props,
    setup(props, { attrs, slots }) {
      return () =>
        h(
          Original,
          mergeProps(attrs, props as Record<string, unknown>, {
            [clearProp]: resolveClearEnabled(
              props as Record<string, unknown>,
              attrs as Record<string, unknown>,
              clearProp,
            ),
          }),
          slots,
        );
    },
  }) as Component;
}

const ANT_CLEARABLE_COMPONENTS: ComponentWithProps[] = [
  Input,
  Textarea,
  Input.Password,
  Input.Search,
  Select,
  AutoComplete,
  TreeSelect,
  Cascader,
];

/** ant-design-vue 全局注册名 -> 组件 */
const ANT_APP_COMPONENTS: Array<[string, ComponentWithProps]> = [
  ['AInput', Input],
  ['ATextarea', Textarea],
  ['AInputPassword', Input.Password],
  ['AInputSearch', Input.Search],
  ['ASelect', Select],
  ['AAutoComplete', AutoComplete],
  ['ATreeSelect', TreeSelect],
  ['ACascader', Cascader],
];

function patchAntDesignVueDefaults() {
  for (const component of ANT_CLEARABLE_COMPONENTS) {
    patchBooleanPropDefault(component, 'allowClear', true);
  }
}

function patchElementPlusDefaults() {
  patchBooleanPropDefault(ElInput as ComponentWithProps, 'clearable', true);
}

function overrideRegisteredComponents(app: App) {
  for (const [name, original] of ANT_APP_COMPONENTS) {
    if (app.component(name)) {
      app.component(name, wrapClearableComponent(original));
    }
  }

  if (app.component('ElInput')) {
    app.component('ElInput', wrapClearableComponent(ElInput as ComponentWithProps, 'clearable'));
  }
}

const enableInputAllowClear: Plugin = {
  install(app: App) {
    patchAntDesignVueDefaults();
    patchElementPlusDefaults();
    overrideRegisteredComponents(app);
  },
};

export default enableInputAllowClear;
