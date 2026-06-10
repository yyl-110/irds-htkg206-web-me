import type { Component } from 'vue';
import { defineComponent, h } from 'vue';
import CustomPageScope from '../components/CustomPageScope.vue';

type ModuleLoader = () => Promise<{ default: Component }>;

/** 为 custompage 路由页面包一层作用域，统一应用表格表头样式 */
export function withCustomPageScope(loader: ModuleLoader): () => Promise<{ default: Component }> {
  return () =>
    loader().then(mod => ({
      default: defineComponent({
        name: 'CustomPageScopedWrapper',
        inheritAttrs: true,
        setup(_props, { attrs, slots }) {
          return () =>
            h(CustomPageScope, null, {
              default: () => h(mod.default, { ...attrs }, slots),
            });
        },
      }),
    }));
}
