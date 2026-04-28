<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import ModuleLibraryPickerModal from '../../../activityPage/components/module-library-picker-modal.vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { useUserStore } from '@/store/modules/user';

const props = defineProps<{
  componentsJson?: Record<string, any> | null;
  savedParamValues?: any[] | null;
  nodeDetailData?: Record<string, any> | null;
  taskId?: string | number | null;
  activityId?: string | number | null;
}>();
const emit = defineEmits<{
  (e: 'param-title-click', payload: { paramNum: string; paramName: string }): void;
}>();

const calcCheckPreviewTypes = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'TITLE', 'DIVIDER', 'DATA_VIEW', 'CALC_BUTTON']);
const calcIoParamComponentTypes = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'DATA_VIEW']);
const userStore = useUserStore();

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
const impactAnalyzing = ref(false);
const impactResultRows = ref<Array<{ key: string; activityName: string; taskCreatorName: string; taskName: string; taskStatus: string }>>([]);

const showReportOutputButton = computed(() => previewList.value.some((c: any) => String(c?.componentType) === 'CALC_BUTTON'));

const canClickReportOutput = computed(() => showReportOutputButton.value && calculatedReportValue.value.length > 0);

function parseSavedValueMap(list: any[] | null | undefined) {
  const map = new Map<string, string>();
  if (!Array.isArray(list)) return map;
  list.forEach((row: any) => {
    const code = String(row?.paramCode ?? row?.code ?? '').trim();
    if (!code) return;
    map.set(code, String(row?.paramValue ?? row?.value ?? '').trim());
  });
  return map;
}

const savedValueMap = computed(() => parseSavedValueMap(props.savedParamValues));

const previewList = computed(() => {
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
  return ['TEXTAREA', 'TITLE', 'DIVIDER', 'DATA_VIEW', 'CALC_BUTTON'].includes(type);
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
  { title: '任务状态', dataIndex: 'taskStatus', key: 'taskStatus', width: 200, ellipsis: true },
];
function onImpactEvalEntryClick() {
  impactEvalModalVisible.value = true;
  impactResultRows.value = [];
}
function onImpactEvalModalClose() {
  impactEvalModalVisible.value = false;
}
async function onImpactAnalyzeClick() {
  const selected = String(impactSelectedParamCode.value || '').trim();
  if (!selected) {
    message.warning('请先选择参数');
    return;
  }
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
    const res = await AdminApiSystemProcessTask.evaluateImpact({
      activityId,
      taskId,
      paramCode: selected,
    });
    const raw = res?.data?.data;
    const taskList = Array.isArray(raw?.impactedTasks) ? raw.impactedTasks : Array.isArray(raw) ? raw : Array.isArray(raw?.list) ? raw.list : [];
    impactResultRows.value = taskList.map((row: any, idx: number) => ({
      key: String(row?.taskId ?? row?.id ?? `${selected}-${idx}`),
      activityName: String(row?.activityName ?? '-'),
      taskCreatorName: String(row?.taskCreatorName ?? '-'),
      taskName: String(row?.taskName ?? '-'),
      taskStatus: String(row?.taskStatus ?? '-'),
    }));
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
  return { inputParam, exputParam, calculateFileId, excelFileId: calculateFileId };
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
  return { reportFileId, reportValue };
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
  () => [props.componentsJson, props.savedParamValues],
  () => {
    const list = previewList.value;
    const nextMap: Record<string, string> = {};
    list.forEach((item: any, index: number) => {
      const key = getPreviewItemKey(item, index);
      const code = String(item?.paramCode ?? '').trim();
      const saved = code ? String(savedValueMap.value.get(code) ?? '') : '';
      nextMap[key] = saved || String(item?.paramValue ?? '');
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
  <div class="activity-preview-canvas">
    <a-tooltip title="参数影响分析" placement="left">
      <span class="param-impact-scope-entry" @click="onImpactEvalEntryClick">影响评估</span>
    </a-tooltip>
    <a-modal v-model:visible="impactEvalModalVisible" title="影响评估" width="920px" :footer="null" @cancel="onImpactEvalModalClose">
      <div class="impact-eval-modal-content">
        <div class="impact-eval-toolbar">
          <a-select v-model:value="impactSelectedParamCode" :options="impactParamOptions" placeholder="请选择参数" class="impact-eval-param-select" allow-clear />
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
        :class="{ 'full-row-item': isFullRowComponent(item.componentType) }">
        <div class="component-preview-wrap">
          <div
            v-if="item.componentType !== 'TITLE' && item.componentType !== 'DIVIDER' && item.componentType !== 'DATA_VIEW' && item.componentType !== 'CALC_BUTTON'"
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

          <a-input
            v-else-if="item.componentType === 'INPUT'"
            v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
            :placeholder="item.customProps?.placeholder || '请输入'"
            :disabled="isOutputIoType(item)"
            class="preview-field" />
          <a-textarea
            v-else-if="item.componentType === 'TEXTAREA'"
            v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
            :rows="item.customProps?.rows || 4"
            :placeholder="item.customProps?.placeholder || '请输入'"
            :disabled="isOutputIoType(item)"
            class="preview-field" />
          <div v-else-if="item.componentType === 'DIVIDER'" class="divider-preview-line"></div>
          <div v-else-if="item.componentType === 'DATA_VIEW'" class="data-view-preview">
            <div class="component-title">
              <span class="component-title-text--clickable" @click="onParamTitleClick(item)">{{ item.paramName || '数据浏览' }}</span>
            </div>
            <div class="data-view-preview-row">
              <a-input
                v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
                placeholder="请选择参数"
                disabled
                class="data-view-preview-input browse-adjoined-input" />
              <a-button type="primary" class="data-view-assemble-btn" :disabled="isOutputIoType(item)" @click="showModuleInfo(item, index)">浏览</a-button>
            </div>
          </div>
          <a-select
            v-else-if="item.componentType === 'SELECT'"
            v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
            :options="getSelectOptions(item).map(v => ({ label: v, value: v }))"
            :disabled="isOutputIoType(item)"
            placeholder="请选择"
            class="preview-field" />
          <a-auto-complete
            v-else-if="item.componentType === 'AUTO_COMPLETE'"
            v-model:value="previewFieldValueMap[getPreviewItemKey(item, index)]"
            :options="getSelectOptions(item).map(v => ({ value: v }))"
            :disabled="isOutputIoType(item)"
            placeholder="请选择或输入"
            class="preview-field" />
          <div v-else-if="item.componentType === 'CALC_BUTTON'" class="calc-button-preview-wrap">
            <a-button type="primary" class="data-view-assemble-btn" :loading="calcSubmitting" :disabled="isOutputIoType(item)" @click="onCalcButtonPreviewClick">
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
  height: 100%;
  overflow: visible;
  padding: 12px 16px;
  box-sizing: border-box;
  --activity-preview-component-width: 270px;
  --activity-preview-wide-component-width: 650px;
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
  width: max-content;
  min-width: 100%;
}
.component-card.full-row-item {
  grid-column: 1 / -1;
}
.component-title {
  font-size: 13px;
  color: #444;
  margin-bottom: 8px;
}
.component-title-text--clickable {
  cursor: pointer;
}
.preview-field {
  width: var(--activity-preview-component-width);
  max-width: 100%;
}
.title-divider-line,
.divider-preview-line {
  height: 1px;
  background: #d9d9d9;
}
.data-view-preview-row,
.calc-button-preview-wrap {
  display: flex;
  gap: 8px;
}
.data-view-preview-input {
  width: var(--activity-preview-component-width);
}
.data-view-assemble-btn {
  min-width: 64px;
}
.activity-preview-empty {
  color: #999;
  padding: 40px 0;
  text-align: center;
}
</style>
