import type { App, Plugin } from 'vue';

const SELECT_OPTION_SELECTOR = '.ant-select-item-option';

/**
 * 修复 Ant Design Vue Select（尤其 show-search）选中选项后下拉偶发再次弹出的问题。
 * 根因：选项 mousedown 后搜索输入框重新获得焦点，触发组件再次打开下拉。
 * @see https://github.com/ant-design/ant-design/issues/13448
 */
function installAntSelectDropdownFix() {
  document.addEventListener(
    'mousedown',
    event => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(SELECT_OPTION_SELECTOR)) return;
      event.preventDefault();
    },
    true,
  );

  document.addEventListener(
    'mouseup',
    event => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(SELECT_OPTION_SELECTOR)) return;
      requestAnimationFrame(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active?.matches('input')) return;
        if (!active.closest('.ant-select')) return;
        active.blur();
      });
    },
    true,
  );
}

const fixAntSelectDropdown: Plugin = {
  install(_app: App) {
    installAntSelectDropdownFix();
  },
};

export default fixAntSelectDropdown;
