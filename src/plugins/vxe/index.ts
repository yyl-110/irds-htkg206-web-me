import {
  VxeIcon,
  VxeInput,
  VxeLoading,
  // VxeGrid,
  VxePager,
  VxeSelect,
  VxeTooltip,
  // VxeToolbar,
  // VxeForm,
  // VxeFormItem,
  // VxeFormGather,
  // VxeCheckbox,
  // VxeCheckboxGroup,
  // VxeRadio,
  // VxeRadioGroup,
  // VxeRadioButton,
  // VxeSwitch,
  // VxeOptgroup,
  // VxeOption,
  // VxeTextarea,
  // VxeButton,
  // VxeButtonGroup,
  // VxeModal,
  // VxeDrawer,
  // VxeList,
  // VxePulldown
} from 'vxe-pc-ui';

import {
  VxeColumn,
  VxeGrid,
  VxeTable,
  VxeUI,
  // VxeColgroup,
  // VxeToolbar
} from 'vxe-table';

// 导入主题变量，也可以重写主题变量
import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import zhCN from 'vxe-pc-ui/lib/language/zh-CN'; // 简体中文

import type { App } from 'vue';

import type { VxeFormatsKey } from './formats';
import { vxeFormats } from './formats';
import type { VxeRenderersKey } from './renderer';
import { vxeRenderers } from './renderer';

/** VxeTable / VxeUI 全局处理类 */
export class WeiVxe {
  /**
   * 按需引入 vxe 依赖
   * @param app vue app
   */
  static init(app: App) {
    VxeUI.setI18n('zh-CN', zhCN);
    VxeUI.setLanguage('zh-CN');
    WeiVxe.includeTable(app);
    WeiVxe.includeUI(app);
    WeiVxe.initConfig();
    WeiVxe.addFormats();
    WeiVxe.addRenderers();
  }

  /**
   * 按需引入 vxe-table 组件
   * @param app vue app
   */
  static includeTable(app: App) {
    app.use(VxeTable);
    app.use(VxeGrid);
    app.use(VxeColumn);
  }

  /**
   * 按需引入 vxe-pc-ui 组件
   * @param app vue app
   */
  static includeUI(app: App) {
    app.use(VxeIcon);
    app.use(VxeLoading);
    app.use(VxeInput);
    app.use(VxePager);
    app.use(VxeTooltip);
    app.use(VxeSelect);
  }

  /**
   * 初始化 vxe-table / vxe-ui 的配置
   */
  static initConfig() {
    VxeUI.setConfig({
      table: {
        align: 'center',
        border: 'inner',
      },
      grid: {
        align: 'center',
        border: 'inner',
        pagerConfig: {
          enabled: true,
          total: 0,
          currentPage: 1,
          pageSize: 10,
          layouts: ['Home', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'End', 'Sizes', 'FullJump', 'Total'],
        },
      },
    });
  }

  /** 注册 formats */
  static addFormats() {
    for (const key in vxeFormats) VxeUI.formats.add(key, vxeFormats[key as VxeFormatsKey]);
  }

  /** 注册 renderers */
  static addRenderers() {
    for (const key in vxeRenderers) VxeUI.renderer.add(key, vxeRenderers[key as VxeRenderersKey]);
  }
}
