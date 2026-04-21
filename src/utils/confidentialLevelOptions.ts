/** 附件密级下拉：先按用户密级，再按外层表单密级上限收敛（与 upload-modal 一致） */
export type ConfidentialLevelOption = { label: string; value: number | string };

export function getEffectiveConfidentialLevelOptions(
  userLevels: ConfidentialLevelOption[],
  formUpperCap?: number | null,
): ConfidentialLevelOption[] {
  const base = userLevels;
  if (formUpperCap === undefined || formUpperCap === null) {
    return base;
  }
  const cap = Number(formUpperCap);
  if (!Number.isFinite(cap)) {
    return base;
  }
  return base.filter(o => Number(o.value) <= cap);
}
