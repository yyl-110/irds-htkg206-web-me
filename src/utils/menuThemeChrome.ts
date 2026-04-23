/** 解析 #RGB / #RRGGBB，失败时回退为深蓝 */
export function parseMenuBgHex(hex: string): [number, number, number] {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) {
    return [0x1a, 0x36, 0x77];
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixChannel(c: number, target: number, t: number) {
  return Math.round(c + (target - c) * t);
}

/** 相对亮度 0–1，用于区分浅/深侧栏 */
export function menuBgLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * 根据「菜单主题」底色生成侧栏与 ant-menu 用的 CSS 变量
 *（底栏、Logo 条、选中行、文字/悬停等）
 */
export function computeMenuChromeCssVars(menuBg: string): { vars: Record<string, string>; isLight: boolean } {
  const [r, g, b] = parseMenuBgHex(menuBg);
  const lum = menuBgLuminance([r, g, b]);
  /** 高亮底侧栏（橙/黄等）：用于 Ant 覆盖与选中条算法，与「是否白底黑字」不同 */
  const isLight = lum > 0.55;

  const darken = (t: number) =>
    `rgb(${mixChannel(r, 0, t)}, ${mixChannel(g, 0, t)}, ${mixChannel(b, 0, t)})`;

  const lighten = (t: number) =>
    `rgb(${mixChannel(r, 255, t)}, ${mixChannel(g, 255, t)}, ${mixChannel(b, 255, t)})`;

  /** 仅白/近白菜单底用黑字；其余（含橙、黄、深蓝）按非白底处理 */
  const nearWhiteMenuBg = lum > 0.85 && r >= 228 && g >= 228 && b >= 228;

  /** Logo 条略深于侧栏底 */
  const headerStrip = darken(0.045);

  /** 选中行背景：统一用项目配置的系统主题色（由 --project-system-primary 注入） */
  const activeBg = 'var(--project-system-primary, var(--ant-primary-color))';

  const textMain = nearWhiteMenuBg ? 'rgba(31, 41, 55, 0.92)' : '#ffffff';
  const textArrow = nearWhiteMenuBg ? 'rgba(31, 41, 55, 0.55)' : 'rgba(255, 255, 255, 0.75)';
  /** 悬停字色/图标色：与项目「系统主题」一致（--project-system-primary 由 projectUi.applyDomEffects 注入） */
  const accentHover = 'var(--project-system-primary, var(--ant-primary-color))';

  const submenuSelected = nearWhiteMenuBg ? textMain : '#ffffff';
  const submenuArrowSel = nearWhiteMenuBg ? textArrow : 'rgba(255, 255, 255, 0.88)';

  const footerBorder = nearWhiteMenuBg ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.1)';
  const collapseBtnColor = nearWhiteMenuBg ? 'rgba(31, 41, 55, 0.85)' : '#ffffff';

  const logoTitleColor = nearWhiteMenuBg ? 'rgba(15, 23, 42, 0.95)' : '#ffffff';

  return {
    isLight,
    vars: {
      '--project-menu-bg-header': headerStrip,
      '--project-menu-logo-text': logoTitleColor,
      '--project-menu-bg-active': activeBg,
      '--project-menu-text': textMain,
      '--project-menu-arrow': textArrow,
      '--project-menu-hover': accentHover,
      '--project-menu-submenu-selected': submenuSelected,
      '--project-menu-submenu-arrow-sel': submenuArrowSel,
      '--project-menu-footer-border': footerBorder,
      '--project-menu-collapse-btn': collapseBtnColor,
    },
  };
}
