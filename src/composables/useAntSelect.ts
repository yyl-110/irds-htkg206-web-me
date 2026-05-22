import { nextTick, type Ref } from 'vue';

type SelectExpose = { blur?: () => void } | null;

/** 选中后主动失焦，避免 show-search 下拉再次弹出 */
export function blurAntSelectAfterChange(selectRef: Ref<SelectExpose>) {
  nextTick(() => selectRef.value?.blur?.());
}

/** 将下拉挂载到触发器父节点，适用于 Modal 内 Select */
export function antSelectPopupContainer(triggerNode: HTMLElement) {
  return triggerNode.parentElement ?? document.body;
}
