<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons-vue';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import ModuleLibraryPickerModal from '../../../activityPage/components/module-library-picker-modal.vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { openModuleInfoNew, assembleModuleInfoNew, openDrawingInfoNew } from '@/libs/webSocketNew';
import { downloadFileFromStream } from '@/utils/file';
import * as XLSX from 'xlsx';
import moduleIcon1 from '@/assets/images/module1.png';
import moduleIcon2 from '@/assets/images/module2.png';
import moduleIcon3 from '@/assets/images/module3.png';

const props = defineProps<{
  componentsJson?: Record<string, any> | null;
  savedParamValues?: any[] | null;
  savedTables?: any[] | null;
  taskId?: string | number | null;
  activityId?: string | number | null;
}>();
const emit = defineEmits<{
  (e: 'param-title-click', payload: { paramNum: string; paramName: string }): void;
}>();

const userStore = useUserStore();
const previewFieldValueMap = ref<Record<string, string>>({});
const radioPreviewValueMap = ref<Record<string, string>>({});
const previewUploadFileMap = ref<Record<string, any[]>>({});
const richTextEditorRefMap = ref<Record<string, any>>({});
const richTextValueMap = ref<Record<string, string>>({});
const previewTableCellMap = ref<Record<string, string>>({});
const previewTableRowCountMap = ref<Record<string, number>>({});
const inputRangeBlurredMap = ref<Record<string, boolean>>({});
const inputLastValidValueMap = ref<Record<string, string>>({});
const previewFileCollabFileIdMap = ref<Record<string, string>>({});
const fileCollabPreviewRowCountMap = ref<Record<string, number>>({});
const fileCollabUploadInputRef = ref<HTMLInputElement | null>(null);
const importParamsModalVisible = ref(false);
const importParamsModalLoading = ref(false);
const importParamsSelectedFile = ref<File | null>(null);
const importParamsFileInputKey = ref(0);
const impactEvalModalVisible = ref(false);
const impactSelectedParamCode = ref('');
const impactAnalyzing = ref(false);
const impactResultRows = ref<Array<{ key: string; activityName: string; taskCreatorName: string; taskName: string; taskStatus: string }>>([]);
const fileCollabUploadTarget = ref<{ item: any; componentIndex: number; bodyRow: number } | null>(null);
const modulePickerVisible = ref(false);
const modulePickerCategoryId = ref('');
const modulePickerMenuId = ref('');
const modulePickerTargetFieldKey = ref('');
const modulePickerMode = ref<'dataView' | 'templateBrowse' | 'modelSelectBrowse' | 'moduleTableBrowse'>('dataView');
const modulePickerItemKey = ref('');
const modulePickerSourceComponentIndex = ref(-1);
const modulePickerTableBodyRowIndex = ref(1);

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

function parseSavedValueMap(list: any[] | null | undefined) {
  const map = new Map<string, string>();
  if (!Array.isArray(list)) return map;
  list.forEach((row: any) => {
    const code = String(row?.paramCode ?? row?.code ?? '').trim();
    if (!code) return;
    const val = String(row?.paramValue ?? row?.value ?? row?.savedValue ?? '').trim();
    map.set(code, val);
  });
  return map;
}

const savedValueMap = computed(() => parseSavedValueMap(props.savedParamValues));

function knowledgeHintText(item: any): string {
  return String(item?.knowledgeContent ?? '').trim();
}
function hasKnowledgeHint(item: any): boolean {
  return knowledgeHintText(item) !== '';
}
function onParamTitleClick(item: any) {
  const paramNum = String(item?.paramCode ?? item?.paramKey ?? '').trim();
  if (!paramNum) return;
  emit('param-title-click', {
    paramNum,
    paramName: String(item?.paramName ?? '').trim(),
  });
}
function onImpactEvalEntryClick() {
  impactEvalModalVisible.value = true;
  impactResultRows.value = [];
}
function onImpactEvalModalClose() {
  impactEvalModalVisible.value = false;
}
const impactScopeTypes = new Set(['INPUT', 'RICH_TEXT', 'SELECT', 'AUTO_COMPLETE', 'RADIO']);
const impactParamOptions = computed(() =>
  previewList.value
    .filter((item: any) => impactScopeTypes.has(String(item?.componentType || '').toUpperCase()))
    .map((item: any) => ({
      label: `${String(item?.paramName ?? '未命名参数')}（${String(item?.paramCode ?? '-') || '-'}）`,
      value: String(item?.paramCode ?? '').trim(),
    }))
    .filter((item: any) => item.value !== ''),
);
const impactColumns = [
  { title: '活动名称', dataIndex: 'activityName', key: 'activityName', ellipsis: true },
  { title: '负责人', dataIndex: 'taskCreatorName', key: 'taskCreatorName', width: 180, ellipsis: true },
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 200, ellipsis: true },
];
async function onImpactAnalyzeClick() {
  const selected = String(impactSelectedParamCode.value || '').trim();
  if (!selected) {
    message.warning('请先选择参数');
    return;
  }
  const taskId = String(props.taskId ?? '').trim();
  const activityId = String(props.activityId ?? '').trim();
  if (!taskId) {
    message.warning('未获取到任务ID');
    return;
  }
  if (!activityId) {
    message.warning('未获取到当前活动ID');
    return;
  }
  impactAnalyzing.value = true;
  try {
    const res = await AdminApiSystemProcessTask.evaluateImpact({
      activityId,
      taskId,
      paramCode: selected,
    });
    const raw = res?.data?.data;
    const taskList = Array.isArray(raw?.impactedActivities) ? raw.impactedActivities : Array.isArray(raw) ? raw : Array.isArray(raw?.list) ? raw.list : [];
    impactResultRows.value = taskList.map((row: any, idx: number) => ({
      key: String(row?.taskId ?? row?.id ?? `${selected}-${idx}`),
      activityName: String(row?.activityName ?? '-'),
      taskCreatorName: raw.taskCreatorName,
      taskName: raw.taskName,
      taskStatus: raw.taskName,
    }));
  } finally {
    impactAnalyzing.value = false;
  }
}

const previewList = computed(() => {
  const cfg = props.componentsJson || {};
  const all = [
    ...(Array.isArray(cfg.basicComponentList) ? cfg.basicComponentList : []),
    ...(Array.isArray(cfg.threeDComponentList) ? cfg.threeDComponentList : []),
    ...(Array.isArray(cfg.uploadComponentList) ? cfg.uploadComponentList : []),
    ...(Array.isArray(cfg.tableComponentList) ? cfg.tableComponentList : []),
  ].map((item: any) => ({
    ...item,
    customProps: item?.customProps || {},
    constraintRules: Array.isArray(item?.constraintRules) ? item.constraintRules : [],
    validateRule: normalizeValidateRule(item?.validateRule),
  }));
  const orderList = Array.isArray(cfg.componentDisplayOrderList) ? cfg.componentDisplayOrderList : [];
  if (!orderList.length) {
    return all.slice().sort((a: any, b: any) => (Number(a?.sortNo) || 0) - (Number(b?.sortNo) || 0));
  }
  const byId = new Map<string, any>();
  all.forEach((item: any) => byId.set(String(item?.id ?? ''), item));
  const used = new Set<string>();
  const ordered: any[] = [];
  orderList
    .slice()
    .sort((a: any, b: any) => (Number(a?.sortNo) || 0) - (Number(b?.sortNo) || 0))
    .forEach((o: any) => {
      const id = String(o?.componentId ?? '');
      const found = byId.get(id);
      if (!found) return;
      used.add(id);
      ordered.push(found);
    });
  const rest = all.filter((item: any) => !used.has(String(item?.id ?? ''))).sort((a: any, b: any) => (Number(a?.sortNo) || 0) - (Number(b?.sortNo) || 0));
  return [...ordered, ...rest];
});

function getPreviewItemKey(item: any, index: number) {
  return String(item?.id ?? `${item?.componentType}-${index}`);
}
function getPreview3dSubKey(item: any, index: number, part: 'templateName' | 'modelName' | 'modelSelectName') {
  return `${getPreviewItemKey(item, index)}::${part}`;
}
function getTableCellPreviewKey(item: any, componentIndex: number, bodyRow: number, col: number) {
  return `${getPreviewItemKey(item, componentIndex)}::${bodyRow}::${col}`;
}

function getSelectOptions(item: any) {
  const values = item?.customProps?.sequenceValues || [];
  if (!Array.isArray(values)) return [];
  return values.map((val: string) => (val || '').trim()).filter((val: string) => val !== '');
}

function getRadioOptions(item: any) {
  const raw = item?.customProps?.radioOptions;
  if (Array.isArray(raw) && raw.length) return raw.map((val: string) => (val || '').trim()).filter(Boolean);
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

function isOutputIoType(item: any) {
  return String(item?.ioType ?? 'INPUT').toUpperCase() === 'OUTPUT';
}

function normalizeDateFormatForPicker(raw: unknown) {
  const fmt = String(raw ?? '').trim();
  if (!fmt) return 'YYYY-MM-DD';
  return fmt.replace(/yyyy/g, 'YYYY').replace(/yy/g, 'YY').replace(/dd/g, 'DD');
}

function previewDateDisplay(item: any, index: number) {
  const key = getPreviewItemKey(item, index);
  const s = String(previewFieldValueMap.value[key] ?? '');
  if (!s) return null;
  const d = dayjs(s);
  return d.isValid() ? d : null;
}
function onPreviewDateChange(item: any, index: number, d: Dayjs | null) {
  const key = getPreviewItemKey(item, index);
  const fmt = normalizeDateFormatForPicker(item.customProps?.format);
  previewFieldValueMap.value = { ...previewFieldValueMap.value, [key]: d ? d.format(fmt) : '' };
}

function shouldDisable3dModelInput(item: any) {
  return isOutputIoType(item) || !!item?.customProps?.btnApplyPartNo;
}

function showModuleInfo(item: any, index: number, mode: 'dataView' | 'templateBrowse' | 'modelSelectBrowse' = 'dataView') {
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
  modulePickerTargetFieldKey.value =
    mode === 'templateBrowse'
      ? getPreview3dSubKey(item, index, 'templateName')
      : mode === 'modelSelectBrowse'
        ? getPreview3dSubKey(item, index, 'modelSelectName')
        : getPreviewItemKey(item, index);
  modulePickerCategoryId.value = categoryId;
  modulePickerMenuId.value = menuId;
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
function findValueByParameterNums(row: any, columns: any[], parameterNums: string[]) {
  const wanted = parameterNums
    .map(x =>
      String(x ?? '')
        .trim()
        .toUpperCase(),
    )
    .filter(Boolean);
  if (!wanted.length) return '';
  const col = (Array.isArray(columns) ? columns : []).find((c: any) =>
    wanted.includes(
      String(c?.parameterNum ?? '')
        .trim()
        .toUpperCase(),
    ),
  );
  if (!col) return '';
  return String(row?.[col.dataIndex] ?? '').trim();
}
function findValueByRowKeyKeywords(row: any, keywords: string[]) {
  if (row == null || typeof row !== 'object') return '';
  const entries = Object.entries(row as Record<string, unknown>);
  for (const [k, v] of entries) {
    const keyLower = String(k ?? '')
      .trim()
      .toLowerCase();
    if (!keyLower) continue;
    if (keywords.some(kw => keyLower.includes(String(kw).toLowerCase()))) {
      const text = String(v ?? '').trim();
      if (text !== '') return text;
    }
  }
  return '';
}
function pickModulePartAndType(row: any, columns: any[]) {
  const partNo =
    findValueByParameterNums(row, columns, ['PART_NO', 'MODEL_PART_NO']) ||
    findValueByColumnKeywords(row, columns, ['模型件号', '件号']) ||
    findValueByRowKeyKeywords(row, ['modelpartno', 'model_part_no', 'partno', 'part_no', 'itemcode', 'item_code']);
  const modelType =
    findValueByParameterNums(row, columns, ['MODEL_TYPE', 'PART_TYPE', 'TYPE']) ||
    findValueByColumnKeywords(row, columns, ['模型类型', '类型']) ||
    findValueByRowKeyKeywords(row, ['modeltype', 'model_type', 'parttype', 'part_type', 'type']);
  return { partNo, modelType };
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
    const { partNo, modelType } = pickModulePartAndType(dataRow, cols);
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
  const item = idx >= 0 ? (list[idx] as any) : null;
  const key = modulePickerTargetFieldKey.value || (idx >= 0 ? getPreviewItemKey(item, idx) : '');
  if (!key) return;
  const cols = Array.isArray(payload?.columns) ? payload.columns : [];
  const nextFieldValueMap: Record<string, string> = { ...previewFieldValueMap.value };
  const { partNo, modelType } = pickModulePartAndType(payload?.row, cols);
  const merged = partNo && modelType ? `${partNo}.${modelType}` : partNo || modelType || '';
  if (modulePickerMode.value === 'templateBrowse' || modulePickerMode.value === 'modelSelectBrowse') {
    nextFieldValueMap[key] = merged;
    previewFieldValueMap.value = nextFieldValueMap;
    return;
  }
  if (merged) {
    nextFieldValueMap[key] = merged;
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
      if (compKey === key) continue;
      nextFieldValueMap[compKey] = v;
    }
  });

  previewFieldValueMap.value = nextFieldValueMap;
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
function open3dComponentModel(item: any, index: number) {
  const templateName = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'templateName')] ?? '').trim();
  if (!templateName) {
    message.warning('模板名称为空');
    return;
  }
  const newModelNum = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'modelName')] ?? '').trim();
  const dotIndex = templateName.lastIndexOf('.');
  const modelType = dotIndex > 0 ? templateName.slice(dotIndex + 1).toLowerCase() : 'prt';
  const modelNum = dotIndex > 0 ? templateName.slice(0, dotIndex) : templateName;
  void openModuleInfoNew(modelNum, modelType, newModelNum, '', '');
}
function openModelSelect3dModel(item: any, index: number) {
  const modelPartNo = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'modelSelectName')] ?? '').trim();
  if (!modelPartNo) {
    message.warning('模型名称为空');
    return;
  }
  const dotIndex = modelPartNo.lastIndexOf('.');
  const modelNum = dotIndex > 0 ? modelPartNo.slice(0, dotIndex) : modelPartNo;
  const modelType = dotIndex > 0 ? modelPartNo.slice(dotIndex + 1).toLowerCase() : 'prt';
  void openModuleInfoNew(modelNum, modelType, '', '', '');
}
function openRowModel(item: any, componentIndex: number, bodyRow: number) {
  const modelPartNo = String(getPreviewTableCellValue(item, componentIndex, bodyRow, 2) ?? '').trim();
  if (!modelPartNo) {
    message.warning('当前行模型件号为空');
    return;
  }
  const dotIndex = modelPartNo.lastIndexOf('.');
  const modelNum = dotIndex > 0 ? modelPartNo.slice(0, dotIndex) : modelPartNo;
  const modelType = dotIndex > 0 ? modelPartNo.slice(dotIndex + 1).toLowerCase() : 'prt';
  void openModuleInfoNew(modelNum, modelType, '', '', '');
}
async function handle3dPreviewButtonClick(btn: string, item: any, index: number) {
  const text = String(btn ?? '').trim();
  if (text === '申请件号') {
    try {
      const res = await AdminApiSystemProcessTask.nextNo({ ruleCode: 'template' });
      const code = res?.data?.code as number | string | undefined;
      const ok = code === 0 || code === 200 || code === '0' || code === '200';
      if (!ok) {
        message.error(String(res?.data?.msg ?? '申请件号失败'));
        return;
      }
      const applyNo = String(res?.data?.data ?? '').trim();
      if (!applyNo) {
        message.warning('未返回件号');
        return;
      }
      const targetKey = getPreview3dSubKey(item, index, 'modelName');
      previewFieldValueMap.value = {
        ...previewFieldValueMap.value,
        [targetKey]: applyNo,
      };
    } catch {
      message.error('申请件号失败');
    }
    return;
  }
  if (text === '打开模型' || text === '生成模型') {
    if (isModelSelect3DItem(item)) {
      openModelSelect3dModel(item, index);
    } else {
      open3dComponentModel(item, index);
    }
    return;
  }
  if (text === '装配模型') {
    if (isModelSelect3DItem(item)) {
      const modelPartNo = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'modelSelectName')] ?? '').trim();
      if (!modelPartNo) {
        message.warning('模型名称为空');
        return;
      }
      const dotIndex = modelPartNo.lastIndexOf('.');
      const modelType = dotIndex > 0 ? modelPartNo.slice(dotIndex + 1).toLowerCase() : 'prt';
      const modelNum = dotIndex > 0 ? modelPartNo.slice(0, dotIndex) : modelPartNo;
      console.log(modelNum, modelType);
      void assembleModuleInfoNew(modelNum, modelType, '', '', '', '');
    } else {
      const templateName = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'templateName')] ?? '').trim();
      if (!templateName) {
        message.warning('模板名称为空');
        return;
      }
      const dotIndex = templateName.lastIndexOf('.');
      const modelType = dotIndex > 0 ? templateName.slice(dotIndex + 1).toLowerCase() : 'prt';
      const modelNum = dotIndex > 0 ? templateName.slice(0, dotIndex) : templateName;
      const newModelNum = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'modelName')] ?? '').trim();
      console.log(modelNum, modelType, newModelNum);
      void assembleModuleInfoNew(modelNum, modelType, '', newModelNum, '', '');
    }
    return;
  }
  message.info(`${text}（示例）`);
}
function isFullRowComponent(type: string) {
  return ['TEXTAREA', 'TITLE', 'RICH_TEXT', 'FILE', 'DIVIDER', 'RADIO', 'DATA_VIEW', 'TABLE', '3D_VIEW'].includes(type);
}

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
function getResolvedValueRangeBounds(vr: any): { v1: string; v2: string } {
  const raw = String(vr?.compareValue ?? '')
    .trim()
    .replace(/；/g, ';');
  const v2 = String(vr?.compareValue2 ?? '').trim();
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
  if (op.includes(';')) return v1 !== '' && v2 !== '';
  return v1 !== '';
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
    previewFieldValueMap.value = { ...previewFieldValueMap.value, [key]: String(inputLastValidValueMap.value[key] ?? '') };
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
  if (raw.trim() === '') return false;
  return !isValueWithinRange(raw, vr);
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
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || t === 'AUTO_COMPLETE' || t === 'DATE' || t === 'DATA_VIEW') {
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

function tableDimensionRange(count: number) {
  const n = Math.max(0, Math.min(100, Number(count) || 0));
  return Array.from({ length: n }, (_, i) => i + 1);
}
function shouldShowWorkspaceTableOperationColumn(item: any) {
  const biz = String(item?.customProps?.tableBizType ?? '');
  return biz === 'MODULE_LIB_READ' || biz === 'BASIC_RESOURCE_LIB_READ' || biz === 'FILE_COLLAB' || biz === 'FILE_COLLAB_SIMPLE';
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
  if (biz === 'FILE_COLLAB') return ['浏览', '删除行', '分配', '发布'];
  if (biz === 'FILE_COLLAB_SIMPLE') return ['上传', '下载', '清空'];
  if (biz === 'BASIC_RESOURCE_LIB_READ') return ['浏览'];
  if (biz === 'MODULE_LIB_READ') {
    const buttons = ['浏览'];
    if (p.btnOpenModel) buttons.push('打开模型');
    if (p.btnAssembleModel) buttons.push('装配模型');
    if (p.btnOpenDrawing) buttons.push('打开图纸');
    return buttons;
  }
  return [];
}
function getWorkspaceTableOperationIcon(btn: string) {
  if (btn === '打开模型') return moduleIcon1;
  if (btn === '装配模型') return moduleIcon2;
  if (btn === '打开图纸') return moduleIcon3;
  return '';
}
function getFixedTableHeaderLabel(item: any, colIndex: number) {
  if (isWorkspaceTableOperationColumn(item, colIndex)) return '操作';
  const biz = String(item?.customProps?.tableBizType ?? '');
  if (biz === 'MODULE_LIB_READ') {
    if (colIndex === 2) return '模型件号';
    if (colIndex === 3) return '模型名称';
  }
  if (biz === 'FILE_COLLAB_SIMPLE' && colIndex === 2) return '文件名称';
  const firstType = item?.customProps?.firstColumnType || 'INDEX';
  if (colIndex === 1) {
    if (firstType === 'INDEX') return '序号';
    return '';
  }
  const raw = item?.customProps?.tableColDefs?.[colIndex - 1]?.columnName;
  if (raw != null && String(raw).trim() !== '') return String(raw).trim();
  return `列名${colIndex - 1}`;
}
function normalizeFixedTableColumnWidthCss(raw: unknown): string | undefined {
  const s = (raw == null ? '' : String(raw)).trim();
  if (!s) return undefined;
  if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`;
  return s;
}
function getFixedTableColumnPreviewStyle(item: any, colIndex: number) {
  if (colIndex === 1) {
    return { width: '55px', minWidth: '55px' } as Record<string, string>;
  }
  if (isWorkspaceTableOperationColumn(item, colIndex)) {
    const biz = String(item?.customProps?.tableBizType ?? '');
    if (biz === 'FILE_COLLAB') {
      return { width: '216px', minWidth: '216px' } as Record<string, string>;
    }
    if (biz === 'MODULE_LIB_READ') {
      // 操作列按最多 4 个图标展示宽度收敛，避免占用过多表格空间
      return { width: '112px', minWidth: '112px' } as Record<string, string>;
    }
    if (biz === 'FILE_COLLAB_SIMPLE') {
      const n = getWorkspaceTableOperationButtons(item).length;
      const w = Math.min(300, Math.max(88, 58 * n + 36));
      return { width: `${w}px`, minWidth: `${w}px` } as Record<string, string>;
    }
    return { width: '96px', minWidth: '96px' } as Record<string, string>;
  }
  const bizData = String(item?.customProps?.tableBizType ?? '');
  const raw = item?.customProps?.tableColDefs?.[colIndex - 1]?.columnWidth;
  const css = normalizeFixedTableColumnWidthCss(raw);
  if (bizData === 'FILE_COLLAB') {
    const width = css || '180px';
    return { width, minWidth: width } as Record<string, string>;
  }
  const width = css || '170px';
  return { width, minWidth: width } as Record<string, string>;
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
function getTableCellInheritConfig(item: any, bodyRow: number, col: number): { inheritType: string; paramCode: string; tableNumber: string; tableCellRef: string } | null {
  // 后端返回存在两种位置：component.cellParamInheritMap / component.customProps.cellParamInheritMap
  const rawMap = item?.cellParamInheritMap ?? item?.customProps?.cellParamInheritMap;
  if (!rawMap) return null;
  let mapObj: Record<string, any> | null = null;
  if (typeof rawMap === 'string') {
    try {
      const parsed = JSON.parse(rawMap);
      mapObj = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, any>) : null;
    } catch {
      mapObj = null;
    }
  } else if (typeof rawMap === 'object' && !Array.isArray(rawMap)) {
    mapObj = rawMap as Record<string, any>;
  }
  if (!mapObj) return null;
  const key = `${bodyRow}-${col}`;
  const directEntry = mapObj[key];
  const normalizedDirectEntry = mapObj[key.replace(/\s+/g, '')] || mapObj[`${bodyRow}:${col}`] || mapObj[`${bodyRow}_${col}`];
  let entry: any = directEntry ?? normalizedDirectEntry ?? null;
  if (!entry || typeof entry !== 'object') {
    const entries = Object.entries(mapObj);
    const hit = entries.find(([k]) => {
      const kk = String(k ?? '')
        .trim()
        .replace(/\s+/g, '');
      if (kk === key) return true;
      const m = /^(\d+)\D+(\d+)$/.exec(kk);
      if (!m) return false;
      return Number(m[1]) === bodyRow && Number(m[2]) === col;
    });
    entry = hit?.[1];
  }
  if (!entry || typeof entry !== 'object') return null;
  return {
    inheritType: String(entry?.cellInheritType ?? '')
      .trim()
      .toUpperCase(),
    paramCode: String(entry?.cellParamCode ?? '').trim(),
    tableNumber: String(entry?.cellTableNumber ?? '').trim(),
    tableCellRef: String(entry?.cellTableCellRef ?? '').trim(),
  };
}
function getTableCellUniqueCode(item: any, bodyRow: number, col: number): string {
  const rawMap = item?.cellBasicDefMap ?? item?.customProps?.cellBasicDefMap;
  if (!rawMap) return '';
  let mapObj: Record<string, any> | null = null;
  if (typeof rawMap === 'string') {
    try {
      const parsed = JSON.parse(rawMap);
      mapObj = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, any>) : null;
    } catch {
      mapObj = null;
    }
  } else if (typeof rawMap === 'object' && !Array.isArray(rawMap)) {
    mapObj = rawMap as Record<string, any>;
  }
  if (!mapObj) return '';
  const key = `${bodyRow}-${col}`;
  const directEntry = mapObj[key];
  const normalizedDirectEntry = mapObj[key.replace(/\s+/g, '')] || mapObj[`${bodyRow}:${col}`] || mapObj[`${bodyRow}_${col}`];
  let entry: any = directEntry ?? normalizedDirectEntry ?? null;
  if (!entry || typeof entry !== 'object') {
    const entries = Object.entries(mapObj);
    const hit = entries.find(([k]) => {
      const kk = String(k ?? '')
        .trim()
        .replace(/\s+/g, '');
      if (kk === key) return true;
      const m = /^(\d+)\D+(\d+)$/.exec(kk);
      if (!m) return false;
      return Number(m[1]) === bodyRow && Number(m[2]) === col;
    });
    entry = hit?.[1];
  }
  if (!entry || typeof entry !== 'object') return '';
  return String(entry?.uniqueCode ?? '').trim();
}
/** 单元格继承值来源：task-param-map -> savedParamValues */
function getInheritedParamValueByCode(paramCodeRaw: string): string {
  const target = String(paramCodeRaw ?? '').trim();
  if (!target) return '';
  // 1) 优先精确命中 task-param-map
  if (savedValueMap.value.has(target)) {
    return String(savedValueMap.value.get(target) ?? '');
  }
  // 2) 兼容大小写差异
  const targetLower = target.toLowerCase();
  for (const [k, v] of savedValueMap.value.entries()) {
    if (String(k).trim().toLowerCase() === targetLower) {
      return String(v ?? '');
    }
  }
  return '';
}
function getPreviewTableCellValue(item: any, componentIndex: number, bodyRow: number, col: number) {
  const k = getTableCellPreviewKey(item, componentIndex, bodyRow, col);
  const direct = previewTableCellMap.value[k];
  if (direct != null && String(direct) !== '') return direct;
  const inherit = getTableCellInheritConfig(item, bodyRow, col);
  if (!inherit) return '';
  if (inherit.inheritType === 'FROM_PARAM' && inherit.paramCode) {
    return getInheritedParamValueByCode(inherit.paramCode);
  }
  if (inherit.inheritType === 'FIXED') {
    // 从其他表格继承：使用“继承唯一编号”作为参数key，从 task-param-map 读取
    if (inherit.tableNumber) return getInheritedParamValueByCode(inherit.tableNumber);
    if (inherit.tableCellRef) return getInheritedParamValueByCode(inherit.tableCellRef);
  }
  return '';
}
function isPreviewTableCellReadonly(item: any, bodyRow: number, col: number): boolean {
  // MODULE_LIB_READ 的“模型件号/模型名称”列在预览态中不允许编辑：只读置灰
  const biz = String(item?.customProps?.tableBizType ?? '');
  if (biz === 'MODULE_LIB_READ' && (col === 2 || col === 3)) return true;
  const inherit = getTableCellInheritConfig(item, bodyRow, col);
  return !!inherit && (inherit.inheritType === 'FROM_PARAM' || inherit.inheritType === 'FIXED');
}
function setPreviewTableCellValue(item: any, componentIndex: number, bodyRow: number, col: number, v: string) {
  const k = getTableCellPreviewKey(item, componentIndex, bodyRow, col);
  previewTableCellMap.value = { ...previewTableCellMap.value, [k]: v };
}
function getPreviewTableBodyRowCountForTable(item: any, componentIndex: number) {
  const key = getPreviewItemKey(item, componentIndex);
  const overrideRows = Number(previewTableRowCountMap.value[key]);
  if (Number.isFinite(overrideRows) && overrideRows >= 1) return Math.min(50, overrideRows);
  if (String(item?.customProps?.tableBizType ?? '') === 'FILE_COLLAB') {
    const o = fileCollabPreviewRowCountMap.value[key];
    const base = Math.max(1, Number(item?.customProps?.tableBodyRows) || 1);
    if (o != null && Number.isFinite(o) && o >= 1) return Math.min(50, o);
    return base;
  }
  return Math.max(1, Number(item?.customProps?.tableBodyRows) || 1);
}
function isRowExpandTable(item: any) {
  return (
    String(item?.customProps?.tableSubtype ?? '')
      .trim()
      .toUpperCase() === 'ROW_EXPAND'
  );
}
function onRowExpandPreviewAddRow(item: any, componentIndex: number) {
  if (isOutputIoType(item)) return;
  if (!isRowExpandTable(item)) return;
  const key = getPreviewItemKey(item, componentIndex);
  const cur = getPreviewTableBodyRowCountForTable(item, componentIndex);
  if (cur >= 50) {
    message.warning('表格行数最多为 50');
    return;
  }
  previewTableRowCountMap.value = { ...previewTableRowCountMap.value, [key]: cur + 1 };
}
function getFileCollabRowKey(item: any, componentIndex: number, bodyRow: number) {
  return `${getPreviewItemKey(item, componentIndex)}::${bodyRow}`;
}
function onFileCollabPreviewAddRow(item: any, componentIndex: number) {
  if (isOutputIoType(item)) return;
  const key = getPreviewItemKey(item, componentIndex);
  const cur = getPreviewTableBodyRowCountForTable(item, componentIndex);
  if (cur >= 50) {
    message.warning('表格行数最多为 50');
    return;
  }
  fileCollabPreviewRowCountMap.value = { ...fileCollabPreviewRowCountMap.value, [key]: cur + 1 };
}
function onFileCollabPreviewUpdate(_item: any, _componentIndex: number) {
  message.success('已更新');
}
function onPreviewTableOpClick(btn: string, item: any, componentIndex: number, bodyRow: number) {
  const t = String(btn ?? '').trim();
  if (isOutputIoType(item)) return;
  const biz = String(item?.customProps?.tableBizType ?? '');
  if (biz === 'FILE_COLLAB_SIMPLE') {
    if (t === '上传') {
      fileCollabUploadTarget.value = { item, componentIndex, bodyRow };
      fileCollabUploadInputRef.value?.click();
      return;
    }
    if (t === '下载') {
      void downloadFileCollabRow(item, componentIndex, bodyRow);
      return;
    }
    if (t === '清空') {
      clearFileCollabRow(item, componentIndex, bodyRow);
      return;
    }
    return;
  }
  if (biz === 'FILE_COLLAB') {
    if (t === '浏览' || t === '上传') {
      fileCollabUploadTarget.value = { item, componentIndex, bodyRow };
      fileCollabUploadInputRef.value?.click();
      return;
    }
    if (t === '下载') {
      void downloadFileCollabRow(item, componentIndex, bodyRow);
      return;
    }
    if (t === '清空') {
      clearFileCollabRow(item, componentIndex, bodyRow);
      return;
    }
    if (t === '删除行') {
      clearFileCollabRow(item, componentIndex, bodyRow);
      const key = getPreviewItemKey(item, componentIndex);
      const cur = getPreviewTableBodyRowCountForTable(item, componentIndex);
      if (cur > 1) {
        fileCollabPreviewRowCountMap.value = { ...fileCollabPreviewRowCountMap.value, [key]: cur - 1 };
      }
      message.success('已删除该行');
      return;
    }
    if (t === '分配') {
      message.info('分配（示例）');
      return;
    }
    if (t === '发布') {
      message.info('发布（示例）');
      return;
    }
  }
  if (biz === 'MODULE_LIB_READ' && t === '浏览') {
    showModuleTableBrowse(item, componentIndex, bodyRow);
    return;
  }
  if (t === '打开模型' || t === '生成模型') {
    openRowModel(item, componentIndex, bodyRow);
    return;
  }
  if (t === '装配模型') {
    const modelPartNo = String(getPreviewTableCellValue(item, componentIndex, bodyRow, 2) ?? '').trim();
    if (!modelPartNo) {
      message.warning('当前行模型件号为空');
      return;
    }
    const dotIndex = modelPartNo.lastIndexOf('.');
    const modelNum = dotIndex > 0 ? modelPartNo.slice(0, dotIndex) : modelPartNo;
    const modelType = dotIndex > 0 ? modelPartNo.slice(dotIndex + 1).toLowerCase() : 'prt';
    void assembleModuleInfoNew(modelNum, modelType, '', '', '', '');
    return;
  }
  if (t === '打开图纸') {
    const modelPartNo = String(getPreviewTableCellValue(item, componentIndex, bodyRow, 2) ?? '').trim();
    if (!modelPartNo) {
      message.warning('当前行模型件号为空');
      return;
    }
    const dotIndex = modelPartNo.lastIndexOf('.');
    const modelNum = dotIndex > 0 ? modelPartNo.slice(0, dotIndex) : modelPartNo;
    void openDrawingInfoNew(modelNum);
    return;
  }
}
async function downloadFileCollabRow(item: any, componentIndex: number, bodyRow: number) {
  const rowKey = getFileCollabRowKey(item, componentIndex, bodyRow);
  const fileId = String(previewFileCollabFileIdMap.value[rowKey] ?? '').trim();
  if (!fileId) {
    message.warning('请先上传文件');
    return;
  }
  const fileName = getPreviewTableCellValue(item, componentIndex, bodyRow, 2) || 'download';
  try {
    const res = await AdminApiSystemUploadFile.downloadEpcFile({ fileId } as any);
    const stream = (res as any)?.data !== undefined ? (res as any).data : res;
    downloadFileFromStream(stream, fileName);
  } catch {
    message.error('下载失败');
  }
}
function clearFileCollabRow(item: any, componentIndex: number, bodyRow: number) {
  const totalCols = getWorkspaceTablePreviewColCount(item);
  const next = { ...previewTableCellMap.value };
  for (let c = 2; c <= totalCols; c++) {
    if (isWorkspaceTableOperationColumn(item, c)) continue;
    const k = getTableCellPreviewKey(item, componentIndex, bodyRow, c);
    delete next[k];
  }
  previewTableCellMap.value = next;
  const fk = getFileCollabRowKey(item, componentIndex, bodyRow);
  const nextIds = { ...previewFileCollabFileIdMap.value };
  delete nextIds[fk];
  previewFileCollabFileIdMap.value = nextIds;
}
async function onFileCollabFileInputChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  const target = fileCollabUploadTarget.value;
  fileCollabUploadTarget.value = null;
  if (!file || !target) return;
  if (isOutputIoType(target.item)) return;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file,
      userId: userStore.getUser.id,
      confidentialLevel: 1,
    } as any);
    if (res?.data?.code == 0) {
      const d: any = res.data;
      const fileId = String(d.id ?? '').trim();
      const displayName = String(d.oldFileName ?? d.fileName ?? file.name).trim();
      setPreviewTableCellValue(target.item, target.componentIndex, target.bodyRow, 2, displayName);
      const rowKey = getFileCollabRowKey(target.item, target.componentIndex, target.bodyRow);
      previewFileCollabFileIdMap.value = { ...previewFileCollabFileIdMap.value, [rowKey]: fileId };
      message.success('上传成功');
      return;
    }
    message.error('上传失败');
  } catch {
    message.error('上传失败');
  }
}

async function customRequestPreviewUpload(item: any, index: number, options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
      confidentialLevel: 1,
    });
    if (res?.data?.code == 0) {
      const uploaded = {
        uid: String(res.data.id || options.file?.uid || Date.now()),
        name: res.data?.oldFileName || options.file?.name || '未命名文件',
        status: 'done',
        id: res.data.id || '',
        url: res.data.filePath || '',
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

async function onPreviewFileDownload(file: any) {
  const fileId = String(file?.id ?? file?.response?.id ?? file?.uid ?? '').trim();
  if (!fileId) {
    message.warning('未找到文件ID，无法下载');
    return;
  }
  try {
    const stream = await AdminApiSystemUploadFile.downloadEpcFile({ fileId } as any);
    const saveName = String(file?.name ?? '下载文件').trim() || '下载文件';
    downloadFileFromStream(stream, saveName);
  } catch {
    message.error('文件下载失败');
  }
}

function bindRichTextEditorRef(item: any, index: number, inst: any) {
  const key = getPreviewItemKey(item, index);
  const nextInst = inst || null;
  if (richTextEditorRefMap.value[key] === nextInst) return;
  richTextEditorRefMap.value[key] = nextInst;
}

function normalizeUploadListFromSaved(savedValue: string) {
  const s = String(savedValue ?? '').trim();
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) {
      return parsed
        .map((row: any, idx: number) => ({
          uid: String(row?.uid ?? row?.id ?? `${Date.now()}-${idx}`),
          name: String(row?.name ?? row?.fileName ?? row?.oldFileName ?? '已上传文件'),
          status: 'done',
          id: String(row?.id ?? ''),
          url: String(row?.url ?? row?.filePath ?? ''),
        }))
        .slice(-1);
    }
  } catch {
    // ignore json parse errors
  }
  return [
    {
      uid: `${Date.now()}`,
      name: s,
      status: 'done',
      id: '',
      url: '',
    },
  ];
}

function parseThreeDValue(raw: unknown): { templateName?: string; modelName?: string; modelSelectName?: string } | null {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  try {
    const parsed = JSON.parse(s);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return {
      templateName: String((parsed as any)?.templateName ?? '').trim(),
      modelName: String((parsed as any)?.modelName ?? '').trim(),
      modelSelectName: String((parsed as any)?.modelSelectName ?? '').trim(),
    };
  } catch {
    return null;
  }
}

function getCurrentComponentValue(item: any, index: number) {
  const type = String(item?.componentType ?? '');
  const key = getPreviewItemKey(item, index);
  if (type === 'RADIO') {
    return String(radioPreviewValueMap.value[key] ?? item?.paramValue ?? '');
  }
  if (type === 'RICH_TEXT') {
    return String(richTextEditorRefMap.value[key]?.getData?.() ?? richTextValueMap.value[key] ?? item?.paramValue ?? '');
  }
  if (type === 'FILE') {
    const list = previewUploadFileMap.value[key] || [];
    if (!Array.isArray(list) || !list.length) return '';
    return JSON.stringify(
      list.map((f: any) => ({
        id: String(f?.id ?? f?.response?.id ?? ''),
        name: String(f?.name ?? ''),
        url: String(f?.url ?? f?.response?.filePath ?? ''),
      })),
    );
  }
  if (type === '3D_VIEW') {
    const templateName = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'templateName')] ?? '');
    const modelName = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'modelName')] ?? '');
    const modelSelectName = String(previewFieldValueMap.value[getPreview3dSubKey(item, index, 'modelSelectName')] ?? '');
    const payload: Record<string, string> = {
      templateName,
      modelName,
      modelSelectName,
    };
    const nonEmpty = Object.entries(payload).filter(([, v]) => String(v ?? '').trim() !== '');
    if (nonEmpty.length > 1) {
      return JSON.stringify({
        threeDSubtype: String(item?.customProps?.threeDSubtype ?? ''),
        ...Object.fromEntries(nonEmpty),
      });
    }
    if (nonEmpty.length === 1) return String(nonEmpty[0][1]);
    if (isModelSelect3DItem(item)) {
      return String(item?.paramValue ?? '');
    }
    if (isTemplateBrowse3DItem(item) || isFixedTemplate3DItem(item)) {
      return String(item?.paramValue ?? '');
    }
    return String(item?.paramValue ?? '');
  }
  return String(previewFieldValueMap.value[key] ?? item?.paramValue ?? '');
}

function getCurrentSaveParamValues() {
  return previewList.value
    .map((item: any, index: number) => {
      const paramKey = String(item?.paramKey ?? item?.paramCode ?? '').trim();
      if (!paramKey) return null;
      return {
        paramKey,
        paramName: String(item?.paramName ?? ''),
        paramValue: getCurrentComponentValue(item, index),
      };
    })
    .filter(Boolean);
}

function toExcelColumnName(colIndex: number) {
  let n = Math.max(1, Math.floor(colIndex));
  let name = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    name = String.fromCharCode(97 + r) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function fromExcelColumnName(colName: string) {
  const s = String(colName ?? '')
    .trim()
    .toLowerCase();
  if (!s) return 0;
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code < 97 || code > 122) return 0;
    n = n * 26 + (code - 96);
  }
  return n;
}

function applySavedTablesToPreviewMap(list: any[], tables: any[] | null | undefined) {
  const nextMap: Record<string, string> = {};
  const nextFileIdMap: Record<string, string> = {};
  const tableList = Array.isArray(tables) ? tables : [];
  if (!tableList.length) return { cellMap: nextMap, fileIdMap: nextFileIdMap };
  const byComponentId = new Map<string, any>();
  tableList.forEach((t: any) => {
    const id = String(t?.componentId ?? '').trim();
    if (id) byComponentId.set(id, t);
  });
  list.forEach((item: any, componentIndex: number) => {
    if (String(item?.componentType ?? '') !== 'TABLE') return;
    const componentId = String(item?.id ?? '').trim();
    if (!componentId || !byComponentId.has(componentId)) return;
    const table = byComponentId.get(componentId);
    const rows = Array.isArray(table?.values) ? table.values : [];
    if (!rows.length) return;
    const totalCols = getWorkspaceTablePreviewColCount(item);
    const dataCols: number[] = [];
    for (let col = 1; col <= totalCols; col++) {
      if (col === 1) continue;
      if (isWorkspaceTableOperationColumn(item, col)) continue;
      dataCols.push(col);
    }
    rows.forEach((rowObj: any) => {
      if (!rowObj || typeof rowObj !== 'object') return;
      Object.entries(rowObj).forEach(([cell, val]) => {
        const rawCell = String(cell ?? '').trim();
        const isFileIdCell = /FileId$/i.test(rawCell);
        const baseCell = isFileIdCell ? rawCell.replace(/FileId$/i, '') : rawCell;
        const m = /^([a-zA-Z]+)(\d+)$/.exec(baseCell);
        if (!m) return;
        const dataColNo = fromExcelColumnName(m[1]);
        const rowNo = Number(m[2]);
        if (!dataColNo || !rowNo) return;
        const col = dataCols[dataColNo - 1];
        if (!col) return;
        if (isFileIdCell) {
          const rowKey = getFileCollabRowKey(item, componentIndex, rowNo);
          const fileId = String(val ?? '').trim();
          if (fileId) nextFileIdMap[rowKey] = fileId;
          return;
        }
        const key = getTableCellPreviewKey(item, componentIndex, rowNo, col);
        nextMap[key] = String(val ?? '');
      });
    });
  });
  return { cellMap: nextMap, fileIdMap: nextFileIdMap };
}

/** 与导出参数一致：不向富文本 / 上传 / 表格 / 三维写入导入值 */
const EXPORT_PARAM_EXCEL_SKIP_TYPES = new Set(['RICH_TEXT', 'FILE', 'TABLE', '3D_VIEW']);

/** @returns 实际写入表单的字段数量 */
function applyToolbarImportedParams(parsed: { values?: unknown[] }): number {
  const rows = Array.isArray(parsed?.values) ? parsed.values : [];
  const byKey = new Map<string, string>();
  rows.forEach((row: any) => {
    const pk = String(row?.paramKey ?? row?.paramCode ?? '').trim();
    if (!pk) return;
    byKey.set(pk, String(row?.paramValue ?? row?.value ?? ''));
  });
  if (!byKey.size) {
    message.warning('文件中未找到可导入的参数');
    return 0;
  }
  const next = { ...previewFieldValueMap.value };
  const nextRadio = { ...radioPreviewValueMap.value };
  const nextLastValid = { ...inputLastValidValueMap.value };
  let n = 0;
  previewList.value.forEach((item: any, index: number) => {
    if (!isPreviewConstraintVisible(item)) return;
    const type = String(item?.componentType ?? '');
    if (EXPORT_PARAM_EXCEL_SKIP_TYPES.has(type)) return;
    const pk = String(item?.paramCode ?? item?.paramKey ?? '').trim();
    if (!pk || !byKey.has(pk)) return;
    const val = byKey.get(pk)!;
    const key = getPreviewItemKey(item, index);
    if (['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'DATE', 'DATA_VIEW'].includes(type)) {
      next[key] = val;
      n++;
      if (type === 'INPUT') {
        nextLastValid[key] = val;
      }
    }
    if (type === 'RADIO') {
      nextRadio[key] = val;
      n++;
    }
  });
  previewFieldValueMap.value = next;
  radioPreviewValueMap.value = nextRadio;
  inputLastValidValueMap.value = nextLastValid;
  if (n) message.success('导入成功');
  else message.warning('当前页面没有与文件匹配的参数项');
  return n;
}

/** 解析「导出参数」同款 Excel：表头含 参数名称 / 参数代号 / 参数值 */
function parseImportParamsExcelFromArrayBuffer(buf: ArrayBuffer): { values: unknown[] } {
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return { values: [] };
  const sheet = wb.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<(string | number | boolean | null | undefined)[]>(sheet, {
    header: 1,
    raw: false,
    defval: '',
  }) as unknown[][];
  if (!Array.isArray(matrix) || matrix.length < 2) return { values: [] };
  const headerRow = (matrix[0] || []).map(c =>
    String(c ?? '')
      .trim()
      .replace(/\s+/g, ''),
  );
  const findCol = (must: string) => headerRow.findIndex(h => h === must || h.includes(must.replace(/\s/g, '')));
  const nameIdx = findCol('参数名称');
  let codeIdx = findCol('参数代号');
  let valIdx = findCol('参数值');
  if (codeIdx < 0) codeIdx = headerRow.findIndex(h => h.includes('代号'));
  if (valIdx < 0) valIdx = headerRow.findIndex(h => h.includes('参数值') || (h.includes('值') && !h.includes('代号')));
  if (codeIdx < 0 || valIdx < 0) {
    message.error('Excel 表头需包含「参数代号」「参数值」列（与导出模板一致）');
    return { values: [] };
  }
  const values: unknown[] = [];
  for (let i = 1; i < matrix.length; i++) {
    const row = matrix[i];
    if (!Array.isArray(row)) continue;
    const paramCode = String(row[codeIdx] ?? '').trim();
    if (!paramCode) continue;
    const paramValue = String(row[valIdx] ?? '').trim();
    const paramName = nameIdx >= 0 ? String(row[nameIdx] ?? '').trim() : '';
    values.push({ paramCode, paramKey: paramCode, paramValue, paramName });
  }
  return { values };
}

function openImportParamsModal() {
  importParamsSelectedFile.value = null;
  importParamsFileInputKey.value += 1;
  importParamsModalVisible.value = true;
}

function onImportParamsModalCancel() {
  importParamsModalVisible.value = false;
  importParamsSelectedFile.value = null;
}

function onImportParamsFileSelect(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const f = input.files?.[0];
  importParamsSelectedFile.value = f ?? null;
}

async function onImportParamsModalConfirm() {
  const file = importParamsSelectedFile.value;
  if (!file) {
    message.warning('请先选择 Excel 文件');
    return Promise.reject();
  }
  const lower = file.name.toLowerCase();
  if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
    message.warning('请上传 .xlsx 或 .xls 文件');
    return Promise.reject();
  }
  importParamsModalLoading.value = true;
  try {
    const buf = await file.arrayBuffer();
    const parsed = parseImportParamsExcelFromArrayBuffer(buf);
    if (!Array.isArray(parsed.values) || parsed.values.length === 0) {
      return Promise.reject();
    }
    const applied = applyToolbarImportedParams(parsed);
    if (!applied) {
      return Promise.reject();
    }
    importParamsModalVisible.value = false;
    importParamsSelectedFile.value = null;
  } catch {
    message.error('解析 Excel 失败');
    return Promise.reject();
  } finally {
    importParamsModalLoading.value = false;
  }
}

function buildParamExportRowsForExcel(): Array<{ paramName: string; paramCode: string; paramValue: string }> {
  const rows: Array<{ paramName: string; paramCode: string; paramValue: string }> = [];
  previewList.value.forEach((item: any, index: number) => {
    if (!isPreviewConstraintVisible(item)) return;
    const type = String(item?.componentType ?? '');
    if (EXPORT_PARAM_EXCEL_SKIP_TYPES.has(type)) return;
    const paramCode = String(item?.paramKey ?? item?.paramCode ?? '').trim();
    if (!paramCode) return;
    const paramName = String(item?.paramName ?? '').trim() || paramCode;
    const rawVal = getCurrentComponentValue(item, index);
    const paramValue = rawVal == null ? '' : String(rawVal);
    rows.push({ paramName, paramCode, paramValue });
  });
  return rows;
}

/** 导出为 Excel：表头 参数名称 / 参数代号 / 参数值，工作表名 Sheet1 */
function exportParamsToExcel(): boolean {
  const rows = buildParamExportRowsForExcel();
  if (!rows.length) {
    message.warning('暂无可导出的参数');
    return false;
  }
  try {
    const aoa: string[][] = [['参数名称', '参数代号', '参数值'], ...rows.map(r => [r.paramName, r.paramCode, r.paramValue])];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `流程节点参数-${Date.now()}.xlsx`);
    message.success('导出成功');
    return true;
  } catch {
    message.error('导出 Excel 失败');
    return false;
  }
}

async function runToolbarAction(label: string): Promise<boolean> {
  const t = String(label ?? '').trim();
  if (t === '导出参数') {
    return exportParamsToExcel();
  }
  if (t === '导入参数') {
    openImportParamsModal();
    return true;
  }
  return false;
}

function getCurrentTableSavePayload() {
  return previewList.value
    .map((item: any, componentIndex: number) => {
      if (String(item?.componentType ?? '') !== 'TABLE') return null;
      const totalCols = getWorkspaceTablePreviewColCount(item);
      const totalRows = getPreviewTableBodyRowCountForTable(item, componentIndex);
      const cellMap: Record<string, string> = {};
      const isFileCollabBiz = ['FILE_COLLAB', 'FILE_COLLAB_SIMPLE'].includes(String(item?.customProps?.tableBizType ?? ''));
      for (let row = 1; row <= totalRows; row++) {
        let dataColIndex = 0;
        for (let col = 1; col <= totalCols; col++) {
          if (col === 1) continue; // 跳过序号/选择列
          if (isWorkspaceTableOperationColumn(item, col)) continue; // 跳过操作列
          dataColIndex++;
          const v = String(getPreviewTableCellValue(item, componentIndex, row, col) ?? '');
          const cellKey = `${toExcelColumnName(dataColIndex)}${row}`;
          if (isFileCollabBiz && dataColIndex === 1) {
            const rowKey = getFileCollabRowKey(item, componentIndex, row);
            const fileId = String(previewFileCollabFileIdMap.value[rowKey] ?? '').trim();
            if (fileId) {
              cellMap[`${cellKey}FileId`] = fileId;
            }
          }
          if (v.trim() === '') continue;
          cellMap[cellKey] = v;
        }
      }
      return {
        componentId: item?.id ?? '',
        tableName: String(item?.customProps?.tableTitle ?? item?.paramName ?? '表格'),
        values: [cellMap],
      };
    })
    .filter(Boolean);
}

/** 表格单元格唯一编号参数：paramKey=uniqueCode，paramValue=单元格值 */
function getCurrentTableUniqueCodeSaveValues() {
  const rows: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  previewList.value.forEach((item: any, componentIndex: number) => {
    if (String(item?.componentType ?? '') !== 'TABLE') return;
    const totalCols = getWorkspaceTablePreviewColCount(item);
    const totalRows = getPreviewTableBodyRowCountForTable(item, componentIndex);
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalCols; col++) {
        if (col === 1) continue;
        if (isWorkspaceTableOperationColumn(item, col)) continue;
        const uniqueCode = getTableCellUniqueCode(item, row, col);
        if (!uniqueCode) continue;
        const paramValue = String(getPreviewTableCellValue(item, componentIndex, row, col) ?? '');
        rows.push({
          paramKey: uniqueCode,
          paramName: uniqueCode,
          paramValue,
        });
      }
    }
  });
  return rows;
}

watch(
  () => [props.componentsJson, props.savedParamValues, props.savedTables],
  () => {
    const list = previewList.value;
    const nextFieldValueMap: Record<string, string> = {};
    const nextRadioMap: Record<string, string> = {};
    const nextRichTextMap: Record<string, string> = {};
    const nextUploadMap: Record<string, any[]> = {};
    const nextBlurred: Record<string, boolean> = {};
    const nextLastValid: Record<string, string> = {};
    list.forEach((item: any, index: number) => {
      const key = getPreviewItemKey(item, index);
      const code = String(item?.paramCode ?? '').trim();
      const saved = code && savedValueMap.value.has(code) ? String(savedValueMap.value.get(code) ?? '') : '';
      const base = saved || String(item?.paramValue ?? '');
      if (['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'DATE', 'DATA_VIEW'].includes(String(item?.componentType ?? ''))) {
        nextFieldValueMap[key] = base;
      }
      if (String(item?.componentType ?? '') === 'RADIO') {
        nextRadioMap[key] = base;
      }
      if (String(item?.componentType ?? '') === 'RICH_TEXT') {
        nextRichTextMap[key] = base;
      }
      if (String(item?.componentType ?? '') === 'FILE') {
        nextUploadMap[key] = normalizeUploadListFromSaved(base);
      }
      if (String(item?.componentType ?? '') === 'INPUT') {
        nextBlurred[key] = false;
        nextLastValid[key] = base;
      }
      if (String(item?.componentType ?? '') === '3D_VIEW') {
        const parsed3d = parseThreeDValue(base);
        if (isTemplateBrowse3DItem(item) || isFixedTemplate3DItem(item)) {
          const templateDefault = String(item?.customProps?.templateValue ?? '');
          const modelDefault = String(item?.customProps?.modelValue ?? '');
          const templateFromSaved = String(parsed3d?.templateName ?? templateDefault);
          const modelFromSaved = String(parsed3d?.modelName ?? base ?? modelDefault);
          nextFieldValueMap[getPreview3dSubKey(item, index, 'templateName')] = templateFromSaved;
          nextFieldValueMap[getPreview3dSubKey(item, index, 'modelName')] = modelFromSaved;
        }
        if (isModelSelect3DItem(item)) {
          nextFieldValueMap[getPreview3dSubKey(item, index, 'modelSelectName')] = String(parsed3d?.modelSelectName ?? base ?? item?.customProps?.modelSelectName ?? '');
        }
      }
    });
    previewFieldValueMap.value = nextFieldValueMap;
    radioPreviewValueMap.value = nextRadioMap;
    richTextValueMap.value = nextRichTextMap;
    previewUploadFileMap.value = { ...previewUploadFileMap.value, ...nextUploadMap };
    const tableRestore = applySavedTablesToPreviewMap(list, props.savedTables);
    previewTableCellMap.value = tableRestore.cellMap;
    previewFileCollabFileIdMap.value = tableRestore.fileIdMap;
    previewTableRowCountMap.value = {};
    inputRangeBlurredMap.value = nextBlurred;
    inputLastValidValueMap.value = nextLastValid;
    void nextTick(() => {
      Object.entries(nextRichTextMap).forEach(([k, v]) => {
        richTextEditorRefMap.value[k]?.setData?.(v);
      });
    });
  },
  { immediate: true, deep: true },
);

defineExpose({
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
  getCurrentTableUniqueCodeSaveValues,
  runToolbarAction,
  exportParamsToExcel,
});
</script>

<template>
  <div class="activity-preview-canvas">
    <a-tooltip title="参数影响范围" placement="left">
      <span class="param-impact-scope-entry" @click="onImpactEvalEntryClick">影响评估</span>
    </a-tooltip>
    <a-modal v-model:visible="impactEvalModalVisible" title="影响评估" width="920px" :footer="null" @cancel="onImpactEvalModalClose">
      <div class="impact-eval-modal-content">
        <div class="impact-eval-toolbar">
          <a-select v-model:value="impactSelectedParamCode" :options="impactParamOptions" placeholder="请选择参数" class="impact-eval-param-select" allow-clear />
          <a-button type="primary" :loading="impactAnalyzing" @click="onImpactAnalyzeClick">分析</a-button>
        </div>
        <a-table :columns="impactColumns" :data-source="impactResultRows" :pagination="false" :loading="impactAnalyzing" size="small" bordered row-key="key" :scroll="{ y: 300 }" />
      </div>
    </a-modal>
    <a-modal
      v-model:visible="importParamsModalVisible"
      title="导入参数"
      width="520px"
      :mask-closable="false"
      :confirm-loading="importParamsModalLoading"
      ok-text="确定"
      cancel-text="取消"
      @ok="onImportParamsModalConfirm"
      @cancel="onImportParamsModalCancel">
      <p class="import-params-modal-tip">请选择由「导出参数」生成的 Excel（.xlsx / .xls），表头须包含「参数代号」「参数值」列；解析在本地完成，不上传服务器。</p>
      <input
        :key="importParamsFileInputKey"
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        class="import-params-file-input"
        @change="onImportParamsFileSelect" />
      <div v-if="importParamsSelectedFile" class="import-params-file-name">已选择：{{ importParamsSelectedFile.name }}</div>
    </a-modal>
    <input ref="fileCollabUploadInputRef" type="file" class="activity-preview-file-collab-input" tabindex="-1" aria-hidden="true" @change="onFileCollabFileInputChange" />
    <div v-if="previewList.length === 0" class="activity-preview-empty">暂无页面组件</div>
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
            <span class="component-title-text--clickable" @click="onParamTitleClick(item)">{{ item.paramName || '未命名组件' }}</span>
            <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
              <ExclamationCircleOutlined class="component-knowledge-hint" />
            </a-tooltip>
          </div>

          <template v-if="item.componentType === 'TITLE'">
            <div class="title-preview-text">{{ item.paramName || '标题' }}</div>
            <div v-if="item.customProps?.hasDivider" class="title-divider-line"></div>
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
            <div class="component-title">
              <span class="component-title-text--clickable" @click="onParamTitleClick(item)">{{ item.paramName || '数据浏览' }}</span>
              <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
                <ExclamationCircleOutlined class="component-knowledge-hint" />
              </a-tooltip>
            </div>
            <div class="data-view-preview-row">
              <a-input
                v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
                placeholder="请选择参数"
                disabled
                class="data-view-preview-input browse-adjoined-input" />
              <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)" @click="showModuleInfo(item, index, 'dataView')">浏览</a-button>
            </div>
          </div>

          <a-select
            v-else-if="item.componentType === 'SELECT'"
            v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
            :options="getSelectOptions(item).map(v => ({ label: v, value: v }))"
            placeholder="请选择"
            :disabled="isOutputIoType(item)"
            class="preview-field" />
          <a-auto-complete
            v-else-if="item.componentType === 'AUTO_COMPLETE'"
            v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
            :options="getSelectOptions(item).map(v => ({ value: v }))"
            placeholder="请选择或输入"
            :disabled="isOutputIoType(item)"
            class="preview-field" />

          <div v-else-if="item.componentType === 'RADIO'" class="radio-preview-wrap">
            <div class="component-title">
              <span class="component-title-text--clickable" @click="onParamTitleClick(item)">{{ item.paramName || '单选项' }}</span>
            </div>
            <div v-if="getRadioOptions(item).length === 0" class="radio-preview-empty">暂无选项</div>
            <a-radio-group v-else v-model:value="radioPreviewValueMap[getPreviewItemKey(item, index)]" :disabled="isOutputIoType(item)" class="radio-preview-grid">
              <a-radio v-for="(opt, optIdx) in getRadioOptions(item)" :key="`${opt}-${optIdx}`" :value="opt" class="radio-preview-item">{{ opt }}</a-radio>
            </a-radio-group>
          </div>

          <div v-else-if="item.componentType === 'RICH_TEXT'" class="rich-preview-wrap">
            <CkeditorPlugin :ref="(inst: any) => bindRichTextEditorRef(item, index, inst)" height="180" :disabled="isOutputIoType(item)" />
          </div>

          <div v-else-if="item.componentType === 'FILE'" class="file-preview-wrap">
            <div class="component-title">
              <span class="component-title-text--clickable" @click="onParamTitleClick(item)">{{ item.paramName || '文件上传' }}</span>
            </div>
            <a-upload-dragger
              :file-list="previewUploadFileMap[getPreviewItemKey(item, index)] || []"
              :disabled="isOutputIoType(item)"
              :multiple="false"
              :custom-request="(options: any) => customRequestPreviewUpload(item, index, options)"
              @preview="(file: any) => onPreviewFileDownload(file)"
              @change="(info: any) => onPreviewFileChange(item, index, info)">
              <p class="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p class="ant-upload-text">点击或拖拽上传文件</p>
              <p class="ant-upload-hint">支持单文件上传，示例预览模式</p>
            </a-upload-dragger>
          </div>

          <div
            v-else-if="item.componentType === 'TABLE'"
            class="fixed-table-preview"
            :class="{
              'fixed-table-preview--file-collab': String(item.customProps?.tableBizType ?? '') === 'FILE_COLLAB',
              'fixed-table-preview--simple-file': String(item.customProps?.tableBizType ?? '') === 'FILE_COLLAB_SIMPLE',
            }">
            <div class="component-title fixed-table-preview-title-row">
              <span class="fixed-table-preview-title-text component-title-text--clickable" @click="onParamTitleClick(item)">{{
                item.customProps?.tableTitle || item.paramName || '表格'
              }}</span>
              <div v-if="String(item.customProps?.tableBizType ?? '') === 'FILE_COLLAB'" class="file-collab-preview-toolbar">
                <a-button type="link" size="small" :disabled="isOutputIoType(item)" @click="onFileCollabPreviewAddRow(item, index)">添加行</a-button>
                <a-button type="link" size="small" :disabled="isOutputIoType(item)" @click="onFileCollabPreviewUpdate(item, index)">更新</a-button>
              </div>
              <div v-else-if="isRowExpandTable(item)" class="file-collab-preview-toolbar">
                <a-button type="link" size="small" :disabled="isOutputIoType(item)" @click="onRowExpandPreviewAddRow(item, index)">添加行</a-button>
              </div>
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
                  <tr v-for="r in tableDimensionRange(getPreviewTableBodyRowCountForTable(item, index))" :key="`b-${r}`">
                    <td
                      v-for="c in tableDimensionRange(getWorkspaceTablePreviewColCount(item))"
                      :key="`b-${r}-${c}`"
                      class="fixed-table-preview-td"
                      :class="{ 'fixed-table-preview-td--op': isWorkspaceTableOperationColumn(item, c) }"
                      :style="getFixedTableColumnPreviewStyle(item, c)">
                      <template v-if="c === 1 && String(item.customProps?.firstColumnType || 'INDEX') === 'INDEX'">{{ r }}</template>
                      <template v-else-if="isWorkspaceTableOperationColumn(item, c)">
                        <div class="fixed-table-cell-op-btns">
                          <template v-for="btn in getWorkspaceTableOperationButtons(item)" :key="`preview-table-op-${index}-${r}-${btn}`">
                            <a-tooltip v-if="btn === '浏览'" :title="btn" placement="topLeft">
                              <EyeOutlined
                                class="fixed-table-cell-op-glyph"
                                :class="{ 'fixed-table-cell-op-glyph--disabled': isOutputIoType(item) }"
                                @click="!isOutputIoType(item) && onPreviewTableOpClick(btn, item, index, r)" />
                            </a-tooltip>
                            <a-tooltip v-else-if="getWorkspaceTableOperationIcon(btn)" :title="btn" placement="topLeft">
                              <img
                                class="fixed-table-cell-op-icon"
                                :src="getWorkspaceTableOperationIcon(btn)"
                                :alt="btn"
                                :class="{ 'fixed-table-cell-op-icon--disabled': isOutputIoType(item) }"
                                @click="!isOutputIoType(item) && onPreviewTableOpClick(btn, item, index, r)" />
                            </a-tooltip>
                            <a
                              v-else
                              href="javascript:void(0)"
                              class="fixed-table-cell-op-link"
                              :class="{ 'fixed-table-cell-op-link--disabled': isOutputIoType(item) }"
                              @click.prevent="onPreviewTableOpClick(btn, item, index, r)">
                              {{ btn }}
                            </a>
                          </template>
                        </div>
                      </template>
                      <a-input
                        v-else
                        :value="getPreviewTableCellValue(item, index, r, c)"
                        size="small"
                        placeholder="请输入"
                        :disabled="isOutputIoType(item) || isPreviewTableCellReadonly(item, r, c)"
                        @update:value="(v: string) => setPreviewTableCellValue(item, index, r, c, v)" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else-if="isTemplateBrowse3DItem(item)" class="template-browse-3d-preview">
            <div class="template-browse-3d-row template-browse-3d-row--stacked">
              <div class="template-browse-3d-group">
                <div class="template-browse-3d-label">{{ item.paramName || '模板名称' }}：</div>
                <div class="template-browse-3d-controls">
                  <a-input
                    v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'templateName')]"
                    placeholder="请选择参数"
                    disabled
                    class="template-browse-3d-input template-browse-3d-input--grey" />
                  <a-button type="primary" size="small" class="template-browse-3d-action-btn template-browse-3d-browse-btn" @click="showModuleInfo(item, index, 'templateBrowse')">浏览</a-button>
                </div>
              </div>
              <div class="template-browse-3d-group">
                <div class="template-browse-3d-label">{{ item.customProps?.modelName || '模型名称' }}：</div>
                <div class="template-browse-3d-controls">
                  <a-input
                    v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'modelName')]"
                    placeholder="请输入"
                    :disabled="shouldDisable3dModelInput(item)"
                    :class="['template-browse-3d-input', { 'template-browse-3d-input--grey': shouldDisable3dModelInput(item) }]" />
                  <div class="three-d-preview-btn-grid">
                    <a-button
                      v-for="btn in get3dPreviewButtons(item)"
                      :key="`preview-tpl-btn-${btn}`"
                      type="primary"
                      size="small"
                      class="template-browse-3d-action-btn"
                      :disabled="isOutputIoType(item)"
                      @click="handle3dPreviewButtonClick(btn, item, index)"
                      >{{ btn }}</a-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="isFixedTemplate3DItem(item)" class="template-browse-3d-preview">
            <div class="template-browse-3d-row template-browse-3d-row--stacked">
              <div v-if="shouldShowFixedTemplateName(item)" class="template-browse-3d-group">
                <div class="template-browse-3d-label">{{ item.paramName || '模板名称' }}：</div>
                <div class="template-browse-3d-controls">
                  <a-input
                    v-model:value="previewFieldValueMap[getPreview3dSubKey(item, index, 'templateName')]"
                    placeholder="请输入"
                    disabled
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
                    :class="['template-browse-3d-input', { 'template-browse-3d-input--grey': shouldDisable3dModelInput(item) }]" />
                  <div class="three-d-preview-btn-grid">
                    <a-button
                      v-for="btn in get3dPreviewButtons(item)"
                      :key="`preview-fixed-btn-${btn}`"
                      type="primary"
                      size="small"
                      class="template-browse-3d-action-btn"
                      :disabled="isOutputIoType(item)"
                      @click="handle3dPreviewButtonClick(btn, item, index)"
                      >{{ btn }}</a-button
                    >
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
              <a-button type="primary" size="small" class="template-browse-3d-action-btn template-browse-3d-browse-btn" @click="showModuleInfo(item, index, 'modelSelectBrowse')">浏览</a-button>
              <a-button
                v-for="btn in getModelSelectPreviewButtons(item)"
                :key="`preview-model-select-btn-${btn}`"
                type="primary"
                size="small"
                class="template-browse-3d-action-btn"
                :disabled="isOutputIoType(item)"
                @click="handle3dPreviewButtonClick(btn, item, index)"
                >{{ btn }}</a-button
              >
            </div>
          </div>

          <div v-else class="preview-field-join-row">
            <a-input v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]" :disabled="isOutputIoType(item)" class="preview-field" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModuleLibraryPickerModal
    v-model:visible="modulePickerVisible"
    :category-id="modulePickerCategoryId"
    :menu-id="modulePickerMenuId"
    :user-id="userStore.getUser.id"
    @confirm="onModulePickerConfirm" />
</template>

<style scoped lang="less">
.activity-preview-file-collab-input {
  position: fixed;
  left: -9999px;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
}
.activity-preview-canvas {
  position: relative;
  height: 100%;
  flex: 1;
  overflow: visible;
  padding: 12px 16px;
  padding-bottom: 20px;
  box-sizing: border-box;
  scrollbar-gutter: stable;
  --activity-preview-component-width: 270px;
  --activity-preview-wide-component-width: 650px;
  --activity-preview-file-upload-width: 600px;
  --activity-preview-table-width: 700px;
  --activity-preview-grid-column-gap: 150px;
  --activity-preview-grid-row-gap: 32px;
}
.param-impact-scope-entry {
  position: absolute;
  top: 8px;
  right: -10px;
  z-index: 5;
  color: #1677ff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
}
.impact-eval-modal-content {
  color: #595959;
  line-height: 1.8;
  min-height: 420px;
}
.impact-eval-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.impact-eval-param-select {
  width: 360px;
  max-width: 100%;
}
.component-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, var(--activity-preview-component-width)));
  column-gap: var(--activity-preview-grid-column-gap);
  row-gap: var(--activity-preview-grid-row-gap);
  justify-content: start;
  width: max-content;
  min-width: 100%;
}
.component-card {
  border: none;
  border-radius: 4px;
  padding: 6px 0;
}
.component-card.full-row-item {
  grid-column: 1 / -1;
}
.component-title {
  font-size: 13px;
  color: #444;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.component-title-text--clickable {
  cursor: pointer;
}
.component-knowledge-hint {
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
}
.preview-field {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.title-preview-text {
  font-size: 18px;
  color: #222;
  font-weight: 700;
  margin-bottom: 6px;
}
.title-divider-line,
.divider-preview-line {
  height: 1px;
  background: #d9d9d9;
  width: 100%;
}
.data-view-preview-row {
  display: flex;
  gap: 8px;
}
.data-view-preview {
  display: flex;
  flex-direction: column;
}
.data-view-preview-input {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.value-range-inline-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.value-range-inline-row .preview-field {
  flex: 0 0 var(--activity-preview-component-width);
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
.ant-input.preview-input-range-error {
  border-color: #ff4d4f !important;
}
.radio-preview-wrap,
.rich-preview-wrap,
.fixed-table-preview {
  width: var(--activity-preview-wide-component-width);
  max-width: 100%;
}
.file-preview-wrap {
  width: var(--activity-preview-file-upload-width);
  max-width: 100%;
}
.file-preview-wrap :deep(.ant-upload-wrapper),
.file-preview-wrap :deep(.ant-upload-drag) {
  width: var(--activity-preview-file-upload-width) !important;
  max-width: 100%;
}
.radio-preview-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.radio-preview-empty {
  color: #999;
  font-size: 12px;
}
.fixed-table-preview-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  max-width: min(100%, var(--activity-preview-table-width));
  padding-right: 0;
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
  box-shadow: none;
  border-right: 1px solid #e8e8e8;
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
.fixed-table-preview-title-row {
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}
.fixed-table-preview-title-text {
  font-size: 14px;
}
.file-collab-preview-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
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
.fixed-table-cell-op-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  cursor: pointer;
}
.fixed-table-cell-op-icon--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.fixed-table-cell-op-glyph {
  font-size: 16px;
  color: #1677ff;
  cursor: pointer;
  line-height: 1;
}
.fixed-table-cell-op-glyph--disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
.template-browse-3d-preview,
.model-select-3d-preview {
  width: 100%;
  max-width: var(--activity-preview-wide-component-width);
}
.model-select-3d-preview {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.template-browse-3d-row--stacked {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--activity-preview-grid-row-gap);
  width: 100%;
}
.template-browse-3d-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.template-browse-3d-label,
.model-select-3d-label {
  color: #444;
  font-size: 12px;
}
.template-browse-3d-controls,
.model-select-3d-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  min-width: 0;
}
.template-browse-3d-input {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.template-browse-3d-input--grey :deep(.ant-input) {
  background: #f5f5f5;
}
.template-browse-3d-action-btn {
  flex-shrink: 0;
  min-width: 64px;
  height: 32px;
  padding: 0 10px;
  border-radius: 4px;
}
.template-browse-3d-browse-btn {
  min-width: 88px;
}
.three-d-preview-btn-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
}
.activity-preview-empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
.data-view-assemble-btn {
  min-width: 64px;
}
.preview-field-join-row .preview-field {
  flex: 0 1 var(--activity-preview-component-width);
}
.import-params-modal-tip {
  margin: 0 0 12px;
  color: #595959;
  font-size: 13px;
  line-height: 1.6;
}
.import-params-file-input {
  display: block;
  max-width: 100%;
}
.import-params-file-name {
  margin-top: 10px;
  font-size: 13px;
  color: #262626;
}
</style>
