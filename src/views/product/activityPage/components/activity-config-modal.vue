<script setup lang="ts">
import type { Component } from 'vue';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import {
  AimOutlined,
  BorderOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CodeSandboxOutlined,
  FileOutlined,
  DesktopOutlined,
  FileTextOutlined,
  InboxOutlined,
  MinusOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import ParameterGeneral from '../../module/components/modal/ParameterGeneral.vue';
import FormulaEditorModal from './formula-editor-modal.vue';
import { businessApiLibrary } from '@/api/tags/library/基础资源库';
import { LibraryPageRequestDTOModel } from '@/api/models/library/LibraryPageRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
const props = defineProps({
  modalVisible: { type: Boolean, default: false },
  record: { type: Object, default: () => ({}) },
  saveLoading: { type: Boolean, default: false },
});

const ParameterGeneralVisible = ref<boolean>(false);
const ParameterGeneralRef = ref<any>(null);

/** 参数字典选择回填目标：组件 paramCode、列定义草稿或表格单元格继承配置 */
type ParameterPickTarget =
  | { type: 'component' }
  | { type: 'tableColDraft'; colIndex: number }
  | { type: 'tableCellInherit'; field: 'cellParamCode' | 'cellTableNumber' | 'cellTableCellRef' }
  | { type: 'formulaExpression' };
const parameterPickTarget = ref<ParameterPickTarget>({ type: 'component' });
const emit = defineEmits<{ close: []; save: [payload: any] }>();
const visible = computed({ get: () => props.modalVisible, set: value => !value && emit('close') });
const userStore = useUserStore();
/** 左侧组件库每项前的蓝色图标（与示意图一致：输入框/列表/文档/表格/立方体等） */
function getPaletteItemIcon(item: { type: string; tableSubtype?: string; threeDSubtype?: string }): Component {
  if (item.type === 'TABLE') return TableOutlined;
  if (item.type === '3D_VIEW') return CodeSandboxOutlined;
  const map: Record<string, Component> = {
    INPUT: BorderOutlined,
    TEXTAREA: BorderOutlined,
    TITLE: CheckCircleOutlined,
    SELECT: UnorderedListOutlined,
    RADIO: AimOutlined,
    RICH_TEXT: FileTextOutlined,
    DATE: CalendarOutlined,
    FILE: FileOutlined,
    DIVIDER: MinusOutlined,
    DATA_VIEW: DesktopOutlined,
  };
  return map[item.type] || BorderOutlined;
}

const paletteGroups = [
  {
    title: '基础组件',
    items: [
      { label: '单行输入', type: 'INPUT' },
      { label: '多行输入', type: 'TEXTAREA' },
      { label: '标题', type: 'TITLE' },
      { label: '下拉选项', type: 'SELECT' },
      { label: '单选项', type: 'RADIO' },
      { label: '富文本', type: 'RICH_TEXT' },
      { label: '日期', type: 'DATE' },
      { label: '附件', type: 'FILE' },
      { label: '分隔线', type: 'DIVIDER' },
      { label: '数据浏览', type: 'DATA_VIEW' },
    ],
  },
  {
    title: '表格组件',
    items: [
      { label: '固定表格', type: 'TABLE', tableSubtype: 'FIXED' },
      { label: '行扩展表格', type: 'TABLE', tableSubtype: 'ROW_EXPAND' },
    ],
  },
  {
    title: '三维组件',
    items: [
      { label: '浏览模版创建', type: '3D_VIEW', threeDSubtype: 'TEMPLATE_BROWSE' },
      { label: '模型选装选配', type: '3D_VIEW', threeDSubtype: 'MODEL_SELECT' },
      { label: '固定模版创建', type: '3D_VIEW', threeDSubtype: 'FIXED_TEMPLATE' },
    ],
  },
];

const basicTypes = ['INPUT', 'TEXTAREA', 'SELECT', 'RADIO', 'DATE', 'TITLE', 'RICH_TEXT', 'DIVIDER', 'DATA_VIEW'];
const uploadTypes = ['FILE'];
const tableTypes = ['TABLE'];
const threeDTypes = ['3D_VIEW'];
const selectedIndex = ref(-1);
const componentList = ref<any[]>([]);
const draggingType = ref('');
const isDragOverCanvas = ref(false);
const draggingItemIndex = ref(-1);
const dropInsertIndex = ref(-1);
const formState = ref({ formId: null as number | null, formCode: null as number | null, activityPageId: null as number | null, operationType: 'update' });
const selectedComponent = computed(() => (selectedIndex.value < 0 ? null : componentList.value[selectedIndex.value] || null));
const isTextLikeComponent = computed(() => ['INPUT', 'TEXTAREA'].includes(selectedComponent.value?.componentType));
const isDateComponent = computed(() => selectedComponent.value?.componentType === 'DATE');
const isRichTextComponent = computed(() => selectedComponent.value?.componentType === 'RICH_TEXT');
const isFileComponent = computed(() => selectedComponent.value?.componentType === 'FILE');
const isSelectComponent = computed(() => selectedComponent.value?.componentType === 'SELECT');
const isRadioComponent = computed(() => selectedComponent.value?.componentType === 'RADIO');
const isTitleComponent = computed(() => selectedComponent.value?.componentType === 'TITLE');
const isDividerComponent = computed(() => selectedComponent.value?.componentType === 'DIVIDER');
const isDataViewComponent = computed(() => selectedComponent.value?.componentType === 'DATA_VIEW');
const isWorkspaceTableComponent = computed(() => {
  const t = selectedComponent.value?.customProps?.tableSubtype;
  return selectedComponent.value?.componentType === 'TABLE' && (t === 'FIXED' || t === 'ROW_EXPAND');
});
const isTemplateBrowse3DComponent = computed(
  () => selectedComponent.value?.componentType === '3D_VIEW' && selectedComponent.value?.customProps?.threeDSubtype === 'TEMPLATE_BROWSE',
);
const isModelSelect3DComponent = computed(() => selectedComponent.value?.componentType === '3D_VIEW' && selectedComponent.value?.customProps?.threeDSubtype === 'MODEL_SELECT');
const isFixedTemplate3DComponent = computed(() => selectedComponent.value?.componentType === '3D_VIEW' && selectedComponent.value?.customProps?.threeDSubtype === 'FIXED_TEMPLATE');
const textPanelKeys = ref<string[]>(['basic']);
const selectPanelKeys = ref<string[]>(['basic']);
const radioPanelKeys = ref<string[]>(['basic']);
const filePanelKeys = ref<string[]>(['basic']);
const titlePanelKeys = ref<string[]>(['basic']);
const dataViewPanelKeys = ref<string[]>(['basic', 'knowledge']);
const fixedTablePanelKeys = ref<string[]>(['info', 'rows', 'cols']);
/** 画布表格预览中选中的单元格（行、列均为 1-based），用于右侧「单元格参数继承属性配置」 */
const selectedTableCell = ref<{ row: number; col: number } | null>(null);
const tableCellInheritPanelKeys = ref<string[]>(['cellInherit']);
const templateBrowse3dPanelKeys = ref<string[]>(['tpl', 'model', 'buttons']);
const modelSelect3dPanelKeys = ref<string[]>(['model', 'buttons']);
const fixedTemplate3dPanelKeys = ref<string[]>(['tpl', 'model', 'buttons']);
const draggingTableSubtype = ref('');
const draggingThreeDSubtype = ref('');
const tableSizeModalVisible = ref(false);
const pendingInsertIndex = ref<number | null>(null);
/** 表格尺寸弹窗当前创建的子类型：固定表 / 行扩展表 */
const pendingTableSizeSubtype = ref<'FIXED' | 'ROW_EXPAND' | null>(null);
const tableSizeModalTitle = computed(() => (pendingTableSizeSubtype.value === 'ROW_EXPAND' ? '行扩展表格' : '固定表格'));
const tableSizeDraft = reactive({
  tableTitle: '表格标题',
  tableBizType: 'MODULE_LIB_READ' as string,
  bodyRows: 4,
  cols: 3,
});

/** 固定表格弹窗嵌套在全屏 Modal 内：下拉默认挂在内层易被 overflow 裁剪，挂到 body 并抬高 z-index */
function getTableBizTypeSelectPopupContainer() {
  return document.body;
}
const tableBizTypeSelectDropdownStyle = { zIndex: 1200 };
/** 参数字典需高于「列定义配置 / 表格尺寸」等子弹窗（z-index 1100） */
const parameterDictionaryModalZIndex = 1200;

const columnDefModalVisible = ref(false);
const columnDefDraft = ref<any[]>([]);
const formulaEditorRef = ref<any>(null);
const formulaEditorVisible = ref(false);
const formulaEditorInitialValue = ref('');
const libraryCategoryModalVisible = ref(false);
const libraryCategoryTreeData = ref<any[]>([]);
const libraryCategoryExpandedKeys = ref<Array<string | number>>([]);
const libraryCategorySelectedKeys = ref<Array<string | number>>([]);
const libraryCategorySelectedTitle = ref('');
const libraryCategorySelectedId = ref('');
const libraryCategoryPickTarget = ref<'dataView' | 'template3d' | 'modelSelect3d'>('dataView');

function cloneFixedTableColDefsForModal(defs: any[] | undefined) {
  return (defs || []).map(d => ({
    paramCode: d?.paramCode ?? '',
    parameterId: d?.parameterId ?? null,
    dataType: d?.dataType || 'TEXT',
    dropdownValues: d?.dropdownValues ?? '',
    columnWidth: d?.columnWidth ?? '',
    columnName: d?.columnName ?? '',
  }));
}
function getFixedTableColDataTypeLabel(v: string) {
  const m: Record<string, string> = {
    TEXT: '文本',
    READONLY_TEXT: '只读文本',
    DROPDOWN: '下拉值',
  };
  return m[v] || v || '—';
}
/** 行定义第二列表头：表格类型为「基础资源库读取」时与模块库区分文案 */
function getTableRowDefCategoryColumnLabel(tableBizType: string | undefined) {
  if (tableBizType === 'BASIC_RESOURCE_LIB_READ') return '关联基础资源库分类';
  return '关联模块库分类';
}
function openColumnDefModal() {
  const c = selectedComponent.value;
  if (!c?.customProps || !['FIXED', 'ROW_EXPAND'].includes(c.customProps.tableSubtype)) return;
  syncWorkspaceTableRowColDefs(c);
  columnDefDraft.value = cloneFixedTableColDefsForModal(c.customProps.tableColDefs);
  columnDefModalVisible.value = true;
}
function applyColumnDefModal() {
  const c = selectedComponent.value;
  if (!c?.customProps) return;
  const p = c.customProps;
  const next = cloneFixedTableColDefsForModal(columnDefDraft.value);
  p.tableColDefs.splice(0, p.tableColDefs.length, ...next);
  columnDefModalVisible.value = false;
}
function cancelColumnDefModal() {
  columnDefModalVisible.value = false;
}

function createDefaultComponent(componentType: string) {
  const customProps = componentType === 'DATA_VIEW' ? { inputPlaceholder: '请输入设计参数', assembleButtonText: '浏览', libraryCategory: '', libraryCategoryId: '' } : {};
  return {
    id: null,
    parentId: 0,
    componentType,
    paramCode: '',
    /** 参数字典选中行的主键，与 paramCode / paramName 一并保存 */
    parameterId: null,
    paramName: componentType === 'RADIO' ? '单选项' : '',
    ioType: 'INPUT',
    isRequired: 0,
    customProps,
    constraintRules: [],
    validateRule: null,
    tableConfig: null,
    modelConfig: null,
    libraryType: componentType === 'DATA_VIEW' ? 'MODEL_LIB' : '',
    libraryParam: componentType === 'DATA_VIEW' ? 'PART_NO' : '',
    paramValue: '',
    knowledgeType: null,
    knowledgeContent: '',
    knowledgeId: null,
  };
}
function canAddComponent(componentType: string) {
  if (componentType !== 'FILE') return true;
  const existsFileUpload = componentList.value.some((item: any) => item.componentType === 'FILE');
  if (existsFileUpload) {
    message.warning('当前活动页面最多只能有一个附件上传组件');
    return false;
  }
  return true;
}
function parsePalettePayload(raw: string) {
  if (!raw) return { type: '', tableSubtype: '', threeDSubtype: '' };
  if (raw.startsWith('TABLE:')) {
    return { type: 'TABLE', tableSubtype: raw.slice(6) || 'ROW_EXPAND', threeDSubtype: '' };
  }
  if (raw.startsWith('3D_VIEW:')) {
    return { type: '3D_VIEW', tableSubtype: '', threeDSubtype: raw.slice(8) || 'DEFAULT' };
  }
  return { type: raw, tableSubtype: '', threeDSubtype: '' };
}
function insertComponentItem(newItem: any, insertIndex?: number | null) {
  if (!canAddComponent(newItem.componentType)) return false;
  let idx = componentList.value.length;
  if (insertIndex != null && insertIndex >= 0 && insertIndex <= componentList.value.length) {
    idx = insertIndex;
  }
  componentList.value.splice(idx, 0, newItem);
  selectedIndex.value = idx;
  return true;
}
function createTableComponent(tableSubtype: 'FIXED' | 'ROW_EXPAND', bodyRows: number, colCount: number, opts?: { tableTitle?: string; tableBizType?: string }) {
  const item = createDefaultComponent('TABLE');
  const br = Math.max(1, bodyRows);
  const cc = Math.max(1, colCount);
  const titleRaw = opts?.tableTitle != null ? String(opts.tableTitle).trim() : '';
  const tableTitle = titleRaw || '表格标题';
  item.paramName = tableTitle;
  const base = {
    tableSubtype,
    tableTitle,
    tableBodyRows: br,
    tableColCount: cc,
    firstColumnType: 'INDEX',
    btnOpenModel: false,
    btnAssembleModel: false,
  } as Record<string, any>;
  if (tableSubtype === 'ROW_EXPAND') {
    base.btnApplyPartNo = true;
  }
  if (tableSubtype === 'FIXED' || tableSubtype === 'ROW_EXPAND') {
    const biz = opts?.tableBizType || 'NORMAL';
    base.tableBizType = ['MODULE_LIB_READ', 'BASIC_RESOURCE_LIB_READ', 'FILE_COLLAB', 'NORMAL'].includes(biz) ? biz : 'NORMAL';
    base.tableNumber = '';
    base.btnOpenDrawing = true;
    if (base.tableBizType === 'BASIC_RESOURCE_LIB_READ') {
      base.basicResourceLibType = 'MODEL_LIB';
    }
    base.tableRowDefs = base.tableBizType === 'FILE_COLLAB' || base.tableBizType === 'NORMAL' ? [] : Array.from({ length: br }, () => ({ moduleLibCategory: '' }));
    base.tableColDefs = Array.from({ length: cc }, () => ({
      paramCode: '',
      parameterId: null,
      dataType: 'TEXT',
      dropdownValues: '',
      columnWidth: '',
      columnName: '',
    }));
    base.cellParamInheritMap = {};
  }
  item.customProps = { ...(item.customProps || {}), ...base };
  return item;
}
function createThreeDViewComponent(threeDSubtype: string) {
  const item = createDefaultComponent('3D_VIEW');
  if (!item.customProps) item.customProps = {};
  item.customProps.threeDSubtype = threeDSubtype;
  if (threeDSubtype === 'TEMPLATE_BROWSE') {
    item.paramName = '模板名称';
    item.customProps.templateName = '模板名称';
    item.customProps.templateValue = '';
    item.customProps.modelName = '模型名称';
    item.customProps.modelValue = '';
    item.customProps.relatedTemplateLib = '';
    item.customProps.relatedTemplateLibId = '';
    item.customProps.btnApplyPartNo = true;
    item.customProps.btnOpenModel = false;
    item.customProps.btnAssembleModel = false;
  }
  if (threeDSubtype === 'MODEL_SELECT') {
    item.paramName = '模型名称';
    item.customProps.modelSelectName = '';
    item.customProps.relatedModelLib = '';
    item.customProps.relatedModelLibId = '';
    item.customProps.btnOpenModel = false;
    item.customProps.btnAssembleModel = true;
  }
  if (threeDSubtype === 'FIXED_TEMPLATE') {
    item.paramName = '模板名称';
    item.customProps.templateName = '模板名称';
    item.customProps.templateValue = '';
    item.customProps.modelName = '模型名称';
    item.customProps.modelValue = '';
    item.customProps.relatedTemplateLib = '';
    item.customProps.relatedTemplateLibId = '';
    item.customProps.fixedTemplateDisplay = 1;
    item.customProps.btnApplyPartNo = true;
    item.customProps.btnOpenModel = false;
    item.customProps.btnAssembleModel = false;
  }
  return item;
}
function handleIncomingAdd(payload: string, insertIndex?: number | null) {
  const { type, tableSubtype, threeDSubtype } = parsePalettePayload(payload);
  if (!type) return;
  if (type === 'TABLE' && (tableSubtype === 'FIXED' || tableSubtype === 'ROW_EXPAND')) {
    pendingInsertIndex.value = insertIndex == null ? null : insertIndex;
    pendingTableSizeSubtype.value = tableSubtype === 'ROW_EXPAND' ? 'ROW_EXPAND' : 'FIXED';
    tableSizeDraft.tableTitle = '表格标题';
    tableSizeDraft.tableBizType = 'MODULE_LIB_READ';
    tableSizeDraft.bodyRows = 4;
    tableSizeDraft.cols = 3;
    tableSizeModalVisible.value = true;
    return;
  }
  if (type === 'TABLE') {
    const t = createTableComponent('ROW_EXPAND', 4, 3);
    insertComponentItem(t, insertIndex);
    return;
  }
  if (type === '3D_VIEW') {
    const t = createThreeDViewComponent(threeDSubtype || 'DEFAULT');
    insertComponentItem(t, insertIndex);
    return;
  }
  addComponent(type, insertIndex ?? undefined);
}
function handlePaletteClick(item: { type: string; tableSubtype?: string; threeDSubtype?: string }) {
  let payload = item.type;
  if (item.type === 'TABLE') payload = `TABLE:${item.tableSubtype || 'ROW_EXPAND'}`;
  else if (item.type === '3D_VIEW') payload = `3D_VIEW:${item.threeDSubtype || 'DEFAULT'}`;
  handleIncomingAdd(payload, componentList.value.length);
}
function confirmTableSize() {
  const name = String(tableSizeDraft.tableTitle || '').trim();
  if (!name) {
    message.warning('请输入表格名称');
    return;
  }
  if (!tableSizeDraft.tableBizType) {
    message.warning('请选择表格类型');
    return;
  }
  const br = Number(tableSizeDraft.bodyRows);
  const c = Number(tableSizeDraft.cols);
  if (!Number.isFinite(br) || br < 1) {
    message.warning('请输入有效的行数（≥1）');
    return;
  }
  if (!Number.isFinite(c) || c < 1) {
    message.warning('请输入有效的列数（≥1）');
    return;
  }
  const subtype = pendingTableSizeSubtype.value === 'ROW_EXPAND' ? 'ROW_EXPAND' : 'FIXED';
  const newItem = createTableComponent(subtype, Math.floor(br), Math.floor(c), {
    tableTitle: name,
    tableBizType: tableSizeDraft.tableBizType,
  });
  const idx = pendingInsertIndex.value == null ? componentList.value.length : pendingInsertIndex.value;
  insertComponentItem(newItem, idx);
  tableSizeModalVisible.value = false;
  pendingInsertIndex.value = null;
  pendingTableSizeSubtype.value = null;
  draggingType.value = '';
  draggingTableSubtype.value = '';
}
function cancelTableSize() {
  tableSizeModalVisible.value = false;
  pendingInsertIndex.value = null;
  pendingTableSizeSubtype.value = null;
  draggingType.value = '';
  draggingTableSubtype.value = '';
}
/** 行扩展表格：预览/配置区「添加」增加一行（表体行数 +1） */
function handleExpandTableAddRowForItem(item: any) {
  if (!item?.customProps || item.customProps.tableSubtype !== 'ROW_EXPAND') return;
  const p = item.customProps;
  const cur = Number(p.tableBodyRows) || 1;
  if (cur >= 50) {
    message.warning('表格行数最多为 50');
    return;
  }
  p.tableBodyRows = cur + 1;
  syncWorkspaceTableRowColDefs(item);
}
function addComponent(componentType: string, insertIndex?: number) {
  if (!canAddComponent(componentType)) return false;
  const newItem = createDefaultComponent(componentType);
  const inserted = insertComponentItem(newItem, insertIndex ?? null);
  if (inserted && componentType === 'DATA_VIEW') {
    // 数据浏览组件在点击或拖拽新增后，立即拉取资源库分类数据
    void selectLibraryCategory();
  }
  return inserted;
}
function removeSelectedComponent() {
  if (selectedIndex.value < 0) return;
  componentList.value.splice(selectedIndex.value, 1);
  selectedIndex.value = componentList.value.length ? Math.max(0, selectedIndex.value - 1) : -1;
}
function normalizeOperationType(v: unknown): 'insert' | 'update' {
  return String(v || '').toLowerCase() === 'insert' ? 'insert' : 'update';
}
function mapConstraintRules(rules: any) {
  const list = Array.isArray(rules) ? rules : [];
  return list.map((r: any) => ({
    refParamCode: r?.refParamCode ?? '',
    operator: r?.operator ?? '=',
    compareValue: r?.compareValue ?? '',
    dictType: r?.dictType ?? null,
  }));
}
/** 双边界区间：接口侧仅接收 compareValue，两界用 ; 拼接，如 2;10 */
function serializeValueRangeForApi(vr: any) {
  const op = String(vr?.operator ?? '=').trim();
  const v1 = String(vr?.compareValue ?? '').trim();
  const v2 = String(vr?.compareValue2 ?? '').trim();
  let compareValue = v1;
  if (op.includes(';')) {
    compareValue = v2 !== '' ? `${v1};${v2}` : v1;
  }
  return {
    scopeType: vr.scopeType ?? 'WARNING',
    operator: vr.operator ?? '=',
    compareValue,
  };
}
/** 从 compareValue 的 2;10 形式拆回双输入框（compareValue2 为空时） */
function hydrateValueRangeCompareSemicolon(vr: any) {
  if (!vr || typeof vr !== 'object') return;
  const op = String(vr.operator ?? '');
  if (!op.includes(';')) return;
  if (String(vr.compareValue2 ?? '').trim() !== '') return;
  const raw = String(vr.compareValue ?? '').trim();
  if (!raw.includes(';')) return;
  const idx = raw.indexOf(';');
  vr.compareValue = raw.slice(0, idx).trim();
  vr.compareValue2 = raw.slice(idx + 1).trim();
}
function mapValidateRule(rule: any) {
  if (!rule || typeof rule !== 'object') return null;
  return {
    valueRange: rule?.valueRange ? serializeValueRangeForApi(rule.valueRange) : null,
    formula: rule?.formula
      ? {
          mode: rule.formula.mode ?? 'FORMULA',
          expression: rule.formula.expression ?? null,
          jsMethodName: rule.formula.jsMethodName ?? null,
        }
      : null,
    regex: rule?.regex ?? null,
    minLength: rule?.minLength ?? null,
    maxLength: rule?.maxLength ?? null,
  };
}
function mapModelConfig(item: any) {
  if (item?.componentType !== '3D_VIEW') return item?.modelConfig ?? null;
  const p = item?.customProps || {};
  const subtype = p.threeDSubtype || '';
  const integrationSubTypeMap: Record<string, string> = {
    TEMPLATE_BROWSE: 'BROWSE_TEMPLATE',
    MODEL_SELECT: 'ASSEMBLE_TEMPLATE',
    FIXED_TEMPLATE: 'BROWSE_TEMPLATE',
  };
  const integrationSubType = integrationSubTypeMap[subtype] || 'CUSTOM_PARAM';
  return {
    integrationSubType,
    templateName: p.templateName ?? null,
    templateLibraryId: p.relatedTemplateLib ?? null,
    modelParamCode: item?.paramCode ?? '',
    modelParamName: item?.paramName ?? '',
    buttons: {
      applyPartNumber: !!(p.btnApplyPartNo ?? false),
      openModel: !!(p.btnOpenModel ?? false),
      assembleModel: !!(p.btnAssembleModel ?? false),
    },
  };
}
function mapTableConfig(item: any) {
  if (item?.componentType !== 'TABLE') return item?.tableConfig ?? null;
  const p = item?.customProps || {};
  const tableTypeMap: Record<string, string> = {
    FIXED: 'FIXED_ROW_COL',
    ROW_EXPAND: 'ROW_EXPANDABLE',
  };
  const firstColumnStyleMap: Record<string, string> = {
    INDEX: 'SERIAL',
    CHECKBOX: 'CHECKBOX',
    RADIO: 'RADIO',
  };
  const cols = Array.isArray(p.tableColDefs) ? p.tableColDefs : [];
  return {
    tableTitle: p.tableTitle ?? item?.paramName ?? '',
    tableType: tableTypeMap[p.tableSubtype] || 'FIXED_ROW_COL',
    rowCount: Number(p.tableBodyRows) || 0,
    columnCount: Number(p.tableColCount) || 0,
    tableCode: p.tableNumber ?? '',
    firstColumnStyle: firstColumnStyleMap[p.firstColumnType] || 'SERIAL',
    columns: cols.map((col: any, i: number) => ({
      colIndex: i,
      header: String(col?.columnName ?? '').trim() || (i === 0 ? '序号' : `列名${i}`),
      width: col?.columnWidth ?? '',
      cellBinding: {
        type: col?.paramCode ? 'PARAM' : 'CONST',
        paramCode: col?.paramCode ?? '',
        expression: null,
      },
    })),
    modelSection: { paramCode: item?.paramCode ?? '', paramName: item?.paramName ?? '' },
    buttons: {
      applyPartNumber: !!(p.btnApplyPartNo ?? false),
      openModel: !!(p.btnOpenModel ?? false),
      assembleModel: !!(p.btnAssembleModel ?? false),
    },
  };
}
function mapComponentForApi(item: any, index: number, operationType: 'insert' | 'update') {
  const mapped = {
    id: operationType === 'insert' ? null : (item?.id ?? null),
    parentId: item?.parentId ?? 0,
    componentType: item?.componentType ?? '',
    paramCode: item?.paramCode ?? '',
    paramName: item?.paramName ?? '',
    ioType: item?.ioType ?? 'INPUT',
    sortNo: index + 1,
    constraintRules: mapConstraintRules(item?.constraintRules),
    customProps: item?.customProps ?? null,
    tableConfig: mapTableConfig(item),
    modelConfig: mapModelConfig(item),
    isRequired: Number(item?.isRequired ?? 0),
    validateRule: mapValidateRule(item?.validateRule),
    libraryType: item?.libraryType ?? '',
    libraryParam: item?.libraryParam ?? '',
    paramValue: item?.paramValue ?? null,
  } as Record<string, any>;
  if (item?.parameterId !== undefined) mapped.parameterId = item?.parameterId ?? null;
  if (item?.knowledgeType !== undefined) mapped.knowledgeType = item?.knowledgeType ?? null;
  if (item?.knowledgeContent !== undefined) mapped.knowledgeContent = item?.knowledgeContent ?? null;
  if (item?.knowledgeId !== undefined) mapped.knowledgeId = item?.knowledgeId ?? null;
  if (item?.versionNum !== undefined) mapped.versionNum = item?.versionNum;
  if (item?.confidentialLevel !== undefined) mapped.confidentialLevel = item?.confidentialLevel;
  return mapped;
}
function buildPayload() {
  const operationType = normalizeOperationType(formState.value.operationType);
  const list = componentList.value.map((item, index) => mapComponentForApi(item, index, operationType));
  return {
    formId: operationType === 'insert' ? null : formState.value.formId,
    formCode: operationType === 'insert' ? null : formState.value.formCode,
    activityPageId: formState.value.activityPageId,
    operationType,
    basicComponentList: list.filter(item => basicTypes.includes(item.componentType)),
    threeDComponentList: list.filter(item => threeDTypes.includes(item.componentType)),
    uploadComponentList: list.filter(item => uploadTypes.includes(item.componentType)),
    tableComponentList: list.filter(item => tableTypes.includes(item.componentType)),
    componentDisplayOrderList: [],
  };
}
function handleSave() {
  emit('save', buildPayload());
}
function openFormulaEditor() {
  const c = selectedComponent.value;
  if (!c?.validateRule?.formula) return;
  formulaEditorInitialValue.value = String(c.validateRule.formula.expression ?? '');
  formulaEditorVisible.value = true;
}
function handleFormulaInsertParameter() {
  showParameter({ type: 'formulaExpression' });
}
function confirmFormulaEditor(v: string) {
  const c = selectedComponent.value;
  if (c?.validateRule?.formula) {
    c.validateRule.formula.expression = v;
  }
  formulaEditorVisible.value = false;
}
function pickParameterIdFromDictionaryRow(row: any): number | string | null {
  if (row == null) return null;
  if (row.parameterId != null) return row.parameterId;
  if (row.id != null) return row.id;
  return null;
}
function handleSaveParameter(row: any) {
  const code = row?.parameterNum != null ? String(row.parameterNum) : '';
  const name = row?.parameterName != null ? String(row.parameterName) : '';
  const parameterId = pickParameterIdFromDictionaryRow(row);
  const t = parameterPickTarget.value;
  if (t.type === 'tableColDraft') {
    const d = columnDefDraft.value[t.colIndex];
    if (d) {
      d.paramCode = code;
      d.parameterId = parameterId;
    }
  } else if (t.type === 'tableCellInherit') {
    const sel = selectedTableCell.value;
    const comp = selectedComponent.value;
    if (sel && comp?.customProps) {
      const entry = ensureCellParamInheritEntry(comp, sel.row, sel.col);
      if (entry) {
        if (t.field === 'cellParamCode') {
          entry.cellParamCode = code;
          entry.cellParameterId = parameterId;
        } else if (t.field === 'cellTableNumber') {
          entry.cellTableNumber = code;
        } else if (t.field === 'cellTableCellRef') {
          entry.cellTableCellRef = code;
        }
      }
    }
  } else if (t.type === 'formulaExpression') {
    formulaEditorRef.value?.insertText?.(code);
  } else if (selectedComponent.value) {
    selectedComponent.value.paramCode = code;
    selectedComponent.value.parameterId = parameterId;
    if (name) {
      const c = selectedComponent.value as any;
      const subtype = String(c?.customProps?.threeDSubtype ?? '');
      // 3D 模板类组件：参数字典回填的名称应落在「模型名称」，而非上方「模板名称」
      if (c?.componentType === '3D_VIEW' && (subtype === 'TEMPLATE_BROWSE' || subtype === 'FIXED_TEMPLATE')) {
        if (!c.customProps || typeof c.customProps !== 'object') c.customProps = {};
        c.customProps.modelName = name;
      } else {
        selectedComponent.value.paramName = name;
      }
    }
  }
  ParameterGeneralVisible.value = false;
  parameterPickTarget.value = { type: 'component' };
}
function onParameterGeneralClose() {
  ParameterGeneralVisible.value = false;
  parameterPickTarget.value = { type: 'component' };
}
function showParameter(target?: ParameterPickTarget) {
  parameterPickTarget.value = target ?? { type: 'component' };
  ParameterGeneralVisible.value = true;
  nextTick(() => {
    ParameterGeneralRef.value?.handlegetData?.('');
  });
}
const requestParams = reactive(new LibraryPageRequestDTOModel());
const libraryTypeOptions = ref<Array<{ label: string; value: string }>>([]);
function shouldShowDataViewLibraryParam() {
  if (!isDataViewComponent.value || !selectedComponent.value) return true;
  const selectedTypeValue = String(selectedComponent.value.libraryType ?? '').trim();
  if (!selectedTypeValue) return true;
  const selectedOpt = libraryTypeOptions.value.find(opt => opt.value === selectedTypeValue);
  const matchText = `${selectedOpt?.label ?? ''}|${selectedTypeValue}`.toLowerCase();
  // 选中模块库时，不显示「基础资源库对应参数」
  return !(matchText.includes('模块库') || matchText.includes('module') || matchText.includes('模型库'));
}
async function selectLibraryCategory() {
  requestParams.pageNo = 1;
  requestParams.pageSize = 10;
  const res = await businessApiLibrary.getLibraryPageList({
    ...requestParams,
  });
  const list = Array.isArray(res?.data?.data?.list) ? res.data.data.list : [];
  libraryTypeOptions.value = list
    .map((item: any) => ({
      label: String(item?.menuName ?? item?.name ?? '').trim(),
      value: String(item?.menuNum ?? item?.id ?? '').trim(),
    }))
    .filter((item: { label: string; value: string }) => item.label !== '' && item.value !== '');
  if (isDataViewComponent.value && selectedComponent.value) {
    const current = String(selectedComponent.value.libraryType ?? '').trim();
    const hasCurrent = libraryTypeOptions.value.some(opt => opt.value === current);
    if (!hasCurrent) {
      selectedComponent.value.libraryType = libraryTypeOptions.value[0]?.value ?? '';
    }
  }
}
async function selectLibraryCategoryName(target: 'dataView' | 'template3d' | 'modelSelect3d' = 'dataView') {
  if (!selectedComponent.value) return;
  libraryCategoryPickTarget.value = target;
  if (target === 'dataView' && String(selectedComponent.value.libraryType ?? '') !== '9') {
    message.warning('当前仅模块库类型支持选择分类节点');
    return;
  }
  const data: any = {};
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemModule.getModuleMenuList(data);
  const rawList = Array.isArray(res?.data?.data) ? res.data.data : [];
  const toTreeNode = (item: any): any => {
    const children = Array.isArray(item?.children) ? item.children.map((c: any) => toTreeNode(c)) : [];
    const nodeId = String(item?.id ?? item?.menuId ?? '');
    const key = nodeId || String(item?.treeUrl ?? Math.random());
    return {
      title: String(item?.categoryName ?? item?.name ?? '未命名节点'),
      key,
      nodeId,
      raw: item,
      children,
      isLeaf: children.length === 0,
    };
  };
  libraryCategoryTreeData.value = rawList.map((item: any) => toTreeNode(item));
  libraryCategoryExpandedKeys.value = rawList.map((item: any) => String(item?.id ?? item?.menuId ?? '')).filter((k: string) => k !== '');
  libraryCategorySelectedKeys.value = [];
  libraryCategorySelectedTitle.value = '';
  libraryCategorySelectedId.value = '';
  libraryCategoryModalVisible.value = true;
}
function onLibraryCategorySelect(keys: Array<string | number>, info: any) {
  libraryCategorySelectedKeys.value = keys;
  const n = info?.node;
  libraryCategorySelectedTitle.value = String(n?.title ?? '');
  libraryCategorySelectedId.value = String(n?.nodeId ?? n?.raw?.id ?? n?.raw?.menuId ?? keys?.[0] ?? '');
}
function onLibraryCategoryConfirm() {
  if (!selectedComponent.value) return;
  if (!libraryCategorySelectedTitle.value) {
    message.warning('请选择一个分类节点');
    return;
  }
  if (!selectedComponent.value.customProps || typeof selectedComponent.value.customProps !== 'object') {
    selectedComponent.value.customProps = {};
  }
  if (libraryCategoryPickTarget.value === 'template3d') {
    selectedComponent.value.customProps.relatedTemplateLib = libraryCategorySelectedTitle.value;
    selectedComponent.value.customProps.relatedTemplateLibId = libraryCategorySelectedId.value;
  } else if (libraryCategoryPickTarget.value === 'modelSelect3d') {
    selectedComponent.value.customProps.relatedModelLib = libraryCategorySelectedTitle.value;
    selectedComponent.value.customProps.relatedModelLibId = libraryCategorySelectedId.value;
  } else {
    selectedComponent.value.customProps.libraryCategory = libraryCategorySelectedTitle.value;
    selectedComponent.value.customProps.libraryCategoryId = libraryCategorySelectedId.value;
  }
  libraryCategoryModalVisible.value = false;
}
function onLibraryCategoryCancel() {
  libraryCategoryModalVisible.value = false;
}
function parseList(raw: any) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
function handleBatchSelectParam() {
  addComponent('INPUT');
}
function handleSketchConfig() {
  addComponent('DATA_VIEW');
}
function handleDragStart(item: { type: string; tableSubtype?: string; threeDSubtype?: string }, event: DragEvent) {
  draggingType.value = item.type;
  draggingTableSubtype.value = item.tableSubtype || '';
  draggingThreeDSubtype.value = item.threeDSubtype || '';
  let payload = item.type;
  if (item.type === 'TABLE') payload = `TABLE:${item.tableSubtype || 'ROW_EXPAND'}`;
  else if (item.type === '3D_VIEW') payload = `3D_VIEW:${item.threeDSubtype || 'DEFAULT'}`;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', payload);
  }
}
function handleDragEnd() {
  draggingType.value = '';
  draggingTableSubtype.value = '';
  draggingThreeDSubtype.value = '';
  isDragOverCanvas.value = false;
}
function handleCanvasDragOver(event: DragEvent) {
  event.preventDefault();
  if (!draggingType.value) return;
  isDragOverCanvas.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}
function handleCanvasDragLeave() {
  isDragOverCanvas.value = false;
}
function handleCanvasDrop(event: DragEvent) {
  event.preventDefault();
  const droppedType =
    event.dataTransfer?.getData('text/plain') ||
    (draggingType.value === 'TABLE'
      ? `TABLE:${draggingTableSubtype.value || 'ROW_EXPAND'}`
      : draggingType.value === '3D_VIEW'
        ? `3D_VIEW:${draggingThreeDSubtype.value || 'DEFAULT'}`
        : draggingType.value);
  if (droppedType) handleIncomingAdd(droppedType, componentList.value.length);
  isDragOverCanvas.value = false;
  draggingType.value = '';
  draggingTableSubtype.value = '';
  draggingThreeDSubtype.value = '';
}
function handleItemDragStart(index: number, event: DragEvent) {
  draggingItemIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/reorder-index', String(index));
  }
}
function handleItemDragOver(index: number, event: DragEvent) {
  event.preventDefault();
  const hasPaletteDragging = !!draggingType.value;
  const hasListDragging = draggingItemIndex.value >= 0;
  if (!hasPaletteDragging && !hasListDragging) return;
  if (hasListDragging && draggingItemIndex.value === index) return;
  const currentTarget = event.currentTarget as HTMLElement;
  const rect = currentTarget.getBoundingClientRect();
  const offsetY = event.clientY - rect.top;
  const before = offsetY < rect.height / 2;
  dropInsertIndex.value = before ? index : index + 1;
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}
function handleItemDrop(targetIndex: number, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  const sourceIndexRaw = event.dataTransfer?.getData('text/reorder-index');
  const sourceIndex = sourceIndexRaw ? Number(sourceIndexRaw) : draggingItemIndex.value;
  const insertIndexRaw = dropInsertIndex.value >= 0 ? dropInsertIndex.value : targetIndex;
  const droppedType =
    event.dataTransfer?.getData('text/plain') ||
    (draggingType.value === 'TABLE'
      ? `TABLE:${draggingTableSubtype.value || 'ROW_EXPAND'}`
      : draggingType.value === '3D_VIEW'
        ? `3D_VIEW:${draggingThreeDSubtype.value || 'DEFAULT'}`
        : draggingType.value);
  if (sourceIndex < 0 && droppedType) {
    let insertAt = insertIndexRaw;
    if (insertAt < 0) insertAt = 0;
    if (insertAt > componentList.value.length) insertAt = componentList.value.length;
    handleIncomingAdd(droppedType, insertAt);
    dropInsertIndex.value = -1;
    draggingItemIndex.value = -1;
    draggingType.value = '';
    draggingTableSubtype.value = '';
    draggingThreeDSubtype.value = '';
    return;
  }
  if (sourceIndex < 0) {
    dropInsertIndex.value = -1;
    draggingItemIndex.value = -1;
    return;
  }
  const list = [...componentList.value];
  const [movedItem] = list.splice(sourceIndex, 1);
  if (!movedItem) {
    dropInsertIndex.value = -1;
    draggingItemIndex.value = -1;
    return;
  }
  let adjustedTarget = insertIndexRaw;
  if (sourceIndex < insertIndexRaw) adjustedTarget = insertIndexRaw - 1;
  if (adjustedTarget < 0) adjustedTarget = 0;
  if (adjustedTarget > list.length) adjustedTarget = list.length;
  list.splice(adjustedTarget, 0, movedItem);
  componentList.value = list;
  selectedIndex.value = adjustedTarget;
  dropInsertIndex.value = -1;
  draggingItemIndex.value = -1;
}
function handleItemDragEnd() {
  dropInsertIndex.value = -1;
  draggingItemIndex.value = -1;
}
function showInsertBefore(index: number) {
  if (!(draggingItemIndex.value >= 0 || draggingType.value)) return false;
  return dropInsertIndex.value === index;
}
function showInsertAfter(index: number) {
  if (!(draggingItemIndex.value >= 0 || draggingType.value)) return false;
  const isLast = index === componentList.value.length - 1;
  return isLast && dropInsertIndex.value === componentList.value.length;
}
function isWorkspaceTableItem(item: any) {
  const t = item?.customProps?.tableSubtype;
  return item?.componentType === 'TABLE' && (t === 'FIXED' || t === 'ROW_EXPAND');
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
function isFullRowComponent(type: string) {
  return ['TEXTAREA', 'TITLE', 'RICH_TEXT', 'FILE', 'DIVIDER', 'RADIO', 'DATA_VIEW', 'TABLE', '3D_VIEW'].includes(type);
}
function tableDimensionRange(count: number) {
  const n = Math.max(0, Math.min(100, Number(count) || 0));
  return Array.from({ length: n }, (_, i) => i + 1);
}
/** 固定表格列定义：首列固定为序号，配置行从第 2 列起 */
function tableDimensionRangeFromSecond(count: number) {
  const n = Math.max(0, Math.min(100, Number(count) || 0));
  if (n <= 1) return [];
  return Array.from({ length: n - 1 }, (_, i) => i + 2);
}
/** 固定表格预览表头：首列在序号模式下为「序号」，复选/单选下留空；其余列优先 customProps.tableColDefs 中的 columnName */
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
/** 列定义概览 / 弹窗：第 physicalColIndex 列的展示名（未填则「第N列」） */
function getFixedTableColDisplayName(customProps: any, physicalColIndex: number) {
  const raw = customProps?.tableColDefs?.[physicalColIndex - 1]?.columnName;
  if (raw != null && String(raw).trim() !== '') return String(raw).trim();
  return `第${physicalColIndex}列`;
}
function cellParamInheritKey(row: number, col: number) {
  return `${row}-${col}`;
}
/** 单元格参数继承：按行序列化在 customProps.cellParamInheritMap */
function ensureCellParamInheritEntry(component: any, row: number, col: number) {
  const p = component?.customProps;
  if (!p) return null;
  if (!p.cellParamInheritMap || typeof p.cellParamInheritMap !== 'object') p.cellParamInheritMap = {};
  const k = cellParamInheritKey(row, col);
  if (!p.cellParamInheritMap[k] || typeof p.cellParamInheritMap[k] !== 'object') {
    p.cellParamInheritMap[k] = {
      cellInheritType: 'FROM_PARAM',
      cellParamCode: '',
      cellParameterId: null,
      cellTableNumber: '',
      cellTableCellRef: '',
    };
  } else {
    if (p.cellParamInheritMap[k].cellParameterId === undefined) p.cellParamInheritMap[k].cellParameterId = null;
  }
  return p.cellParamInheritMap[k];
}
function onTablePreviewCellClick(itemIndex: number, row: number, col: number) {
  const item = componentList.value[itemIndex];
  if (!item?.customProps || !['FIXED', 'ROW_EXPAND'].includes(item.customProps.tableSubtype)) return;
  selectedIndex.value = itemIndex;
  syncWorkspaceTableRowColDefs(item);
  ensureCellParamInheritEntry(item, row, col);
  selectedTableCell.value = { row, col };
}
function onTablePreviewTitleClick(itemIndex: number) {
  const item = componentList.value[itemIndex];
  if (!item?.customProps || !['FIXED', 'ROW_EXPAND'].includes(item.customProps.tableSubtype)) return;
  selectedIndex.value = itemIndex;
  selectedTableCell.value = null;
}
const activeCellParamInherit = computed(() => {
  const c = selectedComponent.value;
  const s = selectedTableCell.value;
  if (!c?.customProps || !s) return null;
  const m = c.customProps.cellParamInheritMap;
  if (!m) return null;
  return m[cellParamInheritKey(s.row, s.col)] ?? null;
});
const selectedTableCellDataTypeLabel = computed(() => {
  const c = selectedComponent.value;
  const s = selectedTableCell.value;
  if (!c?.customProps || !s) return '—';
  const dt = c.customProps.tableColDefs?.[s.col - 1]?.dataType || 'TEXT';
  return getFixedTableColDataTypeLabel(dt);
});
/** 列定义中的列宽 → CSS width；纯数字按 px 处理，与占位符「120px、20%」一致 */
function normalizeFixedTableColumnWidthCss(raw: unknown): string | undefined {
  const s = (raw == null ? '' : String(raw)).trim();
  if (!s) return undefined;
  if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`;
  return s;
}
/** 画布预览表：第 1 列（序号等）固定 100px；其余列按 tableColDefs[colIndex-1].columnWidth */
function getFixedTableColumnPreviewStyle(item: any, colIndex: number) {
  if (colIndex === 1) {
    return { width: '100px', minWidth: '100px' } as Record<string, string>;
  }
  const w = item?.customProps?.tableColDefs?.[colIndex - 1]?.columnWidth;
  const css = normalizeFixedTableColumnWidthCss(w);
  if (!css) return undefined;
  return { width: css, minWidth: css } as Record<string, string>;
}
function getTypeText(type: string) {
  const typeTextMap: Record<string, string> = {
    INPUT: '单行输入',
    TEXTAREA: '多行输入',
    TITLE: '标题',
    SELECT: '下拉选项',
    RADIO: '单选项',
    RICH_TEXT: '富文本',
    DATE: '日期',
    FILE: '附件',
    DIVIDER: '分隔线',
    DATA_VIEW: '数据浏览',
    TABLE: '表格',
    '3D_VIEW': '三维',
  };
  return typeTextMap[type] || type;
}
function getPreviewValue(item: any) {
  return item?.paramValue || '';
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
function getResolvedRangeHintBounds(vr: any): { v1: string; v2: string } {
  const raw = String(vr?.compareValue ?? '')
    .trim()
    .replace(/；/g, ';');
  const v2raw = String(vr?.compareValue2 ?? '').trim();
  const op = String(vr?.operator ?? '');
  if (op.includes(';') && !v2raw && raw.includes(';')) {
    const idx = raw.indexOf(';');
    return {
      v1: raw.slice(0, idx).trim(),
      v2: raw.slice(idx + 1).trim(),
    };
  }
  return { v1: raw, v2: v2raw };
}
function getInputValueRangeHint(item: any): string {
  if (item?.componentType !== 'INPUT') return '';
  const vr = item?.validateRule?.valueRange;
  if (!vr || typeof vr !== 'object') return '';
  const opRaw = String(vr.operator ?? '')
    .trim()
    .replace(/；/g, ';');
  if (!opRaw) return '';
  const { v1, v2 } = getResolvedRangeHintBounds(vr);
  if (opRaw.includes(';')) {
    if (!v1 || !v2) return '';
    const [left = '<', right = '<'] = opRaw.split(';').map(s => normalizeRangeHintOperator(s));
    return `${v1} ${left} X ${right} ${v2}`;
  }
  if (!v1) return '';
  return `X ${normalizeRangeHintOperator(opRaw)} ${v1}`;
}
function ensureTextareaDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.rows == null) component.customProps.rows = 4;
  if (component.customProps.placeholder == null) component.customProps.placeholder = '请输入';
}
function ensureTextLikeDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (!Array.isArray(component.constraintRules)) component.constraintRules = [];
  if (!component.validateRule || typeof component.validateRule !== 'object') component.validateRule = {};
  if (!component.validateRule.valueRange || typeof component.validateRule.valueRange !== 'object') {
    component.validateRule.valueRange = { scopeType: 'WARNING', operator: '=', compareValue: '', compareValue2: '' };
  } else {
    // 兼容旧数据：后续双范围需要第二个值
    if (component.validateRule.valueRange.compareValue2 == null) component.validateRule.valueRange.compareValue2 = '';
  }
  hydrateValueRangeCompareSemicolon(component.validateRule.valueRange);
  if (!component.validateRule.formula || typeof component.validateRule.formula !== 'object') {
    component.validateRule.formula = { mode: 'FORMULA', expression: '', jsMethodName: '' };
  }
}
function ensureSelectDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (!Array.isArray(component.customProps.sequenceValues)) {
    component.customProps.sequenceValues = [''];
  }
  if (!Array.isArray(component.constraintRules)) component.constraintRules = [];
  if (!component.validateRule || typeof component.validateRule !== 'object') component.validateRule = {};
  if (!component.validateRule.valueRange || typeof component.validateRule.valueRange !== 'object') {
    component.validateRule.valueRange = { scopeType: 'WARNING', operator: '=', compareValue: '', compareValue2: '' };
  } else {
    // 兼容旧数据：后续双范围需要第二个值
    if (component.validateRule.valueRange.compareValue2 == null) component.validateRule.valueRange.compareValue2 = '';
  }
  hydrateValueRangeCompareSemicolon(component.validateRule.valueRange);
  if (!component.validateRule.formula || typeof component.validateRule.formula !== 'object') {
    component.validateRule.formula = { mode: 'FORMULA', expression: '', jsMethodName: '' };
  }
}
function ensureRadioDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (!Array.isArray(component.customProps.radioOptions)) {
    component.customProps.radioOptions = ['选项1', '选项2', '选项3', '选项4'];
  }
  if (!Array.isArray(component.constraintRules)) component.constraintRules = [];
  if (!component.validateRule || typeof component.validateRule !== 'object') component.validateRule = {};
  if (!component.validateRule.formula || typeof component.validateRule.formula !== 'object') {
    component.validateRule.formula = { mode: 'FORMULA', expression: '', jsMethodName: '' };
  }
}
function ensureTitleDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.hasDivider == null) component.customProps.hasDivider = 1;
  if (!component.knowledgeContent) component.knowledgeContent = '';
}
function ensureRichTextDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (!Array.isArray(component.constraintRules)) component.constraintRules = [];
  if (!component.validateRule || typeof component.validateRule !== 'object') component.validateRule = {};
  if (!component.validateRule.formula || typeof component.validateRule.formula !== 'object') {
    component.validateRule.formula = { mode: 'FORMULA', expression: '', jsMethodName: '' };
  }
  if (!component.knowledgeContent) component.knowledgeContent = '';
  if (!component.knowledgeId) component.knowledgeId = '';
}
function ensureDateDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (!Array.isArray(component.constraintRules)) component.constraintRules = [];
  if (!component.customProps.format) component.customProps.format = 'yyyy-MM-dd';
  if (!component.knowledgeContent) component.knowledgeContent = '';
  if (!component.knowledgeId) component.knowledgeId = '';
}
function ensureFileDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.allowedFormats == null) component.customProps.allowedFormats = '';
  if (!component.customProps.maxSize) component.customProps.maxSize = '20M';
  if (!component.knowledgeContent) component.knowledgeContent = '';
  if (!component.knowledgeId) component.knowledgeId = '';
}
function ensureDataViewDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.inputPlaceholder === undefined) component.customProps.inputPlaceholder = '请输入设计参数1';
  if (component.customProps.assembleButtonText === undefined) component.customProps.assembleButtonText = '浏览';
  if (component.customProps.libraryCategory == null) component.customProps.libraryCategory = '';
  if (component.customProps.libraryCategoryId == null) component.customProps.libraryCategoryId = '';
  if (!component.knowledgeContent) component.knowledgeContent = '';
  if (!component.knowledgeId) component.knowledgeId = '';
}
function syncWorkspaceTableRowColDefs(component: any) {
  const p = component?.customProps;
  if (!p || (p.tableSubtype !== 'FIXED' && p.tableSubtype !== 'ROW_EXPAND')) return;
  const rows = Math.max(1, Math.min(50, Number(p.tableBodyRows) || 1));
  const cols = Math.max(1, Math.min(20, Number(p.tableColCount) || 1));
  if (!Array.isArray(p.tableColDefs)) p.tableColDefs = [];
  /** 文件协同、普通表格无行定义配置，不保留 tableRowDefs */
  if (p.tableBizType === 'FILE_COLLAB' || p.tableBizType === 'NORMAL') {
    p.tableRowDefs = [];
  } else {
    if (!Array.isArray(p.tableRowDefs)) p.tableRowDefs = [];
    while (p.tableRowDefs.length < rows) {
      p.tableRowDefs.push({ moduleLibCategory: '' });
    }
    while (p.tableRowDefs.length > rows) {
      p.tableRowDefs.pop();
    }
    for (let i = 0; i < p.tableRowDefs.length; i++) {
      if (!p.tableRowDefs[i] || typeof p.tableRowDefs[i] !== 'object') p.tableRowDefs[i] = { moduleLibCategory: '' };
      if (p.tableRowDefs[i].moduleLibCategory == null) p.tableRowDefs[i].moduleLibCategory = '';
    }
  }
  while (p.tableColDefs.length < cols) {
    p.tableColDefs.push({ paramCode: '', parameterId: null, dataType: 'TEXT', dropdownValues: '', columnWidth: '', columnName: '' });
  }
  while (p.tableColDefs.length > cols) {
    p.tableColDefs.pop();
  }
  for (let i = 0; i < p.tableColDefs.length; i++) {
    if (!p.tableColDefs[i] || typeof p.tableColDefs[i] !== 'object') {
      p.tableColDefs[i] = { paramCode: '', parameterId: null, dataType: 'TEXT', dropdownValues: '', columnWidth: '', columnName: '' };
    } else {
      if (p.tableColDefs[i].paramCode == null) p.tableColDefs[i].paramCode = '';
      if (p.tableColDefs[i].parameterId === undefined) p.tableColDefs[i].parameterId = null;
      if (!p.tableColDefs[i].dataType) p.tableColDefs[i].dataType = 'TEXT';
      if (p.tableColDefs[i].dropdownValues == null) p.tableColDefs[i].dropdownValues = '';
      if (p.tableColDefs[i].columnWidth == null) p.tableColDefs[i].columnWidth = '';
      if (p.tableColDefs[i].columnName == null) p.tableColDefs[i].columnName = '';
    }
  }
  if (p.cellParamInheritMap && typeof p.cellParamInheritMap === 'object') {
    for (const key of Object.keys(p.cellParamInheritMap)) {
      const parts = key.split('-');
      const rr = Number(parts[0]);
      const cc = Number(parts[1]);
      if (!Number.isFinite(rr) || !Number.isFinite(cc) || rr < 1 || rr > rows || cc < 1 || cc > cols) {
        delete p.cellParamInheritMap[key];
      }
    }
  }
}
function ensureWorkspaceTableDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  const st = component.customProps.tableSubtype;
  if (st !== 'FIXED' && st !== 'ROW_EXPAND') return;
  const p = component.customProps;
  if (p.tableTitle == null) p.tableTitle = '表格标题';
  if (p.tableBodyRows == null || p.tableBodyRows < 1) p.tableBodyRows = 4;
  if (p.tableColCount == null || p.tableColCount < 1) p.tableColCount = 3;
  if (!p.firstColumnType) p.firstColumnType = 'INDEX';
  if (p.btnOpenModel == null) p.btnOpenModel = false;
  if (p.btnAssembleModel == null) p.btnAssembleModel = false;
  if (st === 'ROW_EXPAND') {
    if (p.btnApplyPartNo == null) p.btnApplyPartNo = true;
  }
  if (st === 'FIXED' || st === 'ROW_EXPAND') {
    if (p.tableBizType == null) p.tableBizType = 'NORMAL';
    if (p.tableNumber == null) p.tableNumber = '';
    if (p.tableBizType === 'BASIC_RESOURCE_LIB_READ' && p.basicResourceLibType == null) {
      p.basicResourceLibType = 'MODEL_LIB';
    }
    if (p.btnOpenDrawing == null) {
      if (p.btnApplyPartNo != null) p.btnOpenDrawing = !!p.btnApplyPartNo;
      else p.btnOpenDrawing = true;
    }
    if (p.cellParamInheritMap == null || typeof p.cellParamInheritMap !== 'object') p.cellParamInheritMap = {};
    syncWorkspaceTableRowColDefs(component);
  }
}
function ensureTemplateBrowse3dDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.threeDSubtype !== 'TEMPLATE_BROWSE') return;
  const p = component.customProps;
  if (component.paramName == null || String(component.paramName).trim() === '') component.paramName = '模板名称';
  if (p.templateName == null || String(p.templateName).trim() === '') p.templateName = '模板名称';
  if (p.templateValue == null) p.templateValue = '';
  if (p.modelName == null || String(p.modelName).trim() === '') p.modelName = '模型名称';
  if (p.modelValue == null) p.modelValue = '';
  if (p.relatedTemplateLib == null) p.relatedTemplateLib = '';
  if (p.relatedTemplateLibId == null) p.relatedTemplateLibId = '';
  if (p.btnApplyPartNo == null) p.btnApplyPartNo = true;
  if (p.btnOpenModel == null) p.btnOpenModel = false;
  if (p.btnAssembleModel == null) p.btnAssembleModel = false;
}
function ensureModelSelect3dDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.threeDSubtype !== 'MODEL_SELECT') return;
  const p = component.customProps;
  if (component.paramName == null || String(component.paramName).trim() === '') component.paramName = '模型名称';
  if (p.modelSelectName == null) p.modelSelectName = '';
  if (p.relatedModelLib == null) p.relatedModelLib = '';
  if (p.relatedModelLibId == null) p.relatedModelLibId = '';
  if (p.btnOpenModel == null) p.btnOpenModel = false;
  if (p.btnAssembleModel == null) p.btnAssembleModel = true;
}
function ensureFixedTemplate3dDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.threeDSubtype !== 'FIXED_TEMPLATE') return;
  const p = component.customProps;
  if (component.paramName == null || String(component.paramName).trim() === '') component.paramName = '模板名称';
  if (p.templateName == null || String(p.templateName).trim() === '') p.templateName = '模板名称';
  if (p.templateValue == null) p.templateValue = '';
  if (p.modelName == null || String(p.modelName).trim() === '') p.modelName = '模型名称';
  if (p.modelValue == null) p.modelValue = '';
  if (p.relatedTemplateLib == null) p.relatedTemplateLib = '';
  if (p.relatedTemplateLibId == null) p.relatedTemplateLibId = '';
  if (p.fixedTemplateDisplay == null) p.fixedTemplateDisplay = 1;
  if (p.btnApplyPartNo == null) p.btnApplyPartNo = true;
  if (p.btnOpenModel == null) p.btnOpenModel = false;
  if (p.btnAssembleModel == null) p.btnAssembleModel = false;
}
function addConstraintRule() {
  if (!selectedComponent.value) return;
  if (!Array.isArray(selectedComponent.value.constraintRules)) selectedComponent.value.constraintRules = [];
  selectedComponent.value.constraintRules.push({ refParamCode: '', operator: '=', compareValue: '', dictType: null });
}
function removeConstraintRule(index: number) {
  if (!selectedComponent.value?.constraintRules) return;
  selectedComponent.value.constraintRules.splice(index, 1);
}
function addSequenceValue() {
  if (!selectedComponent.value?.customProps) return;
  if (!Array.isArray(selectedComponent.value.customProps.sequenceValues)) {
    selectedComponent.value.customProps.sequenceValues = [];
  }
  selectedComponent.value.customProps.sequenceValues.push('');
}
function removeSequenceValue(index: number) {
  const list = selectedComponent.value?.customProps?.sequenceValues;
  if (!Array.isArray(list)) return;
  list.splice(index, 1);
  if (list.length === 0) list.push('');
}
function addRadioOption() {
  if (!selectedComponent.value?.customProps) return;
  if (!Array.isArray(selectedComponent.value.customProps.radioOptions)) {
    selectedComponent.value.customProps.radioOptions = [];
  }
  selectedComponent.value.customProps.radioOptions.push('');
}
function removeRadioOption(index: number) {
  const list = selectedComponent.value?.customProps?.radioOptions;
  if (!Array.isArray(list)) return;
  list.splice(index, 1);
  if (list.length === 0) list.push('');
}
function getSelectOptions(item: any) {
  const values = item?.customProps?.sequenceValues || [];
  if (!Array.isArray(values)) return [];
  return values
    .map((val: string) => (val || '').trim())
    .filter((val: string) => val !== '')
    .map((val: string) => ({ label: val, value: val }));
}
function getSelectPreviewValue(item: any) {
  const currentValue = item?.paramValue;
  if (currentValue) return currentValue;
  const firstOption = getSelectOptions(item)[0];
  return firstOption?.value;
}
function getRadioOptions(item: any) {
  const values = item?.customProps?.radioOptions || [];
  if (!Array.isArray(values)) return [];
  return values.map((val: string) => (val || '').trim()).filter((val: string) => val !== '');
}
/** 预览：默认值为选项列表中的一项时勾选该项，否则与原先一致默认第一项 */
function isRadioPreviewChecked(item: any, opt: string, optIdx: number) {
  const opts = getRadioOptions(item);
  const pv = (item?.paramValue || '').trim();
  if (pv && opts.includes(pv)) return opt === pv;
  return optIdx === 0;
}
function knowledgeHintText(item: any): string {
  return String(item?.knowledgeContent ?? '').trim();
}
function hasKnowledgeHint(item: any): boolean {
  return knowledgeHintText(item) !== '';
}

watch(
  () => selectedComponent.value,
  component => {
    if (!component) return;
    if (!component.customProps || typeof component.customProps !== 'object') component.customProps = {};
    if (component.parameterId === undefined) component.parameterId = null;
    if (component.componentType === 'TEXTAREA') ensureTextareaDefaults(component);
    if (['INPUT', 'TEXTAREA'].includes(component.componentType)) ensureTextLikeDefaults(component);
    if (component.componentType === 'DATE') ensureDateDefaults(component);
    if (component.componentType === 'RICH_TEXT') ensureRichTextDefaults(component);
    if (component.componentType === 'SELECT') ensureSelectDefaults(component);
    if (component.componentType === 'RADIO') ensureRadioDefaults(component);
    if (component.componentType === 'TITLE') ensureTitleDefaults(component);
    if (component.componentType === 'FILE') ensureFileDefaults(component);
    if (component.componentType === 'DATA_VIEW') ensureDataViewDefaults(component);
    if (component.componentType === 'TABLE' && ['FIXED', 'ROW_EXPAND'].includes(component.customProps?.tableSubtype)) {
      ensureWorkspaceTableDefaults(component);
    }
    if (component.componentType === '3D_VIEW' && component.customProps?.threeDSubtype === 'TEMPLATE_BROWSE') {
      ensureTemplateBrowse3dDefaults(component);
    }
    if (component.componentType === '3D_VIEW' && component.customProps?.threeDSubtype === 'MODEL_SELECT') {
      ensureModelSelect3dDefaults(component);
    }
    if (component.componentType === '3D_VIEW' && component.customProps?.threeDSubtype === 'FIXED_TEMPLATE') {
      ensureFixedTemplate3dDefaults(component);
    }
  },
  { immediate: true },
);
watch(
  () => selectedComponent.value?.componentType,
  type => {
    if (type === 'INPUT' || type === 'TEXTAREA') {
      textPanelKeys.value = ['basic'];
    }
    if (type === 'SELECT') {
      selectPanelKeys.value = ['basic'];
    }
    if (type === 'RADIO') {
      radioPanelKeys.value = ['basic'];
    }
    if (type === 'TITLE') {
      titlePanelKeys.value = ['basic'];
    }
    if (type === 'FILE') {
      filePanelKeys.value = ['basic'];
    }
    if (type === 'DATA_VIEW') {
      dataViewPanelKeys.value = ['basic', 'knowledge'];
      if (!libraryTypeOptions.value.length) {
        void selectLibraryCategory();
      }
    }
    if (type === 'TABLE' && ['FIXED', 'ROW_EXPAND'].includes(selectedComponent.value?.customProps?.tableSubtype)) {
      const biz = selectedComponent.value?.customProps?.tableBizType;
      fixedTablePanelKeys.value = biz === 'FILE_COLLAB' || biz === 'NORMAL' ? ['info', 'cols'] : ['info', 'rows', 'cols'];
    }
    if (type === '3D_VIEW' && selectedComponent.value?.customProps?.threeDSubtype === 'TEMPLATE_BROWSE') {
      templateBrowse3dPanelKeys.value = ['tpl', 'model', 'buttons'];
    }
    if (type === '3D_VIEW' && selectedComponent.value?.customProps?.threeDSubtype === 'MODEL_SELECT') {
      modelSelect3dPanelKeys.value = ['model', 'buttons'];
    }
    if (type === '3D_VIEW' && selectedComponent.value?.customProps?.threeDSubtype === 'FIXED_TEMPLATE') {
      fixedTemplate3dPanelKeys.value = ['tpl', 'model', 'buttons'];
    }
  },
  { immediate: true },
);
watch(
  () => selectedComponent.value?.customProps?.tableSubtype,
  st => {
    if (selectedComponent.value?.componentType !== 'TABLE') return;
    if (st === 'FIXED' || st === 'ROW_EXPAND') {
      const biz = selectedComponent.value?.customProps?.tableBizType;
      fixedTablePanelKeys.value = biz === 'FILE_COLLAB' || biz === 'NORMAL' ? ['info', 'cols'] : ['info', 'rows', 'cols'];
      syncWorkspaceTableRowColDefs(selectedComponent.value);
    }
  },
  { immediate: true },
);
watch(
  () => selectedComponent.value?.customProps?.tableBizType,
  () => {
    const c = selectedComponent.value;
    if (c?.componentType !== 'TABLE' || !['FIXED', 'ROW_EXPAND'].includes(c.customProps?.tableSubtype || '')) return;
    const biz = c.customProps?.tableBizType;
    fixedTablePanelKeys.value = biz === 'FILE_COLLAB' || biz === 'NORMAL' ? ['info', 'cols'] : ['info', 'rows', 'cols'];
    if (biz === 'BASIC_RESOURCE_LIB_READ' && c.customProps.basicResourceLibType == null) {
      c.customProps.basicResourceLibType = 'MODEL_LIB';
    }
    syncWorkspaceTableRowColDefs(c);
  },
);
watch(
  () => [selectedComponent.value?.customProps?.tableBodyRows, selectedComponent.value?.customProps?.tableColCount, selectedComponent.value?.customProps?.tableSubtype],
  () => {
    const c = selectedComponent.value;
    if (c?.componentType === 'TABLE' && ['FIXED', 'ROW_EXPAND'].includes(c?.customProps?.tableSubtype)) {
      syncWorkspaceTableRowColDefs(c);
    }
  },
);
watch(selectedIndex, () => {
  selectedTableCell.value = null;
});
watch(
  () => props.modalVisible,
  val => {
    if (!val) return;
    formState.value.activityPageId = props.record?.id ?? null;
    formState.value.formId = props.record?.formId ?? null;
    formState.value.formCode = props.record?.formCode ?? null;
    formState.value.operationType = props.record?.formId ? 'update' : 'insert';
    const mergedList = [
      ...parseList(props.record?.basicComponentList),
      ...parseList(props.record?.threeDComponentList),
      ...parseList(props.record?.uploadComponentList),
      ...parseList(props.record?.tableComponentList),
    ];
    componentList.value = mergedList.slice().sort((a: any, b: any) => {
      const sa = Number(a?.sortNo);
      const sb = Number(b?.sortNo);
      const av = Number.isFinite(sa) ? sa : Number.MAX_SAFE_INTEGER;
      const bv = Number.isFinite(sb) ? sb : Number.MAX_SAFE_INTEGER;
      return av - bv;
    });
    selectedIndex.value = componentList.value.length > 0 ? 0 : -1;
  },
  { immediate: true },
);
</script>

<template>
  <a-modal
    v-model:visible="visible"
    class="activity-config-fullscreen-modal"
    wrap-class-name="activity-config-fullscreen-wrap"
    :centered="false"
    :footer="null"
    :mask-closable="false"
    width="100%"
    :style="{ top: 0, paddingBottom: 0 }"
    title="活动页面配置">
    <div class="config-layout">
      <div class="left-palette">
        <div class="panel-title">页面配置</div>
        <div v-for="group in paletteGroups" :key="group.title" class="palette-group">
          <div class="group-title">· {{ group.title }}</div>
          <div class="group-grid">
            <button
              v-for="item in group.items"
              :key="`${group.title}-${item.label}`"
              type="button"
              class="tool-card"
              draggable="true"
              @click="handlePaletteClick(item)"
              @dragstart="handleDragStart(item, $event)"
              @dragend="handleDragEnd">
              <component :is="getPaletteItemIcon(item)" class="tool-card-icon" />
              <span class="tool-card-label">{{ item.label }}</span>
            </button>
          </div>
        </div>
        <div class="palette-group">
          <div class="group-title">· 总体配置</div>
          <div class="global-actions">
            <a-button type="primary" class="global-btn" @click="handleBatchSelectParam">批量选取参数</a-button>
            <a-button type="primary" class="global-btn" @click="handleSketchConfig">示意图配置</a-button>
          </div>
        </div>
      </div>

      <div class="center-canvas" :class="{ 'drag-over': isDragOverCanvas }" @dragover="handleCanvasDragOver" @dragleave="handleCanvasDragLeave" @drop="handleCanvasDrop">
        <div class="panel-title">组件列表</div>
        <a-empty v-if="!componentList.length" description="请选择左侧组件添加到设计区" />
        <div v-if="isDragOverCanvas" class="drop-tip">释放鼠标添加</div>
        <div class="component-list">
          <div
            v-for="(item, index) in componentList"
            :key="index"
            class="component-card"
            :class="{
              active: selectedIndex === index,
              'insert-before': showInsertBefore(index),
              'insert-after': showInsertAfter(index),
              'full-row-item': isFullRowComponent(item.componentType),
            }"
            draggable="true"
            @click="selectedIndex = index"
            @dragstart="handleItemDragStart(index, $event)"
            @dragover="handleItemDragOver(index, $event)"
            @drop="handleItemDrop(index, $event)"
            @dragend="handleItemDragEnd">
            <div class="component-preview-wrap">
              <div
                v-if="
                  item.componentType !== 'TITLE' &&
                  item.componentType !== 'RADIO' &&
                  item.componentType !== 'FILE' &&
                  item.componentType !== 'DIVIDER' &&
                  item.componentType !== 'DATA_VIEW' &&
                  !isWorkspaceTableItem(item) &&
                  !isTemplateBrowse3DItem(item) &&
                  !isFixedTemplate3DItem(item) &&
                  !isModelSelect3DItem(item)
                "
                class="component-title">
                <span>{{ item.paramName || '未命名组件' }}</span>
                <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
                  <ExclamationCircleOutlined class="component-knowledge-hint" />
                </a-tooltip>
              </div>
              <template v-if="item.componentType === 'TITLE'">
                <div class="title-preview-text">
                  <span>{{ item.paramName || '标题' }}</span>
                  <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
                    <ExclamationCircleOutlined class="component-knowledge-hint" />
                  </a-tooltip>
                </div>
                <div v-if="item.customProps?.hasDivider === 1 || item.customProps?.hasDivider === '1' || item.customProps?.hasDivider === true" class="title-divider-line"></div>
              </template>
              <div v-else-if="item.componentType === 'INPUT'" class="value-range-inline-row">
                <a-input :value="getPreviewValue(item)" :placeholder="item.customProps?.placeholder || '请输入'" disabled class="preview-field" />
                <span v-if="getInputValueRangeHint(item)" class="value-range-hint-chip">{{ getInputValueRangeHint(item) }}</span>
              </div>
              <a-textarea
                v-else-if="item.componentType === 'TEXTAREA'"
                :value="getPreviewValue(item)"
                :rows="item.customProps?.rows || 4"
                :placeholder="item.customProps?.placeholder || '请输入'"
                disabled
                class="preview-field" />
              <a-date-picker
                v-else-if="item.componentType === 'DATE'"
                :show-time="item.customProps?.format === 'yyyy-MM-dd HH:mm:ss'"
                :format="item.customProps?.format || 'yyyy-MM-dd'"
                :placeholder="item.customProps?.format === 'yyyy-MM-dd HH:mm:ss' ? '请选择日期时间' : '请选择日期'"
                disabled
                class="preview-field" />
              <div v-else-if="item.componentType === 'DIVIDER'" class="divider-preview-line"></div>
              <div v-else-if="item.componentType === 'DATA_VIEW'" class="data-view-preview">
                <div class="data-view-preview-title">
                  <span>{{ item.paramName || '数据浏览' }}</span>
                  <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
                    <ExclamationCircleOutlined class="component-knowledge-hint" />
                  </a-tooltip>
                </div>
                <div class="data-view-preview-row">
                  <a-input
                    :value="getPreviewValue(item)"
                    :placeholder="item.customProps?.inputPlaceholder || '请输入设计参数1'"
                    disabled
                    class="data-view-preview-input browse-adjoined-input" />
                  <a-button type="primary" class="data-view-assemble-btn" disabled>
                    {{ '浏览' }}
                  </a-button>
                </div>
              </div>
              <div v-else-if="item.componentType === 'FILE'" class="file-preview-wrap">
                <div class="file-preview-title">
                  <span>{{ item.paramName || '附件上传' }}</span>
                  <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
                    <ExclamationCircleOutlined class="component-knowledge-hint" />
                  </a-tooltip>
                </div>
                <a-upload-dragger :disabled="true" class="file-preview-dragger">
                  <p class="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p class="ant-upload-hint">支持任意文件类型上传</p>
                </a-upload-dragger>
              </div>
              <a-select
                v-else-if="item.componentType === 'SELECT'"
                :value="getSelectPreviewValue(item)"
                :options="getSelectOptions(item)"
                placeholder="请选择"
                disabled
                class="preview-field" />
              <div v-else-if="item.componentType === 'RICH_TEXT'" class="rich-preview-wrap">
                <CkeditorPlugin height="180" />
              </div>
              <div v-else-if="item.componentType === 'RADIO'" class="radio-preview-wrap">
                <div class="radio-preview-title">
                  <span>{{ item.paramName || '单选项' }}</span>
                  <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
                    <ExclamationCircleOutlined class="component-knowledge-hint" />
                  </a-tooltip>
                </div>
                <div class="radio-preview-grid">
                  <label v-for="(opt, optIdx) in getRadioOptions(item)" :key="`${opt}-${optIdx}`" class="radio-preview-item">
                    <input type="radio" :checked="isRadioPreviewChecked(item, opt, optIdx)" disabled />
                    <span>{{ opt }}</span>
                  </label>
                </div>
              </div>
              <div v-else-if="isTemplateBrowse3DItem(item)" class="template-browse-3d-preview">
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.paramName || '模板名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.templateValue" placeholder="请输入" disabled class="template-browse-3d-input template-browse-3d-input--grey" />
                      <a-button type="primary" size="small" class="template-browse-3d-action-btn" disabled>浏览</a-button>
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.customProps?.modelName || '模型名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.modelValue" placeholder="请输入" disabled class="template-browse-3d-input" />
                      <div class="three-d-preview-btn-grid">
                        <a-button v-for="btn in get3dPreviewButtons(item)" :key="`tpl-btn-${btn}`" type="primary" size="small" class="template-browse-3d-action-btn" disabled>
                          {{ btn }}
                        </a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="isFixedTemplate3DItem(item)" class="template-browse-3d-preview">
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.paramName || '模板名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.templateValue" placeholder="请输入" disabled class="template-browse-3d-input template-browse-3d-input--grey" />
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">{{ item.customProps?.modelName || '模型名称' }}：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.modelValue" placeholder="请输入" disabled class="template-browse-3d-input" />
                      <div class="three-d-preview-btn-grid">
                        <a-button v-for="btn in get3dPreviewButtons(item)" :key="`fixed-btn-${btn}`" type="primary" size="small" class="template-browse-3d-action-btn" disabled>
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
                  <a-input :value="item.customProps?.modelSelectName" placeholder="请输入" disabled class="template-browse-3d-input template-browse-3d-input--grey" />
                  <a-button type="primary" size="small" class="template-browse-3d-action-btn" disabled>浏览</a-button>
                  <a-button
                    v-for="btn in getModelSelectPreviewButtons(item)"
                    :key="`model-select-btn-${btn}`"
                    type="primary"
                    size="small"
                    class="template-browse-3d-action-btn"
                    disabled>
                    {{ btn }}
                  </a-button>
                </div>
              </div>
              <div v-else-if="isWorkspaceTableItem(item)" class="fixed-table-preview">
                <div
                  v-if="(item.customProps?.tableTitle || '').trim() !== '' || item.customProps?.tableSubtype === 'ROW_EXPAND'"
                  class="fixed-table-preview-title-row"
                  @click.stop="onTablePreviewTitleClick(index)">
                  <span v-if="(item.customProps?.tableTitle || '').trim() !== ''" class="fixed-table-preview-title-text">
                    {{ item.customProps.tableTitle }}
                  </span>
                  <a-button
                    v-if="item.customProps?.tableSubtype === 'ROW_EXPAND'"
                    type="primary"
                    size="small"
                    class="fixed-table-preview-add-btn"
                    @click.stop="handleExpandTableAddRowForItem(item)">
                    添加
                  </a-button>
                </div>
                <table class="fixed-table-preview-grid">
                  <thead>
                    <tr>
                      <th v-for="c in tableDimensionRange(item.customProps?.tableColCount || 1)" :key="`h-${c}`" :style="getFixedTableColumnPreviewStyle(item, c)">
                        {{ getFixedTableHeaderLabel(item, c) }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in tableDimensionRange(item.customProps?.tableBodyRows || 1)" :key="`b-${r}`">
                      <td
                        v-for="c in tableDimensionRange(item.customProps?.tableColCount || 1)"
                        :key="`b-${r}-${c}`"
                        class="fixed-table-preview-td"
                        :class="{
                          'fixed-table-preview-td--first': c === 1,
                          'fixed-table-preview-td--selected': selectedIndex === index && selectedTableCell?.row === r && selectedTableCell?.col === c,
                        }"
                        :style="getFixedTableColumnPreviewStyle(item, c)"
                        @click.stop="onTablePreviewCellClick(index, r, c)">
                        <template v-if="c === 1">
                          <span v-if="(item.customProps?.firstColumnType || 'INDEX') === 'INDEX'" class="fixed-table-cell-index">{{ r }}</span>
                          <input v-else-if="item.customProps?.firstColumnType === 'CHECKBOX'" type="checkbox" class="fixed-table-cell-check" disabled tabindex="-1" />
                          <input
                            v-else-if="item.customProps?.firstColumnType === 'RADIO'"
                            type="radio"
                            class="fixed-table-cell-radio"
                            :name="`fixed-table-radio-${index}`"
                            :checked="r === 1"
                            disabled
                            tabindex="-1" />
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="component-type-text">{{ getTypeText(item.componentType) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-config">
        <div class="right-config-scroll">
          <div class="panel-title">基础定义</div>
          <a-form v-if="selectedComponent" layout="vertical">
            <template v-if="isTextLikeComponent">
              <a-collapse v-model:activeKey="textPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">输入输出类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.ioType">
                        <a-select-option value="INPUT">输入</a-select-option>
                        <a-select-option value="OUTPUT">输出</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field" v-if="selectedComponent.ioType === 'INPUT'">
                    <div class="row-label">默认值：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramValue" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field" v-if="selectedComponent.componentType === 'INPUT'">
                    <div class="row-label">限制关系：</div>
                    <div class="row-control row-control-full">
                      <div class="constraint-row" v-for="(rule, idx) in selectedComponent.constraintRules" :key="idx">
                        <a-input v-model:value="rule.refParamCode" placeholder="请输入参数" style="width: 110px" />
                        <a-select v-model:value="rule.operator" style="width: 70px">
                          <a-select-option value="=">=</a-select-option>
                          <a-select-option value=">">></a-select-option>
                          <a-select-option value=">=">>=</a-select-option>
                          <a-select-option value="<"><</a-select-option>
                          <a-select-option value="<="><=</a-select-option>
                          <a-select-option value="!=">!=</a-select-option>
                        </a-select>
                        <a-input v-model:value="rule.compareValue" placeholder="请输入" style="width: 110px" />
                        <a-button type="link" danger class="icon-only-btn delete-icon-btn" @click="removeConstraintRule(idx)">🗑</a-button>
                      </div>
                      <a-button type="link" class="icon-only-btn add-icon-btn" @click="addConstraintRule">+</a-button>
                    </div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel v-if="selectedComponent.componentType === 'INPUT'" key="range" header="取值范围定义">
                  <div class="row-field">
                    <div class="row-label">取值范围类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.validateRule.valueRange.scopeType">
                        <a-select-option value="WARNING">警告型范围</a-select-option>
                        <a-select-option value="REQUIRED">限制型范围</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">范围形式：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.validateRule.valueRange.operator">
                        <a-select-option value="=">=</a-select-option>
                        <a-select-option value=">">></a-select-option>
                        <a-select-option value=">=">>=</a-select-option>
                        <a-select-option value="<"><</a-select-option>
                        <a-select-option value="<="><=</a-select-option>
                        <a-select-option value="≤">≤</a-select-option>
                        <a-select-option value="<; <"><; <</a-select-option>
                        <a-select-option value="<; <="><; <=</a-select-option>
                        <a-select-option value="<=; <">≤; <</a-select-option>
                        <a-select-option value="≤; <">≤; <</a-select-option>
                        <a-select-option value="<=; <=">≤; ≤</a-select-option>
                        <a-select-option value="≤; ≤">≤; ≤</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">范围定义：</div>
                    <div class="row-control">
                      <div class="range-definition-values">
                        <a-input v-model:value="selectedComponent.validateRule.valueRange.compareValue" placeholder="请输入" />
                        <a-input
                          v-if="selectedComponent.validateRule.valueRange.operator?.includes(';')"
                          v-model:value="selectedComponent.validateRule.valueRange.compareValue2"
                          placeholder="请输入" />
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel v-if="selectedComponent.componentType === 'INPUT' && selectedComponent.ioType === 'OUTPUT'" key="formula" header="公式定义">
                  <div class="row-field">
                    <div class="row-label">公式编辑器：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.validateRule.formula.expression" disabled placeholder="请定义" /><a-button
                        type="primary"
                        size="small"
                        @click="openFormulaEditor"
                        >定义</a-button
                      >
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">调用JS：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.validateRule.formula.jsMethodName" placeholder="请输入JS方法名" /></div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isDateComponent">
              <a-collapse v-model:activeKey="textPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">输入输出类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.ioType">
                        <a-select-option value="INPUT">输入</a-select-option>
                        <a-select-option value="OUTPUT">输出</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">格式：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.customProps.format">
                        <a-select-option value="yyyy-MM-dd">yyyy-MM-dd</a-select-option>
                        <a-select-option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">限制关系：</div>
                    <div class="row-control row-control-full">
                      <div class="constraint-row" v-for="(rule, idx) in selectedComponent.constraintRules" :key="idx">
                        <a-input v-model:value="rule.refParamCode" placeholder="请输入参数" style="width: 110px" />
                        <a-select v-model:value="rule.operator" style="width: 70px">
                          <a-select-option value="=">=</a-select-option>
                          <a-select-option value=">">></a-select-option>
                          <a-select-option value=">=">>=</a-select-option>
                          <a-select-option value="<"><</a-select-option>
                          <a-select-option value="<="><=</a-select-option>
                          <a-select-option value="!=">!=</a-select-option>
                        </a-select>
                        <a-input v-model:value="rule.compareValue" placeholder="请输入" style="width: 110px" />
                        <a-button type="link" danger class="icon-only-btn delete-icon-btn" @click="removeConstraintRule(idx)">🗑</a-button>
                      </div>
                      <a-button type="link" class="icon-only-btn add-icon-btn" @click="addConstraintRule">+</a-button>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isSelectComponent">
              <a-collapse v-model:activeKey="selectPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">输入输出类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.ioType">
                        <a-select-option value="INPUT">输入</a-select-option>
                        <a-select-option value="OUTPUT">输出</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field" v-if="selectedComponent.ioType === 'INPUT'">
                    <div class="row-label">默认值：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramValue" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">限制关系：</div>
                    <div class="row-control row-control-full">
                      <div class="constraint-row" v-for="(rule, idx) in selectedComponent.constraintRules" :key="idx">
                        <a-input v-model:value="rule.refParamCode" placeholder="请输入参数" style="width: 110px" />
                        <a-select v-model:value="rule.operator" style="width: 70px">
                          <a-select-option value="=">=</a-select-option>
                          <a-select-option value=">">></a-select-option>
                          <a-select-option value=">=">>=</a-select-option>
                          <a-select-option value="<"><</a-select-option>
                          <a-select-option value="<="><=</a-select-option>
                          <a-select-option value="!=">!=</a-select-option>
                        </a-select>
                        <a-input v-model:value="rule.compareValue" placeholder="请输入" style="width: 110px" />
                        <a-button type="link" danger class="icon-only-btn delete-icon-btn" @click="removeConstraintRule(idx)">🗑</a-button>
                      </div>
                      <a-button type="link" class="icon-only-btn add-icon-btn" @click="addConstraintRule">+</a-button>
                    </div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel v-if="selectedComponent.ioType === 'INPUT'" key="range" header="取值范围定义">
                  <div class="row-field">
                    <div class="row-label">取值范围类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.validateRule.valueRange.scopeType">
                        <a-select-option value="WARNING">警告型范围</a-select-option>
                        <a-select-option value="REQUIRED">限制型范围</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">范围形式：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.validateRule.valueRange.operator">
                        <a-select-option value="=">=</a-select-option>
                        <a-select-option value=">">></a-select-option>
                        <a-select-option value=">=">>=</a-select-option>
                        <a-select-option value="<"><</a-select-option>
                        <a-select-option value="<="><=</a-select-option>
                        <a-select-option value="≤">≤</a-select-option>
                        <a-select-option value="<; <"><; <</a-select-option>
                        <a-select-option value="<; <="><; <=</a-select-option>
                        <a-select-option value="<=; <">≤; <</a-select-option>
                        <a-select-option value="≤; <">≤; <</a-select-option>
                        <a-select-option value="<=; <=">≤; ≤</a-select-option>
                        <a-select-option value="≤; ≤">≤; ≤</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">范围定义：</div>
                    <div class="row-control">
                      <div class="range-definition-values">
                        <a-input v-model:value="selectedComponent.validateRule.valueRange.compareValue" placeholder="请输入" />
                        <a-input
                          v-if="selectedComponent.validateRule.valueRange.operator?.includes(';')"
                          v-model:value="selectedComponent.validateRule.valueRange.compareValue2"
                          placeholder="请输入" />
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel key="dropdown" header="下拉属性配置">
                  <div class="row-field align-top">
                    <div class="row-label">序列值配置：</div>
                    <div class="row-control row-control-full">
                      <div class="sequence-row" v-for="(option, optionIdx) in selectedComponent.customProps.sequenceValues" :key="optionIdx">
                        <a-input v-model:value="selectedComponent.customProps.sequenceValues[optionIdx]" placeholder="请输入" style="width: 210px" />
                        <a-button type="link" class="icon-btn" @click="addSequenceValue">+</a-button>
                        <a-button type="link" danger class="icon-btn" @click="removeSequenceValue(optionIdx)">x</a-button>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isRadioComponent">
              <a-collapse v-model:activeKey="radioPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">输入输出类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.ioType">
                        <a-select-option value="INPUT">输入</a-select-option>
                        <a-select-option value="OUTPUT">输出</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field" v-if="selectedComponent.ioType === 'INPUT'">
                    <div class="row-label">默认值：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramValue" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">限制关系：</div>
                    <div class="row-control row-control-full">
                      <div class="constraint-row" v-for="(rule, idx) in selectedComponent.constraintRules" :key="idx">
                        <a-input v-model:value="rule.refParamCode" placeholder="请输入参数" style="width: 110px" />
                        <a-select v-model:value="rule.operator" style="width: 70px">
                          <a-select-option value="=">=</a-select-option>
                          <a-select-option value=">">></a-select-option>
                          <a-select-option value=">=">>=</a-select-option>
                          <a-select-option value="<"><</a-select-option>
                          <a-select-option value="<="><=</a-select-option>
                          <a-select-option value="!=">!=</a-select-option>
                        </a-select>
                        <a-input v-model:value="rule.compareValue" placeholder="请输入" style="width: 110px" />
                        <a-button type="link" danger class="icon-only-btn delete-icon-btn" @click="removeConstraintRule(idx)">🗑</a-button>
                      </div>
                      <a-button type="link" class="icon-only-btn add-icon-btn" @click="addConstraintRule">+</a-button>
                    </div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>

                <a-collapse-panel key="options" header="选项配置">
                  <div class="row-field align-top">
                    <div class="row-label">序列值配置：</div>
                    <div class="row-control row-control-full">
                      <div class="sequence-row" v-for="(option, optionIdx) in selectedComponent.customProps.radioOptions" :key="optionIdx">
                        <a-input v-model:value="selectedComponent.customProps.radioOptions[optionIdx]" placeholder="请输入" style="width: 210px" />
                        <a-button type="link" class="icon-btn" @click="addRadioOption">+</a-button>
                        <a-button type="link" danger class="icon-btn" @click="removeRadioOption(optionIdx)">x</a-button>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isRichTextComponent">
              <a-collapse v-model:activeKey="textPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">输入输出类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.ioType">
                        <a-select-option value="INPUT">输入</a-select-option>
                        <a-select-option value="OUTPUT">输出</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">限制关系：</div>
                    <div class="row-control row-control-full">
                      <div class="constraint-row" v-for="(rule, idx) in selectedComponent.constraintRules" :key="idx">
                        <a-input v-model:value="rule.refParamCode" placeholder="请输入参数" style="width: 110px" />
                        <a-select v-model:value="rule.operator" style="width: 70px">
                          <a-select-option value="=">=</a-select-option>
                          <a-select-option value=">">></a-select-option>
                          <a-select-option value=">=">>=</a-select-option>
                          <a-select-option value="<"><</a-select-option>
                          <a-select-option value="<="><=</a-select-option>
                          <a-select-option value="!=">!=</a-select-option>
                        </a-select>
                        <a-input v-model:value="rule.compareValue" placeholder="请输入" style="width: 110px" />
                        <a-button type="link" danger class="icon-only-btn delete-icon-btn" @click="removeConstraintRule(idx)">🗑</a-button>
                      </div>
                      <a-button type="link" class="icon-only-btn add-icon-btn" @click="addConstraintRule">+</a-button>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isDataViewComponent">
              <a-collapse v-model:activeKey="dataViewPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">输入输出类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.ioType">
                        <a-select-option value="INPUT">输入</a-select-option>
                        <a-select-option value="OUTPUT">输出</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">基础资源库类型：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.libraryType" placeholder="请选择">
                        <a-select-option v-for="opt in libraryTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">基础资源库分类：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.customProps.libraryCategory" disabled placeholder="请浏览选取" />
                      <a-button type="primary" size="small" @click="selectLibraryCategoryName('dataView')">浏览</a-button>
                    </div>
                  </div>
                  <div v-if="shouldShowDataViewLibraryParam()" class="row-field">
                    <div class="row-label">基础资源库对应参数：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.libraryParam" placeholder="请选择">
                        <a-select-option value="PART_NO">模型件号</a-select-option>
                        <a-select-option value="PART_NAME">模型名称</a-select-option>
                        <a-select-option value="MATERIAL">材料</a-select-option>
                      </a-select>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isFileComponent">
              <a-collapse v-model:activeKey="filePanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
              <div class="single-upload-note">每个活动页面最多只能有一个上传组件</div>
            </template>
            <template v-else-if="isTitleComponent">
              <a-collapse v-model:activeKey="titlePanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">标题名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">是否有分割线：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.customProps.hasDivider">
                        <a-select-option :value="1">是</a-select-option>
                        <a-select-option :value="0">否</a-select-option>
                      </a-select>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="knowledge" header="知识配置">
                  <div class="row-field">
                    <div class="row-label">提示知识：</div>
                    <div class="row-control row-control-full"><a-textarea v-model:value="selectedComponent.knowledgeContent" :rows="3" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isDividerComponent">
              <div class="divider-empty-panel"></div>
            </template>
            <template v-else-if="isWorkspaceTableComponent">
              <p v-if="!selectedTableCell" class="table-cell-inherit-hint">点击画布中表格单元格，可配置该单元格的参数继承属性。</p>
              <a-collapse
                v-if="selectedTableCell && activeCellParamInherit"
                v-model:activeKey="tableCellInheritPanelKeys"
                :bordered="false"
                class="text-config-collapse table-cell-inherit-collapse">
                <a-collapse-panel key="cellInherit" header="单元格参数继承属性配置">
                  <div class="row-field">
                    <div class="row-label">数据类型：</div>
                    <div class="row-control">
                      <a-input :value="selectedTableCellDataTypeLabel" disabled class="table-cell-inherit-readonly-input" />
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数继承型式：</div>
                    <div class="row-control">
                      <a-select v-model:value="activeCellParamInherit.cellInheritType" placeholder="请选择">
                        <a-select-option value="FROM_PARAM">从参数继承</a-select-option>
                        <a-select-option value="FIXED">从其他表格继承</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="activeCellParamInherit.cellParamCode" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter({ type: 'tableCellInherit', field: 'cellParamCode' })"> 浏览 </a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">表格编号：</div>
                    <div class="row-control">
                      <a-input v-model:value="activeCellParamInherit.cellTableNumber" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter({ type: 'tableCellInherit', field: 'cellTableNumber' })"> 浏览 </a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">表格单元格：</div>
                    <div class="row-control">
                      <a-input v-model:value="activeCellParamInherit.cellTableCellRef" placeholder="请输入" />
                      <a-button type="primary" size="small" @click="showParameter({ type: 'tableCellInherit', field: 'cellTableCellRef' })"> 浏览 </a-button>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
              <a-collapse v-if="!selectedTableCell" v-model:activeKey="fixedTablePanelKeys" :bordered="false" class="text-config-collapse">
                <template v-if="['FIXED', 'ROW_EXPAND'].includes(selectedComponent.customProps.tableSubtype)">
                  <a-collapse-panel key="info" header="表格基本信息">
                    <div class="row-field">
                      <div class="row-label">表格标题：</div>
                      <div class="row-control"><a-input v-model:value="selectedComponent.customProps.tableTitle" placeholder="请输入" /></div>
                    </div>
                    <div class="row-field">
                      <div class="row-label">表格行数：</div>
                      <div class="row-control">
                        <a-select v-model:value="selectedComponent.customProps.tableBodyRows">
                          <a-select-option v-for="n in tableDimensionRange(50)" :key="n" :value="n">{{ n }}</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div class="row-field">
                      <div class="row-label">表格列数：</div>
                      <div class="row-control">
                        <a-select v-model:value="selectedComponent.customProps.tableColCount">
                          <a-select-option v-for="n in tableDimensionRange(20)" :key="n" :value="n">{{ n }}</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div class="row-field">
                      <div class="row-label">表格编号：</div>
                      <div class="row-control">
                        <a-input v-model:value="selectedComponent.customProps.tableNumber" placeholder="请输入" class="browse-adjoined-input" />
                        <a-button type="primary" size="small">浏览</a-button>
                      </div>
                    </div>
                    <div class="row-field">
                      <div class="row-label">表格类型：</div>
                      <div class="row-control">
                        <a-select v-model:value="selectedComponent.customProps.tableBizType" placeholder="请选择">
                          <a-select-option value="MODULE_LIB_READ">模块库读取</a-select-option>
                          <a-select-option value="BASIC_RESOURCE_LIB_READ">基础资源库读取</a-select-option>
                          <a-select-option value="FILE_COLLAB">文件协同</a-select-option>
                          <a-select-option value="NORMAL">普通表格</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div v-if="selectedComponent.customProps.tableBizType === 'BASIC_RESOURCE_LIB_READ'" class="row-field">
                      <div class="row-label">基础资源库类型：</div>
                      <div class="row-control">
                        <a-select v-model:value="selectedComponent.customProps.basicResourceLibType" placeholder="请选择">
                          <a-select-option value="MODEL_LIB">模型库</a-select-option>
                          <a-select-option value="PLATFORM_LIB">平台库</a-select-option>
                          <a-select-option value="STD_LIB">标准件库</a-select-option>
                          <a-select-option value="MATERIAL_LIB">材料库</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div v-if="!['BASIC_RESOURCE_LIB_READ', 'FILE_COLLAB', 'NORMAL'].includes(selectedComponent.customProps.tableBizType)" class="row-field">
                      <div class="row-label">操作列按钮：</div>
                      <div class="row-control row-control-full">
                        <div class="fixed-table-btn-checks fixed-table-btn-checks--col">
                          <a-checkbox v-model:checked="selectedComponent.customProps.btnOpenDrawing">打开图纸</a-checkbox>
                          <a-checkbox v-model:checked="selectedComponent.customProps.btnOpenModel">打开模型</a-checkbox>
                          <a-checkbox v-model:checked="selectedComponent.customProps.btnAssembleModel">装配模型</a-checkbox>
                        </div>
                      </div>
                    </div>
                  </a-collapse-panel>
                  <a-collapse-panel
                    v-if="selectedComponent.customProps.tableBizType !== 'FILE_COLLAB' && selectedComponent.customProps.tableBizType !== 'NORMAL'"
                    key="rows"
                    header="行定义">
                    <div class="fixed-table-def-scroll">
                      <table class="fixed-table-def-table">
                        <thead>
                          <tr>
                            <th class="fixed-table-def-th fixed-table-def-th--narrow">行名称</th>
                            <th class="fixed-table-def-th">
                              {{ getTableRowDefCategoryColumnLabel(selectedComponent.customProps.tableBizType) }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="r in tableDimensionRange(selectedComponent.customProps.tableBodyRows)" :key="`row-${r}`">
                            <td class="fixed-table-def-td">第{{ r }}行</td>
                            <td class="fixed-table-def-td">
                              <div class="fixed-table-def-cell fixed-table-def-cell--browse">
                                <a-input
                                  v-model:value="selectedComponent.customProps.tableRowDefs[r - 1].moduleLibCategory"
                                  placeholder="请通过浏览选择"
                                  disabled
                                  class="browse-adjoined-input" />
                                <a-button type="primary" size="small" class="fixed-table-def-browse-btn">浏览</a-button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </a-collapse-panel>
                  <a-collapse-panel key="cols">
                    <template #header>
                      <div class="fixed-table-col-def-collapse-header">
                        <span>列定义</span>
                        <a-button type="link" size="small" class="fixed-table-col-def-config-btn" @click.stop="openColumnDefModal">配置</a-button>
                      </div>
                    </template>
                    <p class="fixed-table-col-def-view-hint">以下为当前列配置概览，完整编辑请点「配置」在弹窗中操作。</p>
                    <div class="fixed-table-def-scroll fixed-table-def-scroll--readonly-summary">
                      <table class="fixed-table-def-table fixed-table-def-table--cols fixed-table-def-table--readonly-summary">
                        <thead>
                          <tr>
                            <th class="fixed-table-def-th fixed-table-def-th--col-name">列名称</th>
                            <th class="fixed-table-def-th">关联参数代号</th>
                            <th class="fixed-table-def-th fixed-table-def-th--dtype">数据类型</th>
                            <th class="fixed-table-def-th fixed-table-def-th--width">列宽</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="c in tableDimensionRangeFromSecond(selectedComponent.customProps.tableColCount)" :key="`col-view-${c}`">
                            <td class="fixed-table-def-td">{{ getFixedTableColDisplayName(selectedComponent.customProps, c) }}</td>
                            <td class="fixed-table-def-td fixed-table-def-td--readonly-text">
                              {{ selectedComponent.customProps.tableColDefs[c - 1]?.paramCode || '—' }}
                            </td>
                            <td class="fixed-table-def-td">{{ getFixedTableColDataTypeLabel(selectedComponent.customProps.tableColDefs[c - 1]?.dataType) }}</td>
                            <td class="fixed-table-def-td">{{ selectedComponent.customProps.tableColDefs[c - 1]?.columnWidth || '—' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </a-collapse-panel>
                </template>
              </a-collapse>
            </template>
            <template v-else-if="isFixedTemplate3DComponent">
              <a-collapse v-model:activeKey="fixedTemplate3dPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="tpl" header="模板信息">
                  <div class="row-field">
                    <div class="row-label">模板名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">模板编号：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.templateValue" placeholder="请输入模板编号" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">是否显示：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.customProps.fixedTemplateDisplay">
                        <a-select-option :value="1">是</a-select-option>
                        <a-select-option :value="0">否</a-select-option>
                      </a-select>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="model" header="模型信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">模型名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.modelName" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="buttons" header="按钮定义">
                  <div class="three-d-config-btn-checks">
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnApplyPartNo">申请件号</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnOpenModel">打开模型</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnAssembleModel">装配模型</a-checkbox>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isModelSelect3DComponent">
              <a-collapse v-model:activeKey="modelSelect3dPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="model" header="模型信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">关联模型库分类：</div>
                    <div class="row-control">
                      <a-input disabled v-model:value="selectedComponent.customProps.relatedModelLib" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" @click="selectLibraryCategoryName('modelSelect3d')" size="small">浏览</a-button>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="buttons" header="按钮定义">
                  <div class="three-d-config-btn-checks">
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnOpenModel">打开模型</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnAssembleModel">装配模型</a-checkbox>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isTemplateBrowse3DComponent">
              <a-collapse v-model:activeKey="templateBrowse3dPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="tpl" header="模板信息">
                  <div class="row-field">
                    <div class="row-label">模板名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">关联模型库分类：</div>
                    <div class="row-control">
                      <a-input disabled v-model:value="selectedComponent.customProps.relatedTemplateLib" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" size="small" @click="selectLibraryCategoryName('template3d')">浏览</a-button>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="model" header="模型信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">模型名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.modelName" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="buttons" header="按钮定义">
                  <div class="three-d-config-btn-checks">
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnApplyPartNo">申请件号</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnOpenModel">打开模型</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnAssembleModel">装配模型</a-checkbox>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else>
              <a-form-item label="参数代号">
                <div class="row-control">
                  <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                  <a-button type="primary" size="small" @click="showParameter()">浏览</a-button>
                </div>
              </a-form-item>
              <a-form-item label="参数名称"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></a-form-item>
              <a-form-item label="输入/输出">
                <a-select v-model:value="selectedComponent.ioType">
                  <a-select-option value="INPUT">INPUT</a-select-option>
                  <a-select-option value="OUTPUT">OUTPUT</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="默认值"><a-input v-model:value="selectedComponent.paramValue" placeholder="请输入" /></a-form-item>
            </template>
          </a-form>
          <a-empty v-else description="请选择中间组件后进行配置" />
        </div>
        <div class="right-config-actions">
          <a-button type="primary" v-if="selectedComponent" danger @click="removeSelectedComponent">删除</a-button>
        </div>
      </div>
    </div>
    <div class="footer-actions">
      <a-button @click="emit('close')">取消</a-button>
      <a-button type="primary" :loading="saveLoading" @click="handleSave">保存配置</a-button>
    </div>
  </a-modal>

  <a-modal v-model:visible="tableSizeModalVisible" :title="tableSizeModalTitle" :mask-closable="false" :width="480" :footer="null" :z-index="1100">
    <a-form layout="vertical" class="table-size-form">
      <a-form-item label="表格名称" required>
        <a-input v-model:value="tableSizeDraft.tableTitle" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="表格类型" required>
        <a-select
          v-model:value="tableSizeDraft.tableBizType"
          placeholder="请选择"
          style="width: 100%"
          :getPopupContainer="getTableBizTypeSelectPopupContainer"
          :dropdown-style="tableBizTypeSelectDropdownStyle">
          <a-select-option value="MODULE_LIB_READ">模块库读取</a-select-option>
          <a-select-option value="BASIC_RESOURCE_LIB_READ">基础资源库读取</a-select-option>
          <a-select-option value="FILE_COLLAB">文件协同</a-select-option>
          <a-select-option value="NORMAL">普通表格</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="行数（表体数据行）" required>
        <a-input-number v-model:value="tableSizeDraft.bodyRows" :min="1" :max="100" style="width: 100%" placeholder="请输入行数" />
      </a-form-item>
      <a-form-item label="列数" required>
        <a-input-number v-model:value="tableSizeDraft.cols" :min="1" :max="50" style="width: 100%" placeholder="请输入列数" />
      </a-form-item>
    </a-form>
    <div class="table-size-modal-actions">
      <a-button type="primary" @click="confirmTableSize">确定</a-button>
      <a-button @click="cancelTableSize">取消</a-button>
    </div>
  </a-modal>

  <a-modal
    v-model:visible="columnDefModalVisible"
    title="列定义配置"
    :width="1000"
    :mask-closable="false"
    :footer="null"
    :z-index="1100"
    wrap-class-name="column-def-config-modal-wrap"
    @cancel="cancelColumnDefModal">
    <div v-if="columnDefModalVisible && columnDefDraft.length" class="fixed-table-def-scroll fixed-table-def-scroll--modal">
      <table class="fixed-table-def-table fixed-table-def-table--cols fixed-table-def-table--modal-edit">
        <thead>
          <tr>
            <th class="fixed-table-def-th fixed-table-def-th--col-name">列名称</th>
            <th class="fixed-table-def-th">关联参数代号</th>
            <th class="fixed-table-def-th fixed-table-def-th--dtype">数据类型</th>
            <th class="fixed-table-def-th">下拉值配置</th>
            <th class="fixed-table-def-th fixed-table-def-th--width">列宽</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in tableDimensionRangeFromSecond(selectedComponent?.customProps?.tableColCount || 1)" :key="`col-edit-${c}`">
            <td class="fixed-table-def-td">
              <a-input v-model:value="columnDefDraft[c - 1].columnName" :placeholder="`第${c}列`" allow-clear class="fixed-table-def-col-name-input" />
            </td>
            <td class="fixed-table-def-td">
              <div class="fixed-table-def-cell fixed-table-def-cell--browse">
                <a-input v-model:value="columnDefDraft[c - 1].paramCode" placeholder="请通过浏览选择" disabled class="browse-adjoined-input" />
                <a-button type="primary" size="small" class="fixed-table-def-browse-btn" @click="showParameter({ type: 'tableColDraft', colIndex: c - 1 })"> 浏览 </a-button>
              </div>
            </td>
            <td class="fixed-table-def-td">
              <a-select
                v-model:value="columnDefDraft[c - 1].dataType"
                class="fixed-table-def-select"
                :getPopupContainer="getTableBizTypeSelectPopupContainer"
                :dropdown-style="tableBizTypeSelectDropdownStyle">
                <a-select-option value="TEXT">文本</a-select-option>
                <a-select-option value="READONLY_TEXT">只读文本</a-select-option>
                <a-select-option value="DROPDOWN">下拉值</a-select-option>
              </a-select>
            </td>
            <td class="fixed-table-def-td">
              <a-input v-if="columnDefDraft[c - 1].dataType === 'DROPDOWN'" v-model:value="columnDefDraft[c - 1].dropdownValues" placeholder="如：2;4;6;8;10" />
              <span v-else class="fixed-table-def-placeholder">—</span>
            </td>
            <td class="fixed-table-def-td">
              <a-input v-model:value="columnDefDraft[c - 1].columnWidth" placeholder="如：120px、20%" class="fixed-table-def-col-width-input" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="column-def-modal-actions">
      <a-button type="primary" @click="applyColumnDefModal">确定</a-button>
      <a-button @click="cancelColumnDefModal">取消</a-button>
    </div>
  </a-modal>

  <a-modal v-model:visible="libraryCategoryModalVisible" title="选择节点" :mask-closable="false" :width="700" :z-index="1100" @cancel="onLibraryCategoryCancel">
    <div class="library-category-tree-wrap">
      <a-tree
        :tree-data="libraryCategoryTreeData"
        :selected-keys="libraryCategorySelectedKeys"
        :expanded-keys="libraryCategoryExpandedKeys"
        @select="onLibraryCategorySelect"
        @update:expandedKeys="(keys: any) => (libraryCategoryExpandedKeys = keys)" />
    </div>
    <template #footer>
      <a-button type="primary" @click="onLibraryCategoryConfirm">确定</a-button>
      <a-button @click="onLibraryCategoryCancel">取消</a-button>
    </template>
  </a-modal>

  <FormulaEditorModal
    ref="formulaEditorRef"
    :visible="formulaEditorVisible"
    :initial-value="formulaEditorInitialValue"
    :z-index="1100"
    @update:visible="(v: boolean) => (formulaEditorVisible = v)"
    @insert-parameter="handleFormulaInsertParameter"
    @confirm="confirmFormulaEditor" />

  <ParameterGeneral
    ref="ParameterGeneralRef"
    :modalVisible="ParameterGeneralVisible"
    :modal-z-index="parameterDictionaryModalZIndex"
    @onClose="onParameterGeneralClose"
    @handleSave="handleSaveParameter"></ParameterGeneral>
</template>

<style lang="less">
/* 挂载在 body 下的 wrap，需非 scoped 才能生效 */
.activity-config-fullscreen-wrap {
  padding: 0 !important;
}
.activity-config-fullscreen-wrap .ant-modal {
  top: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  padding-bottom: 0 !important;
}
.activity-config-fullscreen-wrap .ant-modal-content {
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}
.activity-config-fullscreen-wrap .ant-modal-body {
  flex: 1;
  overflow: hidden;
  padding: 12px 16px;
}
</style>

<style scoped lang="less">
.config-layout {
  height: calc(100vh - 120px);
  display: grid;
  grid-template-columns: 320px 1fr 360px;
  gap: 12px;
}
.left-palette,
.center-canvas {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
}
.right-config {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.right-config-scroll {
  flex: 1;
  overflow: auto;
}
.right-config-actions {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
  background: #fff;
}
.center-canvas {
  position: relative;
}
.center-canvas.drag-over {
  border-color: #1677ff;
  background: #f5faff;
}
.panel-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2b2b2b;
}
.palette-group {
  margin-bottom: 14px;
}
.group-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0;
  color: #1f1f1f;
}
.group-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.tool-card {
  border: 1px solid #f0f0f0;
  background: #f7f8fa;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 4px 8px;
  color: #1d2a39;
  font-size: 14px;
  line-height: 1.2;
  cursor: pointer;
  border-radius: 2px;
  white-space: nowrap;
}
.tool-card:hover {
  border-color: #cfe3ff;
  background: #edf4ff;
}
.tool-card-icon {
  flex-shrink: 0;
  font-size: 16px;
  color: #1677ff;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}
.tool-card-label {
  flex: 1;
  min-width: 0;
  text-align: left;
}
.global-actions {
  display: flex;
  gap: 8px;
}
.global-btn {
  border-radius: 6px;
  height: 30px;
  font-size: 13px;
  padding: 0 10px;
}
.component-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.drop-tip {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 2;
  border: 1px dashed #1677ff;
  border-radius: 4px;
  color: #1677ff;
  text-align: center;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 20px;
  background: rgba(240, 247, 255, 0.9);
  pointer-events: none;
}
.component-card {
  border: none;
  border-radius: 4px;
  padding: 10px 0;
  cursor: pointer;
  display: block;
}
.component-card.full-row-item {
  grid-column: 1 / -1;
}
.component-card.active {
  background: transparent;
}
.component-card.insert-before {
  border-top: 2px solid #ff4d4f;
}
.component-card.insert-after {
  border-bottom: 2px solid #ff4d4f;
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
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.component-knowledge-hint {
  color: #1677ff;
  font-size: 14px;
  cursor: help;
  flex-shrink: 0;
}
.title-divider-line {
  height: 1px;
  background: #d9d9d9;
  width: 100%;
}
.component-type-text {
  font-size: 12px;
  color: #999;
  line-height: 28px;
}
.radio-preview-wrap {
  max-width: 360px;
}
.rich-preview-wrap {
  width: 100%;
  max-width: 680px;
  border: 1px solid #d9d9d9;
  background: #fff;
}
.file-preview-wrap {
  width: 100%;
  max-width: 680px;
}
.file-preview-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.file-preview-box {
  border: 1px dashed #7cb7ff;
  border-radius: 4px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #fbfdff;
}
.file-preview-icon {
  font-size: 24px;
  line-height: 1;
}
.file-preview-hint {
  font-size: 12px;
  color: #666;
  text-align: center;
  padding: 0 8px;
}
.divider-preview-line {
  width: 100%;
  border-top: 1px solid #d9d9d9;
  margin: 8px 0;
}
.model-select-3d-preview {
  width: 100%;
  max-width: 960px;
}
.model-select-3d-label {
  font-size: 12px;
  color: #444;
  margin-bottom: 8px;
}
.model-select-3d-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.model-select-3d-btn-checks {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px 32px;
  align-items: center;
}
.template-browse-3d-preview {
  width: 100%;
}
/* 与组件列表里「单行输入」两列网格一致 */
.template-browse-3d-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
  align-items: start;
  width: 100%;
  min-width: 0;
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
.three-d-preview-btn-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
  overflow: visible;
  white-space: nowrap;
  max-width: none;
}
.three-d-preview-btn-grid :deep(.ant-btn) {
  flex: 0 0 auto;
}
.three-d-config-btn-checks {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  justify-items: start;
  align-items: center;
  width: 100%;
}
.three-d-config-btn-checks :deep(.ant-checkbox-wrapper) {
  margin-inline: 0 !important;
}
/* 文本框宽度与 .preview-field（单行输入）一致 */
.template-browse-3d-input {
  width: 270px;
  max-width: 100%;
  flex-shrink: 0;
}
.template-browse-3d-input :deep(.ant-input) {
  border-radius: 2px;
}
.template-browse-3d-input--grey :deep(.ant-input) {
  background: #f0f0f0 !important;
}
.template-browse-3d-action-btn {
  flex-shrink: 0;
}
/* 与右侧「浏览」主按钮同色，禁用态仍保持主色（仅预览） */
.template-browse-3d-action-btn.ant-btn-primary:disabled,
.template-browse-3d-action-btn.ant-btn-primary.ant-btn-disabled {
  color: #fff !important;
  background: #1677ff !important;
  border-color: #1677ff !important;
  opacity: 0.92;
  cursor: default;
}
.fixed-table-preview {
  width: 100%;
  max-width: 900px;
}
.fixed-table-preview-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.fixed-table-preview-title-text {
  font-size: 14px;
  color: #333;
}
.fixed-table-preview-add-btn {
  flex-shrink: 0;
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
  vertical-align: middle;
}
.fixed-table-preview-grid th {
  font-weight: 600;
  background: #fafafa;
}
.fixed-table-preview-td {
  height: 44px;
}
.fixed-table-preview-td--first {
  text-align: center;
  vertical-align: middle;
}
.fixed-table-preview-grid tbody td {
  cursor: pointer;
}
.fixed-table-preview-td--selected {
  box-shadow: inset 0 0 0 2px #1677ff;
}
.table-cell-inherit-hint {
  margin: 0 0 12px;
  font-size: 12px;
  color: #888;
  line-height: 1.5;
}
.table-cell-inherit-collapse {
  margin-bottom: 12px;
}
.table-cell-inherit-readonly-input:deep(.ant-input) {
  color: rgba(0, 0, 0, 0.65);
  background: #f5f5f5;
  cursor: not-allowed;
}
.fixed-table-cell-index {
  font-size: 13px;
  color: #333;
}
.fixed-table-cell-check,
.fixed-table-cell-radio {
  width: 16px;
  height: 16px;
  margin: 0;
  vertical-align: middle;
  cursor: default;
  accent-color: #1677ff;
}
.fixed-table-btn-checks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
/* 固定表 / 行扩展表「操作列按钮」：一行两个，第三个换到第二行；左对齐（去掉 Ant 相邻项 margin-left 造成的错位） */
.fixed-table-btn-checks--col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 20px;
  align-items: center;
  justify-items: start;
  width: 100%;
}
.fixed-table-btn-checks--col :deep(.ant-checkbox-wrapper) {
  margin-inline: 0 !important;
}
.fixed-table-def-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  /* 约 1 行表头 + 5 行表体可视，超出纵向滚动（行高随内容略变，300px 为经验值） */
  max-height: 300px;
}
.fixed-table-def-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  border: 1px solid #f0f0f0;
}
.fixed-table-def-table--cols {
  min-width: 620px;
}
.fixed-table-def-th,
.fixed-table-def-td {
  border: 1px solid #f0f0f0;
  padding: 8px 10px;
  vertical-align: middle;
  text-align: left;
  background: #fff;
}
.fixed-table-def-th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fafafa;
  font-weight: 600;
  color: #333;
  /* 表体向上滚过时与表头底边分隔，避免透视叠字 */
  box-shadow: 0 1px 0 #f0f0f0;
}
.fixed-table-def-th--narrow {
  width: 72px;
  white-space: nowrap;
}
.fixed-table-def-th--col-name {
  min-width: 120px;
  width: 140px;
  white-space: nowrap;
}
.fixed-table-def-col-name-input {
  width: 100%;
  max-width: 128px;
}
.fixed-table-def-th--dtype {
  width: 120px;
}
.fixed-table-def-th--width {
  width: 112px;
  white-space: nowrap;
}
.fixed-table-def-col-width-input {
  width: 100%;
  max-width: 104px;
}
.fixed-table-def-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
/* 行定义 / 列定义：输入框固定较短宽度，浏览与输入同一行 */
.fixed-table-def-cell--browse {
  flex-wrap: nowrap;
}
.fixed-table-def-cell--browse :deep(.browse-adjoined-input) {
  flex: 0 0 auto;
  width: 120px;
  max-width: 100%;
}
.fixed-table-def-cell--browse .fixed-table-def-browse-btn {
  flex-shrink: 0;
}
.fixed-table-def-select {
  width: 100%;
  min-width: 100px;
}
.fixed-table-def-placeholder {
  color: #bfbfbf;
}
.table-size-modal-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.fixed-table-col-def-collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  gap: 8px;
}
.fixed-table-col-def-config-btn {
  padding: 0 4px;
  height: auto;
  line-height: 1.2;
}
.fixed-table-col-def-view-hint {
  margin: 0 0 8px;
  font-size: 12px;
  color: #8c8c8c;
}
.fixed-table-def-td--readonly-text {
  max-width: 220px;
  word-break: break-all;
}
.fixed-table-def-scroll--readonly-summary {
  max-height: 280px;
}
.fixed-table-def-scroll--modal {
  max-height: min(560px, 70vh);
}
.fixed-table-def-table--modal-edit {
  min-width: 960px;
}
/* 列定义弹窗内：关联参数代号输入区加宽（右侧「列定义」折叠区仍为 120px） */
.fixed-table-def-table--modal-edit .fixed-table-def-cell--browse :deep(.browse-adjoined-input) {
  width: 260px;
  max-width: 100%;
}
.column-def-modal-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.data-view-preview {
  width: 100%;
  max-width: 900px;
}
.data-view-preview-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.data-view-preview-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 8px;
}
.data-view-preview-input {
  flex: 0 1 280px;
  max-width: 320px;
  min-width: 160px;
}
.data-view-preview-input :deep(.ant-input) {
  height: 32px;
}
.data-view-assemble-btn {
  flex-shrink: 0;
  height: 32px;
  min-height: 32px;
  padding: 0 12px !important;
  font-size: 13px;
  font-weight: 500;
  line-height: 30px !important;
  border-radius: 4px !important;
  background: #2f74ff !important;
  border-color: #2f74ff !important;
}
.data-view-assemble-btn:hover:not(:disabled),
.data-view-assemble-btn:focus:not(:disabled) {
  background: #2563eb !important;
  border-color: #2563eb !important;
}
.data-view-assemble-btn:disabled,
.data-view-assemble-btn.ant-btn-disabled {
  color: #fff !important;
  background: #2f74ff !important;
  border-color: #2f74ff !important;
  opacity: 0.92;
  cursor: default;
}
.browse-adjoined-input :deep(.ant-input) {
  background: #f0f0f0 !important;
}
.divider-empty-panel {
  min-height: 360px;
}
.radio-preview-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.radio-preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
}
.radio-preview-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
}
.preview-field {
  max-width: 270px;
  width: 100%;
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
.text-config-collapse {
  margin-bottom: 8px;
}
.text-config-collapse :deep(.ant-collapse-item) {
  border: 1px solid #f0f0f0;
  margin-bottom: 8px;
}
.text-config-collapse :deep(.ant-collapse-header) {
  padding: 8px 10px !important;
  font-size: 13px;
  font-weight: 600;
  background: #fafafa;
}
.text-config-collapse :deep(.ant-collapse-content-box) {
  padding: 10px !important;
}
.row-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 6px;
}
.align-top {
  align-items: flex-start;
}
.row-label {
  width: auto;
  flex-shrink: 0;
  font-size: 12px;
  color: #333;
}
.row-control {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-width: 0;
}
.row-control :deep(.ant-select) {
  flex: 1;
  width: auto;
}
.row-control :deep(.ant-input) {
  flex: 1;
  width: auto;
}
.row-control :deep(.ant-input-textarea) {
  flex: 1;
  width: auto;
}
.row-control :deep(.ant-picker) {
  flex: 1;
  width: auto;
}
.row-control :deep(.browse-adjoined-input) {
  flex: 1;
  width: auto;
}
.row-control :deep(.ant-btn) {
  flex-shrink: 0;
}
.row-control-full {
  width: 100%;
  flex-wrap: wrap;
  align-items: flex-start;
}
.constraint-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}
.sequence-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}
.icon-btn {
  min-width: 18px;
  padding: 0 2px;
}
.icon-only-btn {
  min-width: 22px;
  padding: 0 4px !important;
  font-size: 24px;
  line-height: 1;
}
.add-icon-btn {
  color: #1677ff !important;
}
.delete-icon-btn {
  color: #ff4d4f !important;
}
.single-upload-note {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
.range-definition-values {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.range-definition-values :deep(.ant-input) {
  width: 100%;
}
.library-category-tree-wrap {
  height: 420px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 12px;
}
.footer-actions {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
