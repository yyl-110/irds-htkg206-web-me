import { computed, ref } from 'vue';

export interface UseSplitpanesTreeCollapseOptions {
  /** 初始与展开恢复的左侧占比 */
  defaultSize?: number;
  /** 未折叠时左侧最小占比（部分页面原为 0） */
  minExpanded?: number;
  /** 拖动手松开后写入的最小左侧占比 */
  resizeMin?: number;
}

/**
 * 左侧分类树 + splitpanes：折叠收起 / 拖动记忆宽度 / 分隔条上浮动按钮定位
 */
export function useSplitpanesTreeCollapse(options: UseSplitpanesTreeCollapseOptions = {}) {
  const defaultSize = options.defaultSize ?? 20;
  const minExpanded = options.minExpanded ?? 15;
  const resizeMin = options.resizeMin ?? 5;

  const leftTreeCollapsed = ref(false);
  const treePaneSize = ref(defaultSize);
  const treePaneSizeBeforeCollapse = ref(defaultSize);

  const leftTreePaneSize = computed(() => (leftTreeCollapsed.value ? 0 : treePaneSize.value));
  const rightTreePaneSize = computed(() =>
    leftTreeCollapsed.value ? 100 : Math.max(0, 100 - treePaneSize.value),
  );

  function onSplitpanesResized(panes: any[]) {
    if (leftTreeCollapsed.value) return;
    const p0 = panes?.[0];
    if (!p0) return;
    const raw = p0.size;
    const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
    if (Number.isFinite(n) && n >= resizeMin) {
      treePaneSize.value = n;
    }
  }

  function toggleLeftTreePanel() {
    if (!leftTreeCollapsed.value) {
      treePaneSizeBeforeCollapse.value = treePaneSize.value > 0 ? treePaneSize.value : defaultSize;
      leftTreeCollapsed.value = true;
    } else {
      leftTreeCollapsed.value = false;
      treePaneSize.value = treePaneSizeBeforeCollapse.value || defaultSize;
    }
  }

  const splitToggleStyle = computed(() => {
    const top = 'calc(50% + 32px)';
    if (leftTreeCollapsed.value) {
      return {
        left: '2px',
        top,
        transform: 'translateY(-50%)',
      };
    }
    return {
      left: `${treePaneSize.value}%`,
      top,
      transform: 'translate(-50%, -50%)',
    };
  });

  return {
    leftTreeCollapsed,
    treePaneSize,
    treePaneSizeBeforeCollapse,
    leftTreePaneSize,
    rightTreePaneSize,
    minExpanded,
    onSplitpanesResized,
    toggleLeftTreePanel,
    splitToggleStyle,
  };
}
