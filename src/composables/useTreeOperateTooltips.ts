import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 左侧分类树等通用工具栏（添加 / 编辑 / 上移 / 下移 / 删除）悬停提示文案。
 * 文案键：`tian-jia`、`bian-ji`、`shang-yi`、`xia-yi`、`shan-chu`（见 locales）。
 */
export function useTreeOperateTooltips() {
  const { t } = useI18n();
  return computed(() => ({
    add: String(t('添加')),
    edit: String(t('编辑')),
    up: String(t('上移')),
    down: String(t('下移')),
    del: String(t('删除')),
  }));
}
