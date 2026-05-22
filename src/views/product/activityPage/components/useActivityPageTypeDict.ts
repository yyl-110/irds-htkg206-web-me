import { computed, ref } from 'vue';
import { AdminApiSystemDictData } from '@/api/tags/管理后台字典数据';

const templatePageTypeOption = { label: '模板配置页面', value: '4' };

const isTemplateConfigPageLabel = (label: unknown) => {
  const text = String(label ?? '').trim();
  return text === '模板配置页面' || text.includes('模板配置');
};

/** 「模板配置页面」固定排在第二项 */
const orderPageTypeList = (list: { label: string; value: string }[]) => {
  const templateItem = list.find(item => isTemplateConfigPageLabel(item.label));
  const others = list.filter(item => !isTemplateConfigPageLabel(item.label));
  if (!templateItem) return others;
  if (others.length === 0) return [templateItem];
  const ordered = [...others];
  ordered.splice(1, 0, templateItem);
  return ordered;
};

/** 弹窗内 Select 下拉挂载到表单项，避免 getContainer 与焦点冲突 */
export function selectPopupContainer(triggerNode: HTMLElement) {
  return triggerNode.parentElement ?? document.body;
}

export function useActivityPageTypeDict() {
  const propTypeList = ref<any[]>([]);
  const isTestEnv =
    String(import.meta.env.VITE_BASE_URL_TEST ?? '')
      .replace(/['"]/g, '')
      .toLowerCase() === 'true';

  const displayPropTypeList = computed(() => {
    const list = (propTypeList.value || []).map((item: any) => ({
      label: String(item.label ?? ''),
      value: String(item.value ?? ''),
    }));
    const hasTemplate = list.some(item => isTemplateConfigPageLabel(item.label));
    if (isTestEnv) {
      const withTemplate = hasTemplate ? list : [...list, templatePageTypeOption];
      return orderPageTypeList(withTemplate);
    }
    return list.filter(item => !isTemplateConfigPageLabel(item.label));
  });

  const isTemplatePageType = (pageType: unknown) => {
    const pt = String(pageType ?? '');
    return displayPropTypeList.value.some(item => item.value === pt && isTemplateConfigPageLabel(item.label));
  };

  async function loadPageTypeDict() {
    const params: any = { dictType: 'page_type', pageNo: 1, pageSize: 100 };
    const res = await AdminApiSystemDictData.getDictTypePage(params);
    propTypeList.value = res.data.data?.list ?? [];
  }

  return {
    propTypeList,
    displayPropTypeList,
    loadPageTypeDict,
    isTemplatePageType,
    selectPopupContainer,
  };
}
