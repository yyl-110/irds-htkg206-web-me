<script setup lang="ts">
import { computed, ref, watch, type Directive } from 'vue';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import {
  lookupWbsParamInMap,
  normalizeWbsParamValue,
  parseSavedParamValueList,
  parseWbsParamRecord,
  resolvePreviewParamBaseValue,
  shouldShowWbsCrossTaskParamSyncHint,
  isWbsInputIoType,
  isWbsOutputIoType,
} from '@/composables/designWorkspace/useWbsProjectParamSync';
import ModuleLibraryPickerModal from '../../../activityPage/components/module-library-picker-modal.vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';
import { useUserStore } from '@/store/modules/user';

const props = defineProps<{
  componentsJson?: Record<string, any> | null;
  savedParamValues?: any[] | null;
  nodeDetailData?: Record<string, any> | null;
  taskId?: string | number | null;
  activityId?: string | number | null;
  projectId?: string | number | null;
  wbsCollabMode?: boolean;
  projectParamMap?: Record<string, string> | null;
  otherTasksParamMap?: Record<string, string> | null;
}>();
const emit = defineEmits<{
  (e: 'param-title-click', payload: { paramNum: string; paramName: string }): void;
  (e: 'content-mutated'): void;
}>();

const calcCheckPreviewTypes = new Set([
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'AUTO_COMPLETE',
  'TITLE',
  'DIVIDER',
  'DATA_VIEW',
  'CALC_BUTTON',
  'OUTPUT_IMAGE',
]);
const calcIoParamComponentTypes = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'DATA_VIEW']);
const userStore = useUserStore();

/** 文本域纵向拖拽时同步 grid 卡片高度，避免遮挡下方组件 */
const vTextareaGridSync: Directive<HTMLElement> = {
  mounted(el) {
    const textarea = el.querySelector('textarea');
    const card = el.closest('.component-card') as HTMLElement | null;
    if (!textarea || !card) return;

    const syncCardHeight = () => {
      const cardTop = card.getBoundingClientRect().top;
      const textareaBottom = textarea.getBoundingClientRect().bottom;
      card.style.minHeight = `${Math.ceil(textareaBottom - cardTop + 2)}px`;
    };

    const observer = new ResizeObserver(syncCardHeight);
    observer.observe(textarea);
    syncCardHeight();
    (el as HTMLElement & { __textareaGridSyncCleanup?: () => void }).__textareaGridSyncCleanup = () => observer.disconnect();
  },
  unmounted(el) {
    (el as HTMLElement & { __textareaGridSyncCleanup?: () => void }).__textareaGridSyncCleanup?.();
  },
};

const modulePickerVisible = ref(false);
const modulePickerCategoryId = ref('');
const modulePickerMenuId = ref('');
const modulePickerTargetFieldKey = ref('');
const previewFieldValueMap = ref<Record<string, string>>({});
const calcSubmitting = ref(false);
const reportDownloading = ref(false);
const calculatedReportValue = ref<Array<{ paramCode: string; paramValue: string }>>([]);
const impactEvalModalVisible = ref(false);
const impactSelectedParamCode = ref('');
const impactParamSearchText = ref('');
const impactAnalyzing = ref(false);
const impactResultRows = ref<
  Array<{ key: string; activityName: string; taskCreatorName: string; taskName: string; taskStatus: string }>
>([]);
const previewCanvasRef = ref<HTMLElement | null>(null);

const showReportOutputButton = computed(() =>
  previewList.value.some((c: any) => String(c?.componentType) === 'CALC_BUTTON'),
);

const canClickReportOutput = computed(() => showReportOutputButton.value && calculatedReportValue.value.length > 0);

function parseSavedValueMap(list: any[] | null | undefined) {
  return parseSavedParamValueList(list);
}

const savedValueMap = computed(() => parseSavedValueMap(props.savedParamValues));
const projectParamValueMap = computed(() => parseWbsParamRecord(props.projectParamMap ?? undefined));
const otherTasksParamValueMap = computed(() => parseWbsParamRecord(props.otherTasksParamMap ?? undefined));

function getProjectParamValueByCode(paramCodeRaw: string): string {
  return lookupWbsParamInMap(projectParamValueMap.value, paramCodeRaw);
}

function getOtherTasksParamValueByCode(paramCodeRaw: string): string {
  return lookupWbsParamInMap(otherTasksParamValueMap.value, paramCodeRaw);
}

function getCalcPreviewParamValue(item: any, index: number): string {
  const key = getPreviewItemKey(item, index);
  return normalizeWbsParamValue(previewFieldValueMap.value[key] ?? item?.paramValue ?? '');
}

function canWbsProjectParamSyncItem(item: any): boolean {
  if (!props.wbsCollabMode) return false;
  if (!isWbsInputIoType(item?.ioType) && !isWbsOutputIoType(item?.ioType)) return false;
  const code = String(item?.paramCode ?? item?.paramKey ?? '').trim();
  return !!code;
}

function getTaskSavedParamValueByCode(paramCodeRaw: string): string {
  return lookupWbsParamInMap(savedValueMap.value, paramCodeRaw);
}

function showWbsProjectParamSyncHint(item: any, index: number): boolean {
  if (!canWbsProjectParamSyncItem(item)) return false;
  const code = String(item?.paramCode ?? item?.paramKey ?? '').trim();
  const projectVal = getOtherTasksParamValueByCode(code);
  const taskVal = getTaskSavedParamValueByCode(code);
  const currentVal = getCalcPreviewParamValue(item, index);
  return shouldShowWbsCrossTaskParamSyncHint({
    taskSavedValue: taskVal,
    projectValueFromOtherTasks: projectVal,
    currentEditValue: currentVal,
  });
}

function wbsProjectParamSyncHint(item: any, index: number): string {
  const code = String(item?.paramCode ?? item?.paramKey ?? '').trim();
  const projectVal = getOtherTasksParamValueByCode(code);
  const taskVal = getTaskSavedParamValueByCode(code);
  const kind = isWbsOutputIoType(item?.ioType) ? '设计输出' : '设计输入';
  return `其它协同任务已更新项目参数为「${projectVal}」，本任务${kind}已保存值为「${taskVal}」，点击接收最新项目值`;
}

function acceptWbsProjectParamValue(item: any, index: number) {
  if (!canWbsProjectParamSyncItem(item)) return;
  const code = String(item?.paramCode ?? item?.paramKey ?? '').trim();
  const projectVal = getOtherTasksParamValueByCode(code);
  const key = getPreviewItemKey(item, index);
  previewFieldValueMap.value = { ...previewFieldValueMap.value, [key]: projectVal };
  message.success(`已接收其它任务更新的项目参数值：${projectVal || '空'}`);
  emit('content-mutated');
}

const previewList = computed(() => {
  console.log(props.componentsJson, 'props.componentsJson');
  const cfg = props.componentsJson || {};
  const merged = [
    ...(Array.isArray(cfg.basicComponentList) ? cfg.basicComponentList : []),
    ...(Array.isArray(cfg.threeDComponentList) ? cfg.threeDComponentList : []),
    ...(Array.isArray(cfg.uploadComponentList) ? cfg.uploadComponentList : []),
    ...(Array.isArray(cfg.tableComponentList) ? cfg.tableComponentList : []),
  ];
  return merged
    .filter((item: any) => calcCheckPreviewTypes.has(String(item?.componentType || '')))
    .slice()
    .sort((a: any, b: any) => (Number(a?.sortNo) || 0) - (Number(b?.sortNo) || 0))
    .map((item: any) => ({ ...item, customProps: item?.customProps || {} }));
});

function getPreviewItemKey(item: any, index: number) {
  return String(item?.id ?? `${item?.componentType}-${index}`);
}
function getSelectOptions(item: any) {
  const values = item?.customProps?.sequenceValues || [];
  if (!Array.isArray(values)) return [];
  return values.map((val: string) => (val || '').trim()).filter((val: string) => val !== '');
}
function isOutputIoType(item: any) {
  return String(item?.ioType ?? 'INPUT').toUpperCase() === 'OUTPUT';
}
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
function isFullRowComponent(type: string) {
  return ['TEXTAREA', 'TITLE', 'DIVIDER', 'DATA_VIEW', 'CALC_BUTTON', 'OUTPUT_IMAGE'].includes(type);
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
  { title: '负责人', dataIndex: 'taskCreatorName', key: 'taskCreatorName', width: 120, ellipsis: true },
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 180, ellipsis: true },
  { title: '任务状态', dataIndex: 'taskStatus', key: 'taskStatus', width: 100, ellipsis: true },
];

function formatWbsTaskStatus(raw?: string): string {
  const map: Record<string, string> = {
    NOT_STARTED: '未开始',
    DESIGNING: '设计中',
    COMPLETED: '已完成',
    CHANGING: '变更中',
  };
  const key = String(raw ?? '').trim().toUpperCase();
  return map[key] || String(raw ?? '').trim() || '-';
}

function filterImpactParamOption(input: string, option: { label?: string; value?: string }) {
  const q = String(input ?? '').trim().toLowerCase();
  if (!q) return true;
  const label = String(option?.label ?? '').toLowerCase();
  const value = String(option?.value ?? '').toLowerCase();
  return label.includes(q) || value.includes(q);
}

function resolveImpactParamCode(rawInput?: string): string {
  const input = String(rawInput ?? '').trim();
  if (!input) return '';
  const options = impactParamOptions.value;
  const exact = options.find(o => o.value === input);
  if (exact) return exact.value;
  const lower = input.toLowerCase();
  const byCode = options.find(o => o.value.toLowerCase().includes(lower));
  if (byCode) return byCode.value;
  const byLabel = options.find(o => o.label.toLowerCase().includes(lower));
  return byLabel?.value ?? input;
}

function onImpactParamSearch(value: string) {
  impactParamSearchText.value = value;
}

function mapStandaloneImpactRows(raw: any, paramCode: string) {
  const taskList = Array.isArray(raw?.impactedActivities)
    ? raw.impactedActivities
    : Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.list)
        ? raw.list
        : [];
  return taskList.map((row: any, idx: number) => ({
    key: String(row?.bpmnElementId ?? row?.activityId ?? `${paramCode}-${idx}`),
    activityName: String(row?.activityName ?? row?.nodeName ?? '-'),
    taskCreatorName: String(raw?.taskCreatorName ?? '-'),
    taskName: String(raw?.taskName ?? '-'),
    taskStatus: String(row?.nodeStatus ?? '-'),
  }));
}

function mapWbsImpactRows(raw: any, paramCode: string) {
  const taskList = Array.isArray(raw?.impactedItems) ? raw.impactedItems : [];
  return taskList.map((row: any, idx: number) => ({
    key: String(row?.bindTaskId ?? row?.activityId ?? `${paramCode}-${idx}`),
    activityName: String(row?.activityName ?? row?.nodeName ?? '-'),
    taskCreatorName: String(row?.taskCreatorName ?? '-'),
    taskName: String(row?.taskName ?? '-'),
    taskStatus: formatWbsTaskStatus(row?.taskStatus),
  }));
}
function onImpactEvalEntryClick() {
  impactEvalModalVisible.value = true;
  impactResultRows.value = [];
  impactSelectedParamCode.value = '';
  impactParamSearchText.value = '';
}
function onImpactEvalModalClose() {
  impactEvalModalVisible.value = false;
}
async function onImpactAnalyzeClick() {
  const selected = resolveImpactParamCode(impactSelectedParamCode.value || impactParamSearchText.value);
  if (!selected) {
    message.warning('请先选择或输入参数');
    return;
  }
  impactSelectedParamCode.value = selected;
  const taskId = String(props.taskId ?? '').trim();
  const activityId = String(props.activityId ?? props.nodeDetailData?.activityPageId ?? '').trim();
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
    if (props.wbsCollabMode) {
      const projectId = String(props.projectId ?? '').trim();
      if (!projectId) {
        message.warning('未获取到项目ID');
        return;
      }
      const res = await AdminApiProjectTemp.wbsTaskParamEvaluateImpact({
        projectId,
        sourceTaskId: taskId,
        paramCode: selected,
        currentActivityId: activityId,
      });
      impactResultRows.value = mapWbsImpactRows(res?.data?.data, selected);
    } else {
      const res = await AdminApiSystemProcessTask.evaluateImpact({
        activityId,
        taskId,
        paramCode: selected,
      });
      impactResultRows.value = mapStandaloneImpactRows(res?.data?.data, selected);
    }
  } finally {
    impactAnalyzing.value = false;
  }
}

function showModuleInfo(item: any, index: number) {
  const categoryId = String(item?.customProps?.libraryCategoryId ?? '').trim();
  const menuId = String(item?.libraryType ?? '').trim();
  if (!categoryId || !menuId) {
    message.warning('请先在配置中选择基础资源库类型和分类节点');
    return;
  }
  modulePickerCategoryId.value = categoryId;
  modulePickerMenuId.value = menuId;
  modulePickerTargetFieldKey.value = getPreviewItemKey(item, index);
  modulePickerVisible.value = true;
}

function onModulePickerConfirm(payload: { row: any; columns: any[] }) {
  if (!modulePickerTargetFieldKey.value) return;
  const cols = Array.isArray(payload?.columns) ? payload.columns : [];
  const fallbackValue = String(payload?.row?.[cols?.[0]?.dataIndex] ?? '');
  previewFieldValueMap.value = {
    ...previewFieldValueMap.value,
    [modulePickerTargetFieldKey.value]: fallbackValue,
  };
}

function rowParamFromPreviewItem(item: any, index: number) {
  const key = getPreviewItemKey(item, index);
  return {
    paramCode: String(item?.paramCode ?? ''),
    paramValue: String(previewFieldValueMap.value[key] ?? item?.paramValue ?? ''),
    sheetNumber: String(item?.customProps?.sheetNumber ?? ''),
    cellNumber: String(item?.customProps?.cellNumber ?? ''),
  };
}

function pickNodeFileId(detail: Record<string, any>, directKey: string, infoKey: string) {
  return String(detail?.[directKey] ?? detail?.[infoKey]?.fileId ?? detail?.[infoKey]?.id ?? '').trim();
}

/** 页面仍存在「图片占位符」时传 ifImg=1，否则传空 */
function resolveIfImgParam(): string {
  const root = previewCanvasRef.value;
  if (root) {
    const placeholders = root.querySelectorAll('.output-image-placeholder');
    for (let i = 0; i < placeholders.length; i++) {
      const text = String(placeholders[i].textContent ?? '').trim();
      if (text.includes('图片占位符')) return '1';
    }
    return '';
  }
  return previewList.value.some((item: any) => String(item?.componentType) === 'OUTPUT_IMAGE') ? '1' : '';
}

function buildCalcSubmitPayload() {
  const detail = props.nodeDetailData || {};
  const calculateFileId = pickNodeFileId(detail, 'calculateFileId', 'calculateFileInfo');
  const inputParam: ReturnType<typeof rowParamFromPreviewItem>[] = [];
  const exputParam: ReturnType<typeof rowParamFromPreviewItem>[] = [];
  previewList.value.forEach((item: any, index: number) => {
    if (!calcIoParamComponentTypes.has(String(item?.componentType || ''))) return;
    const row = rowParamFromPreviewItem(item, index);
    if (String(item?.ioType ?? 'INPUT').toUpperCase() === 'OUTPUT') exputParam.push(row);
    else inputParam.push(row);
  });
  return { inputParam, exputParam, calculateFileId, excelFileId: calculateFileId, ifImg: resolveIfImgParam() };
}

function applyCalculateExputToPreview(res: any) {
  const inner = res?.data?.data ?? {};
  const rows = inner?.exputParan ?? inner?.exputParam ?? inner?.exputParams;
  if (!Array.isArray(rows)) return;
  calculatedReportValue.value = rows
    .map((row: any) => ({
      paramCode: String(row?.paramCode ?? '').trim(),
      paramValue: row?.paramValue != null ? String(row.paramValue) : '',
    }))
    .filter((row: any) => row.paramCode && String(row.paramValue).trim() !== '');
  const next = { ...previewFieldValueMap.value };
  for (const row of rows) {
    const code = String(row?.paramCode ?? '').trim();
    if (!code) continue;
    const pv = row?.paramValue != null ? String(row.paramValue) : '';
    for (let i = 0; i < previewList.value.length; i++) {
      const item = previewList.value[i];
      if (!calcIoParamComponentTypes.has(String(item?.componentType || ''))) continue;
      if (String(item?.paramCode ?? '').trim() !== code) continue;
      next[getPreviewItemKey(item, i)] = pv;
      break;
    }
  }
  previewFieldValueMap.value = next;
}

function buildReportOutputPayload() {
  const d = props.nodeDetailData || {};
  const reportFileId = pickNodeFileId(d, 'reportFileId', 'reportFileInfo');
  const reportValue = previewList.value
    .map((item: any, index: number) => {
      const paramCode = String(item?.paramCode ?? '').trim();
      if (!paramCode) return null;
      const key = getPreviewItemKey(item, index);
      const paramValue = String(previewFieldValueMap.value[key] ?? item?.paramValue ?? '');
      return { paramCode, paramValue };
    })
    .filter((row: any) => row && row.paramCode);
  return { reportFileId, reportValue, ifImg: resolveIfImgParam() };
}

function getCurrentSaveParamValues() {
  const detail = props.nodeDetailData || {};
  const activityPageId = detail?.activityPageId != null ? Number(detail.activityPageId) : undefined;
  const bpmnElementId = String(detail?.bpmnElementId ?? '').trim();
  return previewList.value
    .map((item: any, index: number) => {
      const paramKey = String(item?.paramKey ?? item?.paramCode ?? '').trim();
      if (!paramKey) return null;
      const key = getPreviewItemKey(item, index);
      const paramValue = String(previewFieldValueMap.value[key] ?? item?.paramValue ?? '');
      return {
        activityPageId,
        bpmnElementId,
        paramKey,
        paramName: String(item?.paramName ?? ''),
        paramValue,
      };
    })
    .filter(Boolean);
}

async function onReportOutputClick() {
  const params: any = buildReportOutputPayload();
  if (!params.reportFileId) {
    message.warning('未找到报告模板文件');
    return;
  }
  reportDownloading.value = true;
  try {
    params.userId = userStore.getUser.id;
    const res = await AdminApiActivityPage.generateReport(params);
    const fileUrl = String(res?.data?.data?.fileUrl ?? '').trim();
    if (!fileUrl) {
      message.error('报告生成失败');
      return;
    }
    window.open(fileUrl);
  } catch {
    message.error('报告生成失败');
  } finally {
    reportDownloading.value = false;
  }
}

async function onCalcButtonPreviewClick() {
  const payload = buildCalcSubmitPayload();
  if (!payload.calculateFileId) {
    message.warning('未找到 Excel 文件 ID，请在活动信息中上传计算用 Excel');
    return;
  }
  calcSubmitting.value = true;
  calculatedReportValue.value = [];
  try {
    const res = await AdminApiActivityPage.calculateExcel(payload as any);
    const code = res?.data?.code;
    if (code === 0 || code === 200 || code === '0' || code === '200') {
      applyCalculateExputToPreview(res);
      message.success('计算成功');
    } else {
      message.error(String(res?.data?.msg || '计算失败'));
    }
  } catch {
    message.error('计算失败');
  } finally {
    calcSubmitting.value = false;
  }
}

watch(
  () => [props.componentsJson, props.savedParamValues, props.projectParamMap, props.otherTasksParamMap, props.wbsCollabMode],
  () => {
    const list = previewList.value;
    const nextMap: Record<string, string> = {};
    list.forEach((item: any, index: number) => {
      const key = getPreviewItemKey(item, index);
      const code = String(item?.paramCode ?? item?.paramKey ?? '').trim();
      nextMap[key] = resolvePreviewParamBaseValue({
        wbsCollabMode: props.wbsCollabMode,
        savedMap: savedValueMap.value,
        projectMap: projectParamValueMap.value,
        paramCode: code,
        componentDefault: item?.paramValue,
        ioType: item?.ioType,
      });
    });
    previewFieldValueMap.value = nextMap;
  },
  { immediate: true, deep: true },
);

/** 节点详情接口 `button` 文案与页内能力对齐（计算页） */
async function runToolbarAction(label: string): Promise<boolean> {
  const t = String(label ?? '').trim();
  if (t === '再生模型') {
    await onCalcButtonPreviewClick();
    return true;
  }
  if (t === '导出报告') {
    await onReportOutputClick();
    return true;
  }
  return false;
}

defineExpose({
  getCurrentSaveParamValues,
  runToolbarAction,
});
</script>

<template>
  <div ref="previewCanvasRef" class="activity-preview-canvas">
    <div class="param-impact-scope-entry-anchor">
      <a-tooltip title="参数影响分析" placement="left">
        <span class="param-impact-scope-entry" @click="onImpactEvalEntryClick">影响评估</span>
      </a-tooltip>
    </div>
    <a-modal
      v-model:visible="impactEvalModalVisible"
      title="影响评估"
      width="920px"
      :footer="null"
      @cancel="onImpactEvalModalClose">
      <div class="impact-eval-modal-content">
        <div class="impact-eval-toolbar">
          <a-select
            v-model:value="impactSelectedParamCode"
            :options="impactParamOptions"
            placeholder="请输入或选择参数"
            class="impact-eval-param-select"
            show-search
            allow-clear
            :filter-option="filterImpactParamOption"
            @search="onImpactParamSearch" />
          <a-button type="primary" :loading="impactAnalyzing" @click="onImpactAnalyzeClick">分析</a-button>
        </div>
        <a-table
          :columns="impactColumns"
          :data-source="impactResultRows"
          :pagination="false"
          :loading="impactAnalyzing"
          size="small"
          bordered
          row-key="key"
          :scroll="{ y: 300 }" />
      </div>
    </a-modal>
    <div v-if="previewList.length === 0" class="activity-preview-empty">暂无组件配置</div>
    <div v-else class="component-list">
      <div
        v-for="(item, index) in previewList"
        :key="item.id || `${item.componentType}-${index}`"
        class="component-card"
        :class="{
          'full-row-item': isFullRowComponent(item.componentType),
          'component-card--textarea': item.componentType === 'TEXTAREA',
        }">
        <div class="component-preview-wrap">
          <div
            v-if="
              item.componentType !== 'TITLE' &&
              item.componentType !== 'DIVIDER' &&
              item.componentType !== 'DATA_VIEW' &&
              item.componentType !== 'CALC_BUTTON'
            "
            class="component-title">
            <span class="component-title-text--clickable" @click="onParamTitleClick(item)">{{
              item.paramName || '未命名组件'
            }}</span>
            <a-tooltip v-if="hasKnowledgeHint(item)" :title="knowledgeHintText(item)" placement="top">
              <ExclamationCircleOutlined class="component-knowledge-hint" />
            </a-tooltip>
            <a-tooltip v-if="showWbsProjectParamSyncHint(item, index)" :title="wbsProjectParamSyncHint(item, index)" placement="top">
              <ClockCircleOutlined class="component-project-param-sync" @click.stop="acceptWbsProjectParamValue(item, index)" />
            </a-tooltip>
          </div>

          <template v-if="item.componentType === 'TITLE'">
            <div class="title-preview-text">{{ item.paramName || '标题' }}</div>
            <div v-if="item.customProps?.hasDivider" class="title-divider-line"></div>
          </template>

          <div
            v-else-if="item.componentType === 'INPUT'"
            class="preview-field-trigger"
            @click.capture="onParamTitleClick(item)">
            <a-input
              v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
              :placeholder="item.customProps?.placeholder || '请输入'"
              :disabled="isOutputIoType(item)"
              class="preview-field" />
          </div>
          <div
            v-else-if="item.componentType === 'TEXTAREA'"
            v-textarea-grid-sync
            class="preview-field-trigger"
            @click.capture="onParamTitleClick(item)">
            <a-textarea
              v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
              :rows="item.customProps?.rows || 4"
              :placeholder="item.customProps?.placeholder || '请输入'"
              :disabled="isOutputIoType(item)"
              class="preview-field" />
          </div>
          <div v-else-if="item.componentType === 'DIVIDER'" class="divider-preview-line"></div>
          <div v-else-if="item.componentType === 'DATA_VIEW'" class="data-view-preview">
            <div class="component-title">
              <span class="component-title-text--clickable" @click="onParamTitleClick(item)">{{
                item.paramName || '数据浏览'
              }}</span>
              <a-tooltip v-if="showWbsProjectParamSyncHint(item, index)" :title="wbsProjectParamSyncHint(item, index)" placement="top">
                <ClockCircleOutlined class="component-project-param-sync" @click.stop="acceptWbsProjectParamValue(item, index)" />
              </a-tooltip>
            </div>
            <div class="data-view-preview-row">
              <div class="preview-field-trigger data-view-preview-input-wrap" @click.capture="onParamTitleClick(item)">
                <a-input
                  v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
                  placeholder="请选择参数"
                  disabled
                  class="preview-field" />
              </div>
              <a-button
                type="primary"
                class="data-view-assemble-btn"
                :disabled="isOutputIoType(item)"
                @click="showModuleInfo(item, index)"
                >浏览</a-button
              >
            </div>
          </div>
          <div
            v-else-if="item.componentType === 'SELECT'"
            class="preview-field-trigger"
            @click.capture="onParamTitleClick(item)">
            <a-select
              v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
              :options="getSelectOptions(item).map(v => ({ label: v, value: v }))"
              :disabled="isOutputIoType(item)"
              placeholder="请选择"
              class="preview-field" />
          </div>
          <div
            v-else-if="item.componentType === 'AUTO_COMPLETE'"
            class="preview-field-trigger"
            @click.capture="onParamTitleClick(item)">
            <a-auto-complete
              v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
              :options="getSelectOptions(item).map(v => ({ value: v }))"
              :disabled="isOutputIoType(item)"
              placeholder="请选择或输入"
              class="preview-field" />
          </div>
          <div v-else-if="item.componentType === 'CALC_BUTTON'" class="calc-button-preview-wrap">
            <a-button
              type="primary"
              class="data-view-assemble-btn"
              :loading="calcSubmitting"
              :disabled="isOutputIoType(item)"
              @click="onCalcButtonPreviewClick">
              {{ item.customProps?.buttonText || '计算' }}
            </a-button>
            <a-button
              v-if="showReportOutputButton"
              type="primary"
              class="data-view-assemble-btn"
              :loading="reportDownloading"
              :disabled="!canClickReportOutput"
              @click="onReportOutputClick">
              输出报告
            </a-button>
          </div>
          <div v-else-if="item.componentType === 'OUTPUT_IMAGE'" class="output-image-preview">
            <div class="output-image-placeholder">图片占位符</div>
          </div>
        </div>
      </div>
    </div>
    <ModuleLibraryPickerModal
      v-model:visible="modulePickerVisible"
      :category-id="modulePickerCategoryId"
      :menu-id="modulePickerMenuId"
      :allow-select-row="true"
      @confirm="onModulePickerConfirm" />
  </div>
</template>

<style scoped lang="less">
.activity-preview-canvas {
  position: relative;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: auto;
  min-height: min-content;
  overflow: visible;
  padding: 4px 16px 20px 12px;
  box-sizing: border-box;
  --activity-preview-component-width: 300px;
  --activity-preview-wide-component-width: 650px;
  --activity-preview-table-max-width: 95%;
  --activity-preview-grid-column-gap: 120px;
  --activity-preview-grid-row-gap: 12px;
}
.param-impact-scope-entry-anchor {
  position: absolute;
  top: 4px;
  right: 86px;
  z-index: 5;
  line-height: 1;
}
.param-impact-scope-entry {
  color: #1677ff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
}
.impact-eval-modal-content {
  color: #595959;
  line-height: 1.8;
  min-height: 420px;
  :deep(.ant-table-wrapper) {
    max-width: var(--activity-preview-table-max-width);
  }
}
.fixed-table-preview {
  width: 100%;
  max-width: var(--activity-preview-table-max-width);
}
.fixed-table-preview-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  max-width: var(--activity-preview-table-max-width);
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
.component-card.full-row-item .fixed-table-preview,
.component-card.full-row-item .fixed-table-preview-scroll {
  max-width: var(--activity-preview-table-max-width);
}
.fixed-table-preview-grid th,
.fixed-table-preview-grid td {
  border: 1px solid #e8e8e8;
  padding: 10px 12px;
}
.fixed-table-preview-grid th {
  font-weight: 600;
  background: #fafafa;
  text-align: center;
}
.fixed-table-preview-grid td {
  text-align: left;
}
.fixed-table-preview-grid td.fixed-table-preview-td--index {
  text-align: center;
}
.fixed-table-preview-grid th.fixed-table-preview-th--op,
.fixed-table-preview-grid td.fixed-table-preview-td--op {
  position: sticky;
  right: 0;
  z-index: 2;
  box-shadow: inset 8px 0 8px -6px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e8e8e8;
  text-align: center;
}
.fixed-table-preview-grid th.fixed-table-preview-th--op {
  z-index: 3;
  background: #fafafa;
}
.fixed-table-preview-grid td.fixed-table-preview-td--op {
  background: #fff;
}
.fixed-table-preview-td--op .fixed-table-cell-op-btns {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  justify-content: center;
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
  grid-template-columns: repeat(2, minmax(var(--activity-preview-component-width), 1fr));
  column-gap: var(--activity-preview-grid-column-gap);
  row-gap: var(--activity-preview-grid-row-gap);
  align-content: start;
  grid-auto-rows: min-content;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
.component-card {
  position: relative;
  z-index: 0;
  isolation: isolate;
  align-self: start;
  border: none;
  border-radius: 4px;
  padding: 2px 0;
  box-sizing: border-box;
}
.component-list > .component-card:first-child {
  padding-top: 0;
}
.component-card.full-row-item {
  grid-column: 1 / -1;
  width: 100%;
  max-width: 100%;
}
.component-card.full-row-item .preview-field,
.component-card.full-row-item :deep(.ant-input),
.component-card.full-row-item :deep(.ant-input-affix-wrapper),
.component-card.full-row-item :deep(.ant-select),
.component-card.full-row-item :deep(.ant-picker) {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.component-preview-wrap {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
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
.component-project-param-sync {
  color: #fa8c16;
  font-size: 14px;
  cursor: pointer;
}
.component-project-param-sync:hover {
  color: #d46b08;
}
.preview-field {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.preview-field-trigger {
  width: var(--activity-preview-component-width);
  max-width: 100%;
  cursor: pointer;
}
.component-card.full-row-item .preview-field-trigger {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.preview-field-trigger :deep(.ant-input[disabled]),
.preview-field-trigger :deep(.ant-input-affix-wrapper-disabled),
.preview-field-trigger :deep(.ant-select-disabled),
.preview-field-trigger :deep(.ant-select-disabled .ant-select-selector) {
  pointer-events: none;
}
.title-preview-text {
  font-size: 14px;
  color: #222;
  font-weight: 700;
  margin-bottom: 6px;
  width: 100%;
}
.title-divider-line,
.divider-preview-line {
  height: 1px;
  background: #d9d9d9;
  width: 100%;
  max-width: 100%;
}
.component-card--textarea .preview-field-trigger {
  display: block;
  height: auto;
  overflow: visible;
}
.component-card--textarea :deep(.ant-input-affix-wrapper),
.component-card--textarea :deep(.ant-input-affix-wrapper-textarea-with-clear-btn) {
  display: block;
  height: auto !important;
  overflow: visible;
}
.component-card--textarea :deep(textarea.ant-input) {
  display: block;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  overflow: auto;
  max-height: min(400px, 45vh);
}
.data-view-preview-row,
.calc-button-preview-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  flex-wrap: wrap;
  width: fit-content;
  max-width: 100%;
  min-width: 0;
}
.data-view-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.preview-field-trigger.data-view-preview-input-wrap {
  flex: 0 0 auto;
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.component-card.full-row-item .preview-field-trigger.data-view-preview-input-wrap {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.data-view-assemble-btn {
  flex-shrink: 0;
  min-width: 64px;
}
.activity-preview-empty {
  color: #999;
  padding: 40px 0;
  text-align: center;
}
.output-image-preview {
  width: 100%;
  max-width: 900px;
}
.output-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background: #fafafa;
  color: #999;
  font-size: 14px;
}
</style>
