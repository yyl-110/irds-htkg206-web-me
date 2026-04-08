<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { message } from 'ant-design-vue';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';

const props = defineProps({
  modalVisible: { type: Boolean, default: false },
  record: { type: Object, default: () => ({}) },
});

const emit = defineEmits<{ close: [] }>();
const visible = computed({ get: () => props.modalVisible, set: value => !value && emit('close') });

const previewList = computed(() => {
  const r = props.record || {};
  const merged = [
    ...(Array.isArray(r.basicComponentList) ? r.basicComponentList : []),
    ...(Array.isArray(r.threeDComponentList) ? r.threeDComponentList : []),
    ...(Array.isArray(r.uploadComponentList) ? r.uploadComponentList : []),
    ...(Array.isArray(r.tableComponentList) ? r.tableComponentList : []),
  ];
  return merged
    .slice()
    .sort((a: any, b: any) => (Number(a?.sortNo) || 0) - (Number(b?.sortNo) || 0))
    .map((item: any) => ({
      ...item,
      customProps: item?.customProps || {},
      constraintRules: Array.isArray(item?.constraintRules) ? item.constraintRules : [],
      validateRule: normalizeValidateRule(item?.validateRule),
    }));
});
/** 接口可能将 validateRule 序列化为 JSON 字符串 */
function normalizeValidateRule(raw: unknown): any {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return null;
    try {
      const p = JSON.parse(s);
      return typeof p === 'object' && p !== null ? p : null;
    } catch {
      return null;
    }
  }
  return typeof raw === 'object' ? raw : null;
}
const radioPreviewValueMap = ref<Record<string, string>>({});
/** 预览区可编辑字段本地值（与配置数据解耦，避免仅用 :value 导致无法输入） */
const previewFieldValueMap = ref<Record<string, string>>({});
/** 仅在失焦后触发范围校验（避免输入中频繁提示/变红） */
const inputRangeBlurredMap = ref<Record<string, boolean>>({});
/** 限制型范围失焦校验失败时回退到最近一次合法值 */
const inputLastValidValueMap = ref<Record<string, string>>({});
function getPreviewItemKey(item: any, index: number) {
  return String(item?.id ?? `${item?.componentType}-${index}`);
}
function getPreview3dSubKey(item: any, index: number, part: 'templateName' | 'modelName' | 'modelSelectName') {
  return `${getPreviewItemKey(item, index)}::${part}`;
}

function getSelectOptions(item: any) {
  const values = item?.customProps?.sequenceValues || [];
  if (!Array.isArray(values)) return [];
  return values.map((val: string) => (val || '').trim()).filter((val: string) => val !== '');
}
function getRadioOptions(item: any) {
  const raw = item?.customProps?.radioOptions;
  if (Array.isArray(raw) && raw.length) {
    return raw.map((val: string) => (val || '').trim()).filter((val: string) => val !== '');
  }
  const options = item?.customProps?.options;
  if (Array.isArray(options)) {
    return options
      .map((opt: any) => {
        if (opt == null) return '';
        if (typeof opt === 'string') return opt;
        return String(opt?.label ?? opt?.value ?? '');
      })
      .map((val: string) => val.trim())
      .filter((val: string) => val !== '');
  }
  return [];
}
function tableDimensionRange(count: number) {
  const n = Math.max(0, Math.min(100, Number(count) || 0));
  return Array.from({ length: n }, (_, i) => i + 1);
}
function isFullRowComponent(type: string) {
  return ['TEXTAREA', 'TITLE', 'RICH_TEXT', 'FILE', 'DIVIDER', 'RADIO', 'DATA_VIEW', 'TABLE', '3D_VIEW'].includes(type);
}
function isTemplateBrowse3DItem(item: any) {
  return item?.componentType === '3D_VIEW' && item?.customProps?.threeDSubtype === 'TEMPLATE_BROWSE';
}
function isModelSelect3DItem(item: any) {
  return item?.componentType === '3D_VIEW' && item?.customProps?.threeDSubtype === 'MODEL_SELECT';
}
function isFixedTemplate3DItem(item: any) {
  return item?.componentType === '3D_VIEW' && item?.customProps?.threeDSubtype === 'FIXED_TEMPLATE';
}
/** 输入输出类型为「输出」时预览不可编辑（与配置页 ioType 一致） */
function isOutputIoType(item: any) {
  return String(item?.ioType ?? 'INPUT').toUpperCase() === 'OUTPUT';
}
/** 兼容后端/配置里常见 Java 日期格式到 dayjs（Antd DatePicker）格式 */
function normalizeDateFormatForPicker(raw: unknown) {
  const fmt = String(raw ?? '').trim();
  if (!fmt) return 'YYYY-MM-DD';
  return fmt.replace(/yyyy/g, 'YYYY').replace(/yy/g, 'YY').replace(/dd/g, 'DD');
}
function previewDateDisplay(item: any, index: number) {
  const key = getPreviewItemKey(item, index);
  const s = previewFieldValueMap.value[key];
  if (!s) return null;
  const d = dayjs(s);
  return d.isValid() ? d : null;
}
function onPreviewDateChange(item: any, index: number, d: Dayjs | null) {
  const key = getPreviewItemKey(item, index);
  const fmt = normalizeDateFormatForPicker(item.customProps?.format);
  previewFieldValueMap.value = {
    ...previewFieldValueMap.value,
    [key]: d ? d.format(fmt) : '',
  };
}

watch(
  () => props.record,
  () => {
    previewFieldValueMap.value = {};
    inputRangeBlurredMap.value = {};
    inputLastValidValueMap.value = {};
  },
  { deep: false },
);

watch(
  previewList,
  list => {
    const old = previewFieldValueMap.value;
    const next: Record<string, string> = { ...old };
    const oldBlurred = inputRangeBlurredMap.value;
    const oldLastValid = inputLastValidValueMap.value;
    const nextBlurred: Record<string, boolean> = { ...oldBlurred };
    const nextLastValid: Record<string, string> = { ...oldLastValid };
    list.forEach((item: any, index: number) => {
      const key = getPreviewItemKey(item, index);
      const t = item?.componentType;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || t === 'DATE' || t === 'DATA_VIEW') {
        const paramVal = item?.paramValue != null ? String(item.paramValue) : '';
        if (!(key in next)) next[key] = paramVal;
      } else if (t === '3D_VIEW') {
        if (isTemplateBrowse3DItem(item) || isFixedTemplate3DItem(item)) {
          const k1 = getPreview3dSubKey(item, index, 'templateName');
          const k2 = getPreview3dSubKey(item, index, 'modelName');
          if (!(k1 in next)) next[k1] = String(item?.customProps?.templateName ?? '');
          if (!(k2 in next)) next[k2] = String(item?.customProps?.modelName ?? '');
        }
        if (isModelSelect3DItem(item)) {
          const k1 = getPreview3dSubKey(item, index, 'modelSelectName');
          if (!(k1 in next)) next[k1] = String(item?.customProps?.modelSelectName ?? '');
        }
      }
    });
    const valid = new Set<string>();
    list.forEach((item: any, index: number) => {
      const key = getPreviewItemKey(item, index);
      const t = item?.componentType;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || t === 'DATE' || t === 'DATA_VIEW') valid.add(key);
      else if (t === '3D_VIEW') {
        if (isTemplateBrowse3DItem(item) || isFixedTemplate3DItem(item)) {
          valid.add(getPreview3dSubKey(item, index, 'templateName'));
          valid.add(getPreview3dSubKey(item, index, 'modelName'));
        }
        if (isModelSelect3DItem(item)) valid.add(getPreview3dSubKey(item, index, 'modelSelectName'));
      }
    });
    Object.keys(next).forEach(k => {
      if (!valid.has(k)) delete next[k];
    });
    const inputValid = new Set<string>();
    list.forEach((item: any, index: number) => {
      if (item?.componentType !== 'INPUT') return;
      const key = getPreviewItemKey(item, index);
      inputValid.add(key);
      if (!(key in nextBlurred)) nextBlurred[key] = false;
      if (!(key in nextLastValid)) nextLastValid[key] = String(next[key] ?? '');
    });
    Object.keys(nextBlurred).forEach(k => {
      if (!inputValid.has(k)) delete nextBlurred[k];
    });
    Object.keys(nextLastValid).forEach(k => {
      if (!inputValid.has(k)) delete nextLastValid[k];
    });
    previewFieldValueMap.value = next;
    inputRangeBlurredMap.value = nextBlurred;
    inputLastValidValueMap.value = nextLastValid;
  },
  { immediate: true, deep: true },
);

watch(
  previewList,
  list => {
    const next: Record<string, string> = {};
    list.forEach((item: any, index: number) => {
      if (item?.componentType !== 'RADIO') return;
      const key = getPreviewItemKey(item, index);
      const opts = getRadioOptions(item);
      const oldVal = radioPreviewValueMap.value[key];
      const paramVal = String(item?.paramValue ?? '');
      if (oldVal && opts.includes(oldVal)) {
        next[key] = oldVal;
      } else if (paramVal && opts.includes(paramVal)) {
        next[key] = paramVal;
      } else {
        next[key] = opts[0] ?? '';
      }
    });
    radioPreviewValueMap.value = next;
  },
  { immediate: true, deep: true },
);

/** 限制关系：与配置页 constraintRules（refParamCode / operator / compareValue）一致，多条规则为 AND */
/** 与配置页 validateRule.valueRange（scopeType / operator / compareValue / compareValue2）一致 */
function normalizeRangeOperator(op: string) {
  return String(op ?? '')
    .trim()
    .replace(/≤/g, '<=');
}
function normalizeRangeHintOperator(op: string) {
  const s = String(op ?? '').trim().replace(/≤/g, '<=').replace(/≥/g, '>=');
  if (s === '<=') return '≤';
  if (s === '>=') return '≥';
  return s;
}

/** 接口可能只存 compareValue 为 2;10，与 compareValue2 二选一存在 */
function getResolvedValueRangeBounds(vr: any): { v1: string; v2: string } {
  const raw = String(vr?.compareValue ?? '')
    .trim()
    .replace(/；/g, ';');
  let v2 = String(vr?.compareValue2 ?? '').trim();
  const op = String(vr?.operator ?? '');
  if (op.includes(';') && v2 === '' && raw.includes(';')) {
    const idx = raw.indexOf(';');
    return {
      v1: raw.slice(0, idx).trim(),
      v2: raw.slice(idx + 1).trim(),
    };
  }
  return { v1: raw, v2 };
}
function getInputValueRangeHint(item: any): string {
  if (item?.componentType !== 'INPUT') return '';
  const vr = item?.validateRule?.valueRange;
  if (!vr || typeof vr !== 'object') return '';
  const opRaw = String(vr.operator ?? '').trim().replace(/；/g, ';');
  if (!opRaw) return '';
  const { v1, v2 } = getResolvedValueRangeBounds(vr);
  if (opRaw.includes(';')) {
    if (!v1 || !v2) return '';
    const [left = '<', right = '<'] = opRaw.split(';').map(s => normalizeRangeHintOperator(s));
    return `${v1} ${left} X ${right} ${v2}`;
  }
  if (!v1) return '';
  return `X ${normalizeRangeHintOperator(opRaw)} ${v1}`;
}

function hasValueRangeConfig(item: any): boolean {
  const vr = item?.validateRule?.valueRange;
  if (!vr || typeof vr !== 'object') return false;
  const op = normalizeRangeOperator(String(vr.operator ?? ''));
  const { v1, v2 } = getResolvedValueRangeBounds(vr);
  if (!op) return false;
  if (op.includes(';')) {
    return v1 !== '' && v2 !== '';
  }
  return v1 !== '';
}

/** 区间形式：左界 v1 op1 输入值 op2 右界 v2，如 `<; <=` 表示 v1 < 值 <= v2 */
function isValueWithinRange(inputRaw: string, vr: any): boolean {
  if (!vr || typeof vr !== 'object') return true;
  const input = String(inputRaw ?? '');
  const opRaw = normalizeRangeOperator(String(vr.operator ?? '='));
  const { v1, v2 } = getResolvedValueRangeBounds(vr);
  if (!opRaw) return true;
  if (!opRaw.includes(';')) {
    if (v1 === '') return true;
    return compareConstraintValues(input, opRaw, v1);
  }
  if (v1 === '' || v2 === '') return true;
  const parts = opRaw.split(';').map(s => normalizeRangeOperator(s.trim()));
  const op1 = parts[0] || '=';
  const op2 = parts[1] || '=';
  return compareConstraintValues(v1, op1, input) && compareConstraintValues(input, op2, v2);
}

function onPreviewInputValue(item: any, index: number, newVal: string) {
  const key = getPreviewItemKey(item, index);
  previewFieldValueMap.value = { ...previewFieldValueMap.value, [key]: newVal };
}
function onPreviewInputBlur(item: any, index: number) {
  if (item?.componentType !== 'INPUT' || isOutputIoType(item)) return;
  const key = getPreviewItemKey(item, index);
  inputRangeBlurredMap.value = { ...inputRangeBlurredMap.value, [key]: true };
  const vr = item?.validateRule?.valueRange;
  const raw = String(previewFieldValueMap.value[key] ?? '');
  const trimmed = raw.trim();
  if (!vr || typeof vr !== 'object' || !hasValueRangeConfig(item) || trimmed === '') {
    inputLastValidValueMap.value = { ...inputLastValidValueMap.value, [key]: raw };
    return;
  }
  const st = vr.scopeType;
  const scope = st == null || String(st).trim() === '' ? 'WARNING' : String(st).toUpperCase();
  const valid = isValueWithinRange(raw, vr);
  if (scope === 'REQUIRED' && !valid) {
    message.warning('输入值不符合取值范围限制');
    previewFieldValueMap.value = {
      ...previewFieldValueMap.value,
      [key]: String(inputLastValidValueMap.value[key] ?? ''),
    };
    return;
  }
  if (valid) {
    inputLastValidValueMap.value = { ...inputLastValidValueMap.value, [key]: raw };
  }
}

function isPreviewInputRangeError(item: any, index: number): boolean {
  if (item?.componentType !== 'INPUT') return false;
  const vr = item?.validateRule?.valueRange;
  if (!vr || typeof vr !== 'object') return false;
  const st = vr.scopeType;
  const scope = st == null || String(st).trim() === '' ? 'WARNING' : String(st).toUpperCase();
  if (scope !== 'WARNING') return false;
  if (!hasValueRangeConfig(item)) return false;
  const key = getPreviewItemKey(item, index);
  if (!inputRangeBlurredMap.value[key]) return false;
  const raw = String(previewFieldValueMap.value[key] ?? '');
  if (String(raw).trim() === '') return false;
  return !isValueWithinRange(raw, vr);
}

function compareConstraintValues(leftRaw: string, operator: string, rightRaw: string): boolean {
  const op = String(operator || '=').trim();
  const lt = String(leftRaw ?? '').trim();
  const rt = String(rightRaw ?? '').trim();
  const ln = Number(lt);
  const rn = Number(rt);
  const leftIsNum = lt !== '' && !Number.isNaN(ln);
  const rightIsNum = rt !== '' && !Number.isNaN(rn);
  if (leftIsNum && rightIsNum) {
    switch (op) {
      case '=':
        return ln === rn;
      case '!=':
        return ln !== rn;
      case '>':
        return ln > rn;
      case '>=':
        return ln >= rn;
      case '<':
        return ln < rn;
      case '<=':
        return ln <= rn;
      default:
        return lt === rt;
    }
  }
  switch (op) {
    case '=':
      return lt === rt;
    case '!=':
      return lt !== rt;
    case '>':
      return lt > rt;
    case '>=':
      return lt >= rt;
    case '<':
      return lt < rt;
    case '<=':
      return lt <= rt;
    default:
      return lt === rt;
  }
}

function getRefParamCurrentValueForPreview(refParamCode: string): string {
  const code = String(refParamCode ?? '').trim();
  if (!code) return '';
  const list = previewList.value;
  for (let i = 0; i < list.length; i++) {
    const it = list[i] as any;
    if (String(it?.paramCode ?? '').trim() !== code) continue;
    const key = getPreviewItemKey(it, i);
    const t = it?.componentType;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || t === 'DATE' || t === 'DATA_VIEW') {
      return String(previewFieldValueMap.value[key] ?? it?.paramValue ?? '');
    }
    if (t === 'RADIO') {
      return String(radioPreviewValueMap.value[key] ?? it?.paramValue ?? '');
    }
    return String(it?.paramValue ?? '');
  }
  return '';
}

function isPreviewConstraintVisible(item: any): boolean {
  const rules = item?.constraintRules;
  if (!Array.isArray(rules) || rules.length === 0) return true;
  return rules.every((rule: any) => {
    const refCode = String(rule?.refParamCode ?? '').trim();
    if (!refCode) return true;
    const left = getRefParamCurrentValueForPreview(refCode);
    const right = String(rule?.compareValue ?? '');
    const op = String(rule?.operator ?? '=');
    return compareConstraintValues(left, op, right);
  });
}

function getFixedTableHeaderLabel(item: any, colIndex: number) {
  const firstType = item?.customProps?.firstColumnType || 'INDEX';
  if (colIndex === 1) {
    if (firstType === 'INDEX') return '序号';
    return '';
  }
  const raw = item?.customProps?.tableColDefs?.[colIndex - 1]?.columnName;
  if (raw != null && String(raw).trim() !== '') return String(raw).trim();
  return `列名${colIndex - 1}`;
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    class="activity-preview-fullscreen-modal"
    wrap-class-name="activity-preview-fullscreen-wrap"
    :centered="false"
    :footer="null"
    :mask-closable="false"
    width="100%"
    :style="{ top: 0, paddingBottom: 0 }"
    title="页面预览">
    <div class="activity-preview-layout">
      <div class="activity-preview-panel-title">组件列表</div>
      <div class="activity-preview-canvas">
        <div v-if="previewList.length === 0" class="activity-preview-empty">暂无组件配置</div>
        <div v-else class="component-list">
          <div
            v-for="(item, index) in previewList"
            v-show="isPreviewConstraintVisible(item)"
            :key="item.id || `${item.componentType}-${index}`"
            class="component-card"
            :class="{ 'full-row-item': isFullRowComponent(item.componentType) }">
            <div class="component-preview-wrap">
              <div
                v-if="
                  item.componentType !== 'TITLE' &&
                  item.componentType !== 'RADIO' &&
                  item.componentType !== 'FILE' &&
                  item.componentType !== 'DIVIDER' &&
                  item.componentType !== 'DATA_VIEW' &&
                  item.componentType !== 'TABLE' &&
                  !isTemplateBrowse3DItem(item) &&
                  !isFixedTemplate3DItem(item) &&
                  !isModelSelect3DItem(item)
                "
                class="component-title">
                {{ item.paramName || '未命名组件' }}
              </div>

              <template v-if="item.componentType === 'TITLE'">
                <div class="title-preview-text">{{ item.paramName || '标题' }}</div>
                <div v-if="item.customProps?.hasDivider === 1 || item.customProps?.hasDivider === '1' || item.customProps?.hasDivider === true" class="title-divider-line"></div>
              </template>

              <div v-else-if="item.componentType === 'INPUT'" class="value-range-inline-row">
                <a-input
                  :value="previewFieldValueMap[getPreviewItemKey(item, index)]"
                  :placeholder="item.customProps?.placeholder || '请输入'"
                  :disabled="isOutputIoType(item)"
                  class="preview-field"
                  :class="{ 'preview-input-range-error': isPreviewInputRangeError(item, index) }"
                  @update:value="(v: string) => onPreviewInputValue(item, index, v)"
                  @blur="() => onPreviewInputBlur(item, index)" />
                <span v-if="getInputValueRangeHint(item)" class="value-range-hint-chip">{{ getInputValueRangeHint(item) }}</span>
              </div>

              <a-textarea
                v-else-if="item.componentType === 'TEXTAREA'"
                v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
                :rows="item.customProps?.rows || 4"
                :placeholder="item.customProps?.placeholder || '请输入'"
                :disabled="isOutputIoType(item)"
                class="preview-field" />

              <a-date-picker
                v-else-if="item.componentType === 'DATE'"
                :value="previewDateDisplay(item, index)"
                :show-time="normalizeDateFormatForPicker(item.customProps?.format).includes('HH:mm:ss')"
                :format="normalizeDateFormatForPicker(item.customProps?.format)"
                :placeholder="normalizeDateFormatForPicker(item.customProps?.format).includes('HH:mm:ss') ? '请选择日期时间' : '请选择日期'"
                :disabled="isOutputIoType(item)"
                class="preview-field"
                @update:value="(d: any) => onPreviewDateChange(item, index, d)" />

              <div v-else-if="item.componentType === 'DIVIDER'" class="divider-preview-line"></div>

              <div v-else-if="item.componentType === 'DATA_VIEW'" class="data-view-preview">
                <div class="component-title">{{ item.paramName || '数据浏览' }}</div>
                <div class="data-view-preview-row">
                  <a-input
                    v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
                    :placeholder="item.customProps?.inputPlaceholder || '请输入设计参数1'"
                    :disabled="isOutputIoType(item)"
                    class="data-view-preview-input browse-adjoined-input" />
                  <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)">{{ item.customProps?.assembleButtonText || '装配' }}</a-button>
                </div>
              </div>

              <div v-else-if="item.componentType === 'FILE'" class="file-preview-wrap">
                <div class="component-title">{{ item.paramName || '未命名组件' }}</div>
                <div class="file-preview-box">
                  <div class="file-preview-icon">📷</div>
                  <div class="file-preview-hint">图片格式为jpg, jpeg, png, 且图片最大不超过2M</div>
                </div>
              </div>

              <a-select
                v-else-if="item.componentType === 'SELECT'"
                v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
                :options="getSelectOptions(item).map(v => ({ label: v, value: v }))"
                placeholder="请选择"
                :disabled="isOutputIoType(item)"
                class="preview-field" />

              <div v-else-if="item.componentType === 'RADIO'" class="radio-preview-wrap">
                <div class="component-title">{{ item.paramName || '单选项' }}</div>
                <div v-if="getRadioOptions(item).length === 0" class="radio-preview-empty">暂无选项</div>
                <a-radio-group
                  v-else
                  v-model:value="radioPreviewValueMap[getPreviewItemKey(item, index)]"
                  :disabled="isOutputIoType(item)"
                  class="radio-preview-grid">
                  <a-radio v-for="(opt, optIdx) in getRadioOptions(item)" :key="`${opt}-${optIdx}`" :value="opt" class="radio-preview-item">
                    {{ opt }}
                  </a-radio>
                </a-radio-group>
              </div>

              <div v-else-if="item.componentType === 'RICH_TEXT'" class="rich-preview-wrap">
                <CkeditorPlugin height="180" :disabled="isOutputIoType(item)" />
              </div>

              <div v-else-if="item.componentType === 'TABLE'" class="fixed-table-preview">
                <div v-if="(item.customProps?.tableTitle || '').trim() !== ''" class="fixed-table-preview-title-row">
                  <span class="fixed-table-preview-title-text">{{ item.customProps.tableTitle }}</span>
                </div>
                <table class="fixed-table-preview-grid">
                  <thead>
                    <tr>
                      <th v-for="c in tableDimensionRange(item.customProps?.tableColCount || 1)" :key="`h-${c}`">{{ getFixedTableHeaderLabel(item, c) }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in tableDimensionRange(item.customProps?.tableBodyRows || 1)" :key="`b-${r}`">
                      <td v-for="c in tableDimensionRange(item.customProps?.tableColCount || 1)" :key="`b-${r}-${c}`" class="fixed-table-preview-td">
                        <template v-if="c === 1">
                          <span v-if="(item.customProps?.firstColumnType || 'INDEX') === 'INDEX'">{{ r }}</span>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else-if="isTemplateBrowse3DItem(item)" class="template-browse-3d-preview">
                <div class="component-title">{{ item.paramName || '未命名组件' }}</div>
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-col">
                    <div class="component-title">模板名称：</div>
                    <div class="preview-field-join-row">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'templateName')]"
                        placeholder="请输入"
                        :disabled="isOutputIoType(item)"
                        class="preview-field template-browse-3d-input--grey" />
                      <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)">浏览</a-button>
                    </div>
                  </div>
                  <div class="template-browse-3d-col">
                    <div class="component-title">模型名称：</div>
                    <div class="preview-field-join-row">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'modelName')]"
                        placeholder="请输入"
                        :disabled="isOutputIoType(item)"
                        class="preview-field" />
                      <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)">生成模型</a-button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="isFixedTemplate3DItem(item)" class="template-browse-3d-preview">
                <div class="component-title">{{ item.paramName || '未命名组件' }}</div>
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-col">
                    <div class="component-title">模板名称：</div>
                    <div class="preview-field-join-row">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'templateName')]"
                        placeholder="请输入"
                        :disabled="isOutputIoType(item)"
                        class="preview-field template-browse-3d-input--grey" />
                    </div>
                  </div>
                  <div class="template-browse-3d-col">
                    <div class="component-title">模型名称：</div>
                    <div class="preview-field-join-row">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'modelName')]"
                        placeholder="请输入"
                        :disabled="isOutputIoType(item)"
                        class="preview-field" />
                      <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)">生成模型</a-button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="isModelSelect3DItem(item)" class="model-select-3d-preview">
                <div class="component-title">{{ item.paramName || '未命名组件' }}</div>
                <div class="preview-field-join-row">
                  <a-input
                    v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'modelSelectName')]"
                    placeholder="请输入"
                    :disabled="isOutputIoType(item)"
                    class="preview-field template-browse-3d-input--grey" />
                  <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)">浏览</a-button>
                  <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)">装配模型</a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="activity-preview-footer">
        <a-button @click="emit('close')">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<style lang="less">
.activity-preview-fullscreen-wrap {
  padding: 0 !important;
}
.activity-preview-fullscreen-wrap .ant-modal {
  top: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}
.activity-preview-fullscreen-wrap .ant-modal-content {
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}
.activity-preview-fullscreen-wrap .ant-modal-body {
  flex: 1;
  overflow: hidden;
  padding: 0;
}
.activity-preview-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.activity-preview-panel-title {
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.activity-preview-canvas {
  flex: 1;
  overflow: auto;
  padding: 12px 16px;
}
.component-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.component-card {
  border: none;
  border-radius: 4px;
  padding: 10px 0;
  display: block;
}
.component-card.full-row-item {
  grid-column: 1 / -1;
}
.component-preview-wrap {
  flex: 1;
  min-width: 0;
}
.component-title {
  font-size: 12px;
  color: #444;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.title-preview-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}
.title-divider-line {
  height: 1px;
  background: #d9d9d9;
  width: 100%;
}
.activity-preview-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}
.activity-preview-empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
.preview-field {
  width: 420px;
  max-width: 100%;
}
.value-range-inline-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.value-range-hint-chip {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  font-size: 12px;
  color: #1f1f1f;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  white-space: nowrap;
}
/* a-input 无前后缀时，自定义 class 与 .ant-input 在同一节点，不能用「父包 .ant-input」 */
.ant-input.preview-input-range-error {
  border-color: #ff4d4f !important;
}
.ant-input.preview-input-range-error:focus,
.ant-input.preview-input-range-error.ant-input-focused {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
}
/* 有 clear / 前后缀时 class 在 affix 包裹层 */
.ant-input-affix-wrapper.preview-input-range-error {
  border-color: #ff4d4f !important;
}
.ant-input-affix-wrapper.preview-input-range-error:focus-within,
.ant-input-affix-wrapper.preview-input-range-error.ant-input-affix-wrapper-focused {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
}
.divider-preview-line {
  height: 1px;
  background: #d9d9d9;
  margin: 10px 0;
}
.model-select-3d-preview {
  width: 100%;
  min-width: 0;
}
.template-browse-3d-preview {
  width: 100%;
  min-width: 0;
}
/* 与上方 .component-list 双列 INPUT 对齐：同栅格比例 + 与 DATA_VIEW 相同的「输入 + 按钮」行 */
.template-browse-3d-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  align-items: start;
}
.template-browse-3d-col {
  min-width: 0;
}
.preview-field-join-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.preview-field-join-row .preview-field {
  flex: 0 1 420px;
}
.data-view-preview-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.data-view-preview-input {
  width: 420px;
  max-width: 100%;
}
.file-preview-box {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.file-preview-hint {
  color: #999;
  font-size: 12px;
}
.radio-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  max-width: 520px;
}
.radio-preview-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.radio-preview-empty {
  color: #999;
  font-size: 12px;
}
.rich-preview-wrap {
  max-width: 760px;
}
.fixed-table-preview-grid {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
  font-size: 13px;
}
.fixed-table-preview-grid th,
.fixed-table-preview-grid td {
  border: 1px solid #e8e8e8;
  padding: 10px 12px;
  text-align: left;
}
.fixed-table-preview-grid th {
  font-weight: 600;
  background: #fafafa;
}
.template-browse-3d-input--grey :deep(.ant-input) {
  background: #f5f7fa;
}
.data-view-assemble-btn {
  flex-shrink: 0;
  min-width: 64px;
  height: 32px;
  padding: 0 10px;
  border-radius: 4px;
}
</style>
