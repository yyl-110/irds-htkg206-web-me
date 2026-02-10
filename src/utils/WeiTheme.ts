import { useDark, useToggle } from '@vueuse/core';
// import { OverlayScrollbarTheme } from '@wei/vue-hooks'
import { ConfigProvider } from 'ant-design-vue';
import type { Theme } from 'ant-design-vue/es/config-provider';
import type { Ref } from 'vue';
import { computed, reactive, ref } from 'vue';
import { VxeUI } from 'vxe-pc-ui';

/** 主题色 */
export enum WeiThemeKey {
  /** 浪漫红 */
  red = 'red',
  /** 活力橙 */
  orange = 'orange',
  /** 金盏花 */
  gold = 'gold',
  /** 青柠绿 */
  lime = 'lime',
  /** 碧涛青 */
  cyan = 'cyan',
  /** 极致蓝 */
  brand = 'brand',
  /** 暗夜紫 */
  purple = 'purple',
  /** 品红 */
  magenta = 'magenta',
  /** 中性灰 */
  gray = 'gray',
}

export type WeiPageThemeName = 'light' | 'dark';

/**
 * 应用主题操作类
 *
 * ```typescript
 * import { WeiTheme } from '@/utils/WeiTheme'
 *
 * // 当前是否是夜间模式
 * WeiTheme.isDark
 *
 * // 切换夜间模式
 * WeiTheme.toggleDark()
 *
 * // 当前主题
 * WeiTheme.theme
 *
 * // 切换主题
 * WeiTheme.theme = 'purple'
 *
 * // 获取所有主题静态数据
 * WeiTheme.Themes
 * ```
 */
export class WeiTheme {
  /** (dark)当前主题 Key */
  static themeValue = ref<WeiPageThemeName>('light');
  /** 页面中插入的 <link> 的 id */
  static THEME_LINK_ID: string = 'wei-theme-link';
  /** 本地存储的 key 前缀 */
  static THEME_LOCALSTORAGE_KEY: string = 'wei-theme';

  /** 默认主题 key */
  static DEFAULT_THEME_KEY: WeiThemeKey = WeiThemeKey.brand;

  /** 当前主题 key */
  private static currentTheme: Ref<WeiThemeKey> = ref((localStorage.getItem(WeiTheme.THEME_LOCALSTORAGE_KEY) as WeiThemeKey | null) || WeiTheme.DEFAULT_THEME_KEY);

  /** 当前主题 key */
  static theme = computed({
    /** get theme */
    get: () => WeiTheme.currentTheme.value,
    /**
     * set theme
     * @param key
     */
    set: (key?: WeiThemeKey) => {
      const theme = key || WeiTheme.DEFAULT_THEME_KEY;
      WeiTheme.currentTheme.value = theme;
      localStorage.setItem(WeiTheme.THEME_LOCALSTORAGE_KEY, theme);
      WeiTheme.init(theme);
    },
  });

  /**
   * 初始化主题样式
   * @param themeKey
   */
  static init(themeKey?: WeiThemeKey) {
    document.documentElement.setAttribute('data-wei-theme', themeKey || WeiTheme.theme.value);
    if (WeiTheme.isDark.value) WeiTheme.initDarkTheme(true);

    ConfigProvider.config({ theme: WeiTheme.Themes[WeiTheme.theme.value].theme });
  }

  /** 初始化页面模式 */
  static initDarkThemeLink() {
    const linkEl = document.createElement('link');
    linkEl.id = WeiTheme.THEME_LINK_ID;
    linkEl.rel = 'stylesheet';
    linkEl.type = 'text/css';
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(linkEl);
    return linkEl;
  }

  /** 获取页面主题 link */
  static getThemeLink() {
    const linkEl = document.querySelector(`link#${WeiTheme.THEME_LINK_ID}`) as HTMLLinkElement;
    return linkEl || WeiTheme.initDarkThemeLink();
  }

  /**
   * 初始化 dark 主题样式
   * @param dark
   */
  static initDarkTheme(dark: boolean) {
    const html = document.documentElement;
    const link = WeiTheme.getThemeLink();
    if (dark) {
      html.setAttribute('data-doc-theme', 'dark');
      html.style.colorScheme = 'dark';
      link.href = `/style/antd.dark.${WeiTheme.theme.value}.min.css`;
      WeiTheme.themeValue.value = 'dark';
      VxeUI.setTheme('dark');
    } else {
      html.setAttribute('data-doc-theme', 'light');
      html.style.colorScheme = 'light';
      link.href = '';
      WeiTheme.themeValue.value = 'light';
      VxeUI.setTheme('light');
    }
  }

  /** 滚动条指令的全局配置参数 */
  static overlayScrollbarsOptions = reactive({ scrollbars: { theme: '' } });

  /** 当前是否处于夜间模式 */
  static isDark = useDark({
    selector: 'html',
    attribute: 'data-doc-theme',
    valueDark: 'dark',
    valueLight: 'light',
    onChanged(dark) {
      WeiTheme.initDarkTheme(dark);
      WeiTheme.overlayScrollbarsOptions.scrollbars.theme = dark ? '' : '';
    },
  });

  /** 切换夜间模式 */
  static toggleDark = useToggle(WeiTheme.isDark);

  /**
   * WeiTheme
   * @param key
   * @param name
   * @param description
   * @param theme
   */
  constructor(
    public key: WeiThemeKey,
    public name: string,
    public description: string,
    public theme: Partial<Theme> = {}
  ) {}

  /** 多语言 key */
  public get i18nKey(): string {
    return `WeiTheme.${this.key}`;
  }

  static readonly Themes: Record<keyof typeof WeiThemeKey, WeiTheme> = {
    brand: new WeiTheme(WeiThemeKey.brand, '极致蓝', '探索钻研', { primaryColor: '#165DFF' }),
    red: new WeiTheme(WeiThemeKey.red, '浪漫红', '斗志奔放', { primaryColor: '#F53F3F' }),
    orange: new WeiTheme(WeiThemeKey.orange, '活力橙', '温暖欢快', { primaryColor: '#FF8D1F' }),
    gold: new WeiTheme(WeiThemeKey.gold, '金盏花', '活力积极', { primaryColor: '#F7C034' }),
    lime: new WeiTheme(WeiThemeKey.lime, '青柠绿', '自然生机', { primaryColor: '#9FDB1D' }),
    cyan: new WeiTheme(WeiThemeKey.cyan, '碧涛青', '希望坚强', { primaryColor: '#14C9C9' }),
    purple: new WeiTheme(WeiThemeKey.purple, '暗夜紫', '优雅浪漫', { primaryColor: '#722ED1' }),
    magenta: new WeiTheme(WeiThemeKey.magenta, '品红', '明快感性', { primaryColor: '#F5319D' }),
    gray: new WeiTheme(WeiThemeKey.gray, '中性灰', '中性灰', { primaryColor: '#86909C' }),
  };
}
