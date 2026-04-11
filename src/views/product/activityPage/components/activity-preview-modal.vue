<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import ModuleLibraryPickerModal from './module-library-picker-modal.vue';
const props = defineProps({
  modalVisible: { type: Boolean, default: false },
  record: { type: Object, default: () => ({}) },
});

const emit = defineEmits<{ close: [] }>();
const visible = computed({ get: () => props.modalVisible, set: value => !value && emit('close') });
const userStore = useUserStore();

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
const previewUploadFileMap = ref<Record<string, any[]>>({});
const modulePickerVisible = ref(false);
const modulePickerItemKey = ref('');
const modulePickerCategoryId = ref('');
const modulePickerMenuId = ref('');
const modulePickerMode = ref<'dataView' | 'templateBrowse' | 'modelSelectBrowse' | 'moduleTableBrowse'>('dataView');
const modulePickerTargetFieldKey = ref('');
/** 模型库表格「浏览」：预览列表中的组件下标，用于确认时直接取组件 */
const modulePickerSourceComponentIndex = ref(-1);
/** 模型库表格「浏览」：表体行号（从 1 开始） */
const modulePickerTableBodyRowIndex = ref(1);
/** 预览表格单元格展示值（模型库读取等），key = getPreviewItemKey::行::列 */
const previewTableCellMap = ref<Record<string, string>>({});
function getPreviewItemKey(item: any, index: number) {
  return String(item?.id ?? `${item?.componentType}-${index}`);
}
function getPreview3dSubKey(item: any, index: number, part: 'templateName' | 'modelName' | 'modelSelectName') {
  return `${getPreviewItemKey(item, index)}::${part}`;
}
function getTableCellPreviewKey(item: any, componentIndex: number, bodyRow: number, col: number) {
  return `${getPreviewItemKey(item, componentIndex)}::${bodyRow}::${col}`;
}
function isWorkspaceTableBizWithColDefs(item: any) {
  if (item?.componentType !== 'TABLE') return false;
  const biz = String(item?.customProps?.tableBizType ?? '');
  return ['MODULE_LIB_READ', 'BASIC_RESOURCE_LIB_READ', 'FILE_COLLAB', 'NORMAL'].includes(biz);
}
function getPreviewTableColDef(item: any, physicalColIndex: number) {
  return item?.customProps?.tableColDefs?.[physicalColIndex - 1];
}
function getPreviewTableColDataType(item: any, physicalColIndex: number): string {
  return String(getPreviewTableColDef(item, physicalColIndex)?.dataType ?? 'TEXT');
}
function parseTableDropdownOptions(raw: unknown) {
  const s = String(raw ?? '').trim();
  if (!s) return [];
  return s
    .split(/[;；]/)
    .map(x => x.trim())
    .filter(Boolean)
    .map(v => ({ label: v, value: v }));
}
function getPreviewTableCellValue(item: any, componentIndex: number, bodyRow: number, col: number) {
  const k = getTableCellPreviewKey(item, componentIndex, bodyRow, col);
  return previewTableCellMap.value[k] ?? '';
}
function setPreviewTableCellValue(item: any, componentIndex: number, bodyRow: number, col: number, v: string) {
  const k = getTableCellPreviewKey(item, componentIndex, bodyRow, col);
  previewTableCellMap.value = { ...previewTableCellMap.value, [k]: v };
}
function showModuleTableBrowse(item: any, componentIndex: number, bodyRowIndex: number) {
  const p = item?.customProps;
  const defs = p?.tableRowDefs;
  if (!Array.isArray(defs) || bodyRowIndex < 1 || bodyRowIndex > defs.length) {
    message.warning('行定义数据异常');
    return;
  }
  const rowDef = defs[bodyRowIndex - 1];
  const categoryId = String(rowDef?.moduleLibCategoryId ?? '').trim();
  const menuIdRaw = String(rowDef?.moduleLibCategoryMenuId ?? '').trim();
  const menuId = menuIdRaw || '9';
  if (!categoryId) {
    message.warning('请先在活动配置中为该行选择关联模型库分类');
    return;
  }
  modulePickerMode.value = 'moduleTableBrowse';
  modulePickerSourceComponentIndex.value = componentIndex;
  modulePickerTableBodyRowIndex.value = bodyRowIndex;
  modulePickerItemKey.value = String(item?.id ?? '');
  modulePickerCategoryId.value = categoryId;
  modulePickerMenuId.value = menuId;
  modulePickerTargetFieldKey.value = '';
  modulePickerVisible.value = true;
}
function onPreviewTableOpClick(btn: string, item: any, componentIndex: number, bodyRow: number) {
  const t = String(btn ?? '').trim();
  if (isOutputIoType(item)) return;
  if (String(item?.customProps?.tableBizType ?? '') === 'MODULE_LIB_READ' && t === '浏览') {
    showModuleTableBrowse(item, componentIndex, bodyRow);
    return;
  }
  message.info(`${t}（示例）`);
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
function shouldShowFixedTemplateName(item: any) {
  const display = item?.customProps?.fixedTemplateDisplay;
  return display === 1 || display === '1' || display === true;
}
function get3dPreviewButtons(item: any) {
  const p = item?.customProps || {};
  const buttons: string[] = [];
  if (p.btnApplyPartNo) buttons.push('申请件号');
  if (p.btnOpenModel) buttons.push('打开模型');
  if (p.btnAssembleModel) buttons.push('装配模型');
  return buttons;
}
function getModelSelectPreviewButtons(item: any) {
  const p = item?.customProps || {};
  const buttons: string[] = [];
  if (p.btnOpenModel) buttons.push('打开模型');
  if (p.btnAssembleModel) buttons.push('装配模型');
  return buttons;
}
/** 输入输出类型为「输出」时预览不可编辑（与配置页 ioType 一致） */
function isOutputIoType(item: any) {
  return String(item?.ioType ?? 'INPUT').toUpperCase() === 'OUTPUT';
}
function shouldDisable3dModelInput(item: any) {
  return isOutputIoType(item) || !!item?.customProps?.btnApplyPartNo;
}
async function showModuleInfo(item: any, index: number, mode: 'dataView' | 'templateBrowse' | 'modelSelectBrowse' = 'dataView') {
  const isTemplateBrowse = mode === 'templateBrowse';
  const isModelSelectBrowse = mode === 'modelSelectBrowse';
  const categoryId = isTemplateBrowse
    ? String(item?.customProps?.relatedTemplateLibId ?? '').trim()
    : isModelSelectBrowse
      ? String(item?.customProps?.relatedModelLibId ?? '').trim()
      : String(item?.customProps?.libraryCategoryId ?? '').trim();
  const menuId = isTemplateBrowse || isModelSelectBrowse ? '9' : String(item?.libraryType ?? '').trim();
  if (!categoryId || !menuId) {
    message.warning(isTemplateBrowse || isModelSelectBrowse ? '请先在配置中选择关联模型库分类' : '请先在配置中选择基础资源库类型和分类节点');
    return;
  }
  modulePickerMode.value = mode;
  modulePickerItemKey.value = String(item?.id ?? '');
  modulePickerCategoryId.value = categoryId;
  modulePickerMenuId.value = menuId;
  if (mode === 'templateBrowse') {
    modulePickerTargetFieldKey.value = getPreview3dSubKey(item, index, 'templateName');
  } else if (mode === 'modelSelectBrowse') {
    modulePickerTargetFieldKey.value = getPreview3dSubKey(item, index, 'modelSelectName');
  } else {
    modulePickerTargetFieldKey.value = getPreviewItemKey(item, index);
  }
  modulePickerVisible.value = true;
}
function mapLibraryParamToKeywords(code: string): string[] {
  const c = String(code ?? '')
    .trim()
    .toUpperCase();
  if (c === 'PART_NO') return ['件号', '编码', '编码号'];
  if (c === 'PART_NAME') return ['名称'];
  if (c === 'MATERIAL') return ['材料', '材质'];
  return [];
}
function findValueByColumnKeywords(row: any, columns: any[], keywords: string[]) {
  const col = (Array.isArray(columns) ? columns : []).find((c: any) => keywords.some((kw: string) => String(c?.title ?? '').includes(kw)));
  if (!col) return '';
  return String(row?.[col.dataIndex] ?? '').trim();
}
function onModulePickerConfirm(payload: { row: any; columns: any[] }) {
  const list = previewList.value;
  if (modulePickerMode.value === 'moduleTableBrowse') {
    const idx = modulePickerSourceComponentIndex.value;
    if (idx < 0 || idx >= list.length) return;
    const item = list[idx] as any;
    if (String(item?.customProps?.tableBizType ?? '') !== 'MODULE_LIB_READ') return;
    const p = item.customProps || {};
    const tableColDefs = Array.isArray(p.tableColDefs) ? p.tableColDefs : [];
    const cols = Array.isArray(payload?.columns) ? payload.columns : [];
    const dataRow = payload?.row || {};
    const rowIdx = modulePickerTableBodyRowIndex.value;
    const nextMap = { ...previewTableCellMap.value };
    const partNo = findValueByColumnKeywords(dataRow, cols, ['模型件号', '件号']);
    const modelType = findValueByColumnKeywords(dataRow, cols, ['模型类型', '类型']);
    const mergedPart = partNo && modelType ? `${partNo}.${modelType}` : partNo || modelType || '';
    const modelNameVal = findValueByColumnKeywords(dataRow, cols, ['模型名称']);
    const baseKey = getPreviewItemKey(item, idx);
    const totalCols = getWorkspaceTablePreviewColCount(item);
    for (let c = 2; c <= totalCols; c++) {
      if (isWorkspaceTableOperationColumn(item, c)) continue;
      const cellKey = `${baseKey}::${rowIdx}::${c}`;
      if (c === 2) {
        nextMap[cellKey] = mergedPart;
      } else if (c === 3) {
        nextMap[cellKey] = modelNameVal;
      } else {
        const def = tableColDefs[c - 1];
        const paramCode = String(def?.paramCode ?? '').trim();
        let v = '';
        if (paramCode) {
          const colMeta = cols.find((col: any) => String(col?.parameterNum ?? '').trim() === paramCode);
          if (colMeta && colMeta.dataIndex != null && String(colMeta.dataIndex) !== '') {
            v = String(dataRow[colMeta.dataIndex] ?? '');
          }
        }
        nextMap[cellKey] = v;
      }
    }
    previewTableCellMap.value = nextMap;
    modulePickerSourceComponentIndex.value = -1;
    return;
  }
  const idx = list.findIndex((it: any) => String(it?.id ?? '') === modulePickerItemKey.value);
  if (idx < 0) return;
  const item = list[idx] as any;
  const key = getPreviewItemKey(item, idx);
  const cols = Array.isArray(payload?.columns) ? payload.columns : [];
  const nextFieldValueMap: Record<string, string> = { ...previewFieldValueMap.value };
  const partNo = findValueByColumnKeywords(payload?.row, cols, ['模型件号', '件号']);
  const modelType = findValueByColumnKeywords(payload?.row, cols, ['模型类型', '类型']);
  const mergedValue = partNo && modelType ? `${partNo}.${modelType}` : partNo || modelType || '';
  if (modulePickerMode.value === 'templateBrowse' || modulePickerMode.value === 'modelSelectBrowse') {
    const targetKey =
      modulePickerTargetFieldKey.value ||
      (modulePickerMode.value === 'modelSelectBrowse' ? getPreview3dSubKey(item, idx, 'modelSelectName') : getPreview3dSubKey(item, idx, 'templateName'));
    nextFieldValueMap[targetKey] = mergedValue;
    previewFieldValueMap.value = nextFieldValueMap;
    return;
  }
  if (mergedValue) {
    nextFieldValueMap[key] = mergedValue;
  } else {
    const keywords = mapLibraryParamToKeywords(item?.libraryParam);
    let targetCol = cols.find((c: any) => keywords.some((kw: string) => String(c?.title ?? '').includes(kw)));
    if (!targetCol) targetCol = cols[0];
    const fallbackValue = targetCol ? payload?.row?.[targetCol.dataIndex] : '';
    nextFieldValueMap[key] = String(fallbackValue ?? '');
  }

  // 联动回填：按返回列 parameterNum 匹配页面中相同 paramCode 的组件，批量赋值
  cols.forEach((col: any) => {
    const parameterNum = String(col?.parameterNum ?? '').trim();
    const dataIndex = String(col?.dataIndex ?? '').trim();
    if (!parameterNum || !dataIndex) return;
    const v = String(payload?.row?.[dataIndex] ?? '');
    for (let i = 0; i < list.length; i++) {
      const comp = list[i] as any;
      if (String(comp?.paramCode ?? '').trim() !== parameterNum) continue;
      const compKey = getPreviewItemKey(comp, i);
      nextFieldValueMap[compKey] = v;
    }
  });

  previewFieldValueMap.value = nextFieldValueMap;
}
function handle3dPreviewButtonClick(btn: string, item: any, index: number) {
  const text = String(btn ?? '').trim();
  if (text === '申请件号') {
    void showModuleInfo(item, index, 'templateBrowse');
    return;
  }
  if (text === '打开模型' || text === '生成模型') {
    message.info('打开模型（示例）');
    return;
  }
  if (text === '装配模型') {
    message.info('装配模型（示例）');
    return;
  }
  message.info(`${text}（示例）`);
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
    previewUploadFileMap.value = {};
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
          // 模板/模型「名称」用于标签展示，输入框默认值应来自 value 字段（为空则保持空）
          if (!(k1 in next)) next[k1] = String(item?.customProps?.templateValue ?? '');
          if (!(k2 in next)) next[k2] = String(item?.customProps?.modelValue ?? '');
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
  const s = String(op ?? '')
    .trim()
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=');
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
  const opRaw = String(vr.operator ?? '')
    .trim()
    .replace(/；/g, ';');
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
  if (isWorkspaceTableOperationColumn(item, colIndex)) return '操作';
  const biz = String(item?.customProps?.tableBizType ?? '');
  if (biz === 'MODULE_LIB_READ') {
    if (colIndex === 2) return '模型件号';
    if (colIndex === 3) return '模型名称';
  }
  if (biz === 'FILE_COLLAB' && colIndex === 2) return '文件名称';
  const firstType = item?.customProps?.firstColumnType || 'INDEX';
  if (colIndex === 1) {
    if (firstType === 'INDEX') return '序号';
    return '';
  }
  const raw = item?.customProps?.tableColDefs?.[colIndex - 1]?.columnName;
  if (raw != null && String(raw).trim() !== '') return String(raw).trim();
  return `列名${colIndex - 1}`;
}
function shouldShowWorkspaceTableOperationColumn(item: any) {
  const biz = String(item?.customProps?.tableBizType ?? '');
  return biz === 'MODULE_LIB_READ' || biz === 'BASIC_RESOURCE_LIB_READ' || biz === 'FILE_COLLAB';
}
function getWorkspaceTablePreviewColCount(item: any) {
  const base = Math.max(1, Number(item?.customProps?.tableColCount) || 1);
  return shouldShowWorkspaceTableOperationColumn(item) ? base + 1 : base;
}
function isWorkspaceTableOperationColumn(item: any, colIndex: number) {
  if (!shouldShowWorkspaceTableOperationColumn(item)) return false;
  return colIndex === getWorkspaceTablePreviewColCount(item);
}
function getWorkspaceTableOperationButtons(item: any) {
  const p = item?.customProps || {};
  const biz = String(p.tableBizType ?? '');
  if (biz === 'FILE_COLLAB') return ['上传', '下载', '清空'];
  if (biz === 'BASIC_RESOURCE_LIB_READ') return ['浏览'];
  if (biz === 'MODULE_LIB_READ') {
    const buttons = ['浏览'];
    if (p.btnOpenDrawing) buttons.push('打开图纸');
    if (p.btnOpenModel) buttons.push('打开模型');
    if (p.btnAssembleModel) buttons.push('装配模型');
    return buttons;
  }
  return [];
}

function normalizeFixedTableColumnWidthCss(raw: unknown): string | undefined {
  const s = (raw == null ? '' : String(raw)).trim();
  if (!s) return undefined;
  if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`;
  return s;
}
/** 与配置画布一致：序号 100px；数据列默认 170px；操作列按类型设宽且 sticky 右侧 */
function getFixedTableColumnPreviewStyle(item: any, colIndex: number) {
  if (colIndex === 1) {
    return { width: '100px', minWidth: '100px' } as Record<string, string>;
  }
  if (isWorkspaceTableOperationColumn(item, colIndex)) {
    const biz = String(item?.customProps?.tableBizType ?? '');
    if (biz === 'FILE_COLLAB') {
      return { width: '200px', minWidth: '200px' } as Record<string, string>;
    }
    if (biz === 'MODULE_LIB_READ') {
      const n = getWorkspaceTableOperationButtons(item).length;
      const w = Math.min(300, Math.max(88, 58 * n + 36));
      return { width: `${w}px`, minWidth: `${w}px` } as Record<string, string>;
    }
    return { width: '96px', minWidth: '96px' } as Record<string, string>;
  }
  const w = item?.customProps?.tableColDefs?.[colIndex - 1]?.columnWidth;
  const css = normalizeFixedTableColumnWidthCss(w);
  const width = css || '170px';
  return { width, minWidth: width } as Record<string, string>;
}

function getUploadHint() {
  return '支持任意文件类型上传';
}
async function customRequestPreviewUpload(item: any, index: number, options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
      securityLevel: 1,
    });
    if (res?.data?.code == 0) {
      const uploaded = {
        uid: String(res.data.id || options.file?.uid || Date.now()),
        name: res.data?.oldFileName || options.file?.name || '未命名文件',
        status: 'done',
        id: res.data.id || '',
        url: res.data.filePath || '',
        oldFileName: res.data.oldFileName,
        fileName: res.data.fileName,
        filePath: res.data.filePath,
      };
      const key = getPreviewItemKey(item, index);
      previewUploadFileMap.value = { ...previewUploadFileMap.value, [key]: [uploaded] };
      options?.onSuccess?.(res.data, options.file);
      message.success('上传成功');
      return;
    }
    options?.onError?.(new Error('upload failed'));
    message.error('上传失败');
  } catch (e: any) {
    options?.onError?.(e instanceof Error ? e : new Error('upload failed'));
    message.error('上传失败');
  }
}
function onPreviewFileChange(item: any, index: number, info: any) {
  const key = getPreviewItemKey(item, index);
  const nextList = Array.isArray(info?.fileList) ? info.fileList.slice(-1) : [];
  previewUploadFileMap.value = { ...previewUploadFileMap.value, [key]: nextList };
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
                    :placeholder="'请选择参数'"
                    :disabled="true"
                    class="data-view-preview-input browse-adjoined-input" />
                  <a-button type="primary" class="data-view-assemble-btn" @click="showModuleInfo(item, index, 'dataView')" :disabled="isOutputIoType(item)">{{ '浏览' }}</a-button>
                </div>
              </div>

              <div v-else-if="item.componentType === 'FILE'" class="file-preview-wrap">
                <div class="component-title">{{ item.paramName || '未命名组件' }}</div>
                <a-upload-dragger
                  class="file-preview-dragger"
                  :file-list="previewUploadFileMap[getPreviewItemKey(item, index)] || []"
                  :multiple="false"
                  :max-count="1"
                  :custom-request="(options: any) => customRequestPreviewUpload(item, index, options)"
                  @change="(info: any) => onPreviewFileChange(item, index, info)">
                  <p class="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p class="ant-upload-hint">{{ getUploadHint() }}</p>
                </a-upload-dragger>
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
                <a-radio-group v-else v-model:value="radioPreviewValueMap[getPreviewItemKey(item, index)]" :disabled="isOutputIoType(item)" class="radio-preview-grid">
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
                <div class="fixed-table-preview-scroll">
                  <table class="fixed-table-preview-grid">
                    <thead>
                      <tr>
                        <th
                          v-for="c in tableDimensionRange(getWorkspaceTablePreviewColCount(item))"
                          :key="`h-${c}`"
                          :class="{ 'fixed-table-preview-th--op': isWorkspaceTableOperationColumn(item, c) }"
                          :style="getFixedTableColumnPreviewStyle(item, c)">
                          {{ getFixedTableHeaderLabel(item, c) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="r in tableDimensionRange(item.customProps?.tableBodyRows || 1)" :key="`b-${r}`">
                        <td
                          v-for="c in tableDimensionRange(getWorkspaceTablePreviewColCount(item))"
                          :key="`b-${r}-${c}`"
                          class="fixed-table-preview-td"
                          :class="{ 'fixed-table-preview-td--op': isWorkspaceTableOperationColumn(item, c) }"
                          :style="getFixedTableColumnPreviewStyle(item, c)">
                          <template v-if="c === 1">
                            <span v-if="(item.customProps?.firstColumnType || 'INDEX') === 'INDEX'">{{ r }}</span>
                          </template>
                          <template v-else-if="isWorkspaceTableBizWithColDefs(item) && !isWorkspaceTableOperationColumn(item, c)">
                            <template v-if="getPreviewTableColDataType(item, c) === 'READONLY_TEXT'">
                              <span class="fixed-table-preview-cell-text">{{ getPreviewTableCellValue(item, index, r, c) }}</span>
                            </template>
                            <a-input
                              v-else-if="getPreviewTableColDataType(item, c) === 'TEXT'"
                              :value="getPreviewTableCellValue(item, index, r, c)"
                              size="small"
                              placeholder="请输入"
                              :disabled="isOutputIoType(item)"
                              class="fixed-table-preview-cell-input"
                              @update:value="(v: string) => setPreviewTableCellValue(item, index, r, c, v)" />
                            <a-select
                              v-else-if="getPreviewTableColDataType(item, c) === 'DROPDOWN'"
                              :value="getPreviewTableCellValue(item, index, r, c) || undefined"
                              :options="parseTableDropdownOptions(getPreviewTableColDef(item, c)?.dropdownValues)"
                              placeholder="请选择"
                              size="small"
                              allow-clear
                              :disabled="isOutputIoType(item)"
                              class="fixed-table-preview-cell-select"
                              popup-class-name="fixed-table-preview-select-dropdown"
                              @update:value="(v: string | undefined) => setPreviewTableCellValue(item, index, r, c, v ?? '')" />
                            <span v-else class="fixed-table-preview-cell-text">{{ getPreviewTableCellValue(item, index, r, c) }}</span>
                          </template>
                          <template v-else-if="isWorkspaceTableOperationColumn(item, c)">
                            <div class="fixed-table-cell-op-btns">
                              <a
                                v-for="btn in getWorkspaceTableOperationButtons(item)"
                                :key="`preview-table-op-${index}-${r}-${btn}`"
                                href="javascript:void(0)"
                                class="fixed-table-cell-op-link"
                                :class="{ 'fixed-table-cell-op-link--disabled': isOutputIoType(item) }"
                                @click.prevent="onPreviewTableOpClick(btn, item, index, r)">
                                {{ btn }}
                              </a>
                            </div>
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-else-if="isTemplateBrowse3DItem(item)" class="template-browse-3d-preview">
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.paramName || '模板名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'templateName')]"
                        placeholder="请选择参数"
                        :disabled="true"
                        class="template-browse-3d-input template-browse-3d-input--grey" />
                      <a-button type="primary" @click="showModuleInfo(item, index, 'templateBrowse')" size="small" class="template-browse-3d-action-btn">浏览</a-button>
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.customProps?.modelName || '模型名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'modelName')]"
                        placeholder="请输入"
                        :disabled="shouldDisable3dModelInput(item)"
                        class="template-browse-3d-input" />
                      <div class="three-d-preview-btn-grid">
                        <a-button
                          v-for="btn in get3dPreviewButtons(item)"
                          :key="`preview-tpl-btn-${btn}`"
                          type="primary"
                          size="small"
                          class="template-browse-3d-action-btn"
                          :disabled="isOutputIoType(item)"
                          @click="handle3dPreviewButtonClick(btn, item, index)">
                          {{ btn }}
                        </a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="isFixedTemplate3DItem(item)" class="template-browse-3d-preview">
                <div class="template-browse-3d-row">
                  <div v-if="shouldShowFixedTemplateName(item)" class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.paramName || '模板名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'templateName')]"
                        placeholder="请输入"
                        :disabled="true"
                        class="template-browse-3d-input template-browse-3d-input--grey" />
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.customProps?.modelName || '模型名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input
                        v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'modelName')]"
                        placeholder="请输入"
                        :disabled="shouldDisable3dModelInput(item)"
                        class="template-browse-3d-input" />
                      <div class="three-d-preview-btn-grid">
                        <a-button
                          v-for="btn in get3dPreviewButtons(item)"
                          :key="`preview-fixed-btn-${btn}`"
                          type="primary"
                          size="small"
                          class="template-browse-3d-action-btn"
                          :disabled="isOutputIoType(item)"
                          @click="handle3dPreviewButtonClick(btn, item, index)">
                          {{ btn }}
                        </a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="isModelSelect3DItem(item)" class="model-select-3d-preview">
                <div class="model-select-3d-label">{{ item.paramName || '模型名称' }}：</div>
                <div class="model-select-3d-controls">
                  <a-input
                    v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'modelSelectName')]"
                    placeholder="请输入"
                    disabled
                    class="template-browse-3d-input template-browse-3d-input--grey" />
                  <a-button type="primary" size="small" @click="showModuleInfo(item, index, 'modelSelectBrowse')" class="template-browse-3d-action-btn">浏览</a-button>
                  <a-button
                    v-for="btn in getModelSelectPreviewButtons(item)"
                    :key="`preview-model-select-btn-${btn}`"
                    type="primary"
                    size="small"
                    class="template-browse-3d-action-btn"
                    :disabled="isOutputIoType(item)"
                    @click="handle3dPreviewButtonClick(btn, item, index)">
                    {{ btn }}
                  </a-button>
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
  <ModuleLibraryPickerModal
    v-model:visible="modulePickerVisible"
    :category-id="modulePickerCategoryId"
    :menu-id="modulePickerMenuId"
    :user-id="userStore.getUser.id"
    @confirm="onModulePickerConfirm" />
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.model-select-3d-label {
  font-size: 12px;
  color: #444;
}
.model-select-3d-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
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
  gap: 8px;
  align-items: start;
}
.template-browse-3d-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.template-browse-3d-label {
  font-size: 12px;
  color: #444;
}
.template-browse-3d-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  min-width: 0;
}
.template-browse-3d-input {
  width: 420px;
  max-width: 100%;
}
.three-d-preview-btn-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
}
.template-browse-3d-action-btn {
  flex-shrink: 0;
  min-width: 64px;
  height: 32px;
  padding: 0 10px;
  border-radius: 4px;
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
.file-preview-wrap {
  width: 420px;
  max-width: 100%;
}
.file-preview-dragger {
  width: 420px !important;
  max-width: 100%;
  display: block;
}
.file-preview-dragger :deep(.ant-upload-drag) {
  width: 420px !important;
  max-width: 100%;
  margin: 0;
}
.file-preview-dragger :deep(.ant-upload) {
  padding: 16px 12px;
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
.fixed-table-preview {
  width: 100%;
  max-width: 100%;
}
/* 表格总宽度限制在较窄视口内，列宽仍由配置决定；总宽超出时出现横向滚动条 */
.fixed-table-preview-scroll {
  overflow-x: auto;
  width: 100%;
  max-width: min(100%, 960px);
  /* 避免最右侧 1px 边框被 overflow 裁切 */
  padding-right: 2px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
.fixed-table-preview-grid {
  width: max-content;
  border-collapse: collapse;
  table-layout: auto;
  background: #fff;
  font-size: 13px;
}
.fixed-table-preview-grid th.fixed-table-preview-th--op,
.fixed-table-preview-grid td.fixed-table-preview-td--op {
  position: sticky;
  right: 0;
  z-index: 2;
  /* 左侧阴影 + 单元格内右侧描边，避免 sticky 与 collapse 叠加时最右竖线丢失 */
  box-shadow:
    -6px 0 8px -4px rgba(0, 0, 0, 0.1),
    inset -1px 0 0 #e8e8e8;
}
.fixed-table-preview-grid th.fixed-table-preview-th--op {
  z-index: 3;
  background: #fafafa;
}
.fixed-table-preview-grid td.fixed-table-preview-td--op {
  background: #fff;
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
.fixed-table-preview-cell-text {
  display: inline-block;
  max-width: 100%;
  word-break: break-word;
}
.fixed-table-preview-cell-input,
.fixed-table-preview-cell-select {
  width: 100%;
  min-width: 88px;
  max-width: 100%;
}
.fixed-table-preview-td .fixed-table-preview-cell-input :deep(.ant-input) {
  font-size: 13px;
}
.fixed-table-preview-td .fixed-table-preview-cell-select :deep(.ant-select-selector) {
  font-size: 13px;
}
.fixed-table-cell-op-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.fixed-table-preview-td--op .fixed-table-cell-op-btns {
  flex-wrap: nowrap;
  gap: 6px;
}
.fixed-table-cell-op-link {
  color: #1677ff;
  text-decoration: underline;
  cursor: pointer;
  line-height: 22px;
}
.fixed-table-cell-op-link--disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
  text-decoration-color: rgba(0, 0, 0, 0.25);
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
