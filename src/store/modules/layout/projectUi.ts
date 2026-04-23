import { defineStore } from 'pinia';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { menuBgLuminance, parseMenuBgHex } from '@/utils/menuThemeChrome';
import type { WeiThemeKey } from '@/utils/WeiTheme';
import { WeiTheme } from '@/utils/WeiTheme';

export type ProjectMenuCollapsePos = 'header' | 'bottom';

const THEME_SWATCHES: Record<WeiThemeKey, string> = {
  deepBlue: '#124dd6',
  brand: '#165DFF',
  red: '#F53F3F',
  orange: '#FF8D1F',
  gold: '#F7C034',
  lime: '#9FDB1D',
  cyan: '#14C9C9',
  purple: '#722ED1',
  magenta: '#F5319D',
  gray: '#86909C',
};

const DEFAULT_HEADER_BG = '#ffffff';
const DEFAULT_MENU_BG = '#1a3677';

const VALID_THEME_KEYS = new Set<string>(Object.keys(THEME_SWATCHES));

/** 服务端 styleJson（字符串或对象）解析后的形状 */
export type PageStylePayload = {
  systemThemeKey?: WeiThemeKey;
  headerBg?: string;
  menuBg?: string;
  menuCollapsePosition?: ProjectMenuCollapsePos;
  showTabs?: boolean;
  grayscale?: boolean;
  colorWeak?: boolean;
};

function parseStyleJsonField(raw: unknown): PageStylePayload | null {
  if (raw == null || raw === '') return null;
  try {
    if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
      return raw as PageStylePayload;
    }
    if (typeof raw === 'string') {
      const s = raw.trim();
      if (!s) return null;
      return JSON.parse(s) as PageStylePayload;
    }
    return null;
  } catch {
    return null;
  }
}

export const useProjectUiStore = defineStore('projectUi', {
  state: () => ({
    settingsDrawerOpen: false,

    /** 系统主题色（Ant Design primary） */
    systemThemeKey: 'deepBlue' as WeiThemeKey,
    headerBg: DEFAULT_HEADER_BG,
    menuBg: DEFAULT_MENU_BG,

    menuCollapsePosition: 'header' as ProjectMenuCollapsePos,

    showTabs: true,
    grayscale: false,
    colorWeak: false,
  }),

  getters: {
    themeSwatches: () => THEME_SWATCHES,

    showSider: () => true,
    menuInHeader: () => false,
    siderOnRight: () => false,
    collapseInHeader: state => state.menuCollapsePosition === 'header',
    menuPositionForRoutes: (): 'top' | 'left' => 'left',
  },

  actions: {
    openSettings() {
      this.settingsDrawerOpen = true;
    },
    closeSettings() {
      this.settingsDrawerOpen = false;
    },

    setSystemThemeKey(k: WeiThemeKey) {
      this.systemThemeKey = k;
      WeiTheme.theme = k;
      this.applyDomEffects();
    },

    setHeaderBg(hex: string) {
      this.headerBg = hex;
      this.applyDomEffects();
    },

    setMenuBg(hex: string) {
      this.menuBg = hex;
      this.applyDomEffects();
    },

    applyDomEffects() {
      const root = document.documentElement;
      WeiTheme.theme = this.systemThemeKey;
      WeiTheme.isDark.value = false;

      /** 与「系统主题」色板一致，供侧栏选中等使用（:root 里 --ant-primary-color 可能被 common.less 钉死） */
      const systemPrimary =
        WeiTheme.Themes[this.systemThemeKey].theme.primaryColor ?? THEME_SWATCHES[this.systemThemeKey];
      root.style.setProperty('--project-system-primary', systemPrimary);

      root.style.setProperty('--project-header-bg', this.headerBg);

      /** 顶栏近白底 → 深色字/图标；否则 → 白色字/图标 */
      const hdrRgb = parseMenuBgHex(this.headerBg);
      const hdrLight = menuBgLuminance(hdrRgb) >= 0.92;
      const fg = hdrLight ? '#1f2937' : '#ffffff';
      root.style.setProperty('--project-header-fg', fg);
      root.style.setProperty(
        '--project-header-divider',
        hdrLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.35)',
      );
      root.classList.toggle('project-ui-grayscale', this.grayscale);
      root.classList.toggle('project-ui-color-weak', this.colorWeak);
    },

    resetToDefaults() {
      this.$patch({
        systemThemeKey: 'deepBlue' as WeiThemeKey,
        headerBg: DEFAULT_HEADER_BG,
        menuBg: DEFAULT_MENU_BG,
        menuCollapsePosition: 'header',
        showTabs: true,
        grayscale: false,
        colorWeak: false,
      });
      WeiTheme.theme = this.systemThemeKey;
      this.applyDomEffects();
    },

    /**
     * 登录成功后拉取用户页面样式（优先于本地持久化缓存）。
     * 返回为空或解析失败时使用 {@link resetToDefaults}
     */
    async hydratePageStyleFromServer(userId: number) {
      if (!userId) {
        this.resetToDefaults();
        return;
      }
      try {
        const res = await AdminApiSystemUser.getPageStyle({ userId });
        const code = res?.data?.code;
        if (code !== 0 && code !== 200) {
          this.resetToDefaults();
          return;
        }
        const row = res?.data?.data as Record<string, unknown> | undefined;
        if (row == null || typeof row !== 'object') {
          this.resetToDefaults();
          return;
        }
        let rawJson: unknown;
        if ('styleJson' in row) {
          const sj = row.styleJson;
          if (sj == null || sj === '') {
            this.resetToDefaults();
            return;
          }
          rawJson = sj;
        } else {
          rawJson = row;
        }
        const parsed = parseStyleJsonField(rawJson);
        if (!parsed || Object.keys(parsed).length === 0) {
          this.resetToDefaults();
          return;
        }

        const sk = parsed.systemThemeKey;
        const systemThemeKey =
          typeof sk === 'string' && VALID_THEME_KEYS.has(sk) ? (sk as WeiThemeKey) : ('deepBlue' as WeiThemeKey);

        const collapse =
          parsed.menuCollapsePosition === 'bottom' || parsed.menuCollapsePosition === 'header'
            ? parsed.menuCollapsePosition
            : ('header' as ProjectMenuCollapsePos);

        this.$patch({
          systemThemeKey,
          headerBg: typeof parsed.headerBg === 'string' ? parsed.headerBg : DEFAULT_HEADER_BG,
          menuBg: typeof parsed.menuBg === 'string' ? parsed.menuBg : DEFAULT_MENU_BG,
          menuCollapsePosition: collapse,
          showTabs: typeof parsed.showTabs === 'boolean' ? parsed.showTabs : true,
          grayscale: Boolean(parsed.grayscale),
          colorWeak: Boolean(parsed.colorWeak),
        });
        WeiTheme.theme = this.systemThemeKey;
        this.applyDomEffects();
      } catch {
        this.resetToDefaults();
      }
    },
  },

  persist: {
    key: 'project-ui-settings',
    paths: ['systemThemeKey', 'headerBg', 'menuBg', 'menuCollapsePosition', 'showTabs', 'grayscale', 'colorWeak'],
  },
});
