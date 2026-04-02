<script setup lang="ts">
import type { Component } from 'vue';
import { computed, reactive, ref, watch } from 'vue';
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
  MinusOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';

const props = defineProps({
  modalVisible: { type: Boolean, default: false },
  record: { type: Object, default: () => ({}) },
  saveLoading: { type: Boolean, default: false },
});

const emit = defineEmits<{ close: []; save: [payload: any] }>();
const visible = computed({ get: () => props.modalVisible, set: value => !value && emit('close') });

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
const fixedTablePanelKeys = ref<string[]>(['info', 'model', 'buttons']);
const templateBrowse3dPanelKeys = ref<string[]>(['tpl', 'model', 'buttons']);
const modelSelect3dPanelKeys = ref<string[]>(['model', 'buttons']);
const fixedTemplate3dPanelKeys = ref<string[]>(['tpl', 'model', 'buttons']);
const draggingTableSubtype = ref('');
const draggingThreeDSubtype = ref('');
const tableSizeModalVisible = ref(false);
const pendingInsertIndex = ref<number | null>(null);
const tableSizeDraft = reactive({ bodyRows: 4, cols: 3 });

function createDefaultComponent(componentType: string) {
  const customProps = componentType === 'DATA_VIEW' ? { inputPlaceholder: '请输入设计参数1', assembleButtonText: '装配', libraryCategory: '' } : {};
  return {
    id: null,
    parentId: 0,
    componentType,
    paramCode: '',
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
function createTableComponent(tableSubtype: 'FIXED' | 'ROW_EXPAND', bodyRows: number, colCount: number) {
  const item = createDefaultComponent('TABLE');
  item.paramName = '表格标题';
  item.customProps = {
    ...(item.customProps || {}),
    tableSubtype,
    tableTitle: '表格标题',
    tableBodyRows: Math.max(1, bodyRows),
    tableColCount: Math.max(1, colCount),
    firstColumnType: 'INDEX',
    btnApplyPartNo: true,
    btnOpenModel: false,
    btnAssembleModel: false,
  };
  return item;
}
function createThreeDViewComponent(threeDSubtype: string) {
  const item = createDefaultComponent('3D_VIEW');
  if (!item.customProps) item.customProps = {};
  item.customProps.threeDSubtype = threeDSubtype;
  if (threeDSubtype === 'TEMPLATE_BROWSE') {
    item.customProps.templateName = '';
    item.customProps.modelName = '';
    item.customProps.relatedTemplateLib = '';
    item.customProps.btnApplyPartNo = true;
    item.customProps.btnOpenModel = false;
    item.customProps.btnAssembleModel = false;
  }
  if (threeDSubtype === 'MODEL_SELECT') {
    item.customProps.modelSelectName = '';
    item.customProps.relatedModelLib = '';
    item.customProps.btnOpenModel = false;
    item.customProps.btnAssembleModel = true;
  }
  if (threeDSubtype === 'FIXED_TEMPLATE') {
    item.customProps.templateName = '';
    item.customProps.modelName = '';
    item.customProps.relatedTemplateLib = '';
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
  if (type === 'TABLE' && tableSubtype === 'FIXED') {
    pendingInsertIndex.value = insertIndex == null ? null : insertIndex;
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
  const newItem = createTableComponent('FIXED', Math.floor(br), Math.floor(c));
  const idx = pendingInsertIndex.value == null ? componentList.value.length : pendingInsertIndex.value;
  insertComponentItem(newItem, idx);
  tableSizeModalVisible.value = false;
  pendingInsertIndex.value = null;
  draggingType.value = '';
  draggingTableSubtype.value = '';
}
function cancelTableSize() {
  tableSizeModalVisible.value = false;
  pendingInsertIndex.value = null;
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
}
function addComponent(componentType: string, insertIndex?: number) {
  if (!canAddComponent(componentType)) return false;
  const newItem = createDefaultComponent(componentType);
  return insertComponentItem(newItem, insertIndex ?? null);
}
function removeSelectedComponent() {
  if (selectedIndex.value < 0) return;
  componentList.value.splice(selectedIndex.value, 1);
  selectedIndex.value = componentList.value.length ? Math.max(0, selectedIndex.value - 1) : -1;
}
function buildPayload() {
  const list = componentList.value.map((item, index) => ({ ...item, sortNo: index + 1 }));
  return {
    formId: formState.value.formId,
    formCode: formState.value.formCode,
    activityPageId: formState.value.activityPageId,
    operationType: formState.value.operationType,
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
function isFullRowComponent(type: string) {
  return ['TEXTAREA', 'TITLE', 'RICH_TEXT', 'FILE', 'DIVIDER', 'RADIO', 'DATA_VIEW', 'TABLE', '3D_VIEW'].includes(type);
}
function tableDimensionRange(count: number) {
  const n = Math.max(0, Math.min(100, Number(count) || 0));
  return Array.from({ length: n }, (_, i) => i + 1);
}
/** 固定表格预览表头：首列在序号模式下为「序号」，复选/单选下留空；其余列为「列名1」… */
function getFixedTableHeaderLabel(item: any, colIndex: number) {
  const firstType = item?.customProps?.firstColumnType || 'INDEX';
  if (colIndex === 1) {
    if (firstType === 'INDEX') return '序号';
    return '';
  }
  return `列名${colIndex - 1}`;
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
  if (!component.customProps.allowedFormats) component.customProps.allowedFormats = 'zip,jpg,gif,prt,asm';
  if (!component.customProps.maxSize) component.customProps.maxSize = '20M';
  if (!component.knowledgeContent) component.knowledgeContent = '';
  if (!component.knowledgeId) component.knowledgeId = '';
}
function ensureDataViewDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.inputPlaceholder === undefined) component.customProps.inputPlaceholder = '请输入设计参数1';
  if (component.customProps.assembleButtonText === undefined) component.customProps.assembleButtonText = '装配';
  if (component.customProps.libraryCategory == null) component.customProps.libraryCategory = '';
  if (!component.knowledgeContent) component.knowledgeContent = '';
  if (!component.knowledgeId) component.knowledgeId = '';
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
  if (p.btnApplyPartNo == null) p.btnApplyPartNo = true;
  if (p.btnOpenModel == null) p.btnOpenModel = false;
  if (p.btnAssembleModel == null) p.btnAssembleModel = false;
}
function ensureTemplateBrowse3dDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.threeDSubtype !== 'TEMPLATE_BROWSE') return;
  const p = component.customProps;
  if (p.templateName == null) p.templateName = '';
  if (p.modelName == null) p.modelName = '';
  if (p.relatedTemplateLib == null) p.relatedTemplateLib = '';
  if (p.btnApplyPartNo == null) p.btnApplyPartNo = true;
  if (p.btnOpenModel == null) p.btnOpenModel = false;
  if (p.btnAssembleModel == null) p.btnAssembleModel = false;
}
function ensureModelSelect3dDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.threeDSubtype !== 'MODEL_SELECT') return;
  const p = component.customProps;
  if (p.modelSelectName == null) p.modelSelectName = '';
  if (p.relatedModelLib == null) p.relatedModelLib = '';
  if (p.btnOpenModel == null) p.btnOpenModel = false;
  if (p.btnAssembleModel == null) p.btnAssembleModel = true;
}
function ensureFixedTemplate3dDefaults(component: any) {
  if (!component?.customProps) component.customProps = {};
  if (component.customProps.threeDSubtype !== 'FIXED_TEMPLATE') return;
  const p = component.customProps;
  if (p.templateName == null) p.templateName = '';
  if (p.modelName == null) p.modelName = '';
  if (p.relatedTemplateLib == null) p.relatedTemplateLib = '';
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
    }
    if (type === 'TABLE' && ['FIXED', 'ROW_EXPAND'].includes(selectedComponent.value?.customProps?.tableSubtype)) {
      fixedTablePanelKeys.value = ['info', 'model', 'buttons'];
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
);
watch(
  () => props.modalVisible,
  val => {
    if (!val) return;
    formState.value.activityPageId = props.record?.id ?? null;
    formState.value.formId = props.record?.formId ?? null;
    formState.value.formCode = props.record?.formCode ?? null;
    formState.value.operationType = props.record?.formId ? 'update' : 'insert';
    componentList.value = [
      ...parseList(props.record?.basicComponentList),
      ...parseList(props.record?.threeDComponentList),
      ...parseList(props.record?.uploadComponentList),
      ...parseList(props.record?.tableComponentList),
    ];
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
              <a-input
                v-else-if="item.componentType === 'INPUT'"
                :value="getPreviewValue(item)"
                :placeholder="item.customProps?.placeholder || '请输入'"
                disabled
                class="preview-field" />
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
                  <span>数据浏览</span>
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
                    {{ item.customProps?.assembleButtonText || '装配' }}
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
                <div class="file-preview-box">
                  <div class="file-preview-icon">📷</div>
                  <div class="file-preview-hint">图片格式为jpg, jpeg, png, 且图片最大不超过2M</div>
                </div>
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
                    <div class="template-browse-3d-label">模板名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.templateName" placeholder="请输入" disabled class="template-browse-3d-input template-browse-3d-input--grey" />
                      <a-button type="primary" size="small" class="template-browse-3d-action-btn" disabled>浏览</a-button>
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">模型名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.modelName" placeholder="请输入" disabled class="template-browse-3d-input" />
                      <a-button type="primary" size="small" class="template-browse-3d-action-btn" disabled>生成模型</a-button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="isFixedTemplate3DItem(item)" class="template-browse-3d-preview">
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">模板名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.templateName" placeholder="请输入" disabled class="template-browse-3d-input template-browse-3d-input--grey" />
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">模型名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.modelName" placeholder="请输入" disabled class="template-browse-3d-input" />
                      <a-button type="primary" size="small" class="template-browse-3d-action-btn" disabled>生成模型</a-button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="isModelSelect3DItem(item)" class="model-select-3d-preview">
                <div class="model-select-3d-label">模型名称：</div>
                <div class="model-select-3d-controls">
                  <a-input :value="item.customProps?.modelSelectName" placeholder="请输入" disabled class="template-browse-3d-input template-browse-3d-input--grey" />
                  <a-button type="primary" size="small" class="template-browse-3d-action-btn" disabled>浏览</a-button>
                  <a-button type="primary" size="small" class="template-browse-3d-action-btn" disabled>装配模型</a-button>
                </div>
              </div>
              <div v-else-if="isWorkspaceTableItem(item)" class="fixed-table-preview">
                <div v-if="(item.customProps?.tableTitle || '').trim() !== '' || item.customProps?.tableSubtype === 'ROW_EXPAND'" class="fixed-table-preview-title-row">
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
                      <th v-for="c in tableDimensionRange(item.customProps?.tableColCount || 1)" :key="`h-${c}`">
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
                        :class="{ 'fixed-table-preview-td--first': c === 1 }">
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
                      <a-button type="primary" size="small">浏览</a-button>
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
                  <div class="row-field">
                    <div class="row-label">知识区知识：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.knowledgeId" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
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

                <a-collapse-panel v-if="selectedComponent.componentType === 'INPUT'" key="formula" header="公式定义">
                  <div class="row-field">
                    <div class="row-label">公式编辑器：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.validateRule.formula.expression" placeholder="请输入" /></div>
                    <a-button type="primary" size="small">定义</a-button>
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
                      <a-button type="primary" size="small">浏览</a-button>
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
                  <div class="row-field">
                    <div class="row-label">知识区知识：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.knowledgeId" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
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
                      <a-button type="primary" size="small">浏览</a-button>
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
                  <div class="row-field">
                    <div class="row-label">知识区知识：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.knowledgeId" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
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

                  <template v-if="selectedComponent.ioType === 'OUTPUT'">
                    <div class="row-field">
                      <div class="row-label">公式编辑器：</div>
                      <div class="row-control">
                        <a-input v-model:value="selectedComponent.validateRule.formula.expression" placeholder="请输入" />
                        <a-button type="primary" size="small">定义</a-button>
                      </div>
                    </div>
                    <div class="row-field">
                      <div class="row-label">调用JS：</div>
                      <div class="row-control">
                        <a-input v-model:value="selectedComponent.validateRule.formula.jsMethodName" placeholder="请输入JS方法名" />
                      </div>
                    </div>
                  </template>
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
                      <a-button type="primary" size="small">浏览</a-button>
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
                  <div class="row-field">
                    <div class="row-label">知识区知识：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.knowledgeId" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
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
                      <a-button type="primary" size="small">浏览</a-button>
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
                  <div class="row-field">
                    <div class="row-label">知识区知识：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.knowledgeId" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
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
                      <a-button type="primary" size="small">浏览</a-button>
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
                        <a-select-option value="MODEL_LIB">模型库</a-select-option>
                        <a-select-option value="PLATFORM_LIB">平台库</a-select-option>
                        <a-select-option value="STD_LIB">标准件库</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">基础资源库分类：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.customProps.libraryCategory" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
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
                  <div class="row-field">
                    <div class="row-label">知识区知识：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.knowledgeId" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
              <a-form-item label="输入框占位"><a-input v-model:value="selectedComponent.customProps.inputPlaceholder" placeholder="请输入" /></a-form-item>
              <a-form-item label="装配按钮文案"><a-input v-model:value="selectedComponent.customProps.assembleButtonText" placeholder="装配" /></a-form-item>
            </template>
            <template v-else-if="isFileComponent">
              <a-collapse v-model:activeKey="filePanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="basic" header="基础信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
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
                  <div class="row-field">
                    <div class="row-label">知识区知识：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.knowledgeId" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
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
              <a-collapse v-model:activeKey="fixedTablePanelKeys" :bordered="false" class="text-config-collapse">
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
                    <div class="row-label">首列形式：</div>
                    <div class="row-control">
                      <a-select v-model:value="selectedComponent.customProps.firstColumnType">
                        <a-select-option value="INDEX">序号</a-select-option>
                        <a-select-option value="CHECKBOX">复选框</a-select-option>
                        <a-select-option value="RADIO">单选框</a-select-option>
                      </a-select>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="model" header="模型信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="buttons" header="按钮定义">
                  <div class="fixed-table-btn-checks">
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnApplyPartNo">申请件号</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnOpenModel">打开模型</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnAssembleModel">装配模型</a-checkbox>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else-if="isFixedTemplate3DComponent">
              <a-collapse v-model:activeKey="fixedTemplate3dPanelKeys" :bordered="false" class="text-config-collapse">
                <a-collapse-panel key="tpl" header="模板信息">
                  <div class="row-field">
                    <div class="row-label">模板名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.templateName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">关联模版库：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.relatedTemplateLib" placeholder="请输入模版编号" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">固定模版是否显示：</div>
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
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="buttons" header="按钮定义">
                  <div class="fixed-table-btn-checks">
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
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">模型名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.modelSelectName" placeholder="请输入" class="browse-adjoined-input" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">关联模型库：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.customProps.relatedModelLib" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="buttons" header="按钮定义">
                  <div class="model-select-3d-btn-checks">
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
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.templateName" placeholder="请输入" /></div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">关联模版库：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.customProps.relatedTemplateLib" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">模型名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.customProps.modelName" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="model" header="模型信息">
                  <div class="row-field">
                    <div class="row-label">参数代号：</div>
                    <div class="row-control">
                      <a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" class="browse-adjoined-input" />
                      <a-button type="primary" size="small">浏览</a-button>
                    </div>
                  </div>
                  <div class="row-field">
                    <div class="row-label">参数名称：</div>
                    <div class="row-control"><a-input v-model:value="selectedComponent.paramName" placeholder="请输入" /></div>
                  </div>
                </a-collapse-panel>
                <a-collapse-panel key="buttons" header="按钮定义">
                  <div class="fixed-table-btn-checks">
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnApplyPartNo">申请件号</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnOpenModel">打开模型</a-checkbox>
                    <a-checkbox v-model:checked="selectedComponent.customProps.btnAssembleModel">装配模型</a-checkbox>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else>
              <a-form-item label="参数代号"><a-input v-model:value="selectedComponent.paramCode" placeholder="请输入" /></a-form-item>
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

  <a-modal v-model:visible="tableSizeModalVisible" title="固定表格" :mask-closable="false" :width="420" :footer="null" :z-index="1100">
    <a-form layout="vertical" class="table-size-form">
      <a-form-item label="行数（表体数据行）" required>
        <a-input-number v-model:value="tableSizeDraft.bodyRows" :min="1" :max="100" style="width: 100%" placeholder="请输入行数" />
      </a-form-item>
      <a-form-item label="列数" required>
        <a-input-number v-model:value="tableSizeDraft.cols" :min="1" :max="50" style="width: 100%" placeholder="请输入列数" />
      </a-form-item>
    </a-form>
    <div class="table-size-modal-actions">
      <a-button @click="cancelTableSize">取消</a-button>
      <a-button type="primary" @click="confirmTableSize">确定</a-button>
    </div>
  </a-modal>
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
  flex-wrap: wrap;
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
.table-size-modal-actions {
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
.footer-actions {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
